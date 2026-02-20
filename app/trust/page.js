import TrustIntakeWizard from './trust-wizard';

export const metadata = {
  title: 'Fideicomiso en Vida de California | Multi Servicios 360',
  description: 'Cree su Fideicomiso en Vida de California. Proteja sus bienes y familia con preparación de documentos bilingüe.',
  alternates: {
    canonical: 'https://multiservicios360.net/trust',
    languages: { 'es': 'https://multiservicios360.net/trust', 'en': 'https://multiservicios360.net/en/trust', 'x-default': 'https://multiservicios360.net/trust' },
  },
};

export default function TrustPage() {
  return <TrustIntakeWizard />;
}
