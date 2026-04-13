import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userIdFromHeader = request.headers.get('x-user-id')
    console.log('List API - userId from header:', userIdFromHeader)

    if (!userIdFromHeader) {
      return NextResponse.json({ success: true, images: [], reason: 'no user' })
    }

    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('List API - querying database for user_id:', userIdFromHeader)

    const { data: images, error } = await supabase
      .from('image_generations')
      .select('*')
      .eq('user_id', userIdFromHeader)
      .order('created_at', { ascending: false })

    console.log('List API - found images:', images?.length || 0)

    if (error) {
      console.error('Failed to list images:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    const formattedImages = images.map((img) => ({
      id: img.id,
      prompt: img.prompt,
      aspectRatio: img.aspect_ratio,
      quality: img.quality,
      modelName: img.model_id,
      src: img.image_url,
      alt: img.prompt,
      createdAt: new Date(img.created_at).getTime(),
    }))

    return NextResponse.json({ success: true, images: formattedImages })
  } catch (error) {
    console.error('Failed to list images:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
