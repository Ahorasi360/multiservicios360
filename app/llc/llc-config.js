// LLC Configuration - Tiers, Upsells, Pricing per SOP

export const TIERS = [
  {
    value: 'llc_standard',
    label_en: 'LLC Standard',
    label_es: 'LLC Estándar',
    price: 799,
    desc_en: 'Simple LLC — 1-2 owners, equal ownership, self-guided.',
    desc_es: 'LLC simple — 1-2 dueños, participación igual, autoguiado.',
    features_en: [
      '1-2 owners with equal ownership',
      'Member-managed or single manager',
      'Articles of Organization (LLC-1)',
      'Operating Agreement',
      'EIN workflow guidance',
      'SOI support & reminders',
      'Entity Vault™ included'
    ],
    features_es: [
      '1-2 dueños con participación igual',
      'Administrado por miembros o un gerente',
      'Artículos de Organización (LLC-1)',
      'Acuerdo Operativo',
      'Guía para obtener EIN',
      'Soporte y recordatorios SOI',
      'Entity Vault™ incluido'
    ]
  },
  {
    value: 'llc_plus',
    label_en: 'LLC Plus',
    label_es: 'LLC Plus',
    price: 1199,
    popular: true,
    desc_en: 'Complex ownership & control handled correctly.',
    desc_es: 'Propiedad y control complejos manejados correctamente.',
    features_en: [
      'Everything in Standard, PLUS:',
      'Unequal profit/loss allocations',
      'Multi-manager governance',
      'Voting thresholds & transfer restrictions',
      'Deadlock prevention clauses',
      'Priority internal prep queue',
      'Human logic validation'
    ],
    features_es: [
      'Todo en Estándar, MÁS:',
      'Distribución desigual de ganancias/pérdidas',
      'Gobernanza multi-gerente',
      'Umbrales de votación y restricciones',
      'Cláusulas de prevención de empate',
      'Cola de preparación prioritaria',
      'Validación de lógica humana'
    ]
  },
  {
    value: 'llc_elite',
    label_en: 'LLC Elite',
    label_es: 'LLC Elite',
    price: 1699,
    desc_en: 'White-glove setup with attorney coordination.',
    desc_es: 'Configuración premium con coordinación de abogado.',
    features_en: [
      'Everything in Plus, PLUS:',
      'Priority intake + build',
      'White-glove validation checklist',
      'Attorney review coordination*',
      'One post-delivery revision window',
      'Priority support channel'
    ],
    features_es: [
      'Todo en Plus, MÁS:',
      'Admisión y preparación prioritaria',
      'Lista de validación premium',
      'Coordinación de revisión de abogado*',
      'Una revisión post-entrega',
      'Canal de soporte prioritario'
    ],
    attorney_note_en: '*Attorney review is performed by an independent licensed attorney. Attorney fees are not included in the platform price.',
    attorney_note_es: '*La revisión legal es realizada por un abogado independiente licenciado. Los honorarios del abogado no están incluidos en el precio de la plataforma.'
  }
];

export const ENTITY_VAULT = {
  id: 'entity_vault',
  price: 99,
  recurring: 'year',
  mandatory: true,
  desc_en: 'Secure document storage, SOI reminders, compliance tracking',
  desc_es: 'Almacenamiento seguro, recordatorios SOI, seguimiento de cumplimiento'
};

export const UPSELLS = [
  { id: 'rush_prep', price: 149 },
  { id: 'oa_amendment', price: 199 },
  { id: 'soi_amendment', price: 75 },
  { id: 'registered_agent', price: 199, recurring: 'year' },
  { id: 'certified_copy', price: 99 }
];

export const STATE_FEES = {
  standard: { sos_fee: 70 },
  expedite_24hr: { sos_fee: 350 },
  expedite_same_day: { sos_fee: 750 }
};

// Upsell label/desc/badge helpers (language-aware via translations)
export const getUpsellLabel = (id, t) => t.upsellLabels?.[id] || id;
export const getUpsellDesc = (id, t) => t.upsellDescs?.[id] || '';
export const getUpsellPrice = (id, t) => {
  const u = UPSELLS.find(x => x.id === id);
  if (!u) return '$0';
  return u.recurring ? `$${u.price}/${t.perYear || 'yr'}` : `$${u.price}`;
};
export const getUpsellBadge = (id, t) => t.upsellBadges?.[id] || null;

