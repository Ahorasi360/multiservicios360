'use client';

import React, { useState, useEffect } from 'react';
import { SIMPLE_DOC_TYPES, SHARED_TRANSLATIONS } from '../../lib/simple-doc-config';

const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);
const ShieldIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const ArrowIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);

export default function SimpleDocWizard({ docType }) {
  const config = SIMPLE_DOC_TYPES[docType];
  const [lang, setLang] = useState('es');
  const [formData, setFormData] = useState({});
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const t = config.translations[lang];
  const shared = SHARED_TRANSLATIONS[lang];

  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('ms360_lang');
    if (saved) setLang(saved);
  }, []);

  const toggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es';
    setLang(next);
    if (typeof window !== 'undefined') localStorage.setItem('ms360_lang', next);
  };

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    // Validate required fields
    const missingRequired = config.fields.filter(f => f.required && !formData[f.id]?.toString().trim());
    if (missingRequired.length > 0 || !clientName.trim() || !clientEmail.trim()) {
      setError(shared.errorRequired);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Save matter first
      const saveRes = await fetch('/api/simple-doc/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: docType,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          partner_code: partnerCode,
          form_data: formData,
          language: lang,
        }),
      });

      const saveData = await saveRes.json();
      if (!saveData.success) throw new Error(saveData.error || 'Failed to save');

      // Create Stripe checkout
      const checkoutRes = await fetch('/api/simple-doc/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: docType,
          matter_id: saveData.matterId,
          client_name: clientName,
          client_email: clientEmail,
          language: lang,
        }),
      });

      const checkoutData = await checkoutRes.json();
      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const fieldT = t.fields[field.id];
    if (!fieldT) return null;

    const baseInputStyle = {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '10px',
      border: '1px solid #D1D5DB',
      fontSize: '15px',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    };

    return (
      <div key={field.id} style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1F2937', marginBottom: '6px' }}>
          {fieldT.label}
          {field.required && <span style={{ color: '#DC2626', marginLeft: '4px' }}>*</span>}
        </label>

        {field.type === 'textarea' ? (
          <textarea
            style={{ ...baseInputStyle, minHeight: '100px', resize: 'vertical' }}
            placeholder={fieldT.placeholder || ''}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        ) : field.type === 'select' ? (
          <select
            style={{ ...baseInputStyle, backgroundColor: '#fff' }}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          >
            <option value="">— {lang === 'es' ? 'Seleccione' : 'Select'} —</option>
            {field.options.map(opt => (
              <option key={opt} value={opt}>
                {fieldT.options?.[opt] || opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
            style={baseInputStyle}
            placeholder={fieldT.placeholder || ''}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            step={field.type === 'number' ? '0.01' : undefined}
          />
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#1E3A8A' }}>Multi Servicios</span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#F59E0B' }}>360</span>
          </a>
          <button onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
            <GlobeIcon /> {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px 80px' }}>
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{config.icon}</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>{t.title}</h1>
          <p style={{ fontSize: '15px', color: '#64748B', fontStyle: 'italic', marginBottom: '12px' }}>{t.subtitle}</p>
          <p style={{ fontSize: '16px', color: '#475569', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>{t.description}</p>
          <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: config.color, color: '#fff', borderRadius: '20px', fontSize: '16px', fontWeight: '700' }}>
            {shared.price}: {config.priceDisplay}
          </div>
        </div>

        {/* Form Card */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
          {/* Client Info */}
          <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', marginBottom: '20px' }}>{shared.clientInfo}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1F2937', marginBottom: '6px' }}>
                  {shared.clientName} <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input type="text" value={clientName} onChange={e => { setClientName(e.target.value); setError(''); }}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '15px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1F2937', marginBottom: '6px' }}>
                  {shared.clientEmail} <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input type="email" value={clientEmail} onChange={e => { setClientEmail(e.target.value); setError(''); }}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '15px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1F2937', marginBottom: '6px' }}>{shared.clientPhone}</label>
                <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '15px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1F2937', marginBottom: '6px' }}>{shared.partnerLabel}</label>
                <input type="text" value={partnerCode} onChange={e => setPartnerCode(e.target.value)} placeholder={shared.partnerPlaceholder}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '15px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* Document Fields */}
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', marginBottom: '20px' }}>
            {shared.formTitle}
          </h2>
          {config.fields.map(renderField)}

          {/* Error */}
          {error && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', color: '#DC2626', fontSize: '14px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
              background: loading ? '#9CA3AF' : config.color, color: '#fff',
              fontSize: '17px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            {loading ? shared.processing : <>{shared.next} <ArrowIcon /></>}
          </button>

          {/* Security badges */}
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B7280' }}>
              <LockIcon /> {shared.secure}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B7280' }}>
              <ShieldIcon /> {shared.includes}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#9CA3AF', lineHeight: '1.5', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          {shared.disclaimer}
        </p>
      </div>

      {/* Mobile bottom bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: config.color, padding: '12px 16px', display: 'none', zIndex: 100 }} className="mobile-bar">
        <a href="tel:+18552467274" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '700', fontSize: '15px' }}>
          📞 {lang === 'es' ? 'Llámenos: 855.246.7274' : 'Call Us: 855.246.7274'}
        </a>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .mobile-bar { display: block !important; }
          div[style*="gridTemplateColumns: '1fr 1fr'"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
