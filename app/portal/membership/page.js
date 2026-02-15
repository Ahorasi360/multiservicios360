// app/portal/membership/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PartnerMembershipPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [partnerId, setPartnerId] = useState('');
  const [membership, setMembership] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('partnerId');
    if (!id) { router.push('/portal/login'); return; }
    setPartnerId(id);
    fetchMembership(id);

    if (searchParams.get('success')) setMessage('✅ Payment successful! Your membership is now active.');
    if (searchParams.get('cancelled')) setMessage('⚠️ Payment was cancelled. You can try again anytime.');
  }, []);

  async function fetchMembership(id) {
    setLoading(true);
    try {
      const res = await fetch(`/api/portal/membership?partner_id=${id}`);
      const data = await res.json();
      if (data.membership) setMembership(data.membership);
      if (data.payments) setPayments(data.payments);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  async function handleCheckout(type) {
    setProcessing(true);
    try {
      const res = await fetch('/api/portal/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner_id: partnerId, payment_type: type }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage('❌ ' + (data.error || 'Failed to create checkout'));
      }
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
    setProcessing(false);
  }

  function goBack() { router.push('/portal/dashboard'); }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';
  const fmtMoney = (n) => '$' + Number(n || 0).toFixed(2);

  const statusConfig = {
    active: { label: 'Active', bg: '#DCFCE7', color: '#166534', icon: '✅' },
    expired: { label: 'Expired', bg: '#FEE2E2', color: '#991B1B', icon: '⚠️' },
    pending_setup: { label: 'Pending Setup', bg: '#FEF3C7', color: '#92400E', icon: '⏳' },
    inactive: { label: 'Inactive', bg: '#F1F5F9', color: '#475569', icon: '⏸️' },
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#64748B' }}>Loading membership...</p>
    </div>
  );

  const sc = statusConfig[membership?.membership_status] || statusConfig.inactive;

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9' }}>
      {/* Top bar */}
      <div style={{ background: '#fff', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#1E3A8A,#3B82F6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>M360</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Membership</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>{membership?.business_name || membership?.contact_name}</div>
          </div>
        </div>
        <button onClick={goBack} style={{ padding: '8px 16px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Toast */}
      {message && (
        <div style={{ position: 'fixed', top: 70, right: 20, zIndex: 50, maxWidth: 400,
          background: message.startsWith('✅') ? '#DCFCE7' : message.startsWith('⚠️') ? '#FEF3C7' : '#FEE2E2',
          border: `1px solid ${message.startsWith('✅') ? '#22C55E' : message.startsWith('⚠️') ? '#F59E0B' : '#EF4444'}`,
          borderRadius: 10, padding: '12px 18px', fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {message}
        </div>
      )}

      <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
        {/* Membership Status Card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>
                {membership?.package_name ? membership.package_name.charAt(0).toUpperCase() + membership.package_name.slice(1) + ' Package' : 'Membership'}
              </h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Multi Servicios 360 Partner Program</p>
            </div>
            <div style={{ background: sc.bg, color: sc.color, padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>
              {sc.icon} {sc.label}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Setup Fee</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: membership?.setup_fee_paid ? '#059669' : '#D97706' }}>
                {fmtMoney(membership?.setup_fee_amount)}
              </div>
              <div style={{ fontSize: 12, color: membership?.setup_fee_paid ? '#059669' : '#D97706', marginTop: 2 }}>
                {membership?.setup_fee_paid ? `✅ Paid ${fmt(membership.setup_fee_paid_at)}` : '⏳ Not paid yet'}
              </div>
            </div>

            <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Annual Renewal</div>
              {membership?.annual_fee_waived ? (
                <>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#059669' }}>WAIVED</div>
                  <div style={{ fontSize: 12, color: '#059669', marginTop: 2 }}>⭐ No charge this year</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1E3A8A' }}>
                    {membership?.annual_fee_amount > 0 ? fmtMoney(membership.annual_fee_amount) : fmtMoney(membership?.setup_fee_amount)}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Per year</div>
                </>
              )}
            </div>

            <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Expires</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: membership?.days_until_expiry !== null && membership.days_until_expiry < 30 ? '#DC2626' : '#0F172A' }}>
                {membership?.days_until_expiry !== null ? `${membership.days_until_expiry}d` : '—'}
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                {membership?.membership_expires_at ? fmt(membership.membership_expires_at) : 'No expiry set'}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {!membership?.setup_fee_paid && (
              <button onClick={() => handleCheckout('setup_fee')} disabled={processing}
                style={{ flex: 1, minWidth: 200, padding: '16px 24px', background: 'linear-gradient(135deg,#059669,#10B981)', color: '#fff',
                  border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', opacity: processing ? 0.6 : 1,
                  boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
                {processing ? 'Redirecting...' : `💳 Pay Setup Fee — ${fmtMoney(membership?.setup_fee_amount)}`}
              </button>
            )}

            {membership?.setup_fee_paid && !membership?.annual_fee_waived && (membership?.membership_status === 'expired' || (membership?.days_until_expiry !== null && membership.days_until_expiry < 60)) && (
              <button onClick={() => handleCheckout('annual_renewal')} disabled={processing}
                style={{ flex: 1, minWidth: 200, padding: '16px 24px', background: 'linear-gradient(135deg,#1E3A8A,#3B82F6)', color: '#fff',
                  border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', opacity: processing ? 0.6 : 1,
                  boxShadow: '0 4px 12px rgba(30,58,138,0.3)' }}>
                {processing ? 'Redirecting...' : `🔄 Renew — ${fmtMoney(membership?.annual_fee_amount || membership?.setup_fee_amount)}/year`}
              </button>
            )}

            {membership?.setup_fee_paid && membership?.annual_fee_waived && (
              <div style={{ background: '#FEF9C3', border: '1px solid #FDE68A', borderRadius: 10, padding: '14px 20px', fontSize: 14, color: '#854D0E', width: '100%', textAlign: 'center' }}>
                ⭐ Your annual renewal has been waived. No payment needed — your membership will be automatically renewed.
              </div>
            )}

            {membership?.setup_fee_paid && !membership?.annual_fee_waived && membership?.membership_status === 'active' && membership?.days_until_expiry > 60 && (
              <div style={{ background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 10, padding: '14px 20px', fontSize: 14, color: '#166534', width: '100%', textAlign: 'center' }}>
                ✅ Your membership is active and in good standing. Renew option will appear 60 days before expiry.
              </div>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>💰 Payment History</h3>

          {payments.length === 0 ? (
            <p style={{ color: '#94A3B8', textAlign: 'center', padding: 20 }}>No payments yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {payments.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{p.description || p.payment_type}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{fmt(p.paid_at || p.created_at)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{fmtMoney(p.amount)}</span>
                    <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: p.status === 'paid' ? '#DCFCE7' : p.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                      color: p.status === 'paid' ? '#166534' : p.status === 'pending' ? '#92400E' : '#991B1B'
                    }}>
                      {p.status === 'paid' ? '✅ Paid' : p.status === 'pending' ? '⏳ Pending' : '❌ ' + p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 20 }}>
          Questions about your membership? Call (855) 246-7274
        </p>
      </div>
    </div>
  );
}
