// app/admin/resources/page.js
'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminResourcesPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Upload form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('flyers');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/stats', { headers: { 'x-admin-password': password } });
      if (res.ok) { setAuthenticated(true); localStorage.setItem('adminPassword', password); fetchResources(); }
      else setMessage('❌ Invalid password');
    } catch { setMessage('❌ Connection error'); }
  };

  useEffect(() => {
    const saved = localStorage.getItem('adminPassword');
    if (saved) { setPassword(saved); setAuthenticated(true); fetchResources(saved); }
  }, []);

  async function fetchResources(pw) {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/resources', { headers: { 'x-admin-password': pw || password } });
      const data = await res.json();
      if (data.success) setResources(data.resources || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file || !title) { setMessage('❌ Title and file are required'); return; }
    setUploading(true); setMessage('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('admin_password', password);
    try {
      const res = await fetch('/api/admin/resources', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Resource uploaded successfully!');
        setTitle(''); setDescription(''); setFile(null);
        const fi = document.getElementById('resource-file-input'); if (fi) fi.value = '';
        fetchResources();
      } else { setMessage('❌ ' + (data.error || 'Upload failed')); }
    } catch (err) { setMessage('❌ ' + err.message); }
    setUploading(false);
    setTimeout(() => setMessage(''), 4000);
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch('/api/admin/resources', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) { setMessage('✅ Deleted'); fetchResources(); }
      else { setMessage('❌ ' + (data.error || 'Failed')); }
    } catch (err) { setMessage('❌ ' + err.message); }
    setTimeout(() => setMessage(''), 3000);
  }

  const categories = {
    flyers: { label: 'Flyers', icon: '📄' },
    posters: { label: 'Posters', icon: '🖼️' },
    brochures: { label: 'Brochures', icon: '📰' },
    social_media: { label: 'Social Media', icon: '📱' },
    training: { label: 'Training', icon: '📚' },
    general: { label: 'General', icon: '📋' },
  };

  const formatSize = (bytes) => bytes > 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + ' MB' : Math.round(bytes / 1024) + ' KB';
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F172A,#1E3A8A)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '40px 36px', maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 20px' }}>Admin Resources</h1>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setMessage(''); }} placeholder="Admin password"
              style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '2px solid #E2E8F0', borderRadius: 10, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
            {message && <p style={{ color: '#EF4444', fontSize: 14, marginBottom: 12 }}>{message}</p>}
            <button type="submit" style={{ width: '100%', padding: 12, background: '#1E3A8A', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Marketing Resources">
      {message && (
        <div style={{
          background: message.startsWith('✅') ? '#DCFCE7' : '#FEE2E2',
          border: `1px solid ${message.startsWith('✅') ? '#22C55E' : '#EF4444'}`,
          borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14,
        }}>{message}</div>
      )}

      {/* Upload Section */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>📤 Upload New Resource</h2>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>Upload flyers, posters, and marketing materials. All active partner offices will see these.</p>
        <form onSubmit={handleUpload}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={lbl}>Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. POA Service Flyer" style={inp} />
            </div>
            <div>
              <label style={lbl}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={inp}>
                {Object.entries(categories).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>File (PDF, Image, etc.) *</label>
              <input id="resource-file-input" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.pptx" onChange={e => setFile(e.target.files[0])} style={{ ...inp, padding: '9px 12px' }} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Description (optional)</label>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the resource" style={inp} />
          </div>
          <button type="submit" disabled={uploading || !file || !title} style={{
            padding: '12px 28px', background: uploading || !file || !title ? '#94A3B8' : 'linear-gradient(135deg,#1E3A8A,#2563EB)',
            color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: uploading || !file || !title ? 'not-allowed' : 'pointer',
          }}>{uploading ? '⏳ Uploading...' : '📤 Upload Resource'}</button>
        </form>
      </div>

      {/* Resources List */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>📦 All Resources ({resources.length})</h2>
          <button onClick={() => fetchResources()} style={{ padding: '6px 14px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>↻ Refresh</button>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading...</div>
        ) : resources.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>No resources uploaded yet</div>
        ) : (
          <div>
            {resources.map(r => {
              const cat = categories[r.category] || categories.general;
              return (
                <div key={r.id} style={{ padding: '16px 24px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, background: '#F1F5F9', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{cat.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{r.title}</div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>
                        {cat.label} • {r.file_name} • {formatSize(r.file_size)} • {fmtDate(r.created_at)}
                      </div>
                      {r.description && <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{r.description}</div>}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(r.id, r.title)} style={{
                    padding: '6px 14px', background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA',
                    borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>🗑 Delete</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

const lbl = { display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 };
const inp = { width: '100%', padding: '11px 14px', fontSize: 14, border: '2px solid #E2E8F0', borderRadius: 8, outline: 'none', boxSizing: 'border-box', background: '#fff' };
