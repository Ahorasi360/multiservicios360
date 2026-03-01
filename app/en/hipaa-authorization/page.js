import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'HIPAA Authorization California | Multi Servicios 360',
  description: 'HIPAA medical authorization for California. Authorize a family member to access your medical records. Federal HIPAA + CMIA compliant.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/hipaa-authorization',
    languages: {
      'en': 'https://multiservicios360.net/en/hipaa-authorization',
      'es': 'https://multiservicios360.net/hipaa-authorization',
      'x-default': 'https://multiservicios360.net/hipaa-authorization',
    },
  },
  openGraph: {
    title: 'HIPAA Authorization California | Multi Servicios 360',
    description: 'HIPAA medical authorization for California. Authorize a family member to access your medical records. Federal HIPAA + CMIA compliant.',
    url: 'https://multiservicios360.net/en/hipaa-authorization',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <SimpleDocChatWizard docType="hipaa_authorization" initialLang="en" />;
}
