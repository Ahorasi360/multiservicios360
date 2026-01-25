"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const SERVICES = {
  trust: {
    name_en: 'Living Trust',
    name_es: 'Fideicomiso en Vida',
    desc_en: 'Protect your assets and avoid probate with a living trust.',
    desc_es: 'Proteja sus bienes y evite la sucesión con un fideicomiso en vida.',
    price: '$799',
    icon: '🏠'
  },
  business: {
    name_en: 'Business Formation',
    name_es: 'Formación de Negocios',
    desc_en: 'LLC, Corporations, EIN registration and more.',
    desc_es: 'LLC, Corporaciones, registro de EIN y más.',
    price: '$149',
    icon: '🏢'
  },
  immigration: {
    name_en: 'Immigration Services',
    name_es: 'Servicios de Inmigración',
    desc_en: 'N-400, I-130, I-485, I-765, I-90 form preparation.',
    desc_es: 'Preparación de formularios N-400, I-130, I-485, I-765, I-90.',
    price: '$99',
    icon: '✈️'
  }
};

const TRANSLATIONS = {
  en: {
    title: 'Join the Waitlist',
    subtitle: 'Be the first to know when this service launches',
    serviceLabel: 'Service',
    nameLabel: 'Full Name',
    namePlaceholder: 'Your full name',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    phoneLabel: 'Phone (optional)',
    phonePlaceholder: '(555) 555-5555',
    submit: 'Join Waitlist',
    submitting: 'Submitting...',
    success: "You're on the list!",
    successDesc: "We'll notify you as soon as this service becomes available.",
    error: 'Something went wrong. Please try again.',
    backHome: 'Back to Home',
    estimatedLaunch: 'Estimated Launch',
    q2_2026: 'Q2 2026',
    startingAt: 'Starting at',
    alreadyAvailable: 'Available Now',
    generalPoa: 'General Power of Attorney',
    limitedPoa: 'Limited Power of Attorney',
    checkOut: 'Check out our available services:',
    selectService: 'Select a service',
    invalidService: 'Please select a valid service from the homepage.'
  },
  es: {
    title: 'Únase a la Lista de Espera',
    subtitle: 'Sea el primero en saber cuando este servicio esté disponible',
    serviceLabel: 'Servicio',
    nameLabel: 'Nombre Completo',
    namePlaceholder: 'Su nombre completo',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'su@correo.com',
    phoneLabel: 'Teléfono (opcional)',
    phonePlaceholder: '(555) 555-5555',
    submit: 'Unirse a la Lista',
    submitting: 'Enviando...',
    success: '¡Está en la lista!',
    successDesc: 'Le notificaremos tan pronto como este servicio esté disponible.',
    error: 'Algo salió mal. Por favor intente de nuevo.',
    backHome: 'Volver al Inicio',
    estimatedLaunch: 'Lanzamiento Estimado',
    q2_2026: 'Q2 2026',
    startingAt: 'Desde',
    alreadyAvailable: 'Disponible Ahora',
    generalPoa: 'Poder Notarial General',
    limitedPoa: 'Poder Notarial Limitado',
    checkOut: 'Vea nuestros servicios disponibles:',
    selectService: 'Seleccione un servicio',
    invalidService: 'Por favor seleccione un servicio válido desde la página principal.'
  }
};

export default function WaitlistPage() {
  const searchParams = useSearchParams();
  const serviceKey = searchParams.get('service');
  
  const [language, setLanguage] = useState('es');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const t = TRANSLATIONS[language];
  const service = serviceKey ? SERVICES[serviceKey] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !serviceKey) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_key: serviceKey,
          name,
          email,
          phone,
          source: 'website'
        })
      });
      
      const result = await res.json();
      
      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Header */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '0 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>M360</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: '#1E3A8A' }}>Multi Servicios 360</div>
            </div>
          </Link>
          <button 
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} 
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px', color: '#374151' }}
          >
            <GlobeIcon /> {language === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 16px' }}>
        {!service ? (
          /* No service selected */
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>{t.selectService}</h1>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>{t.invalidService}</p>
            
            <p style={{ color: '#374151', fontWeight: '600', marginBottom: '16px' }}>{t.checkOut}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/poa" style={{ padding: '12px 20px', backgroundColor: '#3B82F6', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
                {t.generalPoa} →
              </Link>
              <Link href="/limited-poa" style={{ padding: '12px 20px', backgroundColor: '#F59E0B', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
                {t.limitedPoa} →
              </Link>
            </div>
            
            <Link href="/" style={{ display: 'inline-block', marginTop: '24px', color: '#3B82F6', textDecoration: 'none', fontWeight: '500' }}>
              ← {t.backHome}
            </Link>
          </div>
        ) : isSuccess ? (
          /* Success state */
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>✓</div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>{t.success}</h1>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>{t.successDesc}</p>
            
            <div style={{ backgroundColor: '#F0FDF4', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
              <p style={{ fontWeight: '600', color: '#166534', margin: '0 0 4px' }}>{language === 'en' ? service.name_en : service.name_es}</p>
              <p style={{ color: '#15803D', fontSize: '14px', margin: 0 }}>{t.estimatedLaunch}: {t.q2_2026}</p>
            </div>
            
            <p style={{ color: '#374151', fontWeight: '600', marginBottom: '16px' }}>{t.checkOut}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/poa" style={{ padding: '12px 20px', backgroundColor: '#3B82F6', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
                {t.generalPoa} →
              </Link>
              <Link href="/limited-poa" style={{ padding: '12px 20px', backgroundColor: '#F59E0B', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
                {t.limitedPoa} →
              </Link>
            </div>
            
            <Link href="/" style={{ display: 'inline-block', marginTop: '24px', color: '#3B82F6', textDecoration: 'none', fontWeight: '500' }}>
              ← {t.backHome}
            </Link>
          </div>
        ) : (
          /* Form */
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{service.icon}</div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E3A8A', marginBottom: '8px' }}>{t.title}</h1>
              <p style={{ color: '#64748B', margin: 0 }}>{t.subtitle}</p>
            </div>
            
            {/* Service Info Card */}
            <div style={{ backgroundColor: '#EFF6FF', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: '1px solid #BFDBFE' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: '#1E3A8A' }}>{language === 'en' ? service.name_en : service.name_es}</span>
                <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {t.estimatedLaunch}: {t.q2_2026}
                </span>
              </div>
              <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px' }}>{language === 'en' ? service.desc_en : service.desc_es}</p>
              <p style={{ color: '#1E3A8A', fontWeight: '700', margin: 0 }}>{t.startingAt} {service.price}</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  {t.nameLabel} *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  {t.emailLabel} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              
              {error && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#DC2626', fontSize: '14px' }}>
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting || !name || !email}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: isSubmitting || !name || !email ? '#D1D5DB' : '#1E3A8A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isSubmitting || !name || !email ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? t.submitting : t.submit}
              </button>
            </form>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link href="/" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
                ← {t.backHome}
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px 16px', color: '#64748B', fontSize: '12px' }}>
        <p style={{ margin: 0 }}>Multi Servicios 360 | 855.246.7274</p>
        <p style={{ margin: '4px 0 0' }}>{language === 'en' ? 'Document preparation service, not legal advice' : 'Servicio de preparación de documentos, no asesoría legal'}</p>
      </div>
    </div>
  );
}   
 