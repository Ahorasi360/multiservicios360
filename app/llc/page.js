import LLCIntakeWizard from './llc-wizard';

export const metadata = {
  title: 'Formación de LLC en California | Multi Servicios 360',
  description: 'Forme su LLC en California en línea. Servicio bilingüe de formación de LLC con preparación de documentos.',
  alternates: {
    canonical: 'https://multiservicios360.net/llc',
    languages: { 'es': 'https://multiservicios360.net/llc', 'en': 'https://multiservicios360.net/en/llc', 'x-default': 'https://multiservicios360.net/llc' },
  },
};

export default function Page() {
  return <LLCIntakeWizard />;
}
