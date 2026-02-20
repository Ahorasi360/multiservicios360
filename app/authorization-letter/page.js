import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Carta de Autorización | Multi Servicios 360',
  description: 'Autorice a otra persona a actuar en su nombre para asuntos escolares, médicos, bancarios o gubernamentales. Bilingüe.',
  alternates: {
    canonical: 'https://multiservicios360.net/authorization-letter',
    languages: { 'es': 'https://multiservicios360.net/authorization-letter', 'en': 'https://multiservicios360.net/en/authorization-letter', 'x-default': 'https://multiservicios360.net/authorization-letter' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="authorization_letter" />;
}
