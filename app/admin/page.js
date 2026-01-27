"use client";
import React, { useState } from 'react';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async (pwd) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': pwd }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json);
        setAuthenticated(true);
      } else {
        setError('Invalid password');
      }
    } catch (e) {
      setError('Failed to load data');
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchData(password);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatMoney = (amount) => {
    return '$' + (amount || 0).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-emerald-500 text-white',
      completed: 'bg-emerald-500 text-white',
      pending_payment: 'bg-amber-500 text-white',
      draft: 'bg-slate-400 text-white',
    };
    return styles[status] || 'bg-slate-300 text-slate-700';
  };

  const getCategoryBadge = (category) => {
    const styles = {
      real_estate: 'bg-blue-500 text-white',
      banking: 'bg-green-500 text-white',
      tax: 'bg-purple-500 text-white',
      business: 'bg-orange-500 text-white',
      vehicle: 'bg-red-500 text-white',
      insurance: 'bg-cyan-500 text-white',
      legal_matters: 'bg-indigo-500 text-white',
    };
    return styles[category] || 'bg-slate-400 text-white';
  };

  const getServiceBadge = (service) => {
    const styles = {
      trust: 'bg-blue-600 text-white',
      business: 'bg-purple-600 text-white',
      immigration: 'bg-green-600 text-white',
    };
    return styles[service] || 'bg-slate-400 text-white';
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-slate-400 mt-2">Multi Servicios 360</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
          {error && <p className="text-red-400 mt-4 text-center text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  const { stats, poaMatters, limitedPoaMatters, waitlist } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="font-bold">M</span>
          </div>
          <div>
            <h1 className="font-bold">Multi Servicios</h1>
            <p className="text-xs text-slate-400">Admin Dashboard</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Overview
          </button>
          <button
            onClick={() => setActiveTab('general-poa')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'general-poa' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            General POA
            <span className="ml-auto bg-blue-500 text-xs px-2 py-1 rounded-full">{poaMatters.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('limited-poa')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'limited-poa' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            Limited POA
            <span className="ml-auto bg-purple-500 text-xs px-2 py-1 rounded-full">{limitedPoaMatters.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('waitlist')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'waitlist' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Waitlist
            <span className="ml-auto bg-emerald-500 text-xs px-2 py-1 rounded-full">{waitlist.length}</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Site
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === 'overview' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
              <p className="text-slate-500">Welcome back! Here is what is happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <span className="text-emerald-500 text-sm font-medium">+12%</span>
                </div>
                <p className="text-3xl font-bold text-slate-800">{stats.totalOrders}</p>
                <p className="text-slate-500 text-sm">Total Orders</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-emerald-500 text-sm font-medium">+8%</span>
                </div>
                <p className="text-3xl font-bold text-slate-800">{formatMoney(stats.totalRevenue)}</p>
                <p className="text-slate-500 text-sm">Total Revenue</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-800">{stats.pendingOrders}</p>
                <p className="text-slate-500 text-sm">Pending Orders</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-800">{stats.waitlistCount}</p>
                <p className="text-slate-500 text-sm">Waitlist Signups</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {[...poaMatters, ...limitedPoaMatters].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5).map((item, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-slate-600 font-medium">{item.client_name?.charAt(0) || '?'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{item.client_name}</p>
                      <p className="text-sm text-slate-500">{item.client_email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                        {item.status?.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">{formatDate(item.created_at)}</p>
                    </div>
                  </div>
                ))}
                {poaMatters.length === 0 && limitedPoaMatters.length === 0 && (
                  <div className="p-8 text-center text-slate-400">No recent activity</div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'general-poa' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">General POA Orders</h2>
              <p className="text-slate-500">{poaMatters.length} total orders</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-600">Client</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Tier</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Price</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {poaMatters.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-400">No orders yet</td></tr>
                  )}
                  {poaMatters.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{m.client_name?.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{m.client_name}</p>
                            <p className="text-sm text-slate-500">{m.client_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-700 capitalize">{m.review_tier?.replace('_', ' ')}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-800">{formatMoney(m.total_price)}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(m.status)}`}>
                          {m.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{formatDate(m.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'limited-poa' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Limited POA Orders</h2>
              <p className="text-slate-500">{limitedPoaMatters.length} total orders</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-600">Client</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Category</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Tier</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {limitedPoaMatters.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-400">No orders yet</td></tr>
                  )}
                  {limitedPoaMatters.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-medium">{m.client_name?.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{m.client_name}</p>
                            <p className="text-sm text-slate-500">{m.client_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadge(m.poa_category)}`}>
                          {m.poa_category?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-700 capitalize">{m.review_tier?.replace('_', ' ')}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(m.status)}`}>
                          {m.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{formatDate(m.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'waitlist' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Waitlist Signups</h2>
              <p className="text-slate-500">{waitlist.length} people waiting</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <p className="text-3xl font-bold text-blue-700">{waitlist.filter(w => w.service_key === 'trust').length}</p>
                <p className="text-blue-600">Living Trust</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                <p className="text-3xl font-bold text-purple-700">{waitlist.filter(w => w.service_key === 'business').length}</p>
                <p className="text-purple-600">Business Formation</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <p className="text-3xl font-bold text-green-700">{waitlist.filter(w => w.service_key === 'immigration').length}</p>
                <p className="text-green-600">Immigration</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-600">Contact</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Phone</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Service</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {waitlist.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400">No signups yet</td></tr>
                  )}
                  {waitlist.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-emerald-600 font-medium">{w.name?.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{w.name}</p>
                            <p className="text-sm text-slate-500">{w.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{w.phone || '-'}</td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getServiceBadge(w.service_key)}`}>
                          {w.service_key}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{formatDate(w.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}