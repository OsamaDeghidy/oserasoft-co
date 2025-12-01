'use client'

import { motion } from 'framer-motion'
import { FaHeart, FaMosque, FaPhone } from 'react-icons/fa'
import { SiGmail, SiLinkedin, SiGithub, SiTwitter } from 'react-icons/si'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'

const socialLinks = [
  { icon: SiGithub, href: '#', label: 'GitHub' },
  { icon: SiLinkedin, href: '#', label: 'LinkedIn' },
  { icon: SiGmail, href: 'mailto:esraaahmed00.ea@gmail.com', label: 'Gmail' },
  { icon: FaPhone, href: 'tel:+201287050276', label: 'Phone' },
]

export default function Footer() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <footer className="border-t border-luxor-gold/30 py-4" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="relative -mt-2 -mb-2"
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={150}
              height={150}
              className="object-contain w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
              priority
            />
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                  transition={{ 
                    delay: 0.3 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: 360,
                    y: -5,
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 sm:p-3 rounded-lg sm:rounded-xl bg-himalaya/20 backdrop-blur-sm border-2 border-luxor-gold/30 hover:border-luxor-gold text-flax hover:text-lisbon-brown transition-all group overflow-hidden"
                  aria-label={social.label}
                >
                  {/* Gradient background on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-luxor-gold via-anzac to-flax opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <Icon className="relative z-10 text-lg sm:text-xl md:text-2xl text-silver" />
                  
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-luxor-gold/50 via-anzac/50 to-flax/50 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"
                    initial={false}
                  />
                </motion.a>
              )
            })}
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center md:text-right"
          >
            <p className="text-flax flex items-center justify-center md:justify-end gap-2 text-xs sm:text-sm">
                <FaHeart className="text-luxor-gold animate-pulse" /> بواسطة{' '}
              <span className="bg-gradient-to-r from-luxor-gold via-anzac to-flax bg-clip-text text-lisbon-brown font-semibold">OSERA Soft</span>
            </p>
            <p className="text-anzac/80 text-[10px] sm:text-xs mt-1">
              {new Date().getFullYear()} جميع الحقوق محفوظة
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

