import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../cart.js'

const WHATSAPP_NUMBER = '917532002298'

const S = `
.cart-page{max-width:680px;margin:0 auto;padding:28px 16px;}
.cart-hd{display:flex;align-items:center;gap:12px;margin-bottom:24px;}
.cart-title{font-family:'Playfair Display',serif;font-size:26px;}
.cart-count{background:#C9973A;color:#1C1C2E;font-size:11px;font-weight:800;padding:3px 9px;border-radius:20px;}
.empty-cart{text-align:center;padding:60px 20px;}
.empty-icon{font-size:56px;margin-bottom:14px;}
.empty-text{font-size:16px;font-weight:600;color:#3D3D5C;margin-bottom:6px;}
.empty-sub{font-size:13px;color:#8888AA;margin-bottom:24px;}
.btn-gold{background:#C9973A;color:#1C1C2E;border:none;padding:13px 26px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;text-decoration:none;display:inline-block;}
.cart-item{background:#fff;border-radius:14px;border:1px solid #E8E2D8;padding:14px;margin-bottom:10px;display:flex;gap:12px;align-items:flex-start;}
.cart-img{width:70px;height:70px;border-radius:10px;object-fit:cover;background:#F2EDE4;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:24px;overflow:hidden;}
.cart-img img{width:100%;height:100%;object-fit:cover;}
.cart-info{flex:1;min-width:0;}
.cart-name{font-size:14px;font-weight:700;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cart-meta{font-size:11px;color:#8888AA;margin-bottom:8px;}
.cart-price{font-size:13px;font-weight:700;color:#1A6B3C;margin-bottom:8px;}
.qty-row{display:flex;align-items:center;gap:8px;}
.qty-btn{width:28px;height:28px;border-radius:6px;border:1px solid #E8E2D8;background:#FAF8F4;cursor:pointer;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#1C1C2E;}
.qty-num{font-weight:700;font-size:14px;min-width:22px;text-align:center;}
.remove-btn{background:none;border:none;color:#C0392B;font-size:11px;font-weight:600;cursor:pointer;padding:0;margin-left:auto;font-family:'DM Sans',sans-serif;}
.cart-summary{background:#fff;border-radius:14px;border:1px solid #E8E2D8;padding:18px;margin-top:16px;}
.summary-row{display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;}
.summary-row.total{font-weight:700;font-size:16px;border-top:1px solid #E8E2D8;padding-top:12px;margin-top:4px;}
.summary-note{font-size:11px;color:#8888AA;margin-top:10px;line-height:1.5;}
.wa-btn{width:100%;margin-top:14px;padding:16px;background:#25D366;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;}
.wa-btn:hover{background:#1ebe5d;}
.wa-btn svg{width:20px;height:20px;fill:#fff;}
.sent-box{background:#E8F5E9;border:1px solid #C8E6C9;border-radius:12px;padding:16px;text-align:center;margin-top:14px;}
.clear-btn{background:none;border:1px solid #E8E2D8;color:#8888AA;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;margin-top:10px;}
`

export default function Cart({ retailer }) {
  const { items, updateQty, removeItem, clearCart, totalItems, totalValue } = useCart()
  const [sent, setSent] = useState(false)

  function buildWhatsAppMessage() {
    const lines = [
      `🛍️ *New Wholesale Order*`,
      ``,
      `*Retailer Details:*`,
      `• Name: ${retailer?.name || 'N/A'}`,
      `• Shop: ${retailer?.shop_name || 'N/A'}`,
      `• City: ${retailer?.city || 'N/A'}`,
      `• Phone: ${retailer?.phone || 'N/A'}`,
      ``,
      `*Order Items:*`,
    ]
    items.forEach((item, i) => {
      lines.push(`${i+1}. *${item.name}*`)
      lines.push(`   Qty: ${item.qty} pcs${item.size ? ` | Size: ${item.size}` : ''}${item.color ? ` | Color: ${item.color}` : ''}`)
      lines.push(`   Price: ₹${item.wholesale_price}/pc = ₹${(item.wholesale_price * item.qty).toLocaleString()}`)
    })
    lines.push(``)
    lines.push(`*Total Value: ₹${totalValue.toLocaleString()}*`)
    lines.push(``)
    lines.push(`_Please connect with the sales team to confirm and place this order._`)
    return encodeURIComponent(lines.join('\n'))
  }

  function handleWhatsApp() {
    const msg = buildWhatsAppMessage()
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
    setSent(true)
  }

  if (items.length === 0) return (
    <>
      <style>{S}</style>
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <div className="empty-text">Your cart is empty</div>
          <div className="empty-sub">Browse our catalogue and add products to your cart</div>
          <Link to="/catalogue" className="btn-gold">Browse Catalogue →</Link>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{S}</style>
      <div className="cart-page">
        <div className="cart-hd">
          <h2 className="cart-title">Your Cart</h2>
          <span className="cart-count">{totalItems} items</span>
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="cart-item">
            <div className="cart-img">
              {item.image ? <img src={item.image} alt={item.name} /> : '📦'}
            </div>
            <div className="cart-info">
              <div className="cart-name">{item.name}</div>
              <div className="cart-meta">
                {item.category}{item.size ? ` · ${item.size}` : ''}{item.color ? ` · ${item.color}` : ''}
              </div>
              <div className="cart-price">₹{item.wholesale_price}/pc · Total ₹{(item.wholesale_price * item.qty).toLocaleString()}</div>
              <div className="qty-row">
                <button className="qty-btn" onClick={() => {
                  if (item.qty <= item.moq) removeItem(item.id, item.size, item.color)
                  else updateQty(item.id, item.size, item.color, item.qty - 1)
                }}>−</button>
                <span className="qty-num">{item.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)}>+</button>
                <span style={{fontSize:10,color:'#8888AA'}}>min {item.moq}</span>
                <button className="remove-btn" onClick={() => removeItem(item.id, item.size, item.color)}>Remove</button>
              </div>
            </div>
          </div>
        ))}

        <div className="cart-summary">
          <div className="summary-row"><span>{totalItems} items</span><span>₹{totalValue.toLocaleString()}</span></div>
          <div className="summary-row total"><span>Total Value</span><span style={{color:'#1A6B3C'}}>₹{totalValue.toLocaleString()}</span></div>
          <div className="summary-note">
            💡 Tap the button below to send this order to our WhatsApp. Our sales team will contact you to confirm and arrange payment & dispatch.
          </div>
          {!sent ? (
            <button className="wa-btn" onClick={handleWhatsApp}>
              <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Send Order on WhatsApp
            </button>
          ) : (
            <div className="sent-box">
              <div style={{fontSize:32,marginBottom:8}}>✅</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Order Sent on WhatsApp!</div>
              <div style={{fontSize:12,color:'#8888AA',lineHeight:1.5}}>Our sales team will contact you shortly to confirm your order and arrange delivery.</div>
              <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
