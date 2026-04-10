import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    
    const { imageId } = await request.json()
    
    // Delete the image (only if it belongs to the user)
    const { error, count } = await supabase
      .from('image_generations')
      .delete()
      .eq('id', imageId)
      .eq('user_id', userIdFromHeader)
    
    if (error) {
      console.error('Failed to delete image:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, deleted: count })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}