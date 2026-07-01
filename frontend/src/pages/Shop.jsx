import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { HiAdjustments, HiX, HiChevronDown } from 'react-icons/hi'
import { fetchProducts } from '../store/productSlice'
import ProductCard from '../components/product/ProductCard'

export default function Shop() {
  const dispatch = useDispatch()
  const { items, loading, total, categories } = useSelector((s) => s.products)
  const catList = Array.isArray(categories) ? categories : []
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFilters, setMobileFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [expandedCat, setExpandedCat] = useState(null)

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())
    dispatch(fetchProducts(params))
  }, [dispatch, searchParams])

  const activeParent = searchParams.get('category__parent')
  const activeChild = searchParams.get('category')

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
              <h3 className="font-medium">Categories</h3>
              <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">Clear</button>
            </div>

            <div className="space-y-1">
              {catList.map((parent) => {
                const isParentActive = activeParent === String(parent.id)
                const isExpanded = expandedCat === parent.id || isParentActive
                return (
                  <div key={parent.id}>
                    <button
                      onClick={() => {
                        if (parent.children?.length) {
                          setExpandedCat(isExpanded ? null : parent.id)
                        }
                        updateFilter('category__parent', String(parent.id))
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isParentActive ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}>
                      {parent.name}
                      {parent.children?.length > 0 && (
                        <HiChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    {parent.children?.length > 0 && isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        className="overflow-hidden">
                        <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-gray-100 dark:border-gray-700 pl-2">
                          {parent.children.map((child) => {
                            const isChildActive = activeChild === String(child.id)
                            return (
                              <button key={child.id}
                                onClick={() => updateFilter('category', String(child.id))}
                                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                  isChildActive ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                }`}>
                                {child.name}
                              </button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>

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
                <h3 className="font-medium">Categories</h3>
                <button onClick={() => setMobileFilters(false)}><HiX size={22} /></button>
              </div>
              <div className="space-y-1">
                {catList.map((parent) => {
                  const isParentActive = activeParent === String(parent.id)
                  const isExpanded = expandedCat === parent.id || isParentActive
                  return (
                    <div key={parent.id}>
                      <button
                        onClick={() => {
                          if (parent.children?.length) setExpandedCat(isExpanded ? null : parent.id)
                          updateFilter('category__parent', String(parent.id))
                          setMobileFilters(false)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                          isParentActive ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}>
                        {parent.name}
                        {parent.children?.length > 0 && (
                          <HiChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                      {parent.children?.length > 0 && isExpanded && (
                        <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-2">
                          {parent.children.map((child) => (
                            <button key={child.id}
                              onClick={() => { updateFilter('category', String(child.id)); setMobileFilters(false) }}
                              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm ${
                                activeChild === String(child.id) ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-50'
                              }`}>
                              {child.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
