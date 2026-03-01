import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

const GUIDES = {
  'testamento-simple': {
    title_es: 'Guía: Testamento Simple en California',
    title_en: 'Guide: Simple Will in California',
    filename: 'guia-testamento-simple.pdf',
    url: '/guides/guia-testamento-simple.pdf',
    docUrl_es: '/simple-will',
    docUrl_en: '/en/simple-will',
    docLabel_es: 'Preparar Mi Testamento — $149 →',
    docLabel_en: 'Prepare My Will — $149 →',
  },
  'testamento-traspaso': {
    title_es: 'Guía: Pour-Over Will — Testamento de Traspaso',
    title_en: 'Guide: Pour-Over Will in California',
    filename: 'guia-testamento-traspaso.pdf',
    url: '/guides/guia-testamento-traspaso.pdf',
    docUrl_es: '/pour-over-will',
    docUrl_en: '/en/pour-over-will',
    docLabel_es: 'Preparar Mi Pour-Over Will →',
    docLabel_en: 'Prepare My Pour-Over Will →',
  },
  'hipaa-authorization': {
    title_es: 'Guía: Autorización HIPAA en California',
    title_en: 'Guide: HIPAA Authorization in California',
    filename: 'guia-hipaa-authorization.pdf',
    url: '/guides/guia-hipaa-authorization.pdf',
    docUrl_es: '/hipaa-authorization',
    docUrl_en: '/en/hipaa-authorization',
    docLabel_es: 'Preparar Mi Autorización HIPAA →',
    docLabel_en: 'Prepare My HIPAA Authorization →',
  },
  'certificacion-fideicomiso': {
    title_es: 'Guía: Certificación de Fideicomiso',
    title_en: 'Guide: Certification of Trust in California',
    filename: 'guia-certificacion-fideicomiso.pdf',
    url: '/guides/guia-certificacion-fideicomiso.pdf',
    docUrl_es: '/certification-of-trust',
    docUrl_en: '/en/certification-of-trust',
    docLabel_es: 'Preparar Mi Certificación →',
    docLabel_en: 'Prepare My Certification →',
  },
  's-corporation': {
    title_es: 'Guía: Formación de S-Corporation en California',
    title_en: 'Guide: S-Corporation Formation in California',
    filename: 'guia-s-corporation.pdf',
    url: '/guides/guia-s-corporation.pdf',
    docUrl_es: '/s-corp-formation',
    docUrl_en: '/en/s-corp-formation',
    docLabel_es: 'Formar Mi S-Corporation — $499 →',
    docLabel_en: 'Form My S-Corporation — $499 →',
  },
  'c-corporation': {
    title_es: 'Guía: Formación de C-Corporation en California',
    title_en: 'Guide: C-Corporation Formation in California',
    filename: 'guia-c-corporation.pdf',
    url: '/guides/guia-c-corporation.pdf',
    docUrl_es: '/c-corp-formation',
    docUrl_en: '/en/c-corp-formation',
    docLabel_es: 'Formar Mi C-Corporation — $499 →',
    docLabel_en: 'Form My C-Corporation — $499 →',
  },
  'actas-corporativas': {
    title_es: 'Guía: Actas Corporativas en California',
    title_en: 'Guide: Corporate Minutes in California',
    filename: 'guia-actas-corporativas.pdf',
    url: '/guides/guia-actas-corporativas.pdf',
    docUrl_es: '/corporate-minutes',
    docUrl_en: '/en/corporate-minutes',
    docLabel_es: 'Preparar Mis Actas Corporativas →',
    docLabel_en: 'Prepare My Corporate Minutes →',
  },
  'resolucion-bancaria': {
    title_es: 'Guía: Resolución Bancaria Corporativa',
    title_en: 'Guide: Corporate Banking Resolution',
    filename: 'guia-resolucion-bancaria.pdf',
    url: '/guides/guia-resolucion-bancaria.pdf',
    docUrl_es: '/banking-resolution',
    docUrl_en: '/en/banking-resolution',
    docLabel_es: 'Preparar Mi Resolución Bancaria →',
    docLabel_en: 'Prepare My Banking Resolution →',
  },
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, name, email, phone, lang = 'es' } = body;

    if (!slug || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const guide = GUIDES[slug];
    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    const isEn = lang === 'en';
    const title = isEn ? guide.title_en : guide.title_es;
    const docUrl = isEn ? guide.docUrl_en : guide.docUrl_es;
    const docLabel = isEn ? guide.docLabel_en : guide.docLabel_es;

    // Save lead to Supabase (non-blocking)
    try {
      await supabase.from('guide_leads').insert({
        guide_slug: slug,
        guide_title: title,
        name,
        email,
        phone: phone || null,
        lang,
        ip_address: request.headers.get('x-forwarded-for') || null,
      });
    } catch (dbErr) {
      console.error('DB insert error:', dbErr);
      // Continue — don't block email delivery
    }

    // Send email
    const emailResult = await resend.emails.send({
      from: 'Multi Servicios 360 <info@multiservicios360.net>',
      to: email,
      subject: isEn
        ? `📥 Your free guide: ${title}`
        : `📥 Su guía gratuita: ${title}`,
      html: buildEmailHtml({ name, title, guide, docUrl, docLabel, isEn }),
    });

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error);
      // Still return success so user can download — email failure shouldn't block download
    }

    return NextResponse.json({
      success: true,
      downloadUrl: guide.url,
      docUrl,
    });

  } catch (err) {
    console.error('Guide download API error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}

function buildEmailHtml({ name, title, guide, docUrl, docLabel, isEn }) {
  const greeting = isEn ? `Hi <b>${name}</b>,` : `Hola <b>${name}</b>,`;
  const thanks = isEn
    ? 'Thank you for your interest. Here is your free guide:'
    : 'Gracias por su interés. Aquí está su guía gratuita:';
  const downloadBtn = isEn ? '📥 Download PDF Guide' : '📥 Descargar Guía PDF';
  const readyMsg = isEn ? 'Ready to prepare your document?' : '¿Listo para preparar su documento?';
  const disclaimer = isEn
    ? 'We are not a law firm. Bilingual self-help document preparation platform.'
    : 'No somos un bufete de abogados. Plataforma de preparación de documentos bilingüe.';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:0;">
  <div style="background:linear-gradient(135deg,#1E3A8A,#2563EB);padding:32px 24px;text-align:center;">
    <div style="display:inline-block;background:white;border-radius:12px;padding:8px 20px;margin-bottom:16px;">
      <span style="color:#1E3A8A;font-weight:800;font-size:20px;">M360</span>
    </div>
    <h1 style="color:white;font-size:22px;margin:0;">
      ${isEn ? 'Your Free Guide is Ready' : 'Su Guía Gratuita está Lista'}
    </h1>
  </div>

  <div style="background:white;padding:32px 24px;">
    <p style="color:#0F172A;font-size:16px;margin-top:0;">${greeting}</p>
    <p style="color:#64748B;">${thanks}</p>

    <div style="background:#EFF6FF;border:2px solid #1E3A8A;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
      <div style="font-size:40px;margin-bottom:12px;">📄</div>
      <p style="color:#1E3A8A;font-weight:700;font-size:16px;margin:0 0 20px;">${title}</p>
      <a href="https://multiservicios360.net${guide.url}"
         style="display:inline-block;padding:14px 36px;background:#1E3A8A;color:white;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">
        ${downloadBtn}
      </a>
    </div>

    <div style="border-top:1px solid #E5E7EB;padding-top:20px;text-align:center;">
      <p style="color:#64748B;font-size:14px;margin-bottom:16px;">${readyMsg}</p>
      <a href="https://multiservicios360.net${docUrl}"
         style="display:inline-block;padding:12px 32px;background:#F59E0B;color:#1E3A8A;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px;">
        ${docLabel}
      </a>
    </div>
  </div>

  <div style="background:#0F172A;padding:20px 24px;text-align:center;">
    <p style="color:#94A3B8;font-size:12px;margin:0;">
      Multi Servicios 360 · 855.246.7274 · multiservicios360.net<br/>
      <span style="font-size:11px;">${disclaimer}</span>
    </p>
  </div>
</body>
</html>`;
}
