import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Small Estate Affidavit California §13100 | Multi Servicios 360',
  description: 'Claim estate assets without opening probate. For estates under $184,500 in California. Complies with Probate Code §13100.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/small-estate-affidavit',
    languages: { 'en': 'https://multiservicios360.net/en/small-estate-affidavit', 'es': 'https://multiservicios360.net/small-estate-affidavit', 'x-default': 'https://multiservicios360.net/en/small-estate-affidavit' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="small_estate_affidavit" initialLang="en" />;
}
