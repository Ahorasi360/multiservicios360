import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Declaración Jurada / Affidavit - Multi Servicios 360',
  description: 'Prepare a sworn Affidavit for identity verification, residency, or other legal purposes in California. Bilingual English and Spanish.',
};

export default function Page() {
  return <SimpleDocChatWizard docType="affidavit" />;
}
