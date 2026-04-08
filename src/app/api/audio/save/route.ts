import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const indexPath = path.join(process.cwd(), 'aigenerate', 'audio-index.json')

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(path.dirname(indexPath))) {
    fs.mkdirSync(path.dirname(indexPath), { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDirectories()

    const { audios } = await request.json()

    // Save the entire index
    await fs.promises.writeFile(
      indexPath,
      JSON.stringify(audios, null, 2),
      'utf-8'
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save audios:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
