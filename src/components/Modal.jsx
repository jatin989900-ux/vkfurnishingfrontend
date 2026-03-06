import { useState } from 'react'
import { registerRetailer, loginRetailer } from '../api.js'

const S = [
  '.overlay{position:fixed;inset:0;background:rgba(28,28,46,0.7);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);}',
  '.modal{background:#fff;border-radius:20px;width:100%;max-width:460px;padding:32px 28px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.2);max-height:90vh;overflow-y:auto;}',
  '.modal-close{position:absolute;top:16px;right:16px;background:#f5f5f5;border:none;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;color:#666;display:flex;align-items:center;justify-content:center;}',
  '.modal h2{font-size:22px;font-weight:700;color:#1C1C2E;margin:0 0 4px;}',
  '.modal-sub{font-size:13px;color:#aaa;margin:0 0 22px;}',
  '.field{margin-bottom:14px;}',
  '.field label{display:block;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;}',
  '.field input[type=text],.field input[type=tel]{width:100%;padding:12px 14px;border:1.5px solid #EDE9E0;border-radius:10px;font-size:14px;color:#1C1C2E;outline:none;transition:border 0.2s;box-sizing:border-box;font-family:inherit;}',
  '.field input:focus{border-color:#C9973A;box-shadow:0 0 0 3px rgba(201,151,58,0.1);}',
  '.file-label{display:block;padding:12px 14px;border:1.5px dashed #EDE9E0;border-radius:10px;font-size:13px;color:#aaa;cursor:pointer;text-align:center;background:#FAFAFA;}',
  '.file-label.has-file{border-color:#C9973A;color:#C9973A;background:#FBF5E8;}',
  '.btn-primary{width:100%;padding:14px;background:#C9973A;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;margin-top:8px;font-family:inherit;transition:background 0.2s;}',
  '.btn-primary:hover{background:#B8862F;}',
  '.btn-primary:disabled{background:#ddd;cursor:not-allowed;}',
  '.error{background:#FFF0F0;color:#E53E3E;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:14px;border:1px solid #FED7D7;}',
  '.switch-link{text-align:center;margin-top:18px;font-size:13px;color:#aaa;}',
  '.switch-link button{background:none;border:none;color:#C9973A;font-weight:700;cursor:pointer;font-size:13px;font-family:inherit;}',
  '.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;}',
  '.pending-note{text-align:center;padding:8px 0;}',
  '.pending-note p{margin:0 0 10px;font-size:13px;color:#8B6914;line-height:1.6;}',
].join('')

export default function Modal({ type, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState('form')

  // Register fields
  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [gst, setGst] = useState('')
  const [bizCard, setBizCard] = useState(null)

  async function handleRegister() {
    setError('')
    if (!name || !shopName || !city || !phone) {
      setError('Please fill all required fields')
      return
    }
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('shop_name', shopName)
      formData.append('city', city)
      formData.append('phone', phone)
      if (gst) formData.append('gst', gst)
      if (bizCard) formData.append('business_card', bizCard)
      const data = await registerRetailer(formData)
      if (data.retailer) {
        setStep('pending')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    }
    setLoading(false)
  }

  async function handleLogin() {
    setError('')
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }
    setLoading(true)
    try {
      const data = await loginRetailer(phone)
      onSuccess(data.retailer)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <style>{S}</style>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        {type === 'register' ? (
          <>
            <h2>Register Your Shop</h2>
            <p className="modal-sub">Fill details to get wholesale access</p>
            {error && <div className="error">{error}</div>}

            {step === 'form' && (
              <>
                <div className="two-col">
                  <div className="field">
                    <label>Your Name *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
                  </div>
                  <div className="field">
                    <label>Shop Name *</label>
                    <input type="text" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="Shop name" />
                  </div>
                </div>
                <div className="two-col">
                  <div className="field">
                    <label>City *</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
                  </div>
                  <div className="field">
                    <label>Phone *</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit" maxLength={10} />
                  </div>
                </div>
                <div className="field">
                  <label>GST Number (Optional)</label>
                  <input type="text" value={gst} onChange={e => setGst(e.target.value)} placeholder="GST number" />
                </div>
                <div className="field">
                  <label>Business Card or Shop Photo</label>
                  <label className={'file-label' + (bizCard ? ' has-file' : '')}>
                    {bizCard ? '✅ ' + bizCard.name : '📷 Upload business card or shop photo'}
                    <input type="file" accept="image/*" style={{display:'none'}} onChange={e => setBizCard(e.target.files[0])} />
                  </label>
                  <p style={{fontSize:11,color:'#aaa',margin:'4px 0 0'}}>Helps verify your shop faster</p>
                </div>
                <button className="btn-primary" onClick={handleRegister} disabled={loading}>
                  {loading ? 'Submitting...' : 'Register Your Shop'}
                </button>
                <div className="switch-link">
                  Already registered? <button onClick={() => onSuccess('login')}>Login here</button>
                </div>
              </>
            )}

            {step === 'pending' && (
              <div className="pending-note">
                <p style={{fontSize:40}}>🎉</p>
                <p><strong>Registration Successful!</strong></p>
                <p>Your registration is under review. You will get access once approved. Usually takes a few hours.</p>
                <button className="btn-primary" onClick={onClose} style={{marginTop:8}}>Close</button>
              </div>
            )}
          </>
        ) : (
          <>
            <h2>Welcome Back</h2>
            <p className="modal-sub">Login with your registered phone number</p>
            {error && <div className="error">{error}</div>}
            <div className="field">
              <label>Phone Number *</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit number" maxLength={10} autoFocus />
            </div>
            <button className="btn-primary" onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="switch-link">
              New retailer? <button onClick={() => onSuccess('register')}>Register here</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
