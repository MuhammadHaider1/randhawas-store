import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { login } from '../store/authSlice'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((s) => s.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(login(form))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome back!')
      const user = result.payload?.user
      if (user?.is_admin_user) navigate('/admin')
      else navigate('/')
    } else toast.error(result.payload || 'Login failed')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl p-8 border">
        <h1 className="font-serif text-2xl font-semibold text-center mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm font-medium">Username</label>
            <input type="text" name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required /></div>
          <div><label className="text-sm font-medium">Password</label>
            <input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required /></div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-6">Don't have an account? <Link to="/register" className="text-primary-600 hover:underline">Register</Link></p>
      </motion.div>
    </div>
  )
}
