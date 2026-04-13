'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthDebugContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  return (
    <div className="p-8">
      <h1>Auth Callback Debug</h1>
      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify({
          code: code ? 'present' : 'none',
          error,
          errorDescription,
          fullUrl: typeof window !== 'undefined' ? window.location.href : 'server'
        }, null, 2)}
      </pre>
    </div>
  )
}

export default function AuthDebugPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <AuthDebugContent />
    </Suspense>
  )
}