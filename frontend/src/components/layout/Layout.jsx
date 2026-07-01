import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function Layout() {
  const [cartOpen, setCartOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <motion.main key={location.pathname} variants={pageVariants} initial="initial" animate="animate"
        className={`flex-1 ${isHome ? '' : 'pt-20'}`}>
        <Outlet />
      </motion.main>
      {!isHome && <Footer />}
    </div>
  )
}
