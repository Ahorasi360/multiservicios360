import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Testamento con Cláusula de Fideicomiso / Pour-Over Will | Multi Servicios 360',
  description: 'Prepare su testamento con cláusula de fideicomiso en línea. Transfiere activos al fideicomiso al fallecer.',
  alternates: {
    canonical: 'https://multiservicios360.net/pour-over-will',
    languages: { 'es': 'https://multiservicios360.net/pour-over-will', 'en': 'https://multiservicios360.net/en/pour-over-will', 'x-default': 'https://multiservicios360.net/pour-over-will' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="pour_over_will" />;
}
