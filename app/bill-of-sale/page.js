import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Carta de Venta / Bill of Sale - Multi Servicios 360',
  description: 'Prepare a legal Bill of Sale for vehicles, equipment, or personal property in California. Bilingual service in English and Spanish.',
};

export default function Page() {
  return <SimpleDocChatWizard docType="bill_of_sale" />;
}
