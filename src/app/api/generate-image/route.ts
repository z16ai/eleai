import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import { uploadToR2, getPublicUrl } from '@/lib/r2/client'

const openRouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

const doubaoClient = process.env.VOLCENGINE_API_KEY
  ? new OpenAI({
      baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
      apiKey: process.env.VOLCENGINE_API_KEY,
    })
  : null

const doubaoModelMapping: Record<string, string> = {
  'doubao-seedream-4-0': 'doubao-seedream-4-0-250828',
  'doubao-seedream-4-5': 'doubao-seedream-4-5-251128',
  'doubao-seedream-5-0': 'doubao-seedream-5-0-260128',
}

const openRouterModelMapping: Record<string, string> = {
  'flux-2-klein': 'black-forest-labs/flux.2-klein-4b',
  'flux-2-max': 'black-forest-labs/flux.2-max',
  'flux-2-flex': 'black-forest-labs/flux.2-flex',
  'flux-2-pro': 'black-forest-labs/flux.2-pro',
}

function getDoubaoSize(aspectRatio: string, quality: string): string {
  const [w, h] = aspectRatio.split(':').map(Number)

  const maxSide = quality === '4K' ? 3072 : 2048;

  let width: number, height: number;
  if (w > h) {
    width = maxSide;
    height = Math.round(maxSide * h / w);
  } else if (h > w) {
    height = maxSide;
    width = Math.round(maxSide * w / h);
  } else {
    width = maxSide;
    height = maxSide;
  }

  const totalPixels = width * height;
  if (totalPixels < 3686400) {
    const scale = Math.sqrt(3686400 / totalPixels);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  return `${width}x${height}`;
}

async function processImageResponse(imageUrl: string, index: number) {
  if (imageUrl.startsWith('data:')) {
    const base64Data = imageUrl.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')
    const filename = `${Date.now()}-${index}.png`
    const result = await uploadToR2(buffer, filename, 'image/png', 'aigenerate')
    return {
      filename: result.key,
      url: result.url,
    }
  } else {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`)
      }
      const buffer = Buffer.from(await response.arrayBuffer())
      const filename = `${Date.now()}-${index}.png`
      const result = await uploadToR2(buffer, filename, 'image/png', 'aigenerate')
      return {
        filename: result.key,
        url: result.url,
      }
    } catch (error) {
      console.error('Failed to download image:', error)
      return {
        filename: null,
        url: imageUrl,
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, modelId, aspectRatio, quality, referenceImage } = await request.json()

    // Get user from Supabase - get token from Authorization header
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Get access token from Authorization header
    const authHeader = request.headers.get('Authorization')
    let token: string | null = null
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token || '')
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check and deduct points - 10 points per generation
    const { data: userPoints, error: pointsError } = await supabase
      .from('user_points')
      .select('points')
      .eq('user_id', user.id)
      .single()

    let currentPoints = 0
    if (pointsError || !userPoints) {
      // No points record found - create default 88 points
      const { error: insertError } = await supabase
        .from('user_points')
        .insert([{ user_id: user.id, points: 88 }])
      if (insertError) {
        return NextResponse.json(
          { success: false, error: 'Failed to create points record: ' + insertError.message },
          { status: 500 }
        )
      }
      currentPoints = 88
    } else {
      currentPoints = userPoints.points
    }

    if (currentPoints < 10) {
      return NextResponse.json(
        { success: false, error: 'Insufficient points. Need 10 points to generate. Come back tomorrow for a reset.' },
        { status: 400 }
      )
    }

    // Deduct 10 points
    await supabase
      .from('user_points')
      .update({ points: currentPoints - 10, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)

    // Check if this is a Doubao model
    const isDoubaoModel = modelId.startsWith('doubao-')

    if (isDoubaoModel) {
      if (!doubaoClient) {
        return NextResponse.json(
          { success: false, error: 'Volcengine API key not configured' },
          { status: 500 }
        )
      }

      const model = doubaoModelMapping[modelId] || modelId
      const size = getDoubaoSize(aspectRatio, quality)

      console.log(`Generating with aspect ratio ${aspectRatio}, quality ${quality}, size ${size}`)

      let response
      if (!referenceImage) {
        // Text to image - watermark at top level
        response = await doubaoClient.images.generate({
          model,
          prompt,
          size,
          response_format: 'url',
          watermark: false,
        } as any)
      } else {
        // Image to image - reference image in extra_body
        response = await doubaoClient.images.generate({
          model,
          prompt,
          size,
          response_format: 'url',
          watermark: false,
          extra_body: {
            image: referenceImage,
          },
        } as any)
      }

      console.log('Doubao response:', JSON.stringify(response, null, 2))

      if (response.data && response.data.length > 0) {
        const generatedImages = await Promise.all(
          response.data.map(async (img: any, index: number) => {
            return processImageResponse(img.url, index)
          })
        )

        return NextResponse.json({
          success: true,
          images: generatedImages.map(img => ({ url: img.url })),
        })
      }

      return NextResponse.json(
        { success: false, error: 'No image generated by Doubao' },
        { status: 400 }
      )
    }

    // OpenRouter FLUX generation (original code)
    const model = openRouterModelMapping[modelId] || modelId

    // OpenRouter FLUX generation (original code)
    // Build messages content
    let content: any = prompt
    if (referenceImage) {
      content = [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: referenceImage } },
      ]
    }

    const apiResponse = await openRouterClient.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content,
        },
      ],
      modalities: ['image'],
    } as any)

    const response = apiResponse.choices[0].message as any

    if (response.images && response.images.length > 0) {
      const generatedImages = await Promise.all(
        response.images.map(async (img: any, index: number) => {
          return processImageResponse(img.image_url.url, index)
        })
      )

      return NextResponse.json({
        success: true,
        images: generatedImages.map(img => ({ url: img.url })),
      })
    }

    return NextResponse.json(
      { success: false, error: 'No image generated' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
