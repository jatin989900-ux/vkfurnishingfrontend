import { useState } from 'react'
import { sendOTP, verifyOTP, registerRetailer, placeOrder, checkStatus } from '../api.js'

const S = `
.overlay{position:fixed;inset:0;background:rgba(28,28,46,0.7);backdrop-filter:blur(5px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;}
.modal{background:#fff;border-radius:18px;padding:28px;max-width:480px;width:100%;position:relative;max-height:92vh;overflow-y:auto;animation:fadeIn 0.3s ease;}
.modal.slim{max-width:360px;}
.mx{position:sticky;top:-28px;float:right;background:#F2EDE4;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:13px;margin:-4px -4px 8px 0;z-index:10;}
.modal h2{font-family:'Playfair Display',serif;font-size:21px;margin-bottom:5px;}
.modal-sub{font-size:13px;color:#8888AA;margin-bottom:20px;line-height:1.5;}
.fg{margin-bottom:13px;}
.fg label{display:block;font-size:11px;font-weight:600;color:#8888AA;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px;}
.fg input,.fg select{width:100%;padding:10px 12px;border:1.5px solid #E8E2D8;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;color:#1C1C2E;background:#fff;outline:none;}
.fg input:focus{border-color:#C9973A;}
.r2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.sub-btn{width:100%;padding:12px;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;margin-top:6px;color:#fff;}
.sub-btn.dark{background:#1C1C2E;}
.sub-btn.gold{background:#C9973A;color:#1C1C2E;}
.sub-btn.green{background:#1A6B3C;}
.sub-btn:disabled{opacity:0.5;cursor:not-allowed;}
.alert{padding:9px 12px;border-radius:7px;font-size:12px;font-weight:500;margin-bottom:12px;}
.alert-err{background:#FEE;color:#C0392B;border:1px solid #FCC;}
.alert-ok{background:#E8F5E9;color:#1A6B3C;border:1px solid #C8E6C9;}
.otp-inputs{display:flex;gap:8px;justify-content:center;margin:14px 0;}
.otp-i{width:44px;height:52px;text-align:center;font-size:22px;font-weight:700;border:2px solid #E8E2D8;border-radius:9px;font-family:'DM Sans',sans-serif;color:#1C1C2E;outline:none;}
.otp-i:focus{border-color:#C9973A;}
.qty-row{display:flex;align-items:center;gap:8px;}
.qty-btn{width:30px;height:30px;border-radius:6px;border:1px solid #E8E2D8;background:#fff;cursor:pointer;font-size:16px;font-weight:700;}
.qty-num{font-weight:700;font-size:16px;min-width:24px;text-align:center;}
`

