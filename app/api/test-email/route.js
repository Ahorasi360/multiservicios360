import { sendWelcomeEmail } from '../../../lib/send-welcome-email';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await sendWelcomeEmail({
    to: 'flashpreviews@yahoo.com',
    name: 'Anthony Test',
    role: 'partner',
    loginUrl: 'https://multiservicios360.net/portal/login',
    email: 'flashpreviews@yahoo.com',
    password: 'TestPass123',
    setupFee: 499,
    membershipUrl: 'https://multiservicios360.net/portal/membership',
  });
  return NextResponse.json(result);
}
