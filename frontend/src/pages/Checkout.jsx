import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'

const paymentMethods = [
  { value: 'advance_easypaisa', label: '50% Advance via EasyPaisa/JazzCash', desc: 'Send 50% payment & upload receipt' },
  { value: 'advance_bank', label: '50% Advance via Bank Transfer (3% OFF)', desc: 'Bank transfer & get 3% discount – upload receipt' },
]

export default function Checkout() {
  const { items, total } = useSelector((s) => s.cart)
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('advance_easypaisa')
  const [receiptFile, setReceiptFile] = useState(null)
  const [receiptPreview, setReceiptPreview] = useState(null)
  const [accounts, setAccounts] = useState(null)
  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    customer_whatsapp: '', shipping_address: '', city: '', notes: '',
  })

  useEffect(() => {
    if (items.length === 0) navigate('/cart', { replace: true })
    api.get('/orders/payment-accounts/').then(({ data }) => setAccounts(data)).catch(() => {})
  }, [items, navigate])

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const productDiscount = subtotal - total
  const bankDiscount = paymentMethod === 'advance_bank' ? total * 0.03 : 0
  const orderTotal = total - bankDiscount
  const totalDiscount = productDiscount + bankDiscount
  const advanceAmount = (orderTotal * 0.5).toFixed(2)
  const remainingAmount = (orderTotal * 0.5).toFixed(2)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleReceipt = (e) => {
    const file = e.target.files[0]
    if (file) {
      setReceiptFile(file)
      setReceiptPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.customer_name || !form.customer_phone || !form.shipping_address) {
      return toast.error('Please fill in all required fields')
    }
    if (items.length === 0) return toast.error('Your cart is empty')
    if (!receiptFile) {
      return toast.error('Please upload payment receipt')
    }
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('subtotal', subtotal)
      fd.append('discount_amount', totalDiscount)
      fd.append('total', orderTotal)
      fd.append('payment_method', paymentMethod)
      fd.append('advance_amount', advanceAmount)
      if (bankDiscount > 0) fd.append('bank_discount', bankDiscount.toFixed(2))
      if (receiptFile) fd.append('payment_receipt', receiptFile)
      items.forEach((item, idx) => {
        if (item.product) fd.append(`items[${idx}]product`, item.product)
        fd.append(`items[${idx}]product_name`, item.name)
        if (item.image) fd.append(`items[${idx}]product_image`, item.image)
        fd.append(`items[${idx}]size`, item.size || '')
        fd.append(`items[${idx}]color`, item.color || '')
        fd.append(`items[${idx}]quantity`, item.quantity)
        fd.append(`items[${idx}]price`, item.price)
        if (item.discountPrice) fd.append(`items[${idx}]discount_price`, item.discountPrice)
      })

      const { data } = await api.post('/orders/create/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      navigate(`/order-success/${data.order_id}`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Order failed. Please try again.')
    } finally { setLoading(false) }
  }

  if (items.length === 0) return null

  const currentAccount = paymentMethod === 'advance_easypaisa' ? accounts?.easypaisa
    : paymentMethod === 'advance_bank' ? accounts?.bank
    : accounts?.easypaisa

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <h1 className="font-serif text-3xl font-semibold mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-5 gap-8">
        <motion.form ref={formRef} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit} className="lg:col-span-3 space-y-6" encType="multipart/form-data">

          <div className="bg-white rounded-xl p-6 border space-y-4">
            <h2 className="font-medium text-lg">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Full Name *</label>
                <input type="text" name="customer_name" value={form.customer_name} onChange={handleChange}
                  className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required /></div>
              <div><label className="text-sm font-medium">Email</label>
                <input type="email" name="customer_email" value={form.customer_email} onChange={handleChange}
                  className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Phone Number *</label>
                <input type="tel" name="customer_phone" value={form.customer_phone} onChange={handleChange}
                  className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required /></div>
              <div><label className="text-sm font-medium">WhatsApp Number</label>
                <input type="tel" name="customer_whatsapp" value={form.customer_whatsapp} onChange={handleChange}
                  className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border space-y-4">
            <h2 className="font-medium text-lg">Shipping Address</h2>
            <textarea name="shipping_address" value={form.shipping_address} onChange={handleChange} rows={3}
              className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required />
            <div><label className="text-sm font-medium">City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange}
                className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" /></div>
          </div>

          <div className="bg-white rounded-xl p-6 border space-y-4">
            <h2 className="font-medium text-lg">Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <label key={pm.value} onClick={() => setPaymentMethod(pm.value)}
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all
                    ${paymentMethod === pm.value ? 'border-primary-500 bg-primary-50/50 ring-1 ring-primary-500' : 'hover:border-gray-300'}`}>
                  <input type="radio" name="payment_method" value={pm.value}
                    checked={paymentMethod === pm.value} onChange={() => {}} className="mt-1 accent-primary-600" />
                  <div>
                    <p className="font-medium text-sm">{pm.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{pm.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <AnimatePresence>
              {currentAccount && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2 mt-2">
                    <p className="font-semibold text-sm text-amber-800">
                      Send <span className="text-lg">PKR {advanceAmount}</span> (50% of PKR {orderTotal.toFixed(2)})
                    </p>
                    <p className="text-xs text-amber-600">Remaining PKR {remainingAmount} will be collected on delivery</p>
                    <div className="text-sm space-y-1 text-amber-900">
                      {paymentMethod === 'advance_easypaisa' && (
                        <>
                          <p><span className="font-medium">JazzCash:</span> {accounts?.easypaisa?.number || '03257163224'}</p>
                          <p><span className="font-medium">EasyPaisa:</span> {accounts?.easypaisa?.number || '03257163224'}</p>
                          <p><span className="font-medium">NayaPay:</span> {accounts?.easypaisa?.number || '03257163224'}</p>
                          <p><span className="font-medium">Account Holder:</span> {accounts?.easypaisa?.holder || 'Muhammed Haider'}</p>
                        </>
                      )}
                      {paymentMethod === 'advance_bank' && (
                        <>
                          <p className="font-semibold text-green-700">🎉 3% Bank Discount Applied!</p>
                          <p className="text-xs text-green-600 mt-1 mb-2">Pay via bank transfer & get 3% off your total!</p>
                          <div>
                            <p><span className="font-medium">Bank:</span> {accounts?.bank?.bank_name}</p>
                            <p><span className="font-medium">Account Title:</span> {accounts?.bank?.account_title}</p>
                            <p><span className="font-medium">Account #:</span> {accounts?.bank?.account_number}</p>
                            {accounts?.bank?.iban && <p><span className="font-medium">IBAN:</span> {accounts?.bank?.iban}</p>}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs text-red-700 font-medium">⚠ Note: Server payment verification may be delayed. In case of delay, please use Bank Transfer or contact us on WhatsApp. Your order will only ship after payment is confirmed.</p>
                  </div>

                  <div className="mt-3">
                    <label className="text-sm font-medium">Upload Payment Receipt/Screenshot *</label>
                    <input type="file" accept="image/*" onChange={handleReceipt}
                      className="w-full mt-1 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                    {receiptPreview && (
                      <div className="mt-2 relative inline-block">
                        <img src={receiptPreview} alt="Receipt" className="h-24 rounded-lg border object-cover" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-xl p-6 border space-y-4">
            <h2 className="font-medium text-lg">Order Notes</h2>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
              placeholder="Any special requests?" className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
            {loading ? 'Processing...' : `Place Order – PKR ${total.toFixed(2)}`}
          </button>
        </motion.form>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 border sticky top-24 space-y-4">
            <h2 className="font-medium text-lg">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.cartKey} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity} {item.size && `– ${item.size}`}</p>
                    <p className="text-sm font-semibold">PKR {((item.discountPrice || item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>PKR {subtotal.toFixed(2)}</span></div>
              {productDiscount > 0 && (
                <div className="flex justify-between text-red-500"><span>Discount</span><span>-PKR {productDiscount.toFixed(2)}</span></div>
              )}
              {bankDiscount > 0 && (
                <div className="flex justify-between text-green-600"><span>Bank Discount (3%)</span><span>-PKR {bankDiscount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-emerald-600 font-medium">Free</span></div>
              <div className="flex justify-between text-amber-700"><span>Advance (50%)</span><span className="font-semibold">PKR {advanceAmount}</span></div>
              <div className="flex justify-between text-gray-500"><span>Remaining on Delivery</span><span>PKR {remainingAmount}</span></div>
              <hr />
              <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>PKR {orderTotal.toFixed(2)}</span></div>
            </div>
            <p className="text-xs text-gray-400 text-center pt-2">
              Send PKR {advanceAmount} (50%) advance & upload receipt. Remaining PKR {remainingAmount} on delivery. {bankDiscount > 0 && '3% bank discount applied.'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
