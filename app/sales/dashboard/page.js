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
  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('salesId');
    const name = localStorage.getItem('salesName');
    if (!id) { router.push('/sales/login'); return; }
    setRepId(id); setRepName(name || 'Vendedor');
    fetchDashboard(id);
    fetchPendingOffices(id);
  }, []);

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
    if (newPw !== confirmPw) { setMessage('❌ Las contraseñas no coinciden'); return; }
    if (newPw.length < 6) { setMessage('❌ Mínimo 6 caracteres'); return; }
    setPwSaving(true);
    try {
      const res = await fetch('/api/sales/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rep_id: repId, current_password: currentPw, new_password: newPw }),
      });
      const data = await res.json();
      if (data.success) { setMessage('✅ Contraseña actualizada'); setShowPwModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }
      else setMessage('❌ ' + (data.error || 'Error al actualizar'));
    } catch (err) { setMessage('❌ Error: ' + err.message); }
    setPwSaving(false);
    setTimeout(() => setMessage(''), 4000);
  }

  function logout() { localStorage.removeItem('salesId'); localStorage.removeItem('salesName'); router.push('/sales/login'); }

  const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#64748B', fontSize: 16 }}>Cargando tu portal...</div>
    </div>
  );

  // Live values from DB — admin controls these
  const commRate = rep?.commission_rate || 5;
  const commMonths = rep?.commission_duration_months || 1;
  const setupShareEnabled = rep?.setup_fee_share_enabled === true;
  const setupSharePct = rep?.setup_fee_share_percent || 0;

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9' }}>
      {/* Top bar */}
      <div style={{ background: '#fff', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#D97706,#F59E0B)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💰</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Portal de Ventas</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>Bienvenido, {repName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowPwModal(true)} style={{ padding: '8px 14px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>🔑 Contraseña</button>
          <button onClick={logout} style={{ padding: '8px 14px', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>Cerrar Sesión</button>
        </div>
      </div>

      {message && (
        <div style={{ position: 'fixed', top: 70, right: 20, zIndex: 50, background: message.startsWith('✅') ? '#DCFCE7' : '#FEE2E2', border: `1px solid ${message.startsWith('✅') ? '#22C55E' : '#EF4444'}`, borderRadius: 10, padding: '12px 18px', fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {message}
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>

        {/* CTA Button */}
        <button onClick={() => router.push(`/sales/register-office?sales_id=${repId}`)}
          style={{ width: '100%', padding: '18px 24px', marginBottom: 20, borderRadius: 14, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#059669,#10B981)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 17, fontWeight: 700, boxShadow: '0 4px 20px rgba(5,150,105,0.3)' }}>
          🏢 Registrar Nueva Oficina y Procesar Pago
        </button>

        {/* Commission Card — always shows LIVE values from DB */}
        <div style={{ background: 'linear-gradient(135deg,#78350F,#D97706)', borderRadius: 16, padding: '24px 28px', marginBottom: 16, color: '#fff' }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tus Condiciones de Comisión</div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: 44, fontWeight: 800 }}>{commRate}%</span>
              <span style={{ fontSize: 14, opacity: 0.8, marginLeft: 8 }}>por cada venta de documento</span>
            </div>
            <div>
              <span style={{ fontSize: 30, fontWeight: 700 }}>{commMonths}</span>
              <span style={{ fontSize: 14, opacity: 0.8, marginLeft: 6 }}>{commMonths === 1 ? 'mes' : 'meses'} por oficina</span>
            </div>
          </div>
          {/* Setup fee share — ONLY appears if admin turned it on */}
          {setupShareEnabled && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.25)' }}>
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>✅ Bonus — Participación en Setup Fee</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{setupSharePct}%
                <span style={{ fontSize: 14, opacity: 0.8, fontWeight: 400, marginLeft: 8 }}>del pago de inscripción por cada oficina que registres</span>
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
            { label: 'Oficinas Totales', value: stats.total_offices || 0, icon: '🏢', color: '#3B82F6' },
            { label: 'Activas', value: stats.active_offices || 0, icon: '✅', color: '#22C55E' },
            { label: 'Total Ganado', value: fmt(stats.total_earned), icon: '💰', color: '#D97706' },
            { label: 'Por Cobrar', value: fmt(stats.pending), icon: '⏳', color: '#EF4444' },
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
          {['overview', 'offices', 'registrations', 'samples', 'resources'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); if (tab === 'resources') fetchResources(repId); }} style={{
              padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeTab === tab ? '#78350F' : '#fff', color: activeTab === tab ? '#fff' : '#475569',
              border: activeTab === tab ? 'none' : '1px solid #E2E8F0',
            }}>
              {tab === 'overview' ? '📊 Resumen' : tab === 'offices' ? '🏢 Mis Oficinas' : tab === 'samples' ? '📄 Muestras' : tab === 'resources' ? '📦 Recursos' : `📋 Registros (${pendingOffices.length})`}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>Cómo Funciona</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '14px 18px', borderLeft: '4px solid #D97706' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#92400E' }}>1. Tú Inscribes Oficinas</div>
                <div style={{ fontSize: 13, color: '#78350F', marginTop: 4 }}>Lleva oficinas socias (preparadores de impuestos, notarios, agentes de seguros) a Multi Servicios 360.</div>
              </div>
              <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '14px 18px', borderLeft: '4px solid #D97706' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#92400E' }}>2. Ellos Venden Documentos</div>
                <div style={{ fontSize: 13, color: '#78350F', marginTop: 4 }}>Cuando esas oficinas venden Poderes Notariales, Trusts o LLCs, tú ganas <strong>{commRate}%</strong> de cada venta.</div>
              </div>
              <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '14px 18px', borderLeft: '4px solid #D97706' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#92400E' }}>3. Ganas por {commMonths} {commMonths === 1 ? 'Mes' : 'Meses'}</div>
                <div style={{ fontSize: 13, color: '#78350F', marginTop: 4 }}>Tu comisión corre por <strong>{commMonths} {commMonths === 1 ? 'mes' : 'meses'}</strong> desde el día que cada oficina es asignada a ti.</div>
              </div>
              {setupShareEnabled && (
                <div style={{ background: '#DCFCE7', borderRadius: 10, padding: '14px 18px', borderLeft: '4px solid #16A34A' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#166534' }}>✅ Bonus: {setupSharePct}% del Setup Fee</div>
                  <div style={{ fontSize: 13, color: '#166534', marginTop: 4 }}>Por cada oficina que registres, también recibes <strong>{setupSharePct}%</strong> del pago de inscripción que ellos hacen al unirse.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* OFFICES TAB */}
        {activeTab === 'offices' && (
          <div>
            {assignments.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94A3B8', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                Aún no tienes oficinas asignadas. Contacta a tu administrador.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {assignments.map(a => (
                  <div key={a.id} style={{ background: '#fff', borderRadius: 10, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', borderLeft: `4px solid ${a.is_active ? '#22C55E' : '#94A3B8'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>🏢 {a.business_name}</div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                          {a.commission_rate}% por {a.duration_months} {a.duration_months === 1 ? 'mes' : 'meses'} • Inicio: {fmtDate(a.start_date)} • Fin: {fmtDate(a.end_date)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>{fmt(a.total_commission_earned)}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>ganado</div>
                        </div>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: a.is_active ? '#DCFCE7' : '#F1F5F9', color: a.is_active ? '#166534' : '#64748B' }}>
                          {a.is_active ? 'Activo' : 'Expirado'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REGISTRATIONS TAB */}
        {activeTab === 'registrations' && (
          <div>
            {pendingOffices.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94A3B8', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                Aún no hay registros. Haz clic en &quot;Registrar Nueva Oficina&quot; para comenzar.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingOffices.map(o => {
                  const statusColors = {
                    pending_payment: { bg: '#FEF3C7', color: '#92400E', label: '⏳ Pago Pendiente' },
                    paid_pending_approval: { bg: '#DBEAFE', color: '#1E40AF', label: '✅ Pagado — Esperando Aprobación' },
                    active: { bg: '#DCFCE7', color: '#166534', label: '🟢 Activo' },
                    rejected: { bg: '#FEE2E2', color: '#991B1B', label: '❌ Rechazado' },
                  };
                  const st = statusColors[o.status] || { bg: '#F1F5F9', color: '#64748B', label: o.status };
                  return (
                    <div key={o.id} style={{ background: '#fff', borderRadius: 10, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', borderLeft: `4px solid ${st.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>🏢 {o.business_name}</div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                            {o.email} • Paquete {o.package_name} • ${o.setup_fee_amount} • {fmtDate(o.created_at)}
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

        {/* SAMPLES TAB */}
        {activeTab === 'samples' && (
          <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Documentos de Muestra</h3>
            <p style={{ color: '#64748B', fontSize: 14, maxWidth: 420, margin: '0 auto 24px' }}>
              Muéstrale a tus prospectos cómo se ven los documentos terminados. Son vistas parciales — el documento completo se entrega después del pago.
            </p>
            <button onClick={() => router.push('/sales/samples')}
              style={{ background: 'linear-gradient(135deg,#1E3A8A,#2563EB)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              📄 Ver Documentos de Muestra →
            </button>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '18px 24px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>📦 Materiales y Manuales</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>Flyers, folletos, manuales de ventas y materiales para cerrar tratos</p>
              </div>
              <button onClick={() => fetchResources(repId)} style={{ padding: '8px 16px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>↻ Actualizar</button>
            </div>
            {resourcesLoading ? (
              <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', color: '#64748B' }}>Cargando recursos...</div>
            ) : resources.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', color: '#94A3B8' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontWeight: 600 }}>Aún no hay materiales</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Tu administrador subirá materiales aquí pronto</div>
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
                        {r.audience === 'sales' ? '💼 Vendedores' : '🌐 Todos'}
                      </span>
                      {r.download_url ? (
                        <a href={r.download_url} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#1E3A8A,#2563EB)', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>⬇ Descargar</a>
                      ) : <span style={{ fontSize: 12, color: '#94A3B8' }}>No disponible</span>}
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
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>🔑 Cambiar Contraseña</h2>
            <form onSubmit={handleChangePassword}>
              {[['Contraseña Actual', currentPw, setCurrentPw], ['Nueva Contraseña', newPw, setNewPw], ['Confirmar Nueva Contraseña', confirmPw, setConfirmPw]].map(([label, val, setter]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>{label}</label>
                  <input type="password" required value={val} onChange={e => setter(e.target.value)} minLength={label.includes('Nueva') ? 6 : undefined}
                    style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '2px solid #E2E8F0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                <button type="button" onClick={() => { setShowPwModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }}
                  style={{ flex: 1, padding: 12, background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={pwSaving}
                  style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg,#D97706,#F59E0B)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: pwSaving ? 0.6 : 1 }}>
                  {pwSaving ? 'Guardando...' : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
