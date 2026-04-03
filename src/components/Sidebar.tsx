'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/image') return pathname === '/image' || pathname.startsWith('/image')
    if (path === '/video') return pathname === '/video' || pathname.startsWith('/video')
    if (path === '/audio') return pathname === '/audio' || pathname.startsWith('/audio')
    return false
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-8 gap-8 bg-slate-50 dark:bg-slate-950 font-manrope text-sm font-medium z-50">
      <div className="flex flex-col items-center gap-1">
        <Link href="/">
          <span className="text-primary font-black text-2xl tracking-tighter">e.</span>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col items-center gap-6 mt-4">
        <Link
          href="/image"
          className={`${
            isActive('/image')
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'
          } rounded-xl p-3 translate-x-1 duration-300 group`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: isActive('/image') ? "'FILL' 1" : "'FILL' 0" }}
          >
            image
          </span>
        </Link>
        <Link
          href="/video"
          className={`${
            isActive('/video')
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'
          } rounded-xl p-3 translate-x-1 duration-300 group`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: isActive('/video') ? "'FILL' 1" : "'FILL' 0" }}
          >
            movie
          </span>
        </Link>
        <Link
          href="/audio"
          className={`${
            isActive('/audio')
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'
          } rounded-xl p-3 translate-x-1 duration-300 group`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: isActive('/audio') ? "'FILL' 1" : "'FILL' 0" }}
          >
            graphic_eq
          </span>
        </Link>
      </nav>

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center text-[10px] font-bold text-blue-600/60 leading-none mb-2">
          <span>942</span>
          <span className="text-[8px] uppercase tracking-widest mt-1">Credits</span>
        </div>
        <button className="text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300 transition-all p-3">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container">
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src="/images/24bc4855.jpg"
          />
        </div>
      </div>
    </aside>
  )
}
