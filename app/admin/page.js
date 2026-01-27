"use client";
import React, { useState, useEffect } from 'react';

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

        {/* Stats Cards */}
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

        {/* General POA Table */}
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
                {poaMatters.length === 0 ? (
                  <tr><td colSpan="6" className="p-4 text-center text-gray-500">No orders yet</td></tr>
                ) : (
                  poaMatters.map((m) => (
                    <tr key={m.id} className="border-t hover:bg-gray-50">