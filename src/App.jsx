import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Catalogue from './pages/Catalogue.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  const [retailer, setRetailer] = useState(null)
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
  return (
    <>
      <Nav retailer={retailer} onLogout={logoutRetailer} />
      <Routes>
        <Route path="/" element={<Home retailer={retailer} onLogin={loginRetailer} />} />
        <Route path="/catalogue" element={<Catalogue retailer={retailer} onLogin={loginRetailer} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <footer style={{background:'#1C1C2E',color:'#5555AA',textAlign:'center',padding:'20px',fontSize:'11px',marginTop:'48px'}}>
        <p>© 2025 <span style={{color:'#C9973A'}}>VK Furnishing</span> · Wholesale Bedding · Pan-India Same-Day Dispatch</p>
      </footer>
    </>
  )
}
