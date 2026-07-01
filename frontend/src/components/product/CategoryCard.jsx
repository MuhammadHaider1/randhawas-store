import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link to={`/shop?category__parent=${category.id}`}
      className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 block">
      {category.image && (
        <img src={category.image} alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-serif text-lg text-white font-medium">{category.name}</h3>
        <p className="text-white/70 text-xs">{category.product_count} styles</p>
      </div>
    </Link>
  )
}
