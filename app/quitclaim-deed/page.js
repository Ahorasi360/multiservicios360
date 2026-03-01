import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Escritura de Traspaso / Quitclaim Deed California | Multi Servicios 360',
  description: 'Transfiera propiedad a su fideicomiso, cónyuge o familiar. Incluye PCOR y declaración de impuestos. California Civil Code §1092.',
  alternates: {
    canonical: 'https://multiservicios360.net/quitclaim-deed',
    languages: { 'es': 'https://multiservicios360.net/quitclaim-deed', 'en': 'https://multiservicios360.net/en/quitclaim-deed', 'x-default': 'https://multiservicios360.net/quitclaim-deed' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="quitclaim_deed" />;
}
