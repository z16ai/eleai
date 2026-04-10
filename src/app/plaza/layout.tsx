import TopNav from '@/components/TopNav'

export default function PlazaLayout({
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