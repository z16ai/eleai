'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthButton from './auth/AuthButton'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const workspaceItems = [
  { href: '/image', label: 'Image', icon: 'image' },
  { href: '/video', label: 'Video', icon: 'movie' },
  { href: '/audio', label: 'Audio', icon: 'graphic_eq' },
]

const navItems = [
  { href: '/plaza', label: 'Plaza', icon: 'storefront' },
]

export default function TopNav() {
  const pathname = usePathname() || ''
  const { user } = useAuth()
  const [points, setPoints] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const isActive = (href: string) => {
    return pathname.startsWith(href)
  }

  useEffect(() => {
    if (!user) {
      setPoints(null)
      return
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function fetchPoints() {
      const { data, error } = await supabase
        .from('user_points')
        .select('points, last_reset_date')
        .eq('user_id', user.id)
        .single()

      if (!error && data) {
        setPoints(data.points)

        // Check if today is a new day since last visit
        const today = new Date().toDateString()
        const lastReset = data.last_reset_date ? new Date(data.last_reset_date).toDateString() : ''

        // Check localStorage: only show toast once per day in browser
        const lastNotified = localStorage.getItem('eleai-daily-points-notified')
        const shouldNotify = lastNotified !== today && lastReset !== today

        if (shouldNotify) {
          // Daily reset done by cron job, just notify user
          setToastMessage('Daily 88 points credited')
          setTimeout(() => setToastMessage(null), 3000)
          localStorage.setItem('eleai-daily-points-notified', today)
          console.log('Daily 88 points credited to user')
        }
      } else {
        // No record found - insert default 88 points
        const { error: insertError } = await supabase
          .from('user_points')
          .insert([{ user_id: user.id, points: 88 }])

        if (!insertError) {
          setPoints(88)
          const today = new Date().toDateString()
          setToastMessage('Daily 88 points credited')
          setTimeout(() => setToastMessage(null), 3000)
          localStorage.setItem('eleai-daily-points-notified', today)
        } else {
          console.error('Failed to create user points record:', insertError)
          setPoints(0)
        }
      }
    }

    fetchPoints()
  }, [user])

  return (
    <nav className="fixed top-0 z-50 w-full h-14 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-200">
      <div className="h-full flex items-center justify-between w-full px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/eleai-logo-compressed.png" alt="eleAI" className="h-8 w-auto" />
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 font-manrope">
              eleAI Studio
            </span>
          </Link>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="flex items-center gap-1">
            {workspaceItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: isActive(item.href) ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: isActive(item.href) ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/roadmap" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Roadmap
          </Link>
          <Link href="/tokenomics" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Tokenomics
          </Link>
          <div className="h-5 w-px bg-slate-300 dark:bg-slate-600"></div>
          {/* Points display - before AuthButton */}
          {user && points !== null && (
            <>
              <div
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200/50 dark:border-amber-700/30 rounded-lg cursor-help"
                title="88 daily points. No roll-overs."
              >
                <img src="/images/points-icon.png" alt="Points" className="w-5 h-5" />
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                  {points} Pts
                </span>
              </div>
              <div className="h-5 w-px bg-slate-300 dark:bg-slate-600"></div>
            </>
          )}
          <AuthButton />
        </div>
      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-amber-50 border border-amber-200 text-amber-800 px-6 py-3 rounded-lg shadow-2xl z-[300] animate-in fade-in slide-in-from-top-4">
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </nav>
  )
}
