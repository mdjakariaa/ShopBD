import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import CartTotals from '../components/CartTotals'
import stripeLogo from '../assets/stripe_logo.png'
import razorpayLogo from '../assets/razorpay_logo.png'
import { useStore } from '../StoreContext'

const fields = [
  ['firstName', 'First name'], ['lastName', 'Last name'], ['email', 'Email address'], ['street', 'Street'],
  ['city', 'City'], ['state', 'State'], ['zip', 'Zip code'], ['country', 'Country'], ['phone', 'Phone'],
]

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, setCart, token } = useStore()
  const [payment, setPayment] = useState('razorpay')
  const [form, setForm] = useState({})

  const submit = (event) => {
    event.preventDefault()
    if (!cartItems.length) return

    if (!token) {
      toast.info('Please sign in to place an order')
      navigate('/login')
      return
    }

    const newOrders = cartItems.map((item) => ({
      id: `${item.productId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      product: item.product,
      size: item.size,
      quantity: item.quantity,
      paymentMethod: payment,
      status: 'Order Placed',
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    }))

    try {
      const existing = JSON.parse(localStorage.getItem('forever-orders')) || []
      localStorage.setItem('forever-orders', JSON.stringify([...newOrders, ...existing]))
    } catch {
      // ignore
    }

    setCart([])
    navigate('/orders')
  }

  return (
    <Layout>
      <form onSubmit={submit} className="page-container grid min-h-[1000px] gap-14 pt-16 sm:min-h-[1600px] sm:pt-20 lg:min-h-[2100px] lg:grid-cols-[.9fr_1fr] lg:gap-28 lg:pt-24">
        <section className="animate-enter">
          <h1 className="section-rule-title"><span>DELIVERY <strong>INFORMATION</strong></span></h1>
          <div className="mt-9 grid grid-cols-2 gap-4 rounded-2xl border border-[#e5dace] bg-ivory/60 p-4 shadow-[0_8px_24px_rgba(67,54,38,0.035)] sm:p-6">
            {fields.map(([name, label], index) => {
              const full = [2,3,8].includes(index)
              return (
                <label key={name} className={full ? 'col-span-2' : ''}>
                  <span className="sr-only">{label}</span>
                  <input
                    name={name}
                    required
                    type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
                    placeholder={label}
                    value={form[name] || ''}
                    onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                    className="field h-[50px] w-full px-4 text-[12px]"
                  />
                </label>
              )
            })}
          </div>
        </section>

        <section className="animate-enter-delay lg:pt-14">
          <CartTotals compact />
          <div className="mt-14">
            <h2 className="section-rule-title mb-7"><span>PAYMENT <strong>METHOD</strong></span></h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className={`flex h-[58px] cursor-pointer items-center justify-center gap-4 rounded-xl border px-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft ${payment === 'stripe' ? 'border-[#a98c78] bg-[#f4e9df] shadow-sm' : 'border-line bg-ivory/75'}`}>
                <input type="radio" name="payment" checked={payment === 'stripe'} onChange={() => setPayment('stripe')} className="accent-[#2d2925]" />
                <img src={stripeLogo} alt="Stripe" className="h-6 w-auto object-contain" />
              </label>
              <label className={`flex h-[58px] cursor-pointer items-center justify-center gap-4 rounded-xl border px-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft ${payment === 'razorpay' ? 'border-[#a98c78] bg-[#f4e9df] shadow-sm' : 'border-line bg-ivory/75'}`}>
                <input type="radio" name="payment" checked={payment === 'razorpay'} onChange={() => setPayment('razorpay')} className="accent-[#2d2925]" />
                <img src={razorpayLogo} alt="Razorpay" className="h-5 w-auto object-contain" />
              </label>
              <label className={`flex h-[58px] cursor-pointer items-center justify-center gap-3 rounded-xl border px-4 text-[10px] transition duration-300 hover:-translate-y-0.5 hover:shadow-soft ${payment === 'cod' ? 'border-[#a98c78] bg-[#f4e9df] font-medium text-ink shadow-sm' : 'border-line bg-ivory/75 text-muted'}`}>
                <input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} className="accent-[#2d2925]" />
                CASH ON DELIVERY
              </label>
            </div>
            <div className="mt-8 text-right">
              <button disabled={!cartItems.length} className="btn-primary h-[52px] px-12 text-[11px] tracking-[0.04em]">PLACE ORDER</button>
            </div>
          </div>
        </section>
      </form>
    </Layout>
  )
}
