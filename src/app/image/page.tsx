'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import AuthModal from '@/components/auth/AuthModal'

interface GeneratedImage {
  id: string
  prompt: string
  aspectRatio: string
  quality: string
  modelName: string
  src: string
  alt: string
  createdAt?: number
  referenceImage?: string
}

interface GenerationQueueItem {
  prompt: string
  modelId: string
  aspectRatio: string
  quality: string
  referenceImage: string | null
}

const defaultImages: GeneratedImage[] = [
  {
    id: '1',
    prompt: 'Hyper-realistic architectural interior of a glass sanctuary surrounded by a digital forest at dusk...',
    aspectRatio: '3:4',
    quality: '4K',
    modelName: 'Flux 2 Klein 4B',
    src: '/images/4db8c3f0.jpg',
    alt: 'flowing 3D abstract shapes in shades of cerulean blue and violet with soft matte lighting and depth of field',
  },
  {
    id: '2',
    prompt: 'Soft pastel minimalism, floating translucent spheres in a silent white space, studio lighting...',
    aspectRatio: '1:1',
    quality: '4K',
    modelName: 'Flux 2 Max',
    src: '/images/39d39603.jpg',
    alt: 'minimalist geometric glass spheres floating over a mirror-like desert floor during sunrise with long shadows',
  },
  {
    id: '3',
    prompt: 'Cyberpunk street scene at night, heavy rain, glowing blue and magenta signage, 8k resolution, cinematic grain...',
    aspectRatio: '16:9',
    quality: '4K',
    modelName: 'Flux 2 Flex',
    src: '/images/c905cb71.jpg',
    alt: 'cinematic wide shot of a futuristic neon-lit city street under heavy rainfall with reflective puddles',
  },
  {
    id: '4',
    prompt: 'Iridescent organic texture, liquid mercury meeting pearlescent cream, soft macro focus...',
    aspectRatio: '4:5',
    quality: '4K',
    modelName: 'Flux 2 Pro',
    src: '/images/d6f4d622.jpg',
    alt: 'macro close-up of iridescent butterfly wings with microscopic texture and shifting rainbow colors',
  },
]

const models = [
  { id: 'flux-2-klein', name: 'Flux 2 Klein 4B', modelId: 'black-forest-labs/flux.2-klein-4b', description: 'Compact fast generation (OpenRouter)' },
  { id: 'flux-2-max', name: 'Flux 2 Max', modelId: 'black-forest-labs/flux.2-max', description: 'Maximum quality output (OpenRouter)' },
  { id: 'flux-2-flex', name: 'Flux 2 Flex', modelId: 'black-forest-labs/flux.2-flex', description: 'Balanced flexibility (OpenRouter)' },
  { id: 'flux-2-pro', name: 'Flux 2 Pro', modelId: 'black-forest-labs/flux.2-pro', description: 'Professional grade generation (OpenRouter)' },
  { id: 'doubao-seedream-4-0', name: 'Doubao Seedream 4.0', description: 'Doubao text-to-image (Volcengine)' },
  { id: 'doubao-seedream-4-5', name: 'Doubao Seedream 4.5', description: 'Doubao text-to-image improved (Volcengine)' },
  { id: 'doubao-seedream-5-0', name: 'Doubao Seedream 5.0', description: 'Doubao latest text-to-image (Volcengine)' },
]

