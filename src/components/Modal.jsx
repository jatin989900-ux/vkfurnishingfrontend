import { useState, useRef } from 'react'
import { sendOtp, verifyOtp, registerRetailer, loginRetailer } from '../api.js'

const S = [
  '.overlay{position:fixed;inset:0;background:rgba(28,28,46,0.7);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;}',
  '.modal{background:#fff;border-radius:18px;padding:28px;max-width:420px;width:100%;position:relative;max-height:92vh;overflow-y:auto;}',
  '.mx{position:absolute;top:16px;right:16px;background:#F2EDE4;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:13px;}',
  '.fg{margin-bottom:13px;}',
  '.fg label{display:block;font-size:11px;font-weight:600;color:#8888AA;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px;}',
  '.fg input{width:100%;padding:10px 12px;border:1.5px solid #E8E2D8;border-radius:8px;font-size:13px;color:#1C1C2E;background:#fff;outline:none;box-sizing:border-box;}',
  '.fg input:focus{border-color:#C9973A;}',
  '.r2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
  '.sub-btn{width:100%;padding:12px;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;margin-top:6px;}',
  '.sub-btn.dark{background:#1C1C2E;color:#fff;}',
  '.sub-btn.gold{background:#C9973A;color:#1C1C2E;}',
  '.sub-btn:disabled{opacity:0.5;cursor:not-allowed;}',
  '.alert{padding:9px 12px;border-radius:7px;font-size:12px;font-weight:500;margin-bottom:12px;}',
  '.alert-err{background:#FEE;color:#C0392B;border:1px solid #FCC;}',
  '.otp-boxes{display:flex;gap:8px;justify-content:center;margin:16px 0;}',
  '.otp-box{width:44px;height:52px;border:1.5px solid #E8E2D8;border-radius:10px;font-size:20px;font-weight:700;text-align:center;outline:none;color:#1C1C2E;}',
  '.otp-box:focus{border-color:#C9973A;}',
  '.biz-upload{border:2px dashed #E8E2D8;border-radius:12px;padding:18px;text-align:center;cursor:pointer;background:#FAF8F4;}',
  '.biz-upload:hover{border-color:#C9973A;}',
  '.biz-preview{width:100%;max-height:160px;object-fit:cover;border-radius:8px;margin-top:8px;}',
  '.pending-box{text-align:center;padding:12px 0;}',
  '.switch-link{text-align:center;margin-top:14px;font-size:13px;color:#8888AA;}',
  '.switch-link span{color:#C9973A;cursor:pointer;font-weight:600;}',
].join('')

