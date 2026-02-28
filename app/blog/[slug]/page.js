// app/blog/[slug]/page.js — Spanish version — Maximum SEO
import { getPostBySlug, getAllPosts } from '../../../lib/blog';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import Script from 'next/script';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Country-specific keyword banks
const COUNTRY_KEYWORDS = {
  mexico: ['carta autorización viaje México 2026','permiso viaje menor México','carta notarizada viaje México','menor viajando solo a México','autorización viaje Tijuana Cancún CDMX','travel authorization Mexico minor 2026'],
  colombia: ['carta autorización viaje Colombia 2026','permiso viaje menor Colombia','ICBF carta menor viaje','carta notarizada viaje Bogotá Medellín','travel authorization Colombia minor 2026'],
  'republica-dominicana': ['carta autorización viaje República Dominicana 2026','permiso viaje menor RD','carta notarizada viaje Santo Domingo','travel authorization Dominican Republic minor 2026'],
  brasil: ['carta autorización viaje Brasil 2026','permiso viaje menor Brazil','ECA Brazil menor viajando solo','travel authorization Brazil minor 2026'],
  guatemala: ['carta autorización viaje Guatemala 2026','permiso viaje menor Guatemala','carta notarizada viaje Guatemala City','travel authorization Guatemala minor 2026'],
  honduras: ['carta autorización viaje Honduras 2026','permiso viaje menor Honduras','carta notarizada viaje Tegucigalpa','travel authorization Honduras minor 2026'],
  'el-salvador': ['carta autorización viaje El Salvador 2026','permiso viaje menor El Salvador','LEPINA El Salvador menor viaje','travel authorization El Salvador minor 2026'],
  panama: ['carta autorización viaje Panamá 2026','permiso viaje menor Panamá','Código Familia Panamá menor viaje','travel authorization Panama minor 2026'],
  'costa-rica': ['carta autorización viaje Costa Rica 2026','permiso viaje menor Costa Rica','PANI Costa Rica menor viaje','travel authorization Costa Rica minor 2026'],
  nicaragua: ['carta autorización viaje Nicaragua 2026','permiso viaje menor Nicaragua','Código Niñez Nicaragua menor viaje','travel authorization Nicaragua minor 2026'],
  cuba: ['carta autorización viaje Cuba 2026','permiso viaje menor Cuba','menor cubano viajando solo','OFAC Cuba viaje','travel authorization Cuba minor 2026'],
  peru: ['carta autorización viaje Perú 2026','permiso viaje menor Perú','CNA Perú menor viaje','travel authorization Peru minor 2026'],
  ecuador: ['carta autorización viaje Ecuador 2026','permiso viaje menor Ecuador','COIP Ecuador menor viaje','travel authorization Ecuador minor 2026'],
  bolivia: ['carta autorización viaje Bolivia 2026','permiso viaje menor Bolivia','CDN Bolivia menor viaje','travel authorization Bolivia minor 2026'],
  venezuela: ['carta autorización viaje Venezuela 2026','permiso viaje menor Venezuela','LOPNNA Venezuela menor viaje','travel authorization Venezuela minor 2026'],
  chile: ['carta autorización viaje Chile 2026','permiso viaje menor Chile','apostilla Chile viaje','travel authorization Chile minor 2026'],
  argentina: ['carta autorización viaje Argentina 2026','permiso viaje menor Argentina','apostilla Argentina viaje','travel authorization Argentina minor 2026'],
};

const BASE_KEYWORDS = [
  'Multi Servicios 360','documentos legales latinos California','carta autorización viaje menor 2026',
  'travel authorization letter minor','carta notarizada viaje menor','carta autorización menor sin padres',
  'permiso viaje menor notarizado','autoayuda legal latinos','legal document preparation Spanish',
  'notarized travel letter child California Texas Florida Illinois',
];

