import PoAIntakeWizard from './poa-wizard';

export const metadata = {
  title: 'Poder Notarial General de California | Multi Servicios 360',
  description: 'Cree un Poder Notarial General Duradero de California. Software de preparación de documentos legales bilingüe.',
  alternates: {
    canonical: 'https://multiservicios360.net/poa',
    languages: { 'es': 'https://multiservicios360.net/poa', 'en': 'https://multiservicios360.net/en/poa', 'x-default': 'https://multiservicios360.net/poa' },
  },
};

export default function Page() {
  return <PoAIntakeWizard />;
}