export default function Modal({ type, onClose, onSuccess }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [form, setForm] = useState({ name: '', shop_name: '', city: '', phone: '', gst: '' })
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [bizCard, setBizCard] = useState(null)
  const [bizPreview, setBizPreview] = useState('')
  const [loginPhone, setLoginPhone] = useState('')
  const [loginOtp, setLoginOtp] = useState(['', '', '', '', '', ''])
  const fileRef = useRef()
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]
  const loginOtpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

  function setF(k, v) { setForm(p => ({ ...p, [k]: v })) }

  function handleBizCard(e) {
    const f = e.target.files[0]
    if (!f) return
    setBizCard(f)
    setBizPreview(URL.createObjectURL(f))
  }

  function handleOtpChange(val, i, refs, otpArr, setOtpArr) {
    if (!/^\d*$/.test(val)) return
    const next = [...otpArr]
    next[i] = val.slice(-1)
    setOtpArr(next)
    if (val && i < 5) refs[i + 1].current && refs[i + 1].current.focus()
  }

  function handleOtpKey(e, i, refs, otpArr, setOtpArr) {
    if (e.key === 'Backspace' && !otpArr[i] && i > 0) refs[i - 1].current && refs[i - 1].current.focus()
  }

  async function handleSendOtp() {
    if (!form.name || !form.shop_name || !form.city) { setErr('Please fill all fields'); return }
    if (!form.phone || form.phone.length !== 10) { setErr('Enter valid 10-digit phone number'); return }
    setErr(''); setLoading(true)
    try { await sendOtp(form.phone); setStep(2) }
    catch (e) { setErr(e.message) }
    setLoading(false)
  }

  async function handleVerifyAndRegister() {
    const otpCode = otp.join('')
    if (otpCode.length !== 6) { setErr('Enter complete 6-digit OTP'); return }
    setErr(''); setLoading(true)
    try {
      await verifyOtp(form.phone, otpCode)
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (bizCard) fd.append('business_card', bizCard)
      await registerRetailer(fd)
      setStep(3)
    } catch (e) { setErr(e.message) }
    setLoading(false)
  }

  async function handleLoginSendOtp() {
    if (!loginPhone || loginPhone.length !== 10) { setErr('Enter valid 10-digit phone number'); return }
    setErr(''); setLoading(true)
    try { await sendOtp(loginPhone); setStep('login-otp') }
    catch (e) { setErr(e.message) }
    setLoading(false)
  }

  async function handleLoginVerify() {
    const otpCode = loginOtp.join('')
    if (otpCode.length !== 6) { setErr('Enter complete 6-digit OTP'); return }
    setErr(''); setLoading(true)
    try {
      await verifyOtp(loginPhone, otpCode)
      const res = await loginRetailer(loginPhone)
      localStorage.setItem('vk_retailer', JSON.stringify(res.retailer))
      onSuccess(res.retailer)
    } catch (e) { setErr(e.message) }
    setLoading(false)
  }

  if (type === 'login') return (
    <div className="overlay" onClick={e => e.target.classList.contains('overlay') && onClose()}>
      <style>{S}</style>
      <div className="modal">
        <button className="mx" onClick={onClose}>X</button>
        <h2 style={{ marginBottom: 6 }}>{step === 'login-otp' ? 'Enter OTP' : 'Login'}</h2>
        <p style={{ fontSize: 12, color: '#8888AA', marginBottom: 18 }}>
          {step === 'login-otp' ? 'OTP sent to +91 ' + loginPhone : 'Enter your registered phone number'}
        </p>
        {err && <div className="alert alert-err">{err}</div>}
        {step === 1 ? (
          <>
            <div className="fg">
              <label>Phone Number</label>
              <input placeholder="10-digit mobile number" value={loginPhone} maxLength={10}
                onChange={e => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => e.key === 'Enter' && handleLoginSendOtp()} />
            </div>
            <button className="sub-btn dark" onClick={handleLoginSendOtp} disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <div className="switch-link">New retailer? <span onClick={() => onSuccess('register')}>Register here</span></div>
          </>
        ) : (
          <>
            <div className="otp-boxes">
              {loginOtp.map((d, i) => (
                <input key={i} ref={loginOtpRefs[i]} className="otp-box" maxLength={1} value={d}
                  onChange={e => handleOtpChange(e.target.value, i, loginOtpRefs, loginOtp, setLoginOtp)}
                  onKeyDown={e => handleOtpKey(e, i, loginOtpRefs, loginOtp, setLoginOtp)} />
              ))}
            </div>
            <button className="sub-btn dark" onClick={handleLoginVerify} disabled={loading}>
              {loading ? 'Verifying...' : 'Login'}
            </button>
            <div className="switch-link"><span onClick={() => { setStep(1); setErr('') }}>Change number</span></div>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="overlay" onClick={e => e.target.classList.contains('overlay') && onClose()}>
      <style>{S}</style>
      <div className="modal">
        <button className="mx" onClick={onClose}>X</button>
        {step === 1 && (
          <>
            <h2 style={{ marginBottom: 6 }}>Register Your Shop</h2>
            <p style={{ fontSize: 12, color: '#8888AA', marginBottom: 18 }}>Fill details to get wholesale access</p>
            {err && <div className="alert alert-err">{err}</div>}
            <div className="r2">
              <div className="fg"><label>Your Name</label>
                <input placeholder="Full name" value={form.name} onChange={e => setF('name', e.target.value)} />
              </div>
              <div className="fg"><label>Shop Name</label>
                <input placeholder="Shop name" value={form.shop_name} onChange={e => setF('shop_name', e.target.value)} />
              </div>
            </div>
            <div className="r2">
              <div className="fg"><label>City</label>
                <input placeholder="City" value={form.city} onChange={e => setF('city', e.target.value)} />
              </div>
              <div className="fg"><label>Phone</label>
                <input placeholder="10-digit" value={form.phone} maxLength={10}
                  onChange={e => setF('phone', e.target.value.replace(/\D/g, ''))} />
              </div>
            </div>
            <div className="fg"><label>GST (Optional)</label>
              <input placeholder="GST number" value={form.gst} onChange={e => setF('gst', e.target.value)} />
            </div>
            <div className="fg">
              <label>Business Card or Shop Photo</label>
              <div className="biz-upload" onClick={() => fileRef.current.click()}>
                {bizPreview
                  ? <img src={bizPreview} alt="biz" className="biz-preview" />
                  : <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>Upload business card or shop photo</div>
                      <div style={{ fontSize: 11, color: '#8888AA', marginTop: 4 }}>Helps verify your shop faster</div>
                    </div>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBizCard} />
              {bizPreview && (
                <button style={{ fontSize: 11, color: '#C0392B', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}
                  onClick={() => { setBizCard(null); setBizPreview('') }}>Remove photo</button>
              )}
            </div>
            <button className="sub-btn gold" onClick={handleSendOtp} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP to Verify'}
            </button>
            <div className="switch-link">Already registered? <span onClick={() => onSuccess('login')}>Login here</span></div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 style={{ marginBottom: 6 }}>Verify OTP</h2>
            <p style={{ fontSize: 12, color: '#8888AA', marginBottom: 18 }}>6-digit OTP sent to +91 {form.phone}</p>
            {err && <div className="alert alert-err">{err}</div>}
            <div className="otp-boxes">
              {otp.map((d, i) => (
                <input key={i} ref={otpRefs[i]} className="otp-box" maxLength={1} value={d}
                  onChange={e => handleOtpChange(e.target.value, i, otpRefs, otp, setOtp)}
                  onKeyDown={e => handleOtpKey(e, i, otpRefs, otp, setOtp)} />
              ))}
            </div>
            <button className="sub-btn gold" onClick={handleVerifyAndRegister} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify and Register'}
            </button>
            <div className="switch-link"><span onClick={() => { setStep(1); setErr('') }}>Change details</span></div>
            <div className="switch-link" style={{ marginTop: 6 }}><span onClick={handleSendOtp}>Resend OTP</span></div>
          </>
        )}
        {step === 3 && (
          <div className="pending-box">
            <h2 style={{ marginBottom: 8 }}>Registration Submitted!</h2>
            <p style={{ fontSize: 13, color: '#8888AA', lineHeight: 1.6, marginBottom: 16 }}>
              Your registration is under review. You will get access once approved. Usually takes a few hours.
            </p>
            <button className="sub-btn dark" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
} 
