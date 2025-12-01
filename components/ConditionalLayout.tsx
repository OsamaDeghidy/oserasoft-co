'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
    </>
  )
}

