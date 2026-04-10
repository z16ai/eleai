'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import Web3ConnectButton from '@/components/auth/Web3ConnectButton'

interface Identity {
  id: string
  provider: string
  email?: string
  created_at: string
  identity_data?: {
    address?: string
    chain?: string
  }
}

export default function AccountPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [identities, setIdentities] = useState<Identity[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showAddEmail, setShowAddEmail] = useState(false)
  const [showLinkWeb3, setShowLinkWeb3] = useState(false)
  const [user, setUser] = useState<any>(null)
  const loadingRef = useRef(false)
  const supabase = createClient()

  useEffect(() => {
    if (!loadingRef.current) {
      loadingRef.current = true
      loadUserAndIdentities()
    }
  }, [])

  const loadUserAndIdentities = async () => {
    setPageLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      const { data } = await supabase.auth.getUserIdentities()
      if (data?.identities) {
        const mapped: Identity[] = data.identities.map(id => ({
          id: id.id,
          provider: id.provider,
          email: id.identity_data?.email,
          created_at: id.created_at,
          identity_data: id.identity_data,
        }))
        setIdentities(mapped)
      }
    }
    setPageLoading(false)
  }

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setMessage(null)

    const { data, error } = await supabase.auth.updateUser({
      email: email.trim()
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({
        type: 'success',
        text: 'Confirmation email sent! Please check your inbox and click the link to confirm.'
      })
      setEmail('')
      setShowAddEmail(false)
      loadUserAndIdentities()
    }

    setLoading(false)
  }

  const handleLinkGoogle = async () => {
    const currentPath = window.location.pathname + window.location.search
    const { data, error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(currentPath)}`
      }
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else if (data.url) {
      window.location.href = data.url
    }
  }

  const handleUnlink = async (provider: string) => {
    // Can't unlink the only identity
    if (identities.length <= 1) {
      setMessage({ type: 'error', text: 'Cannot unlink the only linked identity' })
      return
    }

    if (!confirm(`Are you sure you want to unlink ${getProviderName(provider)}?`)) return

    const { error } = await supabase.auth.unlinkIdentity({
      provider
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: `Successfully unlinked ${getProviderName(provider)}` })
      loadUserAndIdentities()
    }
  }

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'email': return 'Email'
      case 'google': return 'Google'
      case 'web3': return 'Web3 Wallet'
      case 'phone': return 'Phone'
      default: return provider
    }
  }

  // Check if already linked
  const hasEmail = identities.some(i => i.provider === 'email' || !!i.email)
  const hasGoogle = identities.some(i => i.provider === 'google')
  const hasWeb3 = identities.some(i => i.provider === 'web3')

  if (pageLoading) {
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
                Account Management
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
                Account Management
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

  const userEmail = user.email || identities.find(i => i.email)?.email

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
              Account Management
            </h1>
            <p className="text-on-surface-variant mt-2">
              Manage your linked login methods. You can sign in with any linked account.
            </p>
          </div>
        </header>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Account Core Info */}
          <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <h3 className="text-lg font-bold text-on-surface mb-4">Account Info</h3>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-on-surface-variant">Email</span>
                </div>
                {userEmail ? (
                  <div className="flex items-center justify-between px-3 py-2 bg-surface-container rounded-lg border border-outline-variant">
                    <span className="text-sm font-semibold text-on-surface">
                      {userEmail}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddEmail(!showAddEmail)}
                    className="w-full flex items-center justify-center px-3 py-2 bg-surface-container rounded-lg border border-outline-variant hover:border-primary/50 hover:bg-surface-container-high transition-colors text-sm text-primary font-semibold"
                  >
                    {showAddEmail ? 'Cancel' : '+ Bind Email Address'}
                  </button>
                )}
                {!userEmail && showAddEmail && (
                  <form onSubmit={handleAddEmail} className="mt-3 space-y-3 p-3 bg-surface-container rounded-lg border border-outline-variant">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="w-full py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Send Confirmation Email'}
                    </button>
                  </form>
                )}
              </div>

              {/* Web3 Wallet */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-on-surface-variant">Web3 Wallet</span>
                </div>
                {hasWeb3 ? (
                  <div className="space-y-2">
                    {identities.filter(i => i.provider === 'web3').map((identity) => (
                      <div
                        key={identity.id}
                        className="flex items-center justify-between px-3 py-2 bg-surface-container rounded-lg border border-outline-variant"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-on-surface">
                            {identity.identity_data?.chain ? identity.identity_data.chain : 'Web3'}
                          </span>
                          {identity.identity_data?.address && (
                            <code className="text-xs text-on-surface-variant font-mono">
                              {identity.identity_data.address.slice(0, 6)}...{identity.identity_data.address.slice(-4)}
                            </code>
                          )}
                        </div>
                        {identities.length > 1 && (
                          <button
                            onClick={() => handleUnlink(identity.provider)}
                            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-colors"
                            title="Unlink"
                          >
                            <span className="material-symbols-outlined text-lg">link_off</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLinkWeb3(!showLinkWeb3)}
                    className="w-full flex items-center justify-center px-3 py-2 bg-surface-container rounded-lg border border-outline-variant hover:border-primary/50 hover:bg-surface-container-high transition-colors text-sm text-primary font-semibold"
                  >
                    {showLinkWeb3 ? 'Cancel' : '+ Bind Web3 Wallet'}
                  </button>
                )}
                {!hasWeb3 && showLinkWeb3 && (
                  <div className="mt-3 p-3 bg-surface-container rounded-lg border border-outline-variant">
                    <Web3ConnectButton isLoggedIn={true} />
                  </div>
                )}
              </div>

              {/* Link another Google is not needed - email is already shown in Email row */}
            </div>

            {/* Note */}
            {message && (
              <div className={`p-3 rounded-lg text-sm mt-4 ${
                message.type === 'success'
                  ? 'bg-success-container text-on-success-container'
                  : 'bg-error-container text-on-error-container'
              }`}>
                {message.text}
              </div>
            )}

            {/* Warning Note */}
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Note:</strong> To merge two existing accounts, sign in to one account here and link the other account.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
