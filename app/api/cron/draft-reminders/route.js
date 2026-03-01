export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SITE_URL = 'https://multiservicios360.net';
const FROM_EMAIL = 'Multi Servicios 360 <info@multiservicios360.net>';

const DOC_NAMES = {
  es: {
    travel_authorization:   'Carta de Autorización de Viaje',
    poa:                    'Poder Notarial General',
    limited_poa:            'Poder Notarial Limitado',
    trust:                  'Fideicomiso en Vida',
    llc:                    'Formación de LLC',
    guardianship_designation: 'Designación de Guardián',
    affidavit:              'Declaración Jurada',
    bill_of_sale:           'Carta de Venta',
    promissory_note:        'Pagaré',
    authorization_letter:   'Carta de Autorización',
    revocation_poa:         'Revocación de Poder Notarial',
    pour_over_will:         'Testamento de Traspaso al Fideicomiso',
    simple_will:            'Testamento Simple',
    hipaa_authorization:    'Autorización HIPAA',
    certification_of_trust: 'Certificación de Fideicomiso',
    s_corp_formation:       'Paquete S-Corporation',
    c_corp_formation:       'Paquete C-Corporation',
    corporate_minutes:      'Actas Corporativas',
    banking_resolution:     'Resolución Bancaria',
    small_estate_affidavit: 'Declaración Jurada de Sucesión Simplificada',
    quitclaim_deed:         'Escritura de Traspaso (Quitclaim Deed)',
    contractor_agreement:   'Contrato de Contratista Independiente',
    demand_letter:          'Carta de Demanda de Pago',
    apostille_letter:       'Carta de Solicitud de Apostilla',
  },
  en: {
    travel_authorization:   'Travel Authorization Letter',
    poa:                    'General Power of Attorney',
    limited_poa:            'Limited Power of Attorney',
    trust:                  'Living Trust',
    llc:                    'LLC Formation',
    guardianship_designation: 'Guardianship Designation',
    affidavit:              'Affidavit',
    bill_of_sale:           'Bill of Sale',
    promissory_note:        'Promissory Note',
    authorization_letter:   'Authorization Letter',
    revocation_poa:         'POA Revocation',
    pour_over_will:         'Pour-Over Will',
    simple_will:            'Last Will & Testament',
    hipaa_authorization:    'HIPAA Authorization',
    certification_of_trust: 'Certification of Trust',
    s_corp_formation:       'S-Corporation Formation Package',
    c_corp_formation:       'C-Corporation Formation Package',
    corporate_minutes:      'Corporate Minutes',
    banking_resolution:     'Banking Resolution',
    small_estate_affidavit: 'Small Estate Affidavit (§13100)',
    quitclaim_deed:         'Quitclaim Deed',
    contractor_agreement:   'Independent Contractor Agreement',
    demand_letter:          'Demand Letter',
    apostille_letter:       'Apostille Cover Letter',
  },
};

const DOC_URLS = {
  travel_authorization:   '/travel-authorization',
  poa:                    '/poa',
  limited_poa:            '/limited-poa',
  trust:                  '/trust',
  llc:                    '/llc',
  guardianship_designation: '/guardianship',
  affidavit:              '/affidavit',
  bill_of_sale:           '/bill-of-sale',
  promissory_note:        '/promissory-note',
  authorization_letter:   '/authorization-letter',
  revocation_poa:         '/revocation-poa',
  pour_over_will:         '/pour-over-will',
  simple_will:            '/simple-will',
  hipaa_authorization:    '/hipaa-authorization',
  certification_of_trust: '/certification-of-trust',
  s_corp_formation:       '/s-corp-formation',
  c_corp_formation:       '/c-corp-formation',
  corporate_minutes:      '/corporate-minutes',
  banking_resolution:     '/banking-resolution',
  small_estate_affidavit: '/small-estate-affidavit',
  quitclaim_deed:         '/quitclaim-deed',
  contractor_agreement:   '/contractor-agreement',
  demand_letter:          '/demand-letter',
  apostille_letter:       '/apostille-letter',
};

const DOC_PRICES = {
  travel_authorization: '$49',
  poa: '$149', limited_poa: '$149', trust: '$499', llc: '$299',
  guardianship_designation: '$129', affidavit: '$89', bill_of_sale: '$69',
  promissory_note: '$89', authorization_letter: '$49', revocation_poa: '$59',
  pour_over_will: '$199', simple_will: '$149', hipaa_authorization: '$99',
  certification_of_trust: '$99', s_corp_formation: '$499', c_corp_formation: '$499',
  corporate_minutes: '$149', banking_resolution: '$99',
  small_estate_affidavit: '$149', quitclaim_deed: '$199',
  contractor_agreement: '$149', demand_letter: '$99', apostille_letter: '$79',
};

