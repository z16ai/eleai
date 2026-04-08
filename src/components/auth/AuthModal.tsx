'use client'

import { useEffect, useState } from 'react'
import GoogleLoginButton from './GoogleLoginButton'
import { createClient } from '@/lib/supabase/client'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const supabase = createClient()

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Check your email for the confirmation link!' })
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        onClose()
        window.location.reload()
      }
    }

    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="text-2xl font-manrope font-bold text-on-surface mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-on-surface-variant mb-6">
          {isSignUp ? 'Sign up to get started with eleAI Studio' : 'Sign in to continue creating'}
        </p>

        <GoogleLoginButton className="w-full mb-6" />

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-surface text-on-surface-variant">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-on-surface mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-success-container text-on-success-container'
                : 'bg-error-container text-on-error-container'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-gradient text-on-primary rounded-lg font-bold hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {isSignUp ? 'Creating account...' : 'Signing in...'}
              </span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setMessage(null)
            }}
            className="text-primary font-semibold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
