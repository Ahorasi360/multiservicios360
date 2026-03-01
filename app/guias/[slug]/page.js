'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

const GUIDES = {
  'testamento-simple': {
    emoji: '📄',
    title: 'Guía Completa: Testamento Simple en California',
    subtitle: 'Todo lo que necesita saber sobre Last Will & Testament — 2026',
    desc: 'Aprenda qué es un testamento simple, cuándo lo necesita, qué incluye bajo las leyes de California, y cómo preparar el suyo en línea hoy mismo.',
    bullets: ['¿Qué es y para qué sirve?', 'Requisitos legales en California 2026', 'Qué incluye su testamento', '¿Cuándo NO es suficiente un testamento?', 'Preguntas frecuentes y respuestas claras'],
    pages: '8 páginas',
    docUrl: '/simple-will',
    docLabel: 'Preparar Mi Testamento — $149',
    color: '#1E3A8A',
  },
  'testamento-traspaso': {
    emoji: '📜',
    title: 'Guía Completa: Pour-Over Will en California',
    subtitle: 'El complemento esencial de su Fideicomiso en Vida — 2026',
    desc: 'Descubra por qué un Pour-Over Will es indispensable si tiene un fideicomiso, cómo funciona, y qué pasa con sus bienes si no lo tiene.',
    bullets: ['¿Qué es un Pour-Over Will?', 'Por qué lo necesita con su fideicomiso', 'Qué incluye el documento', '¿Pasan los bienes por probate?', 'Diferencia con testamento simple'],
    pages: '7 páginas',
    docUrl: '/pour-over-will',
    docLabel: 'Preparar Mi Pour-Over Will — $199',
    color: '#7C3AED',
  },
  'hipaa-authorization': {
    emoji: '🏥',
    title: 'Guía Completa: Autorización HIPAA en California',
    subtitle: 'Acceso médico para su familia en emergencias — 2026',
    desc: 'Entienda por qué la Autorización HIPAA es crítica, especialmente para la comunidad latina. Sin este documento, su familia no puede acceder a su información médica.',
    bullets: ['¿Qué es la ley HIPAA?', 'Por qué es esencial para familias latinas', 'Quién puede ser su agente médico', 'Diferencia con el poder médico', 'Cómo revocarla si cambia de opinión'],
    pages: '7 páginas',
    docUrl: '/hipaa-authorization',
    docLabel: 'Preparar Mi Autorización HIPAA — $99',
    color: '#DC2626',
  },
  'certificacion-fideicomiso': {
    emoji: '🔏',
    title: 'Guía Completa: Certificación de Fideicomiso',
    subtitle: 'El documento que los bancos siempre piden — California 2026',
    desc: 'Sepa por qué todos los bancos, compañías de títulos y instituciones requieren la Certificación de Fideicomiso, y qué información debe incluir.',
    bullets: ['¿Qué es y por qué la piden?', 'Diferencia con el fideicomiso completo', 'Qué información incluye', 'Cuántas copias necesita', 'Cuándo actualizar su certificación'],
    pages: '7 páginas',
    docUrl: '/certification-of-trust',
    docLabel: 'Preparar Mi Certificación — $99',
    color: '#059669',
  },
  's-corporation': {
    emoji: '🏢',
    title: 'Guía Completa: Formación de S-Corporation en California',
    subtitle: 'Proteja su negocio y optimice sus impuestos — 2026',
    desc: 'Todo lo que un empresario latino en California necesita saber sobre la S-Corporation: beneficios fiscales, requisitos, paquete completo de formación, y comparación con LLC.',
    bullets: ['¿Qué es una S-Corp y cómo funciona?', 'Beneficios fiscales clave', 'Requisitos de elegibilidad', 'S-Corp vs LLC vs C-Corp', 'Qué documentos incluye el paquete'],
    pages: '9 páginas',
    docUrl: '/s-corp-formation',
    docLabel: 'Formar Mi S-Corporation — $499',
    color: '#D97706',
  },
  'c-corporation': {
    emoji: '🏛️',
    title: 'Guía Completa: Formación de C-Corporation en California',
    subtitle: 'La estructura para empresas con visión de crecimiento — 2026',
    desc: 'Descubra cuándo una C-Corp es mejor que una S-Corp o LLC, cómo atraer inversionistas, y qué documentos necesita para incorporarse correctamente en California.',
    bullets: ['¿Qué es una C-Corp?', 'Cuándo es la mejor opción', 'C-Corp vs S-Corp — comparación detallada', 'Requisitos para inversionistas', 'Paquete completo de incorporación'],
    pages: '8 páginas',
    docUrl: '/c-corp-formation',
    docLabel: 'Formar Mi C-Corporation — $499',
    color: '#B45309',
  },
  'actas-corporativas': {
    emoji: '📋',
    title: 'Guía Completa: Actas Corporativas en California',
    subtitle: 'Cómo proteger su corporate veil — Corporate Minutes 2026',
    desc: 'Aprenda por qué las actas corporativas son obligatorias, qué pasa si no las tiene, qué tipos necesita, y cómo prepararlas correctamente para su S-Corp o C-Corp.',
    bullets: ['¿Qué son y por qué son obligatorias?', 'Tipos de actas que necesita', '¿Qué es el "corporate veil"?', 'Con qué frecuencia prepararlas', 'Actas retroactivas — ¿es posible?'],
    pages: '8 páginas',
    docUrl: '/corporate-minutes',
    docLabel: 'Preparar Mis Actas Corporativas — $149',
    color: '#0284C7',
  },
  'resolucion-bancaria': {
    emoji: '🏦',
    title: 'Guía Completa: Resolución Bancaria Corporativa',
    subtitle: 'Lo que su banco requiere para cuentas e inversiones — 2026',
    desc: 'Entienda qué es la Resolución Bancaria, por qué todos los bancos la exigen, qué debe incluir, y cómo autorizar a representantes de su empresa correctamente.',
    bullets: ['¿Qué es y cuándo se necesita?', 'Por qué los bancos siempre la piden', 'Qué información incluye', 'Múltiples niveles de autoridad', 'Cuándo actualizarla'],
    pages: '7 páginas',
    docUrl: '/banking-resolution',
    docLabel: 'Preparar Mi Resolución Bancaria — $99',
    color: '#065F46',
  },
};

