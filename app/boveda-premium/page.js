'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

const T = {
  es: {
    nav: { home: 'Inicio', services: 'Servicios', contact: 'Contacto' },
    backHome: '← Regresar al Inicio',
    hero: {
      badge: 'Bóveda Digital',
      title: 'Bóveda Premium',
      subtitle: 'Acceso extendido a todos sus documentos legales mientras su membresía esté activa. Descargue, consulte y comparta cuando lo necesite.',
    },
    features: [
      { icon: '♾️', title: 'Acceso Permanente', desc: 'Sus documentos disponibles para siempre. Sin fecha de vencimiento.' },
      { icon: '📥', title: 'Descargas Ilimitadas', desc: 'Descargue sus documentos cuantas veces necesite.' },
      { icon: '🔒', title: 'Encriptación Bancaria', desc: 'Protegidos con la misma seguridad que usan los bancos.' },
      { icon: '📱', title: 'Acceso Multi-Dispositivo', desc: 'Desde su teléfono, tableta o computadora.' },
      { icon: '📂', title: 'Todos Sus Documentos', desc: 'Un solo lugar para todos los documentos que prepare con nosotros.' },
      { icon: '⚡', title: 'Soporte Prioritario', desc: 'Atención preferencial por teléfono y correo electrónico.' },
    ],
    comparison: {
      title: 'Comparación de Planes',
      free: 'Bóveda Estándar',
      premium: 'Bóveda Premium',
      freePrice: 'Incluida',
      included: 'Incluida con cada documento',
      features: [
        { label: 'Acceso a documentos', free: '90 días', premium: 'Renovable (mensual o anual)' },
        { label: 'Descargas', free: 'Ilimitadas (90 días)', premium: 'Ilimitadas (siempre activo)' },
        { label: 'Formato PDF bilingüe', free: true, premium: true },
        { label: 'Código de acceso único', free: true, premium: true },
        { label: 'Acceso después de 90 días', free: false, premium: true },
        { label: 'Todos los documentos en un lugar', free: false, premium: true },
        { label: 'Soporte prioritario', free: false, premium: true },
        { label: 'Notificaciones de vencimiento', free: false, premium: true },
      ],
    },
    pricing: {
      title: 'Planes de Bóveda Premium',
      subtitle: 'Elija el plan que mejor se adapte a sus necesidades',
      plans: [
        { name: 'Mensual', price: '$4.99', period: '/mes', desc: 'Flexibilidad total. Cancele cuando quiera.', badge: null },
        { name: 'Anual', price: '$49', period: '/año', desc: 'Ahorre $10.88 al año. El mejor valor.', badge: 'Mejor Valor', savings: 'Ahorre 18%' },
      ],
      cta: 'Activar Premium',
      comingSoon: 'Activar Ahora',
      comingSoonNote: '',
    },
    howItWorks: {
      title: '¿Cómo Funciona?',
      steps: [
        { num: '1', title: 'Prepare su Documento', desc: 'Use nuestra plataforma para crear cualquier documento legal.' },
        { num: '2', title: 'Reciba su Bóveda', desc: 'Reciba un código único de acceso por correo electrónico.' },
        { num: '3', title: 'Active Premium', desc: 'Actualice a Premium para acceso permanente a todos sus documentos.' },
        { num: '4', title: 'Acceso Siempre', desc: 'Descargue y consulte sus documentos cuando los necesite.' },
      ],
    },
    faq: {
      title: 'Preguntas Frecuentes',
      items: [
        { q: '¿Qué pasa con mis documentos después de 90 días sin Premium?', a: 'Sin Premium, el acceso a su bóveda expira después de 90 días. Con Premium, sus documentos permanecen disponibles permanentemente.' },
        { q: '¿Puedo activar Premium después?', a: 'Sí. Puede activar Premium en cualquier momento y recuperar acceso a todos los documentos que haya preparado con nosotros.' },
        { q: '¿Es seguro?', a: 'Absolutamente. Usamos encriptación de nivel bancario (AES-256) para proteger todos sus documentos.' },
        { q: '¿Funciona con todos los documentos?', a: 'Sí. Premium incluye acceso a todos los documentos que prepare usando nuestra plataforma: poderes notariales, fideicomisos, LLC, cartas de venta, declaraciones juradas y más.' },
      ],
    },
    cta: {
      title: '¿Listo para Proteger sus Documentos?',
      subtitle: 'Comience preparando su primer documento y active Premium cuando esté listo.',
      btn: 'Ver Nuestros Servicios',
    },
  },
  en: {
    nav: { home: 'Home', services: 'Services', contact: 'Contact' },
    backHome: '← Back to Home',
    hero: {
      badge: 'Digital Vault',
      title: 'Vault Premium',
      subtitle: 'Extended access to all your legal documents while your membership is active. Download, view, and share whenever you need them.',
    },
    features: [
      { icon: '♾️', title: 'Permanent Access', desc: 'Your documents available forever. No expiration date.' },
      { icon: '📥', title: 'Unlimited Downloads', desc: 'Download your documents as many times as you need.' },
      { icon: '🔒', title: 'Bank-Level Encryption', desc: 'Protected with the same security banks use.' },
      { icon: '📱', title: 'Multi-Device Access', desc: 'From your phone, tablet, or computer.' },
      { icon: '📂', title: 'All Your Documents', desc: 'One place for all documents you prepare with us.' },
      { icon: '⚡', title: 'Priority Support', desc: 'Preferred assistance by phone and email.' },
    ],
    comparison: {
      title: 'Plan Comparison',
      free: 'Standard Vault',
      premium: 'Vault Premium',
      freePrice: 'Included',
      included: 'Included with every document',
      features: [
        { label: 'Document access', free: '90 days', premium: 'Renewable (monthly or annual)' },
        { label: 'Downloads', free: 'Unlimited (90 days)', premium: 'Unlimited (while active)' },
        { label: 'Bilingual PDF format', free: true, premium: true },
        { label: 'Unique access code', free: true, premium: true },
        { label: 'Access after 90 days', free: false, premium: true },
        { label: 'All documents in one place', free: false, premium: true },
        { label: 'Priority support', free: false, premium: true },
        { label: 'Expiration notifications', free: false, premium: true },
      ],
    },
    pricing: {
      title: 'Vault Premium Plans',
      subtitle: 'Choose the plan that best fits your needs',
      plans: [
        { name: 'Monthly', price: '$4.99', period: '/month', desc: 'Total flexibility. Cancel anytime.', badge: null },
        { name: 'Annual', price: '$49', period: '/year', desc: 'Save $10.88 per year. Best value.', badge: 'Best Value', savings: 'Save 18%' },
      ],
      cta: 'Activate Premium',
      comingSoon: 'Activate Now',
      comingSoonNote: '',
    },
    howItWorks: {
      title: 'How It Works',
      steps: [
        { num: '1', title: 'Prepare Your Document', desc: 'Use our platform to create any legal document.' },
        { num: '2', title: 'Receive Your Vault', desc: 'Receive a unique access code via email.' },
        { num: '3', title: 'Activate Premium', desc: 'Upgrade to Premium for permanent access to all your documents.' },
        { num: '4', title: 'Access Anytime', desc: 'Download and view your documents whenever you need them.' },
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { q: 'What happens to my documents after 90 days without Premium?', a: 'Without Premium, your vault access expires after 90 days. With Premium, your documents remain available permanently.' },
        { q: 'Can I activate Premium later?', a: 'Yes. You can activate Premium at any time and regain access to all documents you\'ve prepared with us.' },
        { q: 'Is it secure?', a: 'Absolutely. We use bank-level encryption (AES-256) to protect all your documents.' },
        { q: 'Does it work with all documents?', a: 'Yes. Premium includes access to all documents you prepare using our platform: powers of attorney, trusts, LLCs, bills of sale, affidavits, and more.' },
      ],
    },
    cta: {
      title: 'Ready to Protect Your Documents?',
      subtitle: 'Start by preparing your first document and activate Premium when you\'re ready.',
      btn: 'View Our Services',
    },
  },
};

