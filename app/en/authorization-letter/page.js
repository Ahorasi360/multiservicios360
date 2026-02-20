import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Authorization Letter | Multi Servicios 360',
  description: 'Authorize another person to act on your behalf for school, medical, banking, or government matters. Bilingual English and Spanish.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/authorization-letter',
    languages: { 'en': 'https://multiservicios360.net/en/authorization-letter', 'es': 'https://multiservicios360.net/authorization-letter', 'x-default': 'https://multiservicios360.net/authorization-letter' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="authorization_letter" initialLang="en" />;
}
