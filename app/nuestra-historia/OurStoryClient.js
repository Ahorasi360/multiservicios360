'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const CONTENT = {
  es: {
    hero: {
      title: 'Nuestra Historia',
      subtitle: 'Acceso moderno a documentos legales para la comunidad latina en California',
    },
    intro: [
      'California es hogar de millones de latinos que trabajan duro, construyen negocios, compran propiedades y crean patrimonio para sus familias.',
      'Sin embargo, una realidad sigue presente:',
      'Muchas personas no cuentan con documentos legales básicos como poderes notariales, fideicomisos en vida o estructuras empresariales adecuadas.',
      'No por falta de responsabilidad. No por falta de intención.',
      'Sino porque el acceso tradicional suele ser complicado, costoso o intimidante.',
    ],
    introBold: 'Multiservicios 360 nace para cerrar esa brecha.',
    need: {
      title: 'La necesidad era clara',
      text: 'En California, millones de familias latinas forman parte activa de la economía. Sin embargo, el acceso a herramientas legales básicas sigue siendo desigual.',
      listIntro: 'Vimos constantemente:',
      items: [
        'Confusión sobre cómo preparar un poder notarial en California',
        'Desconocimiento sobre qué es un fideicomiso en vida',
        'Emprendedores sin una LLC correctamente estructurada',
        'Familias sin planificación básica para proteger sus bienes',
      ],
      closing: 'El problema no era la falta de interés. Era la falta de un proceso claro y accesible.',
    },
    changed: {
      title: 'El mundo cambió — y los trámites también deben cambiar',
      intro: 'Hoy las personas:',
      items: [
        'Trabajan desde casa',
        'Hacen transferencias bancarias desde su teléfono',
        'Presentan impuestos en línea',
        'Administran negocios digitalmente',
      ],
      text: [
        'Sin embargo, cuando se trata de documentos legales en California, muchos aún creen que deben desplazarse, esperar semanas o enfrentar procesos complejos.',
        'La tecnología ya transformó la banca, los impuestos y el comercio.',
        'Era momento de modernizar también la preparación de documentos legales básicos.',
      ],
      bold: 'Multiservicios 360 es parte de esa transformación.',
    },
    whatIs: {
      title: 'Qué es Multiservicios 360',
      text: 'Multiservicios 360 es una plataforma bilingüe (español e inglés) de preparación de documentos legales en California.',
      listIntro: 'Permite a los usuarios:',
      items: [
        'Preparar un poder notarial general',
        'Generar un poder notarial limitado',
        'Crear un fideicomiso en vida (Living Trust)',
        'Formar una LLC en California',
      ],
      text2: 'Todo mediante un proceso digital guiado, estructurado y claro.',
      disclaimer: 'No es un bufete de abogados. No ofrece asesoría legal.',
      closing: 'Es tecnología diseñada para organizar información y facilitar la auto-preparación de documentos legales.',
    },
    howWorks: {
      title: 'Cómo funciona la plataforma',
      steps: [
        'Seleccionas el servicio que necesitas',
        'Respondes preguntas guiadas paso a paso',
        'El sistema genera tu documento',
        'Descargas tu documento y lo guardas en tu portal seguro',
      ],
      notes: [
        'Sin desplazamientos innecesarios. Sin procesos confusos. Sin presiones externas.',
        'La comodidad no reemplaza la ley. La tecnología organiza el proceso.',
      ],
    },
    transparency: {
      title: 'Transparencia y cumplimiento',
      lines: [
        'Multiservicios 360 es una plataforma de software.',
        'No somos un bufete de abogados. No brindamos asesoría legal. No existe relación abogado-cliente entre el usuario y la plataforma.',
        'Si necesitas asesoría legal personalizada, recomendamos consultar con un abogado licenciado en California.',
        'Nuestra misión es proporcionar acceso tecnológico estructurado a documentos legales básicos.',
      ],
    },
    commitment: {
      title: 'Nuestro compromiso con la comunidad',
      intro: 'Creemos que el acceso a herramientas legales esenciales no debería ser complicado.',
      listIntro: 'Nos comprometemos a:',
      items: [
        'Mantener claridad en cada proceso',
        'Ofrecer precios transparentes',
        'Respetar la privacidad del usuario',
        'Mejorar continuamente la plataforma',
        'Servir responsablemente a la comunidad latina en California',
      ],
      closing: [
        'Multiservicios 360 no nació por tendencia.',
        'Nació por una necesidad real en nuestra comunidad.',
      ],
      bold: 'Y este es solo el comienzo.',
    },
    services: {
      title: 'Servicios disponibles hoy en California',
      intro: 'Actualmente puedes preparar:',
      cta: 'Comenzar',
      question: '¿Tienes preguntas?',
      callUs: 'Llámanos al',
    },
    footer: {
      home: 'Inicio',
      terms: 'Términos',
      privacy: 'Privacidad',
      rights: 'Todos los derechos reservados.',
    },
  },
  en: {
    hero: {
      title: 'Our Story',
      subtitle: 'Modern access to legal documents for the Latino community in California',
    },
    intro: [
      'California is home to millions of hardworking Latinos who build businesses, purchase property, and create wealth for their families.',
      'Yet one reality persists:',
      'Many people lack basic legal documents such as powers of attorney, living trusts, or proper business structures.',
      'Not because of a lack of responsibility. Not because of a lack of intention.',
      'But because traditional access is often complicated, expensive, or intimidating.',
    ],
    introBold: 'Multi Servicios 360 was created to bridge that gap.',
    need: {
      title: 'The need was clear',
      text: 'In California, millions of Latino families actively contribute to the economy. Yet access to basic legal tools remains unequal.',
      listIntro: 'We consistently saw:',
      items: [
        'Confusion about how to prepare a power of attorney in California',
        'Lack of awareness about what a living trust is',
        'Entrepreneurs without a properly structured LLC',
        'Families without basic planning to protect their assets',
      ],
      closing: 'The problem was never a lack of interest. It was a lack of a clear, accessible process.',
    },
    changed: {
      title: 'The world changed — and paperwork must change too',
      intro: 'Today, people:',
      items: [
        'Work from home',
        'Make bank transfers from their phone',
        'File taxes online',
        'Manage businesses digitally',
      ],
      text: [
        'Yet when it comes to legal documents in California, many still believe they must travel, wait weeks, or face complicated processes.',
        'Technology has already transformed banking, taxes, and commerce.',
        'It was time to modernize the preparation of basic legal documents too.',
      ],
      bold: 'Multi Servicios 360 is part of that transformation.',
    },
    whatIs: {
      title: 'What is Multi Servicios 360',
      text: 'Multi Servicios 360 is a bilingual (Spanish and English) legal document preparation platform in California.',
      listIntro: 'It allows users to:',
      items: [
        'Prepare a General Power of Attorney',
        'Generate a Limited Power of Attorney',
        'Create a Living Trust',
        'Form an LLC in California',
      ],
      text2: 'All through a guided, structured, and clear digital process.',
      disclaimer: 'It is not a law firm. It does not provide legal advice.',
      closing: 'It is technology designed to organize information and facilitate the self-preparation of legal documents.',
    },
    howWorks: {
      title: 'How the platform works',
      steps: [
        'Select the service you need',
        'Answer guided questions step by step',
        'The system generates your document',
        'Download your document and store it in your secure portal',
      ],
      notes: [
        'No unnecessary travel. No confusing processes. No external pressure.',
        'Convenience does not replace the law. Technology organizes the process.',
      ],
    },
    transparency: {
      title: 'Transparency and compliance',
      lines: [
        'Multi Servicios 360 is a software platform.',
        'We are not a law firm. We do not provide legal advice. No attorney-client relationship exists between the user and the platform.',
        'If you need personalized legal advice, we recommend consulting a licensed attorney in California.',
        'Our mission is to provide structured technological access to basic legal documents.',
      ],
    },
    commitment: {
      title: 'Our commitment to the community',
      intro: 'We believe access to essential legal tools should not be complicated.',
      listIntro: 'We are committed to:',
      items: [
        'Maintaining clarity in every process',
        'Offering transparent pricing',
        'Respecting user privacy',
        'Continuously improving the platform',
        'Responsibly serving the Latino community in California',
      ],
      closing: [
        'Multi Servicios 360 was not born from a trend.',
        'It was born from a real need in our community.',
      ],
      bold: 'And this is just the beginning.',
    },
    services: {
      title: 'Services available today in California',
      intro: 'You can currently prepare:',
      cta: 'Get Started',
      question: 'Have questions?',
      callUs: 'Call us at',
    },
    footer: {
      home: 'Home',
      terms: 'Terms',
      privacy: 'Privacy',
      rights: 'All rights reserved.',
    },
  },
};

