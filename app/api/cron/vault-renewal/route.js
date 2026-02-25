export const dynamic = 'force-dynamic';
// app/api/cron/vault-renewal/route.js
// Runs daily via Vercel Cron - checks vault expiry and sends drip emails
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendVaultRenewalEmail } from '../../../../lib/send-vault-renewal-email';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request) {
  // Verify this is called by Vercel Cron (or admin)
  const authHeader = request.headers.get('authorization');
  const adminPw = request.headers.get('x-admin-password');
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isAdmin = adminPw === process.env.ADMIN_PASSWORD || adminPw === 'MS360Admin2026!';

  if (!isVercelCron && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const results = { sent: [], skipped: [], errors: [] };

  // Get all active (non-premium or expiring) vault tokens with client info
  const { data: vaults, error } = await supabase
    .from('vault_tokens')
    .select('id, token, client_email, client_name, created_at, expires_at, is_premium, premium_type, drip_sent')
    .not('client_email', 'is', null)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Cron vault fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  for (const vault of vaults || []) {
    try {
      const drip = vault.drip_sent || {};
      const createdAt = new Date(vault.created_at);
      const expiresAt = vault.expires_at ? new Date(vault.expires_at) : null;
      const daysUntilExpiry = expiresAt ? Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)) : null;
      const daysSinceCreation = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

      let stage = null;

      // 1 year anniversary (day 365)
      if (daysSinceCreation >= 365 && !drip.anniversary) {
        stage = 'anniversary';
      }
      // 2 months before expiry (~60 days)
      else if (daysUntilExpiry !== null && daysUntilExpiry <= 60 && daysUntilExpiry > 35 && !drip.twoMonths) {
        stage = 'twoMonths';
      }
      // 1 month before expiry (~30 days)
      else if (daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 7 && !drip.oneMonth) {
        stage = 'oneMonth';
      }
      // 7 days before
      else if (daysUntilExpiry !== null && daysUntilExpiry === 7 && !drip.sevenDays) {
        stage = 'sevenDays';
      }
      // Daily countdown 6 days to 1 day
      else if (daysUntilExpiry !== null && daysUntilExpiry >= 1 && daysUntilExpiry <= 6) {
        const dayKey = `day${daysUntilExpiry}`;
        if (!drip[dayKey]) stage = 'daily';
      }

      if (!stage) {
        results.skipped.push({ id: vault.id, email: vault.client_email, reason: 'no stage due' });
        continue;
      }

      // Send the email
      const result = await sendVaultRenewalEmail(
        vault.client_email,
        vault.client_name || 'Valued Client',
        vault.token,
        stage,
        daysUntilExpiry
      );

      if (result.success) {
        // Mark this stage as sent
        const updatedDrip = { ...drip };
        if (stage === 'daily') {
          updatedDrip[`day${daysUntilExpiry}`] = new Date().toISOString();
        } else {
          updatedDrip[stage] = new Date().toISOString();
        }

        await supabase
          .from('vault_tokens')
          .update({ drip_sent: updatedDrip })
          .eq('id', vault.id);

        results.sent.push({ id: vault.id, email: vault.client_email, stage, daysUntilExpiry });
      } else {
        results.errors.push({ id: vault.id, email: vault.client_email, stage, error: result.error });
      }
    } catch (err) {
      results.errors.push({ id: vault.id, error: err.message });
    }
  }

  console.log('Vault renewal cron completed:', results);
  return NextResponse.json({
    success: true,
    timestamp: now.toISOString(),
    summary: {
      sent: results.sent.length,
      skipped: results.skipped.length,
      errors: results.errors.length,
    },
    details: results,
  });
}
