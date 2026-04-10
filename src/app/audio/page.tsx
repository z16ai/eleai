'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import allVoices, { VoiceInfo, CustomVoice } from './voices'

interface GeneratedAudio {
  id: string
  text: string
  modelId: string
  voiceId: string
  voiceName: string
  audioUrl: string
  duration: number
  createdAt: number
  status: 'generating' | 'succeeded' | 'failed'
  error?: string
}

const models = [
  { id: 'doubao-text-to-speech/seed-tts-1.0-concurr', name: 'Seed TTS 1.0 Concurrent', description: 'Stable version with rich emotional expression (concurrent)' },
  { id: 'doubao-text-to-speech/seed-tts-1.0', name: 'Seed TTS 1.0', description: 'Stable version with rich emotional expression' },
  { id: 'doubao-text-to-speech/seed-tts-2.0', name: 'Seed TTS 2.0', description: 'Latest version with better naturalness' },
]

const cloneModels = [
  { id: 'doubao-audio-speech-clone/seed-icl-1.0-concurr', name: 'ICL 1.0 Concurrent', description: 'Stable voice cloning (concurrent)' },
  { id: 'doubao-audio-speech-clone/seed-icl-1.0', name: 'ICL 1.0', description: 'Stable voice cloning' },
  { id: 'doubao-audio-speech-clone/seed-icl-2.0', name: 'ICL 2.0 Character', description: 'Character-based voice cloning' },
]

type GenderFilter = 'all' | 'male' | 'female'
type AgeFilter = 'all' | 'child' | 'young' | 'middle' | 'senior'
type LanguageFilter = 'all' | 'zh' | 'en' | 'jp' | 'es' | 'other'
type SceneFilter = 'all' | 'narration' | 'conversation' | 'advertising' | 'storytelling' | 'roleplay' | 'education' | 'customerService' | 'audiobook' | 'dubbing' | 'general'

