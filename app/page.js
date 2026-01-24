"use client";
import React, { useState } from 'react';
import Link from 'next/link';

// Icons
const ScaleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>);
const HomeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const BuildingIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>);
const UsersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const ShieldIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>);
const ClockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);
const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const MailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const ArrowRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const FileTextIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>);
const KeyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>);
const PlaneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>);
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const AlertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);

const TRANSLATIONS = {
  es: {
    nav: { services: 'Servicios', about: 'Nosotros', whyUs: '¿Por Qué Nosotros?', contact: 'Contacto', consultation: 'Consulta Gratis' },
    hero: {
      badge: 'Preparación de Documentos Legales',
      title: 'Documentos Legales',
      titleAccent: 'para su Familia y Negocio',
      subtitle: 'Multiservicios 360 es una plataforma tecnológica bilingüe que permite a las personas preparar sus propios documentos legales utilizando herramientas guiadas de software. Usted ingresa su información, toma sus propias decisiones y genera sus documentos directamente.',
      cta: 'Comenzar Ahora',
      ctaSecondary: 'Ver Servicios',
      trust1: '100% Bilingüe',
      trust2: 'Autoayuda Legal',
      trust3: 'California',
    },
    disclosure: {
      banner: 'Multi Servicios 360 no es un bufete de abogados y no proporciona asesoría legal. Este es un servicio de preparación de documentos de autoayuda.',
    },
    services: {
      title: 'Nuestros Servicios',
      subtitle: 'Plataforma de preparación de documentos legales',
      personal: {
        title: 'Planificación Personal',
        desc: 'Prepare documentos legales esenciales',
        items: ['Poder Notarial (POA)', 'Testamento (Will)', 'Fideicomiso (Living Trust)', 'Directiva de Salud', 'HIPAA', 'Pour-Over Will'],
        price: 'Desde $79',
      },
      business: {
        title: 'Formación de Negocios',
        desc: 'Documentos para estructurar su empresa',
        items: ['LLC', 'S Corporation', 'C Corporation', 'DBA', 'Operating Agreement', 'EIN Federal', 'Seller\'s Permit'],
        price: 'Desde $149',
      },
      realestate: {
        title: 'Trust Funding',
        desc: 'Documentos para transferencia de propiedades',
        items: ['Trust Deed', 'PCOR', 'Property Transfer', 'Notario Coordinado', 'Recording'],
        price: 'Desde $1,499',
      },
      immigration: {
        title: 'Inmigración',
        desc: 'Asistencia con formularios migratorios',
        items: ['Ciudadanía (N-400)', 'Petición Familiar (I-130)', 'Green Card (I-485)', 'Permiso de Trabajo', 'Renovación Green Card'],
        price: 'Desde $99',
      },
      disclaimer: 'Este servicio proporciona acceso únicamente a software de preparación de documentos. Multiservicios 360 no brinda asesoría legal, no redacta documentos por usted y no es un bufete de abogados. Usted es responsable de ingresar toda la información y seleccionar todas las opciones.',
    },
    packages: {
      title: 'Paquetes Disponibles',
      subtitle: 'Opciones de preparación de documentos',
      estate: { name: 'Estate Plan Básico', items: ['Testamento', 'Poder Notarial', 'Directiva de Salud', 'HIPAA'], price: '$349' },
      estatePro: { name: 'Estate Plan Completo', items: ['Living Trust', 'Pour-Over Will', 'POA', 'Healthcare', 'HIPAA', 'Trust Cert'], price: '$799', badge: 'Más Popular' },
      funding: { name: 'Trust Funding', items: ['Living Trust', 'Pour-Over', 'Trust Deed', 'PCOR', 'Notario', 'Recording'], price: '$1,499', badge: 'Premium' },
      business: { name: 'Business Starter', items: ['LLC', 'Operating Agreement', 'EIN Federal'], price: '$349' },
    },
    team: {
      title: 'Red de Profesionales Independientes',
      subtitle: 'Acceso opcional a profesionales licenciados',
      consultants: 'Consultores',
      consultantsDesc: 'Orientación general',
      attorneys: 'Abogados',
      attorneysDesc: 'Revisión opcional',
      accountants: 'Contadores',
      accountantsDesc: 'Servicios fiscales',
      realtors: 'Realtors',
      realtorsDesc: 'Bienes raíces',
      independentNote: 'El acceso a abogados, notarios, profesionales inmobiliarios, servicios de escrow y otros profesionales es opcional. Todos los profesionales son contratistas independientes, no empleados ni agentes de Multiservicios 360. Cualquier servicio profesional se rige por acuerdos separados entre usted y el proveedor.',
    },
    why: {
      title: '¿Por Qué Usar Nuestra Plataforma?',
      reason1: { title: '100% Bilingüe', desc: 'Todo en español e inglés' },
      reason2: { title: 'Autoayuda', desc: 'Usted controla sus documentos' },
      reason3: { title: 'Rápido y Fácil', desc: 'Documentos en minutos' },
      reason4: { title: 'Desde 2010', desc: 'Sirviendo a California' },
    },
    cta: {
      title: '¿Listo para Comenzar?',
      subtitle: 'Consulta informativa gratuita de 15 minutos (no es asesoría legal)',
      button: 'Comenzar Documentos',
      call: 'Llámenos',
    },
    footer: {
      desc: 'Plataforma de preparación de documentos legales de autoayuda para la comunidad latina en California.',
      services: 'Servicios',
      contact: 'Contacto',
      hours: 'Lun - Vie: 9am - 6pm',
      rights: 'Todos los derechos reservados.',
      disclaimer: 'Multi Servicios 360 no es un bufete de abogados y no proporciona asesoría legal. Este sitio web ofrece preparación de documentos legales de autoayuda basada en la información proporcionada por el usuario. Usted selecciona los poderes y opciones incluidos en su documento. La plataforma no recomienda ni selecciona opciones legales por usted. El uso de este sitio web no crea una relación abogado-cliente. La revisión de abogados es opcional y proporcionada por abogados independientes licenciados en California.',
      terms: 'Términos de Servicio',
      privacy: 'Política de Privacidad',
    },
  },
  en: {
    nav: { services: 'Services', about: 'About', whyUs: 'Why Us?', contact: 'Contact', consultation: 'Free Consultation' },
    hero: {
      badge: 'Legal Document Preparation',
      title: 'Legal Documents',
      titleAccent: 'for Your Family and Business',
      subtitle: 'Multiservicios 360 is a bilingual technology platform that allows individuals to self-prepare legal documents using guided software tools. You enter your own information, make your own selections, and generate your documents directly.',
      cta: 'Get Started',
      ctaSecondary: 'View Services',
      trust1: '100% Bilingual',
      trust2: 'Legal Self-Help',
      trust3: 'California',
    },
    disclosure: {
      banner: 'Multi Servicios 360 is not a law firm and does not provide legal advice. This is a self-help document preparation service.',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Legal document preparation platform',
      personal: {
        title: 'Personal Planning',
        desc: 'Prepare essential legal documents',
        items: ['Power of Attorney', 'Last Will', 'Living Trust', 'Healthcare Directive', 'HIPAA', 'Pour-Over Will'],
        price: 'From $79',
      },
      business: {
        title: 'Business Formation',
        desc: 'Documents to structure your business',
        items: ['LLC', 'S Corporation', 'C Corporation', 'DBA', 'Operating Agreement', 'Federal EIN', 'Seller\'s Permit'],
        price: 'From $149',
      },
      realestate: {
        title: 'Trust Funding',
        desc: 'Property transfer documents',
        items: ['Trust Deed', 'PCOR', 'Property Transfer', 'Notary Coordinated', 'Recording'],
        price: 'From $1,499',
      },
      immigration: {
        title: 'Immigration',
        desc: 'Immigration form assistance',
        items: ['Citizenship (N-400)', 'Family Petition (I-130)', 'Green Card (I-485)', 'Work Permit', 'Green Card Renewal'],
        price: 'From $99',
      },
      disclaimer: 'This service provides access to document-preparation software only. Multiservicios 360 does not provide legal advice, does not draft documents on your behalf, and does not act as a law firm. You are responsible for entering all information and selecting all options.',
    },
    packages: {
      title: 'Available Packages',
      subtitle: 'Document preparation options',
      estate: { name: 'Basic Estate Plan', items: ['Last Will', 'Power of Attorney', 'Healthcare Directive', 'HIPAA'], price: '$349' },
      estatePro: { name: 'Complete Estate Plan', items: ['Living Trust', 'Pour-Over Will', 'POA', 'Healthcare', 'HIPAA', 'Trust Cert'], price: '$799', badge: 'Most Popular' },
      funding: { name: 'Trust Funding', items: ['Living Trust', 'Pour-Over', 'Trust Deed', 'PCOR', 'Notary', 'Recording'], price: '$1,499', badge: 'Premium' },
      business: { name: 'Business Starter', items: ['LLC', 'Operating Agreement', 'Federal EIN'], price: '$349' },
      pricingNote: 'The prices shown are software access fees only. If you choose optional attorney review or consultation, those legal services are provided directly by independent licensed attorneys at their own rates. Multiservicios 360 does not set, control, or share in attorney fees.',
      pricingNote: 'Los precios mostrados son tarifas de acceso al software únicamente. Si usted elige revisión o consulta opcional con un abogado, esos servicios legales son proporcionados directamente por abogados independientes licenciados a sus propias tarifas. Multiservicios 360 no establece, controla ni participa en las tarifas de los abogados.',
    },
    team: {
      title: 'Network of Independent Professionals',
      subtitle: 'Optional access to licensed professionals',
      consultants: 'Consultants',
      consultantsDesc: 'General guidance',
      attorneys: 'Attorneys',
      attorneysDesc: 'Optional review',
      accountants: 'Accountants',
      accountantsDesc: 'Tax services',
      realtors: 'Realtors',
      realtorsDesc: 'Real estate',
      independentNote: 'Access to attorneys, notaries, real estate professionals, escrow services, and other professionals is optional. All professionals are independent contractors, not employees or agents of Multiservicios 360. Any professional services are governed by separate agreements between you and the provider.',
    },
    why: {
      title: 'Why Use Our Platform?',
      reason1: { title: '100% Bilingual', desc: 'Everything in Spanish & English' },
      reason2: { title: 'Self-Help', desc: 'You control your documents' },
      reason3: { title: 'Fast and Easy', desc: 'Documents in minutes' },
      reason4: { title: 'Since 2010', desc: 'Serving California' },
    },
    cta: {
      title: 'Ready to Get Started?',
      subtitle: 'Free 15-minute informational consultation (not legal advice)',
      button: 'Start Documents',
      call: 'Call Us',
    },
    footer: {
      desc: 'Self-help legal document preparation platform for the Latino community in California.',
      services: 'Services',
      contact: 'Contact',
      hours: 'Mon - Fri: 9am - 6pm',
      rights: 'All rights reserved.',
      disclaimer: 'Multi Servicios 360 is not a law firm and does not provide legal advice. This website offers self-help legal document preparation based on information provided by the user. You select the powers and options included in your document. The platform does not recommend or select legal options for you. Use of this website does not create an attorney-client relationship. Attorney review is optional and provided by independent attorneys licensed in California.',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
    },
  },
};

