'use client'

import Footer from '@/components/Footer'
import TopNav from '@/components/TopNav'

const phases = [
  {
    phase: 'Phase 1',
    status: 'current',
    items: [
      'Launch Image Creation / Image Editing features',
      'Launch Plaza feature',
      'Launch Email Registration',
      'Integrate Google User Login',
      'eleAI Token Launch',
    ],
  },
  {
    phase: 'Phase 2',
    status: 'upcoming',
    items: [
      'Launch Membership Subscription System',
      'Integrate Metamask, OKX Wallet, Phantom Wallet connections',
      'Launch Plaza Trading feature',
      'Launch Paid Content for Members',
      'Launch Invitation Mechanism',
      'Launch Discount Coupon feature',
    ],
  },
  {
    phase: 'Phase 3',
    status: 'upcoming',
    items: [
      'Open Operations Data Dashboard',
      'Launch Token Holder Reward Program',
    ],
  },
  {
    phase: 'Phase 4',
    status: 'upcoming',
    items: [
      'Launch Video Creation feature',
      'Launch Audio Creation feature',
      'Refine AI Image Creation application scenarios',
      'Refine AI Video Creation application scenarios',
      'Refine AI Audio Creation application scenarios',
    ],
  },
  {
    phase: 'Phase 5',
    status: 'upcoming',
    items: [
      'Launch eleAI Skill, supporting Openclaw, Claude Code and other CLI tool integrations',
      'Deploy eleAI LLM Server',
      'Open eleAI API Service',
    ],
  },
]

const longTermGoals = [
  'Continuously iterate following AI development',
  'Provide the best AI tools for audio-visual creators',
]

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
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                          phase.status === 'current'
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {phase.status === 'current' && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        )}
                        {phase.phase}
                      </div>
                      <div
                        className={`bg-surface-container-low rounded-2xl p-6 lg:p-8 ${
                          phase.status === 'current'
                            ? 'ring-2 ring-primary/30 shadow-lg shadow-primary/10'
                            : ''
                        }`}
                      >
                        <ul className={`space-y-3 ${index % 2 === 0 ? 'lg:pl-0' : ''}`}>
                          {phase.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-on-surface"
                            >
                              <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">
                                {phase.status === 'current' ? 'radio_button_checked' : 'radio_button_unchecked'}
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
                          phase.status === 'current'
                            ? 'bg-primary shadow-lg shadow-primary/50'
                            : 'bg-surface-container-lowest border-2 border-surface-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {phase.status === 'current' ? 'bolt' : 'lock'}
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
                    Long-Term Vision
                  </h2>
                </div>
                <div className="space-y-4">
                  {longTermGoals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-xl">
                          {index === 0 ? 'autorenew' : 'visibility'}
                        </span>
                      </div>
                      <p className="text-white/90 text-sm lg:text-base">{goal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-on-surface-variant text-sm">
                This roadmap is subject to change based on user feedback and market conditions.
              </p>
              <p className="text-on-surface-variant text-sm mt-2">
                Stay tuned for updates!
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
