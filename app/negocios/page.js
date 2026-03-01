import NegociosClient from './NegociosClient';

export const metadata = {
  title: 'Formación de Corporaciones en California: S-Corp y C-Corp | Multi Servicios 360',
  description: 'Forme su S-Corporation o C-Corporation en California en línea. Acta Constitutiva, Estatutos, Actas Iniciales y Resolución Bancaria incluidos. Bilingüe. Desde $99.',
  keywords: 'S-Corporation California, C-Corporation California, formar corporación California, acta constitutiva California, corporate minutes California, banking resolution California, negocios latinos California, small business formation California',
  alternates: {
    canonical: 'https://multiservicios360.net/negocios',
    languages: {
      'es': 'https://multiservicios360.net/negocios',
      'en': 'https://multiservicios360.net/en/business',
      'x-default': 'https://multiservicios360.net/negocios',
    },
  },
  openGraph: {
    title: 'Formación S-Corp y C-Corp en California | Multi Servicios 360',
    description: 'Forme su corporación en California en línea. Bilingüe. Desde $99.',
    url: 'https://multiservicios360.net/negocios',
    siteName: 'Multi Servicios 360',
    locale: 'es_US',
    type: 'website',
    images: [{
      url: 'https://multiservicios360.net/og-negocios.jpg',
      width: 1200,
      height: 630,
      alt: 'Formación de Negocios — Multi Servicios 360',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S-Corp y C-Corp California | Multi Servicios 360',
    description: 'Forme su corporación en línea. Bilingüe. California.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function Page() {
  return <NegociosClient lang="es" />;
}
