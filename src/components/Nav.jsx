import { Link } from 'react-router-dom'
import { useCart } from '../cart.jsx'

const S = [
  '.nav{background:#1C1C2E;padding:0 20px;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;gap:8px;}',
  '.nav-logo{font-size:19px;color:#fff;text-decoration:none;font-weight:700;}',
  '.nav-logo span{color:#C9973A;}',
  '.nav-right{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}',
  '.nb{border:none;padding:7px 13px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;text-decoration:none;display:inline-block;}',
  '.nb-gold{background:#C9973A;color:#1C1C2E;}',
  '.nb-ghost{background:transparent;color:#aaa;border:1px solid #444;}',
  '.nav-badge{background:rgba(201,151,58,0.2);color:#C9973A;font-size:10px;font-weight:700;padding:3px 9px;border-radius:10px;white-space:nowrap;max-width:150px;overflow:hidden;text-overflow:ellipsis;}',
  '.cart-btn{position:relative;background:transparent;color:#fff;border:1px solid #444;padding:7px 13px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:5px;}',
  '.cart-dot{position:absolute;top:-5px;right:-5px;width:18px;height:18px;background:#C9973A;color:#1C1C2E;font-size:9px;font-weight:800;border-radius:50%;display:flex;align-items:center;justify-content:center;}',
].join('')

export default function Nav({ retailer, onLogin, onRegister, onLogout }) {
  const { totalItems } = useCart()

  return (
    <>
      <style>{S}</style>
      <nav className="nav">
        <Link to="/" className="nav-logo">VK <span>Furnishing</span></Link>
        <div className="nav-right">
          {retailer ? (
            <>
              <span className="nav-badge">✓ {retailer.shop_name}</span>
              <Link to="/catalogue" className="nb nb-ghost">Catalogue</Link>
              <Link to="/cart" className="cart-btn">
                Cart
                {totalItems > 0 && <span className="cart-dot">{totalItems}</span>}
              </Link>
              <button className="nb nb-ghost" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/catalogue" className="nb nb-ghost">Browse</Link>
              <button className="nb nb-ghost" onClick={onLogin}>Login</button>
              <button className="nb nb-gold" onClick={onRegister}>Register</button>
              <Link to="/admin" className="nb nb-ghost">Admin</Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}
