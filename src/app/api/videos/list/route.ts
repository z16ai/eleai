import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const indexPath = path.join(process.cwd(), 'aigenerate', 'video-index.json')

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(path.dirname(indexPath))) {
    fs.mkdirSync(path.dirname(indexPath), { recursive: true })
  }
}

export async function GET(request: NextRequest) {
  try {
    ensureDirectories()

    if (!fs.existsSync(indexPath)) {
      return NextResponse.json({ success: true, videos: [] })
    }

    const content = await fs.promises.readFile(indexPath, 'utf-8')
    const videos = JSON.parse(content)

    return NextResponse.json({ success: true, videos })
  } catch (error) {
    console.error('Failed to list videos:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
