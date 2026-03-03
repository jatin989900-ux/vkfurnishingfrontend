import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getProducts } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'
import ProductDetail from '../components/ProductDetail.jsx'
import Modal from '../components/Modal.jsx'

const S = `
.hero{background:#1C1C2E;padding:60px 20px 52px;text-align:center;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(201,151,58,0.1) 0%,transparent 60%);}
.hero-tag{display:inline-block;background:rgba(201,151,58,0.15);border:1px solid rgba(201,151,58,0.3);color:#C9973A;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin-bottom:18px;position:relative;}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(28px,6vw,54px);color:#fff;line-height:1.1;margin-bottom:14px;position:relative;}
.hero h1 span{color:#C9973A;}
.hero p{color:#9999BB;font-size:15px;max-width:440px;margin:0 auto 28px;line-height:1.6;position:relative;}
.hero-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;position:relative;}
.btn-gold{background:#C9973A;color:#1C1C2E;border:none;padding:13px 26px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:none;display:inline-block;}
.btn-ghost{background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.2);padding:13px 26px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:none;display:inline-block;}
.stats{background:#C9973A;display:flex;justify-content:center;flex-wrap:wrap;}
.stat{padding:14px 32px;text-align:center;border-right:1px solid rgba(28,28,46,0.15);}
.stat:last-child{border-right:none;}
.stat-n{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#1C1C2E;}
.stat-l{font-size:10px;color:rgba(28,28,46,0.6);font-weight:600;text-transform:uppercase;letter-spacing:0.4px;}
.section{max-width:1080px;margin:0 auto;padding:40px 16px;}
.section-hd{text-align:center;margin-bottom:28px;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;}
`

export default function Home({ retailer, onLogin }) {
  const [products, setProducts] = useState([])
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const location = useLocation()

  useEffect(() => {
    getProducts(retailer?.phone).then(r => setProducts(r.products || [])).catch(console.error)
  }, [retailer])

  useEffect(() => {
    if (location.state?.openRegister) setModal('register')
  }, [location])

  function handleSuccess(data) {
    if (data === 'login') { setModal('login'); return }
    if (data === 'register') { setModal('register'); return }
    if (data?.phone) { onLogin(data); setModal(null) }
    else setModal(null)
  }

  return (
    <>
      <style>{S}</style>
      <div className="hero">
        <div className="hero-tag">Verified Retailers Only · Wholesale Pricing</div>
        <h1>India's Trusted<br /><span>Wholesale Bedding</span><br />Destination</h1>
        <p>200+ designs across bedsheets, dohars, blankets & more. Same-day dispatch pan-India.</p>
        <div className="hero-btns">
          <button className="btn-gold" onClick={() => setModal('register')}>Register Your Shop →</button>
          <Link to="/catalogue" className="btn-ghost">Browse Catalogue</Link>
        </div>
      </div>
      <div className="stats">
        {[['200+','Designs'],[`${products.length}`,'Products'],['Same Day','Dispatch'],['Pan India','Delivery']].map(([n,l]) => (
          <div key={l} className="stat"><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
        ))}
      </div>
      <div className="section">
        <div className="section-hd">
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,marginBottom:8}}>Our Product Range</h2>
          <p style={{fontSize:14,color:'#8888AA'}}>Tap any product to view details & images</p>
        </div>
        {products.length === 0
          ? <div className="loading-screen"><div className="spinner"></div><p>Loading products...</p></div>
          : <div className="grid">
              {products.slice(0,6).map(p => (
                <ProductCard key={p.id} product={p} approved={retailer?.status==='approved'}
                  onClick={() => setSelected(p)} />
              ))}
            </div>
        }
        {products.length > 6 && (
          <div style={{textAlign:'center',marginTop:28}}>
            <Link to="/catalogue" className="btn-gold">View All {products.length} Products →</Link>
          </div>
        )}
      </div>

      {selected && (
        <ProductDetail
          product={selected}
          approved={retailer?.status==='approved'}
          onClose={() => setSelected(null)}
          onRegister={() => { setSelected(null); setModal('register') }}
        />
      )}
      {modal === 'register' && <Modal type="register" onClose={() => setModal(null)} onSuccess={handleSuccess} />}
      {modal === 'login' && <Modal type="login" onClose={() => setModal(null)} onSuccess={handleSuccess} />}
    </>
  )
}
