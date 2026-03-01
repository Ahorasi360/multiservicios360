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
  { name: { es: 'Poder Notarial General', en: 'General Power of Attorney' }, href: '/poa', price: '$149', color: '#1E3A8A', icon: '⚖️' },
  { name: { es: 'Poder Notarial Limitado', en: 'Limited Power of Attorney' }, href: '/limited-poa', price: '$99', color: '#F59E0B', icon: '📋' },
  { name: { es: 'Fideicomiso en Vida', en: 'Living Trust' }, href: '/trust', price: '$599', color: '#10B981', icon: '🏠' },
  { name: { es: 'Formación de LLC', en: 'LLC Formation' }, href: '/llc', price: '$799', color: '#8B5CF6', icon: '🏢' },
  { name: { es: 'Carta de Autorización de Viaje', en: 'Travel Authorization' }, href: '/travel-authorization', price: '$49', color: '#EC4899', icon: '✈️' },
  { name: { es: 'Carta de Venta', en: 'Bill of Sale' }, href: '/bill-of-sale', price: '$49', color: '#2563EB', icon: '🚗' },
  { name: { es: 'Declaración Jurada', en: 'Affidavit' }, href: '/affidavit', price: '$49', color: '#7C3AED', icon: '📜' },
  { name: { es: 'Pagaré', en: 'Promissory Note' }, href: '/promissory-note', price: '$49', color: '#D97706', icon: '💵' },
  { name: { es: 'Designación de Guardián', en: 'Guardianship Designation' }, href: '/guardianship', price: '$99', color: '#BE185D', icon: '👨‍👧' },
  { name: { es: 'Revocación de Poder', en: 'POA Revocation' }, href: '/revocation-poa', price: '$49', color: '#DC2626', icon: '❌' },
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
      {/* Disclaimer bar */}
      <div style={{ background: '#FCD34D', padding: '8px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#1E3A8A', margin: 0, fontWeight: '500' }}>
          {lang === 'es' ? 'Multi Servicios 360 no es un bufete de abogados y no proporciona asesoría legal.' : 'Multi Servicios 360 is not a law firm and does not provide legal advice.'}
        </p>
      </div>

      {/* Nav */}
      <Navbar lang={lang} />

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
          <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', padding: '16px 20px', margin: '16px 0' }}>
            <p style={{ color: '#92400E', fontSize: '14px', fontWeight: '600', margin: 0 }}>{t.whatIs.disclaimer}</p>
          </div>
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

      {/* Footer */}
      <footer style={{ background: '#0F172A', padding: '24px 16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>{t.footer.home}</Link>
          <Link href="/blog" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>Blog</Link>
          <Link href="/contacto" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>{lang === 'es' ? 'Contacto' : 'Contact'}</Link>
          <Link href="/nuestra-historia" style={{ color: '#3B82F6', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>{lang === 'es' ? 'Nuestra Historia' : 'Our Story'}</Link>
          <Link href="/terms" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>{t.footer.terms}</Link>
          <Link href="/privacy" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>{t.footer.privacy}</Link>
          <Link href="/accessibility" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>{lang === 'es' ? 'Accesibilidad' : 'Accessibility'}</Link>
        </div>
        <p style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>© 2026 Multi Servicios 360. {t.footer.rights}</p>
      </footer>

      <style>{`
        @media (max-width: 640px) {
          h1 { font-size: 32px !important; }
          div[style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
