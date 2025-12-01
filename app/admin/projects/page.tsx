'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FaPlus, FaTrash, FaEdit, FaExternalLinkAlt, FaGithub } from 'react-icons/fa'

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

export default function ProjectsManagementPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // إزالة المشروع من القائمة
        setProjects(projects.filter((p) => p.id !== id))
      } else {
        alert('فشل حذف المشروع')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('حدث خطأ أثناء حذف المشروع')
    } finally {
      setDeletingId(null)
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      web: 'ويب',
      mobile: 'موبايل',
      fullstack: 'كامل',
    }
    return labels[category] || category
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lisbon-brown/10 via-himalaya/20 to-lisbon-brown/10 flex items-center justify-center text-silver">
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-luxor-gold via-anzac to-flax bg-clip-text text-lisbon-brown">
              إدارة المشاريع
            </h1>
            <p className="text-gray-nickel/80 mt-2">
              إدارة جميع مشاريع البورتفوليو
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/admin/add-project')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-luxor-gold via-anzac to-flax text-lisbon-brown rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <FaPlus />
            إضافة مشروع جديد
          </motion.button>
        </motion.div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-lisbon-brown/50 backdrop-blur-sm rounded-2xl shadow-xl border border-luxor-gold/30"
          >
            <p className="text-gray-nickel/80 text-lg mb-4">لا توجد مشاريع حالياً</p>
            <button
              onClick={() => router.push('/admin/add-project')}
              className="px-6 py-3 bg-gradient-to-r from-luxor-gold via-anzac to-flax text-lisbon-brown rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              إضافة مشروع جديد
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-lisbon-brown/50 backdrop-blur-sm rounded-2xl shadow-lg border border-luxor-gold/30 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-3 py-1 bg-luxor-gold text-silver text-xs font-semibold rounded-full">
                      {getCategoryLabel(project.category)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-silver mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-nickel/80 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-luxor-gold/20 text-luxor-gold text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-nickel/20 text-gray-nickel text-xs rounded-full">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-2 mb-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-nickel/80 hover:text-luxor-gold text-sm"
                      >
                        <FaGithub />
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-nickel/80 hover:text-luxor-gold text-sm"
                      >
                        <FaExternalLinkAlt />
                        معاينة
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-luxor-gold/30">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/admin/edit-project/${project.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-luxor-gold/20 text-luxor-gold rounded-lg hover:bg-luxor-gold/30 transition-colors"
                    >
                      <FaEdit />
                      تعديل
                    </motion.button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-anzac/20 text-anzac rounded-lg hover:bg-anzac/30 transition-colors disabled:opacity-50"
                    >
                      {deletingId === project.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-anzac border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <FaTrash />
                          حذف
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

