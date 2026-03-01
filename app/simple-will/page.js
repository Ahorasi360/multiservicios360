import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Testamento Simple / Last Will & Testament | Multi Servicios 360',
  description: 'Cree su testamento en línea. Distribución de bienes, ejecutor y guardián de menores en California.',
  alternates: {
    canonical: 'https://multiservicios360.net/simple-will',
    languages: { 'es': 'https://multiservicios360.net/simple-will', 'en': 'https://multiservicios360.net/en/simple-will', 'x-default': 'https://multiservicios360.net/simple-will' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="simple_will" />;
}
