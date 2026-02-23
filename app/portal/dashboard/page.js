// app/portal/dashboard/page.js

"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PartnerDashboard() {
  const router = useRouter();
  const [partner, setPartner] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentClients, setRecentClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState('');

  useEffect(() => {
    const partnerId = localStorage.getItem('partner_id');
    const partnerName = localStorage.getItem('partner_name');
    
    if (!partnerId) {
      router.push('/portal/login');
      return;
    }

    const commissionRate = localStorage.getItem('partner_commission_rate') || '20';
    setPartner({ id: partnerId, business_name: partnerName, commission_rate: commissionRate });
    fetchDashboardData(partnerId);
  }, []);

  const fetchDashboardData = async (partnerId) => {
    try {
      const res = await fetch(`/api/portal/stats?partner_id=${partnerId}`);
      const data = await res.json();
      
      if (data.success) {
        setStats(data.stats);
        setRecentClients(data.recentClients || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('partner_token');
    localStorage.removeItem('partner_id');
    localStorage.removeItem('partner_name');
    router.push('/portal/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) { setPwMessage('❌ Passwords do not match'); return; }
    if (newPw.length < 6) { setPwMessage('❌ Password must be at least 6 characters'); return; }
    setPwSaving(true);
    try {
      const res = await fetch('/api/portal/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner_id: partner.id, current_password: currentPw, new_password: newPw }),
      });
      const data = await res.json();
      if (data.success) {
        setPwMessage('✅ Password updated successfully');
        setTimeout(() => { setShowPwModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); setPwMessage(''); }, 1500);
      } else { setPwMessage('❌ ' + (data.error || 'Failed to update')); }
    } catch (err) { setPwMessage('❌ Error: ' + err.message); }
    setPwSaving(false);
  };

  const formatMoney = (amount) => {
    return '$' + (amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Professional Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">MS</span>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-slate-800">Multi Servicios 360</h1>
                  <p className="text-xs text-slate-500">Partner Portal</p>
                </div>
              </div>
            </div>

            {/* Contact & User */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center text-sm text-slate-600">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:8552467274" className="hover:text-blue-600 font-medium">(855) 246-7274</a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-800">{partner?.business_name}</p>
                  <p className="text-xs text-slate-500">Partner Account</p>
                </div>
                <button
                  onClick={() => setShowPwModal(true)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  🔑 Password
                </button>
                <button
                  onClick={() => window.location.href = '/portal/membership'}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  💳 Membership
                </button>
                <button
                  onClick={() => router.push('/portal/change-password')}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  🔒 Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button
              onClick={() => router.push('/portal/dashboard')}
              className="px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/portal/clients')}
              className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300"
            >
              My Clients
            </button>
            <button
              onClick={() => router.push('/portal/documents')}
              className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300"
            >
              Documents
            </button>
            <button
              onClick={() => router.push('/portal/earnings')}
              className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300"
            >
              Earnings
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Welcome back, {partner?.business_name}!</h2>
          <p className="text-slate-600 mt-1">Here's an overview of your business performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Clients</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats?.totalClients || 0}</p>
                <p className="text-xs text-slate-400 mt-1">Registered clients</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Documents Created</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats?.totalDocuments || 0}</p>
               <p className="text-xs text-slate-400 mt-1">POAs, Trusts, LLCs & Legal docs</p>              </div>
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Earnings</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{formatMoney(stats?.totalEarnings)}</p>
                <p className="text-xs text-slate-400 mt-1">Lifetime commissions</p>
              </div>
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Payout</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{formatMoney(stats?.pendingPayout)}</p>
                <p className="text-xs text-slate-400 mt-1">Next payment cycle</p>
              </div>
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/portal/clients')}
                  className="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div className="ml-4 text-left">
                    <p className="font-medium text-slate-800">Add New Client</p>
                    <p className="text-xs text-slate-500">Register a new client</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/portal/new-document')}
                  className="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="ml-4 text-left">
                    <p className="font-medium text-slate-800">Create Document</p>
                    <p className="text-xs text-slate-500">Start a new document</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/portal/earnings')}
                  className="w-full flex items-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4 text-left">
                    <p className="font-medium text-slate-800">View Earnings</p>
                    <p className="text-xs text-slate-500">Track commissions</p>
                  </div>
                </button>
              </div>

              {/* Commission Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Your Commission Rate</p>
                    <p className="text-3xl font-bold">{partner?.commission_rate || 20}%</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-blue-100 text-xs mt-2">On every completed document</p>
              </div>
            </div>
          </div>

          {/* Recent Clients */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Recent Clients</h3>
                  <p className="text-sm text-slate-500">Your latest registered clients</p>
                </div>
                <button
                  onClick={() => router.push('/portal/clients')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all →
                </button>
              </div>
              
              {recentClients.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-slate-800 font-medium mb-1">No clients yet</h4>
                  <p className="text-slate-500 text-sm mb-4">Start by adding your first client</p>
                  <button
                    onClick={() => router.push('/portal/clients')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Add your first client
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentClients.map((client) => (
                    <div key={client.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-lg">
                            {client.client_name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-slate-800">{client.client_name}</p>
                          <p className="text-sm text-slate-500">{client.client_email || client.client_phone || 'No contact info'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">
                          {new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <button
                          onClick={() => router.push(`/portal/new-document?client_id=${client.id}`)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Create doc →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span>© 2026 Multi Servicios 360</span>
              <span>•</span>
              <a href="tel:8552467274" className="hover:text-blue-600">(855) 246-7274</a>
              <span>•</span>
              <a href="https://multiservicios360.net" className="hover:text-blue-600">multiservicios360.net</a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/terms" className="hover:text-blue-600">Terms</a>
              <a href="/privacy" className="hover:text-blue-600">Privacy</a>
              <a href="mailto:support@multiservicios360.net" className="hover:text-blue-600">Support</a>
            </div>
          </div>
        </footer>
      </main>

      {/* CHANGE PASSWORD MODAL */}
      {showPwModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-slate-800 mb-4">🔑 Change Password</h2>
            {pwMessage && <p className={`text-sm mb-3 ${pwMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{pwMessage}</p>}
            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-600 mb-1">Current Password</label>
                <input type="password" required value={currentPw} onChange={e=>setCurrentPw(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none" />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
                <input type="password" required value={newPw} onChange={e=>setNewPw(e.target.value)} minLength={6}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none" />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-600 mb-1">Confirm New Password</label>
                <input type="password" required value={confirmPw} onChange={e=>setConfirmPw(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={()=>{setShowPwModal(false);setCurrentPw('');setNewPw('');setConfirmPw('');setPwMessage('');}}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200">Cancel</button>
                <button type="submit" disabled={pwSaving}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
                  {pwSaving ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}