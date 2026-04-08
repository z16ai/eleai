import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Ensure directory exists
function ensureDirectory() {
  const dir = path.join(process.cwd(), 'public', 'videogen')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

ensureDirectory()

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      modelId,
      aspectRatio,
      duration,
      resolution,
      firstFrame,
      lastFrame,
    } = await request.json()

    // Alibaba WanXiang text-to-video
    if (modelId === 'wanx-text-to-video') {
      if (!process.env.ALIBABA_DASHSCOPE_API_KEY) {
        return NextResponse.json(
          { success: false, error: 'Alibaba DashScope API key not configured' },
          { status: 500 }
        )
      }

      // Convert aspect ratio to width/height for WanXiang
      const [w, h] = aspectRatio.split(':').map(Number)

      const body = {
        model: 'wanx-text-to-video',
        input: {
          prompt,
          ...(firstFrame && { first_frame_image: firstFrame }),
          ...(lastFrame && { last_frame_image: lastFrame }),
        },
        parameters: {
          size: `${w}x${h}`,
          duration: duration,
        },
      }

      const response = await fetch(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/text-to-video',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ALIBABA_DASHSCOPE_API_KEY}`,
          },
          body: JSON.stringify(body),
        }
      )

      const data = await response.json()

      if (response.ok && data.output?.task_id) {
        return NextResponse.json({
          success: true,
          taskId: data.output.task_id,
          provider: 'alibaba',
        })
      }

      console.error('WanXiang creation failed:', data)
      return NextResponse.json(
        {
          success: false,
          error: data.message || data.error || 'Failed to create generation task',
        },
        { status: response.status }
      )
    }

    // Volcengine Doubao Seedance (default)
    if (!process.env.VOLCENGINE_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Volcengine API key not configured' },
        { status: 500 }
      )
    }

    // Build content array matching the official example
    const content: any[] = [
      {
        type: 'text',
        text: prompt,
      },
    ]

    if (firstFrame) {
      content.push({
        type: 'image_url',
        image_url: { url: firstFrame },
        role: 'reference_image',
      })
    }

    if (lastFrame) {
      content.push({
        type: 'image_url',
        image_url: { url: lastFrame },
        role: 'reference_image',
      })
    }

    // Use the correct endpoint path from official example
    const response = await fetch(
      'https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VOLCENGINE_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelId,
          content,
          generate_audio: true,
          ratio: aspectRatio,
          duration,
          watermark: false,
        }),
      }
    )

    const data = await response.json()

    if (response.ok && data.id) {
      return NextResponse.json({
        success: true,
        taskId: data.id,
        provider: 'volcengine',
      })
    }

    console.error('Seedance creation failed:', data)
    return NextResponse.json(
      {
        success: false,
        error: data.message || data.error || 'Failed to create generation task',
      },
      { status: response.status }
    )
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
