import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Revocación de Poder Notarial | Multi Servicios 360',
  description: 'Revoque un poder notarial existente. Preparación de documentos bilingüe en inglés y español.',
  alternates: {
    canonical: 'https://multiservicios360.net/revocation-poa',
    languages: { 'es': 'https://multiservicios360.net/revocation-poa', 'en': 'https://multiservicios360.net/en/revocation-poa', 'x-default': 'https://multiservicios360.net/revocation-poa' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="revocation_poa" />;
}
