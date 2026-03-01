export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SITE_URL = 'https://multiservicios360.net';
const FROM_EMAIL = 'Multi Servicios 360 <soporte@multiservicios360.net>';

const DOC_NAMES = {
  es: {
    travel_authorization: 'Carta de Autorización de Viaje',
    poa: 'Poder Notarial General',
    limited_poa: 'Poder Notarial Limitado',
    trust: 'Fideicomiso en Vida',
    llc: 'Formación de LLC',
    guardianship_designation: 'Designación de Guardián',
    affidavit: 'Declaración Jurada',
    bill_of_sale: 'Carta de Venta',
    promissory_note: 'Pagaré',
    authorization_letter: 'Carta de Autorización',
    revocation_poa: 'Revocación de Poder Notarial',
    pour_over_will: 'Testamento de Traspaso al Fideicomiso',
    simple_will: 'Testamento Simple',
    hipaa_authorization: 'Autorización HIPAA',
    certification_of_trust: 'Certificación de Fideicomiso',
    s_corp_formation: 'Paquete S-Corporation',
    c_corp_formation: 'Paquete C-Corporation',
    corporate_minutes: 'Actas Corporativas',
    banking_resolution: 'Resolución Bancaria',
  },
  en: {
    travel_authorization: 'Travel Authorization Letter',
    poa: 'General Power of Attorney',
    limited_poa: 'Limited Power of Attorney',
    trust: 'Living Trust',
    llc: 'LLC Formation',
    guardianship_designation: 'Guardianship Designation',
    affidavit: 'Affidavit',
    bill_of_sale: 'Bill of Sale',
    promissory_note: 'Promissory Note',
    authorization_letter: 'Authorization Letter',
    revocation_poa: 'POA Revocation',
    pour_over_will: 'Pour-Over Will',
    simple_will: 'Last Will & Testament',
    hipaa_authorization: 'HIPAA Authorization',
    certification_of_trust: 'Certification of Trust',
    s_corp_formation: 'S-Corporation Formation Package',
    c_corp_formation: 'C-Corporation Formation Package',
    corporate_minutes: 'Corporate Minutes',
    banking_resolution: 'Banking Resolution',
  }
};

const DOC_URLS = {
  travel_authorization: '/travel-authorization',
  poa: '/poa',
  limited_poa: '/limited-poa',
  trust: '/trust',
  llc: '/llc',
  guardianship_designation: '/guardianship',
  affidavit: '/affidavit',
  bill_of_sale: '/bill-of-sale',
  promissory_note: '/promissory-note',
  authorization_letter: '/authorization-letter',
  revocation_poa: '/revocation-poa',
};

const DOC_PRICES = {
  travel_authorization: '$49',
  poa: '$149',
  limited_poa: '$149',
  trust: '$499',
  llc: '$299',
  guardianship_designation: '$129',
  affidavit: '$49',
  bill_of_sale: '$49',
  promissory_note: '$49',
  authorization_letter: '$49',
  revocation_poa: '$49',
};

function resumeUrl(draft) {
  const base = DOC_URLS[draft.doc_type] || '/';
  return `${SITE_URL}${base}?resume=${encodeURIComponent(draft.email)}&lang=${draft.language || 'es'}`;
}

