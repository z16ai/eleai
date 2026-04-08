import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const indexPath = path.join(process.cwd(), 'aigenerate', 'custom-voices.json')

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(path.dirname(indexPath))) {
    fs.mkdirSync(path.dirname(indexPath), { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDirectories()

    const { voices } = await request.json()

    // Save the entire index
    await fs.promises.writeFile(
      indexPath,
      JSON.stringify(voices, null, 2),
      'utf-8'
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save custom voices:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
