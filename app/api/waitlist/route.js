import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

  try {
    const body = await request.json();
    const { service_key, name, email, phone, source } = body;

    if (!service_key || !name || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validServices = ['trust', 'business', 'immigration'];
    if (!validServices.includes(service_key)) {
      return NextResponse.json(
        { success: false, error: 'Invalid service' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('waitlist_leads')
      .insert([{
        service_key,
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        source: source || 'website'
      }]);

    if (error && error.code !== '23505') {
      console.error('Supabase error:', error);
    }

    return NextResponse.json({ success: true, message: 'Added to waitlist' });

  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}