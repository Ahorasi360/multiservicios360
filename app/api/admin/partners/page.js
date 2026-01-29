"use client";
import { useState, useEffect } from 'react';

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    email: '', password: '', business_name: '', contact_name: '',
    phone: '', partner_type: 'tax_preparer', tier: 'referral',
    commission_rate: 20, status: 'active'
  });

  useEffect(() => { fetchPartners(); }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/admin/partners');
      const data = await res.json();
      if (data.success) setPartners(data.partners);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Partner added!');
      setShowModal(false);
      fetchPartners();
    } else {
      setMessage(data.error || 'Error');
    }
  };

  const updateStatus = async (id, status) => {
    await fetch('/api/admin/partners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    fetchPartners();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Partner Management</h1>
            <p className="text-slate-600">Multi Servicios 360 Admin</p>
          </div>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Add Partner
          </button>
        </div>

        {message && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">{message}</div>}

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-2xl font-bold">{partners.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-slate-500">Active</p>
            <p className="text-2xl font-bold text-green-600">{partners.filter(p => p.status === 'active').length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{partners.filter(p => p.status === 'pending').length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-slate-500">Suspended</p>
            <p className="text-2xl font-bold text-red-600">{partners.filter(p => p.status === 'suspended').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Business</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Contact</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Tier</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Commission</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {partners.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-medium">{p.business_name}</p>
                    <p className="text-sm text-slate-500">{p.email}</p>
                  </td>
                  <td className="p-4">{p.contact_name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{p.tier}</span>
                  </td>
                  <td className="p-4">{p.commission_rate}%</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${p.status === 'active' ? 'bg-green-100 text-green-800' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {p.status === 'pending' && <button onClick={() => updateStatus(p.id, 'active')} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm mr-2">Approve</button>}
                    {p.status === 'active' && <button onClick={() => updateStatus(p.id, 'suspended')} className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">Suspend</button>}
                    {p.status === 'suspended' && <button onClick={() => updateStatus(p.id, 'active')} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">Reactivate</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Partner</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Business Name *" required value={form.business_name} onChange={e => setForm({...form, business_name: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="text" placeholder="Contact Name *" required value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="email" placeholder="Email *" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="password" placeholder="Password *" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-2 border rounded-lg" />
              <select value={form.tier} onChange={e => setForm({...form, tier: e.target.value})} className="w-full p-2 border rounded-lg">
                <option value="referral">Referral (20% Commission)</option>
                <option value="wholesale">Wholesale</option>
                <option value="white_label">White Label</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 p-2 border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 p-2 bg-blue-600 text-white rounded-lg">Add Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}