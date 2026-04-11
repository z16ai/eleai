'use client'

import Footer from '@/components/Footer'
import TopNav from '@/components/TopNav'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface PlazaImage {
  id: string
  prompt: string
  aspectRatio: string
  quality: string
  modelName: string
  src: string
  alt: string
  createdAt: number
  userEmail: string
}

export default function Home() {
  const [randomImages, setRandomImages] = useState<PlazaImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlazaImages() {
      try {
        const res = await fetch('/api/images/plaza')
        const data = await res.json()
        if (data.success && data.images && data.images.length > 0) {
          // Filter for wide aspect ratios (16:9 or 21:9) for cards
          const wideImages = data.images.filter((img: PlazaImage) =>
            img.aspectRatio === '16:9' || img.aspectRatio === '21:9'
          )
          // If enough wide images, use them. Otherwise mix with others
          let availableImages = wideImages.length >= 3 ? wideImages : data.images
          // Shuffle
          const shuffled = [...availableImages].sort(() => Math.random() - 0.5)
          // Take 4 for banner (any ratio) + 3 wide for cards
          const bannerCandidates = [...data.images].sort(() => Math.random() - 0.5)
          const selectedBanner = bannerCandidates.slice(0, 4)
          const selectedCards = shuffled.slice(0, 3)
          setRandomImages([...selectedBanner, ...selectedCards])
        }
      } catch (error) {
        console.error('Failed to fetch plaza images:', error)
        // Fallback to default images if fetch fails
        setRandomImages([
          { src: '/images/87c45120.jpg', alt: 'Abstract AI Art', aspectRatio: '16:9' } as PlazaImage,
          { src: '/images/c905cb71.jpg', alt: 'AI Landscape', aspectRatio: '16:9' } as PlazaImage,
          { src: '/images/4db8c3f0.jpg', alt: 'Portrait AI', aspectRatio: '3:4' } as PlazaImage,
          { src: '/images/d6f4d622.jpg', alt: 'Abstract Flow', aspectRatio: '4:5' } as PlazaImage,
          { src: '/images/39d39603.jpg', alt: 'Minimalist aesthetic', aspectRatio: '1:1' } as PlazaImage,
          { src: '/images/0bdb3fd6.jpg', alt: 'Motion blur', aspectRatio: '16:9' } as PlazaImage,
          { src: '/images/6b46212a.jpg', alt: 'Audio wave', aspectRatio: '16:9' } as PlazaImage,
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchPlazaImages()
  }, [])

  const bannerImages = randomImages.slice(0, 4)
  const cardImages = randomImages.slice(4, 7)

  return (
    <>
      <TopNav />
      <main className="pt-24">
        <section className="relative px-8 py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary-container text-on-primary-container rounded-full">
                Evolution of Creativity
              </span>
              <h1 className="text-5xl lg:text-7xl font-manrope font-extrabold tracking-tighter text-on-background mb-8 leading-[1.1]">
                AI Creator Economy <br /><span className="text-gradient">Infrastructure Layer</span>
              </h1>
              <p className="text-lg text-on-surface-variant mb-10 max-w-2xl font-body leading-relaxed">
                eleAI is building the infrastructure for the AI Creator Economy — where creation, ownership, distribution, and monetization of AI-generated content are unified into one protocol.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/image">
                  <button className="px-8 py-4 bg-primary-gradient text-on-primary rounded-xl font-bold text-lg hover:scale-95 transition-transform duration-200 shadow-xl shadow-primary/20">
                    Start Now
                  </button>
                </Link>
                <button className="px-8 py-4 bg-surface-container-low text-on-surface rounded-xl font-bold text-lg hover:bg-surface-container transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-magic-gradient opacity-10 blur-[120px] rounded-full"></div>
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="rounded-xl overflow-hidden shadow-2xl">
                    {loading ? (
                      <div className="w-full h-48 animate-pulse bg-surface-container-high"></div>
                    ) : (
                      <img
                        alt={bannerImages[0]?.alt || 'Abstract AI Art'}
                        className="w-full h-48 object-cover"
                        src={bannerImages[0]?.src}
                      />
                    )}
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-2xl">
                    {loading ? (
                      <div className="w-full h-64 animate-pulse bg-surface-container-high"></div>
                    ) : (
                      <img
                        alt={bannerImages[1]?.alt || 'AI Landscape'}
                        className="w-full h-64 object-cover"
                        src={bannerImages[1]?.src}
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden shadow-2xl">
                    {loading ? (
                      <div className="w-full h-72 animate-pulse bg-surface-container-high"></div>
                    ) : (
                      <img
                        alt={bannerImages[2]?.alt || 'Portrait AI'}
                        className="w-full h-72 object-cover"
                        src={bannerImages[2]?.src}
                      />
                    )}
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-2xl">
                    {loading ? (
                      <div className="w-full h-40 animate-pulse bg-surface-container-high"></div>
                    ) : (
                      <img
                        alt={bannerImages[3]?.alt || 'Abstract Flow'}
                        className="w-full h-40 object-cover"
                        src={bannerImages[3]?.src}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-manrope font-extrabold tracking-tight mb-4">
                One Studio. Infinite Mediums.
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                Seamlessly transition between image synthesis, cinematic video generation, and spatial audio mastering within a single ethereal workstation.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/image">
                <div className="group p-8 bg-surface-container-lowest rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-xl bg-primary-container flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">image</span>
                  </div>
                  <h3 className="text-xl font-manrope font-bold mb-3">Image Studio</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                    Ultra-HD diffusion models with precise prompt control and real-time stylistic layering.
                  </p>
                  <div className="h-32 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center">
                    {loading ? (
                      <div className="w-full h-full animate-pulse bg-surface-container-high"></div>
                    ) : (
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={cardImages[0]?.alt || 'Minimalist aesthetic'}
                        src={cardImages[0]?.src || '/images/39d39603.jpg'}
                      />
                    )}
                  </div>
                </div>
              </Link>

              <Link href="/video">
                <div className="group p-8 bg-surface-container-lowest rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-xl bg-tertiary-container/20 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-tertiary text-3xl">movie</span>
                  </div>
                  <h3 className="text-xl font-manrope font-bold mb-3">Video Studio</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                    Temporal consistency at its peak. Generate cinematic clips from text or static imagery in seconds.
                  </p>
                  <div className="h-32 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center">
                    {loading ? (
                      <div className="w-full h-full animate-pulse bg-surface-container-high"></div>
                    ) : (
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={cardImages[1]?.alt || 'Motion blur'}
                        src={cardImages[1]?.src || '/images/0bdb3fd6.jpg'}
                      />
                    )}
                  </div>
                </div>
              </Link>

              <Link href="/audio">
                <div className="group p-8 bg-surface-container-lowest rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-xl bg-secondary-container flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-on-secondary-container text-3xl">graphic_eq</span>
                  </div>
                  <h3 className="text-xl font-manrope font-bold mb-3">Audio Lab</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                    Master soundscapes with AI-driven orchestration, voice cloning, and environmental foley generation.
                  </p>
                  <div className="h-32 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center">
                    {loading ? (
                      <div className="w-full h-full animate-pulse bg-surface-container-high"></div>
                    ) : (
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={cardImages[2]?.alt || 'Audio wave'}
                        src={cardImages[2]?.src || '/images/6b46212a.jpg'}
                      />
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="px-8 py-24 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-manrope font-extrabold tracking-tight">Model Square</h2>
                  <p className="text-on-surface-variant text-sm mt-2">Access the industry's most powerful neural weights.</p>
                </div>
                <a className="text-primary font-bold text-sm flex items-center gap-1" href="#">
                  View Library <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-primary-container text-on-primary-container rounded-full">v4.2</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">Luminary Prime</h4>
                  <p className="text-[11px] text-on-surface-variant">Optimal for photorealism and lighting.</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="material-symbols-outlined text-tertiary">palette</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-tertiary-container/30 text-on-tertiary-container rounded-full">Stable</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">Artist Flow</h4>
                  <p className="text-[11px] text-on-surface-variant">Creative concepts and oil textures.</p>
                </div>
                <div className="p-4 bg-primary text-on-primary rounded-xl shadow-lg shadow-primary/20">
                  <div className="flex justify-between items-start mb-4">
                    <span className="material-symbols-outlined">rocket_launch</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white/20 rounded-full">BETA</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">Turbo Motion</h4>
                  <p className="text-[11px] opacity-80">High-speed video rendering engine.</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="material-symbols-outlined text-secondary">waves</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">Deep Voice</h4>
                  <p className="text-[11px] text-on-surface-variant">Natural text-to-speech synthesis.</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="material-symbols-outlined text-on-surface-variant">grid_view</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">Mosaic XL</h4>
                  <p className="text-[11px] text-on-surface-variant">Large-scale tiling and textures.</p>
                </div>
                <div className="p-4 bg-surface-container-low border-2 border-dashed border-outline-variant/20 rounded-xl flex flex-col items-center justify-center opacity-60">
                  <span className="material-symbols-outlined text-on-surface-variant mb-2">add_circle</span>
                  <span className="text-[10px] font-bold">Import Custom</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
              <h2 className="text-xl font-manrope font-bold mb-8">Workbench Control</h2>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Aspect Ratio</span>
                    <span className="text-xs font-bold text-primary">16:9 Cinematic</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <button className="aspect-square bg-surface-container-lowest border border-outline-variant/10 rounded-lg flex flex-col items-center justify-center hover:bg-primary-container/20 transition-colors">
                      <div className="w-4 h-4 border-2 border-on-surface-variant rounded-sm mb-1"></div>
                      <span className="text-[10px] font-bold">1:1</span>
                    </button>
                    <button className="aspect-square bg-primary-container border border-primary/20 rounded-lg flex flex-col items-center justify-center">
                      <div className="w-6 h-3 border-2 border-primary rounded-sm mb-1"></div>
                      <span className="text-[10px] font-bold text-primary">16:9</span>
                    </button>
                    <button className="aspect-square bg-surface-container-lowest border border-outline-variant/10 rounded-lg flex flex-col items-center justify-center">
                      <div className="w-3 h-5 border-2 border-on-surface-variant rounded-sm mb-1"></div>
                      <span className="text-[10px] font-bold">9:16</span>
                    </button>
                    <button className="aspect-square bg-surface-container-lowest border border-outline-variant/10 rounded-lg flex flex-col items-center justify-center">
                      <div className="w-5 h-4 border-2 border-on-surface-variant rounded-sm mb-1"></div>
                      <span className="text-[10px] font-bold">4:3</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Upscaling Power</span>
                    <span className="text-xs font-bold text-primary">4K Resolution</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-magic-gradient w-[75%] rounded-full"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-on-surface-variant">
                    <span>720p</span>
                    <span>1080p</span>
                    <span>2K</span>
                    <span className="text-primary">4K ULTRA</span>
                  </div>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-tertiary text-xl">high_quality</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold">Neural Denoiser Active</p>
                      <p className="text-[10px] text-on-surface-variant">Removing artifacts via AI-Pass 2.0</p>
                    </div>
                    <div className="w-10 h-6 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 py-24">
          <div className="max-w-5xl mx-auto rounded-3xl bg-inverse-surface p-12 lg:p-20 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-magic-gradient opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-manrope font-black text-white mb-6 tracking-tighter">
                Ready to redefine reality?
              </h2>
              <p className="text-white/60 mb-10 max-w-xl mx-auto">
                Join 50,000+ creators pushing the boundaries of digital art with eleAI Studio's professional workbench.
              </p>
              <Link href="/image">
                <button className="px-10 py-5 bg-white text-on-background rounded-xl font-bold text-lg hover:scale-95 transition-transform duration-200">
                  Start Creating Now
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
