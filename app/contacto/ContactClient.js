'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const T = {
  es: {
    hero: { title: 'Centro de Atención y Soporte', subtitle: 'Asistencia sobre el uso de la plataforma' },
    intro: [
      'Multiservicios 360 es una plataforma de software para la preparación de documentos legales en California. Nuestro equipo de atención está disponible para responder consultas relacionadas con el funcionamiento del sistema, pagos, acceso a documentos y soporte técnico.',
      'Antes de enviarnos un mensaje, te recomendamos revisar nuestras páginas de {servicios} o el {blog}, donde encontrarás respuestas a muchas preguntas frecuentes.',
    ],
    warning: 'Multiservicios 360 no proporciona asesoría legal. Si necesitas orientación jurídica específica sobre tu situación personal, debes consultar con un abogado licenciado en California.',
    form: {
      title: 'Envíanos un mensaje',
      subtitle: 'Respondemos dentro de 24–48 horas hábiles.',
      tipTitle: 'Para una respuesta más rápida, incluye en tu mensaje:',
      tips: ['Nombre completo', 'Correo utilizado en la compra', 'Servicio adquirido', 'Número de orden (si aplica)', 'Descripción clara del problema'],
      name: 'Nombre Completo',
      email: 'Correo Electrónico',
      order: 'Número de Orden (opcional)',
      department: 'Departamento',
      message: 'Su Mensaje',
      send: 'Enviar Mensaje',
      sending: 'Enviando...',
      success: '✅ Mensaje enviado. Le responderemos dentro de 24-48 horas hábiles.',
      error: '❌ Error al enviar. Intente de nuevo o escriba directamente al correo del departamento.',
    },
    help: {
      title: 'Podemos ayudarte con:',
      items: ['Funcionamiento de la plataforma', 'Acceso al Vault', 'Enlaces de descarga', 'Confirmación de pagos', 'Problemas técnicos'],
      noLegal: 'No atendemos consultas que impliquen asesoría legal personalizada.',
    },
    emails: {
      title: 'Correos por Departamento',
      subtitle: 'Para agilizar tu solicitud, puedes comunicarte directamente con el área correspondiente:',
      depts: [
        { key: 'info', icon: '📩', name: 'Información General', email: 'info@multiservicios360.net', desc: 'Consultas sobre servicios disponibles y cómo funciona la plataforma.' },
        { key: 'admin', icon: '🔧', name: 'Administrativo', email: 'admin@multiservicios360.net', desc: 'Temas relacionados con cuentas de partner, membresías o facturación administrativa.' },
        { key: 'support', icon: '💻', name: 'Soporte Técnico', email: 'support@multiservicios360.net', desc: 'Problemas con acceso, errores del sistema, pagos o descargas.' },
        { key: 'privacy', icon: '🔒', name: 'Privacidad', email: 'privacy@multiservicios360.net', desc: 'Solicitudes relacionadas con datos personales o eliminación de información conforme a leyes aplicables.' },
      ],
    },
    phone: {
      title: 'Atención Telefónica',
      number: '855.246.7274',
      hours: 'Lunes a Viernes: 9:00 AM – 6:00 PM',
      location: 'Beverly Hills, California',
      helpTitle: 'Por teléfono podemos orientarte sobre:',
      items: ['Navegación de la plataforma', 'Proceso de compra', 'Estado de tu orden', 'Extensión de acceso al Vault'],
      noLegal: 'No ofrecemos asesoría legal por vía telefónica.',
    },
    before: {
      title: 'Antes de contactarnos',
      intro: 'Si tu pregunta es sobre:',
      items: ['Cómo preparar un Poder Notarial en California', 'Qué es un Fideicomiso en Vida', 'Cómo formar una LLC', 'Diferencias entre nuestros servicios'],
      closing: 'Te recomendamos revisar primero nuestras páginas informativas. En muchos casos, encontrarás la respuesta inmediata sin necesidad de esperar asistencia.',
    },
    nav: { services: 'Servicios', blog: 'Blog', contact: 'Contacto', home: 'Inicio', terms: 'Términos', privacy: 'Privacidad' },
    footer: { rights: 'Todos los derechos reservados.' },
  },
  en: {
    hero: { title: 'Support Center', subtitle: 'Assistance with using the platform' },
    intro: [
      'Multi Servicios 360 is a software platform for legal document preparation in California. Our support team is available to answer questions about how the system works, payments, document access, and technical support.',
      'Before sending us a message, we recommend checking our {servicios} pages or the {blog}, where you will find answers to many frequently asked questions.',
    ],
    warning: 'Multi Servicios 360 does not provide legal advice. If you need specific legal guidance about your personal situation, you should consult a licensed attorney in California.',
    form: {
      title: 'Send us a message',
      subtitle: 'We respond within 24–48 business hours.',
      tipTitle: 'For a faster response, include in your message:',
      tips: ['Full name', 'Email used for purchase', 'Service purchased', 'Order number (if applicable)', 'Clear description of the issue'],
      name: 'Full Name',
      email: 'Email Address',
      order: 'Order Number (optional)',
      department: 'Department',
      message: 'Your Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: '✅ Message sent. We will respond within 24-48 business hours.',
      error: '❌ Failed to send. Please try again or email the department directly.',
    },
    help: {
      title: 'We can help you with:',
      items: ['Platform functionality', 'Vault access', 'Download links', 'Payment confirmation', 'Technical issues'],
      noLegal: 'We do not handle inquiries involving personalized legal advice.',
    },
    emails: {
      title: 'Department Emails',
      subtitle: 'To expedite your request, you can contact the appropriate department directly:',
      depts: [
        { key: 'info', icon: '📩', name: 'General Information', email: 'info@multiservicios360.net', desc: 'Questions about available services and how the platform works.' },
        { key: 'admin', icon: '🔧', name: 'Administrative', email: 'admin@multiservicios360.net', desc: 'Topics related to partner accounts, memberships, or administrative billing.' },
        { key: 'support', icon: '💻', name: 'Technical Support', email: 'support@multiservicios360.net', desc: 'Issues with access, system errors, payments, or downloads.' },
        { key: 'privacy', icon: '🔒', name: 'Privacy', email: 'privacy@multiservicios360.net', desc: 'Requests related to personal data or information deletion under applicable laws.' },
      ],
    },
    phone: {
      title: 'Phone Support',
      number: '855.246.7274',
      hours: 'Monday to Friday: 9:00 AM – 6:00 PM',
      location: 'Beverly Hills, California',
      helpTitle: 'By phone we can assist you with:',
      items: ['Platform navigation', 'Purchase process', 'Order status', 'Vault access extension'],
      noLegal: 'We do not offer legal advice over the phone.',
    },
    before: {
      title: 'Before contacting us',
      intro: 'If your question is about:',
      items: ['How to prepare a Power of Attorney in California', 'What a Living Trust is', 'How to form an LLC', 'Differences between our services'],
      closing: 'We recommend reviewing our informational pages first. In many cases, you will find an immediate answer without needing to wait for assistance.',
    },
    nav: { services: 'Services', blog: 'Blog', contact: 'Contact', home: 'Home', terms: 'Terms', privacy: 'Privacy' },
    footer: { rights: 'All rights reserved.' },
  },
};

