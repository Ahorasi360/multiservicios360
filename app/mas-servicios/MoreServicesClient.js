'use client';
import { useState } from 'react';
import Link from 'next/link';

const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>);

// Service card icons as SVG components
const CarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>);
const ScrollIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/></svg>);
const XCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>);
const MailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>);
const DollarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>);
const UsersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const PlaneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>);

const TRANSLATIONS = {
  es: {
    nav: { home: 'Inicio', services: 'Servicios Principales', contact: 'Contacto' },
    hero: {
      title: 'Más Servicios de Documentos',
      subtitle: 'Documentos legales accesibles y asequibles para la comunidad latina en California',
      description: 'Prepare sus propios documentos legales usando nuestra plataforma de software guiada. Todo en español e inglés.',
    },
    disclaimer: 'Este servicio proporciona acceso únicamente a software de preparación de documentos. Multiservicios 360 no brinda asesoría legal, no redacta documentos por usted y no es un bufete de abogados.',
    available: 'DISPONIBLE',
    cta: 'Iniciar',
    backHome: '← Regresar al Inicio',
    features: {
      bilingual: '100% Bilingüe',
      selfHelp: 'Usted Prepara',
      vault: 'Bóveda Digital',
      fast: 'Rápido y Fácil',
    },
    services: {
      billOfSale: {
        title: 'Carta de Venta',
        subtitle: 'Bill of Sale',
        desc: 'Documente la venta de vehículos, equipos u otros bienes personales con un documento legal válido en California.',
        price: 'Desde $69',
        tags: ['Vehículos', 'Equipos', 'Bienes Personales'],
      },
      affidavit: {
        title: 'Declaración Jurada',
        subtitle: 'Affidavit',
        desc: 'Una declaración escrita bajo juramento para verificar hechos ante instituciones, tribunales o agencias gubernamentales.',
        price: 'Desde $89',
        tags: ['Bajo Juramento', 'Verificación', 'Notarización'],
      },
      revocationPoa: {
        title: 'Revocación de Poder Notarial',
        subtitle: 'Revocation of POA',
        desc: 'Revoque formalmente un poder notarial existente. Proteja sus intereses cancelando la autorización otorgada.',
        price: 'Desde $59',
        tags: ['Cancelación', 'Protección', 'Notarización'],
      },
      authorizationLetter: {
        title: 'Carta de Autorización',
        subtitle: 'Authorization Letter',
        desc: 'Autorice a otra persona para actuar en su nombre para trámites escolares, médicos, bancarios o gubernamentales.',
        price: 'Desde $49',
        tags: ['Escuela', 'Médico', 'Bancario'],
      },
      promissoryNote: {
        title: 'Pagaré',
        subtitle: 'Promissory Note',
        desc: 'Formalice préstamos entre familiares, amigos o socios con un documento legal que protege a ambas partes.',
        price: 'Desde $89',
        tags: ['Préstamos', 'Familia', 'Negocios'],
      },
      guardianship: {
        title: 'Designación de Guardián',
        subtitle: 'Guardianship Designation',
        desc: 'Designe a una persona de confianza como guardián de sus hijos menores en caso de emergencia o fallecimiento.',
        price: 'Desde $129',
        tags: ['Hijos Menores', 'Emergencia', 'Protección'],
      },
      travelAuthorization: {
        title: 'Carta de Autorización de Viaje',
        subtitle: 'Travel Authorization Letter',
        desc: 'Autorice a otra persona para viajar internacionalmente con su hijo(a) menor. Esencial para cruces de frontera con México y Centroamérica.',
        price: '$49',
        tags: ['Viaje', 'Menores', 'Internacional'],
      },
    },
    moreComing: '¿Necesita otro tipo de documento?',
    moreComingDesc: 'Estamos constantemente agregando nuevos documentos a nuestra plataforma. Contáctenos para consultas.',
    contactUs: 'Contáctenos',
  },
  en: {
    nav: { home: 'Home', services: 'Main Services', contact: 'Contact' },
    hero: {
      title: 'Additional Document Services',
      subtitle: 'Accessible and affordable legal documents for the Latino community in California',
      description: 'Prepare your own legal documents using our guided software platform. Everything in Spanish and English.',
    },
    disclaimer: 'This service provides access to document-preparation software only. Multiservicios 360 does not provide legal advice, does not draft documents on your behalf, and does not act as a law firm.',
    available: 'AVAILABLE',
    cta: 'Start',
    backHome: '← Back to Home',
    features: {
      bilingual: '100% Bilingual',
      selfHelp: 'Self-Prepared',
      vault: 'Digital Vault',
      fast: 'Fast & Easy',
    },
    services: {
      billOfSale: {
        title: 'Bill of Sale',
        subtitle: 'Carta de Venta',
        desc: 'Document the sale of vehicles, equipment, or other personal property with a legally valid California document.',
        price: 'From $69',
        tags: ['Vehicles', 'Equipment', 'Personal Property'],
      },
      affidavit: {
        title: 'Affidavit',
        subtitle: 'Declaración Jurada',
        desc: 'A sworn written statement to verify facts before institutions, courts, or government agencies.',
        price: 'From $89',
        tags: ['Sworn Statement', 'Verification', 'Notarization'],
      },
      revocationPoa: {
        title: 'Revocation of Power of Attorney',
        subtitle: 'Revocación de Poder Notarial',
        desc: 'Formally revoke an existing power of attorney. Protect your interests by canceling the granted authorization.',
        price: 'From $59',
        tags: ['Cancellation', 'Protection', 'Notarization'],
      },
      authorizationLetter: {
        title: 'Authorization Letter',
        subtitle: 'Carta de Autorización',
        desc: 'Authorize another person to act on your behalf for school, medical, banking, or government matters.',
        price: 'From $49',
        tags: ['School', 'Medical', 'Banking'],
      },
      promissoryNote: {
        title: 'Promissory Note',
        subtitle: 'Pagaré',
        desc: 'Formalize loans between family, friends, or partners with a legal document that protects both parties.',
        price: 'From $89',
        tags: ['Loans', 'Family', 'Business'],
      },
      guardianship: {
        title: 'Guardianship Designation',
        subtitle: 'Designación de Guardián',
        desc: 'Designate a trusted person as guardian of your minor children in case of emergency or death.',
        price: 'From $129',
        tags: ['Minor Children', 'Emergency', 'Protection'],
      },
      travelAuthorization: {
        title: 'Travel Authorization Letter',
        subtitle: 'Carta de Autorización de Viaje',
        desc: 'Authorize another person to travel internationally with your minor child. Essential for border crossings with Mexico and Central America.',
        price: '$49',
        tags: ['Travel', 'Minors', 'International'],
      },
    },
    moreComing: 'Need a different type of document?',
    moreComingDesc: 'We are constantly adding new documents to our platform. Contact us for inquiries.',
    contactUs: 'Contact Us',
  },
};

