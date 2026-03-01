import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Carta de Solicitud de Apostilla / Apostille Cover Letter | Multi Servicios 360',
  description: 'Carta formal para solicitar Apostilla ante la Secretaría de Estado de California. Para documentos que se usarán en el extranjero.',
  alternates: {
    canonical: 'https://multiservicios360.net/apostille-letter',
    languages: { 'es': 'https://multiservicios360.net/apostille-letter', 'en': 'https://multiservicios360.net/en/apostille-letter', 'x-default': 'https://multiservicios360.net/apostille-letter' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="apostille_letter" />;
}
