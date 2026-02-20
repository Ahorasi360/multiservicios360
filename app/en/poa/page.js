import PoAIntakeWizard from '../../poa/poa-wizard';

export const metadata = {
  title: 'General Power of Attorney California | Multi Servicios 360',
  description: 'Create a California General Durable Power of Attorney online. Bilingual self-service legal document preparation in English and Spanish.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/poa',
    languages: { 'en': 'https://multiservicios360.net/en/poa', 'es': 'https://multiservicios360.net/poa', 'x-default': 'https://multiservicios360.net/poa' },
  },
};

export default function Page() {
  return <PoAIntakeWizard initialLang="en" />;
}
