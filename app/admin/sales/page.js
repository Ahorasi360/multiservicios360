// app/admin/sales/page.js
'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminSalesPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [reps, setReps] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingRep, setEditingRep] = useState(null);
  const [assigningRep, setAssigningRep] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedRep, setExpandedRep] = useState(null);

  const defaultForm = {
    name: '', email: '', phone: '', password: '', status: 'active',
    commission_rate: 5, commission_duration_months: 1,
    setup_fee_share_enabled: false, setup_fee_share_percent: 0, notes: '',
  };
  const [form, setForm] = useState(defaultForm);
  const [assignForm, setAssignForm] = useState({ partner_id: '', setup_fee_amount: 0 });

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

  useEffect(() => {
    if (authenticated) { fetchReps(); fetchPartners(); }
  }, [authenticated]);

  async function fetchReps() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sales', { headers: { 'x-admin-password': getAdminPw() } });
      const data = await res.json();
      if (data.reps) setReps(data.reps);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  async function fetchPartners() {
    try {
      const res = await fetch('/api/admin/partners', { headers: { 'x-admin-password': getAdminPw() } });
      const data = await res.json();
      if (data.partners) setPartners(data.partners);
    } catch (err) { console.error(err); }
  }

  function openAdd() { setEditingRep(null); setForm(defaultForm); setShowModal(true); }
  function openEdit(rep) {
    setEditingRep(rep);
    setForm({
      name: rep.name || '', email: rep.email || '', phone: rep.phone || '', password: '',
      status: rep.status || 'active', commission_rate: rep.commission_rate || 5,
      commission_duration_months: rep.commission_duration_months || 1,
      setup_fee_share_enabled: rep.setup_fee_share_enabled || false,
      setup_fee_share_percent: rep.setup_fee_share_percent || 0, notes: rep.notes || '',
    });
    setShowModal(true);
  }
  function openAssign(rep) {
    setAssigningRep(rep);
    setAssignForm({ partner_id: '', setup_fee_amount: 0 });
    setShowAssignModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingRep ? 'PUT' : 'POST';
      const body = editingRep ? { id: editingRep.id, ...form } : form;
      const res = await fetch('/api/admin/sales', {
        method, headers: { 'Content-Type': 'application/json', 'x-admin-password': getAdminPw() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) { alert('Error: ' + data.error); return; }
      setShowModal(false); setEditingRep(null); setForm(defaultForm); fetchReps();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  }

  async function handleAssign(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/sales/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getAdminPw() },
        body: JSON.stringify({
          sales_rep_id: assigningRep.id,
          partner_id: assignForm.partner_id,
          commission_rate: assigningRep.commission_rate,
          duration_months: assigningRep.commission_duration_months,
          setup_fee_amount: assigningRep.setup_fee_share_enabled ? assignForm.setup_fee_amount : 0,
        }),
      });
      const data = await res.json();
      if (data.error) { alert('Error: ' + data.error); return; }
      setShowAssignModal(false); setAssigningRep(null); fetchReps();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  }

  async function updateStatus(id, status) {
    try {
      await fetch('/api/admin/sales', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getAdminPw() },
        body: JSON.stringify({ id, status }),
      });
      fetchReps();
    } catch (err) { console.error(err); }
  }

  const filtered = filter === 'all' ? reps : reps.filter(r => r.status === filter);
  const stats = {
    total: reps.length,
    active: reps.filter(r => r.status === 'active').length,
    totalEarned: reps.reduce((s, r) => s + (r.total_earned || 0), 0),
    totalPending: reps.reduce((s, r) => s + (r.pending_payout || 0), 0),
  };

  const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!authenticated) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0F172A,#1E3A8A,#0F172A)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <div style={{ background:'#fff', borderRadius:16, padding:'40px 36px', maxWidth:400, width:'100%', boxShadow:'0 25px 50px rgba(0,0,0,0.3)', textAlign:'center' }}>
          <div style={{ width:56, height:56, background:'linear-gradient(135deg,#1E3A8A,#3B82F6)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:15, fontWeight:800, color:'#fff' }}>M360</div>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>Admin Panel</h1>
          <p style={{ fontSize:14, color:'#64748B', margin:'0 0 24px' }}>Multi Servicios 360</p>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setMessage(''); }} placeholder="Enter admin password"
              style={{ width:'100%', padding:'12px 14px', fontSize:15, border:'2px solid #E2E8F0', borderRadius:10, outline:'none', boxSizing:'border-box', marginBottom:12 }} />
            {message && <p style={{ color:'#EF4444', fontSize:14, margin:'0 0 12px' }}>{message}</p>}
            <button type="submit" style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#1E3A8A,#2563EB)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer' }}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Sales Team">
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Total Reps', value:stats.total, icon:'👥', color:'#3B82F6' },
          { label:'Active', value:stats.active, icon:'✅', color:'#22C55E' },
          { label:'Total Earned', value:fmt(stats.totalEarned), icon:'💰', color:'#F59E0B' },
          { label:'Pending Payout', value:fmt(stats.totalPending), icon:'⏳', color:'#EF4444' },
        ].map(s => (
          <div key={s.label} style={{ background:'#fff', borderRadius:12, padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ fontSize:13, color:'#64748B', fontWeight:500 }}>{s.label}</span>
              <span style={{ fontSize:20 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter + Add */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div style={{ display:'flex', gap:6 }}>
          {['all','active','inactive','suspended'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer',
              background: filter===f ? '#1E3A8A' : '#fff', color: filter===f ? '#fff' : '#475569',
              border: filter===f ? 'none' : '1px solid #E2E8F0',
            }}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase()+f.slice(1)}</button>
          ))}
        </div>
        <button onClick={openAdd} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#1E3A8A,#2563EB)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>
          + Add Sales Rep
        </button>
      </div>

      {/* Table */}
      {loading ? <div style={{ textAlign:'center', padding:40, color:'#64748B' }}>Loading...</div> : (
        <div style={{ background:'#fff', borderRadius:12, boxShadow:'0 1px 3px rgba(0,0,0,0.06)', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['NAME','CONTACT','COMMISSION','DURATION','OFFICES','EARNINGS','STATUS','ACTIONS'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:11, fontWeight:700, color:'#64748B', letterSpacing:'0.5px', borderBottom:'1px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>No sales reps found</td></tr>
              ) : filtered.map(rep => (
                <React.Fragment key={rep.id}>
                  <tr style={{ borderBottom:'1px solid #F1F5F9', cursor:'pointer' }} onClick={() => setExpandedRep(expandedRep === rep.id ? null : rep.id)}>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ fontWeight:600, color:'#0F172A', fontSize:14 }}>{rep.name}</div>
                      <div style={{ fontSize:12, color:'#94A3B8' }}>{rep.email}</div>
                    </td>
                    <td style={{ padding:'14px 16px', fontSize:13, color:'#475569' }}>{rep.phone || '—'}</td>
                    <td style={{ padding:'14px 16px' }}>
                      <span style={{ background:'#DCFCE7', color:'#166534', padding:'4px 10px', borderRadius:6, fontSize:13, fontWeight:700 }}>{rep.commission_rate}%</span>
                    </td>
                    <td style={{ padding:'14px 16px' }}>
                      <span style={{ background:'#EFF6FF', color:'#1E3A8A', padding:'4px 10px', borderRadius:6, fontSize:13, fontWeight:600 }}>
                        {rep.commission_duration_months} mo{rep.commission_duration_months > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td style={{ padding:'14px 16px', fontSize:14, fontWeight:600, color:'#0F172A' }}>
                      {rep.offices_active || 0} <span style={{ color:'#94A3B8', fontWeight:400 }}>/ {rep.offices_total || 0}</span>
                    </td>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ fontSize:14, fontWeight:700, color:'#059669' }}>{fmt(rep.total_earned)}</div>
                      {rep.pending_payout > 0 && <div style={{ fontSize:11, color:'#F59E0B' }}>Pending: {fmt(rep.pending_payout)}</div>}
                    </td>
                    <td style={{ padding:'14px 16px' }}>
                      <span style={{
                        padding:'4px 10px', borderRadius:6, fontSize:12, fontWeight:600,
                        background: rep.status==='active'?'#DCFCE7':rep.status==='suspended'?'#FEE2E2':'#F1F5F9',
                        color: rep.status==='active'?'#166534':rep.status==='suspended'?'#991B1B':'#64748B',
                      }}>{rep.status}</span>
                    </td>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={(e) => { e.stopPropagation(); openEdit(rep); }} style={btnStyle('#EFF6FF','#1E3A8A')}>✏️</button>
                        <button onClick={(e) => { e.stopPropagation(); openAssign(rep); }} style={btnStyle('#F0FDF4','#166534')}>🏢</button>
                        {rep.status==='active' ?
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(rep.id, 'suspended'); }} style={btnStyle('#FEF2F2','#991B1B')}>⏸️</button>
                        : <button onClick={(e) => { e.stopPropagation(); updateStatus(rep.id, 'active'); }} style={btnStyle('#F0FDF4','#166534')}>▶️</button>
                        }
                      </div>
                    </td>
                  </tr>
                  {/* Expanded row — assignments */}
                  {expandedRep === rep.id && (
                    <tr><td colSpan={8} style={{ background:'#F8FAFC', padding:'16px 24px' }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'#0F172A', marginBottom:8 }}>
                        Assigned Offices ({(rep.assignments || []).length})
                        {rep.setup_fee_share_enabled && <span style={{ marginLeft:12, background:'#FEF3C7', color:'#92400E', padding:'2px 8px', borderRadius:4, fontSize:11 }}>Setup Fee Share: {rep.setup_fee_share_percent}%</span>}
                      </div>
                      {(rep.assignments || []).length === 0 ? (
                        <div style={{ color:'#94A3B8', fontSize:13 }}>No offices assigned yet. Click 🏢 to assign.</div>
                      ) : (
                        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                          {(rep.assignments || []).map(a => {
                            const partner = partners.find(p => p.id === a.partner_id);
                            const isExpired = new Date(a.end_date) < new Date();
                            return (
                              <div key={a.id} style={{ background:'#fff', borderRadius:8, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #E2E8F0' }}>
                                <div>
                                  <span style={{ fontWeight:600, fontSize:13 }}>{partner?.business_name || 'Unknown Office'}</span>
                                  <span style={{ marginLeft:8, fontSize:12, color:'#64748B' }}>{a.commission_rate}% for {a.duration_months} mo</span>
                                  {a.setup_fee_amount > 0 && <span style={{ marginLeft:8, fontSize:12, color:'#92400E' }}>+ {fmt(a.setup_fee_amount)} setup</span>}
                                </div>
                                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                  <span style={{ fontSize:12, color:'#059669', fontWeight:600 }}>{fmt(a.total_commission_earned)}</span>
                                  <span style={{
                                    padding:'3px 8px', borderRadius:4, fontSize:11, fontWeight:600,
                                    background: isExpired ? '#FEE2E2' : '#DCFCE7', color: isExpired ? '#991B1B' : '#166534',
                                  }}>{isExpired ? 'Expired' : 'Active'}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td></tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD/EDIT REP MODAL */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>{editingRep ? '✏️ Edit Sales Rep' : '➕ Add Sales Rep'}</h2>
            <p style={{ fontSize:13, color:'#64748B', margin:'0 0 20px' }}>{editingRep ? `Editing: ${editingRep.name}` : 'Set up new sales representative'}</p>
            <form onSubmit={handleSubmit}>
              <div style={grid2}>
                <div><label style={lbl}>Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inp}/></div>
                <div><label style={lbl}>Email *</label><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={inp}/></div>
              </div>
              <div style={grid2}>
                <div><label style={lbl}>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} style={inp}/></div>
                <div><label style={lbl}>Status</label>
                  <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={inp}>
                    <option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={lbl}>{editingRep ? 'New Password (leave empty to keep)' : 'Portal Password *'}</label>
                <input type="text" value={form.password || ''} onChange={e=>setForm({...form,password:e.target.value})} style={inp}
                  placeholder={editingRep ? 'Leave empty to keep current' : 'Set login password for sales portal'} />
                <p style={{ fontSize:11, color:'#94A3B8', margin:'4px 0 0' }}>Used to log in at /sales/login — a welcome email will be sent</p>
              </div>

              {/* Commission Settings */}
              <div style={{ background:'#F0FDF4', borderRadius:10, padding:16, margin:'16px 0', border:'1px solid #BBF7D0' }}>
                <h3 style={{ fontSize:14, fontWeight:700, color:'#166534', margin:'0 0 12px' }}>💰 Commission Settings</h3>
                <div style={grid2}>
                  <div>
                    <label style={lbl}>Commission Rate: <strong style={{ color:'#059669', fontSize:16 }}>{form.commission_rate}%</strong></label>
                    <input type="range" min="0" max="50" step="1" value={form.commission_rate} onChange={e=>setForm({...form,commission_rate:Number(e.target.value)})}
                      style={{ width:'100%', accentColor:'#059669' }} />
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#94A3B8' }}><span>0%</span><span>25%</span><span>50%</span></div>
                  </div>
                  <div>
                    <label style={lbl}>Duration (months)</label>
                    <select value={form.commission_duration_months} onChange={e=>setForm({...form,commission_duration_months:Number(e.target.value)})} style={inp}>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m} month{m>1?'s':''}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Setup Fee Share — OWNER ONLY */}
              <div style={{ background:'#FEF3C7', borderRadius:10, padding:16, margin:'0 0 16px', border:'1px solid #FDE68A' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <h3 style={{ fontSize:14, fontWeight:700, color:'#92400E', margin:0 }}>🔒 Setup Fee Share (Owner Only)</h3>
                  <span style={{ fontSize:11, color:'#B45309', background:'#FDE68A', padding:'2px 8px', borderRadius:4 }}>Hidden from rep</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:form.setup_fee_share_enabled ? 12 : 0 }}>
                  <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13, color:'#92400E', fontWeight:500 }}>
                    <input type="checkbox" checked={form.setup_fee_share_enabled} onChange={e=>setForm({...form,setup_fee_share_enabled:e.target.checked})} style={{ width:18, height:18 }} />
                    Give this rep a share of the setup/activation fee
                  </label>
                </div>
                {form.setup_fee_share_enabled && (
                  <div>
                    <label style={lbl}>Setup Fee Share: <strong style={{ color:'#B45309' }}>{form.setup_fee_share_percent}%</strong></label>
                    <input type="range" min="0" max="100" step="5" value={form.setup_fee_share_percent} onChange={e=>setForm({...form,setup_fee_share_percent:Number(e.target.value)})}
                      style={{ width:'100%', accentColor:'#D97706' }} />
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#94A3B8' }}><span>0%</span><span>50%</span><span>100%</span></div>
                  </div>
                )}
              </div>

              <div><label style={lbl}>Notes</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} style={{...inp,resize:'vertical'}}/></div>

              <div style={{ display:'flex', gap:12, marginTop:20 }}>
                <button type="button" onClick={()=>{setShowModal(false);setEditingRep(null);}} style={{ flex:1, padding:'12px', background:'#F1F5F9', color:'#475569', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex:1, padding:'12px', background:'linear-gradient(135deg,#1E3A8A,#2563EB)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', opacity:saving?0.6:1 }}>{saving ? 'Saving...' : editingRep ? 'Save Changes' : 'Add Rep'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN OFFICE MODAL */}
      {showAssignModal && assigningRep && (
        <div style={overlay}>
          <div style={{...modal, maxWidth:450}}>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>🏢 Assign Office to {assigningRep.name}</h2>
            <p style={{ fontSize:13, color:'#64748B', margin:'0 0 6px' }}>Commission: {assigningRep.commission_rate}% for {assigningRep.commission_duration_months} month(s)</p>
            {assigningRep.setup_fee_share_enabled && <p style={{ fontSize:12, color:'#B45309', margin:'0 0 16px' }}>Setup fee share enabled ({assigningRep.setup_fee_share_percent}%)</p>}
            <form onSubmit={handleAssign}>
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>Select Partner Office *</label>
                <select required value={assignForm.partner_id} onChange={e=>setAssignForm({...assignForm,partner_id:e.target.value})} style={inp}>
                  <option value="">— Select Office —</option>
                  {partners.filter(p=>p.status==='active').map(p => <option key={p.id} value={p.id}>{p.business_name} ({p.email})</option>)}
                </select>
              </div>
              {assigningRep.setup_fee_share_enabled && (
                <div style={{ marginBottom:16 }}>
                  <label style={lbl}>Setup Fee Amount ($)</label>
                  <input type="number" min="0" step="0.01" value={assignForm.setup_fee_amount} onChange={e=>setAssignForm({...assignForm,setup_fee_amount:Number(e.target.value)})} style={inp} placeholder="e.g. 49.90 for 10% of $499"/>
                  <p style={{ fontSize:11, color:'#94A3B8', marginTop:4 }}>Calculated: {assigningRep.setup_fee_share_percent}% of the package fee</p>
                </div>
              )}
              <div style={{ display:'flex', gap:12, marginTop:20 }}>
                <button type="button" onClick={()=>{setShowAssignModal(false);setAssigningRep(null);}} style={{ flex:1, padding:'12px', background:'#F1F5F9', color:'#475569', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex:1, padding:'12px', background:'linear-gradient(135deg,#059669,#10B981)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', opacity:saving?0.6:1 }}>{saving ? 'Assigning...' : 'Assign Office'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

import React from 'react';

const lbl = { display:'block', fontSize:13, fontWeight:600, color:'#334155', marginBottom:6 };
const inp = { width:'100%', padding:'10px 14px', fontSize:14, border:'2px solid #E2E8F0', borderRadius:8, outline:'none', boxSizing:'border-box', background:'#fff' };
const grid2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 };
const overlay = { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:20 };
const modal = { background:'#fff', borderRadius:16, padding:'28px', maxWidth:560, width:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 25px 50px rgba(0,0,0,0.3)' };
const btnStyle = (bg, color) => ({ padding:'6px 10px', background:bg, color, border:'none', borderRadius:6, fontSize:13, cursor:'pointer' });
