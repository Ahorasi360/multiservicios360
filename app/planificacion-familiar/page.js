import FamiliaClient from './FamiliaClient';

export const metadata = {
  title: 'Planificación Familiar: Testamentos y Documentos Legales | Multi Servicios 360',
  description: 'Prepare su testamento, autorización HIPAA y certificación de fideicomiso en línea. Documentos legales válidos en California para la comunidad latina. Desde $99.',
  keywords: 'testamento California, how to make a will in California, HIPAA authorization California, certificación de fideicomiso, pour-over will California, planificación familiar California, documentos legales en español',
  alternates: {
    canonical: 'https://multiservicios360.net/planificacion-familiar',
    languages: {
      'es': 'https://multiservicios360.net/planificacion-familiar',
      'en': 'https://multiservicios360.net/en/family-planning',
      'x-default': 'https://multiservicios360.net/planificacion-familiar',
    },
  },
  openGraph: {
    title: 'Planificación Familiar: Testamentos y Documentos Legales',
    description: 'Testamento, HIPAA y documentos de fideicomiso en línea. Bilingüe. California. Desde $99.',
    url: 'https://multiservicios360.net/planificacion-familiar',
    siteName: 'Multi Servicios 360',
    locale: 'es_US',
    type: 'website',
    images: [{
      url: 'https://multiservicios360.net/og-familia.jpg',
      width: 1200,
      height: 630,
      alt: 'Planificación Familiar — Multi Servicios 360',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testamentos y Documentos de Planificación Familiar | Multi Servicios 360',
    description: 'Prepare su testamento y documentos legales en línea. Bilingüe. California.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function Page() {
  return <FamiliaClient lang="es" />;
}
