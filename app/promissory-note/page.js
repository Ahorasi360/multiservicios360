import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Pagaré / Promissory Note - Multi Servicios 360',
  description: 'Formalize loans between family, friends, or partners with a legal Promissory Note in California. Bilingual English and Spanish.',
};

export default function Page() {
  return <SimpleDocChatWizard docType="promissory_note" />;
}
