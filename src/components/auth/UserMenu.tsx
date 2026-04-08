'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
    name?: string
  }
}

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user as User | null)
      setLoading(false)
    }
    
    getUser()
    
    const { data: { subscription } } = createClient().auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as User | null)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setShowMenu(false)
  }

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container transition-colors"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-surface-container-low rounded-xl shadow-xl border border-outline-variant/20 py-2 z-50">
            <div className="px-4 py-3 border-b border-outline-variant/20">
              <p className="font-semibold text-on-surface truncate">{displayName}</p>
              <p className="text-sm text-on-surface-variant truncate">{user.email}</p>
            </div>
            <div className="py-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
