const S = [
  '.card{background:#fff;border-radius:14px;overflow:hidden;border:1px solid #E8E2D8;cursor:pointer;transition:all 0.2s;}',
  '.card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(28,28,46,0.12);}',
  '.card-img{height:190px;background:#F2EDE4;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}',
  '.card-img img{width:100%;height:100%;object-fit:cover;}',
  '.card-tag{position:absolute;top:8px;left:8px;background:#1C1C2E;color:#C9973A;font-size:9px;font-weight:700;padding:3px 7px;border-radius:4px;text-transform:uppercase;}',
  '.card-body{padding:13px;}',
  '.card-cat{font-size:10px;color:#8888AA;font-weight:600;text-transform:uppercase;margin-bottom:3px;}',
  '.card-name{font-size:14px;font-weight:700;margin-bottom:7px;line-height:1.3;}',
  '.card-pills{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;}',
  '.pill{background:#F2EDE4;color:#3D3D5C;font-size:10px;padding:2px 7px;border-radius:3px;}',
  '.card-price{border-top:1px solid #E8E2D8;padding-top:10px;}',
  '.price-locked{display:flex;align-items:center;gap:7px;color:#8888AA;font-size:12px;}',
  '.price-ws{font-size:19px;font-weight:700;color:#1A6B3C;}',
  '.price-mrp{font-size:11px;color:#8888AA;text-decoration:line-through;margin-left:4px;}',
  '.price-margin{font-size:10px;font-weight:700;color:#1A6B3C;background:rgba(26,107,60,0.1);padding:2px 6px;border-radius:3px;margin-left:4px;}',
  '.moq{font-size:11px;color:#8888AA;margin-top:2px;}',
  '.tap-hint{font-size:10px;color:#C9973A;margin-top:5px;font-weight:600;}',
  '.img-count{position:absolute;bottom:7px;right:7px;background:rgba(0,0,0,0.5);color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;}',
].join('')

export default function ProductCard({ product: p, approved, onClick }) {
  const margin = p.wholesale_price ? Math.round(((p.mrp - p.wholesale_price) / p.mrp) * 100) : 0
  const images = (p.images && p.images.length > 0) ? p.images : (p.image_url ? [p.image_url] : [])
  return (
    <div className="card" onClick={onClick}>
      <style>{S}</style>
      <div className="card-img">
        {images.length > 0
          ? <img src={images[0]} alt={p.name} loading="lazy" />
          : <span style={{fontSize:52,opacity:0.3}}>IMG</span>
        }
        {p.tag && <div className="card-tag">{p.tag}</div>}
        {images.length > 1 && <div className="img-count">{images.length} photos</div>}
        {!p.in_stock && <div style={{position:'absolute',inset:0,background:'rgba(255,255,255,0.75)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,color:'#C0392B'}}>Out of Stock</div>}
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
              <div>
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
              <div className="tap-hint">Tap to view details</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
