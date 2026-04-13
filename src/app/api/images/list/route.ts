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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get all images
    const { data: allImages, error } = await supabase
      .from('image_generations')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('List API - total images fetched:', allImages?.length)

    if (error) {
      console.error('Select error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Log all user_ids
    console.log('List API - all user_ids:', allImages?.map(i => i.user_id))

    // Filter by user_id as strings
    const userImages = (allImages || []).filter(img => String(img.user_id) === String(userIdFromHeader))
    console.log('List API - filtered images:', userImages.length)
    
    const formattedImages = userImages.map((img: any) => ({
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
    console.error('Exception:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
