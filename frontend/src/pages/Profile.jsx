import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import { HiUser, HiMail, HiPhone, HiSave } from 'react-icons/hi'
import api from '../utils/api'
import { fetchMe } from '../store/authSlice'

export default function Profile() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', whatsapp: '', username: '',
  })

  useEffect(() => {
    if (user) setForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      whatsapp: user.whatsapp || '',
      username: user.username || '',
    })
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/auth/profile/', form)
      dispatch(fetchMe())
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <>
      <Helmet><title>My Profile – Randahaws Heel Shoes</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-3xl font-semibold mb-8">My Profile</h1>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 border space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <HiUser size={28} className="text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-lg">{user.first_name || user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <input type="text" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input type="text" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Username</label>
              <div className="relative mt-1">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative mt-1">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <div className="relative mt-1">
                <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">WhatsApp</label>
              <div className="relative mt-1">
                <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="btn-primary w-full flex items-center justify-center gap-2">
              <HiSave size={18} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </>
  )
}