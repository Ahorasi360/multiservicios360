// app/staff/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const T = {
  es: {
    brand: 'Portal de Personal', welcome: 'Bienvenido,', password: '🔑 Contraseña', signout: 'Cerrar Sesión',
    tabMatters: '📋 Órdenes', tabVaults: '🔐 Bóvedas',
    search: 'Buscar por nombre o email...', allServices: 'Todos los Servicios', allStatuses: 'Todos los Estados',
    search_btn: '🔍 Buscar', loading: 'Cargando...', noMatters: 'No hay órdenes.',
    uploadBtn: '⬆️ Subir Documento', resendEmail: '📧 Reenviar', viewVault: '🔗 Ver Bóveda',
    uploadTitle: '⬆️ Subir Documento al Vault', clientName: 'Nombre del Cliente', clientEmail: 'Email del Cliente',
    docType: 'Tipo de Documento', matterId: 'ID de la Orden (opcional)', selectFile: 'Seleccionar archivo', uploading: 'Subiendo...', uploadBtnLbl: 'Subir Documento',
    cancel: 'Cancelar', save: 'Actualizar', saving: 'Guardando...',
    pwTitle: '🔑 Cambiar Contraseña', pwCurrent: 'Contraseña Actual', pwNew: 'Nueva Contraseña', pwConfirm: 'Confirmar Nueva Contraseña',
    pwMismatch: '❌ Las contraseñas no coinciden',
    status: { draft:'Borrador', paid:'Pagado', pending_payment:'Pago Pendiente', processing:'Procesando', completed:'Completado', cancelled:'Cancelado', pending:'Pendiente' },
    services: { general_poa:'Poder Notarial General', limited_poa:'Poder Notarial Limitado', living_trust:'Fideicomiso', llc_formation:'Formación LLC', bill_of_sale:'Carta de Venta', affidavit:'Declaración Jurada', travel_authorization:'Carta de Viaje', guardianship:'Guardianship' },
    assigned: 'Asignado', client: 'Cliente', service: 'Servicio', noVaults: 'Sin bóvedas.',
    emailSent: '✅ Email enviado', emailFail: '❌ Error al enviar',
  },
  en: {
    brand: 'Staff Portal', welcome: 'Welcome,', password: '🔑 Password', signout: 'Sign Out',
    tabMatters: t.tabMatters, tabVaults: t.tabVaults,
    search: t.search, allServices: t.allServices, allStatuses: t.allStatuses,
    search_btn: '🔍 Search', loading: t.loading, noMatters: t.noMatters,
    uploadBtn: '⬆️ Upload Document', resendEmail: '📧 Resend', viewVault: '🔗 View Vault',
    uploadTitle: '⬆️ Upload Document to Vault', clientName: 'Client Name', clientEmail: 'Client Email',
    docType: 'Document Type', matterId: 'Matter ID (optional)', selectFile: 'Select file', uploading: 'Uploading...', uploadBtnLbl: 'Upload Document',
    cancel: 'Cancel', save: 'Update', saving: t.saving,
    pwTitle: '🔑 Change Password', pwCurrent: 'Current Password', pwNew: 'New Password', pwConfirm: 'Confirm New Password',
    pwMismatch: t.pwMismatch,
    status: { draft:'Draft', paid:'Paid', pending_payment:'Pending Payment', processing:'Processing', completed:'Completed', cancelled:'Cancelled', pending:'Pending' },
    services: { general_poa:'General POA', limited_poa:'Limited POA', living_trust:'Living Trust', llc_formation:'LLC Formation', bill_of_sale:'Bill of Sale', affidavit:'Affidavit', travel_authorization:'Travel Authorization', guardianship:'Guardianship' },
    assigned: 'Assigned', client: 'Client', service: 'Service', noVaults: 'No vaults.',
    emailSent: t.emailSent, emailFail: t.emailFail,
  }
};

