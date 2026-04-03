import Link from 'next/link'

export default function NotFound() {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-surface flex items-center justify-center px-8">
          <div className="text-center max-w-2xl">
            <h1 className="text-9xl font-manrope font-extrabold text-transparent bg-clip-text bg-magic-gradient mb-6">
              404
            </h1>
            <h2 className="text-4xl font-manrope font-bold text-on-surface mb-4">
              Page not found
            </h2>
            <p className="text-on-surface-variant mb-8">
              The creative workspace you&apos;re looking for doesn&apos;t exist in this dimension.
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
      </body>
    </html>
  )
}
