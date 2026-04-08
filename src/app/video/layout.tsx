import Sidebar from '@/components/Sidebar'

export default function VideoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      {children}
      <footer className="fixed bottom-0 right-0 left-20 bg-slate-50 dark:bg-slate-950/20 backdrop-blur-sm py-4 px-12 z-30 border-t border-slate-200/10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <p className="font-inter text-xs tracking-wide text-slate-500">© 2026 eleAI Studio. The Digital Curator.</p>
          <div className="flex gap-6">
            <a className="text-slate-500 hover:text-slate-900 underline underline-offset-4 font-inter text-xs tracking-wide" href="#">
              Privacy
            </a>
            <a className="text-slate-500 hover:text-slate-900 underline underline-offset-4 font-inter text-xs tracking-wide" href="#">
              Terms
            </a>
            <a className="text-slate-500 hover:text-slate-900 underline underline-offset-4 font-inter text-xs tracking-wide" href="#">
              API
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
