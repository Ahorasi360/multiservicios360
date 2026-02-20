import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Pagaré / Promissory Note | Multi Servicios 360',
  description: 'Formalice préstamos entre familia, amigos o socios con un pagaré legal en California. Bilingüe.',
  alternates: {
    canonical: 'https://multiservicios360.net/promissory-note',
    languages: { 'es': 'https://multiservicios360.net/promissory-note', 'en': 'https://multiservicios360.net/en/promissory-note', 'x-default': 'https://multiservicios360.net/promissory-note' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="promissory_note" />;
}
