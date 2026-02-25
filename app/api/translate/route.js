import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { fields, document_type } = await request.json();

    if (!fields || Object.keys(fields).length === 0) {
      return NextResponse.json({ success: true, translations: {} });
    }

    // Filter out empty/null values
    const toTranslate = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value && typeof value === 'string' && value.trim().length > 2) {
        toTranslate[key] = value.trim();
      }
    }

    if (Object.keys(toTranslate).length === 0) {
      return NextResponse.json({ success: true, translations: {} });
    }

    const prompt = `You are a professional legal document translator. Translate the following Spanish text fields to English for a legal document of type: ${document_type || 'legal document'}.

Return ONLY a valid JSON object with the same keys and English translated values. No explanation, no markdown, just JSON.

Fields to translate:
${JSON.stringify(toTranslate, null, 2)}`;

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
    const cleaned = text.replace(/```json|```/g, '').trim();
    const translations = JSON.parse(cleaned);

    return NextResponse.json({ success: true, translations });

  } catch (error) {
    console.error('Translate route error:', error);
    return NextResponse.json({ success: true, translations: {} });
  }
}
