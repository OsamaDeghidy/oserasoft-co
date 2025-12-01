'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section
      id="about"
      className="relative pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-4 sm:pb-6 md:pb-8 lg:pb-10 overflow-hidden text-silver"
      ref={ref}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-luxor-gold/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-anzac/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Combined Container with Image and Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative mb-16"
        >
          <div className="bg-himalaya/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-luxor-gold/30 relative overflow-hidden group">
            {/* Gradient overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-luxor-gold/10 via-anzac/10 to-flax/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={false}
            />

              <div className="relative z-10 space-y-8">


              {/* Grid with Image and Content */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
                  <div className="relative z-10 space-y-6">
              

                  {/* What We Offer */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                      className="bg-lisbon-brown/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-luxor-gold"
                  >
                    <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-silver via-gray-nickel to-flax bg-clip-text text-lisbon-brown flex items-center gap-2 font-heading">
                      <span className="text-xl sm:text-2xl">✨</span>
                      ما نقدّمه
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        'تحليل شامل لاحتياجات المشروع وتصميم الحلول الأنسب',
                        'تطوير منصات وأنظمة ويب باستخدام Django',
                        'تصميم قواعد بيانات دقيقة وقابلة للتوسع',
                        'إنشاء لوحات تحكم تفاعلية وإدارة احترافية',
                        'بناء واجهات استخدام حديثة باستخدام Next.js / React.js',
                        'ربط الأنظمة عبر واجهات API ومعالجة البيانات بمرونة',
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className="flex items-start gap-2 group"
                        >
                          <span className="text-silver text-lg mt-1 group-hover:scale-110 transition-transform">✓</span>
                          <span className="text-gray-nickel text-xs sm:text-sm leading-relaxed font-body">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Our Domains */}
                      <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.2 }}
                    className="bg-gradient-to-br from-lisbon-brown/50 via-lisbon-brown/40 to-lisbon-brown/50 rounded-2xl p-6 border border-luxor-gold"
                  >
                    <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-silver via-gray-nickel to-flax bg-clip-text text-lisbon-brown flex items-center gap-2 font-heading">
                      <span className="text-xl sm:text-2xl">🚀</span>
                      مجالات عملنا
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'أنظمة إدارة الطلاب والدورات التدريبية',
                        'أنظمة المبيعات والحجوزات',
                        'منصات متعددة الصلاحيات',
                        'أنظمة تحليل البيانات',
                        'حلول مخصصة للشركات',
                      ].map((item, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={inView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: 1.3 + index * 0.1, type: 'spring' }}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-himalaya/20 rounded-full text-sm sm:text-base font-medium text-silver shadow-md hover:shadow-lg transition-all border border-silver/30 font-body"
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  </div>
                </motion.div>

              {/* Creative Image Section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative group">
                  {/* Glow effect */}
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-silver via-gray-nickel to-flax rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  {/* Image Container with 3D effect */}
                      <motion.div
                    className="relative rounded-3xl overflow-hidden shadow-2xl"
                    whileHover={{ scale: 1.02, rotate: [0, 1, -1, 0] }}
                    transition={{ duration: 0.3 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Decorative gradient border */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-silver via-gray-nickel to-flax rounded-3xl opacity-75 blur-sm" />
                    
                    <div className="relative bg-himalaya/20 p-2 rounded-3xl">
                      <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] rounded-xl sm:rounded-2xl overflow-hidden">
                        <Image
                          src="/images/images5.jpeg"
                          alt="فريق عمل إبداعي في تطوير UI/UX"
                          fill
                          className="object-contain rounded-2xl"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                        {/* Overlay gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-silver/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                    </div>
                  </motion.div>

                  {/* Floating decorative elements */}
                  <motion.div
                    className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-silver to-gray-nickel rounded-full flex items-center justify-center shadow-xl z-10"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="text-3xl">💡</span>
                  </motion.div>

                      <motion.div
                    className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-gray-nickel to-flax rounded-full flex items-center justify-center shadow-xl z-10"
                    animate={{
                      y: [0, 10, 0],
                      rotate: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  >
                    <span className="text-2xl">🚀</span>
                  </motion.div>
                </div>
              </motion.div>
              </div>
        </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

