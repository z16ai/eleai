import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userIdFromHeader = request.headers.get('x-user-id')

    if (!userIdFromHeader) {
      return NextResponse.json({ success: true, images: [], reason: 'no user' })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Use text-based comparison to workaround UUID matching issues
    const { data: allImages, error } = await supabase
      .from('image_generations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000)

    if (error) {
      console.error('Error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Convert to string and compare to avoid UUID type mismatch
    const userImages = allImages?.filter(img => String(img.user_id) === String(userIdFromHeader)) || []

    const formattedImages = userImages.map((img) => ({
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
