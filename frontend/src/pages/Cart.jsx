import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiTrash, HiMinus, HiPlus, HiArrowLeft } from 'react-icons/hi'
import { removeFromCart, updateQuantity } from '../store/cartSlice'

export default function Cart() {
  const { items, total, itemCount } = useSelector((s) => s.cart)
  const dispatch = useDispatch()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Add some products to get started!</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2"><HiArrowLeft /> Shop Now</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <h1 className="font-serif text-3xl font-semibold mb-8">Shopping Cart ({itemCount} items)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div key={item.cartKey} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex gap-4 bg-white rounded-xl p-4 border">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/shop/${item.slug}`} className="font-medium hover:text-primary-600">{item.name}</Link>
                <p className="text-sm text-gray-500">{item.size && `Size: ${item.size}`} {item.color && `| ${item.color}`}</p>
                <p className="font-semibold mt-1">PKR {(item.discountPrice || item.price).toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => dispatch(updateQuantity({ cartKey: item.cartKey, quantity: item.quantity - 1 }))}
                      className="p-2 hover:bg-gray-100 rounded-l-lg"><HiMinus size={14} /></button>
                    <span className="px-4 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ cartKey: item.cartKey, quantity: item.quantity + 1 }))}
                      className="p-2 hover:bg-gray-100 rounded-r-lg"><HiPlus size={14} /></button>
                  </div>
                  <button onClick={() => dispatch(removeFromCart(item.cartKey))}
                    className="text-red-400 hover:text-red-600 p-2"><HiTrash size={18} /></button>
                </div>
              </div>
              <div className="text-right font-semibold">PKR {((item.discountPrice || item.price) * item.quantity).toFixed(2)}</div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border h-fit sticky top-24">
          <h3 className="font-medium text-lg mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal ({itemCount} items)</span><span className="font-medium">PKR {total.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-gray-500">Free</span></div>
            <hr />
            <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>PKR {total.toFixed(2)}</span></div>
          </div>
          <Link to="/checkout" className="btn-primary w-full text-center mt-6 block">Proceed to Checkout</Link>
          <Link to="/shop" className="block text-center text-sm text-gray-500 hover:text-luxury-charcoal mt-3">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
