import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { HiCheck, HiArrowRight, HiInformationCircle } from 'react-icons/hi'
import { clearCart } from '../store/cartSlice'
import api from '../utils/api'
import { trackPurchase } from '../utils/tiktok'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const dispatch = useDispatch()
  const [order, setOrder] = useState(null)
  const [accounts, setAccounts] = useState(null)

  useEffect(() => {
    dispatch(clearCart())
    if (orderId) {
      api.get(`/orders/track/${orderId}/`).then(({ data }) => {
        setOrder(data)
        trackPurchase(data)
      }).catch(() => {})
      api.get('/orders/payment-accounts/').then(({ data }) => setAccounts(data)).catch(() => {})
    }
  }, [dispatch, orderId])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg w-full">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <HiCheck className="text-green-600" size={36} />
        </motion.div>
        <h1 className="font-serif text-3xl font-semibold mb-2">Thank You!</h1>
        <p className="text-gray-500 mb-1">Your order has been placed successfully.</p>
        <p className="text-lg font-medium text-primary-600 mb-2">Order ID: {orderId}</p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-left space-y-3 mb-6">
          <div className="flex items-center gap-2 text-amber-800 font-medium">
            <HiInformationCircle size={20} />
            <span>Advance Payment Required</span>
          </div>
          <p className="text-sm text-amber-700">
            Send <span className="font-bold text-amber-900">PKR {order?.advance_amount || '0'}</span> (50%) now.
            <br />Remaining <span className="font-bold">PKR {order?.advance_amount || '0'}</span> collected on delivery.
          </p>
          {order?.payment_method === 'advance_easypaisa' && (
            <div className="text-sm text-amber-800 space-y-1 bg-white/60 rounded-lg p-3">
              <p><span className="font-medium">JazzCash:</span> {accounts?.easypaisa?.number || '03257163224'}</p>
              <p><span className="font-medium">EasyPaisa:</span> {accounts?.easypaisa?.number || '03257163224'}</p>
              <p><span className="font-medium">NayaPay:</span> {accounts?.easypaisa?.number || '03257163224'}</p>
              <p><span className="font-medium">Account Holder:</span> {accounts?.easypaisa?.holder || 'Muhammed Haider'}</p>
            </div>
          )}
          {order?.payment_method === 'advance_bank' && (
            <div className="text-sm text-amber-800 space-y-1 bg-white/60 rounded-lg p-3">
              <p><span className="font-medium">Bank:</span> {accounts?.bank?.bank_name}</p>
              <p><span className="font-medium">Account Title:</span> {accounts?.bank?.account_title}</p>
              <p><span className="font-medium">Account #:</span> {accounts?.bank?.account_number}</p>
              {accounts?.bank?.iban && <p><span className="font-medium">IBAN:</span> {accounts?.bank?.iban}</p>}
            </div>
          )}
          <p className="text-xs text-amber-600">We will verify your payment within 24 hours.</p>
          <p className="text-xs text-red-600 font-medium mt-2">⚠ Server payment verification may be delayed. In case of delay, please use Bank Transfer or contact us on WhatsApp. Your order will ship only after payment confirmation.</p>
        </motion.div>

        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          Continue Shopping <HiArrowRight />
        </Link>
      </motion.div>
    </div>
  )
}
