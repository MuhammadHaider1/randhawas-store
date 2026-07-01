import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiX, HiPhotograph, HiSearch } from 'react-icons/hi'
import api from '../../utils/api'

const HEEL_TYPES = ['', 'stiletto', 'block', 'wedge', 'kitten', 'platform', 'cone', 'flat', 'sandal', 'boot']
const GENDER_CHOICES = ['women', 'men', 'unisex']

const emptyProduct = {
  name: '', slug: '', category: '', description: '', short_description: '',
  price: '', discount_percent: 0, gender: 'women', heel_type: '',
  heel_height: '', sizes: '[]', colors: '[]', stock_count: 0,
  is_in_stock: true, is_featured: false, is_coming_soon: false, is_active: true,
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        api.get('/dashboard/products/'),
        api.get('/dashboard/categories/'),
      ])
      setProducts(pRes.data.results || pRes.data)
      setCategories(cRes.data.results || cRes.data)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openEdit = (product) => {
    setEditing(product)
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || '',
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price?.toString() || '',
      discount_percent: product.discount_percent || 0,
      gender: product.gender || 'women',
      heel_type: product.heel_type || '',
      heel_height: product.heel_height || '',
      sizes: Array.isArray(product.sizes) ? JSON.stringify(product.sizes) : (product.sizes || '[]'),
      colors: Array.isArray(product.colors) ? JSON.stringify(product.colors) : (product.colors || '[]'),
      stock_count: product.stock_count || 0,
      is_in_stock: product.is_in_stock ?? true,
      is_featured: product.is_featured ?? false,
      is_coming_soon: product.is_coming_soon ?? false,
      is_active: product.is_active ?? true,
    })
    setImageFiles([])
    setImagePreview(product.primary_image || null)
    setModalOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm(emptyProduct)
    setImageFiles([])
    setImagePreview(null)
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'sizes' || k === 'colors') {
          try { fd.append(k, JSON.stringify(JSON.parse(v || '[]'))) }
          catch { fd.append(k, '[]') }
        } else {
          fd.append(k, v ?? '')
        }
      })
      imageFiles.forEach((file) => fd.append('images', file))

      const cfg = {}
      if (editing) {
        await api.patch(`/dashboard/products/${editing.id}/`, fd, cfg)
      } else {
        await api.post('/dashboard/products/', fd, cfg)
      }
      setModalOpen(false)
      fetchData()
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return
    try {
      await api.delete(`/dashboard/products/${product.id}/`)
      fetchData()
    } catch { /* ignore */ }
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)
    if (files.length > 0) {
      setImagePreview(URL.createObjectURL(files[0]))
    }
  }

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} total products</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-all text-sm font-medium shadow-sm">
          <HiPlus size={18} /> Add Product
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text" placeholder="Search products..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Featured</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Coming Soon</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p) => (
                  <motion.tr key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.primary_image || '/placeholder.svg'} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-medium truncate max-w-[200px]">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium">PKR {Number(p.price).toLocaleString()}</p>
                      {p.discount_percent > 0 && <p className="text-xs text-red-500">-{p.discount_percent}% off</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${p.is_in_stock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.is_in_stock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {p.is_in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.is_featured ? <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">Featured</span> : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {p.is_coming_soon ? <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Coming Soon</span> : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <HiPencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(p)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <HiTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                  {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-10 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-2xl w-full z-50 bg-white rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                <h2 className="font-semibold text-lg">{editing ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><HiX size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                      <option value="">Select category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                    <input type="number" min="0" max="100" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: parseInt(e.target.value) || 0 })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                      {GENDER_CHOICES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type (e.g. heel/stiletto)</label>
                    <select value={form.heel_type} onChange={(e) => setForm({ ...form, heel_type: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                      {HEEL_TYPES.map((h) => <option key={h} value={h}>{h || '—'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height / Size info</label>
                    <input value={form.heel_height} onChange={(e) => setForm({ ...form, heel_height: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (JSON array)</label>
                    <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder='["36","37","38"]' />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colors (JSON array)</label>
                    <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder='[{"name":"Black","hex":"#000000"}]' />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
                    <input type="number" value={form.stock_count} onChange={(e) => setForm({ ...form, stock_count: parseInt(e.target.value) || 0 })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <input type="file" multiple accept="image/*" onChange={handleImageSelect}
                    className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                  {imagePreview && (
                    <div className="mt-2 relative inline-block">
                      <img src={imagePreview} alt="" className="h-20 w-20 object-cover rounded-lg border" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_in_stock} onChange={(e) => setForm({ ...form, is_in_stock: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    In Stock
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_coming_soon} onChange={(e) => setForm({ ...form, is_coming_soon: e.target.checked })}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                    Coming Soon
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    Active
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all shadow-sm">
                    {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
