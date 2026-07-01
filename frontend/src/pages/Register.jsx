import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { register } from '../store/authSlice'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '', phone: '', whatsapp: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(register(form))
    if (result.meta.requestStatus === 'fulfilled') { toast.success('Account created!'); navigate('/') }
    else toast.error(result.payload || 'Registration failed')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl p-8 border">
        <h1 className="font-serif text-2xl font-semibold text-center mb-6">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['username','email','password','first_name','last_name','phone','whatsapp'].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium capitalize">{field.replace('_', ' ')}{['username','email','password'].includes(field) ? ' *' : ''}</label>
              <input type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                required={['username','email','password'].includes(field)} minLength={field === 'password' ? 8 : undefined} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-6">Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Sign In</Link></p>
      </motion.div>
    </div>
  )
}
