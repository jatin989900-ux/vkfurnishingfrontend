import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../cart.jsx'

const S = `
.pd-overlay{position:fixed;inset:0;background:rgba(10,10,20,0.92);z-index:300;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.2s ease;}
@media(min-width:600px){.pd-overlay{align-items:center;}}
.pd-modal{background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:600px;max-height:92vh;overflow-y:auto;position:relative;animation:slideUp 0.3s ease;}
@media(min-width:600px){.pd-modal{border-radius:24px;max-height:88vh;}}
@keyframes slideUp{from{transform:translateY(40px);opacity:0;}to{transform:translateY(0);opacity:1;}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.gallery{position:relative;height:320px;background:#1C1C2E;overflow:hidden;border-radius:24px 24px 0 0;}
@media(min-width:600px){.gallery{height:380px;}}
.gallery-track{display:flex;height:100%;transition:transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94);}
.gallery-slide{min-width:100%;height:100%;background:#1C1C2E;}
.gallery-slide img{width:100%;height:100%;object-fit:cover;}
.gallery-slide video{width:100%;height:100%;object-fit:cover;}
.gallery-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:72px;}
.gallery-close{position:absolute;top:14px;right:14px;width:34px;height:34px;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);border:none;border-radius:50%;color:#fff;font-size:14px;cursor:pointer;z-index:10;display:flex;align-items:center;justify-content:center;}
.gallery-nav{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;background:rgba(0,0,0,0.4);backdrop-filter:blur(8px);border:none;border-radius:50%;color:#fff;font-size:16px;cursor:pointer;z-index:10;display:flex;align-items:center;justify-content:center;}
.gallery-prev{left:12px;}.gallery-next{right:12px;}
.gallery-dots{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:5px;z-index:10;}
.gdot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.4);transition:all 0.2s;cursor:pointer;}
.gdot.active{background:#C9973A;width:18px;border-radius:3px;}
.gallery-count{position:absolute;top:14px;left:14px;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);color:#fff;font-size:11px;font-weight:700;padding:4px 9px;border-radius:20px;z-index:10;}
.ext-video-btn{position:absolute;bottom:12px;right:12px;background:rgba(192,57,43,0.9);color:#fff;border:none;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;z-index:10;}
.thumbs{display:flex;gap:6px;overflow-x:auto;padding:10px 18px 4px;scrollbar-width:none;}
.thumbs::-webkit-scrollbar{display:none;}
.thumb{width:52px;height:52px;border-radius:8px;overflow:hidden;flex-shrink:0;border:2px solid transparent;cursor:pointer;transition:all 0.2s;background:#1C1C2E;display:flex;align-items:center;justify-content:center;}
.thumb.active{border-color:#C9973A;}
.thumb img{width:100%;height:100%;object-fit:cover;}
.thumb-video{font-size:18px;}
.pd-body{padding:20px 18px 32px;}
.pd-tag{display:inline-block;background:#C9973A;color:#1C1C2E;font-size:9px;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;}
.pd-name{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;margin-bottom:6px;line-height:1.2;}
.pd-cat{font-size:12px;color:#8888AA;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;}
.pd-pills{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:16px;}
.pd-pill{background:#F2EDE4;color:#3D3D5C;font-size:11px;padding:4px 10px;border-radius:4px;font-weight:500;}
.pd-divider{border:none;border-top:1px solid #E8E2D8;margin:16px 0;}
.pd-price-locked{background:#F2EDE4;border-radius:12px;padding:16px;display:flex;align-items:center;gap:12px;margin-bottom:16px;}
.pd-lock-icon{width:40px;height:40px;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.pd-price-section{margin-bottom:16px;}
.pd-price-row{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:4px;}
.pd-ws{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#1A6B3C;}
.pd-mrp{font-size:14px;color:#8888AA;text-decoration:line-through;}
.pd-margin{font-size:11px;font-weight:700;color:#1A6B3C;background:rgba(26,107,60,0.1);padding:3px 8px;border-radius:4px;}
.pd-moq{font-size:12px;color:#8888AA;margin-bottom:4px;}
.pd-oos{display:inline-block;background:#FEE;color:#C0392B;font-size:11px;font-weight:700;padding:4px 10px;border-radius:4px;margin-bottom:12px;}
.pd-order{background:#FAF8F4;border-radius:14px;padding:16px;margin-bottom:16px;}
.pd-order-title{font-size:13px;font-weight:700;margin-bottom:12px;}
.pd-field{margin-bottom:10px;}
.pd-field label{display:block;font-size:10px;font-weight:600;color:#8888AA;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px;}
.pd-field select,.pd-field input{width:100%;padding:9px 11px;border:1.5px solid #E8E2D8;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;color:#1C1C2E;background:#fff;outline:none;}
.pd-field select:focus,.pd-field input:focus{border-color:#C9973A;}
.qty-row{display:flex;align-items:center;gap:10px;}
.qty-btn{width:34px;height:34px;border-radius:8px;border:1.5px solid #E8E2D8;background:#fff;cursor:pointer;font-size:18px;font-weight:700;display:flex;align-items:center;justify-content:center;}
.qty-num{font-weight:700;font-size:18px;min-width:28px;text-align:center;}
.cart-added{background:#E8F5E9;border:1px solid #C8E6C9;border-radius:10px;padding:12px 16px;display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.add-cart-btn{width:100%;padding:14px;background:#1C1C2E;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:10px;}
.view-cart-btn{width:100%;padding:14px;background:#C9973A;color:#1C1C2E;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;}
.pd-reg-btn{width:100%;padding:14px;background:#1C1C2E;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;}
`

