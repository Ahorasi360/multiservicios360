import { notFound } from 'next/navigation';
import { getGuide, ALL_SLUGS } from '../../../../lib/guides-config';
import GuiaClient from '../../../guias/[slug]/GuiaClient';

export async function generateStaticParams() {
  return ALL_SLUGS.map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const guide = getGuide(slug, 'en');
  if (!guide) return { title: 'Guide not found' };

  return {
    title: guide.metaTitle,
    description: guide.metaDesc,
    alternates: {
      canonical: `https://multiservicios360.net/en/guias/${slug}`,
      languages: {
        'en': `https://multiservicios360.net/en/guias/${slug}`,
        'es': `https://multiservicios360.net/guias/${slug}`,
        'x-default': `https://multiservicios360.net/en/guias/${slug}`,
      },
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDesc,
      url: `https://multiservicios360.net/en/guias/${slug}`,
      siteName: 'Multi Servicios 360',
      locale: 'en_US',
      type: 'article',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

export default function GuidePageEn({ params }) {
  const { slug } = params;
  const guide = getGuide(slug, 'en');
  if (!guide) notFound();
  return <GuiaClient guide={guide} slug={slug} lang="en" />;
}
