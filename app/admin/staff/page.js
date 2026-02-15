// app/admin/staff/page.js
'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminStaffPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const defaultForm = { name:'', email:'', phone:'', password:'', role:'worker', status:'active', notes:'' };
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

  useEffect(() => { if (authenticated) fetchWorkers(); }, [authenticated]);

  async function fetchWorkers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/staff', { headers: { 'x-admin-password': getAdminPw() } });
      const data = await res.json();
      if (data.workers) setWorkers(data.workers);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  function openAdd() { setEditing(null); setForm(defaultForm); setShowModal(true); }
  function openEdit(w) {
    setEditing(w);
    setForm({ name:w.name||'', email:w.email||'', phone:w.phone||'', password:'', role:w.role||'worker', status:w.status||'active', notes:w.notes||'' });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing.id, ...form } : form;
      if (editing && !form.password) delete body.password;
      if (!editing && !form.password) { alert('Password is required for new workers'); setSaving(false); return; }
      const res = await fetch('/api/admin/staff', {
        method, headers: { 'Content-Type':'application/json', 'x-admin-password': getAdminPw() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) { alert('Error: ' + data.error); setSaving(false); return; }
      setShowModal(false); setEditing(null); setForm(defaultForm); fetchWorkers();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  }

  async function toggleStatus(id, current) {
    try {
      await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type':'application/json', 'x-admin-password': getAdminPw() },
        body: JSON.stringify({ id, status: current === 'active' ? 'inactive' : 'active' }),
      });
      fetchWorkers();
    } catch (err) { console.error(err); }
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit' }) : 'Never';

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
    <AdminLayout title="Staff Management">
      {/* Info banner */}
      <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:10, padding:'14px 18px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <span style={{ fontWeight:600, color:'#1E3A8A', fontSize:14 }}>👷 Staff Portal: </span>
          <span style={{ color:'#3B82F6', fontSize:13 }}>Workers log in at <strong>multiservicios360.net/staff/login</strong></span>
        </div>
        <a href="/staff/login" target="_blank" style={{ padding:'6px 14px', background:'#1E3A8A', color:'#fff', borderRadius:6, fontSize:12, fontWeight:600, textDecoration:'none' }}>Open Portal ↗</a>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Staff', value:workers.length, icon:'👥', color:'#3B82F6' },
          { label:'Active', value:workers.filter(w=>w.status==='active').length, icon:'✅', color:'#22C55E' },
          { label:'Inactive', value:workers.filter(w=>w.status==='inactive').length, icon:'⏸️', color:'#94A3B8' },
        ].map(s => (
          <div key={s.label} style={{ background:'#fff', borderRadius:12, padding:'18px', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ fontSize:12, color:'#64748B', fontWeight:500 }}>{s.label}</span><span style={{ fontSize:18 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Add button */}
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <button onClick={openAdd} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#1E3A8A,#2563EB)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>+ Add Worker</button>
      </div>

      {/* Worker list */}
      {loading ? <div style={{ textAlign:'center', padding:40, color:'#64748B' }}>Loading...</div> : (
        workers.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:12, padding:40, textAlign:'center', color:'#94A3B8', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            No staff members yet. Click "Add Worker" to create your first staff account.
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {workers.map(w => (
              <div key={w.id} style={{ background:'#fff', borderRadius:12, padding:'18px 20px', boxShadow:'0 1px 3px rgba(0,0,0,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:42, height:42, borderRadius:10, background:w.status==='active'?'#EFF6FF':'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                    {w.role === 'manager' ? '👔' : '👷'}
                  </div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, color:'#0F172A' }}>{w.name}</div>
                    <div style={{ fontSize:12, color:'#64748B' }}>{w.email} {w.phone ? `• ${w.phone}` : ''}</div>
                    <div style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>Last login: {fmt(w.last_login)} • Role: {w.role}</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{
                    padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:600,
                    background: w.status==='active'?'#DCFCE7':'#F1F5F9', color: w.status==='active'?'#166534':'#64748B',
                  }}>{w.status}</span>
                  <button onClick={() => openEdit(w)} style={{ padding:'6px 12px', background:'#EFF6FF', color:'#1E3A8A', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>✏️ Edit</button>
                  <button onClick={() => toggleStatus(w.id, w.status)} style={{ padding:'6px 12px', background:w.status==='active'?'#FEF2F2':'#F0FDF4', color:w.status==='active'?'#991B1B':'#166534', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    {w.status==='active' ? 'Deactivate' : 'Activate'}
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
            <h2 style={{ fontSize:18, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>{editing ? '✏️ Edit Worker' : '➕ Add New Worker'}</h2>
            <p style={{ fontSize:13, color:'#64748B', margin:'0 0 20px' }}>{editing ? `Editing: ${editing.name}` : 'Workers can view clients, upload PDFs, and resend vault emails'}</p>
            <form onSubmit={handleSubmit}>
              <div style={grid2}>
                <div><label style={lbl}>Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inp} placeholder="Maria Garcia"/></div>
                <div><label style={lbl}>Email *</label><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={inp} placeholder="maria@email.com"/></div>
              </div>
              <div style={grid2}>
                <div><label style={lbl}>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} style={inp}/></div>
                <div>
                  <label style={lbl}>{editing ? 'New Password (leave empty to keep)' : 'Password *'}</label>
                  <input type="text" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} style={inp}
                    placeholder={editing ? 'Leave empty to keep current' : 'Set password'} required={!editing}/>
                </div>
              </div>
              <div style={grid2}>
                <div><label style={lbl}>Role</label>
                  <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} style={inp}>
                    <option value="worker">Worker</option><option value="manager">Manager</option>
                  </select>
                </div>
                <div><label style={lbl}>Status</label>
                  <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={inp}>
                    <option value="active">Active</option><option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div><label style={lbl}>Notes</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} style={{...inp,resize:'vertical'}} placeholder="Internal notes about this worker..."/></div>
              <div style={{ display:'flex', gap:12, marginTop:20 }}>
                <button type="button" onClick={()=>{setShowModal(false);setEditing(null);}} style={{ flex:1, padding:'12px', background:'#F1F5F9', color:'#475569', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex:1, padding:'12px', background:'linear-gradient(135deg,#1E3A8A,#2563EB)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', opacity:saving?0.6:1 }}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Worker'}</button>
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
const modal = { background:'#fff', borderRadius:16, padding:'28px', maxWidth:520, width:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 25px 50px rgba(0,0,0,0.3)' };