export default function StaffDashboard() {
  const router = useRouter();
  const [lang, setLang] = useState('es');
  const t = T[lang];
  const [staffName, setStaffName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [activeTab, setActiveTab] = useState('matters');
  const [matters, setMatters] = useState([]);
  const [editMatter, setEditMatter] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [message, setMessage] = useState('');

  // Upload modal state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadClientName, setUploadClientName] = useState('');
  const [uploadClientEmail, setUploadClientEmail] = useState('');
  const [uploadDocType, setUploadDocType] = useState('articles_of_org');
  const [uploadMatterId, setUploadMatterId] = useState('');
  const [uploading, setUploading] = useState(false);

  // Change password
  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('staff_lang') || 'es'; setLang(savedLang);
    const id = localStorage.getItem('staffId');
    const name = localStorage.getItem('staffName');
    if (!id) { router.push('/staff/login'); return; }
    setStaffId(id); setStaffName(name || 'Staff');
    fetchMatters(id);
    fetchVaults(id);
  }, []);

  async function fetchMatters(id) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (serviceFilter) params.set('service', serviceFilter);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/staff/matters?${params}`, { headers: { 'x-staff-id': id || staffId } });
      const data = await res.json();
      if (data.matters) setMatters(data.matters);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  async function fetchVaults(id) {
    try {
      const res = await fetch('/api/staff/vaults', { headers: { 'x-staff-id': id || staffId } });
      const data = await res.json();
      if (data.vaults) setVaults(data.vaults);
    } catch (err) { console.error(err); }
  }

  async function resendEmail(tokenId) {
    try {
      const res = await fetch('/api/staff/vaults', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'x-staff-id': staffId },
        body: JSON.stringify({ action: 'resend_email', token_id: tokenId }),
      });
      const data = await res.json();
      if (data.success) { setMessage(t.emailSent); setTimeout(()=>setMessage(''), 3000); }
      else { setMessage(t.emailFail); setTimeout(()=>setMessage(''), 3000); }
    } catch { setMessage(t.emailFail); setTimeout(()=>setMessage(''), 3000); }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!uploadFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('document_type', uploadDocType);
    formData.append('language', 'en');
    if (uploadMatterId) formData.append('matter_id', uploadMatterId);
    if (uploadClientName) formData.append('client_name', uploadClientName);
    if (uploadClientEmail) formData.append('client_email', uploadClientEmail);
    try {
      const res = await fetch('/api/vault/upload', {
        method: 'POST',
        headers: { Authorization: 'Bearer ms360-admin-key-2026' },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Uploaded! Vault link created.`);
        setShowUpload(false); setUploadFile(null); setUploadClientName(''); setUploadClientEmail(''); setUploadMatterId('');
        fetchVaults(staffId);
      } else { setMessage('❌ Upload failed: ' + (data.error || 'Unknown error')); }
    } catch (err) { setMessage('❌ Upload error: ' + err.message); }
    setUploading(false);
    setTimeout(()=>setMessage(''), 4000);
  }

  function handleSearch() { fetchMatters(staffId); }
  function copyLink(token) { navigator.clipboard.writeText(`https://multiservicios360.net/vault?code=${token}`); setMessage('📋 Link copied!'); setTimeout(()=>setMessage(''), 2000); }
  function logout() { localStorage.removeItem('staffId'); localStorage.removeItem('staffName'); localStorage.removeItem('staffRole'); router.push('/staff/login'); }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPw !== confirmPw) { setMessage(t.pwMismatch); return; }
    if (newPw.length < 6) { setMessage('❌ Password must be at least 6 characters'); return; }
    setPwSaving(true);
    try {
      const res = await fetch('/api/staff/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_id: staffId, current_password: currentPw, new_password: newPw }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Password updated successfully');
        setShowPwModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw('');
      } else { setMessage('❌ ' + (data.error || 'Failed to update')); }
    } catch (err) { setMessage('❌ Error: ' + err.message); }
    setPwSaving(false);
    setTimeout(() => setMessage(''), 4000);
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString(lang==='es'?'es-MX':'en-US', { month:'short', day:'numeric', year:'numeric' }) : '—';
  const serviceLabels = { general_poa:'General POA', limited_poa:'Limited POA', living_trust:'Living Trust', llc_formation:'LLC', simple_doc:'Simple Doc' };
  const serviceColors = { general_poa:'#2563EB', limited_poa:'#7C3AED', living_trust:'#059669', llc_formation:'#D97706', simple_doc:'#0891B2' };
  const serviceSuccessUrls = { general_poa:'/poa/success', limited_poa:'/limited-poa/success', living_trust:'/trust/success', llc_formation:'/llc/success', simple_doc:'/simple-doc/success' };
  function regenerateDoc(matter) {
    const base = serviceSuccessUrls[matter.service_type];
    if (!base) return alert('Regenerate not supported for this document type.');
    let url = `${base}?matter_id=${matter.id}&regenerate=1`;
    if (matter.service_type === 'simple_doc' && matter.document_type) {
      url += `&doc_type=${matter.document_type}`;
    }
    window.open(url, '_blank');
  }

  function openEdit(matter) {
    setEditMatter({
      ...matter,
      _client_name: matter.client_name || '',
      _client_email: matter.client_email || '',
      _client_phone: matter.client_phone || '',
      _intake_json: JSON.stringify(matter.intake_data || {}, null, 2),
      _staff_note: matter.staff_note || '',
    });
  }

  async function handleEditSave() {
    if (!editMatter) return;
    setEditSaving(true);
    try {
      let intake_data = editMatter.intake_data;
      try { intake_data = JSON.parse(editMatter._intake_json); } catch { return alert('Invalid JSON in intake data'); }
      const res = await fetch('/api/staff/matters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-staff-id': staffId },
        body: JSON.stringify({
          matter_id: editMatter.id,
          service_type: editMatter.service_type,
          client_name: editMatter._client_name,
          client_email: editMatter._client_email,
          client_phone: editMatter._client_phone,
          intake_data,
          staff_note: editMatter._staff_note,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Matter updated. Regenerate the document to apply changes.');
        setEditMatter(null);
        fetchMatters(staffId);
      } else { alert('Error: ' + data.error); }
    } catch (err) { alert('Error: ' + err.message); }
    setEditSaving(false);
  }
  const statusColors = { paid:'#059669', completed:'#059669', draft:'#94A3B8', pending_payment:'#D97706' };

  return (
    <div style={{ minHeight:'100vh', background:'#F1F5F9' }}>
      {/* Top bar */}
      <div style={{ background:'#fff', padding:'14px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #E2E8F0', position:'sticky', top:0, zIndex:30 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, background:'linear-gradient(135deg,#059669,#10B981)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>👷</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:'#0F172A' }}>{t.brand}</div>
            <div style={{ fontSize:11, color:'#64748B' }}>Welcome, {staffName}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => setShowPwModal(true)} style={{ padding:'8px 14px', background:'#F1F5F9', color:'#475569', borderRadius:8, fontSize:13, fontWeight:500, border:'1px solid #E2E8F0', cursor:'pointer' }}>🔑 Password</button>
          <a href="/" target="_blank" style={{ padding:'8px 14px', background:'#F1F5F9', color:'#475569', borderRadius:8, fontSize:13, fontWeight:500, textDecoration:'none', border:'1px solid #E2E8F0' }}>View Site ↗</a>
          <button onClick={logout} style={{ padding:'8px 14px', background:'#FEF2F2', color:'#991B1B', border:'1px solid #FECACA', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer' }}>{t.signout}</button>
        </div>
      </div>

      {/* Message toast */}
      {message && (
        <div style={{ position:'fixed', top:70, right:20, zIndex:50, background:message.startsWith('✅')||message.startsWith('📋')?'#DCFCE7':'#FEE2E2',
          border:`1px solid ${message.startsWith('✅')||message.startsWith('📋')?'#22C55E':'#EF4444'}`, borderRadius:10, padding:'12px 18px', fontSize:14, boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}>
          {message}
        </div>
      )}

      <div style={{ maxWidth:1200, margin:'0 auto', padding:20 }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:20 }}>
          {[
            { id:'matters', label:'📋 All Matters', count:matters.length },
            { id:'vaults', label:'🔒 Vaults', count:vaults.length },
            { id:'upload', label:'📤 Upload PDF' },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); if(tab.id==='upload') setShowUpload(true); }} style={{
              padding:'10px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer',
              background: activeTab===tab.id ? '#1E3A8A' : '#fff', color: activeTab===tab.id ? '#fff' : '#475569',
              border: activeTab===tab.id ? 'none' : '1px solid #E2E8F0',
            }}>{tab.label} {tab.count !== undefined && <span style={{ marginLeft:4, opacity:0.7 }}>({tab.count})</span>}</button>
          ))}
        </div>

        {/* MATTERS TAB */}
        {activeTab === 'matters' && (
          <div>
            {/* Filters */}
            <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()} placeholder="Search by name or email..." style={inp2} />
              <select value={serviceFilter} onChange={e=>{setServiceFilter(e.target.value); setTimeout(()=>fetchMatters(staffId),100);}} style={{...inp2, width:160}}>
                <option value="">All Services</option>
                <option value="general_poa">General POA</option><option value="limited_poa">Limited POA</option>
                <option value="living_trust">Living Trust</option><option value="llc_formation">LLC</option>
              </select>
              <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value); setTimeout(()=>fetchMatters(staffId),100);}} style={{...inp2, width:140}}>
                <option value="">All Status</option>
                <option value="paid">Paid</option><option value="draft">Draft</option><option value="pending_payment">Pending</option>
              </select>
              <button onClick={handleSearch} style={{ padding:'9px 18px', background:'#1E3A8A', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>🔍 Search</button>
            </div>

            {loading ? <div style={{ textAlign:'center', padding:40, color:'#64748B' }}>Loading matters...</div> : (
              matters.length === 0 ? (
                <div style={{ background:'#fff', borderRadius:12, padding:40, textAlign:'center', color:'#94A3B8' }}>No matters found</div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {matters.map(m => (
                    <div key={m.id+m.service_type} style={{ background:'#fff', borderRadius:10, padding:'16px 18px', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', borderLeft:`4px solid ${serviceColors[m.service_type]||'#94A3B8'}` }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
                        <div>
                          <div style={{ fontWeight:600, fontSize:14, color:'#0F172A' }}>{m.client_name}</div>
                          <div style={{ fontSize:12, color:'#64748B' }}>{m.client_email} • {fmt(m.created_at)}</div>
                        </div>
                        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                          <span style={{ padding:'3px 10px', borderRadius:6, fontSize:11, fontWeight:600, background:`${serviceColors[m.service_type]}15`, color:serviceColors[m.service_type] }}>
                            {serviceLabels[m.service_type] || m.service_type}
                          </span>
                          <span style={{ padding:'3px 10px', borderRadius:6, fontSize:11, fontWeight:600, background:`${statusColors[m.status]||'#94A3B8'}15`, color:statusColors[m.status]||'#94A3B8' }}>
                            {m.status}
                          </span>
                          {m.tier && <span style={{ padding:'3px 10px', borderRadius:6, fontSize:11, fontWeight:600, background:'#F5F3FF', color:'#7C3AED' }}>{m.tier}</span>}
                          {serviceSuccessUrls[m.service_type] && (
                            <button onClick={() => regenerateDoc(m)} style={{ padding:'4px 10px', background:'#FFF7ED', color:'#C2410C', border:'1px solid #FED7AA', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer' }}>
                              🔄 Regenerate
                            </button>
                          )}
                          <button onClick={() => openEdit(m)} style={{ padding:'4px 10px', background:'#EFF6FF', color:'#1D4ED8', border:'1px solid #BFDBFE', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer' }}>
                            ✏️ Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* VAULTS TAB */}
        {activeTab === 'vaults' && (
          <div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search vaults by name or email..."
              style={{...inp2, marginBottom:16, maxWidth:400}} />
            {vaults.filter(v => {
              if (!search) return true;
              const s = search.toLowerCase();
              return (v.client_name||'').toLowerCase().includes(s) || (v.client_email||'').toLowerCase().includes(s);
            }).length === 0 ? (
              <div style={{ background:'#fff', borderRadius:12, padding:40, textAlign:'center', color:'#94A3B8' }}>No vaults found</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {vaults.filter(v => {
                  if (!search) return true;
                  const s = search.toLowerCase();
                  return (v.client_name||'').toLowerCase().includes(s) || (v.client_email||'').toLowerCase().includes(s);
                }).map(v => (
                  <div key={v.id} style={{ background:'#fff', borderRadius:10, padding:'16px 18px', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14, color:'#0F172A' }}>{v.client_name || 'Unknown'}</div>
                        <div style={{ fontSize:12, color:'#64748B' }}>{v.client_email || 'No email'} • {fmt(v.created_at)} • {v.document_count || 0} doc(s)</div>
                        <div style={{ display:'flex', gap:6, marginTop:6 }}>
                          {v.service_type && <span style={{ background:'#EFF6FF', color:'#1E3A8A', padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:600 }}>{v.service_type}</span>}
                          <span style={{ background: new Date(v.expires_at)>new Date()?'#DCFCE7':'#FEE2E2', color: new Date(v.expires_at)>new Date()?'#166534':'#991B1B', padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:600 }}>
                            {new Date(v.expires_at)>new Date() ? `Exp ${fmt(v.expires_at)}` : 'Expired'}
                          </span>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => copyLink(v.token)} style={{ padding:'6px 14px', background:'#EFF6FF', color:'#1E3A8A', border:'1px solid #BFDBFE', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>📋 Copy Link</button>
                        <button onClick={() => resendEmail(v.id)} style={{ padding:'6px 14px', background:'#F0FDF4', color:'#166534', border:'1px solid #BBF7D0', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>📧 Resend</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* UPLOAD MODAL */}
      {(showUpload || activeTab === 'upload') && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:20 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:500, width:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 25px 50px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>📤 Upload Document to Vault</h2>
            <p style={{ fontSize:13, color:'#64748B', margin:'0 0 20px' }}>Upload a PDF to a client's vault</p>
            <form onSubmit={handleUpload}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div><label style={lbl}>Client Name</label><input value={uploadClientName} onChange={e=>setUploadClientName(e.target.value)} style={inp3} placeholder="John Doe"/></div>
                <div><label style={lbl}>Client Email</label><input type="email" value={uploadClientEmail} onChange={e=>setUploadClientEmail(e.target.value)} style={inp3} placeholder="john@email.com"/></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <div><label style={lbl}>Matter ID <span style={{color:'#94A3B8',fontWeight:400}}>(optional)</span></label><input value={uploadMatterId} onChange={e=>setUploadMatterId(e.target.value)} style={inp3} placeholder="Links to existing vault"/></div>
                <div><label style={lbl}>Document Type</label>
                  <select value={uploadDocType} onChange={e=>setUploadDocType(e.target.value)} style={inp3}>
                    <optgroup label="Government / Filed"><option value="articles_of_org">Articles of Organization</option><option value="ein_letter">EIN Confirmation Letter</option><option value="sos_filing">SOS Filing</option><option value="amendment">Amendment</option><option value="certificate">Certificate</option></optgroup>
                    <optgroup label="Generated - Main"><option value="poa_general">General POA</option><option value="poa_limited">Limited POA</option><option value="living_trust">Living Trust</option><option value="operating_agreement">Operating Agreement</option></optgroup>
                    <optgroup label="Generated - Simple Docs"><option value="bill_of_sale">Bill of Sale / Carta de Venta</option><option value="affidavit">Affidavit / Declaración Jurada</option><option value="revocation_poa">POA Revocation / Revocación de Poder</option><option value="authorization_letter">Authorization Letter / Carta de Autorización</option><option value="promissory_note">Promissory Note / Pagaré</option><option value="guardianship">Guardianship Designation / Designación de Guardián</option><option value="travel_authorization">Travel Authorization / Carta de Viaje</option></optgroup>
                    <option value="other">Other / Otro</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>File (PDF)</label>
                <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e=>setUploadFile(e.target.files[0])} style={{...inp3, padding:'10px 12px'}}/>
              </div>
              <div style={{ display:'flex', gap:12 }}>
                <button type="button" onClick={()=>{setShowUpload(false);setActiveTab('matters');}} style={{ flex:1, padding:'12px', background:'#F1F5F9', color:'#475569', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
                <button type="submit" disabled={uploading||!uploadFile} style={{ flex:1, padding:'12px', background:uploading||!uploadFile?'#94A3B8':'linear-gradient(135deg,#059669,#10B981)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:uploading||!uploadFile?'not-allowed':'pointer' }}>
                  {uploading ? '⏳ Uploading...' : '📤 Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPwModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:20 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:400, width:'100%', boxShadow:'0 25px 50px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#0F172A', margin:'0 0 16px' }}>🔑 Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom:14 }}>
                <label style={lbl}>Current Password</label>
                <input type="password" required value={currentPw} onChange={e=>setCurrentPw(e.target.value)} style={inp3}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={lbl}>New Password</label>
                <input type="password" required value={newPw} onChange={e=>setNewPw(e.target.value)} minLength={6} style={inp3}/>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={lbl}>Confirm New Password</label>
                <input type="password" required value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} style={inp3}/>
              </div>
              <div style={{ display:'flex', gap:12 }}>
                <button type="button" onClick={()=>{setShowPwModal(false);setCurrentPw('');setNewPw('');setConfirmPw('');}} style={{ flex:1, padding:'12px', background:'#F1F5F9', color:'#475569', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
                <button type="submit" disabled={pwSaving} style={{ flex:1, padding:'12px', background:pwSaving?'#94A3B8':'linear-gradient(135deg,#059669,#10B981)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:pwSaving?'not-allowed':'pointer' }}>
                  {pwSaving ? t.saving : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MATTER MODAL */}
      {editMatter && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:600, width:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#0F172A', marginBottom:4 }}>✏️ Edit Matter</h2>
            <p style={{ fontSize:12, color:'#64748B', marginBottom:4 }}>
              {editMatter.service_type?.replace(/_/g,' ').toUpperCase()} — ID: {String(editMatter.id||'').slice(0,8)}...
            </p>
            <p style={{ fontSize:12, color:'#D97706', background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:8, padding:'8px 12px', marginBottom:20 }}>
              ⚡ After saving, click <strong>🔄 Regenerate</strong> on the matter row to rebuild the PDF with corrected data.
            </p>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <div>
                <label style={lbl}>Client Name</label>
                <input value={editMatter._client_name} onChange={e => setEditMatter(m => ({...m, _client_name: e.target.value}))} style={inp3} />
              </div>
              <div>
                <label style={lbl}>Client Email</label>
                <input type="email" value={editMatter._client_email} onChange={e => setEditMatter(m => ({...m, _client_email: e.target.value}))} style={inp3} />
              </div>
            </div>

            <div style={{ marginBottom:12 }}>
              <label style={lbl}>Client Phone</label>
              <input value={editMatter._client_phone} onChange={e => setEditMatter(m => ({...m, _client_phone: e.target.value}))} style={inp3} />
            </div>

            <div style={{ marginBottom:12 }}>
              <label style={lbl}>Staff Note (internal, not on document)</label>
              <textarea value={editMatter._staff_note} onChange={e => setEditMatter(m => ({...m, _staff_note: e.target.value}))}
                rows={2} placeholder="e.g. Client called 2/22 to correct spelling of attorney name"
                style={{...inp3, resize:'vertical'}} />
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={lbl}>📋 Document Data (JSON)</label>
              <textarea value={editMatter._intake_json} onChange={e => setEditMatter(m => ({...m, _intake_json: e.target.value}))}
                rows={12} style={{...inp3, fontFamily:'monospace', fontSize:11, resize:'vertical', lineHeight:1.6}} />
              <p style={{ fontSize:11, color:'#EF4444', marginTop:4 }}>⚠️ Only change field values. Do not modify key names or JSON structure.</p>
            </div>

            <div style={{ display:'flex', gap:12 }}>
              <button type="button" onClick={() => setEditMatter(null)}
                style={{ flex:1, padding:'12px', background:'#F1F5F9', color:'#475569', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>
                Cancel
              </button>
              <button onClick={handleEditSave} disabled={editSaving}
                style={{ flex:1, padding:'12px', background:editSaving?'#94A3B8':'linear-gradient(135deg,#1D4ED8,#2563EB)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:editSaving?'not-allowed':'pointer' }}>
                {editSaving ? t.saving : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const lbl = { display:'block', fontSize:13, fontWeight:600, color:'#334155', marginBottom:6 };
const inp2 = { padding:'9px 14px', fontSize:13, border:'2px solid #E2E8F0', borderRadius:8, outline:'none', boxSizing:'border-box', background:'#fff' };
const inp3 = { width:'100%', padding:'10px 14px', fontSize:14, border:'2px solid #E2E8F0', borderRadius:8, outline:'none', boxSizing:'border-box', background:'#fff' };
