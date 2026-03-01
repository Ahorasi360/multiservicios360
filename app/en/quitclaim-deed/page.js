import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Quitclaim Deed California | Multi Servicios 360',
  description: 'Transfer property to your trust, spouse, or family member. Includes PCOR and transfer tax statement. California Civil Code §1092.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/quitclaim-deed',
    languages: { 'en': 'https://multiservicios360.net/en/quitclaim-deed', 'es': 'https://multiservicios360.net/quitclaim-deed', 'x-default': 'https://multiservicios360.net/en/quitclaim-deed' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="quitclaim_deed" initialLang="en" />;
}
