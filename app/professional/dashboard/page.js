// app/professional/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const T = {
  es: {
    brand: 'Portal Profesional', password: '🔑 Contraseña', signout: 'Cerrar Sesión',
    totalCases: 'Total de Casos', pendingReview: 'Pendiente de Revisión', inReview: 'En Revisión', approved: 'Aprobado',
    filtert.filterAll: 'Todos', loading: 'Cargando casos...', noCases: 'Aún no hay casos asignados. Tu administrador asignará casos para revisión.',
    clientVault: 'Bóveda del Cliente:', viewDocs: 'Ver Documentos ↗',
    reviewNotes: 'Notas de Revisión', reviewPlaceholder: 'Agrega tus notas, comentarios o cambios requeridos...',
    startReview: '🔍 Iniciar Revisión', approveLbl: '✅ Aprobar', needsChanges: '⚠️ Necesita Cambios', markCompleted: '🏁 Marcar Completado', saveNotes: '💾 Guardar Notas',
    lastReviewed: 'Última revisión:', assigned: 'Asignado',
    pwTitle: '🔑 Cambiar Contraseña', pwCurrent: 'Contraseña Actual', pwNew: 'Nueva Contraseña', pwConfirm: 'Confirmar Nueva Contraseña',
    cancel: 'Cancelar', save: 'Actualizar', saving: 'Guardando...',
    pwMismatch: '❌ Las contraseñas no coinciden',
    t.statusLabels: { pending: 'Pendiente de Revisión', in_review: 'En Revisión', approved: 'Aprobado', needs_changes: 'Necesita Cambios', completed: 'Completado' },
    t.serviceLabels: { general_poa: 'Poder Notarial General', limited_poa: 'Poder Notarial Limitado', living_trust: 'Fideicomiso en Vida', llc_formation: 'Formación de LLC' },
    t.profLabels: { attorney: '⚖️ Abogado', notary: '📝 Notario', cpa: '📊 Contador', realtor: '🏠 Agente Inmobiliario', other: '👤 Profesional' },
    doc: 'doc', docs: 'docs',
  },
  en: {
    brand: 'Professional Portal', password: '🔑 Password', signout: 'Sign Out',
    totalCases: t.totalCases, pendingReview: t.pendingReview, inReview: t.inReview, approved: t.approved,
    filtert.filterAll: 't.filterAll', loading: {t.loading}, noCases: '{t.noCases}',
    clientVault: 'Client Vault:', viewDocs: 'View Documents ↗',
    reviewNotes: 'Review Notes', reviewPlaceholder: 'Add your review notes, comments, or required changes...',
    startReview: t.startReview, approveLbl: t.approveLbl, needsChanges: t.needsChanges, markCompleted: t.markCompleted, saveNotes: t.saveNotes,
    lastReviewed: 'Last reviewed:', assigned: t.assigned,
    pwTitle: '🔑 Change Password', pwCurrent: 'Current Password', pwNew: 'New Password', pwConfirm: 'Confirm New Password',
    cancel: 'Cancel', save: 'Update Password', saving: t.saving,
    pwMismatch: t.pwMismatch,
    t.statusLabels: { pending: t.pendingReview, in_review: t.inReview, approved: t.approved, needs_changes: 'Needs Changes', completed: 'Completed' },
    t.serviceLabels: { general_poa: 'General POA', limited_poa: 'Limited POA', living_trust: 'Living Trust', llc_formation: 'LLC Formation' },
    t.profLabels: { attorney: '⚖️ Attorney', notary: '📝 Notary', cpa: '📊 CPA', realtor: '🏠 Realtor', other: '👤 Professional' },
    doc: 'doc', docs: 'docs',
  }
};

