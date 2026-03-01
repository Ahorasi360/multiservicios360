import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'C-Corporation Formation California | Multi Servicios 360',
  description: 'Form your C-Corporation in California online. Complete package: Articles, Bylaws, Minutes, Banking Resolution, Preferred Stock.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/c-corp-formation',
    languages: {
      'en': 'https://multiservicios360.net/en/c-corp-formation',
      'es': 'https://multiservicios360.net/c-corp-formation',
      'x-default': 'https://multiservicios360.net/c-corp-formation',
    },
  },
  openGraph: {
    title: 'C-Corporation Formation California | Multi Servicios 360',
    description: 'Form your C-Corporation in California online. Complete package: Articles, Bylaws, Minutes, Banking Resolution, Preferred Stock.',
    url: 'https://multiservicios360.net/en/c-corp-formation',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <SimpleDocChatWizard docType="c_corp_formation" initialLang="en" />;
}
