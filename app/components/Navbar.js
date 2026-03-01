'use client';
import { useState } from 'react';
import Link from 'next/link';

const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);
const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const ChevronDown = () => (<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>);

export default function Navbar({ lang = 'es', currentPath = '', langSwitchUrl = null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const isEs = lang === 'es';
  const altLangUrl = langSwitchUrl || (isEs ? currentPath.replace(/^\//, '/en/').replace('/en/en/', '/en/') || '/en' : currentPath.replace(/^\/en\//, '/') || '/');
  // ^ Use explicit langSwitchUrl if provided (needed for pages with different en/es slug names)

  const t = {
    services: isEs ? 'Servicios' : 'Services',
    family: isEs ? 'Familia' : 'Family',
    business: isEs ? 'Negocios' : 'Business',
    more: isEs ? 'Más' : 'More',
    whyUs: isEs ? '¿Por Qué Nosotros?' : 'Why Us?',
    blog: 'Blog',
    guides: isEs ? 'Guías' : 'Guides',
    contact: isEs ? 'Contacto' : 'Contact',
    disclosure: isEs
      ? 'Multi Servicios 360 no es un bufete de abogados y no proporciona asesoría legal. Este es un servicio de preparación de documentos de autoayuda.'
      : 'Multi Servicios 360 is not a law firm and does not provide legal advice. This is a self-help document preparation service.',
  };

  const serviceLinks = isEs ? [
    { label: '⚖️ Poder Notarial General', url: '/poa' },
    { label: '📋 Poder Notarial Limitado', url: '/limited-poa' },
    { label: '🏡 Fideicomiso en Vida', url: '/trust' },
    { label: '🏗️ Formación de LLC', url: '/llc' },
    { label: '📄 Testamento Simple', url: '/simple-will' },
    { label: '📜 Testamento de Traspaso', url: '/pour-over-will' },
    { label: '🏥 Autorización HIPAA', url: '/hipaa-authorization' },
    { label: '🔏 Certificación de Fideicomiso', url: '/certification-of-trust' },
    { label: '🏢 S-Corporation', url: '/s-corp-formation' },
    { label: '🏛️ C-Corporation', url: '/c-corp-formation' },
    { label: '📋 Actas Corporativas', url: '/corporate-minutes' },
    { label: '🏦 Resolución Bancaria', url: '/banking-resolution' },
    { label: '👨‍👩‍👧‍👦 Planificación Familiar', url: '/planificacion-familiar' },
    { label: '🏢 Documentos de Negocios', url: '/negocios' },
    { label: '✈️ Carta de Viaje', url: '/travel-authorization' },
    { label: '📁 Todos los Servicios', url: '/mas-servicios' },
  ] : [
    { label: '⚖️ General Power of Attorney', url: '/en/poa' },
    { label: '📋 Limited Power of Attorney', url: '/en/limited-poa' },
    { label: '🏡 Living Trust', url: '/en/trust' },
    { label: '🏗️ LLC Formation', url: '/en/llc' },
    { label: '📄 Simple Will', url: '/simple-will' },
    { label: '📜 Pour-Over Will', url: '/pour-over-will' },
    { label: '🏥 HIPAA Authorization', url: '/hipaa-authorization' },
    { label: '🔏 Certification of Trust', url: '/certification-of-trust' },
    { label: '🏢 S-Corporation', url: '/s-corp-formation' },
    { label: '🏛️ C-Corporation', url: '/c-corp-formation' },
    { label: '📋 Corporate Minutes', url: '/corporate-minutes' },
    { label: '🏦 Banking Resolution', url: '/banking-resolution' },
    { label: '👨‍👩‍👧‍👦 Family Planning', url: '/en/family-planning' },
    { label: '🏢 Business Documents', url: '/en/business' },
    { label: '✈️ Travel Authorization', url: '/en/travel-authorization' },
    { label: '📁 All Services', url: '/en/more-services' },
  ];

  return (
    <>
      {/* Disclosure Banner */}
      <div style={{ backgroundColor: '#1E3A8A', color: 'rgba(255,255,255,0.85)', textAlign: 'center', padding: '6px 16px', fontSize: '11px', lineHeight: '1.4' }}>
        {t.disclosure}
      </div>

      {/* Main Nav */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>

          {/* Logo */}
          <Link href={isEs ? '/' : '/en'} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}>M360</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#1E3A8A', lineHeight: 1 }}>Multi Servicios 360</div>
              <div style={{ fontSize: '9px', color: '#64748B', letterSpacing: '0.5px', marginTop: '2px' }}>DOCUMENT PREPARATION</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">

            {/* Services Dropdown */}
            <div style={{ position: 'relative' }}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#374151', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px', padding: '8px 12px', borderRadius: '6px' }}>
                {t.services} <ChevronDown />
              </button>
              {servicesOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '8px', minWidth: '240px', zIndex: 100 }}>
                  {serviceLinks.map((link, i) => (
                    <Link key={i} href={link.url} style={{ display: 'block', padding: '10px 14px', color: '#374151', textDecoration: 'none', fontSize: '14px', borderRadius: '8px', fontWeight: '500' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href={isEs ? '/por-que-nosotros' : '/en/why-us'} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px', padding: '8px 12px' }}>{t.whyUs}</Link>
            <Link href={isEs ? '/blog' : '/en/blog'} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px', padding: '8px 12px' }}>{t.blog}</Link>
            <Link href={isEs ? '/guias' : '/en/guias'} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px', padding: '8px 12px' }}>{t.guides}</Link>
            <Link href={isEs ? '/contacto' : '/en/contact'} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px', padding: '8px 12px' }}>{t.contact}</Link>

            {/* Language toggle */}
            <Link href={altLangUrl}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', backgroundColor: '#F3F4F6', borderRadius: '6px', fontWeight: '500', fontSize: '13px', color: '#374151', textDecoration: 'none', marginLeft: '4px' }}>
              <GlobeIcon /> {isEs ? 'EN' : 'ES'}
            </Link>

            {/* Phone CTA */}
            <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', marginLeft: '4px' }}>
              <PhoneIcon /> 855.246.7274
            </a>
          </div>

          {/* Mobile right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="mobile-only">
            <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', padding: '8px', backgroundColor: '#1E3A8A', color: 'white', borderRadius: '6px', textDecoration: 'none' }}>
              <PhoneIcon />
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'flex', alignItems: 'center', padding: '8px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ backgroundColor: 'white', borderTop: '1px solid #E5E7EB', padding: '16px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.05em', padding: '8px 12px 4px', textTransform: 'uppercase' }}>{t.services}</div>
              {serviceLinks.map((link, i) => (
                <Link key={i} href={link.url} onClick={() => setMenuOpen(false)}
                  style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '15px', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                  {link.label}
                </Link>
              ))}
              <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0' }} />
              <Link href={isEs ? '/por-que-nosotros' : '/en/why-us'} onClick={() => setMenuOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '15px', padding: '10px 12px' }}>{t.whyUs}</Link>
              <Link href={isEs ? '/blog' : '/en/blog'} onClick={() => setMenuOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '15px', padding: '10px 12px' }}>{t.blog}</Link>
              <Link href={isEs ? '/guias' : '/en/guias'} onClick={() => setMenuOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '15px', padding: '10px 12px' }}>{t.guides}</Link>
              <Link href={isEs ? '/contacto' : '/en/contact'} onClick={() => setMenuOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '15px', padding: '10px 12px' }}>{t.contact}</Link>
              <Link href={altLangUrl}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>
                <GlobeIcon /> {isEs ? 'Switch to English' : 'Cambiar a Español'}
              </Link>
              <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', marginTop: '8px' }}>
                <PhoneIcon /> 855.246.7274
              </a>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}
