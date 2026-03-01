import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Last Will and Testament California | Multi Servicios 360',
  description: 'Create your will online in California. Asset distribution, executor, and guardian for minors. Valid bilingual document.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/simple-will',
    languages: {
      'en': 'https://multiservicios360.net/en/simple-will',
      'es': 'https://multiservicios360.net/simple-will',
      'x-default': 'https://multiservicios360.net/simple-will',
    },
  },
  openGraph: {
    title: 'Last Will and Testament California | Multi Servicios 360',
    description: 'Create your will online in California. Asset distribution, executor, and guardian for minors. Valid bilingual document.',
    url: 'https://multiservicios360.net/en/simple-will',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <SimpleDocChatWizard docType="simple_will" initialLang="en" />;
}
