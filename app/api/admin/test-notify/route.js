export const dynamic = 'force-dynamic';
// app/api/admin/test-notify/route.js
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

async function runTest(docType) {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'flashpreviews@gmail.com';
  const resendKey = process.env.RESEND_API_KEY;

  try {
    const resend = new Resend(resendKey);
    const result = await resend.emails.send({
      from: 'Multi Servicios 360 <notifications@multiservicios360.net>',
      to: adminEmail,
      subject: 'TEST — Nueva Venta Multi Servicios 360',
      html: `<h2>TEST Email</h2><p>Si lo ves, las notificaciones funcionan.</p><p>Enviado a: ${adminEmail}</p><p>Key prefix: ${resendKey ? resendKey.substring(0,8) + '...' : 'NOT SET'}</p>`,
    });
    return NextResponse.json({ 
      success: true, 
      to: adminEmail,
      resend_id: result?.data?.id,
      resend_error: result?.error,
      key_prefix: resendKey ? resendKey.substring(0,8) + '...' : 'NOT SET',
    });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      error: err.message,
      to: adminEmail,
      key_prefix: resendKey ? resendKey.substring(0,8) + '...' : 'NOT SET',
    });
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const pwd = url.searchParams.get('pwd');
    const docType = url.searchParams.get('docType') || 'llc_formation';
    if (pwd !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return await runTest(docType);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const pwd = request.headers.get('x-admin-password');
    if (pwd !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    return await runTest(body.docType);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
