'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { FiMenu, FiX } from 'react-icons/fi'
import { FaHome, FaUser, FaCode, FaBriefcase, FaEnvelope, FaPlus, FaList, FaEnvelopeOpenText, FaSignOutAlt } from 'react-icons/fa'
import Image from 'next/image'

const navItems = [
  { name: 'الرئيسية', href: '#home', icon: FaHome },
  { name: 'المهارات', href: '#skills', icon: FaCode },
  { name: 'من أنا', href: '#about', icon: FaUser },
  { name: 'المشاريع', href: '#projects', icon: FaBriefcase },
  { name: 'اتصل بي', href: '#contact', icon: FaEnvelope },
]

const adminNavItems = [
  { name: 'لوحة التحكم', href: '/admin', icon: FaHome },
  { name: 'إضافة مشروع', href: '/admin/add-project', icon: FaPlus },
  { name: 'إدارة المشاريع', href: '/admin/projects', icon: FaList },
  { name: 'طلبات المعاينة', href: '/admin/view-requests', icon: FaEnvelopeOpenText },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const isAdminPage = pathname?.startsWith('/admin')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const currentNavItems = isAdminPage ? adminNavItems : navItems

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/admin/login')
      router.refresh()
    }
  }

  useEffect(() => {
    // Set scrolled state for admin pages
    if (isAdminPage) {
      setIsScrolled(true)
      setActiveSection(pathname || '')
      return
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      
      // تحديد القسم النشط
      const sections = ['home', 'about', 'skills', 'projects', 'contact']
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAdminPage, pathname])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-transparent backdrop-blur-sm shadow-lg border-b border-luxor-gold/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20 md:h-24 gap-4 sm:gap-6 lg:gap-8">
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 rounded-full px-2 py-2 border border-silver/30 shadow-xl">
            {currentNavItems.map((item, index) => {
              const sectionId = isAdminPage ? item.href : item.href.replace('#', '')
              const isActive = isAdminPage ? pathname === item.href : activeSection === sectionId
              
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-heading font-semibold ${
                    isActive
                      ? 'bg-gradient-to-r from-silver via-gray-nickel to-flax text-lisbon-brown shadow-lg shadow-silver/30'
                      : 'text-silver hover:text-white hover:bg-silver/20'
                  }`}
                >
                  <item.icon className="text-sm" />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-luxor-gold via-anzac to-flax rounded-full -z-10 shadow-lg shadow-luxor-gold/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              )
            })}
            {/* Logout Button for Admin */}
            {isAdminPage && (
              <motion.button
                onClick={handleLogout}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-flax hover:text-luxor-gold hover:bg-himalaya/20"
              >
                <FaSignOutAlt className="text-sm" />
                <span className="font-medium text-sm">تسجيل الخروج</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2 rounded-lg bg-himalaya/40 backdrop-blur-sm border border-silver/30 text-silver hover:text-white transition-all"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>

          {/* Logo */}
          <motion.a
            href={isAdminPage ? "/admin" : "#home"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group flex items-center"
          >
            <Image
              src="/images/logo.png"
              alt="Logo"   
              width={200}
              height={60}
              className="object-contain w-24 sm:w-32 md:w-40 h-auto"
              priority
              unoptimized
            />
          </motion.a>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-lisbon-brown/95 backdrop-blur-xl border-t border-himalaya/50 shadow-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {currentNavItems.map((item, index) => {
                const sectionId = isAdminPage ? item.href : item.href.replace('#', '')
                const isActive = isAdminPage ? pathname === item.href : activeSection === sectionId
                
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex-1 text-silver hover:text-white transition-colors font-body ${
                      isActive
                        ? 'bg-gradient-to-r from-silver via-anzac to-flax text-silver shadow-lg shadow-silver/30'
                        : 'hover:bg-silver/20'
                    }`}
                  >
                    <item.icon className="text-lg" />
                    <span className="font-medium">{item.name}</span>
                  </motion.a>
                )
              })}
              {/* Logout Button for Admin - Mobile */}
              {isAdminPage && (
                <motion.button
                  onClick={handleLogout}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-flax hover:text-luxor-gold hover:bg-himalaya/20 w-full"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="font-medium">تسجيل الخروج</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

