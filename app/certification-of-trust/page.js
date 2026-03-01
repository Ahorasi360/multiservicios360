import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Certificación de Fideicomiso / Certification of Trust | Multi Servicios 360',
  description: 'Documento requerido por bancos para abrir cuentas o transferir activos al fideicomiso.',
  alternates: {
    canonical: 'https://multiservicios360.net/certification-of-trust',
    languages: { 'es': 'https://multiservicios360.net/certification-of-trust', 'en': 'https://multiservicios360.net/en/certification-of-trust', 'x-default': 'https://multiservicios360.net/certification-of-trust' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="certification_of_trust" />;
}
