// lib/send-vault-email.js
import { Resend } from 'resend';

let _resend;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

/**
 * Send bilingual vault access email to client
 * @param {string} email - Client email
 * @param {string} clientName - Client name
 * @param {string} vaultUrl - Full vault URL with token
 * @param {string} serviceType - e.g. 'llc_formation', 'general_poa', etc.
 */
export async function sendVaultEmail(email, clientName, vaultUrl, serviceType) {
  const serviceNames = {
    general_poa: { en: 'General Power of Attorney', es: 'Poder Notarial General' },
    limited_poa: { en: 'Limited Power of Attorney', es: 'Poder Notarial Limitado' },
    living_trust: { en: 'Living Trust', es: 'Fideicomiso en Vida' },
    llc_formation: { en: 'LLC Formation', es: 'Formación de LLC' },
  };

  const service = serviceNames[serviceType] || { en: 'Legal Documents', es: 'Documentos Legales' };
  const firstName = clientName ? clientName.split(' ')[0] : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0F172A,#1E3A8A);padding:32px 40px;text-align:center;">
              <div style="width:48px;height:48px;background:rgba(255,255,255,0.15);border-radius:10px;display:inline-block;line-height:48px;font-size:14px;font-weight:800;color:#fff;letter-spacing:-0.5px;">M360</div>
              <h1 style="color:#ffffff;font-size:22px;margin:16px 0 0;font-weight:700;">Multi Servicios 360</h1>
            </td>
          </tr>

          <!-- English Section -->
          <tr>
            <td style="padding:36px 40px 20px;">
              <h2 style="color:#0F172A;font-size:20px;margin:0 0 12px;">Your Documents Are Ready!</h2>
              <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 8px;">
                Hello${firstName ? ' ' + firstName : ''},
              </p>
              <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;">
                Your <strong>${service.en}</strong> documents have been completed and are ready for download. Access them anytime using your secure Document Vault.
              </p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${vaultUrl}" style="display:inline-block;background:#1E3A8A;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">Access Your Document Vault</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #E2E8F0;margin:0;">
            </td>
          </tr>

          <!-- Spanish Section -->
          <tr>
            <td style="padding:24px 40px 20px;">
              <h2 style="color:#0F172A;font-size:20px;margin:0 0 12px;">Sus Documentos Estan Listos!</h2>
              <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 8px;">
                Hola${firstName ? ' ' + firstName : ''},
              </p>
              <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;">
                Sus documentos de <strong>${service.es}</strong> han sido completados y estan listos para descargar. Acceda a ellos en cualquier momento usando su Boveda de Documentos segura.
              </p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${vaultUrl}" style="display:inline-block;background:#1E3A8A;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">Acceder a Su Boveda de Documentos</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Info Box -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">
                      This link expires in 90 days. Bookmark it or download your documents now.<br>
                      Este enlace expira en 90 dias. Guardelo o descargue sus documentos ahora.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;padding:24px 40px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="color:#94A3B8;font-size:12px;line-height:1.5;margin:0 0 8px;">
                Multi Servicios 360 — Software Platform for Legal Document Preparation
              </p>
              <p style="color:#94A3B8;font-size:12px;line-height:1.5;margin:0 0 8px;">
                Plataforma de Software para Preparacion de Documentos Legales
              </p>
              <p style="color:#94A3B8;font-size:11px;margin:0;">
                Multi Servicios 360 is a software platform, not a law firm. We do not provide legal advice.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { data, error } = await getResend().emails.send({
      from: 'Multi Servicios 360 <noreply@out.multiservicios360.net>',
      to: [email],
      subject: `Your Documents Are Ready / Sus Documentos Estan Listos — Multi Servicios 360`,
      html,
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error };
    }

    console.log('Vault email sent to:', email, 'ID:', data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Failed to send vault email:', err);
    return { success: false, error: err.message };
  }
}