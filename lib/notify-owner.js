// lib/notify-owner.js
// Sends email + SMS to Anthony (owner) on every sale
// SMS can be toggled on/off via NOTIFY_SMS_ENABLED env var

import { Resend } from 'resend';

const DOC_LABELS = {
  general_poa: 'General Power of Attorney / Poder Notarial General',
  limited_poa: 'Limited Power of Attorney / Poder Notarial Limitado',
  living_trust: 'California Living Trust / Fideicomiso en Vida',
  llc_formation: '🏢 LLC Formation — MANUAL WORK REQUIRED',
  bill_of_sale: 'Bill of Sale / Carta de Venta',
  affidavit: 'Affidavit / Declaración Jurada',
  revocation_poa: 'POA Revocation / Revocación de Poder',
  authorization_letter: 'Authorization Letter / Carta de Autorización',
  promissory_note: 'Promissory Note / Pagaré',
  guardianship_designation: 'Guardianship Designation / Designación de Guardián',
  travel_authorization: 'Travel Authorization / Carta de Viaje',
};

const MANUAL_DOCS = ['llc_formation']; // These require manual staff action

/**
 * Send owner notification for every sale
 * @param {Object} sale - { documentType, clientName, clientEmail, amount, matterId, partnerName }
 */
export async function notifyOwnerOfSale(sale) {
  const { documentType, clientName, clientEmail, amount, matterId, partnerName, reviewTier, selectedAddons } = sale;

  const docLabel = DOC_LABELS[documentType] || documentType;
  const isManual = MANUAL_DOCS.includes(documentType);
  const amountStr = amount ? `$${(amount / 100).toFixed(2)}` : 'N/A';
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'flashpreviews@gmail.com';
  const adminPhone = process.env.ADMIN_NOTIFY_PHONE || '+13104373343';

  const tierInfo = reviewTier ? ` [${reviewTier}]` : '';
  const subject = isManual
    ? `🔴 ACTION REQUIRED: LLC Sale — ${clientName} — ${amountStr}`
    : `✅ New Sale: ${docLabel.split('—')[0].trim()}${tierInfo} — ${amountStr}`;

  const bodyHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${isManual ? '#DC2626' : '#059669'}; padding: 20px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">
          ${isManual ? '🔴 ACTION REQUIRED' : '✅ NEW SALE'} — Multi Servicios 360
        </h1>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        
        ${isManual ? `
        <div style="background: #FEF2F2; border: 2px solid #DC2626; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
          <strong style="color: #DC2626; font-size: 16px;">⚠️ LLC REQUIRES MANUAL PROCESSING</strong>
          <p style="color: #7F1D1D; margin: 8px 0 0; font-size: 14px;">
            You need to:<br>
            1. File Articles of Organization with California SOS<br>
            2. Prepare and send Operating Agreement<br>
            3. Apply for EIN with the IRS<br>
            4. Upload completed documents to client's vault
          </p>
        </div>
        ` : ''}

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b; font-size: 13px; width: 140px;">Document</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600; font-size: 14px;">${docLabel}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Client</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600; font-size: 14px;">${clientName || 'Unknown'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Client Email</td>
            <td style="padding: 10px 0; color: #0f172a; font-size: 14px;">${clientEmail || 'N/A'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Amount Paid</td>
            <td style="padding: 10px 0; color: #059669; font-weight: 700; font-size: 18px;">${amountStr}</td>
          </tr>
          ${reviewTier ? `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Tier Selected</td>
            <td style="padding: 10px 0; color: #1e40af; font-weight: 600; font-size: 14px;">${reviewTier}</td>
          </tr>
          ` : ''}
          ${selectedAddons && selectedAddons.length > 0 ? `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Add-Ons Purchased</td>
            <td style="padding: 10px 0; color: #7c3aed; font-weight: 600; font-size: 14px;">${selectedAddons.join(', ')}</td>
          </tr>
          ` : ''}
          ${partnerName ? `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Partner Office</td>
            <td style="padding: 10px 0; color: #7c3aed; font-weight: 600; font-size: 14px;">${partnerName}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-size: 13px;">Matter ID</td>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 12px; font-family: monospace;">${matterId || 'N/A'}</td>
          </tr>
        </table>

        <a href="https://multiservicios360.net/staff/dashboard" 
           style="display: inline-block; background: #1E3A8A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-bottom: 16px;">
          → Open Staff Dashboard
        </a>

        <p style="color: #94a3b8; font-size: 12px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          Multi Servicios 360 — Sale notification sent ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT
        </p>
      </div>
    </div>
  `;

  // ─── EMAIL via Resend ─────────────────────────────
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Multi Servicios 360 <notifications@out.multiservicios360.net>',
      to: adminEmail,
      subject,
      html: bodyHtml,
    });
    console.log('Owner sale email sent to', adminEmail);
  } catch (emailErr) {
    console.error('Owner email notification failed:', emailErr);
  }

  // ─── SMS via Twilio ───────────────────────────────
  const smsEnabled = process.env.NOTIFY_SMS_ENABLED !== 'false'; // on by default
  if (smsEnabled && adminPhone && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const twilio = (await import('twilio')).default;
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      const smsBody = isManual
        ? `🔴 LLC SALE - ACTION REQUIRED\nClient: ${clientName}\nAmount: ${amountStr}\nLog in to staff portal to process LLC formation.\nmultiservicios360.net/staff/dashboard`
        : `✅ New Sale!\n${docLabel.split('/')[0].trim()}\nClient: ${clientName}\nAmount: ${amountStr}${partnerName ? `\nPartner: ${partnerName}` : ''}`;

      await client.messages.create({
        body: smsBody,
        from: process.env.TWILIO_FROM_NUMBER,
        to: adminPhone,
      });
      console.log('Owner SMS sent to', adminPhone);
    } catch (smsErr) {
      console.error('Owner SMS notification failed (non-critical):', smsErr.message);
    }
  }
}
