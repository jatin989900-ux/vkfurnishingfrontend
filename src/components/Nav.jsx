import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../cart.jsx'

const S = [
  '.nav{background:#1C1C2E;padding:0 16px;display:flex;align-items:center;justify-content:space-between;height:56px;position:sticky;top:0;z-index:100;}',
  '.nav-logo{color:#C9973A;font-size:17px;font-weight:700;text-decoration:none;letter-spacing:0.5px;}',
  '.nav-links{display:flex;align-items:center;gap:6px;}',
  '.nav-link{color:#9999BB;font-size:12px;font-weight:600;text-decoration:none;padding:6px 10px;border-radius:6px;}',
  '.nav-link.active{color:#fff;}',
  '.nav-btn{border:none;padding:7px 13px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;}',
  '.nav-btn.gold{background:#C9973A;color:#1C1C2E;}',
  '.nav-btn.ghost{background:transparent;color:#9999BB;border:1px solid rgba(255,255,255,0.15);}',
  '.nav-btn.green{background:#1A6B3C;color:#fff;}',
  '.cart-badge{position:relative;display:inline-flex;}',
  '.badge{position:absolute;top:-6px;right:-6px;background:#C9973A;color:#1C1C2E;font-size:9px;font-weight:700;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;}',
].join('')

export default function Nav({ retailer, onLogin, onLogout, onRegister }) {
  const { totalItems } = useCart()
  const loc = useLocation()

  return (
    <>
      <style>{S}</style>
      <nav className="nav">
        <Link to="/" className="nav-logo">VK Furnishing</Link>
        <div className="nav-links">
          <Link to="/" className={'nav-link' + (loc.pathname === '/' ? ' active' : '')}>Home</Link>
          <Link to="/catalogue" className={'nav-link' + (loc.pathname === '/catalogue' ? ' active' : '')}>Catalogue</Link>
          {retailer ? (
            <>
              {retailer.status === 'approved' && (
                <Link to="/cart" className="cart-badge">
                  <button className="nav-btn ghost">Cart</button>
                  {totalItems > 0 && <span className="badge">{totalItems}</span>}
                </Link>
              )}
              <button className="nav-btn ghost" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="nav-btn ghost" onClick={onLogin}>Login</button>
              <button className="nav-btn gold" onClick={onRegister}>Register</button>
            </>
          )}
          <Link to="/admin" className={'nav-link' + (loc.pathname === '/admin' ? ' active' : '')}>Admin</Link>
        </div>
      </nav>
    </>
  )
}// POST add product
router.post('/', auth, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const b = req.body
    let imageUrls = []
    let videoUrl = null

    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const url = await uploadFile(file, 'products')
        imageUrls.push(url)
      }
    }

    if (req.files && req.files.video && req.files.video[0]) {
      videoUrl = await uploadFile(req.files.video[0], 'videos')
    }

    const { data, error } = await supabase.from('products').insert([{
      name: b.name,
      category: b.category,
      gsm: b.gsm || null,
      sizes: b.sizes || null,
      colors: b.colors ? Number(b.colors) : null,
      moq: Number(b.moq),
      wholesale_price: Number(b.wholesale_price),
      mrp: Number(b.mrp),
      tag: b.tag || null,
      in_stock: b.in_stock === 'true' || b.in_stock === true,
      images: imageUrls,
      image_url: imageUrls[0] || null,
      video_url: b.video_url || null,
      video_file_url: videoUrl
    }]).select()
    if (error) throw error
    res.json({ product: data[0] })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})// PUT update product
router.put('/:id', auth, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const b = req.body
    const updates = {}

    if (b.name) updates.name = b.name
    if (b.category) updates.category = b.category
    if (b.gsm !== undefined) updates.gsm = b.gsm
    if (b.sizes !== undefined) updates.sizes = b.sizes
    if (b.colors !== undefined) updates.colors = b.colors ? Number(b.colors) : null
    if (b.moq !== undefined) updates.moq = Number(b.moq)
    if (b.wholesale_price !== undefined) updates.wholesale_price = Number(b.wholesale_price)
    if (b.mrp !== undefined) updates.mrp = Number(b.mrp)
    if (b.tag !== undefined) updates.tag = b.tag
    if (b.in_stock !== undefined) updates.in_stock = b.in_stock === 'true' || b.in_stock === true
    if (b.video_url !== undefined) updates.video_url = b.video_url

    let imageUrls = []
    try {
      const existing = b.existing_images ? JSON.parse(b.existing_images) : []
      imageUrls = existing
    } catch (e) { imageUrls = [] }

    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const url = await uploadFile(file, 'products')
        imageUrls.push(url)
      }
    }

    if (imageUrls.length > 0) {
      updates.images = imageUrls
      updates.image_url = imageUrls[0]
    }

    if (req.files && req.files.video && req.files.video[0]) {
      updates.video_file_url = await uploadFile(req.files.video[0], 'videos')
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', req.params.id)
      .select()
    if (error) throw error
    res.json({ product: data[0] })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// DELETE product
router.delete('/:id', auth, async (req, res) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id)
    if (error) throw error
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
