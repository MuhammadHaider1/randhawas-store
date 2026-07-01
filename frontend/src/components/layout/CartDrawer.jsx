import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { HiX, HiMinus, HiPlus, HiTrash } from 'react-icons/hi'
import { removeFromCart, updateQuantity } from '../../store/cartSlice'

export default function CartDrawer({ isOpen, onClose }) {
  const { items, total, itemCount } = useSelector((s) => s.cart)
  const dispatch = useDispatch()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/50 z-50" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-serif text-lg">Cart ({itemCount})</h2>
              <button onClick={onClose} className="p-2 hover:text-primary-600"><HiX size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-gray-400"><p className="text-lg">Your cart is empty</p></div>
              ) : items.map((item) => (
                <motion.div key={item.cartKey} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 bg-gray-50 rounded-xl p-3">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/shop/${item.slug}`} onClick={onClose}
                      className="font-medium text-sm hover:text-primary-600 line-clamp-1">{item.name}</Link>
                    <p className="text-xs text-gray-500">{item.size && `Size: ${item.size}`} {item.color && `| ${item.color}`}</p>
                    <p className="text-sm font-semibold mt-1">${item.discountPrice || item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => dispatch(updateQuantity({ cartKey: item.cartKey, quantity: item.quantity - 1 }))}
                        className="p-1 rounded-md hover:bg-gray-200"><HiMinus size={14} /></button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ cartKey: item.cartKey, quantity: item.quantity + 1 }))}
                        className="p-1 rounded-md hover:bg-gray-200"><HiPlus size={14} /></button>
                      <button onClick={() => dispatch(removeFromCart(item.cartKey))}
                        className="ml-auto p-1 text-red-400 hover:text-red-600"><HiTrash size={16} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Link to="/checkout" onClick={onClose} className="btn-primary w-full text-center block">Checkout</Link>
                <button onClick={onClose} className="w-full text-sm text-gray-500 hover:text-luxury-charcoal text-center">Continue Shopping</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
