'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('partner_id')) router.push('/portal/login');
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setMessage('');
    if (newPass.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPass !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/portal/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner_id: localStorage.getItem('partner_id'), current_password: current, new_password: newPass }),
      });
      const data = await res.json();
      if (data.success) { setMessage('Password updated successfully!'); setCurrent(''); setNewPass(''); setConfirm(''); }
      else setError(data.error || 'Failed to update password.');
    } catch { setError('Connection error. Please try again.'); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md border border-slate-700">
        <button onClick={() => router.push('/portal/dashboard')} className="text-slate-400 hover:text-white text-sm mb-6">Back to Dashboard</button>
        <h1 className="text-2xl font-bold text-white mb-6">Change Password</h1>
        {message && <div className="bg-emerald-500/20 text-emerald-400 rounded-lg p-3 mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-500/20 text-red-400 rounded-lg p-3 mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Current Password</label>
            <input type="password" value={current} onChange={e => setCurrent(e.target.value)} required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block">New Password</label>
            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Confirm New Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
