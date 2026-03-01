// app/admin/vault/page.js
'use client';

import { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminVaultPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [uploadFile, setUploadFile] = useState(null);
  const [matterId, setMatterId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [docType, setDocType] = useState('articles_of_org');
  const [language, setLanguage] = useState('en');
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password === 'MS360Admin2026!') {
      setAuthenticated(true);
      fetchVaults();
    } else {
      try {
        const res = await fetch('/api/admin/stats', { headers: { 'x-admin-password': password } });
        if (res.ok) { setAuthenticated(true); fetchVaults(); }
        else setMessage('❌ Invalid password');
      } catch { setMessage('❌ Invalid password'); }
    }
  };

  const fetchVaults = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/vaults', { headers: { 'x-admin-password': password || 'MS360Admin2026!' } });
      if (res.ok) { const data = await res.json(); setVaults(data.vaults || []); }
    } catch (err) { console.error('Failed to fetch vaults:', err); }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) { setMessage('❌ Please select a file'); return; }
    setUploading(true); setMessage('');
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('document_type', docType);
    formData.append('language', language);
    if (matterId) formData.append('matter_id', matterId);
    if (clientName) formData.append('client_name', clientName);
    if (clientEmail) formData.append('client_email', clientEmail);
    try {
      const res = await fetch('/api/vault/upload', { method: 'POST', headers: { Authorization: 'Bearer ms360-admin-key-2026' }, body: formData });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Uploaded! Vault link: ${data.vault_url}`);
        setUploadFile(null); setMatterId(''); setClientName(''); setClientEmail('');
        fetchVaults();
        const fi = document.getElementById('vault-file-input'); if (fi) fi.value = '';
      } else setMessage(`❌ Error: ${data.error}`);
    } catch (err) { setMessage(`❌ Upload failed: ${err.message}`); }
    setUploading(false);
  };

  const copyLink = (token) => {
    navigator.clipboard.writeText(`https://multiservicios360.net/vault?code=${token}`);
    setMessage('📋 Copied!'); setTimeout(() => setMessage(''), 2000);
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';

  const filtered = vaults.filter((v) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (v.client_name||'').toLowerCase().includes(s) || (v.client_email||'').toLowerCase().includes(s);
  });

  if (!authenticated) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0F172A,#1E3A8A,#0F172A)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <div style={{ background:'#fff', borderRadius:16, padding:'40px 36px', maxWidth:400, width:'100%', boxShadow:'0 25px 50px rgba(0,0,0,0.3)', textAlign:'center' }}>
          <div style={{ width:56, height:56, background:'linear-gradient(135deg,#1E3A8A,#3B82F6)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:15, fontWeight:800, color:'#fff' }}>M360</div>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>Admin Panel</h1>
          <p style={{ fontSize:14, color:'#64748B', margin:'0 0 24px' }}>Multi Servicios 360</p>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value);setMessage('');}} placeholder="Enter admin password"
              style={{ width:'100%', padding:'12px 14px', fontSize:15, border:'2px solid #E2E8F0', borderRadius:10, outline:'none', boxSizing:'border-box', marginBottom:12 }} />
            {message && <p style={{ color:'#EF4444', fontSize:14, margin:'0 0 12px' }}>{message}</p>}
            <button type="submit" style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#1E3A8A,#2563EB)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer' }}>Sign In</button>
          </form>
          <p style={{ fontSize:12, color:'#94A3B8', margin:'20px 0 0' }}>Multi Servicios 360 © 2026</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Vault Manager">
      <div style={{ display:'flex', gap:4, marginBottom:20 }}>
        {[{id:'upload',label:'📤 Upload Document'},{id:'vaults',label:'🔒 All Vaults'}].map((tab) => (
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{
            padding:'10px 20px', background:activeTab===tab.id?'#1E3A8A':'#fff',
            color:activeTab===tab.id?'#fff':'#475569', border:activeTab===tab.id?'none':'1px solid #E2E8F0',
            borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer',
          }}>{tab.label}</button>
        ))}
      </div>

      {message && (
        <div style={{
          background:message.startsWith('✅')||message.startsWith('📋')?'#DCFCE7':'#FEE2E2',
          border:`1px solid ${message.startsWith('✅')||message.startsWith('📋')?'#22C55E':'#EF4444'}`,
          borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:14, wordBreak:'break-all',
        }}>{message}</div>
      )}

      {activeTab === 'upload' && (
        <div style={{ background:'#fff', borderRadius:12, padding:'28px 24px', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize:18, fontWeight:700, color:'#0F172A', margin:'0 0 20px' }}>Upload Document to Client Vault</h2>
          <form onSubmit={handleUpload}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:16 }}>
              <div><label style={lbl}>Client Name</label><input type="text" value={clientName} onChange={(e)=>setClientName(e.target.value)} placeholder="John Doe" style={inp}/></div>
              <div><label style={lbl}>Client Email</label><input type="email" value={clientEmail} onChange={(e)=>setClientEmail(e.target.value)} placeholder="john@email.com" style={inp}/></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:16 }}>
              <div><label style={lbl}>Matter ID <span style={{color:'#94A3B8',fontWeight:400}}>(optional)</span></label><input type="text" value={matterId} onChange={(e)=>setMatterId(e.target.value)} placeholder="Links to existing vault" style={inp}/></div>
              <div><label style={lbl}>Document Type</label>
                <select value={docType} onChange={(e)=>setDocType(e.target.value)} style={inp}>
                  <optgroup label="Government / Filed"><option value="articles_of_org">Articles of Organization</option><option value="ein_letter">EIN Confirmation Letter</option><option value="sos_filing">Secretary of State Filing</option><option value="amendment">Amendment</option><option value="certificate">Certificate</option></optgroup>
                  <optgroup label="Generated"><option value="poa_general">General POA</option><option value="poa_limited">Limited POA</option><option value="living_trust">Living Trust</option><option value="operating_agreement">Operating Agreement</option></optgroup>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:20 }}>
              <div><label style={lbl}>Language</label><select value={language} onChange={(e)=>setLanguage(e.target.value)} style={inp}><option value="en">English</option><option value="es">Spanish</option></select></div>
              <div><label style={lbl}>File (PDF)</label><input id="vault-file-input" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e)=>setUploadFile(e.target.files[0])} style={{...inp,padding:'10px 12px'}}/></div>
            </div>
            <button type="submit" disabled={uploading||!uploadFile} style={{
              padding:'14px 32px', background:uploading||!uploadFile?'#94A3B8':'linear-gradient(135deg,#1E3A8A,#2563EB)',
              color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:600, cursor:uploading||!uploadFile?'not-allowed':'pointer',
            }}>{uploading?'⏳ Uploading...':'📤 Upload to Vault'}</button>
          </form>
        </div>
      )}

      {activeTab === 'vaults' && (
        <div>
          <input type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search by name or email..." style={{...inp,maxWidth:400,marginBottom:16}}/>
          {loading ? <div style={{textAlign:'center',padding:40,color:'#64748B'}}>Loading...</div>
          : filtered.length === 0 ? <div style={{background:'#fff',borderRadius:12,padding:40,textAlign:'center',color:'#64748B',boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>{searchTerm?'No matches':'No vaults yet'}</div>
          : <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {filtered.map((v) => (
                <div key={v.id} style={{background:'#fff',borderRadius:12,padding:'18px 20px',boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',flexWrap:'wrap',gap:12}}>
                    <div>
                      <h3 style={{fontSize:16,fontWeight:600,color:'#0F172A',margin:'0 0 4px'}}>{v.client_name||'Unknown'}</h3>
                      <p style={{fontSize:13,color:'#64748B',margin:'0 0 8px'}}>{v.client_email||'No email'} • {fmt(v.created_at)} • {v.document_count||0} docs{v.access_count>0?` • ${v.access_count}x accessed`:''}</p>
                      <div style={{display:'flex',gap:6}}>
                        {v.service_type&&<span style={{background:'#EFF6FF',color:'#1E3A8A',padding:'3px 10px',borderRadius:6,fontSize:12,fontWeight:600}}>{v.service_type}</span>}
                        <span style={{background:new Date(v.expires_at)>new Date()?'#DCFCE7':'#FEE2E2',color:new Date(v.expires_at)>new Date()?'#166534':'#991B1B',padding:'3px 10px',borderRadius:6,fontSize:12,fontWeight:600}}>
                          {new Date(v.expires_at)>new Date()?`Exp ${fmt(v.expires_at)}`:'Expired'}
                        </span>
                      </div>
                    </div>
                    <button onClick={()=>copyLink(v.token)} style={{padding:'8px 16px',background:'#EFF6FF',color:'#1E3A8A',border:'1px solid #BFDBFE',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>📋 Copy Link</button>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      )}
    </AdminLayout>
  );
}

const lbl = {display:'block',fontSize:13,fontWeight:600,color:'#334155',marginBottom:6};
const inp = {width:'100%',padding:'11px 14px',fontSize:14,border:'2px solid #E2E8F0',borderRadius:8,outline:'none',boxSizing:'border-box',background:'#fff'};
