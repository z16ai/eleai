import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const userIdFromHeader = request.headers.get('x-user-id')
    
    if (!userIdFromHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const body = await request.json()
    const images = body.images || []

    if (!images || images.length === 0) {
      return NextResponse.json({ success: true })
    }

    const imageRecords = images.map((img: any) => ({
      id: img.id && img.id.startsWith('gen-') ? randomUUID() : img.id,
      user_id: userIdFromHeader,
      prompt: img.prompt,
      model_id: img.modelName,
      aspect_ratio: img.aspectRatio,
      quality: img.quality,
      image_url: img.src,
      created_at: new Date(img.createdAt || Date.now()).toISOString(),
    }))

    const { error } = await supabase
      .from('image_generations')
      .upsert(imageRecords, { onConflict: 'id' })

    if (error) {
      console.error('Failed to save images:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save images:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userIdFromHeader = request.headers.get('x-user-id')
    
    if (!userIdFromHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase
      .from('image_generations')
      .delete()
      .eq('user_id', userIdFromHeader)

    if (error) {
      console.error('Failed to delete images:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('Delete API - success')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete images:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
