// app/sales/dashboard/page.js - BILINGUAL ES/EN
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const T = {
  es: {
    brand: 'Portal de Ventas', welcome: 'Bienvenido,', password: '🔑 Contraseña', signout: 'Cerrar Sesión',
    registerBtn: '🏢 Registrar Nueva Oficina y Procesar Pago',
    commTitle: 'Tus Condiciones de Comisión', perSale: 'por cada venta de documento',
    month: 'mes', months: 'meses', perOffice: 'por oficina',
    bonusLabel: '✅ Bonus — Participación en Setup Fee',
    bonusDesc: 'del pago de inscripción por cada oficina que registres',
    totalOffices: 'Oficinas Totales', active: 'Activas', totalEarned: 'Total Ganado', pending: 'Por Cobrar',
    tabOverview: '📊 Resumen', tabOffices: '🏢 Mis Oficinas', tabRegs: '📋 Registros', tabSamples: '📄 Muestras', tabResources: '📦 Recursos',
    howTitle: 'Cómo Funciona',
    step1t: '1. Tú Inscribes Oficinas', step1d: 'Lleva oficinas socias (preparadores de impuestos, notarios, agentes de seguros) a Multi Servicios 360.',
    step2t: '2. Ellos Venden Documentos', step3t_pre: '3. Ganas por', step3t_suf: '',
    step2d_pre: 'Cuando esas oficinas venden Poderes Notariales, Trusts o LLCs, tú ganas', step2d_suf: '% de cada venta.',
    step3d_pre: 'Tu comisión corre por', step3d_mid: 'desde el día que cada oficina es asignada a ti.',
    bonusStep_pre: '✅ Bonus:', bonusStep_mid: '% del Setup Fee',
    bonusStep_d_pre: 'Por cada oficina que registres, también recibes', bonusStep_d_suf: '% del pago de inscripción que ellos hacen al unirse.',
    noOffices: 'Aún no tienes oficinas asignadas. Contacta a tu administrador.',
    earned: 'ganado', statusActive: 'Activo', statusExpired: 'Expirado',
    start: 'Inicio:', end: 'Fin:', by: 'por',
    noRegs: 'Aún no hay registros. Haz clic en "Registrar Nueva Oficina" para comenzar.',
    statusPendingPay: '⏳ Pago Pendiente', statusPaidApproval: '✅ Pagado — Esperando Aprobación',
    statusActiveLabel: '🟢 Activo', statusRejected: '❌ Rechazado',
    pkg: 'Paquete',
    samplesTitle: 'Documentos de Muestra', samplesDesc: 'Muéstrale a tus prospectos cómo se ven los documentos terminados.',
    samplesBtn: '📄 Ver Documentos de Muestra →',
    resTitle: '📦 Materiales y Manuales', resDesc: 'Flyers, folletos, manuales de ventas y materiales para cerrar tratos',
    resRefresh: '↻ Actualizar', resLoading: 'Cargando recursos...',
    resEmpty: 'Aún no hay materiales', resEmptyDesc: 'Tu administrador subirá materiales aquí pronto',
    audience_sales: '💼 Vendedores', audience_both: '🌐 Todos',
    download: '⬇ Descargar', noDownload: 'No disponible',
    pwTitle: '🔑 Cambiar Contraseña', pwCurrent: 'Contraseña Actual', pwNew: 'Nueva Contraseña', pwConfirm: 'Confirmar Nueva Contraseña',
    cancel: 'Cancelar', save: 'Actualizar', saving: 'Guardando...',
    pwMismatch: '❌ Las contraseñas no coinciden', pwShort: '❌ Mínimo 6 caracteres', pwOk: '✅ Contraseña actualizada',
    loading: 'Cargando tu portal...',
  },
  en: {
    brand: 'Sales Portal', welcome: 'Welcome,', password: '🔑 Password', signout: 'Sign Out',
    registerBtn: '🏢 Register New Office & Process Payment',
    commTitle: 'Your Commission Terms', perSale: 'per document sale',
    month: 'month', months: 'months', perOffice: 'per office',
    bonusLabel: '✅ Bonus — Setup Fee Share',
    bonusDesc: 'of the setup fee for every office you register',
    totalOffices: 'Total Offices', active: 'Active', totalEarned: 'Total Earned', pending: 'Pending Payout',
    tabOverview: '📊 Overview', tabOffices: '🏢 My Offices', tabRegs: '📋 Registrations', tabSamples: '📄 Samples', tabResources: '📦 Resources',
    howTitle: 'How It Works',
    step1t: '1. You Sign Up Offices', step1d: 'Bring partner offices (tax preparers, notaries, insurance agents) to Multi Servicios 360.',
    step2t: '2. They Sell Documents', step3t_pre: '3. You Earn for', step3t_suf: '',
    step2d_pre: 'When those offices sell POAs, Trusts, or LLCs, you earn', step2d_suf: '% of each sale.',
    step3d_pre: 'Your commission runs for', step3d_mid: 'from the day each office is assigned to you.',
    bonusStep_pre: '✅ Bonus:', bonusStep_mid: '% Setup Fee Share',
    bonusStep_d_pre: 'For every office you register, you also receive', bonusStep_d_suf: '% of their setup fee payment.',
    noOffices: 'No offices assigned yet. Contact your administrator.',
    earned: 'earned', statusActive: 'Active', statusExpired: 'Expired',
    start: 'Started:', end: 'Ends:', by: 'for',
    noRegs: 'No registrations yet. Click "Register New Office" to get started.',
    statusPendingPay: '⏳ Pending Payment', statusPaidApproval: '✅ Paid — Awaiting Approval',
    statusActiveLabel: '🟢 Active', statusRejected: '❌ Rejected',
    pkg: 'Package',
    samplesTitle: 'Sample Documents', samplesDesc: 'Show prospects what their finished documents will look like.',
    samplesBtn: '📄 View Sample Documents →',
    resTitle: '📦 Materials & Manuals', resDesc: 'Flyers, brochures, sales manuals, and deal-closing materials',
    resRefresh: '↻ Refresh', resLoading: 'Loading resources...',
    resEmpty: 'No materials yet', resEmptyDesc: 'Your administrator will upload materials here soon',
    audience_sales: '💼 Sales Reps', audience_both: '🌐 Everyone',
    download: '⬇ Download', noDownload: 'Not available',
    pwTitle: '🔑 Change Password', pwCurrent: 'Current Password', pwNew: 'New Password', pwConfirm: 'Confirm New Password',
    cancel: 'Cancel', save: 'Update', saving: 'Saving...',
    pwMismatch: '❌ Passwords do not match', pwShort: '❌ Minimum 6 characters', pwOk: '✅ Password updated',
    loading: 'Loading your portal...',
  }
};

