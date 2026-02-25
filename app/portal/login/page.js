// portal/login/page - BILINGUAL ES/EN
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const T = {
  es: {
    title: 'Portal de Socios', subtitle: 'Multi Servicios 360',
    email: 'Correo electrónico', password: 'Contraseña',
    signin: 'Iniciar Sesión', signing: 'Iniciando sesión...',
    contact: 'Contacta a tu administrador para acceso',
    error_conn: 'Error de conexión. Intenta de nuevo.',
    not_partner: '¿No eres socio aún?', apply: 'Aplica aquí',
  },
  en: {
    title: 'Partner Portal', subtitle: 'Multi Servicios 360',
    email: 'Email', password: 'Password',
    signin: 'Sign In', signing: 'Signing in...',
    contact: 'Contact your administrator for access',
    error_conn: 'Connection error. Please try again.',
    not_partner: 'Not a partner yet?', apply: 'Apply here',
  }
};

export default function PartnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('es');
  const router = useRouter();
  const t = T[lang];

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.partner) {
        localStorage.setItem('partner_token', data.token);
        localStorage.setItem('partner_id', data.partner.id);
        localStorage.setItem('partner_name', data.partner.business_name);
        router.push('/portal/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(t.error_conn);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0F172A,#1E3A5F,#0F172A)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:'40px 36px', maxWidth:400, width:'100%', boxShadow:'0 25px 50px rgba(0,0,0,0.3)', textAlign:'center' }}>
        {/* Lang toggle */}
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}>
          <button onClick={()=>setLang(lang==='es'?'en':'es')} style={{ padding:'4px 12px', fontSize:12, fontWeight:600, background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:20, cursor:'pointer', color:'#475569' }}>
            {lang==='es'?'English':'Español'}
          </button>
        </div>
        <div style={{ width:56, height:56, background:'linear-gradient(135deg,#3B82F6,#06B6D4)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}><span style={{ fontSize:20, fontWeight:'bold', color:'white' }}>MS</span></div>
        <h1 style={{ fontSize:22, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>{t.title}</h1>
        <p style={{ fontSize:14, color:'#64748B', margin:'0 0 24px' }}>{t.subtitle}</p>
        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError('');}} placeholder={t.email} required
            style={{ width:'100%', padding:'12px 14px', fontSize:15, border:'2px solid #E2E8F0', borderRadius:10, outline:'none', boxSizing:'border-box', marginBottom:12 }} />
          <input type="password" value={password} onChange={e=>{setPassword(e.target.value);setError('');}} placeholder={t.password} required
            style={{ width:'100%', padding:'12px 14px', fontSize:15, border:'2px solid #E2E8F0', borderRadius:10, outline:'none', boxSizing:'border-box', marginBottom:12 }} />
          {error && <p style={{ color:'#EF4444', fontSize:14, margin:'0 0 12px' }}>❌ {error}</p>}
          <button type="submit" disabled={loading} style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#3B82F6,#06B6D4)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer', opacity:loading?0.6:1 }}>
            {loading ? t.signing : t.signin}
          </button>
        </form>
        <p style={{ fontSize:12, color:'#94A3B8', margin:'20px 0 0' }}>{t.contact}</p>
        <div style={{ marginTop:16, fontSize:13, color:'#64748B' }}>
          {t.not_partner}{' '}
          <a href="/contacto" style={{ color:'#3B82F6', textDecoration:'none' }}>{t.apply}</a>
        </div>
      </div>
    </div>
  );
}
