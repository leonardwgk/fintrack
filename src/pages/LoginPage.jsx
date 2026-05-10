import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [message, setMessage]   = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) setError(error.message)
      else setMessage('Akun berhasil dibuat. Silakan login.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email atau password salah.')
    }
    setLoading(false)
  }

  const toggle = () => {
    setIsSignUp(!isSignUp)
    setError(null)
    setMessage(null)
  }

  return (
    <div style={{ minHeight: '100svh', display: 'flex', fontFamily: 'var(--font-sans)' }}>

      {/* left panel — branding */}
      <div style={{
        display: 'none',
        flex: '1',
        background: 'var(--ink)',
        padding: '48px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }} className="left-panel">
        {/* grid lines decoration */}
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.06 }} viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
          {Array.from({length:10}).map((_,i)=>(
            <line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="700" stroke="white" strokeWidth=".5"/>
          ))}
          {Array.from({length:15}).map((_,i)=>(
            <line key={`h${i}`} x1="0" y1={i*50} x2="400" y2={i*50} stroke="white" strokeWidth=".5"/>
          ))}
        </svg>

        {/* top */}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:32, height:32, background:'white', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:16 }}>◈</span>
            </div>
            <span style={{ color:'white', fontWeight:600, fontSize:18, letterSpacing:'-.02em' }}>fintrack</span>
          </div>
        </div>

        {/* center quotes */}
        <div style={{ position:'relative', zIndex:1 }}>
          <p style={{ color:'rgba(255,255,255,.4)', fontSize:12, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:16 }}>Financial clarity</p>
          <h2 style={{ color:'white', fontSize:32, fontWeight:300, lineHeight:1.3, letterSpacing:'-.02em', margin:0 }}>
            Kenali asetmu.<br/>
            Kuasai keuanganmu.<br/>
            <em style={{ fontStyle:'italic', color:'rgba(255,255,255,.5)' }}>Setiap hari.</em>
          </h2>
        </div>

        {/* stats preview */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, position:'relative', zIndex:1 }}>
          {[
            { label:'Net Worth', val:'Rp 0', color:'rgba(255,255,255,.9)' },
            { label:'Bulan ini', val:'Surplus', color:'#4ade80' },
          ].map(({label, val, color}) => (
            <div key={label} style={{ background:'rgba(255,255,255,.06)', borderRadius:12, padding:'16px', border:'1px solid rgba(255,255,255,.08)' }}>
              <p style={{ color:'rgba(255,255,255,.4)', fontSize:11, margin:'0 0 6px', letterSpacing:'.06em', textTransform:'uppercase' }}>{label}</p>
              <p style={{ color, fontSize:20, fontWeight:600, margin:0, letterSpacing:'-.02em' }}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* right panel — form */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        background: 'var(--surface)',
      }}>
        <div style={{ width:'100%', maxWidth:400 }}>

          {/* mobile logo */}
          <div className="mobile-logo" style={{ marginBottom:40, display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, background:'var(--ink)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'white', fontSize:18 }}>◈</span>
            </div>
            <span style={{ fontWeight:600, fontSize:20, letterSpacing:'-.02em' }}>fintrack</span>
          </div>

          {/* heading */}
          <div className="animate-fade-up" style={{ marginBottom:32 }}>
            <h1 style={{ fontSize:28, fontWeight:600, letterSpacing:'-.03em', margin:'0 0 6px', color:'var(--ink)' }}>
              {isSignUp ? 'Buat akun' : 'Selamat datang'}
            </h1>
            <p style={{ color:'var(--ink-muted)', fontSize:14, margin:0 }}>
              {isSignUp ? 'Mulai lacak keuanganmu hari ini' : 'Masuk untuk melanjutkan ke dashboard'}
            </p>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="animate-fade-up animate-delay-100">
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

              {isSignUp && (
                <div>
                  <label style={labelStyle}>Nama lengkap</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nama kamu"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              )}

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="kamu@email.com"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {error && (
                <div style={{ background:'var(--red-soft)', border:'1px solid #fca5a5', borderRadius:'var(--radius-md)', padding:'10px 14px', fontSize:13, color:'var(--red)' }}>
                  {error}
                </div>
              )}

              {message && (
                <div style={{ background:'var(--green-soft)', border:'1px solid #86efac', borderRadius:'var(--radius-md)', padding:'10px 14px', fontSize:13, color:'var(--green)' }}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width:'100%',
                  padding:'13px',
                  background: loading ? 'var(--ink-faint)' : 'var(--ink)',
                  color:'white',
                  border:'none',
                  borderRadius:'var(--radius-md)',
                  fontSize:14,
                  fontWeight:500,
                  fontFamily:'var(--font-sans)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition:'all .15s',
                  letterSpacing:'-.01em',
                  marginTop:4,
                }}
                onMouseEnter={e => { if(!loading) e.target.style.background='var(--ink-soft)' }}
                onMouseLeave={e => { if(!loading) e.target.style.background='var(--ink)' }}
              >
                {loading ? 'Memproses...' : isSignUp ? 'Buat akun' : 'Masuk'}
              </button>

            </div>
          </form>

          {/* toggle */}
          <p className="animate-fade-up animate-delay-200" style={{ marginTop:24, fontSize:13, color:'var(--ink-muted)', textAlign:'center' }}>
            {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
            <button
              onClick={toggle}
              style={{ color:'var(--ink)', fontWeight:500, background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-sans)', fontSize:13, textDecoration:'underline', textUnderlineOffset:2 }}
            >
              {isSignUp ? 'Masuk di sini' : 'Daftar gratis'}
            </button>
          </p>

        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .left-panel { display: flex !important; }
          .mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  )
}

const labelStyle = {
  display:'block',
  fontSize:12,
  fontWeight:500,
  color:'var(--ink-soft)',
  marginBottom:6,
  letterSpacing:'.01em',
}

const inputStyle = {
  width:'100%',
  padding:'11px 14px',
  border:'1.5px solid var(--border)',
  borderRadius:'var(--radius-md)',
  fontSize:14,
  fontFamily:'var(--font-sans)',
  color:'var(--ink)',
  background:'var(--white)',
  outline:'none',
  transition:'border-color .15s',
  boxSizing:'border-box',
}
