import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Bill of Sale | Multi Servicios 360',
  description: 'Create a bill of sale document online. Vehicle, personal property, and general bill of sale in English and Spanish.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/bill-of-sale',
    languages: { 'en': 'https://multiservicios360.net/en/bill-of-sale', 'es': 'https://multiservicios360.net/bill-of-sale', 'x-default': 'https://multiservicios360.net/bill-of-sale' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="bill_of_sale" initialLang="en" />;
}
