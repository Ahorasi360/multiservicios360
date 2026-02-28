// lib/send-vault-renewal-email.js
import { Resend } from 'resend';

let _resend;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const SITE_URL = 'https://multiservicios360.net';
const FROM = 'Multi Servicios 360 <noreply@out.multiservicios360.net>';

function buildEmail({ emoji, titleEn, titleEs, bodyEn, bodyEs, ctaEn, ctaEs, ctaUrl, secondCtaEn, secondCtaEs, secondCtaUrl, urgent }) {
  const borderColor = urgent ? '#EF4444' : '#1E3A8A';
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0F172A,${borderColor});padding:32px 28px;text-align:center;">
      <div style="font-size:40px;margin-bottom:8px;">${emoji}</div>
      <h1 style="color:#fff;font-size:20px;font-weight:700;margin:0 0 4px;">${titleEn}</h1>
      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;">${titleEs}</p>
    </div>
    <div style="padding:28px;">
      <p style="color:#0F172A;font-size:14px;line-height:1.7;margin:0 0 8px;">${bodyEn}</p>
      <p style="color:#64748B;font-size:13px;line-height:1.7;margin:0 0 24px;">${bodyEs}</p>
      <a href="${ctaUrl}" style="display:block;text-align:center;background:${borderColor};color:#fff;padding:14px 24px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;margin:0 0 12px;">${ctaEn} / ${ctaEs}</a>
      ${secondCtaUrl ? `<a href="${secondCtaUrl}" style="display:block;text-align:center;background:#F1F5F9;color:#1E3A8A;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;border:1px solid #E2E8F0;">${secondCtaEn} / ${secondCtaEs}</a>` : ''}
    </div>
    <div style="background:#F8FAFC;padding:16px 28px;text-align:center;border-top:1px solid #E2E8F0;">
      <p style="color:#94A3B8;font-size:12px;margin:0;">© 2026 Multi Servicios 360 — (855) 246-7274</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendVaultRenewalEmail(email, name, token, stage, daysLeft) {
  const vaultLink = `${SITE_URL}/vault?code=${token}`;
  const upgradeLink = `${SITE_URL}/boveda-premium?vault=${token}`;

  const templates = {
    anniversary: {
      subject: '🎉 1 Year with your MS360 Vault / 1 Año con su Bóveda MS360',
      html: buildEmail({
        emoji: '🎉', urgent: false,
        titleEn: 'Happy 1-Year Anniversary!',
        titleEs: '¡Feliz Aniversario de 1 Año!',
        bodyEn: `Hi <strong>${name}</strong>, it has been one year since you received your legal documents from Multi Servicios 360. Your vault is still securely storing your documents. Renew or upgrade your plan to keep your documents protected for another year.`,
        bodyEs: `Hola <strong>${name}</strong>, ha pasado un año desde que recibió sus documentos legales de Multi Servicios 360. Su bóveda sigue guardando sus documentos de forma segura. Renueve o actualice su plan para mantener sus documentos protegidos por otro año.`,
        ctaEn: '🔒 Access My Vault', ctaEs: 'Acceder a Mi Bóveda', ctaUrl: vaultLink,
        secondCtaEn: '🔄 Renew My Plan', secondCtaEs: 'Renovar Mi Plan', secondCtaUrl: upgradeLink,
      }),
    },
    twoMonths: {
      subject: `📅 Your vault expires in ${daysLeft} days / Su bóveda vence en ${daysLeft} días`,
      html: buildEmail({
        emoji: '📅', urgent: false,
        titleEn: 'Your Free Vault Access Expires in 2 Months',
        titleEs: 'Su Acceso Gratuito a la Bóveda Vence en 2 Meses',
        bodyEn: `Hi <strong>${name}</strong>, you received 90 days of free access to your MS360 Document Vault with your purchase. Your free access expires in <strong>${daysLeft} days</strong>. Activate your plan now to keep uninterrupted access to your legal documents — Power of Attorney, Living Trust, Guardianship, and more.<br><br>Monthly: <strong>$4.99/mo</strong> &nbsp;|&nbsp; Annual: <strong>$49/yr</strong> (save 18%)`,
        bodyEs: `Hola <strong>${name}</strong>, recibió 90 días de acceso gratuito a su Bóveda de Documentos MS360 con su compra. Su acceso gratuito vence en <strong>${daysLeft} días</strong>. Active su plan ahora para mantener acceso continuo a sus documentos legales — Poder Notarial, Fideicomiso, Designación de Guardián, y más.<br><br>Mensual: <strong>$4.99/mes</strong> &nbsp;|&nbsp; Anual: <strong>$49/año</strong> (ahorra 18%)`,
        ctaEn: '🔒 Activate My Plan — $4.99/mo', ctaEs: 'Activar Mi Plan — $4.99/mes', ctaUrl: upgradeLink + '&plan=monthly',
        secondCtaEn: '📂 View My Documents', secondCtaEs: 'Ver Mis Documentos', secondCtaUrl: vaultLink,
      }),
    },
    oneMonth: {
      subject: `⚠️ 30 days left on your free vault / 30 días gratis restantes en su bóveda`,
      html: buildEmail({
        emoji: '⚠️', urgent: false,
        titleEn: 'Only 30 Days Left on Your Free Vault Access',
        titleEs: 'Solo 30 Días Restantes de Acceso Gratuito a Su Bóveda',
        bodyEn: `Hi <strong>${name}</strong>, your free 90-day Document Vault access expires in <strong>30 days</strong>. After that, you will lose access to your stored legal documents. Activate your subscription today — it's only <strong>$4.99/month</strong> or <strong>$49/year</strong> to keep all your documents safe and accessible 24/7.`,
        bodyEs: `Hola <strong>${name}</strong>, su acceso gratuito de 90 días a la Bóveda de Documentos vence en <strong>30 días</strong>. Después de eso, perderá acceso a sus documentos legales. Active su suscripción hoy — solo <strong>$4.99/mes</strong> o <strong>$49/año</strong> para mantener todos sus documentos seguros y accesibles las 24 horas.`,
        ctaEn: '⭐ Activate Annual Plan — $49/yr', ctaEs: 'Activar Plan Anual — $49/año', ctaUrl: upgradeLink + '&plan=annual',
        secondCtaEn: '📅 Monthly — $4.99/mo', secondCtaEs: 'Mensual — $4.99/mes', secondCtaUrl: upgradeLink + '&plan=monthly',
      }),
    },
    sevenDays: {
      subject: `🚨 URGENT: Vault expires in 7 days / URGENTE: Bóveda vence en 7 días`,
      html: buildEmail({
        emoji: '🚨', urgent: true,
        titleEn: '7 Days Until Your Vault Expires',
        titleEs: '7 Días Hasta que Venza Su Bóveda',
        bodyEn: `Hi <strong>${name}</strong>, your Document Vault expires in just <strong>7 days</strong>. Don't lose access to your important legal documents. Renew immediately to keep your files safe.`,
        bodyEs: `Hola <strong>${name}</strong>, su Bóveda de Documentos vence en solo <strong>7 días</strong>. No pierda acceso a sus documentos legales importantes. Renueve de inmediato para mantener sus archivos seguros.`,
        ctaEn: '🚨 Renew Now — Don\'t Lose Access', ctaEs: 'Renovar Ahora — No Pierda Acceso', ctaUrl: upgradeLink,
        secondCtaEn: '📂 Download My Documents First', secondCtaEs: 'Descargar Mis Documentos Primero', secondCtaUrl: vaultLink,
      }),
    },
    daily: {
      subject: `⏰ ${daysLeft} day${daysLeft === 1 ? '' : 's'} left — vault expiring / ${daysLeft} día${daysLeft === 1 ? '' : 's'} restante${daysLeft === 1 ? '' : 's'}`,
      html: buildEmail({
        emoji: daysLeft === 1 ? '🔴' : '⏰', urgent: true,
        titleEn: daysLeft === 1 ? 'LAST DAY — Vault Expires Tonight!' : `${daysLeft} Days Left on Your Vault`,
        titleEs: daysLeft === 1 ? '¡ÚLTIMO DÍA — Bóveda Vence Esta Noche!' : `${daysLeft} Días Restantes en Su Bóveda`,
        bodyEn: `Hi <strong>${name}</strong>, your vault expires ${daysLeft === 1 ? 'TODAY' : `in ${daysLeft} days`}. After expiration your documents will no longer be accessible. Renew now before it is too late.`,
        bodyEs: `Hola <strong>${name}</strong>, su bóveda vence ${daysLeft === 1 ? 'HOY' : `en ${daysLeft} días`}. Después de vencer sus documentos ya no estarán accesibles. Renueve ahora antes de que sea tarde.`,
        ctaEn: '🔴 Renew Immediately', ctaEs: 'Renovar Inmediatamente', ctaUrl: upgradeLink,
        secondCtaEn: '📂 Download My Documents Now', secondCtaEs: 'Descargar Mis Documentos Ahora', secondCtaUrl: vaultLink,
      }),
    },
  };

  const template = templates[stage];
  if (!template) return { success: false, error: 'Unknown stage' };

  try {
    const result = await getResend().emails.send({
      from: FROM,
      to: [email],
      subject: template.subject,
      html: template.html,
    });
    return { success: true, id: result?.data?.id };
  } catch (err) {
    console.error('Vault renewal email error:', err);
    return { success: false, error: err.message };
  }
}
