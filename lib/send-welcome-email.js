// lib/send-welcome-email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail({ to, name, role, loginUrl, email, password, setupFee, membershipUrl }) {
  const roleLabels = {
    staff: 'Staff Member',
    partner: 'Partner',
    sales: 'Sales Representative',
  };
  const roleLabelsEs = {
    staff: 'Miembro del Equipo',
    partner: 'Socio',
    sales: 'Representante de Ventas',
  };
  const roleColors = {
    staff: '#059669',
    partner: '#2563EB',
    sales: '#D97706',
  };

  const roleName = roleLabels[role] || 'Team Member';
  const roleNameEs = roleLabelsEs[role] || 'Miembro del Equipo';
  const color = roleColors[role] || '#1E3A8A';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0F172A,${color});padding:32px 28px;text-align:center;">
      <div style="width:50px;height:50px;background:rgba(255,255,255,0.15);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
        <span style="font-size:20px;font-weight:800;color:#fff;">M360</span>
      </div>
      <h1 style="color:#fff;font-size:22px;font-weight:700;margin:8px 0 4px;">Welcome / Bienvenido</h1>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">Multi Servicios 360 — ${roleName}</p>
    </div>
    <div style="padding:28px;">
      <p style="color:#0F172A;font-size:15px;margin:0 0 6px;">Hello / Hola <strong>${name}</strong>,</p>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 20px;">
        Your account has been created. Use the credentials below to log in.<br/>
        <span style="color:#94A3B8;">Su cuenta ha sido creada. Use las credenciales abajo para iniciar sesion.</span>
      </p>
      <div style="background:#F8FAFC;border:2px solid #E2E8F0;border-radius:12px;padding:20px;margin:0 0 24px;">
        <div style="margin-bottom:12px;">
          <span style="font-size:12px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;">Login URL</span>
          <div style="font-size:14px;color:#1E3A8A;font-weight:600;margin-top:4px;word-break:break-all;">
            <a href="${loginUrl}" style="color:#1E3A8A;text-decoration:none;">${loginUrl}</a>
          </div>
        </div>
        <div style="margin-bottom:12px;">
          <span style="font-size:12px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;">Email</span>
          <div style="font-size:14px;color:#0F172A;font-weight:600;margin-top:4px;">${email}</div>
        </div>
        <div>
          <span style="font-size:12px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;">Temporary Password / Contrasena Temporal</span>
          <div style="font-size:16px;color:#0F172A;font-weight:700;margin-top:4px;font-family:monospace;background:#fff;padding:8px 12px;border-radius:6px;border:1px solid #E2E8F0;">${password}</div>
        </div>
      </div>
      <a href="${loginUrl}" style="display:block;text-align:center;background:${color};color:#fff;padding:14px 24px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;margin:0 0 20px;">
        Log In Now / Iniciar Sesion
      </a>
      ${setupFee ? `
      <div style="background:#F0FDF4;border:2px solid #22C55E;border-radius:12px;padding:20px;margin:0 0 20px;text-align:center;">
        <p style="color:#166534;font-size:14px;font-weight:600;margin:0 0 8px;">💳 Complete Your Membership / Complete su Membresia</p>
        <p style="color:#166534;font-size:28px;font-weight:800;margin:0 0 12px;">$${Number(setupFee).toFixed(2)}</p>
        <p style="color:#15803D;font-size:13px;margin:0 0 16px;">Setup Fee — one-time payment / Pago unico de activacion</p>
        <a href="${membershipUrl || loginUrl}" style="display:inline-block;background:#059669;color:#fff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">
          Pay Now / Pagar Ahora →
        </a>
      </div>
      ` : ''}
      <div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:8px;padding:12px 16px;margin:0 0 16px;">
        <p style="color:#92400E;font-size:13px;margin:0;">
          🔒 Please change your password after your first login. / Por favor cambie su contrasena despues de iniciar sesion.
        </p>
      </div>
      <p style="color:#94A3B8;font-size:13px;margin:0;">Questions? Call (855) 246-7274</p>
    </div>
    <div style="background:#F8FAFC;padding:16px 28px;text-align:center;border-top:1px solid #E2E8F0;">
      <p style="color:#94A3B8;font-size:12px;margin:0;">&copy; 2026 Multi Servicios 360. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: 'Multi Servicios 360 <no-reply@multiservicios360.net>',
      to: [to],
      subject: 'Welcome to Multi Servicios 360 / Bienvenido a Multi Servicios 360',
      html,
    });
    return { success: true, id: result?.data?.id };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error: error.message };
  }
}
