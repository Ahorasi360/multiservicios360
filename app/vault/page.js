// app/vault/page.js
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import VaultLanding from './VaultLanding';

export const metadata = {
  title: 'Document Vault | Multi Servicios 360',
  description: 'Access your completed legal documents securely.',
};

export default function VaultPage() {
  return (
    <Suspense
      fallback={
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
        }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid #E2E8F0',
            borderTopColor: '#1E3A8A',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      }
    >
      <VaultLanding />
    </Suspense>
  );
}
