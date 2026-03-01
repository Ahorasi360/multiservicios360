import NegociosClient from '../../negocios/NegociosClient';

export const metadata = {
  title: 'California Corporation Formation: S-Corp & C-Corp | Multi Servicios 360',
  description: 'Form your S-Corporation or C-Corporation in California online. Articles of Incorporation, Bylaws, Initial Minutes, and Banking Resolution included. Bilingual. From $99.',
  keywords: 'S-Corporation California, C-Corp formation California, incorporate California, articles of incorporation California, corporate minutes, banking resolution California, Latino small business California, bilingual business documents',
  alternates: {
    canonical: 'https://multiservicios360.net/en/business',
    languages: {
      'en': 'https://multiservicios360.net/en/business',
      'es': 'https://multiservicios360.net/negocios',
      'x-default': 'https://multiservicios360.net/negocios',
    },
  },
  openGraph: {
    title: 'S-Corp & C-Corp Formation in California | Multi Servicios 360',
    description: 'Form your corporation in California online. Bilingual. From $99.',
    url: 'https://multiservicios360.net/en/business',
    siteName: 'Multi Servicios 360',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: 'https://multiservicios360.net/og-negocios.jpg',
      width: 1200,
      height: 630,
      alt: 'Business Formation — Multi Servicios 360',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S-Corp & C-Corp California | Multi Servicios 360',
    description: 'Form your corporation online. Bilingual. California.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function Page() {
  return <NegociosClient lang="en" />;
}
