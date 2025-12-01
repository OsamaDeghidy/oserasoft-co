'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaExternalLinkAlt, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Image from 'next/image'

interface Project {
  id: number
  title: string
  description: string
  image: string
  subImages?: string[]
  technologies: string[]
  githubUrl: string
  liveUrl: string
  category: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestFormData, setRequestFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)
  const [requestSubmitStatus, setRequestSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    // Fetch projects from API
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          setProjects(data)
        } else {
          console.error('Expected array but received:', typeof data, data)
          setProjects([])
        }
      })
      .catch((err) => {
        console.error('Error fetching projects:', err)
        setProjects([])
      })
  }, [])

  // Handle keyboard events for modal
  useEffect(() => {
    if (!selectedProject) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProjectModal()
      } else if (e.key === 'ArrowRight' && selectedProject) {
        const images = getProjectImages(selectedProject)
        if (images.length > 1) {
          setCurrentImageIndex((prev) => (prev + 1) % images.length)
        }
      } else if (e.key === 'ArrowLeft' && selectedProject) {
        const images = getProjectImages(selectedProject)
        if (images.length > 1) {
          setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedProject])

  const categories = ['all', 'web', 'mobile', 'fullstack']
  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.category === filter)

  const openProjectModal = (project: Project) => {
    setSelectedProject(project)
    setCurrentImageIndex(0)
    document.body.style.overflow = 'hidden'
  }

  const closeProjectModal = () => {
    setSelectedProject(null)
    setCurrentImageIndex(0)
    setShowRequestForm(false)
    setRequestFormData({ name: '', email: '', phone: '', message: '' })
    setRequestSubmitStatus('idle')
    document.body.style.overflow = 'unset'
  }

  const handleOpenRequestForm = () => {
    setShowRequestForm(true)
  }

  const handleRequestFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRequestFormData({
      ...requestFormData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProject) return

    setIsSubmittingRequest(true)
    setRequestSubmitStatus('idle')

    try {
      const response = await fetch('/api/view-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedProject.id,
          projectTitle: selectedProject.title,
          ...requestFormData,
        }),
      })

      if (response.ok) {
        setRequestSubmitStatus('success')
        setRequestFormData({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => {
          setShowRequestForm(false)
        }, 2000)
      } else {
        setRequestSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      setRequestSubmitStatus('error')
    } finally {
      setIsSubmittingRequest(false)
    }
  }

  const getProjectImages = (project: Project): string[] => {
    return [project.image, ...(project.subImages || [])]
  }

  const truncateDescription = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const nextImage = () => {
    if (selectedProject) {
      const images = getProjectImages(selectedProject)
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedProject) {
      const images = getProjectImages(selectedProject)
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  return (
    <section
      id="projects"
      className="relative pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-4 sm:pb-6 md:pb-8 lg:pb-10 text-flax overflow-hidden"
      ref={ref}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-luxor-gold/20 rounded-full mix-blend-multiply filter blur-xl opacity-30"
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
          className="absolute bottom-20 left-20 w-96 h-96 bg-anzac/20 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title and Filter Row */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          {/* Title Section - Left */}
          <div className="flex-1">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-luxor-gold via-anzac to-flax bg-clip-text text-lisbon-brown"
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
            المشاريع
            </motion.h2>
            <p className="text-silver/80 text-base sm:text-lg">
            مجموعة من المشاريع التي قمت بتطويرها باستخدام أحدث التقنيات
          </p>
          </div>

          {/* Filter Buttons - Right */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-end gap-2 sm:gap-3"
        >
            {categories.map((category, idx) => (
            <motion.button
              key={category}
              onClick={() => setFilter(category)}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + idx * 0.1, type: "spring" }}
              whileTap={{ scale: 0.95 }}
                className={`relative px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full font-semibold transition-all overflow-hidden text-xs sm:text-sm md:text-base ${
                filter === category
                    ? 'bg-gradient-to-r from-silver via-gray-nickel to-flax text-lisbon-brown shadow-lg shadow-silver/50'
                    : 'bg-himalaya/20 backdrop-blur-sm text-silver border-2 border-silver/30'
                }`}
              >
                <span className="relative z-10">
              {category === 'all'
                ? 'الكل'
                : category === 'web'
                ? 'ويب'
                : category === 'mobile'
                ? 'موبايل'
                : 'كامل'}
                </span>
            </motion.button>
          ))}
          </motion.div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="relative group"
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-luxor-gold via-anzac to-flax rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                initial={false}
              />
              
              <div className="relative bg-gradient-to-br from-lisbon-brown/60 via-lisbon-brown/50 to-lisbon-brown/60 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border-2 border-luxor-gold/30 group-hover:border-luxor-gold transition-all h-full flex flex-col">
                {/* Image Container */}
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                  <motion.div
                    className="relative w-full h-full"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                  src={project.image}
                  alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </motion.div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-lisbon-brown/95 via-lisbon-brown/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Action Buttons */}
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <motion.button
                    onClick={() => openProjectModal(project)}
                      whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                      className="flex-1 bg-gradient-to-r from-luxor-gold via-anzac to-flax text-lisbon-brown px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <FaExternalLinkAlt /> المعاينة
                  </motion.button>
                </div>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={inView ? {
                      x: ['-100%', '100%'],
                    } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "linear",
                    }}
                  />
              </div>

                {/* Content */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  <motion.h3
                    className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-silver group-hover:text-luxor-gold transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {project.title}
                  </motion.h3>
                  <p className="text-gray-nickel/80 text-sm sm:text-base mb-3 sm:mb-4 flex-1 leading-relaxed">
                    {truncateDescription(project.description, 120)}
                  </p>
                  
                  {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <motion.span
                      key={tech}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.5 + index * 0.1 + techIndex * 0.05 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="px-3 py-1.5 bg-gradient-to-r from-silver/20 via-gray-nickel/20 to-flax/20 text-silver text-sm rounded-full border border-silver/30 hover:border-silver font-medium transition-all shadow-sm hover:shadow-md"
                    >
                      {tech}
                      </motion.span>
                  ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-silver/80 text-lg">
              لا توجد مشاريع في هذه الفئة حالياً
            </p>
          </motion.div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeProjectModal}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-himalaya/20 rounded-2xl sm:rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={closeProjectModal}
              className="absolute top-4 left-4 z-10 w-10 h-10 bg-lisbon-brown/50 backdrop-blur-sm rounded-full flex items-center justify-center text-silver hover:text-luxor-gold hover:bg-lisbon-brown/60 shadow-lg transition-all"
            >
              <FaTimes />
            </button>

            {/* Left Section - Content */}
            <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto flex flex-col gap-4 sm:gap-6">
              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-luxor-gold via-anzac to-flax bg-clip-text text-lisbon-brown"
              >
                {selectedProject.title}
              </motion.h2>

              {/* Category */}
              <div>
                <span className="px-4 py-2 bg-luxor-gold/20 text-luxor-gold rounded-full text-sm font-semibold border border-luxor-gold/30">
                  {selectedProject.category === 'web' ? 'ويب' : 
                   selectedProject.category === 'mobile' ? 'موبايل' : 'كامل'}
                </span>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-nickel/80 text-base sm:text-lg leading-relaxed"
              >
                {selectedProject.description}
              </motion.p>

              {/* Technologies */}
              {selectedProject.technologies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-2"
                >
                  {selectedProject.technologies.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="px-4 py-2 bg-gradient-to-r from-silver/20 via-gray-nickel/20 to-flax/20 text-silver rounded-full text-sm font-medium border border-silver/30"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              )}

              {/* Request Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-4"
              >
                <motion.button
                  onClick={handleOpenRequestForm}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-silver via-gray-nickel to-flax text-lisbon-brown rounded-xl font-semibold transition-all shadow-lg"
                >
                  <FaExternalLinkAlt />
                  طلب الموقع للمعاينة
                </motion.button>
              </motion.div>
            </div>

            {/* Right Section - Images */}
            <div className="lg:w-1/2 bg-gradient-to-br from-luxor-gold/10 via-anzac/10 to-flax/10 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col gap-4 sm:gap-6">
              {/* Main Image */}
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center"
              >
                <Image
                  src={getProjectImages(selectedProject)[currentImageIndex]}
                  alt={selectedProject.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
                
                {/* Navigation Arrows */}
                {getProjectImages(selectedProject).length > 1 && (
                  <>
                    <motion.button
                      onClick={prevImage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-1/2 right-4 w-10 h-10 bg-lisbon-brown/50 backdrop-blur-sm rounded-full flex items-center justify-center text-silver hover:text-luxor-gold shadow-lg transition-all z-10"
                    >
                      <FaChevronRight />
                    </motion.button>
                    <motion.button
                      onClick={nextImage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-1/2 left-4 w-10 h-10 bg-lisbon-brown/50 backdrop-blur-sm rounded-full flex items-center justify-center text-silver hover:text-luxor-gold shadow-lg transition-all z-10"
                    >
                      <FaChevronLeft />
                    </motion.button>
                  </>
                )}

                {/* Image Counter */}
                {getProjectImages(selectedProject).length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-lisbon-brown/60 backdrop-blur-sm text-silver rounded-full text-sm font-semibold">
                    {currentImageIndex + 1} / {getProjectImages(selectedProject).length}
                  </div>
                )}
              </motion.div>

              {/* Sub Images Slider */}
              {selectedProject.subImages && selectedProject.subImages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-silver">صور إضافية</h3>
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {getProjectImages(selectedProject).map((img, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative h-16 sm:h-20 w-24 sm:w-32 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? 'border-luxor-gold shadow-lg'
                            : 'border-luxor-gold/30 hover:border-luxor-gold'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${selectedProject.title} - ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                        {currentImageIndex === index && (
                          <motion.div
                            layoutId="selectedImage"
                            className="absolute inset-0 bg-luxor-gold/20"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Request Form Modal */}
          {showRequestForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                className="bg-himalaya/20 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 md:p-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-luxor-gold via-anzac to-flax bg-clip-text text-lisbon-brown">
                    طلب معاينة الموقع
                  </h3>
                  <button
                    onClick={() => setShowRequestForm(false)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-lisbon-brown/50 transition-colors text-silver"
                  >
                    <FaTimes />
                  </button>
                </div>

                <p className="text-gray-nickel/80 text-sm sm:text-base mb-4 sm:mb-6">
                  المشروع: <span className="font-semibold text-luxor-gold">{selectedProject?.title}</span>
                </p>

                <form onSubmit={handleSubmitRequest} className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="request-name" className="block text-xs sm:text-sm font-semibold text-silver mb-2">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      id="request-name"
                      name="name"
                      value={requestFormData.name}
                      onChange={handleRequestFormChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-lisbon-brown/30 border-2 border-silver/30 rounded-lg sm:rounded-xl focus:outline-none focus:border-silver focus:ring-4 focus:ring-silver/20 transition-all text-silver placeholder-gray-nickel/60"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div>
                    <label htmlFor="request-email" className="block text-xs sm:text-sm font-semibold text-silver mb-2">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      id="request-email"
                      name="email"
                      value={requestFormData.email}
                      onChange={handleRequestFormChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-lisbon-brown/30 border-2 border-silver/30 rounded-lg sm:rounded-xl focus:outline-none focus:border-silver focus:ring-4 focus:ring-silver/20 transition-all text-silver placeholder-gray-nickel/60"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="request-phone" className="block text-xs sm:text-sm font-semibold text-silver mb-2">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      id="request-phone"
                      name="phone"
                      value={requestFormData.phone}
                      onChange={handleRequestFormChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-lisbon-brown/30 border-2 border-silver/30 rounded-lg sm:rounded-xl focus:outline-none focus:border-silver focus:ring-4 focus:ring-silver/20 transition-all text-silver placeholder-gray-nickel/60"
                      placeholder="05XXXXXXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="request-message" className="block text-xs sm:text-sm font-semibold text-silver mb-2">
                      رسالة (اختياري)
                    </label>
                    <textarea
                      id="request-message"
                      name="message"
                      value={requestFormData.message}
                      onChange={handleRequestFormChange}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-himalaya/20 border-2 border-silver/30 rounded-lg sm:rounded-xl focus:outline-none focus:border-silver focus:ring-4 focus:ring-silver/20 transition-all resize-none text-silver placeholder-gray-nickel/60"
                      placeholder="اكتب رسالة إضافية (اختياري)..."
                    />
                  </div>

                  {requestSubmitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 border-2 border-green-400 rounded-xl text-green-700"
                    >
                      ✓ تم إرسال طلبك بنجاح! سنتواصل معك قريباً.
                    </motion.div>
                  )}

                  {requestSubmitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border-2 border-red-400 rounded-xl text-red-700"
                    >
                      ✕ حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmittingRequest}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-luxor-gold via-anzac to-flax text-lisbon-brown rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmittingRequest ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        إرسال الطلب
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </section>
  )
}

