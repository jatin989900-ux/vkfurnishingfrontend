import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vk_cart') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('vk_cart', JSON.stringify(items))
  }, [items])

  function addToCart(product, qty, size, color) {
    setItems(prev => {
      const existing = prev.findIndex(i => i.product.id === product.id && i.size === size && i.color === color)
      if (existing >= 0) {
        return prev.map((i, idx) => idx === existing ? { ...i, quantity: i.quantity + qty } : i)
      }
      return [...prev, { product, quantity: qty, size, color }]
    })
  }

  function updateQty(index, qty) {
    if (qty <= 0) { removeItem(index); return }
    setItems(prev => prev.map((i, idx) => idx === index ? { ...i, quantity: qty } : i))
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, idx) => idx !== index))
  }

  function clearCart() { setItems([]) }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalValue = items.reduce((s, i) => s + (i.product.wholesale_price * i.quantity), 0)

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeItem, clearCart, totalItems, totalValue }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) } 
