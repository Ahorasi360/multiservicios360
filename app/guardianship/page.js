import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Designación de Guardián / Guardianship Designation - Multi Servicios 360',
  description: 'Designate a trusted guardian for your minor children in case of emergency. Bilingual English and Spanish document.',
};

export default function Page() {
  return <SimpleDocChatWizard docType="guardianship_designation" />;
}
