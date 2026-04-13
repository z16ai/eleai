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

    // Use RPC to query images for specific user
    const { data: images, error } = await supabase.rpc('get_user_images', { 
      p_user_id: userIdFromHeader 
    })

    if (error) {
      // Fallback: query all and filter in code
      console.log('RPC failed, using fallback:', error)
      
      const { data: allImages, error: selectError } = await supabase
        .from('image_generations')
        .select('*')
        .order('created_at', { ascending: false })

      if (selectError) {
        console.error('Select error:', selectError)
        return NextResponse.json({ success: false, error: selectError.message }, { status: 500 })
      }

      const userImages = (allImages || []).filter(img => String(img.user_id) === String(userIdFromHeader))
      
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
    }

    const formattedImages = (images || []).map((img: any) => ({
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
