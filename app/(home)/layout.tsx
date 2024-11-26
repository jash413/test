// File: app/(home)/layout.tsx
import Header from './Header'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {/* Add footer here if needed */}
    </div>
  )
}