function getKeywordsForPost(post) {
  for (const [country, keywords] of Object.entries(COUNTRY_KEYWORDS)) {
    if (post.slug.includes(country)) return [...keywords, ...BASE_KEYWORDS].join(', ');
  }
  const cat = { legal: ['poder notarial California','living trust California','LLC formación California'], immigration: ['inmigración California latinos','documentos inmigración'] };
  return [...(cat[post.category] || []), ...BASE_KEYWORDS].join(', ');
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };
  const url = `https://multiservicios360.net/blog/${slug}`;
  const enUrl = `https://multiservicios360.net/en/blog/${slug}`;
  const keywords = getKeywordsForPost(post);
  const ogImage = post.image ? `https://multiservicios360.net${post.image}` : 'https://multiservicios360.net/og-default.jpg';
  return {
    title: post.title + ' | Multi Servicios 360',
    description: post.excerpt,
    keywords,
    robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
    openGraph: { title: post.title, description: post.excerpt, url, type: 'article', locale: 'es_US', siteName: 'Multi Servicios 360', publishedTime: post.date, modifiedTime: post.date, authors: ['Multi Servicios 360'], images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }] },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, site: '@MS360Legal', creator: '@MS360Legal', images: [ogImage] },
    alternates: { canonical: url, languages: { 'es': url, 'en': enUrl, 'es-US': url, 'x-default': url } },
    other: { 'article:author': 'Multi Servicios 360', 'article:publisher': 'https://multiservicios360.net', 'article:section': post.category, 'article:published_time': post.date },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const allPosts = getAllPosts();
  const related = allPosts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  const url = `https://multiservicios360.net/blog/${slug}`;
  const ogImage = post.image ? `https://multiservicios360.net${post.image}` : 'https://multiservicios360.net/og-default.jpg';

  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article', '@id': url + '#article',
    headline: post.title, description: post.excerpt, datePublished: post.date, dateModified: post.date,
    author: { '@type': 'Organization', name: 'Multi Servicios 360', url: 'https://multiservicios360.net' },
    publisher: { '@type': 'Organization', name: 'Multi Servicios 360', url: 'https://multiservicios360.net', logo: { '@type': 'ImageObject', url: 'https://multiservicios360.net/logo.png' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 },
    inLanguage: 'es-US', keywords: getKeywordsForPost(post), articleSection: post.category, url,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://multiservicios360.net' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://multiservicios360.net/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org', '@type': 'LegalService',
    name: 'Multi Servicios 360',
    description: 'Plataforma de software de autoayuda para la preparación de documentos legales para la comunidad latina. Power of Attorney, Living Trust, LLC Formation, Travel Authorization, Guardianship.',
    url: 'https://multiservicios360.net', telephone: '+18552467274',
    address: { '@type': 'PostalAddress', addressRegion: 'CA', addressCountry: 'US' },
    areaServed: [
      { '@type': 'State', name: 'California' }, { '@type': 'State', name: 'Texas' },
      { '@type': 'State', name: 'Florida' }, { '@type': 'State', name: 'Illinois' },
    ],
    priceRange: '$49-$2500',
    sameAs: ['https://www.facebook.com/MultiServicios360','https://www.instagram.com/multiservicios360','https://www.youtube.com/@MultiServicios360'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Documentos Legales',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Carta de Autorización de Viaje', url: 'https://multiservicios360.net/travel-authorization' }, price: '49', priceCurrency: 'USD' },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Poder Notarial General', url: 'https://multiservicios360.net/poa' }, price: '149', priceCurrency: 'USD' },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Living Trust', url: 'https://multiservicios360.net/trust' }, price: '499', priceCurrency: 'USD' },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Formación de LLC', url: 'https://multiservicios360.net/llc' }, price: '299', priceCurrency: 'USD' },
      ],
    },
  };

  const isTravel = post.category === 'travel' || post.slug.includes('carta-autorizacion');
  const countryName = post.title.match(/[Vv]iaje a ([^:—]+)/)?.[1]?.trim() || 'Latinoamérica';

  const faqSchema = isTravel ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `¿Necesito carta de autorización para viajar a ${countryName} con mi hijo menor de edad?`, acceptedAnswer: { '@type': 'Answer', text: `Sí. Si un menor viaja a ${countryName} sin ambos padres, las autoridades migratorias pueden exigir una carta notarizada del padre o madre ausente. Sin este documento su hijo puede ser retenido en el aeropuerto. Prepare su carta en multiservicios360.net por solo $49.` } },
      { '@type': 'Question', name: `¿Cuánto cuesta una carta de autorización de viaje para ${countryName}?`, acceptedAnswer: { '@type': 'Answer', text: `En Multi Servicios 360 puede preparar su carta de autorización de viaje a ${countryName} por solo $49. El documento se genera al instante en español e inglés, listo para llevar al notario.` } },
      { '@type': 'Question', name: `¿La carta necesita apostilla para ser válida en ${countryName}?`, acceptedAnswer: { '@type': 'Answer', text: `En muchos países latinoamericanos puede requerirse la apostilla de La Haya. Consulte con el consulado de ${countryName} para confirmar los requisitos actuales, ya que cambian cada año.` } },
      { '@type': 'Question', name: `¿Mi hijo con doble ciudadanía necesita la carta para entrar a ${countryName}?`, acceptedAnswer: { '@type': 'Answer', text: `Sí. Si su hijo tiene ciudadanía de ${countryName}, las autoridades lo tratarán como ciudadano local. El pasaporte americano no exime del cumplimiento de las leyes locales. Siempre lleve la carta notarizada.` } },
      { '@type': 'Question', name: `¿Puedo hacer la carta de autorización de viaje yo mismo sin abogado?`, acceptedAnswer: { '@type': 'Answer', text: `Sí. Multi Servicios 360 es software de autoayuda que le permite preparar su carta usted mismo sin abogado, en minutos. Visite multiservicios360.net/travel-authorization.` } },
    ],
  } : null;

  const howToSchema = isTravel ? {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: `Cómo preparar una carta de autorización de viaje para ${countryName}`,
    description: `Guía paso a paso para preparar una carta de autorización de viaje notarizada para que su hijo menor de edad viaje a ${countryName}.`,
    totalTime: 'PT10M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '49' },
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Acceda a la plataforma', text: 'Visite multiservicios360.net/travel-authorization.' },
      { '@type': 'HowToStep', position: 2, name: 'Ingrese los datos', text: `Complete los datos del menor, los padres, el adulto acompañante y los detalles del viaje a ${countryName}.` },
      { '@type': 'HowToStep', position: 3, name: 'Genere el PDF', text: 'El sistema genera su carta en español e inglés lista para imprimir.' },
      { '@type': 'HowToStep', position: 4, name: 'Lleve al notario', text: 'Imprima y lleve al notario público para certificar su firma.' },
      { '@type': 'HowToStep', position: 5, name: 'Obtenga apostilla si es necesario', text: `Consulte si ${countryName} requiere apostilla de La Haya y tramítela si aplica.` },
    ],
  } : null;

  return (
    <>
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="localbusiness-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      {faqSchema && <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {howToSchema && <Script id="howto-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />}
      <BlogPostClient post={post} relatedPosts={related} lang="es" />
    </>
  );
}
