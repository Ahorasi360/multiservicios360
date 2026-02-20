import LimitedPOAWizard from './limited-poa-wizard';

export const metadata = {
  title: 'Poder Notarial Limitado de California | Multi Servicios 360',
  description: 'Cree un Poder Notarial Limitado de California. Software de preparación de documentos legales bilingüe.',
  alternates: {
    canonical: 'https://multiservicios360.net/limited-poa',
    languages: { 'es': 'https://multiservicios360.net/limited-poa', 'en': 'https://multiservicios360.net/en/limited-poa', 'x-default': 'https://multiservicios360.net/limited-poa' },
  },
};

export default function Page() {
  return <LimitedPOAWizard />;
}
