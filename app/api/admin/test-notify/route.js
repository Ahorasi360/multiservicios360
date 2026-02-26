export const dynamic = 'force-dynamic';
// app/api/admin/test-notify/route.js - tests BOTH email and SMS
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

async function runTest() {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'flashpreviews@gmail.com';
  const adminPhone = process.env.ADMIN_NOTIFY_PHONE || '+13104373343';
  const results = {};

  // TEST EMAIL
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: 'Multi Servicios 360 <notifications@out.multiservicios360.net>',
      to: adminEmail,
      subject: 'TEST — Nueva Venta Multi Servicios 360',
      html: `<h2>✅ Email de prueba</h2><p>Si ves esto, las notificaciones de venta funcionan.</p><p><strong>Enviado a:</strong> ${adminEmail}</p>`,
    });
    results.email = { success: !result.error, to: adminEmail, id: result?.data?.id, error: result?.error || null };
  } catch (err) {
    results.email = { success: false, to: adminEmail, error: err.message };
  }

  // TEST SMS
  try {
    const twilio = (await import('twilio')).default;
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const msg = await client.messages.create({
      body: 'TEST — Multi Servicios 360: Notificaciones de venta por SMS funcionan!',
      from: process.env.TWILIO_FROM_NUMBER,
      to: adminPhone,
    });
    results.sms = { success: true, to: adminPhone, sid: msg.sid };
  } catch (err) {
    results.sms = { success: false, to: adminPhone, error: err.message };
  }

  return NextResponse.json(results);
}

export async function GET(request) {
  try {
    const pwd = new URL(request.url).searchParams.get('pwd');
    if (pwd !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return await runTest();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const pwd = request.headers.get('x-admin-password');
    if (pwd !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return await runTest();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
