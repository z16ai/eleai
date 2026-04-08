import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const indexPath = path.join(process.cwd(), 'aigenerate', 'audio-index.json')

export async function GET() {
  try {
    if (!fs.existsSync(indexPath)) {
      return NextResponse.json({ success: true, audios: [] })
    }

    const content = await fs.promises.readFile(indexPath, 'utf-8')
    const audios = JSON.parse(content)

    // Sort by created time descending
    audios.sort((a: any, b: any) => b.createdAt - a.createdAt)

    return NextResponse.json({ success: true, audios })
  } catch (error) {
    console.error('Failed to list audios:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
