import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Carta de Autorización / Authorization Letter - Multi Servicios 360',
  description: 'Authorize another person to act on your behalf for school, medical, banking, or government matters. Bilingual English and Spanish.',
};

export default function Page() {
  return <SimpleDocChatWizard docType="authorization_letter" />;
}
