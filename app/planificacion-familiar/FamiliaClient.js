'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

// ── ICONS ──────────────────────────────────────────────────────────────
const ScrollIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/></svg>);
const HeartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);
const HospitalIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="2" width="18" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M8 10h.01M8 14h.01M16 10h.01M16 14h.01"/></svg>);
const BankIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>);
const ShieldIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const ArrowIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);

const T = {
  es: {
    lang: 'es',
    langSwitch: 'English',
    langSwitchUrl: '/en/family-planning',
    backHome: '← Regresar al Inicio',
    nav: { home: 'Inicio', trust: 'Fideicomiso', poa: 'Poder Notarial', contact: 'Contacto' },
    hero: {
      badge: 'Planificación Familiar',
      title: 'Proteja a Su Familia con los Documentos Correctos',
      subtitle: 'Testamentos, HIPAA y documentos de fideicomiso preparados en línea — en español e inglés — sin necesidad de visitar un abogado.',
      trustBadge: 'Revisado por abogados de California',
    },
    whyMatters: {
      title: '¿Por qué estos documentos son esenciales?',
      subtitle: 'Sin planificación, el estado decide por usted. Con los documentos correctos, usted protege a su familia.',
      reasons: [
        { icon: '⚖️', title: 'Sin testamento, California decide', desc: 'Si fallece sin testamento, el estado distribuye sus bienes según sus leyes — no según sus deseos.' },
        { icon: '🏥', title: 'Sin HIPAA, nadie puede ayudar', desc: 'Si está inconsciente, los hospitales no pueden compartir información médica ni con su cónyuge sin autorización.' },
        { icon: '🏦', title: 'Los bancos requieren documentación', desc: 'Para transferir activos al fideicomiso, los bancos exigen la Certificación de Fideicomiso por ley (CA Probate Code §18100.5).' },
      ],
    },
    documents: [
      {
        key: 'pour_over_will',
        icon: <ScrollIcon />,
        color: '#7C3AED',
        bgColor: '#F5F3FF',
        badge: 'Más Popular',
        badgeColor: '#7C3AED',
        title: 'Testamento de Traspaso al Fideicomiso',
        subtitle: 'Pour-Over Will',
        price: '$199',
        desc: 'Transfiere automáticamente todos sus activos al fideicomiso existente al momento de su fallecimiento. Complemento esencial para su Fideicomiso en Vida.',
        features: [
          'Traspasa bienes olvidados al fideicomiso',
          'Nombra ejecutor y guardián de menores',
          'Cláusula de no impugnación incluida',
          'Requisito: 2 testigos adultos (CA §6110)',
        ],
        url: '/pour-over-will',
        requiresTrust: true,
      },
      {
        key: 'simple_will',
        icon: <ScrollIcon />,
        color: '#1D4ED8',
        bgColor: '#EFF6FF',
        badge: 'Sin Fideicomiso Previo',
        badgeColor: '#1D4ED8',
        title: 'Testamento Simple',
        subtitle: 'Last Will & Testament',
        price: '$149',
        desc: 'Testamento completo y válido en California para distribuir sus bienes, nombrar ejecutor y designar guardián para sus hijos.',
        features: [
          'Distribución de bienes a beneficiarios',
          'Nombramiento de ejecutor y alterno',
          'Designación de guardián para menores',
          'Cláusula de muerte simultánea incluida',
        ],
        url: '/simple-will',
        requiresTrust: false,
      },
      {
        key: 'hipaa_authorization',
        icon: <HospitalIcon />,
        color: '#059669',
        bgColor: '#ECFDF5',
        badge: 'Requerido por Hospitales',
        badgeColor: '#059669',
        title: 'Autorización HIPAA',
        subtitle: 'HIPAA Authorization',
        price: '$99',
        desc: 'Autoriza a un familiar o agente de confianza a acceder a su información médica en caso de emergencia. Cumple con HIPAA federal y CMIA de California.',
        features: [
          'Acceso a registros médicos y psiquiátricos',
          'Incluye registros de VIH/SIDA y sustancias',
          'Cumple con 45 CFR §164.508 (HIPAA)',
          'Cumple con Código Civil CA §56.10 (CMIA)',
        ],
        url: '/hipaa-authorization',
        requiresTrust: false,
      },
      {
        key: 'certification_of_trust',
        icon: <BankIcon />,
        color: '#B45309',
        bgColor: '#FFFBEB',
        badge: 'Requerido por Bancos',
        badgeColor: '#B45309',
        title: 'Certificación de Fideicomiso',
        subtitle: 'Certification of Trust',
        price: '$99',
        desc: 'Documento oficial requerido por bancos e instituciones financieras para abrir cuentas o transferir activos al fideicomiso, sin revelar el contenido completo.',
        features: [
          'Requerido por bancos y compañías de título',
          'No revela detalles privados del fideicomiso',
          'Cumple con CA Probate Code §18100.5',
          'Requiere notarización',
        ],
        url: '/certification-of-trust',
        requiresTrust: true,
      },
    ],
    packages: {
      title: 'Paquetes de Planificación Familiar',
      subtitle: 'Ahorre comprando los documentos que necesita juntos',
      items: [
        {
          name: 'Paquete Básico de Protección',
          docs: ['Testamento Simple', 'Autorización HIPAA'],
          price: '$224',
          savings: 'Ahorra $24',
          color: '#1D4ED8',
          url: '/simple-will',
          cta: 'Empezar con Testamento',
        },
        {
          name: 'Paquete Fideicomiso Completo',
          docs: ['Testamento de Traspaso', 'Autorización HIPAA', 'Certificación de Fideicomiso'],
          price: '$373',
          savings: 'Ahorra $24',
          color: '#7C3AED',
          url: '/pour-over-will',
          cta: 'Empezar con Testamento',
          featured: true,
        },
      ],
    },
    trust: {
      title: '¿Necesita un Fideicomiso en Vida primero?',
      desc: 'El Testamento de Traspaso y la Certificación de Fideicomiso requieren que ya tenga un fideicomiso. Si aún no tiene uno, empiece por aquí.',
      cta: 'Crear mi Fideicomiso en Vida',
      price: 'Desde $499',
      url: '/trust',
    },
    faq: {
      title: 'Preguntas Frecuentes',
      items: [
        { q: '¿Son válidos estos documentos en California?', a: 'Sí. Todos nuestros documentos son preparados con cláusulas que cumplen con el Código de Sucesiones de California (Probate Code). Los testamentos requieren 2 testigos adultos para ser válidos.' },
        { q: '¿Necesito un abogado para un testamento?', a: 'En California no se requiere abogado para preparar un testamento. Nuestra plataforma le guía paso a paso. Para situaciones complejas (múltiples propiedades, negocios, disputas familiares), recomendamos consultar con un abogado.' },
        { q: '¿Qué diferencia hay entre el Testamento Simple y el Testamento de Traspaso?', a: 'El Testamento Simple es para personas sin fideicomiso — distribuye bienes directamente a beneficiarios. El Testamento de Traspaso complementa un fideicomiso existente, transfiriendo automáticamente cualquier bien que quedó fuera del fideicomiso.' },
        { q: '¿Por qué necesito la Autorización HIPAA si ya tengo Poder Notarial?', a: 'El Poder Notarial cubre decisiones financieras y legales. La Autorización HIPAA es específica para información médica. Los hospitales la requieren por separado bajo las leyes federales de privacidad.' },
        { q: '¿Cuánto tiempo toma preparar estos documentos?', a: 'La mayoría de los documentos se completan en 15-30 minutos. Recibirá su PDF inmediatamente después del pago, listo para firmar ante testigos o notario.' },
      ],
    },
    disclaimer: 'Multi Servicios 360 es una plataforma de preparación de documentos legales de autoayuda. No somos un bufete de abogados y no proporcionamos asesoría legal ni representación. Para situaciones complejas, consulte un abogado con licencia.',
    cta: 'Comenzar Ahora',
    from: 'Desde',
    includes: ['Documento PDF bilingüe', 'Guardado en Bóveda Digital 90 días', 'Instrucciones de firma', 'Soporte en español'],
    includesTitle: 'Cada documento incluye:',
    popular: 'Más Popular',
    notarize: 'Requiere notarización',
    witnesses: 'Requiere 2 testigos',
  },
  en: {
    lang: 'en',
    langSwitch: 'Español',
    langSwitchUrl: '/planificacion-familiar',
    backHome: '← Back to Home',
    nav: { home: 'Home', trust: 'Living Trust', poa: 'Power of Attorney', contact: 'Contact' },
    hero: {
      badge: 'Family Planning',
      title: 'Protect Your Family with the Right Legal Documents',
      subtitle: 'Wills, HIPAA authorization, and trust documents prepared online — in English and Spanish — no attorney visit required.',
      trustBadge: 'Reviewed by California attorneys',
    },
    whyMatters: {
      title: 'Why these documents matter',
      subtitle: 'Without planning, the state decides for you. With the right documents, you protect your family.',
      reasons: [
        { icon: '⚖️', title: 'Without a will, California decides', desc: 'If you die without a will, the state distributes your assets under its laws — not according to your wishes.' },
        { icon: '🏥', title: 'Without HIPAA, no one can help', desc: 'If unconscious, hospitals cannot share medical information even with your spouse without written authorization.' },
        { icon: '🏦', title: 'Banks require documentation', desc: 'To transfer assets to your trust, banks require a Certification of Trust by law (CA Probate Code §18100.5).' },
      ],
    },
    documents: [
      {
        key: 'pour_over_will',
        icon: <ScrollIcon />,
        color: '#7C3AED',
        bgColor: '#F5F3FF',
        badge: 'Most Popular',
        badgeColor: '#7C3AED',
        title: 'Pour-Over Will',
        subtitle: 'Testamento de Traspaso al Fideicomiso',
        price: '$199',
        desc: 'Automatically transfers all remaining assets to your existing trust at death. Essential companion to your Living Trust.',
        features: [
          'Transfers overlooked assets to trust',
          'Names executor and minor guardian',
          'Includes no-contest clause',
          'Requires 2 adult witnesses (CA §6110)',
        ],
        url: '/en/pour-over-will',
        requiresTrust: true,
      },
      {
        key: 'simple_will',
        icon: <ScrollIcon />,
        color: '#1D4ED8',
        bgColor: '#EFF6FF',
        badge: 'No Prior Trust Needed',
        badgeColor: '#1D4ED8',
        title: 'Last Will & Testament',
        subtitle: 'Testamento Simple',
        price: '$149',
        desc: 'Complete and valid California will to distribute your assets, name an executor, and designate a guardian for your children.',
        features: [
          'Asset distribution to beneficiaries',
          'Executor and alternate appointment',
          'Guardian designation for minors',
          'Simultaneous death clause included',
        ],
        url: '/en/simple-will',
        requiresTrust: false,
      },
      {
        key: 'hipaa_authorization',
        icon: <HospitalIcon />,
        color: '#059669',
        bgColor: '#ECFDF5',
        badge: 'Required by Hospitals',
        badgeColor: '#059669',
        title: 'HIPAA Authorization',
        subtitle: 'Autorización HIPAA',
        price: '$99',
        desc: 'Authorizes a trusted family member or agent to access your medical information in an emergency. Compliant with federal HIPAA and California CMIA.',
        features: [
          'Access to medical and psychiatric records',
          'Includes HIV/AIDS and substance records',
          'Complies with 45 CFR §164.508 (HIPAA)',
          'Complies with CA Civil Code §56.10 (CMIA)',
        ],
        url: '/en/hipaa-authorization',
        requiresTrust: false,
      },
      {
        key: 'certification_of_trust',
        icon: <BankIcon />,
        color: '#B45309',
        bgColor: '#FFFBEB',
        badge: 'Required by Banks',
        badgeColor: '#B45309',
        title: 'Certification of Trust',
        subtitle: 'Certificación de Fideicomiso',
        price: '$99',
        desc: 'Official document required by banks and title companies to open accounts or transfer assets to your trust, without revealing its full contents.',
        features: [
          'Required by banks and title companies',
          'Keeps trust details private',
          'Complies with CA Probate Code §18100.5',
          'Notarization required',
        ],
        url: '/en/certification-of-trust',
        requiresTrust: true,
      },
    ],
    packages: {
      title: 'Family Planning Packages',
      subtitle: 'Save by getting the documents you need together',
      items: [
        {
          name: 'Basic Protection Package',
          docs: ['Simple Will', 'HIPAA Authorization'],
          price: '$224',
          savings: 'Save $24',
          color: '#1D4ED8',
          url: '/en/simple-will',
          cta: 'Start with Will',
        },
        {
          name: 'Complete Trust Package',
          docs: ['Pour-Over Will', 'HIPAA Authorization', 'Certification of Trust'],
          price: '$373',
          savings: 'Save $24',
          color: '#7C3AED',
          url: '/en/pour-over-will',
          cta: 'Start with Will',
          featured: true,
        },
      ],
    },
    trust: {
      title: 'Need a Living Trust first?',
      desc: 'The Pour-Over Will and Certification of Trust require an existing trust. If you don\'t have one yet, start here.',
      cta: 'Create my Living Trust',
      price: 'From $499',
      url: '/en/trust',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { q: 'Are these documents valid in California?', a: 'Yes. All our documents are prepared with clauses compliant with the California Probate Code. Wills require 2 adult witnesses to be legally valid.' },
        { q: 'Do I need an attorney for a will?', a: 'California does not require an attorney to prepare a will. Our platform guides you step by step. For complex situations (multiple properties, businesses, family disputes), we recommend consulting an attorney.' },
        { q: 'What\'s the difference between a Simple Will and a Pour-Over Will?', a: 'A Simple Will is for people without a trust — it distributes assets directly to beneficiaries. A Pour-Over Will complements an existing trust, automatically transferring any assets left outside the trust.' },
        { q: 'Why do I need HIPAA Authorization if I already have a Power of Attorney?', a: 'A Power of Attorney covers financial and legal decisions. HIPAA Authorization is specific to medical information. Hospitals require it separately under federal privacy laws.' },
        { q: 'How long does it take to prepare these documents?', a: 'Most documents are completed in 15-30 minutes. You\'ll receive your PDF immediately after payment, ready to sign before witnesses or a notary.' },
      ],
    },
    disclaimer: 'Multi Servicios 360 is a self-help legal document preparation platform. We are not a law firm and do not provide legal advice or representation. For complex situations, please consult a licensed attorney.',
    cta: 'Get Started',
    from: 'From',
    includes: ['Bilingual PDF document', 'Saved in Digital Vault 90 days', 'Signing instructions', 'Spanish support'],
    includesTitle: 'Each document includes:',
    popular: 'Most Popular',
    notarize: 'Notarization required',
    witnesses: '2 witnesses required',
  },
};

