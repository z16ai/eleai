import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userIdFromHeader = request.headers.get('x-user-id')
    console.log('List API - userId from header:', userIdFromHeader)
    console.log('List API - full URL:', request.url)

    if (!userIdFromHeader) {
      console.log('List API - no user id in header')
      return NextResponse.json({ success: true, images: [], reason: 'no user' })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    console.log('List API - querying database for user_id:', userIdFromHeader)

    // First check what user IDs exist in the database
    const { data: allUsers, error: debugError } = await supabase
      .from('image_generations')
      .select('user_id')
      .limit(10)
    
    console.log('List API - sample user_ids in DB:', allUsers?.map(x => x.user_id))

    // Check specifically for this user
    const { data: debugImages, error: debugError2 } = await supabase
      .from('image_generations')
      .select('id, user_id, created_at')
      .eq('user_id', userIdFromHeader)
    
    console.log('List API - debug query result:', { count: debugImages?.length, records: debugImages, error: debugError2 })

    const { data: images, error } = await supabase
      .from('image_generations')
      .select('*')
      .eq('user_id', userIdFromHeader)
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

    console.log('List API - formatted images:', formattedImages.length)

    return NextResponse.json({ success: true, images: formattedImages })
  } catch (error) {
    console.error('Failed to list images:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
