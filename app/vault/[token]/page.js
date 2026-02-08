// app/vault/[token]/page.js
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import VaultContent from './VaultContent';

export const metadata = {
  title: 'Your Documents | Multi Servicios 360',
  description: 'View and download your completed legal documents.',
};

export default function VaultTokenPage({ params }) {
  return (
    <Suspense
      fallback={
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid #E2E8F0',
            borderTopColor: '#1E3A8A',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#64748B', fontSize: 14 }}>Loading your documents...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    >
      <VaultContent token={params.token} />
    </Suspense>
  );
}
