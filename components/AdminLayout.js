// components/AdminLayout.js
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/vault', label: 'Vault Manager', icon: '🔒' },
  { href: '/admin/partners', label: 'Partners', icon: '🤝' },
  { href: '/admin/professionals', label: 'Professionals', icon: '👔' },
  { href: '/admin/sales', label: 'Sales Team', icon: '💰' },
];

export default function AdminLayout({ children, title }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const currentPage = navItems.find((n) => isActive(n))?.label || 'Admin';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className="admin-sidebar"
        style={{
          width: 250,
          background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          zIndex: 50,
          transition: 'left 0.25s ease',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42,
              background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: '#fff',
              letterSpacing: '-0.5px',
            }}>M360</div>
            <div>
              <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 }}>Admin Panel</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '2px 0 0' }}>Multi Servicios 360</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
          <p style={{
            color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1px',
            padding: '0 14px', margin: '0 0 8px',
          }}>
            Management
          </p>
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 8,
                  marginBottom: 2,
                  background: active ? 'rgba(59,130,246,0.2)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  transition: 'all 0.15s',
                  borderLeft: active ? '3px solid #3B82F6' : '3px solid transparent',
                }}
              >
                <span style={{ fontSize: 17, width: 24, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          <div style={{
            height: 1, background: 'rgba(255,255,255,0.06)',
            margin: '16px 14px',
          }} />

          <p style={{
            color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1px',
            padding: '0 14px', margin: '0 0 8px',
          }}>
            Client Facing
          </p>

          <Link
            href="/vault"
            target="_blank"
            onClick={() => setSidebarOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 8, marginBottom: 2,
              background: 'transparent',
              color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', fontSize: 14, fontWeight: 500,
              borderLeft: '3px solid transparent',
            }}
          >
            <span style={{ fontSize: 17, width: 24, textAlign: 'center' }}>📄</span>
            Client Vault
            <span style={{ fontSize: 11, marginLeft: 'auto', opacity: 0.5 }}>↗</span>
          </Link>

          <Link
            href="/portal/login"
            target="_blank"
            onClick={() => setSidebarOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 8, marginBottom: 2,
              background: 'transparent',
              color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', fontSize: 14, fontWeight: 500,
              borderLeft: '3px solid transparent',
            }}
          >
            <span style={{ fontSize: 17, width: 24, textAlign: 'center' }}>🏢</span>
            Partner Portal
            <span style={{ fontSize: 11, marginLeft: 'auto', opacity: 0.5 }}>↗</span>
          </Link>
        </nav>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Link
            href="/"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: 'rgba(255,255,255,0.35)',
              fontSize: 12, textDecoration: 'none',
            }}
          >
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="admin-main" style={{
        flex: 1,
        minHeight: '100vh',
      }}>
        {/* Top bar */}
        <div style={{
          background: '#fff',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          <button
            className="admin-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              color: '#475569',
              padding: '8px 10px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ☰
          </button>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: 0 }}>
            {title || currentPage}
          </h1>
        </div>

        {/* Page content */}
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar {
            left: 0 !important;
          }
          .admin-main {
            margin-left: 250px !important;
          }
          .admin-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .admin-sidebar {
            left: ${sidebarOpen ? '0' : '-250px'};
          }
          .admin-main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}