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
      const existing = prev.find(i => i.id === product.id && i.size === size && i.color === color)
      if (existing) {
        return prev.map(i => i.id === product.id && i.size === size && i.color === color
          ? { ...i, qty: i.qty + qty } : i)
      }
      return [...prev, {
        id: product.id, name: product.name, category: product.category,
        image: product.images?.[0] || product.image_url || '',
        wholesale_price: product.wholesale_price, mrp: product.mrp,
        moq: product.moq, qty, size, color
      }]
    })
  }

  function updateQty(id, size, color, qty) {
    setItems(prev => prev.map(i =>
      i.id === id && i.size === size && i.color === color ? { ...i, qty } : i
    ))
  }

  function removeItem(id, size, color) {
    setItems(prev => prev.filter(i => !(i.id === id && i.size === size && i.color === color)))
  }

  function clearCart() { setItems([]) }

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const totalValue = items.reduce((s, i) => s + (i.wholesale_price * i.qty), 0)

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeItem, clearCart, totalItems, totalValue }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) }
