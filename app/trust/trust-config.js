// TRUST CONFIG - Tiers, upsells, styles, helpers

export const TIERS = [
  {
    value: 'trust_core',
    label_en: 'Trust Core (Self-Prepared)',
    label_es: 'Fideicomiso Básico (Autopreparado)',
    price: 599,
    desc_en: 'Essential trust with all required clauses. Declaration, trustee appointments, basic distributions, California-compliant. Platform access only — does not include legal services.',
    desc_es: 'Fideicomiso esencial con todas las cláusulas requeridas. Declaración, nombramientos, distribuciones básicas, conforme a California. Solo acceso a plataforma — no incluye servicios legales.'
  },
  {
    value: 'trust_plus',
    label_en: 'Trust Plus (Enhanced)',
    label_es: 'Fideicomiso Plus (Mejorado)',
    price: 899,
    desc_en: "Core + Optional clauses: Minor\'s trust, real property management, digital assets, per stirpes, mediation and more. Platform access only — does not include legal services.",
    desc_es: 'Básico + Cláusulas opcionales: Fideicomiso para menores, gestión de bienes raíces, activos digitales, por estirpe, mediación y más. Solo acceso a plataforma — no incluye servicios legales.',
    popular: true
  },
  {
    value: 'trust_elite',
    label_en: 'Trust Elite (Premium)',
    label_es: 'Fideicomiso Elite (Premium)',
    price: 1299,
    desc_en: 'Plus + Advanced clauses: Special needs provisions, incentive trusts, no-contest clause, arbitration, asset protection and full customization. Platform access only — does not include legal services.',
    desc_es: 'Plus + Cláusulas avanzadas: Provisiones para necesidades especiales, fideicomisos de incentivo, cláusula de no contestación, arbitraje, protección de activos y personalización completa. Solo acceso a plataforma — no incluye servicios legales.'
  },
  {
    value: 'trust_attorney',
    label_en: 'Attorney Review Coordination',
    label_es: 'Coordinación de Revisión con Abogado',
    price: 1599,
    desc_en: 'Platform fee to coordinate review by an independent licensed California attorney (subject to availability, 48-72 hrs). Attorney fees are NOT included — attorneys charge separately.',
    desc_es: 'Cargo de plataforma para coordinar revisión por un abogado independiente licenciado en California (sujeto a disponibilidad, 48-72 hrs). Los honorarios del abogado NO están incluidos — el abogado cobra por separado.',
    attorney_note_en: '* Attorney review is performed by an independent licensed attorney. Their fees are separate and not included in this platform price.',
    attorney_note_es: '* La revisión legal es realizada por un abogado independiente licenciado. Sus honorarios son separados y no están incluidos en el precio de la plataforma.'
  }
];

export const UPSELLS = [
  { id: 'vault', price: 99 },
  { id: 'vault_plus', price: 149 },
  { id: 'notary', price: 150 },
  { id: 'funding', price: 49 }
];

export const getUpsellLabel = (id, t) => {
  const map = { vault: t.upsellVault, vault_plus: t.upsellVaultPlus, notary: t.upsellNotary, funding: t.upsellFunding };
  return map[id] || id;
};

export const getUpsellDesc = (id, t) => {
  const map = { vault: t.upsellVaultDesc, vault_plus: t.upsellVaultPlusDesc, notary: t.upsellNotaryDesc, funding: t.upsellFundingDesc };
  return map[id] || '';
};

export const getUpsellPrice = (id, t) => {
  const map = { vault: t.upsellVaultPrice, vault_plus: t.upsellVaultPlusPrice, notary: t.upsellNotaryPrice, funding: t.upsellFundingPrice };
  return map[id] || `+$${UPSELLS.find(u => u.id === id)?.price || 0}`;
};

export const getUpsellBadge = (id, t) => {
  const map = { vault: t.upsellVaultSave, vault_plus: t.upsellVaultPlusSave, notary: t.upsellNotarySave, funding: t.upsellFundingSave };
  return map[id] || '';
};

export const calculateTotal = (reviewTier, selectedUpsells) => {
  const tierPrice = TIERS.find(x => x.value === reviewTier)?.price || 599;
  const upsellTotal = selectedUpsells.reduce((sum, id) => sum + (UPSELLS.find(u => u.id === id)?.price || 0), 0);
  return tierPrice + upsellTotal;
};

// INLINE STYLES (Tailwind unreliable on Vercel)
export const STYLES = {
  container: { minHeight: '100vh', backgroundColor: '#F5F3FF', padding: '24px' },
  inner: { maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { width: '48px', height: '48px', backgroundColor: '#7C3AED', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' },
  title: { fontSize: '24px', fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: '14px', color: '#6B7280' },
  langToggle: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', cursor: 'pointer' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  btnPrimary: { width: '100%', padding: '14px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  btnPurple: { backgroundColor: '#7C3AED', color: 'white' },
  btnDisabled: { backgroundColor: '#9CA3AF', cursor: 'not-allowed' },
  chatContainer: { height: '400px', overflowY: 'auto', marginBottom: '16px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' },
  msgUser: { backgroundColor: '#7C3AED', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', maxWidth: '80%', marginLeft: 'auto', marginBottom: '12px' },
  msgAssistant: { backgroundColor: 'white', color: '#1F2937', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', maxWidth: '80%', marginBottom: '12px', border: '1px solid #E5E7EB', whiteSpace: 'pre-wrap' },
  badge: { backgroundColor: '#EDE9FE', color: '#6D28D9', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  tierCard: { width: '100%', padding: '16px', border: '2px solid #E5E7EB', borderRadius: '12px', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left', marginBottom: '12px', position: 'relative', transition: 'all 0.2s' },
  tierCardSelected: { borderColor: '#7C3AED', backgroundColor: '#FAF5FF' },
  popularBadge: { position: 'absolute', top: '-10px', right: '16px', backgroundColor: '#F59E0B', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  upsellCard: { padding: '16px', border: '2px solid #E5E7EB', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', transition: 'all 0.2s' },
  upsellCardSelected: { borderColor: '#059669', backgroundColor: '#ECFDF5' },
  upsellHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  upsellBadge: { backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
  progressBar: { height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' },
  progressFill: { height: '100%', backgroundColor: '#7C3AED', borderRadius: '4px', transition: 'width 0.3s ease' },
  footer: { textAlign: 'center', padding: '16px', color: '#6B7280', fontSize: '12px' },
  warningBox: { padding: '12px 16px', backgroundColor: '#FEF3C7', borderRadius: '8px', border: '1px solid #F59E0B' },
  warningText: { fontSize: '12px', color: '#92400E', margin: 0, lineHeight: '1.5' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' },
  tabButton: { padding: '12px 20px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '600', marginBottom: '-2px' },
  tabActive: { color: '#7C3AED', borderBottom: '2px solid #7C3AED' },
  tabInactive: { color: '#6B7280', borderBottom: '2px solid transparent' },
};

// Icons as components
export const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);
