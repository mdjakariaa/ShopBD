import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const StoreContext = createContext(null)

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
export const currency = '$'
export const deliveryFee = 10

// Helper: Convert backend cartData object { [itemId]: { [size]: quantity } } to cart array
export const cartDataToArray = (cartData) => {
  const result = []
  if (!cartData || typeof cartData !== 'object') return result

  for (const itemId of Object.keys(cartData)) {
    const sizes = cartData[itemId]
    if (sizes && typeof sizes === 'object') {
      for (const size of Object.keys(sizes)) {
        const qty = Number(sizes[size])
        if (qty > 0) {
          result.push({
            lineId: `${itemId}-${size}`,
            productId: itemId,
            size,
            quantity: qty,
          })
        }
      }
    }
  }
  return result
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('forever-cart'))
      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  })

  // Fetch products list from backend
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

  // Fetch cart data from backend API
  const getUserCart = async (authToken) => {
    const activeToken = authToken || token
    if (!activeToken) return

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token: activeToken } },
      )
      if (response.data.success) {
        const items = cartDataToArray(response.data.cartData)
        setCart(items)
      } else {
        console.error('Failed to get user cart:', response.data.message)
      }
    } catch (error) {
      console.error('Failed to fetch user cart:', error.message)
    }
  }

  // Load products on initial mount
  useEffect(() => {
    getProductsData()
  }, [])

  // Sync token to localStorage and fetch user cart if token is present
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      getUserCart(token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  // Save cart to localStorage for offline / persistence
  useEffect(() => {
    localStorage.setItem('forever-cart', JSON.stringify(cart))
  }, [cart])

  // Logout handler
  const logout = () => {
    setToken('')
    setCart([])
    localStorage.removeItem('token')
    localStorage.removeItem('forever-cart')
  }

  // Add product to cart (calls POST /api/cart/add when authenticated)
  const addToCart = async (productId, size = 'L', quantity = 1) => {
    const count = Math.max(1, Number(quantity) || 1)
    const lineId = `${productId}-${size}`

    // Optimistically update local cart state
    setCart((current) => {
      const existingIndex = current.findIndex(
        (item) => item.lineId === lineId || (item.productId === productId && item.size === size),
      )

      if (existingIndex > -1) {
        const updated = [...current]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + count,
        }
        return updated
      } else {
        return [...current, { lineId, productId, size, quantity: count }]
      }
    })

    // If authenticated, sync with backend
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId: productId, size, quantity: count },
          { headers: { token } },
        )
        if (!response.data.success) {
          toast.error(response.data.message)
        }
      } catch (error) {
        console.error('Failed to add to cart on backend:', error.message)
        toast.error(error.message)
      }
    }
  }

  // Update item quantity (calls POST /api/cart/update when authenticated)
  // Supports both (lineId, quantity) and (productId, size, quantity)
  const updateQuantity = async (firstArg, secondArg, thirdArg) => {
    let productId
    let size
    let quantity
    let lineId

    if (thirdArg !== undefined) {
      productId = firstArg
      size = secondArg
      quantity = thirdArg
      lineId = `${productId}-${size}`
    } else {
      lineId = firstArg
      quantity = secondArg
      const found = cart.find((item) => item.lineId === lineId)
      if (found) {
        productId = found.productId
        size = found.size
      } else if (typeof lineId === 'string' && lineId.includes('-')) {
        const parts = lineId.split('-')
        size = parts.pop()
        productId = parts.join('-')
      }
    }

    if (quantity === '' || quantity === null || quantity === undefined) {
      return
    }

    const numQty = Number(quantity)
    if (isNaN(numQty)) return

    // Update local cart state
    setCart((current) => {
      if (numQty <= 0) {
        return current.filter(
          (item) =>
            item.lineId !== lineId &&
            !(productId && item.productId === productId && item.size === size),
        )
      }
      return current.map((item) => {
        if (
          item.lineId === lineId ||
          (productId && item.productId === productId && item.size === size)
        ) {
          return { ...item, quantity: numQty }
        }
        return item
      })
    })

    // If authenticated, sync with backend
    if (token && productId && size) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId: productId, size, quantity: Math.max(0, numQty) },
          { headers: { token } },
        )
        if (!response.data.success) {
          toast.error(response.data.message)
        }
      } catch (error) {
        console.error('Failed to update cart on backend:', error.message)
        toast.error(error.message)
      }
    }
  }

  // Remove item from cart (calls POST /api/cart/update with quantity: 0 when authenticated)
  const removeFromCart = async (firstArg, secondArg) => {
    let productId
    let size
    let lineId

    if (secondArg !== undefined) {
      productId = firstArg
      size = secondArg
      lineId = `${productId}-${size}`
    } else {
      lineId = firstArg
      const found = cart.find((item) => item.lineId === lineId)
      if (found) {
        productId = found.productId
        size = found.size
      } else if (typeof lineId === 'string' && lineId.includes('-')) {
        const parts = lineId.split('-')
        size = parts.pop()
        productId = parts.join('-')
      }
    }

    // Remove from local cart state
    setCart((current) =>
      current.filter(
        (item) =>
          item.lineId !== lineId &&
          !(productId && item.productId === productId && item.size === size),
      ),
    )

    // Sync with backend (quantity 0 removes item)
    if (token && productId && size) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId: productId, size, quantity: 0 },
          { headers: { token } },
        )
        if (!response.data.success) {
          toast.error(response.data.message)
        }
      } catch (error) {
        console.error('Failed to remove cart item on backend:', error.message)
        toast.error(error.message)
      }
    }
  }

  // Derived cart items with attached product details
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

  const cartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (Number(item.quantity) || 0),
    0,
  )

  return (
    <StoreContext.Provider
      value={{
        products,
        currency,
        backendUrl,
        token,
        setToken,
        logout,
        cart,
        setCart,
        cartItems,
        cartCount,
        subtotal,
        deliveryFee,
        addToCart,
        removeFromCart,
        updateQuantity,
        getUserCart,
        getProductsData,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
