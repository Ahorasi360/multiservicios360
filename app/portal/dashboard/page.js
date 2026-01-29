
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

  useEffect(() => {
    const partnerId = localStorage.getItem('partner_id');
    const partnerName = localStorage.getItem('partner_name');
    
    if (!partnerId) {
      router.push('/portal/login');
      return;
    }

    setPartner({ id: partnerId, business_name: partnerName });
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

  const formatMoney = (amount) => {
    return '$' + (amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">MS</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-white">Partner Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">{partner?.business_name}</span>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome back, {partner?.business_name}!</h1>
          <p className="text-slate-400 mt-1">Here's your business overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Clients</p>
                <p className="text-3xl font-bold text-white mt-1">{stats?.totalClients || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Documents Created</p>
                <p className="text-3xl font-bold text-white mt-1">{stats?.totalDocuments || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">{formatMoney(stats?.totalEarnings)}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending Payout</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">{formatMoney(stats?.pendingPayout)}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push('/portal/clients')}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 border border-slate-700 text-left transition-colors"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Add New Client</h3>
            <p className="text-slate-400 text-sm mt-1">Register a new client to your portfolio</p>
          </button>

          <button
            onClick={() => router.push('/portal/new-document')}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 border border-slate-700 text-left transition-colors"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Start New Document</h3>
            <p className="text-slate-400 text-sm mt-1">Create POA for a client</p>
          </button>

          <button
            onClick={() => router.push('/portal/documents')}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 border border-slate-700 text-left transition-colors"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">View Documents</h3>
            <p className="text-slate-400 text-sm mt-1">Download completed documents</p>
          </button>
        </div>

        {/* Recent Clients */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Recent Clients</h2>
            <button
              onClick={() => router.push('/portal/clients')}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View all →
            </button>
          </div>
          
          {recentClients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-slate-400">No clients yet</p>
              <button
                onClick={() => router.push('/portal/clients')}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add your first client
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {recentClients.map((client) => (
                <div key={client.id} className="p-4 flex items-center justify-between hover:bg-slate-700/50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {client.client_name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-white font-medium">{client.client_name}</p>
                      <p className="text-slate-400 text-sm">{client.client_email || client.client_phone}</p>
                    </div>
                  </div>
                  <span className="text-slate-500 text-sm">
                    {new Date(client.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/portal/clients')}
            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-white transition-colors"
          >
            My Clients
          </button>
          <button
            onClick={() => router.push('/portal/documents')}
            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-white transition-colors"
          >
            Documents
          </button>
          <button
            onClick={() => router.push('/portal/earnings')}
            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-white transition-colors"
          >
            Earnings
          </button>
          <button
            onClick={() => router.push('/portal/new-document')}
            className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg text-white transition-colors"
          >
            + New Document
          </button>
        </div>
      </div>
    </div>
  );
}