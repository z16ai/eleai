'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'

interface Web3Info {
  chain?: string
  address?: string
}

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [web3Info, setWeb3Info] = useState<Web3Info | null>(null)
  const [loading, setLoading] = useState(true)

  // Get email immediately from auth context - no need to wait
  const email = user?.email || null

  useEffect(() => {
    if (authLoading) return

    if (user) {
      // Get web3 directly from user_metadata (native web3 login) - no DB query needed
      const sub = user.user_metadata?.sub
      if (sub && sub.startsWith('web3:')) {
        const parts = sub.split(':')
        if (parts.length >= 3) {
          const chain = parts[1]
          const address = parts.slice(2).join(':')
          setWeb3Info({ chain, address })
        }
      }
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <>
        <TopNav />
        <main className="min-h-screen px-12 pt-20 pb-12">
          <header className="mb-12">
            <div>
              <p className="font-headline text-sm font-semibold text-primary tracking-tight mb-1 uppercase">
                Account
              </p>
              <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tighter">
                Account
              </h1>
            </div>
          </header>
          <div className="max-w-2xl mx-auto p-12 bg-surface-container-low rounded-xl text-center">
            <div className="w-10 h-10 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-on-surface-variant mt-4 text-sm">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <TopNav />
        <main className="min-h-screen px-12 pt-20 pb-12">
          <header className="mb-12">
            <div>
              <p className="font-headline text-sm font-semibold text-primary tracking-tight mb-1 uppercase">
                Account
              </p>
              <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tighter">
                Account
              </h1>
            </div>
          </header>
          <div className="max-w-2xl mx-auto p-8 bg-surface-container-low rounded-xl text-center">
            <p className="text-on-surface-variant mb-6">You need to be signed in to view this page.</p>
            <Link
              href="/"
              className="px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-dim transition-colors"
            >
              Go Home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <TopNav />
      <main className="min-h-screen px-12 pt-20 pb-12">
        <header className="mb-12">
          <div>
            <p className="font-headline text-sm font-semibold text-primary tracking-tight mb-1 uppercase">
              Account
            </p>
            <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tighter">
              Account
            </h1>
            <p className="text-on-surface-variant mt-2">
              View your account information.
            </p>
          </div>
        </header>

        <div className="max-w-2xl mx-auto space-y-8">
          <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <h3 className="text-lg font-bold text-on-surface mb-4">Account Information</h3>
            <div className="space-y-6">
              {/* Email */}
              {email && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-on-surface-variant">Email</span>
                  </div>
                  <div className="px-1 py-2">
                    <span className="text-base font-semibold text-on-surface">
                      {email}
                    </span>
                  </div>
                </div>
              )}

              {/* Web3 Account */}
              {web3Info && web3Info.address && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-on-surface-variant">Web3 Account</span>
                  </div>
                  <div className="px-1 py-2">
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-on-surface">
                        {web3Info.chain || 'Web3'}
                      </span>
                      <code className="text-sm text-on-surface-variant font-mono mt-1">
                        {web3Info.address}
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/10">
              <button
                onClick={signOut}
                className="px-6 py-2 bg-error text-on-error rounded-lg font-semibold hover:bg-error-dim transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
