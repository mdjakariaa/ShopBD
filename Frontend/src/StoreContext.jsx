import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { products } from './data/products'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('forever-cart'))
      return saved || [
        { lineId: 'demo-1', productId: 12, size: 'L', quantity: 1 },
        { lineId: 'demo-2', productId: 12, size: 'L', quantity: 1 },
      ]
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('forever-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (productId, size = 'L', quantity = 1) => {
    setCart((current) => [
      ...current,
      { lineId: `${productId}-${size}-${Date.now()}`, productId, size, quantity },
    ])
  }

  const removeFromCart = (lineId) => {
    setCart((current) => current.filter((item) => item.lineId !== lineId))
  }

  const updateQuantity = (lineId, quantity) => {
    setCart((current) =>
      current.map((item) =>
        item.lineId === lineId
          ? { ...item, quantity: Math.max(1, Number(quantity) || 1) }
          : item,
      ),
    )
  }

  const cartItems = useMemo(
    () =>
      cart.map((item) => ({
        ...item,
        product: products.find((product) => product.id === item.productId),
      })),
    [cart],
  )

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <StoreContext.Provider
      value={{ products, cartItems, cartCount, subtotal, addToCart, removeFromCart, updateQuantity, setCart }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
