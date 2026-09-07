import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import CartTotals from '../components/CartTotals'
import stripeLogo from '../assets/stripe_logo.png'
import razorpayLogo from '../assets/razorpay_logo.png'
import { useStore } from '../StoreContext'

// Address input fields specification
const fields = [
  ['firstName', 'First name'], ['lastName', 'Last name'], ['email', 'Email address'], ['street', 'Street'],
  ['city', 'City'], ['state', 'State'], ['zip', 'Zip code'], ['country', 'Country'], ['phone', 'Phone'],
]

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, setCart, token, backendUrl, subtotal, deliveryFee = 10 } = useStore()
  const [payment, setPayment] = useState('cod')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  })

  // Handle form submission and order placement
  const submit = async (event) => {
    event.preventDefault()

    // Ensure cart has items
    if (!cartItems.length) {
      toast.error('Your cart is empty')
      return
    }

    // Ensure user is authenticated
    if (!token) {
      toast.info('Please sign in to place an order')
      navigate('/login')
      return
    }

    try {
      setLoading(true)

      // Prepare order items array containing product details, selected size, and quantity
      const orderItems = cartItems.map((item) => ({
        _id: item.product?._id || item.productId,
        name: item.product?.name,
        price: item.product?.price,
        image: item.product?.image,
        category: item.product?.category,
        size: item.size,
        quantity: item.quantity,
      }))

      // Calculate total order amount including delivery fee
      const totalAmount = subtotal + (subtotal > 0 ? deliveryFee : 0)

      // Cash On Delivery (COD) method
      if (payment === 'cod') {
        const response = await axios.post(
          `${backendUrl}/api/order/place`,
          {
            items: orderItems,
            amount: totalAmount,
            address: form,
            paymentMethod: 'COD',
          },
          { headers: { token } },
        )

        if (response.data.success) {
          // Clear cart in global state and localStorage
          setCart([])
          localStorage.removeItem('forever-cart')

          toast.success(response.data.message || 'Order Placed Successfully!')

          // Navigate the user to the orders page
          navigate('/orders')
        } else {
          toast.error(response.data.message || 'Failed to place order')
        }
      } else if (payment === 'stripe') {
        // Stripe Online Payment Method
        const response = await axios.post(
          `${backendUrl}/api/order/stripe`,
          {
            items: orderItems,
            amount: totalAmount,
            address: form,
          },
          { headers: { token } },
        )

        if (response.data.success) {
          const { session_url } = response.data
          // Redirect customer to Stripe Checkout session
          window.location.replace(session_url)
        } else {
          toast.error(response.data.message || 'Failed to initialize Stripe payment')
        }
      } else {
        // Razorpay payment gateway (placeholder)
        toast.info('Razorpay payment gateway is not yet available. Please select Cash on Delivery or Stripe.')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error(error.response?.data?.message || error.message || 'Something went wrong while placing order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <form onSubmit={submit} className="page-container grid min-h-[1000px] gap-14 pt-16 sm:min-h-[1600px] sm:pt-20 lg:min-h-[2100px] lg:grid-cols-[.9fr_1fr] lg:gap-28 lg:pt-24">
        {/* Left Column: Delivery Address Form */}
        <section className="animate-enter">
          <h1 className="section-rule-title"><span>DELIVERY <strong>INFORMATION</strong></span></h1>
          <div className="mt-9 grid grid-cols-2 gap-4 rounded-2xl border border-[#e5dace] bg-ivory/60 p-4 shadow-[0_8px_24px_rgba(67,54,38,0.035)] sm:p-6">
            {fields.map(([name, label], index) => {
              const full = [2, 3, 8].includes(index)
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

        {/* Right Column: Order Summary & Payment Method */}
        <section className="animate-enter-delay lg:pt-14">
          <CartTotals compact />
          <div className="mt-14">
            <h2 className="section-rule-title mb-7"><span>PAYMENT <strong>METHOD</strong></span></h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {/* Stripe Payment Option */}
              <label className={`flex h-[58px] cursor-pointer items-center justify-center gap-4 rounded-xl border px-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft ${payment === 'stripe' ? 'border-[#a98c78] bg-[#f4e9df] shadow-sm' : 'border-line bg-ivory/75'}`}>
                <input type="radio" name="payment" checked={payment === 'stripe'} onChange={() => setPayment('stripe')} className="accent-[#2d2925]" />
                <img src={stripeLogo} alt="Stripe" className="h-6 w-auto object-contain" />
              </label>

              {/* Razorpay Payment Option */}
              <label className={`flex h-[58px] cursor-pointer items-center justify-center gap-4 rounded-xl border px-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft ${payment === 'razorpay' ? 'border-[#a98c78] bg-[#f4e9df] shadow-sm' : 'border-line bg-ivory/75'}`}>
                <input type="radio" name="payment" checked={payment === 'razorpay'} onChange={() => setPayment('razorpay')} className="accent-[#2d2925]" />
                <img src={razorpayLogo} alt="Razorpay" className="h-5 w-auto object-contain" />
              </label>

              {/* Cash On Delivery Option */}
              <label className={`flex h-[58px] cursor-pointer items-center justify-center gap-3 rounded-xl border px-4 text-[10px] transition duration-300 hover:-translate-y-0.5 hover:shadow-soft ${payment === 'cod' ? 'border-[#a98c78] bg-[#f4e9df] font-medium text-ink shadow-sm' : 'border-line bg-ivory/75 text-muted'}`}>
                <input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} className="accent-[#2d2925]" />
                CASH ON DELIVERY
              </label>
            </div>

            <div className="mt-8 text-right">
              <button
                type="submit"
                disabled={loading || !cartItems.length}
                className="btn-primary h-[52px] px-12 text-[11px] tracking-[0.04em] disabled:opacity-50"
              >
                {loading ? 'PROCESSING...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </section>
      </form>
    </Layout>
  )
}
