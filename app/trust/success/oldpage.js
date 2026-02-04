"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TrustSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const matterId = searchParams.get('matter_id');
  const [language, setLanguage] = useState('es');

  const t = language === 'es' ? {
    title: '¡Pago Exitoso!',
    subtitle: 'Gracias por su compra',
    message: 'Su Fideicomiso en Vida de California está siendo preparado.',
    nextSteps: 'Próximos Pasos:',
    step1: 'Recibirá un correo electrónico con su documento en las próximas 24-48 horas.',
    step2: 'Revise el documento cuidadosamente.',
    step3: 'Firme el documento frente a un notario.',
    step4: 'Transfiera sus activos al fideicomiso.',
    questions: '¿Preguntas?',
    contact: 'Llámenos al 855.246.7274 o envíenos un correo.',
    backHome: 'Volver al Inicio',
    orderId: 'ID de Orden:'
  } : {
    title: 'Payment Successful!',
    subtitle: 'Thank you for your purchase',
    message: 'Your California Living Trust is being prepared.',
    nextSteps: 'Next Steps:',
    step1: 'You will receive an email with your document within 24-48 hours.',
    step2: 'Review the document carefully.',
    step3: 'Sign the document in front of a notary.',
    step4: 'Transfer your assets to the trust.',
    questions: 'Questions?',
    contact: 'Call us at 855.246.7274 or send us an email.',
    backHome: 'Back to Home',
    orderId: 'Order ID:'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3FF', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          
          {/* Success Icon */}
          <div style={{ width: '80px', height: '80px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>{t.title}</h1>
          <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '16px' }}>{t.subtitle}</p>
          <p style={{ fontSize: '16px', color: '#4B5563', marginBottom: '32px' }}>{t.message}</p>

          {matterId && (
            <div style={{ backgroundColor: '#F3F4F6', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
              <span style={{ fontSize: '14px', color: '#6B7280' }}>{t.orderId} </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937', fontFamily: 'monospace' }}>{matterId.substring(0, 8)}...</span>
            </div>
          )}

          {/* Next Steps */}
          <div style={{ textAlign: 'left', backgroundColor: '#FAF5FF', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#7C3AED', marginBottom: '16px' }}>{t.nextSteps}</h3>
            <ol style={{ margin: 0, paddingLeft: '20px', color: '#4B5563', lineHeight: '1.8' }}>
              <li style={{ marginBottom: '8px' }}>{t.step1}</li>
              <li style={{ marginBottom: '8px' }}>{t.step2}</li>
              <li style={{ marginBottom: '8px' }}>{t.step3}</li>
              <li>{t.step4}</li>
            </ol>
          </div>

          {/* Contact */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>{t.questions}</p>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>{t.contact}</p>
          </div>

          {/* Language Toggle & Back Button */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              style={{ padding: '12px 24px', backgroundColor: 'white', color: '#7C3AED', border: '2px solid #7C3AED', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              {language === 'en' ? 'Español' : 'English'}
            </button>
            <a 
              href="/"
              style={{ padding: '12px 24px', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}
            >
              {t.backHome}
            </a>
          </div>

        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '16px', color: '#6B7280', fontSize: '12px' }}>
          <p style={{ margin: 0 }}>Multi Servicios 360 | www.multiservicios360.net | 855.246.7274</p>
        </div>
      </div>
    </div>
  );
}