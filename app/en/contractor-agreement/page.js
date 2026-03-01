import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Independent Contractor Agreement California AB5 | Multi Servicios 360',
  description: 'Legal contract for independent contractors in California. AB5 compliant with ABC Test under Labor Code §2775.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/contractor-agreement',
    languages: { 'en': 'https://multiservicios360.net/en/contractor-agreement', 'es': 'https://multiservicios360.net/contractor-agreement', 'x-default': 'https://multiservicios360.net/en/contractor-agreement' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="contractor_agreement" initialLang="en" />;
}
