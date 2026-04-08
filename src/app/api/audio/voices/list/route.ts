import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const indexPath = path.join(process.cwd(), 'aigenerate', 'custom-voices.json')

export async function GET() {
  try {
    if (!fs.existsSync(indexPath)) {
      return NextResponse.json({ success: true, voices: [] })
    }

    const content = await fs.promises.readFile(indexPath, 'utf-8')
    const voices = JSON.parse(content)

    return NextResponse.json({ success: true, voices })
  } catch (error) {
    console.error('Failed to list custom voices:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
