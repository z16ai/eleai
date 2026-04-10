'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function AuthDebug() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current user:', user)
      setUser(user)
    }
    getUser()
  }, [])

  if (!user) return <div className="text-sm text-slate-500">Not logged in</div>

  return (
    <div className="text-xs text-slate-600 space-y-1">
      <div>ID: {user.id}</div>
      <div>Email: {user.email || 'N/A'}</div>
      <div>Last Sign In: {user.last_sign_in_at || 'N/A'}</div>
      <div>Created: {user.created_at}</div>
      <div className="mt-2 font-semibold">Identities:</div>
      {user.identities?.map((id: any, i: number) => (
        <div key={i} className="pl-2">
          Provider: {id.provider}<br/>
          Identity ID: {id.identity_id}<br/>
          Wallet: {id.identity_data?.wallet_address || 'N/A'}
        </div>
      ))}
    </div>
  )
}