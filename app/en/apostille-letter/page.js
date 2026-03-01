import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Apostille Cover Letter California Secretary of State | Multi Servicios 360',
  description: 'Formal cover letter to request Apostille from the California Secretary of State. For documents to be used in Hague Convention countries.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/apostille-letter',
    languages: { 'en': 'https://multiservicios360.net/en/apostille-letter', 'es': 'https://multiservicios360.net/apostille-letter', 'x-default': 'https://multiservicios360.net/en/apostille-letter' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="apostille_letter" initialLang="en" />;
}
