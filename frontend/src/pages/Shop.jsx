import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { HiAdjustments, HiX } from 'react-icons/hi'
import { fetchProducts } from '../store/productSlice'
import ProductCard from '../components/product/ProductCard'

const filters = [
  { key: 'category', label: 'Category', options: 'dynamic' },
  { key: 'is_featured', label: 'Featured', options: [{ value: 'true', label: 'Featured Only' }] },
]

export default function Shop() {
  const dispatch = useDispatch()
  const { items, loading, total, categories } = useSelector((s) => s.products)
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFilters, setMobileFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())
    dispatch(fetchProducts(params))
  }, [dispatch, searchParams])

  const updateFilter = (key, value) => {
    const params = Object.fromEntries(searchParams.entries())
    if (params[key] === value) delete params[key]
    else params[key] = value
    setSearchParams(params)
  }

  const clearFilters = () => setSearchParams({})

  const applyPrice = () => {
    const params = Object.fromEntries(searchParams.entries())
    params.price_min = priceRange[0]; params.price_max = priceRange[1]
    setSearchParams(params)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold">Shop All</h1>
          <p className="text-gray-500 text-sm mt-1">{total} products available</p>
        </div>
        <button onClick={() => setMobileFilters(true)}
          className="lg:hidden btn-outline !py-2 !px-4 text-sm flex items-center gap-2"><HiAdjustments /> Filters</button>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">Clear</button>
            </div>
            {filters.map((f) => (
              <div key={f.key}>
                <h4 className="text-sm font-medium mb-3 capitalize">{f.label}</h4>
                <div className="space-y-2">
                  {(f.options === 'dynamic' ? categories.map((c) => ({ value: String(c.id), label: c.name })) : f.options).map((opt) => {
                    const val = typeof opt === 'string' ? opt : opt.value
                    const label = typeof opt === 'string' ? opt : opt.label
                    const isActive = searchParams.get(f.key) === val
                    return (
                      <button key={val} onClick={() => updateFilter(f.key, val)}
                        className={`block text-sm w-full text-left px-3 py-1.5 rounded-lg transition-colors ${isActive ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            <div>
              <h4 className="text-sm font-medium mb-3">Price Range</h4>
              <div className="flex items-center gap-2">
                <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-20 px-2 py-1 border rounded text-sm" placeholder="Min" />
                <span>-</span>
                <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-20 px-2 py-1 border rounded text-sm" placeholder="Max" />
                <button onClick={applyPrice} className="text-xs bg-luxury-charcoal text-white px-3 py-1.5 rounded">Go</button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-square bg-gray-200 rounded-2xl" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product, i) => (<ProductCard key={product.id} product={product} index={i} />))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No products found</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFilters(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 p-6 lg:hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium">Filters</h3>
                <button onClick={() => setMobileFilters(false)}><HiX size={22} /></button>
              </div>
              <div className="space-y-6">
                {filters.map((f) => (
                  <div key={f.key}>
                    <h4 className="text-sm font-medium mb-3 capitalize">{f.label}</h4>
                    <div className="space-y-2">
                      {(f.options === 'dynamic' ? categories.map((c) => ({ value: String(c.id), label: c.name })) : f.options).map((opt) => {
                        const val = typeof opt === 'string' ? opt : opt.value
                        const label = typeof opt === 'string' ? opt : opt.label
                        const isActive = searchParams.get(f.key) === val
                        return (
                          <button key={val} onClick={() => { updateFilter(f.key, val); setMobileFilters(false) }}
                            className={`block text-sm w-full text-left px-3 py-1.5 rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
