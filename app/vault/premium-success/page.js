'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VaultPremiumSuccess() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [lang, setLang] = useState('es');

  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('ms360_lang');
    if (saved) setLang(saved);
  }, []);

  const t = {
    es: {
      title: '¡Bóveda Premium Activada!',
      subtitle: 'Sus documentos ahora tienen acceso permanente',
      desc: 'Ya no tiene que preocuparse por fechas de expiración. Todos sus documentos actuales y futuros estarán siempre disponibles.',
      features: [
        'Acceso permanente a todos sus documentos',
        'Documentos futuros se agregan automáticamente',
        'Descarga ilimitada desde cualquier dispositivo',
        'Soporte prioritario',
      ],
      goToVault: 'Ir a Mi Bóveda',
      home: 'Volver al Inicio',
    },
    en: {
      title: 'Vault Premium Activated!',
      subtitle: 'Your documents now have permanent access',
      desc: "You no longer have to worry about expiration dates. All your current and future documents will always be available.",
      features: [
        'Permanent access to all your documents',
        'Future documents added automatically',
        'Unlimited downloads from any device',
        'Priority support',
      ],
      goToVault: 'Go to My Vault',
      home: 'Back to Home',
    },
  };

  const tx = t[lang];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A, #1E3A8A)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ maxWidth: '550px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}>🔒⭐</div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#FCD34D', marginBottom: '8px' }}>{tx.title}</h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>{tx.subtitle}</p>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: '1.6' }}>{tx.desc}</p>

        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '32px', textAlign: 'left' }}>
          {tx.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: i < tx.features.length - 1 ? '12px' : 0 }}>
              <span style={{ color: '#34D399', fontSize: '18px' }}>✓</span>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px' }}>{f}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {token && (
            <a href={`/vault/${token}`} style={{ padding: '14px 28px', background: '#FCD34D', color: '#0F172A', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '16px' }}>
              {tx.goToVault}
            </a>
          )}
          <a href="/" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>
            {tx.home}
          </a>
        </div>
      </div>
    </div>
  );
}
