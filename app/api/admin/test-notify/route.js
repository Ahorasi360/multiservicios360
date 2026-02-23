export const dynamic = 'force-dynamic';
// app/api/admin/test-notify/route.js
import { NextResponse } from 'next/server';

async function runTest(docType) {
  const { notifyOwnerOfSale } = await import('../../../../lib/notify-owner');
  await notifyOwnerOfSale({
    documentType: docType || 'llc_formation',
    clientName: 'Juan Pérez (TEST)',
    clientEmail: 'test@example.com',
    amount: docType === 'llc_formation' ? 29900 : 14900,
    matterId: 'TEST-' + Date.now(),
    partnerName: docType !== 'llc_formation' ? 'Tax Office Glendale' : null,
  });
  return NextResponse.json({ success: true, message: 'Test sent! Check flashpreviews@gmail.com' });
}

// GET — test from browser: /api/admin/test-notify?pwd=MS360Admin2026!
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const pwd = url.searchParams.get('pwd');
    const docType = url.searchParams.get('docType') || 'llc_formation';
    if (pwd !== 'MS360Admin2026!') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return await runTest(docType);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — test from PowerShell
export async function POST(request) {
  try {
    const pwd = request.headers.get('x-admin-password');
    if (pwd !== 'MS360Admin2026!') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    return await runTest(body.docType);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