export const calculateTotal = (tierId, selectedUpsells = []) => {
  const tier = TIERS.find(x => x.value === tierId);
  if (!tier) return 0;
  let total = tier.price;
  total += ENTITY_VAULT.price; // mandatory
  selectedUpsells.forEach(uid => {
    const u = UPSELLS.find(x => x.id === uid);
    if (u) total += u.price;
  });
  return total;
};

export const getStateFee = (speed) => STATE_FEES[speed]?.sos_fee || 0;

// Tier detection logic
export const detectRequiredTier = (intakeData) => {
  if (intakeData.wants_attorney_review === true) return 'llc_elite';
  if (intakeData.has_investors === true) return 'llc_elite';
  if (intakeData.wants_white_glove === true) return 'llc_elite';
  if (intakeData.member_count > 2) return 'llc_plus';
  if (intakeData.equal_ownership === false) return 'llc_plus';
  if (intakeData.manager_count > 1) return 'llc_plus';
  if (intakeData.has_silent_partners === true) return 'llc_plus';
  if (intakeData.needs_transfer_restrictions === true) return 'llc_plus';
  if (intakeData.needs_removal_clauses === true) return 'llc_plus';
  if (intakeData.needs_custom_voting === true) return 'llc_plus';
  return 'llc_standard';
};

// ============================================
// STYLES — matches Trust wizard pattern (blue theme)
// ============================================
export const STYLES = {
  container: { minHeight: '100vh', backgroundColor: '#EFF6FF', padding: '24px' },
  inner: { maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { width: '48px', height: '48px', backgroundColor: '#1E3A8A', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' },
  title: { fontSize: '24px', fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: '14px', color: '#6B7280' },
  langToggle: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', cursor: 'pointer' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  input: { width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  btnPrimary: { width: '100%', padding: '14px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  btnBlue: { backgroundColor: '#1E3A8A', color: 'white' },
  btnDisabled: { backgroundColor: '#9CA3AF', cursor: 'not-allowed' },
  chatContainer: { height: '400px', overflowY: 'auto', marginBottom: '16px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' },
  msgUser: { backgroundColor: '#1E3A8A', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', maxWidth: '80%', marginLeft: 'auto', marginBottom: '12px' },
  msgAssistant: { backgroundColor: 'white', color: '#1F2937', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', maxWidth: '80%', marginBottom: '12px', border: '1px solid #E5E7EB', whiteSpace: 'pre-wrap' },
  badge: { backgroundColor: '#DBEAFE', color: '#1E3A8A', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  progressBar: { width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '9999px', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#1E3A8A', borderRadius: '9999px', transition: 'width 0.3s' },
  tabButton: { flex: 1, padding: '10px 12px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  tabActive: { color: '#1E3A8A', borderBottom: '2px solid #1E3A8A' },
  tabInactive: { color: '#6B7280', borderBottom: '2px solid transparent' },
  tierCard: { width: '100%', padding: '20px', border: '2px solid #E5E7EB', borderRadius: '12px', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left', marginBottom: '12px', position: 'relative' },
  tierCardSelected: { borderColor: '#1E3A8A', backgroundColor: '#EFF6FF' },
  popularBadge: { position: 'absolute', top: '-10px', right: '12px', backgroundColor: '#1E3A8A', color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' },
  warningBox: { backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', padding: '12px' },
  warningText: { fontSize: '12px', color: '#92400E', margin: 0 },
  upsellCard: { padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer' },
  upsellCardSelected: { borderColor: '#1E3A8A', backgroundColor: '#EFF6FF' },
  upsellHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  upsellBadge: { fontSize: '10px', color: '#1E3A8A', fontWeight: '600' },
  footer: { textAlign: 'center', padding: '24px', color: '#9CA3AF', fontSize: '12px', marginTop: '24px' }
};

// Icons
export const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

export const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

export const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);