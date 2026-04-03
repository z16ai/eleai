'use client'

import Link from 'next/link'

export default function TopNav() {
  return (
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
            <a
              className="font-manrope tracking-tight font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              href="#pricing"
            >
              Pricing
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Login
          </button>
          <button className="px-6 py-2 bg-primary text-on-primary rounded-md font-semibold text-sm hover:scale-95 duration-200 ease-out shadow-lg shadow-primary/10">
            Start Now
          </button>
        </div>
      </div>
    </nav>
  )
}