const SERVICES = [
  { name: { es: 'Poder Notarial General', en: 'General Power of Attorney' }, href: '/poa', price: '$149', color: '#1E3A8A', icon: '⚖️', desc: { es: 'Poder amplio para asuntos financieros y personales.', en: 'Broad power for financial and personal matters.' }, tags: { es: ['Finanzas', 'Salud', 'Bienes'], en: ['Finance', 'Health', 'Property'] } },
  { name: { es: 'Poder Notarial Limitado', en: 'Limited Power of Attorney' }, href: '/limited-poa', price: '$99', color: '#F59E0B', icon: '📋', desc: { es: 'Poder específico para situaciones concretas.', en: 'Specific power for concrete situations.' }, tags: { es: ['Bienes Raíces', 'Banco', 'Impuestos'], en: ['Real Estate', 'Bank', 'Taxes'] } },
  { name: { es: 'Fideicomiso en Vida', en: 'Living Trust' }, href: '/trust', price: '$499', color: '#10B981', icon: '🏠', desc: { es: 'Proteja sus bienes y evite el proceso de sucesión.', en: 'Protect your assets and avoid probate.' }, tags: { es: ['Evita Probate', 'Privacidad', 'Control Total'], en: ['Avoids Probate', 'Privacy', 'Full Control'] } },
  { name: { es: 'Formación de LLC', en: 'LLC Formation' }, href: '/llc', price: '$299', color: '#8B5CF6', icon: '🏗️', desc: { es: 'Crea tu LLC con documentos completos conforme a California.', en: 'Create your LLC with complete California documents.' }, tags: { es: ['Protección', 'Estructura Básica', 'Bilingüe'], en: ['Protection', 'Basic Structure', 'Bilingual'] } },
  { name: { es: 'Testamento Simple', en: 'Simple Will' }, href: '/simple-will', price: '$149', color: '#1E3A8A', icon: '📄', desc: { es: 'Indique cómo distribuir sus bienes al fallecer.', en: 'Specify how to distribute your assets upon death.' }, tags: { es: ['Bienes', 'Familia', 'Herencia'], en: ['Assets', 'Family', 'Inheritance'] } },
  { name: { es: 'Testamento de Traspaso', en: 'Pour-Over Will' }, href: '/pour-over-will', price: '$199', color: '#7C3AED', icon: '📜', desc: { es: 'Complemento del fideicomiso para bienes no incluidos.', en: 'Trust complement for assets not included.' }, tags: { es: ['Fideicomiso', 'Bienes', 'Protección'], en: ['Trust', 'Assets', 'Protection'] } },
  { name: { es: 'Autorización HIPAA', en: 'HIPAA Authorization' }, href: '/hipaa-authorization', price: '$99', color: '#DC2626', icon: '🏥', desc: { es: 'Autorice a personas de confianza acceder a su información médica.', en: 'Authorize trusted people to access your medical info.' }, tags: { es: ['Médico', 'Emergencia', 'Privacidad'], en: ['Medical', 'Emergency', 'Privacy'] } },
  { name: { es: 'Certificación de Fideicomiso', en: 'Certification of Trust' }, href: '/certification-of-trust', price: '$99', color: '#059669', icon: '🔏', desc: { es: 'Documento que certifica la existencia de su fideicomiso.', en: 'Document certifying the existence of your trust.' }, tags: { es: ['Banco', 'Bienes Raíces', 'Legal'], en: ['Bank', 'Real Estate', 'Legal'] } },
  { name: { es: 'Formación S-Corporation', en: 'S-Corp Formation' }, href: '/s-corp-formation', price: '$499', color: '#D97706', icon: '🏢', desc: { es: 'Estructura corporativa con beneficios fiscales para su negocio.', en: 'Corporate structure with tax benefits for your business.' }, tags: { es: ['Impuestos', 'Corporación', 'Negocio'], en: ['Taxes', 'Corporation', 'Business'] } },
  { name: { es: 'Formación C-Corporation', en: 'C-Corp Formation' }, href: '/c-corp-formation', price: '$499', color: '#B45309', icon: '🏛️', desc: { es: 'Estructura corporativa completa para negocios en crecimiento.', en: 'Full corporate structure for growing businesses.' }, tags: { es: ['Inversores', 'Acciones', 'Corporación'], en: ['Investors', 'Shares', 'Corporation'] } },
  { name: { es: 'Actas Corporativas', en: 'Corporate Minutes' }, href: '/corporate-minutes', price: '$149', color: '#0284C7', icon: '📋', desc: { es: 'Registro oficial de las decisiones de su empresa.', en: 'Official record of your company decisions.' }, tags: { es: ['Cumplimiento', 'Anual', 'Corporación'], en: ['Compliance', 'Annual', 'Corporation'] } },
  { name: { es: 'Resolución Bancaria', en: 'Banking Resolution' }, href: '/banking-resolution', price: '$99', color: '#065F46', icon: '🏦', desc: { es: 'Autorice a representantes para manejar cuentas bancarias.', en: 'Authorize representatives to manage bank accounts.' }, tags: { es: ['Banco', 'Corporación', 'Firma'], en: ['Bank', 'Corporation', 'Signature'] } },
  { name: { es: 'Carta de Autorización de Viaje', en: 'Travel Authorization' }, href: '/travel-authorization', price: '$49', color: '#EC4899', icon: '✈️', desc: { es: 'Autorización para menores que viajan sin sus padres.', en: 'Authorization for minors traveling without parents.' }, tags: { es: ['Menores', 'Viaje', 'Internacional'], en: ['Minors', 'Travel', 'International'] } },
  { name: { es: 'Carta de Venta', en: 'Bill of Sale' }, href: '/bill-of-sale', price: '$69', color: '#2563EB', icon: '🚗', desc: { es: 'Documento oficial para compraventa de bienes o vehículos.', en: 'Official document for sale of goods or vehicles.' }, tags: { es: ['Vehículo', 'Bienes', 'Contrato'], en: ['Vehicle', 'Property', 'Contract'] } },
  { name: { es: 'Declaración Jurada', en: 'Affidavit' }, href: '/affidavit', price: '$89', color: '#7C3AED', icon: '📜', desc: { es: 'Declaración legal firmada bajo juramento.', en: 'Legal statement signed under oath.' }, tags: { es: ['Legal', 'Declaración', 'Oficial'], en: ['Legal', 'Statement', 'Official'] } },
  { name: { es: 'Pagaré', en: 'Promissory Note' }, href: '/promissory-note', price: '$89', color: '#D97706', icon: '💵', desc: { es: 'Compromiso de pago entre dos partes por escrito.', en: 'Written payment commitment between two parties.' }, tags: { es: ['Préstamo', 'Pago', 'Contrato'], en: ['Loan', 'Payment', 'Contract'] } },
  { name: { es: 'Designación de Guardián', en: 'Guardianship Designation' }, href: '/guardianship', price: '$129', color: '#BE185D', icon: '👨‍👧', desc: { es: 'Nombre a un guardián para sus hijos en caso de emergencia.', en: 'Name a guardian for your children in emergencies.' }, tags: { es: ['Hijos', 'Emergencia', 'Familia'], en: ['Children', 'Emergency', 'Family'] } },
  { name: { es: 'Revocación de Poder', en: 'POA Revocation' }, href: '/revocation-poa', price: '$59', color: '#DC2626', icon: '❌', desc: { es: 'Cancele un poder notarial previamente otorgado.', en: 'Cancel a previously granted power of attorney.' }, tags: { es: ['Cancelación', 'Legal', 'Protección'], en: ['Cancellation', 'Legal', 'Protection'] } },
  { name: { es: 'Declaración Jurada de Sucesión', en: 'Small Estate Affidavit' }, href: '/small-estate-affidavit', price: '$149', color: '#1E3A8A', icon: '🏛️', desc: { es: 'Transfiera bienes de un familiar fallecido sin ir a corte.', en: 'Transfer assets from a deceased relative without court.' }, tags: { es: ['Sucesión', 'Sin Corte', 'Herencia'], en: ['Estate', 'No Court', 'Inheritance'] } },
  { name: { es: 'Escritura de Traspaso', en: 'Quitclaim Deed' }, href: '/quitclaim-deed', price: '$199', color: '#059669', icon: '🔑', desc: { es: 'Transfiera propiedad inmueble entre personas de confianza.', en: 'Transfer real property between trusted people.' }, tags: { es: ['Propiedad', 'Familia', 'Transferencia'], en: ['Property', 'Family', 'Transfer'] } },
  { name: { es: 'Contrato de Contratista', en: 'Contractor Agreement' }, href: '/contractor-agreement', price: '$149', color: '#D97706', icon: '🤝', desc: { es: 'Contrato profesional para servicios de contratistas.', en: 'Professional contract for contractor services.' }, tags: { es: ['Construcción', 'Servicios', 'Contrato'], en: ['Construction', 'Services', 'Contract'] } },
  { name: { es: 'Carta de Demanda', en: 'Demand Letter' }, href: '/demand-letter', price: '$99', color: '#DC2626', icon: '📩', desc: { es: 'Carta formal exigiendo pago o acción a otra persona.', en: 'Formal letter demanding payment or action.' }, tags: { es: ['Deuda', 'Disputa', 'Legal'], en: ['Debt', 'Dispute', 'Legal'] } },
  { name: { es: 'Solicitud de Apostilla', en: 'Apostille Request' }, href: '/apostille-letter', price: '$79', color: '#7C3AED', icon: '🌍', desc: { es: 'Certifique documentos para uso en el extranjero.', en: 'Certify documents for use abroad.' }, tags: { es: ['Internacional', 'Certificación', 'Extranjero'], en: ['International', 'Certification', 'Abroad'] } },
  { name: { es: 'Carta de Autorización', en: 'Authorization Letter' }, href: '/authorization-letter', price: '$49', color: '#059669', icon: '✉️', desc: { es: 'Autorice a una persona para actuar en su nombre.', en: 'Authorize a person to act on your behalf.' }, tags: { es: ['Autorización', 'Representación', 'Oficial'], en: ['Authorization', 'Representation', 'Official'] } },
];

