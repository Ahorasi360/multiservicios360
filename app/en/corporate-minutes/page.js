import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Corporate Minutes California | Multi Servicios 360',
  description: 'Prepare corporate minutes for annual, special, or board meetings in California. Required to maintain corporate protection.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/corporate-minutes',
    languages: {
      'en': 'https://multiservicios360.net/en/corporate-minutes',
      'es': 'https://multiservicios360.net/corporate-minutes',
      'x-default': 'https://multiservicios360.net/corporate-minutes',
    },
  },
  openGraph: {
    title: 'Corporate Minutes California | Multi Servicios 360',
    description: 'Prepare corporate minutes for annual, special, or board meetings in California. Required to maintain corporate protection.',
    url: 'https://multiservicios360.net/en/corporate-minutes',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <SimpleDocChatWizard docType="corporate_minutes" initialLang="en" />;
}
