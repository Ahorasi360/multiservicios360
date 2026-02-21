// app/sales/register-office/success/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const partnerId = searchParams.get('partner_id');

  useEffect(() => {
    const id = localStorage.getItem('salesId');
    if (!id) { router.push('/sales/login'); return; }
    // Simple timeout to show success
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #064E3B, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '48px 40px', maxWidth: 500, width: '100%', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
        {loading ? (
          <>
            <div style={{ width: 60, height: 60, border: '4px solid #E2E8F0', borderTopColor: '#059669', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <p style={{ fontSize: 16, color: '#64748B' }}>Confirming payment...</p>
          </>
        ) : (
          <>
            <div style={{ width: 80, height: 80, background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 40 }}>✅</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Payment Successful!</h1>
            <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 24px' }}>The setup fee has been processed. The office is now pending approval from headquarters.</p>

            <div style={{ background: '#F0FDF4', borderRadius: 12, padding: '18px 20px', marginBottom: 24, textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#166534', marginBottom: 8 }}>What happens next:</div>
              <div style={{ fontSize: 13, color: '#15803D', lineHeight: 1.7 }}>
                1. Headquarters reviews the office registration<br/>
                2. Once approved, the office receives login credentials via email<br/>
                3. The office can start creating documents immediately<br/>
                4. You earn your commission on every sale they make
              </div>
            </div>

            <div style={{ background: '#FFFBEB', borderRadius: 12, padding: '14px 18px', marginBottom: 24, textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: '#92400E' }}>
                💡 <strong>Tip:</strong> A receipt was sent to the office&apos;s email automatically by Stripe.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => router.push('/sales/register-office')}
                style={{ flex: 1, padding: 14, background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                + Register Another
              </button>
              <button
                onClick={() => router.push('/sales/dashboard')}
                style={{ flex: 1, padding: 14, background: 'linear-gradient(135deg,#D97706,#F59E0B)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Back to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#064E3B', color: '#fff' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
