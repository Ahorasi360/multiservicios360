export const dynamic = 'force-dynamic';
// app/api/admin/resources/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// GET: List all resources
export async function GET(request) {
  try {
    const password = request.headers.get('x-admin-password');
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: resources, error } = await supabase
      .from('partner_resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Resources fetch error:', error);
      return NextResponse.json({ success: true, resources: [] });
    }

    return NextResponse.json({ success: true, resources: resources || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Upload new resource
export async function POST(request) {
  try {
    const formData = await request.formData();
    const password = formData.get('admin_password');
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const file = formData.get('file');
    const title = formData.get('title') || '';
    const description = formData.get('description') || '';
    const category = formData.get('category') || 'general';
    const audience = formData.get('audience') || 'both'; // partner | sales | both

    if (!file || !title) {
      return NextResponse.json({ error: 'File and title are required' }, { status: 400 });
    }

    // Upload to Supabase Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    const storagePath = `resources/${Date.now()}-${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('vault-files')
      .upload(storagePath, fileBuffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Create database entry
    const { data: resource, error: dbError } = await supabase
      .from('partner_resources')
      .insert({
        title,
        description,
        category,
        audience,
        file_name: fileName,
        file_url: storagePath,
        file_size: fileBuffer.length,
        file_type: file.type || 'application/octet-stream',
        is_active: true,
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB error:', dbError);
      return NextResponse.json({ error: 'Failed to save resource: ' + dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, resource });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove a resource
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const password = request.headers.get('x-admin-password');
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get resource to find file path
    const { data: resource } = await supabase
      .from('partner_resources')
      .select('file_url')
      .eq('id', id)
      .single();

    if (resource?.file_url) {
      await supabase.storage.from('vault-files').remove([resource.file_url]);
    }

    const { error } = await supabase
      .from('partner_resources')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
