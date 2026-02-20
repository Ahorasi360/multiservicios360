import HomeClient from './HomeClient';

export const metadata = {
  title: 'Multi Servicios 360 | Preparación de Documentos Legales Bilingüe en California',
  description: 'Plataforma bilingüe de preparación de documentos legales en California. Poder Notarial, Fideicomiso en Vida, Formación de LLC, Carta de Autorización de Viaje y más. 100% en español e inglés.',
  keywords: 'documentos legales, poder notarial, fideicomiso, LLC California, carta de autorización, bilingüe, español, preparación de documentos',
  alternates: {
    canonical: 'https://multiservicios360.net',
    languages: {
      'es': 'https://multiservicios360.net',
      'en': 'https://multiservicios360.net/en',
      'x-default': 'https://multiservicios360.net',
    },
  },
  openGraph: {
    title: 'Multi Servicios 360 | Documentos Legales para Usted, Su Familia y Negocio',
    description: 'Plataforma bilingüe de preparación de documentos legales en California.',
    url: 'https://multiservicios360.net',
    locale: 'es_US',
  },
};

export default function HomePage() {
  return <HomeClient lang="es" />;
}
