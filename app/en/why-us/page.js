import WhyUsClient from '../../por-que-nosotros/WhyUsClient';

export const metadata = {
  title: 'Why Choose Us? | Multi Servicios 360',
  description: 'Why choose Multi Servicios 360? Bilingual legal document preparation at a fraction of attorney costs. Serving the Latino community in California.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/why-us',
    languages: { 'en': 'https://multiservicios360.net/en/why-us', 'es': 'https://multiservicios360.net/por-que-nosotros', 'x-default': 'https://multiservicios360.net/por-que-nosotros' },
  },
  openGraph: {
    title: 'Why Choose Us? | Multi Servicios 360',
    description: 'Bilingual legal document preparation at a fraction of attorney costs.',
    url: 'https://multiservicios360.net/en/why-us',
    locale: 'en_US',
  },
};

export default function WhyUsPage() {
  return <WhyUsClient lang="en" />;
}
