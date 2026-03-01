import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';
import Script from 'next/script';

export const metadata = {
  title: 'Carta de Demanda California — Cobrar Deudas sin Corte | Multi Servicios 360',
  description: 'Redacte una carta de demanda profesional para cobrar deudas, disputar contratos o exigir devolución de depósito en California. Requisito previo para Small Claims Court. Desde $99.',
  keywords: 'carta de demanda California, demand letter California, cobrar deuda California, small claims court California, disputa contractual California',
  alternates: { canonical: 'https://multiservicios360.net/demand-letter', languages: { 'es': 'https://multiservicios360.net/demand-letter', 'en': 'https://multiservicios360.net/en/demand-letter', 'x-default': 'https://multiservicios360.net/demand-letter' } },
  openGraph: { title: 'Carta de Demanda California | Multi Servicios 360', description: 'Cobre lo que le deben sin ir a la corte. Carta de demanda profesional desde $99.', url: 'https://multiservicios360.net/demand-letter', locale: 'es_US' },
};

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'Carta de Demanda (Demand Letter)', description: 'Preparación de carta de demanda profesional para cobro de deudas, disputas contractuales, depósitos no devueltos y otros reclamos en California.', provider: { '@type': 'LegalService', name: 'Multi Servicios 360', url: 'https://multiservicios360.net', telephone: '+18552467274', areaServed: { '@type': 'State', name: 'California' }, availableLanguage: ['Spanish', 'English'] }, offers: { '@type': 'Offer', price: '99', priceCurrency: 'USD', availability: 'https://schema.org/InStock' }, serviceType: 'Legal Document Preparation', areaServed: { '@type': 'State', name: 'California' } };

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Necesito enviar una carta de demanda antes de ir a Small Claims Court?', acceptedAnswer: { '@type': 'Answer', text: 'En California, muchos casos de Small Claims Court requieren que primero intente resolver el asunto directamente. Una carta de demanda documenta ese intento.' } },
  { '@type': 'Question', name: '¿Cuánto tiempo tiene la otra persona para responder una carta de demanda?', acceptedAnswer: { '@type': 'Answer', text: 'El plazo típico es entre 10 y 30 días. Usted lo establece en la carta según la urgencia del caso.' } },
  { '@type': 'Question', name: '¿Necesito un abogado para enviar una carta de demanda?', acceptedAnswer: { '@type': 'Answer', text: 'No. Cualquier persona puede enviar una carta de demanda por sí misma. Multi Servicios 360 le ayuda a prepararla de forma profesional y con el lenguaje correcto.' } },
] };

const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://multiservicios360.net' }, { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://multiservicios360.net/mas-servicios' }, { '@type': 'ListItem', position: 3, name: 'Carta de Demanda', item: 'https://multiservicios360.net/demand-letter' } ] };

export default function Page() {
  return (
    <>
      <Script id="service-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SimpleDocChatWizard docType="demand_letter" />
    </>
  );
}