export default function FamiliaClient({ lang = 'es' }) {
  const t = T[lang];
  const [openFaq, setOpenFaq] = useState(null);

  // JSON-LD Schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': lang === 'es' ? 'https://multiservicios360.net/planificacion-familiar' : 'https://multiservicios360.net/en/family-planning',
        url: lang === 'es' ? 'https://multiservicios360.net/planificacion-familiar' : 'https://multiservicios360.net/en/family-planning',
        name: lang === 'es' ? 'Planificación Familiar | Testamentos y Documentos | Multi Servicios 360' : 'Family Planning | Wills & Legal Documents | Multi Servicios 360',
        description: lang === 'es' ? 'Testamentos, Autorización HIPAA y documentos de fideicomiso para la comunidad latina en California.' : 'Wills, HIPAA Authorization, and trust documents for the Latino community in California.',
        inLanguage: lang === 'es' ? 'es-US' : 'en-US',
      },
      {
        '@type': 'ItemList',
        name: lang === 'es' ? 'Documentos de Planificación Familiar' : 'Family Planning Documents',
        itemListElement: t.documents.map((doc, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Service',
            name: doc.title,
            description: doc.desc,
            offers: {
              '@type': 'Offer',
              price: doc.price.replace('$', ''),
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
            provider: {
              '@type': 'Organization',
              name: 'Multi Servicios 360',
              url: 'https://multiservicios360.net',
            },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: t.faq.items.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      {
        '@type': 'Organization',
        name: 'Multi Servicios 360',
        url: 'https://multiservicios360.net',
        logo: 'https://multiservicios360.net/logo.png',
        sameAs: ['https://multiservicios360.net'],
        areaServed: { '@type': 'State', name: 'California' },
        serviceType: 'Legal Document Preparation',
      },
    ],
  };

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
        <Navbar lang={t.lang} currentPath={t.lang === 'es' ? '/planificacion-familiar' : '/en/family-planning'} />

        {/* ── HERO ─────────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4338CA 100%)', padding: '72px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Background pattern */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(124,58,237,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.2) 0%, transparent 40%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', maxWidth: '780px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '6px 16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '16px' }}>👨‍👩‍👧‍👦</span>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{t.hero.badge}</span>
            </div>

            <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: '800', lineHeight: '1.15', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
              {t.hero.title}
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(15px, 2.5vw, 20px)', lineHeight: '1.6', margin: '0 0 36px', maxWidth: '620px', marginLeft: 'auto', marginRight: 'auto' }}>
              {t.hero.subtitle}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
              <Link href={lang === 'es' ? '/simple-will' : '/en/simple-will'} style={{ padding: '14px 28px', backgroundColor: '#FCD34D', color: '#1E1B4B', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', boxShadow: '0 4px 14px rgba(252,211,77,0.4)' }}>
                📋 {lang === 'es' ? 'Testamento Simple — $149' : 'Simple Will — $149'}
              </Link>
              <Link href={lang === 'es' ? '/pour-over-will' : '/en/pour-over-will'} style={{ padding: '14px 28px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', border: '2px solid rgba(255,255,255,0.3)' }}>
                📜 {lang === 'es' ? 'Testamento de Traspaso — $199' : 'Pour-Over Will — $199'}
              </Link>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '100px', padding: '6px 16px' }}>
              <ShieldIcon />
              <span style={{ color: '#6EE7B7', fontSize: '13px', fontWeight: '600' }}>{t.hero.trustBadge}</span>
            </div>
          </div>
        </section>

        {/* ── WHY IT MATTERS ───────────────────────────────── */}
        <section style={{ backgroundColor: 'white', padding: '64px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: '12px' }}>{t.whyMatters.title}</h2>
            <p style={{ color: '#64748B', textAlign: 'center', fontSize: '17px', marginBottom: '48px', lineHeight: '1.6' }}>{t.whyMatters.subtitle}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {t.whyMatters.reasons.map((r, i) => (
                <div key={i} style={{ padding: '28px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{r.icon}</div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>{r.title}</h3>
                  <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DOCUMENTS ────────────────────────────────────── */}
        <section id="documentos" style={{ padding: '72px 24px', backgroundColor: '#F8FAFC' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: '12px' }}>
              {lang === 'es' ? 'Documentos Disponibles' : 'Available Documents'}
            </h2>
            <p style={{ color: '#64748B', textAlign: 'center', fontSize: '16px', marginBottom: '48px' }}>
              {lang === 'es' ? 'Prepare cada documento en 15-30 minutos. PDF listo para firmar inmediatamente.' : 'Prepare each document in 15-30 minutes. Sign-ready PDF delivered immediately.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
              {t.documents.map((doc) => (
                <div key={doc.key} style={{ backgroundColor: 'white', borderRadius: '16px', border: `2px solid ${doc.color}22`, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Card header */}
                  <div style={{ padding: '24px 24px 20px', borderBottom: `3px solid ${doc.color}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ width: '52px', height: '52px', backgroundColor: doc.bgColor, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: doc.color }}>
                        {doc.icon}
                      </div>
                      <span style={{ backgroundColor: doc.bgColor, color: doc.badgeColor, fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '100px', border: `1px solid ${doc.color}33` }}>
                        {doc.badge}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px' }}>{doc.title}</h3>
                    <p style={{ color: '#94A3B8', fontSize: '13px', margin: '0 0 12px', fontStyle: 'italic' }}>{doc.subtitle}</p>
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{doc.desc}</p>
                  </div>

                  {/* Features */}
                  <div style={{ padding: '20px 24px', flex: 1 }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {doc.features.map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px', fontSize: '13px', color: '#374151' }}>
                          <span style={{ color: doc.color, marginTop: '2px', flexShrink: 0 }}><CheckIcon /></span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {doc.requiresTrust && (
                      <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: '#FEF3C7', borderRadius: '6px', fontSize: '12px', color: '#92400E' }}>
                        ⚠️ {lang === 'es' ? 'Requiere fideicomiso existente' : 'Requires an existing trust'}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div style={{ padding: '20px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: doc.color }}>{doc.price}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{doc.requiresTrust || doc.key === 'certification_of_trust' ? t.notarize : t.witnesses}</div>
                    </div>
                    <Link href={doc.url} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 22px', backgroundColor: doc.color, color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', boxShadow: `0 4px 12px ${doc.color}44` }}>
                      {t.cta} <ArrowIcon />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ──────────────────────────────── */}
        <section style={{ backgroundColor: 'white', padding: '48px 24px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', marginBottom: '24px' }}>{t.includesTitle}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
              {t.includes.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                  <span style={{ color: '#16A34A' }}><CheckIcon /></span>
                  <span style={{ fontSize: '13px', color: '#166534', fontWeight: '500' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST UPSELL ─────────────────────────────────── */}
        <section style={{ padding: '48px 24px', backgroundColor: '#F8FAFC' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: '20px', padding: '40px', textAlign: 'center', color: 'white', boxShadow: '0 8px 32px rgba(5,150,105,0.3)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏡</div>
              <h3 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 12px' }}>{t.trust.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px' }}>{t.trust.desc}</p>
              <Link href={t.trust.url} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: '#FCD34D', color: '#064E3B', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                {t.trust.cta} — {t.trust.price} <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section style={{ backgroundColor: 'white', padding: '72px 24px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: '48px' }}>{t.faq.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {t.faq.items.map((item, i) => (
                <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', textAlign: 'left', padding: '20px 24px', background: openFaq === i ? '#F8FAFC' : 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B' }}>{item.q}</span>
                    <span style={{ color: '#7C3AED', fontSize: '20px', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 24px 20px', backgroundColor: '#F8FAFC' }}>
                      <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, #1E1B4B, #4338CA)', padding: '72px 24px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '800', margin: '0 0 16px' }}>
            {lang === 'es' ? '¿Listo para proteger a su familia?' : 'Ready to protect your family?'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', margin: '0 0 36px' }}>
            {lang === 'es' ? 'Empiece hoy en 15 minutos. Sin cita. Sin esperas.' : 'Get started today in 15 minutes. No appointment. No waiting.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={lang === 'es' ? '/simple-will' : '/en/simple-will'} style={{ padding: '16px 32px', backgroundColor: '#FCD34D', color: '#1E1B4B', textDecoration: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '16px', boxShadow: '0 4px 14px rgba(252,211,77,0.4)' }}>
              📋 {lang === 'es' ? 'Testamento Simple — $149' : 'Simple Will — $149'}
            </Link>
            <Link href={lang === 'es' ? '/pour-over-will' : '/en/pour-over-will'} style={{ padding: '16px 32px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '16px', border: '2px solid rgba(255,255,255,0.3)' }}>
              📜 {lang === 'es' ? 'Testamento de Traspaso — $199' : 'Pour-Over Will — $199'}
            </Link>
          </div>
        </section>

        {/* ── FOOTER DISCLAIMER ─────────────────────────────── */}
        <footer style={{ backgroundColor: '#0F172A', padding: '32px 24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ color: '#64748B', fontSize: '12px', lineHeight: '1.6', margin: '0 0 16px' }}>{t.disclaimer}</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={lang === 'es' ? '/' : '/en'} style={{ color: '#94A3B8', fontSize: '13px', textDecoration: 'none' }}>{t.backHome}</Link>
              <Link href={lang === 'es' ? '/contacto' : '/en/contact'} style={{ color: '#94A3B8', fontSize: '13px', textDecoration: 'none' }}>{t.nav.contact}</Link>
              <Link href={lang === 'es' ? '/mas-servicios' : '/en/more-services'} style={{ color: '#94A3B8', fontSize: '13px', textDecoration: 'none' }}>{lang === 'es' ? 'Todos los Servicios' : 'All Services'}</Link>
            </div>
            <p style={{ color: '#334155', fontSize: '12px', marginTop: '16px' }}>© {new Date().getFullYear()} Multi Servicios 360 · California Legal Document Preparation</p>
          </div>
        </footer>
      </div>
    </>
  );
}