export default function OurStoryClient({ lang: initialLang = 'es' }) {
  const lang = initialLang;
  const t = CONTENT[lang];

  const Section = ({ title, children, bg }) => (
    <div style={{ padding: '48px 0', borderBottom: '1px solid #E2E8F0', ...(bg ? { background: bg, margin: '0 -24px', padding: '48px 24px' } : {}) }}>
      {title && <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', marginBottom: '20px', lineHeight: '1.3' }}>{title}</h2>}
      {children}
    </div>
  );

  const P = ({ children, bold, muted, center }) => (
    <p style={{ fontSize: '16px', lineHeight: '1.8', color: muted ? '#64748B' : '#334155', fontWeight: bold ? '700' : '400', margin: '0 0 14px', textAlign: center ? 'center' : 'left' }}>{children}</p>
  );

  const BulletList = ({ items }) => (
    <ul style={{ margin: '16px 0', paddingLeft: '24px' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: '16px', lineHeight: '1.8', color: '#334155', marginBottom: '8px' }}>{item}</li>
      ))}
    </ul>
  );

  const NumberList = ({ items }) => (
    <ol style={{ margin: '16px 0', paddingLeft: '24px' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: '16px', lineHeight: '1.8', color: '#334155', marginBottom: '8px' }}>{item}</li>
      ))}
    </ol>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Nav */}
      <Navbar lang={lang} langSwitchUrl={lang === 'es' ? '/en/our-story' : '/nuestra-historia'} />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#fff', margin: '0 0 16px', lineHeight: '1.2' }}>{t.hero.title}</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: '1.6' }}>{t.hero.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '740px', margin: '0 auto', padding: '0 24px' }}>

        {/* Intro */}
        <Section>
          {t.intro.map((p, i) => (
            <P key={i} bold={i === 1}>{p}</P>
          ))}
          <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', borderRadius: '12px', padding: '24px', margin: '24px 0 0', textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>{t.introBold}</p>
          </div>
        </Section>

        {/* Need */}
        <Section title={t.need.title}>
          <P>{t.need.text}</P>
          <P bold>{t.need.listIntro}</P>
          <BulletList items={t.need.items} />
          <P bold>{t.need.closing}</P>
        </Section>

        {/* World Changed */}
        <Section title={t.changed.title}>
          <P>{t.changed.intro}</P>
          <BulletList items={t.changed.items} />
          {t.changed.text.map((p, i) => <P key={i}>{p}</P>)}
          <P bold>{t.changed.bold}</P>
        </Section>

        {/* What Is */}
        <Section title={t.whatIs.title}>
          <P>{t.whatIs.text}</P>
          <P bold>{t.whatIs.listIntro}</P>
          <BulletList items={t.whatIs.items} />
          <P>{t.whatIs.text2}</P>
          <P>{t.whatIs.closing}</P>
        </Section>

        {/* How It Works */}
        <Section title={t.howWorks.title}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '16px 0 24px' }}>
            {t.howWorks.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ minWidth: '40px', height: '40px', background: '#1E3A8A', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '16px' }}>{i + 1}</div>
                <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155', margin: '8px 0 0' }}>{step}</p>
              </div>
            ))}
          </div>
          {t.howWorks.notes.map((n, i) => <P key={i} muted={i === 0} bold={i === 1}>{n}</P>)}
        </Section>

        {/* Transparency */}
        <Section title={t.transparency.title}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
            {t.transparency.lines.map((line, i) => (
              <P key={i} bold={i === 0}>{line}</P>
            ))}
          </div>
        </Section>

        {/* Commitment */}
        <Section title={t.commitment.title}>
          <P>{t.commitment.intro}</P>
          <P bold>{t.commitment.listIntro}</P>
          <BulletList items={t.commitment.items} />
          {t.commitment.closing.map((c, i) => <P key={i} muted>{c}</P>)}
          <div style={{ background: 'linear-gradient(135deg, #059669, #10B981)', borderRadius: '12px', padding: '24px', textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>{t.commitment.bold}</p>
          </div>
        </Section>

      </div>

      {/* Services CTA */}
        <div style={{ padding: '60px 0 48px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', marginBottom: '8px', textAlign: 'center' }}>{t.services.title}</h2>
          <P center muted>{t.services.intro}</P>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
            {SERVICES.map((svc, i) => (
              <a key={i} href={svc.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: `2px solid ${svc.color}`, boxShadow: `0 4px 12px ${svc.color}26`, height: '100%', boxSizing: 'border-box', transition: 'transform 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '56px', height: '56px', backgroundColor: `${svc.color}18`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>{svc.icon}</div>
                    <div>
                      <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '600', marginBottom: '4px', display: 'inline-block' }}>✓ DISPONIBLE</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937', lineHeight: '1.3' }}>{svc.name[lang]}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '12px', lineHeight: '1.5' }}>{svc.desc[lang]}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                    {svc.tags[lang].map((tag, j) => (
                      <span key={j} style={{ backgroundColor: `${svc.color}18`, color: svc.color, padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '500' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: svc.color }}>{svc.price}</span>
                    <span style={{ padding: '8px 18px', backgroundColor: svc.color, color: 'white', borderRadius: '8px', fontWeight: '600', fontSize: '13px' }}>
                      {t.services.cta} →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '16px' }}>¿Tienes preguntas?</p>
            <a href="tel:8552467274" style={{ display: 'inline-block', background: '#1E3A8A', color: '#fff', padding: '14px 32px', borderRadius: '10px', fontWeight: '700', fontSize: '16px', textDecoration: 'none' }}>
              📞 Llámanos al (855) 246-7274
            </a>
          </div>
        </div>

      <footer style={{ background: '#0F172A', color: '#fff', padding: '32px 24px', textAlign: 'center', marginTop: '40px' }}>
        <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>Multi Servicios 360</p>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '4px' }}>multiservicios360.net  |  (855) 246-7274</p>
        <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>Multi Servicios 360 no es un bufete de abogados. Este es un servicio de preparación de documentos de autoayuda.</p>
      </footer>
    </div>
  );
}
