'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AuthModal from './auth/AuthModal'
import UserMenu from './auth/UserMenu'
import Web3ConnectButton from './auth/Web3ConnectButton'
import { createClient } from '@/lib/supabase/client'

export default function TopNav() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    
    getUser()
    
    const { data: { subscription } } = createClient().auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <nav className="fixed top-0 z-50 w-full glass-nav bg-slate-50/80 dark:bg-slate-950/80 shadow-sm transition-all duration-200">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-full">
          <div className="flex items-center gap-8">
            <Link href="/">
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-slate-50 font-manrope">
                eleAI Studio
              </span>
            </Link>
            <div className="hidden md:flex gap-6">
              <a
                className="font-manrope tracking-tight font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                href="#product"
              >
                Product
              </a>
              <a
                className="font-manrope tracking-tight font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                href="#showcase"
              >
                Showcase
              </a>
              <Link
                href="/plaza"
                className="font-manrope tracking-tight font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Plaza
              </Link>
              <Link
                href="/roadmap"
                className="font-manrope tracking-tight font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Roadmap
              </Link>
              <a
                className="font-manrope tracking-tight font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                href="#pricing"
              >
                Pricing
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Web3ConnectButton />
            {loading ? (
              <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : user ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Login
              </button>
            )}
            <button className="px-6 py-2 bg-primary text-on-primary rounded-md font-semibold text-sm hover:scale-95 duration-200 ease-out shadow-lg shadow-primary/10">
              Start Now
            </button>
          </div>
        </div>
      </nav>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}
