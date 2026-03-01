'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

// ── ICONS ──────────────────────────────────────────────────────────────
const BuildingIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
const FileTextIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>);
const BankIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>);
const ClipboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const ArrowIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
const ShieldIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);

const T = {
  es: {
    lang: 'es',
    langSwitch: 'English',
    langSwitchUrl: '/en/business',
    backHome: '← Regresar al Inicio',
    hero: {
      badge: 'Documentos de Negocios',
      title: 'Forme su Corporación o Expanda su Negocio',
      subtitle: 'S-Corp, C-Corp, actas corporativas y resoluciones bancarias — preparados en línea en español e inglés. Para pequeños negocios latinos en California.',
      trustBadge: 'Cumple con California Corporations Code §200-§213',
    },
    whyMatters: {
      title: '¿Por qué formalizar su negocio?',
      subtitle: 'Operar sin estructura legal expone su patrimonio personal. La protección correcta empieza con los documentos correctos.',
      reasons: [
        { icon: '🛡️', title: 'Proteja su patrimonio personal', desc: 'Una corporación o LLC crea una separación legal entre sus bienes personales y las deudas del negocio.' },
        { icon: '🏦', title: 'Abra cuentas bancarias comerciales', desc: 'Los bancos requieren Acta Constitutiva, Estatutos y Resolución Bancaria para abrir cuentas a nombre del negocio.' },
        { icon: '💰', title: 'Ahorre en impuestos con S-Corp', desc: 'Una S-Corporation puede reducir significativamente los impuestos de self-employment. Requiere elección IRS Form 2553.' },
      ],
    },
    documents: [
      {
        key: 's_corp_formation',
        icon: <BuildingIcon />,
        color: '#1E3A8A',
        bgColor: '#EFF6FF',
        badge: 'Paquete Completo',
        badgeColor: '#1E3A8A',
        title: 'Formación S-Corporation',
        subtitle: 'S-Corp Formation Package',
        price: '$499',
        desc: 'Todo lo que necesita para incorporarse como S-Corporation en California. Acta Constitutiva, Estatutos, Actas Iniciales, Resolución Bancaria y Resolución de Elección S-Corp.',
        features: [
          'Acta Constitutiva (Form ARTS-GS CA)',
          'Estatutos corporativos — 8 secciones',
          'Actas Organizacionales Iniciales',
          'Resolución Bancaria incluida',
          'Resolución de Elección S-Corp (IRS §1362)',
          'Nombramiento de directores y funcionarios',
        ],
        warning: 'Requiere presentación ante el Secretario de Estado de CA + IRS Form 2553 por separado.',
        url: '/s-corp-formation',
      },
      {
        key: 'c_corp_formation',
        icon: <BuildingIcon />,
        color: '#0F172A',
        bgColor: '#F8FAFC',
        badge: 'Para Inversionistas',
        badgeColor: '#0F172A',
        title: 'Formación C-Corporation',
        subtitle: 'C-Corp Formation Package',
        price: '$499',
        desc: 'Formación completa de C-Corporation con cláusula de acciones preferentes. Ideal para startups que buscan inversión o negocios con múltiples accionistas.',
        features: [
          'Acta Constitutiva (Form ARTS-GS CA)',
          'Estatutos corporativos completos',
          'Actas Organizacionales Iniciales',
          'Resolución Bancaria incluida',
          'Cláusula de Acciones Preferentes',
          'Sin requisito de elección IRS',
        ],
        warning: 'Ingreso sujeto a doble tributación. Requiere presentación ante el Secretario de Estado de CA.',
        url: '/c-corp-formation',
      },
      {
        key: 'corporate_minutes',
        icon: <ClipboardIcon />,
        color: '#374151',
        bgColor: '#F9FAFB',
        badge: 'Requerido Anualmente',
        badgeColor: '#374151',
        title: 'Actas Corporativas',
        subtitle: 'Corporate Minutes',
        price: '$149',
        desc: 'Registro oficial de reuniones de accionistas, directores o especiales. Requerido en California para mantener la protección corporativa y evitar la confusión de entidades.',
        features: [
          'Reunión Anual de Accionistas',
          'Reunión de Junta Directiva',
          'Reunión Especial',
          'Elección/ratificación de directores',
          'Registro de resoluciones adoptadas',
          'Firma del Presidente y Secretario',
        ],
        url: '/corporate-minutes',
      },
      {
        key: 'banking_resolution',
        icon: <BankIcon />,
        color: '#065F46',
        bgColor: '#ECFDF5',
        badge: 'Requerido por Bancos',
        badgeColor: '#065F46',
        title: 'Resolución Bancaria',
        subtitle: 'Banking Resolution',
        price: '$99',
        desc: 'Documento requerido por bancos para abrir cuentas comerciales a nombre de su corporación o LLC. Designa firmantes autorizados y tipo de cuentas.',
        features: [
          'Para corporaciones y LLCs',
          'Designación de banco e institución',
          'Firmantes autorizados para la cuenta',
          'Opción firma individual o dual',
          'Incluye autorización de banca en línea',
          'Certifica resolución corporativa',
        ],
        url: '/banking-resolution',
      },
      {
        key: 'contractor_agreement',
        icon: <ClipboardIcon />,
        color: '#D97706',
        bgColor: '#FFFBEB',
        badge: 'Cumple AB5',
        badgeColor: '#D97706',
        title: 'Contrato de Contratista',
        subtitle: 'Independent Contractor Agreement',
        price: '$149',
        desc: 'Proteja su negocio con un contrato que cumple con AB5 y las leyes laborales de California. Incluye cláusulas de alcance, pago, propiedad intelectual y terminación.',
        features: [
          'Cumple con el test ABC de AB5',
          'Cláusula de propiedad intelectual (work for hire)',
          'Alcance, precio y fechas de entrega',
          'Confidencialidad y terminación incluidas',
        ],
        url: '/contractor-agreement',
      },
      {
        key: 'demand_letter',
        icon: <FileTextIcon />,
        color: '#DC2626',
        bgColor: '#FEF2F2',
        badge: 'Requisito Previo a Small Claims',
        badgeColor: '#DC2626',
        title: 'Carta de Demanda',
        subtitle: 'Demand Letter',
        price: '$99',
        desc: 'Cobre lo que le deben sin ir a la corte. Carta profesional para cobrar deudas, disputar contratos o exigir devolución de depósito en California.',
        features: [
          'Requerido antes de Small Claims Court',
          'Para cobro de deudas y disputas de contrato',
          'Plazo de respuesta de 10-30 días',
          'Incluye advertencia de consecuencias legales',
        ],
        url: '/demand-letter',
      },
    ],
    comparison: {
      title: '¿S-Corp o C-Corp? Conozca la diferencia',
      rows: [
        { label: 'Tributación', s: 'Pass-through (sin doble impuesto)', c: 'Doble tributación' },
        { label: 'Self-employment tax', s: 'Reducido para dueño-empleado', c: 'N/A' },
        { label: 'Ideal para', s: 'Negocios con 1-10 dueños', c: 'Startups con inversionistas' },
        { label: 'Acciones preferentes', s: 'No', c: 'Sí' },
        { label: 'Límite de accionistas', s: 'Máx. 100', c: 'Sin límite' },
        { label: 'IRS Form 2553', s: 'Requerido', c: 'No requerido' },
      ],
    },
    llc: {
      title: '¿Prefiere una LLC?',
      desc: 'La LLC es más flexible y simple. Nuestro paquete incluye Acuerdo de Operación completo con todas las cláusulas de California.',
      cta: 'Formar mi LLC',
      price: 'Desde $299',
      url: '/llc',
    },
    faq: {
      title: 'Preguntas Frecuentes',
      items: [
        { q: '¿Qué necesito para presentar mi corporación en California?', a: 'Necesita: (1) Nombre corporativo disponible, (2) Agente para notificación de proceso con dirección en CA, (3) Acta Constitutiva (Form ARTS-GS), (4) Pago de tarifa al Secretario de Estado (~$100). Nuestra plataforma prepara el Acta Constitutiva y todos los documentos internos. La presentación ante el Estado la hace usted directamente.' },
        { q: '¿Qué es el IRS Form 2553 y cuándo lo debo presentar?', a: 'El Form 2553 es la elección de S-Corporation ante el IRS. Debe presentarse dentro de los 75 días de incorporación, o antes del 15 de marzo del año fiscal. Sin este formulario, su corporación tributa como C-Corporation por defecto. Nuestra plataforma incluye la resolución que autoriza la elección.' },
        { q: '¿Cuánto cuesta mantener una corporación en California?', a: 'California requiere un impuesto mínimo de Franchise Tax de $800/año, pagadero a la California Franchise Tax Board. También debe presentar un Statement of Information cada año ($25). Además de los documentos que preparamos, necesitará renovar anualmente.' },
        { q: '¿Necesito actas corporativas cada año?', a: 'Sí. California requiere que las corporaciones mantengan registros de reuniones anuales para preservar la protección de responsabilidad limitada. Sin actas, existe riesgo de que un tribunal "perfore el velo corporativo" y responsabilice a los dueños personalmente.' },
        { q: '¿Puedo usar la Resolución Bancaria para una LLC también?', a: 'Sí. Nuestra Resolución Bancaria está disponible tanto para corporaciones como para LLCs. Durante el proceso, seleccione el tipo de entidad correspondiente.' },
      ],
    },
    disclaimer: 'Multi Servicios 360 es una plataforma de preparación de documentos legales de autoayuda. No somos un bufete de abogados. Los documentos preparados aquí deben presentarse ante las autoridades correspondientes por separado. Consulte a un CPA o abogado para asesoría fiscal.',
    cta: 'Comenzar Ahora',
    includes: ['Documentos PDF bilingüe', 'Guardado en Bóveda Digital 90 días', 'Instrucciones de presentación', 'Soporte en español'],
    includesTitle: 'Cada paquete incluye:',
  },
  en: {
    lang: 'en',
    langSwitch: 'Español',
    langSwitchUrl: '/negocios',
    backHome: '← Back to Home',
    hero: {
      badge: 'Business Documents',
      title: 'Incorporate or Expand Your Business in California',
      subtitle: 'S-Corp, C-Corp, corporate minutes, and banking resolutions — prepared online in English and Spanish. For Latino small businesses in California.',
      trustBadge: 'Compliant with California Corporations Code §200-§213',
    },
    whyMatters: {
      title: 'Why formalize your business?',
      subtitle: 'Operating without legal structure exposes your personal assets. The right protection starts with the right documents.',
      reasons: [
        { icon: '🛡️', title: 'Protect your personal assets', desc: 'A corporation or LLC creates a legal separation between your personal assets and business debts.' },
        { icon: '🏦', title: 'Open business bank accounts', desc: 'Banks require Articles, Bylaws, and a Banking Resolution to open accounts in the business name.' },
        { icon: '💰', title: 'Save on taxes with S-Corp', desc: 'An S-Corporation can significantly reduce self-employment taxes. Requires IRS Form 2553 election.' },
      ],
    },
    documents: [
      {
        key: 's_corp_formation',
        icon: <BuildingIcon />,
        color: '#1E3A8A',
        bgColor: '#EFF6FF',
        badge: 'Complete Package',
        badgeColor: '#1E3A8A',
        title: 'S-Corporation Formation',
        subtitle: 'Formación S-Corp',
        price: '$499',
        desc: 'Everything you need to incorporate as an S-Corporation in California. Articles of Incorporation, Bylaws, Initial Minutes, Banking Resolution, and S-Corp Election Resolution.',
        features: [
          'Articles of Incorporation (CA Form ARTS-GS)',
          'Corporate Bylaws — 8 sections',
          'Initial Organizational Minutes',
          'Banking Resolution included',
          'S-Corp Election Resolution (IRS §1362)',
          'Director and officer appointments',
        ],
        warning: 'Requires filing with CA Secretary of State + separate IRS Form 2553.',
        url: '/en/s-corp-formation',
      },
      {
        key: 'c_corp_formation',
        icon: <BuildingIcon />,
        color: '#0F172A',
        bgColor: '#F8FAFC',
        badge: 'For Investors',
        badgeColor: '#0F172A',
        title: 'C-Corporation Formation',
        subtitle: 'Formación C-Corp',
        price: '$499',
        desc: 'Complete C-Corporation formation with preferred stock clause. Ideal for startups seeking investment or businesses with multiple shareholders.',
        features: [
          'Articles of Incorporation (CA Form ARTS-GS)',
          'Complete Corporate Bylaws',
          'Initial Organizational Minutes',
          'Banking Resolution included',
          'Preferred Stock clause',
          'No IRS election required',
        ],
        warning: 'Income subject to double taxation. Requires filing with CA Secretary of State.',
        url: '/en/c-corp-formation',
      },
      {
        key: 'corporate_minutes',
        icon: <ClipboardIcon />,
        color: '#374151',
        bgColor: '#F9FAFB',
        badge: 'Required Annually',
        badgeColor: '#374151',
        title: 'Corporate Minutes',
        subtitle: 'Actas Corporativas',
        price: '$149',
        desc: 'Official record of shareholder, director, or special meetings. Required in California to maintain corporate protection and avoid piercing the corporate veil.',
        features: [
          'Annual Shareholders Meeting',
          'Board of Directors Meeting',
          'Special Meeting',
          'Director election/ratification',
          'Record of adopted resolutions',
          'Signed by President and Secretary',
        ],
        url: '/en/corporate-minutes',
      },
      {
        key: 'banking_resolution',
        icon: <BankIcon />,
        color: '#065F46',
        bgColor: '#ECFDF5',
        badge: 'Required by Banks',
        badgeColor: '#065F46',
        title: 'Banking Resolution',
        subtitle: 'Resolución Bancaria',
        price: '$99',
        desc: 'Document required by banks to open commercial accounts in the name of your corporation or LLC. Designates authorized signers and account types.',
        features: [
          'For corporations and LLCs',
          'Designates bank and institution',
          'Authorized account signers',
          'Single or dual signature option',
          'Includes online banking authorization',
          'Corporate resolution certification',
        ],
        url: '/en/banking-resolution',
      },
      {
        key: 'contractor_agreement',
        icon: <ClipboardIcon />,
        color: '#D97706',
        bgColor: '#FFFBEB',
        badge: 'AB5 Compliant',
        badgeColor: '#D97706',
        title: 'Independent Contractor Agreement',
        subtitle: 'Contrato de Contratista',
        price: '$149',
        desc: 'Protect your business with a contract compliant with AB5 and California labor laws. Includes scope, payment, intellectual property, and termination clauses.',
        features: [
          'Complies with AB5 ABC test',
          'Intellectual property / work-for-hire clause',
          'Scope, price and delivery dates',
          'Confidentiality and termination included',
        ],
        url: '/en/contractor-agreement',
      },
      {
        key: 'demand_letter',
        icon: <FileTextIcon />,
        color: '#DC2626',
        bgColor: '#FEF2F2',
        badge: 'Required Before Small Claims',
        badgeColor: '#DC2626',
        title: 'Demand Letter',
        subtitle: 'Carta de Demanda',
        price: '$99',
        desc: 'Collect what you\'re owed without going to court. Professional letter to collect debts, dispute contracts, or demand security deposit return in California.',
        features: [
          'Required before Small Claims Court',
          'For debt collection and contract disputes',
          'Sets 10-30 day response deadline',
          'Includes warning of legal consequences',
        ],
        url: '/en/demand-letter',
      },
    ],
    comparison: {
      title: 'S-Corp vs C-Corp: Know the difference',
      rows: [
        { label: 'Taxation', s: 'Pass-through (no double tax)', c: 'Double taxation' },
        { label: 'Self-employment tax', s: 'Reduced for owner-employees', c: 'N/A' },
        { label: 'Best for', s: 'Businesses with 1-10 owners', c: 'Startups seeking investment' },
        { label: 'Preferred stock', s: 'No', c: 'Yes' },
        { label: 'Shareholder limit', s: 'Max 100', c: 'No limit' },
        { label: 'IRS Form 2553', s: 'Required', c: 'Not required' },
      ],
    },
    llc: {
      title: 'Prefer an LLC?',
      desc: 'An LLC is more flexible and simpler to manage. Our package includes a complete Operating Agreement with all California clauses.',
      cta: 'Form my LLC',
      price: 'From $299',
      url: '/en/llc',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { q: 'What do I need to file my corporation in California?', a: 'You need: (1) Available corporate name, (2) Registered agent with CA address, (3) Articles of Incorporation (Form ARTS-GS), (4) Filing fee to Secretary of State (~$100). Our platform prepares the Articles and all internal documents. You file with the State directly.' },
        { q: 'What is IRS Form 2553 and when do I file it?', a: 'Form 2553 is the S-Corporation election with the IRS. It must be filed within 75 days of incorporation, or by March 15 of the tax year. Without this form, your corporation is taxed as a C-Corporation by default. Our platform includes the resolution authorizing this election.' },
        { q: 'How much does it cost to maintain a California corporation?', a: 'California requires a minimum Franchise Tax of $800/year, payable to the CA Franchise Tax Board. You must also file a Statement of Information annually ($25). In addition to the documents we prepare, you\'ll need to renew these filings each year.' },
        { q: 'Do I need corporate minutes every year?', a: 'Yes. California requires corporations to maintain annual meeting records to preserve limited liability protection. Without minutes, a court may "pierce the corporate veil" and hold owners personally liable.' },
        { q: 'Can I use the Banking Resolution for an LLC too?', a: 'Yes. Our Banking Resolution is available for both corporations and LLCs. During the process, select the corresponding entity type.' },
      ],
    },
    disclaimer: 'Multi Servicios 360 is a self-help legal document preparation platform. We are not a law firm. Documents prepared here must be filed with the appropriate authorities separately. Consult a CPA or attorney for tax advice.',
    cta: 'Get Started',
    includes: ['Bilingual PDF documents', 'Saved in Digital Vault 90 days', 'Filing instructions', 'Spanish support'],
    includesTitle: 'Each package includes:',
  },
};

