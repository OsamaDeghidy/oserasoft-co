'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FaPlus, FaList, FaHome, FaEnvelopeOpenText, FaClock, FaEye, FaCheckCircle } from 'react-icons/fa'

interface ViewRequest {
  id: number
  status: 'pending' | 'viewed' | 'contacted'
  projectId: number
  projectTitle: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    viewed: 0,
    contacted: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/view-requests')
      if (response.ok) {
        const requests: ViewRequest[] = await response.json()
        setStatistics({
          total: requests.length,
          pending: requests.filter((r) => r.status === 'pending').length,
          viewed: requests.filter((r) => r.status === 'viewed').length,
          contacted: requests.filter((r) => r.status === 'contacted').length,
        })
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const adminOptions = [
    {
      title: 'إضافة مشروع جديد',
      description: 'أضف مشروعاً جديداً إلى البورتفوليو',
      icon: FaPlus,
      href: '/admin/add-project',
      color: 'from-luxor-gold via-anzac to-flax',
    },
    {
      title: 'إدارة المشاريع',
      description: 'عرض وحذف المشاريع الموجودة',
      icon: FaList,
      href: '/admin/projects',
      color: 'from-silver via-gray-nickel to-flax',
    },
    {
      title: 'طلبات المعاينة',
      description: 'عرض وإدارة طلبات المعاينة للمشاريع',
      icon: FaEnvelopeOpenText,
      href: '/admin/view-requests',
      color: 'from-gray-nickel via-anzac to-luxor-gold',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-lisbon-brown/10 via-himalaya/20 to-lisbon-brown/10 pt-24 md:pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-silver">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-luxor-gold via-anzac to-flax bg-clip-text text-lisbon-brown mb-4">
            لوحة التحكم
          </h1>
    
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Requests */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-lisbon-brown/50 backdrop-blur-sm rounded-2xl shadow-xl border border-luxor-gold/30 p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-luxor-gold via-anzac to-flax flex items-center justify-center mx-auto mb-3">
                <FaEnvelopeOpenText className="text-white text-xl" />
              </div>
              <p className="text-3xl font-bold text-silver">{statistics.total}</p>
              <p className="text-gray-nickel/80 mt-2 text-sm">إجمالي الطلبات</p>
            </motion.div>

            {/* Pending Requests */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-lisbon-brown/50 backdrop-blur-sm rounded-2xl shadow-xl border border-luxor-gold/30 p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-anzac/20 flex items-center justify-center mx-auto mb-3">
                <FaClock className="text-anzac text-xl" />
              </div>
              <p className="text-3xl font-bold text-anzac">{statistics.pending}</p>
              <p className="text-gray-nickel/80 mt-2 text-sm">قيد الانتظار</p>
            </motion.div>

            {/* Viewed Requests */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-lisbon-brown/50 backdrop-blur-sm rounded-2xl shadow-xl border border-luxor-gold/30 p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-silver/20 flex items-center justify-center mx-auto mb-3">
                <FaEye className="text-silver text-xl" />
              </div>
              <p className="text-3xl font-bold text-silver">{statistics.viewed}</p>
              <p className="text-gray-nickel/80 mt-2 text-sm">تم الاطلاع</p>
            </motion.div>

            {/* Contacted Requests */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-lisbon-brown/50 backdrop-blur-sm rounded-2xl shadow-xl border border-luxor-gold/30 p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-flax/20 flex items-center justify-center mx-auto mb-3">
                <FaCheckCircle className="text-flax text-xl" />
              </div>
              <p className="text-3xl font-bold text-flax">{statistics.contacted}</p>
              <p className="text-gray-nickel/80 mt-2 text-sm">تم التواصل</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adminOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <motion.div
                key={option.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(option.href)}
                className="bg-lisbon-brown/50 backdrop-blur-sm rounded-2xl shadow-xl border border-luxor-gold/30 p-8 cursor-pointer hover:shadow-2xl transition-all group"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-silver mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-nickel/80">
                  {option.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

