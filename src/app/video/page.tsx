'use client'

import { useState, useEffect, useCallback, useRef } from 'react'


interface GeneratedVideo {
  id: string
  prompt: string
  modelId: string
  modelName: string
  aspectRatio: string
  duration: number
  resolution: string
  src: string
  firstFrame?: string
  lastFrame?: string
  createdAt: number
  status: 'pending' | 'processing' | 'succeeded' | 'failed'
  provider?: 'volcengine' | 'alibaba'
}

const models = [
  { id: 'doubao-seedance-2-0-260128', name: 'Seedance 2.0 (Volcengine)', description: 'Standard quality video generation' },
  { id: 'doubao-seedance-2-0-fast-260128', name: 'Seedance 2.0 Fast (Volcengine)', description: 'Faster generation with slightly lower quality' },
  { id: 'wanx-text-to-video', name: 'WanXiang Text-to-Video (Alibaba)', description: 'Alibaba Bailian WanXiang video generation' },
]

const aspectRatios = ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16']
const durations = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const resolutions = ['480p', '720p']

export default function VideoStudio() {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const [selectedRatio, setSelectedRatio] = useState('4:3')
  const [selectedDuration, setSelectedDuration] = useState(5)
  const [selectedResolution, setSelectedResolution] = useState('480p')
  const [firstFrame, setFirstFrame] = useState<string | null>(null)
  const [lastFrame, setLastFrame] = useState<string | null>(null)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [isDurationOpen, setIsDurationOpen] = useState(false)
  const [isPromptFocused, setIsPromptFocused] = useState(false)
  const [videos, setVideos] = useState<GeneratedVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [generatingQueue, setGeneratingQueue] = useState<{
    prompt: string
    modelId: string
    aspectRatio: string
    duration: number
    resolution: string
    firstFrame: string | null
    lastFrame: string | null
  }[]>([])
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const processingRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const queueRef = useRef<{
    prompt: string
    modelId: string
    aspectRatio: string
    duration: number
    resolution: string
    firstFrame: string | null
    lastFrame: string | null
  }[]>([])
  const videosRef = useRef<GeneratedVideo[]>([])

  // Keep refs always up to date - update immediately when queue changes
  queueRef.current = generatingQueue
  videosRef.current = videos

  // Get aspect ratio for CSS

  // Stop current generation
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current)
      pollTimeoutRef.current = null
    }
    setGeneratingQueue([])
    processingRef.current = false
  }, [])
  const getAspectClass = (ratio: string) => {
    return ratio.replace(':', '/')
  }

  // Load saved videos
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch('/api/videos/list')
        const data = await res.json()
        if (data.success && data.videos) {
          // Type cast the status to ensure it matches the union type
          // Mark stale processing tasks as failed (page refresh interrupts polling)
          const now = Date.now()
          const loadedVideos: GeneratedVideo[] = data.videos.map((v: any) => {
            const isStale = v.status === 'processing' && (now - v.createdAt) > 24 * 60 * 60 * 1000 // 24 hours
            return {
              ...v,
              status: isStale ? 'failed' : (v.status as GeneratedVideo['status']),
            }
          })
          // Sort by created time descending
          loadedVideos.sort((a, b) => b.createdAt - a.createdAt)
          setVideos(loadedVideos)
        }
      } catch (error) {
        console.error('Failed to load videos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadVideos()
  }, [])

  // Save videos to server
  const saveVideosToServer = useCallback(async (newVideos: GeneratedVideo[]) => {
    try {
      await fetch('/api/videos/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos: newVideos }),
      })
    } catch (error) {
      console.error('Failed to save videos:', error)
    }
  }, [])

  // Poll task status
  const pollStatus = useCallback(async (taskId: string, videoId: string, provider: 'volcengine' | 'alibaba') => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/video/status/${taskId}?provider=${provider}`)
        const data = await res.json()

        if (data.success && data.status === 'succeeded') {
          // Update video with completed URL
          setVideos(prevVideos => {
            const updatedVideos = prevVideos.map(v => {
              if (v.id === videoId) {
                return {
                  ...v,
                  src: data.videoUrl,
                  status: 'succeeded' as const,
                }
              }
              return v
            })
            saveVideosToServer(updatedVideos)
            return updatedVideos
          })
          processingRef.current = false
          // Trigger next in queue - use queued ref to avoid dependency
          setTimeout(() => {
            if (!processingRef.current && queueRef.current.length > 0) {
              processQueue()
            }
          }, 0)
          return
        } else if (data.success && data.status === 'failed') {
          setVideos(prevVideos => {
            const updatedVideos = prevVideos.map(v =>
              v.id === videoId ? { ...v, status: 'failed' as const } : v
            )
            saveVideosToServer(updatedVideos)
            return updatedVideos
          })
          processingRef.current = false
          setTimeout(() => {
            if (!processingRef.current && queueRef.current.length > 0) {
              processQueue()
            }
          }, 0)
          return
        }
      } catch (error) {
        console.error('Status check error:', error)
      }

      // Continue polling every 3 minutes indefinitely
      pollTimeoutRef.current = setTimeout(checkStatus, 3 * 60 * 1000)
    }

    checkStatus()
  }, [saveVideosToServer])

  // Process queue sequentially
  const processQueue = useCallback(() => {
    if (processingRef.current || queueRef.current.length === 0) return

    processingRef.current = true
    const nextItem = queueRef.current[0]
    setGeneratingQueue(prev => prev.slice(1))

    // Determine provider
    const provider: 'volcengine' | 'alibaba' = nextItem.modelId === 'wanx-text-to-video' ? 'alibaba' : 'volcengine'

    // Add placeholder video
    const newVideo: GeneratedVideo = {
      id: `vid-${Date.now()}`,
      prompt: nextItem.prompt,
      modelId: nextItem.modelId,
      modelName: models.find(m => m.id === nextItem.modelId)?.name || 'Unknown',
      aspectRatio: nextItem.aspectRatio,
      duration: nextItem.duration,
      resolution: nextItem.resolution,
      src: '',
      firstFrame: nextItem.firstFrame ?? undefined,
      lastFrame: nextItem.lastFrame ?? undefined,
      createdAt: Date.now(),
      status: 'processing' as const,
      provider,
    }

    setVideos(prevVideos => {
      const updatedVideos = [newVideo, ...prevVideos]
      saveVideosToServer(updatedVideos)
      return updatedVideos
    })
    // Clear input
    setPrompt('')
    setFirstFrame(null)
    setLastFrame(null)

    const doProcess = async () => {
      try {
        // Start generation
        const res = await fetch('/api/video/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nextItem),
        })

        const data = await res.json()

        if (data.success && data.taskId) {
          // Poll for completion
          pollStatus(data.taskId, newVideo.id, provider)
        } else {
          console.error('Generation failed:', data.error)
          // Mark as failed
          setVideos(prevVideos => {
            const failedVideos = prevVideos.map(v =>
              v.id === newVideo.id ? { ...v, status: 'failed' as const } : v
            )
            saveVideosToServer(failedVideos)
            return failedVideos
          })
          processingRef.current = false
          setTimeout(() => {
            if (!processingRef.current && queueRef.current.length > 0) {
              processQueue()
            }
          }, 0)
        }
      } catch (error) {
        console.error('Generation error:', error)
        setVideos(prevVideos => {
          const failedVideos = prevVideos.map(v =>
            v.id === newVideo.id ? { ...v, status: 'failed' as const } : v
          )
          saveVideosToServer(failedVideos)
          return failedVideos
        })
        processingRef.current = false
        setTimeout(() => {
          if (!processingRef.current && queueRef.current.length > 0) {
            processQueue()
          }
        }, 0)
      }
    }

    doProcess()
  }, [saveVideosToServer, pollStatus])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff', 'image/gif'].includes(file.type)
    )

    imageFiles.forEach((file, index) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (index === 0) {
          setFirstFrame(reader.result as string)
        } else if (index === 1) {
          setLastFrame(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    })

    // Clear the input value so the same file can be uploaded again
    e.target.value = ''
  }

  const removeFirstFrame = () => {
    setFirstFrame(null)
  }

  const removeLastFrame = () => {
    setLastFrame(null)
  }

  const queueGenerate = () => {
    if (!prompt.trim()) return

    setGeneratingQueue(prev => [
      ...prev,
      {
        prompt,
        modelId: selectedModel,
        aspectRatio: selectedRatio,
        duration: selectedDuration,
        resolution: selectedResolution,
        firstFrame,
        lastFrame,
      },
    ])
    // Trigger processing
    setTimeout(processQueue, 0)
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

  const regenerateFromVideo = (video: GeneratedVideo) => {
    setPrompt(video.prompt)
    setSelectedModel(video.modelId)
    setSelectedRatio(video.aspectRatio)
    setSelectedDuration(video.duration)
    setSelectedResolution(video.resolution)
    setFirstFrame(video.firstFrame || null)
    setLastFrame(video.lastFrame || null)
    // Don't auto-generate
  }

  const currentModel = models.find(m => m.id === selectedModel)

  return (
    <main className="min-h-screen px-12 pt-20 pb-48">
      <header className="flex justify-between items-end mb-12">
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
        {generatingQueue.length > 0 && (
          <span className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-md">
            {generatingQueue.length} {generatingQueue.length === 1 ? 'in queue' : 'in queue'}
          </span>
        )}
      </header>

      <div className="flex justify-center mt-20">
        <h1 className="text-4xl font-bold text-slate-400">VIDEO CREATION: COMING IN PHASE 2</h1>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
        {!isLoading && videos.map((video) => {
          return (
            <div
              key={video.id}
              className="break-inside-avoid flex flex-col gap-4 group break-inside-away"
            >
              <div className="relative overflow-hidden rounded-xl bg-surface-container-low">
                <div
                  className={`relative overflow-hidden aspect-[${getAspectClass(video.aspectRatio)}]`}
                  onClick={() => video.status === 'succeeded' && setSelectedVideo(video)}
                >
                  {video.status === 'processing' ? (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-on-surface-variant">Generating...</span>
                      </div>
                    </div>
                  ) : video.status === 'failed' ? (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-error">error</span>
                        <span className="text-sm text-on-surface-variant">Generation failed</span>
                      </div>
                    </div>
                  ) : (
                    <video
                      src={video.src}
                      className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
                      controls
                      muted
                    />
                  )}
                  {/* Action buttons in top-right */}
                  {video.status === 'succeeded' && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center bg-black/40 backdrop-blur-sm rounded-lg p-1 gap-1">
                      <a
                        href={video.src}
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
                          regenerateFromVideo(video)
                        }}
                        className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                        title="Regenerate"
                      >
                        <span className="material-symbols-outlined text-base">refresh</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2 px-1">
                <p
                  className="text-sm text-on-surface-variant line-clamp-2 italic leading-relaxed cursor-pointer hover:text-on-surface transition-colors"
                  onClick={() => copyPrompt(video.prompt)}
                >
                  &quot;{video.prompt}&quot;
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-1 bg-primary-container/50 text-on-primary-container text-[9px] font-bold rounded-full uppercase tracking-wide">
                    {video.modelName}
                  </span>
                  <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[9px] font-bold rounded-full">
                    {video.aspectRatio}
                  </span>
                  <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[9px] font-bold rounded-full">
                    {video.duration}s
                  </span>
                  <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[9px] font-bold rounded-full">
                    {video.resolution}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Generation controls */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 flex flex-col items-center gap-3 z-[100]">
        {/* Model, Aspect Ratio, Resolution, Duration - all in one card */}
        <div className="w-full glass-panel rounded-2xl shadow-2xl p-3 flex flex-wrap items-center gap-3 border border-white/40 ring-1 ring-on-surface/5 opacity-50 pointer-events-none">
          {/* Model selection */}
          <div className="relative flex-1 min-w-[240px]">
            <button
              className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-surface-container-high rounded-lg text-sm font-medium cursor-not-allowed"
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wide">Model</span>
                <span className="text-sm text-on-surface font-semibold">{currentModel?.name}</span>
              </div>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          <div className="h-8 w-px bg-on-surface/10"></div>

          {/* Duration dropdown */}
          <div className="relative min-w-[100px]">
            <button
              className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-surface-container-high rounded-lg text-sm font-medium cursor-not-allowed"
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wide">Duration</span>
                <span className="text-sm text-on-surface font-semibold">{selectedDuration}s</span>
              </div>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          <div className="h-8 w-px bg-on-surface/10"></div>

          {/* Aspect Ratio */}
          <div className="flex items-center gap-1 flex-wrap">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all min-w-[40px] ${
                  selectedRatio === ratio
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                }`}
                disabled
              >
                {ratio}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-on-surface/10"></div>

          {/* Resolution */}
          <div className="flex items-center gap-1">
            {resolutions.map((res) => (
              <button
                key={res}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedResolution === res
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                }`}
                disabled
              >
                {res}
              </button>
            ))}
          </div>
        </div>

        {/* Upload + Prompt Generate card */}
        <div className="w-full glass-panel rounded-2xl p-2 flex items-center gap-3 shadow-2xl border border-white/40 ring-1 ring-on-surface/5 opacity-50 pointer-events-none">
          {/* Single + upload button */}
          <label className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container-high text-on-surface-variant cursor-not-allowed shrink-0">
            <span className="material-symbols-outlined text-2xl">add</span>
            <input
              type="file"
              accept=".jpeg,.jpg,.png,.webp,.bmp,.tiff,.gif,.mp4,.mov,.wav,.mp3"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Previews */}
          {(firstFrame || lastFrame) && (
            <>
              <div className="flex items-center gap-2">
                {firstFrame && (
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                    <img src={firstFrame} alt="First frame" className="w-full h-full object-cover" />
                    <button
                      className="absolute -top-1 -right-1 w-4 h-4 bg-on-surface text-surface rounded-full flex items-center justify-center"
                      onClick={removeFirstFrame}
                    >
                      <span className="material-symbols-outlined text-[10px]">close</span>
                    </button>
                  </div>
                )}
                {lastFrame && (
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                    <img src={lastFrame} alt="Last frame" className="w-full h-full object-cover" />
                    <button
                      className="absolute -top-1 -right-1 w-4 h-4 bg-on-surface text-surface rounded-full flex items-center justify-center"
                      onClick={removeLastFrame}
                    >
                      <span className="material-symbols-outlined text-[10px]">close</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="h-6 w-[1px] bg-outline-variant/30"></div>
            </>
          )}

          <textarea
            className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 text-sm font-medium resize-none leading-relaxed opacity-50 cursor-not-allowed"
            style={{
              minHeight: '2.5rem',
              height: 'auto',
            }}
            placeholder="Describe your video animation, motion, camera movement... Supported: images (first/last frame), video, audio"
            value={prompt}
            disabled
            readOnly
          />
          {/* Generate or Stop Button */}
          {processingRef.current ? (
            <button
              className="h-10 px-6 rounded-xl bg-error text-on-error font-bold flex items-center gap-2 shadow-lg shadow-error/20 hover:bg-error/90 transition-all"
              onClick={stopGeneration}
              title="Stop generation"
            >
              Stop
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                stop
              </span>
            </button>
          ) : (
            <button
              className="h-10 px-6 rounded-xl bg-slate-200 text-slate-400 font-bold flex items-center gap-2 cursor-not-allowed"
              disabled
            >
              Generate
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Video Detail Modal */}
      {selectedVideo && selectedVideo.status === 'succeeded' && (
        <div
          className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative bg-surface rounded-2xl overflow-hidden max-w-[90vw] max-h-[85vh] w-[1200px] flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Video */}
            <div className="flex-1 bg-surface-container-low flex items-center justify-center p-6">
              <video
                src={selectedVideo.src}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
                controls
                autoPlay
                muted
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
                      {selectedVideo.prompt}
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
                        {selectedVideo.modelName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Aspect Ratio</span>
                      <span className="text-xs font-semibold text-on-surface">
                        {selectedVideo.aspectRatio}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Duration</span>
                      <span className="text-xs font-semibold text-on-surface">
                        {selectedVideo.duration} seconds
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">Resolution</span>
                      <span className="text-xs font-semibold text-on-surface">
                        {selectedVideo.resolution}
                      </span>
                    </div>
                    {selectedVideo.firstFrame && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-on-surface-variant">First Frame</span>
                        <span className="text-xs font-semibold text-on-surface">
                          Provided
                        </span>
                      </div>
                    )}
                    {selectedVideo.lastFrame && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-on-surface-variant">Last Frame</span>
                        <span className="text-xs font-semibold text-on-surface">
                          Provided
                        </span>
                      </div>
                    )}
                    {selectedVideo.createdAt && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-on-surface-variant">Created</span>
                        <span className="text-xs font-semibold text-on-surface">
                          {new Date(selectedVideo.createdAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-outline-variant/10 space-y-3">
                <a
                  href={selectedVideo.src}
                  download
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:bg-primary-dim transition-colors"
                >
                  <span className="material-symbols-outlined">download</span>
                  Download Video
                </a>
                <button
                  onClick={() => {
                    regenerateFromVideo(selectedVideo)
                    setSelectedVideo(null)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-high text-on-surface rounded-lg font-semibold text-sm hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined">refresh</span>
                  Regenerate
                </button>
                <button
                  onClick={() => setSelectedVideo(null)}
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

      
    </main>
  )
}
