import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';

export const metadata = {
  title: 'Carta de Demanda de Pago / Demand Letter | Multi Servicios 360',
  description: 'Carta formal de cobro de deuda. Cumple con la Ley FDCPA. Para servicios impagos, préstamos, renta y contratos incumplidos en California.',
  alternates: {
    canonical: 'https://multiservicios360.net/demand-letter',
    languages: { 'es': 'https://multiservicios360.net/demand-letter', 'en': 'https://multiservicios360.net/en/demand-letter', 'x-default': 'https://multiservicios360.net/demand-letter' },
  },
};

export default function Page() {
  return <SimpleDocChatWizard docType="demand_letter" />;
}
