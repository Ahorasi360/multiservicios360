// app/api/admin/send-partner-outreach/route.js
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net';

const CONTACTS = [
  { name: 'Yesika',     email: 'ygoofyg@gmail.com',                ref: 'yesika-estevez' },
  { name: 'Carmen',     email: 'carmenVguevara@yahoo.com',          ref: 'carmen-guevara' },
  { name: 'Raul',       email: 'MRP777@aol.com',                    ref: 'raul-portillo' },
  { name: 'Maria',      email: 'MARIA_TOBIAS@yahoo.com',            ref: 'maria-tobias' },
  { name: 'Arturo',     email: 'ALBERTOSERVICES@sbcglobal.com',     ref: 'arturo-otero' },
  { name: 'Mildred',    email: 'CMINSURANCESERVICES@yahoo.com',     ref: 'mildred-najera' },
  { name: 'Gloria',     email: 'GELASSAR@yahoo.com',                ref: 'gloria-elassar' },
  { name: 'Graciela',   email: 'GRACIELA.HERNANDEZ@adelphia.net',   ref: 'graciela-hernandez' },
  { name: 'Letta',      email: 'ELLETHAL@hotmail.com',              ref: 'letta-tailiani' },
  { name: 'Veronica',   email: 'GZVERO@yahoo.com',                  ref: 'veronica-rodriguez' },
  { name: 'Alda',       email: 'UGOTMAIL3@yahoo.com',               ref: 'alda-balcarcel' },
  { name: 'Laura',      email: 'LATINBIZ@yahoo.com',                ref: 'laura-tavarez' },
  { name: 'Jorge',      email: 'MEJIAJORGE53@hotmail.com',          ref: 'jorge-mejia' },
  { name: 'Maria',      email: 'MARIAHOME2003@yahoo.com',           ref: 'maria-garcia' },
  { name: 'Joel',       email: 'JOEL@1lenderjoel.com',              ref: 'joel-arellano' },
  { name: 'Norma',      email: 'norma3335@yahoo.com',               ref: 'norma-romero-j' },
  { name: 'Norma',      email: 'CROMECM@aol.com',                   ref: 'norma-romero-s' },
  { name: 'Adolfo',     email: 'ROCHAINCOMETAX@aol.com',            ref: 'adolfo-rocha' },
  { name: 'Agustin',    email: 'ACRUZ87959@gmail.com',              ref: 'agustin-cruz' },
  { name: 'Maria',      email: 'MAJESTY90042@msn.com',              ref: 'maria-jimenez' },
  { name: 'Raul',       email: 'CENTRALPRO@sbcglobal.net',          ref: 'raul-allende' },
  { name: 'Lucia',      email: 'LUCYGOMEZ17@yahoo.com',             ref: 'lucia-gomez' },
  { name: 'Oscar',      email: 'ZTRAVELCARMELA@sbcglobal.net',      ref: 'oscar-palacios' },
  { name: 'Julian',     email: 'APTJV74@yahoo.com',                 ref: 'julian-vasquez' },
  { name: 'Sonia',      email: 'SONHRN1962@aol.com',                ref: 'sonia-regalado' },
  { name: 'Mario',      email: 'SUNFLOWER2292@aol.com',             ref: 'mario-baca' },
  { name: 'Ismael',     email: 'INAVARROTAX@aol.com',               ref: 'ismael-navarro' },
  { name: 'Carlos',     email: 'CESCAMILLA47@yahoo.com',            ref: 'carlos-escamilla' },
  { name: 'Fernando',   email: 'FERNANDOJARAMILLOBAJA@yahoo.com',   ref: 'fernando-jaramillo' },
  { name: 'Vilma',      email: 'VILMAAM@msn.com',                   ref: 'vilma-munoz' },
  { name: 'Kenneth',    email: 'VILMAAMK@yahoo.com',                ref: 'kenneth-martinez' },
  { name: 'Romulo',     email: 'ROMULETE39@sbcglobal.net',          ref: 'romulo-rosales' },
  { name: 'Graciela',   email: 'GZUNIGAC@aol.com',                  ref: 'graciela-castro' },
  { name: 'Gerardo',    email: 'GERARDO.MONTERREY@yahoo.com',       ref: 'gerardo-monterrey' },
  { name: 'Saul',       email: 'NUNEZHOMESALES@aol.com',            ref: 'saul-nunez' },
  { name: 'Marina',     email: 'INUNEZINSURANCE@yahoo.com',         ref: 'marina-nunez' },
  { name: 'Cynthia',    email: 'SEXYBEBA77@gmail.com',              ref: 'cynthia-mendoza' },
  { name: 'Lucita',     email: 'ATS1942@gmail.com',                 ref: 'lucita-basmayor' },
  { name: 'Fernando',   email: 'FSOMOZA@msn.com',                   ref: 'fernando-somoza' },
  { name: 'Nemesia',    email: 'BNSOMOZA@msn.com',                  ref: 'nemesia-somoza' },
  { name: 'Gustavo',    email: 'ZULOSSA@att.net',                   ref: 'gustavo-zuluaga' },
  { name: 'Bernardo',   email: 'BERNARDO_LONDONO@hotmail.com',      ref: 'bernardo-londono' },
  { name: 'German',     email: 'GERMANCANOCANO@yahoo.com',          ref: 'german-cano' },
  { name: 'Deborah',    email: 'FEDERALHALZUET@hotmail.com',        ref: 'deborah-halzuet' },
  { name: 'Maria',      email: 'DIANASTRAVELRIALTO@yahoo.com',      ref: 'maria-mercado' },
  { name: 'Miguel',     email: 'MIGUELMERCADO6420@gmail.com',       ref: 'miguel-mercado' },
  { name: 'Veronica',   email: 'VEROLLAN7@hotmail.com',             ref: 'veronica-rollan' },
  { name: 'Stephanie',  email: 'SMENDOZA43@gmail.com',              ref: 'stephanie-mendoza' },
  { name: 'Marlene',    email: 'MARKELLER91@gmail.com',             ref: 'marlene-keller' },
  { name: 'Humberto',   email: 'HUMBERTOARCINIEGA@yahoo.com',       ref: 'humberto-arciniega' },
  { name: 'Cesar',      email: 'CESAROFFICIAL@hotmail.com',         ref: 'cesar-gonzalez' },
  { name: 'Leopoldo',   email: 'VELEZL1937@yahoo.com',              ref: 'leopoldo-velez' },
  { name: 'Lorraine',   email: 'LARREDA69@gmail.com',               ref: 'lorraine-estrada' },
  { name: 'Abel',       email: 'CICCHIELLOAS@yahoo.com',            ref: 'abel-cicchiello' },
  { name: 'Jonathan',   email: 'JONATHAN.AH@yahoo.com',             ref: 'jonathan-herrera' },
  { name: 'John',       email: 'CENLEG@pacbell.net',                ref: 'john-castro' },
  { name: 'Adriana',    email: 'LOCHOAOPC0701@yahoo.com',           ref: 'adriana-munoz' },
  { name: 'Rocio',      email: 'RVELASCO07@hotmail.com',            ref: 'rocio-zaragoza' },
  { name: 'Guadalupe',  email: 'LUPEGOMEZ@earthlink.net',           ref: 'guadalupe-gomez' },
  { name: 'Jennifer',   email: 'JENACOSTA@yahoo.com',               ref: 'jennifer-acosta' },
  { name: 'Roberto',    email: 'SANTAANAINS@aol.com',               ref: 'roberto-mitchell' },
];

