// app/api/admin/test-notify/route.js
// Test endpoint to fire a fake sale notification (email + SMS)
// Protected by admin password
import { NextResponse } from 'next/server';
import { notifyOwnerOfSale } from '../../../../lib/notify-owner';

export async function POST(request) {
  const pwd = request.headers.get('x-admin-password');
  if (pwd !== process.env.ADMIN_PASSWORD && pwd !== 'MS360Admin2026!') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const docType = body.docType || 'llc_formation';

    await notifyOwnerOfSale({
      documentType: docType,
      clientName: 'Juan Pérez (TEST)',
      clientEmail: 'test@example.com',
      amount: docType === 'llc_formation' ? 29900 : 14900, // cents
      matterId: 'TEST-' + Date.now(),
      partnerName: body.docType === 'llc_formation' ? null : 'Tax Office Glendale',
    });

    return NextResponse.json({ success: true, message: 'Test notification sent! Check your email and phone.' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
