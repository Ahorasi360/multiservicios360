// app/sales/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SalesDashboard() {
  const router = useRouter();
  const [repName, setRepName] = useState('');
  const [repId, setRepId] = useState('');
  const [rep, setRep] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [pendingOffices, setPendingOffices] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);

  // Change password
  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('salesId');
    const name = localStorage.getItem('salesName');
    if (!id) { router.push('/sales/login'); return; }
    setRepId(id); setRepName(name || 'Sales Rep');
    fetchDashboard(id);
    fetchPendingOffices(id);
  }, []);

  async function fetchResources(id) {
    setResourcesLoading(true);
    try {
      const res = await fetch('/api/sales/resources', { headers: { 'x-sales-id': id || repId } });
      const data = await res.json();
      if (data.success) setResources(data.resources || []);
    } catch (err) { console.error(err); }
    setResourcesLoading(false);
  }

  async function fetchPendingOffices(id) {
    try {
      const res = await fetch('/api/sales/register-office', { headers: { 'x-sales-id': id || repId } });
      const data = await res.json();
      if (data.success) setPendingOffices(data.offices || []);
    } catch (err) { console.error(err); }
  }

  async function fetchDashboard(id) {
    setLoading(true);
    try {
      const res = await fetch('/api/sales/dashboard', { headers: { 'x-sales-id': id || repId } });
      const data = await res.json();
      if (data.success) {
        setRep(data.rep);
        setAssignments(data.assignments || []);
        setStats(data.stats || {});
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPw !== confirmPw) { setMessage('❌ Passwords do not match'); return; }
    if (newPw.length < 6) { setMessage('❌ Password must be at least 6 characters'); return; }
    setPwSaving(true);
    try {
      const res = await fetch('/api/sales/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rep_id: repId, current_password: currentPw, new_password: newPw }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Password updated successfully');
        setShowPwModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw('');
      } else {
        setMessage('❌ ' + (data.error || 'Failed to update'));
      }
    } catch (err) { setMessage('❌ Error: ' + err.message); }
    setPwSaving(false);
    setTimeout(() => setMessage(''), 4000);
  }

  function logout() {
    localStorage.removeItem('salesId'); localStorage.removeItem('salesName');
    router.push('/sales/login');
  }

  const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#64748B', fontSize: 16 }}>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9' }}>
      {/* Top bar */}
      <div style={{ background: '#fff', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#D97706,#F59E0B)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💰</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Sales Portal</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>Welcome, {repName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowPwModal(true)} style={{ padding: '8px 14px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>🔑 Password</button>
          <button onClick={logout} style={{ padding: '8px 14px', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      {/* Message toast */}
      {message && (
        <div style={{ position: 'fixed', top: 70, right: 20, zIndex: 50, background: message.startsWith('✅') ? '#DCFCE7' : '#FEE2E2', border: `1px solid ${message.startsWith('✅') ? '#22C55E' : '#EF4444'}`, borderRadius: 10, padding: '12px 18px', fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {message}
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
        {/* Register Office CTA */}
        <button
          onClick={() => router.push(`/sales/register-office?sales_id=${repId}`)}
          style={{
            width: '100%', padding: '18px 24px', marginBottom: 20, borderRadius: 14, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #059669, #10B981)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            fontSize: 17, fontWeight: 700, boxShadow: '0 4px 20px rgba(5,150,105,0.3)',
          }}
        >
          🏢 Register New Office &amp; Process Payment
        </button>
        {/* My Commission Card */}
        <div style={{ background: 'linear-gradient(135deg,#78350F,#D97706)', borderRadius: 16, padding: '24px 28px', marginBottom: 20, color: '#fff' }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>Your Commission Terms</div>
          <div style={{ display: 'flex', gap: 30, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: 42, fontWeight: 800 }}>{rep?.commission_rate || 5}%</span>
              <span style={{ fontSize: 14, opacity: 0.8, marginLeft: 6 }}>per client sale</span>
            </div>
            <div>
              <span style={{ fontSize: 28, fontWeight: 700 }}>{rep?.commission_duration_months || 1}</span>
              <span style={{ fontSize: 14, opacity: 0.8, marginLeft: 6 }}>month{(rep?.commission_duration_months || 1) > 1 ? 's' : ''} per office</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Offices', value: stats.total_offices || 0, icon: '🏢', color: '#3B82F6' },
            { label: 'Active', value: stats.active_offices || 0, icon: '✅', color: '#22C55E' },
            { label: 'Total Earned', value: fmt(stats.total_earned), icon: '💰', color: '#D97706' },
            { label: 'Pending Payout', value: fmt(stats.pending), icon: '⏳', color: '#EF4444' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {['overview', 'offices', 'registrations', 'samples', 'resources'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeTab === tab ? '#78350F' : '#fff', color: activeTab === tab ? '#fff' : '#475569',
              border: activeTab === tab ? 'none' : '1px solid #E2E8F0',
            }}>{tab === 'overview' ? '📊 Overview' : tab === 'offices' ? '🏢 My Offices' : tab === 'samples' ? '📄 Samples' : tab === 'resources' ? '📦 Resources' : `📋 Registrations (${pendingOffices.length})`}</button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>How It Works</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '14px 18px', borderLeft: '4px solid #D97706' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#92400E' }}>1. You Sign Up Offices</div>
                <div style={{ fontSize: 13, color: '#78350F', marginTop: 4 }}>Bring partner offices (tax preparers, notaries, insurance agents) to Multi Servicios 360.</div>
              </div>
              <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '14px 18px', borderLeft: '4px solid #D97706' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#92400E' }}>2. They Sell Documents</div>
                <div style={{ fontSize: 13, color: '#78350F', marginTop: 4 }}>When those offices sell POAs, Trusts, or LLCs through our platform, you earn {rep?.commission_rate || 5}% of each sale.</div>
              </div>
              <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '14px 18px', borderLeft: '4px solid #D97706' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#92400E' }}>3. You Earn for {rep?.commission_duration_months || 1} Month{(rep?.commission_duration_months || 1) > 1 ? 's' : ''}</div>
                <div style={{ fontSize: 13, color: '#78350F', marginTop: 4 }}>Your commission runs for {rep?.commission_duration_months || 1} month{(rep?.commission_duration_months || 1) > 1 ? 's' : ''} from the day each office is assigned to you.</div>
              </div>
            </div>
          </div>
        )}

        {/* Offices */}
        {activeTab === 'offices' && (
          <div>
            {assignments.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94A3B8', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                No offices assigned yet. Contact your administrator.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {assignments.map(a => (
                  <div key={a.id} style={{ background: '#fff', borderRadius: 10, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', borderLeft: `4px solid ${a.is_active ? '#22C55E' : '#94A3B8'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>🏢 {a.business_name}</div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                          {a.commission_rate}% for {a.duration_months} month{a.duration_months > 1 ? 's' : ''} • Started {fmtDate(a.start_date)} • Ends {fmtDate(a.end_date)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>{fmt(a.total_commission_earned)}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>earned</div>
                        </div>
                        <span style={{
                          padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: a.is_active ? '#DCFCE7' : '#F1F5F9', color: a.is_active ? '#166534' : '#64748B',
                        }}>{a.is_active ? 'Active' : 'Expired'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div>
            {pendingOffices.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94A3B8', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                No registrations yet. Click &quot;Register New Office&quot; to get started.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingOffices.map(o => {
                  const statusColors = {
                    pending_payment: { bg: '#FEF3C7', color: '#92400E', label: '⏳ Pending Payment' },
                    paid_pending_approval: { bg: '#DBEAFE', color: '#1E40AF', label: '✅ Paid — Awaiting Approval' },
                    active: { bg: '#DCFCE7', color: '#166534', label: '🟢 Active' },
                    rejected: { bg: '#FEE2E2', color: '#991B1B', label: '❌ Rejected' },
                  };
                  const st = statusColors[o.status] || { bg: '#F1F5F9', color: '#64748B', label: o.status };
                  return (
                    <div key={o.id} style={{ background: '#fff', borderRadius: 10, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', borderLeft: `4px solid ${st.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>🏢 {o.business_name}</div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                            {o.email} • {o.package_name} package • ${o.setup_fee_amount} • {fmtDate(o.created_at)}
                          </div>
                        </div>
                        <span style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color }}>{st.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'samples' && (
          <div style={{ background:'#fff', borderRadius:14, padding:40, textAlign:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📄</div>
            <h3 style={{ fontSize:20, fontWeight:700, color:'#0F172A', marginBottom:8 }}>Sample Documents</h3>
            <p style={{ color:'#64748B', fontSize:14, maxWidth:420, margin:'0 auto 24px' }}>
              Preview all 8 document types with watermarked samples — great for showing prospects what they will receive.
              Includes pricing and your commission per document.
            </p>
            <button onClick={() => router.push('/sales/samples')}
              style={{ background:'linear-gradient(135deg,#1E3A8A,#2563EB)', color:'#fff', border:'none', padding:'14px 32px', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer' }}>
              📄 Open Sample Docs →
            </button>
          </div>
        )}

        {activeTab === 'resources' && (
          <div>
            <div style={{ background:'#fff', borderRadius:14, padding:'18px 24px', marginBottom:16, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#0F172A', margin:0 }}>📦 Marketing Resources & Manuals</h3>
                <p style={{ fontSize:13, color:'#64748B', margin:'4px 0 0' }}>Flyers, brochures, training manuals, and sales materials to help you close deals</p>
              </div>
              <button onClick={() => fetchResources(repId)} style={{ padding:'8px 16px', background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:8, fontSize:13, cursor:'pointer' }}>↻ Refresh</button>
            </div>
            {resourcesLoading ? (
              <div style={{ background:'#fff', borderRadius:14, padding:40, textAlign:'center', color:'#64748B' }}>Loading resources...</div>
            ) : resources.length === 0 ? (
              <div style={{ background:'#fff', borderRadius:14, padding:40, textAlign:'center', color:'#94A3B8', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
                <div style={{ fontWeight:600, marginBottom:6 }}>No resources uploaded yet</div>
                <div style={{ fontSize:13 }}>Check back soon — your admin uploads materials here</div>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
                {resources.map(r => (
                  <div key={r.id} style={{ background:'#fff', borderRadius:12, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', borderTop:`3px solid ${r.audience === 'sales' ? '#D97706' : r.audience === 'partner' ? '#3B82F6' : '#059669'}` }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>
                      {r.category === 'flyers' ? '📄' : r.category === 'training' ? '📚' : r.category === 'brochures' ? '📰' : r.category === 'social_media' ? '📱' : r.category === 'posters' ? '🖼️' : '📋'}
                    </div>
                    <div style={{ fontWeight:700, fontSize:14, color:'#0F172A', marginBottom:4 }}>{r.title}</div>
                    {r.description && <div style={{ fontSize:12, color:'#64748B', marginBottom:8 }}>{r.description}</div>}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12 }}>
                      <span style={{ fontSize:11, background: r.audience === 'sales' ? '#FEF3C7' : '#DCFCE7', color: r.audience === 'sales' ? '#92400E' : '#166534', padding:'2px 8px', borderRadius:10, fontWeight:600 }}>
                        {r.audience === 'sales' ? '💼 Sales Only' : r.audience === 'partner' ? '🏢 Partner' : '🌐 All'}
                      </span>
                      {r.download_url ? (
                        <a href={r.download_url} target="_blank" rel="noreferrer"
                          style={{ padding:'8px 16px', background:'linear-gradient(135deg,#1E3A8A,#2563EB)', color:'#fff', borderRadius:8, fontSize:12, fontWeight:600, textDecoration:'none' }}>
                          ⬇ Download
                        </a>
                      ) : (
                        <span style={{ fontSize:12, color:'#94A3B8' }}>Not available</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPwModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 400, width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>🔑 Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Current Password</label>
                <input type="password" required value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '2px solid #E2E8F0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>New Password</label>
                <input type="password" required value={newPw} onChange={e => setNewPw(e.target.value)} minLength={6}
                  style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '2px solid #E2E8F0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Confirm New Password</label>
                <input type="password" required value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '2px solid #E2E8F0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => { setShowPwModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }}
                  style={{ flex: 1, padding: '12px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={pwSaving}
                  style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#D97706,#F59E0B)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: pwSaving ? 0.6 : 1 }}>
                  {pwSaving ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