const SERVICES = [
  { key: 'billOfSale', href: '/bill-of-sale', Icon: CarIcon, color: '#2563EB', bgColor: '#EFF6FF' },
  { key: 'affidavit', href: '/affidavit', Icon: ScrollIcon, color: '#7C3AED', bgColor: '#F5F3FF' },
  { key: 'revocationPoa', href: '/revocation-poa', Icon: XCircleIcon, color: '#DC2626', bgColor: '#FEF2F2' },
  { key: 'authorizationLetter', href: '/authorization-letter', Icon: MailIcon, color: '#059669', bgColor: '#ECFDF5' },
  { key: 'promissoryNote', href: '/promissory-note', Icon: DollarIcon, color: '#D97706', bgColor: '#FFFBEB' },
  { key: 'guardianship', href: '/guardianship', Icon: UsersIcon, color: '#BE185D', bgColor: '#FDF2F8' },
  { key: 'travelAuthorization', href: '/travel-authorization', Icon: PlaneIcon, color: '#0284C7', bgColor: '#F0F9FF' },
];

export default function MoreServicesClient({ lang = 'es' }) {
  const language = lang;
  const [menuOpen, setMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <style>{`
        @media (max-width: 768px) {
          .services-grid-2 { grid-template-columns: 1fr !important; }
          .features-row { grid-template-columns: 1fr 1fr !important; }
          .hero-title { font-size: 28px !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '11px' }}>M360</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>Multi Servicios 360</div>
                <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Document Preparation</div>
              </div>
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/#services" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{t.nav.services}</Link>
            <Link href="/por-que-nosotros" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{language === 'es' ? '¿Por Qué Nosotros?' : 'Why Us?'}</Link>
            <Link href="/nuestra-historia" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{language === 'es' ? 'Nuestra Historia' : 'Our Story'}</Link>
            <Link href="/blog" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>Blog</Link>
            <Link href="/contacto" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{t.nav.contact}</Link>
            <Link href={language === 'es' ? '/en/more-services' : '/mas-servicios'} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', fontWeight: '500', fontSize: '13px', color: '#374151', textDecoration: 'none' }}>
              <GlobeIcon /> {language === 'es' ? 'EN' : 'ES'}
            </Link>
            <a href="tel:8552467274" style={{ padding: '8px 16px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px' }}>855.246.7274</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #2563EB 100%)', padding: '60px 16px', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>{t.backHome}</Link>
          <h1 className="hero-title" style={{ fontSize: '40px', fontWeight: '800', margin: '16px 0 12px', lineHeight: '1.2' }}>{t.hero.title}</h1>
          <p style={{ fontSize: '18px', color: '#BFDBFE', marginBottom: '8px' }}>{t.hero.subtitle}</p>
          <p style={{ fontSize: '14px', color: '#93C5FD', maxWidth: '600px', margin: '0 auto' }}>{t.hero.description}</p>
        </div>
      </section>

      {/* Features row */}
      <section style={{ backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '20px 16px' }}>
        <div className="features-row" style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
          {Object.entries(t.features).map(([key, label]) => (
            <div key={key} style={{ padding: '8px', fontSize: '13px', fontWeight: '600', color: '#1E3A8A' }}>
              {key === 'bilingual' && '🌎'} {key === 'selfHelp' && '✍️'} {key === 'vault' && '🔒'} {key === 'fast' && '⚡'} {label}
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 0' }}>
        <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', padding: '12px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#92400E', margin: 0, lineHeight: '1.6' }}>{t.disclaimer}</p>
        </div>
      </div>

      {/* Service Cards */}
      <section style={{ padding: '40px 16px 60px' }}>
        <div className="services-grid-2" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {SERVICES.map(({ key, href, Icon, color, bgColor }) => {
            const svc = t.services[key];
            return (
              <div key={key} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: `2px solid ${color}`, boxShadow: `0 4px 12px ${color}26` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '56px', height: '56px', backgroundColor: bgColor, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                    <Icon />
                  </div>
                  <div>
                    <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '600', marginBottom: '4px', display: 'inline-block' }}>✓ {t.available}</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', margin: 0 }}>{svc.title}</h3>
                    <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '2px 0 0' }}>{svc.subtitle}</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '12px', lineHeight: '1.5' }}>{svc.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                  {svc.tags.map((tag, i) => (
                    <span key={i} style={{ backgroundColor: bgColor, color: color, padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '500' }}>{tag}</span>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: color }}>{svc.price}</span>
                  <Link href={href} style={{ padding: '10px 24px', backgroundColor: color, color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px' }}>
                    {t.cta} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* More Coming */}
        <div style={{ maxWidth: '600px', margin: '40px auto 0', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', border: '2px dashed #CBD5E1' }}>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>{t.moreComing}</p>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>{t.moreComingDesc}</p>
            <Link href="/contacto" style={{ padding: '10px 24px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px' }}>
              {t.contactUs} →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F172A', color: 'white', padding: '40px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3B82F6, #1E3A8A)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '800' }}>M360</div>
              <span style={{ fontWeight: '700' }}>Multi Servicios 360</span>
            </div>
            <p style={{ fontSize: '13px', color: '#94A3B8', maxWidth: '300px', lineHeight: '1.5' }}>
              {language === 'es'
                ? 'Plataforma de preparación de documentos legales de autoayuda para la comunidad latina en California.'
                : 'Self-help legal document preparation platform for the Latino community in California.'}
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>{language === 'es' ? 'Contacto' : 'Contact'}</h4>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '2' }}>
              855.246.7274<br />
              info@multiservicios360.net<br />
              support@multiservicios360.net<br />
              {language === 'es' ? 'Lun - Vie: 9am - 6pm' : 'Mon - Fri: 9am - 6pm'}
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>{language === 'es' ? 'Servicios' : 'Services'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Link href="/poa" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>{language === 'es' ? 'Poder Notarial General' : 'General Power of Attorney'}</Link>
              <Link href="/limited-poa" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>{language === 'es' ? 'Poder Notarial Limitado' : 'Limited Power of Attorney'}</Link>
              <Link href="/trust" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>{language === 'es' ? 'Fideicomiso en Vida' : 'California Living Trust'}</Link>
              <Link href="/llc" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>{language === 'es' ? 'Formación de LLC' : 'LLC Formation'}</Link>
              {SERVICES.map(({ key, href }) => (
                <Link key={key} href={href} style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>
                  {t.services[key].title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '24px auto 0', paddingTop: '20px', borderTop: '1px solid #1E293B', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.6' }}>
            Multi Servicios 360 {language === 'es' ? 'no es un bufete de abogados y no proporciona asesoría legal.' : 'is not a law firm and does not provide legal advice.'}
          </p>
          <p style={{ fontSize: '11px', color: '#475569', marginTop: '8px' }}>© 2026 Multi Servicios 360. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
        </div>
      </footer>
    </div>
  );
}
