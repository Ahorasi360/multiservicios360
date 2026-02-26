'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || '';
  const pkg = searchParams.get('pkg') || 'pro';

  useEffect(() => {
    // Mark as paid in Supabase
    if (ref) {
      fetch('/api/leads/hazte-socio/paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref, package_key: pkg }),
      }).catch(() => {});
    }
  }, [ref]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFF', padding: '40px 16px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '520px', width: '100%', backgroundColor: 'white', borderRadius: '20px', padding: '48px 40px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎉</div>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#15803D', marginBottom: '12px' }}>¡Bienvenido a la familia!</h1>
        <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.7', marginBottom: '28px' }}>
          Su pago fue procesado exitosamente. En las próximas <strong>24 horas</strong> le enviaremos las credenciales de acceso a su portal de socio.
        </p>
        <div style={{ backgroundColor: '#EFF6FF', borderRadius: '12px', padding: '20px', marginBottom: '28px', border: '1px solid #BFDBFE' }}>
          <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#1E3A8A', fontWeight: '600' }}>¿Preguntas mientras tanto?</p>
          <p style={{ margin: '0', fontSize: '20px', fontWeight: '800', color: '#1E3A8A' }}>📞 855.246.7274</p>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6B7280' }}>info@multiservicios360.net</p>
        </div>
        <Link href="/" style={{ color: '#1E3A8A', fontSize: '14px', textDecoration: 'none', fontWeight: '600' }}>← Volver al inicio</Link>
      </div>
    </div>
  );
}

export default function HazteSocioSuccess() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
