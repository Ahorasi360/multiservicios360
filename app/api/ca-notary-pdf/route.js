export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

// Server-side fetch of CA notary PDF (bypasses browser CORS restrictions)
const CA_NOTARY_PDF_URL = 'https://notary.cdn.sos.ca.gov/forms/notary-ack.pdf';

export async function GET() {
  try {
    const response = await fetch(CA_NOTARY_PDF_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch notary PDF' },
        { status: response.status }
      );
    }
    
    const pdfBuffer = await response.arrayBuffer();
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="ca-notary-acknowledgment.pdf"',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });
  } catch (error) {
    console.error('Error fetching notary PDF:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notary PDF', details: error.message },
      { status: 500 }
    );
  }
}