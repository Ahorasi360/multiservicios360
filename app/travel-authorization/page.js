import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Carta de Autorización de Viaje | Multi Servicios 360',
  description: 'Autorice a otra persona a viajar internacionalmente con su hijo menor. Documento esencial para cruces fronterizos. Bilingüe inglés y español.',
  alternates: {
    canonical: 'https://multiservicios360.net/travel-authorization',
    languages: { 'es': 'https://multiservicios360.net/travel-authorization', 'en': 'https://multiservicios360.net/en/travel-authorization', 'x-default': 'https://multiservicios360.net/travel-authorization' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="travel_authorization" />;
}
