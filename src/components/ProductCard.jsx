const S = `
.card{background:#fff;border-radius:14px;overflow:hidden;border:1px solid #E8E2D8;transition:all 0.25s;position:relative;}
.card:hover{transform:translateY(-3px);box-shadow:0 12px 48px rgba(28,28,46,0.16);border-color:rgba(201,151,58,0.4);}
.card-img{height:200px;background:linear-gradient(135deg,#F2EDE4,#FAF8F4);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.card-img img{width:100%;height:100%;object-fit:cover;}
.card-img-placeholder{font-size:64px;}
.card-tag-badge{position:absolute;top:10px;left:10px;background:#1C1C2E;color:#C9973A;font-size:9px;font-weight:700;padding:3px 8px;border-radius:4px;letter-spacing:0.5px;text-transform:uppercase;z-index:2;}
.oos-overlay{position:absolute;inset:0;background:rgba(255,255,255,0.8);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#C0392B;z-index:2;}
.video-btn{position:absolute;bottom:10px;right:10px;background:rgba(28,28,46,0.85);color:#fff;border:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;z-index:2;font-family:'DM Sans',sans-serif;}
.card-body{padding:14px;}
.card-cat{font-size:10px;color:#8888AA;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;}
.card-name{font-size:15px;font-weight:700;margin-bottom:8px;line-height:1.3;}
.card-meta{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;}
.pill{background:#F2EDE4;color:#3D3D5C;font-size:10px;padding:2px 7px;border-radius:3px;font-weight:500;}
.card-price{border-top:1px solid #E8E2D8;padding-top:11px;}
.price-locked{display:flex;align-items:center;gap:7px;color:#8888AA;font-size:12px;}
.lock-box{width:26px;height:26px;background:#F2EDE4;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:13px;}
.price-row{display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;}
.price-ws{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#1A6B3C;}
.price-mrp{font-size:12px;color:#8888AA;text-decoration:line-through;}
.price-margin{font-size:10px;font-weight:700;color:#1A6B3C;background:rgba(26,107,60,0.1);padding:2px 6px;border-radius:3px;}
.moq{font-size:11px;color:#8888AA;margin-top:3px;}
.enq-btn{width:100%;margin-top:10px;padding:9px;background:#1C1C2E;color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;}
.enq-btn:hover{background:#C9973A;color:#1C1C2E;}
.reg-btn{width:100%;margin-top:10px;padding:9px;background:transparent;color:#1C1C2E;border:1.5px solid #E8E2D8;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;}
`

const EM = {'Bedsheets':'🛏️','Dohars':'🌸','Comforters':'❄️','Blankets':'🧣','Towels':'🚿','Quilts':'🌙','Bathrobes':'👘','Bedcovers':'🎨','Top Sheets':'✨','Other':'📦'}

export default function ProductCard({ product: p, approved, onEnquire, onRegister }) {
  const margin = p.wholesale_price ? Math.round(((p.mrp - p.wholesale_price) / p.mrp) * 100) : 0
  return (
    <div className="card">
      <style>{S}</style>
      <div className="card-img">
        {p.image_url
          ? <img src={p.image_url} alt={p.name} loading="lazy" />
          : <span className="card-img-placeholder">{EM[p.category] || '📦'}</span>
        }
        {p.tag && <div className="card-tag-badge">{p.tag}</div>}
        {!p.in_stock && <div className="oos-overlay">Out of Stock</div>}
        {p.video_url && (
          <button className="video-btn" onClick={e => { e.stopPropagation(); window.open(p.video_url, '_blank') }}>
            ▶ Watch Video
          </button>
        )}
      </div>
      <div className="card-body">
        <div className="card-cat">{p.category}</div>
        <div className="card-name">{p.name}</div>
        <div className="card-meta">
          {p.gsm && <span className="pill">{p.gsm}</span>}
          {p.colors > 0 && <span className="pill">{p.colors} colors</span>}
          {p.sizes && p.sizes.split(',').slice(0, 2).map(s => <span key={s} className="pill">{s.trim()}</span>)}
        </div>
        <div className="card-price">
          {approved ? (
            <>
              <div className="price-row">
                <span className="price-ws">₹{p.wholesale_price}</span>
                <span className="price-mrp">₹{p.mrp}</span>
                <span className="price-margin">{margin}% margin</span>
              </div>
              <div className="moq">Min. order: {p.moq} pieces</div>
              {p.in_stock && <button className="enq-btn" onClick={() => onEnquire(p)}>Place Order</button>}
            </>
          ) : (
            <>
              <div className="price-locked">
                <div className="lock-box">🔒</div>
                <span>Register to see wholesale price</span>
              </div>
              <button className="reg-btn" onClick={onRegister}>Register Your Shop →</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