function getEmail1(draft) {
  const lang = draft.language || 'es';
  const name = draft.client_name ? `, ${draft.client_name.split(' ')[0]}` : '';
  const docName = DOC_NAMES[lang]?.[draft.doc_type] || DOC_NAMES.es[draft.doc_type] || 'su documento';
  const url = resumeUrl(draft);

  if (lang === 'en') {
    return {
      subject: `You left something behind — your ${docName} is waiting`,
      html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#ffffff">
  <div style="background:#1E3A8A;padding:20px;border-radius:12px 12px 0 0;text-align:center">
    <h1 style="color:#ffffff;margin:0;font-size:22px">Multi Servicios 360</h1>
    <p style="color:#93C5FD;margin:4px 0 0;font-size:14px">Legal Documents for Latino Families</p>
  </div>
  <div style="background:#F9FAFB;padding:30px;border-radius:0 0 12px 12px;border:1px solid #E5E7EB;border-top:none">
    <h2 style="color:#1F2937;font-size:20px">Hey${name}, you started something important 👋</h2>
    <p style="color:#4B5563;line-height:1.6">Your <strong>${docName}</strong> is saved and waiting for you. You only need a few more minutes to finish — everything you entered is still there.</p>
    <div style="text-align:center;margin:28px 0">
      <a href="${url}" style="background:#16A34A;color:#ffffff;padding:16px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block">
        ✅ Continue My Document
      </a>
    </div>
    <p style="color:#6B7280;font-size:13px;text-align:center">Secure payment · Bilingual document (English & Spanish) · Ready to notarize</p>
    <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0">
    <p style="color:#9CA3AF;font-size:12px;text-align:center">Multi Servicios 360 · Not a law firm · Self-help document software<br>
    <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(draft.email)}" style="color:#9CA3AF">Unsubscribe</a></p>
  </div>
</div>`
    };
  }

  return {
    subject: `${name ? name.trim() + ', te' : 'Te'} quedaste a la mitad — tu ${docName} te espera`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#ffffff">
  <div style="background:#1E3A8A;padding:20px;border-radius:12px 12px 0 0;text-align:center">
    <h1 style="color:#ffffff;margin:0;font-size:22px">Multi Servicios 360</h1>
    <p style="color:#93C5FD;margin:4px 0 0;font-size:14px">Documentos Legales para Familias Latinas</p>
  </div>
  <div style="background:#F9FAFB;padding:30px;border-radius:0 0 12px 12px;border:1px solid #E5E7EB;border-top:none">
    <h2 style="color:#1F2937;font-size:20px">Hola${name}, empezaste algo importante 👋</h2>
    <p style="color:#4B5563;line-height:1.6">Tu <strong>${docName}</strong> está guardada y te espera. Solo necesitas unos minutos más para terminar — todo lo que ingresaste sigue ahí.</p>
    <div style="text-align:center;margin:28px 0">
      <a href="${url}" style="background:#16A34A;color:#ffffff;padding:16px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block">
        ✅ Continuar Mi Documento
      </a>
    </div>
    <p style="color:#6B7280;font-size:13px;text-align:center">Pago seguro · Documento bilingüe (Español e Inglés) · Listo para notarizar</p>
    <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0">
    <p style="color:#9CA3AF;font-size:12px;text-align:center">Multi Servicios 360 · No somos bufete de abogados · Software de autoayuda legal<br>
    <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(draft.email)}" style="color:#9CA3AF">Cancelar suscripción</a></p>
  </div>
</div>`
  };
}

