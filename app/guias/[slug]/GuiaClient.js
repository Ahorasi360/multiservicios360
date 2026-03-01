'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function GuiaClient({ guide, slug, lang = 'es' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const isEs = lang === 'es';
  const currentPath = isEs ? `/guias/${slug}` : `/en/guias/${slug}`;
  const altUrl = isEs ? `/en/guias/${slug}` : `/guias/${slug}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/guides/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, email, phone, lang }),
      });
      const data = await res.json();
      if (data.success) {
        setDownloadUrl(data.downloadUrl);
        setDone(true);
      } else {
        setError(isEs ? 'Hubo un error. Por favor intente de nuevo.' : 'An error occurred. Please try again.');
      }
    } catch {
      setError(isEs ? 'Hubo un error de conexión. Por favor intente de nuevo.' : 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Navbar lang={lang} currentPath={currentPath} langSwitchUrl={altUrl} />

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${guide.color} 0%, #0F172A 100%)`, padding: '48px 16px 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>{guide.emoji}</div>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.05em' }}>
            {isEs ? 'GUÍA GRATUITA 2026' : 'FREE GUIDE 2026'}
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '12px', lineHeight: '1.3' }}>{guide.title}</h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>{guide.subtitle}</p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '-32px auto 0', padding: '0 16px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Left: What's inside */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', marginBottom: '16px' }}>
              📄 {isEs ? 'Qué incluye esta guía' : 'What this guide includes'}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px', lineHeight: '1.6' }}>{guide.desc}</p>
            <div style={{ marginBottom: '20px' }}>
              {guide.bullets.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: '#10B981', fontWeight: '700', fontSize: '16px', marginTop: '1px' }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#374151' }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#166534', fontWeight: '600' }}>📖 {guide.pages}</span>
              <span style={{ fontSize: '13px', color: '#166534', fontWeight: '600' }}>✅ {isEs ? '100% Gratis' : '100% Free'}</span>
              <span style={{ fontSize: '13px', color: '#166534', fontWeight: '600' }}>🌐 {isEs ? 'En Español' : 'Bilingual'}</span>
            </div>

            {/* Doc CTA */}
            <div style={{ marginTop: '24px', borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>
                {isEs ? '¿Listo para preparar su documento?' : 'Ready to prepare your document?'}
              </p>
              <Link href={guide.docUrl} style={{ display: 'block', padding: '12px 20px', backgroundColor: guide.color, color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textAlign: 'center' }}>
                {guide.docLabel} →
              </Link>
            </div>
          </div>

          {/* Right: Form */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            {!done ? (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                  📥 {isEs ? 'Descargar Guía Gratis' : 'Download Free Guide'}
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
                  {isEs
                    ? 'Ingrese sus datos para acceder a la guía completa en PDF. La recibirá también por email.'
                    : 'Enter your information to access the complete PDF guide. You\'ll also receive it by email.'}
                </p>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                      {isEs ? 'Nombre completo *' : 'Full name *'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder={isEs ? 'Juan García' : 'John Smith'}
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#1E3A8A'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                      {isEs ? 'Correo electrónico *' : 'Email address *'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="juan@email.com"
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#1E3A8A'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                      {isEs ? 'Teléfono' : 'Phone'} <span style={{ color: '#9CA3AF', fontWeight: '400' }}>({isEs ? 'opcional' : 'optional'})</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#1E3A8A'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>

                  {error && (
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#DC2626' }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '13px', backgroundColor: loading ? '#94A3B8' : '#1E3A8A', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer' }}
                  >
                    {loading ? (isEs ? 'Enviando...' : 'Sending...') : (isEs ? '📥 Descargar Guía Gratis' : '📥 Download Free Guide')}
                  </button>

                  <p style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'center', marginTop: '12px' }}>
                    🔒 {isEs ? 'Sus datos son privados. No los compartimos con terceros.' : 'Your information is private. We never share it with third parties.'}
                  </p>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                  {isEs ? '¡Su guía está lista!' : 'Your guide is ready!'}
                </h2>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
                  {isEs
                    ? <>También le enviamos un email con el link de descarga a <b>{email}</b></>
                    : <>We also sent a download link to <b>{email}</b></>}
                </p>
                <a
                  href={downloadUrl}
                  download
                  style={{ display: 'block', padding: '14px 24px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', marginBottom: '12px' }}
                >
                  📥 {isEs ? 'Descargar PDF Ahora' : 'Download PDF Now'}
                </a>
                <Link
                  href={guide.docUrl}
                  style={{ display: 'block', padding: '12px 24px', backgroundColor: '#F59E0B', color: '#1E3A8A', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px' }}
                >
                  {guide.docLabel} →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ fontSize: '12px', color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
            Multi Servicios 360 · 855.246.7274 · multiservicios360.net<br/>
            {isEs
              ? 'No somos un bufete de abogados. Plataforma de preparación de documentos de autoayuda bilingüe en California.'
              : 'We are not a law firm. Bilingual self-help document preparation platform in California.'}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
