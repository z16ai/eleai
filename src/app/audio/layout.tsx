import TopNav from '@/components/TopNav'

export default function AudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TopNav />
      {children}
    </>
  )
}