export default function SalesDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState('es');
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
  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const t = T[lang];

  useEffect(() => {
    const savedLang = localStorage.getItem('sales_lang') || 'es';
    setLang(savedLang);
    const id = localStorage.getItem('salesId');
    const name = localStorage.getItem('salesName');
    if (!id) { router.push('/sales/login'); return; }
    setRepId(id); setRepName(name || 'Vendedor');
    fetchDashboard(id);
    fetchPendingOffices(id);
  }, []);

  function toggleLang() {
    const nl = lang === 'es' ? 'en' : 'es';
    setLang(nl);
    localStorage.setItem('sales_lang', nl);
  }

  async function fetchDashboard(id) {
    setLoading(true);
    try {
      const res = await fetch('/api/sales/dashboard', { headers: { 'x-sales-id': id || repId } });
      const data = await res.json();
      if (data.success) { setRep(data.rep); setAssignments(data.assignments || []); setStats(data.stats || {}); }
    } catch (err) { console.error(err); }
    setLoading(false);
  }

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
      if (data.offices) setPendingOffices(data.offices);
    } catch (err) { console.error(err); }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPw !== confirmPw) { setMessage(t.pwMismatch); return; }
    if (newPw.length < 6) { setMessage(t.pwShort); return; }
    setPwSaving(true);
    try {
      const res = await fetch('/api/sales/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rep_id: repId, current_password: currentPw, new_password: newPw }),
      });
      const data = await res.json();
      if (data.success) { setMessage(t.pwOk); setShowPwModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }
      else setMessage('❌ ' + (data.error || 'Error'));
    } catch (err) { setMessage('❌ ' + err.message); }
    setPwSaving(false);
    setTimeout(() => setMessage(''), 4000);
  }

  function logout() { localStorage.removeItem('salesId'); localStorage.removeItem('salesName'); router.push('/sales/login'); }

  const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString(lang === 'es' ? 'es' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#64748B', fontSize: 16 }}>{t.loading}</div>
    </div>
  );

  const commRate = rep?.commission_rate || 5;
  const commMonths = rep?.commission_duration_months || 1;
  const setupShareEnabled = rep?.setup_fee_share_enabled === true;
  const setupSharePct = rep?.setup_fee_share_percent || 0;
  const monthLabel = commMonths === 1 ? t.month : t.months;

  const statusLabels = {
    pending_payment: t.statusPendingPay,
    paid_pending_approval: t.statusPaidApproval,
    active: t.statusActiveLabel,
    rejected: t.statusRejected,
  };
  const statusColors = {
    pending_payment: { bg: '#FEF3C7', color: '#92400E' },
    paid_pending_approval: { bg: '#DBEAFE', color: '#1E40AF' },
    active: { bg: '#DCFCE7', color: '#166534' },
    rejected: { bg: '#FEE2E2', color: '#991B1B' },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9' }}>
      {/* Top bar */}
      <div style={{ background: '#fff', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#D97706,#F59E0B)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💰</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{t.brand}</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>{t.welcome} {repName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toggleLang} style={{ padding: '6px 12px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            {lang === 'es' ? 'English' : 'Español'}
          </button>
          <button onClick={() => setShowPwModal(true)} style={{ padding: '8px 14px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>{t.password}</button>
          <button onClick={logout} style={{ padding: '8px 14px', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>{t.signout}</button>
        </div>
      </div>

      {message && (
        <div style={{ position: 'fixed', top: 70, right: 20, zIndex: 50, background: message.startsWith('✅') ? '#DCFCE7' : '#FEE2E2', border: `1px solid ${message.startsWith('✅') ? '#22C55E' : '#EF4444'}`, borderRadius: 10, padding: '12px 18px', fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {message}
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
        <button onClick={() => router.push(`/sales/register-office?sales_id=${repId}`)}
          style={{ width: '100%', padding: '18px 24px', marginBottom: 20, borderRadius: 14, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#059669,#10B981)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 17, fontWeight: 700, boxShadow: '0 4px 20px rgba(5,150,105,0.3)' }}>
          {t.registerBtn}
        </button>

        {/* Commission Card */}
        <div style={{ background: 'linear-gradient(135deg,#78350F,#D97706)', borderRadius: 16, padding: '24px 28px', marginBottom: 16, color: '#fff' }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.commTitle}</div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: 44, fontWeight: 800 }}>{commRate}%</span>
              <span style={{ fontSize: 14, opacity: 0.8, marginLeft: 8 }}>{t.perSale}</span>
            </div>
            <div>
              <span style={{ fontSize: 30, fontWeight: 700 }}>{commMonths}</span>
              <span style={{ fontSize: 14, opacity: 0.8, marginLeft: 6 }}>{monthLabel} {t.perOffice}</span>
            </div>
          </div>
          {setupShareEnabled && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.25)' }}>
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>{t.bonusLabel}</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{setupSharePct}%
                <span style={{ fontSize: 14, opacity: 0.8, fontWeight: 400, marginLeft: 8 }}>{t.bonusDesc}</span>
              </div>
            </div>
          )}
          {rep?.notes && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 8, fontSize: 13 }}>
              📝 {rep.notes}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: t.totalOffices, value: stats.total_offices || 0, icon: '🏢', color: '#3B82F6' },
            { label: t.active, value: stats.active_offices || 0, icon: '✅', color: '#22C55E' },
            { label: t.totalEarned, value: fmt(stats.total_earned), icon: '💰', color: '#D97706' },
            { label: t.pending, value: fmt(stats.pending), icon: '⏳', color: '#EF4444' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {['overview','offices','registrations','samples','resources'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); if (tab === 'resources') fetchResources(repId); }} style={{
              padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeTab === tab ? '#78350F' : '#fff', color: activeTab === tab ? '#fff' : '#475569',
              border: activeTab === tab ? 'none' : '1px solid #E2E8F0',
            }}>
              {tab === 'overview' ? t.tabOverview : tab === 'offices' ? t.tabOffices : tab === 'samples' ? t.tabSamples : tab === 'resources' ? t.tabResources : `${t.tabRegs} (${pendingOffices.length})`}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>{t.howTitle}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { title: t.step1t, desc: t.step1d },
                { title: t.step2t, desc: `${t.step2d_pre} ${commRate}${t.step2d_suf}` },
                { title: `${t.step3t_pre} ${commMonths} ${monthLabel}${t.step3t_suf}`, desc: `${t.step3d_pre} ${commMonths} ${monthLabel} ${t.step3d_mid}` },
              ].map(s => (
                <div key={s.title} style={{ background: '#FFFBEB', borderRadius: 10, padding: '14px 18px', borderLeft: '4px solid #D97706' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#92400E' }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: '#78350F', marginTop: 4 }} dangerouslySetInnerHTML={{ __html: s.desc.replace(String(commRate)+'%', `<strong>${commRate}%</strong>`) }} />
                </div>
              ))}
              {setupShareEnabled && (
                <div style={{ background: '#DCFCE7', borderRadius: 10, padding: '14px 18px', borderLeft: '4px solid #16A34A' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#166534' }}>{t.bonusStep_pre} {setupSharePct}{t.bonusStep_mid}</div>
                  <div style={{ fontSize: 13, color: '#166534', marginTop: 4 }}>{t.bonusStep_d_pre} <strong>{setupSharePct}%</strong> {t.bonusStep_d_suf}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* OFFICES */}
        {activeTab === 'offices' && (
          <div>
            {assignments.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94A3B8' }}>{t.noOffices}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {assignments.map(a => (
                  <div key={a.id} style={{ background: '#fff', borderRadius: 10, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', borderLeft: `4px solid ${a.is_active ? '#22C55E' : '#94A3B8'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>🏢 {a.business_name}</div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                          {a.commission_rate}% {t.by} {a.duration_months} {a.duration_months === 1 ? t.month : t.months} • {t.start} {fmtDate(a.start_date)} • {t.end} {fmtDate(a.end_date)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>{fmt(a.total_commission_earned)}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>{t.earned}</div>
                        </div>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: a.is_active ? '#DCFCE7' : '#F1F5F9', color: a.is_active ? '#166534' : '#64748B' }}>
                          {a.is_active ? t.statusActive : t.statusExpired}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REGISTRATIONS */}
        {activeTab === 'registrations' && (
          <div>
            {pendingOffices.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94A3B8' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                {t.noRegs}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingOffices.map(o => {
                  const st = statusColors[o.status] || { bg: '#F1F5F9', color: '#64748B' };
                  const label = statusLabels[o.status] || o.status;
                  return (
                    <div key={o.id} style={{ background: '#fff', borderRadius: 10, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', borderLeft: `4px solid ${st.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>🏢 {o.business_name}</div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                            {o.email} • {t.pkg} {o.package_name} • ${o.setup_fee_amount} • {fmtDate(o.created_at)}
                          </div>
                        </div>
                        <span style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color }}>{label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SAMPLES */}
        {activeTab === 'samples' && (
          <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{t.samplesTitle}</h3>
            <p style={{ color: '#64748B', fontSize: 14, maxWidth: 420, margin: '0 auto 24px' }}>{t.samplesDesc}</p>
            <button onClick={() => router.push('/sales/samples')}
              style={{ background: 'linear-gradient(135deg,#1E3A8A,#2563EB)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              {t.samplesBtn}
            </button>
          </div>
        )}

        {/* RESOURCES */}
        {activeTab === 'resources' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '18px 24px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>{t.resTitle}</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>{t.resDesc}</p>
              </div>
              <button onClick={() => fetchResources(repId)} style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>{t.resRefresh}</button>
            </div>
            {resourcesLoading ? (
              <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', color: '#64748B' }}>{t.resLoading}</div>
            ) : resources.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', color: '#94A3B8' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontWeight: 600 }}>{t.resEmpty}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{t.resEmptyDesc}</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
                {resources.map(r => (
                  <div key={r.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderTop: `3px solid ${r.audience === 'sales' ? '#D97706' : '#059669'}` }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{r.category === 'flyers' ? '📄' : r.category === 'training' ? '📚' : r.category === 'brochures' ? '📰' : r.category === 'social_media' ? '📱' : '📋'}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 4 }}>{r.title}</div>
                    {r.description && <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>{r.description}</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                      <span style={{ fontSize: 11, background: r.audience === 'sales' ? '#FEF3C7' : '#DCFCE7', color: r.audience === 'sales' ? '#92400E' : '#166534', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
                        {r.audience === 'sales' ? t.audience_sales : t.audience_both}
                      </span>
                      {r.download_url
                        ? <a href={r.download_url} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#1E3A8A,#2563EB)', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{t.download}</a>
                        : <span style={{ fontSize: 12, color: '#94A3B8' }}>{t.noDownload}</span>}
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
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>{t.pwTitle}</h2>
            <form onSubmit={handleChangePassword}>
              {[[t.pwCurrent, currentPw, setCurrentPw], [t.pwNew, newPw, setNewPw], [t.pwConfirm, confirmPw, setConfirmPw]].map(([label, val, setter]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>{label}</label>
                  <input type="password" required value={val} onChange={e => setter(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '2px solid #E2E8F0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                <button type="button" onClick={() => { setShowPwModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }}
                  style={{ flex: 1, padding: 12, background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{t.cancel}</button>
                <button type="submit" disabled={pwSaving}
                  style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg,#D97706,#F59E0B)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: pwSaving ? 0.6 : 1 }}>
                  {pwSaving ? t.saving : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
