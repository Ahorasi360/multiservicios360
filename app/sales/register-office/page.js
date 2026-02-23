// app/sales/register-office/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RegisterOfficeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [repId, setRepId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1=info, 2=package, 3=review

  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    partner_type: 'tax_preparer',
    package_key: '',
  });

  const [inviteValid, setInviteValid] = useState(false);
  const [inviteChecking, setInviteChecking] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('salesId');
    if (!id) { router.push('/sales/login'); return; }
    setRepId(id);
    if (searchParams.get('cancelled')) setError('Payment was cancelled. You can try again.');
    // Check invite code
    const invite = searchParams.get('invite');
    if (!invite) { setInviteChecking(false); return; }
    fetch(`/api/sales/invite?code=${invite}`)
      .then(r => r.json())
      .then(d => { if (d.valid) setInviteValid(true); setInviteChecking(false); })
      .catch(() => setInviteChecking(false));
  }, []);

  const packages = [
    { key: 'start', name: 'Partner Start', price: 499, commission: '20%', color: '#3B82F6', features: ['Partner portal access', 'All document types', '20% commission per sale', 'Email support'] },
    { key: 'pro', name: 'Partner Pro', price: 999, commission: '25%', color: '#8B5CF6', badge: 'Popular', features: ['Everything in Partner Start', '25% commission per sale', 'Priority support', 'Co-branded materials'] },
    { key: 'elite', name: 'Partner Elite', price: 2500, commission: '30%', color: '#D97706', badge: 'Premium', features: ['Everything in Partner Pro', '30% commission per sale', 'Dedicated account manager', 'Custom co-branding', 'Marketing support'] },
  ];

  const partnerTypes = [
    { value: 'tax_preparer', label: 'Tax Preparer' },
    { value: 'notary', label: 'Notary Public' },
    { value: 'insurance', label: 'Insurance Agent' },
    { value: 'real_estate', label: 'Real Estate Agent' },
    { value: 'immigration', label: 'Immigration Consultant' },
    { value: 'accounting', label: 'Accounting Firm' },
    { value: 'other', label: 'Other' },
  ];

  const selectedPkg = packages.find(p => p.key === form.package_key);

  async function handleSubmit() {
    setProcessing(true); setError('');
    try {
      const res = await fetch('/api/sales/register-office', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-sales-id': repId },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setError(data.error || 'Failed to create office');
        setProcessing(false);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      setProcessing(false);
    }
  }

  const inp = { width: '100%', padding: '12px 14px', fontSize: 14, border: '2px solid #E2E8F0', borderRadius: 10, outline: 'none', boxSizing: 'border-box', background: '#fff' };
  const lbl = { display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9' }}>
      {/* Invite gate */}
      {inviteChecking && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#64748B', fontSize: 16 }}>Verifying access...</p>
        </div>
      )}
      {!inviteChecking && !inviteValid && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 48 }}>🔒</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>Invitation Required</h2>
          <p style={{ color: '#64748B', fontSize: 15, textAlign: 'center', maxWidth: 380, margin: 0 }}>This page is only accessible with a valid invitation link from Multi Servicios 360.</p>
          <button onClick={() => router.push('/sales/dashboard')} style={{ padding: '12px 24px', background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Back to Dashboard</button>
        </div>
      )}
      {!inviteChecking && inviteValid && (<>
      {/* Header */}
      <div style={{ background: '#fff', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#D97706,#F59E0B)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏢</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Register New Office</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>Multi Servicios 360 Partner Program</div>
          </div>
        </div>
        <button onClick={() => router.push('/sales/dashboard')} style={{ padding: '8px 16px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>← Back to Dashboard</button>
      </div>

      {/* Progress Steps */}
      <div style={{ maxWidth: 700, margin: '24px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {[{ n: 1, label: 'Office Info' }, { n: 2, label: 'Select Package' }, { n: 3, label: 'Review & Pay' }].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step >= s.n ? '#D97706' : '#E2E8F0', color: step >= s.n ? '#fff' : '#94A3B8',
                fontSize: 14, fontWeight: 700
              }}>{s.n}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: step >= s.n ? '#0F172A' : '#94A3B8' }}>{s.label}</span>
              {i < 2 && <div style={{ width: 40, height: 2, background: step > s.n ? '#D97706' : '#E2E8F0', borderRadius: 1 }} />}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14, color: '#991B1B' }}>{error}</div>
        )}

        {/* STEP 1: Office Info */}
        {step === 1 && (
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 20px' }}>📋 Office Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={lbl}>Business Name *</label>
                <input value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} placeholder="ABC Tax Services" style={inp} />
              </div>
              <div>
                <label style={lbl}>Contact Person</label>
                <input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} placeholder="Maria Garcia" style={inp} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={lbl}>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="office@example.com" style={inp} />
              </div>
              <div>
                <label style={lbl}>Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(555) 123-4567" style={inp} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={lbl}>Business Type</label>
              <select value={form.partner_type} onChange={e => setForm({ ...form, partner_type: e.target.value })} style={inp}>
                {partnerTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <button
              onClick={() => {
                if (!form.business_name || !form.email) { setError('Business name and email are required'); return; }
                setError(''); setStep(2);
              }}
              style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#D97706,#F59E0B)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
            >
              Continue to Package Selection →
            </button>
          </div>
        )}

        {/* STEP 2: Package Selection */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 20px', textAlign: 'center' }}>📦 Select a Package for {form.business_name}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {packages.map(pkg => (
                <div
                  key={pkg.key}
                  onClick={() => setForm({ ...form, package_key: pkg.key })}
                  style={{
                    background: '#fff', borderRadius: 14, padding: '24px 20px', cursor: 'pointer',
                    border: form.package_key === pkg.key ? `3px solid ${pkg.color}` : '2px solid #E2E8F0',
                    boxShadow: form.package_key === pkg.key ? `0 0 20px ${pkg.color}30` : '0 1px 3px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s', position: 'relative',
                  }}
                >
                  {pkg.badge && (
                    <div style={{
                      position: 'absolute', top: -10, right: 12, background: pkg.color, color: '#fff',
                      padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    }}>{pkg.badge}</div>
                  )}
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{pkg.name}</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: pkg.color, marginBottom: 4 }}>${pkg.price.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>One-time setup fee</div>
                  <div style={{ background: `${pkg.color}15`, borderRadius: 8, padding: '8px 12px', marginBottom: 16, textAlign: 'center' }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: pkg.color }}>{pkg.commission}</span>
                    <span style={{ fontSize: 12, color: '#64748B', marginLeft: 4 }}>commission</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {pkg.features.map((f, i) => (
                      <li key={i} style={{ fontSize: 13, color: '#475569', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: pkg.color }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: 14, background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
              <button
                onClick={() => {
                  if (!form.package_key) { setError('Please select a package'); return; }
                  setError(''); setStep(3);
                }}
                disabled={!form.package_key}
                style={{ flex: 2, padding: 14, background: form.package_key ? 'linear-gradient(135deg,#D97706,#F59E0B)' : '#94A3B8', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: form.package_key ? 'pointer' : 'not-allowed' }}
              >
                Review & Pay →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Pay */}
        {step === 3 && selectedPkg && (
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 24px' }}>✅ Review & Process Payment</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#64748B', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Office Details</h3>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>{form.business_name}</div>
                <div style={{ fontSize: 13, color: '#475569' }}>{form.contact_name}</div>
                <div style={{ fontSize: 13, color: '#475569' }}>{form.email}</div>
                <div style={{ fontSize: 13, color: '#475569' }}>{form.phone}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 6 }}>{partnerTypes.find(t => t.value === form.partner_type)?.label}</div>
              </div>
              <div style={{ background: `${selectedPkg.color}08`, borderRadius: 12, padding: 20, border: `1px solid ${selectedPkg.color}30` }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#64748B', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Package</h3>
                <div style={{ fontSize: 18, fontWeight: 700, color: selectedPkg.color, marginBottom: 4 }}>{selectedPkg.name}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#0F172A' }}>${selectedPkg.price.toLocaleString()}</div>
                <div style={{ fontSize: 13, color: '#64748B' }}>One-time setup fee</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: selectedPkg.color, marginTop: 8 }}>{selectedPkg.commission} commission rate</div>
              </div>
            </div>

            <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '14px 18px', marginBottom: 24, borderLeft: '4px solid #D97706' }}>
              <div style={{ fontSize: 13, color: '#92400E' }}>
                <strong>What happens next:</strong> After payment, the office will appear as "Pending Approval" in the admin panel. Once headquarters approves, the office receives their login credentials and can start creating documents.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: 14, background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
              <button
                onClick={handleSubmit}
                disabled={processing}
                style={{
                  flex: 2, padding: 16,
                  background: processing ? '#94A3B8' : 'linear-gradient(135deg,#059669,#10B981)',
                  color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700,
                  cursor: processing ? 'not-allowed' : 'pointer',
                }}
              >
                {processing ? '⏳ Processing...' : `💳 Process Payment — $${selectedPkg.price.toLocaleString()}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegisterOfficePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9' }}>Loading...</div>}>
      <RegisterOfficeContent />
    </Suspense>
  );
}