export default function NegociosClient({ lang = 'es' }) {
  const t = T[lang];
  const [openFaq, setOpenFaq] = useState(null);

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': lang === 'es' ? 'https://multiservicios360.net/negocios' : 'https://multiservicios360.net/en/business',
        url: lang === 'es' ? 'https://multiservicios360.net/negocios' : 'https://multiservicios360.net/en/business',
        name: lang === 'es' ? 'Formación de Corporaciones en California | Multi Servicios 360' : 'California Corporation Formation | Multi Servicios 360',
        description: lang === 'es' ? 'S-Corp, C-Corp, Actas Corporativas y Resolución Bancaria para pequeños negocios latinos en California.' : 'S-Corp, C-Corp, Corporate Minutes and Banking Resolution for Latino small businesses in California.',
        inLanguage: lang === 'es' ? 'es-US' : 'en-US',
      },
      {
        '@type': 'ItemList',
        name: lang === 'es' ? 'Documentos de Negocios' : 'Business Documents',
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
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
        <Navbar lang={t.lang} currentPath={t.lang === 'es' ? '/negocios' : '/en/business'} langSwitchUrl={t.langSwitchUrl} />

        {/* ── HERO ─────────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, #0C1445 0%, #1E3A8A 50%, #1D4ED8 100%)', padding: '72px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(30,58,138,0.4) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(29,78,216,0.2) 0%, transparent 40%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '6px 16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '16px' }}>🏢</span>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{t.hero.badge}</span>
            </div>
            <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: '800', lineHeight: '1.15', margin: '0 0 20px', letterSpacing: '-0.02em' }}>{t.hero.title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(15px, 2.5vw, 20px)', lineHeight: '1.6', margin: '0 0 36px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>{t.hero.subtitle}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
              <Link href={lang === 'es' ? '/s-corp-formation' : '/en/s-corp-formation'} style={{ padding: '14px 28px', backgroundColor: '#FCD34D', color: '#0C1445', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', boxShadow: '0 4px 14px rgba(252,211,77,0.4)' }}>
                🏢 {lang === 'es' ? 'S-Corporation — $499' : 'S-Corporation — $499'}
              </Link>
              <Link href={lang === 'es' ? '/llc' : '/en/llc'} style={{ padding: '14px 28px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', border: '2px solid rgba(255,255,255,0.3)' }}>
                🏗️ {lang === 'es' ? 'Formar LLC — Desde $299' : 'Form LLC — From $299'}
              </Link>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '100px', padding: '6px 16px' }}>
              <ShieldIcon />
              <span style={{ color: '#6EE7B7', fontSize: '13px', fontWeight: '600' }}>{t.hero.trustBadge}</span>
            </div>
          </div>
        </section>

        {/* ── WHY FORMALIZE ────────────────────────────────── */}
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
              {lang === 'es' ? 'Todo listo en 30 minutos. PDF bilingüe incluido.' : 'Everything ready in 30 minutes. Bilingual PDF included.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
              {t.documents.map((doc) => (
                <div key={doc.key} style={{ backgroundColor: 'white', borderRadius: '16px', border: `2px solid ${doc.color}22`, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
                  <div style={{ padding: '20px 24px', flex: 1 }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {doc.features.map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px', fontSize: '13px', color: '#374151' }}>
                          <span style={{ color: doc.color, marginTop: '2px', flexShrink: 0 }}><CheckIcon /></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    {doc.warning && (
                      <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: '#FEF3C7', borderRadius: '6px', fontSize: '12px', color: '#92400E' }}>
                        ⚠️ {doc.warning}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '20px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: doc.color }}>{doc.price}</div>
                    <Link href={doc.url} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 22px', backgroundColor: doc.color, color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', boxShadow: `0 4px 12px ${doc.color}44` }}>
                      {t.cta} <ArrowIcon />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── S-CORP vs C-CORP COMPARISON ──────────────────── */}
        <section style={{ backgroundColor: 'white', padding: '64px 24px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: '36px' }}>{t.comparison.title}</h2>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', backgroundColor: '#0F172A' }}>
                <div style={{ padding: '16px', color: '#94A3B8', fontWeight: '600', fontSize: '13px' }}>{lang === 'es' ? 'Característica' : 'Feature'}</div>
                <div style={{ padding: '16px', color: '#FCD34D', fontWeight: '700', fontSize: '14px', textAlign: 'center' }}>S-Corp</div>
                <div style={{ padding: '16px', color: '#93C5FD', fontWeight: '700', fontSize: '14px', textAlign: 'center' }}>C-Corp</div>
              </div>
              {t.comparison.rows.map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', backgroundColor: i % 2 === 0 ? 'white' : '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                  <div style={{ padding: '14px 16px', fontSize: '13px', color: '#374151', fontWeight: '500' }}>{row.label}</div>
                  <div style={{ padding: '14px 16px', fontSize: '13px', color: '#1D4ED8', textAlign: 'center' }}>{row.s}</div>
                  <div style={{ padding: '14px 16px', fontSize: '13px', color: '#0F172A', textAlign: 'center' }}>{row.c}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ──────────────────────────────── */}
        <section style={{ backgroundColor: '#F8FAFC', padding: '48px 24px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', marginBottom: '24px' }}>{t.includesTitle}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
              {t.includes.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                  <span style={{ color: '#1D4ED8' }}><CheckIcon /></span>
                  <span style={{ fontSize: '13px', color: '#1E3A8A', fontWeight: '500' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LLC UPSELL ───────────────────────────────────── */}
        <section style={{ padding: '48px 24px', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4338CA 100%)', borderRadius: '20px', padding: '40px', textAlign: 'center', color: 'white', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏗️</div>
              <h3 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 12px' }}>{t.llc.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px' }}>{t.llc.desc}</p>
              <Link href={t.llc.url} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', backgroundColor: '#FCD34D', color: '#1E1B4B', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                {t.llc.cta} — {t.llc.price} <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section style={{ backgroundColor: '#F8FAFC', padding: '72px 24px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: '48px' }}>{t.faq.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {t.faq.items.map((item, i) => (
                <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', textAlign: 'left', padding: '20px 24px', background: openFaq === i ? '#EFF6FF' : 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B' }}>{item.q}</span>
                    <span style={{ color: '#1D4ED8', fontSize: '20px', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 24px 20px', backgroundColor: '#EFF6FF' }}>
                      <p style={{ color: '#1E3A8A', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, #0C1445, #1D4ED8)', padding: '72px 24px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '800', margin: '0 0 16px' }}>
            {lang === 'es' ? '¿Listo para formalizar su negocio?' : 'Ready to formalize your business?'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', margin: '0 0 36px' }}>
            {lang === 'es' ? 'Documentos listos en 30 minutos. Sin cita. Sin esperas.' : 'Documents ready in 30 minutes. No appointment. No waiting.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={lang === 'es' ? '/s-corp-formation' : '/en/s-corp-formation'} style={{ padding: '16px 32px', backgroundColor: '#FCD34D', color: '#0C1445', textDecoration: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '16px', boxShadow: '0 4px 14px rgba(252,211,77,0.4)' }}>
              🏢 {lang === 'es' ? 'Formar S-Corp — $499' : 'Form S-Corp — $499'}
            </Link>
            <Link href={lang === 'es' ? '/llc' : '/en/llc'} style={{ padding: '16px 32px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '16px', border: '2px solid rgba(255,255,255,0.3)' }}>
              🏗️ {lang === 'es' ? 'Formar LLC — Desde $299' : 'Form LLC — From $299'}
            </Link>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────── */}
        <footer style={{ backgroundColor: '#0F172A', padding: '32px 24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ color: '#64748B', fontSize: '12px', lineHeight: '1.6', margin: '0 0 16px' }}>{t.disclaimer}</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={lang === 'es' ? '/' : '/en'} style={{ color: '#94A3B8', fontSize: '13px', textDecoration: 'none' }}>{t.backHome}</Link>
              <Link href={lang === 'es' ? '/planificacion-familiar' : '/en/family-planning'} style={{ color: '#94A3B8', fontSize: '13px', textDecoration: 'none' }}>{lang === 'es' ? 'Planificación Familiar' : 'Family Planning'}</Link>
              <Link href={lang === 'es' ? '/mas-servicios' : '/en/more-services'} style={{ color: '#94A3B8', fontSize: '13px', textDecoration: 'none' }}>{lang === 'es' ? 'Todos los Servicios' : 'All Services'}</Link>
            </div>
            <p style={{ color: '#334155', fontSize: '12px', marginTop: '16px' }}>© {new Date().getFullYear()} Multi Servicios 360 · California Legal Document Preparation</p>
          </div>
        </footer>
      </div>
    </>
  );
}
