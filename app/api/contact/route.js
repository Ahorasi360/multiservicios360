export const dynamic = 'force-dynamic';
// app/api/contact/route.js
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const DEPARTMENTS = {
  info: { email: 'info@multiservicios360.net', label: 'General Inquiry' },
  admin: { email: 'admin@multiservicios360.net', label: 'Administrative' },
  support: { email: 'support@multiservicios360.net', label: 'Technical Support' },
  privacy: { email: 'privacy@multiservicios360.net', label: 'Privacy Request' },
};

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email, department, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const dept = DEPARTMENTS[department] || DEPARTMENTS.info;

    // Send to the department
    await resend.emails.send({
      from: 'Multi Servicios 360 <no-reply@multiservicios360.net>',
      to: [dept.email],
      replyTo: email,
      subject: `[${dept.label}] New message from ${name}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0F172A,#1E3A8A);padding:24px 28px;">
      <h1 style="color:#fff;font-size:18px;font-weight:700;margin:0;">New Contact Form Message</h1>
      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:4px 0 0;">${dept.label} — multiservicios360.net</p>
    </div>
    <div style="padding:24px 28px;">
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:16px;margin-bottom:20px;">
        <p style="margin:0 0 8px;"><strong style="color:#64748B;font-size:12px;text-transform:uppercase;">From:</strong><br/><span style="color:#0F172A;font-size:15px;font-weight:600;">${name}</span></p>
        <p style="margin:0 0 8px;"><strong style="color:#64748B;font-size:12px;text-transform:uppercase;">Email:</strong><br/><a href="mailto:${email}" style="color:#2563EB;font-size:14px;">${email}</a></p>
        <p style="margin:0;"><strong style="color:#64748B;font-size:12px;text-transform:uppercase;">Department:</strong><br/><span style="color:#0F172A;font-size:14px;">${dept.label}</span></p>
      </div>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:16px;">
        <strong style="color:#64748B;font-size:12px;text-transform:uppercase;">Message:</strong>
        <p style="color:#0F172A;font-size:14px;line-height:1.7;margin:8px 0 0;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>
    </div>
    <div style="background:#F8FAFC;padding:14px 28px;text-align:center;border-top:1px solid #E2E8F0;">
      <p style="color:#94A3B8;font-size:11px;margin:0;">Reply directly to this email to respond to the sender.</p>
    </div>
  </div>
</body>
</html>`,
    });

    // Send confirmation to the person who wrote in
    await resend.emails.send({
      from: 'Multi Servicios 360 <no-reply@multiservicios360.net>',
      to: [email],
      subject: 'We received your message / Recibimos su mensaje — Multi Servicios 360',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0F172A,#1E3A8A);padding:28px;text-align:center;">
      <div style="width:44px;height:44px;background:rgba(255,255,255,0.15);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:10px;">
        <span style="font-size:16px;font-weight:800;color:#fff;">M360</span>
      </div>
      <h1 style="color:#fff;font-size:20px;font-weight:700;margin:8px 0 0;">Thank You / Gracias</h1>
    </div>
    <div style="padding:24px 28px;">
      <p style="color:#0F172A;font-size:15px;margin:0 0 8px;">Hello / Hola <strong>${name}</strong>,</p>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 16px;">
        We received your message and will respond within 24-48 business hours.<br/>
        <span style="color:#94A3B8;">Recibimos su mensaje y responderemos dentro de 24-48 horas hábiles.</span>
      </p>
      <p style="color:#94A3B8;font-size:13px;margin:0;">Questions? Call (855) 246-7274</p>
    </div>
    <div style="background:#F8FAFC;padding:14px 28px;text-align:center;border-top:1px solid #E2E8F0;">
      <p style="color:#94A3B8;font-size:11px;margin:0;">&copy; 2026 Multi Servicios 360. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
