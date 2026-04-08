import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-8">
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-error-container flex items-center justify-center">
          <span className="material-symbols-outlined text-error text-4xl">error</span>
        </div>
        <h1 className="text-4xl font-manrope font-extrabold text-on-surface mb-4">
          Authentication Failed
        </h1>
        <p className="text-on-surface-variant mb-8">
          We couldn&apos;t sign you in. This might be due to a cancelled sign-in or a technical issue.
          Please try again.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary-gradient text-on-primary rounded-xl font-bold text-lg hover:scale-95 transition-transform duration-200 shadow-xl shadow-primary/20"
        >
          <span className="material-symbols-outlined">home</span>
          Return Home
        </Link>
      </div>
    </div>
  )
}
