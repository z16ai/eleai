import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Exchange code result:', { data, error })
    if (!error) {
      const redirectTo = next.startsWith('/') ? `${origin}${next}` : `${origin}/${next}`
      return NextResponse.redirect(redirectTo)
    }
    console.error('Auth error:', error)
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}