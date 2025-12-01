'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FaTrash, FaEye, FaPhone, FaEnvelope, FaCheckCircle, FaClock, FaUserCheck } from 'react-icons/fa'

interface ViewRequest {
  id: number
  projectId: number
  projectTitle: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
  status: 'pending' | 'viewed' | 'contacted'
}

export default function ViewRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<ViewRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'viewed' | 'contacted'>('all')
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/view-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: number, status: ViewRequest['status']) => {
    setUpdatingId(id)
    try {
      const response = await fetch('/api/view-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      })

      if (response.ok) {
        await fetchRequests()
      } else {
        alert('فشل تحديث حالة الطلب')
      }
    } catch (error) {
      console.error('Error updating request:', error)
      alert('حدث خطأ أثناء تحديث حالة الطلب')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/view-requests?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setRequests(requests.filter((r) => r.id !== id))
      } else {
        alert('فشل حذف الطلب')
      }
    } catch (error) {
      console.error('Error deleting request:', error)
      alert('حدث خطأ أثناء حذف الطلب')
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusLabel = (status: ViewRequest['status']) => {
    const labels = {
      pending: 'قيد الانتظار',
      viewed: 'تم الاطلاع',
      contacted: 'تم التواصل',
    }
    return labels[status]
  }

  const getStatusIcon = (status: ViewRequest['status']) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-anzac" />
      case 'viewed':
        return <FaEye className="text-flax" />
      case 'contacted':
        return <FaCheckCircle className="text-green-400" />
      default:
        return <FaClock className="text-gray-nickel/60" />
    }
  }

  const filteredRequests =
    filter === 'all'
      ? requests
      : requests.filter((r) => r.status === filter)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
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
        {/* Header with Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-luxor-gold via-anzac to-flax bg-clip-text text-lisbon-brown">
              طلبات المعاينة
            </h1>
            <p className="text-gray-nickel/80 mt-2 text-lg font-medium">
              إدارة جميع طلبات المعاينة للمشاريع
            </p>
          </div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3"
          >
            {(['all', 'pending', 'viewed', 'contacted'] as const).map((status) => (
              <motion.button
                key={status}
                onClick={() => setFilter(status)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full font-semibold transition-all ${
                  filter === status
                    ? 'bg-gradient-to-r from-luxor-gold via-anzac to-flax text-lisbon-brown shadow-lg'
                    : 'bg-lisbon-brown/50 text-silver hover:bg-lisbon-brown/60 border-2 border-luxor-gold/30 shadow-md'
                }`}
              >
                {status === 'all'
                  ? 'الكل'
                  : status === 'pending'
                  ? 'قيد الانتظار'
                  : status === 'viewed'
                  ? 'تم الاطلاع'
                  : 'تم التواصل'}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-lisbon-brown/50 backdrop-blur-sm rounded-xl shadow-lg border border-luxor-gold/30 p-6 text-center">
            <p className="text-3xl font-bold text-silver text-4xl">{requests.length}</p>
            <p className="text-gray-nickel/80 mt-2 text-lg font-medium">إجمالي الطلبات</p>
          </div>
          <div className="bg-lisbon-brown/50 backdrop-blur-sm rounded-xl shadow-lg border border-luxor-gold/30 p-6 text-center">
            <p className="text-3xl font-bold text-anzac text-4xl">
              {requests.filter((r) => r.status === 'pending').length}
            </p>
            <p className="text-gray-nickel/80 mt-2 text-lg font-medium">قيد الانتظار</p>
          </div>
          <div className="bg-lisbon-brown/50 backdrop-blur-sm rounded-xl shadow-lg border border-luxor-gold/30 p-6 text-center">
            <p className="text-3xl font-bold text-flax text-4xl">
              {requests.filter((r) => r.status === 'viewed').length}
            </p>
            <p className="text-gray-nickel/80 mt-2 text-lg font-medium">تم الاطلاع</p>
          </div>
          <div className="bg-lisbon-brown/50 backdrop-blur-sm rounded-xl shadow-lg border border-luxor-gold/30 p-6 text-center">
            <p className="text-3xl font-bold text-green-400 text-4xl">
              {requests.filter((r) => r.status === 'contacted').length}
            </p>
            <p className="text-gray-nickel/80 mt-2 text-lg font-medium">تم التواصل</p>
          </div>
        </motion.div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-lisbon-brown/50 backdrop-blur-sm rounded-2xl shadow-xl border border-luxor-gold/30"
          >
            <p className="text-gray-nickel/80 text-lg font-medium">لا توجد طلبات حالياً</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-lisbon-brown/50 backdrop-blur-sm rounded-2xl shadow-lg border border-luxor-gold/30 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Left Section - Request Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-silver mb-2 text-3xl">
                            {request.projectTitle}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(request.status)}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                request.status === 'pending'
                                  ? 'bg-anzac/20 text-anzac'
                                  : request.status === 'viewed'
                                  ? 'bg-flax/20 text-flax'
                                  : 'bg-green-400/20 text-green-400'
                              }`}
                            >
                              {getStatusLabel(request.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-nickel/60">
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-nickel/80">
                          <FaUserCheck className="text-luxor-gold" />
                          <span className="font-semibold text-silver">الاسم:</span>
                          <span className="text-silver">{request.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-nickel/80">
                          <FaEnvelope className="text-luxor-gold" />
                          <span className="font-semibold text-silver">البريد:</span>
                          <a
                            href={`mailto:${request.email}`}
                            className="text-luxor-gold hover:underline"
                          >
                            {request.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-nickel/80">
                          <FaPhone className="text-luxor-gold" />
                          <span className="font-semibold text-silver">الهاتف:</span>
                          <a
                            href={`tel:${request.phone}`}
                            className="text-luxor-gold hover:underline"
                          >
                            {request.phone}
                          </a>
                        </div>
                      </div>

                      {request.message && (
                        <div className="mt-4 p-4 bg-lisbon-brown/30 rounded-xl border border-luxor-gold/30">
                          <p className="text-sm font-semibold text-silver mb-2 text-base">الرسالة:</p>
                          <p className="text-gray-nickel/80 text-base leading-relaxed text-lg">{request.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex flex-col gap-2 md:min-w-[200px]">
                      {request.status !== 'contacted' && (
                        <motion.button
                          onClick={() =>
                            handleUpdateStatus(
                              request.id,
                              request.status === 'pending' ? 'viewed' : 'contacted'
                            )
                          }
                          disabled={updatingId === request.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
                            request.status === 'pending'
                              ? 'bg-flax/20 text-flax hover:bg-flax/30'
                              : 'bg-green-400/20 text-green-400 hover:bg-green-400/30'
                          }`}
                        >
                          {updatingId === request.id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                            />
                          ) : request.status === 'pending' ? (
                            <>
                              <FaEye />
                              تم الاطلاع
                            </>
                          ) : (
                            <>
                              <FaCheckCircle />
                              تم التواصل
                            </>
                          )}
                        </motion.button>
                      )}

                      <motion.button
                        onClick={() => handleDelete(request.id)}
                        disabled={deletingId === request.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-anzac/20 text-anzac rounded-xl font-semibold hover:bg-anzac/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {deletingId === request.id ? (
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
                      </motion.button>
                    </div>
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

