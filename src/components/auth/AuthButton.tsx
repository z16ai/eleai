'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import GoogleLoginButton from './GoogleLoginButton'
import Web3ConnectButton from './Web3ConnectButton'
import { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const getDisplayInfo = () => {
    if (!user) return null
    
    const sub = user.user_metadata?.sub
    if (sub && sub.startsWith('web3:')) {
      const parts = sub.split(':')
      if (parts.length >= 3) {
        const chain = parts[1] // ethereum, solana, etc.
        const address = parts.slice(2).join(':')
        return { type: 'web3', value: address, chain }
      }
    }
    
    if (user.email) {
      return { type: 'email', value: user.email }
    }
    
    return null
  }

  const getChainIcon = (chain: string) => {
    const icons: Record<string, string> = {
      ethereum: '/images/eth.png',
      solana: '/images/sol.png',
      bsc: '/images/bsc.png',
    }
    return icons[chain] || null
  }

  if (!mounted) return null

  if (loading) {
    return (
      <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400">
        Loading...
      </button>
    )
  }

  if (user) {
    const displayInfo = getDisplayInfo()
    const isWeb3 = displayInfo?.type === 'web3'
    const displayValue = displayInfo?.value || user.email || 'User'
    const chainIcon = isWeb3 ? getChainIcon(displayInfo?.chain || '') : null
    const avatarUrl = user.user_metadata?.avatar_url
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2"
        >
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : isWeb3 && chainIcon ? (
            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center p-1 border border-slate-200 dark:border-slate-600">
              <img 
                src={chainIcon} 
                alt={displayInfo?.chain} 
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
              {displayValue.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[140px] truncate">
            {isWeb3 && displayValue.length > 12 
              ? `${displayValue.slice(0, 6)}...${displayValue.slice(-4)}` 
              : displayValue}
          </span>
          <svg className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
            <div className="absolute right-0 mt-2 w-48 bg-surface-container-low dark:bg-slate-800 rounded-xl shadow-xl border border-outline-variant/20 dark:border-slate-700 py-2 z-50">
              <Link
                href="/account"
                className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-on-surface dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-xl">manage_accounts</span>
                Account Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-on-surface dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-1.5 bg-primary-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
      >
        Connect
      </button>
        {createPortal(
          <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={user} />,
          document.body
        )}
    </>
  )
}

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

function AuthModal({ isOpen, onClose, user }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'web3' | 'email'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        alert('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        onClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Welcome
        </h2>

        <div className="flex gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
              activeTab === 'email'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            E-mail
          </button>
          <button
            onClick={() => setActiveTab('web3')}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
              activeTab === 'web3'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Web3 Connect
          </button>
        </div>

        {activeTab === 'email' && (
          <div className="space-y-4">
            <GoogleLoginButton onClick={onClose} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-gradient text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        )}

        {activeTab === 'web3' && (
          <div className="space-y-4">
            <Web3ConnectButton />
          </div>
        )}
      </div>
    </div>
  )
}