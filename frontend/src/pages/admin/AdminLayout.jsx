import { useState } from 'react'
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChartBar, HiCube, HiClipboardList, HiUsers, HiLogout, HiMenu, HiX, HiHome } from 'react-icons/hi'
import { logout } from '../../store/authSlice'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: HiChartBar, end: true },
  { to: '/admin/products', label: 'Products', icon: HiCube },
  { to: '/admin/orders', label: 'Orders', icon: HiClipboardList },
  { to: '/admin/customers', label: 'Customers', icon: HiUsers },
]

export default function AdminLayout() {
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isAuthenticated || !user?.is_admin_user) return <Navigate to="/login" replace />

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r shadow-sm
          ${sidebarOpen ? 'block' : 'hidden'} lg:block transition-all`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h1 className="font-serif text-xl font-bold text-luxury-charcoal">Randahaws</h1>
              <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
            </div>
            <button className="lg:hidden p-1" onClick={() => setSidebarOpen(false)}>
              <HiX size={20} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${isActive ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'}`
                }
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t space-y-2">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <HiHome size={20} />
              View Website
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <HiLogout size={20} />
              Logout
            </button>
            <div className="px-4 py-2 text-xs text-gray-400">
              Logged in as <span className="font-medium">{user?.username}</span>
            </div>
          </div>
        </div>
      </motion.aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b lg:hidden">
          <div className="flex items-center justify-between px-4 h-14">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-gray-100">
              <HiMenu size={22} />
            </button>
            <h1 className="font-serif font-bold text-luxury-charcoal">Randahaws Admin</h1>
            <div className="w-10" />
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
