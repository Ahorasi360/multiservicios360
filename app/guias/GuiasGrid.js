'use client';
import Link from 'next/link';

export default function GuiasGrid({ guides, lang }) {
  const isEn = lang === 'en';
  return (
    <div style={{ maxWidth: '900px', margin: '-32px auto 0', padding: '0 16px 64px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {guides.map(g => (
          <Link key={g.slug} href={isEn ? `/en/guias/${g.slug}` : `/guias/${g.slug}`} style={{ textDecoration: 'none' }}>
            <div
              style={{ backgroundColor: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `4px solid ${g.color}`, cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{g.emoji}</div>
              <div style={{ display: 'inline-block', backgroundColor: '#F0FDF4', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', marginBottom: '10px' }}>
                {isEn ? 'FREE' : 'GRATIS'} · {g.pages}
              </div>
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '8px', lineHeight: '1.3' }}>{g.title}</h2>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', marginBottom: '16px' }}>{g.desc.substring(0, 110)}...</p>
              <span style={{ fontSize: '13px', fontWeight: '600', color: g.color }}>
                {isEn ? 'Download Free PDF →' : 'Descargar PDF Gratis →'}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ fontSize: '13px', color: '#94A3B8' }}>
          Multi Servicios 360 · 855.246.7274 · {isEn ? 'We are not a law firm.' : 'No somos un bufete de abogados.'}
        </p>
      </div>
      <style>{`@media (max-width: 640px) { h1 { font-size: 26px !important; } }`}</style>
    </div>
  );
}
