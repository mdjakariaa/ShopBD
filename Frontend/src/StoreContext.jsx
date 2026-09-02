import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const StoreContext = createContext(null)

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
export const currency = '$'

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('forever-cart'))
      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  })

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`)
      if (response.data.success) {
        setProducts(response.data.products)
      } else {
        console.error(response.data.message)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error.message)
    }
  }

  useEffect(() => {
    getProductsData()
  }, [])

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
      cart
        .map((item) => ({
          ...item,
          product: products.find((product) => (product._id || product.id) === item.productId),
        }))
        .filter((item) => Boolean(item.product)),
    [cart, products],
  )

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0,
  )

  return (
    <StoreContext.Provider
      value={{
        products,
        currency,
        backendUrl,
        cartItems,
        cartCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        setCart,
        getProductsData,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
