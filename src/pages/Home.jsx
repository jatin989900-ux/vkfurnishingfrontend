import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'
import ProductDetail from '../components/ProductDetail.jsx'
import Modal from '../components/Modal.jsx'

const S = [
  '.hero{background:#1C1C2E;padding:56px 20px 48px;text-align:center;overflow:hidden;}',
  '.hero-tag{display:inline-block;background:rgba(201,151,58,0.15);border:1px solid rgba(201,151,58,0.3);color:#C9973A;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin-bottom:16px;}',
  '.hero h1{font-size:clamp(26px,6vw,50px);color:#fff;line-height:1.15;margin-bottom:12px;}',
  '.hero h1 span{color:#C9973A;}',
  '.hero p{color:#9999BB;font-size:14px;max-width:420px;margin:0 auto 24px;line-height:1.6;}',
  '.hero-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}',
  '.btn-gold{background:#C9973A;color:#1C1C2E;border:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-block;}',
  '.btn-ghost{background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.2);padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-block;}',
  '.stats{background:#C9973A;display:flex;justify-content:center;flex-wrap:wrap;}',
  '.stat{padding:13px 28px;text-align:center;border-right:1px solid rgba(28,28,46,0.15);}',
  '.stat:last-child{border-right:none;}',
  '.stat-n{font-size:19px;font-weight:700;color:#1C1C2E;}',
  '.stat-l{font-size:10px;color:rgba(28,28,46,0.6);font-weight:600;text-transform:uppercase;}',
  '.section{max-width:1080px;margin:0 auto;padding:36px 16px;}',
  '.section-hd{text-align:center;margin-bottom:24px;}',
  '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;}',
].join('')

export default function Home({ retailer, onLogin }) {
  const [products, setProducts] = useState([])
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getProducts(retailer?.phone).then(r => setProducts(r.products || [])).catch(console.error)
  }, [retailer])

  function handleSuccess(data) {
    if (data === 'login') { setModal('login'); return }
    if (data === 'register') { setModal('register'); return }
    if (data && data.phone) { onLogin(data); setModal(null) }
    else setModal(null)
  }

  return (
    <>
      <style>{S}</style>
      <div className="hero">
        <div className="hero-tag">Verified Retailers Only · Wholesale Pricing</div>
        <h1>India's Trusted<br /><span>Wholesale Bedding</span></h1>
        <p>200+ designs across bedsheets, dohars, blankets and more. Same-day dispatch pan-India.</p>
        <div className="hero-btns">
          <button className="btn-gold" onClick={() => setModal('register')}>Register Your Shop</button>
          <Link to="/catalogue" className="btn-ghost">Browse Catalogue</Link>
        </div>
      </div>
      <div className="stats">
        {[['200+','Designs'],[String(products.length),'Products'],['Same Day','Dispatch'],['Pan India','Delivery']].map(([n,l]) => (
          <div key={l} className="stat"><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
        ))}
      </div>
      <div className="section">
        <div className="section-hd">
          <h2 style={{fontSize:26,marginBottom:6}}>Our Product Range</h2>
          <p style={{fontSize:13,color:'#8888AA'}}>Tap any product to view details</p>
        </div>
        {products.length === 0
          ? <div style={{textAlign:'center',padding:40,color:'#8888AA'}}>Loading products...</div>
          : <div className="grid">
              {products.slice(0,6).map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  approved={retailer?.status === 'approved'}
                  onClick={() => setSelected(p)}
                />
              ))}
            </div>
        }
        {products.length > 6 && (
          <div style={{textAlign:'center',marginTop:24}}>
            <Link to="/catalogue" className="btn-gold">View All {products.length} Products</Link>
          </div>
        )}
      </div>

      {selected && (
        <ProductDetail
          product={selected}
          approved={retailer?.status === 'approved'}
          onClose={() => setSelected(null)}
          onRegister={() => { setSelected(null); setModal('register') }}
        />
      )}
      {modal === 'register' && <Modal type="register" onClose={() => setModal(null)} onSuccess={handleSuccess} />}
      {modal === 'login' && <Modal type="login" onClose={() => setModal(null)} onSuccess={handleSuccess} />}
    </>
  )
}
