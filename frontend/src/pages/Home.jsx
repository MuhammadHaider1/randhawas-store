import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight, HiStar, HiClock } from 'react-icons/hi'
import Footer from '../components/layout/Footer'
import ProductCard from '../components/product/ProductCard'
import CategoryCard from '../components/product/CategoryCard'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
}

const testimonials = [
  { name: 'Sarah M.', text: 'Absolutely stunning heels! The quality is unmatched and they fit like a dream.', rating: 5 },
  { name: 'Jessica K.', text: 'I receive compliments every time I wear my Randahaws heels. Truly premium.', rating: 5 },
  { name: 'Amanda L.', text: 'The most comfortable luxury heels I have ever owned. Worth every penny!', rating: 5 },
]

export default function Home() {
  const { featured, categories, comingSoon } = useSelector((s) => s.products)

  return (
    <div>
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-luxury-cream via-white to-primary-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543163521-2bf539246148?w=1920')] bg-cover bg-center opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="max-w-2xl">
            <motion.span variants={fadeUp} initial="hidden" animate="visible"
              className="text-primary-600 uppercase tracking-[0.2em] text-sm font-medium">Luxury Redefined</motion.span>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-luxury-charcoal mt-4 leading-tight">
              Walk in<br /><span className="text-primary-600">Elegance</span>
            </motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="text-gray-600 text-lg mt-6 max-w-md">
              Discover our exclusive collection of handcrafted premium heels designed for the confident, modern woman.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex gap-4 mt-8">
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2 group">
                Shop Now <HiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/shop?is_featured=true" className="btn-outline">Featured</Link>
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block absolute right-10 bottom-10 w-96 h-96 rounded-full bg-primary-200/30 blur-3xl" />
      </section>

      {categories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Find your perfect pair</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat, i) => (
                <motion.div key={cat.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                  <CategoryCard category={cat} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title">Featured Heels</h2>
            <p className="section-subtitle">Our most-loved designs</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 8).map((product, i) => (
              <motion.div key={product.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <motion.div className="text-center mt-12">
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">View All Collection <HiArrowRight /></Link>
          </motion.div>
        </div>
      </section>

      {comingSoon.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
              <h2 className="section-title">Coming Soon</h2>
              <p className="section-subtitle">Get ready for our newest arrivals</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {comingSoon.slice(0, 8).map((product, i) => (
                <motion.div key={product.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            {comingSoon.length > 4 && (
              <motion.div className="text-center mt-12">
                <Link to="/shop?is_coming_soon=true" className="btn-outline inline-flex items-center gap-2"><HiClock /> See All Coming Soon</Link>
              </motion.div>
            )}
          </div>
        </section>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real reviews from real women</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-luxury-cream rounded-2xl p-8 card-hover">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (<HiStar key={j} className="text-luxury-gold" />))}
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{t.text}"</p>
                <p className="font-medium mt-4 text-luxury-charcoal">– {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
