import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Formación de C-Corporation / C-Corp Formation | Multi Servicios 360',
  description: 'Paquete completo de formación de C-Corporation en California. Acta, Estatutos, Actas Iniciales, Resolución Bancaria.',
  alternates: {
    canonical: 'https://multiservicios360.net/c-corp-formation',
    languages: { 'es': 'https://multiservicios360.net/c-corp-formation', 'en': 'https://multiservicios360.net/en/c-corp-formation', 'x-default': 'https://multiservicios360.net/c-corp-formation' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="c_corp_formation" />;
}
