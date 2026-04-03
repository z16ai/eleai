'use client'

import { useState } from 'react'

interface AudioTrack {
  id: string
  title: string
  model: string
  specs: string
  icon: string
  color: string
  currentTime: string
  duration: string
  tags: string[]
  isPlaying: boolean
  waveform: number[]
}

const sampleTracks: AudioTrack[] = [
  {
    id: '1',
    title: 'Documentary Narrator',
    model: 'VoiceFlux v2.4',
    specs: '48kHz High Fidelity',
    icon: 'person_pin',
    color: 'primary',
    currentTime: '0:45',
    duration: '2:12',
    tags: ['Cinematic', 'Deep Bass'],
    isPlaying: false,
    waveform: [20, 40, 60, 30, 80, 50, 90, 40, 70, 35, 60, 25, 45, 15],
  },
  {
    id: '2',
    title: 'Marketing Social Clip',
    model: 'FastTalk 1.0',
    specs: 'Low Latency',
    icon: 'face_6',
    color: 'tertiary',
    currentTime: '0:12',
    duration: '0:15',
    tags: ['Energetic', 'Female'],
    isPlaying: true,
    waveform: [10, 50, 80, 40, 60, 95, 30, 50, 20],
  },
]

interface VoiceOption {
  id: string
  name: string
  description: string
  selected: boolean
}

const voiceOptions: VoiceOption[] = [
  {
    id: 'james',
    name: 'James (Narrator)',
    description: 'Deep, Professional',
    selected: true,
  },
  {
    id: 'sarah',
    name: 'Sarah (Casual)',
    description: 'Light, Friendly',
    selected: false,
  },
]

export default function AudioLab() {
  const [tracks, setTracks] = useState<AudioTrack[]>(sampleTracks)
  const [text, setText] = useState('')
  const [voices, setVoices] = useState<VoiceOption[]>(voiceOptions)

  const togglePlay = (id: string) => {
    setTracks(
      tracks.map((track) => ({
        ...track,
        isPlaying: track.id === id ? !track.isPlaying : false,
      }))
    )
  }

  const selectVoice = (id: string) => {
    setVoices(
      voices.map((voice) => ({
        ...voice,
        selected: voice.id === id,
      }))
    )
  }

  return (
    <main className="ml-20 flex-1 flex flex-col relative h-screen bg-surface-container-low overflow-y-auto custom-scrollbar pb-32">
      <header className="w-full px-12 pt-10 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold tracking-widest text-primary uppercase">
              Audio Lab
            </span>
            <span className="h-[1px] w-8 bg-primary/30"></span>
          </div>
          <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">
            Digital Voices
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-md bg-surface-container-lowest text-on-surface-variant text-sm font-semibold shadow-sm hover:bg-white transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">history</span>
            Recent
          </button>
          <button className="px-5 py-2.5 rounded-md bg-primary text-on-primary text-sm font-bold shadow-md hover:bg-primary-dim transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span>
            New Session
          </button>
        </div>
      </header>

      <section className="px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="group bg-surface-container-lowest rounded-xl p-8 flex flex-col gap-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined text-outline-variant/40 group-hover:text-primary/40 transition-colors">
                more_vert
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg bg-${track.color}-container flex items-center justify-center text-${track.color}`}>
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {track.icon}
                </span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-on-surface">{track.title}</h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  Model: {track.model} • {track.specs}
                </p>
              </div>
            </div>

            <div className="h-24 flex items-end justify-between gap-1 px-2">
              {track.waveform.map((height, index) => (
                <div
                  key={index}
                  className={`waveform-bar w-full rounded-full ${
                    height > 50
                      ? `bg-${track.color}`
                      : height > 30
                      ? `bg-${track.color}-container`
                      : 'bg-slate-100'
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  className={`w-12 h-12 rounded-full ${
                    track.isPlaying
                      ? `bg-${track.color} text-on-${track.color}`
                      : `border-2 border-${track.color} text-${track.color}`
                  } flex items-center justify-center hover:scale-105 transition-transform`}
                  onClick={() => togglePlay(track.id)}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {track.isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <div className="text-sm font-mono text-on-surface-variant">
                  {track.currentTime} / {track.duration}
                </div>
              </div>
              <div className="flex gap-2">
                {track.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="lg:col-span-2 border-2 border-dashed border-outline-variant/30 rounded-xl p-12 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-outline">audio_file</span>
          </div>
          <p className="font-headline font-semibold text-lg">Convert more text to create entries</p>
          <p className="text-sm text-on-surface-variant mt-1 max-w-xs">
            Your generated audio files will appear here in high-fidelity formats ready for download.
          </p>
        </div>
      </section>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 flex flex-col items-center gap-4 z-40">
        <div className="glass-effect w-full rounded-2xl p-6 shadow-2xl border border-white/20 flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">
              Active Voice Configuration
            </h4>
            <button className="text-xs text-primary font-bold hover:underline">Manage All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {voices.map((voice) => (
              <div
                key={voice.id}
                className={`flex-shrink-0 flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  voice.selected
                    ? 'bg-primary-container border border-primary/20'
                    : 'bg-surface-container hover:bg-surface-container-high border-transparent'
                }`}
                onClick={() => selectVoice(voice.id)}
              >
                <div
                  className={`w-8 h-8 rounded-full ${
                    voice.selected ? 'bg-primary flex items-center justify-center text-white' : 'bg-surface-dim flex items-center justify-center text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {voice.selected ? 'check' : 'person'}
                  </span>
                </div>
                <div>
                  <p className={`text-xs font-bold ${voice.selected ? 'text-on-primary-container' : 'text-on-surface'} leading-none`}>
                    {voice.name}
                  </p>
                  <p
                    className={`text-[10px] ${voice.selected ? 'text-on-primary-container/60' : 'text-on-surface-variant'} mt-1`}
                  >
                    {voice.description}
                  </p>
                </div>
              </div>
            ))}
            <button className="flex-shrink-0 flex items-center gap-3 p-3 border-2 border-dashed border-outline-variant/40 rounded-xl hover:bg-white transition-all group">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-sm">content_copy</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface leading-none">Clone Sound</p>
                <p className="text-[10px] text-on-surface-variant mt-1">Upload Sample</p>
              </div>
            </button>
          </div>
        </div>

        <div className="glass-effect w-full h-16 rounded-xl flex items-center px-4 gap-4 shadow-xl border border-white/30">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <div className="h-6 w-[1px] bg-outline-variant/30"></div>
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder-outline-variant font-medium text-sm"
            placeholder="Text to convert to speech..."
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings_voice</span>
            </button>
            <button className="bg-primary text-on-primary h-10 px-6 rounded-md font-bold text-sm shadow-md flex items-center gap-2 hover:bg-primary-dim transition-all">
              <span>Generate</span>
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
            </button>
          </div>
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
