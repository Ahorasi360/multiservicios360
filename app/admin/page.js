"use client";
import React, { useState } from 'react';

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, sans-serif' },
  loginContainer: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b' },
  loginBox: { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  loginTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' },
  input: { width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '16px', fontSize: '16px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  error: { color: '#ef4444', textAlign: 'center', marginTop: '16px' },
  header: { backgroundColor: '#1e293b', color: '#fff', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: '20px', fontWeight: 'bold' },
  backLink: { color: '#94a3b8', textDecoration: 'none', fontSize: '14px' },
  main: { padding: '32px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' },
  statCard: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  statNumber: { fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' },
  statLabel: { color: '#64748b', fontSize: '14px' },
  table: { width: '100%', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  tableHeader: { padding: '16px 24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
  tableTitle: { fontSize: '18px', fontWeight: '600', margin: 0 },
  th: { textAlign: 'left', padding: '12px 24px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '16px 24px', borderBottom: '1px solid #f1f5f9' },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  activeTab: { backgroundColor: '#3b82f6', color: '#fff' },
  inactiveTab: { backgroundColor: '#fff', color: '#64748b' },
};

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
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatMoney = (amount) => '$' + (amount || 0).toLocaleString();

  const getBadgeStyle = (status) => {
    const colors = {
      paid: { backgroundColor: '#dcfce7', color: '#166534' },
      completed: { backgroundColor: '#dcfce7', color: '#166534' },
      pending_payment: { backgroundColor: '#fef3c7', color: '#92400e' },
      draft: { backgroundColor: '#f1f5f9', color: '#475569' },
    };
    return { ...styles.badge, ...(colors[status] || colors.draft) };
  };

  const getServiceStyle = (service) => {
    const colors = {
      trust: { backgroundColor: '#dbeafe', color: '#1e40af' },
      business: { backgroundColor: '#f3e8ff', color: '#7c3aed' },
      immigration: { backgroundColor: '#dcfce7', color: '#166534' },
    };
    return { ...styles.badge, ...(colors[service] || {}) };
  };

  if (!authenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h1 style={styles.loginTitle}>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  const { stats, poaMatters, limitedPoaMatters, waitlist } = data;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Multi Servicios 360 - Admin</h1>
        <a href="/" style={styles.backLink}>← Back to Site</a>
      </header>

      <main style={styles.main}>
        <div style={styles.tabs}>
          {['overview', 'general-poa', 'limited-poa', 'waitlist'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : styles.inactiveTab) }}
            >
              {tab === 'overview' ? 'Overview' : tab === 'general-poa' ? `General POA (${poaMatters.length})` : tab === 'limited-poa' ? `Limited POA (${limitedPoaMatters.length})` : `Waitlist (${waitlist.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={{ ...styles.statNumber, color: '#3b82f6' }}>{stats.totalOrders}</div>
                <div style={styles.statLabel}>Total Orders</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statNumber, color: '#10b981' }}>{formatMoney(stats.totalRevenue)}</div>
                <div style={styles.statLabel}>Total Revenue</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statNumber, color: '#f59e0b' }}>{stats.pendingOrders}</div>
                <div style={styles.statLabel}>Pending Orders</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statNumber, color: '#8b5cf6' }}>{stats.waitlistCount}</div>
                <div style={styles.statLabel}>Waitlist Signups</div>
              </div>
            </div>

            <div style={styles.table}>
              <div style={styles.tableHeader}>
                <h2 style={styles.tableTitle}>Recent Activity</h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[...poaMatters.map(m => ({...m, type: 'General POA'})), ...limitedPoaMatters.map(m => ({...m, type: 'Limited POA'}))].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10).map((item) => (
                    <tr key={item.id}>
                      <td style={styles.td}>{item.client_name}</td>
                      <td style={styles.td}>{item.client_email}</td>
                      <td style={styles.td}>{item.type}</td>
                      <td style={styles.td}><span style={getBadgeStyle(item.status)}>{item.status?.replace('_', ' ')}</span></td>
                      <td style={styles.td}>{formatDate(item.created_at)}</td>
                    </tr>
                  ))}
                  {poaMatters.length === 0 && limitedPoaMatters.length === 0 && (
                    <tr><td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8' }}>No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'general-poa' && (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <h2 style={styles.tableTitle}>General POA Orders</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Tier</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {poaMatters.map((m) => (
                  <tr key={m.id}>
                    <td style={styles.td}>{m.client_name}</td>
                    <td style={styles.td}>{m.client_email}</td>
                    <td style={styles.td}>{m.review_tier?.replace('_', ' ')}</td>
                    <td style={styles.td}>{formatMoney(m.total_price)}</td>
                    <td style={styles.td}><span style={getBadgeStyle(m.status)}>{m.status?.replace('_', ' ')}</span></td>
                    <td style={styles.td}>{formatDate(m.created_at)}</td>
                  </tr>
                ))}
                {poaMatters.length === 0 && (
                  <tr><td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8' }}>No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'limited-poa' && (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <h2 style={styles.tableTitle}>Limited POA Orders</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Tier</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {limitedPoaMatters.map((m) => (
                  <tr key={m.id}>
                    <td style={styles.td}>{m.client_name}</td>
                    <td style={styles.td}>{m.client_email}</td>
                    <td style={styles.td}>{m.poa_category?.replace('_', ' ')}</td>
                    <td style={styles.td}>{m.review_tier?.replace('_', ' ')}</td>
                    <td style={styles.td}><span style={getBadgeStyle(m.status)}>{m.status?.replace('_', ' ')}</span></td>
                    <td style={styles.td}>{formatDate(m.created_at)}</td>
                  </tr>
                ))}
                {limitedPoaMatters.length === 0 && (
                  <tr><td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8' }}>No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'waitlist' && (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <h2 style={styles.tableTitle}>Waitlist Signups</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((w) => (
                  <tr key={w.id}>
                    <td style={styles.td}>{w.name}</td>
                    <td style={styles.td}>{w.email}</td>
                    <td style={styles.td}>{w.phone || '-'}</td>
                    <td style={styles.td}><span style={getServiceStyle(w.service_key)}>{w.service_key}</span></td>
                    <td style={styles.td}>{formatDate(w.created_at)}</td>
                  </tr>
                ))}
                {waitlist.length === 0 && (
                  <tr><td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8' }}>No signups yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}