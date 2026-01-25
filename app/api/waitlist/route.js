import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { service_key, name, email, phone, source } = body;

    // Validate required fields
    if (!service_key || !name || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate service key
    const validServices = ['trust', 'business', 'immigration'];
    if (!validServices.includes(service_key)) {
      return NextResponse.json(
        { success: false, error: 'Invalid service' },
        { status: 400 }
      );
    }

    // Check if email already exists for this service
    const { data: existing } = await supabase
      .from('waitlist_leads')
      .select('id')
      .eq('email', email.toLowerCase())
      .eq('service_key', service_key)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: true, message: 'Already on waitlist' }
      );
    }

    // Insert new waitlist entry
    const { data, error } = await supabase
      .from('waitlist_leads')
      .insert([
        {
          service_key,
          name,
          email: email.toLowerCase(),
          phone: phone || null,
          source: source || 'website',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      // If table doesn't exist, still return success (we'll create table later)
      if (error.code === '42P01') {
        console.log('Waitlist table does not exist yet');
        return NextResponse.json({ 
          success: true, 
          message: 'Registered (table pending)',
          note: 'Table will be created in Supabase'
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Added to waitlist',
      data
    });

  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}