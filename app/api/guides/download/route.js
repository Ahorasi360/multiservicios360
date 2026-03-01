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
    title: 'Guía: Testamento Simple en California',
    filename: 'guia-testamento-simple.pdf',
    url: '/guides/guia-testamento-simple.pdf',
    docUrl: '/simple-will',
  },
  'testamento-traspaso': {
    title: 'Guía: Pour-Over Will — Testamento de Traspaso',
    filename: 'guia-testamento-traspaso.pdf',
    url: '/guides/guia-testamento-traspaso.pdf',
    docUrl: '/pour-over-will',
  },
  'hipaa-authorization': {
    title: 'Guía: Autorización HIPAA en California',
    filename: 'guia-hipaa-authorization.pdf',
    url: '/guides/guia-hipaa-authorization.pdf',
    docUrl: '/hipaa-authorization',
  },
  'certificacion-fideicomiso': {
    title: 'Guía: Certificación de Fideicomiso',
    filename: 'guia-certificacion-fideicomiso.pdf',
    url: '/guides/guia-certificacion-fideicomiso.pdf',
    docUrl: '/certification-of-trust',
  },
  's-corporation': {
    title: 'Guía: Formación de S-Corporation en California',
    filename: 'guia-s-corporation.pdf',
    url: '/guides/guia-s-corporation.pdf',
    docUrl: '/s-corp-formation',
  },
  'c-corporation': {
    title: 'Guía: Formación de C-Corporation en California',
    filename: 'guia-c-corporation.pdf',
    url: '/guides/guia-c-corporation.pdf',
    docUrl: '/c-corp-formation',
  },
  'actas-corporativas': {
    title: 'Guía: Actas Corporativas en California',
    filename: 'guia-actas-corporativas.pdf',
    url: '/guides/guia-actas-corporativas.pdf',
    docUrl: '/corporate-minutes',
  },
  'resolucion-bancaria': {
    title: 'Guía: Resolución Bancaria Corporativa',
    filename: 'guia-resolucion-bancaria.pdf',
    url: '/guides/guia-resolucion-bancaria.pdf',
    docUrl: '/banking-resolution',
  },
};

export async function POST(request) {
  try {
    const { slug, name, email, phone } = await request.json();

    if (!slug || !name || !email) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const guide = GUIDES[slug];
    if (!guide) {
      return NextResponse.json({ error: 'Guía no encontrada' }, { status: 404 });
    }

    // Save lead to Supabase
    const { error: dbError } = await supabase.from('guide_leads').insert({
      guide_slug: slug,
      guide_title: guide.title,
      name,
      email,
      phone: phone || null,
      ip_address: request.headers.get('x-forwarded-for') || null,
    });

    if (dbError) {
      console.error('DB error:', dbError);
      // Don't block the user — still send the guide
    }

    // Send email with guide link
    await resend.emails.send({
      from: 'Multi Servicios 360 <info@multiservicios360.net>',
      to: email,
      subject: `📥 Su guía gratuita: ${guide.title}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
  <div style="background: linear-gradient(135deg, #1E3A8A, #2563EB); padding: 32px 24px; text-align: center;">
    <div style="display: inline-block; background: white; border-radius: 12px; padding: 8px 16px; margin-bottom: 16px;">
      <span style="color: #1E3A8A; font-weight: 800; font-size: 18px;">M360</span>
    </div>
    <h1 style="color: white; font-size: 22px; margin: 0;">Su Guía Gratuita está Lista</h1>
  </div>
  
  <div style="background: white; padding: 32px 24px;">
    <p style="color: #0F172A; font-size: 16px;">Hola <b>${name}</b>,</p>
    <p style="color: #64748B;">Gracias por su interés. Aquí está su guía gratuita:</p>
    
    <div style="background: #EFF6FF; border: 2px solid #1E3A8A; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
      <div style="font-size: 32px; margin-bottom: 8px;">📄</div>
      <p style="color: #1E3A8A; font-weight: 700; font-size: 16px; margin: 0 0 16px;">${guide.title}</p>
      <a href="https://multiservicios360.net${guide.url}" 
         style="display: inline-block; padding: 14px 32px; background: #1E3A8A; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px;">
        📥 Descargar Guía PDF
      </a>
    </div>
    
    <p style="color: #64748B; font-size: 14px;">¿Listo para preparar su documento?</p>
    <a href="https://multiservicios360.net${guide.docUrl}"
       style="display: inline-block; padding: 12px 28px; background: #F59E0B; color: #1E3A8A; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px;">
      Preparar Mi Documento Ahora →
    </a>
  </div>
  
  <div style="background: #0F172A; padding: 20px 24px; text-align: center;">
    <p style="color: #94A3B8; font-size: 12px; margin: 0;">
      Multi Servicios 360 · 855.246.7274 · multiservicios360.net<br/>
      <span style="font-size: 11px;">No somos un bufete de abogados. Servicio de preparación de documentos de autoayuda.</span>
    </p>
  </div>
</body>
</html>`,
    });

    return NextResponse.json({ 
      success: true, 
      downloadUrl: guide.url,
      docUrl: guide.docUrl,
    });

  } catch (err) {
    console.error('Guide download error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
