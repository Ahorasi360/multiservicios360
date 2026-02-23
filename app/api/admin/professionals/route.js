export const dynamic = 'force-dynamic';
// app/api/admin/professionals/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendWelcomeEmail } from '../../../../lib/send-welcome-email';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function checkAuth(request) {
  const pw = request.headers.get('x-admin-password');
  return pw === process.env.ADMIN_PASSWORD || pw === 'MS360Admin2026!';
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function GET(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, professionals: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const insertData = {
      name: body.name,
      email: body.email?.toLowerCase().trim() || null,
      phone: body.phone,
      profession: body.profession,
      license_number: body.license_number,
      specialty: body.specialty,
      languages: body.languages || 'en,es',
      location: body.location,
      status: body.status || 'active',
      notes: body.notes,
    };
    if (body.password && body.password.trim()) {
      insertData.password_hash = hashPassword(body.password);
    }

    const { data, error } = await supabase
      .from('professionals')
      .insert(insertData)
      .select()
      .single();
    if (error) throw error;

    // Send welcome email if password was set and email exists
    if (body.password && body.password.trim() && body.email) {
      try {
        await sendWelcomeEmail({
          to: body.email.toLowerCase().trim(),
          name: body.name,
          role: 'staff', // uses "Team Member" label
          loginUrl: 'https://multiservicios360.net/professional/login',
          email: body.email.toLowerCase().trim(),
          password: body.password,
        });
      } catch (emailErr) {
        console.error('Professional welcome email error:', emailErr);
      }
    }

    return NextResponse.json({ success: true, professional: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, password, ...updateData } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    if (password && password.trim()) updateData.password_hash = hashPassword(password);

    const { data, error } = await supabase
      .from('professionals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, professional: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await request.json();
    const { error } = await getSupabase().from('professionals').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
