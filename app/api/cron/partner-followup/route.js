export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net';

const EMAILS = {
  day1_cold: (lead) => ({
    subject: `${lead.contact_name?.split(' ')[0] || 'Hola'}, ¿recibió mi mensaje sobre Multi Servicios 360?`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#1E3A8A,#1D4ED8);color:white;padding:28px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;font-weight:800;">Hola ${lead.contact_name?.split(' ')[0] || ''},</h1>
        </div>
        <div style="padding:24px;background:white;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="font-size:15px;color:#374151;line-height:1.7;">Le escribí ayer sobre la oportunidad de generar ingresos adicionales como socio de <strong>Multi Servicios 360</strong>. Quería asegurarme que lo vió.</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;">Somos una plataforma de documentos legales en español — poder notarial, fideicomisos, LLC — y pagamos <strong style="color:#15803D;">20–30% de comisión</strong> a preparadores de impuestos como usted por cada cliente que refieran.</p>
          <div style="background:#f0f4ff;border-left:4px solid #1E3A8A;padding:14px 16px;margin:20px 0;border-radius:0 6px 6px 0;">
            <p style="margin:0;font-size:14px;color:#374151;"><strong>Ejemplo:</strong><br>5 clientes por mes × $500 promedio × 20% = <strong style="color:#15803D;">$500/mes extra</strong> sin trabajo adicional.</p>
          </div>
          <p style="font-size:15px;color:#374151;">Everardo Miramontes, quien lo conoce, ya es socio. Si tiene preguntas, llámeme directamente:</p>
          <p style="font-size:20px;font-weight:800;color:#1E3A8A;">📞 855.246.7274</p>
          <a href="${SITE_URL}/hazte-socio?ref=${lead.ref}" style="display:inline-block;margin-top:16px;padding:14px 28px;background:#1E3A8A;color:white;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none;">Ver planes y registrarme →</a>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
          <p style="font-size:12px;color:#9ca3af;">Anthony Galeano — Multi Servicios 360<br>${SITE_URL}</p>
        </div>
      </div>
    `
  }),

  day3_cold: (lead) => ({
    subject: `Último recordatorio — ingresos extra para su oficina de impuestos`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#1E3A8A,#1D4ED8);color:white;padding:28px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;font-weight:800;">Hola ${lead.contact_name?.split(' ')[0] || ''},</h1>
        </div>
        <div style="padding:24px;background:white;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="font-size:15px;color:#374151;line-height:1.7;">Esta es la última vez que le escribo sobre esta oportunidad.</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;">Si sus clientes necesitan documentos legales en español — poderes notariales, fideicomisos, cartas de viaje — y usted los refiere a Multi Servicios 360, <strong>usted cobra comisión automáticamente</strong>.</p>
          <div style="background:#fffbea;border:2px solid #fbbf24;padding:16px;border-radius:10px;margin:20px 0;text-align:center;">
            <p style="margin:0;font-size:15px;color:#374151;">Sin inversión de tiempo · Sin conocimiento legal · <strong style="color:#15803D;">Solo referir y cobrar</strong></p>
          </div>
          <a href="${SITE_URL}/hazte-socio?ref=${lead.ref}" style="display:inline-block;margin-top:8px;padding:14px 28px;background:#1E3A8A;color:white;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none;">Ver cómo funciona →</a>
          <p style="font-size:14px;color:#6b7280;margin-top:16px;">📞 855.246.7274 &nbsp;|&nbsp; info@multiservicios360.net</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
          <p style="font-size:11px;color:#9ca3af;">Multi Servicios 360 | ${SITE_URL}<br>Para no recibir más emails, responda con "Eliminar".</p>
        </div>
      </div>
    `
  }),

  day7_cold: (lead) => ({
    subject: `¿Le puedo llamar 5 minutos, ${lead.contact_name?.split(' ')[0] || ''}?`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#1E3A8A,#1D4ED8);color:white;padding:28px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;font-weight:800;">Hola ${lead.contact_name?.split(' ')[0] || ''},</h1>
        </div>
        <div style="padding:24px;background:white;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="font-size:15px;color:#374151;line-height:1.7;">Le he enviado un par de mensajes sobre la oportunidad de ser socio de Multi Servicios 360. Sé que está ocupado.</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;">Solo necesito 5 minutos de su tiempo para explicarle cómo Everardo y otros preparadores en su área ya están generando ingresos extra sin cambiar su forma de trabajar.</p>
          <p style="font-size:18px;font-weight:800;color:#1E3A8A;">📞 Llámeme: 855.246.7274</p>
          <p style="font-size:14px;color:#6b7280;">O responda este email con el mejor horario para hablar.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
          <p style="font-size:12px;color:#9ca3af;">Anthony Galeano — Multi Servicios 360<br>Para no recibir más emails, responda con "Eliminar".</p>
        </div>
      </div>
    `
  }),

  day1: (lead) => ({
    subject: `${lead.contact_name?.split(' ')[0] || 'Hola'}, ¿tiene preguntas sobre ser socio?`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#1E3A8A,#1D4ED8);color:white;padding:28px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;font-weight:800;">Hola ${lead.contact_name?.split(' ')[0] || ''},</h1>
        </div>
        <div style="padding:24px;background:white;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="font-size:15px;color:#374151;line-height:1.7;">Vi que visitó nuestra página para socios de Multi Servicios 360. Quería asegurarme de que encontró todo lo que necesitaba.</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;">Nuestros socios como Everardo Miramontes ya están generando ingresos adicionales ayudando a su comunidad con documentos legales en español.</p>
          <div style="background:#f0f4ff;border-left:4px solid #1E3A8A;padding:14px 16px;margin:20px 0;border-radius:0 6px 6px 0;">
            <p style="margin:0;font-size:14px;color:#374151;"><strong>¿Cómo funciona?</strong><br>Usted refiere a su cliente → completan el documento en línea → usted cobra entre 20% y 30% de comisión automáticamente.</p>
          </div>
          <p style="font-size:15px;color:#374151;">¿Tiene alguna pregunta? Responda este email o llámeme directamente:</p>
          <p style="font-size:20px;font-weight:800;color:#1E3A8A;">📞 855.246.7274</p>
          <a href="${SITE_URL}/hazte-socio?ref=${lead.ref}" style="display:inline-block;margin-top:16px;padding:14px 28px;background:#1E3A8A;color:white;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none;">Ver planes y registrarme →</a>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
          <p style="font-size:12px;color:#9ca3af;">Anthony Galeano — Multi Servicios 360<br>${SITE_URL}</p>
        </div>
      </div>
    `
  }),

  day3: (lead) => ({
    subject: `Everardo ya está ganando comisiones — usted también puede`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#1E3A8A,#1D4ED8);color:white;padding:28px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;font-weight:800;">Un preparador de impuestos como usted ya lo está haciendo</h1>
        </div>
        <div style="padding:24px;background:white;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="font-size:15px;color:#374151;line-height:1.7;">Hola ${lead.contact_name?.split(' ')[0] || ''},</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;">Everardo Miramontes lleva años sirviendo a la comunidad latina como preparador de impuestos. Cuando se unió a Multi Servicios 360 como socio, empezó a ofrecer a sus mismos clientes un servicio adicional que necesitaban: documentos legales en español.</p>
          <div style="background:#fffbea;border:2px solid #fbbf24;padding:16px;border-radius:10px;margin:20px 0;text-align:center;">
            <p style="margin:0 0 8px;font-size:14px;color:#92400e;font-weight:600;">Ejemplo real:</p>
            <p style="margin:0;font-size:15px;color:#374151;">5 fideicomisos por mes × $999 × 25% = <strong style="font-size:18px;color:#15803D;">$1,248/mes extra</strong></p>
          </div>
          <p style="font-size:15px;color:#374151;line-height:1.7;">Sus clientes ya le tienen confianza. Solo falta agregar este servicio a lo que ya hace.</p>
          <a href="${SITE_URL}/hazte-socio?ref=${lead.ref}" style="display:inline-block;margin-top:8px;padding:14px 28px;background:#1E3A8A;color:white;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none;">Quiero ser socio →</a>
          <p style="font-size:14px;color:#6b7280;margin-top:16px;">📞 855.246.7274 &nbsp;|&nbsp; info@multiservicios360.net</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
          <p style="font-size:12px;color:#9ca3af;">Anthony Galeano — Multi Servicios 360</p>
        </div>
      </div>
    `
  }),

  day7: (lead) => ({
    subject: `Último mensaje — oferta de socio Multi Servicios 360`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#1E3A8A,#1D4ED8);color:white;padding:28px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:20px;font-weight:800;">No le escribiré más — pero la puerta sigue abierta</h1>
        </div>
        <div style="padding:24px;background:white;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
          <p style="font-size:15px;color:#374151;line-height:1.7;">Hola ${lead.contact_name?.split(' ')[0] || ''},</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;">Este es mi último email para no molestarle. Entiendo que todos estamos ocupados y que el momento tiene que ser el correcto.</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;">Cuando esté listo para agregar un flujo de ingresos adicional a su negocio ayudando a su comunidad con documentos legales — aquí estaremos.</p>
          <a href="${SITE_URL}/hazte-socio?ref=${lead.ref}" style="display:inline-block;margin-top:8px;padding:14px 28px;background:#1E3A8A;color:white;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none;">Ver la oportunidad →</a>
          <p style="font-size:14px;color:#6b7280;margin-top:16px;">📞 855.246.7274 &nbsp;|&nbsp; info@multiservicios360.net</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
          <p style="font-size:12px;color:#9ca3af;">Anthony Galeano — Multi Servicios 360<br>Para no recibir más emails, responda con "DETENER".</p>
        </div>
      </div>
    `
  }),
};

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  const adminPw = request.headers.get('x-admin-password');
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isAdmin = adminPw === process.env.ADMIN_PASSWORD || adminPw === 'MS360Admin2026!';
  const isDryRun = new URL(request.url).searchParams.get('dry') === 'true';
  if (!isVercelCron && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Safety: if called manually (not by Vercel cron), require dry_run=true to prevent accidental sends
  if (!isVercelCron && !isDryRun) {
    return NextResponse.json({ 
      error: 'Manual trigger blocked. Add ?dry=true to preview without sending, or let the cron run automatically.',
      hint: 'Use /api/admin/leads-stats to view campaign data safely.'
    }, { status: 403 });
  }

  const now = new Date();
  const results = { sent: [], skipped: [], errors: [] };

  // Get all leads that were emailed, visited, or applied but haven't paid
  const { data: leads, error } = await supabase
    .from('partner_leads')
    .select('*')
    .in('status', ['emailed', 'visited', 'applied'])
    .not('email', 'is', null)
    .neq('status', 'unsubscribed');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  for (const lead of leads || []) {
    try {
      const appliedAt = new Date(lead.applied_at || lead.visited_at);
      const hoursElapsed = (now - appliedAt) / (1000 * 60 * 60);
      const followup = lead.followup_sent || {};
      // Skip if unsubscribed
      if (followup.unsubscribed) { results.skipped.push(lead.ref + ' (unsubscribed)'); continue; }

      // Same-day guard: check if this stage was already sent today
      const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const alreadySentToday = (key) => followup[key] && followup[key].slice(0, 10) === todayStr;

      let emailKey = null;
      if (hoursElapsed >= 168 && !followup.day7 && !alreadySentToday('day7')) emailKey = 'day7';
      else if (hoursElapsed >= 72 && !followup.day3 && !alreadySentToday('day3')) emailKey = 'day3';
      else if (hoursElapsed >= 24 && !followup.day1 && !alreadySentToday('day1')) emailKey = 'day1';

      if (!emailKey) { results.skipped.push(lead.ref); continue; }
      if (!lead.email) { results.skipped.push(lead.ref + ' (no email)'); continue; }

      const emailData = lead.status === 'emailed'
        ? EMAILS[emailKey + '_cold']?.(lead) || EMAILS[emailKey](lead)
        : EMAILS[emailKey](lead);

      if (!isDryRun) {
        await resend.emails.send({
          from: 'Anthony Galeano — Multi Servicios 360 <no-reply@out.multiservicios360.net>',
          to: [lead.email],
          ...emailData,
        });
      }

      // Also notify Anthony
      if (emailKey === 'day1') {
        await resend.emails.send({
          from: 'Multi Servicios 360 <no-reply@out.multiservicios360.net>',
          to: ['info@multiservicios360.net'],
          subject: `📞 Lead sin pagar 24h — ${lead.business_name || lead.contact_name}`,
          html: `<p><strong>${lead.contact_name}</strong> (${lead.business_name}) visitó /hazte-socio hace 24h y no completó el pago. Tel: <a href="tel:${lead.phone}">${lead.phone}</a> — Email: ${lead.email}</p><p>Ref: ${lead.ref}</p>`
        });
      }

      // Update followup_sent (only if not dry run)
      if (!isDryRun) {
        const { error: updateError } = await supabase
          .from('partner_leads')
          .update({ followup_sent: { ...followup, [emailKey]: new Date().toISOString() } })
          .eq('id', lead.id);
        if (updateError) {
          console.error('Failed to update followup_sent for', lead.ref, updateError);
        }
      }

      results.sent.push(`${lead.ref} — ${emailKey}${isDryRun ? ' (DRY RUN)' : ''}`);
    } catch (err) {
      console.error('Followup error:', lead.ref, err);
      results.errors.push(lead.ref);
    }
  }

  return NextResponse.json({ ok: true, ...results });
}

