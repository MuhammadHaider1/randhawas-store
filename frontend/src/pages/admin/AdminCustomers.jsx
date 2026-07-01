import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiSearch, HiPencil, HiMail, HiPhone } from 'react-icons/hi'
import api from '../../utils/api'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [editModal, setEditModal] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchCustomers = useCallback(async () => {
    try {
      const { data } = await api.get('/dashboard/customers/')
      setCustomers(data.results || data)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  const filtered = customers.filter((c) =>
    c.username?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  const viewCustomer = (customer) => {
    setSelected(customer)
    setEditModal(false)
  }

  const openEdit = () => {
    setEditForm({
      username: selected.username || '',
      email: selected.email || '',
      phone: selected.phone || '',
      whatsapp: selected.whatsapp || '',
      is_active: selected.is_active ?? true,
    })
    setEditModal(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.patch(`/dashboard/customers/${selected.id}/`, editForm)
      setSelected(data)
      setEditModal(false)
      fetchCustomers()
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  const toggleActive = async (customer) => {
    try {
      await api.patch(`/dashboard/customers/${customer.id}/`, { is_active: !customer.is_active })
      fetchCustomers()
    } catch { /* ignore */ }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">{customers.length} total customers</p>
        </div>
        <div className="relative max-w-xs w-full">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search customers..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => viewCustomer(customer)}
              className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                    {customer.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{customer.username}</p>
                    <p className="text-xs text-gray-500">{customer.email || 'No email'}</p>
                  </div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${customer.is_active ? 'bg-emerald-500' : 'bg-red-400'}`} />
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                {customer.phone && <p className="flex items-center gap-1.5"><HiPhone size={14} /> {customer.phone}</p>}
                <p className="flex items-center gap-1.5"><HiMail size={14} /> {customer.order_count || 0} orders</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-gray-400">PKR {Number(customer.total_spent || 0).toLocaleString()} spent</span>
                <span className="text-gray-400">Joined {new Date(customer.date_joined).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">No customers found</div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selected && !editModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50" onClick={() => setSelected(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-20 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md w-full z-50 bg-white rounded-xl shadow-xl">
              <div className="border-b px-6 py-4 flex items-center justify-between">
                <h2 className="font-semibold text-lg">Customer Details</h2>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><HiX size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-2xl">
                    {selected.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selected.username}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${selected.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {selected.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-500">Email</p><p className="font-medium">{selected.email || '-'}</p></div>
                  <div><p className="text-gray-500">Phone</p><p className="font-medium">{selected.phone || '-'}</p></div>
                  <div><p className="text-gray-500">WhatsApp</p><p className="font-medium">{selected.whatsapp || '-'}</p></div>
                  <div><p className="text-gray-500">Orders</p><p className="font-medium">{selected.order_count || 0}</p></div>
                  <div><p className="text-gray-500">Total Spent</p><p className="font-medium">PKR {Number(selected.total_spent || 0).toLocaleString()}</p></div>
                  <div><p className="text-gray-500">Joined</p><p className="font-medium">{new Date(selected.date_joined).toLocaleDateString()}</p></div>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <button onClick={openEdit} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-all">
                    <HiPencil size={16} /> Edit
                  </button>
                  <button onClick={() => { toggleActive(selected); setSelected({ ...selected, is_active: !selected.is_active }) }}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all ${selected.is_active ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}>
                    {selected.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50" onClick={() => setEditModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-20 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md w-full z-50 bg-white rounded-xl shadow-xl">
              <div className="border-b px-6 py-4 flex items-center justify-between">
                <h2 className="font-semibold text-lg">Edit Customer</h2>
                <button onClick={() => setEditModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><HiX size={20} /></button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input value={editForm.whatsapp} onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <button type="button" onClick={() => setEditModal(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border transition-all">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
