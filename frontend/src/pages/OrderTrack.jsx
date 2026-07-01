import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiSearch } from 'react-icons/hi'
import api from '../utils/api'

const statusLabels = { pending: 'Pending', confirmed: 'Confirmed', shipped: 'Shipped', cancelled: 'Cancelled' }

export default function OrderTrack() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!orderId.trim()) return
    setLoading(true); setError('')
    try {
      const { data } = await api.get(`/orders/track/${orderId.trim()}/`)
      setOrder(data)
    } catch { setError('Order not found.'); setOrder(null) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl font-semibold mb-2 text-center">Track Your Order</h1>
        <p className="text-gray-500 text-center mb-8">Enter your order ID to check status</p>
        <form onSubmit={handleTrack} className="flex gap-3 mb-8">
          <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. RH-ABC12345"
            className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
          <button type="submit" disabled={loading} className="btn-primary !py-3 !px-6 flex items-center gap-2">
            <HiSearch size={18} /> {loading ? '...' : 'Track'}
          </button>
        </form>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border space-y-6">
            <div className="flex justify-between items-center">
              <div><p className="text-sm text-gray-500">Order ID</p><p className="font-semibold text-lg">{order.order_id}</p></div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                order.status === 'shipped' ? 'bg-green-100 text-green-600' :
                order.status === 'confirmed' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                {statusLabels[order.status]}
              </span>
            </div>
            <div><p className="text-sm text-gray-500">Customer</p><p className="font-medium">{order.customer_name}</p><p className="text-sm text-gray-500">{order.customer_phone}</p></div>
            <div><p className="text-sm text-gray-500 mb-2">Items</p>
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm"><span>{item.product_name} x{item.quantity}</span><span className="font-medium">PKR {item.price}</span></div>
              ))}
            </div>
            <hr />
            <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>PKR {order.total}</span></div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
