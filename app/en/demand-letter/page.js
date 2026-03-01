import SimpleDocChatWizard from '../../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Demand Letter Debt Collection California | Multi Servicios 360',
  description: 'Formal debt collection demand letter. FDCPA compliant. For unpaid services, loans, rent, and breach of contract in California.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/demand-letter',
    languages: { 'en': 'https://multiservicios360.net/en/demand-letter', 'es': 'https://multiservicios360.net/demand-letter', 'x-default': 'https://multiservicios360.net/en/demand-letter' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="demand_letter" initialLang="en" />;
}