const CAT_EMOJI = {'Bedsheets':'🛏️','Dohars':'🌸','Comforters':'❄️','Blankets':'🧣','Towels':'🚿','Quilts':'🌙','Bathrobes':'👘','Bedcovers':'🎨','Top Sheets':'✨','Other':'📦'}

export default function ProductDetail({ product: p, approved, onClose, onRegister }) {
  const { addToCart } = useCart()
  const images = (p.images && p.images.length > 0) ? p.images : (p.image_url ? [p.image_url] : [])
  const videoSlide = p.video_file_url ? { type: 'video', url: p.video_file_url } : null
  const slides = [...images.map(u => ({ type: 'image', url: u })), ...(videoSlide ? [videoSlide] : [])]
  const [idx, setIdx] = useState(0)
  const [qty, setQty] = useState(p.moq || 1)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [added, setAdded] = useState(false)
  const startX = useRef(null)
  const margin = p.wholesale_price ? Math.round(((p.mrp - p.wholesale_price) / p.mrp) * 100) : 0

  function handleTouchStart(e) { startX.current = e.touches[0].clientX }
  function handleTouchEnd(e) {
    if (startX.current === null) return
    const diff = startX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) setIdx(i => Math.min(i + 1, slides.length - 1))
      else setIdx(i => Math.max(i - 1, 0))
    }
    startX.current = null
  }

  function handleAddToCart() {
    addToCart(p, qty, size, color)
    setAdded(true)
  }

  return (
    <div className="pd-overlay" onClick={e => e.target.classList.contains('pd-overlay') && onClose()}>
      <style>{S}</style>
      <div className="pd-modal">
        <div className="gallery" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="gallery-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
            {slides.length > 0 ? slides.map((slide, i) => (
              <div key={i} className="gallery-slide">
                {slide.type === 'video'
                  ? <video src={slide.url} controls playsInline />
                  : <img src={slide.url} alt={`${p.name} ${i+1}`} />}
              </div>
            )) : (
              <div className="gallery-slide">
                <div className="gallery-placeholder">{CAT_EMOJI[p.category] || '📦'}</div>
              </div>
            )}
          </div>
          <button className="gallery-close" onClick={onClose}>✕</button>
          {slides.length > 1 && <>
            <span className="gallery-count">{idx + 1} / {slides.length}</span>
            {idx > 0 && <button className="gallery-nav gallery-prev" onClick={() => setIdx(i => i - 1)}>‹</button>}
            {idx < slides.length - 1 && <button className="gallery-nav gallery-next" onClick={() => setIdx(i => i + 1)}>›</button>}
            <div className="gallery-dots">
              {slides.map((_, i) => <div key={i} className={`gdot ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)} />)}
            </div>
          </>}
          {p.video_url && <button className="ext-video-btn" onClick={() => window.open(p.video_url, '_blank')}>▶ Watch on YouTube</button>}
        </div>

        {slides.length > 1 && (
          <div className="thumbs">
            {slides.map((slide, i) => (
              <div key={i} className={`thumb ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)}>
                {slide.type === 'video' ? <span className="thumb-video">🎬</span> : <img src={slide.url} alt="" />}
              </div>
            ))}
          </div>
        )}

        <div className="pd-body">
          {p.tag && <div className="pd-tag">{p.tag}</div>}
          <div className="pd-name">{p.name}</div>
          <div className="pd-cat">{p.category}</div>
          <div className="pd-pills">
            {p.gsm && <span className="pd-pill">GSM: {p.gsm}</span>}
            {p.colors > 0 && <span className="pd-pill">{p.colors} colors</span>}
            {p.sizes && p.sizes.split(',').map(s => <span key={s} className="pd-pill">{s.trim()}</span>)}
          </div>
          {!p.in_stock && <div className="pd-oos">Out of Stock</div>}
          <hr className="pd-divider" />

          {approved ? (
            <>
              <div className="pd-price-section">
                <div className="pd-price-row">
                  <span className="pd-ws">₹{p.wholesale_price}</span>
                  <span className="pd-mrp">₹{p.mrp}</span>
                  <span className="pd-margin">{margin}% margin</span>
                </div>
                <div className="pd-moq">Min. order: {p.moq} pcs · Profit ₹{p.mrp - p.wholesale_price}/pc</div>
              </div>
              {p.in_stock && (
                <div className="pd-order">
                  <div className="pd-order-title">Select Options</div>
                  <div className="pd-field">
                    <label>Quantity</label>
                    <div className="qty-row">
                      <button className="qty-btn" onClick={() => setQty(q => Math.max(p.moq, q - 1))}>−</button>
                      <span className="qty-num">{qty}</span>
                      <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                      <span style={{fontSize:11,color:'#8888AA'}}>min {p.moq} pcs</span>
                    </div>
                  </div>
                  {p.sizes && (
                    <div className="pd-field">
                      <label>Size</label>
                      <select value={size} onChange={e => setSize(e.target.value)}>
                        <option value="">Select size</option>
                        {p.sizes.split(',').map(s => <option key={s} value={s.trim()}>{s.trim()}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="pd-field">
                    <label>Color Preference</label>
                    <input placeholder="e.g. Blue, Red, Assorted" value={color} onChange={e => setColor(e.target.value)} />
                  </div>
                </div>
              )}
              {added ? (
                <div className="cart-added">
                  <span style={{fontSize:20}}>✅</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:13}}>Added to Cart!</div>
                    <div style={{fontSize:11,color:'#8888AA'}}>{qty} pcs · ₹{(p.wholesale_price*qty).toLocaleString()}</div>
                  </div>
                </div>
              ) : p.in_stock && (
                <button className="add-cart-btn" onClick={handleAddToCart}>🛒 Add to Cart</button>
              )}
              {added && (
                <Link to="/cart" className="view-cart-btn" onClick={onClose}>
                  View Cart & Send Order on WhatsApp →
                </Link>
              )}
            </>
          ) : (
            <div>
              <div className="pd-price-locked">
                <div className="pd-lock-icon">🔒</div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>Wholesale Price Hidden</div>
                  <div style={{fontSize:12,color:'#8888AA',lineHeight:1.4}}>Register & get approved to see pricing and order</div>
                </div>
              </div>
              <button className="pd-reg-btn" onClick={onRegister}>Register Your Shop to Order →</button>
            </div>
          )}
        </div>
      </div>
    </div>