function resumeUrl(draft) {
  const lang = draft.language || 'es';
  const base = lang === 'en'
    ? `/en${DOC_URLS[draft.doc_type] || '/'}`
    : (DOC_URLS[draft.doc_type] || '/');
  return `${SITE_URL}${base}?resume=${encodeURIComponent(draft.email)}&lang=${lang}`;
}

function getName(draft) {
  if (!draft.client_name) return '';
  return draft.client_name.split(' ')[0];
}

// ─── Email Templates ─────────────────────────────────────────────────
function buildEmail1(draft) {
  const lang = draft.language || 'es';
  const isEn = lang === 'en';
  const firstName = getName(draft);
  const docName = DOC_NAMES[lang]?.[draft.doc_type] || DOC_NAMES.es[draft.doc_type] || 'su documento';
  const url = resumeUrl(draft);
  const nameGreeting = firstName ? `, ${firstName}` : '';

  return {
    subject: isEn
      ? `${firstName ? firstName + ', you' : 'You'} left something behind — your ${docName} is waiting`
      : `${firstName ? firstName + ', te' : 'Te'} quedaste a la mitad — tu ${docName} te espera`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:16px;">
  <div style="background:#1E3A8A;border-radius:12px 12px 0 0;padding:24px;text-align:center;">
    <div style="display:inline-block;background:white;border-radius:8px;padding:6px 14px;margin-bottom:12px;">
      <span style="color:#1E3A8A;font-weight:800;font-size:18px;">M360</span>
    </div>
    <h1 style="color:white;font-size:20px;margin:0;line-height:1.3;">
      ${isEn ? 'You left something behind 👋' : 'Te quedaste a la mitad 👋'}
    </h1>
  </div>
  <div style="background:white;padding:28px 24px;border-radius:0 0 12px 12px;border:1px solid #E2E8F0;border-top:none;">
    <p style="color:#0F172A;font-size:16px;margin:0 0 12px;">
      ${isEn ? `Hey${nameGreeting},` : `Hola${nameGreeting},`}
    </p>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;">
      ${isEn
        ? `Your <strong>${docName}</strong> is saved and waiting. You only need a few more minutes to finish — everything you entered is still there.`
        : `Tu <strong>${docName}</strong> está guardada y te espera. Solo necesitas unos minutos más para terminar — todo lo que ingresaste sigue ahí.`}
    </p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${url}" style="display:inline-block;background:#16A34A;color:white;padding:16px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">
        ✅ ${isEn ? 'Continue My Document' : 'Continuar Mi Documento'}
      </a>
    </div>
    <div style="background:#F8FAFC;border-radius:8px;padding:14px 16px;margin-bottom:16px;">
      <p style="color:#64748B;font-size:13px;margin:0;text-align:center;">
        ${isEn ? '🔒 Secure payment · Bilingual document · Ready to notarize' : '🔒 Pago seguro · Documento bilingüe · Listo para notarizar'}
      </p>
    </div>
    <p style="color:#94A3B8;font-size:12px;text-align:center;margin:0;">
      Multi Servicios 360 · 855.246.7274 ·
      <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(draft.email)}" style="color:#94A3B8;">
        ${isEn ? 'Unsubscribe' : 'Cancelar suscripción'}
      </a>
    </p>
  </div>
</div>
</body></html>`
  };
}

function buildEmail2(draft) {
  const lang = draft.language || 'es';
  const isEn = lang === 'en';
  const firstName = getName(draft);
  const docName = DOC_NAMES[lang]?.[draft.doc_type] || DOC_NAMES.es[draft.doc_type] || 'su documento';
  const price = DOC_PRICES[draft.doc_type] || '$49';
  const url = resumeUrl(draft);
  const isTravel = draft.doc_type === 'travel_authorization';
  const nameGreeting = firstName ? ` ${firstName}` : '';

  return {
    subject: isEn
      ? `⚠️ Still working on your ${docName}${firstName ? ', ' + firstName : ''}?`
      : isTravel
        ? `⚠️ Sin esta carta, pueden detener a su hijo en el aeropuerto`
        : `⚠️ Tu ${docName} sigue sin terminar${firstName ? ', ' + firstName : ''}`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FFF7ED;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:16px;">
  <div style="background:#1E3A8A;border-radius:12px 12px 0 0;padding:20px;text-align:center;">
    <span style="color:white;font-weight:800;font-size:18px;">Multi Servicios 360</span>
  </div>
  <div style="background:white;padding:28px 24px;border-radius:0 0 12px 12px;border:1px solid #FED7AA;border-top:none;">
    <h2 style="color:#92400E;font-size:18px;margin:0 0 16px;">
      ⚠️ ${isEn ? `Still working on your ${docName}${nameGreeting}?` : `¿Sigues trabajando en tu ${docName}${nameGreeting}?`}
    </h2>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;">
      ${isTravel
        ? (isEn
            ? `<strong>Without this letter, immigration officers can stop your child at the airport.</strong> It happens to families every day. Don't risk the trip for just ${price}.`
            : `<strong>Sin esta carta, los agentes de migración pueden detener a su hijo en el aeropuerto.</strong> Le pasa a familias todos los días. No arriesgue el viaje por solo ${price}.`)
        : (isEn
            ? `Your document is still saved. Finish it today — it only takes a few minutes and gives your family real legal protection.`
            : `Tu documento sigue guardado. Termínalo hoy — solo toma unos minutos y le da a tu familia protección legal real.`)}
    </p>
    <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;padding:16px;margin:0 0 20px;">
      <p style="color:#374151;font-size:14px;margin:0 0 8px;">✓ &nbsp;${isEn ? 'Everything you entered is saved' : 'Todo lo que ingresaste está guardado'}</p>
      <p style="color:#374151;font-size:14px;margin:0 0 8px;">✓ &nbsp;${isEn ? 'Document ready in minutes' : 'Documento listo en minutos'}</p>
      <p style="color:#374151;font-size:14px;margin:0;">✓ &nbsp;${isEn ? `Only ${price} — less than a notary alone` : `Solo ${price} — menos que un notario solo`}</p>
    </div>
    <div style="text-align:center;margin:20px 0;">
      <a href="${url}" style="display:inline-block;background:#DC2626;color:white;padding:16px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">
        🔴 ${isEn ? 'Finish My Document Now' : 'Terminar Mi Documento Ahora'}
      </a>
    </div>
    <p style="color:#94A3B8;font-size:12px;text-align:center;margin:0;">
      <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(draft.email)}" style="color:#94A3B8;">
        ${isEn ? 'Unsubscribe' : 'Cancelar suscripción'}
      </a>
    </p>
  </div>
