"use client";
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [updating, setUpdating] = useState(false);

  const fetchData = async (pwd) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': pwd || password }
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

  const refreshData = () => fetchData(password);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatMoney = (amount) => '$' + (amount || 0).toLocaleString();

  const exportToCSV = (dataArray, filename) => {
    if (!dataArray || dataArray.length === 0) return alert('No data to export');
    const headers = Object.keys(dataArray[0]);
    const csv = [
      headers.join(','),
      ...dataArray.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filterBySearch = (items) => {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item => 
      item.client_name?.toLowerCase().includes(term) ||
      item.client_email?.toLowerCase().includes(term) ||
      item.name?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term)
    );
  };

  const filterByStatus = (items) => {
    if (statusFilter === 'all') return items;
    return items.filter(item => item.status === statusFilter);
  };

  const filterByDate = (items) => {
    if (!dateRange.start && !dateRange.end) return items;
    return items.filter(item => {
      const date = new Date(item.created_at);
      if (dateRange.start && date < new Date(dateRange.start)) return false;
      if (dateRange.end && date > new Date(dateRange.end + 'T23:59:59')) return false;
      return true;
    });
  };

  const applyFilters = (items) => filterByDate(filterByStatus(filterBySearch(items)));

  const calculateFilteredRevenue = () => {
    if (!data) return 0;
    const poa = applyFilters(data.poaMatters).filter(m => m.status === 'paid' || m.status === 'completed');
    const limited = applyFilters(data.limitedPoaMatters).filter(m => m.status === 'paid' || m.status === 'completed');
    const trust = applyFilters(data.trustMatters || []).filter(m => m.status === 'paid' || m.status === 'completed');
    const llc = applyFilters(data.llcMatters || []).filter(m => m.status === 'paid' || m.status === 'completed');
    const simple = applyFilters(data.simpleDocMatters || []).filter(m => m.status === 'paid' || m.status === 'completed');
    return poa.reduce((sum, m) => sum + (m.total_price || 0), 0) + limited.reduce((sum, m) => sum + (m.total_price || 0), 0) + trust.reduce((sum, m) => sum + (m.total_price || 0), 0) + llc.reduce((sum, m) => sum + (m.total_price || 0), 0) + simple.reduce((sum, m) => sum + (m.total_price || 0), 0);
  };

  // Styles
  const s = {
    container: { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    loginBg: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' },
    loginCard: { backgroundColor: '#fff', padding: '48px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' },
    logoBox: { width: '80px', height: '80px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 40px rgba(59,130,246,0.3)' },
    logoText: { color: '#fff', fontSize: '28px', fontWeight: 'bold' },
    loginTitle: { fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '8px', color: '#0f172a' },
    loginSubtitle: { textAlign: 'center', color: '#64748b', marginBottom: '32px', fontSize: '15px' },
    input: { width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', marginBottom: '16px', fontSize: '16px', boxSizing: 'border-box', transition: 'border-color 0.2s', outline: 'none' },
    btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' },
    error: { color: '#ef4444', textAlign: 'center', marginTop: '16px', fontSize: '14px' },
    
    // Header
    header: { background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)', color: '#fff', padding: '0' },
    headerTop: { padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    headerContent: { maxWidth: '1400px', margin: '0 auto' },
    headerFlex: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '16px' },
    logoSmall: { width: '50px', height: '50px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' },
    brandText: { fontSize: '22px', fontWeight: '700' },
    brandSub: { fontSize: '13px', color: '#94a3b8' },
    contactInfo: { display: 'flex', gap: '24px', fontSize: '13px', color: '#cbd5e1' },
    contactItem: { display: 'flex', alignItems: 'center', gap: '8px' },
    
    // Welcome Banner
    welcomeBanner: { padding: '32px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(29,78,216,0.05) 100%)', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    welcomeText: { maxWidth: '1400px', margin: '0 auto' },
    welcomeTitle: { fontSize: '28px', fontWeight: '700', marginBottom: '8px' },
    welcomeSub: { color: '#94a3b8', fontSize: '15px' },
    
    // Navigation
    nav: { padding: '0 32px', backgroundColor: 'rgba(0,0,0,0.2)' },
    navInner: { maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '4px' },
    navBtn: { padding: '16px 24px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '14px', fontWeight: '500', cursor: 'pointer', borderBottom: '3px solid transparent', transition: 'all 0.2s' },
    navBtnActive: { color: '#fff', borderBottomColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)' },
    navCount: { marginLeft: '8px', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.2)' },
    
    // Main Content
    main: { maxWidth: '1400px', margin: '0 auto', padding: '32px' },
    
    // Filters
    filtersBar: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' },
    searchInput: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', width: '250px', backgroundColor: '#fff' },
    select: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', backgroundColor: '#fff', cursor: 'pointer' },
    dateInput: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', backgroundColor: '#fff' },
    exportBtn: { padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    refreshBtn: { padding: '10px 20px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
    
    // Stats
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' },
    statCard: { backgroundColor: '#fff', padding: '28px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
    statIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '24px' },
    statNumber: { fontSize: '36px', fontWeight: '700', marginBottom: '4px' },
    statLabel: { color: '#64748b', fontSize: '14px', fontWeight: '500' },
    
    // Table
    tableWrap: { backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' },
    tableHeader: { padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    tableTitle: { fontSize: '18px', fontWeight: '600', margin: 0, color: '#0f172a' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '14px 24px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    td: { padding: '18px 24px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' },
    badge: { display: 'inline-block', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' },
    actionBtn: { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', fontSize: '12px', cursor: 'pointer', marginRight: '8px', transition: 'all 0.2s' },
    deleteBtn: { padding: '8px 12px', border: 'none', borderRadius: '6px', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '12px', cursor: 'pointer' },
    
    // Modal
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    modal: { backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' },
    modalHeader: { padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { fontSize: '20px', fontWeight: '600', margin: 0 },
    closeBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' },
    modalBody: { padding: '24px' },
    modalFooter: { padding: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' },
    detailRow: { display: 'flex', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
    detailLabel: { width: '140px', fontWeight: '600', color: '#64748b', fontSize: '13px' },
    detailValue: { flex: 1, color: '#0f172a', fontSize: '14px' },
    statusSelect: { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' },
  };

  const getBadgeStyle = (status) => {
    const colors = {
      paid: { backgroundColor: '#dcfce7', color: '#166534' },
      completed: { backgroundColor: '#dbeafe', color: '#1e40af' },
      pending_payment: { backgroundColor: '#fef3c7', color: '#92400e' },
      draft: { backgroundColor: '#f1f5f9', color: '#475569' },
    };
    return { ...s.badge, ...(colors[status] || colors.draft) };
  };

  const getServiceBadge = (service) => {
    const colors = {
      trust: { backgroundColor: '#dbeafe', color: '#1e40af' },
      business: { backgroundColor: '#f3e8ff', color: '#7c3aed' },
      immigration: { backgroundColor: '#dcfce7', color: '#166534' },
    };
    return { ...s.badge, ...(colors[service] || {}) };
  };

  const getCategoryBadge = (cat) => {
    const colors = {
      real_estate: { backgroundColor: '#dbeafe', color: '#1e40af' },
      banking: { backgroundColor: '#dcfce7', color: '#166534' },
      tax: { backgroundColor: '#fef3c7', color: '#92400e' },
      business: { backgroundColor: '#f3e8ff', color: '#7c3aed' },
      vehicle: { backgroundColor: '#fee2e2', color: '#dc2626' },
      insurance: { backgroundColor: '#cffafe', color: '#0891b2' },
      legal_matters: { backgroundColor: '#e0e7ff', color: '#4f46e5' },
    };
    return { ...s.badge, ...(colors[cat] || {}) };
  };

  // Login Screen
  if (!authenticated) {
    return (
      <div style={s.loginBg}>
        <div style={s.loginCard}>
          <div style={s.logoBox}>
            <span style={s.logoText}>M360</span>
          </div>
          <h1 style={s.loginTitle}>Welcome Back</h1>
          <p style={s.loginSubtitle}>Multi Servicios 360 Admin Portal</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={s.input}
            />
            <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          {error && <p style={s.error}>{error}</p>}
          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: '#94a3b8' }}>
            Multi Servicios 360 © 2026 | Self-Service Legal Document Software
          </p>
        </div>
      </div>
    );
  }

  const { stats, poaMatters, limitedPoaMatters, trustMatters: rawTrust, llcMatters: rawLlc, simpleDocMatters: rawSimple, waitlist } = data;
  const trustMatters = rawTrust || [];
  const llcMatters = rawLlc || [];
  const simpleDocMatters = rawSimple || [];
  const filteredPoa = applyFilters(poaMatters);
  const filteredLimited = applyFilters(limitedPoaMatters);
  const filteredTrust = applyFilters(trustMatters);
  const filteredLlc = applyFilters(llcMatters);
  const filteredSimple = applyFilters(simpleDocMatters);
  const filteredWaitlist = filterBySearch(waitlist);

  return (
    <AdminLayout title="Dashboard">
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerTop}>
          <div style={s.headerContent}>
            <div style={s.headerFlex}>
              <div style={s.logoSection}>
                <div style={s.logoSmall}>M</div>
                <div>
                  <div style={s.brandText}>Multi Servicios 360</div>
                  <div style={s.brandSub}>Admin Dashboard</div>
                </div>
              </div>
              <div style={s.contactInfo}>
                <div style={s.contactItem}>
                  <span>📧</span> admin@multiservicios360.net
                </div>
                <div style={s.contactItem}>
                  <span>📞</span> (855) 246-7274
                </div>
                <div style={s.contactItem}>
                  <span>🌐</span> multiservicios360.net
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Welcome Banner */}
        <div style={s.welcomeBanner}>
          <div style={s.welcomeText}>
            <div style={s.welcomeTitle}>Welcome to Multi Servicios 360 Admin</div>
            <div style={s.welcomeSub}>Manage your orders, track revenue, and view customer data all in one place.</div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav style={s.nav}>
          <div style={s.navInner}>
            {[
              { id: 'overview', label: 'Overview', count: null },
              { id: 'general-poa', label: 'General POA', count: poaMatters.length },
              { id: 'limited-poa', label: 'Limited POA', count: limitedPoaMatters.length },
              { id: 'trust', label: 'Living Trust', count: trustMatters.length },
              { id: 'llc', label: 'LLC', count: llcMatters.length },
              { id: 'simple-docs', label: 'Simple Docs', count: simpleDocMatters.length },
              { id: 'waitlist', label: 'Waitlist', count: waitlist.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ ...s.navBtn, ...(activeTab === tab.id ? s.navBtnActive : {}) }}
              >
                {tab.label}
                {tab.count !== null && <span style={s.navCount}>{tab.count}</span>}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main */}
      <main style={s.main}>
        {/* Filters */}
        <div style={s.filtersBar}>
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={s.searchInput}
          />
          {activeTab !== 'waitlist' && (
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={s.select}>
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="completed">Completed</option>
            </select>
          )}
          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} style={s.dateInput} />
          <span style={{ color: '#64748b' }}>to</span>
          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} style={s.dateInput} />
          <button onClick={refreshData} style={s.refreshBtn}>↻ Refresh</button>
          {activeTab === 'general-poa' && <button onClick={() => exportToCSV(filteredPoa, 'general_poa')} style={s.exportBtn}>📥 Export CSV</button>}
          {activeTab === 'limited-poa' && <button onClick={() => exportToCSV(filteredLimited, 'limited_poa')} style={s.exportBtn}>📥 Export CSV</button>}
          {activeTab === 'trust' && <button onClick={() => exportToCSV(filteredTrust, 'trust')} style={s.exportBtn}>📥 Export CSV</button>}
          {activeTab === 'llc' && <button onClick={() => exportToCSV(filteredLlc, 'llc')} style={s.exportBtn}>📥 Export CSV</button>}
          {activeTab === 'simple-docs' && <button onClick={() => exportToCSV(filteredSimple, 'simple_docs')} style={s.exportBtn}>📥 Export CSV</button>}
          {activeTab === 'waitlist' && <button onClick={() => exportToCSV(filteredWaitlist, 'waitlist')} style={s.exportBtn}>📥 Export CSV</button>}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div style={s.statsGrid}>
              <div style={s.statCard}>
                <div style={{ ...s.statIcon, backgroundColor: '#dbeafe' }}>📦</div>
                <div style={{ ...s.statNumber, color: '#1d4ed8' }}>{stats.totalOrders}</div>
                <div style={s.statLabel}>Total Paid Orders</div>
              </div>
              <div style={s.statCard}>
                <div style={{ ...s.statIcon, backgroundColor: '#dcfce7' }}>💰</div>
                <div style={{ ...s.statNumber, color: '#16a34a' }}>{formatMoney(stats.totalRevenue)}</div>
                <div style={s.statLabel}>Total Revenue</div>
              </div>
              <div style={s.statCard}>
                <div style={{ ...s.statIcon, backgroundColor: '#fef3c7' }}>⏳</div>
                <div style={{ ...s.statNumber, color: '#d97706' }}>{stats.pendingOrders}</div>
                <div style={s.statLabel}>Pending Orders</div>
              </div>
              <div style={s.statCard}>
                <div style={{ ...s.statIcon, backgroundColor: '#f3e8ff' }}>👥</div>
                <div style={{ ...s.statNumber, color: '#7c3aed' }}>{stats.waitlistCount}</div>
                <div style={s.statLabel}>Waitlist Signups</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div style={s.tableWrap}>
                <div style={s.tableHeader}>
                  <h3 style={s.tableTitle}>Revenue by Product</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span>General POA</span>
                    <strong>{formatMoney(poaMatters.filter(m => m.status === 'paid' || m.status === 'completed').reduce((sum, m) => sum + (m.total_price || 0), 0))}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span>Limited POA</span>
                    <strong>{formatMoney(limitedPoaMatters.filter(m => m.status === 'paid' || m.status === 'completed').reduce((sum, m) => sum + (m.total_price || 0), 0))}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span>Living Trust</span>
                    <strong>{formatMoney(trustMatters.filter(m => m.status === 'paid' || m.status === 'completed').reduce((sum, m) => sum + (m.total_price || 0), 0))}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span>LLC Formation</span>
                    <strong>{formatMoney(llcMatters.filter(m => m.status === 'paid' || m.status === 'completed').reduce((sum, m) => sum + (m.total_price || 0), 0))}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                    <span>Simple Documents</span>
                    <strong>{formatMoney(simpleDocMatters.filter(m => m.status === 'paid' || m.status === 'completed').reduce((sum, m) => sum + (m.total_price || 0), 0))}</strong>
                  </div>
                </div>
              </div>
              <div style={s.tableWrap}>
                <div style={s.tableHeader}>
                  <h3 style={s.tableTitle}>Waitlist by Service</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span>Living Trust</span>
                    <strong>{waitlist.filter(w => w.service_key === 'trust').length}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span>Business Formation</span>
                    <strong>{waitlist.filter(w => w.service_key === 'business').length}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                    <span>Immigration</span>
                    <strong>{waitlist.filter(w => w.service_key === 'immigration').length}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={s.tableWrap}>
              <div style={s.tableHeader}>
                <h3 style={s.tableTitle}>Recent Activity</h3>
              </div>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Client</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Type</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...poaMatters.map(m => ({...m, type: 'General POA', table: 'poa'})), ...limitedPoaMatters.map(m => ({...m, type: 'Limited POA', table: 'limited'})), ...trustMatters.map(m => ({...m, type: 'Living Trust', table: 'trust'})), ...llcMatters.map(m => ({...m, type: 'LLC', table: 'llc'})), ...simpleDocMatters.map(m => ({...m, type: (m.document_type || 'simple').replace(/_/g, ' '), table: 'simple'}))].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 15).map(item => (
                    <tr key={`${item.table}-${item.id}`}>
                      <td style={s.td}><strong>{item.client_name}</strong></td>
                      <td style={s.td}>{item.client_email}</td>
                      <td style={s.td}>{item.type}</td>
                      <td style={s.td}><span style={getBadgeStyle(item.status)}>{item.status?.replace('_', ' ')}</span></td>
                      <td style={s.td}>{formatDate(item.created_at)}</td>
                      <td style={s.td}>
                        <button style={s.actionBtn} onClick={() => { setSelectedOrder({...item}); setShowModal(true); }}>View</button>
                      </td>
                    </tr>
                  ))}
                  {poaMatters.length === 0 && limitedPoaMatters.length === 0 && trustMatters.length === 0 && llcMatters.length === 0 && simpleDocMatters.length === 0 && (
                    <tr><td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#94a3b8' }}>No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* General POA Tab */}
        {activeTab === 'general-poa' && (
          <div style={s.tableWrap}>
            <div style={s.tableHeader}>
              <h3 style={s.tableTitle}>General POA Orders ({filteredPoa.length})</h3>
            </div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Client</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Phone</th>
                  <th style={s.th}>Tier</th>
                  <th style={s.th}>Price</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPoa.map(m => (
                  <tr key={m.id}>
                    <td style={s.td}><strong>{m.client_name}</strong></td>
                    <td style={s.td}>{m.client_email}</td>
                    <td style={s.td}>{m.client_phone || '-'}</td>
                    <td style={s.td}>{m.review_tier?.replace('_', ' ')}</td>
                    <td style={s.td}><strong>{formatMoney(m.total_price)}</strong></td>
                    <td style={s.td}><span style={getBadgeStyle(m.status)}>{m.status?.replace('_', ' ')}</span></td>
                    <td style={s.td}>{formatDate(m.created_at)}</td>
                    <td style={s.td}>
                      <button style={s.actionBtn} onClick={() => { setSelectedOrder({...m, table: 'poa_matters'}); setShowModal(true); }}>View</button>
                    </td>
                  </tr>
                ))}
                {filteredPoa.length === 0 && (
                  <tr><td colSpan={8} style={{ ...s.td, textAlign: 'center', color: '#94a3b8' }}>No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Limited POA Tab */}
        {activeTab === 'limited-poa' && (
          <div style={s.tableWrap}>
            <div style={s.tableHeader}>
              <h3 style={s.tableTitle}>Limited POA Orders ({filteredLimited.length})</h3>
            </div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Client</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Category</th>
                  <th style={s.th}>Tier</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLimited.map(m => (
                  <tr key={m.id}>
                    <td style={s.td}><strong>{m.client_name}</strong></td>
                    <td style={s.td}>{m.client_email}</td>
                    <td style={s.td}><span style={getCategoryBadge(m.poa_category)}>{m.poa_category?.replace('_', ' ')}</span></td>
                    <td style={s.td}>{m.review_tier?.replace('_', ' ')}</td>
                    <td style={s.td}><span style={getBadgeStyle(m.status)}>{m.status?.replace('_', ' ')}</span></td>
                    <td style={s.td}>{formatDate(m.created_at)}</td>
                    <td style={s.td}>
                      <button style={s.actionBtn} onClick={() => { setSelectedOrder({...m, table: 'limited_poa_matters'}); setShowModal(true); }}>View</button>
                    </td>
                  </tr>
                ))}
                {filteredLimited.length === 0 && (
                  <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#94a3b8' }}>No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Trust Tab */}
        {activeTab === 'trust' && (
          <div style={s.tableWrap}>
            <div style={s.tableHeader}>
              <h3 style={s.tableTitle}>Living Trust Orders ({filteredTrust.length})</h3>
            </div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Client</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Tier</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Price</th>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrust.map(m => (
                  <tr key={m.id}>
                    <td style={s.td}><strong>{m.client_name}</strong></td>
                    <td style={s.td}>{m.client_email}</td>
                    <td style={s.td}>{m.review_tier?.replace('_', ' ') || '-'}</td>
                    <td style={s.td}><span style={getBadgeStyle(m.status)}>{m.status?.replace('_', ' ')}</span></td>
                    <td style={s.td}>{formatMoney(m.total_price)}</td>
                    <td style={s.td}>{formatDate(m.created_at)}</td>
                    <td style={s.td}>
                      <button style={s.actionBtn} onClick={() => { setSelectedOrder({...m, table: 'trust_matters'}); setShowModal(true); }}>View</button>
                    </td>
                  </tr>
                ))}
                {filteredTrust.length === 0 && (
                  <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#94a3b8' }}>No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* LLC Tab */}
        {activeTab === 'llc' && (
          <div style={s.tableWrap}>
            <div style={s.tableHeader}>
              <h3 style={s.tableTitle}>LLC Formation Orders ({filteredLlc.length})</h3>
            </div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Client</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>LLC Name</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Price</th>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLlc.map(m => (
                  <tr key={m.id}>
                    <td style={s.td}><strong>{m.client_name}</strong></td>
                    <td style={s.td}>{m.client_email}</td>
                    <td style={s.td}>{m.intake_data?.llc_name || m.intake_data?.company_name || '-'}</td>
                    <td style={s.td}><span style={getBadgeStyle(m.status)}>{m.status?.replace('_', ' ')}</span></td>
                    <td style={s.td}>{formatMoney(m.total_price)}</td>
                    <td style={s.td}>{formatDate(m.created_at)}</td>
                    <td style={s.td}>
                      <button style={s.actionBtn} onClick={() => { setSelectedOrder({...m, table: 'llc_matters'}); setShowModal(true); }}>View</button>
                    </td>
                  </tr>
                ))}
                {filteredLlc.length === 0 && (
                  <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#94a3b8' }}>No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Simple Docs Tab */}
        {activeTab === 'simple-docs' && (
          <div style={s.tableWrap}>
            <div style={s.tableHeader}>
              <h3 style={s.tableTitle}>Simple Document Orders ({filteredSimple.length})</h3>
            </div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Client</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Document Type</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Price</th>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSimple.map(m => (
                  <tr key={m.id}>
                    <td style={s.td}><strong>{m.client_name}</strong></td>
                    <td style={s.td}>{m.client_email}</td>
                    <td style={s.td}><span style={{ textTransform: 'capitalize' }}>{(m.document_type || '').replace(/_/g, ' ')}</span></td>
                    <td style={s.td}><span style={getBadgeStyle(m.status)}>{m.status?.replace('_', ' ')}</span></td>
                    <td style={s.td}>{formatMoney(m.total_price)}</td>
                    <td style={s.td}>{formatDate(m.created_at)}</td>
                    <td style={s.td}>
                      <button style={s.actionBtn} onClick={() => { setSelectedOrder({...m, table: 'simple_doc_matters'}); setShowModal(true); }}>View</button>
                    </td>
                  </tr>
                ))}
                {filteredSimple.length === 0 && (
                  <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#94a3b8' }}>No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Waitlist Tab */}
        {activeTab === 'waitlist' && (
          <div style={s.tableWrap}>
            <div style={s.tableHeader}>
              <h3 style={s.tableTitle}>Waitlist Signups ({filteredWaitlist.length})</h3>
            </div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Phone</th>
                  <th style={s.th}>Service</th>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWaitlist.map(w => (
                  <tr key={w.id}>
                    <td style={s.td}><strong>{w.name}</strong></td>
                    <td style={s.td}>{w.email}</td>
                    <td style={s.td}>{w.phone || '-'}</td>
                    <td style={s.td}><span style={getServiceBadge(w.service_key)}>{w.service_key}</span></td>
                    <td style={s.td}>{formatDate(w.created_at)}</td>
                    <td style={s.td}>
                      <a href={`mailto:${w.email}`} style={{ ...s.actionBtn, textDecoration: 'none', display: 'inline-block' }}>📧 Email</a>
                    </td>
                  </tr>
                ))}
                {filteredWaitlist.length === 0 && (
                  <tr><td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#94a3b8' }}>No signups found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px', color: '#64748b', fontSize: '13px', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ margin: '0 0 8px' }}><strong>Multi Servicios 360</strong> — Self-Service Legal Document Software Platform</p>
        <p style={{ margin: 0 }}>📧 admin@multiservicios360.net | 📞 (855) 246-7274 | 🌐 multiservicios360.net</p>
      </footer>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div style={s.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Order Details</h2>
              <button style={s.closeBtn} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.detailRow}>
                <div style={s.detailLabel}>Client Name</div>
                <div style={s.detailValue}>{selectedOrder.client_name}</div>
              </div>
              <div style={s.detailRow}>
                <div style={s.detailLabel}>Email</div>
                <div style={s.detailValue}>{selectedOrder.client_email}</div>
              </div>
              <div style={s.detailRow}>
                <div style={s.detailLabel}>Phone</div>
                <div style={s.detailValue}>{selectedOrder.client_phone || '-'}</div>
              </div>
              <div style={s.detailRow}>
                <div style={s.detailLabel}>Tier</div>
                <div style={s.detailValue}>{selectedOrder.review_tier?.replace('_', ' ')}</div>
              </div>
              {selectedOrder.poa_category && (
                <div style={s.detailRow}>
                  <div style={s.detailLabel}>Category</div>
                  <div style={s.detailValue}>{selectedOrder.poa_category?.replace('_', ' ')}</div>
                </div>
              )}
              <div style={s.detailRow}>
                <div style={s.detailLabel}>Price</div>
                <div style={s.detailValue}><strong>{formatMoney(selectedOrder.total_price)}</strong></div>
              </div>
              <div style={s.detailRow}>
                <div style={s.detailLabel}>Status</div>
                <div style={s.detailValue}><span style={getBadgeStyle(selectedOrder.status)}>{selectedOrder.status?.replace('_', ' ')}</span></div>
              </div>
              <div style={s.detailRow}>
                <div style={s.detailLabel}>Created</div>
                <div style={s.detailValue}>{formatDate(selectedOrder.created_at)}</div>
              </div>
              <div style={s.detailRow}>
                <div style={s.detailLabel}>Language</div>
                <div style={s.detailValue}>{selectedOrder.language === 'es' ? 'Spanish' : 'English'}</div>
              </div>
              
              {selectedOrder.intake_data && (
                <>
                  <h3 style={{ marginTop: '24px', marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Intake Data</h3>
                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '13px', maxHeight: '300px', overflow: 'auto' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {JSON.stringify(selectedOrder.intake_data, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
            <div style={s.modalFooter}>
              <a href={`mailto:${selectedOrder.client_email}`} style={{ ...s.actionBtn, textDecoration: 'none', padding: '12px 24px' }}>📧 Email Client</a>
              <button style={{ ...s.btn, width: 'auto', padding: '12px 24px' }} onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
    )}
    </AdminLayout>
  );
}
