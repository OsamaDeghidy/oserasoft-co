'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { FaSave, FaArrowLeft, FaTrash, FaPlus } from 'react-icons/fa'

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

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = parseInt(params.id as string)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [subImages, setSubImages] = useState<string[]>([])
  const [newSubImage, setNewSubImage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    category: 'web',
  })

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const projects: Project[] = await response.json()
        const project = projects.find((p) => p.id === projectId)
        if (project) {
          setFormData({
            title: project.title,
            description: project.description,
            image: project.image,
            technologies: project.technologies.join(', '),
            githubUrl: project.githubUrl || '',
            liveUrl: project.liveUrl || '',
            category: project.category,
          })
          setSubImages(project.subImages || [])
        } else {
          router.push('/admin/projects')
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      router.push('/admin/projects')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddSubImage = () => {
    if (newSubImage.trim() && !subImages.includes(newSubImage.trim())) {
      setSubImages([...subImages, newSubImage.trim()])
      setNewSubImage('')
    }
  }

  const handleRemoveSubImage = (index: number) => {
    setSubImages(subImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // تحويل technologies من نص إلى مصفوفة
      const technologiesArray = formData.technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0)

      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: projectId,
          ...formData,
          technologies: technologiesArray,
          subImages: subImages,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        // إعادة توجيه بعد ثانيتين
        setTimeout(() => {
          router.push('/admin/projects')
        }, 2000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-luxor-gold border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lisbon-brown/10 via-himalaya/20 to-lisbon-brown/10 pt-24 md:pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-silver">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-nickel/80 hover:text-luxor-gold mb-4 transition-colors"
          >
            <FaArrowLeft />
            <span>رجوع</span>
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-luxor-gold via-anzac to-flax bg-clip-text text-lisbon-brown">
            تعديل المشروع
          </h1>
          <p className="text-gray-nickel/80 mt-2">
            قم بتعديل بيانات المشروع أدناه
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-lisbon-brown/50 backdrop-blur-sm rounded-2xl shadow-xl border border-luxor-gold/30 p-6 md:p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-silver mb-2">
              عنوان المشروع *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-lisbon-brown/30 border-2 border-luxor-gold/30 rounded-xl focus:outline-none focus:border-luxor-gold focus:ring-4 focus:ring-luxor-gold/20 transition-all text-silver placeholder-gray-nickel/60"
              placeholder="مثال: تطبيق إدارة المهام"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-silver mb-2">
              وصف المشروع *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all resize-none"
              placeholder="اكتب وصفاً مفصلاً عن المشروع..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-silver mb-2">
              رابط الصورة الرئيسية *
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-lisbon-brown/30 border-2 border-luxor-gold/30 rounded-xl focus:outline-none focus:border-luxor-gold focus:ring-4 focus:ring-luxor-gold/20 transition-all text-silver placeholder-gray-nickel/60"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Sub Images */}
          <div>
            <label className="block text-sm font-semibold text-silver mb-2">
              الصور الفرعية
            </label>
            <div className="space-y-3">
              {/* Add Sub Image Input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newSubImage}
                  onChange={(e) => setNewSubImage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSubImage()
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-lisbon-brown/30 border-2 border-luxor-gold/30 rounded-xl focus:outline-none focus:border-luxor-gold focus:ring-4 focus:ring-luxor-gold/20 transition-all text-silver placeholder-gray-nickel/60"
                  placeholder="https://example.com/sub-image.jpg"
                />
                <motion.button
                  type="button"
                  onClick={handleAddSubImage}
                  disabled={!newSubImage.trim() || subImages.includes(newSubImage.trim())}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 bg-gradient-to-r from-luxor-gold via-anzac to-flax text-lisbon-brown rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FaPlus />
                  إضافة
                </motion.button>
              </div>
              
              {/* Sub Images List */}
              {subImages.length > 0 && (
                <div className="space-y-2">
                  {subImages.map((subImage, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2 p-3 bg-lisbon-brown/30 rounded-xl border-2 border-luxor-gold/30"
                    >
                      <span className="flex-1 text-sm text-silver truncate">{subImage}</span>
                      <motion.button
                        type="button"
                        onClick={() => handleRemoveSubImage(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-anzac hover:bg-anzac/20 rounded-lg transition-colors"
                        title="حذف الصورة"
                      >
                        <FaTrash />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-nickel/60 mt-1">
              يمكنك إضافة عدة صور فرعية للمشروع (اختياري)
            </p>
          </div>

          {/* Technologies */}
          <div>
            <label htmlFor="technologies" className="block text-sm font-semibold text-silver mb-2">
              التقنيات المستخدمة
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-lisbon-brown/30 border-2 border-luxor-gold/30 rounded-xl focus:outline-none focus:border-luxor-gold focus:ring-4 focus:ring-luxor-gold/20 transition-all text-silver placeholder-gray-nickel/60"
              placeholder="مثال: React, Node.js, MongoDB (افصل بينها بفواصل)"
            />
            <p className="text-xs text-gray-nickel/60 mt-1">
              اكتب التقنيات مفصولة بفواصل
            </p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-silver mb-2">
              الفئة *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-lisbon-brown/30 border-2 border-luxor-gold/30 rounded-xl focus:outline-none focus:border-luxor-gold focus:ring-4 focus:ring-luxor-gold/20 transition-all text-silver placeholder-gray-nickel/60"
            >
              <option value="web">ويب</option>
              <option value="mobile">موبايل</option>
              <option value="fullstack">كامل</option>
            </select>
          </div>

          {/* GitHub URL */}
          <div>
            <label htmlFor="githubUrl" className="block text-sm font-semibold text-silver mb-2">
              رابط GitHub
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-lisbon-brown/30 border-2 border-luxor-gold/30 rounded-xl focus:outline-none focus:border-luxor-gold focus:ring-4 focus:ring-luxor-gold/20 transition-all text-silver placeholder-gray-nickel/60"
              placeholder="https://github.com/username/project"
            />
          </div>

          {/* Live URL */}
          <div>
            <label htmlFor="liveUrl" className="block text-sm font-semibold text-silver mb-2">
              رابط المعاينة المباشرة
            </label>
            <input
              type="url"
              id="liveUrl"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-lisbon-brown/30 border-2 border-luxor-gold/30 rounded-xl focus:outline-none focus:border-luxor-gold focus:ring-4 focus:ring-luxor-gold/20 transition-all text-silver placeholder-gray-nickel/60"
              placeholder="https://example.com"
            />
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 border-2 border-green-400 rounded-xl text-green-700"
            >
              ✓ تم تحديث المشروع بنجاح! سيتم توجيهك إلى صفحة المشاريع...
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border-2 border-red-400 rounded-xl text-red-700"
            >
              ✕ حدث خطأ أثناء تحديث المشروع. يرجى المحاولة مرة أخرى.
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-8 py-4 bg-gradient-to-r from-luxor-gold via-anzac to-flax text-lisbon-brown rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                جاري التحديث...
              </>
            ) : (
              <>
                <FaSave />
                حفظ التعديلات
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  )
}