</div>
</body></html>`
  };
}

function buildEmail3(draft) {
  const lang = draft.language || 'es';
  const isEn = lang === 'en';
  const firstName = getName(draft);
  const docName = DOC_NAMES[lang]?.[draft.doc_type] || DOC_NAMES.es[draft.doc_type] || 'su documento';
  const price = DOC_PRICES[draft.doc_type] || '$49';
  const url = resumeUrl(draft);
  const nameGreeting = firstName ? `, ${firstName}` : '';

  return {
    subject: isEn
      ? `Last reminder — your ${docName} is still saved`
      : `Último recordatorio — tu ${docName} sigue guardada${firstName ? ', ' + firstName : ''}`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:16px;">
  <div style="background:#0F172A;border-radius:12px 12px 0 0;padding:20px;text-align:center;">
    <span style="color:white;font-weight:800;font-size:18px;">Multi Servicios 360</span>
  </div>
  <div style="background:white;padding:28px 24px;border-radius:0 0 12px 12px;border:1px solid #E2E8F0;border-top:none;">
    <h2 style="color:#0F172A;font-size:18px;margin:0 0 16px;">
      ${isEn ? `Last chance${nameGreeting} — finish your ${docName}` : `Última oportunidad${nameGreeting} — termina tu ${docName}`}
    </h2>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 16px;">
      ${isEn
        ? "We'll stop sending reminders after this. Your saved progress will be available for 30 more days."
        : 'Después de este email no te enviaremos más recordatorios. Tu progreso guardado estará disponible por 30 días más.'}
    </p>
    <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;">
      ${isEn
        ? `Thousands of Latino families in California, Texas, Florida, and Illinois have already protected themselves with our documents — at only ${price}, there's no reason to wait.`
        : `Miles de familias latinas en California, Texas, Florida e Illinois ya se protegieron con nuestros documentos — a solo ${price}, no hay razón para esperar.`}
    </p>
    <div style="text-align:center;margin:20px 0;">
      <a href="${url}" style="display:inline-block;background:#1E3A8A;color:white;padding:16px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">
        📄 ${isEn ? `Finish My ${docName}` : `Terminar Mi ${docName}`}
      </a>
    </div>
    <p style="color:#64748B;font-size:13px;text-align:center;margin:0 0 8px;">
      ${isEn ? '📞 Questions? Call us:' : '📞 ¿Preguntas? Llámenos:'}
      <a href="tel:8552467274" style="color:#1E3A8A;font-weight:700;">855.246.7274</a>
    </p>
    <p style="color:#94A3B8;font-size:12px;text-align:center;margin:0;">
      <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(draft.email)}" style="color:#94A3B8;">
        ${isEn ? 'Unsubscribe' : 'Cancelar suscripción'}
      </a>
    </p>
  </div>
