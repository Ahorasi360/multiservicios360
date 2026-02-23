"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PartnerLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('partner_token', data.token);
        localStorage.setItem('partner_id', data.partner.id);
        localStorage.setItem('partner_name', data.partner.business_name);
        router.push('/portal/dashboard');
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }

    setLoading(false);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      padding: '32px',
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      width: '100%',
      maxWidth: '400px',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    logo: {
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#94a3b8',
      textAlign: 'center',
      marginBottom: '32px'
    },
    error: {
      backgroundColor: 'rgba(239,68,68,0.2)',
      border: '1px solid rgba(239,68,68,0.5)',
      color: '#fecaca',
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      color: '#cbd5e1',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '8px',
      color: 'white',
      fontSize: '16px',
      marginBottom: '16px',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '12px',
      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      color: 'white',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '8px'
    },
    footer: {
      marginTop: '24px',
      textAlign: 'center',
      color: '#94a3b8',
      fontSize: '14px'
    },
    link: {
      color: '#60a5fa',
      textDecoration: 'none'
    },
    backLink: {
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoText}>MS</span>
        </div>
        <h1 style={styles.title}>Partner Portal</h1>
        <p style={styles.subtitle}>Multi Servicios 360</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={styles.input}
            placeholder="partner@example.com"
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={styles.input}
            placeholder="••••••••"
            required
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          Not a partner yet?{' '}
          <a href="/contacto" style={styles.link}>Apply here</a>
        </div>

        <div style={styles.backLink}>
          <a href="/" style={{...styles.link, color: '#94a3b8'}}>← Back to main site</a>
        </div>
      </div>
    </div>
  );
}