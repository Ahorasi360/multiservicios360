import FamiliaClient from '../../planificacion-familiar/FamiliaClient';

export const metadata = {
  title: 'Family Planning: Wills & Legal Documents in California | Multi Servicios 360',
  description: 'Prepare your will, HIPAA authorization, and trust certification online. Valid legal documents in California — in English and Spanish. From $99.',
  keywords: 'will California, last will and testament California, HIPAA authorization California, certification of trust California, pour-over will, family planning legal documents, bilingual legal documents California',
  alternates: {
    canonical: 'https://multiservicios360.net/en/family-planning',
    languages: {
      'en': 'https://multiservicios360.net/en/family-planning',
      'es': 'https://multiservicios360.net/planificacion-familiar',
      'x-default': 'https://multiservicios360.net/planificacion-familiar',
    },
  },
  openGraph: {
    title: 'Family Planning: Wills & Legal Documents in California',
    description: 'Will, HIPAA, and trust documents online. Bilingual. California. From $99.',
    url: 'https://multiservicios360.net/en/family-planning',
    siteName: 'Multi Servicios 360',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: 'https://multiservicios360.net/og-familia.jpg',
      width: 1200,
      height: 630,
      alt: 'Family Planning — Multi Servicios 360',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wills & Family Planning Legal Documents | Multi Servicios 360',
    description: 'Prepare your will and legal documents online. Bilingual. California.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function Page() {
  return <FamiliaClient lang="en" />;
}
