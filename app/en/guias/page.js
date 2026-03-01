import Navbar from '../../components/Navbar';
import { GUIDES, getGuide } from '../../../lib/guides-config';
import GuiasGrid from '../../guias/GuiasGrid';

export const metadata = {
  title: 'Free Legal Document Guides | Multi Servicios 360',
  description: 'Download free bilingual guides on wills, trusts, corporate minutes, and more. Educational resources for the Latino community in California.',
  alternates: {
    canonical: 'https://multiservicios360.net/en/guias',
    languages: {
      'en': 'https://multiservicios360.net/en/guias',
      'es': 'https://multiservicios360.net/guias',
      'x-default': 'https://multiservicios360.net/en/guias',
    },
  },
  robots: { index: true, follow: true },
};

export default function GuidesPageEn() {
  const guides = Object.keys(GUIDES).map(slug => getGuide(slug, 'en'));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Navbar lang="en" currentPath="/en/guias" langSwitchUrl="/guias" />
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', padding: '56px 16px 64px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.05em' }}>
            FREE RESOURCES 2026
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'white', marginBottom: '12px', lineHeight: '1.2' }}>
            📚 Free Legal Document Guides
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', maxWidth: '560px', margin: '0 auto' }}>
            Bilingual educational resources to help the Latino community in California understand their legal options.
          </p>
        </div>
      </div>
      <GuiasGrid guides={guides} lang="en" />
    </div>
  );
}
