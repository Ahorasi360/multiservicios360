import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Pour-Over Will (Testamento de Traspaso) | Multi Servicios 360',
  description: 'Prepare your pour-over will online in California. Automatically transfers assets to your living trust. Attorney-reviewed clauses.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/pour-over-will',
    languages: {
      'en': 'https://multiservicios360.net/en/pour-over-will',
      'es': 'https://multiservicios360.net/pour-over-will',
      'x-default': 'https://multiservicios360.net/pour-over-will',
    },
  },
  openGraph: {
    title: 'Pour-Over Will (Testamento de Traspaso) | Multi Servicios 360',
    description: 'Prepare your pour-over will online in California. Automatically transfers assets to your living trust. Attorney-reviewed clauses.',
    url: 'https://multiservicios360.net/en/pour-over-will',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <SimpleDocChatWizard docType="pour_over_will" initialLang="en" />;
}
