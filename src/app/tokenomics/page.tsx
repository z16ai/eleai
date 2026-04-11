'use client'

import Footer from '@/components/Footer'
import TopNav from '@/components/TopNav'

export default function Tokenomics() {
  return (
    <>
      <TopNav />
      <main className="pt-24 px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-manrope font-extrabold tracking-tighter mb-4">
            eleAI Tokenomics
          </h1>
          <p className="text-lg text-on-surface-variant mb-12 max-w-2xl">
            Powering the AI Creator Economy
          </p>

          <div className="prose max-w-none">
            <p className="text-lg mb-8">
              The eleAI tokenomics model is <strong>engineered to bridge the gap</strong> between AI utility and Web3 value capture. By aligning the interests of creators, users, and holders, eleAI functions as the <strong>lifeblood</strong> of a decentralized, self-sustaining <strong>economic flywheel</strong>.
            </p>

            <h2 className="text-2xl font-manrope font-bold mt-12 mb-6">1. Token Specifications</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <li><strong>Full Name:</strong> eleAI Protocol Token</li>
              <li><strong>Ticker:</strong> $eleAI</li>
              <li><strong>Total Supply:</strong> 1,000,000,000 (1 Billion)</li>
              <li><strong>Inflation Policy:</strong> <strong>Fixed Supply</strong>; minting is permanently disabled.</li>
              <li><strong>Burn Mechanism:</strong> <strong>Deflationary</strong>; enabled via protocol activity.</li>
            </ul>

            <h2 className="text-2xl font-manrope font-bold mt-12 mb-6">2. Allocation Framework</h2>
            <p className="text-on-surface-variant mb-6">Designed to prioritize community ownership while fueling long-term R&D.</p>
            
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="py-3 px-4 font-bold">Category</th>
                    <th className="py-3 px-4 font-bold">Allocation</th>
                    <th className="py-3 px-4 font-bold">Amount (eleAI)</th>
                    <th className="py-3 px-4 font-bold">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-3 px-4">Pump.fun Genesis</td>
                    <td className="py-3 px-4 font-bold">50%</td>
                    <td className="py-3 px-4">500M</td>
                    <td className="py-3 px-4">Fair launch & decentralized price discovery.</td>
                  </tr>
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-3 px-4">Team</td>
                    <td className="py-3 px-4 font-bold">15%</td>
                    <td className="py-3 px-4">150M</td>
                    <td className="py-3 px-4">12-month cliff, 36-month linear vesting.</td>
                  </tr>
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-3 px-4">Treasury</td>
                    <td className="py-3 px-4 font-bold">15%</td>
                    <td className="py-3 px-4">150M</td>
                    <td className="py-3 px-4">Liquidity, grants, and strategic ops.</td>
                  </tr>
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-3 px-4">Ecosystem Rewards</td>
                    <td className="py-3 px-4 font-bold">10%</td>
                    <td className="py-3 px-4">100M</td>
                    <td className="py-3 px-4">Incentivizing creators & active participation.</td>
                  </tr>
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-3 px-4">Strategic Investors</td>
                    <td className="py-3 px-4 font-bold">5%</td>
                    <td className="py-3 px-4">50M</td>
                    <td className="py-3 px-4">18-month linear vesting.</td>
                  </tr>
                  <tr className="border-b border-outline-variant/10">
                    <td className="py-3 px-4">Marketing & Growth</td>
                    <td className="py-3 px-4 font-bold">5%</td>
                    <td className="py-3 px-4">50M</td>
                    <td className="py-3 px-4">Global brand expansion & partnerships.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-manrope font-bold mt-12 mb-6">3. Value Accrual & Deflationary Mechanics</h2>
            <p className="mb-6">eleAI captures protocol value through direct economic links to platform growth.</p>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>20% Revenue Buyback</span>
            </h3>
            <p className="mb-6">20% of net platform revenue (from AI usage fees and marketplace commissions) is dedicated to <strong>open-market buybacks</strong>.</p>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>Perpetual Burn Program</span>
            </h3>
            <p className="mb-4">A percentage of all economic activity is <strong>permanently removed from circulation</strong> to drive scarcity:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li><strong>Marketplace Fees:</strong> 5% of transaction fees are burned.</li>
              <li><strong>AI Usage Fees:</strong> 5% of content generation fees are burned.</li>
            </ul>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>Staking Multipliers</span>
            </h3>
            <p className="mb-4">Stake $eleAI to unlock tiered rewards, governance rights, and AI performance boosts:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li><strong>Flexible:</strong> 1.0x Base Yield.</li>
              <li><strong>90 Days:</strong> 1.15x Yield + Fee Discounts.</li>
              <li><strong>180 Days:</strong> 1.25x Yield + <strong>Priority HD Rendering</strong> & Governance Power.</li>
            </ul>

            <h2 className="text-2xl font-manrope font-bold mt-12 mb-6">4. Genesis Loyalty Bonus</h2>
            <p className="mb-4">Early adopters from the <strong>Pump.fun Genesis phase</strong> are rewarded for long-term conviction during protocol migration:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li><strong>HODL &lt; 3 Months:</strong> 1.0x Migration Ratio.</li>
              <li><strong>HODL 3-6 Months:</strong> 1.1x Migration Ratio.</li>
              <li><strong>HODL 6-12 Months:</strong> 1.2x Migration Ratio.</li>
              <li><strong>HODL 12+ Months:</strong> <strong>1.3x Loyalty Bonus</strong>.</li>
            </ul>

            <h2 className="text-2xl font-manrope font-bold mt-12 mb-6">5. The Economic Flywheel</h2>
            <p className="mb-4">The eleAI economy is a <strong>virtuous, self-reinforcing cycle</strong>:</p>
            <ol className="list-decimal list-inside mb-8 space-y-3">
              <li><strong>Demand:</strong> Users acquire $eleAI to access premium AI tools and assets.</li>
              <li><strong>Consumption:</strong> Generation and trades generate <strong>Protocol Revenue</strong>.</li>
              <li><strong>Deflation:</strong> Revenue triggers <strong>Buybacks & Burns</strong>, shrinking supply.</li>
              <li><strong>Retention:</strong> Creators earn and <strong>Stake</strong> $eleAI to unlock elite tiers, increasing scarcity.</li>
              <li><strong>Growth:</strong> Scarcity and utility attract more users, accelerating the cycle.</li>
            </ol>

            <blockquote className="border-l-4 border-primary pl-6 py-4 my-12 bg-surface-container-low rounded-r-xl">
              <p className="text-lg">
                <strong>"In the eleAI ecosystem, imagination is the asset, and $eleAI is the currency. Own the infrastructure of the future creator economy."</strong>
              </p>
            </blockquote>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}