import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Declaración Jurada de Sucesión Simplificada / Small Estate Affidavit | Multi Servicios 360',
  description: 'Reclame bienes de una herencia sin abrir probate. Para estates bajo $184,500 en California. Cumpla con el Código de Sucesiones §13100.',
  alternates: {
    canonical: 'https://multiservicios360.net/small-estate-affidavit',
    languages: { 'es': 'https://multiservicios360.net/small-estate-affidavit', 'en': 'https://multiservicios360.net/en/small-estate-affidavit', 'x-default': 'https://multiservicios360.net/small-estate-affidavit' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="small_estate_affidavit" />;
}
