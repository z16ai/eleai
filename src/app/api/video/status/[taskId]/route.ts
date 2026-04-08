import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId
    const url = new URL(request.url)
    const provider = url.searchParams.get('provider') || 'volcengine'

    // Alibaba WanXiang
    if (provider === 'alibaba') {
      if (!process.env.ALIBABA_DASHSCOPE_API_KEY) {
        return NextResponse.json(
          { success: false, error: 'Alibaba DashScope API key not configured' },
          { status: 500 }
        )
      }

      const response = await fetch(
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.ALIBABA_DASHSCOPE_API_KEY}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: data.message || 'Failed to get task status' },
          { status: response.status }
        )
      }

      if (data.output?.status === 'SUCCEEDED') {
        // Task completed
        return NextResponse.json({
          success: true,
          status: 'succeeded',
          videoUrl: data.output.video_url,
        })
      } else if (data.output?.status === 'FAILED') {
        return NextResponse.json({
          success: true,
          status: 'failed',
          error: data.output.message || 'Generation failed',
        })
      } else {
        // Still processing: PENDING, RUNNING
        return NextResponse.json({
          success: true,
          status: 'processing',
        })
      }
    }

    // Volcengine Doubao Seedance (default)
    if (!process.env.VOLCENGINE_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Volcengine API key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/${taskId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.VOLCENGINE_API_KEY}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to get task status' },
        { status: response.status }
      )
    }

    if (data.status === 'succeeded') {
      // Task completed, return the video URL
      return NextResponse.json({
        success: true,
        status: 'succeeded',
        videoUrl: data.content[0].video_url,
      })
    } else if (data.status === 'failed') {
      return NextResponse.json({
        success: true,
        status: 'failed',
        error: data.error?.message || 'Generation failed',
      })
    } else {
      // Still processing
      return NextResponse.json({
        success: true,
        status: data.status,
      })
    }
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
