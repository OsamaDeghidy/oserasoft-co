'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaLock, FaUser, FaSignInAlt } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // إعادة التوجيه إلى لوحة التحكم
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'اسم المستخدم أو كلمة المرور غير صحيحة')
        setLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lisbon-brown/10 via-himalaya/20 to-lisbon-brown/10 flex items-center justify-center px-4 text-silver">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-lisbon-brown/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-luxor-gold/30 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-gradient-to-r from-luxor-gold via-anzac to-flax rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FaLock className="text-white text-3xl" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-luxor-gold via-anzac to-flax bg-clip-text text-lisbon-brown mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-gray-nickel/80">لوحة تحكم الإدارة</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-silver mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-nickel/60" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pr-10 pl-4 py-3 bg-lisbon-brown/30 border border-luxor-gold/30 rounded-lg focus:ring-2 focus:ring-luxor-gold focus:border-luxor-gold outline-none transition-all text-silver placeholder-gray-nickel/60"
                  placeholder="أدخل اسم المستخدم"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-silver mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-nickel/60" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10 pl-4 py-3 bg-lisbon-brown/30 border border-luxor-gold/30 rounded-lg focus:ring-2 focus:ring-luxor-gold focus:border-luxor-gold outline-none transition-all text-silver placeholder-gray-nickel/60"
                  placeholder="أدخل كلمة المرور"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-luxor-gold via-anzac to-flax text-lisbon-brown py-3 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FaSignInAlt />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-nickel/60">
              للوصول إلى لوحة التحكم
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

