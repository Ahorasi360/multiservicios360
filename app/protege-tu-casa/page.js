export const metadata = {
  title: 'Protege Tu Casa con un Living Trust | Multi Servicios 360',
  description: 'Sin un Fideicomiso en Vida, su familia puede perder su casa en Probate — un proceso que cuesta $15,000-$30,000 y tarda 1 a 2 años. Protéjala hoy desde $599.',
  keywords: 'living trust california, fideicomiso en vida, proteger casa california, probate california, fideicomiso español',
  alternates: {
    canonical: 'https://multiservicios360.net/protege-tu-casa',
  },
  openGraph: {
    title: 'Protege Tu Casa con un Living Trust',
    description: 'Sin un fideicomiso, su familia puede perder su casa en Probate. Protéjala hoy desde $599.',
    url: 'https://multiservicios360.net/protege-tu-casa',
  },
};

import ProtegeClient from './ProtegeClient';
export default function ProtegeTuCasa() {
  return <ProtegeClient />;
}
