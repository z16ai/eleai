import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Ensure directory exists
function ensureDirectory() {
  const dir = path.join(process.cwd(), 'public', 'audioclone')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const indexDir = path.join(process.cwd(), 'aigenerate')
  if (!fs.existsSync(indexDir)) {
    fs.mkdirSync(indexDir, { recursive: true })
  }
}

ensureDirectory()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const modelId = formData.get('modelId') as string

    if (!process.env.VOLCENGINE_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Volcengine API key not configured' },
        { status: 500 }
      )
    }

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'Audio file is required' },
        { status: 400 }
      )
    }

    if (!audioFile.type.includes('mpeg') && !audioFile.type.includes('mp3')) {
      return NextResponse.json(
        { success: false, error: 'Only MP3 format is supported' },
        { status: 400 }
      )
    }

    // Save the uploaded sample file locally
    const filename = `sample-${Date.now()}.mp3`
    const filePath = path.join(process.cwd(), 'public', 'audioclone', filename)
    const fileBuffer = Buffer.from(await audioFile.arrayBuffer())
    await fs.promises.writeFile(filePath, fileBuffer)

    const sampleUrl = `/audioclone/${filename}`

    // For seed-icl models, we need to get the speaker ID from the API
    const fileBytes = fileBuffer.toString('base64')

    const response = await fetch(
      'https://ark.cn-beijing.volces.com/api/v3/audio/clone',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.VOLCENGINE_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelId,
          app: {
            appid: process.env.VOLCENGINE_APP_ID || 'BigTTS2000000688695749538',
          },
          audio: fileBytes,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok || !data.speaker_id) {
      console.error('Voice cloning failed:', data)
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to clone voice' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      speakerId: data.speaker_id,
      sampleUrl,
    })
  } catch (error) {
    console.error('Voice cloning error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}