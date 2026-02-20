import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'General Affidavit | Multi Servicios 360',
  description: 'Create a general affidavit online. Sworn statement document preparation in English and Spanish.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/affidavit',
    languages: { 'en': 'https://multiservicios360.net/en/affidavit', 'es': 'https://multiservicios360.net/affidavit', 'x-default': 'https://multiservicios360.net/affidavit' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="affidavit" initialLang="en" />;
}
