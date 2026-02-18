import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Carta de Autorización de Viaje / Travel Authorization Letter - Multi Servicios 360',
  description: 'Authorize another person to travel internationally with your minor child. Essential document for border crossings. Bilingual English and Spanish.',
};

export default function Page() {
  return <SimpleDocChatWizard docType="travel_authorization" />;
}
