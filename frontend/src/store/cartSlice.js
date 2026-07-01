import { createSlice } from '@reduxjs/toolkit'

const CART_VERSION = 2

const loadCart = () => {
  try {
    const raw = localStorage.getItem('cart')
    const data = raw ? JSON.parse(raw) : {}
    if (data._version !== CART_VERSION) {
      localStorage.removeItem('cart')
      return { items: [], total: 0, itemCount: 0 }
    }
    return data
  } catch { return { items: [], total: 0, itemCount: 0 } }
}

const saveCart = (state) => {
  const { items, total, itemCount } = state
  localStorage.setItem('cart', JSON.stringify({ _version: CART_VERSION, items, total, itemCount }))
}

const calcTotals = (items) => ({
  itemCount: items.reduce((s, i) => s + i.quantity, 0),
  total: Math.round(items.reduce((s, i) => s + (i.discountPrice || i.price) * i.quantity, 0) * 100) / 100,
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCart(),
  reducers: {
    addToCart(state, action) {
      const { product, size, color, quantity = 1 } = action.payload
      const key = `${product.id}-${size || ''}-${color || ''}`
      const existing = state.items.find((i) => i.cartKey === key)
      if (existing) existing.quantity += quantity
      else {
        const primaryImg = product.images?.[0]?.image || product.primary_image || ''
        state.items.push({
          cartKey: key, product: product.id, name: product.name, slug: product.slug,
          image: primaryImg, price: parseFloat(product.price),
          discountPrice: product.discount_price ? parseFloat(product.discount_price) : null,
          size: size || '', color: color || '', quantity,
        })
      }
      Object.assign(state, calcTotals(state.items))
      saveCart(state)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.cartKey !== action.payload)
      Object.assign(state, calcTotals(state.items))
      saveCart(state)
    },
    updateQuantity(state, action) {
      const { cartKey, quantity } = action.payload
      const item = state.items.find((i) => i.cartKey === cartKey)
      if (item && quantity > 0) item.quantity = quantity
      else state.items = state.items.filter((i) => i.cartKey !== cartKey)
      Object.assign(state, calcTotals(state.items))
      saveCart(state)
    },
    clearCart(state) {
      state.items = []; state.total = 0; state.itemCount = 0
      saveCart(state)
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
