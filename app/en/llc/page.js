import LLCIntakeWizard from '../../llc/llc-wizard';

export const metadata = {
  title: 'California LLC Formation | Multi Servicios 360',
  description: 'Form your California LLC online. Bilingual LLC formation service with document preparation in English and Spanish.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/llc',
    languages: { 'en': 'https://multiservicios360.net/en/llc', 'es': 'https://multiservicios360.net/llc', 'x-default': 'https://multiservicios360.net/llc' },
  },
};

export default function Page() {
  return <LLCIntakeWizard initialLang="en" />;
}
