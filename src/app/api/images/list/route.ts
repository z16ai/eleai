import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userIdFromHeader = request.headers.get('x-user-id')
    console.log('=== List API called ===')
    console.log('userId from header:', userIdFromHeader)
    console.log('userId length:', userIdFromHeader?.length)

    if (!userIdFromHeader) {
      return NextResponse.json({ success: true, images: [], reason: 'no user' })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Check what user_ids exist in DB
    const { data: sampleUsers } = await supabase
      .from('image_generations')
      .select('user_id')
      .limit(5)
    console.log('Sample user_ids in DB:', sampleUsers)
    
    // Debug: check all unique user_ids
    const { data: allUserIds } = await supabase
      .from('image_generations')
      .select('user_id')
    console.log('All unique user_ids:', [...new Set(allUserIds?.map(x => x.user_id))])
    
    const { data: images, error } = await supabase
      .from('image_generations')
      .select('*')
      .eq('user_id', userIdFromHeader)
      .order('created_at', { ascending: false })

    console.log('Query result:', { count: images?.length, error })

    if (error) {
      console.error('Error:', error)
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

    console.log('Returning images:', formattedImages.length)

    return NextResponse.json({ success: true, images: formattedImages })
  } catch (error) {
    console.error('Exception:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
