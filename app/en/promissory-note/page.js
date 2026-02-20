import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Promissory Note | Multi Servicios 360',
  description: 'Create a legal promissory note in California. Formalize loans between family, friends, or partners. Bilingual English and Spanish.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/promissory-note',
    languages: { 'en': 'https://multiservicios360.net/en/promissory-note', 'es': 'https://multiservicios360.net/promissory-note', 'x-default': 'https://multiservicios360.net/promissory-note' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="promissory_note" initialLang="en" />;
}
