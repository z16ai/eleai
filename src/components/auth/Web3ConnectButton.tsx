'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Web3ConnectButtonProps {
  className?: string
}

interface Wallet {
  name: string
  icon: string
  chain: 'ethereum' | 'solana'
}

const wallets: Wallet[] = [
  { name: 'MetaMask', icon: 'metamask', chain: 'ethereum' },
  { name: 'Phantom', icon: 'phantom', chain: 'solana' },
]

export default function Web3ConnectButton({ className = '' }: Web3ConnectButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (walletName: string, chain: 'ethereum' | 'solana', iconName: string) => {
    const supabase = createClient()
    setConnecting(walletName)
    setShowDropdown(false)

    try {
      let data: any, error: any
      
      if (chain === 'ethereum') {
        ({ data, error } = await supabase.auth.signInWithWeb3({
          chain: 'ethereum',
          statement: 'I accept the Terms of Service at https://eleai.studio/tos',
        }))
      } else {
        ({ data, error } = await supabase.auth.signInWithWeb3({
          chain: 'solana',
          statement: 'I accept the Terms of Service at https://eleai.studio/tos',
        }))
      }
      
      if (error) {
        console.error('Web3 connect error:', error.message)
        alert(error.message)
      } else {
        window.location.reload()
      }
    } catch (err) {
      console.error('Web3 connect exception:', err)
      alert('Failed to connect wallet')
    } finally {
      setConnecting(null)
    }
  }

  const getWalletIcon = (iconName: string) => {
    if (iconName === 'metamask') {
      return (
        <svg className="w-5 h-5" viewBox="0 0 40 40" fill="none">
          <path d="M35.8 5L21.9 14.5L24.2 8.2L35.8 5Z" fill="#E17726"/>
          <path d="M4.2 5L18 14.5L15.8 8.2L4.2 5Z" fill="#E27625"/>
          <path d="M31.1 26.8L27.2 31.9L34.5 34.2L37 28L31.1 26.8Z" fill="#E27625"/>
          <path d="M2.9 28L5.5 34.2L12.8 31.9L8.9 26.8L2.9 28Z" fill="#E27625"/>
          <path d="M13.3 16.6L10.9 20L20.5 20.1L18.9 16.1L13.3 16.6Z" fill="#E27625"/>
          <path d="M26.7 16.6L21.2 16.1L19.6 20L27.1 20L26.7 16.6Z" fill="#E27625"/>
        </svg>
      )
    }
    if (iconName === 'phantom') {
      return (
        <svg className="w-5 h-5" viewBox="0 0 128 128" fill="none">
          <circle cx="64" cy="64" r="64" fill="url(#phantom-grad)"/>
          <defs>
            <linearGradient id="phantom-grad" x1="0" y1="0" x2="128" y2="128">
              <stop stopColor="#534BB1"/>
              <stop offset="1" stopColor="#551BF9"/>
            </linearGradient>
          </defs>
          <path d="M38 20L64 36L90 20" stroke="#67D1FF" strokeWidth="4" strokeLinecap="round"/>
          <path d="M38 36L64 52L90 36" stroke="#67D1FF" strokeWidth="4" strokeLinecap="round"/>
          <path d="M38 52L64 68L90 52" stroke="#67D1FF" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      )
    }
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-opacity ${className}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Connect
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-surface rounded-xl shadow-xl border border-outline-variant/20 py-2 z-50">
            <div className="px-4 py-2 border-b border-outline-variant/20">
              <p className="text-xs font-medium text-on-surface-variant">Select Wallet</p>
            </div>
            <div className="py-2">
              {wallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleConnect(wallet.name, wallet.chain, wallet.icon)}
                  disabled={connecting !== null}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors disabled:opacity-50"
                >
                  {getWalletIcon(wallet.icon)}
                  <span className="flex-1 text-left font-medium text-on-surface">{wallet.name}</span>
                  {connecting === wallet.name && (
                    <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
