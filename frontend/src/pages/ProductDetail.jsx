import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { HiStar, HiMinus, HiPlus, HiShoppingBag, HiCamera, HiX, HiClock } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import { fetchProduct, clearCurrent } from '../store/productSlice'
import { addToCart } from '../store/cartSlice'
import api from '../utils/api'

export default function ProductDetail() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { current: product, loading } = useSelector((s) => s.products)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const [reviewRating, setReviewRating] = useState(0)
  const [reviewName, setReviewName] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewImage, setReviewImage] = useState(null)
  const [reviewPreview, setReviewPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => { dispatch(fetchProduct(slug)); return () => dispatch(clearCurrent()) }, [dispatch, slug])
  useEffect(() => { setSelectedSize(''); setSelectedColor(''); setQuantity(1); setActiveImage(0) }, [product])

  if (loading || !product) return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-24 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  )

  const images = product.images || []
  const sizes = product.attributes?.sizes || product.sizes || []
  const handleAdd = () => {
    if (sizes?.length && !selectedSize) { toast.error('Please select a size'); return }
    dispatch(addToCart({ product, size: selectedSize, color: selectedColor, quantity }))
    toast.success('Added to cart!')
  }

  const handleReviewImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setReviewImage(file)
      setReviewPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewRating) { toast.error('Please select a rating'); return }
    if (!reviewName.trim()) { toast.error('Please enter your name'); return }
    if (!reviewComment.trim()) { toast.error('Please write a review'); return }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('customer_name', reviewName)
      fd.append('rating', reviewRating)
      fd.append('comment', reviewComment)
      if (reviewImage) fd.append('image', reviewImage)
      await api.post(`/products/${slug}/reviews/`, fd)
      toast.success('Review submitted! Awaiting approval.')
      setReviewRating(0); setReviewName(''); setReviewComment(''); setReviewImage(null); setReviewPreview('')
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{product.meta_title || `${product.name} – Randahaws`}</title>
        <meta name="description" content={product.meta_description || product.short_description} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
              {images[activeImage] ? (
                <img src={images[activeImage].image} alt={images[activeImage].alt_text || product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
              )}
              {product.has_discount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                  Sale –{product.discount_percent}%</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 ${i === activeImage ? 'border-primary-600' : 'border-transparent hover:border-gray-300'}`}>
                    <img src={img.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <p className="text-sm text-primary-600 uppercase tracking-widest">{product.category_name}</p>
              <h1 className="font-serif text-3xl lg:text-4xl font-semibold mt-1">{product.name}</h1>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <HiStar key={i} className={i < Math.round(product.average_rating) ? 'text-luxury-gold' : 'text-gray-200'} />
              ))}
              <span className="text-sm text-gray-500 ml-2">({product.review_count} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              {product.has_discount ? (
                <><span className="text-3xl font-bold text-primary-600 dark:text-red-400">PKR {product.discount_price}</span>
                  <span className="text-xl text-gray-400 dark:text-gray-500 line-through">PKR {product.price}</span>
                  <span className="text-sm text-red-500 font-medium">Save {product.discount_percent}%</span></>
              ) : <span className="text-3xl font-bold dark:text-red-400">PKR {product.price}</span>}
            </div>

            {product.is_coming_soon ? (
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg">
                <HiClock size={18} />
                <span className="font-medium">Coming Soon</span>
              </div>
            ) : product.sold_count > 0 ? (
              <p className="text-sm text-green-600 font-medium">
                {product.sold_count} {product.sold_count === 1 ? 'piece' : 'pieces'} sold
              </p>
            ) : null}

            <p className="text-gray-600 leading-relaxed">{product.short_description}</p>

            {/* Category-specific attributes */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4">
                {Object.entries(product.attributes).map(([key, value]) => {
                  const labels = {
                    sizes: 'Sizes', heel_type: 'Heel Type', heel_height: 'Heel Height',
                    material: 'Material', bag_type: 'Bag Type', fabric: 'Fabric',
                    stitching: 'Stitching', shade: 'Shade', volume: 'Volume',
                    fragrance_type: 'Type', weight: 'Weight', size: 'Size',
                  }
                  const displayVal = Array.isArray(value) ? value.join(', ') : value
                  if (!displayVal) return null
                  return (
                    <div key={key}>
                      <span className="text-xs text-gray-400 uppercase tracking-wide">{labels[key] || key}</span>
                      <p className="text-sm font-medium text-gray-800 mt-0.5">{displayVal}</p>
                    </div>
                  )
                })}
              </div>
            )}

            {product.is_coming_soon ? (
              <div className="w-full bg-amber-100 text-amber-800 text-center py-4 rounded-full font-medium">
                <HiClock size={20} className="inline mr-2" />Coming Soon – Stay Tuned
              </div>
            ) : (
              <>
                {sizes?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Size {selectedSize && <span className="text-primary-600">– {selectedSize}</span>}</h3>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button key={size} onClick={() => setSelectedSize(size)}
                          className={`w-14 h-10 rounded-lg border text-sm font-medium transition-all ${selectedSize === size
                            ? 'bg-luxury-charcoal text-white border-luxury-charcoal'
                            : 'border-gray-200 text-gray-600 hover:border-luxury-charcoal'}`}>{size}</button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Color {selectedColor && <span className="text-primary-600">– {selectedColor}</span>}</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button key={color.name} onClick={() => setSelectedColor(color.name)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color.name ? 'border-luxury-charcoal scale-110' : 'border-gray-200'}`}
                          style={{ backgroundColor: color.hex }} title={color.name} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-full">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100 rounded-l-full"><HiMinus size={16} /></button>
                    <span className="px-6 font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100 rounded-r-full"><HiPlus size={16} /></button>
                  </div>
                </div>

                <button onClick={handleAdd} disabled={!product.is_in_stock}
                  className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-4">
                  <HiShoppingBag size={22} /> {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </>
            )}

            {product.description && (
              <div className="border-t pt-6">
                <h3 className="font-medium mb-3">Description</h3>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</div>
              </div>
            )}

            {product.reviews?.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Reviews ({product.review_count})</h3>
                <div className="space-y-4">
                  {product.reviews.filter((r) => r.is_approved !== false).slice(0, 5).map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{Array.from({ length: review.rating }).map((_, i) => (<HiStar key={i} className="text-luxury-gold text-sm" />))}</div>
                        <span className="font-medium text-sm">{review.customer_name}</span>
                      </div>
                      {review.image && (
                        <img src={review.image} alt="" className="w-20 h-20 object-cover rounded-lg mb-2" loading="lazy" />
                      )}
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)}>
                        <HiStar size={28} className={star <= reviewRating ? 'text-luxury-gold' : 'text-gray-200'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name</label>
                  <input type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Review</label>
                  <textarea rows={3} value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Photo (optional)</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2.5 text-sm hover:bg-gray-50">
                      <HiCamera size={18} /> Upload Photo
                    </button>
                    {reviewPreview && (
                      <div className="relative">
                        <img src={reviewPreview} alt="" className="w-16 h-16 object-cover rounded-lg" />
                        <button type="button" onClick={() => { setReviewImage(null); setReviewPreview('') }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                          <HiX size={14} />
                        </button>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleReviewImage} className="hidden" />
                  </div>
                </div>
                <button type="submit" disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
