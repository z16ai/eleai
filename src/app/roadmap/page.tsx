'use client'

import Footer from '@/components/Footer'
import TopNav from '@/components/TopNav'

const phases = [
  {
    phase: 'Phase 1 — Foundation',
    status: 'completed',
    period: 'Completed',
    items: [
      'AI Image Generation',
      'AI Editing',
      'Creator Feed',
      'Social Gallery',
      'Email / Google / Wallet Auth',
      'Token Launch',
    ],
  },
  {
    phase: 'Phase 2 — Monetization Layer',
    status: 'current',
    period: 'April',
    items: [
      'Subscription Pricing',
      'Creator Marketplace',
      'Paid Publishing',
      'Referral System',
      'Coupon Engine',
    ],
  },
  {
    phase: 'Phase 3 — Economy Layer',
    status: 'upcoming',
    period: 'May',
    items: [
      'Revenue Dashboard',
      'Token Reward Program',
      'Staking',
      'Creator Tier System',
      'Reputation Score',
    ],
  },
  {
    phase: 'Phase 4 — Multimodal Expansion',
    status: 'upcoming',
    period: 'June',
    items: [
      'Video Generation',
      'Audio Generation',
      'Scene Templates',
      'Vertical Use Cases',
    ],
  },
  {
    phase: 'Phase 5 — Protocol Expansion',
    status: 'upcoming',
    period: 'Q3 & Q4',
    items: [
      'Skill SDK',
      'CLI Integrations',
      'API Platform',
      'Enterprise AI Workflow',
    ],
  },
  {
    phase: 'Phase 6 — Ecosystem Layer',
    status: 'upcoming',
    period: '2027',
    items: [
      'Third-party Developers',
      'Plugin Ecosystem',
      'Revenue Sharing',
      'AI Agent Marketplace',
    ],
  },
]

const mission = 'To become the operating system for the global AI creator economy.'

export default function RoadmapPage() {
  return (
    <>
      <TopNav />
      <main className="pt-24 min-h-screen">
        <section className="px-8 py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary-container text-on-primary-container rounded-full">
                Roadmap
              </span>
              <h1 className="text-4xl lg:text-5xl font-manrope font-extrabold tracking-tighter text-on-background mb-6">
                The Future of <span className="text-gradient">eleAI Studio</span>
              </h1>
              <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                Building the ultimate AI-powered creative workstation for the next generation of digital artists.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-tertiary to-secondary"></div>

              <div className="space-y-12">
                {phases.map((phase, index) => (
                  <div
                    key={phase.phase}
                    className={`relative flex flex-col ${
                      index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    } gap-8 lg:gap-16`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                      <div
                        className={`inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                          phase.status === 'completed'
                            ? 'bg-success-container text-on-success-container'
                            : phase.status === 'current'
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {phase.status === 'current' && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        )}
                        <span>{phase.phase}</span>
                        <span className="text-xs font-normal opacity-60 ml-1">{phase.period}</span>
                      </div>
                      <div
                        className={`bg-surface-container-low rounded-2xl p-6 lg:p-8 ${
                          phase.status === 'current'
                            ? 'ring-2 ring-primary/30 shadow-lg shadow-primary/10'
                            : phase.status === 'completed'
                            ? 'opacity-70'
                            : ''
                        }`}
                      >
                        <ul className={`space-y-3 ${index % 2 === 0 ? 'lg:pl-0' : ''}`}>
                          {phase.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-on-surface"
                            >
                              <span className={`material-symbols-outlined text-xl flex-shrink-0 mt-0.5 ${
                                phase.status === 'completed' ? 'text-success' : 
                                phase.status === 'current' ? 'text-primary' : 'text-on-surface-variant'
                              }`}>
                                {phase.status === 'completed' ? 'check_circle' : 
                                 phase.status === 'current' ? 'radio_button_checked' : 'radio_button_unchecked'}
                              </span>
                              <span className="text-sm lg:text-base">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="absolute left-8 lg:left-1/2 transform lg:-translate-x-1/2 flex items-center justify-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          phase.status === 'completed'
                            ? 'bg-success shadow-lg shadow-success/50'
                            : phase.status === 'current'
                            ? 'bg-primary shadow-lg shadow-primary/50'
                            : 'bg-surface-container-lowest border-2 border-surface-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {phase.status === 'completed' ? 'check' : 
                           phase.status === 'current' ? 'bolt' : 'lock'}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 hidden lg:block"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-20 relative">
              <div className="absolute inset-0 bg-magic-gradient opacity-10 blur-[80px] rounded-3xl"></div>
              <div className="relative bg-inverse-surface rounded-3xl p-8 lg:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-white text-3xl">flag</span>
                  <h2 className="text-2xl lg:text-3xl font-manrope font-extrabold text-white">
                    Mission
                  </h2>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">
                      rocket_launch
                    </span>
                  </div>
                  <p className="text-white/90 text-sm lg:text-base font-medium">{mission}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}