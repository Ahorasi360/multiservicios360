export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const PANDADOC_API = 'https://api.pandadoc.com/public/v1';
const PANDADOC_API_V2 = 'https://api.pandadoc.com/public/v2';

function getApiKey() {
  return process.env.PANDADOC_API_KEY || process.env.PANDADOC_SANDBOX_KEY;
}

function headers() {
  return {
    'Authorization': `API-Key ${getApiKey()}`,
  };
}

// Poll document status until draft (max ~30 seconds)
async function waitForDraft(documentId, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const res = await fetch(`${PANDADOC_API}/documents/${documentId}`, {
      headers: headers(),
    });
    if (!res.ok) continue;
    const data = await res.json();
    if (data.status === 'document.draft') return true;
    if (data.status === 'document.error') return false;
  }
  return false;
}

export async function POST(request) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'PandaDoc API key not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { pdf_base64, signer_email, signer_first_name, signer_last_name, document_name } = body;

    if (!pdf_base64 || !signer_email || !signer_first_name || !signer_last_name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // === STEP 1: Upload PDF to PandaDoc ===
    const pdfBuffer = Buffer.from(pdf_base64, 'base64');
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('file', blob, (document_name || 'document') + '.pdf');
    formData.append('data', JSON.stringify({
      name: document_name || 'Document for Notarization',
      recipients: [{
        email: signer_email,
        first_name: signer_first_name,
        last_name: signer_last_name,
        role: 'signer',
      }],
      parse_form_fields: false,
    }));

    const uploadRes = await fetch(`${PANDADOC_API}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `API-Key ${apiKey}`,
      },
      body: formData,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error('PandaDoc upload error:', err);
      return NextResponse.json({ success: false, error: 'Failed to upload document to PandaDoc' }, { status: 500 });
    }

    const uploadData = await uploadRes.json();
    const documentId = uploadData.id;

    // === STEP 2: Wait for document to reach draft status ===
    const isDraft = await waitForDraft(documentId);
    if (!isDraft) {
      return NextResponse.json({ success: false, error: 'Document processing timed out' }, { status: 500 });
    }

    // === STEP 3: Create Notarization Request ===
    const notaryRes = await fetch(`${PANDADOC_API_V2}/notary/notarization-requests`, {
      method: 'POST',
      headers: {
        ...headers(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_id: documentId,
        invitation: {
          invitees: [{
            email: signer_email,
            first_name: signer_first_name,
            last_name: signer_last_name,
          }],
          message: 'Your document is ready for notarization. Click the link below to connect with a notary.',
        },
      }),
    });

    if (!notaryRes.ok) {
      const err = await notaryRes.text();
      console.error('PandaDoc notary error:', err);
      return NextResponse.json({ success: false, error: 'Failed to create notarization request: ' + err }, { status: 500 });
    }

    const notaryData = await notaryRes.json();

    return NextResponse.json({
      success: true,
      notarization_link: notaryData.notarization_link,
      request_id: notaryData.id,
      document_id: documentId,
    });

  } catch (error) {
    console.error('Notarization error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Check notarization status
export async function GET(request) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'PandaDoc API key not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get('request_id');

  if (!requestId) {
    return NextResponse.json({ success: false, error: 'Missing request_id' }, { status: 400 });
  }

  try {
    const res = await fetch(`${PANDADOC_API_V2}/notary/notarization-requests/${requestId}`, {
      headers: headers(),
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Failed to get status' }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      status: data.status,
      signed_documents: data.signed_documents || [],
      recording: data.recording || null,
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}