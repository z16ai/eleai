import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { imageId, userId } = await request.json()
    console.log('Delete request for imageId:', imageId, 'userId:', userId)
    
    const supabase = await createClient()
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Auth user:', user?.id, 'authError:', authError)
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Delete the image (only if it belongs to the user)
    const { error, count } = await supabase
      .from('image_generations')
      .delete()
      .eq('id', imageId)
      .eq('user_id', user.id)
    
    console.log('Delete result:', { error, count })
    
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