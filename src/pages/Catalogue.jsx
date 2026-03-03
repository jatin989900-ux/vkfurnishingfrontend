import { useState, useEffect } from 'react'
import { getProducts } from '../api.js'
import ProductCard from '../components/ProductCard.jsx'
import ProductDetail from '../components/ProductDetail.jsx'
import Modal from '../components/Modal.jsx'

const S = [
  '.cat-page{max-width:1080px;margin:0 auto;padding:24px 16px;}',
  '.cat-hd{margin-bottom:20px;}',
  '.cat-hd h2{font-size:24px;font-weight:700;margin-bottom:4px;}',
  '.cat-hd p{font-size:13px;color:#8888AA;}',
  '.filters{display:flex;gap:8px;overflow-x:auto;padding-bottom:10px;margin-bottom:20px;scrollbar-width:none;}',
  '.filters::-webkit-scrollbar{display:none;}',
  '.filter-btn{padding:7px 14px;border-radius:20px;border:1.5px solid #E8E2D8;background:#fff;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;color:#3D3D5C;}',
  '.filter-btn.active{background:#1C1C2E;color:#fff;border-color:#1C1C2E;}',
  '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;}',
  '.empty{text-align:center;padding:60px 20px;color:#8888AA;}',
  '.search-box{width:100%;padding:11px 14px;border:1.5px solid #E8E2D8;border-radius:10px;font-size:14px;outline:none;margin-bottom:14px;box-sizing:border-box;}',
  '.search-box:focus{border-color:#C9973A;}',
].join('')

const CATS = ['All','Bedsheets','Dohars','Comforters','Blankets','Towels','Quilts','Bathrobes','Bedcovers','Top Sheets','Other']

export default function Catalogue({ retailer, onLogin }) {
  const [products, setProducts] = useState([])
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    getProducts(retailer?.phone).then(r => setProducts(r.products || [])).catch(console.error)
  }, [retailer])

  function handleSuccess(data) {
    if (data === 'login') { setModal('login'); return }
    if (data === 'register') { setModal('register'); return }
    if (data && data.phone) { onLogin(data); setModal(null) }
    else setModal(null)
  }

  const filtered = products.filter(p => {
    const matchCat = cat === 'All' || p.category === cat
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      <style>{S}</style>
      <div className="cat-page">
        <div className="cat-hd">
          <h2>Full Catalogue</h2>
          <p>{products.length} products · Tap any to view details{retailer?.status === 'approved' ? ' and order' : ''}</p>
        </div>
        <input
          className="search-box"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filters">
          {CATS.map(c => (
            <button key={c} className={'filter-btn' + (cat === c ? ' active' : '')} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        {filtered.length === 0
          ? <div className="empty"><div style={{fontSize:40,marginBottom:10}}>📦</div><p>No products found</p></div>
          : <div className="grid">
              {filtered.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  approved={retailer?.status === 'approved'}
                  onClick={() => setSelected(p)}
                />
              ))}
            </div>
        }
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
