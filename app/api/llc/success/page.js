import { Suspense } from 'react';
import LLCSuccessContent from './LLCSuccessContent';

export const dynamic = 'force-dynamic';

export default function LLCSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF6FF' }}>
        <p style={{ fontSize: '18px', color: '#1E3A8A' }}>Loading...</p>
      </div>
    }>
      <LLCSuccessContent />
    </Suspense>
  );
}