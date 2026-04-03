'use client'

import { useState } from 'react'

interface GeneratedVideo {
  id: string
  title: string
  description: string
  duration: string
  aspectRatio: string
  src: string
  alt: string
}

const sampleVideos: GeneratedVideo[] = [
  {
    id: '1',
    title: 'Ethereal Silk Flow',
    description: 'Cinematic macro shot of silk flowing in zero gravity...',
    duration: '0:05',
    aspectRatio: '9/16',
    src: '/images/4db8c3f0.jpg',
    alt: 'Abstract cinematic fluid motion graphics with deep purple and vibrant blue silk-like waves flowing gracefully',
  },
  {
    id: '2',
    title: 'Neon Drench',
    description: 'Tracking shot through a rainy cyberpunk alleyway...',
    duration: '0:10',
    aspectRatio: '16/9',
    src: '/images/c905cb71.jpg',
    alt: 'Futuristic neon city street at night with heavy rain and glowing holographic advertisements in magenta and cyan',
  },
  {
    id: '3',
    title: 'Liquid Orbs',
    description: 'Physics simulation of glass spheres colliding gently...',
    duration: '0:05',
    aspectRatio: '1/1',
    src: '/images/39d39603.jpg',
    alt: 'Clean 3D render of iridescent glass spheres floating over a soft pastel pink background with soft studio lighting',
  },
  {
    id: '4',
    title: 'Digital Cascade',
    description: 'Abstract data streams falling in 3D space...',
    duration: '0:10',
    aspectRatio: '4/3',
    src: '/images/6b46212a.jpg',
    alt: 'Matrix-style digital rain of glowing green characters falling over a dark background with bokeh effects',
  },
]

export default function VideoStudio() {
  const [prompt, setPrompt] = useState('')
  const [motionStrength, setMotionStrength] = useState(66)

  return (
    <main className="ml-20 min-h-screen p-8 pb-32">
      <header className="flex justify-between items-end mb-12 max-w-7xl mx-auto">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-tertiary-container/20 text-tertiary text-[10px] font-bold tracking-widest uppercase rounded-full">
              Creative Suite
            </span>
          </div>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">Video Studio</h1>
          <p className="text-on-surface-variant mt-1 font-medium">
            Bring your static imaginations to life with cinematic motion.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-surface-container-highest text-on-surface font-medium text-sm transition-all hover:bg-surface-variant">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            <span>Recent</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary-dim transition-all">
            <span className="material-symbols-outlined text-lg">cloud_upload</span>
            <span>Assets</span>
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {sampleVideos.map((video) => (
            <div
              key={video.id}
              className="break-inside-avoid group relative bg-surface-container-low rounded-xl overflow-hidden transition-all hover:shadow-xl hover:shadow-on-surface/5"
            >
              <div className={`relative aspect-[${video.aspectRatio}] overflow-hidden`}>
                <img
                  alt={video.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={video.src}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent opacity-60"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-primary shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <span
                      className="material-symbols-outlined text-4xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_arrow
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <span className="px-2 py-1 glass-panel text-[10px] font-bold rounded text-on-surface">
                    {video.duration}
                  </span>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-lg">download</span>
                    </button>
                    <button className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-headline font-bold text-sm text-on-surface">{video.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50">
        <div className="mb-3 glass-panel rounded-2xl p-2 flex items-center gap-2 shadow-2xl border border-white/20">
          <div className="flex items-center gap-1 p-1 bg-surface-container-high rounded-lg">
            <button className="px-3 py-1.5 rounded-md bg-white text-on-surface text-xs font-bold shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">model_training</span>
              eleVideo-v2.1
            </button>
            <button className="px-3 py-1.5 rounded-md text-on-surface-variant text-xs font-medium hover:bg-white/50 transition-all">
              Cinematic-HD
            </button>
          </div>
          <div className="h-6 w-px bg-on-surface/10 mx-1"></div>
          <div className="flex items-center gap-1 p-1 bg-surface-container-high rounded-lg">
            <button className="px-3 py-1.5 rounded-md bg-white text-on-surface text-xs font-bold shadow-sm">5s</button>
            <button className="px-3 py-1.5 rounded-md text-on-surface-variant text-xs font-medium hover:bg-white/50 transition-all">10s</button>
          </div>
          <div className="ml-auto flex items-center gap-2 pr-2">
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-tighter">Motion Strength</span>
            <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-tertiary"
                style={{ width: `${motionStrength}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-2 flex items-center gap-3 shadow-2xl border border-white/40 ring-1 ring-on-surface/5">
          <button className="w-12 h-12 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-2xl">add_circle</span>
          </button>
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 font-medium"
            placeholder="Describe the motion, camera angle, and atmosphere..."
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button className="h-12 px-6 rounded-xl bg-primary text-on-primary font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all group">
            <span>Generate</span>
            <span
              className="material-symbols-outlined text-lg transition-transform group-hover:rotate-12"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </button>
        </div>
      </div>

      <footer className="fixed bottom-0 right-0 p-8 z-0">
        <p className="font-manrope text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] opacity-30 select-none">
          © 2026 eleAI Studio // The Digital Curator
        </p>
      </footer>
    </main>
  )
}
