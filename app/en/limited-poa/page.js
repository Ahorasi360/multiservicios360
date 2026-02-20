import LimitedPOAWizard from '../../limited-poa/limited-poa-wizard';

export const metadata = {
  title: 'Limited Power of Attorney California | Multi Servicios 360',
  description: 'Create a California Limited Power of Attorney online. Bilingual self-service legal document preparation in English and Spanish.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/limited-poa',
    languages: { 'en': 'https://multiservicios360.net/en/limited-poa', 'es': 'https://multiservicios360.net/limited-poa', 'x-default': 'https://multiservicios360.net/limited-poa' },
  },
};

export default function Page() {
  return <LimitedPOAWizard initialLang="en" />;
}
