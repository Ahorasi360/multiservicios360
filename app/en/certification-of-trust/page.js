import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Certification of Trust California | Multi Servicios 360',
  description: 'Certification of Trust required by banks to open trust accounts in California. CA Probate Code §18100.5 compliant.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/certification-of-trust',
    languages: {
      'en': 'https://multiservicios360.net/en/certification-of-trust',
      'es': 'https://multiservicios360.net/certification-of-trust',
      'x-default': 'https://multiservicios360.net/certification-of-trust',
    },
  },
  openGraph: {
    title: 'Certification of Trust California | Multi Servicios 360',
    description: 'Certification of Trust required by banks to open trust accounts in California. CA Probate Code §18100.5 compliant.',
    url: 'https://multiservicios360.net/en/certification-of-trust',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <SimpleDocChatWizard docType="certification_of_trust" initialLang="en" />;
}
