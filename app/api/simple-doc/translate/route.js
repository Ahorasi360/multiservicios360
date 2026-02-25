import { NextResponse } from 'next/server';

// Fields that are free-text and may need translation
const FREE_TEXT_FIELDS = [
  'purpose', 'description', 'special_instructions', 'additional_info',
  'reason', 'details', 'notes', 'declaration', 'statement',
  'declaration_text', 'custom_text', 'other_details', 'comments',
  'travel_purpose', 'emergency_contact_notes', 'authorization_details',
  'relationship_details', 'property_description', 'services_description',
];

export async function POST(request) {
  try {
    const { form_data, document_type } = await request.json();

    if (!form_data) {
      return NextResponse.json({ success: false, error: 'Missing form_data' }, { status: 400 });
    }

    // Find fields that have Spanish text worth translating
    const fieldsToTranslate = {};
    for (const field of FREE_TEXT_FIELDS) {
      if (form_data[field] && typeof form_data[field] === 'string' && form_data[field].trim().length > 3) {
        fieldsToTranslate[field] = form_data[field];
      }
    }

    // Also check any field ending in _es or containing Spanish-like content
    for (const [key, value] of Object.entries(form_data)) {
      if (typeof value === 'string' && value.length > 3 && !fieldsToTranslate[key]) {
        // Check for common Spanish words as indicator
        if (/\b(para|por|con|que|del|los|las|una|este|esta|como|pero|más|también|cuando)\b/i.test(value)) {
          fieldsToTranslate[key] = value;
        }
      }
    }

    if (Object.keys(fieldsToTranslate).length === 0) {
      return NextResponse.json({ success: true, translations: {} });
    }

    // Call Anthropic API
    const prompt = `You are a professional legal document translator. Translate the following Spanish text fields to English for a legal document of type: ${document_type || 'general'}.

Return ONLY a valid JSON object with the same keys and translated English values. Do not add any explanation or markdown.

Fields to translate:
${JSON.stringify(fieldsToTranslate, null, 2)}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error('Anthropic API error:', response.status);
      return NextResponse.json({ success: true, translations: {} });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';

    // Parse JSON safely
    const cleaned = text.replace(/```json|```/g, '').trim();
    const translations = JSON.parse(cleaned);

    return NextResponse.json({ success: true, translations });

  } catch (error) {
    console.error('Translation route error:', error);
    // Return empty translations so PDF still generates without translation
    return NextResponse.json({ success: true, translations: {} });
  }
}
