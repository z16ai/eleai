import { NextRequest, NextResponse } from 'next/server'
import { uploadToR2, getPublicUrl } from '@/lib/r2/client'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'images'
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = file.name || `file-${Date.now()}`
    
    const result = await uploadToR2(
      buffer,
      fileName,
      file.type || 'application/octet-stream',
      folder
    )
    
    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  
  if (!key) {
    return NextResponse.json(
      { success: false, error: 'No key provided' },
      { status: 400 }
    )
  }
  
  try {
    const url = getPublicUrl(key)
    return NextResponse.json({ success: true, url })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
