import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { nombre, telefono, email } = await request.json();

    if (!nombre || !telefono) {
      return NextResponse.json({ error: 'Nombre y teléfono son requeridos' }, { status: 400 });
    }

    // Save lead to Supabase
    const { data: lead, error } = await supabase
      .from('landing_leads')
      .insert({
        nombre,
        telefono,
        email: email || null,
        fuente: 'protege-tu-casa',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Continue even if DB fails — still send emails
    }

    // 1. Notify Anthony immediately
    await resend.emails.send({
      from: 'Multi Servicios 360 <no-reply@out.multiservicios360.net>',
      to: ['info@multiservicios360.net'],
      subject: `🔥 Nuevo Lead Living Trust — ${nombre}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
          <div style="background:#1E3A8A;color:white;padding:16px 20px;border-radius:8px 8px 0 0;">
            <h2 style="margin:0;font-size:18px;">🔥 Nuevo Lead — Living Trust</h2>
            <p style="margin:4px 0 0;opacity:0.8;font-size:13px;">multiservicios360.net/protege-tu-casa</p>
          </div>
          <div style="background:#f8faff;padding:20px;border:1px solid #dbeafe;border-radius:0 0 8px 8px;">
            <p style="margin:0 0 8px;"><strong>Nombre:</strong> ${nombre}</p>
            <p style="margin:0 0 8px;"><strong>Teléfono:</strong> <a href="tel:${telefono}">${telefono}</a></p>
            ${email ? `<p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>` : ''}
            <p style="margin:16px 0 0;font-size:12px;color:#666;">Llámale ahora — los leads que se contactan en los primeros 5 minutos cierran 10x más.</p>
          </div>
        </div>
      `
    });

    // 2. Send welcome email to lead (if email provided)
    if (email) {
      await resend.emails.send({
        from: 'Anthony Galeano — Multi Servicios 360 <no-reply@out.multiservicios360.net>',
        to: [email],
        subject: 'Su consulta gratuita sobre el Living Trust — Multi Servicios 360',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
            <div style="background:linear-gradient(135deg,#1E3A8A,#1D4ED8);color:white;padding:28px 24px;border-radius:8px 8px 0 0;">
              <h1 style="margin:0;font-size:22px;font-weight:800;">Gracias, ${nombre}</h1>
              <p style="margin:8px 0 0;opacity:0.9;font-size:15px;">Recibimos su solicitud de consulta gratuita.</p>
            </div>
            <div style="padding:24px;background:white;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
              <p style="font-size:15px;color:#374151;line-height:1.6;">Nos comunicaremos con usted a la brevedad al número <strong>${telefono}</strong> para responder sus preguntas sobre el <strong>Fideicomiso en Vida</strong>.</p>
              
              <div style="background:#f0f4ff;border-left:4px solid #1E3A8A;padding:14px 16px;margin:20px 0;border-radius:0 6px 6px 0;">
                <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;"><strong>Mientras tanto, recuerde:</strong> Sin un Living Trust, su familia puede enfrentar un proceso de Probate que cuesta <strong>$15,000–$30,000</strong> y tarda 1 a 2 años. Con nuestro servicio, una familia típica paga <strong>$1,500 a $1,700</strong> en total.</p>
              </div>

              <p style="font-size:14px;color:#374151;">Si prefiere llamarnos directamente:</p>
              <p style="font-size:20px;font-weight:800;color:#1E3A8A;">📞 855.246.7274</p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
              <p style="font-size:12px;color:#9ca3af;">Anthony Galeano — Multi Servicios 360<br>Agente de Bienes Raíces Licenciado en California<br>multiservicios360.net/protege-tu-casa</p>
            </div>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Lead capture error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
