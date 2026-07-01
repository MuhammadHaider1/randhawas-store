import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import {
  HiMenu, HiX, HiShoppingBag, HiUser, HiSearch,
  HiMoon, HiSun, HiLogout, HiCog, HiChevronDown,
} from 'react-icons/hi'
import { logout } from '../../store/authSlice'
import { useTheme } from '../../context/ThemeContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
]

export default function Navbar({ onCartOpen }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [catDropdownOpen, setCatDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const catDropdownRef = useRef(null)
  const { itemCount } = useSelector((s) => s.cart)
  const { user } = useSelector((s) => s.auth)
  const { categories } = useSelector((s) => s.products)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { dark, toggle: toggleTheme } = useTheme()

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) setCatDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const displayName = user?.first_name || user?.username || 'User'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>

          <Link to="/" className="font-serif text-xl md:text-2xl font-bold tracking-wide text-luxury-charcoal dark:text-white">
            <span className="text-primary-600">Randa</span>haws
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className={`text-sm uppercase tracking-widest font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === l.to ? 'text-primary-600' : 'text-luxury-charcoal dark:text-gray-300'
                }`}>
                {l.label}
              </Link>
            ))}
            <div className="relative" ref={catDropdownRef}>
              <button onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                className="flex items-center gap-1 text-sm uppercase tracking-widest font-medium text-luxury-charcoal dark:text-gray-300 hover:text-primary-600 transition-colors">
                Categories <HiChevronDown size={14} className={`transition-transform ${catDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {catDropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute left-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 py-2 max-h-80 overflow-y-auto">
                    {categories.map((cat) => (
                      <Link key={cat.id} to={`/shop?category=${cat.id}`} onClick={() => setCatDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        {cat.image && <img src={cat.image} alt="" className="w-8 h-8 rounded-lg object-cover" />}
                        <div>
                          <p className="font-medium">{cat.name}</p>
                          {cat.product_count !== undefined && <p className="text-xs text-gray-400">{cat.product_count} items</p>}
                        </div>
                      </Link>
                    ))}
                    <div className="border-t dark:border-gray-700 mt-1 pt-1">
                      <Link to="/shop" onClick={() => setCatDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-primary-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-700">View All</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-primary-600 transition-colors dark:text-gray-300">
              <HiSearch size={20} />
            </button>

            <button onClick={toggleTheme} className="p-2 hover:text-primary-600 transition-colors dark:text-gray-300">
              {dark ? <HiSun size={20} /> : <HiMoon size={20} />}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <HiUser size={18} className="text-primary-600" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-luxury-charcoal dark:text-gray-200 max-w-[100px] truncate">
                    {displayName}
                  </span>
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 py-2">
                      <div className="px-4 py-2 border-b dark:border-gray-700">
                        <p className="text-sm font-medium text-luxury-charcoal dark:text-white truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <HiCog size={16} /> Profile Settings
                      </Link>
                      <button onClick={() => { dispatch(logout()); setDropdownOpen(false); navigate('/') }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <HiLogout size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex p-2 hover:text-primary-600 dark:text-gray-300">
                <HiUser size={20} />
              </Link>
            )}

            <button onClick={onCartOpen} className="relative p-2 hover:text-primary-600 dark:text-gray-300">
              <HiShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
            <div className="px-4 py-4 space-y-3">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                  className={`block text-sm uppercase tracking-widest ${location.pathname === l.to ? 'text-primary-600' : 'text-luxury-charcoal dark:text-gray-300'}`}>
                  {l.label}
                </Link>
              ))}
              <p className="text-xs uppercase tracking-widest text-gray-400 pt-2">Categories</p>
              {categories.map((cat) => (
                <Link key={cat.id} to={`/shop?category=${cat.id}`} onClick={() => setMobileOpen(false)}
                  className="block text-sm text-luxury-charcoal dark:text-gray-300 pl-2">{cat.name}</Link>
              ))}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}
                    className="block text-sm text-luxury-charcoal dark:text-gray-300">Profile</Link>
                  <button onClick={() => { dispatch(logout()); setMobileOpen(false); navigate('/') }}
                    className="block text-sm text-red-500">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-500">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="border-t bg-white dark:bg-gray-900 dark:border-gray-800 px-4 py-3">
            <input type="text" placeholder="Search products..." autoFocus onBlur={() => setSearchOpen(false)}
              className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-primary-500 outline-none text-sm dark:text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
