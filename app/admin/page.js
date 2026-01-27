"use client";
import React, { useState } from 'react';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

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
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const formatMoney = (amount) => {
    return '$' + (amount || 0).toLocaleString();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded mb-4"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      </div>
    );
  }

  const { stats, poaMatters, limitedPoaMatters, waitlist } = data;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Multi Servicios 360 - Admin Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">{formatMoney(stats.totalRevenue)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Pending Orders</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Waitlist Signups</p>
            <p className="text-3xl font-bold text-purple-600">{stats.waitlistCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">General POA Orders ({poaMatters.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Tier</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {poaMatters.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">No orders yet</td>
                  </tr>
                )}
                {poaMatters.map((m) => (
                  <tr key={m.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{m.client_name}</td>
                    <td className="p-3">{m.client_email}</td>
                    <td className="p-3">{m.review_tier}</td>
                    <td className="p-3">{formatMoney(m.total_price)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        m.status === 'paid' || m.status === 'completed' ? 'bg-green-100 text-green-800' :
                        m.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3">{formatDate(m.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Limited POA Orders ({limitedPoaMatters.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Tier</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {limitedPoaMatters.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">No orders yet</td>
                  </tr>
                )}
                {limitedPoaMatters.map((m) => (
                  <tr key={m.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{m.client_name}</td>
                    <td className="p-3">{m.client_email}</td>
                    <td className="p-3">{m.poa_category}</td>
                    <td className="p-3">{m.review_tier}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        m.status === 'paid' || m.status === 'completed' ? 'bg-green-100 text-green-800' :
                        m.status === 'draft' || m.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3">{formatDate(m.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Waitlist Signups ({waitlist.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Phone</th>
                  <th className="text-left p-3">Service</th>
                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">No signups yet</td>
                  </tr>
                )}
                {waitlist.map((w) => (
                  <tr key={w.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{w.name}</td>
                    <td className="p-3">{w.email}</td>
                    <td className="p-3">{w.phone || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        w.service_key === 'trust' ? 'bg-blue-100 text-blue-800' :
                        w.service_key === 'business' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {w.service_key}
                      </span>
                    </td>
                    <td className="p-3">{formatDate(w.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}