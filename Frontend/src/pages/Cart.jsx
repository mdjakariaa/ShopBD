import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import CartTotals from '../components/CartTotals'
import binIcon from '../assets/bin_icon.png'
import { useStore } from '../StoreContext'

export default function Cart() {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, currency = '$' } = useStore()

  return (
    <Layout>
      <div className="page-container min-h-[900px] pt-16 sm:min-h-[1500px] sm:pt-20 lg:min-h-[2100px] lg:pt-24">
        <h1 className="section-rule-title animate-enter"><span>YOUR <strong>CART</strong></span></h1>

        <div className="animate-enter-delay mt-8 border-t border-line">
          {cartItems.length ? cartItems.map((item) => {
            const productImage = Array.isArray(item.product?.image)
              ? item.product.image[0]
              : item.product?.image

            return (
              <div key={item.lineId} className="grid grid-cols-[80px_1fr_auto] items-center gap-4 border-b border-line py-5 transition-colors duration-300 hover:bg-ivory/40 sm:grid-cols-[120px_1fr_150px_44px] sm:gap-6 sm:px-2">
                <img src={productImage} alt={item.product?.name || 'Product'} className="aspect-[390/450] w-[78px] rounded-xl border border-[#e5dbcf] object-cover shadow-sm sm:w-[108px]" />
                <div className="min-w-0 self-start pt-1 sm:self-center sm:pt-0">
                  <h2 className="text-[12px] font-medium leading-5 text-ink sm:text-[15px] lg:text-[17px]">{item.product?.name}</h2>
                  <div className="mt-3 flex items-center gap-4 text-[12px] text-[#625b54] sm:text-[14px]">
                    <span className="font-medium text-espresso">{currency}{item.product?.price}</span>
                    <span className="rounded-lg border border-line bg-ivory px-3 py-1.5">{item.size}</span>
                  </div>
                </div>
                <input
                  aria-label={`Quantity for ${item.product?.name}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.lineId, e.target.value)}
                  className="field col-start-2 row-start-2 h-9 w-20 px-3 text-xs sm:col-start-3 sm:row-start-1 sm:h-11 sm:w-[115px]"
                />
                <button onClick={() => removeFromCart(item.lineId)} className="icon-button col-start-3 row-span-2 row-start-1 sm:col-start-4 sm:row-span-1" aria-label="Remove item">
                  <img src={binIcon} alt="" className="h-5 w-5 object-contain opacity-70 transition-opacity hover:opacity-100 sm:h-6 sm:w-6" />
                </button>
              </div>
            )
          }) : (
            <div className="border-b border-line py-16 text-center text-sm text-muted">Your cart is empty.</div>
          )}
        </div>

        <div className="ml-auto mt-14 max-w-[650px] sm:mt-20">
          <CartTotals />
          <div className="mt-5 text-right">
            <button disabled={!cartItems.length} onClick={() => navigate('/checkout')} className="btn-primary h-[50px] px-9 text-[11px] tracking-[0.04em]">PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
