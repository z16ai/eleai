'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthButton from './auth/AuthButton'

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

  const isActive = (href: string) => {
    return pathname.startsWith(href)
  }

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
          <AuthButton />
        </div>
      </div>
    </nav>
  )
}