export default function Modal({ type, onClose, product, onSuccess }) {
  const [step, setStep] = useState('form')
  const [form, setForm] = useState({ name:'', shop_name:'', city:'', phone:'', gst:'' })
  const [otp, setOtp] = useState(['','','','','',''])
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)
  const [qty, setQty] = useState(product?.moq || 1)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [notes, setNotes] = useState('')
  const setF = (k,v) => setForm(p => ({...p,[k]:v}))

  async function handleSendOTP() {
    if (!form.name||!form.shop_name||!form.city||!form.phone) { setErr('Please fill all required fields.'); return }
    if (form.phone.length !== 10) { setErr('Enter a valid 10-digit phone number.'); return }
    setErr(''); setLoading(true)
    try { await sendOTP(form.phone); setStep('otp') } catch(e) { setErr(e.message) }
    setLoading(false)
  }

  async function handleVerifyOTP() {
    const code = otp.join('')
    if (code.length < 6) { setErr('Enter complete 6-digit OTP'); return }
    setErr(''); setLoading(true)
    try { await verifyOTP(form.phone, code); await registerRetailer(form); setStep('pending') } catch(e) { setErr(e.message) }
    setLoading(false)
  }

  function handleOtpKey(i, val) {
    if (!/^\d*$/.test(val)) return
    const n = [...otp]; n[i] = val.slice(-1); setOtp(n)
    if (val && i < 5) document.getElementById(`oi-${i+1}`)?.focus()
  }

  async function handleOrder() {
    if (qty < product.moq) { setErr(`Minimum order is ${product.moq} pieces`); return }
    setErr(''); setLoading(true)
    try {
      const retailer = JSON.parse(localStorage.getItem('vk_retailer') || '{}')
      const res = await placeOrder({ retailer_phone: retailer.phone, items: [{ product_id: product.id, quantity: qty, size, color }], notes })
      setOk(res.message)
      setTimeout(() => { onClose(); onSuccess && onSuccess() }, 2000)
    } catch(e) { setErr(e.message) }
    setLoading(false)
  }

  async function handleLogin() {
    if (!form.phone || form.phone.length !== 10) { setErr('Enter your registered 10-digit phone number'); return }
    setErr(''); setLoading(true)
    try {
      const res = await checkStatus(form.phone)
      if (res.retailer.status === 'approved') { localStorage.setItem('vk_retailer', JSON.stringify(res.retailer)); onSuccess(res.retailer); onClose() }
      else if (res.retailer.status === 'pending') setErr('Your account is pending approval. We will notify you on WhatsApp.')
      else setErr('Your account was not approved. Please contact us.')
    } catch(e) { setErr('Phone number not registered. Please register first.') }
    setLoading(false)
  }

  if (type === 'order') return (
    <div className="overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <style>{S}</style>
      <div className="modal slim">
        <button className="mx" onClick={onClose}>✕</button>
        <h2>Place Order</h2>
        <p className="modal-sub">{product.name}</p>
        {err && <div className="alert alert-err">{err}</div>}
        {ok && <div className="alert alert-ok">✓ {ok}</div>}
        <div style={{background:'#F2EDE4',borderRadius:10,padding:14,marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:6}}>{product.name}</div>
          <div style={{fontSize:12,color:'#1A6B3C',fontWeight:600,marginBottom:8}}>₹{product.wholesale_price}/piece · Min {product.moq} pcs</div>
          <div className="qty-row">
            <button className="qty-btn" onClick={() => setQty(q => Math.max(product.moq, q-1))}>−</button>
            <span className="qty-num">{qty}</span>
            <button className="qty-btn" onClick={() => setQty(q => q+1)}>+</button>
            <span style={{fontSize:11,color:'#8888AA',marginLeft:4}}>pieces</span>
          </div>
        </div>
        <div className="fg"><label>Size</label>
          {product.sizes
            ? <select value={size} onChange={e => setSize(e.target.value)}><option value="">Select size</option>{product.sizes.split(',').map(s => <option key={s} value={s.trim()}>{s.trim()}</option>)}</select>
            : <input placeholder="e.g. Double" value={size} onChange={e => setSize(e.target.value)} />}
        </div>
        <div className="fg"><label>Color</label><input placeholder="e.g. Blue, Assorted" value={color} onChange={e => setColor(e.target.value)} /></div>
        <div style={{background:'rgba(26,107,60,0.08)',border:'1px solid rgba(26,107,60,0.2)',borderRadius:10,padding:12,marginBottom:14}}>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:12,color:'#8888AA'}}>Total Value</span>
            <span style={{fontWeight:700,color:'#1A6B3C',fontSize:16}}>₹{(product.wholesale_price * qty).toLocaleString()}</span>
          </div>
          <div style={{fontSize:11,color:'#8888AA',marginTop:4}}>Payment via UPI/Bank after confirmation</div>
        </div>
        <div className="fg"><label>Notes</label><input placeholder="Any requirements..." value={notes} onChange={e => setNotes(e.target.value)} /></div>
        <button className="sub-btn green" onClick={handleOrder} disabled={loading}>{loading ? 'Sending...' : 'Send Order →'}</button>
      </div>
    </div>
  )

  if (type === 'login') return (
    <div className="overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <style>{S}</style>
      <div className="modal slim">
        <button className="mx" onClick={onClose}>✕</button>
        <h2>Login</h2>
        <p className="modal-sub">Enter your registered phone number</p>
        {err && <div className="alert alert-err">{err}</div>}
        <div className="fg"><label>Phone Number</label><input placeholder="10-digit registered number" maxLength={10} value={form.phone} onChange={e => setF('phone', e.target.value.replace(/\D/,''))} /></div>
        <button className="sub-btn dark" onClick={handleLogin} disabled={loading}>{loading ? 'Checking...' : 'Login →'}</button>
        <p style={{textAlign:'center',marginTop:12,fontSize:12,color:'#8888AA'}}>
          New retailer? <span style={{color:'#C9973A',cursor:'pointer'}} onClick={() => onSuccess('register')}>Register here</span>
        </p>
      </div>
    </div>
  )

  return (
    <div className="overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <style>{S}</style>
      <div className="modal">
        <button className="mx" onClick={onClose}>✕</button>
        {step === 'form' && <>
          <h2>Register Your Shop</h2>
          <p className="modal-sub">Verify your identity to access wholesale pricing</p>
          {err && <div className="alert alert-err">{err}</div>}
          <div className="r2">
            <div className="fg"><label>Your Name *</label><input placeholder="Full name" value={form.name} onChange={e => setF('name',e.target.value)} /></div>
            <div className="fg"><label>Shop Name *</label><input placeholder="Store name" value={form.shop_name} onChange={e => setF('shop_name',e.target.value)} /></div>
          </div>
          <div className="r2">
            <div className="fg"><label>City *</label><input placeholder="Your city" value={form.city} onChange={e => setF('city',e.target.value)} /></div>
            <div className="fg"><label>Phone *</label><input placeholder="10-digit" maxLength={10} value={form.phone} onChange={e => setF('phone',e.target.value.replace(/\D/,''))} /></div>
          </div>
          <div className="fg"><label>GST (optional)</label><input placeholder="For GST invoicing" value={form.gst} onChange={e => setF('gst',e.target.value.toUpperCase())} /></div>
          <button className="sub-btn dark" onClick={handleSendOTP} disabled={loading}>{loading ? 'Sending OTP...' : 'Send OTP →'}</button>
          <p style={{textAlign:'center',marginTop:12,fontSize:12,color:'#8888AA'}}>
            Already registered? <span style={{color:'#C9973A',cursor:'pointer'}} onClick={() => onSuccess('login')}>Login here</span>
          </p>
        </>}
        {step === 'otp' && <>
          <h2>Verify OTP</h2>
          <p className="modal-sub">Enter the 6-digit OTP sent to +91 {form.phone}</p>
          {err && <div className="alert alert-err">{err}</div>}
          <div className="otp-inputs">
            {otp.map((v,i) => (
              <input key={i} id={`oi-${i}`} className="otp-i" maxLength={1} value={v}
                onChange={e => handleOtpKey(i, e.target.value)}
                onKeyDown={e => e.key==='Backspace' && !v && i>0 && document.getElementById(`oi-${i-1}`)?.focus()} />
            ))}
          </div>
          <button className="sub-btn dark" onClick={handleVerifyOTP} disabled={loading || otp.join('').length < 6}>
            {loading ? 'Verifying...' : 'Verify & Register →'}
          </button>
          <p style={{textAlign:'center',marginTop:10,fontSize:12,color:'#8888AA'}}>
            <span style={{cursor:'pointer',color:'#C9973A'}} onClick={handleSendOTP}>Resend OTP</span>
          </p>
        </>}
        {step === 'pending' && (
          <div style={{textAlign:'center'}}>
            <div style={{width:56,height:56,background:'rgba(26,107,60,0.1)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 14px'}}>⏳</div>
            <h2>Request Submitted!</h2>
            <p style={{color:'#8888AA',fontSize:13,margin:'8px 0 18px',lineHeight:1.6}}>
              <strong>{form.shop_name}</strong> verified via OTP. Our team will review within 2-4 hours.
            </p>
            <div style={{background:'#FFF8E7',border:'1px solid #C9973A',borderRadius:12,padding:18,marginBottom:16}}>
              <div style={{fontSize:24,marginBottom:8}}>📱</div>
              <strong>What's next?</strong>
              <p style={{fontSize:12,color:'#8888AA',marginTop:4,lineHeight:1.6}}>You'll get WhatsApp confirmation on {form.phone} once approved.</p>
            </div>
            <button className="sub-btn gold" onClick={onClose}>Got it!</button>
          </div>
        )}
      </div>
    </div>
  )
}
