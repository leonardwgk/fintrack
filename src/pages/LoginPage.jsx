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
      if (password.length < 8) {
        setError('Password minimal 8 karakter.')
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) setError(error.message)
      else setMessage('Akun berhasil dibuat. Silakan masuk.')
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

      {/* left panel — statement */}
      <div className="left-panel" style={{
        display: 'none',
        flex: 1,
        background: 'var(--ink)',
        padding: 48,
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(181,138,62,.10)', pointerEvents: 'none' }} />
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .05 }} viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 9 }).map((_, i) => <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="700" stroke="#fff" strokeWidth=".5" />)}
          {Array.from({ length: 15 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke="#fff" strokeWidth=".5" />)}
        </svg>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 34, height: 34, background: 'var(--brass)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 17 }}>◈</div>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 19, letterSpacing: '-.02em' }}>fintrack</span>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow" style={{ color: 'rgba(255,255,255,.5)', fontSize: 14, marginBottom: 18 }}>Buku besar pribadimu</p>
          <h2 className="serif" style={{ color: '#fff', fontSize: 34, fontWeight: 500, lineHeight: 1.25, letterSpacing: '-.01em', margin: 0 }}>
            Kenali asetmu.<br />
            Kuasai jatahmu.<br />
            <em style={{ color: 'var(--brass)' }}>Cocokkan setiap rupiah.</em>
          </h2>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Net worth', val: 'Rp 0', color: '#fff', tick: true },
            { label: 'Bulan ini', val: 'Surplus', color: '#7bd3a8', tick: false },
          ].map(({ label, val, color, tick }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 14, padding: 16, border: '1px solid rgba(255,255,255,.08)' }}>
              <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 11, margin: '0 0 7px', letterSpacing: '.08em', textTransform: 'uppercase' }}>{label}</p>
              <p className="mono" style={{ color, fontSize: 19, fontWeight: 500, margin: 0, letterSpacing: '-.02em' }}>{val}</p>
              {tick && <span className="tick" style={{ marginTop: 9 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', background: 'var(--paper)' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <div className="mobile-logo" style={{ marginBottom: 40, display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 38, height: 38, background: 'var(--brass)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 19 }}>◈</div>
            <span style={{ fontWeight: 600, fontSize: 21, letterSpacing: '-.02em' }}>fintrack</span>
          </div>

          <div className="animate-fade-up" style={{ marginBottom: 30 }}>
            <p className="eyebrow" style={{ margin: '0 0 4px' }}>{isSignUp ? 'Mulai gratis' : 'Selamat datang kembali'}</p>
            <h1 className="serif" style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-.02em', margin: 0, color: 'var(--ink)' }}>
              {isSignUp ? 'Buat akun' : 'Masuk'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="animate-fade-up animate-delay-100">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>

              {isSignUp && (
                <div>
                  <label style={labelStyle}>Nama lengkap</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Nama kamu" style={inputStyle} {...focusProps} />
                </div>
              )}

              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="kamu@email.com" style={inputStyle} {...focusProps} />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={isSignUp ? 'Minimal 8 karakter' : 'Password'}
                  minLength={isSignUp ? 8 : undefined}
                  style={inputStyle} {...focusProps}
                />
              </div>

              {error && (
                <div style={{ background: 'var(--red-soft)', border: '1px solid color-mix(in srgb, var(--red) 30%, transparent)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--red)' }}>{error}</div>
              )}
              {message && (
                <div style={{ background: 'var(--green-soft)', border: '1px solid color-mix(in srgb, var(--green) 30%, transparent)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--green)' }}>{message}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: 14, minHeight: 50,
                  background: loading ? 'var(--ink-faint)' : 'var(--ink)',
                  color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                  fontSize: 15, fontWeight: 500, fontFamily: 'var(--font-sans)',
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .15s',
                  letterSpacing: '-.01em', marginTop: 4,
                }}
                onMouseEnter={e => { if (!loading) e.target.style.opacity = '.88' }}
                onMouseLeave={e => { if (!loading) e.target.style.opacity = '1' }}
              >
                {loading ? 'Memproses…' : isSignUp ? 'Buat akun' : 'Masuk'}
              </button>
            </div>
          </form>

          <p className="animate-fade-up animate-delay-200" style={{ marginTop: 24, fontSize: 13.5, color: 'var(--ink-muted)', textAlign: 'center' }}>
            {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
            <button onClick={toggle} style={{ color: 'var(--brass)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13.5, textDecoration: 'underline', textUnderlineOffset: 2 }}>
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
  display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 7, letterSpacing: '.01em',
}

const inputStyle = {
  width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)',
  fontSize: 15, fontFamily: 'var(--font-sans)', color: 'var(--ink)', background: 'var(--bone)',
  outline: 'none', transition: 'border-color .15s, box-shadow .15s', boxSizing: 'border-box',
}

const focusProps = {
  onFocus: (e) => { e.target.style.borderColor = 'var(--brass)'; e.target.style.boxShadow = '0 0 0 3px var(--brass-soft)' },
  onBlur: (e) => { e.target.style.borderColor = 'var(--line)'; e.target.style.boxShadow = 'none' },
}
