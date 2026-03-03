import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CartProvider } from './cart.jsx'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Catalogue from './pages/Catalogue.jsx'
import Cart from './pages/Cart.jsx'
import Admin from './pages/Admin.jsx'
import Modal from './components/Modal.jsx'

export default function App() {
  const [retailer, setRetailer] = useState(null)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('vk_retailer')
    if (saved) setRetailer(JSON.parse(saved))
  }, [])

  function loginRetailer(r) {
    setRetailer(r)
    localStorage.setItem('vk_retailer', JSON.stringify(r))
  }

  function logoutRetailer() {
    setRetailer(null)
    localStorage.removeItem('vk_retailer')
  }

  function handleSuccess(data) {
    if (data === 'login') { setModal('login'); return }
    if (data === 'register') { setModal('register'); return }
    if (data && data.phone) { loginRetailer(data); setModal(null) }
    else setModal(null)
  }

  return (
    <CartProvider>
      <Nav
        retailer={retailer}
        onLogin={() => setModal('login')}
        onLogout={logoutRetailer}
        onRegister={() => setModal('register')}
      />
      <Routes>
        <Route path="/" element={<Home retailer={retailer} onLogin={loginRetailer} />} />
        <Route path="/catalogue" element={<Catalogue retailer={retailer} onLogin={loginRetailer} />} />
        <Route path="/cart" element={<Cart retailer={retailer} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <footer style={{background:'#1C1C2E',color:'#5555AA',textAlign:'center',padding:'20px',fontSize:'11px',marginTop:'48px'}}>
        <p>2025 VK Furnishing · Wholesale Bedding · Pan-India Same-Day Dispatch</p>
      </footer>
      {modal === 'register' && <Modal type="register" onClose={() => setModal(null)} onSuccess={handleSuccess} />}
      {modal === 'login' && <Modal type="login" onClose={() => setModal(null)} onSuccess={handleSuccess} />}
    </CartProvider>
  )
}
