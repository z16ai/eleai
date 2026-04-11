export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950">
      <div className="w-full py-12 px-8 border-t border-slate-200/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="col-span-2 md:col-span-1">
            <span className="font-manrope font-bold text-slate-400 block mb-4">eleAI Studio</span>
            <p className="font-inter text-xs tracking-wide text-slate-500 leading-relaxed">
              The Digital Curator.<br />
              Elevating human imagination with sophisticated neural engines.
            </p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-4 block">
              Product
            </span>
            <ul className="space-y-2">
              <li>
                <a
                  className="font-inter text-xs text-slate-500 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
                  href="#"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  className="font-inter text-xs text-slate-500 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
                  href="#"
                >
                  Showcase
                </a>
              </li>
              <li>
                <a
                  className="font-inter text-xs text-slate-500 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
                  href="#"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  className="font-inter text-xs text-slate-500 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
                  href="#"
                >
                  API
                </a>
              </li>
            </ul>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-4 block">
              Docs
            </span>
            <ul className="space-y-2">
              <li>
                <a
                  className="font-inter text-xs text-slate-500 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
                  href="https://deepwiki.com/z16ai/eleai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Docs
                </a>
              </li>
              <li>
                <a
                  className="font-inter text-xs text-slate-500 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
                  href="https://github.com/z16ai/eleai/blob/main/docs/eleAI%20whitepaper.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Whitepaper
                </a>
              </li>
              <li>
                <a
                  className="font-inter text-xs text-slate-500 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
                  href="/tokenomics"
                >
                  Tokenomics
                </a>
              </li>
            </ul>
          </div>
          <div>
            <span className="text-xs font-bold uppercase text-slate-900 dark:text-slate-100 mb-4 block">
              Connect
            </span>
            <ul className="space-y-2">
              <li>
                <a
                  className="font-inter text-xs text-slate-500 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
                  href="https://x.com/eleai_tech"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  className="font-inter text-xs text-slate-500 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
                  href="https://t.me/+A2BxjTrCiOJmMjZl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  className="font-inter text-xs text-slate-500 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
                  href="https://github.com/z16ai/eleai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200/5 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-inter text-xs tracking-wide text-slate-500">© 2026 eleAI Studio. The Digital Curator.</p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-slate-400 text-lg" data-icon="language">
              language
            </span>
            <span className="material-symbols-outlined text-slate-400 text-lg" data-icon="dark_mode">
              dark_mode
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
