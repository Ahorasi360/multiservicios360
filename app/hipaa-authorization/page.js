import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Autorización HIPAA / HIPAA Authorization | Multi Servicios 360',
  description: 'Autorice a un familiar a acceder a su información médica. Cumple con HIPAA y CMIA de California.',
  alternates: {
    canonical: 'https://multiservicios360.net/hipaa-authorization',
    languages: { 'es': 'https://multiservicios360.net/hipaa-authorization', 'en': 'https://multiservicios360.net/en/hipaa-authorization', 'x-default': 'https://multiservicios360.net/hipaa-authorization' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="hipaa_authorization" />;
}
