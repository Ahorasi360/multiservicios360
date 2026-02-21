// app/api/portal/resources/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET: List active resources for partners
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partner_id');
    if (!partnerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify partner is active
    const { data: partner } = await supabase
      .from('partners')
      .select('id, status')
      .eq('id', partnerId)
      .single();

    if (!partner || partner.status !== 'active') {
      return NextResponse.json({ error: 'Account not active' }, { status: 403 });
    }

    const { data: resources, error } = await supabase
      .from('partner_resources')
      .select('id, title, description, category, file_name, file_url, file_size, file_type, created_at')
      .eq('is_active', true)
      .order('category')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Resources fetch error:', error);
      return NextResponse.json({ success: true, resources: [] });
    }

    // Generate signed download URLs
    const resourcesWithUrls = await Promise.all(
      (resources || []).map(async (r) => {
        const { data: signedUrl } = await supabase.storage
          .from('vault-files')
          .createSignedUrl(r.file_url, 3600); // 1 hour
        return { ...r, download_url: signedUrl?.signedUrl || null };
      })
    );

    return NextResponse.json({ success: true, resources: resourcesWithUrls });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
