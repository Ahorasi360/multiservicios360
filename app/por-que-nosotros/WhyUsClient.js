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
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const AlertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);

const TRANSLATIONS = {
  es: {
    nav: { services: 'Servicios', about: 'Nosotros', whyUs: '¿Por Qué Nosotros?', contact: 'Contacto', consultation: 'Consulta Gratis' },
    hero: {
      title: '¿Por Qué Multiservicios 360?',
      subtitle: 'Una forma clara y transparente de preparar sus documentos legales',
      intro: 'Multiservicios 360 es una plataforma tecnológica bilingüe (Español / Inglés) diseñada para que usted pueda preparar sus propios documentos legales de forma clara, guiada y sin sorpresas. No vendemos paquetes legales cerrados. No incluimos abogados por defecto. Y no mezclamos costos. Aquí usted tiene el control.',
    },
    comparison: {
      title: 'Comparativo Honesto',
      subtitle: 'Plataformas tradicionales vs. Multiservicios 360',
      tables: [
        {
          name: 'Preparación de Documentos',
          rows: [
            { aspect: '¿Quién prepara?', traditional: 'La plataforma', ours: 'Usted mismo' },
            { aspect: 'Control del contenido', traditional: 'Limitado', ours: 'Total' },
            { aspect: 'Idioma', traditional: 'Principalmente Inglés', ours: 'Español e Inglés' },
            { aspect: 'Explicaciones', traditional: 'Genéricas', ours: 'Claras para comunidad latina' },
          ]
        },
        {
          name: 'Abogados',
          rows: [
            { aspect: '¿Incluye abogado?', traditional: 'Generalmente sí', ours: 'No incluido por defecto' },
            { aspect: 'Elección del abogado', traditional: 'No', ours: 'Usted decide si lo necesita' },
            { aspect: 'Relación abogado-cliente', traditional: 'Limitada', ours: 'Directa y separada' },
            { aspect: 'Tarifas legales', traditional: 'Integradas al paquete', ours: 'Separadas y transparentes' },
          ]
        },
        {
          name: 'Precios',
          rows: [
            { aspect: 'Precio inicial', traditional: 'Bajo', ours: 'Claro desde el inicio' },
            { aspect: 'Cargos adicionales', traditional: 'Frecuentes', ours: 'Solo si usted los elige' },
            { aspect: 'Membresías', traditional: 'Comunes', ours: 'No obligatorias' },
            { aspect: 'Claridad', traditional: 'Confusa', ours: 'Totalmente transparente' },
          ]
        },
        {
          name: 'Modelo de Negocio',
          rows: [
            { aspect: '¿Qué venden?', traditional: 'Paquetes cerrados', ours: 'Acceso a tecnología' },
            { aspect: 'Abogados', traditional: 'Incluidos', ours: 'Opcionales e independientes' },
            { aspect: 'Separación legal', traditional: 'Difusa', ours: 'Clara y explícita' },
          ]
        },
        {
          name: 'Acceso en Comunidad',
          rows: [
            { aspect: 'Oficinas físicas', traditional: 'No', ours: 'Sí (ubicaciones independientes)' },
            { aspect: 'Ayuda en persona', traditional: 'No', ours: 'Soporte administrativo' },
            { aspect: 'Enfoque cultural', traditional: 'General', ours: 'Latino / Bilingüe' },
          ]
        },
      ]
    },
    philosophy: {
      title: 'Nuestra Filosofía',
      principles: [
        { title: 'Transparencia Total', desc: 'Usted debe saber exactamente por qué está pagando' },
        { title: 'Simplificar, No Confundir', desc: 'La tecnología debe simplificar, no confundir' },
        { title: 'Abogados Opcionales', desc: 'Los abogados deben ser opcionales, no obligatorios' },
        { title: 'Usted Decide', desc: 'Usted decide si, cuándo y con quién hablar' },
      ]
    },
    howItWorks: {
      title: '¿Cómo Funciona?',
      steps: [
        { number: '1', title: 'Ingrese su información', desc: 'Usted completa un formulario con su información personal y preferencias' },
        { number: '2', title: 'Prepare su documento', desc: 'Utilice la plataforma guiada para tomar decisiones sobre su documento' },
        { number: '3', title: 'Descargue', desc: 'Obtenga su documento en Español e Inglés, listo para usar' },
        { number: '4', title: 'Opcional: Consulta', desc: 'Si desea, solicite revisión o consulta con un profesional independiente' },
      ]
    },
    disclaimer: {
      title: 'Importante',
      text: 'Multiservicios 360 no es un bufete de abogados y no brinda asesoría legal. Los abogados, notarios y otros profesionales disponibles a través de la plataforma son independientes y sus servicios se contratan por separado, bajo acuerdos distintos. Algunos servicios pueden ofrecerse a través de ubicaciones de servicio independientes que brindan acceso a esta plataforma. Estas ubicaciones no son bufetes de abogados ni brindan asesoría legal.',
    },
    cta: {
      title: '¿Listo para comenzar?',
      subtitle: 'Prepare sus documentos con claridad, control y transparencia.',
      button: 'Comenzar Ahora',
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
      title: 'Why Multiservicios 360?',
      subtitle: 'A clear and transparent way to prepare your legal documents',
      intro: 'Multiservicios 360 is a bilingual technology platform (Spanish / English) designed so you can prepare your own legal documents clearly, guided, and without surprises. We don\'t sell closed legal packages. We don\'t include attorneys by default. And we don\'t mix costs. Here you are in control.',
    },
    comparison: {
      title: 'Honest Comparison',
      subtitle: 'Traditional platforms vs. Multiservicios 360',
      tables: [
        {
          name: 'Document Preparation',
          rows: [
            { aspect: 'Who prepares?', traditional: 'The platform', ours: 'You yourself' },
            { aspect: 'Content control', traditional: 'Limited', ours: 'Total' },
            { aspect: 'Language', traditional: 'Mainly English', ours: 'Spanish and English' },
            { aspect: 'Explanations', traditional: 'Generic', ours: 'Clear for Latino community' },
          ]
        },
        {
          name: 'Attorneys',
          rows: [
            { aspect: 'Includes attorney?', traditional: 'Usually yes', ours: 'Not included by default' },
            { aspect: 'Attorney choice', traditional: 'No', ours: 'You decide if needed' },
            { aspect: 'Attorney-client relationship', traditional: 'Limited', ours: 'Direct and separate' },
            { aspect: 'Legal fees', traditional: 'Integrated in package', ours: 'Separate and transparent' },
          ]
        },
        {
          name: 'Pricing',
          rows: [
            { aspect: 'Initial price', traditional: 'Low', ours: 'Clear from the start' },
            { aspect: 'Additional charges', traditional: 'Frequent', ours: 'Only if you choose' },
            { aspect: 'Memberships', traditional: 'Common', ours: 'Not mandatory' },
            { aspect: 'Clarity', traditional: 'Confusing', ours: 'Totally transparent' },
          ]
        },
        {
          name: 'Business Model',
          rows: [
            { aspect: 'What do they sell?', traditional: 'Closed packages', ours: 'Technology access' },
            { aspect: 'Attorneys', traditional: 'Included', ours: 'Optional and independent' },
            { aspect: 'Legal separation', traditional: 'Blurry', ours: 'Clear and explicit' },
          ]
        },
        {
          name: 'Community Access',
          rows: [
            { aspect: 'Physical offices', traditional: 'No', ours: 'Yes (independent locations)' },
            { aspect: 'In-person help', traditional: 'No', ours: 'Administrative support' },
            { aspect: 'Cultural focus', traditional: 'General', ours: 'Latino / Bilingual' },
          ]
        },
      ]
    },
    philosophy: {
      title: 'Our Philosophy',
      principles: [
        { title: 'Total Transparency', desc: 'You should know exactly what you\'re paying for' },
        { title: 'Simplify, Not Confuse', desc: 'Technology should simplify, not confuse' },
        { title: 'Attorneys Optional', desc: 'Attorneys should be optional, not mandatory' },
        { title: 'You Decide', desc: 'You decide if, when, and with whom to talk' },
      ]
    },
    howItWorks: {
      title: 'How It Works',
      steps: [
        { number: '1', title: 'Enter your information', desc: 'You complete a form with your personal information and preferences' },
        { number: '2', title: 'Prepare your document', desc: 'Use the guided platform to make decisions about your document' },
        { number: '3', title: 'Download', desc: 'Get your document in Spanish and English, ready to use' },
        { number: '4', title: 'Optional: Consultation', desc: 'If you wish, request review or consultation with an independent professional' },
      ]
    },
    disclaimer: {
      title: 'Important',
      text: 'Multiservicios 360 is not a law firm and does not provide legal advice. Attorneys, notaries, and other professionals available through the platform are independent and their services are contracted separately, under different agreements. Some services may be offered through independent service locations that provide access to this platform. These locations are not law firms and do not provide legal advice.',
    },
    cta: {
      title: 'Ready to get started?',
      subtitle: 'Prepare your documents with clarity, control, and transparency.',
      button: 'Get Started',
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

export default function WhyUsClient({ lang: initialLang = 'es' }) {
  const language = initialLang;
  const [menuOpen, setMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .hero-title { font-size: 36px !important; }
          .hero-subtitle { font-size: 16px !important; }
          .hero-intro { font-size: 15px !important; }
          .comparison-table { font-size: 13px !important; }
          .section-title { font-size: 28px !important; }
          .philosophy-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; text-align: center; }
        }
      `}</style>

      {/* Navigation */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>M360</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#1E3A8A' }}>Multi Servicios 360</div>
                <div style={{ fontSize: '9px', color: '#64748B', letterSpacing: '0.5px' }}>DOCUMENT PREPARATION</div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="/#services" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{t.nav.services}</a>
            <Link href="/por-que-nosotros" style={{ color: '#1E3A8A', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>{t.nav.whyUs}</Link>
            <Link href="/nuestra-historia" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{language === 'es' ? 'Nuestra Historia' : 'Our Story'}</Link>
            <Link href="/blog" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>Blog</Link>
            <Link href="/contacto" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{t.nav.contact}</Link>
            <Link href={language === "es" ? "/en/why-us" : "/por-que-nosotros"} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 10px", backgroundColor: "#F3F4F6", border: "none", borderRadius: "6px", fontWeight: "500", fontSize: "13px", color: "#374151", textDecoration: "none" }}>
              <GlobeIcon /> {language === 'es' ? 'EN' : 'ES'}
            </Link>
            <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px' }}>
              <PhoneIcon /> 855.246.7274
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href={language === 'es' ? '/en/why-us' : '/por-que-nosotros'} className="mobile-menu-btn" style={{ display: 'none', alignItems: 'center', padding: '8px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', textDecoration: 'none', color: '#374151' }}>
              <GlobeIcon />
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{ display: 'none', alignItems: 'center', padding: '8px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ backgroundColor: 'white', borderTop: '1px solid #E5E7EB', padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a href="/#services" onClick={() => setMenuOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '16px', padding: '8px 0' }}>{t.nav.services}</a>
              <Link href="/por-que-nosotros" onClick={() => setMenuOpen(false)} style={{ color: '#1E3A8A', textDecoration: 'none', fontWeight: '600', fontSize: '16px', padding: '8px 0' }}>{t.nav.whyUs}</Link>
              <Link href="/nuestra-historia" onClick={() => setMenuOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '16px', padding: '8px 0' }}>{language === 'es' ? 'Nuestra Historia' : 'Our Story'}</Link>
              <Link href="/blog" onClick={() => setMenuOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '16px', padding: '8px 0' }}>Blog</Link>
              <Link href="/contacto" onClick={() => setMenuOpen(false)} style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '16px', padding: '8px 0' }}>{t.nav.contact}</Link>
              <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
                <PhoneIcon /> 855.246.7274
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #1D4ED8 100%)', color: 'white', padding: '80px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 className="hero-title" style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.1', marginBottom: '16px' }}>
            {t.hero.title}
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '18px', opacity: '0.9', marginBottom: '24px' }}>
            {t.hero.subtitle}
          </p>
          <p className="hero-intro" style={{ fontSize: '16px', lineHeight: '1.7', opacity: '0.85', maxWidth: '800px', margin: '0 auto' }}>
            {t.hero.intro}
          </p>
        </div>
      </section>

      {/* Comparison Tables Section */}
      <section style={{ padding: '80px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>{t.comparison.title}</h2>
            <p style={{ fontSize: '16px', color: '#64748B' }}>{t.comparison.subtitle}</p>
          </div>

          {t.comparison.tables.map((table, idx) => (
            <div key={idx} style={{ marginBottom: '48px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>{table.name}</h3>
              <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '16px 20px', backgroundColor: '#F3F4F6', fontWeight: '700', color: '#374151', textAlign: 'left', borderBottom: '1px solid #E5E7EB', fontSize: '13px' }}>{language === 'es' ? 'Aspecto' : 'Aspect'}</th>
                      <th style={{ padding: '16px 20px', backgroundColor: '#F3F4F6', fontWeight: '700', color: '#6B7280', textAlign: 'left', borderBottom: '1px solid #E5E7EB', fontSize: '13px' }}>{language === 'es' ? 'Plataformas Tradicionales' : 'Traditional Platforms'}</th>
                      <th style={{ padding: '16px 20px', backgroundColor: '#EFF6FF', fontWeight: '700', color: '#1E3A8A', textAlign: 'left', borderBottom: '1px solid #E5E7EB', fontSize: '13px' }}>Multiservicios 360</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', fontWeight: '600', color: '#374151', fontSize: '13px' }}>{row.aspect}</td>
                        <td style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '13px' }}>{row.traditional}</td>
                        <td style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#EFF6FF', color: '#1E3A8A', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#10B981' }}>
                            <CheckIcon />
                          </span>
                          {row.ours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section style={{ padding: '80px 16px', backgroundColor: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>{t.philosophy.title}</h2>
          </div>

          <div className="philosophy-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {t.philosophy.principles.map((principle, idx) => (
              <div key={idx} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#1E3A8A' }}>
                  {idx === 0 && <ShieldIcon />}
                  {idx === 1 && <ClockIcon />}
                  {idx === 2 && <ScaleIcon />}
                  {idx === 3 && <UsersIcon />}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>{principle.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>{principle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '80px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>{t.howItWorks.title}</h2>
          </div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {t.howItWorks.steps.map((step, idx) => (
              <div key={idx} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center', position: 'relative' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: '#1E3A8A', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 16px',
                  color: 'white',
                  fontSize: '28px',
                  fontWeight: '800'
                }}>
                  {step.number}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section style={{ padding: '80px 16px', backgroundColor: '#FEF3C7' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ fontSize: '28px', fontWeight: '800', color: '#92400E', marginBottom: '20px', textAlign: 'center' }}>{t.disclaimer.title}</h2>
          <p style={{ fontSize: '14px', color: '#92400E', lineHeight: '1.8', textAlign: 'center', margin: 0 }}>
            {t.disclaimer.text}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 16px', backgroundColor: '#FCD34D' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title" style={{ fontSize: '32px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>{t.cta.title}</h2>
          <p style={{ fontSize: '17px', color: '#1E3A8A', opacity: '0.8', marginBottom: '32px' }}>{t.cta.subtitle}</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Link href="/#services" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 36px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '16px' }}>
              {t.cta.button} <ArrowRightIcon />
            </Link>
            <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E3A8A', fontWeight: '600', textDecoration: 'none', fontSize: '16px' }}>
              <PhoneIcon /> {t.cta.call}: 855.246.7274
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                  <li key={i}><a href="/#services" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px', lineHeight: '2' }}>{item}</a></li>
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
