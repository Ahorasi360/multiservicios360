export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const SITE_URL = 'https://multiservicios360.net';

// All blog post slugs to submit
const BLOG_SLUGS = [
  // 17 country travel posts — 2026
  'carta-autorizacion-viaje-mexico-2026',
  'carta-autorizacion-viaje-colombia-2026',
  'carta-autorizacion-viaje-republica-dominicana-2026',
  'carta-autorizacion-viaje-brasil-2026',
  'carta-autorizacion-viaje-guatemala-2026',
  'carta-autorizacion-viaje-honduras-2026',
  'carta-autorizacion-viaje-el-salvador-2026',
  'carta-autorizacion-viaje-panama-2026',
  'carta-autorizacion-viaje-costa-rica-2026',
  'carta-autorizacion-viaje-nicaragua-2026',
  'carta-autorizacion-viaje-cuba-2026',
  'carta-autorizacion-viaje-peru-2026',
  'carta-autorizacion-viaje-ecuador-2026',
  'carta-autorizacion-viaje-bolivia-2026',
  'carta-autorizacion-viaje-venezuela-2026',
  'carta-autorizacion-viaje-chile-2026',
  'carta-autorizacion-viaje-argentina-2026',
  // Other key posts
  'carta-autorizacion-california-cuando-necesitas-2026',
  'poder-notarial-general-california-2026',
  'designacion-guardian-hijos-california-proteger-2026',
  'fideicomiso-vs-testamento-california-2026',
  'como-evitar-probate-california-2026',
  'como-formar-llc-california-paso-a-paso-2026',
  'cuanto-cuesta-llc-california-2026',
  'declaracion-jurada-california-cuando-necesitas-2026',
  'pagare-prestamos-familiares-california-2026',
  'poder-notarial-limitado-transacciones-inmobiliarias-2026',
  'revocacion-poder-notarial-california-como-cancelar-2026',
];

// Generate all URLs (ES + EN)
function getAllUrls() {
  const urls = [`${SITE_URL}/`, `${SITE_URL}/blog`, `${SITE_URL}/en/blog`];
  for (const slug of BLOG_SLUGS) {
    urls.push(`${SITE_URL}/blog/${slug}`);
    urls.push(`${SITE_URL}/en/blog/${slug}`);
  }
  return urls;
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (body.admin_password !== process.env.ADMIN_PASSWORD && body.admin_password !== 'MS360Admin2026!') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const urls = getAllUrls();
    const results = { indexnow: null, sitemap_ping: null, total_urls: urls.length };

    // 1. IndexNow — Bing + Yandex + other engines pick this up immediately
    try {
      const indexNowKey = process.env.INDEXNOW_KEY || 'ms360indexnow2026';
      const indexNowRes = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: 'multiservicios360.net',
          key: indexNowKey,
          keyLocation: `${SITE_URL}/${indexNowKey}.txt`,
          urlList: urls.slice(0, 10000), // IndexNow max 10k URLs per request
        }),
      });
      results.indexnow = { status: indexNowRes.status, ok: indexNowRes.ok };
    } catch (e) {
      results.indexnow = { error: e.message };
    }

    // 2. Ping Google directly with sitemap URL
    try {
      const googlePing = await fetch(
        `https://www.google.com/ping?sitemap=${encodeURIComponent(SITE_URL + '/sitemap.xml')}`,
        { method: 'GET' }
      );
      results.sitemap_ping = { google: googlePing.status };
    } catch (e) {
      results.sitemap_ping = { error: e.message };
    }

    // 3. Ping Bing with sitemap
    try {
      const bingPing = await fetch(
        `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITE_URL + '/sitemap.xml')}`,
        { method: 'GET' }
      );
      results.sitemap_ping = { ...results.sitemap_ping, bing: bingPing.status };
    } catch (e) {
      results.sitemap_ping = { ...results.sitemap_ping, bing_error: e.message };
    }

    return NextResponse.json({
      success: true,
      message: `Submitted ${urls.length} URLs to search engines`,
      urls_submitted: urls,
      results,
      next_steps: [
        '1. Go to Google Search Console > URL Inspection > Request Indexing for key posts',
        '2. Submit sitemap at search.google.com/search-console/sitemaps',
        '3. Check IndexNow at bingwebmastertools.com',
      ],
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pw = searchParams.get('pw');
  if (pw !== 'MS360Admin2026!') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ urls: getAllUrls(), total: getAllUrls().length });
}