function getEmail2(draft) {
  const lang = draft.language || 'es';
  const name = draft.client_name ? `, ${draft.client_name.split(' ')[0]}` : '';
  const docName = DOC_NAMES[lang]?.[draft.doc_type] || DOC_NAMES.es[draft.doc_type] || 'su documento';
  const price = DOC_PRICES[draft.doc_type] || '$49';
  const url = resumeUrl(draft);
  const isTravel = draft.doc_type === 'travel_authorization';

  if (lang === 'en') {
    return {
      subject: `Don't let your trip get complicated — finish your ${docName}`,
      html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#ffffff">
  <div style="background:#1E3A8A;padding:20px;border-radius:12px 12px 0 0;text-align:center">
    <h1 style="color:#ffffff;margin:0;font-size:22px">Multi Servicios 360</h1>
  </div>
  <div style="background:#FFF7ED;padding:30px;border-radius:0 0 12px 12px;border:1px solid #FED7AA;border-top:none">
    <h2 style="color:#1F2937;font-size:20px">⚠️ Still working on your ${docName}${name}?</h2>
    ${isTravel ? `<p style="color:#4B5563;line-height:1.6"><strong>Without this letter, immigration officers can stop your child at the airport.</strong> It happens every day to families who didn't know. Don't risk it for ${price}.</p>` : `<p style="color:#4B5563;line-height:1.6">Your document is still saved. Finish it today — it only takes a few minutes and gives your family real legal protection.</p>`}
    <div style="background:#ffffff;border:1px solid #E5E7EB;border-radius:10px;padding:16px;margin:20px 0">
      <p style="margin:0;color:#374151;font-size:14px">✓ &nbsp;Everything you entered is saved</p>
      <p style="margin:8px 0 0;color:#374151;font-size:14px">✓ &nbsp;Document ready in minutes</p>
      <p style="margin:8px 0 0;color:#374151;font-size:14px">✓ &nbsp;Only ${price} — less than a notary alone</p>
    </div>
    <div style="text-align:center;margin:24px 0">
      <a href="${url}" style="background:#DC2626;color:#ffffff;padding:16px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block">
        🔴 Finish My Document Now
      </a>
    </div>
    <p style="color:#9CA3AF;font-size:12px;text-align:center">
    <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(draft.email)}" style="color:#9CA3AF">Unsubscribe</a></p>
  </div>
</div>`
    };
  }

  return {
    subject: isTravel
      ? `⚠️ Sin esta carta, pueden detener a tu hijo en el aeropuerto`
      : `⚠️ Tu ${docName} sigue sin terminar${name}`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#ffffff">
  <div style="background:#1E3A8A;padding:20px;border-radius:12px 12px 0 0;text-align:center">
    <h1 style="color:#ffffff;margin:0;font-size:22px">Multi Servicios 360</h1>
  </div>
  <div style="background:#FFF7ED;padding:30px;border-radius:0 0 12px 12px;border:1px solid #FED7AA;border-top:none">
    <h2 style="color:#1F2937;font-size:20px">⚠️ ¿Sigues trabajando en tu ${docName}${name}?</h2>
    ${isTravel
      ? `<p style="color:#4B5563;line-height:1.6"><strong>Sin esta carta, los agentes de migración pueden detener a tu hijo en el aeropuerto.</strong> Le pasa a familias todos los días. No arriesgues el viaje por ${price}.</p>`
      : `<p style="color:#4B5563;line-height:1.6">Tu documento sigue guardado. Termínalo hoy — solo toma unos minutos y le da a tu familia protección legal real.</p>`}
    <div style="background:#ffffff;border:1px solid #E5E7EB;border-radius:10px;padding:16px;margin:20px 0">
      <p style="margin:0;color:#374151;font-size:14px">✓ &nbsp;Todo lo que ingresaste está guardado</p>
      <p style="margin:8px 0 0;color:#374151;font-size:14px">✓ &nbsp;Documento listo en minutos</p>
      <p style="margin:8px 0 0;color:#374151;font-size:14px">✓ &nbsp;Solo ${price} — menos que un notario solo</p>
    </div>
    <div style="text-align:center;margin:24px 0">
      <a href="${url}" style="background:#DC2626;color:#ffffff;padding:16px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block">
        🔴 Terminar Mi Documento Ahora
      </a>
    </div>
    <p style="color:#9CA3AF;font-size:12px;text-align:center">
    <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(draft.email)}" style="color:#9CA3AF">Cancelar suscripción</a></p>
  </div>
</div>`
  };
}