function buildEmail(name, ref) {
  const link = `${SITE_URL}/hazte-socio?ref=${ref}`;
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:20px 0;">
<div style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <div style="background:linear-gradient(135deg,#1E3A8A 0%,#1D4ED8 100%);padding:32px;">
    <p style="margin:0 0 10px;font-size:13px;color:rgba(255,255,255,0.75);font-weight:700;text-transform:uppercase;letter-spacing:1px;"><strong style="color:white;">Everardo Miramontes</strong> lo refirió a usted</p>
    <h1 style="margin:0;font-size:24px;font-weight:900;color:white;line-height:1.4;">Sus clientes ya le pagan a alguien por esto.<br><span style="color:#FCD34D;">¿Por qué no a usted?</span></h1>
  </div>

  <div style="padding:32px;">
    <p style="font-size:16px;color:#374151;line-height:1.8;margin:0 0 20px;">Estimado(a) <strong>${name}</strong>,</p>

    <p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px;"><strong>Everardo Miramontes</strong> me pidió que le contactara personalmente. Lleva más de 20 años sirviéndole a la comunidad — igual que usted — y en enero de este año encontró una forma de generar ingresos adicionales con los mismos clientes que ya tiene.</p>

    <div style="background:#F0F4FF;border-left:5px solid #1E3A8A;border-radius:0 12px 12px 0;padding:20px 24px;margin:0 0 28px;">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="padding:5px 0;font-size:15px;color:#374151;">💰 &nbsp;<strong>Everardo</strong> generó <strong style="font-size:22px;color:#15803D;">$750</strong> en su primera semana</td></tr>
        <tr><td style="padding:5px 0;font-size:15px;color:#374151;">⏱️ &nbsp;Sin contratar a nadie ni cambiar su negocio</td></tr>
        <tr><td style="padding:5px 0;font-size:15px;color:#374151;">🤝 &nbsp;Con clientes que ya le conocen y confían en usted</td></tr>
        <tr><td style="padding:8px 0 5px;font-size:15px;color:#374151;">📅 &nbsp;<strong style="font-size:18px;color:#1E3A8A;">Ingresos los 12 meses del año</strong> — <span style="color:#DC2626;font-weight:700;">no solo en temporada</span></td></tr>
      </table>
    </div>

    <p style="font-size:16px;font-weight:800;color:#1F2937;line-height:1.7;margin:0 0 28px;">No deje dinero en la mesa.<br>Haga click y vea cómo funciona.</p>

    <div style="text-align:center;margin:0 0 14px;">
      <a href="${link}" style="display:inline-block;padding:18px 52px;background:#1E3A8A;color:white;border-radius:10px;font-size:18px;font-weight:900;text-decoration:none;">Ver cómo funciona →</a>
    </div>
    <p style="text-align:center;font-size:13px;color:#9CA3AF;margin:0 0 32px;">Menos de 3 minutos.</p>

    <div style="text-align:center;border:1px solid #E5E7EB;border-radius:12px;padding:16px 20px;margin:0 0 28px;">
      <p style="margin:0 0 6px;font-size:14px;color:#374151;">¿Prefiere que le explique por teléfono?</p>
      <a href="tel:8552467274" style="font-size:24px;font-weight:900;color:#1E3A8A;text-decoration:none;">📞 855.246.7274</a>
      <p style="margin:6px 0 0;font-size:12px;color:#9CA3AF;">Lunes a Sábado 9am–6pm &nbsp;|&nbsp; En español</p>
    </div>

    <hr style="border:none;border-top:1px solid #E5E7EB;margin:0 0 20px;">
    <p style="margin:0;font-size:15px;font-weight:700;color:#1F2937;">Anthony Galeano</p>
    <p style="margin:2px 0;font-size:13px;color:#6B7280;">Fundador — Multi Servicios 360</p>
    <p style="margin:2px 0;font-size:13px;color:#6B7280;">Colega de <strong>Everardo Miramontes</strong></p>
    <p style="margin:4px 0 0;font-size:13px;color:#6B7280;">855.246.7274 &nbsp;|&nbsp; multiservicios360.net</p>
  </div>

  <div style="background:#F8FAFC;padding:14px 28px;border-top:1px solid #E5E7EB;text-align:center;">
    <p style="margin:0;font-size:11px;color:#9CA3AF;line-height:1.7;">Multi Servicios 360 — Preparación de documentos legales en español.<br>No somos un bufete de abogados ni brindamos asesoramiento jurídico.<br>Para no recibir más emails, responda con "DETENER".</p>
  </div>
</div>
</div>
</body>
</html>`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const adminPw = request.headers.get('x-admin-password');
    if (adminPw !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const testOnly = body.test === true;
    const results = { sent: [], failed: [] };

    // If test mode — send only to Anthony
    const targets = testOnly
      ? [{ name: 'Anthony', email: 'flashpreviews@yahoo.com', ref: 'anthony-test' }]
      : CONTACTS;

    for (const contact of targets) {
      // Small delay between sends to avoid rate limits
      await new Promise(r => setTimeout(r, 300));

      try {
        await resend.emails.send({
          from: 'Anthony Galeano — Multi Servicios 360 <no-reply@multiservicios360.net>',
          to: [contact.email],
          bcc: testOnly ? [] : ['flashpreviews@yahoo.com'],
          subject: `${contact.name}, Everardo Miramontes lo refirió a usted`,
          html: buildEmail(contact.name, contact.ref),
        });

        // Save lead to Supabase for tracking
        await supabase.from('partner_leads').upsert({
          ref: contact.ref,
          contact_name: contact.name,
          email: contact.email,
          status: 'emailed',
          visited_at: new Date().toISOString(),
          applied_at: new Date().toISOString(),
        }, { onConflict: 'ref', ignoreDuplicates: true });

        results.sent.push(contact.email);
      } catch (err) {
        console.error(`Failed ${contact.email}:`, err.message);
        results.failed.push({ email: contact.email, error: err.message });
      }
    }

    // Final summary to Anthony
    await resend.emails.send({
      from: 'Multi Servicios 360 <no-reply@multiservicios360.net>',
      to: ['flashpreviews@yahoo.com'],
      subject: testOnly
        ? '✅ Test enviado — revisa tu inbox'
        : `✅ Campaña completa — ${results.sent.length} emails enviados`,
      html: `<p><strong>${results.sent.length} emails enviados exitosamente.</strong></p>
             <p>Fallidos: ${results.failed.length}</p>
             ${results.failed.length ? `<p>Errores: ${JSON.stringify(results.failed)}</p>` : ''}
             <p>El drip automático corre diario a las 11am — seguimiento en 24h, 72h y 7 días a los que no compren.</p>`,
    });

    return NextResponse.json({
      ok: true,
      sent: results.sent.length,
      failed: results.failed.length,
      failedList: results.failed,
    });

  } catch (err) {
    console.error('Outreach error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
