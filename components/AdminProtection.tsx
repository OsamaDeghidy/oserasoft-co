'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AdminProtection({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      // إذا كان في صفحة login، اعرضها مباشرة
      if (pathname === '/admin/login') {
        setIsAuthenticated(true)
        return
      }

      try {
        const response = await fetch('/api/auth/check')
        const data = await response.json()

        if (data.authenticated) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          // إعادة التوجيه إلى صفحة تسجيل الدخول
          if (pathname?.startsWith('/admin')) {
            router.push('/admin/login')
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        if (pathname?.startsWith('/admin')) {
          router.push('/admin/login')
        }
      }
    }

    checkAuth()
  }, [router, pathname])

  // عرض loading أثناء التحقق
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري التحقق...</p>
        </motion.div>
      </div>
    )
  }

  // إذا كان في صفحة login، اعرضها مباشرة
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // إذا لم يكن مسجل دخول، لا تعرض المحتوى (سيتم إعادة التوجيه)
  if (!isAuthenticated) {
    return null
  }

  // إذا كان مسجل دخول، اعرض المحتوى
  return <>{children}</>
}

