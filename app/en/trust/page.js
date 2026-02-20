import TrustIntakeWizard from '../../trust/trust-wizard';

export const metadata = {
  title: 'California Living Trust | Multi Servicios 360',
  description: 'Create your California Living Trust online. Protect your assets and family with bilingual document preparation in English and Spanish.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/trust',
    languages: { 'en': 'https://multiservicios360.net/en/trust', 'es': 'https://multiservicios360.net/trust', 'x-default': 'https://multiservicios360.net/trust' },
  },
};

export default function Page() {
  return <TrustIntakeWizard initialLang="en" />;
}
