// app/staff/login/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.worker) {
        localStorage.setItem('staffId', data.worker.id);
        localStorage.setItem('staffName', data.worker.name);
        localStorage.setItem('staffRole', data.worker.role);
        router.push('/staff/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0F172A,#1E3A8A,#0F172A)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:'40px 36px', maxWidth:400, width:'100%', boxShadow:'0 25px 50px rgba(0,0,0,0.3)', textAlign:'center' }}>
        <div style={{ width:56, height:56, background:'linear-gradient(135deg,#059669,#10B981)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:22 }}>👷</div>
        <h1 style={{ fontSize:22, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>Staff Portal</h1>
        <p style={{ fontSize:14, color:'#64748B', margin:'0 0 24px' }}>Multi Servicios 360</p>
        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError('');}} placeholder="Email"
            required style={{ width:'100%', padding:'12px 14px', fontSize:15, border:'2px solid #E2E8F0', borderRadius:10, outline:'none', boxSizing:'border-box', marginBottom:12 }} />
          <input type="password" value={password} onChange={e=>{setPassword(e.target.value);setError('');}} placeholder="Password"
            required style={{ width:'100%', padding:'12px 14px', fontSize:15, border:'2px solid #E2E8F0', borderRadius:10, outline:'none', boxSizing:'border-box', marginBottom:12 }} />
          {error && <p style={{ color:'#EF4444', fontSize:14, margin:'0 0 12px' }}>❌ {error}</p>}
          <button type="submit" disabled={loading} style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#059669,#10B981)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer', opacity:loading?0.6:1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ fontSize:12, color:'#94A3B8', margin:'20px 0 0' }}>Contact your administrator for access</p>
      </div>
    </div>
  );
}
