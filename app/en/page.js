import HomeClient from '../HomeClient';

export const metadata = {
  title: 'Multi Servicios 360 | Bilingual Legal Document Preparation in California',
  description: 'Bilingual legal document preparation platform in California. Power of Attorney, Living Trust, LLC Formation, Travel Authorization Letter and more. 100% in English and Spanish.',
  keywords: 'legal documents, power of attorney, living trust, LLC California, travel authorization, bilingual, Spanish, document preparation',
  alternates: {
    canonical: 'https://multiservicios360.net/en',
    languages: {
      'en': 'https://multiservicios360.net/en',
      'es': 'https://multiservicios360.net',
      'x-default': 'https://multiservicios360.net',
    },
  },
  openGraph: {
    title: 'Multi Servicios 360 | Legal Documents for You, Your Family and Business',
    description: 'Bilingual legal document preparation platform in California.',
    url: 'https://multiservicios360.net/en',
    locale: 'en_US',
  },
};

export default function HomePageEN() {
  return <HomeClient lang="en" />;
}
