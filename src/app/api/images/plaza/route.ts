import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function createAnonClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAnonClient()
    
    // Get all users' public images (for Plaza)
    const { data: images, error } = await supabase
      .from('image_generations')
      .select('*')
      .eq('public', true)
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) {
      console.error('Failed to fetch images:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    
    // Get user info for each image
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('id, email')
    
    const profileMap = new Map(profiles?.map(p => [p.id, p.email]) || [])
    
    const formattedImages = images.map((img: any) => ({
      id: img.id,
      prompt: img.prompt,
      aspectRatio: img.aspect_ratio,
      quality: img.quality,
      modelName: img.model_id,
      src: img.image_url,
      alt: img.prompt,
      createdAt: new Date(img.created_at).getTime(),
      userEmail: profileMap.get(img.user_id) || 'Anonymous',
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