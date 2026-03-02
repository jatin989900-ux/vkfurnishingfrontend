import { useState, useEffect } from 'react'
import { getProducts } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'
import Modal from '../components/Modal.jsx'

const S = `
.cat-page{max-width:1080px;margin:0 auto;padding:32px 16px;}
.cat-hd{margin-bottom:20px;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px;}
.search-wrap{position:relative;margin-bottom:16px;}
.search-wrap input{width:100%;padding:11px 14px 11px 40px;border:1.5px solid #E8E2D8;border-radius:10px;font-size:13px;font-family:'DM Sans',sans-serif;color:#1C1C2E;background:#fff;outline:none;}
.search-wrap input:focus{border-color:#C9973A;}
.si{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:15px;}
.filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px;}
.fb{padding:7px 16px;border-radius:20px;border:1px solid #E8E2D8;background:#fff;color:#3D3D5C;font-size:12px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;}
.fb.active{background:#1C1C2E;color:#fff;border-color:#1C1C2E;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;}
.login-bar{background:#1C1C2E;color:#ccc;text-align:center;padding:12px 20px;font-size:13px;}
`

export default function Catalogue({ retailer, onLogin }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [modal, setModal] = useState(null)

  useEffect(() => {
    setLoading(true)
    getProducts(retailer?.phone)
      .then(r => { setProducts(r.products || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [retailer])

  const allCats = ['All', ...Array.from(new Set(products.map(p => p.category)))]
  const filtered = products.filter(p =>
    (activeCat === 'All' || p.category === activeCat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.category.toLowerCase().includes(search.toLowerCase()))
  )

  function handleSuccess(data) {
    if (data === 'login') { setModal('login'); return }
    if (data === 'register') { setModal('register'); return }
    if (data?.phone) { onLogin(data); setModal(null) }
    else setModal(null)
  }

  return (
    <>
      <style>{S}</style>
      {!retailer && (
        <div className="login-bar">
          Already registered? <span style={{color:'#C9973A',cursor:'pointer'}} onClick={() => setModal('login')}>Login to see wholesale prices</span>
        </div>
      )}
      <div className="cat-page">
        <div className="cat-hd">
          <div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,marginBottom:4}}>Product Catalogue</h2>
            <p style={{fontSize:12,color:'#8888AA'}}>
              {retailer?.status === 'approved'
                ? `Welcome, ${retailer.shop_name} · Wholesale prices visible`
                : 'Register & get approved to see wholesale prices'}
            </p>
          </div>
          {retailer?.status === 'approved' && (
            <div style={{background:'#1A6B3C',color:'#fff',padding:'5px 12px',borderRadius:20,fontSize:11,fontWeight:700}}>
              ✓ Verified Retailer
            </div>
          )}
        </div>
        <div className="search-wrap">
          <span className="si">🔍</span>
          <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filters">
          {allCats.map(c => (
            <button key={c} className={`fb ${activeCat===c?'active':''}`} onClick={() => setActiveCat(c)}>{c}</button>
          ))}
        </div>
        {loading
          ? <div className="loading-screen"><div className="spinner"></div><p>Loading catalogue...</p></div>
          : filtered.length === 0
            ? <div style={{textAlign:'center',padding:48,color:'#8888AA'}}><div style={{fontSize:40,marginBottom:12}}>📦</div><p>No products found</p></div>
            : <div className="grid">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} approved={retailer?.status==='approved'}
                    onEnquire={() => setModal({type:'order',product:p})}
                    onRegister={() => setModal('register')} />
                ))}
              </div>
        }
      </div>
      {modal === 'register' && <Modal type="register" onClose={() => setModal(null)} onSuccess={handleSuccess} />}
      {modal === 'login' && <Modal type="login" onClose={() => setModal(null)} onSuccess={handleSuccess} />}
      {modal?.type === 'order' && <Modal type="order" product={modal.product} onClose={() => setModal(null)} onSuccess={() => setModal(null)} />}
    </>
  )
}
