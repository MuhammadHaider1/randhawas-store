import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiStar, HiCheck, HiX, HiTrash } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../../utils/api'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/reviews/').then(({ data }) => {
      setReviews(data.results || data || [])
    }).catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false))
  }, [])

  const toggleApprove = async (review) => {
    try {
      const { data } = await api.patch(`/dashboard/reviews/${review.id}/`, {
        is_approved: !review.is_approved,
      })
      setReviews((prev) => prev.map((r) => r.id === review.id ? data : r))
      toast.success(data.is_approved ? 'Review approved' : 'Review unapproved')
    } catch { toast.error('Failed to update review') }
  }

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return
    try {
      await api.delete(`/dashboard/reviews/${id}/`)
      setReviews((prev) => prev.filter((r) => r.id !== id))
      toast.success('Review deleted')
    } catch { toast.error('Failed to delete review') }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <span className="text-sm text-gray-500">{reviews.length} total</span>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <HiStar size={48} className="mx-auto mb-3 opacity-30" />
          <p>No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-xl p-5 border ${review.is_approved ? 'border-green-200' : 'border-amber-200'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <HiStar key={j} className={j < review.rating ? 'text-luxury-gold' : 'text-gray-200'} size={16} />
                      ))}
                    </div>
                    <span className="font-medium text-sm">{review.customer_name}</span>
                    {review.is_approved ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Approved</span>
                    ) : (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pending</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{review.product_name || '—'}</p>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                  {review.image && (
                    <img src={review.image} alt="Review" className="mt-2 h-20 w-20 object-cover rounded-lg border" />
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleApprove(review)}
                    className={`p-2 rounded-lg transition-all ${review.is_approved ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                    title={review.is_approved ? 'Unapprove' : 'Approve'}>
                    {review.is_approved ? <HiX size={18} /> : <HiCheck size={18} />}
                  </button>
                  <button onClick={() => deleteReview(review.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all" title="Delete">
                    <HiTrash size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
