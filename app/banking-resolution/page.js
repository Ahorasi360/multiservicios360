import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Resolución Bancaria / Banking Resolution | Multi Servicios 360',
  description: 'Documento requerido por bancos para abrir cuentas comerciales para corporaciones y LLC en California.',
  alternates: {
    canonical: 'https://multiservicios360.net/banking-resolution',
    languages: { 'es': 'https://multiservicios360.net/banking-resolution', 'en': 'https://multiservicios360.net/en/banking-resolution', 'x-default': 'https://multiservicios360.net/banking-resolution' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="banking_resolution" />;
}