export default function ProfessionalDashboard() {
  const router = useRouter();
  const [profId, setProfId] = useState('');
  const [profName, setProfName] = useState('');
  const [profType, setProfType] = useState('');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState('');
  const [lang, setLang] = useState('es');
  const t = T[lang];
  const [expandedCase, setExpandedCase] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Change password
  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('prof_lang') || 'es'; setLang(savedLang);
    const id = localStorage.getItem('profId');
    const name = localStorage.getItem('profName');
    const type = localStorage.getItem('profProfession');
    if (!id) { router.push('/professional/login'); return; }
    setProfId(id); setProfName(name || 'Professional'); setProfType(type || '');
    fetchCases(id);
  }, []);

  async function fetchCases(id) {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}` : '';
      const res = await fetch(`/api/professional/cases${params}`, { headers: { 'x-professional-id': id || profId } });
      const data = await res.json();
      if (data.cases) setCases(data.cases);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  async function updateCaseStatus(assignmentId, newStatus, notes) {
    try {
      const body = { id: assignmentId, status: newStatus };
      if (notes !== undefined) body.notes = notes;
      const res = await fetch('/api/professional/cases', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-professional-id': profId },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Case updated to "${newStatus}"`);
        fetchCases(profId);
      } else { setMessage('❌ ' + (data.error || 'Failed to update')); }
    } catch (err) { setMessage('❌ Error: ' + err.message); }
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPw !== confirmPw) { setMessage(t.pwMismatch); return; }
    setPwSaving(true);
    try {
      const res = await fetch('/api/professional/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professional_id: profId, current_password: currentPw, new_password: newPw }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Password updated successfully');
        setShowPwModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw('');
      } else { setMessage('❌ ' + (data.error || 'Failed')); }
    } catch (err) { setMessage('❌ ' + err.message); }
    setPwSaving(false);
    setTimeout(() => setMessage(''), 3000);
  }

  function toggleLang() { const nl = lang==='es'?'en':'es'; setLang(nl); localStorage.setItem('prof_lang', nl); }

  function logout() {
    localStorage.removeItem('profId'); localStorage.removeItem('profName'); localStorage.removeItem('profProfession');
    router.push('/professional/login');
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString(lang==='es'?'es-MX':'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const t.serviceLabels = { general_poa: 'General POA', limited_poa: 'Limited POA', living_trust: 'Living Trust', llc_formation: 'LLC Formation' };
  const t.statusLabels = { pending: t.pendingReview, in_review: t.inReview, approved: t.approved, needs_changes: 'Needs Changes', completed: 'Completed' };
  const statusColors = {
    pending: { bg: '#FEF3C7', color: '#92400E' }, in_review: { bg: '#EFF6FF', color: '#1E3A8A' },
    approved: { bg: '#DCFCE7', color: '#166534' }, needs_changes: { bg: '#FEE2E2', color: '#991B1B' },
    completed: { bg: '#F0FDF4', color: '#059669' },
  };
  const t.profLabels = { attorney: '⚖️ Attorney', notary: '📝 Notary', cpa: '📊 CPA', realtor: '🏠 Realtor', other: '👤 Professional' };

  const stats = {
    total: cases.length,
    pending: cases.filter(c => c.status === 'pending').length,
    inReview: cases.filter(c => c.status === 'in_review').length,
    approved: cases.filter(c => c.status === 'approved' || c.status === 'completed').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9' }}>
      {/* Top bar */}
      <div style={{ background: '#fff', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#7C3AED,#A78BFA)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚖️</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Professional Portal</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>{profName} • {t.profLabels[profType] || profType}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toggleLang} style={{ padding: '6px 12px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>{lang==='es'?'🇺🇸 English':'🇲🇽 Español'}</button>
          <button onClick={() => setShowPwModal(true)} style={{ padding: '8px 14px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{t.password}</button>
          <button onClick={logout} style={{ padding: '8px 14px', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{t.signout}</button>
        </div>
      </div>

      {/* Toast */}
      {message && (
        <div style={{ position: 'fixed', top: 70, right: 20, zIndex: 50, background: message.startsWith('✅') ? '#DCFCE7' : '#FEE2E2',
          border: `1px solid ${message.startsWith('✅') ? '#22C55E' : '#EF4444'}`, borderRadius: 10, padding: '12px 18px', fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {message}
        </div>
      )}

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: t.totalCases, value: stats.total, icon: '📋', color: '#3B82F6' },
            { label: t.pendingReview, value: stats.pending, icon: '⏳', color: '#D97706' },
            { label: t.inReview, value: stats.inReview, icon: '🔍', color: '#7C3AED' },
            { label: t.approved, value: stats.approved, icon: '✅', color: '#059669' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {['', 'pending', 'in_review', 'approved', 'needs_changes', 'completed'].map(f => (
            <button key={f} onClick={() => { setFilter(f); setTimeout(() => fetchCases(profId), 100); }} style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: filter === f ? '#7C3AED' : '#fff', color: filter === f ? '#fff' : '#475569',
              border: filter === f ? 'none' : '1px solid #E2E8F0',
            }}>{f === '' ? 't.filterAll' : t.statusLabels[f] || f}</button>
          ))}
        </div>

        {/* Cases */}
        {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>Loading cases...</div> : (
          cases.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94A3B8', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              {t.noCases}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cases.map(c => {
                const sc = statusColors[c.status] || statusColors.pending;
                const isExpanded = expandedCase === c.id;
                return (
                  <div key={c.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden', borderLeft: `4px solid ${sc.color}` }}>
                    {/* Case header */}
                    <div onClick={() => { setExpandedCase(isExpanded ? null : c.id); setReviewNotes(c.notes || ''); }}
                      style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A', marginBottom: 4 }}>{c.client_name || 'Unknown Client'}</div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>
                          {c.client_email || ''} • {t.serviceLabels[c.matter_type] || c.matter_type} • Assigned {fmt(c.assigned_at)}
                        </div>
                        {c.service_label && c.service_label !== c.matter_type && (
                          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{c.service_label}</div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {c.document_count > 0 && (
                          <span style={{ background: '#EFF6FF', color: '#1E3A8A', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                            📄 {c.document_count} {c.document_count > 1 ? t.docs : t.doc}
                          </span>
                        )}
                        <span style={{ background: sc.bg, color: sc.color, padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                          {t.statusLabels[c.status]}
                        </span>
                        <span style={{ fontSize: 14, color: '#94A3B8' }}>{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {/* Expanded review panel */}
                    {isExpanded && (
                      <div style={{ padding: '0 20px 20px', borderTop: '1px solid #F1F5F9' }}>
                        <div style={{ paddingTop: 16 }}>
                          {/* Vault link */}
                          {c.vault_token && (
                            <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '12px 16px', marginBottom: 12 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Client Vault:</span>
                              <a href={`/vault?code=${c.vault_token}`} target="_blank" style={{ marginLeft: 8, fontSize: 13, color: '#1E3A8A', textDecoration: 'underline' }}>
                                View Documents ↗
                              </a>
                            </div>
                          )}

                          {/* Review notes */}
                          <div style={{ marginBottom: 14 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Review Notes</label>
                            <textarea
                              value={reviewNotes}
                              onChange={e => setReviewNotes(e.target.value)}
                              rows={3}
                              placeholder={t.reviewPlaceholder}
                              style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '2px solid #E2E8F0', borderRadius: 8, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                            />
                          </div>

                          {/* Action buttons */}
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {c.status === 'pending' && (
                              <button onClick={() => updateCaseStatus(c.id, 'in_review', reviewNotes)}
                                style={actionBtn('#EFF6FF', '#1E3A8A', '#BFDBFE')}>🔍 Start Review</button>
                            )}
                            {(c.status === 'pending' || c.status === 'in_review' || c.status === 'needs_changes') && (
                              <>
                                <button onClick={() => updateCaseStatus(c.id, 'approved', reviewNotes)}
                                  style={actionBtn('#DCFCE7', '#166534', '#BBF7D0')}>✅ Approve</button>
                                <button onClick={() => updateCaseStatus(c.id, 'needs_changes', reviewNotes)}
                                  style={actionBtn('#FEE2E2', '#991B1B', '#FECACA')}>⚠️ Needs Changes</button>
                              </>
                            )}
                            {c.status === 'approved' && (
                              <button onClick={() => updateCaseStatus(c.id, 'completed', reviewNotes)}
                                style={actionBtn('#F0FDF4', '#059669', '#BBF7D0')}>🏁 Mark Completed</button>
                            )}
                            {reviewNotes !== (c.notes || '') && (
                              <button onClick={() => updateCaseStatus(c.id, c.status, reviewNotes)}
                                style={actionBtn('#F8FAFC', '#475569', '#E2E8F0')}>💾 Save Notes</button>
                            )}
                          </div>

                          {/* Review history */}
                          {c.reviewed_at && (
                            <div style={{ marginTop: 12, fontSize: 12, color: '#94A3B8' }}>
                              Last reviewed: {fmt(c.reviewed_at)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Change Password Modal */}
      {showPwModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 400, width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>🔑 Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Current Password</label>
                <input type="password" required value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '2px solid #E2E8F0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>New Password</label>
                <input type="password" required minLength={6} value={newPw} onChange={e => setNewPw(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '2px solid #E2E8F0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Confirm New Password</label>
                <input type="password" required minLength={6} value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '2px solid #E2E8F0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => { setShowPwModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }}
                  style={{ flex: 1, padding: '12px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={pwSaving}
                  style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#7C3AED,#A78BFA)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: pwSaving ? 0.6 : 1 }}>
                  {pwSaving ? t.saving : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const actionBtn = (bg, color, border) => ({
  padding: '8px 16px', background: bg, color, border: `1px solid ${border}`,
  borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
});
