import MoreServicesClient from '../../mas-servicios/MoreServicesClient';

export const metadata = {
  title: 'More Services | Multi Servicios 360',
  description: 'All our legal document preparation services. Affidavit, promissory note, bill of sale, temporary guardianship and more.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/more-services',
    languages: { 'en': 'https://multiservicios360.net/en/more-services', 'es': 'https://multiservicios360.net/mas-servicios', 'x-default': 'https://multiservicios360.net/mas-servicios' },
  },
  openGraph: {
    title: 'More Services | Multi Servicios 360',
    description: 'All our legal document preparation services in English and Spanish.',
    url: 'https://multiservicios360.net/en/more-services',
    locale: 'en_US',
  },
};

export default function MoreServicesPage() {
  return <MoreServicesClient lang="en" />;
}
