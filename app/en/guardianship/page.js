import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Temporary Guardianship Agreement | Multi Servicios 360',
  description: 'Create a temporary guardianship agreement online. Authorize a guardian for your minor child in English and Spanish.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/guardianship',
    languages: { 'en': 'https://multiservicios360.net/en/guardianship', 'es': 'https://multiservicios360.net/guardianship', 'x-default': 'https://multiservicios360.net/guardianship' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="guardianship" initialLang="en" />;
}
