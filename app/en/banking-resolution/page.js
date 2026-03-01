import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Banking Resolution for Corporation or LLC | Multi Servicios 360',
  description: 'Banking resolution required by banks to open business accounts for your California corporation or LLC.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/banking-resolution',
    languages: {
      'en': 'https://multiservicios360.net/en/banking-resolution',
      'es': 'https://multiservicios360.net/banking-resolution',
      'x-default': 'https://multiservicios360.net/banking-resolution',
    },
  },
  openGraph: {
    title: 'Banking Resolution for Corporation or LLC | Multi Servicios 360',
    description: 'Banking resolution required by banks to open business accounts for your California corporation or LLC.',
    url: 'https://multiservicios360.net/en/banking-resolution',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <SimpleDocChatWizard docType="banking_resolution" initialLang="en" />;
}
