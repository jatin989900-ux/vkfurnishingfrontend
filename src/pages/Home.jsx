import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'
import ProductDetail from '../components/ProductDetail.jsx'
import Modal from '../components/Modal.jsx'

const S = [
  '.hero{background:linear-gradient(150deg,#1C1C2E 0%,#252540 60%,#1C1C2E 100%);padding:52px 24px 44px;text-align:center;position:relative;overflow:hidden;}',
  '.hero::before{content:"";position:absolute;inset:0;background-image:radial-gradient(circle at 20% 50%,rgba(201,151,58,0.08) 0%,transparent 60%),radial-gradient(circle at 80% 20%,rgba(201,151,58,0.06) 0%,transparent 50%);pointer-events:none;}',
  '.hero-badge{display:inline-block;background:rgba(201,151,58,0.12);border:1px solid rgba(201,151,58,0.25);color:#C9973A;font-size:10px;font-weight:700;padding:6px 16px;border-radius:20px;letter-spacing:1.8px;margin-bottom:22px;text-transform:uppercase;position:relative;}',
  '.hero h1{font-family:"Cormorant Garamond",serif;font-size:clamp(28px,7vw,52px);color:#fff;font-weight:700;line-height:1.15;margin:0 0 6px;position:relative;}',
  '.hero h1 span{color:#C9973A;}',
  '.hero p{color:rgba(255,255,255,0.55);font-size:14px;max-width:340px;margin:0 auto 28px;line-height:1.75;position:relative;}',
  '.hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative;}',
  '.btn-gold{background:#C9973A;color:#fff;border:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;letter-spacing:0.2px;box-shadow:0 4px 20px rgba(201,151,58,0.4);transition:all 0.2s;font-family:"DM Sans",sans-serif;text-decoration:none;display:inline-flex;align-items:center;}',
  '.btn-gold:hover{background:#B8862F;box-shadow:0 6px 24px rgba(201,151,58,0.5);transform:translateY(-1px);}',
  '.btn-outline{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,0.2);padding:14px 28px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:"DM Sans",sans-serif;text-decoration:none;display:inline-flex;align-items:center;}',
  '.btn-outline:hover{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.35);}',
  '.stats{background:#fff;padding:0 16px;display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #EDE9E0;box-shadow:0 2px 12px rgba(0,0,0,0.04);}',
  '.stat{text-align:center;padding:18px 4px;}',
  '.stat:not(:last-child){border-right:1px solid #F0EDE4;}',
  '.stat-n{font-family:"Cormorant Garamond",serif;font-size:20px;font-weight:700;color:#C9973A;display:block;line-height:1;}',
  '.stat-l{font-size:9px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:0.8px;margin-top:5px;display:block;}',
  '.section{max-width:1080px;margin:0 auto;padding:32px 14px 40px;}',
  '.section-hd{text-align:center;margin-bottom:24px;}',
  '.section-hd h2{font-family:"Cormorant Garamond",serif;font-size:26px;font-weight:700;color:#1C1C2E;margin:0 0 6px;}',
  '.section-hd p{font-size:13px;color:#aaa;margin:0;}',
  '.section-hd::after{content:"";display:block;width:36px;height:2px;background:linear-gradient(90deg,#C9973A,#E8C97A);margin:12px auto 0;border-radius:2px;}',
  '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:12px;}',
  '.loading{text-align:center;padding:60px 20px;color:#C9973A;font-size:14px;font-style:italic;}',
  '.view-all-wrap{text-align:center;margin-top:28px;}',
  '.btn-dark{background:#1C1C2E;color:#fff;padding:13px 32px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;transition:all 0.2s;}',
  '.btn-dark:hover{background:#2D2D46;transform:translateY(-1px);}',
  '.home-footer{background:#1C1C2E;padding:20px 24px;text-align:center;}',
  '.home-footer p{color:rgba(255,255,255,0.35);font-size:11px;margin:0;letter-spacing:0.5px;}',
  '.home-footer span{color:#C9973A;}',
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
        <div className="hero-badge">Verified Retailers Only · Wholesale Pricing</div>
        <h1>India's Trusted<br /><span>Wholesale Bedding</span></h1>
        <p>200+ designs across bedsheets, dohars, blankets and more. Same-day dispatch pan-India.</p>
        <div className="hero-btns">
          <button className="btn-gold" onClick={() => setModal('register')}>Register Your Shop</button>
          <Link to="/catalogue" className="btn-outline">Browse Catalogue</Link>
        </div>
      </div>

      <div className="stats">
        {[['200+','Designs'],[String(products.length),'Products'],['Same Day','Dispatch'],['Pan India','Delivery']].map(([n,l]) => (
          <div key={l} className="stat">
            <span className="stat-n">{n}</span>
            <span className="stat-l">{l}</span>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="section-hd">
          <h2>Our Product Range</h2>
          <p>Tap on any product to view details</p>
        </div>
        {products.length === 0
          ? <div className="loading">Loading products...</div>
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
          <div className="view-all-wrap">
            <Link to="/catalogue" className="btn-dark">View All {products.length} Products</Link>
          </div>
        )}
      </div>

      <div className="home-footer">
        <p>© 2025 <span>VK Furnishing</span> · Wholesale Bedding · Pan-India Same-Day Dispatch</p>
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
