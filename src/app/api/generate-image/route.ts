import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

// OpenRouter client for FLUX models
const openRouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Volcengine Doubao client for Seedream models
// Correct OpenAI-compatible endpoint for Volcengine Ark
const doubaoClient = process.env.VOLCENGINE_API_KEY
  ? new OpenAI({
      baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
      apiKey: process.env.VOLCENGINE_API_KEY,
    })
  : null

// Model mapping - model ID matches exactly what's required by Doubao
const doubaoModelMapping: Record<string, string> = {
  'doubao-seedream-4-0': 'doubao-seedream-4-0-250828',
  'doubao-seedream-4-5': 'doubao-seedream-4-5-251128',
  'doubao-seedream-5-0': 'doubao-seedream-5-0-260128',
}

// OpenRouter model mapping
const openRouterModelMapping: Record<string, string> = {
  'flux-2-klein': 'black-forest-labs/flux.2-klein-4b',
  'flux-2-max': 'black-forest-labs/flux.2-max',
  'flux-2-flex': 'black-forest-labs/flux.2-flex',
  'flux-2-pro': 'black-forest-labs/flux.2-pro',
}

// Ensure directory exists
const generateDir = path.join(process.cwd(), 'public', 'aigenerate')
if (!fs.existsSync(generateDir)) {
  fs.mkdirSync(generateDir, { recursive: true })
}

// Parse aspect ratio to size for Doubao
// Seedream 4.5+ requires minimum 3,686,400 pixels (~1920x1920)
function getDoubaoSize(aspectRatio: string, quality: string): string {
  const [w, h] = aspectRatio.split(':').map(Number)

  // Base resolution based on quality
  // 2K quality: max side 2048 (ensures total pixels >= 3.68MP)
  // 4K quality: max side 3072
  const maxSide = quality === '4K' ? 3072 : 2048;

  // Calculate dimensions maintaining aspect ratio
  let width: number, height: number;
  if (w > h) {
    width = maxSide;
    height = Math.round(maxSide * h / w);
  } else if (h > w) {
    height = maxSide;
    width = Math.round(maxSide * w / h);
  } else {
    // 1:1
    width = maxSide;
    height = maxSide;
  }

  // Ensure minimum total pixels (3686400)
  const totalPixels = width * height;
  if (totalPixels < 3686400) {
    // Scale up proportionally to meet requirement
    const scale = Math.sqrt(3686400 / totalPixels);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  return `${width}x${height}`;
}

// Process image response and save to local
async function processImageResponse(imageUrl: string, index: number) {
  if (imageUrl.startsWith('data:')) {
    const base64Data = imageUrl.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')
    const filename = `${Date.now()}-${index}.png`
    const filepath = path.join(generateDir, filename)
    await fs.promises.writeFile(filepath, buffer)
    return {
      filename,
      url: `/aigenerate/${filename}`,
    }
  } else {
    // Try to fetch remote image and save locally
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`)
      }
      const buffer = Buffer.from(await response.arrayBuffer())
      const filename = `${Date.now()}-${index}.png`
      const filepath = path.join(generateDir, filename)
      await fs.promises.writeFile(filepath, buffer)
      return {
        filename,
        url: `/aigenerate/${filename}`,
      }
    } catch (error) {
      console.error('Failed to download image:', error)
      // If fetch fails, return original URL
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
