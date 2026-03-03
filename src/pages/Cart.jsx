import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../cart.jsx'

const S = [
  '.cart-page{max-width:680px;margin:0 auto;padding:24px 16px 48px;}',
  '.cart-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}',
  '.cart-hd h2{font-size:22px;font-weight:700;}',
  '.empty-cart{text-align:center;padding:60px 20px;}',
  '.cart-item{background:#fff;border:1px solid #E8E2D8;border-radius:14px;padding:14px;margin-bottom:10px;display:flex;gap:12px;align-items:flex-start;}',
  '.ci-img{width:64px;height:64px;border-radius:8px;object-fit:cover;background:#F2EDE4;flex-shrink:0;}',
  '.ci-info{flex:1;}',
  '.ci-name{font-weight:700;font-size:14px;margin-bottom:2px;}',
  '.ci-meta{font-size:11px;color:#8888AA;margin-bottom:6px;}',
  '.ci-price{font-size:15px;font-weight:700;color:#1A6B3C;}',
  '.qty-row{display:flex;align-items:center;gap:8px;margin-top:6px;}',
  '.qty-btn{width:28px;height:28px;border-radius:6px;border:1.5px solid #E8E2D8;background:#fff;cursor:pointer;font-size:16px;font-weight:700;display:flex;align-items:center;justify-content:center;}',
  '.qty-num{font-weight:700;font-size:15px;min-width:24px;text-align:center;}',
  '.remove-btn{background:none;border:none;color:#C0392B;font-size:11px;cursor:pointer;margin-left:auto;}',
  '.cart-summary{background:#FAF8F4;border:1px solid #E8E2D8;border-radius:14px;padding:16px;margin-top:16px;}',
  '.summary-row{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;}',
  '.summary-total{display:flex;justify-content:space-between;font-size:17px;font-weight:700;padding-top:10px;border-top:1px solid #E8E2D8;margin-top:6px;}',
  '.wa-btn{width:100%;padding:16px;background:#1A6B3C;color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;margin-top:14px;display:flex;align-items:center;justify-content:center;gap:8px;}',
  '.wa-btn:hover{background:#155d33;}',
  '.clear-btn{width:100%;padding:11px;background:#fff;color:#C0392B;border:1px solid #C0392B;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;margin-top:8px;}',
  '.back-link{display:inline-flex;align-items:center;gap:6px;color:#8888AA;font-size:13px;text-decoration:none;margin-bottom:16px;}',
  '.sent-box{text-align:center;padding:40px 20px;}',
].join('')

export default function Cart({ retailer }) {
  const { items, updateQty, removeItem, clearCart, totalValue } = useCart()
  const [sent, setSent] = useState(false)

  function sendWhatsApp() {
    if (items.length === 0) return
    const lines = items.map(item =>
      item.product.name +
      ' x' + item.quantity + ' pcs' +
      (item.size ? ' (' + item.size + ')' : '') +
      (item.color ? ' - ' + item.color : '') +
      ' = Rs.' + (item.product.wholesale_price * item.quantity).toLocaleString()
    )
    const msg = [
      'Hello VK Furnishing,',
      '',
      'I would like to place a wholesale order:',
      '',
      ...lines,
      '',
      'Total: Rs.' + totalValue.toLocaleString(),
      '',
      'Shop: ' + (retailer?.shop_name || ''),
      'Name: ' + (retailer?.name || ''),
      'City: ' + (retailer?.city || ''),
      'Phone: ' + (retailer?.phone || ''),
      '',
      'Please confirm availability and delivery details.',
    ].join('\n')
    window.open('https://wa.me/917532002298?text=' + encodeURIComponent(msg), '_blank')
    setSent(true)
  }

  if (sent) return (
    <>
      <style>{S}</style>
      <div className="cart-page">
        <div className="sent-box">
          <div style={{fontSize:56,marginBottom:12}}>✅</div>
          <h2 style={{fontSize:22,marginBottom:8}}>Order Sent on WhatsApp!</h2>
          <p style={{color:'#8888AA',fontSize:13,lineHeight:1.6,marginBottom:20}}>
            Our team will confirm your order shortly. You can continue browsing or clear your cart.
          </p>
          <button className="clear-btn" onClick={() => { clearCart(); setSent(false) }}>Clear Cart</button>
          <div style={{marginTop:12}}>
            <Link to="/catalogue" style={{color:'#C9973A',fontWeight:600,fontSize:13,textDecoration:'none'}}>
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    </>
  )

  if (items.length === 0) return (
    <>
      <style>{S}</style>
      <div className="cart-page">
        <Link to="/catalogue" className="back-link">Back to Catalogue</Link>
        <div className="empty-cart">
          <div style={{fontSize:56,marginBottom:12}}>🛒</div>
          <h2 style={{fontSize:20,marginBottom:8}}>Your cart is empty</h2>
          <p style={{color:'#8888AA',fontSize:13,marginBottom:20}}>Browse the catalogue and add products to order</p>
          <Link to="/catalogue" style={{background:'#1C1C2E',color:'#fff',padding:'12px 24px',borderRadius:8,fontWeight:700,fontSize:14,textDecoration:'none'}}>
            Browse Catalogue
          </Link>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{S}</style>
      <div className="cart-page">
        <Link to="/catalogue" className="back-link">Back to Catalogue</Link>
        <div className="cart-hd">
          <h2>Your Order Cart</h2>
          <span style={{fontSize:13,color:'#8888AA'}}>{items.length} item{items.length > 1 ? 's' : ''}</span>
        </div>

        {items.map((item, i) => (
          <div key={i} className="cart-item">
            {item.product.images && item.product.images[0]
              ? <img src={item.product.images[0]} alt={item.product.name} className="ci-img" />
              : <div className="ci-img" style={{display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>IMG</div>
            }
            <div className="ci-info">
              <div className="ci-name">{item.product.name}</div>
              <div className="ci-meta">
                {item.size && 'Size: ' + item.size}
                {item.size && item.color && ' · '}
                {item.color && 'Color: ' + item.color}
              </div>
              <div className="ci-price">Rs.{(item.product.wholesale_price * item.quantity).toLocaleString()}</div>
              <div className="qty-row">
                <button className="qty-btn" onClick={() => updateQty(i, item.quantity - 1)}>-</button>
                <span className="qty-num">{item.quantity}</span>
                <button className="qty-btn" onClick={() => updateQty(i, item.quantity + 1)}>+</button>
                <span style={{fontSize:11,color:'#8888AA'}}>pcs</span>
                <button className="remove-btn" onClick={() => removeItem(i)}>Remove</button>
              </div>
            </div>
          </div>
        ))}

        <div className="cart-summary">
          <div className="summary-row"><span>Items</span><span>{items.reduce((a,i) => a + i.quantity, 0)} pcs</span></div>
          <div className="summary-row"><span>Products</span><span>{items.length} types</span></div>
          <div className="summary-total">
            <span>Total Amount</span>
            <span style={{color:'#1A6B3C'}}>Rs.{totalValue.toLocaleString()}</span>
          </div>
        </div>

        <button className="wa-btn" onClick={sendWhatsApp}>
          Send Order on WhatsApp
        </button>
        <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
      </div>
    </>
  )
}
