import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Actas Corporativas / Corporate Minutes | Multi Servicios 360',
  description: 'Registro oficial de reuniones corporativas. Requerido para mantener el estatus corporativo en California.',
  alternates: {
    canonical: 'https://multiservicios360.net/corporate-minutes',
    languages: { 'es': 'https://multiservicios360.net/corporate-minutes', 'en': 'https://multiservicios360.net/en/corporate-minutes', 'x-default': 'https://multiservicios360.net/corporate-minutes' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="corporate_minutes" />;
}
