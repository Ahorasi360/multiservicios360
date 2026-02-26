export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import Stripe from 'stripe';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservicios360.net';

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }); }

const PACKAGES = {
  start: { name: 'Partner Start', price: 499, commission: '20%' },
  pro:   { name: 'Partner Pro',   price: 999, commission: '25%' },
  elite: { name: 'Partner Elite', price: 2500, commission: '30%' },
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, ref } = body;

    // ── TRACK PAGE VISIT ──────────────────────────────────────────
    if (action === 'visit') {
      await supabase.from('partner_leads').upsert({
        ref: ref || 'direct',
        visited_at: new Date().toISOString(),
        status: 'visited',
      }, { onConflict: 'ref', ignoreDuplicates: false });

      return NextResponse.json({ success: true });
    }

    // ── SUBMIT APPLICATION ────────────────────────────────────────
    if (action === 'apply') {
      const { business_name, contact_name, email, phone, partner_type, package_key } = body;

      if (!business_name || !contact_name || !email || !phone) {
        return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
      }

      const pkg = PACKAGES[package_key] || PACKAGES.pro;

      // Save lead to Supabase
      const { data: lead, error: leadErr } = await supabase
        .from('partner_leads')
        .upsert({
          ref: ref || 'direct',
          business_name,
          contact_name,
          email,
          phone,
          partner_type,
          package_key,
          package_name: pkg.name,
          package_price: pkg.price,
          applied_at: new Date().toISOString(),
          status: 'applied',
        }, { onConflict: 'ref' })
        .select()
        .single();

      if (leadErr) console.error('Lead save error:', leadErr);

      // Create Stripe checkout session
      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: email,
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${pkg.name} — Multi Servicios 360`,
              description: `Registro de socio: ${pkg.commission} comisión por venta. Sin mensualidades.`,
            },
            unit_amount: pkg.price * 100,
          },
          quantity: 1,
        }],
        metadata: {
          source: 'hazte-socio',
          ref: ref || 'direct',
          business_name,
          contact_name,
          email,
          phone,
          partner_type,
          package_key,
        },
        success_url: `${SITE_URL}/hazte-socio/success?ref=${ref || 'direct'}&pkg=${package_key}`,
        cancel_url: `${SITE_URL}/hazte-socio?ref=${ref || 'direct'}&cancelled=1`,
      });

      // Notify Anthony immediately
      await resend.emails.send({
        from: 'Multi Servicios 360 <no-reply@out.multiservicios360.net>',
        to: ['info@multiservicios360.net'],
        subject: `🤝 Nueva Aplicación de Socio — ${business_name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
            <div style="background:#1E3A8A;color:white;padding:16px 20px;border-radius:8px 8px 0 0;">
              <h2 style="margin:0;font-size:18px;">🤝 Nueva Aplicación de Socio</h2>
              <p style="margin:4px 0 0;opacity:0.8;font-size:13px;">multiservicios360.net/hazte-socio${ref ? ` — ref: ${ref}` : ''}</p>
            </div>
            <div style="background:#f8faff;padding:20px;border:1px solid #dbeafe;border-radius:0 0 8px 8px;">
              <p style="margin:0 0 8px;"><strong>Negocio:</strong> ${business_name}</p>
              <p style="margin:0 0 8px;"><strong>Contacto:</strong> ${contact_name}</p>
              <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
              <p style="margin:0 0 8px;"><strong>Teléfono:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p style="margin:0 0 8px;"><strong>Tipo:</strong> ${partner_type}</p>
              <p style="margin:0 0 16px;"><strong>Plan:</strong> ${pkg.name} — $${pkg.price} (${pkg.commission})</p>
              <p style="font-size:12px;color:#666;margin:0;">Fue enviado a Stripe checkout. Si no completa el pago en 24h le llegará seguimiento automático.</p>
            </div>
          </div>
        `
      });

      return NextResponse.json({ checkout_url: session.url });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });

  } catch (err) {
    console.error('Hazte-socio API error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
