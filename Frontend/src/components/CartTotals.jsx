import { useStore } from '../StoreContext'

export default function CartTotals({ compact = false }) {
  const { subtotal } = useStore()
  const shipping = subtotal > 0 ? 10 : 0
  const total = subtotal + shipping
  return (
    <div className={`${compact ? 'w-full' : 'w-full max-w-[620px]'} rounded-2xl border border-[#e4dacd] bg-ivory/70 p-5 shadow-soft sm:p-7`}>
      <h2 className="section-rule-title mb-6"><span>CART <strong>TOTALS</strong></span></h2>
      <div className="text-[12px] text-[#4f4943] sm:text-[13px]">
        <div className="flex justify-between border-b border-line py-3"><span>Subtotal</span><span className="font-medium text-ink">${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between border-b border-line py-3"><span>Shipping Fee</span><span className="font-medium text-ink">${shipping.toFixed(0)}</span></div>
        <div className="flex justify-between py-3 font-semibold text-ink"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>
    </div>
  )
}
