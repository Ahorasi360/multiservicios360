import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';
import Script from 'next/script';

export const metadata = {
  title: 'Declaración Jurada de Sucesión Simplificada §13100 | Multi Servicios 360',
  description: 'Reclame bienes de una herencia sin abrir probate. Para estates bajo $184,500 en California. Cumpla con el Código de Sucesiones §13100. Desde $149.',
  keywords: 'small estate affidavit California, declaración sucesión §13100, evitar probate California, herencia sin abogado California',
  alternates: {
    canonical: 'https://multiservicios360.net/small-estate-affidavit',
    languages: { 'es': 'https://multiservicios360.net/small-estate-affidavit', 'en': 'https://multiservicios360.net/en/small-estate-affidavit', 'x-default': 'https://multiservicios360.net/small-estate-affidavit' },
  },
  openGraph: { title: 'Declaración Jurada de Sucesión §13100 | Multi Servicios 360', description: 'Reclame bienes de herencia bajo $184,500 sin ir a la corte. Desde $149.', url: 'https://multiservicios360.net/small-estate-affidavit', locale: 'es_US' },
};

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'Declaración Jurada de Sucesión Simplificada §13100', description: 'Preparación de Declaración Jurada §13100 para reclamar bienes de herencia sin proceso de probate formal en California.', provider: { '@type': 'LegalService', name: 'Multi Servicios 360', url: 'https://multiservicios360.net', telephone: '+18552467274', areaServed: { '@type': 'State', name: 'California' }, availableLanguage: ['Spanish', 'English'] }, offers: { '@type': 'Offer', price: '149', priceCurrency: 'USD', availability: 'https://schema.org/InStock' }, serviceType: 'Legal Document Preparation', areaServed: { '@type': 'State', name: 'California' } };

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Cuánto puede valer la herencia para usar la Declaración §13100?', acceptedAnswer: { '@type': 'Answer', text: 'El valor total de los bienes debe ser menor a $184,500 en California. Este límite excluye bienes en fideicomiso o con beneficiario designado.' } },
  { '@type': 'Question', name: '¿Cuánto tiempo debo esperar para presentar la Declaración §13100?', acceptedAnswer: { '@type': 'Answer', text: 'Debe esperar al menos 40 días desde la fecha de defunción antes de presentar la Declaración §13100.' } },
  { '@type': 'Question', name: '¿Necesito un abogado para la Declaración de Sucesión §13100?', acceptedAnswer: { '@type': 'Answer', text: 'No es legalmente requerido. Multi Servicios 360 le ayuda a preparar el documento. Para situaciones complejas, recomendamos consultar con un abogado.' } },
  { '@type': 'Question', name: '¿La Declaración §13100 requiere notarización?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Debe firmarse ante un notario público de California. El formulario notarial está incluido en el PDF.' } },
] };

const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://multiservicios360.net' }, { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://multiservicios360.net/mas-servicios' }, { '@type': 'ListItem', position: 3, name: 'Declaración Jurada de Sucesión §13100', item: 'https://multiservicios360.net/small-estate-affidavit' } ] };

export default function Page() {
  return (
    <>
      <Script id="service-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SimpleDocChatWizard docType="small_estate_affidavit" />
    </>
  );
}
