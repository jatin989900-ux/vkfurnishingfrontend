const S = [
  '.card{background:#fff;border-radius:14px;overflow:hidden;border:1px solid #EDE9E0;cursor:pointer;transition:all 0.22s;box-shadow:0 1px 6px rgba(28,28,46,0.05);}',
  '.card:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(28,28,46,0.12);border-color:#D8D4CB;}',
  '.card-img{height:190px;background:#F5F2EC;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}',
  '.card-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.3s;}',
  '.card:hover .card-img img{transform:scale(1.04);}',
  '.card-tag{position:absolute;top:10px;left:10px;background:#1C1C2E;color:#C9973A;font-size:9px;font-weight:700;padding:3px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.8px;}',
  '.img-count{position:absolute;bottom:8px;right:8px;background:rgba(28,28,46,0.75);color:#fff;font-size:10px;font-weight:600;padding:3px 8px;border-radius:12px;backdrop-filter:blur(4px);}',
  '.card-body{padding:12px;}',
  '.card-cat{font-size:9px;font-weight:700;color:#C9973A;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:4px;}',
  '.card-name{font-family:"Cormorant Garamond",serif;font-size:16px;font-weight:700;color:#1C1C2E;margin-bottom:8px;line-height:1.3;}',
  '.card-pills{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;}',
  '.pill{background:#F3F0E8;color:#666;font-size:10px;padding:3px 8px;border-radius:4px;font-weight:500;}',
  '.card-price{border-top:1px solid #F0EDE4;padding-top:10px;}',
  '.price-ws{font-size:18px;font-weight:700;color:#1A6B3C;font-family:"Cormorant Garamond",serif;}',
  '.price-mrp{font-size:11px;color:#aaa;text-decoration:line-through;margin-left:4px;}',
  '.price-margin{font-size:10px;color:#fff;background:#1A6B3C;padding:2px 6px;border-radius:4px;font-weight:700;margin-left:4px;}',
  '.price-row{display:flex;align-items:baseline;gap:2px;flex-wrap:wrap;margin-bottom:4px;}',
  '.moq{font-size:10px;color:#aaa;margin-bottom:4px;}',
  '.tap-hint{font-size:11px;color:#C9973A;font-weight:600;}',
  '.price-locked{display:flex;align-items:center;gap:6px;color:#aaa;font-size:12px;margin-bottom:4px;}',
].join('')

export default function ProductCard({ product: p, approved, onClick }) {
  const margin = p.wholesale_price ? Math.round((p.mrp - p.wholesale_price) / p.mrp * 100) : 0
  const images = (p.images && p.images.length > 0) ? p.images : (p.image_url ? [p.image_url] : [])

  return (
    <div className="card" onClick={onClick}>
      <style>{S}</style>
      <div className="card-img">
        {images.length > 0
          ? <img src={images[0]} alt={p.name} loading="lazy" />
          : <span style={{fontSize:52,opacity:0.3}}>🛏</span>
        }
        {p.tag && <div className="card-tag">{p.tag}</div>}
        {images.length > 1 && <div className="img-count">{images.length} photos</div>}
        {!p.in_stock && <div style={{position:'absolute',inset:0,background:'rgba(255,255,255,0.8)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#999',fontSize:13}}>Out of Stock</div>}
      </div>
      <div className="card-body">
        <div className="card-cat">{p.category}</div>
        <div className="card-name">{p.name}</div>
        <div className="card-pills">
          {p.gsm && <span className="pill">{p.gsm}</span>}
          {p.colors > 0 && <span className="pill">{p.colors} colors</span>}
          {p.sizes && p.sizes.split(',').slice(0,2).map(s => <span key={s} className="pill">{s.trim()}</span>)}
        </div>
        <div className="card-price">
          {approved ? (
            <>
              <div className="price-row">
                <span className="price-ws">Rs.{p.wholesale_price}</span>
                <span className="price-mrp">Rs.{p.mrp}</span>
                <span className="price-margin">{margin}%</span>
              </div>
              <div className="moq">Min {p.moq} pcs</div>
              <div className="tap-hint">Tap to view and order</div>
            </>
          ) : (
            <>
              <div className="price-locked">
                <span>🔒</span><span>Register to see price</span>
              </div>
              <div className="tap-hint" style={{color:'#aaa'}}>Tap to view details</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
