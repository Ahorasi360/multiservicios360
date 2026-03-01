import Navbar from '../components/Navbar';
import { GUIDES, getGuide } from '../../lib/guides-config';
import GuiasGrid from './GuiasGrid';

export const metadata = {
  title: 'Guías Gratuitas de Documentos Legales | Multi Servicios 360',
  description: 'Descargue guías gratuitas en español sobre testamentos, fideicomiso, actas corporativas, y más. Recursos educativos para la comunidad latina en California.',
  alternates: {
    canonical: 'https://multiservicios360.net/guias',
    languages: {
      'es': 'https://multiservicios360.net/guias',
      'en': 'https://multiservicios360.net/en/guias',
      'x-default': 'https://multiservicios360.net/guias',
    },
  },
  robots: { index: true, follow: true },
};

export default function GuiasPage() {
  const guides = Object.keys(GUIDES).map(slug => getGuide(slug, 'es'));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Navbar lang="es" currentPath="/guias" langSwitchUrl="/en/guias" />
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', padding: '56px 16px 64px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.05em' }}>
            RECURSOS GRATUITOS 2026
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'white', marginBottom: '12px', lineHeight: '1.2' }}>
            📚 Guías Gratuitas de Documentos Legales
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', maxWidth: '560px', margin: '0 auto' }}>
            Recursos educativos en español para ayudar a la comunidad latina en California a entender sus opciones legales.
          </p>
        </div>
      </div>
      <GuiasGrid guides={guides} lang="es" />
    </div>
  );
}
