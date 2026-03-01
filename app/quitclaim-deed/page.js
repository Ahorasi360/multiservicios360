import SimpleDocChatWizard from '../simple-doc/SimpleDocChatWizard';
import Script from 'next/script';

export const metadata = {
  title: 'Escritura de Traspaso (Quitclaim Deed) California | Multi Servicios 360',
  description: 'Transfiera propiedad a un familiar, ponga su casa en un fideicomiso o elimine a un ex del título. Quitclaim Deed en California desde $199.',
  keywords: 'quitclaim deed California, escritura de traspaso California, transferir propiedad familiar California, eliminar nombre escritura California',
  alternates: { canonical: 'https://multiservicios360.net/quitclaim-deed', languages: { 'es': 'https://multiservicios360.net/quitclaim-deed', 'en': 'https://multiservicios360.net/en/quitclaim-deed', 'x-default': 'https://multiservicios360.net/quitclaim-deed' } },
  openGraph: { title: 'Escritura de Traspaso (Quitclaim Deed) | Multi Servicios 360', description: 'Transfiera propiedad a familiar, fideicomiso o elimine nombre del título. Desde $199.', url: 'https://multiservicios360.net/quitclaim-deed', locale: 'es_US' },
};

const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'Escritura de Traspaso (Quitclaim Deed)', description: 'Preparación de Quitclaim Deed para transferir propiedad en California — a fideicomiso, familiar, o corrección de título.', provider: { '@type': 'LegalService', name: 'Multi Servicios 360', url: 'https://multiservicios360.net', telephone: '+18552467274', areaServed: { '@type': 'State', name: 'California' }, availableLanguage: ['Spanish', 'English'] }, offers: { '@type': 'Offer', price: '199', priceCurrency: 'USD', availability: 'https://schema.org/InStock' }, serviceType: 'Legal Document Preparation', areaServed: { '@type': 'State', name: 'California' } };

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: '¿Para qué sirve una Quitclaim Deed en California?', acceptedAnswer: { '@type': 'Answer', text: 'Una Quitclaim Deed transfiere el interés de propiedad de una persona a otra sin garantías de título. Es ideal para transferencias familiares, poner la casa en un fideicomiso, o eliminar/agregar cónyuge al título.' } },
  { '@type': 'Question', name: '¿Necesito un abogado para una Quitclaim Deed?', acceptedAnswer: { '@type': 'Answer', text: 'No es legalmente requerido. Sin embargo, para situaciones complejas como divorcios o propiedades con hipoteca, recomendamos consultar con un abogado de bienes raíces.' } },
  { '@type': 'Question', name: '¿La Quitclaim Deed elimina la hipoteca?', acceptedAnswer: { '@type': 'Answer', text: 'No. La hipoteca sigue siendo responsabilidad de quien la firmó. Transferir el título no elimina la deuda con el banco.' } },
  { '@type': 'Question', name: '¿Dónde se registra una Quitclaim Deed en California?', acceptedAnswer: { '@type': 'Answer', text: 'Se registra en la oficina del County Recorder del condado donde está ubicada la propiedad. La tarifa es aproximadamente $15-$25 por página.' } },
] };

const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://multiservicios360.net' }, { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://multiservicios360.net/mas-servicios' }, { '@type': 'ListItem', position: 3, name: 'Escritura de Traspaso (Quitclaim Deed)', item: 'https://multiservicios360.net/quitclaim-deed' } ] };

export default function Page() {
  return (
    <>
      <Script id="service-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SimpleDocChatWizard docType="quitclaim_deed" />
    </>
  );
}
