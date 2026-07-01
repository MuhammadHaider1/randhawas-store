import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiShoppingBag, HiClock } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { addToCart } from '../../store/cartSlice'

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch()
  const isComing = product.is_coming_soon
  const handleAdd = (e) => {
    if (isComing) return
    e.preventDefault()
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success('Added to cart!')
  }

  return (
    <Link to={`/shop/${product.slug}`} className="group block">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: index * 0.05 }}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden card-hover border border-gray-100 dark:border-gray-700">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          {product.primary_image ? (
            <img src={product.primary_image} alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600 text-sm">No Image</div>
          )}
          {isComing ? (
              <span className="absolute top-3 left-3 bg-amber-500 dark:bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <HiClock size={12} /> Coming Soon
              </span>
          ) : product.has_discount ? (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{product.discount_percent}%
            </span>
          ) : null}
          {!isComing && (
            <button onClick={handleAdd}
              className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg
                         opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-600 hover:text-white">
              <HiShoppingBag size={18} />
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">{product.name}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 capitalize">{product.category_name}</p>
          <div className="flex items-center gap-2 mt-2">
            {isComing ? (
              <span className="text-xs text-amber-600 font-medium">Coming Soon</span>
            ) : product.has_discount ? (
              <>
                <span className="font-semibold text-primary-600 dark:text-red-400">PKR {product.discount_price}</span>
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through">PKR {product.price}</span>
              </>
            ) : (
              <span className="font-semibold dark:text-red-400">PKR {product.price}</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
