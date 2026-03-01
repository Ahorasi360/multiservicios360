import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';
import Script from 'next/script';

export const metadata = {
  title: 'Contrato para Contratista Independiente California (AB5) | Multi Servicios 360',
  description: 'Proteja su negocio con un contrato de contratista independiente que cumple con AB5 en California. Cláusulas de propiedad intelectual, pagos, y alcance. Desde $149.',
  keywords: 'contrato contratista independiente California, AB5 contrato, independent contractor agreement California, contrato 1099 California',
  alternates: { canonical: 'https://multiservicios360.net/contractor-agreement', languages: { 'es': 'https://multiservicios360.net/contractor-agreement', 'en': 'https://multiservicios360.net/en/contractor-agreement', 'x-default': 'https://multiservicios360.net/contractor-agreement' } },
  openGraph: { title: 'Contrato Contratista Independiente AB5 | Multi Servicios 360', description: 'Proteja su negocio con contrato que cumple AB5 California. Desde $149.', url: 'https://multiservicios360.net/contractor-agreement', locale: 'es_US' },
};

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'Contrato para Contratista Independiente (AB5 California)', description: 'Preparación de contrato de contratista independiente que cumple con AB5 y las leyes laborales de California. Incluye cláusulas de alcance, pago, propiedad intelectual y terminación.', provider: { '@type': 'LegalService', name: 'Multi Servicios 360', url: 'https://multiservicios360.net', telephone: '+18552467274', areaServed: { '@type': 'State', name: 'California' }, availableLanguage: ['Spanish', 'English'] }, offers: { '@type': 'Offer', price: '149', priceCurrency: 'USD', availability: 'https://schema.org/InStock' }, serviceType: 'Legal Document Preparation', areaServed: { '@type': 'State', name: 'California' } };

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Qué es AB5 y cómo afecta a los contratistas en California?', acceptedAnswer: { '@type': 'Answer', text: 'AB5 es una ley de California que establece el "test ABC" para determinar si una persona es contratista independiente o empleado. Un contrato por escrito es esencial para documentar correctamente la relación.' } },
  { '@type': 'Question', name: '¿Necesito un contrato por escrito para contratar a un freelancer?', acceptedAnswer: { '@type': 'Answer', text: 'No es obligatorio por ley, pero sí muy recomendable para montos sobre $500 o trabajos que generen propiedad intelectual. Sin contrato, tiene muy poca protección legal.' } },
  { '@type': 'Question', name: '¿El contrato de contratista lo protege de una auditoría de AB5?', acceptedAnswer: { '@type': 'Answer', text: 'Un contrato es evidencia importante, pero la clasificación correcta depende más de cómo funciona la relación en la práctica. El contrato documenta la intención.' } },
] };

const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://multiservicios360.net' }, { '@type': 'ListItem', position: 2, name: 'Negocios', item: 'https://multiservicios360.net/negocios' }, { '@type': 'ListItem', position: 3, name: 'Contrato Contratista Independiente', item: 'https://multiservicios360.net/contractor-agreement' } ] };

export default function Page() {
  return (
    <>
      <Script id="service-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SimpleDocChatWizard docType="contractor_agreement" />
    </>
  );
}
