import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Ensure directory exists
const generateDir = path.join(process.cwd(), 'public', 'aigenerate')
if (!fs.existsSync(generateDir)) {
  fs.mkdirSync(generateDir, { recursive: true })
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, modelId, aspectRatio, quality, referenceImage } = await request.json()

    // Map model ID to full model name
    const modelMapping: Record<string, string> = {
      'flux-2-klein': 'black-forest-labs/flux.2-klein-4b',
      'flux-2-max': 'black-forest-labs/flux.2-max',
      'flux-2-flex': 'black-forest-labs/flux.2-flex',
      'flux-2-pro': 'black-forest-labs/flux.2-pro',
    }

    const model = modelMapping[modelId] || 'black-forest-labs/flux.2-klein-4b'

    // Build messages content
    let content: any = prompt
    if (referenceImage) {
      content = [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: referenceImage } },
      ]
    }

    const apiResponse = await client.chat.completions.create({
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
          // Extract base64 data from data URL
          const imageUrl = img.image_url.url
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
            // It's already a URL
            return {
              filename: null,
              url: imageUrl,
            }
          }
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
