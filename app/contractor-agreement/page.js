import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Contrato Contratista Independiente / Independent Contractor Agreement California | Multi Servicios 360',
  description: 'Contrato legal para contratistas independientes en California. Cumple con AB5 y el ABC Test del Código Laboral §2775.',
  alternates: {
    canonical: 'https://multiservicios360.net/contractor-agreement',
    languages: { 'es': 'https://multiservicios360.net/contractor-agreement', 'en': 'https://multiservicios360.net/en/contractor-agreement', 'x-default': 'https://multiservicios360.net/contractor-agreement' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="contractor_agreement" />;
}
