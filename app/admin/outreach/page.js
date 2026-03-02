// app/admin/outreach/page.js
'use client';
import { useState, useEffect } from 'react';

export default function OutreachStatsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/admin/leads-stats', { headers: { 'x-admin-password': 'MS360Admin2026!' } })
      .then(r => r.json())
      .then(d => { setLeads(d.leads || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const counts = {
    all: leads.length,
    visited: leads.filter(l => l.status === 'visited' || l.status === 'applied').length,
    emailed: leads.filter(l => l.status === 'emailed').length,
    paid: leads.filter(l => l.status === 'paid').length,
  };

  const filtered = filter === 'all' ? leads
    : filter === 'visited' ? leads.filter(l => l.status === 'visited' || l.status === 'applied')
    : leads.filter(l => l.status === filter);

  const fmt = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statusBadge = (status) => {
    const map = {
      visited: { bg: '#FEF3C7', color: '#92400E', label: '👀 Visited' },
      applied: { bg: '#DBEAFE', color: '#1E40AF', label: '📝 Applied' },
      emailed: { bg: '#F1F5F9', color: '#475569', label: '📧 Emailed' },
      paid: { bg: '#D1FAE5', color: '#065F46', label: '✅ Paid' },
    };
    const s = map[status] || { bg: '#F1F5F9', color: '#475569', label: status };
    return (
      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <a href="/admin" style={{ color: '#6B7280', fontSize: 14, textDecoration: 'none' }}>← Admin</a>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '8px 0 4px' }}>Outreach Campaign</h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Everardo Miramontes referral campaign — read only view</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Sent', value: counts.all, color: '#1E3A8A', bg: '#EFF6FF' },
            { label: 'Clicked Link', value: counts.visited, color: '#92400E', bg: '#FEF3C7' },
            { label: 'Click Rate', value: counts.all ? `${((counts.visited / counts.all) * 100).toFixed(1)}%` : '0%', color: '#065F46', bg: '#D1FAE5' },
            { label: 'Paid / Converted', value: counts.paid, color: '#7C3AED', bg: '#F5F3FF' },
          ].map((card, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600, marginBottom: 6 }}>{card.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: card.color }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Follow-up Sequence Status */}
        <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 12px' }}>Email Sequence Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Day 1 Follow-up', desc: '24 hours after initial email', key: 'day1' },
              { label: 'Day 3 Follow-up', desc: '72 hours — sent today', key: 'day3' },
              { label: 'Day 7 Final', desc: 'Last email — upcoming', key: 'day7' },
            ].map((step, i) => (
              <div key={i} style={{ background: i === 1 ? '#FEF3C7' : i === 2 ? '#F0F9FF' : '#F0FDF4', borderRadius: 10, padding: '14px 18px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{step.label}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{step.desc}</div>
                <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: i === 0 ? '#15803D' : i === 1 ? '#92400E' : '#0369A1' }}>
                  {i === 0 ? '✅ Sent (Day 1 cron)' : i === 1 ? '⚠️ Sent twice today (fixed)' : '⏳ Pending — Day 7'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[
            { key: 'all', label: `All (${counts.all})` },
            { key: 'visited', label: `👀 Clicked Link (${counts.visited})` },
            { key: 'emailed', label: `📧 No Click (${counts.emailed})` },
            { key: 'paid', label: `✅ Paid (${counts.paid})` },
          ].map(pill => (
            <button key={pill.key} onClick={() => setFilter(pill.key)}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: filter === pill.key ? '#1E3A8A' : '#E2E8F0',
                color: filter === pill.key ? 'white' : '#475569' }}>
              {pill.label}
            </button>
          ))}
        </div>

        {/* Leads Table */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Name', 'Email', 'Status', 'First Emailed', 'Visited Page', 'Paid'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr key={lead.ref} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? 'white' : '#FAFBFC' }}>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{lead.contact_name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{lead.email}</td>
                    <td style={{ padding: '12px 16px' }}>{statusBadge(lead.status)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{fmt(lead.applied_at)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: lead.status === 'visited' ? '#92400E' : '#CBD5E1', fontWeight: lead.status === 'visited' ? 700 : 400 }}>
                      {lead.status === 'visited' || lead.status === 'applied' ? fmt(lead.visited_at) : '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: lead.paid_at ? '#15803D' : '#CBD5E1' }}>
                      {lead.paid_at ? fmt(lead.paid_at) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: '#94A3B8', textAlign: 'center' }}>
          Read-only view — campaign data updates automatically. Do not trigger /api/cron/partner-followup manually.
        </p>
      </div>
    </div>
  );
}
