import OurStoryClient from '../../nuestra-historia/OurStoryClient';

export const metadata = {
  title: 'Our Story | Multi Servicios 360',
  description: 'The story of Multi Servicios 360. How we started serving the Latino community with bilingual legal document preparation.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/our-story',
    languages: { 'en': 'https://multiservicios360.net/en/our-story', 'es': 'https://multiservicios360.net/nuestra-historia', 'x-default': 'https://multiservicios360.net/nuestra-historia' },
  },
  openGraph: {
    title: 'Our Story | Multi Servicios 360',
    description: 'How we started serving the Latino community with bilingual legal document preparation.',
    url: 'https://multiservicios360.net/en/our-story',
    locale: 'en_US',
  },
};

export default function OurStoryPage() {
  return <OurStoryClient lang="en" />;
}
