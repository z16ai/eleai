import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { GeneratedImageRecord } from '../list/route'

const indexPath = path.join(process.cwd(), 'aigenerate', 'index.json')

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(path.dirname(indexPath))) {
    fs.mkdirSync(path.dirname(indexPath), { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDirectories()

    const { images } = await request.json()

    // Save the entire index
    await fs.promises.writeFile(
      indexPath,
      JSON.stringify(images, null, 2),
      'utf-8'
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save index:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensureDirectories()

    // Clear the index
    await fs.promises.writeFile(indexPath, '[]', 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to clear index:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
