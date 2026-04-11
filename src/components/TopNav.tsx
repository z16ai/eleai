'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthButton from './auth/AuthButton'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const workspaceItems = [
  { href: '/image', label: 'Image', icon: 'image' },
  { href: '/video', label: 'Video', icon: 'movie' },
  { href: '/audio', label: 'Audio', icon: 'graphic_eq' },
]

const navItems = [
  { href: '/plaza', label: 'Plaza', icon: 'storefront' },
]

const tokenItems = [
  { href: '/roadmap', label: 'Roadmap', icon: 'map' },
]

export default function TopNav() {
  const pathname = usePathname() || ''
  const { user } = useAuth()
  const [points, setPoints] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createClient()

  const isActive = (href: string) => {
    return pathname.startsWith(href)
  }

  useEffect(() => {
    if (!user) {
      setPoints(null)
      return
    }

    async function fetchPoints() {
      if (!user) return
      
      const { data, error } = await supabase
        .from('user_points')
        .select('points, last_reset_date')
        .eq('user_id', user.id)
        .single()

      if (!error && data) {
        setPoints(data.points)

        const today = new Date().toDateString()
        const lastReset = data.last_reset_date ? new Date(data.last_reset_date).toDateString() : ''

        const lastNotified = localStorage.getItem('eleai-daily-points-notified')
        const shouldNotify = lastNotified !== today && lastReset !== today

        if (shouldNotify) {
          setToastMessage('Daily 88 points credited')
          setTimeout(() => setToastMessage(null), 3000)
          localStorage.setItem('eleai-daily-points-notified', today)
        }
      } else {
        const { error: insertError } = await supabase
          .from('user_points')
          .insert([{ user_id: user.id, points: 88 }])

        if (!insertError) {
          setPoints(88)
          const today = new Date().toDateString()
          setToastMessage('Daily 88 points credited')
          setTimeout(() => setToastMessage(null), 3000)
          localStorage.setItem('eleai-daily-points-notified', today)
        }
      }
    }

    fetchPoints()
  }, [user])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const renderNavItem = (item: { href: string; label: string; icon: string }, isMobile = false) => (
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
      <span className={isMobile ? '' : 'hidden md:inline'}>{item.label}</span>
    </Link>
  )

  return (
    <nav className="fixed top-0 z-50 w-full h-14 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-200">
      <div className="h-full flex items-center justify-between w-full px-4 lg:px-6">
        {/* Left section - Logo */}
        <div className="flex items-center gap-2 lg:gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/eleai-logo-compressed.png" alt="eleAI" className="h-7 w-auto lg:h-8" />
            <span className="text-base lg:text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 font-manrope hidden sm:inline">
              eleAI Studio
            </span>
          </Link>

          {/* Workspace - always visible */}
          <div className="flex items-center gap-1">
            {workspaceItems.map((item) => renderNavItem(item))}
          </div>

          {/* Desktop only: other nav items */}
          <div className="hidden lg:flex items-center gap-1">
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            {navItems.map((item) => renderNavItem(item))}
          </div>

          <div className="hidden lg:block h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="hidden lg:flex items-center gap-1">
            {tokenItems.map((item) => renderNavItem(item))}
          </div>
        </div>

        {/* Right section - Points & Auth */}
        <div className="flex items-center gap-2 lg:gap-4">
          {user && points !== null && (
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200/50 dark:border-amber-700/30 rounded-lg cursor-default relative group"
            >
              <img src="/images/points-icon.png" alt="Points" className="w-5 h-5" />
              <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                {points} Pts
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs rounded-lg shadow-lg border border-outline-variant/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                88 daily points. No roll-overs.
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-2 h-2 bg-surface-container-highest rotate-45"></div>
              </div>
            </div>
          )}

          {/* Desktop AuthButton */}
          <div className="hidden lg:block">
            <AuthButton />
          </div>

          {/* Mobile/Tablet menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet menu dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex flex-col p-4 gap-2">
            {/* Plaza */}
            {navItems.map((item) => renderNavItem(item, true))}

            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>

            {/* Token section */}
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-1">
              Token
            </div>
            {tokenItems.map((item) => renderNavItem(item, true))}

            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>

            {/* Mobile auth */}
            <div className="pt-2">
              <AuthButton />
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-amber-50 border border-amber-200 text-amber-800 px-6 py-3 rounded-lg shadow-2xl z-[300] animate-in fade-in slide-in-from-top-4">
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </nav>
  )
}
