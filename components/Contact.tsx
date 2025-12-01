'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const contactInfo = [
  {
    icon: FaEnvelope,
    label: 'البريد الإلكتروني',
    value: 'esraaahmed00.ea@gmail.com',
    link: 'mailto:esraaahmed00.ea@gmail.com',
  },
  {
    icon: FaPhone,
    label: 'الهاتف',
    value: '+201287050276',
    link: 'tel:+201287050276',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'الموقع',
    value: 'القاهرة، مصر',
    link: '#',
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section
      id="contact"
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
        {/* Main Container with same style as About */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative mb-16"
        >
          <div className="bg-lisbon-brown/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-luxor-gold/50 relative overflow-hidden group">
            {/* Gradient overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-luxor-gold/10 via-anzac/10 to-flax/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={false}
            />

            <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
                  className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-luxor-gold via-anzac to-flax bg-clip-text text-transparent drop-shadow-lg"
            animate={inView ? {
              backgroundPosition: ['0%', '100%', '0%'],
            } : {}}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: '200% auto',
            }}
          >
            اتصل بي
          </motion.h2>
          <p className="text-silver/80 text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
            هل لديك مشروع في ذهنك؟ دعنا نتحدث عنه!
          </p>
        </motion.div>

        {/* Contact Info - Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.link}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ 
                  y: -5, 
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(176, 137, 51, 0.2)",
                }}
                className="relative flex flex-col items-center gap-1 sm:gap-2 md:gap-3 p-2 sm:p-4 md:p-6 bg-lisbon-brown/60 backdrop-blur-sm rounded-lg sm:rounded-xl transition-all group border-2 border-luxor-gold/30 overflow-hidden text-center"
              >
                {/* Gradient background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-luxor-gold/10 via-anzac/10 to-flax/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                
                {/* Icon with gradient background */}
                <motion.div
                  className="relative z-10 p-2 sm:p-3 rounded-lg bg-gradient-to-br from-luxor-gold/20 to-anzac/20 group-hover:from-luxor-gold/30 group-hover:to-anzac/30 transition-all"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <info.icon className="text-lg sm:text-2xl md:text-3xl" style={{ color: '#b08933' }} />
                </motion.div>
                
                <div className="relative z-10">
                  <p className="text-[10px] sm:text-xs md:text-sm text-silver/60 mb-0.5 sm:mb-1">{info.label}</p>
                  <p className="text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-silver transition-colors break-words">{info.value}</p>
                </div>

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-luxor-gold/20 via-anzac/20 to-flax/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                  initial={false}
                />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="relative mb-12"
        >
          {/* Form background card */}
          <div className="relative bg-lisbon-brown/40 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-luxor-gold/30 shadow-xl p-4 sm:p-6 md:p-8">
            <div className="space-y-6">
              {/* First row: 3 fields side by side */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="name" className="block mb-2 text-sm sm:text-base font-semibold text-silver">
                    الاسم
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-lisbon-brown/60 backdrop-blur-sm border-2 border-luxor-gold/20 rounded-lg sm:rounded-xl focus:outline-none focus:border-luxor-gold focus:ring-4 focus:ring-luxor-gold/20 transition-all text-silver placeholder-silver/50"
                    placeholder="أدخل اسمك"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  <label htmlFor="email" className="block mb-2 text-sm sm:text-base font-semibold text-silver">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-lisbon-brown/60 backdrop-blur-sm border-2 border-anzac/20 rounded-lg sm:rounded-xl focus:outline-none focus:border-anzac focus:ring-4 focus:ring-anzac/20 transition-all text-silver placeholder-silver/50"
                    placeholder="example@email.com"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 }}
                >
                  <label htmlFor="subject" className="block mb-2 text-sm sm:text-base font-semibold text-silver">
                    الموضوع
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-lisbon-brown/60 backdrop-blur-sm border-2 border-flax/20 rounded-lg sm:rounded-xl focus:outline-none focus:border-flax focus:ring-4 focus:ring-flax/20 transition-all text-silver placeholder-silver/50"
                    placeholder="موضوع الرسالة"
                  />
                </motion.div>
              </div>

              {/* Second row: Message field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
              >
                <label htmlFor="message" className="block mb-2 text-sm sm:text-base font-semibold text-silver">
                  الرسالة
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-lisbon-brown/60 backdrop-blur-sm border-2 border-luxor-gold/20 rounded-lg sm:rounded-xl focus:outline-none focus:border-luxor-gold focus:ring-4 focus:ring-luxor-gold/20 transition-all resize-none text-silver placeholder-silver/50"
                  placeholder="اكتب رسالتك هنا..."
                />
              </motion.div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(176, 137, 51, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-luxor-gold via-anzac to-flax text-lisbon-brown rounded-lg sm:rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                style={{
                  boxShadow: '0 10px 25px rgba(176, 137, 51, 0.3), 0 0 20px rgba(219, 178, 60, 0.2)',
                }}
              >
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-anzac via-flax to-luxor-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "linear",
                  }}
                />
                
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      إرسال الرسالة
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </>
                  )}
                </span>
              </motion.button>

              {/* Status messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="relative p-4 bg-gradient-to-r from-luxor-gold/20 to-anzac/20 border-2 border-luxor-gold rounded-xl text-lisbon-brown shadow-lg backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-2xl"
                    >
                      ✓
                    </motion.div>
                    <span className="font-semibold">تم إرسال الرسالة بنجاح! سأتواصل معك قريباً.</span>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="relative p-4 bg-gradient-to-r from-anzac/20 to-flax/20 border-2 border-anzac rounded-xl text-lisbon-brown shadow-lg backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-2xl"
                    >
                      ✕
                    </motion.div>
                    <span className="font-semibold">حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