export default function AudioLab() {
  const [text, setText] = useState('')
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null)
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all')
  const [ageFilter, setAgeFilter] = useState<AgeFilter>('all')
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('all')
  const [sceneFilter, setSceneFilter] = useState<SceneFilter>('all')
  const [customVoices, setCustomVoices] = useState<CustomVoice[]>([])
  const [generatedAudios, setGeneratedAudios] = useState<GeneratedAudio[]>([])
  const [generatingQueue, setGeneratingQueue] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCloneModal, setShowCloneModal] = useState(false)
  const [selectedCloneModel, setSelectedCloneModel] = useState(cloneModels[0].id)
  const [editingVoiceId, setEditingVoiceId] = useState<string | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const processingRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const queueRef = useRef<string[]>([])
  const audiosRef = useRef<GeneratedAudio[]>([])
  const customVoicesRef = useRef<CustomVoice[]>([])
  const processQueueRef = useRef<(() => void) | null>(null)

  // Keep refs always up to date - update immediately
  queueRef.current = generatingQueue
  audiosRef.current = generatedAudios
  customVoicesRef.current = customVoices

  // Stop current generation
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setGeneratingQueue([])
    processingRef.current = false
  }, [])

  // Load saved data
  useEffect(() => {
    async function loadData() {
      try {
        const [audioRes, voicesRes] = await Promise.all([
          fetch('/api/audio/list'),
          fetch('/api/audio/voices/list'),
        ])
        const audioData = await audioRes.json()
        const voicesData = await voicesRes.json()
        if (audioData.success) {
          // Mark stale tasks (older than 24h) as failed - they won't complete after page refresh
          const twentyFourHours = 24 * 60 * 60 * 1000
          const now = Date.now()
          const updatedAudios = audioData.audios.map((audio: GeneratedAudio) => {
            if (audio.status === 'generating' && now - audio.createdAt > twentyFourHours) {
              return { ...audio, status: 'failed' as const, error: 'Timeout - stale task' }
            }
            return audio
          })
          // Collect any non-completed tasks to add to queue
          const staleQueue = updatedAudios
            .filter((a: GeneratedAudio) => a.status === 'generating')
            .map((a: GeneratedAudio) => a.id)
          setGeneratedAudios(updatedAudios)
          if (staleQueue.length > 0) {
            setGeneratingQueue(staleQueue)
            setTimeout(() => processQueueRef.current?.(), 0)
          }
        }
        if (voicesData.success) {
          setCustomVoices(voicesData.voices)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Save generated audios
  const saveAudios = useCallback(async (audios: GeneratedAudio[]) => {
    try {
      await fetch('/api/audio/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audios }),
      })
    } catch (error) {
      console.error('Failed to save audios:', error)
    }
  }, [])

  // Save custom voices
  const saveCustomVoices = useCallback(async (voices: CustomVoice[]) => {
    try {
      await fetch('/api/audio/voices/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voices }),
      })
    } catch (error) {
      console.error('Failed to save custom voices:', error)
    }
  }, [])

  // Filter voices based on current filters and selected model
  const filteredVoices = allVoices.filter(voice => {
    // Filter by model support
    if (!voice.modelSupport.includes(selectedModel as any)) {
      return false
    }
    if (genderFilter !== 'all' && voice.gender !== genderFilter) {
      return false
    }
    if (ageFilter !== 'all' && voice.age !== ageFilter) {
      return false
    }
    if (languageFilter !== 'all' && voice.language !== languageFilter) {
      return false
    }
    if (sceneFilter !== 'all' && voice.scene !== sceneFilter) {
      return false
    }
    return true
  })

  // Generate audio
  const generateAudio = () => {
    if (!text.trim() || !selectedVoice) return

    const id = `audio-${Date.now()}`
    const allOptions = [...allVoices, ...customVoices]
    const voiceInfo = allOptions.find(v => v.id === selectedVoice) as (VoiceInfo | CustomVoice) | undefined
    const voiceName = voiceInfo?.name || ''

    const newAudio: GeneratedAudio = {
      id,
      text,
      modelId: selectedModel,
      voiceId: selectedVoice,
      voiceName,
      audioUrl: '',
      duration: 0,
      createdAt: Date.now(),
      status: 'generating',
    }

    setGeneratedAudios(prevAudios => {
      const updatedAudios = [newAudio, ...prevAudios]
      saveAudios(updatedAudios)
      return updatedAudios
    })
    setText('')
    setGeneratingQueue(prev => [...prev, id])
    // Trigger processing
    setTimeout(processQueue, 0)
  }

  // Process queue
  const processQueue = useCallback(() => {
    if (processingRef.current || queueRef.current.length === 0) return

    processingRef.current = true
    const taskId = queueRef.current[0]
    setGeneratingQueue(prev => prev.slice(1))

    const audio = audiosRef.current.find(a => a.id === taskId)
    if (!audio) {
      processingRef.current = false
      setTimeout(processQueue, 0)
      return
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    const doProcess = async () => {
      try {
        const allVoicesWithCustom: (VoiceInfo | CustomVoice)[] = [...allVoices, ...customVoicesRef.current]
        const voice = allVoicesWithCustom.find(v => v.id === audio.voiceId)
        if (!voice || !('speakerId' in voice)) {
          throw new Error('Voice not found')
        }

        const res = await fetch('/api/audio/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: audio.text,
            modelId: audio.modelId,
            voiceId: voice.speakerId,
          }),
          signal: abortController.signal,
        })

        const data = await res.json()

        if (!abortController.signal.aborted) {
          if (data.success) {
            setGeneratedAudios(prevAudios => {
              const updatedAudios = prevAudios.map(a =>
                a.id === taskId
                  ? { ...a, status: 'succeeded' as const, audioUrl: data.audioUrl, duration: data.duration }
                  : a
              )
              saveAudios(updatedAudios)
              return updatedAudios
            })
          } else {
            setGeneratedAudios(prevAudios => {
              const updatedAudios = prevAudios.map(a =>
                a.id === taskId ? { ...a, status: 'failed' as const, error: data.error } : a
              )
              saveAudios(updatedAudios)
              return updatedAudios
            })
          }
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Generation error:', error)
          if (!abortController.signal.aborted) {
            setGeneratedAudios(prevAudios => {
              const updatedAudios = prevAudios.map(a =>
                a.id === taskId ? { ...a, status: 'failed' as const } : a
              )
              saveAudios(updatedAudios)
              return updatedAudios
            })
          }
        }
      } finally {
        if (!abortController.signal.aborted) {
          processingRef.current = false
          abortControllerRef.current = null
          // Process next item - use queued ref to avoid dependency issues
          setTimeout(() => {
            if (!processingRef.current && queueRef.current.length > 0) {
              processQueue()
            }
          }, 0)
        }
      }
    }

    doProcess()
  }, [saveAudios])

  // Keep ref updated
  processQueueRef.current = processQueue

  // Handle voice clone upload
  const handleCloneUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes('mpeg') && !file.type.includes('mp3')) {
      setToastMessage('Only MP3 format is supported')
      setTimeout(() => setToastMessage(null), 2000)
      return
    }

    const formData = new FormData()
    formData.append('audio', file)
    formData.append('modelId', selectedCloneModel)

    try {
      const res = await fetch('/api/audio/clone', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        const newCustomVoice: CustomVoice = {
          id: `custom-${Date.now()}`,
          name: '我的音色',
          modelId: selectedCloneModel,
          speakerId: data.speakerId,
          sampleUrl: data.sampleUrl,
          createdAt: Date.now(),
        }
        const updatedVoices = [...customVoices, newCustomVoice]
        setCustomVoices(updatedVoices)
        saveCustomVoices(updatedVoices)
        setShowCloneModal(false)
        setToastMessage('Voice cloned successfully!')
        setTimeout(() => setToastMessage(null), 2000)
      } else {
        setToastMessage(data.error || 'Failed to clone voice')
        setTimeout(() => setToastMessage(null), 3000)
      }
    } catch (error) {
      console.error('Clone error:', error)
      setToastMessage('Failed to clone voice')
      setTimeout(() => setToastMessage(null), 3000)
    }

    // Clear input
    e.target.value = ''
  }

  // Rename custom voice
  const renameVoice = (id: string, newName: string) => {
    const updatedVoices = customVoices.map(v =>
      v.id === id ? { ...v, name: newName } : v
    )
    setCustomVoices(updatedVoices)
    saveCustomVoices(updatedVoices)
    setEditingVoiceId(null)
  }

  // Delete custom voice
  const deleteVoice = (id: string) => {
    const updatedVoices = customVoices.filter(v => v.id !== id)
    setCustomVoices(updatedVoices)
    saveCustomVoices(updatedVoices)
    if (selectedVoice === id) {
      setSelectedVoice(null)
    }
    setToastMessage('Voice deleted')
    setTimeout(() => setToastMessage(null), 2000)
  }

  // Toggle play/pause
  const togglePlay = (audio: GeneratedAudio) => {
    if (audio.status !== 'succeeded') return

    if (currentlyPlaying === audio.id) {
      audioRef.current?.pause()
      setCurrentlyPlaying(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const newAudio = new Audio(audio.audioUrl)
      newAudio.play()
      audioRef.current = newAudio
      setCurrentlyPlaying(audio.id)
      newAudio.onended = () => {
        setCurrentlyPlaying(null)
      }
    }
  }

  // Regenerate
  const regenerate = (audio: GeneratedAudio) => {
    setText(audio.text)
    setSelectedVoice(audio.voiceId)
    setSelectedModel(audio.modelId)
  }

  const currentModelName = models.find(m => m.id === selectedModel)?.name

  return (
    <main className="min-h-screen px-12 pt-20 pb-8 bg-surface-container-low">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <p className="font-headline text-sm font-semibold text-primary tracking-tight mb-1 uppercase">
            Workbench
          </p>
          <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tighter">
            Audio Lab
          </h1>
        </div>
        {generatingQueue.length > 0 && (
          <span className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-md">
            {generatingQueue.length} {generatingQueue.length === 1 ? 'in queue' : 'in queue'}
          </span>
        )}
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Filters */}
        <div className="lg:col-span-3">
          <div className="glass-panel rounded-xl p-4 shadow-xl sticky top-10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
              Select Model
            </h4>
            <div className="relative mb-6" onMouseLeave={() => setIsModelOpen(false)}>
              <button
                className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-surface-container-high rounded-lg text-sm font-medium hover:bg-surface-container-highest transition-colors"
                onClick={() => setIsModelOpen(!isModelOpen)}
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm text-on-surface font-semibold">{models.find(m => m.id === selectedModel)?.name}</span>
                </div>
                <span className="material-symbols-outlined">expand_more</span>
              </button>
              {isModelOpen && (
                <div className="absolute top-full left-0 right-0 bg-surface-container-highest rounded-lg shadow-xl border border-outline-variant/10 overflow-hidden z-20">
                  <div className="p-2 space-y-1">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedModel === model.id
                            ? 'bg-primary-container text-on-primary-container'
                            : 'hover:bg-surface-container text-on-surface'
                        }`}
                        onClick={() => {
                          setSelectedModel(model.id)
                          setSelectedVoice(null)
                          setIsModelOpen(false)
                        }}
                      >
                        <div className="font-semibold">{model.name}</div>
                        <div className="text-xs text-on-surface-variant">{model.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
              Filter Voices
            </h4>

            {/* Gender */}
            <div className="mb-4">
              <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-2">Gender</label>
              <div className="flex gap-1 flex-wrap">
                {(['all', 'male', 'female'] as GenderFilter[]).map((g) => (
                  <button
                    key={g}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      genderFilter === g
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant'
                    }`}
                    onClick={() => setGenderFilter(g)}
                  >
                    {g === 'all' ? 'All' : g === 'male' ? 'Male' : 'Female'}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="mb-4">
              <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-2">Age</label>
              <div className="flex gap-1 flex-wrap">
                {(['all', 'child', 'young', 'middle', 'senior'] as AgeFilter[]).map((a) => (
                  <button
                    key={a}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      ageFilter === a
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant'
                    }`}
                    onClick={() => setAgeFilter(a)}
                  >
                    {a === 'all' ? 'All' : a.charAt(0).toUpperCase() + a.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="mb-4">
              <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-2">Language</label>
              <div className="flex gap-1 flex-wrap">
                {(['all', 'zh', 'en', 'jp', 'es', 'other'] as LanguageFilter[]).map((l) => (
                  <button
                    key={l}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      languageFilter === l
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant'
                    }`}
                    onClick={() => setLanguageFilter(l)}
                  >
                    {l === 'all' ? 'All' : l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Scene */}
            <div className="mb-6">
              <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-2">Scene</label>
              <div className="flex gap-1 flex-wrap">
                {(['all', 'narration', 'conversation', 'advertising', 'storytelling', 'roleplay', 'general'] as SceneFilter[]).map((s) => (
                  <button
                    key={s}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      sceneFilter === s
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant'
                    }`}
                    onClick={() => setSceneFilter(s)}
                  >
                    {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-outline-variant/20 pt-4">
              <label className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:bg-primary-dim transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-base">upload_file</span>
                Clone New Voice
                <input
                  type="file"
                  accept=".mp3,audio/mpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // TODO: handle file upload
                    }
                  }}
                />
              </label>
              <p className="text-xs text-on-surface-variant mt-2 text-center">Supports mp3 format</p>
            </div>
          </div>
        </div>

        {/* Right: Voice list and generated audio */}
        <div className="lg:col-span-9 space-y-6">
          {/* Voice Selection Grid */}
          <div className="bg-surface-container rounded-xl p-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-on-surface">
                Selected Model: <span className="text-primary">{currentModelName}</span>
              </h4>
              <span className="text-xs text-on-surface-variant">
                {filteredVoices.length} voice{filteredVoices.length !== 1 ? 's' : ''} found
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredVoices.map((voice) => (
                <div
                  key={voice.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedVoice === voice.id
                      ? 'bg-primary-container border-primary/30'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                  }`}
                  onClick={() => setSelectedVoice(voice.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-semibold ${selectedVoice === voice.id ? 'text-on-primary-container' : 'text-on-surface'}`}>
                        {voice.name}
                      </p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                          selectedVoice === voice.id
                            ? 'bg-on-primary-container/20 text-on-primary-container'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {voice.gender === 'male' ? '♂ Male' : '♀ Female'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                          selectedVoice === voice.id
                            ? 'bg-on-primary-container/20 text-on-primary-container'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {voice.age}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                          selectedVoice === voice.id
                            ? 'bg-on-primary-container/20 text-on-primary-container'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {voice.scene}
                        </span>
                      </div>
                    </div>
                    {selectedVoice === voice.id && (
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Voices */}
          {customVoices.length > 0 && (
            <div className="bg-surface-container rounded-xl p-4 shadow-lg">
              <h4 className="text-sm font-bold text-on-surface mb-4">My Voices ({customVoices.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {customVoices.map((voice) => (
                  <div
                    key={voice.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedVoice === voice.id
                        ? 'bg-primary-container border-primary/30'
                        : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                    }`}
                    onClick={() => setSelectedVoice(voice.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {editingVoiceId === voice.id ? (
                          <input
                            type="text"
                            defaultValue={voice.name}
                            className="w-full bg-surface-container border border-primary rounded px-2 py-1 text-sm text-on-surface"
                            autoFocus
                            onBlur={(e) => renameVoice(voice.id, e.target.value || '我的音色')}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                renameVoice(voice.id, e.currentTarget.value || '我的音色')
                              }
                            }}
                          />
                        ) : (
                          <p
                            className={`text-sm font-semibold ${selectedVoice === voice.id ? 'text-on-primary-container' : 'text-on-surface'}`}
                            onDoubleClick={() => setEditingVoiceId(voice.id)}
                          >
                            {voice.name}
                          </p>
                        )}
                        <p className={`text-xs mt-1 ${selectedVoice === voice.id ? 'text-on-primary-container/70' : 'text-on-surface-variant'}`}>
                          {voice.modelId.includes('1.0') ? 'ICL 1.0' : 'ICL 2.0'}
                        </p>
                      </div>
                      <button
                        className="text-error p-1 -mt-1 -mr-1 hover:bg-error/10 rounded"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteVoice(voice.id)
                        }}
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text Input */}
          <div className="bg-surface-container rounded-xl p-4 shadow-lg">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Text to Synthesize
            </h4>
            <textarea
              className="w-full min-h-[120px] bg-surface-container-low rounded-lg p-3 border-none focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50 text-sm resize-none"
              placeholder="Enter your text here to convert to speech..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              {processingRef.current || generatingQueue.length > 0 ? (
                <button
                  className="px-6 py-2.5 bg-error text-on-error rounded-lg font-bold text-sm shadow-lg shadow-error/20 hover:bg-error/90 transition-all"
                  onClick={stopGeneration}
                >
                  Stop Generation
                  <span className="material-symbols-outlined text-base ml-2">stop</span>
                </button>
              ) : (
                <button
                  className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={generateAudio}
                  disabled={!text.trim() || !selectedVoice}
                >
                  Generate
                  <span className="material-symbols-outlined text-base ml-2">auto_awesome</span>
                </button>
              )}
            </div>
          </div>

          {/* Generated Audio List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-on-surface">Generated Audio</h4>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 bg-surface-container-high rounded-xl"></div>
                ))}
              </div>
            ) : generatedAudios.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-outline-variant/30 rounded-xl opacity-60">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">audio_file</span>
                <p className="text-on-surface-variant text-sm">No generated audio yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {generatedAudios.map((audio) => (
                  <div
                    key={audio.id}
                    className="bg-surface-container rounded-xl p-4 shadow-lg flex items-center gap-4"
                  >
                    <button
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        audio.status === 'succeeded'
                          ? currentlyPlaying === audio.id
                            ? 'bg-primary border-primary text-on-primary'
                            : 'border-primary text-primary hover:bg-primary/10'
                          : 'border-outline-variant text-on-surface-variant bg-surface-container-low'
                      }`}
                      onClick={() => togglePlay(audio)}
                      disabled={audio.status !== 'succeeded'}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {currentlyPlaying === audio.id ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div className="flex-1">
                      <p className="text-sm text-on-surface-variant line-clamp-1">
                        {audio.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-on-surface-variant">
                          {audio.voiceName} • {Math.round(audio.duration * 60)}s
                        </span>
                        {audio.status === 'generating' && (
                          <span className="text-xs text-primary animate-pulse">Generating...</span>
                        )}
                        {audio.status === 'failed' && (
                          <span className="text-xs text-error">Failed</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Generate buttons: succeeded (regenerate, download, delete), failed (regenerate, delete) */}
                      {audio.status === 'succeeded' && (
                        <>
                          <button
                            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                            onClick={() => regenerate(audio)}
                            title="Regenerate with this text and voice"
                          >
                            <span className="material-symbols-outlined">refresh</span>
                          </button>
                          <a
                            href={audio.audioUrl}
                            download
                            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined">download</span>
                          </a>
                          <button
                            className="p-2 text-on-surface-variant hover:text-error transition-colors"
                            onClick={() => {
                              const updated = generatedAudios.filter(a => a.id !== audio.id)
                              setGeneratedAudios(updated)
                              saveAudios(updated)
                            }}
                            title="Delete"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </>
                      )}
                      {audio.status === 'failed' && (
                        <>
                          <button
                            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                            onClick={() => regenerate(audio)}
                            title="Regenerate with this text and voice"
                          >
                            <span className="material-symbols-outlined">refresh</span>
                          </button>
                          <button
                            className="p-2 text-on-surface-variant hover:text-error transition-colors"
                            onClick={() => {
                              const updated = generatedAudios.filter(a => a.id !== audio.id)
                              setGeneratedAudios(updated)
                              saveAudios(updated)
                            }}
                            title="Delete"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </>
                      )}
                      {audio.status === 'failed' && (
                        <>
                          <button
                            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                            onClick={() => regenerate(audio)}
                            title="Regenerate with this text and voice"
                          >
                            <span className="material-symbols-outlined">refresh</span>
                          </button>
                          <button
                            className="p-2 text-on-surface-variant hover:text-error transition-colors"
                            onClick={() => {
                              const updated = generatedAudios.filter(a => a.id !== audio.id)
                              setGeneratedAudios(updated)
                              saveAudios(updated)
                            }}
                            title="Delete"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clone Voice Modal */}
      {showCloneModal && (
        <div
          className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4"
          onClick={() => setShowCloneModal(false)}
        >
          <div
            className="relative bg-surface rounded-2xl overflow-hidden max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-on-surface mb-4">Clone Voice</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Upload an MP3 sample of the voice you want to clone. For best results, use 1-5 minutes of clear audio without background noise.
            </p>

            <div className="mb-4">
              <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-2">
                Clone Model
              </label>
              <div className="space-y-2">
                {cloneModels.map((model) => (
                  <button
                    key={model.id}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCloneModel === model.id
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container hover:bg-surface-container-highest text-on-surface'
                    }`}
                    onClick={() => setSelectedCloneModel(model.id)}
                  >
                    <div className="font-semibold">{model.name}</div>
                    <div className="text-xs text-on-surface-variant">{model.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-2 border-dashed border-outline-variant/40 rounded-xl p-8 text-center mb-4">
              <label className="cursor-pointer block">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">upload_file</span>
                <p className="text-sm text-on-surface-variant mb-1">Click to upload MP3</p>
                <p className="text-xs text-on-surface-variant/70">Supported format: MP3, 1-5 minutes recommended</p>
                <input
                  type="file"
                  accept="audio/mpeg,audio/mp3"
                  className="hidden"
                  onChange={handleCloneUpload}
                />
              </label>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 bg-surface-container-high text-on-surface rounded-lg font-semibold text-sm hover:bg-surface-container-highest transition-colors"
                onClick={() => setShowCloneModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface px-6 py-3 rounded-lg shadow-2xl z-[300] animate-in fade-in slide-in-from-top-4">
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      
    </main>
  )
}