export default function ContactClient({ lang: initialLang = 'es' }) {
  const lang = initialLang;
  const [form, setForm] = useState({ name: '', email: '', order: '', department: 'info', message: '' });
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const t = T[lang];

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setStatus('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, department: form.department, message: form.order ? `[Order: ${form.order}]\n\n${form.message}` : form.message }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', order: '', department: 'info', message: '' });
      } else setStatus('error');
    } catch { setStatus('error'); }
    setSending(false);
  }

  const input = { padding: '13px 16px', border: '2px solid #E2E8F0', borderRadius: '10px', fontSize: '15px', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' };

  function introWithLinks(text) {
    return text
      .replace('{servicios}', `<a href="/#services" style="color:#2563EB;font-weight:600;text-decoration:none;">${t.nav.services}</a>`)
      .replace('{blog}', `<a href="/blog" style="color:#2563EB;font-weight:600;text-decoration:none;">${t.nav.blog}</a>`);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Disclaimer */}
      <div style={{ background: '#FCD34D', padding: '8px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#1E3A8A', margin: 0, fontWeight: '500' }}>
          {lang === 'es' ? 'Multi Servicios 360 no es un bufete de abogados y no proporciona asesoría legal.' : 'Multi Servicios 360 is not a law firm and does not provide legal advice.'}
        </p>
      </div>

      {/* Nav */}
      <Navbar lang={lang} />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)', padding: '64px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#fff', margin: '0 0 10px' }}>{t.hero.title}</h1>
        <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{t.hero.subtitle}</p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>

        {/* Intro */}
        <div style={{ padding: '40px 0 20px' }}>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#334155', margin: '0 0 14px' }}>{t.intro[0]}</p>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#334155', margin: '0 0 20px' }} dangerouslySetInnerHTML={{ __html: introWithLinks(t.intro[1]) }} />
          <div style={{ background: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: '12px', padding: '18px 22px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#92400E', fontWeight: '500', margin: 0 }}>{t.warning}</p>
          </div>
        </div>

        {/* Form + Help + Departments - main section */}
        <div style={{ background: '#FCD34D', borderRadius: '20px', padding: '40px', margin: '20px 0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="contact-grid">
            
            {/* Left: Form */}
            <div>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0F172A', margin: '0 0 6px' }}>{t.form.title}</h2>
                <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 20px' }}>{t.form.subtitle}</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t.form.name} style={input}
                    onFocus={e => e.target.style.borderColor = '#3B82F6'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder={t.form.email} style={input}
                    onFocus={e => e.target.style.borderColor = '#3B82F6'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  <input value={form.order} onChange={e => setForm({...form, order: e.target.value})} placeholder={t.form.order} style={input}
                    onFocus={e => e.target.style.borderColor = '#3B82F6'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  <select value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                    style={{ ...input, background: '#fff', cursor: 'pointer' }}>
                    {t.emails.depts.map(d => <option key={d.key} value={d.key}>{d.name}</option>)}
                  </select>
                  <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder={t.form.message} rows={5}
                    style={{ ...input, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = '#3B82F6'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  <button type="submit" disabled={sending}
                    style={{ padding: '16px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', opacity: sending ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    {sending ? t.form.sending : t.form.send}
                  </button>
                  {status === 'success' && <p style={{ color: '#059669', fontSize: '14px', margin: 0, fontWeight: '600', background: '#DCFCE7', padding: '12px 16px', borderRadius: '8px' }}>{t.form.success}</p>}
                  {status === 'error' && <p style={{ color: '#DC2626', fontSize: '14px', margin: 0, fontWeight: '600', background: '#FEE2E2', padding: '12px 16px', borderRadius: '8px' }}>{t.form.error}</p>}
                </form>
              </div>

              {/* Tips box */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginTop: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', margin: '0 0 10px' }}>{t.form.tipTitle}</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {t.form.tips.map((tip, i) => <li key={i} style={{ fontSize: '13px', color: '#475569', lineHeight: '1.8' }}>{tip}</li>)}
                </ul>
              </div>
            </div>

            {/* Right: Departments + Phone + Help */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Department Emails */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0F172A', margin: '0 0 4px' }}>📧 {t.emails.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px' }}>{t.emails.subtitle}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {t.emails.depts.map((d, i) => (
                    <a key={i} href={`mailto:${d.email}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', background: '#F8FAFC', borderRadius: '12px', textDecoration: 'none', border: '1px solid #E2E8F0', transition: 'border-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#3B82F6'} onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}>
                      <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>{d.icon}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '2px' }}>{d.name}</div>
                        <div style={{ fontSize: '13px', color: '#2563EB', marginBottom: '4px' }}>{d.email}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5' }}>{d.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0F172A', margin: '0 0 12px' }}>📞 {t.phone.title}</h3>
                <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1E3A8A', fontWeight: '800', textDecoration: 'none', fontSize: '24px', marginBottom: '8px' }}>
                  📞 {t.phone.number}
                </a>
                <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 2px' }}>{t.phone.hours}</p>
                <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 16px' }}>{t.phone.location}</p>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', margin: '0 0 6px' }}>{t.phone.helpTitle}</p>
                <ul style={{ margin: '0 0 12px', paddingLeft: '20px' }}>
                  {t.phone.items.map((item, i) => <li key={i} style={{ fontSize: '13px', color: '#475569', lineHeight: '1.8' }}>{item}</li>)}
                </ul>
                <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: '600', margin: 0 }}>{t.phone.noLegal}</p>
              </div>

              {/* We can help with */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', margin: '0 0 10px' }}>✅ {t.help.title}</h4>
                <ul style={{ margin: '0 0 12px', paddingLeft: '20px' }}>
                  {t.help.items.map((item, i) => <li key={i} style={{ fontSize: '13px', color: '#475569', lineHeight: '1.8' }}>{item}</li>)}
                </ul>
                <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: '600', margin: 0 }}>{t.help.noLegal}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Before contacting us */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '36px', margin: '0 0 40px', border: '2px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0F172A', margin: '0 0 12px' }}>{t.before.title}</h2>
          <p style={{ fontSize: '15px', color: '#475569', margin: '0 0 12px' }}>{t.before.intro}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', margin: '0 0 20px' }} className="before-grid">
            {t.before.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#3B82F6', fontWeight: '700', fontSize: '16px' }}>→</span>
                <span style={{ fontSize: '14px', color: '#334155' }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '15px', color: '#475569', margin: '0 0 20px' }}>{t.before.closing}</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/poa" style={{ padding: '10px 20px', background: '#1E3A8A', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>
              {lang === 'es' ? 'Poder Notarial General' : 'General POA'} →
            </Link>
            <Link href="/limited-poa" style={{ padding: '10px 20px', background: '#F59E0B', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>
              {lang === 'es' ? 'Poder Notarial Limitado' : 'Limited POA'} →
            </Link>
            <Link href="/trust" style={{ padding: '10px 20px', background: '#10B981', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>
              {lang === 'es' ? 'Fideicomiso en Vida' : 'Living Trust'} →
            </Link>
            <Link href="/llc" style={{ padding: '10px 20px', background: '#8B5CF6', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>
              {lang === 'es' ? 'Formación de LLC' : 'LLC Formation'} →
            </Link>
            <Link href="/mas-servicios" style={{ padding: '10px 20px', background: '#6366F1', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>
              {lang === 'es' ? 'Más Servicios' : 'More Services'} →
            </Link>
            <Link href="/blog" style={{ padding: '10px 20px', background: '#0F172A', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>
              Blog →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#0F172A', padding: '24px 16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>{t.nav.home}</Link>
          <Link href="/nuestra-historia" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>{lang === 'es' ? 'Nuestra Historia' : 'Our Story'}</Link>
          <Link href="/blog" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>{t.nav.blog}</Link>
          <Link href="/contacto" style={{ color: '#3B82F6', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>{t.nav.contact}</Link>
          <Link href="/terms" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>{t.nav.terms}</Link>
          <Link href="/privacy" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>{t.nav.privacy}</Link>
        </div>
        <p style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>© 2026 Multi Servicios 360. {t.footer.rights}</p>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .before-grid { grid-template-columns: 1fr !important; }
          h1 { font-size: 28px !important; }
        }
      `}</style>
    </div>
  );
}
