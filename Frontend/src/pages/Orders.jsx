import Layout from '../components/Layout'
import { useStore } from '../StoreContext'

export default function Orders() {
  const { products } = useStore()
  const demoOrders = [
    { id: 1, product: products[11], status: 'Ready to ship' },
    { id: 2, product: products[11], status: 'Shipped' },
  ]
  return (
    <Layout>
      <div className="page-container min-h-[900px] pt-16 sm:min-h-[1500px] sm:pt-20 lg:min-h-[2100px] lg:pt-24">
        <h1 className="section-rule-title animate-enter"><span>MY <strong>ORDERS</strong></span></h1>
        <div className="animate-enter-delay mt-8 overflow-hidden rounded-2xl border border-line bg-ivory/60 shadow-[0_8px_24px_rgba(67,54,38,0.035)]">
          {demoOrders.map((order) => (
            <article key={order.id} className="grid gap-4 border-b border-line px-4 py-5 transition-colors duration-300 last:border-b-0 hover:bg-white/70 sm:grid-cols-[120px_1fr_260px_150px] sm:items-center sm:gap-6 sm:px-5">
              <img src={order.product.image} alt={order.product.name} className="aspect-[390/450] w-[88px] rounded-xl border border-[#e4d9cc] object-cover shadow-sm sm:w-[108px]" />
              <div>
                <h2 className="text-[13px] font-medium text-ink sm:text-[15px] lg:text-[17px]">{order.product.name}</h2>
                <p className="mt-3 text-[12px] text-[#625b54] sm:text-[13px]">${order.product.price} &nbsp; Quantity: 1 &nbsp; Size: L</p>
                <p className="mt-4 text-[11px] text-muted sm:text-[12px]">Date: 25, May, 2024</p>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-[#4c554a] sm:text-[13px]"><span className="h-2.5 w-2.5 rounded-full bg-[#36a34a] shadow-[0_0_0_4px_rgba(54,163,74,0.09)]" />{order.status}</div>
              <button className="btn-secondary h-10 w-[120px] text-[11px] sm:w-[140px]">Track Order</button>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  )
}
