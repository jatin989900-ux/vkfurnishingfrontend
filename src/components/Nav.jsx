import { Link } from 'react-router-dom'

const S = `
.nav{background:#1C1C2E;padding:0 20px;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;gap:8px;}
.nav-logo{font-family:'Playfair Display',serif;font-size:19px;color:#fff;text-decoration:none;}
.nav-logo span{color:#C9973A;}
.nav-right{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.nb{border:none;padding:7px 13px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;text-decoration:none;display:inline-block;}
.nb-gold{background:#C9973A;color:#1C1C2E;}
.nb-ghost{background:transparent;color:#aaa;border:1px solid #444;}
.nb-ghost:hover{border-color:#C9973A;color:#C9973A;}
.nav-badge{background:rgba(201,151,58,0.2);color:#C9973A;font-size:10px;font-weight:700;padding:3px 9px;border-radius:10px;white-space:nowrap;max-width:150px;overflow:hidden;text-overflow:ellipsis;}
`

export default function Nav({ retailer, onLogout }) {
  return (
    <>
      <style>{S}</style>
      <nav className="nav">
        <Link to="/" className="nav-logo">VK <span>Furnishing</span></Link>
        <div className="nav-right">
          {retailer ? (
            <>
              <span className="nav-badge">✓ {retailer.shop_name}</span>
              <Link to="/catalogue" className="nb nb-gold">Catalogue</Link>
              <button className="nb nb-ghost" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/catalogue" className="nb nb-ghost">Browse</Link>
              <Link to="/" className="nb nb-gold">Register</Link>
              <Link to="/admin" className="nb nb-ghost">Admin</Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}
