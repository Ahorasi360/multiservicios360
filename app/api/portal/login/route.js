// app/api/portal/login/route.js

import { NextResponse } from 'next/server';
import crypto from 'crypto';

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

    const hashedPassword = hashPassword(password);

    // Use Supabase REST API directly with RPC
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Direct PostgreSQL query via Supabase's REST endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_partner_by_email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ p_email: email.toLowerCase().trim() })
    });

    // If RPC doesn't exist, fall back to direct table query with cache bypass
    if (!response.ok) {
      // Try direct query with Prefer header to bypass cache
      const directResponse = await fetch(
        `${supabaseUrl}/rest/v1/partners?email=eq.${encodeURIComponent(email.toLowerCase().trim())}&select=*`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=representation',
            'Cache-Control': 'no-cache'
          }
        }
      );

      if (!directResponse.ok) {
        console.log('Direct query failed:', await directResponse.text());
        return NextResponse.json(
          { success: false, error: 'Database connection error' },
          { status: 500 }
        );
      }

      const partners = await directResponse.json();
      
      if (!partners || partners.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const partner = partners[0];

      // Check password
      if (partner.password_hash !== hashedPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Check if active
      if (partner.status !== 'active') {
        return NextResponse.json(
          { success: false, error: 'Your account is not active.' },
          { status: 403 }
        );
      }

      // Generate token
      const token = crypto.randomBytes(32).toString('hex');

      const { password_hash, ...partnerData } = partner;

      return NextResponse.json({
        success: true,
        token,
        partner: partnerData
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}