function getEmail3(draft) {
  const lang = draft.language || 'es';
  const name = draft.client_name ? `, ${draft.client_name.split(' ')[0]}` : '';
  const docName = DOC_NAMES[lang]?.[draft.doc_type] || DOC_NAMES.es[draft.doc_type] || 'su documento';
  const price = DOC_PRICES[draft.doc_type] || '$49';
  const url = resumeUrl(draft);

  if (lang === 'en') {
    return {
      subject: `Last reminder — your ${docName} is still saved`,
      html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#ffffff">
  <div style="background:#1E3A8A;padding:20px;border-radius:12px 12px 0 0;text-align:center">
    <h1 style="color:#ffffff;margin:0;font-size:22px">Multi Servicios 360</h1>
  </div>
  <div style="background:#F9FAFB;padding:30px;border-radius:0 0 12px 12px;border:1px solid #E5E7EB;border-top:none">
    <h2 style="color:#1F2937;font-size:20px">Last chance to finish your ${docName}${name}</h2>
    <p style="color:#4B5563;line-height:1.6">We'll stop sending reminders after this. Your saved progress will be available for 30 more days.</p>
    <p style="color:#4B5563;line-height:1.6">Thousands of Latino families in California, Texas, Florida, and Illinois have already protected themselves with our documents — at only ${price}, there's no reason to wait.</p>
    <div style="text-align:center;margin:24px 0">
      <a href="${url}" style="background:#1E3A8A;color:#ffffff;padding:16px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block">
        📄 Finish My ${docName}
      </a>
    </div>
    <p style="color:#6B7280;font-size:13px;text-align:center">Questions? Call us: <a href="tel:8552467274" style="color:#1E3A8A">855.246.7274</a></p>
    <p style="color:#9CA3AF;font-size:12px;text-align:center">
    <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(draft.email)}" style="color:#9CA3AF">Unsubscribe</a></p>
  </div>
</div>`
    };
  }

  return {
    subject: `Último recordatorio — tu ${docName} sigue guardada${name}`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#ffffff">
  <div style="background:#1E3A8A;padding:20px;border-radius:12px 12px 0 0;text-align:center">
    <h1 style="color:#ffffff;margin:0;font-size:22px">Multi Servicios 360</h1>
  </div>
  <div style="background:#F9FAFB;padding:30px;border-radius:0 0 12px 12px;border:1px solid #E5E7EB;border-top:none">
    <h2 style="color:#1F2937;font-size:20px">Última oportunidad de terminar tu ${docName}${name}</h2>
    <p style="color:#4B5563;line-height:1.6">Después de este email no te enviaremos más recordatorios. Tu progreso guardado estará disponible por 30 días más.</p>
    <p style="color:#4B5563;line-height:1.6">Miles de familias latinas en California, Texas, Florida e Illinois ya se protegieron con nuestros documentos — a solo ${price}, no hay razón para esperar.</p>
    <div style="text-align:center;margin:24px 0">
      <a href="${url}" style="background:#1E3A8A;color:#ffffff;padding:16px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block">
        📄 Terminar Mi ${docName}
      </a>
    </div>
    <p style="color:#6B7280;font-size:13px;text-align:center">¿Preguntas? Llámenos: <a href="tel:8552467274" style="color:#1E3A8A">855.246.7274</a></p>
    <p style="color:#9CA3AF;font-size:12px;text-align:center">
    <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(draft.email)}" style="color:#9CA3AF">Cancelar suscripción</a></p>
  </div>
</div>`
  };
}

async function sendEmail(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  return res.ok;
}

export async function GET(request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const results = { reminder1: 0, reminder2: 0, reminder3: 0, errors: [] };

  try {
    // Get all incomplete drafts
    const { data: drafts, error } = await supabase
      .from('document_drafts')
      .select('*')
      .eq('completed', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!drafts?.length) return NextResponse.json({ success: true, message: 'No drafts to process', results });

    for (const draft of drafts) {
      const createdAt = new Date(draft.created_at);
      const hoursSince = (now - createdAt) / (1000 * 60 * 60);

      // Reminder 1 — 1 hour after creation
      if (!draft.reminder_1_sent && hoursSince >= 1 && hoursSince < 24) {
        const email = getEmail1(draft);
        const sent = await sendEmail(draft.email, email.subject, email.html);
        if (sent) {
          await supabase.from('document_drafts').update({ reminder_1_sent: true }).eq('id', draft.id);
          results.reminder1++;
        }
      }

      // Reminder 2 — 24 hours after creation
      if (!draft.reminder_2_sent && hoursSince >= 24 && hoursSince < 72) {
        const email = getEmail2(draft);
        const sent = await sendEmail(draft.email, email.subject, email.html);
        if (sent) {
          await supabase.from('document_drafts').update({ reminder_2_sent: true }).eq('id', draft.id);
          results.reminder2++;
        }
      }

      // Reminder 3 — 3 days after creation
      if (!draft.reminder_3_sent && hoursSince >= 72) {
        const email = getEmail3(draft);
        const sent = await sendEmail(draft.email, email.subject, email.html);
        if (sent) {
          await supabase.from('document_drafts').update({ reminder_3_sent: true }).eq('id', draft.id);
          results.reminder3++;
        }
      }
    }

    return NextResponse.json({ success: true, processed: drafts.length, results });
  } catch (err) {
    console.error('Draft reminder cron error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