</div>
</body></html>`
  };
}

// ─── Send via Resend ──────────────────────────────────────────────────
async function sendReminderEmail(to, subject, html) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(`Resend error for ${to}:`, data);
      return false;
    }
    console.log(`Reminder sent to ${to}: ${subject.substring(0, 50)}`);
    return true;
  } catch (err) {
    console.error(`Email send failed for ${to}:`, err.message);
    return false;
  }
}

// ─── Main cron handler ────────────────────────────────────────────────
export async function GET(request) {
  // Verify cron secret (Vercel adds this automatically for cron routes)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Allow: (1) valid CRON_SECRET, (2) development mode, (3) no secret configured yet
  const isAuthorized = !cronSecret
    || process.env.NODE_ENV === 'development'
    || authHeader === `Bearer ${cronSecret}`;

  if (!isAuthorized) {
    console.error('Cron auth failed. Header:', authHeader?.substring(0, 20));
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const results = {
    processed: 0,
    reminder1: 0,
    reminder2: 0,
    reminder3: 0,
    errors: [],
    timestamp: now.toISOString(),
  };

  try {
    // Get all incomplete drafts that need reminders
    const { data: drafts, error } = await supabase
      .from('document_drafts')
      .select('id, email, doc_type, language, client_name, created_at, reminder_1_sent, reminder_2_sent, reminder_3_sent')
      .eq('completed', false)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('DB error fetching drafts:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Draft reminders: found ${drafts?.length || 0} incomplete drafts`);
    results.processed = drafts?.length || 0;

    for (const draft of (drafts || [])) {
      const createdAt = new Date(draft.created_at);
      const hoursSince = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      try {
        // Reminder 1 — 1 hour after creation (or if less than 24h old)
        if (!draft.reminder_1_sent && hoursSince >= 1 && hoursSince < 24) {
          const email = buildEmail1(draft);
          const sent = await sendReminderEmail(draft.email, email.subject, email.html);
          if (sent) {
            await supabase.from('document_drafts')
              .update({ reminder_1_sent: true })
              .eq('id', draft.id);
            results.reminder1++;
          }
        }

        // Reminder 2 — 24 hours after creation
        else if (!draft.reminder_2_sent && hoursSince >= 24 && hoursSince < 72) {
          const email = buildEmail2(draft);
          const sent = await sendReminderEmail(draft.email, email.subject, email.html);
          if (sent) {
            await supabase.from('document_drafts')
              .update({ reminder_2_sent: true })
              .eq('id', draft.id);
            results.reminder2++;
          }
        }

        // Reminder 3 — 72 hours (3 days) after creation
        else if (!draft.reminder_3_sent && hoursSince >= 72) {
          const email = buildEmail3(draft);
          const sent = await sendReminderEmail(draft.email, email.subject, email.html);
          if (sent) {
            await supabase.from('document_drafts')
              .update({ reminder_3_sent: true })
              .eq('id', draft.id);
            results.reminder3++;
          }
        }
      } catch (draftErr) {
        console.error(`Error processing draft ${draft.id}:`, draftErr.message);
        results.errors.push({ draftId: draft.id, error: draftErr.message });
      }
    }

    console.log('Draft reminder results:', results);
    return NextResponse.json({ success: true, ...results });

  } catch (err) {
    console.error('Cron fatal error:', err);
    return NextResponse.json({ error: err.message, ...results }, { status: 500 });
  }
}
