import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';
import Script from 'next/script';

export const metadata = {
  title: 'Solicitud de Apostilla California — Documentos para el Extranjero | Multi Servicios 360',
  description: 'Use sus documentos de EE.UU. en México, Guatemala, Colombia y más de 120 países. Prepare su solicitud de apostilla para el Secretario de Estado de California. Desde $79.',
  keywords: 'apostilla California, apostille California, documentos para Mexico, Secretary of State California apostilla, Convenio de La Haya California',
  alternates: { canonical: 'https://multiservicios360.net/apostille-letter', languages: { 'es': 'https://multiservicios360.net/apostille-letter', 'en': 'https://multiservicios360.net/en/apostille-letter', 'x-default': 'https://multiservicios360.net/apostille-letter' } },
  openGraph: { title: 'Solicitud de Apostilla California | Multi Servicios 360', description: 'Prepare su solicitud de apostilla para usar documentos en México, Guatemala, Colombia y más de 120 países. Desde $79.', url: 'https://multiservicios360.net/apostille-letter', locale: 'es_US' },
};

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'Solicitud de Apostilla — California Secretary of State', description: 'Preparación de carta de solicitud de apostilla para la Oficina del Secretario de Estado de California, para usar documentos en países del Convenio de La Haya.', provider: { '@type': 'LegalService', name: 'Multi Servicios 360', url: 'https://multiservicios360.net', telephone: '+18552467274', areaServed: { '@type': 'State', name: 'California' }, availableLanguage: ['Spanish', 'English'] }, offers: { '@type': 'Offer', price: '79', priceCurrency: 'USD', availability: 'https://schema.org/InStock' }, serviceType: 'Legal Document Preparation', areaServed: { '@type': 'State', name: 'California' } };

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Qué es una apostilla y para qué sirve?', acceptedAnswer: { '@type': 'Answer', text: 'Una apostilla es un certificado emitido por el Secretario de Estado de California que valida la autenticidad de un documento para uso en países del Convenio de La Haya (más de 120 países, incluyendo México, Guatemala, Colombia, y toda América Latina).' } },
  { '@type': 'Question', name: '¿Cuánto cuesta una apostilla en California?', acceptedAnswer: { '@type': 'Answer', text: 'La tarifa oficial del Secretario de Estado de California es $20 por apostilla. Multi Servicios 360 le ayuda a preparar la carta de solicitud por $79.' } },
  { '@type': 'Question', name: '¿Cuánto tiempo tarda la apostilla en California?', acceptedAnswer: { '@type': 'Answer', text: 'En persona (con cita): mismo día. Por correo: 5 a 15 días hábiles normalmente, puede variar según demanda.' } },
  { '@type': 'Question', name: '¿Un poder notarial de Multi Servicios 360 puede apostillarse?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Si su poder notarial fue notarizado por un notario público de California, puede solicitar apostilla al Secretario de Estado.' } },
] };

const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://multiservicios360.net' }, { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://multiservicios360.net/mas-servicios' }, { '@type': 'ListItem', position: 3, name: 'Solicitud de Apostilla', item: 'https://multiservicios360.net/apostille-letter' } ] };

export default function Page() {
  return (
    <>
      <Script id="service-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SimpleDocChatWizard docType="apostille_letter" />
    </>
  );
}
