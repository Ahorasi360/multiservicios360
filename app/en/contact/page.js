import ContactClient from '../../contacto/ContactClient';

export const metadata = {
  title: 'Contact Us | Multi Servicios 360',
  description: 'Contact us for questions about legal document preparation. Bilingual service in English and Spanish.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/contact',
    languages: { 'en': 'https://multiservicios360.net/en/contact', 'es': 'https://multiservicios360.net/contacto', 'x-default': 'https://multiservicios360.net/contacto' },
  },
  openGraph: {
    title: 'Contact Us | Multi Servicios 360',
    description: 'Contact Multi Servicios 360 for bilingual legal document preparation.',
    url: 'https://multiservicios360.net/en/contact',
    locale: 'en_US',
  },
};

export default function ContactPage() {
  return <ContactClient lang="en" />;
}
