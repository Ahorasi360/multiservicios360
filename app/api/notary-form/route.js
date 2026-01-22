import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://notary.cdn.sos.ca.gov/forms/notary-ack.pdf', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MultiServicios360/1.0)' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notary form');
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="notary-acknowledgment.pdf"',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Notary form fetch error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
