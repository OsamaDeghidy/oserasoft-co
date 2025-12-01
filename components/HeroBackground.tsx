'use client'

import { motion } from 'framer-motion'
import { FaArrowDown } from 'react-icons/fa'
import { useInView } from 'react-intersection-observer'

export default function HeroBackground() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/image6.png")',
          }}
        />
        
              </div>

      {/* Title in Middle */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display text-silver mb-4 drop-shadow-lg">
          المنظومة الرقمية المتكاملة
        </h1>
        <p className="text-lg sm:text-xl text-gray-nickel/90 max-w-2xl mx-auto drop-shadow-md font-body">
          القوة الشاملة للحلول البرمجية من الفكرة إلى التنفيذ
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-silver text-sm font-medium">Scroll to explore</span>
          <FaArrowDown className="text-gray-nickel text-xl" />
        </motion.div>
      </motion.div>
    </section>
  )
}