function BovedaPremiumContent() {
  const [language, setLanguage] = useState('es');
  const [openFaq, setOpenFaq] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const searchParams = useSearchParams();
  const vaultToken = searchParams.get('token') || searchParams.get('vault_token_id') || searchParams.get('vault') || '';
  const clientEmail = searchParams.get('email') || '';
  const defaultPlan = searchParams.get('plan') || '';

  async function handleUpgrade(plan) {
    if (!vaultToken) {
      alert(language === 'es'
        ? 'Por favor acceda a su bóveda primero para activar Premium.'
        : 'Please access your vault first to activate Premium.');
      return;
    }
    setUpgrading(true);
    try {
      const res = await fetch('/api/vault/premium-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, vault_token_id: vaultToken, client_email: clientEmail, language }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Error processing request');
        setUpgrading(false);
      }
    } catch (err) {
      alert('Network error. Please try again.');
      setUpgrading(false);
    }
  }
  const t = T[language];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ms360_language');
      if (saved) setLanguage(saved);
    }
  }, []);

  // Auto-trigger checkout if plan param is present (from email links)
  useEffect(() => {
    if (defaultPlan && vaultToken && (defaultPlan === 'monthly' || defaultPlan === 'annual')) {
      handleUpgrade(defaultPlan);
    }
  }, [defaultPlan, vaultToken]);

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    if (typeof window !== 'undefined') localStorage.setItem('ms360_language', newLang);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <style>{`
        @media (max-width: 768px) {
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 32px !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '11px' }}>M360</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>Multi Servicios 360</div>
              <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Document Preparation</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/#services" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{t.nav.services}</Link>
            <Link href="/por-que-nosotros" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{language === 'es' ? '¿Por Qué Nosotros?' : 'Why Us?'}</Link>
            <Link href="/nuestra-historia" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{language === 'es' ? 'Nuestra Historia' : 'Our Story'}</Link>
            <Link href="/blog" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>Blog</Link>
            <Link href="/contacto" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{t.nav.contact}</Link>
            <button onClick={toggleLanguage} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px', color: '#374151' }}>
              <GlobeIcon /> {language === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1E40AF 100%)', padding: '80px 16px', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>{t.backHome}</Link>
          <div style={{ display: 'inline-block', backgroundColor: '#FCD34D', color: '#1E3A8A', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', margin: '20px 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            ⭐ {t.hero.badge}
          </div>
          <h1 className="hero-title" style={{ fontSize: '48px', fontWeight: '800', margin: '0 0 16px', lineHeight: '1.1' }}>{t.hero.title}</h1>
          <p style={{ fontSize: '18px', color: '#BFDBFE', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>{t.hero.subtitle}</p>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '60px 16px', backgroundColor: 'white' }}>
        <div className="grid-3" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {t.features.map((f, i) => (
            <div key={i} style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '28px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ padding: '60px 16px', backgroundColor: '#F8FAFC' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: '32px' }}>{t.comparison.title}</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '2px solid #E2E8F0' }}>
              <div style={{ padding: '16px 20px' }}></div>
              <div style={{ padding: '16px 20px', textAlign: 'center', borderLeft: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#374151' }}>{t.comparison.free}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{t.comparison.included}</div>
              </div>
              <div style={{ padding: '16px 20px', textAlign: 'center', backgroundColor: '#EFF6FF', borderLeft: '1px solid #BFDBFE' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#1E3A8A' }}>⭐ {t.comparison.premium}</div>
                <div style={{ fontSize: '12px', color: '#3B82F6' }}>{language === 'es' ? 'Desde $4.99/mes' : 'From $4.99/mo'}</div>
              </div>
            </div>
            {/* Rows */}
            {t.comparison.features.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < t.comparison.features.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                <div style={{ padding: '14px 20px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>{row.label}</div>
                <div style={{ padding: '14px 20px', textAlign: 'center', borderLeft: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {row.free === true ? <CheckIcon /> : row.free === false ? <XIcon /> : <span style={{ fontSize: '13px', color: '#6B7280' }}>{row.free}</span>}
                </div>
                <div style={{ padding: '14px 20px', textAlign: 'center', backgroundColor: '#FAFBFF', borderLeft: '1px solid #EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {row.premium === true ? <CheckIcon /> : <span style={{ fontSize: '13px', color: '#1E3A8A', fontWeight: '600' }}>{row.premium}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '60px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>{t.pricing.title}</h2>
          <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '40px' }}>{t.pricing.subtitle}</p>

          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px', maxWidth: '700px', margin: '0 auto 24px' }}>
            {t.pricing.plans.map((plan, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px 24px', border: plan.badge ? '2px solid #1E3A8A' : '2px solid #E2E8F0', boxShadow: plan.badge ? '0 8px 24px rgba(30, 58, 138, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)', position: 'relative' }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#FCD34D', color: '#1E3A8A', padding: '4px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>{plan.name}</h3>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '40px', fontWeight: '800', color: '#1E3A8A' }}>{plan.price}</span>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>{plan.period}</span>
                </div>
                {plan.savings && (
                  <div style={{ display: 'inline-block', backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', marginBottom: '12px' }}>
                    {plan.savings}
                  </div>
                )}
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px', lineHeight: '1.5' }}>{plan.desc}</p>
                <button
                  onClick={() => handleUpgrade(i === 0 ? 'monthly' : 'annual')}
                  disabled={upgrading}
                  style={{ width: '100%', padding: '12px', backgroundColor: upgrading ? '#94A3B8' : '#1E3A8A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: upgrading ? 'not-allowed' : 'pointer' }}>
                  {upgrading ? '...' : t.pricing.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '60px 16px', backgroundColor: '#F8FAFC' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: '40px' }}>{t.howItWorks.title}</h2>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {t.howItWorks.steps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#1E3A8A', color: '#FCD34D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', margin: '0 auto 12px' }}>
                  {step.num}
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>{step.title}</h4>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: '32px' }}>{t.faq.title}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {t.faq.items.map((item, i) => (
              <div key={i} style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '16px 20px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px', fontWeight: '600', color: '#0F172A', textAlign: 'left' }}>
                  {item.q}
                  <span style={{ fontSize: '20px', color: '#9CA3AF', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 16px', fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 16px', background: 'linear-gradient(135deg, #0F172A, #1E3A8A)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '12px' }}>{t.cta.title}</h2>
          <p style={{ fontSize: '16px', color: '#93C5FD', marginBottom: '24px', lineHeight: '1.5' }}>{t.cta.subtitle}</p>
          <Link href="/#services" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: '#FCD34D', color: '#1E3A8A', textDecoration: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px' }}>
            {t.cta.btn} →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F172A', color: 'white', padding: '32px 16px', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.6' }}>
            Multi Servicios 360 {language === 'es' ? 'no es un bufete de abogados y no proporciona asesoría legal.' : 'is not a law firm and does not provide legal advice.'}
          </p>
          <p style={{ fontSize: '11px', color: '#475569', marginTop: '8px' }}>© 2026 Multi Servicios 360 | 855.246.7274 | www.multiservicios360.net</p>
        </div>
      </footer>
    </div>
  );
}

export default function BovedaPremiumPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <BovedaPremiumContent />
    </Suspense>
  );
}
