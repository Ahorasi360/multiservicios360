import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Carta de Venta / Bill of Sale | Multi Servicios 360',
  description: 'Cree una carta de venta para vehículos o propiedad personal. Bilingüe inglés y español.',
  alternates: {
    canonical: 'https://multiservicios360.net/bill-of-sale',
    languages: { 'es': 'https://multiservicios360.net/bill-of-sale', 'en': 'https://multiservicios360.net/en/bill-of-sale', 'x-default': 'https://multiservicios360.net/bill-of-sale' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="bill_of_sale" />;
}
