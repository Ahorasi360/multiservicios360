import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'S-Corporation Formation California | Multi Servicios 360',
  description: 'Form your S-Corporation in California online. Complete package: Articles, Bylaws, Minutes, Banking Resolution, S-Corp Election.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/s-corp-formation',
    languages: {
      'en': 'https://multiservicios360.net/en/s-corp-formation',
      'es': 'https://multiservicios360.net/s-corp-formation',
      'x-default': 'https://multiservicios360.net/s-corp-formation',
    },
  },
  openGraph: {
    title: 'S-Corporation Formation California | Multi Servicios 360',
    description: 'Form your S-Corporation in California online. Complete package: Articles, Bylaws, Minutes, Banking Resolution, S-Corp Election.',
    url: 'https://multiservicios360.net/en/s-corp-formation',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <SimpleDocChatWizard docType="s_corp_formation" initialLang="en" />;
}
