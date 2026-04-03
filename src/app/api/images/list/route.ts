import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Index file path in project root aigenerate folder
const indexPath = path.join(process.cwd(), 'aigenerate', 'index.json')
const generateDir = path.join(process.cwd(), 'public', 'aigenerate')

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(path.dirname(indexPath))) {
    fs.mkdirSync(path.dirname(indexPath), { recursive: true })
  }
  if (!fs.existsSync(generateDir)) {
    fs.mkdirSync(generateDir, { recursive: true })
  }
}

export interface GeneratedImageRecord {
  id: string
  prompt: string
  aspectRatio: string
  quality: string
  modelName: string
  filename: string
  url: string
  alt: string
  createdAt: number
}

export async function GET(request: NextRequest) {
  try {
    ensureDirectories()

    if (!fs.existsSync(indexPath)) {
      // Return empty array if index doesn't exist
      return NextResponse.json({ success: true, images: [] })
    }

    const content = await fs.promises.readFile(indexPath, 'utf-8')
    const images: GeneratedImageRecord[] = JSON.parse(content)

    return NextResponse.json({ success: true, images })
  } catch (error) {
    console.error('Failed to list images:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
