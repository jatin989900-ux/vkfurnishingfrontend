import { useState, useEffect, useRef } from 'react'
import { login, getRetailers, approveRetailer, rejectRetailer, getProducts, addProduct, updateProduct, deleteProduct, getOrders, updateOrderStatus } from '../api.js'

const S = `
.admin-page{max-width:980px;margin:0 auto;padding:28px 16px;}
.admin-login{max-width:340px;margin:60px auto;background:#fff;border-radius:16px;padding:28px;box-shadow:0 12px 48px rgba(28,28,46,0.16);}
.admin-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:10px;}
.tabs{display:flex;border-bottom:2px solid #E8E2D8;margin-bottom:22px;}
.tab{padding:9px 18px;font-size:13px;font-weight:600;color:#8888AA;cursor:pointer;border:none;border-bottom:2px solid transparent;margin-bottom:-2px;background:none;font-family:'DM Sans',sans-serif;}
.tab.active{color:#1C1C2E;border-bottom-color:#C9973A;}
.tc{background:#C9973A;color:#1C1C2E;font-size:9px;font-weight:700;padding:1px 5px;border-radius:9px;margin-left:4px;}
.fg{margin-bottom:13px;}
.fg label{display:block;font-size:11px;font-weight:600;color:#8888AA;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px;}
.fg input,.fg select{width:100%;padding:10px 12px;border:1.5px solid #E8E2D8;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;color:#1C1C2E;background:#fff;outline:none;}
.fg input:focus{border-color:#C9973A;}
.r2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.r3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}
.sub-btn{width:100%;padding:12px;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;margin-top:6px;color:#fff;background:#1C1C2E;}
.sub-btn.gold{background:#C9973A;color:#1C1C2E;}
.sub-btn.green{background:#1A6B3C;}
.sub-btn.red{background:#C0392B;}
.sub-btn:disabled{opacity:0.5;cursor:not-allowed;}
.alert{padding:9px 12px;border-radius:7px;font-size:12px;font-weight:500;margin-bottom:12px;}
.alert-err{background:#FEE;color:#C0392B;border:1px solid #FCC;}
.alert-ok{background:#E8F5E9;color:#1A6B3C;border:1px solid #C8E6C9;}
.nb{border:none;padding:7px 13px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;}
.nb-ghost{background:transparent;color:#888;border:1px solid #ddd;}
.ret-table{background:#fff;border-radius:14px;border:1px solid #E8E2D8;overflow:hidden;}
.ret-head{display:grid;grid-template-columns:2fr 1.5fr 1fr auto;gap:10px;padding:11px 16px;background:#1C1C2E;color:#fff;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;}
.ret-row{display:grid;grid-template-columns:2fr 1.5fr 1fr auto;gap:10px;padding:13px 16px;border-bottom:1px solid #E8E2D8;align-items:center;}
.ret-row:last-child{border-bottom:none;}
.ret-row:hover{background:#FAF8F4;}
.act-btns{display:flex;gap:4px;}
.ab{border:none;padding:5px 9px;border-radius:5px;font-size:10px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;}
.ab.approve{background:#1A6B3C;color:#fff;}
.ab.reject{background:#C0392B;color:#fff;}
.pm-header{padding:14px 18px;border-bottom:1px solid #E8E2D8;display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:14px 14px 0 0;border:1px solid #E8E2D8;}
.pm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;padding:14px;background:#fff;border-radius:0 0 14px 14px;border:1px solid #E8E2D8;border-top:none;}
.pm-card{background:#FAF8F4;border-radius:10px;padding:12px;border:1px solid #E8E2D8;position:relative;}
.pm-img{width:100%;height:100px;object-fit:cover;border-radius:7px;margin-bottom:8px;}
.pm-emoji{font-size:28px;margin-bottom:6px;display:block;}
.pm-name{font-size:12px;font-weight:700;margin-bottom:2px;}
.pm-cat{font-size:10px;color:#8888AA;margin-bottom:5px;}
.pm-pr{display:flex;justify-content:space-between;margin-bottom:6px;}
.pm-ws{font-size:13px;font-weight:700;color:#1A6B3C;}
.pm-mrp{font-size:10px;color:#8888AA;text-decoration:line-through;}
.pm-acts{display:flex;gap:4px;}
.pm-btn{flex:1;padding:5px 4px;border-radius:5px;border:none;font-size:10px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;}
.pm-btn.edit{background:#1A56A0;color:#fff;}
.pm-btn.del{background:#C0392B;color:#fff;}
.pm-btn.tog{background:#3D3D5C;color:#fff;}
.pm-oos{position:absolute;top:7px;right:7px;background:#C0392B;color:#fff;font-size:8px;font-weight:700;padding:2px 5px;border-radius:3px;}
.pm-ins{position:absolute;top:7px;right:7px;background:#1A6B3C;color:#fff;font-size:8px;font-weight:700;padding:2px 5px;border-radius:3px;}
.order-card{background:#fff;border-radius:12px;border:1px solid #E8E2D8;padding:16px;margin-bottom:10px;}
.order-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;flex-wrap:wrap;gap:6px;}
.order-id{font-weight:700;font-size:14px;}
.order-shop{font-size:12px;color:#8888AA;}
.order-items{background:#F2EDE4;border-radius:8px;padding:10px;margin-bottom:10px;font-size:12px;}
.order-item-row{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #E8E2D8;}
.order-item-row:last-child{border-bottom:none;}
.order-actions{display:flex;gap:6px;flex-wrap:wrap;}
.oa-btn{padding:6px 12px;border-radius:6px;border:none;font-size:11px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;}
.oa-btn.confirm{background:#1A56A0;color:#fff;}
.oa-btn.dispatch{background:#1A6B3C;color:#fff;}
.oa-btn.cancel{background:#C0392B;color:#fff;}
.img-upload-area{border:2px dashed #E8E2D8;border-radius:10px;padding:20px;text-align:center;cursor:pointer;margin-bottom:4px;}
.img-upload-area:hover{border-color:#C9973A;}
.img-preview{width:100%;height:120px;object-fit:cover;border-radius:8px;margin-top:8px;}
.overlay{position:fixed;inset:0;background:rgba(28,28,46,0.7);backdrop-filter:blur(5px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;}
.modal{background:#fff;border-radius:18px;padding:28px;max-width:580px;width:100%;position:relative;max-height:92vh;overflow-y:auto;animation:fadeIn 0.3s ease;}
.mx{position:sticky;top:-28px;float:right;background:#F2EDE4;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:13px;margin:-4px -4px 8px 0;z-index:10;}
.empty{text-align:center;padding:40px;color:#8888AA;}
@media(max-width:500px){.ret-head,.ret-row{grid-template-columns:1fr 1fr;}.r2,.r3{grid-template-columns:1fr;}}
`