export default function HomePage() {
  const [language, setLanguage] = useState('es');
  const [menuOpen, setMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-title { font-size: 36px !important; }
          .hero-subtitle { font-size: 16px !important; }
          .hero-buttons { flex-direction: column !important; align-items: center; }
          .hero-preview { display: none !important; }
          .trust-badges { flex-direction: column !important; gap: 12px !important; align-items: center; }
          .services-grid { grid-template-columns: 1fr !important; }
          .packages-grid { grid-template-columns: 1fr !important; }
          .team-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .why-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; text-align: center; }
          .section-title { font-size: 28px !important; }
          .section-padding { padding: 60px 16px !important; }
          .disclosure-banner { font-size: 11px !important; padding: 8px 12px !important; }
        }
        @media (max-width: 480px) {
          .team-grid { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* LEGAL DISCLOSURE BANNER - CRITICAL FOR COMPLIANCE */}
      <div className="disclosure-banner" style={{ 
        backgroundColor: '#FEF3C7', 
        borderBottom: '1px solid #F59E0B',
        padding: '10px 16px', 
        textAlign: 'center',
        fontSize: '12px',
        color: '#92400E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <AlertIcon />
        <span>{t.disclosure.banner}</span>
      </div>

      {/* Navigation */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>M360</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: '#1E3A8A' }}>Multi Servicios 360</div>
              <div style={{ fontSize: '9px', color: '#64748B', letterSpacing: '0.5px' }}>DOCUMENT PREPARATION</div>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="#services" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{t.nav.services}</a>
            <a href="#team" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{t.nav.about}</a>
            <Link href="/por-que-nosotros" style={{ color: '#1E3A8A', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>{t.nav.whyUs}</Link>
            <a href="#contact" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{t.nav.contact}</a>
            <button onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px', color: '#374151' }}>
              <GlobeIcon /> {language === 'es' ? 'EN' : 'ES'}
            </button>
            <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px' }}>
              <PhoneIcon /> 855.246.7274
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} className="mobile-menu-btn" style={{ display: 'none', alignItems: 'center', padding: '8px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <GlobeIcon />
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{ display: 'none', alignItems: 'center', padding: '8px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ backgroundColor: 'white', borderTop: '1px solid #E5E7EB', padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a href="#services" onClick={() => setMenuOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '16px', padding: '8px 0' }}>{t.nav.services}</a>
              <a href="#team" onClick={() => setMenuOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '16px', padding: '8px 0' }}>{t.nav.about}</a>
              <Link href="/por-que-nosotros" onClick={() => setMenuOpen(false)} style={{ color: '#1E3A8A', textDecoration: 'none', fontWeight: '600', fontSize: '16px', padding: '8px 0' }}>{t.nav.whyUs}</Link>
              <a href="#contact" onClick={() => setMenuOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '16px', padding: '8px 0' }}>{t.nav.contact}</a>
              <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
                <PhoneIcon /> 855.246.7274
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #1D4ED8 100%)', color: 'white', padding: '60px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', marginBottom: '20px' }}>
                🇺🇸 🇲🇽 {t.hero.badge}
              </div>
              <h1 className="hero-title" style={{ fontSize: '44px', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px' }}>
                {t.hero.title}<br />
                <span style={{ color: '#FCD34D' }}>{t.hero.titleAccent}</span>
              </h1>
              <p className="hero-subtitle" style={{ fontSize: '17px', lineHeight: '1.6', opacity: '0.9', marginBottom: '28px', maxWidth: '500px' }}>
                {t.hero.subtitle}
              </p>
              <div className="hero-buttons" style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                <Link href="/poa" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: '#FCD34D', color: '#1E3A8A', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', boxShadow: '0 4px 14px rgba(252, 211, 77, 0.4)' }}>
                  {t.hero.cta} <ArrowRightIcon />
                </Link>
                <a href="#services" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: 'transparent', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '15px', border: '2px solid rgba(255,255,255,0.3)' }}>
                  {t.hero.ctaSecondary}
                </a>
              </div>
              <div className="trust-badges" style={{ display: 'flex', gap: '20px' }}>
                {[t.hero.trust1, t.hero.trust2, t.hero.trust3].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', opacity: '0.9' }}>
                    <div style={{ width: '18px', height: '18px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckIcon />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-preview" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { icon: <ScaleIcon />, label: 'POA' },
                    { icon: <FileTextIcon />, label: 'Will' },
                    { icon: <HomeIcon />, label: 'Trust' },
                    { icon: <BuildingIcon />, label: 'LLC' },
                  ].map((item, i) => (
                    <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                      <div style={{ marginBottom: '8px', opacity: '0.9' }}>{item.icon}</div>
                      <div style={{ fontWeight: '700', fontSize: '16px' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding" style={{ padding: '80px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>{t.services.title}</h2>
            <p style={{ fontSize: '16px', color: '#64748B' }}>{t.services.subtitle}</p>
          </div>
          <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', padding: '12px 20px', marginBottom: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#92400E', margin: 0, lineHeight: '1.6' }}>{t.services.disclaimer}</p>
          </div>
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { key: 'personal', icon: <ScaleIcon />, color: '#3B82F6', bg: '#EFF6FF' },
              { key: 'business', icon: <BuildingIcon />, color: '#10B981', bg: '#ECFDF5' },
              { key: 'realestate', icon: <HomeIcon />, color: '#8B5CF6', bg: '#F5F3FF' },
              { key: 'immigration', icon: <PlaneIcon />, color: '#F59E0B', bg: '#FFFBEB' },
            ].map((service) => (
              <div key={service.key} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: service.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: service.color }}>{service.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>{t.services[service.key].title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px', lineHeight: '1.5' }}>{t.services[service.key].desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                  {t.services[service.key].items.slice(0, 5).map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', fontSize: '13px', color: '#374151' }}>
                      <div style={{ width: '5px', height: '5px', backgroundColor: service.color, borderRadius: '50%' }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: service.color }}>{t.services[service.key].price}</span>
                  <Link href="/poa" style={{ color: service.color, fontWeight: '600', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    → 
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="section-padding" style={{ padding: '80px 16px', backgroundColor: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>{t.packages.title}</h2>
            <p style={{ fontSize: '16px', color: '#64748B' }}>{t.packages.subtitle}</p>
          </div>
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '12px 20px', marginBottom: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#1E40AF', margin: 0, lineHeight: '1.6' }}>{t.packages.pricingNote}</p>
          </div>
          <div className="packages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {['estate', 'estatePro', 'funding', 'business'].map((pkg) => (
              <div key={pkg} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: pkg === 'estatePro' ? '2px solid #3B82F6' : '1px solid #E5E7EB', position: 'relative' }}>
                {t.packages[pkg].badge && (
                  <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: pkg === 'estatePro' ? '#3B82F6' : '#8B5CF6', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    {t.packages[pkg].badge}
                  </div>
                )}
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1F2937', marginBottom: '8px', marginTop: t.packages[pkg].badge ? '8px' : '0' }}>{t.packages[pkg].name}</h3>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#1E3A8A', marginBottom: '20px' }}>{t.packages[pkg].price}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                  {t.packages[pkg].items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', fontSize: '13px', color: '#374151', borderBottom: '1px solid #F3F4F6' }}>
                      <div style={{ color: '#10B981', flexShrink: 0 }}><CheckIcon /></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/poa" style={{ display: 'block', textAlign: 'center', padding: '12px', backgroundColor: pkg === 'estatePro' ? '#3B82F6' : '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px' }}>
                  {language === 'es' ? 'Seleccionar' : 'Select'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Updated to show INDEPENDENT professionals */}
      <section id="team" className="section-padding" style={{ padding: '80px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>{t.team.title}</h2>
            <p style={{ fontSize: '16px', color: '#64748B' }}>{t.team.subtitle}</p>
          </div>
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { icon: <UsersIcon />, title: t.team.consultants, desc: t.team.consultantsDesc, color: '#3B82F6' },
              { icon: <ScaleIcon />, title: t.team.attorneys, desc: t.team.attorneysDesc, color: '#10B981' },
              { icon: <FileTextIcon />, title: t.team.accountants, desc: t.team.accountantsDesc, color: '#8B5CF6' },
              { icon: <KeyIcon />, title: t.team.realtors, desc: t.team.realtorsDesc, color: '#F59E0B' },
            ].map((member, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: `${member.color}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: member.color }}>{member.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>{member.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748B' }}>{member.desc}</p>
              </div>
            ))}
          </div>
          {/* IMPORTANT DISCLOSURE about independent professionals */}
          <div style={{ 
            marginTop: '32px', 
            padding: '16px 20px', 
            backgroundColor: '#F0F9FF', 
            borderRadius: '12px', 
            border: '1px solid #BAE6FD',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '13px', color: '#0369A1', margin: 0, lineHeight: '1.6' }}>
              {t.team.independentNote}
            </p>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="section-padding" style={{ padding: '80px 16px', background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)', color: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '800', textAlign: 'center', marginBottom: '48px' }}>{t.why.title}</h2>
          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {[
              { icon: <GlobeIcon />, ...t.why.reason1 },
              { icon: <UsersIcon />, ...t.why.reason2 },
              { icon: <ClockIcon />, ...t.why.reason3 },
              { icon: <ShieldIcon />, ...t.why.reason4 },
            ].map((reason, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{reason.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>{reason.title}</h3>
                <p style={{ fontSize: '14px', opacity: '0.85', lineHeight: '1.5' }}>{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="section-padding" style={{ padding: '80px 16px', backgroundColor: '#FCD34D' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title" style={{ fontSize: '32px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>{t.cta.title}</h2>
          <p style={{ fontSize: '17px', color: '#1E3A8A', opacity: '0.8', marginBottom: '32px' }}>{t.cta.subtitle}</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Link href="/poa" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 36px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '16px' }}>
              {t.cta.button} <ArrowRightIcon />
            </Link>
            <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E3A8A', fontWeight: '600', textDecoration: 'none', fontSize: '16px' }}>
              <PhoneIcon /> {t.cta.call}: 855.246.7274
            </a>
          </div>
        </div>
      </section>

      {/* Footer - With full legal disclosures */}
      <footer style={{ backgroundColor: '#0F172A', color: 'white', padding: '48px 16px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>M360</div>
                <div style={{ fontWeight: '700', fontSize: '16px' }}>Multi Servicios 360</div>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', maxWidth: '280px' }}>{t.footer.desc}</p>
              <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
                {[1,2,3,4,5].map((_, i) => (<div key={i} style={{ color: '#FCD34D' }}><StarIcon /></div>))}
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '15px' }}>{t.footer.services}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Power of Attorney', 'Living Trust', 'LLC Formation', 'Immigration'].map((item, i) => (
                  <li key={i}><a href="#services" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px', lineHeight: '2' }}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '15px' }}>{t.footer.contact}</h4>
              <div style={{ color: '#94A3B8', fontSize: '13px', lineHeight: '2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><PhoneIcon /> 855.246.7274</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MailIcon /> info@multiservicios360.net</div>
                <div style={{ marginTop: '8px' }}>{t.footer.hours}</div>
                <div>Beverly Hills, CA</div>
              </div>
            </div>
          </div>
          
          {/* LEGAL DISCLAIMER - CRITICAL FOR COMPLIANCE */}
          <div style={{ 
            borderTop: '1px solid #1E293B', 
            borderBottom: '1px solid #1E293B',
            padding: '20px 0',
            marginBottom: '20px'
          }}>
            <p style={{ 
              color: '#94A3B8', 
              fontSize: '11px', 
              lineHeight: '1.8',
              textAlign: 'center',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              {t.footer.disclaimer}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '12px' }}>
              <Link href="/por-que-nosotros" style={{ color: '#64748B', fontSize: '12px', textDecoration: 'none', marginRight: '20px' }}>{t.nav.whyUs}</Link>
              <Link href="/terms" style={{ color: '#64748B', fontSize: '12px', textDecoration: 'none', marginRight: '20px' }}>{t.footer.terms}</Link>
              <Link href="/privacy" style={{ color: '#64748B', fontSize: '12px', textDecoration: 'none' }}>{t.footer.privacy}</Link>
            </div>
            <p style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>© 2026 Multi Servicios 360. {t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}