'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      isConnected?: boolean
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, callback: (...args: unknown[]) => void) => void
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void
    }
    solana?: {
      isPhantom?: boolean
      connect: () => Promise<{ publicKey: { toString: () => string } }>
    }
  }
}

interface Web3ConnectButtonProps {
  isLoggedIn?: boolean
}

interface Wallet {
  name: string
  icon: string
  chain: 'ethereum' | 'solana'
  detect: () => boolean
}

const WALLETS: Wallet[] = [
  {
    name: 'MetaMask',
    icon: '/images/metamask.svg',
    chain: 'ethereum',
    detect: () => typeof window.ethereum !== 'undefined' && window.ethereum?.isMetaMask === true
  },
  {
    name: 'Phantom',
    icon: '/images/phantom.svg',
    chain: 'solana',
    detect: () => typeof window.solana !== 'undefined' && window.solana?.isPhantom === true
  }
]

export default function Web3ConnectButton({ isLoggedIn = false }: Web3ConnectButtonProps) {
  const [address, setAddress] = useState<string | null>(null)
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null)
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([])
  const supabase = createClient()

  useEffect(() => {
    const detectWallets = () => {
      const detected = WALLETS.filter(w => {
        const isDetected = w.detect()
        console.log(`Wallet ${w.name}:`, isDetected)
        return isDetected
      })
      setAvailableWallets(detected)
    }

    // Run detection after a short delay to ensure DOM is ready
    setTimeout(detectWallets, 100)
    
    // Also listen for wallet changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', detectWallets)
    }
  }, [])

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && isLoggedIn) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[]
        if (accounts.length > 0) setAddress(accounts[0])
      }
    }
    if (isLoggedIn) checkConnection()
    else setAddress(null)

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const acc = accounts as string[]
        setAddress(acc.length === 0 ? null : isLoggedIn ? acc[0] : null)
      }
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      return () => window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [isLoggedIn])

  const signInWithWallet = async (wallet: Wallet) => {
    setConnectingWallet(wallet.name)
    try {
      console.log('Starting Web3 login for:', wallet.name, wallet.chain)

      // Force permission request to show account selector (allows switching between wallets)
      if (wallet.chain === 'ethereum' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        })
      } else if (wallet.chain === 'solana' && window.solana) {
        await window.solana.connect()
      } else {
        alert(`${wallet.name} is not available. Please make sure it's installed.`)
        setConnectingWallet(null)
        return
      }

      if (isLoggedIn) {
        // Link to current logged in account
        const { data, error } = await (supabase.auth as any).linkIdentity({
          provider: 'web3',
          options: {
            chain: wallet.chain,
            statement: 'I accept the Terms of Service at https://eleai.studio/tos'
          }
        })
        console.log('Link Web3 result:', { data, error })
        if (error) {
          alert(error.message)
        } else if (data.url) {
          window.location.href = data.url
        }
      } else {
        // Sign in with Web3
        const { data, error } = await supabase.auth.signInWithWeb3({
          chain: wallet.chain as 'ethereum',
          statement: 'I accept the Terms of Service at https://eleai.studio/tos'
        })
        console.log('Web3 login result:', { data, error })
        if (error) {
          alert(error.message)
        }
      }
    } catch (err: any) {
      console.error('Signing error:', err)
      if (err.code !== 4001 && err.message !== 'User rejected the request') {
        alert(err.message || 'Failed to connect wallet')
      }
    } finally {
      setConnectingWallet(null)
    }
  }

  if (address) {
    return (
      <button
        onClick={() => setAddress(null)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg"
      >
        <span className="font-medium">{address.slice(0, 6)}...{address.slice(-4)}</span>
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-lg font-medium text-slate-800 dark:text-white mb-1">Connect Your Wallet</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Select a wallet to sign in</p>
      </div>
      
      <div className="space-y-3">
        {availableWallets.map((wallet) => (
          <button
            key={wallet.name}
            onClick={() => signInWithWallet(wallet)}
            disabled={!!connectingWallet}
            className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750 border border-slate-200 dark:border-slate-600 rounded-xl hover:from-white hover:to-slate-50 dark:hover:from-slate-700 dark:hover:to-slate-650 hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center p-2">
                <img src={wallet.icon} alt={wallet.name} className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <span className="block text-base font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {wallet.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {wallet.chain === 'ethereum' ? 'Ethereum' : 'Solana'}
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <svg className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {availableWallets.length === 0 && (
        <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">No wallets detected</p>
          <p className="text-sm text-slate-500">Please install MetaMask or Phantom to continue</p>
        </div>
      )}
    </div>
  )
}