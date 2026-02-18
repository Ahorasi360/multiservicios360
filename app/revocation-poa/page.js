import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Revocación de Poder Notarial / Revocation of POA - Multi Servicios 360',
  description: 'Formally revoke an existing Power of Attorney in California. Bilingual English and Spanish document.',
};

export default function Page() {
  return <SimpleDocChatWizard docType="revocation_poa" />;
}
