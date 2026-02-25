export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function checkAuth(request) {
  const pw = request.headers.get('x-admin-password');
  return pw === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const url = new URL(request.url);
    const profId = url.searchParams.get('professional_id');
    let query = supabase.from('professional_assignments').select('*').order('assigned_at', { ascending: false });
    if (profId) query = query.eq('professional_id', profId);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, assignments: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { professional_id, matter_type, matter_id, client_name, client_email, service_label } = await request.json();
    if (!professional_id || !matter_type || !matter_id) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    const { data, error } = await supabase.from('professional_assignments').insert({
      professional_id, matter_type, matter_id,
      client_name: client_name || '', client_email: client_email || '',
      service_label: service_label || matter_type, status: 'pending',
    }).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, assignment: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await request.json();
    const { error } = await supabase.from('professional_assignments').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
