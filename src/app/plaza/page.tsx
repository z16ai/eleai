'use client'

import { useState, useEffect } from 'react'

interface GeneratedWork {
  id: string
  prompt: string
  aspectRatio: string
  quality: string
  modelName: string
  src: string
  alt: string
  type: 'image' | 'video' | 'audio'
  isPremium: boolean
  createdAt?: number
  public?: boolean
}

type Category = 'image' | 'video' | 'audio'
type Filter = 'all' | 'free' | 'premium'

// Fisher-Yates shuffle for random order
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function Plaza() {
  const [activeCategory, setActiveCategory] = useState<Category>('image')
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [works, setWorks] = useState<GeneratedWork[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWork, setSelectedWork] = useState<GeneratedWork | null>(null)

  // Load all public user generated works
  useEffect(() => {
    async function loadWorks() {
      try {
        // Load all public images
        const response = await fetch('/api/images/public')
        const data = await response.json()
        if (data.success && data.images && data.images.length > 0) {
          const loadedWorks: GeneratedWork[] = data.images
            .filter((img: any) => img.public !== false) // only public
            .map((img: any) => ({
              id: img.id,
              prompt: img.prompt,
              aspectRatio: img.aspectRatio,
              quality: img.quality,
              modelName: img.modelName,
              src: img.src,
              alt: img.alt,
              type: 'image',
              // For now, all are free since they're user-generated
              isPremium: false,
              createdAt: img.createdAt,
              public: img.public !== false,
            }))
          // Random order (shuffle)
          const shuffled = shuffleArray(loadedWorks)
          setWorks(shuffled)
        } else {
          setWorks([])
        }
      } catch (error) {
        console.error('Failed to load works:', error)
        setWorks([])
      } finally {
        setIsLoading(false)
      }
    }

    loadWorks()
  }, [])

  const filteredWorks = works.filter(work => {
    const matchCategory = work.type === activeCategory
    const matchFilter = activeFilter === 'all'
      ? true
      : activeFilter === 'free'
        ? !work.isPremium
        : work.isPremium
    return matchCategory && matchFilter
  })

  const getAspectStyle = (ratio: string) => {
    return { aspectRatio: ratio.replace(':', '/') }
  }

  return (
    <main className="min-h-screen px-12 pt-20 pb-8">
      <header className="mb-12">
        <div>
          <p className="font-headline text-sm font-semibold text-primary tracking-tight mb-1 uppercase">
            Community
          </p>
          <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tighter">
            Plaza
          </h1>
          <p className="text-on-surface-variant mt-2">
            Discover and explore creations from the community.
          </p>
        </div>
      </header>

      <div className="mb-6 flex justify-between items-center">
        {/* Category Tabs: Image / Video / Audio */}
        <div className="inline-flex p-1 bg-surface-container-low rounded-lg">
          {(['image', 'video', 'audio'] as Category[]).map((cat) => (
            <button
              key={cat}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all capitalize ${
                activeCategory === cat
                  ? 'bg-surface-container-highest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Tabs: All / Free / Premium */}
        <div className="inline-flex p-1 bg-surface-container-low rounded-md">
          {(['all', 'free', 'premium'] as Filter[]).map((filter) => (
            <button
              key={filter}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all capitalize ${
                activeFilter === filter
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of works - 2px spacing horizontally and vertically, container has rounded corners, items have no rounded corners */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-[2px] space-y-[2px] overflow-hidden rounded-xl border border-outline-variant/10 bg-outline-variant/5">
        {isLoading && (
          <div className="break-inside-avoid animate-pulse">
            <div className="w-full h-64 bg-surface-container-low"></div>
          </div>
        )}

        {!isLoading && filteredWorks.length === 0 && (
          <div className="break-inside-avoid col-span-full text-center py-20 opacity-60">
            <p className="text-on-surface-variant">No public works found in this category.</p>
          </div>
        )}

        {filteredWorks.map((work) => (
          <div
            key={work.id}
            className="break-inside-avoid group relative bg-surface-container-low overflow-hidden cursor-pointer transition-all hover:shadow-xl"
            onClick={() => setSelectedWork(work)}
          >
            <div className="relative overflow-hidden" style={getAspectStyle(work.aspectRatio)}>
              <img
                src={work.src}
                alt={work.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {work.isPremium && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-gradient-to-r from-primary to-tertiary text-on-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Premium
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-semibold line-clamp-2">
                  {work.prompt}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-white bg-white/20 px-2 py-1 rounded-full backdrop-blur">
                    {work.modelName}
                  </span>
                  <span className="text-[10px] text-white bg-white/20 px-2 py-1 rounded-full backdrop-blur">
                    {work.aspectRatio}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedWork && (
        <div
          className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="relative bg-surface rounded-2xl overflow-hidden max-w-[90vw] max-h-[85vh] w-[1200px] flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Image */}
            <div className="flex-1 bg-surface-container-low flex items-center justify-center p-6">
              <img
                src={selectedWork.src}
                alt={selectedWork.alt}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>

            {/* Right: Info */}
            <div className="w-80 border-l border-outline-variant/10 p-6 flex flex-col">
              <div className="flex-1 space-y-6 overflow-y-auto">
                {/* Prompt */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Prompt
                  </label>
                  <div className="p-4 bg-surface-container-low rounded-lg">
                    <p className="text-sm text-on-surface leading-relaxed">
                      {selectedWork.prompt}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Details
                  </label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Type</span>
                      <span className="text-xs font-semibold text-on-surface bg-surface-container-high px-2 py-1 rounded-md capitalize">
                        {selectedWork.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Model</span>
                      <span className="text-xs font-semibold text-on-surface bg-primary-container/50 px-2 py-1 rounded-md">
                        {selectedWork.modelName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Aspect Ratio</span>
                      <span className="text-xs font-semibold text-on-surface">
                        {selectedWork.aspectRatio}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Quality</span>
                      <span className="text-xs font-semibold text-on-surface">
                        {selectedWork.quality}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Access</span>
                      <span className={`text-xs font-semibold text-on-surface px-2 py-1 rounded-md ${
                        selectedWork.isPremium
                          ? 'bg-gradient-to-r from-primary to-tertiary text-on-primary'
                          : 'bg-surface-container-high text-on-surface'
                      }`}>
                        {selectedWork.isPremium ? 'Premium' : 'Free'}
                      </span>
                    </div>
                    {selectedWork.createdAt && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-on-surface-variant">Created</span>
                        <span className="text-xs font-semibold text-on-surface">
                          {new Date(selectedWork.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-outline-variant/10 space-y-3">
                <a
                  href={selectedWork.src}
                  download
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:bg-primary-dim transition-colors"
                >
                  <span className="material-symbols-outlined">download</span>
                  Download Image
                </a>
                <button
                  onClick={() => setSelectedWork(null)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-transparent border border-outline-variant/20 text-on-surface-variant rounded-lg font-semibold text-sm hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="py-8 mt-12 border-t border-outline-variant/10">
        <p className="font-manrope text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] opacity-30 text-center">
          © 2026 eleAI Studio // The Digital Curator
        </p>
      </footer>
    </main>
  )
}
