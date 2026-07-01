import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiShoppingBag, HiCurrencyDollar, HiClipboardList, HiCube, HiUsers, HiCash, HiBadgeCheck, HiEye, HiX } from 'react-icons/hi'
import api from '../../utils/api'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function DashboardHome() {
  const [stats, setStats] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    api.get('/dashboard/stats/').then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  const statCards = stats ? [
    { label: 'Total Orders', value: stats.total_orders, icon: HiClipboardList, color: 'from-blue-500 to-blue-600' },
    { label: 'Pending Orders', value: stats.pending_orders, icon: HiShoppingBag, color: 'from-amber-500 to-amber-600' },
    { label: 'Total Revenue', value: `PKR ${Number(stats.total_revenue).toLocaleString()}`, icon: HiCurrencyDollar, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Advance Orders', value: stats.advance_orders || 0, icon: HiCash, color: 'from-purple-500 to-purple-600' },
    { label: 'Pending Verify', value: stats.pending_verification || 0, icon: HiBadgeCheck, color: 'from-rose-500 to-rose-600' },
    { label: 'Products', value: stats.total_products, icon: HiCube, color: 'from-primary-500 to-primary-600' },
    { label: 'Customers', value: stats.total_customers, icon: HiUsers, color: 'from-violet-500 to-violet-600' },
  ] : []

  const pendingPayments = stats?.pending_payment_orders || []

  const formatDate = (d) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.h1 variants={item} className="font-serif text-2xl sm:text-3xl font-semibold mb-2">Dashboard</motion.h1>
      <motion.p variants={item} className="text-gray-500 mb-8">Welcome to your admin dashboard</motion.p>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-11 h-11 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center mb-3 shadow-sm`}>
              <card.icon className="text-white" size={20} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-xl p-6 border shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Pending Payment Orders</h2>
          <span className="text-xs bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-medium">{pendingPayments.length} pending</span>
        </div>
        {pendingPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Payment</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Receipt</th>
                  <th className="pb-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium">{order.order_id}</td>
                    <td className="py-3">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.customer_phone}</p>
                    </td>
                    <td className="py-3 text-xs text-gray-600">{formatDate(order.created_at)}</td>
                    <td className="py-3 font-medium">PKR {Number(order.total).toLocaleString()}</td>
                    <td className="py-3 text-xs capitalize">{order.payment_method?.replace('_', ' ')}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        order.payment_status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        order.payment_status === 'received' ? 'bg-blue-50 text-blue-700' :
                        order.payment_status === 'verified' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>{order.payment_status}</span>
                    </td>
                    <td className="py-3">
                      {order.receipt_url ? (
                        <img
                          src={order.receipt_url}
                          alt="receipt"
                          className="w-12 h-12 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                          onClick={() => setSelectedOrder(order)}
                        />
                      ) : <span className="text-xs text-gray-400">No receipt</span>}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary-600 hover:text-primary-800 text-xs font-medium flex items-center gap-1"
                      >
                        <HiEye size={16} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-sm text-gray-400 py-4 text-center">No pending payment orders</p>}
      </motion.div>

      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
                <h3 className="font-semibold text-lg">Order {selectedOrder.order_id}</h3>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <HiX size={20} />
                </button>
              </div>
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Customer</p>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{selectedOrder.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{selectedOrder.customer_email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">WhatsApp</p>
                    <p className="font-medium">{selectedOrder.customer_whatsapp || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Shipping Address</p>
                    <p className="font-medium">{selectedOrder.shipping_address}{selectedOrder.city ? `, ${selectedOrder.city}` : ''}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order Date</p>
                    <p className="font-medium text-xs">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-semibold text-lg text-primary-600">PKR {Number(selectedOrder.total).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Payment Receipt</p>
                  {selectedOrder.receipt_url ? (
                    <img
                      src={selectedOrder.receipt_url}
                      alt="Payment Receipt"
                      className="w-full rounded-xl border object-contain max-h-80"
                    />
                  ) : <p className="text-sm text-gray-400">No receipt uploaded</p>}
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {item.product_image && (
                          <img src={item.product_image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product_name}</p>
                          <p className="text-xs text-gray-500">x{item.quantity} {item.size && `• ${item.size}`} {item.color && `• ${item.color}`}</p>
                        </div>
                        <p className="text-sm font-medium">PKR {Number(item.price).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="bg-white rounded-xl p-6 border shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {stats?.recent_orders?.length > 0 ? stats.recent_orders.map((order) => (
              <div key={order.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{order.order_id}</p>
                  <p className="text-xs text-gray-500">{order.customer_name} &middot; {order.customer_phone}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="font-medium text-sm">PKR {Number(order.total).toLocaleString()}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                    order.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    order.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    order.status === 'shipped' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    order.status === 'delivered' ? 'bg-green-600 text-white' :
                    'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            )) : <p className="text-sm text-gray-400 py-4 text-center">No orders yet</p>}
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-xl p-6 border shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Top Selling Products</h2>
          {stats?.top_products?.length > 0 ? (
            <div className="space-y-4">
              {stats.top_products.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                      <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${Math.min((p.sold / (stats.top_products[0]?.sold || 1)) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{p.sold} sold</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400 py-4 text-center">No sales data yet</p>}
        </motion.div>
      </div>
    </motion.div>
  )
}