export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// GET: Sales reps see ALL resources (partner + sales + both)
export async function GET(request) {
  try {
    const repId = request.headers.get('x-sales-id');
    if (!repId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: rep } = await supabase
      .from('sales_reps')
      .select('id, status')
      .eq('id', repId)
      .single();

    if (!rep || rep.status !== 'active') {
      return NextResponse.json({ error: 'Account not active' }, { status: 403 });
    }

    const { data: resources, error } = await supabase
      .from('partner_resources')
      .select('id, title, description, category, audience, file_name, file_url, file_size, file_type, created_at')
      .eq('is_active', true)
      .order('audience')
      .order('category')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ success: true, resources: [] });

    const resourcesWithUrls = await Promise.all(
      (resources || []).map(async (r) => {
        const { data: signedUrl } = await supabase.storage
          .from('vault-files')
          .createSignedUrl(r.file_url, 3600);
        return { ...r, download_url: signedUrl?.signedUrl || null };
      })
    );

    return NextResponse.json({ success: true, resources: resourcesWithUrls });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