export default function GuiaPage({ params }) {
  const { slug } = params;
  const guide = GUIDES[slug];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  if (!guide) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#64748B' }}>Guía no encontrada.</p>
          <Link href="/mas-servicios" style={{ color: '#1E3A8A', fontWeight: '700' }}>← Ver todos los servicios</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/guides/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, email, phone }),
      });
      const data = await res.json();
      if (data.success) {
        setDownloadUrl(data.downloadUrl);
        setDone(true);
      } else {
        setError('Hubo un error. Por favor intente de nuevo.');
      }
    } catch {
      setError('Hubo un error de conexión. Por favor intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Navbar lang="es" currentPath={`/guias/${slug}`} />

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${guide.color} 0%, #0F172A 100%)`, padding: '48px 16px 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>{guide.emoji}</div>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.05em' }}>
            GUÍA GRATUITA 2026
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
              📄 Qué incluye esta guía
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
              <span style={{ fontSize: '13px', color: '#166534', fontWeight: '600' }}>✅ 100% Gratis</span>
              <span style={{ fontSize: '13px', color: '#166534', fontWeight: '600' }}>🌐 En Español</span>
            </div>

            {/* Doc CTA */}
            <div style={{ marginTop: '24px', borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>¿Listo para preparar su documento?</p>
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
                  📥 Descargar Guía Gratis
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
                  Ingrese sus datos para acceder a la guía completa en PDF. La recibirá también por email.
                </p>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder="Juan García"
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#1E3A8A'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                      Correo electrónico *
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
                      Teléfono <span style={{ color: '#9CA3AF', fontWeight: '400' }}>(opcional)</span>
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
                    {loading ? 'Enviando...' : '📥 Descargar Guía Gratis'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'center', marginTop: '12px' }}>
                    🔒 Sus datos son privados. No los compartimos con terceros.
                  </p>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                  ¡Su guía está lista!
                </h2>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
                  También le enviamos un email con el link de descarga a <b>{email}</b>
                </p>
                <a
                  href={downloadUrl}
                  download
                  style={{ display: 'block', padding: '14px 24px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', marginBottom: '12px' }}
                >
                  📥 Descargar PDF Ahora
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
            No somos un bufete de abogados. Plataforma de preparación de documentos de autoayuda bilingüe en California.
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
