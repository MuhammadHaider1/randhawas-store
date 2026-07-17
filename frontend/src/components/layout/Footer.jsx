import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiHeart } from 'react-icons/hi'

export default function Footer() {
  return (
    <footer className="bg-luxury-charcoal text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="font-serif text-2xl text-white mb-4">
              <span className="text-primary-400">RAND</span>HAWAS
            </h3>
            <p className="text-sm leading-relaxed">
              Premium women's fashion — from elegant heels and handbags to trendy suits, jewelry, and makeup. Designed for the confident, modern woman.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="font-serif text-lg text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?is_featured=true" className="hover:text-white transition-colors">Featured</Link></li>
              <li><Link to="/order-tracking" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="font-serif text-lg text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>hirarandhawa660@gmail.com</li>
              <li>+92 341 6275384</li>
            </ul>
          </motion.div>
        </div>
      </div>
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} RANDHAWAS. All rights reserved.</p>
          <p className="flex items-center gap-1">Made with <HiHeart className="text-primary-500" /> for fashion lovers</p>
        </div>
      </div>
    </footer>
  )
}