const CATS = ['Bedsheets','Dohars','Comforters','Blankets','Towels','Quilts','Bathrobes','Bedcovers','Top Sheets','Other']
const TAGS = ['','Bestseller','New','Premium','Signature','Gifting','Kids','Sale']
const BLANK = { name:'',category:'Bedsheets',gsm:'',sizes:'',colors:'',moq:'',wholesale_price:'',mrp:'',tag:'',in_stock:true,video_url:'' }
const CAT_EMOJI = {'Bedsheets':'🛏️','Dohars':'🌸','Comforters':'❄️','Blankets':'🧣','Towels':'🚿','Quilts':'🌙','Bathrobes':'👘','Bedcovers':'🎨','Top Sheets':'✨','Other':'📦'}
const ORDER_STATUSES = ['new','confirmed','dispatched','cancelled']
const STATUS_COLORS = {new:'#B7791F',confirmed:'#1A56A0',dispatched:'#1A6B3C',cancelled:'#C0392B'}
const STATUS_BG = {new:'#FFF8E7',confirmed:'#EAF2FB',dispatched:'#E8F5E9',cancelled:'#FEE'}
export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('vk_admin_token'))
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('retailers')
  const [rTab, setRTab] = useState('pending')
  const [retailers, setRetailers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [orderTab, setOrderTab] = useState('new')
  const [productModal, setProductModal] = useState(null)
  const [editId, setEditId] = useState(null)
  const [pForm, setPForm] = useState(BLANK)
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const fileRef = useRef()

  useEffect(() => { if (authed) fetchAll() }, [authed])

  async function fetchAll() {
    try {
      const [r,p,o] = await Promise.all([getRetailers(), getProducts(), getOrders()])
      setRetailers(r.retailers || [])
      setProducts(p.products || [])
      setOrders(o.orders || [])
    } catch(e) { console.error(e) }
  }

  async function handleLogin() {
    setErr(''); setLoading(true)
    try { const res = await login(user, pass); localStorage.setItem('vk_admin_token', res.token); setAuthed(true) }
    catch(e) { setErr(e.message) }
    setLoading(false)
  }

  function logout() { localStorage.removeItem('vk_admin_token'); setAuthed(false) }
  async function handleApprove(id) { try { await approveRetailer(id); fetchAll() } catch(e) { setErr(e.message) } }
  async function handleReject(id) { try { await rejectRetailer(id); fetchAll() } catch(e) { setErr(e.message) } }

  function openAdd() { setEditId(null); setPForm(BLANK); setImgFile(null); setImgPreview(''); setErr(''); setOk(''); setProductModal(true) }
  function openEdit(p) {
    setEditId(p.id)
    setPForm({ name:p.name, category:p.category, gsm:p.gsm||'', sizes:p.sizes||'', colors:String(p.colors||''), moq:String(p.moq||''), wholesale_price:String(p.wholesale_price||''), mrp:String(p.mrp||''), tag:p.tag||'', in_stock:p.in_stock, video_url:p.video_url||'' })
    setImgFile(null); setImgPreview(p.image_url||''); setErr(''); setOk(''); setProductModal(true)
  }

  function handleImg(e) { const f=e.target.files[0]; if(!f) return; setImgFile(f); setImgPreview(URL.createObjectURL(f)) }

  async function saveProduct() {
    if (!pForm.name) { setErr('Product name required'); return }
    if (!pForm.wholesale_price||!pForm.mrp||!pForm.moq) { setErr('Price, MRP and MOQ required'); return }
    if (Number(pForm.wholesale_price) >= Number(pForm.mrp)) { setErr('Wholesale price must be less than MRP'); return }
    setErr(''); setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(pForm).forEach(([k,v]) => fd.append(k,v))
      if (imgFile) fd.append('image', imgFile)
      if (editId) { await updateProduct(editId, fd); setOk('Product updated!') }
      else { await addProduct(fd); setOk('Product added!') }
      fetchAll()
      setTimeout(() => { setProductModal(null); setOk('') }, 1000)
    } catch(e) { setErr(e.message) }
    setLoading(false)
  }

  async function handleDelete(id) { setLoading(true); try { await deleteProduct(id); fetchAll(); setDeleteId(null) } catch(e) { setErr(e.message) } setLoading(false) }
  async function handleOrderStatus(id, status) { try { await updateOrderStatus(id, status); fetchAll() } catch(e) { setErr(e.message) } }
  async function toggleStock(p) { const fd=new FormData(); fd.append('in_stock',!p.in_stock); try { await updateProduct(p.id,fd); fetchAll() } catch(e) {} }

  const pendingCount = retailers.filter(r => r.status==='pending').length
  const newOrders = orders.filter(o => o.status==='new').length
  const pf = pForm
  const setPf = (k,v) => setPForm(p => ({...p,[k]:v}))
  const margin = pf.wholesale_price&&pf.mrp&&Number(pf.wholesale_price)<Number(pf.mrp) ? Math.round(((pf.mrp-pf.wholesale_price)/pf.mrp)*100) : null

  if (!authed) return (
    <><style>{S}</style>
    <div className="admin-page">
      <div className="admin-login">
        <h2 style={{fontFamily:"'Playfair Display',serif",marginBottom:6}}>Admin Login</h2>
        <p style={{color:'#8888AA',fontSize:13,marginBottom:18}}>VK Furnishing Admin Panel</p>
        {err && <div className="alert alert-err">{err}</div>}
        <div className="fg"><label>Username</label><input placeholder="vkadmin" value={user} onChange={e=>setUser(e.target.value)}/></div>
        <div className="fg"><label>Password</label><input type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}/></div>
        <button className="sub-btn" onClick={handleLogin} disabled={loading}>{loading?'Logging in...':'Login →'}</button>
      </div>
    </div></>
  )

  return (
    <><style>{S}</style>
    <div className="admin-page">
      <div className="admin-hd">
        <div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24}}>Admin Panel</h2><p style={{color:'#8888AA',fontSize:12}}>All changes save to database automatically</p></div>
        <button className="nb nb-ghost" onClick={logout}>Logout</button>
      </div>
      {err && <div className="alert alert-err">{err}</div>}
      <div className="tabs">
        <button className={`tab ${tab==='retailers'?'active':''}`} onClick={()=>setTab('retailers')}>Retailers {pendingCount>0&&<span className="tc">{pendingCount}</span>}</button>
        <button className={`tab ${tab==='products'?'active':''}`} onClick={()=>setTab('products')}>Products <span className="tc">{products.length}</span></button>
        <button className={`tab ${tab==='orders'?'active':''}`} onClick={()=>setTab('orders')}>Orders {newOrders>0&&<span className="tc">{newOrders}</span>}</button>
      </div>

      {tab==='retailers'&&<>
        <div className="tabs" style={{marginBottom:14}}>
          {['pending','approved','rejected'].map(t=><button key={t} className={`tab ${rTab===t?'active':''}`} onClick={()=>setRTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)} ({retailers.filter(r=>r.status===t).length})</button>)}
        </div>
        <div className="ret-table">
          <div className="ret-head"><span>Shop / Owner</span><span>City · Phone</span><span>Date</span><span>Action</span></div>
          {retailers.filter(r=>r.status===rTab).length===0
            ? <div className="empty"><div style={{fontSize:36,marginBottom:10}}>✅</div><p>No {rTab} requests</p></div>
            : retailers.filter(r=>r.status===rTab).map(r=>(
              <div key={r.id} className="ret-row">
                <div><div style={{fontWeight:700,fontSize:13}}>{r.shop_name}</div><div style={{fontSize:11,color:'#8888AA'}}>{r.name} · {r.gst||'No GST'}</div></div>
                <div><div style={{fontSize:12}}>{r.city}</div><div style={{fontSize:11,color:'#8888AA'}}>{r.phone}</div></div>
                <div style={{fontSize:11,color:'#8888AA'}}>{new Date(r.created_at).toLocaleDateString('en-IN')}</div>
                <div className="act-btns">
                  {r.status==='pending'&&<><button className="ab approve" onClick={()=>handleApprove(r.id)}>✓</button><button className="ab reject" onClick={()=>handleReject(r.id)}>✗</button></>}
                  {r.status!=='pending'&&<span style={{padding:'3px 8px',borderRadius:20,fontSize:10,fontWeight:700,background:r.status==='approved'?'#E8F5E9':'#FEE',color:r.status==='approved'?'#1A6B3C':'#C0392B'}}>{r.status}</span>}
                </div>
              </div>
            ))
          }
        </div>
      </>}

      {tab==='products'&&<>
        <div className="pm-header">
          <div><div style={{fontWeight:700,fontSize:15}}>{products.length} Products</div><div style={{fontSize:11,color:'#8888AA'}}>Add, edit, delete products</div></div>
          <button className="sub-btn gold" style={{width:'auto',padding:'8px 16px',margin:0}} onClick={openAdd}>+ Add Product</button>
        </div>
        {products.length===0
          ? <div style={{background:'#fff',border:'1px solid #E8E2D8',borderTop:'none',borderRadius:'0 0 14px 14px'}}><div className="empty"><div style={{fontSize:36,marginBottom:10}}>📦</div><p>No products yet</p></div></div>
          : <div className="pm-grid">
              {products.map(p=>(
                <div key={p.id} className="pm-card">
                  {p.in_stock?<span className="pm-ins">In Stock</span>:<span className="pm-oos">Out of Stock</span>}
                  {p.image_url?<img src={p.image_url} alt={p.name} className="pm-img"/>:<span className="pm-emoji">{CAT_EMOJI[p.category]||'📦'}</span>}
                  <div className="pm-name">{p.name}</div>
                  <div className="pm-cat">{p.category} · {p.gsm}</div>
                  <div className="pm-pr"><span className="pm-ws">₹{p.wholesale_price}</span><span className="pm-mrp">₹{p.mrp}</span></div>
                  <div style={{fontSize:10,color:'#8888AA',marginBottom:7}}>MOQ:{p.moq} · {p.colors} colors</div>
                  <div className="pm-acts">
                    <button className="pm-btn edit" onClick={()=>openEdit(p)}>✏️</button>
                    <button className="pm-btn tog" onClick={()=>toggleStock(p)}>{p.in_stock?'OOS':'IN'}</button>
                    <button className="pm-btn del" onClick={()=>setDeleteId(p.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
        }
      </>}

      {tab==='orders'&&<>
        <div className="tabs" style={{marginBottom:14}}>
          {ORDER_STATUSES.map(t=><button key={t} className={`tab ${orderTab===t?'active':''}`} onClick={()=>setOrderTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)} ({orders.filter(o=>o.status===t).length})</button>)}
        </div>
        {orders.filter(o=>o.status===orderTab).length===0
          ? <div className="empty"><div style={{fontSize:36,marginBottom:10}}>🛒</div><p>No {orderTab} orders</p></div>
          : orders.filter(o=>o.status===orderTab).map(o=>(
            <div key={o.id} className="order-card">
              <div className="order-hd">
                <div><div className="order-id">Order #{o.id}</div><div className="order-shop">{o.shop_name} · {o.city} · {o.phone}</div><div style={{fontSize:11,color:'#8888AA',marginTop:2}}>{new Date(o.created_at).toLocaleString('en-IN')}</div></div>
                <span style={{background:STATUS_BG[o.status],color:STATUS_COLORS[o.status],padding:'4px 10px',borderRadius:20,fontSize:11,fontWeight:700}}>{o.status.toUpperCase()}</span>
              </div>
              <div className="order-items">
                {Array.isArray(o.items)&&o.items.map((item,i)=>(
                  <div key={i} className="order-item-row">
                    <span>{item.product_name} × {item.quantity}{item.size?` (${item.size})`:''}{item.color?` - ${item.color}`:''}</span>
                    <span>₹{item.total?.toLocaleString()}</span>
                  </div>
                ))}
                <div style={{display:'flex',justifyContent:'space-between',marginTop:8,fontWeight:700,fontSize:13}}>
                  <span>Total</span><span style={{color:'#1A6B3C'}}>₹{Number(o.total_value).toLocaleString()}</span>
                </div>
              </div>
              {o.notes&&<p style={{fontSize:12,color:'#8888AA',marginBottom:10}}>Note: {o.notes}</p>}
              <div className="order-actions">
                {o.status==='new'&&<button className="oa-btn confirm" onClick={()=>handleOrderStatus(o.id,'confirmed')}>✓ Confirm</button>}
                {o.status==='confirmed'&&<button className="oa-btn dispatch" onClick={()=>handleOrderStatus(o.id,'dispatched')}>🚚 Dispatch</button>}
                {o.status!=='cancelled'&&o.status!=='dispatched'&&<button className="oa-btn cancel" onClick={()=>handleOrderStatus(o.id,'cancelled')}>✗ Cancel</button>}
              </div>
            </div>
          ))
        }
      </>}
    </div>

    {productModal&&(
      <div className="overlay" onClick={e=>e.target===e.currentTarget&&setProductModal(null)}>
        <div className="modal">
          <button className="mx" onClick={()=>setProductModal(null)}>✕</button>
          <h2 style={{fontFamily:"'Playfair Display',serif"}}>{editId?'Edit Product':'Add New Product'}</h2>
          <p style={{fontSize:12,color:'#8888AA',marginBottom:18}}>{editId?'Update product details':'Product saves permanently to your database'}</p>
          {err&&<div className="alert alert-err">{err}</div>}
          {ok&&<div className="alert alert-ok">✓ {ok}</div>}
          <div className="fg"><label>Product Photo</label>
            <div className="img-upload-area" onClick={()=>fileRef.current.click()}>
              {imgPreview?<img src={imgPreview} alt="preview" className="img-preview"/>:<div><div style={{fontSize:32,marginBottom:8}}>📷</div><div style={{fontSize:13,color:'#8888AA'}}>Tap to upload photo</div><div style={{fontSize:11,color:'#8888AA',marginTop:4}}>Works from phone camera or laptop</div></div>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleImg}/>
            {imgPreview&&<button style={{fontSize:11,color:'#C0392B',background:'none',border:'none',cursor:'pointer',marginTop:4}} onClick={()=>{setImgFile(null);setImgPreview('')}}>Remove photo</button>}
          </div>
          <div className="r2">
            <div className="fg"><label>Product Name *</label><input placeholder="e.g. Royal Cotton Bedsheet" value={pf.name} onChange={e=>setPf('name',e.target.value)}/></div>
            <div className="fg"><label>Category *</label><select value={pf.category} onChange={e=>setPf('category',e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="r3">
            <div className="fg"><label>Wholesale ₹ *</label><input type="number" placeholder="285" value={pf.wholesale_price} onChange={e=>setPf('wholesale_price',e.target.value)}/></div>
            <div className="fg"><label>MRP ₹ *</label><input type="number" placeholder="599" value={pf.mrp} onChange={e=>setPf('mrp',e.target.value)}/></div>
            <div className="fg"><label>MOQ *</label><input type="number" placeholder="10" value={pf.moq} onChange={e=>setPf('moq',e.target.value)}/></div>
          </div>
          <div className="r3">
            <div className="fg"><label>GSM</label><input placeholder="180 GSM" value={pf.gsm} onChange={e=>setPf('gsm',e.target.value)}/></div>
            <div className="fg"><label>Colors</label><input type="number" placeholder="8" value={pf.colors} onChange={e=>setPf('colors',e.target.value)}/></div>
            <div className="fg"><label>Tag</label><select value={pf.tag} onChange={e=>setPf('tag',e.target.value)}>{TAGS.map(t=><option key={t} value={t}>{t||'No Tag'}</option>)}</select></div>
          </div>
          <div className="fg"><label>Sizes</label><input placeholder="Single, Double, King" value={pf.sizes} onChange={e=>setPf('sizes',e.target.value)}/></div>
          <div className="fg"><label>YouTube / Instagram Video Link</label><input placeholder="https://youtube.com/..." value={pf.video_url} onChange={e=>setPf('video_url',e.target.value)}/></div>
          <div className="fg"><label>Stock Status</label>
            <div style={{display:'flex',gap:8}}>
              {[true,false].map(s=>(
                <button key={String(s)} onClick={()=>setPf('in_stock',s)} style={{flex:1,padding:'9px',borderRadius:8,border:`2px solid ${pf.in_stock===s?(s?'#1A6B3C':'#C0392B'):'#E8E2D8'}`,background:pf.in_stock===s?(s?'rgba(26,107,60,0.1)':'rgba(192,57,43,0.08)'):'#fff',cursor:'pointer',fontWeight:600,fontSize:12,color:pf.in_stock===s?(s?'#1A6B3C':'#C0392B'):'#8888AA',fontFamily:"'DM Sans',sans-serif"}}>
                  {s?'✓ In Stock':'✗ Out of Stock'}
                </button>
              ))}
            </div>
          </div>
          {margin!==null&&<div className="alert alert-ok" style={{display:'flex',justifyContent:'space-between'}}><span>Retailer margin: <strong>{margin}%</strong></span><span>Profit/pc: <strong>₹{Number(pf.mrp)-Number(pf.wholesale_price)}</strong></span></div>}
          <button className="sub-btn gold" onClick={saveProduct} disabled={loading}>{loading?'Saving...':editId?'Save Changes →':'Add to Catalogue →'}</button>
        </div>
      </div>
    )}

    {deleteId&&(
      <div className="overlay" onClick={e=>e.target===e.currentTarget&&setDeleteId(null)}>
        <div className="modal" style={{maxWidth:340,textAlign:'center'}}>
          <div style={{fontSize:36,marginBottom:10}}>🗑️</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",marginBottom:8}}>Delete Product?</h2>
          <p style={{color:'#8888AA',fontSize:13,marginBottom:20}}>"{products.find(p=>p.id===deleteId)?.name}" will be permanently deleted.</p>
          <div style={{display:'flex',gap:8}}>
            <button style={{flex:1,padding:11,borderRadius:8,border:'1px solid #E8E2D8',background:'#fff',cursor:'pointer',fontWeight:600,fontSize:13,fontFamily:"'DM Sans',sans-serif"}} onClick={()=>setDeleteId(null)}>Cancel</button>
            <button className="sub-btn red" style={{flex:1,margin:0}} onClick={()=>handleDelete(deleteId)} disabled={loading}>Delete</button>
          </div>
        </div>
      </div>
    )}
    </>
  )
                }
