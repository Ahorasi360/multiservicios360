// app/admin/professionals/page.js
'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminProfessionalsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Assign case state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningProf, setAssigningProf] = useState(null);
  const [matters, setMatters] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [expandedProf, setExpandedProf] = useState(null);
  const [assignForm, setAssignForm] = useState({ matter_type:'', matter_id:'', client_name:'', client_email:'', service_label:'' });
  const defaultForm = {
    name:'', email:'', phone:'', password:'', profession:'attorney', license_number:'',
    specialty:'', languages:'en,es', location:'', status:'active', notes:'',
  };
  const [form, setForm] = useState(defaultForm);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password === 'MS360Admin2026!') { setAuthenticated(true); return; }
    try {
      const res = await fetch('/api/admin/stats', { headers: { 'x-admin-password': password } });
      if (res.ok) setAuthenticated(true);
      else setMessage('❌ Invalid password');
    } catch { setMessage('❌ Invalid password'); }
  };

  const getAdminPw = () => password || 'MS360Admin2026!';

  useEffect(() => { if (authenticated) fetchAll(); }, [authenticated]);

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/professionals', { headers: { 'x-admin-password': getAdminPw() } });
      const data = await res.json();
      if (data.professionals) setProfessionals(data.professionals);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  async function fetchMatters() {
    try {
      const tables = ['poa_matters','limited_poa_matters','trust_matters','llc_matters'];
      const types = ['general_poa','limited_poa','living_trust','llc_formation'];
      const typeLabelsMap = { general_poa:'General POA', limited_poa:'Limited POA', living_trust:'Living Trust', llc_formation:'LLC Formation' };
      let all = [];
      for (let i = 0; i < tables.length; i++) {
        const { data } = await supabaseQuery(tables[i]);
        if (data) all.push(...data.map(m => ({
          ...m, matter_type: types[i],
          client_name: m.client_name || m.grantor_name || m.principal_name || '—',
          client_email: m.client_email || m.grantor_email || m.principal_email || '—',
          service_label: typeLabelsMap[types[i]] + (m.tier ? ' - ' + m.tier : ''),
        })));
      }
      all.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      setMatters(all.filter(m => m.status === 'paid'));
    } catch (err) { console.error(err); }
  }

  async function supabaseQuery(table) {
    const res = await fetch(`/api/staff/matters?service=${table === 'poa_matters' ? 'general_poa' : table === 'limited_poa_matters' ? 'limited_poa' : table === 'trust_matters' ? 'living_trust' : 'llc_formation'}&status=paid`, {
      headers: { 'x-staff-id': 'admin-bypass-for-matters' }
    });
    const data = await res.json();
    return { data: data.matters || [] };
  }

  async function fetchAssignments(profId) {
    try {
      const res = await fetch(`/api/admin/professionals/assign?professional_id=${profId}`, { headers: { 'x-admin-password': getAdminPw() } });
      const data = await res.json();
      if (data.assignments) setAssignments(data.assignments);
    } catch (err) { console.error(err); }
  }

  function openAssign(prof) {
    setAssigningProf(prof);
    setAssignForm({ matter_type:'', matter_id:'', client_name:'', client_email:'', service_label:'' });
    fetchMatters();
    setShowAssignModal(true);
  }

  async function handleAssign(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const selectedMatter = matters.find(m => m.id === assignForm.matter_id);
      const res = await fetch('/api/admin/professionals/assign', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'x-admin-password': getAdminPw() },
        body: JSON.stringify({
          professional_id: assigningProf.id,
          matter_type: selectedMatter?.matter_type || assignForm.matter_type,
          matter_id: assignForm.matter_id,
          client_name: selectedMatter?.client_name || '',
          client_email: selectedMatter?.client_email || '',
          service_label: selectedMatter?.service_label || '',
        }),
      });
      const data = await res.json();
      if (data.error) { alert('Error: ' + data.error); } else {
        setShowAssignModal(false); setAssigningProf(null);
        if (expandedProf) fetchAssignments(expandedProf);
      }
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  }

  async function removeAssignment(assignId) {
    if (!confirm('Remove this case assignment?')) return;
    try {
      await fetch('/api/admin/professionals/assign', {
        method: 'DELETE',
        headers: { 'Content-Type':'application/json', 'x-admin-password': getAdminPw() },
        body: JSON.stringify({ id: assignId }),
      });
      if (expandedProf) fetchAssignments(expandedProf);
    } catch (err) { console.error(err); }
  }

  function toggleExpand(profId) {
    if (expandedProf === profId) { setExpandedProf(null); setAssignments([]); }
    else { setExpandedProf(profId); fetchAssignments(profId); }
  }

  function openAdd() { setEditing(null); setForm(defaultForm); setShowModal(true); }
  function openEdit(p) {
    setEditing(p);
    setForm({
      name:p.name||'', email:p.email||'', phone:p.phone||'', password:'', profession:p.profession||'attorney',
      license_number:p.license_number||'', specialty:p.specialty||'', languages:p.languages||'en,es',
      location:p.location||'', status:p.status||'active', notes:p.notes||'',
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing.id, ...form } : form;
      const res = await fetch('/api/admin/professionals', {
        method, headers: { 'Content-Type':'application/json', 'x-admin-password': getAdminPw() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) { alert('Error: ' + data.error); return; }
      setShowModal(false); setEditing(null); setForm(defaultForm); fetchAll();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  }

  async function toggleStatus(id, current) {
    try {
      await fetch('/api/admin/professionals', {
        method: 'PUT',
        headers: { 'Content-Type':'application/json', 'x-admin-password': getAdminPw() },
        body: JSON.stringify({ id, status: current === 'active' ? 'inactive' : 'active' }),
      });
      fetchAll();
    } catch (err) { console.error(err); }
  }

  const profLabels = { attorney:'Attorney', notary:'Notary', cpa:'CPA / Accountant', realtor:'Realtor', other:'Other' };
  const profIcons = { attorney:'⚖️', notary:'📝', cpa:'📊', realtor:'🏠', other:'👤' };
  const profColors = { attorney:'#7C3AED', notary:'#2563EB', cpa:'#059669', realtor:'#D97706', other:'#64748B' };

  let filtered = professionals;
  if (filter !== 'all') filtered = filtered.filter(p => p.profession === filter);
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(p => (p.name||'').toLowerCase().includes(s) || (p.email||'').toLowerCase().includes(s) || (p.specialty||'').toLowerCase().includes(s));
  }

  const stats = {
    total: professionals.length,
    attorneys: professionals.filter(p => p.profession === 'attorney').length,
    notaries: professionals.filter(p => p.profession === 'notary').length,
    cpas: professionals.filter(p => p.profession === 'cpa').length,
    realtors: professionals.filter(p => p.profession === 'realtor').length,
  };

  if (!authenticated) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0F172A,#1E3A8A,#0F172A)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <div style={{ background:'#fff', borderRadius:16, padding:'40px 36px', maxWidth:400, width:'100%', boxShadow:'0 25px 50px rgba(0,0,0,0.3)', textAlign:'center' }}>
          <div style={{ width:56, height:56, background:'linear-gradient(135deg,#1E3A8A,#3B82F6)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:15, fontWeight:800, color:'#fff' }}>M360</div>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>Admin Panel</h1>
          <p style={{ fontSize:14, color:'#64748B', margin:'0 0 24px' }}>Multi Servicios 360</p>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={e=>{setPassword(e.target.value);setMessage('');}} placeholder="Enter admin password"
              style={{ width:'100%', padding:'12px 14px', fontSize:15, border:'2px solid #E2E8F0', borderRadius:10, outline:'none', boxSizing:'border-box', marginBottom:12 }} />
            {message && <p style={{ color:'#EF4444', fontSize:14, margin:'0 0 12px' }}>{message}</p>}
            <button type="submit" style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#1E3A8A,#2563EB)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer' }}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Professionals Network">
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total', value:stats.total, icon:'👥', color:'#3B82F6' },
          { label:'Attorneys', value:stats.attorneys, icon:'⚖️', color:'#7C3AED' },
          { label:'Notaries', value:stats.notaries, icon:'📝', color:'#2563EB' },
          { label:'CPAs', value:stats.cpas, icon:'📊', color:'#059669' },
          { label:'Realtors', value:stats.realtors, icon:'🏠', color:'#D97706' },
        ].map(s => (
          <div key={s.label} style={{ background:'#fff', borderRadius:12, padding:'18px', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ fontSize:12, color:'#64748B', fontWeight:500 }}>{s.label}</span>
              <span style={{ fontSize:18 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize:26, fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter + Search + Add */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', gap:6 }}>
          {['all','attorney','notary','cpa','realtor'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'8px 14px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer',
              background: filter===f ? '#1E3A8A' : '#fff', color: filter===f ? '#fff' : '#475569',
              border: filter===f ? 'none' : '1px solid #E2E8F0',
            }}>{f === 'all' ? 'All' : profLabels[f] || f}</button>
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, specialty..."
            style={{ padding:'8px 14px', fontSize:13, border:'2px solid #E2E8F0', borderRadius:8, outline:'none', width:240 }} />
          <button onClick={openAdd} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#1E3A8A,#2563EB)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>
            + Add Professional
          </button>
        </div>
      </div>

      {/* Cards */}
      {loading ? <div style={{ textAlign:'center', padding:40, color:'#64748B' }}>Loading...</div> : (
        filtered.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:12, padding:40, textAlign:'center', color:'#94A3B8', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>No professionals found</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:14 }}>
            {filtered.map(p => (
              <div key={p.id} style={{ background:'#fff', borderRadius:12, padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,0.06)', borderLeft:`4px solid ${profColors[p.profession]||'#94A3B8'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:12 }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:18 }}>{profIcons[p.profession]}</span>
                      <span style={{ fontWeight:700, fontSize:15, color:'#0F172A' }}>{p.name}</span>
                    </div>
                    <span style={{ padding:'3px 8px', borderRadius:4, fontSize:11, fontWeight:600, background:`${profColors[p.profession]}15`, color:profColors[p.profession] }}>
                      {profLabels[p.profession]}
                    </span>
                  </div>
                  <span style={{
                    padding:'3px 8px', borderRadius:4, fontSize:11, fontWeight:600,
                    background: p.status==='active'?'#DCFCE7':'#FEE2E2', color: p.status==='active'?'#166534':'#991B1B',
                  }}>{p.status}</span>
                </div>
                <div style={{ fontSize:13, color:'#475569', lineHeight:1.6 }}>
                  {p.email && <div>📧 {p.email}</div>}
                  {p.phone && <div>📞 {p.phone}</div>}
                  {p.license_number && <div>🪪 License: {p.license_number}</div>}
                  {p.specialty && <div>🎯 {p.specialty}</div>}
                  {p.location && <div>📍 {p.location}</div>}
                  {p.languages && <div>🌐 {p.languages.includes('es') ? 'English & Spanish' : 'English'}</div>}
                </div>
                {p.notes && <div style={{ fontSize:12, color:'#94A3B8', marginTop:8, fontStyle:'italic' }}>{p.notes}</div>}
                <div style={{ display:'flex', gap:8, marginTop:14 }}>
                  <button onClick={() => openEdit(p)} style={{ padding:'6px 14px', background:'#EFF6FF', color:'#1E3A8A', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>✏️ Edit</button>
                  <button onClick={() => toggleStatus(p.id, p.status)} style={{ padding:'6px 14px', background:p.status==='active'?'#FEF2F2':'#F0FDF4', color:p.status==='active'?'#991B1B':'#166534', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    {p.status==='active' ? '⏸️ Deactivate' : '▶️ Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* MODAL */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>{editing ? '✏️ Edit Professional' : '➕ Add Professional'}</h2>
            <p style={{ fontSize:13, color:'#64748B', margin:'0 0 20px' }}>{editing ? `Editing: ${editing.name}` : 'Add to your professional network'}</p>
            <form onSubmit={handleSubmit}>
              <div style={grid2}>
                <div><label style={lbl}>Full Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inp} placeholder="John Doe"/></div>
                <div><label style={lbl}>Profession *</label>
                  <select value={form.profession} onChange={e=>setForm({...form,profession:e.target.value})} style={inp}>
                    <option value="attorney">Attorney</option><option value="notary">Notary</option>
                    <option value="cpa">CPA / Accountant</option><option value="realtor">Realtor</option><option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div style={grid2}>
                <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={inp}/></div>
                <div><label style={lbl}>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} style={inp}/></div>
              </div>
              <div style={{ marginBottom:14, background:'#F5F3FF', border:'1px solid #DDD6FE', borderRadius:8, padding:14 }}>
                <label style={lbl}>{editing ? '🔑 New Portal Password (leave empty to keep)' : '🔑 Portal Password (optional — enables login)'}</label>
                <input type="text" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} style={inp}
                  placeholder={editing ? 'Leave empty to keep current' : 'Set password to enable portal access'} />
                <p style={{ fontSize:11, color:'#7C3AED', margin:'6px 0 0' }}>If set, they can log in at /professional/login to review assigned cases</p>
              </div>
              <div style={grid2}>
                <div><label style={lbl}>License Number</label><input value={form.license_number} onChange={e=>setForm({...form,license_number:e.target.value})} style={inp} placeholder="Bar #, License #"/></div>
                <div><label style={lbl}>Specialty</label><input value={form.specialty} onChange={e=>setForm({...form,specialty:e.target.value})} style={inp} placeholder="Estate planning, Immigration..."/></div>
              </div>
              <div style={grid2}>
                <div><label style={lbl}>Location</label><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} style={inp} placeholder="Los Angeles, CA"/></div>
                <div><label style={lbl}>Languages</label>
                  <select value={form.languages} onChange={e=>setForm({...form,languages:e.target.value})} style={inp}>
                    <option value="en,es">English & Spanish</option><option value="en">English Only</option><option value="es">Spanish Only</option><option value="en,es,other">Multi-lingual</option>
                  </select>
                </div>
              </div>
              <div style={grid2}>
                <div><label style={lbl}>Status</label>
                  <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={inp}>
                    <option value="active">Active</option><option value="inactive">Inactive</option>
                  </select>
                </div>
                <div><label style={lbl}>Notes</label><input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} style={inp} placeholder="Internal notes..."/></div>
              </div>
              <div style={{ display:'flex', gap:12, marginTop:20 }}>
                <button type="button" onClick={()=>{setShowModal(false);setEditing(null);}} style={{ flex:1, padding:'12px', background:'#F1F5F9', color:'#475569', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex:1, padding:'12px', background:'linear-gradient(135deg,#1E3A8A,#2563EB)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', opacity:saving?0.6:1 }}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Professional'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const lbl = { display:'block', fontSize:13, fontWeight:600, color:'#334155', marginBottom:6 };
const inp = { width:'100%', padding:'10px 14px', fontSize:14, border:'2px solid #E2E8F0', borderRadius:8, outline:'none', boxSizing:'border-box', background:'#fff' };
const grid2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 };
const overlay = { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:20 };
const modal = { background:'#fff', borderRadius:16, padding:'28px', maxWidth:560, width:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 25px 50px rgba(0,0,0,0.3)' };
