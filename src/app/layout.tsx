import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'eleAI Studio - Creative AI Suite',
  description: 'The definitive workstation for generative artists. High-fidelity image, video, and audio creation powered by the next generation of neural engines.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Inter:wght@100..900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface overflow-x-hidden font-body">
        {children}
      </body>
    </html>
  )
}
