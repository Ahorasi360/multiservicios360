"use client";
import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const SERVICES = {
  trust: { name_es: 'Fideicomiso en Vida', name_en: 'Living Trust', desc_es: 'Proteja sus bienes y evite la sucesión.', desc_en: 'Protect your assets and avoid probate.', price: '$799', icon: '🏠' },
  business: { name_es: 'Formación de Negocios', name_en: 'Business Formation', desc_es: 'LLC, Corporaciones, EIN y más.', desc_en: 'LLC, Corporations, EIN and more.', price: '$149', icon: '🏢' },
  immigration: { name_es: 'Servicios de Inmigración', name_en: 'Immigration Services', desc_es: 'N-400, I-130, I-485, I-765, I-90.', desc_en: 'N-400, I-130, I-485, I-765, I-90.', price: '$99', icon: '✈️' }
};

function WaitlistForm() {
  const searchParams = useSearchParams();
  const serviceKey = searchParams.get('service');
  const [language, setLanguage] = useState('es');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const service = serviceKey ? SERVICES[serviceKey] : null;
  const t = {
    title: language === 'es' ? 'Únase a la Lista de Espera' : 'Join the Waitlist',
    subtitle: language === 'es' ? 'Sea el primero en saber cuando esté disponible' : 'Be the first to know when it launches',
    name: language === 'es' ? 'Nombre Completo' : 'Full Name',
    email: language === 'es' ? 'Correo Electrónico' : 'Email',
    phone: language === 'es' ? 'Teléfono (opcional)' : 'Phone (optional)',
    submit: language === 'es' ? 'Unirse a la Lista' : 'Join Waitlist',
    success: language === 'es' ? '¡Está en la lista!' : "You're on the list!",
    successDesc: language === 'es' ? 'Le notificaremos cuando esté disponible.' : "We'll notify you when available.",
    back: language === 'es' ? 'Volver al Inicio' : 'Back to Home',
    launch: language === 'es' ? 'Lanzamiento: Q2 2026' : 'Launch: Q2 2026',
    invalid: language === 'es' ? 'Servicio no válido' : 'Invalid service',
    from: language === 'es' ? 'Desde' : 'Starting at'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_key: serviceKey, name, email, phone })
      });
      setIsSuccess(true);
    } catch (err) {
      alert('Error');
    }
    setIsSubmitting(false);
  };

  if (!service) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h1 style={{ color: '#1E3A8A', marginBottom: '16px' }}>{t.invalid}</h1>
          <Link href="/" style={{ color: '#3B82F6', fontWeight: '600' }}>← {t.back}</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '40px 16px' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto' }}>
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <button onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} style={{ padding: '8px 16px', backgroundColor: '#E5E7EB', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            {language === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
        
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>✓</div>
              <h1 style={{ color: '#166534', marginBottom: '8px' }}>{t.success}</h1>
              <p style={{ color: '#64748B', marginBottom: '24px' }}>{t.successDesc}</p>
              <Link href="/" style={{ color: '#3B82F6', fontWeight: '600' }}>← {t.back}</Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{service.icon}</div>
                <h1 style={{ fontSize: '22px', color: '#1E3A8A', marginBottom: '4px' }}>{t.title}</h1>
                <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>{t.subtitle}</p>
              </div>
              
              <div style={{ backgroundColor: '#EFF6FF', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: '1px solid #BFDBFE' }}>
                <div style={{ fontWeight: '600', color: '#1E3A8A', marginBottom: '4px' }}>{language === 'es' ? service.name_es : service.name_en}</div>
                <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 8px' }}>{language === 'es' ? service.desc_es : service.desc_en}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748B', fontSize: '13px' }}>{t.launch}</span>
                  <span style={{ color: '#1E3A8A', fontWeight: '700' }}>{t.from} {service.price}</span>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>{t.name} *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>{t.email} *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>{t.phone}</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
                <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '14px', backgroundColor: isSubmitting ? '#9CA3AF' : '#1E3A8A', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '16px' }}>
                  {isSubmitting ? '...' : t.submit}
                </button>
              </form>
              
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link href="/" style={{ color: '#3B82F6', fontSize: '14px', textDecoration: 'none' }}>← {t.back}</Link>
              </div>
            </>
          )}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '24px', color: '#64748B', fontSize: '12px' }}>
          <p style={{ margin: 0 }}>Multi Servicios 360 | 855.246.7274</p>
        </div>
      </div>
    </div>
  );
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <WaitlistForm />
    </Suspense>
  );
}