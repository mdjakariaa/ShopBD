import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import { useStore } from '../StoreContext'

export default function Orders() {
  const { backendUrl, token, currency = '$' } = useStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch all orders for the authenticated user from backend API
  const loadOrderData = async () => {
    if (!token) {
      setOrders([])
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } },
      )

      if (response.data.success) {
        const allOrdersItem = []

        // In MongoDB, each order contains an array of purchased items.
        // We unpack each item so customers can see every product they ordered.
        response.data.orders.forEach((order) => {
          if (Array.isArray(order.items)) {
            order.items.forEach((item, index) => {
              allOrdersItem.push({
                ...item,
                orderId: order._id,
                displayKey: `${order._id}-${item._id || item.productId || index}`,
                status: order.status,
                payment: order.payment,
                paymentMethod: order.paymentMethod,
                date: order.date,
                amount: order.amount,
              })
            })
          }
        })

        setOrders(allOrdersItem)
      } else {
        toast.error(response.data.message || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      toast.error(error.response?.data?.message || error.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  // Load orders on initial render and when token changes
  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <Layout>
      <div className="page-container min-h-[900px] pt-16 sm:min-h-[1500px] sm:pt-20 lg:min-h-[2100px] lg:pt-24">
        <div className="flex items-center justify-between">
          <h1 className="section-rule-title animate-enter">
            <span>MY <strong>ORDERS</strong></span>
          </h1>
          {token && (
            <button
              onClick={() => {
                loadOrderData()
                toast.info('Refreshing orders...')
              }}
              disabled={loading}
              className="text-xs text-[#71685f] underline transition-colors hover:text-ink disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Orders'}
            </button>
          )}
        </div>

        {/* Not Logged In State */}
        {!token ? (
          <div className="animate-enter mt-8 rounded-2xl border border-line bg-ivory/60 p-12 text-center shadow-[0_8px_24px_rgba(67,54,38,0.035)]">
            <p className="text-sm text-muted">Please sign in to view your order history.</p>
            <Link to="/login" className="btn-primary mt-4 inline-block px-8 py-3 text-xs tracking-wider">
              SIGN IN
            </Link>
          </div>
        ) : (
          <div className="animate-enter-delay mt-8 overflow-hidden rounded-2xl border border-line bg-ivory/60 shadow-[0_8px_24px_rgba(67,54,38,0.035)]">
            {loading && !orders.length ? (
              <div className="py-20 text-center text-sm text-muted">Loading orders...</div>
            ) : orders.length ? (
              orders.map((order) => {
                // Support image formats from MongoDB product objects
                const prodImage = Array.isArray(order.image)
                  ? order.image[0]
                  : order.image || order.product?.image?.[0] || order.product?.image || ''

                const prodName = order.name || order.product?.name || 'Product'
                const prodPrice = order.price ?? order.product?.price ?? 0
                const formattedDate = typeof order.date === 'number'
                  ? new Date(order.date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : order.date

                return (
                  <article
                    key={order.displayKey || order.orderId}
                    className="grid gap-4 border-b border-line px-4 py-5 transition-colors duration-300 last:border-b-0 hover:bg-white/70 sm:grid-cols-[120px_1fr_260px_150px] sm:items-center sm:gap-6 sm:px-5"
                  >
                    {/* Product Image */}
                    <img
                      src={prodImage}
                      alt={prodName}
                      className="aspect-[390/450] w-[88px] rounded-xl border border-[#e4d9cc] object-cover shadow-sm sm:w-[108px]"
                    />

                    {/* Product Details */}
                    <div>
                      <h2 className="text-[13px] font-medium text-ink sm:text-[15px] lg:text-[17px]">
                        {prodName}
                      </h2>
                      <p className="mt-3 text-[12px] text-[#625b54] sm:text-[13px]">
                        {currency}{prodPrice} &nbsp;&bull;&nbsp; Quantity: {order.quantity || 1} &nbsp;&bull;&nbsp; Size: {order.size || 'M'}
                      </p>
                      <p className="mt-2 text-[11px] text-[#786f65] sm:text-[12px]">
                        Method: <span className="uppercase font-medium text-ink">{order.paymentMethod || 'COD'}</span>
                      </p>
                      <p className="mt-1 text-[11px] text-muted sm:text-[12px]">
                        Date: {formattedDate}
                      </p>
                    </div>

                    {/* Order Status */}
                    <div className="flex items-center gap-3 text-[12px] text-[#4c554a] sm:text-[13px]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#36a34a] shadow-[0_0_0_4px_rgba(54,163,74,0.09)]" />
                      <span className="font-medium">{order.status || 'Order Placed'}</span>
                    </div>

                    {/* Track / Refresh Status Button */}
                    <button
                      onClick={() => {
                        loadOrderData()
                        toast.info('Checking order status...')
                      }}
                      className="btn-secondary h-10 w-[120px] text-[11px] sm:w-[140px]"
                    >
                      Track Order
                    </button>
                  </article>
                )
              })
            ) : (
              <div className="py-20 text-center text-sm text-muted">
                No orders placed yet.
                <div className="mt-4">
                  <Link to="/collection" className="btn-primary inline-block px-6 py-2.5 text-xs">
                    START SHOPPING
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