export default function ImageStudio() {
  const { user, loading: authLoading } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const [selectedRatio, setSelectedRatio] = useState('1:1')
  const [selectedQuality, setSelectedQuality] = useState('4K')
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [zoomImage, setZoomImage] = useState<GeneratedImage | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  // Initialize queue from localStorage persistence
  // Note: referenceImage is not persisted because it can be very large (base64)
  const [generationQueue, setGenerationQueue] = useState<GenerationQueueItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eleai-image-generation-queue')
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as GenerationQueueItem[]
          // Clear referenceImage because it can be large and cause localStorage overflow
          return parsed.map(item => ({
            ...item,
            referenceImage: null, // reference image won't survive page refresh
          }))
        } catch (e) {
          return []
        }
      }
    }
    return []
  })
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
const processingRef = useRef(false)
  const queueRef = useRef<GenerationQueueItem[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastInputRef = useRef({ prompt: '', ratio: '1:1', quality: '4K', modelId: models[0].id })

  // Keep queueRef always up to date - update immediately
  queueRef.current = generationQueue

  // Persist queue to localStorage when it changes
  // Note: referenceImage is not persisted because it can be very large (base64)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (generationQueue.length > 0) {
        try {
          // Don't persist referenceImage to avoid localStorage overflow
          const toPersist = generationQueue.map(item => ({
            ...item,
            referenceImage: null,
          }))
          localStorage.setItem('eleai-image-generation-queue', JSON.stringify(toPersist))
        } catch (e) {
          // If serialization fails (too big), don't persist
          console.warn('Failed to persist queue to localStorage, likely too large')
          localStorage.removeItem('eleai-image-generation-queue')
        }
      } else {
        localStorage.removeItem('eleai-image-generation-queue')
      }
    }
  }, [generationQueue])

  const aspectRatios = ['21:9', '16:9', '3:2', '4:3', '1:1', '3:4', '2:3', '9:16']
  const qualities = ['2K', '4K']

  // Stop current generation
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setGenerationQueue([])
    setIsGenerating(false)
    processingRef.current = false
    queueRef.current = []
    lastPromptRef.current = ''
  }, [])

  const savedImageIdsRef = useRef<Set<string>>(new Set())

  // Save image index to server when images change
  const saveImagesToServer = useCallback(async (newImages: GeneratedImage[]) => {
    if (newImages.length === 0 || !user) return

    // Filter out already saved images
    const newOnlyImages = newImages.filter(img => !savedImageIdsRef.current.has(img.id))
    if (newOnlyImages.length === 0) return

    // Mark as saved
    newOnlyImages.forEach(img => savedImageIdsRef.current.add(img.id))

    try {
      const serverImages = newOnlyImages.map(img => ({
        id: img.id,
        prompt: img.prompt,
        aspectRatio: img.aspectRatio,
        quality: img.quality,
        modelName: img.modelName,
        src: img.src,
        alt: img.alt,
        createdAt: img.createdAt || Date.now(),
      }))

      await fetch('/api/images/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ images: serverImages }),
      })
    } catch (error) {
      console.error('Failed to save images to server:', error)
    }
  }, [user])

  // Process queue sequentially
  const processQueue = useCallback(async () => {
    if (processingRef.current || queueRef.current.length === 0) return

    processingRef.current = true
    const nextItem = queueRef.current[0]
    // Keep current item for display
    lastInputRef.current = { prompt: nextItem.prompt, ratio: nextItem.aspectRatio, quality: nextItem.quality, modelId: nextItem.modelId }
    // Keep current item for display, remove after processing is done
    setIsGenerating(true)

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: lastInputRef.current.prompt,
          modelId: lastInputRef.current.modelId,
          aspectRatio: lastInputRef.current.ratio,
          quality: lastInputRef.current.quality,
          referenceImage: queueRef.current[0]?.referenceImage,
        }),
        signal: abortController.signal,
      })

      const data = await response.json()

      if (data.success && data.images && data.images.length > 0) {
        const currentModel = models.find(m => m.id === nextItem.modelId)
        const newImages = data.images.map((img: any, index: number) => ({
          id: `gen-${Date.now()}-${index}`,
          prompt: nextItem.prompt,
          aspectRatio: nextItem.aspectRatio,
          quality: nextItem.quality,
          modelName: currentModel?.name || 'Unknown',
          src: img.url,
          alt: nextItem.prompt,
          createdAt: Date.now(),
          referenceImage: nextItem.referenceImage || undefined,
        }))
        setImages(prevImages => {
          const updatedImages = [...newImages, ...prevImages]
          // Sort by created time descending (newest first)
          updatedImages.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          saveImagesToServer(updatedImages)
          return updatedImages
        })
      } else if (!abortController.signal.aborted) {
        console.error('Generation failed:', data.error)
        alert(`Generation failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Request error:', error)
        alert(`Request error: ${(error as Error).message}`)
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsGenerating(false)
        processingRef.current = false
        abortControllerRef.current = null
        lastPromptRef.current = ''
        // Remove the processed item from queue
        setGenerationQueue(prev => prev.slice(1))
        // Process remaining queue items
        if (queueRef.current.length > 0) {
          setTimeout(processQueue, 500)
        }
      }
    }
  }, [saveImagesToServer])

  // Auto-start processing restored queue after page load
  useEffect(() => {
    if (user && !authLoading && generationQueue.length > 0 && !processingRef.current) {
      setTimeout(processQueue, 500)
    }
  }, [user, authLoading, generationQueue.length, processQueue])

  // Load image index from server on mount
  useEffect(() => {
    let mounted = true
    
    async function loadImages() {
      if (authLoading || !user) {
        if (!user && mounted) {
          setImages([])
        }
        setIsLoading(false)
        return
      }

      console.log('Loading images for user:', user.id)
      const response = await fetch('/api/images/list', {
        headers: { 'x-user-id': user.id },
      })
      const data = await response.json()
      
      if (!mounted) return
      
      if (data.success) {
        console.log('Loaded images count:', data.images?.length)
        const loadedImages: GeneratedImage[] = (data.images || []).map((img: any) => ({
          id: img.id,
          prompt: img.prompt,
          aspectRatio: img.aspectRatio,
          quality: img.quality,
          modelName: img.modelName,
          src: img.src,
          alt: img.alt,
          createdAt: img.createdAt,
        }))
        loadedImages.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        setImages(loadedImages)
      } else {
        console.error('Failed to load images:', data.error)
      }
    }

    loadImages()
    
    return () => {
      mounted = false
    }
  }, [user, authLoading])

  const getAspectClass = (ratio: string) => {
    const parts = ratio.split(':')
    if (parts.length !== 2) return 'aspect-square'
    const [w, h] = parts
    const className = `aspect-[${w}/${h}]`
    return className
  }

  const getIconName = (ratio: string) => {
    const mapping: Record<string, string> = {
      '21:9': 'crop_landscape',
      '16:9': 'crop_16_9',
      '3:2': 'crop_3_2',
      '4:3': 'crop_4_3',
      '1:1': 'crop_square',
      '3:4': 'crop_portrait',
      '2:3': 'crop_3_2',
      '9:16': 'crop_16_9',
    }
    return mapping[ratio] || 'crop'
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setReferenceImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeReference = () => {
    setReferenceImage(null)
  }

  const lastPromptRef = useRef<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const queueGenerate = () => {
    const currentPrompt = prompt.trim()
    if (!currentPrompt) return
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    // Capture current values BEFORE clearing - important for closure
    const currentPromptToAdd = currentPrompt
    const currentModelId = selectedModel
    const currentRatio = selectedRatio
    const currentQuality = selectedQuality
    const currentRefImage = referenceImage

    // Save current input values for loading display
    lastInputRef.current = {
      prompt: currentPromptToAdd,
      ratio: currentRatio,
      quality: currentQuality,
      modelId: currentModelId
    }

    // Add new task to queue - NO deduplication, allow duplicates
    setGenerationQueue(prev => [...prev, {
      prompt: currentPromptToAdd,
      modelId: currentModelId,
      aspectRatio: currentRatio,
      quality: currentQuality,
      referenceImage: currentRefImage,
    }])

    // CLEAR IMMEDIATELY - after capturing values for queue
    setPrompt('')
    setReferenceImage(null)
    lastPromptRef.current = ''

    // Keep focus on input for continuous typing
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)

    // Trigger processing if not already running
    if (!processingRef.current) {
      setTimeout(processQueue, 0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      queueGenerate()
    }
  }

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      setToastMessage('Copied!')
      setTimeout(() => setToastMessage(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const regenerateFromImage = (image: GeneratedImage) => {
    setPrompt(image.prompt)
    // Find model by name and select it
    const foundModel = models.find(m => m.name === image.modelName || m.id === image.modelName)
    if (foundModel) {
      setSelectedModel(foundModel.id)
    }
    setSelectedRatio(image.aspectRatio)
    setSelectedQuality(image.quality)
    if (image.referenceImage) {
      setReferenceImage(image.referenceImage)
    }
    // Don't auto-generate, let user edit first
  }

  const deleteImage = async (image: GeneratedImage) => {
    if (!user) return
    if (!confirm('Are you sure you want to delete this image?')) return
    
    try {
      const response = await fetch('/api/images/delete', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ imageId: image.id }),
      })
      const result = await response.json()
      if (result.success) {
        setImages(prev => prev.filter(img => img.id !== image.id))
        setToastMessage('Deleted!')
        setTimeout(() => setToastMessage(null), 2000)
      }
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }

  const currentModel = models.find(m => m.id === selectedModel)

  return (
    <main className="min-h-screen px-12 pt-20 pb-48">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-tertiary-container/20 text-tertiary text-[10px] font-bold tracking-widest uppercase rounded-full">
              Creative Suite
            </span>
          </div>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">Image Studio</h1>
        </div>
        <div className="flex items-center gap-4">
        </div>
      </header>

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
        {/* Initial loading skeleton placeholders - only show when there are already images to maintain layout */}
        {user && isLoading && images.length > 0 && defaultImages.map((_, index) => (
          <div key={`skeleton-${index}`} className="flex flex-col gap-4 group animate-pulse break-inside-avoid">
            <div className="relative overflow-hidden rounded-xl bg-surface-container-low">
              <div
                className="overflow-hidden bg-surface-container-high !font-sans"
                style={{ aspectRatio: defaultImages[index].aspectRatio.replace(':', '/') }}
              ></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-surface-container-high rounded w-3/4"></div>
              <div className="h-3 bg-surface-container-high rounded w-full"></div>
              <div className="flex gap-1 pt-1">
                <div className="h-3 bg-surface-container-high rounded w-20"></div>
                <div className="h-3 bg-surface-container-high rounded w-12"></div>
                <div className="h-3 bg-surface-container-high rounded w-10"></div>
              </div>
            </div>
          </div>
        ))}

        {/* All queued items except current being processed - reverse display so newest is on top */}
        {!isLoading && generationQueue.length > 0 && (
          <>
            {(isGenerating ? generationQueue.slice(1) : generationQueue).reverse().map((item, index) => {
              const model = models.find(m => m.id === item.modelId)
              return (
                <div key={`queue-${index}`} className="flex flex-col gap-4 group animate-pulse break-inside-avoid opacity-60">
                  <div className="relative overflow-hidden rounded-xl bg-surface-container-low">
                    <div
                      className="overflow-hidden bg-surface-container-high flex items-center justify-center"
                      style={{ aspectRatio: item.aspectRatio.replace(':', '/') }}
                    >
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin !font-sans"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-on-surface-variant line-clamp-2 italic leading-relaxed opacity-60">
                      &quot;{item.prompt}&quot;
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-1 bg-primary-container/50 text-on-primary-container text-[9px] font-bold rounded-full uppercase tracking-wide">
                        {model?.name || 'Queued'}
                      </span>
                      <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[9px] font-bold rounded-full">
                        {item.aspectRatio}
                      </span>
                      <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[9px] font-bold rounded-full">
                        {item.quality}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            {/* Currently processing - goes at the bottom so overall order is newest on top, oldest (current) at bottom */}
            {isGenerating && generationQueue.length > 0 && (
              <div className="flex flex-col gap-4 group animate-pulse break-inside-avoid">
                <div className="relative overflow-hidden rounded-xl bg-surface-container-low">
                  <div
                    className={`overflow-hidden bg-surface-container-high flex items-center justify-center`}
                    style={{ aspectRatio: generationQueue[0].aspectRatio.replace(':', '/') }}
                  >
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin !font-sans"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-on-surface-variant line-clamp-2 italic leading-relaxed opacity-60">
                    &quot;{generationQueue[0].prompt}&quot;
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-1 bg-primary-container/50 text-on-primary-container text-[9px] font-bold rounded-full uppercase tracking-wide">
                      {models.find(m => m.id === generationQueue[0].modelId)?.name || 'Generating'}
                    </span>
                    <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[9px] font-bold rounded-full">
                      {generationQueue[0].aspectRatio}
                    </span>
                    <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[9px] font-bold rounded-full">
                      {generationQueue[0].quality}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!isLoading && images.map((image) => {
          return (
            <div key={image.id} className="flex flex-col gap-4 group break-inside-avoid">
              <div
                className="relative overflow-hidden rounded-xl bg-surface-container-low cursor-zoom-in"
                onClick={() => setZoomImage(image)}
              >
                <div
                  className="overflow-hidden"
                  style={{ aspectRatio: image.aspectRatio.replace(':', '/') }}
                >
                  <img
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={image.src}
                  />
                </div>
                {/* Overlay for better click detection */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                {/* Action buttons in top-right corner with background */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center bg-black/40 backdrop-blur-sm rounded-lg p-1 gap-1">
                  <a
                    href={image.src}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                    title="Download"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      regenerateFromImage(image)
                    }}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                    title="Regenerate"
                  >
                    <span className="material-symbols-outlined text-base">refresh</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteImage(image)
                    }}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <p
                  className="text-sm text-on-surface-variant line-clamp-2 italic leading-relaxed cursor-pointer hover:text-on-surface transition-colors"
                  onClick={() => copyPrompt(image.prompt)}
                >
                  &quot;{image.prompt}&quot;
                </p>
                {/* Generation metadata */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-1 bg-primary-container/50 text-on-primary-container text-[9px] font-bold rounded-full uppercase tracking-wide">
                    {image.modelName}
                  </span>
                  <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[9px] font-bold rounded-full">
                    {image.aspectRatio}
                  </span>
                  <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[9px] font-bold rounded-full">
                    {image.quality}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative bg-surface rounded-2xl overflow-hidden max-w-[90vw] max-h-[85vh] w-[1200px] flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Image */}
            <div className="flex-1 bg-surface-container-low flex items-center justify-center p-6">
              <img
                src={zoomImage.src}
                alt={zoomImage.alt}
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
                      {zoomImage.prompt}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Generation Details
                  </label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Model</span>
                      <span className="text-xs font-semibold text-on-surface bg-primary-container/50 px-2 py-1 rounded-md">
                        {zoomImage.modelName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Aspect Ratio</span>
                      <span className="text-xs font-semibold text-on-surface">
                        {zoomImage.aspectRatio}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Quality</span>
                      <span className="text-xs font-semibold text-on-surface">
                        {zoomImage.quality}
                      </span>
                    </div>
                    {zoomImage.createdAt && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-on-surface-variant">Created</span>
                        <span className="text-xs font-semibold text-on-surface">
                          {new Date(zoomImage.createdAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-outline-variant/10 space-y-3">
                <a
                  href={zoomImage.src}
                  download
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:bg-primary-dim transition-colors"
                >
                  <span className="material-symbols-outlined">download</span>
                  Download Image
                </a>
                <button
                  onClick={() => {
                    regenerateFromImage(zoomImage)
                    setZoomImage(null)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-high text-on-surface rounded-lg font-semibold text-sm hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined">refresh</span>
                  Regenerate
                </button>
                <button
                  onClick={() => setZoomImage(null)}
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

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface px-6 py-3 rounded-lg shadow-2xl z-[300] animate-in fade-in slide-in-from-top-4">
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 flex flex-col items-center gap-3 z-[100]">
        {/* Configuration Bar */}
        <div className="w-full glass-panel rounded-xl shadow-2xl p-3 flex items-center gap-3 scale-95 origin-bottom animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Model Selection */}
          <div
            className="relative flex-1 min-w-[180px]"
            onMouseLeave={() => setIsModelOpen(false)}
          >
            <button
              className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-surface-container-high rounded-lg text-sm font-medium hover:bg-surface-container-highest transition-colors"
              onClick={() => setIsModelOpen(!isModelOpen)}
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wide">Model</span>
                <span className="text-sm text-on-surface font-semibold">{currentModel?.name}</span>
              </div>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
            {isModelOpen && (
              <div className="absolute bottom-full mb-0 left-0 right-0 bg-surface-container-highest rounded-lg shadow-xl border border-outline-variant/10 overflow-hidden">
                <div className="h-2"></div>
                {models.map((model) => (
                  <button
                    key={model.id}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors bg-transparent text-on-surface hover:bg-primary-container hover:text-on-primary-container`}
                    onClick={() => {
                      setSelectedModel(model.id)
                      setIsModelOpen(false)
                    }}
                  >
                    <div className="font-semibold text-on-surface group-hover:text-on-primary-container">
                      {model.name}
                    </div>
                    <div className="text-xs text-on-surface-variant group-hover:text-on-primary-container/70">
                      {model.description}
                    </div>
                  </button>
                ))}
                <div className="h-2"></div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-on-surface/10"></div>

          {/* Aspect Ratio Selection */}
          <div className="flex items-center gap-1 flex-wrap">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all min-w-[40px] ${
                  selectedRatio === ratio
                    ? 'bg-primary-container text-on-primary-container'
                    : 'hover:bg-surface-container-high text-on-surface-variant font-medium'
                }`}
                onClick={() => setSelectedRatio(ratio)}
              >
                {ratio}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-on-surface/10"></div>

          {/* Resolution Selection */}
          <div className="flex items-center gap-1">
            {qualities.map((quality) => (
              <button
                key={quality}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  selectedQuality === quality
                    ? 'bg-surface-container-high text-on-surface font-bold'
                    : 'hover:bg-surface-container-high text-on-surface-variant'
                }`}
                onClick={() => setSelectedQuality(quality)}
              >
                <span className="material-symbols-outlined text-sm">
                  {quality === '2K' ? 'hd' : '4k'}
                </span>
                {quality}
              </button>
            ))}
          </div>
        </div>

        {/* Reference Image */}
        {referenceImage && (
          <div className="w-full glass-panel rounded-lg p-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <img
                src={referenceImage}
                alt="Reference"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-on-surface">Reference Image</p>
              <p className="text-[10px] text-on-surface-variant">Image to image transformation</p>
            </div>
            <button
              className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              onClick={removeReference}
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="w-full glass-panel rounded-2xl shadow-2xl flex items-center p-2 pl-4 gap-2 ring-1 ring-white/50">
          {/* Reference Image Upload */}
          <label
            className={`w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container-high text-on-surface-variant transition-colors shrink-0 ${
              !user ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-container-highest cursor-pointer'
            }`}
            onClick={(e) => {
              if (!user) {
                e.preventDefault()
                setIsAuthModalOpen(true)
              }
            }}
          >
            <span className="material-symbols-outlined">image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={!user}
            />
          </label>

          <div className="h-6 w-[1px] bg-outline-variant/30 shrink-0"></div>

          {/* Prompt Input */}
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder-on-surface-variant/50 text-sm font-medium min-w-0"
            placeholder="Describe your vision... (Press Enter to generate)"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Cost display - 10 points per generation */}
          <div className="flex items-center gap-1 px-2 py-1 bg-surface-container-high rounded-lg shrink-0">
            <img src="/images/points-icon.png" alt="Points" className="w-4 h-4" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
              10 Pts
            </span>
          </div>

          {/* Always arrow (generate) button - allow adding new tasks anytime
              even when generation is in progress. Button disabled only when input is empty. */}
          <button
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-on-primary shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            onClick={queueGenerate}
            disabled={!prompt.trim()}
            title="Add to generation queue (costs 10 points)"
          >
            <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </main>
  )
}
