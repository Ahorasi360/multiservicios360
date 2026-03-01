import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Formación de S-Corporation / S-Corp Formation | Multi Servicios 360',
  description: 'Paquete completo de formación de S-Corporation en California. Acta, Estatutos, Actas Iniciales, Resolución Bancaria.',
  alternates: {
    canonical: 'https://multiservicios360.net/s-corp-formation',
    languages: { 'es': 'https://multiservicios360.net/s-corp-formation', 'en': 'https://multiservicios360.net/en/s-corp-formation', 'x-default': 'https://multiservicios360.net/s-corp-formation' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="s_corp_formation" />;
}
