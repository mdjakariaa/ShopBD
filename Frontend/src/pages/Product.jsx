import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import SectionTitle from '../components/SectionTitle'
import starIcon from '../assets/star_icon.png'
import starDullIcon from '../assets/star_dull_icon.png'
import { useStore } from '../StoreContext'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, addToCart } = useStore()
  const product = products.find((item) => item.id === Number(id)) || products[11]
  const [size, setSize] = useState('L')
  const [tab, setTab] = useState('description')

  const related = useMemo(() => products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 5), [products, product])

  const add = () => {
    addToCart(product.id, size)
    navigate('/cart')
  }

  return (
    <Layout>
      <div className="page-container pt-9 sm:pt-14 lg:pt-16">
        <section className="animate-enter grid gap-9 md:grid-cols-[1.1fr_.95fr] lg:gap-14 xl:grid-cols-[1.08fr_.9fr]">
          <div className="grid gap-3 sm:grid-cols-[112px_1fr] lg:grid-cols-[130px_1fr]">
            <div className="order-2 grid grid-cols-4 gap-3 sm:order-1 sm:grid-cols-1 sm:self-start">
              {[0, 1, 2, 3].map((index) => (
                <button key={index} className="group overflow-hidden rounded-xl border border-[#e5dbcf] bg-[#f1ece5] transition duration-300 hover:-translate-y-0.5 hover:border-[#cdbbaa] hover:shadow-soft" aria-label={`View product image ${index + 1}`}>
                  <img src={product.image} alt="" className="aspect-[390/450] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </button>
              ))}
            </div>
            <div className="order-1 overflow-hidden rounded-[22px] border border-[#e4d9cc] bg-[#f1ece5] shadow-soft sm:order-2">
              <img src={product.image} alt={product.name} className="aspect-[390/450] h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]" />
            </div>
          </div>

          <div className="pt-1 lg:pt-2">
            <h1 className="text-[22px] font-semibold leading-tight text-ink sm:text-[28px] lg:text-[31px]">{product.name}</h1>
            <div className="mt-5 flex items-center gap-1.5">
              {[0,1,2,3].map((n) => <img key={n} src={starIcon} alt="" className="h-4 w-4" />)}
              <img src={starDullIcon} alt="" className="h-4 w-4" />
              <span className="ml-2 text-[12px] text-muted">(122)</span>
            </div>
            <p className="mt-7 text-[26px] font-semibold tracking-tight text-espresso">${product.price}</p>
            <p className="mt-7 max-w-[650px] text-[12px] leading-6 text-[#686159] sm:text-[13px] lg:text-[14px]">{product.description}</p>

            <div className="mt-8">
              <p className="mb-4 text-[13px] font-medium">Select Size</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((item) => (
                  <button key={item} onClick={() => setSize(item)} className={`h-[50px] min-w-[50px] rounded-xl border px-4 text-[12px] transition duration-300 ${size === item ? 'border-[#9f755e] bg-[#f4e7dc] font-semibold text-espresso shadow-sm' : 'border-[#dfd5c9] bg-ivory/80 text-[#5e5750] hover:border-[#bca795] hover:bg-white'}`}>{item}</button>
                ))}
              </div>
            </div>

            <button onClick={add} className="btn-primary mt-8 h-[52px] px-10 text-[12px] font-medium tracking-[0.04em]">ADD TO CART</button>

            <div className="mt-8 max-w-[510px] border-t border-line pt-5 text-[11px] leading-6 text-muted sm:text-[12px]">
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
            </div>
          </div>
        </section>

        <section className="animate-enter-delay mt-20 sm:mt-24 lg:mt-28">
          <div className="flex gap-2">
            <button onClick={() => setTab('description')} className={`rounded-t-xl border px-7 py-4 text-[11px] transition-colors sm:px-10 ${tab === 'description' ? 'border-[#d8cbbd] bg-ivory font-semibold text-black shadow-sm' : 'border-line bg-[#f6f0e8]/70 text-muted hover:bg-ivory'}`}>Description</button>
            <button onClick={() => setTab('reviews')} className={`rounded-t-xl border px-7 py-4 text-[11px] transition-colors sm:px-10 ${tab === 'reviews' ? 'border-[#d8cbbd] bg-ivory font-semibold text-black shadow-sm' : 'border-line bg-[#f6f0e8]/70 text-muted hover:bg-ivory'}`}>Reviews (122)</button>
          </div>
          <div className="min-h-[210px] rounded-b-2xl rounded-tr-2xl border border-line bg-ivory/60 p-7 text-[11px] leading-6 text-[#686159] shadow-[0_8px_24px_rgba(67,54,38,0.035)] sm:p-10 sm:text-[12px]">
            {tab === 'description' ? (
              <>
                <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence.</p>
                <p className="mt-5">E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations. Each product usually has its own dedicated page with relevant information.</p>
              </>
            ) : <p>122 customers reviewed this product. Most reviewers highlighted its comfortable fit, clean finish, and everyday versatility.</p>}
          </div>
        </section>

        <section className="animate-enter pt-24 sm:pt-28 lg:pt-32">
          <SectionTitle first="RELATED" strong="PRODUCTS" />
          <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-7 lg:gap-y-9">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      </div>
    </Layout>
  )
}
