import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Ensure directory exists
function ensureDirectory() {
  const dir = path.join(process.cwd(), 'public', 'audiogen')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

ensureDirectory()

export async function POST(request: NextRequest) {
  try {
    const { text, modelId, voiceId } = await request.json()

    const appId = process.env.VOLCENGINE_APP_ID || 'BigTTS2000000688695749538'
    const accessKey = process.env.VOLCENGINE_API_KEY

    if (!accessKey) {
      return NextResponse.json(
        { success: false, error: 'Volcengine API key not configured' },
        { status: 500 }
      )
    }

    if (!text || !voiceId) {
      return NextResponse.json(
        { success: false, error: 'Text and voice ID are required' },
        { status: 400 }
      )
    }

    // ByteDance TTS v3 HTTP SSE format
    const url = 'https://openspeech.bytedance.com/api/v3/tts/unidirectional/sse'

    const payload = {
      user: {
        uid: 'eleai-studio',
      },
      req_params: {
        model: modelId,
        text,
        speaker: voiceId,
        audio_params: {
          format: 'mp3',
          sample_rate: 24000,
        },
        additions: '{"explicit_language":"zh","disable_markdown_filter":true}'
      },
    }

    const headers = {
      'X-Api-App-Id': appId,
      'X-Api-Access-Key': accessKey,
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMsg = 'Failed to generate audio'
      try {
        const error = await response.json()
        errorMsg = JSON.stringify(error)
        console.error('TTS generation failed:', error)
      } catch (e) {
        console.error('TTS generation failed with non-JSON error, status:', response.status)
        errorMsg = `HTTP ${response.status}: ${response.statusText}`
      }
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: response.status }
      )
    }

    // Check if content type is JSON instead of SSE - this means we got an immediate error
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      try {
        const errorData = await response.json()
        console.error('TTS API returned JSON error (not SSE):', errorData)
        return NextResponse.json(
          { success: false, error: `API error: ${JSON.stringify(errorData)}` },
          { status: 400 }
        )
      } catch (e) {
        return NextResponse.json(
          { success: false, error: `API error: non-SSE response with content-type ${contentType}` },
          { status: 500 }
        )
      }
    }

    // Read SSE stream and collect audio
    const reader = response.body?.getReader()
    if (!reader) {
      return NextResponse.json(
        { success: false, error: 'No response body' },
        { status: 500 }
      )
    }

    let audioBuffer = Buffer.from([])
    let done = false
    let event = { event: '', data: '' }
    let lastError: string | null = null

    while (!done) {
      const { done: readerDone, value } = await reader.read()
      done = readerDone
      if (value) {
        // Split by lines
        const rawText = Buffer.from(value).toString()
        const lines = rawText.split('\n')
        console.log(`Received ${lines.length} lines from SSE`)
        for (const line of lines) {
          const trimmed = line.trim()
          console.log('SSE line:', JSON.stringify(trimmed))
          // Empty line = end of one SSE event
          if (trimmed === '') {
            if (event.data) {
              event.data = event.data.trimEnd()
              try {
                const data = JSON.parse(event.data)
                console.log('Parsed SSE event:', { code: data.code, hasData: !!data.data })
                if (data.code === 0 && data.data) {
                  // Audio chunk in base64
                  const chunkBuffer = Buffer.from(data.data, 'base64')
                  audioBuffer = Buffer.concat([audioBuffer, chunkBuffer])
                  console.log(`Added chunk: ${chunkBuffer.length} bytes, total: ${audioBuffer.length}`)
                } else if (data.code === 20000000) {
                  // End of stream
                  console.log('Received end of stream code 20000000')
                  done = true
                  break
                } else if (data.code > 0) {
                  console.error('TTS API error:', data)
                  lastError = data.message || `Error code ${data.code}: ${JSON.stringify(data)}`
                  done = true
                  break
                } else {
                  console.log('TTS unknown code:', data.code, data)
                }
              } catch (e) {
                console.warn('SSE parsing warning:', e, 'Event data:', event.data)
              }
              // Reset event
              event = { event: '', data: '' }
            }
            continue
          }

          // Comment line
          if (trimmed.startsWith(':')) {
            continue
          }

          if (trimmed.includes(':')) {
            const [field, value] = trimmed.split(':', 2)
            const val = value.trim()
            if (field === 'data') {
              event.data += val + '\n'
            } else if (field === 'event') {
              event.event = val
            }
          }
        }
      }
    }

    // Process any remaining event that might not have been terminated by a blank line
    if (event.data && !lastError) {
      try {
        const data = JSON.parse(event.data)
        if (data.code === 0 && data.data) {
          const chunkBuffer = Buffer.from(data.data, 'base64')
          audioBuffer = Buffer.concat([audioBuffer, chunkBuffer])
        } else if (data.code === 20000000) {
          // End of stream
          done = true
        } else if (data.code > 0) {
          console.error('TTS API error (final):', data)
          lastError = data.message || `Error code ${data.code}: ${JSON.stringify(data)}`
        }
      } catch (e) {
        console.warn('SSE parsing warning on final event:', e)
      }
    }

    console.log(`TTS: finished stream, total audioBuffer length: ${audioBuffer.length} bytes`)

    if (lastError) {
      return NextResponse.json(
        { success: false, error: `API error: ${lastError}` },
        { status: 500 }
      )
    }

    if (audioBuffer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No audio data received from API' },
        { status: 500 }
      )
    }

    // Save audio file
    const filename = `audio-${Date.now()}.mp3`
    const filePath = path.join(process.cwd(), 'public', 'audiogen', filename)
    await fs.promises.writeFile(filePath, audioBuffer)

    const audioUrl = `/audiogen/${filename}`

    // Approx duration: mp3 ~ 16KB/s = 128kbps
    const duration = audioBuffer.length / 16 / 1024

    return NextResponse.json({
      success: true,
      audioUrl,
      duration,
    })
  } catch (error) {
    console.error('TTS generation error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
