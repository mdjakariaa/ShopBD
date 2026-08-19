import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SectionTitle from '../components/SectionTitle'
import ProductCard from '../components/ProductCard'
import ServiceHighlights from '../components/ServiceHighlights'
import Newsletter from '../components/Newsletter'
import headerImage from '../assets/header_img.png'
import { bestSellerIds, latestIds } from '../data/products'
import { useStore } from '../StoreContext'

function ProductSection({ titleFirst, titleStrong, ids, best = false, mobileSix = false }) {
  const { products } = useStore()
  const cards = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  return (
    <section className="animate-enter pt-20 sm:pt-24 lg:pt-28">
      <SectionTitle first={titleFirst} strong={titleStrong} />
      <p className="mx-auto mt-4 max-w-[700px] text-center text-[10px] leading-5 text-muted sm:text-[11px] lg:text-[12px]">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:mt-10 lg:grid-cols-5 lg:gap-x-7 lg:gap-y-9">
        {cards.map((product, index) => (
          <div key={product.id} className={`${best && index === 4 ? 'hidden lg:block' : ''} ${mobileSix && index >= 6 ? 'hidden lg:block' : ''}`}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <Layout>
      <div className="page-container">
        <section className="animate-enter mt-7 overflow-hidden rounded-[26px] border border-[#dfd2c4] bg-gradient-to-br from-ivory via-[#fbf5ed] to-[#f3e8dc] shadow-soft sm:mt-4 lg:grid lg:grid-cols-2 lg:rounded-[30px]">
          <div className="flex min-h-[270px] items-center px-8 py-12 sm:min-h-[350px] sm:px-16 lg:min-h-[620px] lg:px-24 xl:px-28">
            <div>
              <div className="flex items-center gap-3 text-[10px] font-medium tracking-[0.14em] text-[#796b60] sm:text-[12px] lg:text-[13px]">
                <span className="h-px w-8 bg-gradient-to-r from-espresso to-[#ad8c76] lg:w-11" />
                <span>OUR BESTSELLERS</span>
              </div>
              <h1 className="mt-4 font-serifDisplay text-[36px] leading-[1.05] text-[#2f2a26] sm:text-[52px] lg:text-[64px] xl:text-[69px]">Latest Arrivals</h1>
              <Link to="/collection" className="group mt-6 inline-flex items-center gap-3 rounded-full px-1 py-2 text-[10px] font-medium tracking-[0.12em] text-[#443c36] transition-colors hover:text-black sm:text-[12px] lg:text-[13px]">
                <span>SHOP NOW</span><span className="h-px w-8 bg-[#5c5148] transition-all duration-300 group-hover:w-12 lg:w-11" />
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-[#edd8d2] to-[#e5c8c0]">
            <img src={headerImage} alt="Fashion model wearing a black scarf" className="h-full min-h-[300px] w-full object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.015] sm:min-h-[430px] lg:min-h-[620px]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#5a41331a] via-transparent to-white/10" />
          </div>
        </section>

        <ProductSection titleFirst="LATEST" titleStrong="COLLECTIONS" ids={latestIds} mobileSix />
        <ProductSection titleFirst="BEST" titleStrong="SELLER" ids={bestSellerIds} best />
        <ServiceHighlights />
        <Newsletter />
      </div>
    </Layout>
  )
}
