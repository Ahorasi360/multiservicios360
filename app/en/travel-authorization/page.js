import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Travel Authorization Letter for Minors | Multi Servicios 360',
  description: 'Create a travel authorization letter for your child to travel internationally. Required for border crossings in Latin America. Bilingual English and Spanish.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/travel-authorization',
    languages: { 'en': 'https://multiservicios360.net/en/travel-authorization', 'es': 'https://multiservicios360.net/travel-authorization', 'x-default': 'https://multiservicios360.net/travel-authorization' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="travel_authorization" initialLang="en" />;
}
