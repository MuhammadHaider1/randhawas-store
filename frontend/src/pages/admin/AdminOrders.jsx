import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiCheck, HiTruck, HiEye, HiPhotograph, HiCash, HiBadgeCheck } from 'react-icons/hi'
import api from '../../utils/api'

const statusColors = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  delivered: 'bg-green-600 text-white border-green-600',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
}

const paymentBadge = {
  cod: { label: 'COD', class: 'bg-gray-100 text-gray-600' },
  advance_easypaisa: { label: 'EasyPaisa/JazzCash', class: 'bg-purple-50 text-purple-700' },
  advance_bank: { label: 'Bank Transfer', class: 'bg-blue-50 text-blue-700' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [payFilter, setPayFilter] = useState('')
  const [selected, setSelected] = useState(null)

  const fetchOrders = useCallback(async () => {
    try {
      const params = {}
      if (filter) params.status = filter
      if (payFilter) params.payment_method = payFilter
      const { data } = await api.get('/dashboard/orders/', { params })
      setOrders(data.results || data)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [filter, payFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const updateStatus = async (id, status, paymentStatus) => {
    try {
      const payload = {}
      if (status) payload.status = status
      if (paymentStatus) payload.payment_status = paymentStatus
      await api.patch(`/dashboard/orders/${id}/`, payload)
      fetchOrders()
      if (selected?.id === id) {
        setSelected((prev) => ({ ...prev, ...payload }))
      }
    } catch { /* ignore */ }
  }

  const viewOrder = async (order) => {
    try {
      const { data } = await api.get(`/dashboard/orders/${order.id}/`)
      setSelected(data)
    } catch { /* ignore */ }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all capitalize
                ${filter === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-gray-500 self-center mr-1">Payment:</span>
        {['', 'cod', 'advance_easypaisa', 'advance_bank'].map((pm) => (
          <button key={pm} onClick={() => setPayFilter(pm)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all
              ${payFilter === pm ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            {pm === '' ? 'All' : pm === 'cod' ? 'COD' : pm === 'advance_easypaisa' ? 'EasyPaisa' : 'Bank'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Order</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => {
                  const pm = paymentBadge[order.payment_method] || paymentBadge.cod
                  return (
                    <motion.tr key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-xs font-medium">{order.order_id}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.customer_phone}</p>
                      </td>
                      <td className="py-3 px-4 font-medium">PKR {Number(order.total).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pm.class}`}>{pm.label}</span>
                          {order.payment_method !== 'cod' && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              order.payment_status === 'verified' ? 'bg-emerald-50 text-emerald-700' :
                              order.payment_status === 'received' ? 'bg-amber-50 text-amber-700' :
                              'bg-gray-50 text-gray-500'
                            }`}>{order.payment_status}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${statusColors[order.status] || 'bg-gray-50 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => viewOrder(order)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                          <HiEye size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50" onClick={() => setSelected(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-10 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-lg w-full z-50 bg-white rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="font-semibold text-lg">{selected.order_id}</h2>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><HiX size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-500">Customer</p><p className="font-medium">{selected.customer_name}</p></div>
                  <div><p className="text-gray-500">Phone</p><p className="font-medium">{selected.customer_phone}</p></div>
                  <div><p className="text-gray-500">Email</p><p className="font-medium">{selected.customer_email || '-'}</p></div>
                  <div><p className="text-gray-500">WhatsApp</p><p className="font-medium">{selected.customer_whatsapp || '-'}</p></div>
                  <div className="col-span-2"><p className="text-gray-500">Address</p><p className="font-medium">{selected.shipping_address}</p></div>
                  <div><p className="text-gray-500">City</p><p className="font-medium">{selected.city}</p></div>
                  <div><p className="text-gray-500">Date</p><p className="font-medium">{new Date(selected.created_at).toLocaleString()}</p></div>
                </div>

                {selected.payment_method !== 'cod' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          <HiCash className="inline mr-1" size={16} />
                          {selected.payment_method === 'advance_easypaisa' ? 'EasyPaisa/JazzCash' : 'Bank Transfer'}
                        </p>
                        <p className="text-xs text-amber-600">Advance: PKR {Number(selected.advance_amount).toLocaleString()}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        selected.payment_status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                        selected.payment_status === 'received' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{selected.payment_status}</span>
                    </div>
                    {selected.payment_receipt && (
                      <div>
                        <p className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1">
                          <HiPhotograph size={14} /> Payment Receipt
                        </p>
                        <a href={selected.payment_receipt} target="_blank" rel="noopener noreferrer">
                          <img src={selected.payment_receipt} alt="Payment Receipt"
                            className="max-h-40 rounded-lg border border-amber-300 cursor-pointer hover:opacity-90 transition-opacity" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-medium text-sm mb-3">Items</h3>
                  <div className="space-y-2">
                    {selected.items?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-xs text-gray-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">PKR {Number(item.price).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>PKR {Number(selected.subtotal || selected.total).toLocaleString()}</span></div>
                  {selected.discount_amount > 0 && (
                    <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="text-red-500">-PKR {Number(selected.discount_amount).toLocaleString()}</span></div>
                  )}
                  <div className="flex justify-between font-semibold text-base pt-1 border-t"><span>Total</span><span>PKR {Number(selected.total).toLocaleString()}</span></div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  {selected.payment_method !== 'cod' && selected.payment_status !== 'verified' && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Payment Verification</p>
                      <div className="flex flex-wrap gap-2">
                        {selected.payment_status === 'pending' && (
                          <button onClick={() => updateStatus(selected.id, null, 'received')}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 transition-all">
                            <HiCash size={16} /> Mark as Received
                          </button>
                        )}
                        {(selected.payment_status === 'received' || selected.payment_status === 'pending') && (
                          <button onClick={() => updateStatus(selected.id, null, 'verified')}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all">
                            <HiBadgeCheck size={16} /> Verify Payment
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Order Status</p>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                        <button key={s} onClick={() => updateStatus(selected.id, s, null)}
                          disabled={selected.status === s}
                          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-all capitalize
                            ${selected.status === s ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' :
                              s === 'cancelled' ? 'border-rose-200 text-rose-600 hover:bg-rose-50' :
                              'border-primary-200 text-primary-600 hover:bg-primary-50'}`}>
                          {s === 'confirmed' && <HiCheck size={16} />}
                          {s === 'shipped' && <HiTruck size={16} />}
                          {s === 'cancelled' && <HiX size={16} />}
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
