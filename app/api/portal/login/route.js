// app/api/portal/login/route.js

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Simple password hashing (for production, use bcrypt)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find partner by email
    const { data: partner, error } = await supabase
      .from('partners')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !partner) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const hashedPassword = hashPassword(password);
    if (partner.password_hash !== hashedPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if partner is active
    if (partner.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Your account is not active. Please contact support.' },
        { status: 403 }
      );
    }

    // Generate simple token (for production, use JWT)
    const token = crypto.randomBytes(32).toString('hex');

    // Return partner data (excluding password)
    const { password_hash, ...partnerData } = partner;

    return NextResponse.json({
      success: true,
      token,
      partner: partnerData
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}