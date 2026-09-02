import { Link } from 'react-router-dom'
import { useStore } from '../StoreContext'

export default function ProductCard({ product }) {
  const { currency = '$' } = useStore() || {}
  const productId = product._id || product.id
  const productImage = Array.isArray(product.image) ? product.image[0] : product.image

  return (
    <Link
      to={`/product/${productId}`}
      className="group block min-w-0 rounded-[18px] border border-[#e9e0d5] bg-ivory/75 p-2.5 shadow-[0_6px_20px_rgba(67,54,38,0.045)] transition duration-300 ease-out hover:-translate-y-1 hover:border-[#ddcebf] hover:bg-white hover:shadow-lift focus-visible:-translate-y-1 focus-visible:shadow-lift"
    >
      <div className="overflow-hidden rounded-[14px] bg-[#f1ece5]">
        <img
          src={productImage}
          alt={product.name}
          className="aspect-[390/450] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
          loading="lazy"
        />
      </div>
      <div className="px-1 pb-1 pt-1.5">
        <p className="mt-1 line-clamp-2 text-[11px] leading-[1.5] text-[#38332e] sm:text-[12px] lg:text-[13px]">{product.name}</p>
        <p className="mt-1.5 text-[11px] font-semibold tracking-[0.01em] text-espresso sm:text-[12px] lg:text-[13px]">{currency}{product.price}</p>
      </div>
    </Link>
  )
}
