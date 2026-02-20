import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Tutela Temporal / Guardianship | Multi Servicios 360',
  description: 'Cree un acuerdo de tutela temporal para su hijo menor. Bilingüe inglés y español.',
  alternates: {
    canonical: 'https://multiservicios360.net/guardianship',
    languages: { 'es': 'https://multiservicios360.net/guardianship', 'en': 'https://multiservicios360.net/en/guardianship', 'x-default': 'https://multiservicios360.net/guardianship' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="guardianship" />;
}
