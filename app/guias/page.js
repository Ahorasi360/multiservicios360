import Link from 'next/link';
import Navbar from '../components/Navbar';
import { GUIDES } from '../../lib/guides-config';

export const metadata = {
  title: 'Guías Gratuitas de Documentos Legales | Multi Servicios 360',
  description: 'Descargue guías gratuitas en español sobre testamentos, fideicomiso, actas corporativas, y más. Recursos educativos para la comunidad latina en California.',
  alternates: {
    canonical: 'https://multiservicios360.net/guias',
    languages: {
      'es': 'https://multiservicios360.net/guias',
      'en': 'https://multiservicios360.net/en/guias',
      'x-default': 'https://multiservicios360.net/guias',
    },
  },
  robots: { index: true, follow: true },
};

export default function GuiasPage() {
  const guides = Object.entries(GUIDES).map(([slug, g]) => ({ slug, ...g.es, emoji: g.emoji, color: g.color }));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Navbar lang="es" currentPath="/guias" langSwitchUrl="/en/guias" />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', padding: '56px 16px 64px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.05em' }}>
            RECURSOS GRATUITOS 2026
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'white', marginBottom: '12px', lineHeight: '1.2' }}>
            📚 Guías Gratuitas de Documentos Legales
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', maxWidth: '560px', margin: '0 auto' }}>
            Recursos educativos en español para ayudar a la comunidad latina en California a entender sus opciones legales.
          </p>
        </div>
      </div>

      {/* Guides grid */}
      <div style={{ maxWidth: '900px', margin: '-32px auto 0', padding: '0 16px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {guides.map(g => (
            <Link key={g.slug} href={`/guias/${g.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `4px solid ${g.color}`, transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{g.emoji}</div>
                <div style={{ display: 'inline-block', backgroundColor: '#F0FDF4', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', marginBottom: '10px' }}>
                  GRATIS · {g.pages}
                </div>
                <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '8px', lineHeight: '1.3' }}>{g.title}</h2>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', marginBottom: '16px' }}>{g.desc.substring(0, 100)}...</p>
                <span style={{ fontSize: '13px', fontWeight: '600', color: g.color }}>Descargar PDF Gratis →</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ fontSize: '13px', color: '#94A3B8' }}>
            Multi Servicios 360 · 855.246.7274 · No somos un bufete de abogados.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          h1 { font-size: 26px !important; }
        }
      `}</style>
    </div>
  );
}
