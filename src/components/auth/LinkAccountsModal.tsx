'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import GoogleLoginButton from './GoogleLoginButton'
import Web3ConnectButton from './Web3ConnectButton'

interface LinkAccountsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Identity {
  id: string
  provider: string
  email?: string
  created_at: string
}

export default function LinkAccountsModal({ isOpen, onClose }: LinkAccountsModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [identities, setIdentities] = useState<Identity[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      loadIdentities()
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const loadIdentities = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get all linked identities
    const { data } = await supabase.auth.getUserIdentities()
    if (data?.identities) {
      const mapped: Identity[] = data.identities.map(id => ({
        id: id.id,
        provider: id.provider,
        email: id.identity_data?.email || '',
        created_at: id.created_at || '',
      }))
      setIdentities(mapped)
    }
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
      loadIdentities()
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

    const identityToUnlink = identities.find(i => i.provider === provider)
    if (!identityToUnlink) return

    if (!confirm(`Are you sure you want to unlink ${provider}?`)) return

    const { error } = await supabase.auth.unlinkIdentity(identityToUnlink as any)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: `Successfully unlinked ${provider}` })
      loadIdentities()
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

  if (!isOpen) return null

  // Check if email already exists (any identity has email = already have it)
  const hasEmail = identities.some(i => i.provider === 'email' || !!i.email)
  // Check if Google already linked
  const hasGoogle = identities.some(i => i.provider === 'google')
  // Check if Web3 already linked
  const hasWeb3 = identities.some(i => i.provider === 'web3')

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8 max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="text-2xl font-manrope font-bold text-on-surface mb-2">
          Linked Accounts
        </h2>
        <p className="text-on-surface-variant mb-6 text-sm">
          Link multiple login methods to the same account. You can sign in with any of them.
          <br /><br />
          <strong className="text-amber-600 dark:text-amber-400">Note:</strong> To merge two existing accounts, sign in to one and link the other here.
        </p>

        {/* Current Linked Identities */}
        <div className="mb-6">
          <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
            Current Linked Accounts
          </label>
          <div className="space-y-2">
            {identities.map((identity) => (
              <div
                key={identity.id}
                className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-on-surface">
                    {getProviderName(identity.provider)}
                  </span>
                  {identity.email && (
                    <span className="text-xs text-on-surface-variant">
                      {identity.email}
                    </span>
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
        </div>

        {/* Add Email Form */}
        {!hasEmail && (
          <div className="mb-6 p-4 border border-outline-variant/10 rounded-xl">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
              Add Email Address
            </label>
            <form onSubmit={handleAddEmail} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 bg-surface-container rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
          </div>
        )}

        {/* Link Google */}
        {!hasGoogle && (
          <div className="mb-6">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
              Link Social Account
            </label>
            <GoogleLoginButton onClick={handleLinkGoogle} />
          </div>
        )}

        {/* Link Web3 Wallet */}
        {!hasWeb3 && (
          <div className="mb-6">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
              Link Web3 Wallet
            </label>
            <Web3ConnectButton isLoggedIn={true} />
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-success-container text-on-success-container'
              : 'bg-error-container text-on-error-container'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )

  // Portal to document.body to escape stacking context from TopNav
  return createPortal(content, document.body)
}
