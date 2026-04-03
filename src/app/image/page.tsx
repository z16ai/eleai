'use client'

import { useState, useEffect } from 'react'

interface GeneratedImage {
  id: string
  prompt: string
  aspectRatio: string
  quality: string
  modelName: string
  src: string
  alt: string
  createdAt?: number
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
  { id: 'flux-2-klein', name: 'Flux 2 Klein 4B', modelId: 'black-forest-labs/flux.2-klein-4b', description: 'Compact fast generation' },
  { id: 'flux-2-max', name: 'Flux 2 Max', modelId: 'black-forest-labs/flux.2-max', description: 'Maximum quality output' },
  { id: 'flux-2-flex', name: 'Flux 2 Flex', modelId: 'black-forest-labs/flux.2-flex', description: 'Balanced flexibility' },
  { id: 'flux-2-pro', name: 'Flux 2 Pro', modelId: 'black-forest-labs/flux.2-pro', description: 'Professional grade generation' },
]

export default function ImageStudio() {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const [selectedRatio, setSelectedRatio] = useState('1:1')
  const [selectedQuality, setSelectedQuality] = useState('4K')
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const aspectRatios = ['21:9', '16:9', '3:2', '4:3', '1:1', '3:4', '2:3', '9:16']
  const qualities = ['2K', '4K']

  // Load image index from server on mount
  useEffect(() => {
    async function loadImages() {
      try {
        const response = await fetch('/api/images/list')
        const data = await response.json()
        if (data.success && data.images && data.images.length > 0) {
          // Convert stored records to frontend format
          const loadedImages: GeneratedImage[] = data.images.map((img: any) => ({
            id: img.id,
            prompt: img.prompt,
            aspectRatio: img.aspectRatio,
            quality: img.quality,
            modelName: img.modelName,
            src: img.url,
            alt: img.alt,
            createdAt: img.createdAt,
          }))
          setImages(loadedImages)
        } else {
          // If no saved images, use defaults
          setImages(defaultImages)
        }
      } catch (error) {
        console.error('Failed to load images:', error)
        setImages(defaultImages)
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  // Save image index to server when images change
  const saveImagesToServer = async (newImages: GeneratedImage[]) => {
    if (newImages.length === 0) return

    try {
      // Convert to server format with filenames
      const serverImages = newImages.map(img => {
        // For user-generated images, extract filename from src
        const filename = img.src.startsWith('/aigenerate/')
          ? img.src.substring('/aigenerate/'.length)
          : ''

        return {
          id: img.id,
          prompt: img.prompt,
          aspectRatio: img.aspectRatio,
          quality: img.quality,
          modelName: img.modelName,
          filename,
          url: img.src,
          alt: img.alt,
          createdAt: img.createdAt || Date.now(),
        }
      })

      await fetch('/api/images/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: serverImages }),
      })
    } catch (error) {
      console.error('Failed to save images to server:', error)
    }
  }

  const getAspectClass = (ratio: string) => {
    const [w, h] = ratio.split(':')
    return `aspect-[${w}/${h}]`
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

  const clearAllImages = async () => {
    setImages(defaultImages)
    // Clear the server index
    try {
      await fetch('/api/images/save', { method: 'DELETE' })
    } catch (error) {
      console.error('Failed to clear index:', error)
    }
  }

  const generateImage = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          modelId: selectedModel,
          aspectRatio: selectedRatio,
          quality: selectedQuality,
          referenceImage,
        }),
      })

      const data = await response.json()

      if (data.success && data.images && data.images.length > 0) {
        const currentModel = models.find(m => m.id === selectedModel)
        const newImages = data.images.map((img: any, index: number) => ({
          id: `gen-${Date.now()}-${index}`,
          prompt,
          aspectRatio: selectedRatio,
          quality: selectedQuality,
          modelName: currentModel?.name || 'Unknown',
          src: img.url,
          alt: prompt,
          createdAt: Date.now(),
        }))
        const updatedImages = [...newImages, ...images]
        setImages(updatedImages)
        // Save to server instead of localStorage
        await saveImagesToServer(updatedImages)
        setPrompt('')
        setReferenceImage(null)
      } else {
        console.error('Generation failed:', data.error)
        alert(`Generation failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Request error:', error)
      alert(`Request error: ${(error as Error).message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      generateImage()
    }
  }

  const currentModel = models.find(m => m.id === selectedModel)

  return (
    <main className="ml-20 min-h-screen px-12 pt-12 pb-48">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <p className="font-headline text-sm font-semibold text-primary tracking-tight mb-1 uppercase">
            Workbench
          </p>
          <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tighter">
            Image Studio
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-md text-sm font-medium"
            onClick={clearAllImages}
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Reset
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Initial loading placeholder */}
        {isLoading && (
          <div className="flex flex-col gap-4 group animate-pulse col-span-full">
            <div className="w-full h-32 bg-surface-container-low rounded-xl flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-on-surface-variant">Loading images...</span>
            </div>
          </div>
        )}

        {/* Loading placeholder when generating */}
        {!isLoading && isGenerating && (
          <div className="flex flex-col gap-4 group animate-pulse">
            <div className="relative overflow-hidden rounded-xl bg-surface-container-low">
              <div className="aspect-[1/1] bg-surface-container-high rounded-xl flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-surface-container-high rounded w-3/4"></div>
              <div className="h-3 bg-surface-container-high rounded w-full"></div>
            </div>
          </div>
        )}

        {!isLoading && images.map((image) => (
          <div key={image.id} className="flex flex-col gap-4 group">
            <div className="relative overflow-hidden rounded-xl bg-surface-container-low">
              <div
                className={`overflow-hidden ${getAspectClass(image.aspectRatio)}`}
              >
                <img
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={image.src}
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300 gap-3">
                <a
                  href={image.src}
                  download
                  className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface shadow-lg"
                >
                  <span className="material-symbols-outlined text-xl">download</span>
                </a>
                <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface shadow-lg">
                  <span className="material-symbols-outlined text-xl">refresh</span>
                </button>
              </div>
              <div className="absolute top-4 right-4 glass-panel px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-[14px]">
                  {getIconName(image.aspectRatio)}
                </span>
                <span className="text-[10px] font-bold">{image.aspectRatio}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-on-surface-variant line-clamp-2 italic leading-relaxed">
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
        ))}
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 flex flex-col items-center gap-3 z-[100]">
        {/* Configuration Bar */}
        <div className="w-full glass-panel rounded-xl shadow-2xl p-3 flex items-center gap-3 scale-95 origin-bottom animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Model Selection */}
          <div className="relative flex-1 min-w-[180px]">
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
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-surface-container-highest rounded-lg shadow-xl border border-outline-variant/10 overflow-hidden">
                {models.map((model) => (
                  <button
                    key={model.id}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-primary-container transition-colors ${
                      selectedModel === model.id ? 'bg-primary-container/50' : ''
                    }`}
                    onClick={() => {
                      setSelectedModel(model.id)
                      setIsModelOpen(false)
                    }}
                  >
                    <div className="font-semibold text-on-surface">{model.name}</div>
                    <div className="text-xs text-on-surface-variant">{model.description}</div>
                  </button>
                ))}
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
        <div className="w-full glass-panel rounded-2xl shadow-2xl flex items-center p-2 pl-4 gap-3 ring-1 ring-white/50">
          {/* Reference Image Upload */}
          <label className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors cursor-pointer">
            <span className="material-symbols-outlined">image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <div className="h-6 w-[1px] bg-outline-variant/30"></div>

          {/* Prompt Input */}
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder-on-surface-variant/50 text-sm font-medium"
            placeholder="Describe your vision... (Press Enter to generate)"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
          />

          {/* Generate Button */}
          <button
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-on-primary shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={generateImage}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <span className="w-6 h-6 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            )}
          </button>
        </div>
      </div>

      <footer className="fixed bottom-0 right-0 p-8 z-0">
        <p className="font-manrope text-[10px] font-bold text-outline-variant uppercase tracking-[0.2em] opacity-30 select-none">
          eleAI Studio // The Digital Curator
        </p>
      </footer>
    </main>
  )
}
