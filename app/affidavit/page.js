import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Declaración Jurada / Affidavit | Multi Servicios 360',
  description: 'Cree una declaración jurada general en línea. Preparación de documentos bilingüe en inglés y español.',
  alternates: {
    canonical: 'https://multiservicios360.net/affidavit',
    languages: { 'es': 'https://multiservicios360.net/affidavit', 'en': 'https://multiservicios360.net/en/affidavit', 'x-default': 'https://multiservicios360.net/affidavit' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="affidavit" />;
}
