import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Revocation of Power of Attorney | Multi Servicios 360',
  description: 'Revoke an existing power of attorney. Create a revocation document online in English and Spanish.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/revocation-poa',
    languages: { 'en': 'https://multiservicios360.net/en/revocation-poa', 'es': 'https://multiservicios360.net/revocation-poa', 'x-default': 'https://multiservicios360.net/revocation-poa' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="revocation_poa" initialLang="en" />;
}
