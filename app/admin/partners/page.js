'use client';
import { useState, useEffect } from 'react';

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [approveModal, setApproveModal] = useState(null); // partner to approve
  const [approving, setApproving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    business_name: '',
    contact_name: '',
    phone: '',
    partner_type: 'tax_preparer',
    tier: 'start',
    commission_rate: 20,
    package_name: 'basic',
    setup_fee_amount: 499,
    annual_fee_amount: 499,
    annual_fee_waived: false,
    annual_fee_waived_reason: '',
    status: 'active'
  });

  const defaultForm = {
    email: '',
    password: '',
    business_name: '',
    contact_name: '',
    phone: '',
    partner_type: 'tax_preparer',
    tier: 'start',
    commission_rate: 20,
    package_name: 'basic',
    setup_fee_amount: 499,
    annual_fee_amount: 499,
    annual_fee_waived: false,
    annual_fee_waived_reason: '',
    status: 'active'
  };

  useEffect(() => {
    const saved = localStorage.getItem('adminPassword');
    if (saved === 'MS360Admin2026!') {
      setIsLoggedIn(true);
      fetchPartners();
    }
  }, []);

  async function fetchPartners() {
    try {
      const res = await fetch('/api/admin/partners', {
        headers: { 'x-admin-password': localStorage.getItem('adminPassword') || '' }
      });
      const data = await res.json();
      if (data.partners) setPartners(data.partners);
    } catch (err) {
      console.error('Error fetching partners:', err);
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingPartner(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEditModal(partner) {
    setEditingPartner(partner);
    setForm({
      email: partner.email || '',
      password: '', // leave blank = no change
      business_name: partner.business_name || '',
      contact_name: partner.contact_name || '',
      phone: partner.phone || '',
      partner_type: partner.partner_type || 'tax_preparer',
      tier: partner.tier || 'start',
      commission_rate: partner.commission_rate || 20,
      package_name: partner.package_name || 'basic',
      setup_fee_amount: partner.setup_fee_amount || 499,
      annual_fee_amount: partner.annual_fee_amount || 499,
      annual_fee_waived: partner.annual_fee_waived || false,
      annual_fee_waived_reason: partner.annual_fee_waived_reason || '',
      status: partner.status || 'active'
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPartner) {
        // UPDATE existing partner
        const updateData = { ...form };
        if (!updateData.password) delete updateData.password; // don't send empty password
        const res = await fetch('/api/admin/partners', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': localStorage.getItem('adminPassword') || ''
          },
          body: JSON.stringify({ id: editingPartner.id, ...updateData })
        });
        const data = await res.json();
        if (data.error) {
          alert('Error: ' + data.error);
          return;
        }
      } else {
        // CREATE new partner
        if (!form.password) {
          alert('La contrasena es obligatoria para socios nuevos');
          return;
        }
        const res = await fetch('/api/admin/partners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': localStorage.getItem('adminPassword') || ''
          },
          body: JSON.stringify(form)
        });
        const data = await res.json();
        if (data.error) {
          alert('Error: ' + data.error);
          return;
        }
      }
      setShowModal(false);
      setEditingPartner(null);
      setForm(defaultForm);
      fetchPartners();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': localStorage.getItem('adminPassword') || ''
        },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (!data.error) fetchPartners();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }

  async function deletePartner(id, name) {
    if (!confirm(`⚠️ ¿Eliminar permanentemente "${name}"?\n\nEsta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': localStorage.getItem('adminPassword') || '' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) fetchPartners();
      else alert('Error: ' + (data.error || 'No se pudo eliminar'));
    } catch (err) { alert('Error: ' + err.message); }
  }

  const filtered = filter === 'all' ? partners : partners.filter(p => p.status === filter);

  const stats = {
    total: partners.length,
    active: partners.filter(p => p.status === 'active').length,
    pending_approval: partners.filter(p => p.status === 'paid_pending_approval').length,
    pending: partners.filter(p => p.status === 'pending' || p.status === 'pending_payment').length,
    suspended: partners.filter(p => p.status === 'suspended').length,
  };

  const tierLabels = {
    start: 'Partner Start',
    pro: 'Partner Pro',
    elite: 'Partner Elite',
    referral: 'Referral',
    wholesale: 'Wholesale',
    white_label: 'White Label'
  };

  const tierColors = {
    start: 'bg-blue-500/20 text-blue-400',
    pro: 'bg-purple-500/20 text-purple-400',
    elite: 'bg-yellow-500/20 text-yellow-400',
    referral: 'bg-blue-500/20 text-blue-400',
    wholesale: 'bg-orange-500/20 text-orange-400',
    white_label: 'bg-cyan-500/20 text-cyan-400'
  };

  const typeLabels = {
    tax_preparer: 'Tax Preparer',
    attorney: 'Attorney',
    notary: 'Notary',
    insurance: 'Insurance',
    real_estate: 'Real Estate',
    immigration: 'Immigration',
    community: 'Community Center',
    other: 'Other'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Cargando socios...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-sm border border-slate-700">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">MS</span>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h1>
          {loginError && <p className="text-red-400 text-sm text-center mb-4">{loginError}</p>}
          <input
            type="password"
            placeholder="Admin password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { if (loginPassword === 'MS360Admin2026!') { localStorage.setItem('adminPassword', loginPassword); setIsLoggedIn(true); fetchPartners(); } else { setLoginError('Invalid password'); } } }}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => { if (loginPassword === 'MS360Admin2026!') { localStorage.setItem('adminPassword', loginPassword); setIsLoggedIn(true); fetchPartners(); } else { setLoginError('Invalid password'); } }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center font-bold text-lg">MS</div>
              <div>
                <h1 className="text-2xl font-bold">Multi Servicios 360</h1>
                <p className="text-slate-400 text-sm">Administracion de Socios</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="/admin" className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors text-sm">&larr; Back to Admin</a>
            <a href="/portal/login" target="_blank" className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors text-sm">Partner Portal &rarr;</a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Socios', value: stats.total, color: 'from-blue-500 to-cyan-500', icon: '👥' },
            { label: 'Activos', value: stats.active, color: 'from-emerald-500 to-green-500', icon: '✅' },
            { label: 'Pendientes', value: stats.pending, color: 'from-amber-500 to-yellow-500', icon: '⏳' },
            { label: 'Suspendidos', value: stats.suspended, color: 'from-red-500 to-rose-500', icon: '🚫' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">{stat.label}</span>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Package Info Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-sm">S</span>
              <span className="font-bold text-blue-400">Partner Start</span>
            </div>
            <p className="text-slate-400 text-sm">$499 — Comision 20%. Oficina pequena, primer acercamiento.</p>
          </div>
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 font-bold text-sm">P</span>
              <span className="font-bold text-purple-400">Partner Pro</span>
            </div>
            <p className="text-slate-400 text-sm">$999 — Comision 20-25%. Oficinas con 100+ clientes.</p>
          </div>
          <div className="bg-slate-900 border border-yellow-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400 font-bold text-sm">E</span>
              <span className="font-bold text-yellow-400">Partner Elite</span>
            </div>
            <p className="text-slate-400 text-sm">$2,500-$3,500 — Comision 20-25%. Multi-ubicacion, white-label.</p>
          </div>
        </div>

        {/* Filter + Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {['all', 'paid_pending_approval', 'active', 'pending', 'suspended'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                {f === 'all' ? 'Todos' : f === 'paid_pending_approval' ? `🔔 Por Aprobar (${stats.pending_approval})` : f === 'active' ? 'Activos' : f === 'pending' ? 'Pendientes' : 'Suspendidos'}
              </button>
            ))}
          </div>
          <button onClick={openAddModal} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all">
            + Agregar Socio
          </button>
        </div>

        {/* Partners Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">NEGOCIO</th>
                <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">CONTACTO</th>
                <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">TIPO</th>
                <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">PAQUETE</th>
                <th className="text-center px-6 py-4 text-slate-400 text-sm font-medium">COMISION</th>
                <th className="text-center px-6 py-4 text-slate-400 text-sm font-medium">STATUS</th>
                <th className="text-center px-6 py-4 text-slate-400 text-sm font-medium">MEMBRESIA</th>
                <th className="text-center px-6 py-4 text-slate-400 text-sm font-medium">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-500">No hay socios en esta categoria</td></tr>
              ) : (
                filtered.map((partner) => (
                  <tr key={partner.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          partner.tier === 'elite' ? 'bg-yellow-500/20 text-yellow-400' :
                          partner.tier === 'pro' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {(partner.business_name || 'N')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{partner.business_name}</div>
                          <div className="text-slate-500 text-sm">{partner.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{partner.contact_name || '—'}</div>
                      <div className="text-slate-500 text-sm">{partner.phone || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">{typeLabels[partner.partner_type] || partner.partner_type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${tierColors[partner.tier] || 'bg-slate-700 text-slate-300'}`}>
                        {tierLabels[partner.tier] || partner.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-emerald-400">{partner.commission_rate}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        partner.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        partner.status === 'paid_pending_approval' ? 'bg-blue-500/20 text-blue-400' :
                        partner.status === 'pending' || partner.status === 'pending_payment' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {partner.status === 'active' ? 'Activo' : partner.status === 'paid_pending_approval' ? '💳 Pagado - Por Aprobar' : partner.status === 'pending' || partner.status === 'pending_payment' ? 'Pendiente' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {partner.setup_fee_paid ? (
                        <div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">💳 Paid</span>
                          {partner.annual_fee_waived && <span className="ml-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">⭐ Waived</span>}
                        </div>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">⏳ Unpaid</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(partner)}
                          className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-colors"
                          title="Editar">
                          ✏️ Editar
                        </button>
                        {partner.status === 'pending' && (
                          <button onClick={() => updateStatus(partner.id, 'active')}
                            className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-colors">
                            Aprobar
                          </button>
                        )}
                        {partner.status === 'paid_pending_approval' && (
                          <>
                            <button onClick={() => setApproveModal(partner)}
                              className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-colors">
                              ✅ Aprobar
                            </button>
                            <button onClick={() => { if(confirm('¿Rechazar esta oficina?')) updateStatus(partner.id, 'rejected'); }}
                              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors">
                              ❌ Rechazar
                            </button>
                          </>
                        )}
                        {partner.status === 'active' && (
                          <button onClick={() => updateStatus(partner.id, 'suspended')}
                            className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors">
                            Suspender
                          </button>
                        )}
                        {partner.status === 'suspended' && (
                          <button onClick={() => updateStatus(partner.id, 'active')}
                            className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-colors">
                            Reactivar
                          </button>
                        )}
                        {partner.email !== 'demo@multiservicios360.net' && (
                          <button onClick={() => deletePartner(partner.id, partner.business_name)}
                            className="px-3 py-1.5 bg-red-900/30 text-red-400 rounded-lg text-xs font-medium hover:bg-red-900/50 transition-colors"
                            title="Eliminar permanentemente">
                            🗑
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-600 text-sm">
          <p>&copy; 2026 Multi Servicios 360. All rights reserved.</p>
          <p>Need help? Call (855) 246-7274</p>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {/* APPROVE PARTNER MODAL */}
      {approveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">✅ Confirmar Aprobación</h2>
              <p className="text-emerald-100 text-sm mt-1">Se enviará acceso al portal al socio</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-700/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Negocio:</span><span className="text-white font-semibold">{approveModal.business_name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Contacto:</span><span className="text-white">{approveModal.contact_name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Email:</span><span className="text-white">{approveModal.email}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Plan:</span><span className="text-emerald-400 font-bold">{approveModal.tier?.toUpperCase()} — {approveModal.commission_rate}% comisión</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Pagó:</span><span className="text-emerald-400 font-bold">${approveModal.setup_fee_amount}</span></div>
              </div>

              {approveModal.temp_password && (
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-blue-300 text-xs font-semibold mb-1">🔑 CONTRASEÑA TEMPORAL (se enviará al socio):</p>
                  <p className="text-white font-mono text-lg font-bold">{approveModal.temp_password}</p>
                  <p className="text-slate-400 text-xs mt-1">El socio puede cambiarla desde su portal.</p>
                </div>
              )}

              <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-3">
                <p className="text-amber-300 text-xs">Al aprobar se enviará email de bienvenida con credenciales de acceso al portal.</p>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={async () => {
                  setApproving(true);
                  await updateStatus(approveModal.id, 'active');
                  setApproveModal(null);
                  setApproving(false);
                }}
                disabled={approving}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
              >
                {approving ? 'Aprobando...' : '✅ Aprobar y Enviar Credenciales'}
              </button>
              <button onClick={() => setApproveModal(null)} className="px-4 py-3 bg-slate-700 text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-600">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-1">
              {editingPartner ? '✏️ Editar Socio' : '➕ Agregar Nuevo Socio'}
            </h2>
            <p className="text-slate-400 text-sm mb-5">
              {editingPartner ? `Editando: ${editingPartner.business_name}` : 'Complete la informacion del nuevo socio'}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nombre del Negocio *</label>
                <input type="text" required value={form.business_name} onChange={e => setForm({...form, business_name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  placeholder="Ej: Lopez Tax Services" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Nombre de Contacto *</label>
                  <input type="text" required value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    placeholder="Maria Lopez" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Telefono</label>
                  <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    placeholder="555-123-4567" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email *</label>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  placeholder="oficina@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  {editingPartner ? 'Nueva Contrasena (dejar vacio para no cambiar)' : 'Contrasena *'}
                </label>
                <input type="text" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  required={!editingPartner}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  placeholder={editingPartner ? 'Dejar vacio para mantener la actual' : 'Contrasena del socio'} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Tipo de Oficina</label>
                  <select value={form.partner_type} onChange={e => setForm({...form, partner_type: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                    <option value="tax_preparer">Preparador de Impuestos</option>
                    <option value="insurance">Agente de Seguros</option>
                    <option value="notary">Notario</option>
                    <option value="immigration">Oficina de Inmigracion</option>
                    <option value="real_estate">Bienes Raices</option>
                    <option value="community">Centro Comunitario</option>
                    <option value="attorney">Abogado</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Paquete</label>
                  <select value={form.tier} onChange={e => {
                    const tier = e.target.value;
                    const rate = tier === 'elite' ? 25 : tier === 'pro' ? 22 : 20;
                    setForm({...form, tier, commission_rate: rate});
                  }}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                    <option value="start">Partner Start ($499)</option>
                    <option value="pro">Partner Pro ($999)</option>
                    <option value="elite">Partner Elite ($2,500)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Comision %</label>
                  <input type="number" min="0" max="100" value={form.commission_rate} onChange={e => setForm({...form, commission_rate: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
                    <option value="active">Activo</option>
                    <option value="pending">Pendiente</option>
                    <option value="suspended">Suspendido</option>
                  </select>
                </div>
              </div>
              {/* Package & Fees */}
              <div className="bg-slate-800/50 border border-emerald-500/30 rounded-xl p-4 mt-2">
                <p className="text-sm font-medium text-emerald-400 mb-3">💳 Membership Package</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Package</label>
                    <select value={form.package_name} onChange={e => {
                      const pkg = e.target.value;
                      const fees = { basic: 499, pro: 699, elite: 899, custom: form.setup_fee_amount };
                      setForm({...form, package_name: pkg, setup_fee_amount: fees[pkg] || 499, annual_fee_amount: fees[pkg] || 499 });
                    }}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors">
                      <option value="basic">Basic — $499</option>
                      <option value="pro">Pro — $699</option>
                      <option value="elite">Elite — $899</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Setup Fee $</label>
                    <input type="number" min="0" step="1" value={form.setup_fee_amount} onChange={e => setForm({...form, setup_fee_amount: Number(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Annual Renewal $</label>
                    <input type="number" min="0" step="1" value={form.annual_fee_amount} onChange={e => setForm({...form, annual_fee_amount: Number(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Partner will receive a payment link in their welcome email and can pay from their portal.</p>
                {/* Waive Annual Renewal */}
                <div className="mt-3 p-3 rounded-lg" style={{ background: form.annual_fee_waived ? 'rgba(234,179,8,0.1)' : 'transparent', border: form.annual_fee_waived ? '1px solid rgba(234,179,8,0.3)' : '1px solid transparent' }}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.annual_fee_waived} onChange={e => setForm({...form, annual_fee_waived: e.target.checked})}
                      className="w-4 h-4 accent-yellow-500" />
                    <span className="text-sm font-medium text-yellow-400">⭐ Waive Annual Renewal Fee</span>
                  </label>
                  {form.annual_fee_waived && (
                    <div className="mt-2">
                      <input value={form.annual_fee_waived_reason} onChange={e => setForm({...form, annual_fee_waived_reason: e.target.value})}
                        placeholder="Reason (e.g. High volume office, VIP partner...)"
                        className="w-full px-3 py-2 bg-slate-800 border border-yellow-500/30 rounded-lg text-white text-sm focus:border-yellow-500 outline-none" />
                      <p className="text-xs text-yellow-500/70 mt-1">This office will not see a renewal payment option. You can turn this off anytime.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingPartner(null); }}
                  className="flex-1 px-4 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50">
                  {saving ? 'Guardando...' : editingPartner ? 'Guardar Cambios' : 'Agregar Socio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}