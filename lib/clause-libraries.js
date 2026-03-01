// ═══════════════════════════════════════════════════════════════════
// MULTI SERVICIOS 360 — CALIFORNIA LEGAL DOCUMENT CLAUSE LIBRARIES
// ═══════════════════════════════════════════════════════════════════
// All documents comply with California law.
// Clauses are deterministic — no AI interpretation, no invented language.
// Each clause has a unique ID, English text, and Spanish text.
// Phase 1 = Required (always included)
// Phase 2 = Optional (toggled by user input)
// ═══════════════════════════════════════════════════════════════════

import { numberToWords } from './number-to-words';

// Helper: format currency with spelled-out amount
export function formatCurrencyFull(amount, lang = 'en') {
  const num = parseFloat(amount) || 0;
  const dollars = Math.floor(num);
  const cents = Math.round((num - dollars) * 100);
  const spelled = numberToWords(dollars);
  if (lang === 'es') {
    return cents > 0
      ? `${spelled} Dólares con ${cents}/100 ($${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
      : `${spelled} Dólares ($${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
  }
  return cents > 0
    ? `${spelled} Dollars and ${cents}/100 ($${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
    : `${spelled} Dollars ($${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
}

// Helper: format date nicely
export function formatDateLong(dateStr, lang = 'en') {
  if (!dateStr) return '________________________';
  // Handle both MM/DD/YYYY and YYYY-MM-DD
  let parts;
  if (dateStr.includes('/')) {
    parts = dateStr.split('/');
    if (parts.length === 3) {
      let [mo, dy, yr] = parts;
      // Handle 2-digit years: 00-30 → 2000s, 31-99 → 1900s
      if (yr.length <= 2) {
        const yrNum = parseInt(yr);
        yr = yrNum <= 30 ? `20${yr.padStart(2, '0')}` : `19${yr.padStart(2, '0')}`;
      }
      const d = new Date(parseInt(yr), parseInt(mo) - 1, parseInt(dy));
      if (lang === 'es') {
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return `${parseInt(dy)} de ${meses[d.getMonth()]} de ${yr}`;
      }
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }
  return dateStr;
}

// Helper: format phone number
// Input: any string of digits, optionally with +country code
// Output: (310) 555-1234 for US, +52 (55) 1234-5678 for international
export function formatPhone(raw) {
  if (!raw) return '___';
  const cleaned = raw.replace(/[^\d+]/g, '');
  // If starts with + or 011, treat as international — return as-is but cleaned
  if (cleaned.startsWith('+') || cleaned.startsWith('011')) {
    return raw.trim();
  }
  // Strip leading 1 for US
  const digits = cleaned.replace(/^1/, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  // If 7 digits (no area code)
  if (digits.length === 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  // Return original if can't parse
  return raw.trim();
}

// Helper: translate relationship - handles free text in either language
export function translateRelationship(input, lang = 'en') {
  if (!input) return '___';
  const raw = input.trim().toLowerCase();

  // Comprehensive bilingual map — matches common free-text inputs
  const map = [
    // Father / Padre — must be first to avoid partial match conflicts
    { terms: ['padre', 'papa', 'papá', 'papi', 'es el papa', 'es el papá', 'es el padre', 'es padre', 'es papá', 'father', 'dad', 'daddy', 'el papa', 'el papá', 'el padre'], en: 'Father', es: 'Padre' },
    // Mother / Madre
    { terms: ['madre', 'mama', 'mamá', 'mami', 'es la mama', 'es la mamá', 'es la madre', 'es madre', 'es mamá', 'mother', 'mom', 'mommy', 'la mama', 'la mamá', 'la madre'], en: 'Mother', es: 'Madre' },
    // Parent (generic)
    { terms: ['parent', 'progenitor', 'progenitora'], en: 'Parent', es: 'Progenitor' },
    { terms: ['tio', 'tía', 'tia', 'uncle', 'aunt', 'uncle/aunt', 'tío/tía', 'tio/tia'], en: 'Uncle/Aunt', es: 'Tío/Tía' },
    { terms: ['tio', 'uncle'], en: 'Uncle', es: 'Tío' },
    { terms: ['tia', 'tía', 'aunt'], en: 'Aunt', es: 'Tía' },
    { terms: ['abuelo', 'abuela', 'abuelo/abuela', 'grandparent', 'grandfather', 'grandmother', 'grandpa', 'grandma', 'abuelito', 'abuelita'], en: 'Grandparent', es: 'Abuelo/Abuela' },
    { terms: ['abuelo', 'grandfather', 'grandpa', 'abuelito'], en: 'Grandfather', es: 'Abuelo' },
    { terms: ['abuela', 'grandmother', 'grandma', 'abuelita'], en: 'Grandmother', es: 'Abuela' },
    { terms: ['padrino', 'madrina', 'padrino/madrina', 'godparent', 'godfather', 'godmother'], en: 'Godparent', es: 'Padrino/Madrina' },
    { terms: ['padrino', 'godfather'], en: 'Godfather', es: 'Padrino' },
    { terms: ['madrina', 'godmother'], en: 'Godmother', es: 'Madrina' },
    { terms: ['hermano', 'hermana', 'hermano/hermana', 'sibling', 'brother', 'sister'], en: 'Sibling', es: 'Hermano/Hermana' },
    { terms: ['hermano', 'brother'], en: 'Brother', es: 'Hermano' },
    { terms: ['hermana', 'sister'], en: 'Sister', es: 'Hermana' },
    { terms: ['primo', 'prima', 'primo/prima', 'cousin'], en: 'Cousin', es: 'Primo/Prima' },
    { terms: ['primo', 'cousin'], en: 'Cousin', es: 'Primo' },
    { terms: ['prima'], en: 'Cousin', es: 'Prima' },
    { terms: ['padrastro', 'madrastra', 'stepfather', 'stepmother', 'stepparent', 'step-father', 'step-mother', 'step father', 'step mother'], en: 'Stepparent', es: 'Padrastro/Madrastra' },
    { terms: ['padrastro', 'stepfather', 'step-father', 'step father'], en: 'Stepfather', es: 'Padrastro' },
    { terms: ['madrastra', 'stepmother', 'step-mother', 'step mother'], en: 'Stepmother', es: 'Madrastra' },
    { terms: ['amigo', 'amiga', 'amigo de la familia', 'amiga de la familia', 'family friend', 'friend', 'close friend', 'amigo cercano', 'amiga cercana'], en: 'Family Friend', es: 'Amigo(a) de la Familia' },
    { terms: ['vecino', 'vecina', 'neighbor', 'neighbour'], en: 'Neighbor', es: 'Vecino/Vecina' },
    { terms: ['esposo', 'esposa', 'husband', 'wife', 'spouse', 'conyuge', 'cónyuge'], en: 'Spouse', es: 'Cónyuge' },
    { terms: ['cuñado', 'cunado', 'cuñada', 'cunada', 'brother-in-law', 'sister-in-law', 'brother in law', 'sister in law'], en: 'Brother/Sister-in-Law', es: 'Cuñado/Cuñada' },
    { terms: ['suegro', 'suegra', 'father-in-law', 'mother-in-law', 'father in law', 'mother in law'], en: 'Parent-in-Law', es: 'Suegro/Suegra' },
    { terms: ['sobrino', 'sobrina', 'nephew', 'niece'], en: 'Nephew/Niece', es: 'Sobrino/Sobrina' },
    { terms: ['tutor', 'tutor legal', 'legal guardian', 'guardian'], en: 'Legal Guardian', es: 'Tutor Legal' },
    { terms: ['pastor', 'pastora', 'minister', 'clergy'], en: 'Minister/Clergy', es: 'Pastor/Pastora' },
    { terms: ['otro', 'otra', 'other'], en: 'Other', es: 'Otro' },
  ];

  // Exact match first (most specific)
  for (const entry of map) {
    if (entry.terms.includes(raw)) return entry[lang] || entry.en;
  }
  // Partial match (contains)
  for (const entry of map) {
    if (entry.terms.some(t => raw.includes(t) || t.includes(raw))) return entry[lang] || entry.en;
  }
  // No match — capitalize first letter and return as-is
  return input.charAt(0).toUpperCase() + input.slice(1);
}

// ═══════════════════════════════════════════════════════════════════
// 1. BILL OF SALE — CALIFORNIA
// ═══════════════════════════════════════════════════════════════════
// Governs: California Commercial Code, Vehicle Code §5900 et seq.
// ═══════════════════════════════════════════════════════════════════

export function buildBillOfSale(d, lang, executionDate) {
  const sections = [];
  const _ = (en, es) => lang === 'es' ? es : en;

  const condLabels = {
    new: _('New', 'Nuevo'),
    used_good: _('Used — Good Condition', 'Usado — Buena Condición'),
    used_fair: _('Used — Fair Condition', 'Usado — Condición Regular'),
    as_is: _('As-Is — No Warranty', 'Como Está — Sin Garantía'),
  };
  const saleTypeLabels = {
    vehicle: _('Motor Vehicle', 'Vehículo Automotor'),
    equipment: _('Equipment', 'Equipo'),
    personal_property: _('Personal Property', 'Propiedad Personal'),
    other: _('Other Property', 'Otra Propiedad'),
  };
  const payMethodLabels = {
    cash: _('Cash', 'Efectivo'),
    check: _('Check', 'Cheque'),
    bank_transfer: _('Bank Transfer / Wire', 'Transferencia Bancaria'),
    other: _('Other', 'Otro'),
  };

  const isVehicle = d.sale_type === 'vehicle';
  const isAsIs = d.item_condition === 'as_is';
  const condText = condLabels[d.item_condition] || d.item_condition || '';
  const saleTypeText = saleTypeLabels[d.sale_type] || d.sale_type || '';
  const payMethodText = payMethodLabels[d.payment_method] || d.payment_method || '';
  const dateFormatted = formatDateLong(d.sale_date || executionDate, lang);
  const priceFormatted = formatCurrencyFull(d.sale_price, lang);

  // ── BOS_001: PREAMBLE ──
  sections.push({
    id: 'BOS_001', type: 'paragraph',
    text: _(
      `For good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, ${d.seller_name || '___'} ("Seller"), residing at ${d.seller_address || '___'}, does hereby sell, transfer, convey, and deliver to ${d.buyer_name || '___'} ("Buyer"), residing at ${d.buyer_address || '___'}, the personal property described below, free and clear of all liens, encumbrances, and claims of third parties, except as otherwise stated herein.`,
      `Por buena y valiosa consideración, cuyo recibo y suficiencia se reconocen por la presente, ${d.seller_name || '___'} ("Vendedor"), con domicilio en ${d.seller_address || '___'}, por la presente vende, transfiere, cede y entrega a ${d.buyer_name || '___'} ("Comprador"), con domicilio en ${d.buyer_address || '___'}, la propiedad personal descrita a continuación, libre de todo gravamen, carga y reclamo de terceros, salvo lo expresamente indicado en este documento.`
    ),
  });

  // ── BOS_002: DESCRIPTION OF PROPERTY ──
  sections.push({
    id: 'BOS_002', type: 'section',
    title: _('DESCRIPTION OF PROPERTY', 'DESCRIPCIÓN DE LA PROPIEDAD'),
    fields: [
      { label: _('Type of Property', 'Tipo de Propiedad'), value: saleTypeText },
      { label: _('Description', 'Descripción'), value: d.item_description || '___' },
      { label: _('Condition', 'Condición'), value: condText },
    ],
  });

  // ── BOS_003: VEHICLE INFORMATION (conditional) ──
  if (isVehicle) {
    const vFields = [
      { label: _('Vehicle Description', 'Descripción del Vehículo'), value: d.item_description || '___' },
    ];
    if (d.vin_number) vFields.push({ label: _('Vehicle Identification Number (VIN)', 'Número de Identificación del Vehículo (VIN)'), value: d.vin_number });
    if (d.odometer_reading) vFields.push({ label: _('Odometer Reading', 'Lectura del Odómetro'), value: `${d.odometer_reading} ${_('miles', 'millas')}` });

    sections.push({
      id: 'BOS_003', type: 'section',
      title: _('VEHICLE INFORMATION', 'INFORMACIÓN DEL VEHÍCULO'),
      fields: vFields,
    });

    // ── BOS_003A: ODOMETER DISCLOSURE ──
    sections.push({
      id: 'BOS_003A', type: 'paragraph',
      bold: true,
      text: _('ODOMETER DISCLOSURE STATEMENT', 'DECLARACIÓN DE DIVULGACIÓN DEL ODÓMETRO'),
    });
    sections.push({
      id: 'BOS_003B', type: 'paragraph',
      text: _(
        `Seller certifies that the odometer reading of ${d.odometer_reading || '___'} miles reflects the actual mileage of the vehicle, unless otherwise indicated. This disclosure is made pursuant to federal and California law, including 49 U.S.C. §32705 and California Vehicle Code §5900 et seq.`,
        `El Vendedor certifica que la lectura del odómetro de ${d.odometer_reading || '___'} millas refleja el millaje real del vehículo, a menos que se indique lo contrario. Esta divulgación se realiza conforme a la ley federal y de California, incluyendo 49 U.S.C. §32705 y el Código de Vehículos de California §5900 y siguientes.`
      ),
    });

    // ── BOS_003C: SMOG/EMISSIONS (CA-specific) ──
    sections.push({
      id: 'BOS_003C', type: 'paragraph',
      text: _(
        'Seller represents that the vehicle has passed a California smog inspection within the time required by law, or that the vehicle is exempt from smog inspection requirements under California Health and Safety Code §44000 et seq. Seller shall provide the Buyer with a valid smog certificate at the time of transfer, unless exempt.',
        'El Vendedor declara que el vehículo ha pasado una inspección de smog de California dentro del tiempo requerido por la ley, o que el vehículo está exento de los requisitos de inspección de smog bajo el Código de Salud y Seguridad de California §44000 y siguientes. El Vendedor proporcionará al Comprador un certificado de smog válido al momento de la transferencia, a menos que esté exento.'
      ),
    });
  }

  // ── BOS_004: SALE PRICE AND CONSIDERATION ──
  sections.push({
    id: 'BOS_004', type: 'section',
    title: _('SALE PRICE AND CONSIDERATION', 'PRECIO DE VENTA Y CONSIDERACIÓN'),
    fields: [
      { label: _('Sale Price', 'Precio de Venta'), value: priceFormatted },
      { label: _('Method of Payment', 'Método de Pago'), value: payMethodText },
      { label: _('Date of Sale', 'Fecha de Venta'), value: dateFormatted },
    ],
  });

  // ── BOS_005: TRANSFER OF TITLE ──
  sections.push({
    id: 'BOS_005', type: 'section',
    title: _('TRANSFER OF TITLE', 'TRANSFERENCIA DE TÍTULO'),
    text: _(
      'Seller hereby transfers and conveys all right, title, and interest in the above-described property to Buyer. Upon execution of this Bill of Sale and receipt of the stated consideration, Buyer shall be the sole and lawful owner of the property.',
      'El Vendedor por la presente transfiere y cede todo derecho, título e interés en la propiedad descrita anteriormente al Comprador. Al momento de la ejecución de esta Carta de Venta y recibo de la consideración establecida, el Comprador será el único y legítimo propietario de la propiedad.'
    ),
  });

  // ── BOS_006: WARRANTIES AND REPRESENTATIONS ──
  sections.push({
    id: 'BOS_006', type: 'section',
    title: _('WARRANTIES AND REPRESENTATIONS', 'GARANTÍAS Y REPRESENTACIONES'),
    text: isAsIs
      ? _(
        `Seller sells the above-described property "AS-IS" and "WHERE-IS," without any warranty of any kind, express or implied, including but not limited to any implied warranty of merchantability or fitness for a particular purpose. Buyer acknowledges that Buyer has inspected the property, is satisfied with its condition, and accepts the property in its present state. Buyer assumes all risk as to the quality and condition of the property.`,
        `El Vendedor vende la propiedad descrita anteriormente "COMO ESTÁ" y "DONDE ESTÁ," sin garantía de ningún tipo, expresa o implícita, incluyendo pero no limitada a cualquier garantía implícita de comerciabilidad o idoneidad para un propósito particular. El Comprador reconoce que ha inspeccionado la propiedad, está satisfecho con su condición, y acepta la propiedad en su estado actual. El Comprador asume todo riesgo respecto a la calidad y condición de la propiedad.`
      )
      : _(
        `Seller represents and warrants that: (a) Seller is the lawful owner of the property and has the full right and authority to sell it; (b) the property is free and clear of all liens, security interests, encumbrances, and claims of third parties; (c) the property is in "${condText}" condition as described herein; and (d) Seller will defend Buyer's title against all claims and demands.`,
        `El Vendedor declara y garantiza que: (a) el Vendedor es el propietario legítimo de la propiedad y tiene el pleno derecho y autoridad para venderla; (b) la propiedad está libre de todo gravamen, intereses de seguridad, cargas y reclamos de terceros; (c) la propiedad está en condición "${condText}" como se describe en este documento; y (d) el Vendedor defenderá el título del Comprador contra todos los reclamos y demandas.`
      ),
  });

  // ── BOS_007: INDEMNIFICATION ──
  sections.push({
    id: 'BOS_007', type: 'section',
    title: _('INDEMNIFICATION', 'INDEMNIZACIÓN'),
    text: _(
      'Seller shall indemnify, defend, and hold harmless Buyer from and against any and all claims, losses, damages, liabilities, and expenses (including reasonable attorney fees) arising from any breach of the representations and warranties made herein or from any undisclosed lien, encumbrance, or claim against the property.',
      'El Vendedor indemnizará, defenderá y mantendrá indemne al Comprador de todos y cada uno de los reclamos, pérdidas, daños, responsabilidades y gastos (incluyendo honorarios razonables de abogados) que surjan de cualquier incumplimiento de las representaciones y garantías aquí establecidas o de cualquier gravamen, carga o reclamo no divulgado contra la propiedad.'
    ),
  });

  // ── BOS_008: RISK OF LOSS ──
  sections.push({
    id: 'BOS_008', type: 'section',
    title: _('RISK OF LOSS', 'RIESGO DE PÉRDIDA'),
    text: _(
      'Risk of loss or damage to the property shall pass from Seller to Buyer upon delivery of the property and execution of this Bill of Sale.',
      'El riesgo de pérdida o daño a la propiedad pasará del Vendedor al Comprador al momento de la entrega de la propiedad y ejecución de esta Carta de Venta.'
    ),
  });

  // ── BOS_009: ADDITIONAL TERMS (conditional) ──
  if (d.additional_terms) {
    sections.push({
      id: 'BOS_009', type: 'section',
      title: _('ADDITIONAL TERMS', 'TÉRMINOS ADICIONALES'),
      text: d.additional_terms,
    });
  }

  // ── BOS_010: GOVERNING LAW ──
  sections.push({
    id: 'BOS_010', type: 'section',
    title: _('GOVERNING LAW', 'LEY APLICABLE'),
    text: _(
      'This Bill of Sale shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law principles.',
      'Esta Carta de Venta se regirá e interpretará de acuerdo con las leyes del Estado de California, sin consideración a los principios de conflicto de leyes.'
    ),
  });

  // ── BOS_011: SEVERABILITY ──
  sections.push({
    id: 'BOS_011', type: 'section',
    title: _('SEVERABILITY', 'DIVISIBILIDAD'),
    text: _(
      'If any provision of this Bill of Sale is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.',
      'Si alguna disposición de esta Carta de Venta se considera inválida o inaplicable, las disposiciones restantes continuarán en pleno vigor y efecto.'
    ),
  });

  // ── BOS_012: INTEGRATION ──
  sections.push({
    id: 'BOS_012', type: 'section',
    title: _('ENTIRE AGREEMENT', 'ACUERDO COMPLETO'),
    text: _(
      'This Bill of Sale constitutes the entire agreement between the parties concerning the sale of the described property and supersedes all prior negotiations, representations, warranties, and agreements between the parties. This agreement may not be modified except by a written instrument signed by both parties.',
      'Esta Carta de Venta constituye el acuerdo completo entre las partes con respecto a la venta de la propiedad descrita y reemplaza todas las negociaciones, representaciones, garantías y acuerdos previos entre las partes. Este acuerdo no puede ser modificado excepto por un instrumento escrito firmado por ambas partes.'
    ),
  });

  // ── BOS_013: EXECUTION ──
  sections.push({
    id: 'BOS_013', type: 'section',
    title: _('EXECUTION', 'EJECUCIÓN'),
    text: _(
      `IN WITNESS WHEREOF, the parties have executed this Bill of Sale on ${formatDateLong(executionDate, lang)}, in the State of California.`,
      `EN FE DE LO CUAL, las partes han ejecutado esta Carta de Venta en la fecha ${formatDateLong(executionDate, lang)}, en el Estado de California.`
    ),
  });

  // ── BOS_014: SIGNATURES ──
  sections.push({
    id: 'BOS_014', type: 'signatures',
    blocks: [
      { label: _('Seller Signature', 'Firma del Vendedor'), name: d.seller_name || '' },
      { label: _('Buyer Signature', 'Firma del Comprador'), name: d.buyer_name || '' },
    ],
  });

  return sections;
}


// ═══════════════════════════════════════════════════════════════════
// 2. AFFIDAVIT — CALIFORNIA
// ═══════════════════════════════════════════════════════════════════
// Governs: California Code of Civil Procedure §2015.5
// ═══════════════════════════════════════════════════════════════════

export function buildAffidavit(d, lang, executionDate) {
  const sections = [];
  const _ = (en, es) => lang === 'es' ? es : en;

  const purposeLabels = {
    identity: _('Identity Verification', 'Verificación de Identidad'),
    residency: _('Proof of Residency', 'Prueba de Residencia'),
    relationship: _('Family Relationship Verification', 'Verificación de Relación Familiar'),
    financial: _('Financial Declaration', 'Declaración Financiera'),
    name_change: _('Name Change Declaration', 'Declaración de Cambio de Nombre'),
    other: _('General Declaration', 'Declaración General'),
  };
  const purposeText = purposeLabels[d.purpose] || d.purpose || '';

  // ── AFF_001: VENUE ──
  sections.push({
    id: 'AFF_001', type: 'venue',
    state: _('STATE OF CALIFORNIA', 'ESTADO DE CALIFORNIA'),
    county: d.county || '________________________',
  });

  // ── AFF_002: AFFIANT IDENTITY ──
  sections.push({
    id: 'AFF_002', type: 'paragraph',
    text: _(
      `I, ${d.affiant_name || '___'}, being of legal age and residing at ${d.affiant_address || '___'}, do hereby make the following declaration under penalty of perjury under the laws of the State of California pursuant to Code of Civil Procedure Section 2015.5:`,
      `Yo, ${d.affiant_name || '___'}, siendo mayor de edad y con domicilio en ${d.affiant_address || '___'}, por la presente hago la siguiente declaración bajo pena de perjurio conforme a las leyes del Estado de California de acuerdo con la Sección 2015.5 del Código de Procedimiento Civil:`
    ),
  });

  // ── AFF_003: PERSONAL KNOWLEDGE ──
  sections.push({
    id: 'AFF_003', type: 'section',
    title: _('BASIS OF KNOWLEDGE', 'BASE DEL CONOCIMIENTO'),
    text: _(
      'I have personal knowledge of the facts set forth in this Affidavit and, if called as a witness, could and would competently testify thereto.',
      'Tengo conocimiento personal de los hechos establecidos en esta Declaración Jurada y, si fuera llamado como testigo, podría y estaría dispuesto a testificar competentemente al respecto.'
    ),
  });

  // ── AFF_004: PURPOSE ──
  sections.push({
    id: 'AFF_004', type: 'section',
    title: _('PURPOSE OF AFFIDAVIT', 'PROPÓSITO DE LA DECLARACIÓN JURADA'),
    fields: [
      { label: _('Purpose', 'Propósito'), value: purposeText + (d.purpose_detail ? ` — ${d.purpose_detail}` : '') },
    ],
  });

  // ── AFF_005: STATEMENT OF FACTS ──
  sections.push({
    id: 'AFF_005', type: 'section',
    title: _('STATEMENT OF FACTS', 'DECLARACIÓN DE HECHOS'),
    text: d.statement_of_facts || '___',
  });

  // ── AFF_006: SUPPORTING DOCUMENTS (conditional) ──
  if (d.supporting_docs) {
    sections.push({
      id: 'AFF_006', type: 'section',
      title: _('SUPPORTING DOCUMENTATION', 'DOCUMENTACIÓN DE APOYO'),
      text: _(
        `The following documents are available to support the statements made herein: ${d.supporting_docs}`,
        `Los siguientes documentos están disponibles para respaldar las declaraciones hechas en este documento: ${d.supporting_docs}`
      ),
    });
  }

  // ── AFF_007: OATH (CCP §2015.5) ──
  sections.push({
    id: 'AFF_007', type: 'section',
    title: _('DECLARATION UNDER PENALTY OF PERJURY', 'DECLARACIÓN BAJO PENA DE PERJURIO'),
    text: _(
      `I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct to the best of my knowledge and belief. Executed on ${formatDateLong(d.statement_date || executionDate, lang)}, at ${d.county || '___'} County, California.`,
      `Declaro bajo pena de perjurio conforme a las leyes del Estado de California que lo anterior es verdadero y correcto según mi mejor conocimiento y creencia. Ejecutado el ${formatDateLong(d.statement_date || executionDate, lang)}, en el Condado de ${d.county || '___'}, California.`
    ),
  });

  // ── AFF_008: AFFIANT SIGNATURE ──
  sections.push({
    id: 'AFF_008', type: 'signatures',
    blocks: [
      { label: _('Affiant Signature', 'Firma del Declarante'), name: d.affiant_name || '' },
    ],
  });

  // ── AFF_009: JURAT ──
  sections.push({
    id: 'AFF_009', type: 'jurat',
    title: _('JURAT', 'JURAT'),
    text: _(
      'A notary public or other officer completing this certificate verifies only the identity of the individual who signed the document to which this certificate is attached, and not the truthfulness, accuracy, or validity of that document.',
      'Un notario público u otro funcionario que completa este certificado verifica únicamente la identidad de la persona que firmó el documento al cual se adjunta este certificado, y no la veracidad, exactitud o validez de dicho documento.'
    ),
    state: _('State of California', 'Estado de California'),
    county: d.county || '___',
    body: _(
      `Subscribed and sworn to (or affirmed) before me on this _______ day of _________________, 20_____, by ${d.affiant_name || '________________________'}, proved to me on the basis of satisfactory evidence to be the person(s) who appeared before me.`,
      `Suscrito y juramentado (o afirmado) ante mí en este día _______ de _________________, 20_____, por ${d.affiant_name || '________________________'}, identificado ante mí con base en evidencia satisfactoria de ser la persona que compareció ante mí.`
    ),
  });

  return sections;
}


// ═══════════════════════════════════════════════════════════════════
// 3. REVOCATION OF POWER OF ATTORNEY — CALIFORNIA
// ═══════════════════════════════════════════════════════════════════
// Governs: California Probate Code §4151, Civil Code §2356
// ═══════════════════════════════════════════════════════════════════

export function buildRevocationPOA(d, lang, executionDate) {
  const sections = [];
  const _ = (en, es) => lang === 'es' ? es : en;

  const poaTypeLabels = {
    general: _('General Power of Attorney', 'Poder Notarial General'),
    limited: _('Limited (Special) Power of Attorney', 'Poder Notarial Limitado (Especial)'),
    durable: _('Durable Power of Attorney', 'Poder Notarial Duradero'),
    healthcare: _('Advance Health Care Directive / Healthcare Power of Attorney', 'Directiva Anticipada de Salud / Poder Notarial de Salud'),
  };
  const poaTypeText = poaTypeLabels[d.poa_type] || d.poa_type || '___';
  const isPartial = d.revocation_scope === 'partial';

  // ── REV_001: PREAMBLE ──
  sections.push({
    id: 'REV_001', type: 'paragraph',
    text: _(
      `I, ${d.principal_name || '___'}, residing at ${d.principal_address || '___'}, being of sound mind, do hereby execute this Revocation of Power of Attorney pursuant to California Probate Code Section 4151 and California Civil Code Section 2356.`,
      `Yo, ${d.principal_name || '___'}, con domicilio en ${d.principal_address || '___'}, en pleno uso de mis facultades mentales, por la presente ejecuto esta Revocación de Poder Notarial conforme a la Sección 4151 del Código de Sucesiones de California y la Sección 2356 del Código Civil de California.`
    ),
  });

  // ── REV_002: IDENTIFICATION OF ORIGINAL POA ──
  sections.push({
    id: 'REV_002', type: 'section',
    title: _('IDENTIFICATION OF ORIGINAL POWER OF ATTORNEY', 'IDENTIFICACIÓN DEL PODER NOTARIAL ORIGINAL'),
    fields: [
      { label: _('Type of Power of Attorney', 'Tipo de Poder Notarial'), value: poaTypeText },
      { label: _('Date of Original Power of Attorney', 'Fecha del Poder Notarial Original'), value: formatDateLong(d.original_poa_date, lang) },
      { label: _('Agent (Attorney-in-Fact)', 'Apoderado (Agente)'), value: d.agent_name || '___' },
    ],
  });
  if (d.agent_address) {
    sections[sections.length - 1].fields.push({ label: _('Agent Address', 'Dirección del Agente'), value: d.agent_address });
  }

  // ── REV_003: REVOCATION DECLARATION ──
  if (isPartial && d.partial_scope_detail) {
    sections.push({
      id: 'REV_003', type: 'section',
      title: _('PARTIAL REVOCATION', 'REVOCACIÓN PARCIAL'),
      text: _(
        `I hereby revoke the following specific powers granted in the above-referenced Power of Attorney, effective as of ${formatDateLong(d.revocation_date || executionDate, lang)}:\n\n${d.partial_scope_detail}\n\nAll other powers granted in the original Power of Attorney that are not specifically revoked herein shall remain in full force and effect.`,
        `Por la presente revoco los siguientes poderes específicos otorgados en el Poder Notarial antes referido, con efecto a partir del ${formatDateLong(d.revocation_date || executionDate, lang)}:\n\n${d.partial_scope_detail}\n\nTodos los demás poderes otorgados en el Poder Notarial original que no sean específicamente revocados en este documento permanecerán en pleno vigor y efecto.`
      ),
    });
  } else {
    sections.push({
      id: 'REV_003', type: 'section',
      title: _('FULL REVOCATION', 'REVOCACIÓN TOTAL'),
      text: _(
        `I hereby fully and unconditionally revoke, rescind, and terminate the above-referenced Power of Attorney in its entirety, effective as of ${formatDateLong(d.revocation_date || executionDate, lang)}. The agent named therein, ${d.agent_name || '___'}, no longer has any authority whatsoever to act on my behalf under said Power of Attorney.`,
        `Por la presente revoco total e incondicionalmente, rescindo y termino el Poder Notarial antes referido en su totalidad, con efecto a partir del ${formatDateLong(d.revocation_date || executionDate, lang)}. El agente nombrado en dicho poder, ${d.agent_name || '___'}, ya no tiene autoridad alguna para actuar en mi nombre bajo dicho Poder Notarial.`
      ),
    });
  }

  // ── REV_004: AGENT NOTIFICATION ──
  sections.push({
    id: 'REV_004', type: 'section',
    title: _('NOTICE TO AGENT', 'NOTIFICACIÓN AL AGENTE'),
    text: _(
      `I direct that a copy of this Revocation be delivered to ${d.agent_name || '___'} at ${d.agent_address || 'the agent\'s last known address'}. Upon receipt of this Revocation, the agent must immediately cease all activities undertaken on my behalf and return any documents, property, or funds held under the authority of the revoked Power of Attorney.`,
      `Ordeno que se entregue una copia de esta Revocación a ${d.agent_name || '___'} en ${d.agent_address || 'la última dirección conocida del agente'}. Al recibir esta Revocación, el agente debe cesar inmediatamente todas las actividades realizadas en mi nombre y devolver cualquier documento, propiedad o fondos en su posesión bajo la autoridad del Poder Notarial revocado.`
    ),
  });

  // ── REV_005: THIRD-PARTY NOTIFICATION ──
  sections.push({
    id: 'REV_005', type: 'section',
    title: _('NOTICE TO THIRD PARTIES', 'NOTIFICACIÓN A TERCEROS'),
    text: _(
      `I direct that notice of this Revocation be given to all banks, financial institutions, government agencies, and any other third parties that may have received a copy of the original Power of Attorney or that have acted in reliance upon it. Any person or institution that has received actual notice of this Revocation shall not honor any action taken by the former agent under the revoked Power of Attorney.`,
      `Ordeno que se notifique de esta Revocación a todos los bancos, instituciones financieras, agencias gubernamentales y cualquier otro tercero que pueda haber recibido una copia del Poder Notarial original o que haya actuado en base al mismo. Cualquier persona o institución que haya recibido notificación efectiva de esta Revocación no deberá honrar ninguna acción tomada por el ex agente bajo el Poder Notarial revocado.`
    ),
  });

  // ── REV_005A: SPECIFIC INSTITUTIONS (conditional) ──
  if (d.notify_institutions) {
    sections.push({
      id: 'REV_005A', type: 'section',
      title: _('INSTITUTIONS TO BE NOTIFIED', 'INSTITUCIONES A NOTIFICAR'),
      text: d.notify_institutions,
    });
  }

  // ── REV_006: REASON (conditional) ──
  if (d.reason) {
    sections.push({
      id: 'REV_006', type: 'section',
      title: _('REASON FOR REVOCATION', 'RAZÓN DE LA REVOCACIÓN'),
      text: d.reason,
    });
  }

  // ── REV_007: GOVERNING LAW ──
  sections.push({
    id: 'REV_007', type: 'section',
    title: _('GOVERNING LAW', 'LEY APLICABLE'),
    text: _(
      'This Revocation shall be governed by and construed in accordance with the laws of the State of California, including California Probate Code Division 4.5 and California Civil Code Section 2356.',
      'Esta Revocación se regirá e interpretará de acuerdo con las leyes del Estado de California, incluyendo la División 4.5 del Código de Sucesiones de California y la Sección 2356 del Código Civil de California.'
    ),
  });

  // ── REV_008: SEVERABILITY ──
  sections.push({
    id: 'REV_008', type: 'section',
    title: _('SEVERABILITY', 'DIVISIBILIDAD'),
    text: _(
      'If any provision of this Revocation is held to be invalid or unenforceable, such invalidity shall not affect the remaining provisions, which shall remain in full force and effect.',
      'Si alguna disposición de esta Revocación se considera inválida o inaplicable, dicha invalidez no afectará las disposiciones restantes, las cuales permanecerán en pleno vigor y efecto.'
    ),
  });

  // ── REV_009: EXECUTION ──
  sections.push({
    id: 'REV_009', type: 'section',
    title: _('EXECUTION', 'EJECUCIÓN'),
    text: _(
      `IN WITNESS WHEREOF, I have executed this Revocation of Power of Attorney on ${formatDateLong(executionDate, lang)}, in the State of California, freely and voluntarily.`,
      `EN FE DE LO CUAL, he ejecutado esta Revocación de Poder Notarial en la fecha ${formatDateLong(executionDate, lang)}, en el Estado de California, libre y voluntariamente.`
    ),
  });

  // ── REV_010: SIGNATURES ──
  sections.push({
    id: 'REV_010', type: 'signatures',
    blocks: [
      { label: _('Principal Signature', 'Firma del Poderdante'), name: d.principal_name || '' },
    ],
  });

  return sections;
}


// ═══════════════════════════════════════════════════════════════════
// 4. AUTHORIZATION LETTER — CALIFORNIA
// ═══════════════════════════════════════════════════════════════════

export function buildAuthorizationLetter(d, lang, executionDate) {
  const sections = [];
  const _ = (en, es) => lang === 'es' ? es : en;

  const idTypeLabels = {
    drivers_license: _("Driver's License", 'Licencia de Conducir'),
    state_id: _('State ID', 'Identificación Estatal'),
    passport: _('Passport', 'Pasaporte'),
    other: _('Other Government ID', 'Otra Identificación Gubernamental'),
  };

  // ── AUTH_001: PREAMBLE ──
  sections.push({
    id: 'AUTH_001', type: 'paragraph',
    text: _(
      `I, ${d.authorizer_name || '___'}, residing at ${d.authorizer_address || '___'}${d.authorizer_phone ? `, telephone: ${d.authorizer_phone}` : ''}, do hereby authorize the person named below to act on my behalf as specified in this letter.`,
      `Yo, ${d.authorizer_name || '___'}, con domicilio en ${d.authorizer_address || '___'}${d.authorizer_phone ? `, teléfono: ${d.authorizer_phone}` : ''}, por la presente autorizo a la persona nombrada a continuación para actuar en mi nombre según lo especificado en esta carta.`
    ),
  });

  // ── AUTH_002: AUTHORIZED PERSON ──
  const authFields = [
    { label: _('Authorized Person', 'Persona Autorizada'), value: d.authorized_name || '___' },
    { label: _('Relationship', 'Relación'), value: d.authorized_relationship || '___' },
  ];
  if (d.authorizer_id_type) {
    authFields.push({ label: _('Authorizer ID Type', 'Tipo de Identificación del Autorizante'), value: idTypeLabels[d.authorizer_id_type] || d.authorizer_id_type });
  }
  sections.push({
    id: 'AUTH_002', type: 'section',
    title: _('AUTHORIZED PERSON', 'PERSONA AUTORIZADA'),
    fields: authFields,
  });

  // ── AUTH_003: INSTITUTION (conditional) ──
  if (d.institution_name) {
    sections.push({
      id: 'AUTH_003', type: 'paragraph',
      text: _(
        `This authorization is directed to: ${d.institution_name}`,
        `Esta autorización está dirigida a: ${d.institution_name}`
      ),
    });
  }

  // ── AUTH_004: SCOPE OF AUTHORIZATION ──
  sections.push({
    id: 'AUTH_004', type: 'section',
    title: _('SCOPE AND PURPOSE OF AUTHORIZATION', 'ALCANCE Y PROPÓSITO DE LA AUTORIZACIÓN'),
    text: d.purpose || '___',
  });

  // ── AUTH_005: DURATION ──
  sections.push({
    id: 'AUTH_005', type: 'section',
    title: _('DURATION', 'DURACIÓN'),
    fields: [
      { label: _('Effective Date', 'Fecha de Inicio'), value: formatDateLong(d.start_date, lang) },
      { label: _('Expiration Date', 'Fecha de Vencimiento'), value: formatDateLong(d.end_date, lang) },
    ],
    text: _(
      'This authorization shall automatically expire on the expiration date stated above, unless revoked earlier in writing by the authorizer.',
      'Esta autorización expirará automáticamente en la fecha de vencimiento indicada anteriormente, a menos que sea revocada antes por escrito por el autorizante.'
    ),
  });

  // ── AUTH_006: LIMITATIONS ──
  sections.push({
    id: 'AUTH_006', type: 'section',
    title: _('LIMITATIONS', 'LIMITACIONES'),
    text: _(
      'The authorized person shall act only within the scope described above and shall not exceed the authority granted herein. The authorized person may not delegate this authority to any other person without express written consent.',
      'La persona autorizada actuará únicamente dentro del alcance descrito anteriormente y no excederá la autoridad aquí otorgada. La persona autorizada no podrá delegar esta autoridad a ninguna otra persona sin consentimiento expreso por escrito.'
    ),
  });

  // ── AUTH_006A: SPECIAL INSTRUCTIONS (conditional) ──
  if (d.special_instructions) {
    sections.push({
      id: 'AUTH_006A', type: 'section',
      title: _('SPECIAL INSTRUCTIONS AND RESTRICTIONS', 'INSTRUCCIONES ESPECIALES Y RESTRICCIONES'),
      text: d.special_instructions,
    });
  }

  // ── AUTH_007: REVOCATION ──
  sections.push({
    id: 'AUTH_007', type: 'section',
    title: _('REVOCATION', 'REVOCACIÓN'),
    text: _(
      'This authorization may be revoked at any time by written notice to the authorized person and to any institution or third party that has received a copy of this letter. Revocation shall be effective upon receipt of such notice.',
      'Esta autorización puede ser revocada en cualquier momento mediante notificación escrita a la persona autorizada y a cualquier institución o tercero que haya recibido una copia de esta carta. La revocación será efectiva al recibir dicha notificación.'
    ),
  });

  // ── AUTH_008: IDENTITY VERIFICATION ──
  sections.push({
    id: 'AUTH_008', type: 'section',
    title: _('IDENTITY VERIFICATION', 'VERIFICACIÓN DE IDENTIDAD'),
    text: _(
      'Any person or institution relying on this authorization may require the authorized person to present valid government-issued photo identification before acting on this letter.',
      'Cualquier persona o institución que confíe en esta autorización puede requerir que la persona autorizada presente una identificación con fotografía válida emitida por el gobierno antes de actuar conforme a esta carta.'
    ),
  });

  // ── AUTH_009: INDEMNIFICATION ──
  sections.push({
    id: 'AUTH_009', type: 'section',
    title: _('INDEMNIFICATION', 'INDEMNIZACIÓN'),
    text: _(
      'I agree to indemnify and hold harmless any person or institution that acts in good faith reliance upon this authorization.',
      'Acepto indemnizar y mantener indemne a cualquier persona o institución que actúe de buena fe confiando en esta autorización.'
    ),
  });

  // ── AUTH_010: GOVERNING LAW ──
  sections.push({
    id: 'AUTH_010', type: 'section',
    title: _('GOVERNING LAW', 'LEY APLICABLE'),
    text: _(
      'This Authorization Letter shall be governed by the laws of the State of California.',
      'Esta Carta de Autorización se regirá por las leyes del Estado de California.'
    ),
  });

  // ── AUTH_011: EXECUTION ──
  sections.push({
    id: 'AUTH_011', type: 'section',
    title: _('EXECUTION', 'EJECUCIÓN'),
    text: _(
      `IN WITNESS WHEREOF, I have executed this Authorization Letter on ${formatDateLong(executionDate, lang)}, in the State of California.`,
      `EN FE DE LO CUAL, he ejecutado esta Carta de Autorización en la fecha ${formatDateLong(executionDate, lang)}, en el Estado de California.`
    ),
  });

  // ── AUTH_012: SIGNATURES ──
  sections.push({
    id: 'AUTH_012', type: 'signatures',
    blocks: [
      { label: _('Authorizer Signature', 'Firma del Autorizante'), name: d.authorizer_name || '' },
    ],
  });

  return sections;
}


// ═══════════════════════════════════════════════════════════════════
// 5. PROMISSORY NOTE — CALIFORNIA
// ═══════════════════════════════════════════════════════════════════
// Governs: California contract law, Civil Code §1717, usury limits
// Full clause library per Anthony's research
// ═══════════════════════════════════════════════════════════════════

export function buildPromissoryNote(d, lang, executionDate) {
  const sections = [];
  const _ = (en, es) => lang === 'es' ? es : en;

  const payTypeLabels = {
    lump_sum: _('Lump Sum at Maturity', 'Pago Único al Vencimiento'),
    monthly: _('Monthly Installments', 'Pagos Mensuales'),
    weekly: _('Weekly Installments', 'Pagos Semanales'),
    bi_weekly: _('Bi-Weekly Installments', 'Pagos Quincenales'),
  };
  const payTypeText = payTypeLabels[d.payment_type] || d.payment_type || '';
  const principalFormatted = formatCurrencyFull(d.loan_amount, lang);
  const isInstallment = d.payment_type && d.payment_type !== 'lump_sum';
  const graceDays = d.late_grace_days || 10;
  const cureDays = d.cure_period_days || 10;

  // ── PN_001: TITLE ──
  // (handled by header)

  // ── PN_002: DATE ──
  sections.push({
    id: 'PN_002', type: 'field_inline',
    label: _('Date', 'Fecha'),
    value: formatDateLong(d.start_date || executionDate, lang),
  });

  // ── PN_003: PRINCIPAL ──
  sections.push({
    id: 'PN_003', type: 'field_inline',
    label: _('Principal Amount', 'Monto del Principal'),
    value: principalFormatted,
  });

  // ── PN_004: PARTIES ──
  sections.push({
    id: 'PN_004', type: 'paragraph',
    text: _(
      `FOR VALUE RECEIVED, ${d.borrower_name || '___'} ("Borrower"), residing at ${d.borrower_address || '___'}, promises to pay to the order of ${d.lender_name || '___'} ("Lender"), residing at ${d.lender_address || '___'}, the principal sum of ${principalFormatted}, together with interest as stated herein.`,
      `POR VALOR RECIBIDO, ${d.borrower_name || '___'} ("Prestatario"), con domicilio en ${d.borrower_address || '___'}, promete pagar a la orden de ${d.lender_name || '___'} ("Prestamista"), con domicilio en ${d.lender_address || '___'}, la suma principal de ${principalFormatted}, junto con los intereses aquí estipulados.`
    ),
  });

  // ── PN_005: INTEREST ──
  sections.push({
    id: 'PN_005', type: 'section',
    title: _('INTEREST', 'INTERESES'),
    text: parseFloat(d.interest_rate) > 0
      ? _(
        `The unpaid principal balance shall bear interest at a fixed annual rate of ${d.interest_rate}%, calculated on a simple interest basis using a 365-day year.`,
        `El saldo principal pendiente devengará intereses a una tasa anual fija del ${d.interest_rate}%, calculados sobre una base de interés simple utilizando un año de 365 días.`
      )
      : _(
        'This Note shall not bear interest. No interest shall accrue on the unpaid principal balance.',
        'Este Pagaré no devengará intereses. No se acumularán intereses sobre el saldo principal pendiente.'
      ),
  });

  // ── PN_006: PAYMENT SCHEDULE ──
  if (isInstallment) {
    sections.push({
      id: 'PN_006', type: 'section',
      title: _('PAYMENT TERMS', 'TÉRMINOS DE PAGO'),
      text: _(
        `Borrower shall repay the loan in ${payTypeText.toLowerCase()} installments of $${d.payment_amount || '___'} each, beginning on ${formatDateLong(d.start_date, lang)} and continuing on the ${d.payment_due_day || '___'} day of each applicable period until the principal and all accrued interest are paid in full.`,
        `El Prestatario pagará el préstamo en cuotas ${payTypeText.toLowerCase()} de $${d.payment_amount || '___'} cada una, comenzando el ${formatDateLong(d.start_date, lang)} y continuando el día ${d.payment_due_day || '___'} de cada período aplicable hasta que el principal y todos los intereses acumulados sean pagados en su totalidad.`
      ),
    });
  } else {
    sections.push({
      id: 'PN_006', type: 'section',
      title: _('PAYMENT TERMS', 'TÉRMINOS DE PAGO'),
      text: _(
        `The entire principal balance, together with all accrued and unpaid interest, shall be due and payable in a single lump sum on the maturity date.`,
        `Todo el saldo principal, junto con todos los intereses acumulados e impagos, será pagadero en un solo pago al vencimiento.`
      ),
    });
  }

  // ── PN_007: PAYMENT APPLICATION ──
  sections.push({
    id: 'PN_007', type: 'section',
    title: _('APPLICATION OF PAYMENTS', 'APLICACIÓN DE PAGOS'),
    text: _(
      'All payments shall be applied first to accrued interest, then to outstanding principal, and then to any fees or charges owed.',
      'Todos los pagos se aplicarán primero a los intereses acumulados, luego al principal pendiente, y después a cualquier cargo o comisión adeudada.'
    ),
  });

  // ── PN_008: BALLOON PAYMENT ──
  sections.push({
    id: 'PN_008', type: 'section',
    title: _('MATURITY / BALLOON PAYMENT', 'VENCIMIENTO / PAGO GLOBAL'),
    text: _(
      `Regardless of the payment schedule above, all remaining unpaid principal and accrued interest shall be due and payable in full on the maturity date of ${formatDateLong(d.maturity_date, lang)} ("Maturity Date").`,
      `Independientemente del calendario de pagos anterior, todo el principal pendiente e intereses acumulados serán pagaderos en su totalidad en la fecha de vencimiento del ${formatDateLong(d.maturity_date, lang)} ("Fecha de Vencimiento").`
    ),
  });

  // ── PN_009: LATE FEE ──
  if (d.late_fee) {
    sections.push({
      id: 'PN_009', type: 'section',
      title: _('LATE FEE', 'CARGO POR PAGO TARDÍO'),
      text: _(
        `If any payment is not received within ${graceDays} days of its due date, Borrower shall pay a late fee of $${d.late_fee}. This late fee is intended as a reasonable estimate of the administrative costs incurred by Lender due to late payment and shall not be construed as a penalty.`,
        `Si cualquier pago no es recibido dentro de ${graceDays} días de su fecha de vencimiento, el Prestatario pagará un cargo por mora de $${d.late_fee}. Este cargo por mora pretende ser una estimación razonable de los costos administrativos incurridos por el Prestamista debido al pago tardío y no será interpretado como una penalidad.`
      ),
    });
  }

  // ── PN_010: PREPAYMENT ──
  sections.push({
    id: 'PN_010', type: 'section',
    title: _('PREPAYMENT', 'PREPAGO'),
    text: _(
      'Borrower may prepay all or any part of the outstanding principal balance at any time without penalty or premium.',
      'El Prestatario puede prepagar todo o parte del saldo principal pendiente en cualquier momento sin penalidad ni prima.'
    ),
  });

  // ── PN_011: DEFAULT ──
  sections.push({
    id: 'PN_011', type: 'section',
    title: _('DEFAULT', 'INCUMPLIMIENTO'),
    text: _(
      'Borrower shall be in default if: (a) any payment is not made when due; (b) Borrower breaches any term of this Note; (c) Borrower becomes insolvent or files for bankruptcy; or (d) any representation made by Borrower proves to be materially false.',
      'El Prestatario estará en incumplimiento si: (a) cualquier pago no es realizado cuando sea debido; (b) el Prestatario incumple cualquier término de este Pagaré; (c) el Prestatario se declara insolvente o solicita bancarrota; o (d) cualquier declaración hecha por el Prestatario resulta ser materialmente falsa.'
    ),
  });

  // ── PN_012: ACCELERATION ──
  sections.push({
    id: 'PN_012', type: 'section',
    title: _('ACCELERATION', 'ACELERACIÓN'),
    text: _(
      `Upon default and after ${cureDays} days' written notice to Borrower providing an opportunity to cure, Lender may declare the entire unpaid principal balance, together with all accrued interest and fees, immediately due and payable without further notice or demand.`,
      `En caso de incumplimiento y después de ${cureDays} días de notificación escrita al Prestatario proporcionando la oportunidad de subsanar, el Prestamista podrá declarar todo el saldo principal pendiente, junto con todos los intereses y cargos acumulados, inmediatamente exigible sin más aviso o demanda.`
    ),
  });

  // ── PN_104: DEFAULT INTEREST RATE (conditional) ──
  if (d.default_interest_rate && parseFloat(d.default_interest_rate) > 0) {
    sections.push({
      id: 'PN_104', type: 'section',
      title: _('DEFAULT INTEREST RATE', 'TASA DE INTERÉS POR INCUMPLIMIENTO'),
      text: _(
        `Upon default, the interest rate on the outstanding balance shall increase to ${d.default_interest_rate}% per annum until the default is cured or the Note is paid in full.`,
        `En caso de incumplimiento, la tasa de interés sobre el saldo pendiente aumentará al ${d.default_interest_rate}% anual hasta que el incumplimiento sea subsanado o el Pagaré sea pagado en su totalidad.`
      ),
    });
  }

  // ── PN_013: ATTORNEY FEES (RECIPROCAL — CC §1717) ──
  sections.push({
    id: 'PN_013', type: 'section',
    title: _('ATTORNEY FEES', 'HONORARIOS DE ABOGADOS'),
    text: _(
      'In any action or proceeding to enforce or interpret any provision of this Note, the prevailing party shall be entitled to recover reasonable attorney fees and costs from the non-prevailing party, pursuant to California Civil Code Section 1717.',
      'En cualquier acción o procedimiento para hacer cumplir o interpretar cualquier disposición de este Pagaré, la parte vencedora tendrá derecho a recuperar honorarios razonables de abogados y costos de la parte no vencedora, conforme a la Sección 1717 del Código Civil de California.'
    ),
  });

  // ── PN_014: WAIVERS ──
  sections.push({
    id: 'PN_014', type: 'section',
    title: _('WAIVERS', 'RENUNCIAS'),
    text: _(
      'Borrower hereby waives presentment, demand for payment, protest, notice of dishonor, and notice of acceleration to the fullest extent permitted by law.',
      'El Prestatario por la presente renuncia a la presentación, demanda de pago, protesto, aviso de deshonra y aviso de aceleración en la medida máxima permitida por la ley.'
    ),
  });

  // ── PN_015: ASSIGNMENT ──
  sections.push({
    id: 'PN_015', type: 'section',
    title: _('ASSIGNMENT', 'CESIÓN'),
    text: _(
      "Lender may assign, transfer, or negotiate this Note without Borrower's consent. Borrower may not assign any obligations under this Note without the prior written consent of Lender.",
      'El Prestamista puede ceder, transferir o negociar este Pagaré sin el consentimiento del Prestatario. El Prestatario no puede ceder ninguna obligación bajo este Pagaré sin el consentimiento previo por escrito del Prestamista.'
    ),
  });

  // ── PN_101: SECURED NOTE (conditional) ──
  if (d.is_secured === 'yes' && d.security_description) {
    sections.push({
      id: 'PN_101', type: 'section',
      title: _('SECURITY', 'GARANTÍA'),
      text: _(
        `This Note is secured by the following collateral: ${d.security_description}. Borrower grants Lender a security interest in said collateral. Upon default, Lender may exercise all rights and remedies available under the California Commercial Code and applicable law.`,
        `Este Pagaré está garantizado por el siguiente colateral: ${d.security_description}. El Prestatario otorga al Prestamista un interés de seguridad en dicho colateral. En caso de incumplimiento, el Prestamista podrá ejercer todos los derechos y recursos disponibles bajo el Código Comercial de California y la ley aplicable.`
      ),
    });
  }

  // ── PN_103: GUARANTY (conditional) ──
  if (d.has_guarantor === 'yes' && d.guarantor_name) {
    sections.push({
      id: 'PN_103', type: 'section',
      title: _('PERSONAL GUARANTY', 'GARANTÍA PERSONAL'),
      text: _(
        `The obligations of the Borrower under this Note are personally and unconditionally guaranteed by ${d.guarantor_name}${d.guarantor_address ? `, residing at ${d.guarantor_address}` : ''}. The Guarantor agrees to be jointly and severally liable for all amounts due under this Note.`,
        `Las obligaciones del Prestatario bajo este Pagaré son garantizadas personal e incondicionalmente por ${d.guarantor_name}${d.guarantor_address ? `, con domicilio en ${d.guarantor_address}` : ''}. El Garante acepta ser solidariamente responsable de todas las cantidades adeudadas bajo este Pagaré.`
      ),
    });
  }

  // ── PN_016: GOVERNING LAW ──
  sections.push({
    id: 'PN_016', type: 'section',
    title: _('GOVERNING LAW', 'LEY APLICABLE'),
    text: _(
      'This Note shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law principles.',
      'Este Pagaré se regirá e interpretará de acuerdo con las leyes del Estado de California, sin consideración a los principios de conflicto de leyes.'
    ),
  });

  // ── PN_017: VENUE ──
  sections.push({
    id: 'PN_017', type: 'section',
    title: _('VENUE', 'JURISDICCIÓN'),
    text: _(
      "Any action or proceeding arising out of this Note shall be brought in the courts of the county in which Lender resides at the time such action is commenced, unless otherwise required by law.",
      'Cualquier acción o procedimiento que surja de este Pagaré se presentará en los tribunales del condado donde resida el Prestamista al momento de iniciar dicha acción, a menos que la ley requiera lo contrario.'
    ),
  });

  // ── PN_108: USURY SAVINGS ──
  sections.push({
    id: 'PN_108', type: 'section',
    title: _('USURY SAVINGS CLAUSE', 'CLÁUSULA DE PROTECCIÓN CONTRA USURA'),
    text: _(
      'Notwithstanding any provision of this Note, in no event shall the interest rate charged hereunder exceed the maximum rate permitted by applicable California law. If any interest charged is determined to exceed such maximum rate, the excess shall be applied to reduce the principal balance or refunded to Borrower.',
      'Sin perjuicio de cualquier disposición de este Pagaré, en ningún caso la tasa de interés cobrada excederá la tasa máxima permitida por la ley aplicable de California. Si se determina que algún interés cobrado excede dicha tasa máxima, el exceso se aplicará para reducir el saldo principal o será reembolsado al Prestatario.'
    ),
  });

  // ── PN_018: SEVERABILITY ──
  sections.push({
    id: 'PN_018', type: 'section',
    title: _('SEVERABILITY', 'DIVISIBILIDAD'),
    text: _(
      'If any provision of this Note is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.',
      'Si alguna disposición de este Pagaré se considera inválida, ilegal o inaplicable, las disposiciones restantes continuarán en pleno vigor y efecto.'
    ),
  });

  // ── PN_019: INTEGRATION ──
  sections.push({
    id: 'PN_019', type: 'section',
    title: _('ENTIRE AGREEMENT', 'ACUERDO COMPLETO'),
    text: _(
      'This Note constitutes the entire agreement between the parties regarding the loan described herein and supersedes all prior negotiations, agreements, and understandings. This Note may only be modified by a written instrument signed by both parties.',
      'Este Pagaré constituye el acuerdo completo entre las partes con respecto al préstamo aquí descrito y reemplaza todas las negociaciones, acuerdos y entendimientos previos. Este Pagaré solo puede ser modificado por un instrumento escrito firmado por ambas partes.'
    ),
  });

  // ── PN_109: SUCCESSORS ──
  sections.push({
    id: 'PN_109', type: 'section',
    title: _('SUCCESSORS AND ASSIGNS', 'SUCESORES Y CESIONARIOS'),
    text: _(
      'This Note shall be binding upon and inure to the benefit of the heirs, executors, administrators, successors, and assigns of the parties.',
      'Este Pagaré será vinculante y redundará en beneficio de los herederos, ejecutores, administradores, sucesores y cesionarios de las partes.'
    ),
  });

  // ── PN_112: NO WAIVER ──
  sections.push({
    id: 'PN_112', type: 'section',
    title: _('NO WAIVER', 'NO RENUNCIA'),
    text: _(
      "The failure of Lender to exercise any right or remedy under this Note shall not constitute a waiver of such right or remedy. No waiver shall be effective unless in writing and signed by Lender.",
      'La falta del Prestamista en ejercer cualquier derecho o recurso bajo este Pagaré no constituirá una renuncia a dicho derecho o recurso. Ninguna renuncia será efectiva a menos que sea por escrito y firmada por el Prestamista.'
    ),
  });

  // ── ADDITIONAL TERMS (conditional) ──
  if (d.additional_terms) {
    sections.push({
      id: 'PN_ADD', type: 'section',
      title: _('ADDITIONAL TERMS', 'TÉRMINOS ADICIONALES'),
      text: d.additional_terms,
    });
  }

  // ── PN_020: EXECUTION ──
  sections.push({
    id: 'PN_020', type: 'section',
    title: _('EXECUTION', 'EJECUCIÓN'),
    text: _(
      `IN WITNESS WHEREOF, the parties have executed this Promissory Note on ${formatDateLong(executionDate, lang)}, in the State of California.`,
      `EN FE DE LO CUAL, las partes han ejecutado este Pagaré en la fecha ${formatDateLong(executionDate, lang)}, en el Estado de California.`
    ),
  });

  // ── PN_020: SIGNATURES ──
  const sigBlocks = [
    { label: _('Borrower Signature', 'Firma del Prestatario'), name: d.borrower_name || '' },
    { label: _('Lender Signature', 'Firma del Prestamista'), name: d.lender_name || '' },
  ];
  if (d.has_guarantor === 'yes' && d.guarantor_name) {
    sigBlocks.push({ label: _('Guarantor Signature', 'Firma del Garante'), name: d.guarantor_name });
  }
  sections.push({
    id: 'PN_SIG', type: 'signatures',
    blocks: sigBlocks,
  });

  return sections;
}


// ═══════════════════════════════════════════════════════════════════
// 6. GUARDIANSHIP DESIGNATION — CALIFORNIA (PREMIUM)
// ═══════════════════════════════════════════════════════════════════
// Governs: California Probate Code §2105, Family Code §3040
// Premium multi-article format with Roman numeral articles
// ═══════════════════════════════════════════════════════════════════

export function buildGuardianshipDesignation(d, lang, executionDate) {
  const sections = [];
  const _ = (en, es) => lang === 'es' ? es : en;

  // ── Derived Values ──
  const p1 = d.parent1_name || '___';
  const p1Addr = d.parent1_address || '___';
  const p1Phone = formatPhone(d.parent1_phone);
  const p1DOB = d.parent1_dob ? formatDateLong(d.parent1_dob, lang) : '';
  const hasTwoParents = !!d.parent2_name;
  const p2 = d.parent2_name || '';
  const p2Addr = d.parent2_address || p1Addr;
  const p2Phone = formatPhone(d.parent2_phone);
  const p2DOB = d.parent2_dob ? formatDateLong(d.parent2_dob, lang) : '';

  const iWe = hasTwoParents ? _('We', 'Nosotros') : _('I', 'Yo');
  const myOur = hasTwoParents ? _('our', 'nuestro(s)') : _('my', 'mi(s)');
  const amAre = hasTwoParents ? _('are', 'somos') : _('am', 'soy');
  const haveHas = hasTwoParents ? _('have', 'tenemos') : _('have', 'tengo');
  const parentLabel = hasTwoParents
    ? _('parents', 'los padres')
    : _('parent', 'el progenitor firmante');

  const county = d.execution_county || '___';
  const execDate = formatDateLong(executionDate, lang);

  const hasSuccessor1 = !!d.alternate_guardian_name;
  const hasSuccessor2 = !!d.second_alternate_name;
  const hasMedical = d.medical_authority !== 'no';
  const hasEducation = d.education_authority !== 'no';
  const hasTravel = d.travel_authority !== 'no';
  const hasSpecial = !!d.special_instructions;
  const hasMilitary = !!d.military_deployment;

  // ── TIER GATING ──
  // basic = core nomination + death activation + limited powers + witness
  // standard = + all activation conditions + full powers (HIPAA/FERPA/travel) + notary
  // premium = + attachments (custody affidavit, school auth, medical auth, emergency decl)
  const tier = d.tier || 'basic';
  const isStandard = tier === 'standard' || tier === 'premium';
  const isPremium = tier === 'premium';

  // Track dynamic article numbering
  let artNum = 0;
  const nextArt = () => {
    artNum++;
    const numerals = [[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    let n = artNum, result = '';
    for (const [value, numeral] of numerals) {
      while (n >= value) { result += numeral; n -= value; }
    }
    return result;
  };


  // ═══════════════════════════════════════════════════════════
  // SECTION A — CORE REQUIRED CLAUSES (Always Included)
  // ═══════════════════════════════════════════════════════════

  // ── A.1: TITLE BLOCK ──
  // Clause ID: GD_TITLE
  // Tier: Basic | Trigger: Always
  sections.push({
    id: 'GD_TITLE_SUB', type: 'paragraph', style: 'subtitle',
    text: _(
      'Guardian Nomination and Emergency Minor Protection',
      'Nominación de Guardián y Protección de Emergencia para Menores'
    ),
  });

  sections.push({
    id: 'GD_TITLE_COMPLIANCE', type: 'paragraph', style: 'compliance_header',
    text: _(
      'Pursuant to California Probate Code §§1500–1502 and Family Code §3040',
      'Conforme al Código de Sucesiones de California §§1500–1502 y Código de Familia §3040'
    ),
  });

  // ── A.2: PARENT IDENTIFICATION ──
  // Clause ID: GD_ART_PARENT_ID
  // Tier: Basic | Trigger: Always
  const artParent = nextArt();
  const parentIdText = hasTwoParents
    ? _(
      `We, ${p1}, date of birth ${p1DOB || '___'}, currently residing at ${p1Addr}, and ${p2}, date of birth ${p2DOB || '___'}, currently residing at ${p2Addr}, being the natural and/or legal parents of the minor children identified herein (collectively, the "Minors"), do hereby declare under penalty of perjury pursuant to the laws of the State of California as follows:`,
      `Nosotros, ${p1}, fecha de nacimiento ${p1DOB || '___'}, con domicilio actual en ${p1Addr}, y ${p2}, fecha de nacimiento ${p2DOB || '___'}, con domicilio actual en ${p2Addr}, siendo los padres naturales y representantes legales de los menores identificados en el presente instrumento (colectivamente, los "Menores"), declaramos bajo pena de perjurio conforme a las leyes del Estado de California lo siguiente:`
    )
    : _(
      `I, ${p1}, date of birth ${p1DOB || '___'}, currently residing at ${p1Addr}, being the natural and/or legal parent of the minor children identified herein (collectively, the "Minors"), do hereby declare under penalty of perjury pursuant to the laws of the State of California as follows:`,
      `Yo, ${p1}, fecha de nacimiento ${p1DOB || '___'}, con domicilio actual en ${p1Addr}, en mi calidad de progenitor y representante legal de los menores identificados en el presente instrumento (colectivamente, los "Menores"), declaro bajo pena de perjurio conforme a las leyes del Estado de California lo siguiente:`
    );

  sections.push({
    id: 'GD_ART_PARENT_ID', type: 'article',
    article_num: artParent,
    title: _('DECLARATIONS AND PARENTAL CAPACITY', 'DECLARACIONES Y CAPACIDAD PARENTAL'),
    text: parentIdText,
    numbered_items: [
      _(
        `${iWe} ${haveHas} full and unrestricted legal authority and parental rights with respect to the Minor(s) named in this instrument. No court of competent jurisdiction has entered any order terminating, suspending, or limiting ${myOur} parental rights.`,
        `${hasTwoParents ? 'Tenemos' : 'Tengo'} autoridad legal plena e irrestricta y derechos parentales respecto a los Menores nombrados en este instrumento. Ningún tribunal competente ha emitido orden alguna que termine, suspenda o limite ${hasTwoParents ? 'nuestros' : 'mis'} derechos parentales.`
      ),
      _(
        `${iWe} ${amAre} of sound mind, not acting under duress, fraud, or undue influence, and execute this instrument freely and voluntarily.`,
        `${hasTwoParents ? 'Nos encontramos' : 'Me encuentro'} en pleno uso de facultades mentales, sin actuar bajo coacción, fraude o influencia indebida, y ${hasTwoParents ? 'ejecutamos' : 'ejecuto'} este instrumento libre y voluntariamente.`
      ),
      _(
        `${iWe} execute this Nomination with the express intention of protecting the physical, emotional, educational, and financial well-being of the Minor(s) in the event ${iWe.toLowerCase()} ${amAre} unable to provide such care.`,
        `${hasTwoParents ? 'Ejecutamos' : 'Ejecuto'} esta Nominación con la intención expresa de proteger el bienestar físico, emocional, educativo y financiero de los Menores en caso de que ${hasTwoParents ? 'no podamos' : 'no pueda'} proporcionar dicho cuidado.`
      ),
      _(
        'This Nomination reflects a considered, deliberate, and informed expression of parental preference, made in the best interests of the Minor(s) pursuant to California Family Code §3040.',
        'Esta Nominación refleja una expresión de preferencia parental considerada, deliberada e informada, realizada en el mejor interés de los Menores conforme a la Sección 3040 del Código de Familia de California.'
      ),
    ],
  });


  // ── A.3: MINOR IDENTIFICATION ──
  // Clause ID: GD_ART_MINOR_ID
  // Tier: Basic | Trigger: Always
  const artMinor = nextArt();
  sections.push({
    id: 'GD_ART_MINOR_ID', type: 'article',
    article_num: artMinor,
    title: _('IDENTIFICATION OF MINOR CHILD(REN)', 'IDENTIFICACIÓN DE HIJO(S) MENOR(ES)'),
    text: _(
      'This Nomination applies to the following minor child(ren), each of whom is under the age of eighteen (18) years and for whom the undersigned has legal parental authority:',
      'Esta Nominación aplica a los siguientes hijos menores, cada uno de los cuales es menor de dieciocho (18) años de edad y para quienes el/los firmante(s) tiene(n) autoridad parental legal:'
    ),
    subtext: d.children_info || '___',
  });


  // ── A.4: PRIMARY GUARDIAN NOMINATION ──
  // Clause ID: GD_ART_PRIMARY
  // Tier: Basic | Trigger: Always
  const artPrimary = nextArt();
  sections.push({
    id: 'GD_ART_PRIMARY', type: 'article',
    article_num: artPrimary,
    title: _('NOMINATION OF PRIMARY GUARDIAN', 'NOMINACIÓN DE GUARDIÁN PRINCIPAL'),
    text: _(
      `Pursuant to California Probate Code §1500, ${iWe.toLowerCase()} hereby nominate the following individual as Primary Guardian of the person(s) of the Minor(s):`,
      `Conforme a la Sección 1500 del Código de Sucesiones de California, ${hasTwoParents ? 'nominamos' : 'nomino'} por la presente a la siguiente persona como Guardián Principal de la(s) persona(s) de los Menores:`
    ),
    fields: [
      { label: _('Full Legal Name', 'Nombre Legal Completo'), value: d.guardian_name || '___' },
      { label: _('Current Address', 'Domicilio Actual'), value: d.guardian_address || '___' },
      { label: _('Telephone', 'Teléfono'), value: formatPhone(d.guardian_phone) },
      { label: _('Relationship to Minor(s)', 'Relación con los Menores'), value: translateRelationship(d.guardian_relationship, lang) },
    ],
    posttext: _(
      'The Primary Guardian shall assume physical custody and authority over the Minor(s) pursuant to the terms of this instrument, subject to confirmation by a court of competent jurisdiction when required by law. The Primary Guardian shall serve without bond unless otherwise ordered by the court.',
      'El Guardián Principal asumirá la custodia física y autoridad sobre los Menores conforme a los términos de este instrumento, sujeto a confirmación por tribunal competente cuando lo requiera la ley. El Guardián Principal servirá sin fianza a menos que el tribunal ordene lo contrario.'
    ),
  });


  // ═══════════════════════════════════════════════════════════
  // SECTION B — SUCCESSOR GUARDIANS (Standard+)
  // ═══════════════════════════════════════════════════════════

  // ── B.1: FIRST SUCCESSOR ──
  // Clause ID: GD_ART_SUCC1
  // Tier: Standard | Trigger: alternate_guardian_name provided
  if (hasSuccessor1) {
    const artSucc1 = nextArt();
    sections.push({
      id: 'GD_ART_SUCC1', type: 'article',
      article_num: artSucc1,
      title: _('FIRST SUCCESSOR GUARDIAN', 'PRIMER GUARDIÁN SUCESOR'),
      text: _(
        'In the event that the Primary Guardian is unable or unwilling to serve, or becomes deceased, incapacitated, or is otherwise disqualified by a court of competent jurisdiction, the undersigned hereby nominates the following individual as First Successor Guardian:',
        'En caso de que el Guardián Principal no pueda o no desee servir, fallezca, quede incapacitado, o sea descalificado por tribunal competente, el/los firmante(s) nominan a la siguiente persona como Primer Guardián Sucesor:'
      ),
      fields: [
        { label: _('Full Legal Name', 'Nombre Legal Completo'), value: d.alternate_guardian_name },
        ...(d.alternate_guardian_address ? [{ label: _('Current Address', 'Domicilio Actual'), value: d.alternate_guardian_address }] : []),
        ...(d.alternate_guardian_phone ? [{ label: _('Telephone', 'Teléfono'), value: formatPhone(d.alternate_guardian_phone) }] : []),
        ...(d.alternate_guardian_relationship ? [{ label: _('Relationship to Minor(s)', 'Relación con los Menores'), value: translateRelationship(d.alternate_guardian_relationship, lang) }] : []),
      ],
      posttext: _(
        'The First Successor Guardian shall assume all rights, duties, and authority granted to the Primary Guardian under this instrument.',
        'El Primer Guardián Sucesor asumirá todos los derechos, deberes y autoridad otorgados al Guardián Principal bajo este instrumento.'
      ),
    });
  }

  // ── B.2: SECOND SUCCESSOR ──
  // Clause ID: GD_ART_SUCC2
  // Tier: Premium | Trigger: second_alternate_name provided AND Premium
  if (hasSuccessor2 && isPremium) {
    const artSucc2 = nextArt();
    sections.push({
      id: 'GD_ART_SUCC2', type: 'article',
      article_num: artSucc2,
      title: _('SECOND SUCCESSOR GUARDIAN', 'SEGUNDO GUARDIÁN SUCESOR'),
      text: _(
        'In the event that both the Primary Guardian and the First Successor Guardian are unable or unwilling to serve, the undersigned hereby nominates the following individual as Second Successor Guardian:',
        'En caso de que tanto el Guardián Principal como el Primer Guardián Sucesor no puedan o no deseen servir, el/los firmante(s) nominan a la siguiente persona como Segundo Guardián Sucesor:'
      ),
      fields: [
        { label: _('Full Legal Name', 'Nombre Legal Completo'), value: d.second_alternate_name },
        ...(d.second_alternate_address ? [{ label: _('Current Address', 'Domicilio Actual'), value: d.second_alternate_address }] : []),
        ...(d.second_alternate_phone ? [{ label: _('Telephone', 'Teléfono'), value: d.second_alternate_phone }] : []),
        ...(d.second_alternate_relationship ? [{ label: _('Relationship to Minor(s)', 'Relación con los Menores'), value: d.second_alternate_relationship }] : []),
      ],
    });
  }


  // ═══════════════════════════════════════════════════════════
  // SECTION C — ACTIVATION CONDITIONS
  // ═══════════════════════════════════════════════════════════

  // ── C.1: ACTIVATION UPON DEATH ──
  // Clause ID: GD_ART_ACTIVATE_DEATH
  // Tier: Basic | Trigger: Always
  const artActivation = nextArt();
  sections.push({
    id: 'GD_ART_ACTIVATION', type: 'article',
    article_num: artActivation,
    title: _('CONDITIONS OF ACTIVATION', 'CONDICIONES DE ACTIVACIÓN'),
    text: _(
      'This Nomination shall become operative and the nominated Guardian shall assume responsibility for the Minor(s) upon the occurrence of any one or more of the following conditions:',
      'Esta Nominación entrará en vigor y el Guardián nominado asumirá responsabilidad por los Menores al ocurrir una o más de las siguientes condiciones:'
    ),
    lettered_items: [
      // C.1a — Death (All tiers)
      _(
        `Death of ${hasTwoParents ? 'both parents' : 'the undersigned parent'}. Upon the death of ${hasTwoParents ? 'both undersigned parents' : 'the undersigned parent'}, the nominated Guardian shall have immediate authority to assume physical custody of the Minor(s), subject to court confirmation pursuant to Probate Code §1500.`,
        `Fallecimiento de ${hasTwoParents ? 'ambos padres' : 'el progenitor firmante'}. Ante el fallecimiento de ${hasTwoParents ? 'ambos padres firmantes' : 'el progenitor firmante'}, el Guardián nominado tendrá autoridad inmediata para asumir la custodia física de los Menores, sujeto a confirmación judicial conforme a la Sección 1500 del Código de Sucesiones.`
      ),
      // C.1b — Incapacity with medical certification (Standard+)
      ...(isStandard ? [_(
        `Legal incapacity as determined by a court of competent jurisdiction, or physical or mental incapacity as certified in writing by two (2) licensed physicians stating that the ${parentLabel} ${amAre} unable to provide adequate care, supervision, and protection for the Minor(s).`,
        `Incapacidad legal determinada por tribunal competente, o incapacidad física o mental certificada por escrito por dos (2) médicos licenciados que declaren que ${hasTwoParents ? 'los padres no pueden' : 'el progenitor firmante no puede'} proporcionar cuidado, supervisión y protección adecuados para los Menores.`
      )] : []),
      // C.1c — Temporary emergency (Standard+)
      ...(isStandard ? [_(
        `Temporary emergency circumstances in which the ${parentLabel} ${amAre} unavailable to provide care due to hospitalization, emergency medical treatment, or sudden inability to communicate. In such emergency, the Guardian may assume temporary physical custody for a period not to exceed thirty (30) days without court order, pending judicial review if the emergency extends beyond such period.`,
        `Circunstancias de emergencia temporal en las que ${hasTwoParents ? 'los padres no están disponibles' : 'el progenitor firmante no está disponible'} para proporcionar cuidado debido a hospitalización, tratamiento médico de emergencia, o incapacidad súbita para comunicarse. En dicha emergencia, el Guardián podrá asumir custodia física temporal por un período no mayor a treinta (30) días sin orden judicial, pendiente revisión judicial si la emergencia se extiende más allá de dicho período.`
      )] : []),
      // C.1d — Immigration detention (Standard+)
      ...(isStandard ? [_(
        `Immigration detention or involuntary prolonged absence. If the ${parentLabel} ${amAre} detained by immigration authorities or otherwise involuntarily absent, this Nomination shall serve as evidence of parental intent and the Guardian shall have authority to provide for the immediate needs of the Minor(s).`,
        `Detención migratoria o ausencia involuntaria prolongada. Si ${hasTwoParents ? 'los padres son detenidos' : 'el progenitor firmante es detenido'} por autoridades migratorias o se encuentra involuntariamente ausente, esta Nominación servirá como evidencia de intención parental y el Guardián tendrá autoridad para atender las necesidades inmediatas de los Menores.`
      )] : []),
      // C.1e — Military deployment (Standard+ AND conditional)
      ...(hasMilitary && isStandard ? [_(
        `Military deployment. If the ${parentLabel} ${amAre} deployed for military service, this Nomination shall activate for the duration of the deployment and any period of transition not to exceed sixty (60) days following return from deployment.`,
        `Despliegue militar. Si ${hasTwoParents ? 'los padres son desplegados' : 'el progenitor firmante es desplegado'} para servicio militar, esta Nominación se activará por la duración del despliegue y cualquier período de transición no mayor a sesenta (60) días posterior al retorno del despliegue.`
      )] : []),
      // C.1f — Court determination (always)
      _(
        'Judicial determination that activation of this Nomination is in the best interests of the Minor(s), pursuant to California Family Code §3040.',
        'Determinación judicial de que la activación de esta Nominación es en el mejor interés de los Menores, conforme a la Sección 3040 del Código de Familia de California.'
      ),
    ],
  });


  // ═══════════════════════════════════════════════════════════
  // SECTION D — GUARDIAN POWERS (Detailed)
  // ═══════════════════════════════════════════════════════════

  const artPowers = nextArt();
  const powersSubs = [];

  // ── D.1: Physical Custody Authority ──
  // Clause ID: GD_PWR_CUSTODY | Tier: Basic | Trigger: Always
  const pNum = (n) => `${artPowers}.${n}`;
  let pIdx = 1;

  powersSubs.push({
    num: pNum(pIdx++),
    title: _('Physical Custody and Personal Care', 'Custodia Física y Cuidado Personal'),
    text: _(
      'The Guardian shall have full authority to maintain physical custody of the Minor(s), including but not limited to: day-to-day supervision and care; establishment and maintenance of a stable, safe, and nurturing home environment; provision of food, clothing, and shelter adequate to the Minor(s)\' needs; reasonable discipline consistent with California law; and all actions reasonably necessary to ensure the physical and emotional well-being of the Minor(s).',
      'El Guardián tendrá autoridad plena para mantener la custodia física de los Menores, incluyendo pero no limitado a: supervisión y cuidado diario; establecimiento y mantenimiento de un hogar estable, seguro y propicio; provisión de alimentación, vestimenta y vivienda adecuados a las necesidades de los Menores; disciplina razonable conforme a la ley de California; y todas las acciones razonablemente necesarias para asegurar el bienestar físico y emocional de los Menores.'
    ),
  });

  // ── D.2: Residence Establishment ──
  // Clause ID: GD_PWR_RESIDENCE | Tier: Basic | Trigger: Always
  powersSubs.push({
    num: pNum(pIdx++),
    title: _('Establishment of Residence', 'Establecimiento de Residencia'),
    text: _(
      'The Guardian shall have authority to establish and maintain the primary residence of the Minor(s) within the State of California. Relocation of the Minor(s) outside the State of California shall require prior court approval, except in cases of documented emergency where the relocation is necessary for the immediate safety or welfare of the Minor(s).',
      'El Guardián tendrá autoridad para establecer y mantener la residencia principal de los Menores dentro del Estado de California. La reubicación de los Menores fuera del Estado de California requerirá aprobación judicial previa, excepto en casos de emergencia documentada donde la reubicación sea necesaria para la seguridad o bienestar inmediato de los Menores.'
    ),
  });

  // ── D.3: Medical Consent Authority ──
  // Clause ID: GD_PWR_MEDICAL | Tier: Standard | Trigger: medical_authority === 'yes' AND Standard+
  if (hasMedical && isStandard) {
    powersSubs.push({
      num: pNum(pIdx++),
      title: _('Medical and Healthcare Authority', 'Autoridad Médica y de Salud'),
      text: _(
        'The Guardian is hereby authorized to consent to any and all medical, dental, surgical, psychiatric, psychological, and therapeutic treatment for the Minor(s), including but not limited to: routine medical and dental care; emergency medical treatment; hospitalization; administration of medications; vaccinations and immunizations; diagnostic testing and procedures; and mental health treatment including counseling and therapy. This authorization extends to the selection of healthcare providers, facilities, and treatment plans in the Guardian\'s reasonable judgment.',
        'El Guardián queda autorizado para consentir todo tratamiento médico, dental, quirúrgico, psiquiátrico, psicológico y terapéutico para los Menores, incluyendo pero no limitado a: atención médica y dental de rutina; tratamiento médico de emergencia; hospitalización; administración de medicamentos; vacunas e inmunizaciones; pruebas y procedimientos diagnósticos; y tratamiento de salud mental incluyendo consejería y terapia. Esta autorización se extiende a la selección de proveedores de salud, instalaciones y planes de tratamiento según el juicio razonable del Guardián.'
      ),
    });

    // ── D.3a: HIPAA Authorization ──
    // Clause ID: GD_PWR_HIPAA | Tier: Standard | Trigger: medical_authority === 'yes'
    powersSubs.push({
      num: pNum(pIdx++),
      title: _('HIPAA Records Access Authorization', 'Autorización de Acceso a Registros HIPAA'),
      text: _(
        `Pursuant to the Health Insurance Portability and Accountability Act of 1996 ("HIPAA"), 45 C.F.R. §164.502(g), the ${parentLabel} hereby ${hasTwoParents ? 'authorize' : 'authorizes'} the Guardian to act as the personal representative of the Minor(s) for all purposes under HIPAA, including but not limited to: accessing, reviewing, and obtaining copies of all protected health information ("PHI") relating to the Minor(s); communicating with healthcare providers regarding the diagnosis, treatment, and prognosis of the Minor(s); authorizing the release of medical records to third parties as reasonably necessary; and making healthcare decisions on behalf of the Minor(s). All covered entities as defined under HIPAA are hereby directed to recognize the Guardian as the personal representative of the Minor(s) and to provide full access to all PHI upon presentation of this instrument.`,
        `Conforme a la Ley de Portabilidad y Responsabilidad del Seguro de Salud de 1996 ("HIPAA"), 45 C.F.R. §164.502(g), ${hasTwoParents ? 'los padres firmantes autorizan' : 'el progenitor firmante autoriza'} al Guardián a actuar como representante personal de los Menores para todos los propósitos bajo HIPAA, incluyendo pero no limitado a: acceder, revisar y obtener copias de toda información de salud protegida ("PHI") relacionada con los Menores; comunicarse con proveedores de salud respecto al diagnóstico, tratamiento y pronóstico de los Menores; autorizar la divulgación de registros médicos a terceros según sea razonablemente necesario; y tomar decisiones de salud en nombre de los Menores. Todas las entidades cubiertas según HIPAA quedan dirigidas a reconocer al Guardián como representante personal de los Menores y a proporcionar acceso completo a toda PHI al presentar este instrumento.`
      ),
    });

    // ── D.3b: Mental Health Treatment ──
    powersSubs.push({
      num: pNum(pIdx++),
      title: _('Mental Health Treatment Consent', 'Consentimiento para Tratamiento de Salud Mental'),
      text: _(
        'The Guardian is authorized to consent to mental health evaluation, diagnosis, and treatment for the Minor(s), including outpatient counseling, psychiatric evaluation, and therapeutic intervention. The Guardian may select mental health providers and approve treatment plans. Inpatient psychiatric commitment shall require court authorization except in cases of imminent danger to the Minor(s) or others as determined by a licensed mental health professional.',
        'El Guardián queda autorizado para consentir la evaluación, diagnóstico y tratamiento de salud mental de los Menores, incluyendo consejería ambulatoria, evaluación psiquiátrica e intervención terapéutica. El Guardián podrá seleccionar proveedores de salud mental y aprobar planes de tratamiento. La internación psiquiátrica requerirá autorización judicial excepto en casos de peligro inminente para los Menores o terceros según lo determine un profesional de salud mental licenciado.'
      ),
    });
  }

  // ── D.4: Educational Authority (FERPA) ──
  // Clause ID: GD_PWR_EDUCATION | Tier: Standard | Trigger: education_authority === 'yes' AND Standard+
  if (hasEducation && isStandard) {
    powersSubs.push({
      num: pNum(pIdx++),
      title: _('Educational Authority — FERPA Compliance', 'Autoridad Educativa — Cumplimiento FERPA'),
      text: _(
        `Pursuant to the Family Educational Rights and Privacy Act ("FERPA"), 20 U.S.C. §1232g, and applicable California Education Code provisions, the ${parentLabel} hereby ${hasTwoParents ? 'authorize' : 'authorizes'} the Guardian to exercise full educational authority over the Minor(s), including but not limited to: enrollment in and withdrawal from public, private, or charter schools; access to and review of all educational records, including grades, attendance, disciplinary records, and individualized education programs ("IEP"); consent to educational evaluations, testing, and special education services; attendance at and participation in all parent-teacher conferences, school meetings, and IEP proceedings; authorization of field trips and school-sponsored activities; and all decisions regarding the educational placement, curriculum, and academic programs of the Minor(s). All educational institutions are directed to recognize the Guardian as the parent or legal guardian of the Minor(s) for purposes of FERPA and to provide full access to educational records upon presentation of this instrument.`,
        `Conforme a la Ley de Derechos Educativos y Privacidad Familiar ("FERPA"), 20 U.S.C. §1232g, y las disposiciones aplicables del Código de Educación de California, ${hasTwoParents ? 'los padres firmantes autorizan' : 'el progenitor firmante autoriza'} al Guardián a ejercer autoridad educativa plena sobre los Menores, incluyendo pero no limitado a: inscripción y retiro de escuelas públicas, privadas o charter; acceso y revisión de todos los registros educativos, incluyendo calificaciones, asistencia, registros disciplinarios y programas de educación individualizada ("IEP"); consentimiento para evaluaciones educativas, pruebas y servicios de educación especial; asistencia y participación en conferencias de padres y maestros, reuniones escolares y procedimientos IEP; autorización de excursiones y actividades patrocinadas por la escuela; y todas las decisiones respecto a la colocación educativa, currículo y programas académicos de los Menores. Todas las instituciones educativas quedan dirigidas a reconocer al Guardián como representante legal de los Menores para propósitos de FERPA y a proporcionar acceso completo a registros educativos al presentar este instrumento.`
      ),
    });
  }

  // ── D.5: Travel Authority ──
  // Clause ID: GD_PWR_TRAVEL | Tier: Standard | Trigger: travel_authority === 'yes' AND Standard+
  if (hasTravel && isStandard) {
    powersSubs.push({
      num: pNum(pIdx++),
      title: _('Travel Authority — Domestic and International', 'Autoridad de Viaje — Nacional e Internacional'),
      text: _(
        `The Guardian is authorized to travel with the Minor(s) within the United States, including by air, rail, bus, or private vehicle, and to make all arrangements reasonably necessary for such travel. For international travel, the Guardian is authorized to apply for, obtain, and carry passports for the Minor(s), and to travel internationally with the Minor(s), provided such travel is in the best interests of the Minor(s). This authorization shall serve as evidence of parental consent for purposes of airline, border, and customs requirements. The Guardian shall exercise reasonable judgment regarding the safety and appropriateness of all travel.`,
        `El Guardián queda autorizado para viajar con los Menores dentro de los Estados Unidos, incluyendo por avión, tren, autobús o vehículo privado, y para realizar todos los arreglos razonablemente necesarios para dicho viaje. Para viajes internacionales, el Guardián queda autorizado para solicitar, obtener y portar pasaportes para los Menores, y para viajar internacionalmente con los Menores, siempre que dicho viaje sea en el mejor interés de los Menores. Esta autorización servirá como evidencia de consentimiento parental para propósitos de requisitos de aerolíneas, fronterizos y aduaneros. El Guardián ejercerá juicio razonable respecto a la seguridad e idoneidad de todo viaje.`
      ),
    });
  }

  // ── D.6: Government Benefits Authority ──
  // Clause ID: GD_PWR_BENEFITS | Tier: Standard | Trigger: Standard+
  if (isStandard) {
  powersSubs.push({
    num: pNum(pIdx++),
    title: _('Government Benefits and Services', 'Beneficios y Servicios Gubernamentales'),
    text: _(
      'The Guardian is authorized to apply for, maintain, and manage government benefits and services on behalf of the Minor(s), including but not limited to: Social Security benefits, Supplemental Security Income, Medi-Cal or other health insurance programs, CalFresh or other nutritional assistance, CalWORKs or other cash assistance, and any federal, state, or local program providing benefits to minor children. The Guardian is authorized to complete all applications, provide required documentation, and act as the authorized representative of the Minor(s) in all proceedings related to such benefits.',
      'El Guardián queda autorizado para solicitar, mantener y administrar beneficios y servicios gubernamentales en nombre de los Menores, incluyendo pero no limitado a: beneficios del Seguro Social, Ingreso Suplementario de Seguridad, Medi-Cal u otros programas de seguro de salud, CalFresh u otra asistencia nutricional, CalWORKs u otra asistencia en efectivo, y cualquier programa federal, estatal o local que proporcione beneficios a hijos menores. El Guardián queda autorizado para completar todas las solicitudes, proporcionar documentación requerida, y actuar como representante autorizado de los Menores en todos los procedimientos relacionados con dichos beneficios.'
    ),
  });

  // ── D.7: Financial Authority (Limited) ──
  // Clause ID: GD_PWR_FINANCIAL | Tier: Standard | Trigger: Standard+
  powersSubs.push({
    num: pNum(pIdx++),
    title: _('Limited Financial Authority', 'Autoridad Financiera Limitada'),
    text: _(
      'The Guardian shall have authority to manage financial matters directly related to the care and welfare of the Minor(s), including but not limited to: receiving and managing funds for the benefit of the Minor(s); paying for housing, food, clothing, medical care, education, and extracurricular activities; opening and maintaining bank accounts in the name of or for the benefit of the Minor(s); and filing tax returns as required on behalf of the Minor(s). This financial authority is limited to expenditures reasonably necessary for the care and welfare of the Minor(s) and does not constitute authority to manage any trust, estate, or substantial assets of the Minor(s), which shall require separate court appointment as guardian of the estate.',
      'El Guardián tendrá autoridad para administrar asuntos financieros directamente relacionados con el cuidado y bienestar de los Menores, incluyendo pero no limitado a: recibir y administrar fondos para beneficio de los Menores; pagar vivienda, alimentación, vestimenta, atención médica, educación y actividades extracurriculares; abrir y mantener cuentas bancarias a nombre o para beneficio de los Menores; y presentar declaraciones de impuestos según se requiera en nombre de los Menores. Esta autoridad financiera se limita a gastos razonablemente necesarios para el cuidado y bienestar de los Menores y no constituye autoridad para administrar ningún fideicomiso, patrimonio o activos sustanciales de los Menores, lo cual requerirá nombramiento judicial separado como guardián del patrimonio.'
    ),
  });

  // ── D.8: Insurance Access ──
  // Clause ID: GD_PWR_INSURANCE | Tier: Standard | Trigger: Always
  powersSubs.push({
    num: pNum(pIdx++),
    title: _('Access to Insurance Policies', 'Acceso a Pólizas de Seguro'),
    text: _(
      'The Guardian is authorized to access and manage any insurance policies that provide coverage for the Minor(s), including health insurance, dental insurance, vision insurance, and life insurance policies naming the Minor(s) as beneficiaries. The Guardian may submit claims, communicate with insurance carriers, select in-network providers, and take all actions reasonably necessary to maintain and utilize insurance coverage for the benefit of the Minor(s).',
      'El Guardián queda autorizado para acceder y administrar cualquier póliza de seguro que proporcione cobertura para los Menores, incluyendo seguro de salud, dental, de visión, y pólizas de seguro de vida que nombren a los Menores como beneficiarios. El Guardián podrá presentar reclamaciones, comunicarse con aseguradoras, seleccionar proveedores dentro de la red, y tomar todas las acciones razonablemente necesarias para mantener y utilizar la cobertura de seguro para beneficio de los Menores.'
    ),
  });

  } // end isStandard gate for D.6, D.7, D.8

  // ── D.9: General Welfare ──
  // Clause ID: GD_PWR_GENERAL | Tier: Basic | Trigger: Always
  powersSubs.push({
    num: pNum(pIdx++),
    title: _('General Welfare Authority', 'Autoridad de Bienestar General'),
    text: _(
      'The Guardian shall have authority to take any and all actions reasonably necessary for the health, safety, welfare, and best interests of the Minor(s), including but not limited to: authorizing participation in extracurricular activities, sports, and community programs; making religious and cultural decisions consistent with the wishes expressed in this instrument; obtaining identification documents including state identification cards and Social Security cards; and acting as the authorized adult for all purposes requiring parental or guardian consent.',
      'El Guardián tendrá autoridad para tomar todas y cualquier acción razonablemente necesaria para la salud, seguridad, bienestar y mejores intereses de los Menores, incluyendo pero no limitado a: autorizar participación en actividades extracurriculares, deportes y programas comunitarios; tomar decisiones religiosas y culturales consistentes con los deseos expresados en este instrumento; obtener documentos de identificación incluyendo tarjetas de identificación estatal y tarjetas de Seguro Social; y actuar como el adulto autorizado para todos los propósitos que requieran consentimiento parental o de guardián.'
    ),
  });

  sections.push({
    id: 'GD_ART_POWERS', type: 'article',
    article_num: artPowers,
    title: _('SCOPE OF GUARDIAN AUTHORITY', 'ALCANCE DE AUTORIDAD DEL GUARDIÁN'),
    text: _(
      'The Guardian shall have the following authority with respect to the care, custody, and welfare of the Minor(s), exercisable in the Guardian\'s reasonable judgment and in the best interests of the Minor(s):',
      'El Guardián tendrá la siguiente autoridad respecto al cuidado, custodia y bienestar de los Menores, ejercitable según el juicio razonable del Guardián y en el mejor interés de los Menores:'
    ),
    subsections: powersSubs,
  });


  // ═══════════════════════════════════════════════════════════
  // ARTICLE — SPECIAL INSTRUCTIONS (Conditional)
  // ═══════════════════════════════════════════════════════════
  if (hasSpecial) {
    const artSpecial = nextArt();
    sections.push({
      id: 'GD_ART_SPECIAL', type: 'article',
      article_num: artSpecial,
      title: _('SPECIAL INSTRUCTIONS AND PARENTAL DIRECTIVES', 'INSTRUCCIONES ESPECIALES Y DIRECTRICES PARENTALES'),
      text: _(
        `The ${parentLabel} ${hasTwoParents ? 'include' : 'includes'} the following additional directives regarding the care, upbringing, and welfare of the Minor(s). The Guardian shall use best efforts to honor these directives to the extent reasonably practicable:`,
        `${hasTwoParents ? 'Los padres incluyen' : 'El progenitor firmante incluye'} las siguientes directrices adicionales respecto al cuidado, crianza y bienestar de los Menores. El Guardián hará su mejor esfuerzo por cumplir estas directrices en la medida razonablemente practicable:`
      ),
      subtext: d.special_instructions,
    });
  }


  // ═══════════════════════════════════════════════════════════
  // ARTICLE — LIMITATIONS AND COURT DISCRETION
  // ═══════════════════════════════════════════════════════════
  const artLimits = nextArt();
  sections.push({
    id: 'GD_ART_LIMITS', type: 'article',
    article_num: artLimits,
    title: _('LIMITATIONS AND JUDICIAL SUPERVISION', 'LIMITACIONES Y SUPERVISIÓN JUDICIAL'),
    numbered_items: [
      _(
        'This Nomination constitutes an expression of parental preference pursuant to California Probate Code §§1500–1502 and California Family Code §3040. It is not a court order and does not operate as a final adjudication of guardianship.',
        'Esta Nominación constituye una expresión de preferencia parental conforme a las Secciones 1500–1502 del Código de Sucesiones de California y la Sección 3040 del Código de Familia de California. No es una orden judicial y no opera como adjudicación final de tutela.'
      ),
      _(
        `This Nomination does not terminate, suspend, or limit the parental rights of ${hasTwoParents ? 'either parent' : 'the undersigned parent'} while ${hasTwoParents ? 'such parent is' : 'the parent is'} alive, competent, and not subject to any of the activation conditions set forth herein.`,
        `Esta Nominación no termina, suspende ni limita los derechos parentales de ${hasTwoParents ? 'ninguno de los padres' : 'el progenitor firmante'} mientras ${hasTwoParents ? 'dicho progenitor esté' : 'esté'} vivo, competente y no sujeto a ninguna de las condiciones de activación establecidas en el presente.`
      ),
      _(
        'Final authority regarding the appointment of a guardian rests with a court of competent jurisdiction, which shall determine guardianship based on the best interests of the Minor(s), giving due consideration to the preferences expressed in this Nomination. Pursuant to California Probate Code §1500, the court shall appoint the guardian nominated by a parent unless the court finds that the appointment is not in the best interest of the child.',
        'La autoridad final respecto al nombramiento de un guardián corresponde a tribunal competente, el cual determinará la tutela basándose en el mejor interés de los Menores, dando debida consideración a las preferencias expresadas en esta Nominación. Conforme a la Sección 1500 del Código de Sucesiones de California, el tribunal nombrará al guardián nominado por un padre a menos que encuentre que el nombramiento no es en el mejor interés del menor.'
      ),
      _(
        'The Guardian shall comply with all reporting requirements and orders of the supervising court and shall act at all times in the best interests of the Minor(s).',
        'El Guardián cumplirá con todos los requisitos de reporte y órdenes del tribunal supervisor y actuará en todo momento en el mejor interés de los Menores.'
      ),
    ],
  });


  // ═══════════════════════════════════════════════════════════
  // ARTICLE — DURATION AND REVOCATION
  // ═══════════════════════════════════════════════════════════
  const artDuration = nextArt();
  sections.push({
    id: 'GD_ART_DURATION', type: 'article',
    article_num: artDuration,
    title: _('DURATION AND REVOCATION', 'DURACIÓN Y REVOCACIÓN'),
    numbered_items: [
      _(
        'This Nomination shall remain in effect until the earliest of: (a) the Minor(s) reaching the age of eighteen (18) years; (b) revocation by a written instrument executed by a competent parent and delivered to the nominated Guardian; (c) entry of a court order superseding this Nomination; or (d) the death of the last surviving nominated Guardian without a successor.',
        'Esta Nominación permanecerá vigente hasta la primera de las siguientes: (a) que los Menores cumplan dieciocho (18) años de edad; (b) revocación por instrumento escrito ejecutado por progenitor competente y entregado al Guardián nominado; (c) emisión de orden judicial que sustituya esta Nominación; o (d) el fallecimiento del último Guardián nominado sobreviviente sin sucesor.'
      ),
      _(
        `${hasTwoParents ? 'Either parent' : 'The undersigned parent'} may revoke this Nomination at any time by executing a written revocation, signed and dated, and delivering a copy thereof to the nominated Guardian and any successor Guardians named herein.`,
        `${hasTwoParents ? 'Cualquiera de los padres' : 'El progenitor firmante'} podrá revocar esta Nominación en cualquier momento ejecutando una revocación escrita, firmada y fechada, y entregando copia de la misma al Guardián nominado y cualquier Guardián sucesor nombrado en el presente.`
      ),
      _(
        'This Nomination supersedes and revokes all prior nominations of guardian executed by the undersigned with respect to the Minor(s) named herein.',
        'Esta Nominación sustituye y revoca todas las nominaciones de guardián anteriores ejecutadas por el/los firmante(s) respecto a los Menores nombrados en el presente.'
      ),
    ],
  });


  // ═══════════════════════════════════════════════════════════
  // ARTICLE — GOVERNING LAW
  // ═══════════════════════════════════════════════════════════
  const artLaw = nextArt();
  sections.push({
    id: 'GD_ART_LAW', type: 'article',
    article_num: artLaw,
    title: _('GOVERNING LAW', 'LEY APLICABLE'),
    text: _(
      'This Nomination shall be governed by and construed in accordance with the laws of the State of California, including but not limited to the California Probate Code, California Family Code, and all applicable federal law including HIPAA and FERPA as referenced herein.',
      'Esta Nominación se regirá e interpretará conforme a las leyes del Estado de California, incluyendo pero no limitado al Código de Sucesiones de California, Código de Familia de California, y toda ley federal aplicable incluyendo HIPAA y FERPA según se hace referencia en el presente.'
    ),
  });


  // ═══════════════════════════════════════════════════════════
  // SECTION E — EXECUTION FORMALITIES
  // ═══════════════════════════════════════════════════════════

  // ── EXECUTION PARAGRAPH ──
  sections.push({
    id: 'GD_EXEC', type: 'paragraph', style: 'execution',
    text: _(
      `IN WITNESS WHEREOF, ${iWe.toLowerCase()} have executed this Guardian Nomination and Emergency Minor Protection instrument on ${execDate}, in the County of ${county}, State of California, freely, voluntarily, and with full understanding of its contents and legal significance.`,
      `EN FE DE LO CUAL, ${iWe.toLowerCase()} ${hasTwoParents ? 'hemos ejecutado' : 'he ejecutado'} este instrumento de Nominación de Guardián y Protección de Emergencia para Menores en la fecha ${execDate}, en el Condado de ${county}, Estado de California, libre, voluntariamente y con pleno entendimiento de su contenido y significado legal.`
    ),
  });

  // ── SIGNATURE BLOCKS ──
  const sigBlocks = [
    { label: _('Parent 1', 'Padre/Madre 1'), name: p1 },
  ];
  if (hasTwoParents) {
    sigBlocks.push({ label: _('Parent 2', 'Padre/Madre 2'), name: p2 });
  }
  sections.push({ id: 'GD_SIG', type: 'signatures', blocks: sigBlocks });

  // ── WITNESS BLOCK (E.1) ──
  // Clause ID: GD_WITNESS | Tier: Basic | Trigger: Always
  sections.push({
    id: 'GD_WITNESS', type: 'witness_block',
    title: _('WITNESSES', 'TESTIGOS'),
    preamble: _(
      `The foregoing instrument was signed by ${hasTwoParents ? p1 + ' and ' + p2 : p1} in our presence, and we, at ${hasTwoParents ? 'their' : 'his/her'} request, have subscribed our names as witnesses thereto. We each declare under penalty of perjury under the laws of the State of California that the ${parentLabel}, to the best of our knowledge, ${amAre} of sound mind, not acting under duress, and executed this instrument voluntarily.`,
      `El instrumento anterior fue firmado por ${hasTwoParents ? p1 + ' y ' + p2 : p1} en nuestra presencia, y nosotros, a su solicitud, hemos suscrito nuestros nombres como testigos del mismo. Cada uno de nosotros declara bajo pena de perjurio conforme a las leyes del Estado de California que ${hasTwoParents ? 'los padres firmantes' : 'el progenitor firmante'}, según nuestro mejor conocimiento, se ${hasTwoParents ? 'encuentran' : 'encuentra'} en pleno uso de facultades mentales, no actúa bajo coacción, y ejecutó este instrumento voluntariamente.`
    ),
    witnesses: [
      { label: _('Witness 1', 'Testigo 1') },
      { label: _('Witness 2', 'Testigo 2') },
    ],
  });

  // NOTE: Notary acknowledgment (CA Civil Code §1189) is appended as a
  // separate uncounted PDF page by the renderer for Standard+ tiers.
  // It is NOT part of the clause library to keep page numbering clean.


  // ═══════════════════════════════════════════════════════════
  // SECTION F — PREMIUM ATTACHMENTS
  // ═══════════════════════════════════════════════════════════
  // These render as additional pages in the PDF
  if (isPremium) {

  // ── F.1: TEMPORARY CUSTODY AFFIDAVIT ──
  // Clause ID: GD_ATTACH_CUSTODY | Tier: Premium | Trigger: Always on Premium
  sections.push({
    id: 'GD_ATTACH_CUSTODY', type: 'attachment',
    title: _(
      'ATTACHMENT A — TEMPORARY CUSTODY AFFIDAVIT',
      'ANEXO A — DECLARACIÓN JURADA DE CUSTODIA TEMPORAL'
    ),
    content: _(
      `TEMPORARY CUSTODY AFFIDAVIT
State of California

I, ${d.guardian_name || '___'}, declare under penalty of perjury under the laws of the State of California as follows:

1. I am the individual nominated as Guardian of the minor child(ren) listed below by ${hasTwoParents ? p1 + ' and ' + p2 : p1} pursuant to a Guardian Nomination and Emergency Minor Protection instrument dated ${execDate}.

2. The minor child(ren) subject to this Affidavit:
${d.children_info || '___'}

3. I have assumed temporary physical custody of the above-named minor child(ren) due to: [  ] Death of parent(s)  [  ] Incapacity of parent(s)  [  ] Emergency circumstances  [  ] Immigration detention  [  ] Other: ___

4. I am providing for the basic needs of the minor child(ren) including food, shelter, clothing, and supervision.

5. I will pursue formal guardianship proceedings through the appropriate court if the circumstances requiring my care continue beyond thirty (30) days.

6. I have a copy of the Guardian Nomination instrument and present this Affidavit as evidence of parental intent.

I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.

Date: ________________________

Signature: ________________________
${d.guardian_name || '___'}`,
      `DECLARACIÓN JURADA DE CUSTODIA TEMPORAL
Estado de California

Yo, ${d.guardian_name || '___'}, declaro bajo pena de perjurio conforme a las leyes del Estado de California lo siguiente:

1. Soy la persona nominada como Guardián de los hijos menores listados a continuación por ${hasTwoParents ? p1 + ' y ' + p2 : p1} conforme a un instrumento de Nominación de Guardián y Protección de Emergencia para Menores fechado ${execDate}.

2. Los hijos menores sujetos a esta Declaración Jurada:
${d.children_info || '___'}

3. He asumido custodia física temporal de los menores arriba nombrados debido a: [  ] Fallecimiento de padre(s)/madre(s)  [  ] Incapacidad de padre(s)/madre(s)  [  ] Circunstancias de emergencia  [  ] Detención migratoria  [  ] Otro: ___

4. Estoy proveyendo las necesidades básicas de los menores incluyendo alimentación, vivienda, vestimenta y supervisión.

5. Iniciaré procedimientos formales de tutela ante el tribunal correspondiente si las circunstancias que requieren mi cuidado continúan más allá de treinta (30) días.

6. Tengo copia del instrumento de Nominación de Guardián y presento esta Declaración Jurada como evidencia de intención parental.

Declaro bajo pena de perjurio conforme a las leyes del Estado de California que lo anterior es verdadero y correcto.

Fecha: ________________________

Firma: ________________________
${d.guardian_name || '___'}`
    ),
  });

  // ── F.2: SCHOOL AUTHORIZATION FORM ──
  // Clause ID: GD_ATTACH_SCHOOL | Tier: Premium | Trigger: education_authority === 'yes'
  if (hasEducation) {
    sections.push({
      id: 'GD_ATTACH_SCHOOL', type: 'attachment',
      title: _(
        'ATTACHMENT B — SCHOOL ENROLLMENT AND AUTHORIZATION FORM',
        'ANEXO B — FORMULARIO DE INSCRIPCIÓN Y AUTORIZACIÓN ESCOLAR'
      ),
      content: _(
        `SCHOOL ENROLLMENT AND AUTHORIZATION FORM
For Presentation to Educational Institutions

To Whom It May Concern:

I, ${hasTwoParents ? p1 + ' and ' + p2 : p1}, ${amAre} the legal parent(s) of the following minor child(ren):

${d.children_info || '___'}

I hereby authorize ${d.guardian_name || '___'} to act on my behalf in all matters related to the education of the above-named minor child(ren), including but not limited to:

• Enrollment in and withdrawal from school
• Access to all educational records pursuant to FERPA (20 U.S.C. §1232g)
• Attendance at parent-teacher conferences and IEP meetings
• Consent to educational evaluations and special education services
• Authorization of field trips and school activities
• Communication with teachers, administrators, and counselors
• Making educational placement decisions

This authorization is granted pursuant to a Guardian Nomination instrument dated ${execDate} and shall remain in effect until revoked in writing by the undersigned.

Pursuant to California Education Code §48204, the above-named child(ren) may be enrolled at the school serving the attendance area in which ${d.guardian_name || '___'} resides.

Date: ________________________

Parent Signature: ________________________
${hasTwoParents ? p1 : p1}
${hasTwoParents ? '\nParent Signature: ________________________\n' + p2 : ''}`,
        `FORMULARIO DE INSCRIPCIÓN Y AUTORIZACIÓN ESCOLAR
Para Presentación ante Instituciones Educativas

A Quien Corresponda:

Yo/Nosotros, ${hasTwoParents ? p1 + ' y ' + p2 : p1}, ${hasTwoParents ? 'somos los padres legales' : 'soy progenitor legal'} de los siguientes hijos menores:

${d.children_info || '___'}

Por la presente autorizo/autorizamos a ${d.guardian_name || '___'} para actuar en mi/nuestro nombre en todos los asuntos relacionados con la educación de los menores arriba nombrados, incluyendo pero no limitado a:

• Inscripción y retiro escolar
• Acceso a todos los registros educativos conforme a FERPA (20 U.S.C. §1232g)
• Asistencia a conferencias de padres y maestros y reuniones IEP
• Consentimiento para evaluaciones educativas y servicios de educación especial
• Autorización de excursiones y actividades escolares
• Comunicación con maestros, administradores y consejeros
• Toma de decisiones de colocación educativa

Esta autorización se otorga conforme a un instrumento de Nominación de Guardián fechado ${execDate} y permanecerá vigente hasta que sea revocada por escrito por el/los firmante(s).

Conforme a la Sección 48204 del Código de Educación de California, los menores arriba nombrados podrán ser inscritos en la escuela que atiende el área de asistencia donde reside ${d.guardian_name || '___'}.

Fecha: ________________________

Firma del Padre/Madre: ________________________
${hasTwoParents ? p1 : p1}
${hasTwoParents ? '\nFirma del Padre/Madre: ________________________\n' + p2 : ''}`
      ),
    });
  }

  // ── F.3: MEDICAL AUTHORIZATION FORM ──
  // Clause ID: GD_ATTACH_MEDICAL | Tier: Premium | Trigger: medical_authority === 'yes'
  if (hasMedical) {
    sections.push({
      id: 'GD_ATTACH_MEDICAL', type: 'attachment',
      title: _(
        'ATTACHMENT C — MEDICAL TREATMENT AUTHORIZATION FORM',
        'ANEXO C — FORMULARIO DE AUTORIZACIÓN DE TRATAMIENTO MÉDICO'
      ),
      content: _(
        `MEDICAL TREATMENT AUTHORIZATION FORM
For Presentation to Healthcare Providers

To All Healthcare Providers:

I, ${hasTwoParents ? p1 + ' and ' + p2 : p1}, ${amAre} the legal parent(s) of the following minor child(ren):

${d.children_info || '___'}

I hereby authorize ${d.guardian_name || '___'} to:

1. Consent to any and all medical, dental, surgical, psychiatric, and therapeutic treatment for the above-named minor child(ren).

2. Access all protected health information ("PHI") relating to the minor child(ren) pursuant to HIPAA, 45 C.F.R. §164.502(g).

3. Communicate with healthcare providers regarding diagnosis, treatment, and prognosis.

4. Authorize the release of medical records to third parties as reasonably necessary.

5. Make all healthcare decisions on behalf of the minor child(ren) in emergency and non-emergency situations.

Known allergies: ${d.allergies || 'None known / See medical records'}
Known medications: ${d.medications || 'None known / See medical records'}
Health insurance: ${d.health_insurance || 'See insurance card on file'}
Pediatrician: ${d.pediatrician || 'See medical records'}

This authorization is granted pursuant to a Guardian Nomination instrument dated ${execDate} and shall remain in effect until revoked in writing by the undersigned.

Date: ________________________

Parent Signature: ________________________
${hasTwoParents ? p1 : p1}
${hasTwoParents ? '\nParent Signature: ________________________\n' + p2 : ''}`,
        `FORMULARIO DE AUTORIZACIÓN DE TRATAMIENTO MÉDICO
Para Presentación ante Proveedores de Salud

A Todos los Proveedores de Salud:

Yo/Nosotros, ${hasTwoParents ? p1 + ' y ' + p2 : p1}, ${hasTwoParents ? 'somos los padres legales' : 'soy progenitor legal'} de los siguientes hijos menores:

${d.children_info || '___'}

Por la presente autorizo/autorizamos a ${d.guardian_name || '___'} para:

1. Consentir todo tratamiento médico, dental, quirúrgico, psiquiátrico y terapéutico para los menores arriba nombrados.

2. Acceder a toda información de salud protegida ("PHI") relacionada con los menores conforme a HIPAA, 45 C.F.R. §164.502(g).

3. Comunicarse con proveedores de salud respecto a diagnóstico, tratamiento y pronóstico.

4. Autorizar la divulgación de registros médicos a terceros según sea razonablemente necesario.

5. Tomar todas las decisiones de salud en nombre de los menores en situaciones de emergencia y no emergencia.

Alergias conocidas: ${d.allergies || 'Ninguna conocida / Ver registros médicos'}
Medicamentos conocidos: ${d.medications || 'Ninguno conocido / Ver registros médicos'}
Seguro de salud: ${d.health_insurance || 'Ver tarjeta de seguro en archivo'}
Pediatra: ${d.pediatrician || 'Ver registros médicos'}

Esta autorización se otorga conforme a un instrumento de Nominación de Guardián fechado ${execDate} y permanecerá vigente hasta que sea revocada por escrito por el/los firmante(s).

Fecha: ________________________

Firma del Padre/Madre: ________________________
${hasTwoParents ? p1 : p1}
${hasTwoParents ? '\nFirma del Padre/Madre: ________________________\n' + p2 : ''}`
      ),
    });
  }

  // ── F.4: EMERGENCY CAREGIVER DECLARATION ──
  // Clause ID: GD_ATTACH_EMERGENCY | Tier: Premium | Trigger: Always on Premium
  sections.push({
    id: 'GD_ATTACH_EMERGENCY', type: 'attachment',
    title: _(
      'ATTACHMENT D — EMERGENCY CAREGIVER DECLARATION',
      'ANEXO D — DECLARACIÓN DE CUIDADOR DE EMERGENCIA'
    ),
    content: _(
      `EMERGENCY CAREGIVER DECLARATION
State of California

This declaration is intended for use during the first seventy-two (72) hours of an emergency when the parent(s) of the below-named minor child(ren) are unavailable.

MINOR CHILD(REN):
${d.children_info || '___'}

EMERGENCY CAREGIVER:
Name: ${d.guardian_name || '___'}
Address: ${d.guardian_address || '___'}
Telephone: ${formatPhone(d.guardian_phone)}
Relationship: ${translateRelationship(d.guardian_relationship, 'en')}

DECLARATION:
I, ${d.guardian_name || '___'}, declare that:

1. I have been designated as Guardian by the parent(s) of the above-named minor child(ren) pursuant to a formal Guardian Nomination instrument.

2. The parent(s) are currently unavailable due to an emergency.

3. I am assuming temporary care of the minor child(ren) to ensure their immediate safety and welfare.

4. I will contact appropriate authorities and seek formal custody arrangements if the parent(s) remain unavailable beyond seventy-two (72) hours.

5. I am a competent adult over the age of eighteen (18) and am not prohibited by law from caring for minor children.

This declaration is made under penalty of perjury under the laws of the State of California.

Date: ________________________    Time: ___________

Signature: ________________________
${d.guardian_name || '___'}`,
      `DECLARACIÓN DE CUIDADOR DE EMERGENCIA
Estado de California

Esta declaración está destinada para uso durante las primeras setenta y dos (72) horas de una emergencia cuando los padres de los menores abajo nombrados no están disponibles.

HIJO(S) MENOR(ES):
${d.children_info || '___'}

CUIDADOR DE EMERGENCIA:
Nombre: ${d.guardian_name || '___'}
Dirección: ${d.guardian_address || '___'}
Teléfono: ${formatPhone(d.guardian_phone)}
Relación: ${translateRelationship(d.guardian_relationship, 'es')}

DECLARACIÓN:
Yo, ${d.guardian_name || '___'}, declaro que:

1. He sido designado/a como Guardián por los padres de los menores arriba nombrados conforme a un instrumento formal de Nominación de Guardián.

2. Los padres no están actualmente disponibles debido a una emergencia.

3. Estoy asumiendo cuidado temporal de los menores para asegurar su seguridad y bienestar inmediatos.

4. Contactaré a las autoridades apropiadas y buscaré arreglos formales de custodia si los padres permanecen no disponibles más allá de setenta y dos (72) horas.

5. Soy un adulto competente mayor de dieciocho (18) años y no estoy prohibido/a por ley de cuidar a menores de edad.

Esta declaración se hace bajo pena de perjurio conforme a las leyes del Estado de California.

Fecha: ________________________    Hora: ___________

Firma: ________________________
${d.guardian_name || '___'}`
    ),
  });

  } // end isPremium gate for attachments

  return sections;
}


// ═══════════════════════════════════════════════════════════════════
// 7. TRAVEL AUTHORIZATION LETTER — INTERNATIONAL MINOR TRAVEL
// ═══════════════════════════════════════════════════════════════════
// U.S. CBP Recommendation | U.S. State Department Advisory
// Mexican Ley de Migración Art. 42 | Central American immigration requirements

export function buildTravelAuthorization(d, lang, executionDate) {
  const sections = [];
  const _ = (en, es) => lang === 'es' ? es : en;

  const authParent = d.authorizing_parent_name || '___';
  const authDOB = d.authorizing_parent_dob ? formatDateLong(d.authorizing_parent_dob, lang) : '___';
  const authAddr = d.authorizing_parent_address || '___';
  const authPhone = formatPhone(d.authorizing_parent_phone);

  const idTypeMap = {
    passport: { en: 'Passport', es: 'Pasaporte' },
    drivers_license: { en: "Driver's License", es: 'Licencia de Conducir' },
    state_id: { en: 'State ID', es: 'Identificación Estatal' },
    consular_id: { en: 'Consular ID (Matrícula)', es: 'Matrícula Consular' },
    other: { en: 'Other', es: 'Otro' },
  };
  const authIdType = idTypeMap[d.authorizing_parent_id_type]?.[lang] || d.authorizing_parent_id_type || '___';
  const authIdNum = d.authorizing_parent_id_number || '___';

  const traveler = d.traveling_adult_name || '___';
  const travelerRel = translateRelationship(d.traveling_adult_relationship, lang);
  const travelerPhone = formatPhone(d.traveling_adult_phone);
  const travelerPassport = d.traveling_adult_passport || '';

  const destination = d.destination_country || '___';
  const departDate = d.departure_date ? formatDateLong(d.departure_date, lang) : '___';
  const returnDate = d.return_date ? formatDateLong(d.return_date, lang) : '___';

  const purposeMap = {
    family_visit: { en: 'Family Visit', es: 'Visita Familiar' },
    vacation: { en: 'Vacation', es: 'Vacaciones' },
    medical: { en: 'Medical Treatment', es: 'Atención Médica' },
    education: { en: 'Education', es: 'Educación' },
    other: { en: 'Other', es: 'Otro' },
  };
  const travelPurpose = purposeMap[d.travel_purpose]?.[lang] || d.travel_purpose || '___';

  // ── SUBTITLE ──
  sections.push({
    id: 'TA_SUB', type: 'paragraph', style: 'subtitle',
    text: _(
      'Parental Consent for International Travel of Minor Children',
      'Consentimiento Parental para Viaje Internacional de Hijos Menores'
    ),
  });

  // ── COMPLIANCE HEADER ──
  sections.push({
    id: 'TA_COMPLIANCE', type: 'paragraph', style: 'compliance_header',
    text: _(
      'U.S. Customs & Border Protection Advisory | U.S. Department of State Travel Recommendation',
      'Aviso de Aduanas y Protección Fronteriza de EE.UU. | Recomendación de Viaje del Departamento de Estado de EE.UU.'
    ),
  });

  // ── ARTICLE I: DECLARATION ──
  sections.push({
    id: 'TA_ART_DECLARATION', type: 'article',
    article_num: 'I',
    title: _('PARENTAL DECLARATION AND AUTHORIZATION', 'DECLARACIÓN Y AUTORIZACIÓN PARENTAL'),
    text: _(
      `I, ${authParent}, date of birth ${authDOB}, currently residing at ${authAddr}, being the natural and/or legal parent of the minor children identified herein, do hereby declare under penalty of perjury pursuant to the laws of the State of California that I am the lawful parent or legal guardian of the children named in this authorization, and that I freely and voluntarily grant my consent for said children to travel internationally as described herein.`,
      `Yo, ${authParent}, fecha de nacimiento ${authDOB}, con domicilio actual en ${authAddr}, en mi calidad de progenitor y representante legal de los menores identificados en el presente documento, declaro bajo pena de perjurio conforme a las leyes del Estado de California que tengo la patria potestad y custodia legal de los menores nombrados en esta autorización, y que libre y voluntariamente otorgo mi consentimiento para que dichos menores viajen internacionalmente según se describe a continuación.`
    ),
    fields: [
      { label: _('Full Legal Name', 'Nombre Legal Completo'), value: authParent },
      { label: _('Date of Birth', 'Fecha de Nacimiento'), value: authDOB },
      { label: _('Address', 'Dirección'), value: authAddr },
      { label: _('Telephone', 'Teléfono'), value: authPhone },
      { label: authIdType, value: authIdNum },
    ],
  });

  // ── ARTICLE II: AUTHORIZED TRAVELER ──
  const travelerFields = [
    { label: _('Full Legal Name', 'Nombre Legal Completo'), value: traveler },
    { label: _('Relationship to Children', 'Relación con los Menores'), value: travelerRel },
    { label: _('Telephone', 'Teléfono'), value: travelerPhone },
  ];
  if (travelerPassport) {
    travelerFields.push({ label: _('Passport Number', 'Número de Pasaporte'), value: travelerPassport });
  }
  sections.push({
    id: 'TA_ART_TRAVELER', type: 'article',
    article_num: 'II',
    title: _('AUTHORIZED TRAVELING ADULT', 'ADULTO AUTORIZADO PARA VIAJAR'),
    text: _(
      `I hereby authorize ${traveler}, who is the ${travelerRel.toLowerCase()} of the minor children listed below, to accompany, transport, and assume temporary responsibility for my children during the international travel described in this authorization. The authorized person shall have the authority to make routine decisions regarding the care and welfare of the children during the travel period, including medical decisions in case of emergency.`,
      `Por la presente autorizo a ${traveler}, quien es ${travelerRel.toLowerCase()} de los menores listados a continuación, para acompañar, transportar y asumir responsabilidad temporal de mis hijos durante el viaje internacional descrito en esta autorización. La persona autorizada tendrá la facultad de tomar decisiones rutinarias respecto al cuidado y bienestar de los menores durante el período de viaje, incluyendo decisiones médicas en caso de emergencia.`
    ),
    fields: travelerFields,
  });

  // ── ARTICLE III: MINOR CHILDREN ──
  // Parse children_info textarea into structured child entries
  const childrenRaw = (d.children_info || '').trim();
  const childLines = childrenRaw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const childGroups = [];
  let childNum = 1;
  for (const line of childLines) {
    // Expected: "Name - MM/DD/YYYY - Passport: 123456" or variations
    const parts = line.split(/\s*[-–—]\s*/);
    const childName = parts[0] || '___';
    const childDOB = parts[1] ? formatDateLong(parts[1].trim(), lang) : '___';
    let childPassport = '';
    if (parts[2]) {
      childPassport = parts[2].replace(/^(passport|pasaporte)\s*[:：]\s*/i, '').trim();
    }
    const childFields = [
      { label: _('Full Legal Name', 'Nombre Legal Completo'), value: childName },
      { label: _('Date of Birth', 'Fecha de Nacimiento'), value: childDOB },
    ];
    if (childPassport) {
      childFields.push({ label: _('Passport Number', 'Número de Pasaporte'), value: childPassport });
    }
    childGroups.push({
      title: _(`Minor ${childNum}`, `Menor ${childNum}`),
      fields: childFields,
    });
    childNum++;
  }
  // Fallback if no children parsed
  if (childGroups.length === 0) {
    childGroups.push({
      title: _('Minor 1', 'Menor 1'),
      fields: [
        { label: _('Full Legal Name', 'Nombre Legal Completo'), value: '___' },
        { label: _('Date of Birth', 'Fecha de Nacimiento'), value: '___' },
      ],
    });
  }

  sections.push({
    id: 'TA_ART_CHILDREN', type: 'article',
    article_num: 'III',
    title: _('MINOR CHILDREN AUTHORIZED TO TRAVEL', 'MENORES AUTORIZADOS PARA VIAJAR'),
    text: _(
      'This authorization applies to the following minor children. It is recommended that each child carry a certified copy of their birth certificate and, if applicable, a valid passport.',
      'Esta autorización aplica a los siguientes menores. Se recomienda que cada menor lleve una copia certificada de su acta de nacimiento y, si aplica, un pasaporte vigente.'
    ),
    field_groups: childGroups,
  });

  // ── ARTICLE IV: TRAVEL DETAILS ──
  sections.push({
    id: 'TA_ART_TRAVEL', type: 'article',
    article_num: 'IV',
    title: _('TRAVEL DETAILS', 'DETALLES DEL VIAJE'),
    text: _(
      'The authorized travel is specifically limited to the following itinerary:',
      'El viaje autorizado se limita específicamente al siguiente itinerario:'
    ),
    fields: [
      { label: _('Destination Country', 'País de Destino'), value: destination },
      { label: _('Departure Date', 'Fecha de Salida'), value: departDate },
      { label: _('Return Date', 'Fecha de Regreso'), value: returnDate },
      { label: _('Purpose of Travel', 'Propósito del Viaje'), value: travelPurpose },
    ],
    posttext: _(
      'This authorization is valid only for the travel dates and destination specified above. Any changes to the itinerary, extension of travel dates, or travel to a country not specified herein are not authorized by this document and would require a separate written authorization.',
      'Esta autorización es válida únicamente para las fechas de viaje y destino especificados anteriormente. Cualquier cambio al itinerario, extensión de fechas de viaje, o viaje a un país no especificado en el presente no están autorizados por este documento y requerirían una autorización escrita por separado.'
    ),
  });

  // ── ARTICLE V: SPECIAL INSTRUCTIONS ──
  if (d.special_instructions) {
    sections.push({
      id: 'TA_ART_SPECIAL', type: 'article',
      article_num: 'V',
      title: _('SPECIAL INSTRUCTIONS AND EMERGENCY INFORMATION', 'INSTRUCCIONES ESPECIALES E INFORMACIÓN DE EMERGENCIA'),
      text: d.special_instructions,
    });
  }

  // ── ARTICLE VI: LEGAL NOTICE ──
  const legalArt = d.special_instructions ? 'VI' : 'V';
  sections.push({
    id: 'TA_ART_LEGAL', type: 'article',
    article_num: legalArt,
    title: _('LEGAL NOTICE AND ADVISORY', 'AVISO LEGAL Y ASESORÍA'),
    text: _(
      `This letter of consent is provided in accordance with the recommendations of the U.S. Department of State and U.S. Customs and Border Protection (CBP) for minors traveling internationally. While no U.S. federal law requires this document, CBP officers may request proof of parental consent when a minor crosses the U.S. border accompanied by only one parent or a non-parent adult. Additionally, many countries require written parental authorization for minors entering or exiting their territory with only one parent or a non-parent, including Mexico (Ley de Migración, Artículo 42), Guatemala, Honduras, El Salvador, Colombia, Peru, Brazil, Argentina, Chile, Ecuador, Bolivia, Paraguay, Uruguay, Dominican Republic, Costa Rica, Panama, and Nicaragua.\n\nIt is strongly recommended that this document be notarized to ensure acceptance by border authorities. The authorizing parent should carry a form of government-issued identification matching the information in this document.`,
      `Esta carta de consentimiento se proporciona de acuerdo con las recomendaciones del Departamento de Estado de EE.UU. y la Oficina de Aduanas y Protección Fronteriza (CBP) para menores que viajan internacionalmente. Si bien ninguna ley federal de EE.UU. requiere este documento, los oficiales de CBP pueden solicitar prueba de consentimiento parental cuando un menor cruza la frontera de EE.UU. acompañado por solo uno de sus progenitores o por un adulto sin parentesco directo. Adicionalmente, muchos países requieren autorización parental escrita para menores que entran o salen de su territorio acompañados por un solo progenitor o por un tercero, incluyendo México (Ley de Migración, Artículo 42), Guatemala, Honduras, El Salvador, Colombia, Perú, Brasil, Argentina, Chile, Ecuador, Bolivia, Paraguay, Uruguay, República Dominicana, Costa Rica, Panamá y Nicaragua.\n\nSe recomienda encarecidamente que este documento sea notarizado para asegurar su aceptación por las autoridades fronterizas. La persona que otorga esta autorización debe portar una identificación oficial que coincida con la información de este documento.`
    ),
  });

  // ── ARTICLE VII: GOVERNING LAW ──
  const govArt = d.special_instructions ? 'VII' : 'VI';
  sections.push({
    id: 'TA_ART_LAW', type: 'article',
    article_num: govArt,
    title: _('GOVERNING LAW', 'LEY APLICABLE'),
    text: _(
      'This authorization shall be governed by the laws of the State of California. This document constitutes a voluntary expression of parental consent and is not a court order.',
      'Esta autorización se regirá por las leyes del Estado de California. Este documento constituye una expresión voluntaria de consentimiento parental y no es una orden judicial.'
    ),
  });

  // ── EXECUTION ──
  const execDate = formatDateLong(executionDate, lang);
  sections.push({
    id: 'TA_EXEC', type: 'paragraph', style: 'execution',
    text: _(
      `IN WITNESS WHEREOF, I have executed this Travel Authorization on ${execDate}, in the State of California, freely and voluntarily.`,
      `EN FE DE LO CUAL, he ejecutado esta Autorización de Viaje el ${execDate}, en el Estado de California, libre y voluntariamente.`
    ),
  });

  // ── SIGNATURE BLOCK ──
  sections.push({
    id: 'TA_SIG', type: 'signatures',
    blocks: [
      { label: _('Authorizing Parent Signature', 'Firma de Autorización Parental'), name: authParent },
    ],
  });

  // NOTE: No witness block — this document requires notarization.
  // The notary acknowledgment page is appended as a separate PDF by the renderer.

  return sections;
}


// ═══════════════════════════════════════════════════════════════════
// MASTER BUILDER — Routes doc type to clause library
// ═══════════════════════════════════════════════════════════════════

export function buildDocument(docType, formData, lang, executionDate) {
  switch (docType) {
    case 'bill_of_sale': return buildBillOfSale(formData, lang, executionDate);
    case 'affidavit': return buildAffidavit(formData, lang, executionDate);
    case 'revocation_poa': return buildRevocationPOA(formData, lang, executionDate);
    case 'authorization_letter': return buildAuthorizationLetter(formData, lang, executionDate);
    case 'promissory_note': return buildPromissoryNote(formData, lang, executionDate);
    case 'guardianship_designation': return buildGuardianshipDesignation(formData, lang, executionDate);
    case 'travel_authorization': return buildTravelAuthorization(formData, lang, executionDate);
    // Estate Planning
    case 'pour_over_will': return buildPourOverWill(formData, lang, executionDate);
    case 'simple_will': return buildSimpleWill(formData, lang, executionDate);
    case 'hipaa_authorization': return buildHipaaAuthorization(formData, lang, executionDate);
    case 'certification_of_trust': return buildCertificationOfTrust(formData, lang, executionDate);
    // Corporate
    case 's_corp_formation': return buildSCorpFormation(formData, lang, executionDate);
    case 'c_corp_formation': return buildCCorpFormation(formData, lang, executionDate);
    case 'corporate_minutes': return buildCorporateMinutes(formData, lang, executionDate);
    case 'banking_resolution': return buildBankingResolution(formData, lang, executionDate);
    // Phase 2 Documents
    case 'small_estate_affidavit': return buildSmallEstateAffidavit(formData, lang, executionDate);
    case 'quitclaim_deed': return buildQuitclaimDeed(formData, lang, executionDate);
    case 'contractor_agreement': return buildContractorAgreement(formData, lang, executionDate);
    case 'demand_letter': return buildDemandLetter(formData, lang, executionDate);
    case 'apostille_letter': return buildApostilleLetter(formData, lang, executionDate);
    default: return [];
  }
}


// ═══════════════════════════════════════════════════════════════════
// ESTATE PLANNING + CORPORATE DOCUMENTS — CALIFORNIA
// Attorney-reviewed clauses — Multi Servicios 360
// ═══════════════════════════════════════════════════════════════════

// ── POUR OVER WILL ──────────────────────────────────────────────────
export function buildPourOverWill(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  const sections = [];
  const execDate = formatDateLong(executionDate, lang);

  const testatorName = d.testator_name || '________________________';
  const county = d.county || '________________________';
  const trustName = d.trust_name || '________________________';
  const trustDate = d.trust_date ? formatDateLong(d.trust_date, lang) : '________________________';
  const executorName = d.executor_name || '________________________';
  const altExecutorName = d.alternate_executor || '________________________';
  const guardianName = d.guardian_name || null;
  const hasMinorChildren = d.has_minor_children === 'yes';
  const maritalStatus = d.marital_status || 'unmarried';
  const spouseName = d.spouse_name || '';
  const childrenNames = d.children_names || '';

  // Title
  sections.push({
    id: 'POW_TITLE', type: 'title',
    text: _('LAST WILL AND TESTAMENT', 'TESTAMENTO'),
    subtitle: _(`OF ${testatorName.toUpperCase()}`, `DE ${testatorName.toUpperCase()}`),
  });

  // Platform disclaimer
  sections.push({
    id: 'POW_DISCLAIMER', type: 'notice',
    text: _(
      'This platform provides self-help legal document preparation. We are not a law firm and do not provide legal advice. California Probate Code §6110 requires 2 adult witnesses for a valid will. This document does NOT avoid probate unless assets are properly funded into the referenced trust.',
      'Esta plataforma proporciona preparación de documentos legales de autoayuda. No somos un bufete de abogados y no proporcionamos asesoramiento legal. El Código de Sucesiones de California §6110 requiere 2 testigos adultos para un testamento válido. Este documento NO evita el proceso sucesorio a menos que los activos estén debidamente financiados en el fideicomiso referenciado.'
    ),
  });

  // Article I - Declaration
  sections.push({
    id: 'POW_ART1', type: 'article', article_num: 'I',
    title: _('DECLARATION', 'DECLARACIÓN'),
    text: _(
      `I, ${testatorName}, a resident of ${county}, California, declare this to be my Last Will and Testament and hereby revoke all prior wills and codicils.\n\nMarital status: ${maritalStatus === 'married' ? `I am married to ${spouseName}.` : 'I am not married.'}\n${childrenNames ? `My children are: ${childrenNames}.` : ''}`,
      `Yo, ${testatorName}, residente de ${county}, California, declaro que este es mi Testamento y por medio del presente revoco todos los testamentos y codicilos anteriores.\n\nEstado civil: ${maritalStatus === 'married' ? `Estoy casado/a con ${spouseName}.` : 'No estoy casado/a.'}\n${childrenNames ? `Mis hijos son: ${childrenNames}.` : ''}`
    ),
  });

  // Article II - Trust Identification
  sections.push({
    id: 'POW_ART2', type: 'article', article_num: 'II',
    title: _('IDENTIFICATION OF EXISTING TRUST', 'IDENTIFICACIÓN DEL FIDEICOMISO EXISTENTE'),
    text: _(
      `I have established a revocable living trust known as the "${trustName}" dated ${trustDate}, including any amendments thereto. Any reference in this Will to my trust shall refer to that trust as it exists at my death. (Authority: California Probate Code §6300 et seq.)`,
      `He establecido un fideicomiso en vida revocable conocido como el "${trustName}" con fecha ${trustDate}, incluyendo cualquier enmienda al mismo. Cualquier referencia en este Testamento a mi fideicomiso se referirá a ese fideicomiso tal como existe al momento de mi fallecimiento. (Autoridad: Código de Sucesiones de California §6300 et seq.)`
    ),
  });

  // Article III - Pour Over Clause
  sections.push({
    id: 'POW_ART3', type: 'article', article_num: 'III',
    title: _('POUR-OVER TRANSFER', 'TRANSFERENCIA RESIDUAL AL FIDEICOMISO'),
    text: _(
      'I give, devise, and bequeath all of the rest, residue, and remainder of my estate, including any property over which I have a power of appointment, to the Trustee then serving under my above-referenced trust, to be added to, administered, and distributed according to the terms of that trust as it exists at my death.',
      'Doy, legado y transmito todo el resto, residuo y remanente de mi patrimonio, incluyendo cualquier propiedad sobre la cual tenga un poder de nombramiento, al Fiduciario que sirva bajo mi fideicomiso antes referenciado, para ser añadido, administrado y distribuido de acuerdo con los términos de ese fideicomiso tal como existe al momento de mi fallecimiento.'
    ),
  });

  // Article IV - Executor
  sections.push({
    id: 'POW_ART4', type: 'article', article_num: 'IV',
    title: _('EXECUTOR APPOINTMENT', 'NOMBRAMIENTO DE EJECUTOR'),
    text: _(
      `I nominate ${executorName} as Executor of this Will. If ${executorName} fails or ceases to serve for any reason, I nominate ${altExecutorName} as Alternate Executor.\n\nNo bond shall be required of any Executor named herein, pursuant to California Probate Code §8480.\n\nThe Executor shall have full authority as permitted under Probate Code §9600–§10592, including the right to sell real and personal property without court supervision.`,
      `Nombro a ${executorName} como Ejecutor/a de este Testamento. Si ${executorName} no puede o deja de servir por cualquier razón, nombro a ${altExecutorName} como Ejecutor/a Alterno/a.\n\nNo se requerirá fianza de ningún Ejecutor nombrado en el presente, de conformidad con el Código de Sucesiones de California §8480.\n\nEl Ejecutor tendrá plena autoridad según lo permitido por el Código de Sucesiones §9600–§10592, incluyendo el derecho a vender bienes inmuebles y personales sin supervisión judicial.`
    ),
  });

  // Article V - Guardian (if applicable)
  if (hasMinorChildren && guardianName) {
    sections.push({
      id: 'POW_ART5', type: 'article', article_num: 'V',
      title: _('GUARDIAN OF MINOR CHILDREN', 'GUARDIÁN DE HIJOS MENORES'),
      text: _(
        `I nominate ${guardianName} as Guardian of the person and estate of my minor children. This nomination is made pursuant to California Probate Code §1500 et seq. If the nominated Guardian is unable or unwilling to serve, the court shall appoint the most suitable guardian.`,
        `Nombro a ${guardianName} como Guardián de la persona y patrimonio de mis hijos menores. Esta nominación se hace de conformidad con el Código de Sucesiones de California §1500 et seq. Si el Guardián nominado no puede o no desea servir, el tribunal nombrará al guardián más adecuado.`
      ),
    });
  }

  // Article VI - Simultaneous Death
  const simArtNum = hasMinorChildren && guardianName ? 'VI' : 'V';
  sections.push({
    id: 'POW_ART6', type: 'article', article_num: simArtNum,
    title: _('SIMULTANEOUS DEATH', 'MUERTE SIMULTÁNEA'),
    text: _(
      'If my spouse and I die simultaneously or under circumstances in which the order of our deaths cannot be determined, all property shall be distributed as though my spouse predeceased me. (Reference: California Probate Code §220)',
      'Si mi cónyuge y yo fallecemos simultáneamente o en circunstancias en que el orden de nuestras muertes no pueda determinarse, todos los bienes se distribuirán como si mi cónyuge me hubiera sobrevivido. (Referencia: Código de Sucesiones de California §220)'
    ),
  });

  // No Contest Clause
  const ncArtNum = hasMinorChildren && guardianName ? 'VII' : 'VI';
  sections.push({
    id: 'POW_ART7', type: 'article', article_num: ncArtNum,
    title: _('NO CONTEST CLAUSE', 'CLÁUSULA DE NO IMPUGNACIÓN'),
    text: _(
      'If any person named in this Will contests the validity of this Will, any provision of this Will, or any trust created by this Will, that person shall forfeit any interest given to them under this Will or under any trust created by this Will. (Reference: California Probate Code §21310–§21315)',
      'Si alguna persona nombrada en este Testamento impugna la validez de este Testamento, cualquier disposición de este Testamento o cualquier fideicomiso creado por este Testamento, esa persona perderá cualquier interés otorgado a ella bajo este Testamento o bajo cualquier fideicomiso creado por este Testamento. (Referencia: Código de Sucesiones de California §21310–§21315)'
    ),
  });

  // Execution
  sections.push({
    id: 'POW_EXEC', type: 'paragraph', style: 'execution',
    text: _(
      `The foregoing instrument is my Last Will and Testament. I sign and execute this instrument as my Will on ${execDate}, at ${county} County, California, and declare that I sign and execute this instrument willingly, that I execute it as my free and voluntary act, and that I am 18 years of age or older, of sound mind, and under no constraint or undue influence.`,
      `El instrumento anterior es mi Testamento. Firmo y ejecuto este instrumento como mi Testamento el ${execDate}, en el Condado de ${county}, California, y declaro que lo firmo y ejecuto voluntariamente, que lo ejecuto como un acto libre y voluntario, y que tengo 18 años de edad o más, en plena capacidad mental, y sin restricción ni influencia indebida.`
    ),
  });

  sections.push({
    id: 'POW_SIG', type: 'signatures',
    blocks: [{ label: _('Testator Signature', 'Firma del Testador'), name: testatorName }],
  });

  // Witness block
  sections.push({
    id: 'POW_WITNESS', type: 'witnesses',
    title: _('WITNESS ATTESTATION', 'ATESTACIÓN DE TESTIGOS'),
    instructions: _(
      'California Probate Code §6110 requires TWO (2) adult witnesses who are present at the time of signing. Witnesses should NOT be beneficiaries of this Will.',
      'El Código de Sucesiones de California §6110 requiere DOS (2) testigos adultos que estén presentes al momento de la firma. Los testigos NO deben ser beneficiarios de este Testamento.'
    ),
    attestation: _(
      `The foregoing instrument was signed by ${testatorName} as their Will in our presence, and we, at their request and in their presence and in the presence of each other, subscribe our names as witnesses thereto, believing said Testator to be of sound mind and under no constraint or undue influence.`,
      `El instrumento anterior fue firmado por ${testatorName} como su Testamento en nuestra presencia, y nosotros, a su solicitud y en su presencia y en presencia mutua, suscribimos nuestros nombres como testigos del mismo, creyendo que dicho Testador/a está en plena capacidad mental y sin restricción ni influencia indebida.`
    ),
    blocks: [
      { label: _('Witness 1 — Name & Address', 'Testigo 1 — Nombre y Dirección'), name: '' },
      { label: _('Witness 2 — Name & Address', 'Testigo 2 — Nombre y Dirección'), name: '' },
    ],
  });

  return sections;
}

// ── SIMPLE WILL ──────────────────────────────────────────────────────
export function buildSimpleWill(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  const sections = [];
  const execDate = formatDateLong(executionDate, lang);

  const testatorName = d.testator_name || '________________________';
  const county = d.county || '________________________';
  const executorName = d.executor_name || '________________________';
  const altExecutorName = d.alternate_executor || '________________________';
  const beneficiaryName = d.beneficiary_name || '________________________';
  const alternateBeneficiary = d.alternate_beneficiary || '________________________';
  const guardianName = d.guardian_name || null;
  const hasMinorChildren = d.has_minor_children === 'yes';
  const maritalStatus = d.marital_status || 'unmarried';
  const spouseName = d.spouse_name || '';
  const childrenNames = d.children_names || '';
  const specialBequests = d.special_bequests || '';

  sections.push({
    id: 'SW_TITLE', type: 'title',
    text: _('LAST WILL AND TESTAMENT', 'TESTAMENTO'),
    subtitle: _(`OF ${testatorName.toUpperCase()}`, `DE ${testatorName.toUpperCase()}`),
  });

  sections.push({
    id: 'SW_DISCLAIMER', type: 'notice',
    text: _(
      'This platform provides self-help legal document preparation. We are not a law firm and do not provide legal advice. California Probate Code §6110 requires 2 adult witnesses. This Will is subject to probate unless your estate qualifies for simplified procedures.',
      'Esta plataforma proporciona preparación de documentos legales de autoayuda. No somos un bufete de abogados y no proporcionamos asesoramiento legal. El Código de Sucesiones de California §6110 requiere 2 testigos adultos. Este testamento está sujeto a proceso sucesorio a menos que su patrimonio califique para procedimientos simplificados.'
    ),
  });

  sections.push({
    id: 'SW_ART1', type: 'article', article_num: 'I',
    title: _('DECLARATION', 'DECLARACIÓN'),
    text: _(
      `I, ${testatorName}, a resident of ${county}, California, declare this to be my Last Will and Testament and hereby revoke all prior wills and codicils.\n\n${maritalStatus === 'married' ? `I am married to ${spouseName}.` : 'I am not married.'}\n${childrenNames ? `My children are: ${childrenNames}.` : ''}`,
      `Yo, ${testatorName}, residente de ${county}, California, declaro que este es mi Testamento y por medio del presente revoco todos los testamentos y codicilos anteriores.\n\n${maritalStatus === 'married' ? `Estoy casado/a con ${spouseName}.` : 'No estoy casado/a.'}\n${childrenNames ? `Mis hijos son: ${childrenNames}.` : ''}`
    ),
  });

  sections.push({
    id: 'SW_ART2', type: 'article', article_num: 'II',
    title: _('DISTRIBUTION OF ESTATE', 'DISTRIBUCIÓN DEL PATRIMONIO'),
    text: _(
      `I give my entire estate, both real and personal, wherever situated, to ${beneficiaryName}. If ${beneficiaryName} does not survive me by thirty (30) days, I give my entire estate to ${alternateBeneficiary}.\n${specialBequests ? `\nSpecific bequests: ${specialBequests}` : ''}`,
      `Doy todo mi patrimonio, tanto inmueble como personal, donde quiera que esté situado, a ${beneficiaryName}. Si ${beneficiaryName} no me sobrevive en treinta (30) días, doy todo mi patrimonio a ${alternateBeneficiary}.\n${specialBequests ? `\nLegados específicos: ${specialBequests}` : ''}`
    ),
  });

  sections.push({
    id: 'SW_ART3', type: 'article', article_num: 'III',
    title: _('EXECUTOR APPOINTMENT', 'NOMBRAMIENTO DE EJECUTOR'),
    text: _(
      `I nominate ${executorName} as Executor of this Will. If ${executorName} fails or ceases to serve, I nominate ${altExecutorName} as Alternate Executor. No bond shall be required. The Executor shall have full authority under California Probate Code §9600–§10592.`,
      `Nombro a ${executorName} como Ejecutor/a de este Testamento. Si ${executorName} no puede servir, nombro a ${altExecutorName} como Ejecutor/a Alterno/a. No se requerirá fianza. El Ejecutor tendrá plena autoridad bajo el Código de Sucesiones de California §9600–§10592.`
    ),
  });

  if (hasMinorChildren && guardianName) {
    sections.push({
      id: 'SW_ART4', type: 'article', article_num: 'IV',
      title: _('GUARDIAN OF MINOR CHILDREN', 'GUARDIÁN DE HIJOS MENORES'),
      text: _(
        `I nominate ${guardianName} as Guardian of the person and estate of my minor children, pursuant to California Probate Code §1500 et seq.`,
        `Nombro a ${guardianName} como Guardián de la persona y patrimonio de mis hijos menores, de conformidad con el Código de Sucesiones de California §1500 et seq.`
      ),
    });
  }

  const simArtNum = hasMinorChildren && guardianName ? 'V' : 'IV';
  sections.push({
    id: 'SW_ART_SIM', type: 'article', article_num: simArtNum,
    title: _('SIMULTANEOUS DEATH', 'MUERTE SIMULTÁNEA'),
    text: _(
      'If any beneficiary and I die simultaneously, the beneficiary shall be deemed to have predeceased me. (Reference: California Probate Code §220)',
      'Si algún beneficiario y yo fallecemos simultáneamente, se considerará que el beneficiario me predececió. (Referencia: Código de Sucesiones de California §220)'
    ),
  });

  sections.push({
    id: 'SW_EXEC', type: 'paragraph', style: 'execution',
    text: _(
      `The foregoing is my Last Will and Testament. I sign this instrument on ${execDate}, at ${county} County, California, as my free and voluntary act, being of sound mind and 18 years of age or older.`,
      `Lo anterior es mi Testamento. Firmo este instrumento el ${execDate}, en el Condado de ${county}, California, como un acto libre y voluntario, estando en plena capacidad mental y teniendo 18 años de edad o más.`
    ),
  });

  sections.push({
    id: 'SW_SIG', type: 'signatures',
    blocks: [{ label: _('Testator Signature', 'Firma del Testador'), name: testatorName }],
  });

  sections.push({
    id: 'SW_WITNESS', type: 'witnesses',
    title: _('WITNESS ATTESTATION', 'ATESTACIÓN DE TESTIGOS'),
    instructions: _(
      'TWO (2) adult witnesses required. Witnesses should NOT be beneficiaries. (California Probate Code §6110)',
      'Se requieren DOS (2) testigos adultos. Los testigos NO deben ser beneficiarios. (Código de Sucesiones de California §6110)'
    ),
    attestation: _(
      `The foregoing instrument was signed by ${testatorName} as their Will in our presence, and we subscribe our names as witnesses, believing said Testator to be of sound mind and under no constraint.`,
      `El instrumento anterior fue firmado por ${testatorName} como su Testamento en nuestra presencia, y suscribimos nuestros nombres como testigos, creyendo que el Testador/a está en plena capacidad mental y sin restricción.`
    ),
    blocks: [
      { label: _('Witness 1 — Name & Address', 'Testigo 1 — Nombre y Dirección'), name: '' },
      { label: _('Witness 2 — Name & Address', 'Testigo 2 — Nombre y Dirección'), name: '' },
    ],
  });

  return sections;
}

// ── HIPAA AUTHORIZATION ──────────────────────────────────────────────
export function buildHipaaAuthorization(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  const sections = [];
  const execDate = formatDateLong(executionDate, lang);

  const patientName = d.patient_name || '________________________';
  const agentName = d.agent_name || '________________________';
  const agentRelationship = d.agent_relationship || '________________________';
  const altAgentName = d.alternate_agent || '';
  const dob = d.date_of_birth ? formatDateLong(d.date_of_birth, lang) : '________________________';

  sections.push({
    id: 'HIPAA_TITLE', type: 'title',
    text: _('HIPAA AUTHORIZATION FOR RELEASE OF PROTECTED HEALTH INFORMATION', 'AUTORIZACIÓN HIPAA PARA DIVULGACIÓN DE INFORMACIÓN DE SALUD PROTEGIDA'),
    subtitle: _('Federal HIPAA (45 CFR §164.508) & California CMIA (Civil Code §56.10) Compliant', 'Cumple con HIPAA Federal (45 CFR §164.508) y CMIA de California (Código Civil §56.10)'),
  });

  sections.push({
    id: 'HIPAA_DISCLAIMER', type: 'notice',
    text: _(
      'This authorization is NOT an Advance Health Care Directive. It authorizes disclosure of health information only. For decisions about medical treatment, consult a California Advance Health Care Directive. This platform provides self-help document preparation only and does not provide legal or medical advice.',
      'Esta autorización NO es una Directiva Anticipada de Atención Médica. Solo autoriza la divulgación de información de salud. Para decisiones sobre tratamiento médico, consulte una Directiva Anticipada de Atención Médica de California. Esta plataforma solo proporciona preparación de documentos de autoayuda y no proporciona asesoramiento legal o médico.'
    ),
  });

  sections.push({
    id: 'HIPAA_ART1', type: 'article', article_num: 'I',
    title: _('PATIENT INFORMATION', 'INFORMACIÓN DEL PACIENTE'),
    fields: [
      { label: _('Patient Full Legal Name', 'Nombre Legal Completo del Paciente'), value: patientName },
      { label: _('Date of Birth', 'Fecha de Nacimiento'), value: dob },
    ],
  });

  sections.push({
    id: 'HIPAA_ART2', type: 'article', article_num: 'II',
    title: _('AUTHORIZED RECIPIENT', 'DESTINATARIO AUTORIZADO'),
    text: _(
      `I, ${patientName}, authorize any health care provider, hospital, physician, insurance company, pharmacy, or other health care entity to disclose my protected health information to:\n\nAgent: ${agentName}\nRelationship: ${agentRelationship}${altAgentName ? `\nAlternate Agent: ${altAgentName}` : ''}`,
      `Yo, ${patientName}, autorizo a cualquier proveedor de atención médica, hospital, médico, compañía de seguros, farmacia u otra entidad de atención médica a divulgar mi información de salud protegida a:\n\nAgente: ${agentName}\nRelación: ${agentRelationship}${altAgentName ? `\nAgente Alternativo: ${altAgentName}` : ''}`
    ),
  });

  sections.push({
    id: 'HIPAA_ART3', type: 'article', article_num: 'III',
    title: _('SCOPE OF DISCLOSURE', 'ALCANCE DE LA DIVULGACIÓN'),
    text: _(
      'This authorization includes all protected health information, including but not limited to:\n\n• Medical records, diagnoses, and treatment history\n• Psychiatric and mental health records\n• HIV/AIDS status and treatment records\n• Substance abuse and drug/alcohol treatment records\n• Genetic testing information and results\n• Billing and insurance records\n• All records from any health care provider who has treated me\n\nThis authorization is intended to permit my agent to make informed health care decisions on my behalf when I am unable to do so.',
      'Esta autorización incluye toda la información de salud protegida, incluyendo pero no limitándose a:\n\n• Registros médicos, diagnósticos e historial de tratamiento\n• Registros psiquiátricos y de salud mental\n• Estado y registros de tratamiento de VIH/SIDA\n• Registros de abuso de sustancias y tratamiento de drogas/alcohol\n• Información y resultados de pruebas genéticas\n• Registros de facturación y seguros\n• Todos los registros de cualquier proveedor de atención médica que me haya tratado\n\nEsta autorización tiene la intención de permitir que mi agente tome decisiones informadas sobre mi atención médica cuando yo no pueda hacerlo.'
    ),
  });

  sections.push({
    id: 'HIPAA_ART4', type: 'article', article_num: 'IV',
    title: _('LEGAL COMPLIANCE', 'CUMPLIMIENTO LEGAL'),
    text: _(
      'This authorization is intended to comply with the federal Health Insurance Portability and Accountability Act (HIPAA), 45 CFR §164.508, and the California Confidentiality of Medical Information Act (CMIA), California Civil Code §56.10. This authorization supersedes any prior authorization for release of medical records.',
      'Esta autorización tiene la intención de cumplir con la Ley Federal de Portabilidad y Responsabilidad del Seguro Médico (HIPAA), 45 CFR §164.508, y la Ley de Confidencialidad de Información Médica de California (CMIA), Código Civil de California §56.10. Esta autorización reemplaza cualquier autorización anterior para la divulgación de registros médicos.'
    ),
  });

  sections.push({
    id: 'HIPAA_ART5', type: 'article', article_num: 'V',
    title: _('EXPIRATION AND REVOCATION', 'VENCIMIENTO Y REVOCACIÓN'),
    text: _(
      'This authorization shall remain in full force and effect until revoked in writing by the patient or until my death, whichever occurs first. I have the right to revoke this authorization at any time by providing written notice to my health care providers. Revocation will not affect any disclosures already made in reliance on this authorization.',
      'Esta autorización permanecerá en plena vigencia hasta que sea revocada por escrito por el paciente o hasta mi fallecimiento, lo que ocurra primero. Tengo el derecho de revocar esta autorización en cualquier momento proporcionando aviso por escrito a mis proveedores de atención médica. La revocación no afectará las divulgaciones ya realizadas en virtud de esta autorización.'
    ),
  });

  sections.push({
    id: 'HIPAA_EXEC', type: 'paragraph', style: 'execution',
    text: _(
      `I have read and understand the above authorization. I sign this authorization freely and voluntarily on ${execDate}.`,
      `He leído y entendido la autorización anterior. Firmo esta autorización libre y voluntariamente el ${execDate}.`
    ),
  });

  sections.push({
    id: 'HIPAA_SIG', type: 'signatures',
    blocks: [{ label: _('Patient Signature', 'Firma del Paciente'), name: patientName }],
  });

  return sections;
}

// ── CERTIFICATION OF TRUST ───────────────────────────────────────────
export function buildCertificationOfTrust(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  const sections = [];
  const execDate = formatDateLong(executionDate, lang);

  const trustName = d.trust_name || '________________________';
  const trustDate = d.trust_date ? formatDateLong(d.trust_date, lang) : '________________________';
  const trusteeName = d.trustee_name || '________________________';
  const coTrusteeName = d.co_trustee_name || '';
  const successorTrustee = d.successor_trustee || '________________________';
  const isRevocable = d.trust_type !== 'irrevocable';
  const county = d.county || '________________________';
  const trustorName = d.trustor_name || '________________________';

  sections.push({
    id: 'COT_TITLE', type: 'title',
    text: _('CERTIFICATION OF TRUST', 'CERTIFICACIÓN DE FIDEICOMISO'),
    subtitle: _('California Probate Code §18100.5', 'Código de Sucesiones de California §18100.5'),
  });

  sections.push({
    id: 'COT_INTRO', type: 'paragraph',
    text: _(
      `The undersigned Trustee(s) hereby certify the following facts about the trust described herein, pursuant to California Probate Code §18100.5:`,
      `Los Fiduciario(s) abajo firmantes certifican por medio del presente los siguientes hechos sobre el fideicomiso aquí descrito, de conformidad con el Código de Sucesiones de California §18100.5:`
    ),
  });

  sections.push({
    id: 'COT_ART1', type: 'article', article_num: '1',
    title: _('TRUST IDENTIFICATION', 'IDENTIFICACIÓN DEL FIDEICOMISO'),
    fields: [
      { label: _('Trust Name', 'Nombre del Fideicomiso'), value: trustName },
      { label: _('Date of Trust', 'Fecha del Fideicomiso'), value: trustDate },
      { label: _('Trustor/Settlor Name', 'Nombre del Fideicomitente'), value: trustorName },
      { label: _('County of Execution', 'Condado de Ejecución'), value: county },
    ],
  });

  sections.push({
    id: 'COT_ART2', type: 'article', article_num: '2',
    title: _('TRUST STATUS', 'ESTADO DEL FIDEICOMISO'),
    text: _(
      `The trust is currently in full force and effect and has not been revoked, rescinded, or otherwise terminated. The trust is ${isRevocable ? 'revocable and may be amended or revoked by the Trustor during their lifetime' : 'irrevocable and cannot be modified without court approval'}.`,
      `El fideicomiso se encuentra actualmente en plena vigencia y no ha sido revocado, rescindido ni de otra manera terminado. El fideicomiso es ${isRevocable ? 'revocable y puede ser enmendado o revocado por el Fideicomitente durante su vida' : 'irrevocable y no puede ser modificado sin aprobación judicial'}.`
    ),
  });

  sections.push({
    id: 'COT_ART3', type: 'article', article_num: '3',
    title: _('TRUSTEE AUTHORITY', 'AUTORIDAD DEL FIDUCIARIO'),
    text: _(
      `The currently acting Trustee(s) of the trust are:\n\nTrustee: ${trusteeName}${coTrusteeName ? `\nCo-Trustee: ${coTrusteeName}` : ''}\nSuccessor Trustee: ${successorTrustee}\n\nThe Trustee has full authority to transact business on behalf of the trust, including but not limited to: opening and managing bank and investment accounts, purchasing and selling real property, entering into contracts, and managing trust assets.`,
      `Los Fiduciario(s) actualmente en funciones del fideicomiso son:\n\nFiduciario: ${trusteeName}${coTrusteeName ? `\nCo-Fiduciario: ${coTrusteeName}` : ''}\nFiduciario Sucesor: ${successorTrustee}\n\nEl Fiduciario tiene plena autoridad para realizar transacciones comerciales en nombre del fideicomiso, incluyendo pero no limitándose a: abrir y administrar cuentas bancarias y de inversión, comprar y vender bienes raíces, celebrar contratos y administrar los activos del fideicomiso.`
    ),
  });

  sections.push({
    id: 'COT_ART4', type: 'article', article_num: '4',
    title: _('STATUTORY PROTECTION', 'PROTECCIÓN ESTATUTARIA'),
    text: _(
      'This Certification is provided pursuant to California Probate Code §18100.5. Any person dealing with the Trustee may rely upon this Certification without requiring a copy of the trust instrument. Any person who acts in reliance on this Certification without actual knowledge that the representations are incorrect is not liable for any loss or damage resulting from such reliance.',
      'Esta Certificación se proporciona de conformidad con el Código de Sucesiones de California §18100.5. Cualquier persona que trate con el Fiduciario puede basarse en esta Certificación sin requerir una copia del instrumento del fideicomiso. Cualquier persona que actúe basándose en esta Certificación sin conocimiento real de que las declaraciones son incorrectas no será responsable por ninguna pérdida o daño resultante de dicha confianza.'
    ),
  });

  sections.push({
    id: 'COT_ART5', type: 'article', article_num: '5',
    title: _('TRUSTEE CERTIFICATION', 'CERTIFICACIÓN DEL FIDUCIARIO'),
    text: _(
      `The undersigned Trustee(s) certify under penalty of perjury under the laws of the State of California that the foregoing is true and correct. This Certification is executed on ${execDate}, at ${county} County, California.`,
      `Los Fiduciario(s) abajo firmantes certifican bajo pena de perjurio bajo las leyes del Estado de California que lo anterior es verdadero y correcto. Esta Certificación se ejecuta el ${execDate}, en el Condado de ${county}, California.`
    ),
  });

  const sigBlocks = [{ label: _('Trustee Signature', 'Firma del Fiduciario'), name: trusteeName }];
  if (coTrusteeName) sigBlocks.push({ label: _('Co-Trustee Signature', 'Firma del Co-Fiduciario'), name: coTrusteeName });

  sections.push({
    id: 'COT_SIG', type: 'signatures',
    blocks: sigBlocks,
  });

  sections.push({
    id: 'COT_NOTARY_NOTE', type: 'notice',
    text: _(
      '⚠️ NOTARIZATION REQUIRED: Banks and financial institutions require this document to be notarized. Please take this document to a licensed notary public before presenting it to any institution.',
      '⚠️ SE REQUIERE NOTARIZACIÓN: Los bancos e instituciones financieras requieren que este documento sea notariado. Por favor lleve este documento a un notario público con licencia antes de presentarlo a cualquier institución.'
    ),
  });

  return sections;
}

// ── S-CORP FORMATION PACKAGE ─────────────────────────────────────────
export function buildSCorpFormation(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  const sections = [];
  const execDate = formatDateLong(executionDate, lang);

  const corpName = d.corp_name || '________________________';
  const agentName = d.agent_name || '________________________';
  const agentAddress = d.agent_address || '________________________';
  const sharesAuthorized = d.shares_authorized || '10,000,000';
  const president = d.president_name || '________________________';
  const secretary = d.secretary_name || '________________________';
  const cfo = d.cfo_name || president;
  const directors = d.directors || president;
  const incorporatorName = d.incorporator_name || president;
  const bankName = d.bank_name || '________________________';
  const authorizedSigners = d.authorized_signers || president;
  const principalAddress = d.principal_address || '________________________';

  // ── PART 1: ARTICLES ──
  sections.push({
    id: 'SC_TITLE1', type: 'title',
    text: _(`ARTICLES OF INCORPORATION — ${corpName.toUpperCase()}`, `ACTA CONSTITUTIVA — ${corpName.toUpperCase()}`),
    subtitle: _('California Corporations Code §200–§213 | S-Corporation Formation Package', 'Código de Corporaciones de California §200–§213 | Paquete de Formación de S-Corporation'),
  });

  sections.push({
    id: 'SC_DISC', type: 'notice',
    text: _(
      '⚠️ IMPORTANT NOTICES: (1) These Articles must be filed with the California Secretary of State (Form ARTS-GS). Filing fees apply. (2) S-Corporation status requires a separate IRS Form 2553 election. Failure to file Form 2553 timely results in default C-Corporation taxation. (3) California requires a minimum Franchise Tax of $800/year. (4) This platform provides document preparation only. Consult a tax professional regarding S-Corp election.',
      '⚠️ AVISOS IMPORTANTES: (1) Estas Actas deben presentarse ante el Secretario de Estado de California (Formulario ARTS-GS). Se aplican tarifas de presentación. (2) El estatus de S-Corporation requiere una elección separada del Formulario 2553 del IRS. No presentar el Formulario 2553 a tiempo resulta en tributación predeterminada de C-Corporation. (3) California requiere un impuesto mínimo de franquicia de $800/año. (4) Esta plataforma solo proporciona preparación de documentos. Consulte a un profesional de impuestos sobre la elección de S-Corp.'
    ),
  });

  sections.push({
    id: 'SC_ART1', type: 'article', article_num: 'I',
    title: _('CORPORATE NAME', 'NOMBRE CORPORATIVO'),
    text: _(`The name of the corporation is ${corpName}.`, `El nombre de la corporación es ${corpName}.`),
  });

  sections.push({
    id: 'SC_ART2', type: 'article', article_num: 'II',
    title: _('PURPOSE', 'PROPÓSITO'),
    text: _(
      'The purpose of the corporation is to engage in any lawful act or activity for which a corporation may be organized under the California General Corporation Law.',
      'El propósito de la corporación es participar en cualquier acto o actividad legal para la que una corporación pueda ser organizada bajo la Ley General de Corporaciones de California.'
    ),
  });

  sections.push({
    id: 'SC_ART3', type: 'article', article_num: 'III',
    title: _('AGENT FOR SERVICE OF PROCESS', 'AGENTE PARA NOTIFICACIÓN DE PROCESO'),
    fields: [
      { label: _('Agent Name', 'Nombre del Agente'), value: agentName },
      { label: _('Agent Address', 'Dirección del Agente'), value: agentAddress },
    ],
  });

  sections.push({
    id: 'SC_ART4', type: 'article', article_num: 'IV',
    title: _('AUTHORIZED SHARES', 'ACCIONES AUTORIZADAS'),
    text: _(
      `The corporation is authorized to issue ${sharesAuthorized} shares of common stock.`,
      `La corporación está autorizada para emitir ${sharesAuthorized} acciones de capital común.`
    ),
  });

  sections.push({
    id: 'SC_ART5', type: 'article', article_num: 'V',
    title: _('DIRECTOR LIABILITY LIMITATION', 'LIMITACIÓN DE RESPONSABILIDAD DE DIRECTORES'),
    text: _(
      'The liability of directors of the corporation for monetary damages shall be eliminated to the fullest extent permissible under California Corporations Code §204(a)(10).',
      'La responsabilidad de los directores de la corporación por daños monetarios se eliminará en la mayor medida permitida bajo el Código de Corporaciones de California §204(a)(10).'
    ),
  });

  sections.push({
    id: 'SC_ART6', type: 'article', article_num: 'VI',
    title: _('PRINCIPAL OFFICE', 'OFICINA PRINCIPAL'),
    fields: [{ label: _('Principal Office Address', 'Dirección de Oficina Principal'), value: principalAddress }],
  });

  sections.push({
    id: 'SC_INC_SIG', type: 'signatures',
    blocks: [{ label: _('Incorporator Signature', 'Firma del Incorporador'), name: incorporatorName }],
  });

  // ── PART 2: INITIAL MINUTES ──
  sections.push({
    id: 'SC_MIN_TITLE', type: 'section_break',
    text: _('─────────────────────────────────────────────────\nINITIAL ORGANIZATIONAL MINUTES\n─────────────────────────────────────────────────',
            '─────────────────────────────────────────────────\nACTAS ORGANIZACIONALES INICIALES\n─────────────────────────────────────────────────'),
  });

  sections.push({
    id: 'SC_MIN1', type: 'article', article_num: 'A',
    title: _('ADOPTION OF ARTICLES OF INCORPORATION', 'ADOPCIÓN DEL ACTA CONSTITUTIVA'),
    text: _(
      `RESOLVED, that the Articles of Incorporation of ${corpName} as filed with the California Secretary of State are hereby adopted and ratified.`,
      `RESUELTO, que el Acta Constitutiva de ${corpName} presentada ante el Secretario de Estado de California es adoptada y ratificada por medio del presente.`
    ),
  });

  sections.push({
    id: 'SC_MIN2', type: 'article', article_num: 'B',
    title: _('ELECTION OF OFFICERS', 'ELECCIÓN DE FUNCIONARIOS'),
    fields: [
      { label: _('President', 'Presidente/a'), value: president },
      { label: _('Secretary', 'Secretario/a'), value: secretary },
      { label: _('Chief Financial Officer (CFO)', 'Director Financiero (CFO)'), value: cfo },
      { label: _('Initial Directors', 'Directores Iniciales'), value: directors },
    ],
  });

  sections.push({
    id: 'SC_MIN3', type: 'article', article_num: 'C',
    title: _('S-CORPORATION TAX ELECTION', 'ELECCIÓN FISCAL DE S-CORPORATION'),
    text: _(
      `RESOLVED, that the corporation shall elect S-Corporation tax status pursuant to Internal Revenue Code §1362, and that the proper officers are authorized and directed to execute and file IRS Form 2553 within 75 days of incorporation or by March 15 of the taxable year, whichever applies.\n\nIMPORTANT: The IRS Form 2553 must be separately filed with the IRS. This document alone does not effectuate the S-Corp election.`,
      `RESUELTO, que la corporación elegirá el estatus fiscal de S-Corporation de conformidad con el Código de Rentas Internas §1362, y que los funcionarios correspondientes están autorizados y dirigidos a ejecutar y presentar el Formulario 2553 del IRS dentro de los 75 días de la incorporación o antes del 15 de marzo del año fiscal, lo que aplique.\n\nIMPORTANTE: El Formulario 2553 del IRS debe presentarse por separado ante el IRS. Este documento por sí solo no efectúa la elección de S-Corp.`
    ),
  });

  // ── PART 3: BANKING RESOLUTION ──
  sections.push({
    id: 'SC_BANK_TITLE', type: 'section_break',
    text: _('─────────────────────────────────────────────────\nBANKING RESOLUTION\n─────────────────────────────────────────────────',
            '─────────────────────────────────────────────────\nRESOLUCIÓN BANCARIA\n─────────────────────────────────────────────────'),
  });

  sections.push({
    id: 'SC_BANK1', type: 'article', article_num: 'D',
    title: _('BANKING RESOLUTION', 'RESOLUCIÓN BANCARIA'),
    text: _(
      `RESOLVED, that ${bankName} is hereby designated as depository institution for the funds of ${corpName}.\n\nRESOLVED FURTHER, that the following officers are authorized to open accounts, sign checks, make deposits and withdrawals, and otherwise transact business with said institution on behalf of the corporation:\n\nAuthorized Signers: ${authorizedSigners}\n\nThis resolution shall remain in effect until amended or revoked by the Board of Directors.`,
      `RESUELTO, que ${bankName} es designado como institución depositaria para los fondos de ${corpName}.\n\nADEMÁS RESUELTO, que los siguientes funcionarios están autorizados para abrir cuentas, firmar cheques, hacer depósitos y retiros, y realizar transacciones con dicha institución en nombre de la corporación:\n\nFirmantes Autorizados: ${authorizedSigners}\n\nEsta resolución permanecerá vigente hasta que sea enmendada o revocada por la Junta Directiva.`
    ),
  });

  sections.push({
    id: 'SC_FINAL_SIG', type: 'signatures',
    blocks: [
      { label: _('President Signature', 'Firma del Presidente/a'), name: president },
      { label: _('Secretary Signature', 'Firma del Secretario/a'), name: secretary },
    ],
  });

  sections.push({
    id: 'SC_EXEC', type: 'paragraph', style: 'execution',
    text: _(
      `The undersigned, being all the initial directors and officers of ${corpName}, hereby adopt and approve the foregoing resolutions on ${execDate}.`,
      `Los abajo firmantes, siendo todos los directores y funcionarios iniciales de ${corpName}, adoptan y aprueban las resoluciones anteriores el ${execDate}.`
    ),
  });

  return sections;
}

// ── C-CORP FORMATION PACKAGE ─────────────────────────────────────────
export function buildCCorpFormation(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  // C-Corp is same as S-Corp but without the S-Corp tax election
  const sections = buildSCorpFormation(d, lang, executionDate);

  // Replace S-Corp title
  const corpName = d.corp_name || '________________________';
  sections[0].text = _(`ARTICLES OF INCORPORATION — ${corpName.toUpperCase()}`, `ACTA CONSTITUTIVA — ${corpName.toUpperCase()}`);
  sections[0].subtitle = _('California Corporations Code §200–§213 | C-Corporation Formation Package', 'Código de Corporaciones de California §200–§213 | Paquete de Formación de C-Corporation');

  // Replace disclaimer (no S-Corp election mention)
  sections[1].text = _(
    '⚠️ IMPORTANT NOTICES: (1) These Articles must be filed with the California Secretary of State (Form ARTS-GS). Filing fees apply. (2) C-Corporation income is subject to double taxation — once at the corporate level and again when dividends are distributed. (3) California requires a minimum Franchise Tax of $800/year. (4) This platform provides document preparation only. Consult a tax professional for guidance.',
    '⚠️ AVISOS IMPORTANTES: (1) Estas Actas deben presentarse ante el Secretario de Estado de California (Formulario ARTS-GS). Se aplican tarifas de presentación. (2) Los ingresos de C-Corporation están sujetos a doble tributación: una vez a nivel corporativo y nuevamente cuando se distribuyen dividendos. (3) California requiere un impuesto mínimo de franquicia de $800/año. (4) Esta plataforma solo proporciona preparación de documentos. Consulte a un profesional de impuestos.'
  );

  // Remove S-Corp election resolution (find and filter it out)
  const filtered = sections.filter(s => s.id !== 'SC_MIN3');

  // Add preferred stock clause for C-Corp
  const bankTitleIdx = filtered.findIndex(s => s.id === 'SC_BANK_TITLE');
  filtered.splice(bankTitleIdx, 0, {
    id: 'CC_PREFERRED', type: 'article', article_num: 'E',
    title: _('PREFERRED STOCK (OPTIONAL)', 'ACCIONES PREFERENTES (OPCIONAL)'),
    text: _(
      `The Board of Directors is authorized, subject to any limitations prescribed by law, to provide for the issuance of shares of preferred stock in one or more series, and to establish from time to time the number of shares to be included in each series, the voting powers, designations, preferences, limitations, restrictions, and relative rights of each series.`,
      `La Junta Directiva está autorizada, sujeta a las limitaciones prescritas por la ley, para proveer la emisión de acciones preferentes en una o más series, y para establecer periódicamente el número de acciones a incluir en cada serie, los poderes de voto, designaciones, preferencias, limitaciones, restricciones y derechos relativos de cada serie.`
    ),
  });

  return filtered;
}

// ── CORPORATE ANNUAL MINUTES ─────────────────────────────────────────
export function buildCorporateMinutes(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  const sections = [];
  const execDate = formatDateLong(executionDate, lang);
  const meetingDate = d.meeting_date ? formatDateLong(d.meeting_date, lang) : execDate;

  const corpName = d.corp_name || '________________________';
  const meetingType = d.meeting_type || 'annual';
  const meetingLocation = d.meeting_location || '________________________';
  const chairperson = d.chairperson_name || '________________________';
  const secretary = d.secretary_name || '________________________';
  const attendees = d.attendees || '________________________';
  const directors = d.directors || '________________________';
  const businessDiscussed = d.business_discussed || '';
  const resolutionsAdopted = d.resolutions_adopted || '';

  const mtgTypeLabel = meetingType === 'special'
    ? _('SPECIAL MEETING', 'REUNIÓN ESPECIAL')
    : meetingType === 'board'
      ? _('BOARD OF DIRECTORS MEETING', 'REUNIÓN DE LA JUNTA DIRECTIVA')
      : _('ANNUAL MEETING OF SHAREHOLDERS', 'REUNIÓN ANUAL DE ACCIONISTAS');

  sections.push({
    id: 'CM_TITLE', type: 'title',
    text: `${mtgTypeLabel}`,
    subtitle: _(`${corpName} | ${meetingDate}`, `${corpName} | ${meetingDate}`),
  });

  sections.push({
    id: 'CM_CALL', type: 'article', article_num: 'I',
    title: _('CALL TO ORDER', 'LLAMADA AL ORDEN'),
    fields: [
      { label: _('Meeting Date', 'Fecha de la Reunión'), value: meetingDate },
      { label: _('Meeting Location', 'Lugar de la Reunión'), value: meetingLocation },
      { label: _('Chairperson', 'Presidente de la Reunión'), value: chairperson },
      { label: _('Secretary', 'Secretario/a'), value: secretary },
      { label: _('Present', 'Presentes'), value: attendees },
    ],
    text: _(
      `The ${meetingType === 'board' ? 'Board of Directors' : 'shareholders'} of ${corpName} met as indicated above. The chairperson called the meeting to order and confirmed that a quorum was present.`,
      `Los ${meetingType === 'board' ? 'miembros de la Junta Directiva' : 'accionistas'} de ${corpName} se reunieron como se indica arriba. El presidente declaró abierta la sesión y confirmó que había quórum.`
    ),
  });

  sections.push({
    id: 'CM_RATIFY', type: 'article', article_num: 'II',
    title: _('RATIFICATION OF PRIOR ACTS', 'RATIFICACIÓN DE ACTOS ANTERIORES'),
    text: _(
      'RESOLVED, that all acts, transactions, and decisions made by the officers and directors of the corporation since the last meeting are hereby ratified, confirmed, and approved.',
      'RESUELTO, que todos los actos, transacciones y decisiones realizados por los funcionarios y directores de la corporación desde la última reunión son ratificados, confirmados y aprobados por medio del presente.'
    ),
  });

  sections.push({
    id: 'CM_DIR', type: 'article', article_num: 'III',
    title: _('ELECTION OF DIRECTORS', 'ELECCIÓN DE DIRECTORES'),
    text: _(
      `RESOLVED, that the following persons are elected as directors of the corporation to serve until the next annual meeting or until their successors are duly elected and qualified:\n\n${directors}`,
      `RESUELTO, que las siguientes personas son elegidas como directores de la corporación para servir hasta la próxima reunión anual o hasta que sus sucesores sean debidamente elegidos y calificados:\n\n${directors}`
    ),
  });

  if (businessDiscussed) {
    sections.push({
      id: 'CM_BUS', type: 'article', article_num: 'IV',
      title: _('BUSINESS DISCUSSED', 'ASUNTOS TRATADOS'),
      text: businessDiscussed,
    });
  }

  if (resolutionsAdopted) {
    sections.push({
      id: 'CM_RES', type: 'article', article_num: businessDiscussed ? 'V' : 'IV',
      title: _('RESOLUTIONS ADOPTED', 'RESOLUCIONES ADOPTADAS'),
      text: resolutionsAdopted,
    });
  }

  sections.push({
    id: 'CM_ADJOURN', type: 'article', article_num: businessDiscussed || resolutionsAdopted ? (businessDiscussed && resolutionsAdopted ? 'VI' : 'V') : 'IV',
    title: _('ADJOURNMENT', 'CLAUSURA'),
    text: _(
      'There being no further business to come before the meeting, the meeting was duly adjourned.',
      'No habiendo más asuntos que tratar, la reunión fue debidamente clausurada.'
    ),
  });

  sections.push({
    id: 'CM_CERT', type: 'paragraph', style: 'execution',
    text: _(
      `I hereby certify that the foregoing is a true and correct copy of the minutes of the above-captioned meeting of ${corpName}, held on ${meetingDate}, and that these minutes were approved by the ${meetingType === 'board' ? 'Board of Directors' : 'shareholders'} on ${execDate}.`,
      `Por medio del presente certifico que lo anterior es una copia fiel y correcta de las actas de la reunión arriba indicada de ${corpName}, celebrada el ${meetingDate}, y que estas actas fueron aprobadas por ${meetingType === 'board' ? 'la Junta Directiva' : 'los accionistas'} el ${execDate}.`
    ),
  });

  sections.push({
    id: 'CM_SIG', type: 'signatures',
    blocks: [
      { label: _('Chairperson Signature', 'Firma del Presidente de la Reunión'), name: chairperson },
      { label: _('Secretary Signature', 'Firma del Secretario/a'), name: secretary },
    ],
  });

  return sections;
}

// ── BANKING RESOLUTION (STANDALONE) ─────────────────────────────────
export function buildBankingResolution(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  const sections = [];
  const execDate = formatDateLong(executionDate, lang);

  const corpName = d.corp_name || '________________________';
  const entityType = d.entity_type || 'corporation';
  const bankName = d.bank_name || '________________________';
  const accountTypes = d.account_types || _('checking, savings', 'cheques, ahorros');
  const authorizedSigners = d.authorized_signers || '________________________';
  const signingRequirement = d.signing_requirement || 'single';
  const president = d.president_name || '________________________';
  const secretary = d.secretary_name || '________________________';

  sections.push({
    id: 'BR_TITLE', type: 'title',
    text: _('BANKING RESOLUTION', 'RESOLUCIÓN BANCARIA'),
    subtitle: _(`${corpName} | ${execDate}`, `${corpName} | ${execDate}`),
  });

  sections.push({
    id: 'BR_INTRO', type: 'paragraph',
    text: _(
      `The undersigned, being the duly authorized officers/members of ${corpName} (the "${entityType === 'llc' ? 'Company' : 'Corporation'}"), hereby adopt the following Banking Resolution:`,
      `Los abajo firmantes, siendo los funcionarios/miembros debidamente autorizados de ${corpName} (la "${entityType === 'llc' ? 'Compañía' : 'Corporación'}"), adoptan por medio del presente la siguiente Resolución Bancaria:`
    ),
  });

  sections.push({
    id: 'BR_RES1', type: 'article', article_num: '1',
    title: _('DEPOSITORY DESIGNATION', 'DESIGNACIÓN DE INSTITUCIÓN DEPOSITARIA'),
    fields: [
      { label: _('Bank / Financial Institution', 'Banco / Institución Financiera'), value: bankName },
      { label: _('Account Types Authorized', 'Tipos de Cuentas Autorizadas'), value: accountTypes },
    ],
    text: _(
      `RESOLVED, that ${bankName} is hereby designated as a depository institution for the funds of ${corpName}, and that the appropriate officers/members are authorized to open and maintain accounts as listed above.`,
      `RESUELTO, que ${bankName} es designado como institución depositaria para los fondos de ${corpName}, y que los funcionarios/miembros correspondientes están autorizados para abrir y mantener las cuentas indicadas arriba.`
    ),
  });

  sections.push({
    id: 'BR_RES2', type: 'article', article_num: '2',
    title: _('AUTHORIZED SIGNERS', 'FIRMANTES AUTORIZADOS'),
    text: _(
      `RESOLVED, that the following persons are authorized to sign checks, make deposits and withdrawals, access safe deposit boxes, and otherwise transact business with ${bankName} on behalf of ${corpName}:\n\nAuthorized Signers: ${authorizedSigners}\n\nSigning Requirement: ${signingRequirement === 'dual' ? 'TWO (2) authorized signatures required for transactions over $5,000' : 'ONE (1) authorized signature required'}`,
      `RESUELTO, que las siguientes personas están autorizadas para firmar cheques, hacer depósitos y retiros, acceder a cajas de seguridad y realizar transacciones con ${bankName} en nombre de ${corpName}:\n\nFirmantes Autorizados: ${authorizedSigners}\n\nRequisito de firma: ${signingRequirement === 'dual' ? 'Se requieren DOS (2) firmas autorizadas para transacciones mayores de $5,000' : 'Se requiere UNA (1) firma autorizada'}`
    ),
  });

  sections.push({
    id: 'BR_RES3', type: 'article', article_num: '3',
    title: _('ONLINE AND ELECTRONIC BANKING', 'BANCA EN LÍNEA Y ELECTRÓNICA'),
    text: _(
      `RESOLVED, that the authorized signers listed above are also authorized to use online banking, electronic transfers, wire transfers, and any other electronic banking services offered by ${bankName} on behalf of ${corpName}.`,
      `RESUELTO, que los firmantes autorizados indicados arriba también están autorizados para utilizar banca en línea, transferencias electrónicas, transferencias bancarias y cualquier otro servicio de banca electrónica ofrecido por ${bankName} en nombre de ${corpName}.`
    ),
  });

  sections.push({
    id: 'BR_RES4', type: 'article', article_num: '4',
    title: _('CERTIFICATION', 'CERTIFICACIÓN'),
    text: _(
      `I hereby certify that the foregoing resolutions were duly adopted by the ${entityType === 'llc' ? 'members' : 'Board of Directors'} of ${corpName} on ${execDate}, and that these resolutions are in full force and effect and have not been amended or rescinded.`,
      `Por medio del presente certifico que las resoluciones anteriores fueron debidamente adoptadas por los ${entityType === 'llc' ? 'miembros' : 'miembros de la Junta Directiva'} de ${corpName} el ${execDate}, y que estas resoluciones están en plena vigencia y no han sido enmendadas ni rescindidas.`
    ),
  });

  sections.push({
    id: 'BR_SIG', type: 'signatures',
    blocks: [
      { label: _('President / Manager Signature', 'Firma del Presidente / Gerente'), name: president },
      { label: _('Secretary Signature', 'Firma del Secretario/a'), name: secretary },
    ],
  });

  return sections;
}


// ═══════════════════════════════════════════════════════════════════
// PHASE 2 DOCUMENTS — Multi Servicios 360
// ═══════════════════════════════════════════════════════════════════

// ── SMALL ESTATE AFFIDAVIT (California Probate Code §13100) ─────────
export function buildSmallEstateAffidavit(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  const sections = [];
  const execDate = formatDateLong(executionDate, lang);

  const affiantName   = d.affiant_name    || '________________________';
  const affiantAddr   = d.affiant_address || '________________________';
  const decedentName  = d.decedent_name   || '________________________';
  const dateOfDeath   = d.date_of_death   ? formatDateLong(d.date_of_death, lang) : '________________________';
  const cityOfDeath   = d.city_of_death   || '________________________';
  const county        = d.county          || '________________________';
  const propertyDesc  = d.property_description || '________________________';
  const propertyValue = d.property_value  || '________________________';

  const relationOptions = {
    spouse:   _('Spouse',       'Cónyuge / Esposo(a)'),
    child:    _('Child',        'Hijo(a)'),
    parent:   _('Parent',       'Padre/Madre'),
    sibling:  _('Sibling',      'Hermano(a)'),
    heir:     _('Legal Heir',   'Heredero Legal'),
    creditor: _('Creditor',     'Acreedor'),
    other:    _('Other Successor', 'Otro Sucesor'),
  };
  const relationship = relationOptions[d.affiant_relationship] || d.affiant_relationship || '________________________';

  // Platform compliance warning
  sections.push({
    id: 'SEA_WARN', type: 'paragraph',
    text: _('⚠️ PLATFORM NOTICE: This affidavit does NOT transfer real property. It cannot be used if probate proceedings have been opened. Total estate value must not exceed the current California statutory limit ($184,500 as of 2024, excluding items under Probate Code §13050). Consult a licensed California attorney for matters exceeding this limit.',
            '⚠️ AVISO DE PLATAFORMA: Esta declaración NO transfiere bienes raíces. No puede usarse si se han iniciado procedimientos de sucesión (probate). El valor total del estate no debe exceder el límite estatutario actual de California ($184,500 a partir de 2024, excluyendo bienes bajo el Código de Sucesiones §13050). Consulte a un abogado con licencia en California para asuntos que superen este límite.'),
    style: 'warning',
  });

  sections.push({
    id: 'SEA_HDR', type: 'heading',
    text: _('AFFIDAVIT FOR COLLECTION OF PERSONAL PROPERTY\n(California Probate Code §13100)',
            'DECLARACIÓN JURADA PARA COBRO DE PROPIEDAD PERSONAL\n(Código de Sucesiones de California §13100)'),
  });

  sections.push({
    id: 'SEA_INTRO', type: 'paragraph',
    text: _(`I, ${affiantName}, of ${affiantAddr}, declare as follows:`,
            `Yo, ${affiantName}, con domicilio en ${affiantAddr}, declaro lo siguiente:`),
  });

  sections.push({
    id: 'SEA_1', type: 'article', article_num: '1',
    title: _('DECEDENT INFORMATION', 'INFORMACIÓN DEL DIFUNTO'),
    text: _(`The name of the decedent was ${decedentName}. The decedent died on ${dateOfDeath} in ${cityOfDeath}. I am the decedent's ${relationship}.`,
            `El nombre del difunto era ${decedentName}. El difunto falleció el ${dateOfDeath} en ${cityOfDeath}. Soy ${relationship} del difunto.`),
  });

  sections.push({
    id: 'SEA_2', type: 'article', article_num: '2',
    title: _('WAITING PERIOD', 'PERÍODO DE ESPERA'),
    text: _('At least 40 days have elapsed since the death of the decedent, as required by California Probate Code §13100(a)(2).',
            'Han transcurrido al menos 40 días desde el fallecimiento del difunto, tal como lo exige el Código de Sucesiones de California §13100(a)(2).'),
  });

  sections.push({
    id: 'SEA_3', type: 'article', article_num: '3',
    title: _('NO PENDING PROBATE', 'SIN PROCESO DE SUCESIÓN PENDIENTE'),
    text: _('No proceeding is now being or has been conducted in California for administration of the decedent\'s estate.',
            'No se está llevando a cabo ni se ha llevado a cabo ningún procedimiento de administración del patrimonio del difunto en California.'),
  });

  sections.push({
    id: 'SEA_4', type: 'article', article_num: '4',
    title: _('ESTATE VALUE WITHIN STATUTORY LIMIT', 'VALOR DEL ESTATE DENTRO DEL LÍMITE ESTATUTARIO'),
    text: _(`The current gross value of the decedent's real and personal property in California, excluding the property described in Probate Code §13050, does not exceed the current statutory limit under California Probate Code §13100. The estimated total value of the personal property to be transferred is ${propertyValue}.`,
            `El valor bruto actual de los bienes raíces y personales del difunto en California, excluyendo la propiedad descrita en el Código de Sucesiones §13050, no excede el límite estatutario actual bajo el Código de Sucesiones de California §13100. El valor total estimado de los bienes personales a transferir es ${propertyValue}.`),
  });

  sections.push({
    id: 'SEA_5', type: 'article', article_num: '5',
    title: _('SUCCESSOR STATUS', 'CONDICIÓN DE SUCESOR'),
    text: _('The affiant is the successor of the decedent to the property described below and is entitled to receive such property under California Probate Code §13100.',
            'El declarante es el sucesor del difunto respecto a los bienes descritos a continuación y tiene derecho a recibir dichos bienes bajo el Código de Sucesiones de California §13100.'),
  });

  sections.push({
    id: 'SEA_6', type: 'article', article_num: '6',
    title: _('DESCRIPTION OF PROPERTY TO BE TRANSFERRED', 'DESCRIPCIÓN DE LOS BIENES A TRANSFERIR'),
    text: propertyDesc,
  });

  sections.push({
    id: 'SEA_COUNTY', type: 'venue',
    state: 'California', county: county,
  });

  sections.push({
    id: 'SEA_JURAT', type: 'jurat',
    text: _(`I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct to the best of my knowledge and belief. Executed on ${execDate} in ${county} County, California.`,
            `Declaro bajo pena de perjurio bajo las leyes del Estado de California que lo anterior es verdadero y correcto a mi leal saber y entender. Ejecutado el ${execDate} en el Condado de ${county}, California.`),
  });

  sections.push({
    id: 'SEA_SIG', type: 'signatures',
    blocks: [
      { label: _('Affiant Signature', 'Firma del Declarante'), name: affiantName },
      { label: _('Printed Name', 'Nombre en letra de molde'), name: affiantName },
      { label: _('Date', 'Fecha'), name: '' },
    ],
  });

  sections.push({
    id: 'SEA_NOTARY', type: 'paragraph',
    text: _('NOTARIZATION REQUIRED — This affidavit must be notarized by a California Notary Public before it can be used to collect property. Bring this document along with a valid photo ID and the decedent\'s death certificate to a notary.',
            'NOTARIACIÓN REQUERIDA — Esta declaración jurada debe ser notariada por un Notario Público de California antes de poder usarse para reclamar bienes. Lleve este documento junto con una identificación válida con foto y el certificado de defunción del difunto a un notario.'),
    style: 'notary',
  });

  return sections;
}

// ── QUITCLAIM DEED (California Civil Code §1092) ─────────────────────
export function buildQuitclaimDeed(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  const sections = [];
  const execDate = formatDateLong(executionDate, lang);

  const grantorName   = d.grantor_name        || '________________________';
  const grantorAddr   = d.grantor_address      || '________________________';
  const granteeName   = d.grantee_name         || '________________________';
  const granteeAddr   = d.grantee_address      || '________________________';
  const county        = d.county               || '________________________';
  const apn           = d.apn                  || '________________________';
  const legalDesc     = d.legal_description    || '________________________';

  const reasonLabels = {
    into_trust:      _('Transfer into revocable living trust',            'Transferencia a fideicomiso revocable en vida'),
    between_spouses: _('Transfer between spouses',                        'Transferencia entre cónyuges'),
    gift_family:     _('Gift to family member',                           'Donación a familiar'),
    add_remove_spouse: _('Add or remove spouse from title',               'Agregar o quitar cónyuge del título'),
    divorce:         _('Divorce settlement',                              'Acuerdo de divorcio'),
    estate_planning: _('Estate planning',                                 'Planificación patrimonial'),
    other:           _('Other',                                           'Otro'),
  };
  const transferReason = reasonLabels[d.transfer_reason] || (d.transfer_reason || '');

  const exemptionLabels = {
    r_t_11911: _('Exempt from Documentary Transfer Tax — Revenue and Taxation Code §11911 (transfer between spouses/domestic partners)', 'Exento del Impuesto Documental de Transferencia — Código de Ingresos y Fiscalización §11911 (transferencia entre cónyuges/parejas domésticas)'),
    r_t_11930: _('Exempt from Documentary Transfer Tax — Revenue and Taxation Code §11930 (transfer to grantor\'s revocable trust)', 'Exento del Impuesto Documental de Transferencia — Código de Ingresos y Fiscalización §11930 (transferencia al fideicomiso revocable del otorgante)'),
    r_t_11925: _('Exempt from Documentary Transfer Tax — Revenue and Taxation Code §11925 (parent-child transfer under Proposition 19)', 'Exento del Impuesto Documental de Transferencia — Código de Ingresos y Fiscalización §11925 (transferencia padre-hijo bajo la Proposición 19)'),
    taxable:   _('This is a taxable transfer. Documentary Transfer Tax is due at time of recording.', 'Esta es una transferencia gravable. El Impuesto Documental de Transferencia vence al momento de registrar.'),
    unsure:    _('Tax status to be determined. Consult a California real property attorney or tax professional.', 'Estado fiscal por determinarse. Consulte a un abogado de bienes raíces de California o profesional fiscal.'),
  };
  const taxStatement = exemptionLabels[d.tax_exemption] || '';

  sections.push({
    id: 'QD_WARN', type: 'paragraph',
    text: _('⚠️ PLATFORM NOTICE: An incorrect legal description voids this deed. This transfer may trigger property tax reassessment under California Proposition 19. Community property laws may apply. This deed MUST be recorded with the County Recorder where the property is located. A Preliminary Change of Ownership Report (PCOR, Form BOE-502-A) must be submitted at time of recording. Consult a licensed California real property attorney before recording.',
            '⚠️ AVISO DE PLATAFORMA: Una descripción legal incorrecta invalida esta escritura. Esta transferencia puede activar la reclasificación del impuesto a la propiedad bajo la Proposición 19 de California. Pueden aplicar leyes de propiedad comunal. Esta escritura DEBE registrarse en la Oficina del Registrador del Condado donde está ubicada la propiedad. Debe presentarse un Informe Preliminar de Cambio de Propietario (PCOR, Formulario BOE-502-A) al momento del registro. Consulte a un abogado de bienes raíces con licencia en California antes de registrar.'),
    style: 'warning',
  });

  // Recording header block
  sections.push({
    id: 'QD_RECORD_HDR', type: 'paragraph',
    text: _(`Recording Requested By:\n${grantorName}\n\nWhen Recorded Mail To:\n${granteeName}\n${granteeAddr}`,
            `Registro Solicitado Por:\n${grantorName}\n\nCuando se Registre Enviar Por Correo a:\n${granteeName}\n${granteeAddr}`),
    style: 'recording_header',
  });

  sections.push({
    id: 'QD_HDR', type: 'heading',
    text: _('QUITCLAIM DEED\n(California Civil Code §1092)',
            'ESCRITURA DE TRASPASO (QUITCLAIM DEED)\n(Código Civil de California §1092)'),
  });

  sections.push({
    id: 'QD_DTT', type: 'paragraph',
    text: _(`DOCUMENTARY TRANSFER TAX STATEMENT:\n${taxStatement}`,
            `DECLARACIÓN DEL IMPUESTO DOCUMENTAL DE TRANSFERENCIA:\n${taxStatement}`),
    style: 'info_box',
  });

  sections.push({
    id: 'QD_GRANT', type: 'paragraph',
    text: _(`FOR VALUABLE CONSIDERATION, receipt of which is hereby acknowledged, ${grantorName} ("Grantor"), of ${grantorAddr}, hereby quitclaims to ${granteeName} ("Grantee"), of ${granteeAddr}, all of Grantor's right, title, and interest in and to the following described real property situated in the County of ${county}, State of California:`,
            `POR VALIOSA CONTRAPRESTACIÓN, cuyo recibo se reconoce por la presente, ${grantorName} ("Otorgante"), con domicilio en ${grantorAddr}, por la presente transfiere a ${granteeName} ("Beneficiario"), con domicilio en ${granteeAddr}, todos los derechos, títulos e intereses del Otorgante sobre la siguiente propiedad inmueble descrita, ubicada en el Condado de ${county}, Estado de California:`),
  });

  sections.push({
    id: 'QD_LEGAL', type: 'article', article_num: '',
    title: _('LEGAL DESCRIPTION OF PROPERTY', 'DESCRIPCIÓN LEGAL DE LA PROPIEDAD'),
    text: legalDesc,
  });

  sections.push({
    id: 'QD_APN', type: 'paragraph',
    text: _(`Assessor's Parcel Number (APN): ${apn}\n\nPurpose of Transfer: ${transferReason}`,
            `Número de Parcela del Tasador (APN): ${apn}\n\nPropósito de la Transferencia: ${transferReason}`),
  });

  sections.push({
    id: 'QD_PCOR', type: 'paragraph',
    text: _('PRELIMINARY CHANGE OF OWNERSHIP REPORT (PCOR): Pursuant to Revenue and Taxation Code §480.3, a completed Preliminary Change of Ownership Report (Form BOE-502-A) MUST be filed with the County Recorder at the time this deed is recorded. Failure to file may result in additional processing fees and may delay recording.',
            'INFORME PRELIMINAR DE CAMBIO DE PROPIETARIO (PCOR): De conformidad con el Código de Ingresos y Fiscalización §480.3, un Informe Preliminar de Cambio de Propietario completado (Formulario BOE-502-A) DEBE presentarse ante el Registrador del Condado al momento de registrar esta escritura. La falta de presentación puede resultar en tarifas de procesamiento adicionales y puede retrasar el registro.'),
    style: 'info_box',
  });

  sections.push({
    id: 'QD_DATE', type: 'paragraph',
    text: _(`Dated: ${execDate}`, `Fecha: ${execDate}`),
  });

  sections.push({
    id: 'QD_SIG', type: 'signatures',
    blocks: [
      { label: _('Grantor Signature', 'Firma del Otorgante'), name: grantorName },
      { label: _('Printed Name', 'Nombre en letra de molde'), name: grantorName },
    ],
  });

  sections.push({
    id: 'QD_ACK', type: 'paragraph',
    text: _('CALIFORNIA NOTARY ACKNOWLEDGMENT\n(Civil Code §1189)\n\nState of California\nCounty of ___________________________\n\nOn ________________, before me, _________________________ (Notary Public), personally appeared _________________________, who proved to me on the basis of satisfactory evidence to be the person(s) whose name(s) is/are subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their authorized capacity(ies), and that by his/her/their signature(s) on the instrument the person(s), or the entity upon behalf of which the person(s) acted, executed the instrument.\n\nI certify under PENALTY OF PERJURY under the laws of the State of California that the foregoing paragraph is true and correct.\n\nWITNESS my hand and official seal.\n\nNotary Signature: _________________________ (Seal)',
            'RECONOCIMIENTO NOTARIAL DE CALIFORNIA\n(Código Civil §1189)\n\nEstado de California\nCondado de ___________________________\n\nEl día ________________, ante mí, _________________________ (Notario Público), compareció personalmente _________________________, quien me demostró mediante evidencia satisfactoria ser la persona cuyos nombres están suscritos en el instrumento adjunto y reconoció que ejecutó el mismo en su capacidad autorizada, y que mediante su firma en el instrumento la persona, o la entidad en nombre de la cual actuó la persona, ejecutó el instrumento.\n\nCertifico bajo PENA DE PERJURIO bajo las leyes del Estado de California que el párrafo anterior es verdadero y correcto.\n\nATESTIGUO con mi firma y sello oficial.\n\nFirma del Notario: _________________________ (Sello)'),
    style: 'notary_block',
  });

  return sections;
}

// ── INDEPENDENT CONTRACTOR AGREEMENT (California AB5) ────────────────
export function buildContractorAgreement(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  const sections = [];
  const execDate = formatDateLong(executionDate, lang);

  const companyName     = d.company_name         || '________________________';
  const companyAddr     = d.company_address       || '________________________';
  const contractorName  = d.contractor_name       || '________________________';
  const contractorAddr  = d.contractor_address    || '________________________';
  const effectiveDate   = d.effective_date         ? formatDateLong(d.effective_date, lang) : execDate;
  const servicesDesc    = d.services_description  || '________________________';
  const compAmount      = d.compensation_amount   || '________________________';
  const endDate         = d.end_date              || null;

  const compTypeLabels = {
    hourly:         _('Hourly Rate',        'Tarifa por Hora'),
    fixed_project:  _('Fixed Project Price','Precio Fijo por Proyecto'),
    monthly_retainer: _('Monthly Retainer', 'Retención Mensual'),
    per_deliverable: _('Per Deliverable',   'Por Entregable'),
  };
  const compType = compTypeLabels[d.compensation_type] || (d.compensation_type || '');

  const payScheduleLabels = {
    weekly:          _('Weekly',             'Semanal'),
    biweekly:        _('Bi-Weekly',          'Quincenal'),
    monthly:         _('Monthly',            'Mensual'),
    upon_completion: _('Upon Project Completion', 'Al Completar el Proyecto'),
    milestone_based: _('Milestone-Based',    'Por Hitos'),
  };
  const paySchedule = payScheduleLabels[d.payment_schedule] || (d.payment_schedule || '');

  const durationLabels = {
    one_time:          _('One-Time Project',         'Proyecto Único'),
    ongoing_indefinite: _('Ongoing (No End Date)',   'Continuo sin Fecha Límite'),
    fixed_term:        _('Fixed Term',               'Período Fijo'),
  };
  const duration = durationLabels[d.project_duration] || (d.project_duration || '');

  const toolsLabels = {
    contractor: _('Contractor provides their own tools and equipment', 'El Contratista proporciona sus propias herramientas y equipo'),
    company:    _('Company provides tools and equipment',              'La Empresa proporciona herramientas y equipo'),
    both:       _('Both parties provide tools and equipment',          'Ambas partes proporcionan herramientas y equipo'),
  };
  const toolsBy = toolsLabels[d.tools_provided_by] || (d.tools_provided_by || '');

  const noticeLabels = { '7_days': '7', '14_days': '14', '30_days': '30', immediately: '0' };
  const noticeDays = noticeLabels[d.termination_notice] || '14';

  sections.push({
    id: 'CA_WARN', type: 'paragraph',
    text: _('⚠️ PLATFORM NOTICE: This agreement does not guarantee independent contractor classification under California law. California\'s "ABC Test" (Labor Code §2775, as amended by AB5 and AB2257) governs worker classification. Some occupations are specifically regulated or excluded. Misclassification can result in significant legal and financial liability. Consult a California employment attorney if in doubt.',
            '⚠️ AVISO DE PLATAFORMA: Este contrato no garantiza la clasificación como contratista independiente bajo la ley de California. El "ABC Test" de California (Código Laboral §2775, según enmendado por AB5 y AB2257) rige la clasificación de trabajadores. Algunas ocupaciones están específicamente reguladas o excluidas. La clasificación incorrecta puede resultar en responsabilidad legal y financiera significativa. Consulte a un abogado de empleo de California si tiene dudas.'),
    style: 'warning',
  });

  sections.push({
    id: 'CA_HDR', type: 'heading',
    text: _('INDEPENDENT CONTRACTOR AGREEMENT\n(California — AB5 Aware)',
            'CONTRATO DE CONTRATISTA INDEPENDIENTE\n(California — Conforme a AB5)'),
  });

  sections.push({
    id: 'CA_PARTIES', type: 'paragraph',
    text: _(`This Independent Contractor Agreement ("Agreement") is entered into as of ${effectiveDate} between:\n\nCompany: ${companyName}, located at ${companyAddr} ("Company")\n\nContractor: ${contractorName}, located at ${contractorAddr} ("Contractor")`,
            `Este Contrato de Contratista Independiente ("Contrato") se celebra a partir del ${effectiveDate} entre:\n\nEmpresa: ${companyName}, ubicada en ${companyAddr} ("Empresa")\n\nContratista: ${contractorName}, ubicado en ${contractorAddr} ("Contratista")`),
  });

  sections.push({
    id: 'CA_1', type: 'article', article_num: '1',
    title: _('INDEPENDENT CONTRACTOR STATUS', 'CONDICIÓN DE CONTRATISTA INDEPENDIENTE'),
    text: _(`Contractor is an independent contractor and not an employee, agent, partner, or joint venturer of Company. Nothing in this Agreement shall be construed to create an employer-employee relationship. Contractor shall control the manner, means, timing, and method of performing the services described herein. Company shall not withhold state or federal income taxes, Social Security taxes, or Medicare taxes from Contractor's compensation. Contractor is solely responsible for all federal, state, and local taxes on compensation received under this Agreement.\n\nThe parties acknowledge California Labor Code §2775 (the "ABC Test") and agree that: (A) Contractor is free from Company's direction and control in the performance of services; (B) the services are outside the usual course of Company's business; and (C) Contractor is customarily engaged in an independently established trade, occupation, or business of the same nature as the services performed.`,
            `El Contratista es un contratista independiente y no es empleado, agente, socio ni partícipe de empresa conjunta de la Empresa. Nada en este Contrato se interpretará como la creación de una relación empleador-empleado. El Contratista controlará la manera, los medios, el tiempo y el método de realizar los servicios aquí descritos. La Empresa no retendrá impuestos estatales o federales sobre ingresos, impuestos al Seguro Social o impuestos de Medicare de la compensación del Contratista. El Contratista es el único responsable de todos los impuestos federales, estatales y locales sobre la compensación recibida bajo este Contrato.\n\nLas partes reconocen el Código Laboral de California §2775 (el "ABC Test") y acuerdan que: (A) el Contratista está libre de la dirección y el control de la Empresa en la ejecución de los servicios; (B) los servicios están fuera del curso habitual del negocio de la Empresa; y (C) el Contratista está habitualmente dedicado a un oficio, ocupación o negocio establecido de forma independiente de la misma naturaleza que los servicios prestados.`),
  });

  sections.push({
    id: 'CA_2', type: 'article', article_num: '2',
    title: _('SCOPE OF SERVICES', 'ALCANCE DE LOS SERVICIOS'),
    text: _(`Contractor shall perform the following services for Company:\n\n${servicesDesc}\n\nContractor agrees to perform such additional services as the parties may mutually agree upon in writing.`,
            `El Contratista realizará los siguientes servicios para la Empresa:\n\n${servicesDesc}\n\nEl Contratista acepta realizar los servicios adicionales que las partes puedan acordar mutuamente por escrito.`),
  });

  sections.push({
    id: 'CA_3', type: 'article', article_num: '3',
    title: _('COMPENSATION AND PAYMENT', 'COMPENSACIÓN Y PAGO'),
    text: _(`Compensation Type: ${compType}\nCompensation: ${compAmount}\nPayment Schedule: ${paySchedule}\n\nCompany shall pay Contractor within 30 days of receipt of invoice, unless otherwise agreed in writing. Contractor shall submit invoices detailing services rendered and hours worked (if applicable).`,
            `Tipo de Compensación: ${compType}\nCompensación: ${compAmount}\nFrecuencia de Pago: ${paySchedule}\n\nLa Empresa pagará al Contratista dentro de los 30 días siguientes a la recepción de la factura, salvo acuerdo escrito en contrario. El Contratista deberá presentar facturas que detallen los servicios prestados y las horas trabajadas (si aplica).`),
  });

  sections.push({
    id: 'CA_4', type: 'article', article_num: '4',
    title: _('CONTRACT DURATION', 'DURACIÓN DEL CONTRATO'),
    text: endDate
      ? _(`This Agreement commences on ${effectiveDate} and terminates on ${formatDateLong(endDate, lang)} (${duration}), unless extended by mutual written agreement.`,
          `Este Contrato comienza el ${effectiveDate} y termina el ${formatDateLong(endDate, lang)} (${duration}), salvo que se extienda mediante acuerdo escrito mutuo.`)
      : _(`This Agreement commences on ${effectiveDate} and continues on an ${duration} basis until terminated by either party as provided herein.`,
          `Este Contrato comienza el ${effectiveDate} y continúa de forma ${duration} hasta que cualquiera de las partes lo rescinda según lo previsto en el presente.`),
  });

  sections.push({
    id: 'CA_5', type: 'article', article_num: '5',
    title: _('TOOLS AND EQUIPMENT', 'HERRAMIENTAS Y EQUIPO'),
    text: _(`${toolsBy}. Contractor bears all costs associated with their own tools, equipment, and workspace unless otherwise agreed in writing.`,
            `${toolsBy}. El Contratista asumirá todos los costos asociados con sus propias herramientas, equipo y espacio de trabajo, salvo acuerdo escrito en contrario.`),
  });

  sections.push({
    id: 'CA_6', type: 'article', article_num: '6',
    title: _('NO BENEFITS', 'SIN BENEFICIOS'),
    text: _('Contractor is not entitled to and shall not receive any employee benefits, including but not limited to: health insurance, retirement benefits, paid leave, sick pay, vacation pay, workers\' compensation, or unemployment insurance. Contractor acknowledges sole responsibility for maintaining their own insurance coverage.',
            'El Contratista no tiene derecho a recibir ningún beneficio de empleado, incluyendo pero no limitado a: seguro de salud, beneficios de jubilación, licencia pagada, pago por enfermedad, pago de vacaciones, compensación laboral o seguro de desempleo. El Contratista reconoce la responsabilidad exclusiva de mantener su propia cobertura de seguros.'),
  });

  if (d.confidentiality === 'yes') {
    sections.push({
      id: 'CA_7', type: 'article', article_num: '7',
      title: _('CONFIDENTIALITY', 'CONFIDENCIALIDAD'),
      text: _('Contractor acknowledges that during the performance of services, Contractor may have access to confidential information including but not limited to: trade secrets, client lists, business strategies, financial information, and proprietary processes ("Confidential Information"). Contractor shall not disclose any Confidential Information to third parties or use it for any purpose other than performing services under this Agreement, either during or after the term of this Agreement.',
              'El Contratista reconoce que durante la ejecución de los servicios puede tener acceso a información confidencial que incluye, entre otras cosas: secretos comerciales, listas de clientes, estrategias de negocio, información financiera y procesos de propiedad ("Información Confidencial"). El Contratista no divulgará ninguna Información Confidencial a terceros ni la utilizará para ningún propósito que no sea la prestación de servicios bajo este Contrato, ya sea durante o después del plazo de este Contrato.'),
    });
  }

  if (d.non_compete === 'yes') {
    sections.push({
      id: 'CA_8', type: 'article', article_num: '8',
      title: _('NON-COMPETITION NOTICE', 'AVISO DE NO COMPETENCIA'),
      text: _('⚠️ NOTE: Non-compete clauses are generally NOT enforceable under California Business and Professions Code §16600. The following clause is included for informational purposes only and shall not be construed as a binding legal restriction: During the term of this Agreement, Contractor agrees to inform Company of any material conflicts of interest that could affect the performance of services under this Agreement.',
              '⚠️ NOTA: Las cláusulas de no competencia generalmente NO son ejecutables bajo el Código de Negocios y Profesiones de California §16600. La siguiente cláusula se incluye solo con fines informativos y no debe interpretarse como una restricción legal vinculante: Durante el plazo de este Contrato, el Contratista acepta informar a la Empresa sobre cualquier conflicto de intereses material que pueda afectar la ejecución de los servicios bajo este Contrato.'),
    });
  }

  sections.push({
    id: 'CA_9', type: 'article', article_num: '9',
    title: _('TERMINATION', 'RESCISIÓN'),
    text: noticeDays === '0'
      ? _('Either party may terminate this Agreement immediately for cause. "Cause" means a material breach of this Agreement that is not cured within 10 days of written notice.',
          'Cualquiera de las partes puede rescindir este Contrato de inmediato por causa justificada. "Causa" significa un incumplimiento material de este Contrato que no se subsana dentro de los 10 días siguientes a la notificación escrita.')
      : _(`Either party may terminate this Agreement by providing ${noticeDays} days advance written notice to the other party. Either party may also terminate immediately for cause (material breach not cured within 10 days of written notice).`,
          `Cualquiera de las partes puede rescindir este Contrato proporcionando ${noticeDays} días de aviso previo por escrito a la otra parte. Cualquiera de las partes también puede rescindir de inmediato por causa justificada (incumplimiento material no subsanado dentro de los 10 días siguientes a la notificación escrita).`),
  });

  sections.push({
    id: 'CA_10', type: 'article', article_num: '10',
    title: _('INDEMNIFICATION', 'INDEMNIZACIÓN'),
    text: _('Contractor shall indemnify, defend, and hold harmless Company from any claims, damages, liabilities, or expenses arising from: (a) Contractor\'s performance of services under this Agreement; (b) any tax or worker classification liability resulting from misrepresentation by Contractor; or (c) any third-party claims related to Contractor\'s independent business activities.',
            'El Contratista indemnizará, defenderá y eximirá a la Empresa de cualquier reclamación, daño, responsabilidad o gasto que surja de: (a) la ejecución de los servicios por parte del Contratista bajo este Contrato; (b) cualquier responsabilidad fiscal o de clasificación laboral resultante de una tergiversación por parte del Contratista; o (c) cualquier reclamación de terceros relacionada con las actividades comerciales independientes del Contratista.'),
  });

  sections.push({
    id: 'CA_11', type: 'article', article_num: '11',
    title: _('GOVERNING LAW AND DISPUTE RESOLUTION', 'LEY APLICABLE Y RESOLUCIÓN DE DISPUTAS'),
    text: _('This Agreement shall be governed by and construed in accordance with the laws of the State of California. Any dispute arising from this Agreement shall first be submitted to good-faith mediation. If mediation fails, disputes shall be resolved in the state or federal courts located in California.',
            'Este Contrato se regirá e interpretará de acuerdo con las leyes del Estado de California. Cualquier disputa que surja de este Contrato deberá someterse primero a mediación de buena fe. Si la mediación fracasa, las disputas se resolverán en los tribunales estatales o federales ubicados en California.'),
  });

  sections.push({
    id: 'CA_SIG', type: 'signatures',
    blocks: [
      { label: _('Company Representative Signature', 'Firma del Representante de la Empresa'), name: companyName },
      { label: _('Contractor Signature', 'Firma del Contratista'), name: contractorName },
      { label: _('Date', 'Fecha'), name: execDate },
    ],
  });

  return sections;
}

// ── DEMAND LETTER (FDCPA Compliant) ─────────────────────────────────
export function buildDemandLetter(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  const sections = [];
  const execDate = formatDateLong(executionDate, lang);

  const senderName   = d.sender_name      || '________________________';
  const senderAddr   = d.sender_address   || '________________________';
  const recipientName = d.recipient_name  || '________________________';
  const recipientAddr = d.recipient_address || '________________________';
  const amountOwed   = d.amount_owed      || '________________________';
  const debtDesc     = d.debt_description || '________________________';
  const originalDue  = d.due_date_original || null;
  const deadlineDays = d.response_deadline || '10';

  const debtTypeLabels = {
    unpaid_services: _('unpaid services rendered',   'servicios prestados no pagados'),
    unpaid_loan:     _('unpaid personal loan',       'préstamo personal no pagado'),
    unpaid_rent:     _('unpaid rent',                'renta no pagada'),
    returned_goods:  _('returned or undelivered goods', 'bienes devueltos o no entregados'),
    property_damage: _('property damage',             'daños a la propiedad'),
    breach_contract: _('breach of contract',          'incumplimiento de contrato'),
    other:           _('outstanding balance',         'saldo pendiente'),
  };
  const debtType = debtTypeLabels[d.debt_type] || _('outstanding balance', 'saldo pendiente');

  const nextActionLabels = {
    small_claims:      _('Small Claims Court (California Superior Court)', 'Corte de Reclamos Menores (Tribunal Superior de California)'),
    civil_lawsuit:     _('civil lawsuit in California Superior Court',     'demanda civil en el Tribunal Superior de California'),
    collection_agency: _('a licensed collection agency',                   'una agencia de cobro con licencia'),
    legal_counsel:     _('legal counsel for further action',               'asesoría legal para acciones adicionales'),
    unspecified:       _('all available legal remedies',                   'todos los recursos legales disponibles'),
  };
  const nextAction = nextActionLabels[d.next_action] || _('all available legal remedies', 'todos los recursos legales disponibles');

  sections.push({
    id: 'DL_WARN', type: 'paragraph',
    text: _('⚠️ PLATFORM NOTICE: This demand letter must NOT threaten criminal prosecution for non-payment, use abusive language, or violate the Fair Debt Collection Practices Act (FDCPA) or California\'s Rosenthal Act. This document is for collecting legitimate debts only. Do not use this form to collect disputed amounts without first resolving the dispute.',
            '⚠️ AVISO DE PLATAFORMA: Esta carta de demanda NO debe amenazar con enjuiciamiento penal por falta de pago, usar lenguaje abusivo, ni violar la Ley Federal de Prácticas Justas de Cobro de Deudas (FDCPA) o la Ley Rosenthal de California. Este documento es únicamente para cobrar deudas legítimas. No use este formulario para cobrar montos en disputa sin resolver primero la disputa.'),
    style: 'warning',
  });

  sections.push({
    id: 'DL_HEADER', type: 'paragraph',
    text: `${senderName}\n${senderAddr}\n\n${execDate}\n\n${recipientName}\n${recipientAddr}`,
    style: 'letterhead',
  });

  sections.push({
    id: 'DL_RE', type: 'paragraph',
    text: _(`RE: FORMAL DEMAND FOR PAYMENT — Outstanding Balance of ${amountOwed}`,
            `RE: DEMANDA FORMAL DE PAGO — Saldo Pendiente de ${amountOwed}`),
    style: 'subject_line',
  });

  sections.push({
    id: 'DL_SALUTE', type: 'paragraph',
    text: _(`Dear ${recipientName},`, `Estimado/a ${recipientName}:`),
  });

  sections.push({
    id: 'DL_BODY1', type: 'paragraph',
    text: _(`This letter serves as formal written notice that you owe the sum of ${amountOwed} to ${senderName} for ${debtType}. The details of this debt are as follows:\n\n${debtDesc}`,
            `Esta carta sirve como aviso formal por escrito de que usted adeuda la suma de ${amountOwed} a ${senderName} por ${debtType}. Los detalles de esta deuda son los siguientes:\n\n${debtDesc}`),
  });

  if (originalDue) {
    sections.push({
      id: 'DL_BODY2', type: 'paragraph',
      text: _(`This amount was due on ${originalDue}. Despite prior requests for payment, this balance remains unpaid.`,
              `Este monto venció el ${originalDue}. A pesar de las solicitudes previas de pago, este saldo permanece impago.`),
    });
  } else {
    sections.push({
      id: 'DL_BODY2', type: 'paragraph',
      text: _('Despite prior requests for payment, this balance remains unpaid.',
              'A pesar de las solicitudes previas de pago, este saldo permanece impago.'),
    });
  }

  sections.push({
    id: 'DL_DEMAND', type: 'paragraph',
    text: _(`DEMAND: You are hereby formally demanded to remit full payment of ${amountOwed} within ${deadlineDays} days from the date of this letter. Payment should be made payable to ${senderName} and sent to the address listed above.`,
            `DEMANDA: Por la presente se le demanda formalmente que remita el pago completo de ${amountOwed} dentro de los ${deadlineDays} días siguientes a la fecha de esta carta. El pago debe hacerse a nombre de ${senderName} y enviarse a la dirección indicada arriba.`),
    style: 'demand_box',
  });

  sections.push({
    id: 'DL_CONSEQUENCE', type: 'paragraph',
    text: _(`If we do not receive payment in full within ${deadlineDays} days from the date of this letter, we reserve the right to pursue ${nextAction} to recover the full amount owed, plus any applicable interest, court costs, and attorneys\' fees as permitted by law.`,
            `Si no recibimos el pago completo dentro de los ${deadlineDays} días siguientes a la fecha de esta carta, nos reservamos el derecho de recurrir a ${nextAction} para recuperar el monto total adeudado, más cualquier interés aplicable, costas judiciales y honorarios de abogados según lo permitido por la ley.`),
  });

  sections.push({
    id: 'DL_FDCPA', type: 'paragraph',
    text: _('NOTICE UNDER THE FAIR DEBT COLLECTION PRACTICES ACT: This communication is from a creditor collecting a debt owed to itself. It is not from a third-party debt collector. This is an attempt to collect a debt. Any information obtained will be used for that purpose.',
            'AVISO BAJO LA LEY DE PRÁCTICAS JUSTAS DE COBRO DE DEUDAS: Esta comunicación proviene de un acreedor que cobra una deuda que se le debe directamente. No proviene de un cobrador de deudas de terceros. Este es un intento de cobrar una deuda. Cualquier información obtenida será utilizada para ese propósito.'),
    style: 'legal_notice',
  });

  sections.push({
    id: 'DL_CLOSE', type: 'paragraph',
    text: _('Sincerely,', 'Atentamente,'),
  });

  sections.push({
    id: 'DL_SIG', type: 'signatures',
    blocks: [
      { label: _('Signature', 'Firma'), name: senderName },
      { label: _('Printed Name', 'Nombre en letra de molde'), name: senderName },
      { label: _('Date', 'Fecha'), name: execDate },
    ],
  });

  return sections;
}

// ── APOSTILLE COVER LETTER (California SOS) ─────────────────────────
export function buildApostilleLetter(d, lang, executionDate) {
  const _ = (en, es) => lang === 'en' ? en : es;
  const sections = [];
  const execDate = formatDateLong(executionDate, lang);

  const applicantName   = d.applicant_name    || '________________________';
  const applicantAddr   = d.applicant_address || '________________________';
  const applicantPhone  = d.applicant_phone   || '';
  const applicantEmail  = d.applicant_email   || '';
  const destCountry     = d.destination_country || '________________________';
  const docDesc         = d.document_description || '________________________';

  const docTypeLabels = {
    birth_certificate: _('Birth Certificate',          'Acta de Nacimiento'),
    marriage_certificate: _('Marriage Certificate',    'Acta de Matrimonio'),
    divorce_decree:    _('Divorce Decree',             'Decreto de Divorcio'),
    death_certificate: _('Death Certificate',          'Acta de Defunción'),
    diploma:           _('University Diploma/Degree',  'Título/Diploma Universitario'),
    power_of_attorney: _('Power of Attorney',          'Poder Notarial'),
    affidavit:         _('Affidavit',                  'Declaración Jurada'),
    business_document: _('Business Document',          'Documento Comercial'),
    fbi_background:    _('FBI/DOJ Background Check',   'Antecedentes Penales FBI/DOJ'),
    other:             _('Other Document',             'Otro Documento'),
  };
  const docType = docTypeLabels[d.document_type] || (d.document_type || '');

  const purposeLabels = {
    marriage:    _('Marriage Abroad',                 'Matrimonio en el Extranjero'),
    work_visa:   _('Work Visa / Residency',           'Visa de Trabajo / Residencia'),
    residency:   _('Permanent Residency',             'Residencia Permanente'),
    adoption:    _('International Adoption',          'Adopción Internacional'),
    education:   _('Study Abroad',                   'Estudios en el Extranjero'),
    business:    _('Business Transactions',           'Trámites Comerciales'),
    inheritance: _('Inheritance / Estate',            'Herencia / Sucesión'),
    other:       _('Other',                          'Otro'),
  };
  const purpose = purposeLabels[d.purpose] || (d.purpose || '');

  const submissionLabels = {
    mail:       _('Mail',       'Correo'),
    in_person:  _('In Person',  'En Persona'),
  };
  const submission = submissionLabels[d.submission_method] || (d.submission_method || '');

  const returnLabels = {
    usps_priority: _('USPS Priority Mail (prepaid envelope enclosed)', 'USPS Priority Mail (sobre prepagado incluido)'),
    fedex:         _('FedEx (prepaid label enclosed)',                  'FedEx (etiqueta prepagada incluida)'),
    ups:           _('UPS (prepaid label enclosed)',                   'UPS (etiqueta prepagada incluida)'),
    will_pickup:   _('In-person pickup',                               'Recogeré en persona'),
  };
  const returnMethod = returnLabels[d.return_method] || (d.return_method || '');

  const notarizedStatus = d.notarized === 'yes_notarized'
    ? _('✓ The document has been notarized by a California Notary Public.',
        '✓ El documento ha sido notariado por un Notario Público de California.')
    : _('⚠️ Notarization status unclear — the California SOS requires documents to be notarized before apostille can be issued.',
        '⚠️ Estado de notariación no confirmado — la Secretaría de Estado de California requiere que los documentos estén notariados antes de emitir la Apostilla.');

  sections.push({
    id: 'AP_WARN', type: 'paragraph',
    text: _('⚠️ PLATFORM NOTICE: This cover letter is a preparation aid. The California Secretary of State can only apostille documents bearing the signature of a California Notary Public or a California public official. An Apostille does not validate the content of the underlying document. Not all countries accept Apostilles — some require Consular Legalization. Verify the destination country\'s requirements before submitting.',
            '⚠️ AVISO DE PLATAFORMA: Esta carta de presentación es una ayuda de preparación. La Secretaría de Estado de California solo puede apostillar documentos que contengan la firma de un Notario Público de California o un funcionario público de California. Una Apostilla no valida el contenido del documento subyacente. No todos los países aceptan Apostillas; algunos requieren Legalización Consular. Verifique los requisitos del país de destino antes de presentar.'),
    style: 'warning',
  });

  // Sender header
  sections.push({
    id: 'AP_SENDER', type: 'paragraph',
    text: `${applicantName}\n${applicantAddr}${applicantPhone ? '\n' + applicantPhone : ''}${applicantEmail ? '\n' + applicantEmail : ''}`,
    style: 'letterhead',
  });

  sections.push({
    id: 'AP_DATE', type: 'paragraph',
    text: execDate,
  });

  sections.push({
    id: 'AP_ADDRESSEE', type: 'paragraph',
    text: _('California Secretary of State\nNotary Public Section\n1500 11th Street\nSacramento, CA 95814',
            'Secretaría de Estado de California\nSección de Notarios Públicos\n1500 11th Street\nSacramento, CA 95814'),
  });

  sections.push({
    id: 'AP_RE', type: 'paragraph',
    text: _(`RE: REQUEST FOR APOSTILLE AUTHENTICATION\nDocument Type: ${docType}\nDestination Country: ${destCountry}\nPurpose: ${purpose}`,
            `RE: SOLICITUD DE AUTENTICACIÓN CON APOSTILLA\nTipo de Documento: ${docType}\nPaís de Destino: ${destCountry}\nPropósito: ${purpose}`),
    style: 'subject_line',
  });

  sections.push({
    id: 'AP_SALUTE', type: 'paragraph',
    text: _('Dear Sir or Madam,', 'Estimado/a Señor/a:'),
  });

  sections.push({
    id: 'AP_BODY1', type: 'paragraph',
    text: _(`I, ${applicantName}, am submitting this request for an Apostille authentication pursuant to the 1961 Hague Convention Abolishing the Requirement of Legalization for Foreign Public Documents, to which the United States is a signatory.\n\nEnclosed please find the following document(s) for authentication:`,
            `Yo, ${applicantName}, presento esta solicitud de autenticación con Apostilla de conformidad con el Convenio de La Haya de 1961 que Suprime la Exigencia de la Legalización de los Documentos Públicos Extranjeros, del cual los Estados Unidos es signatario.\n\nAdjunto encontrará los siguientes documentos para autenticación:`),
  });

  sections.push({
    id: 'AP_DOCS', type: 'article', article_num: '',
    title: _('DOCUMENT(S) SUBMITTED FOR APOSTILLE', 'DOCUMENTO(S) PRESENTADO(S) PARA APOSTILLA'),
    text: `${docType}\n${docDesc}\n\n${notarizedStatus}`,
  });

  sections.push({
    id: 'AP_SUBMISSION', type: 'paragraph',
    text: _(`Submission Method: ${submission}\nReturn Method: ${returnMethod}\n\nI have enclosed the required processing fee. Please issue the Apostille and return the authenticated document(s) via the return method indicated above.`,
            `Método de Envío: ${submission}\nMétodo de Devolución: ${returnMethod}\n\nAdjunto el monto de la tarifa de procesamiento requerida. Sírvase emitir la Apostilla y devolver el/los documento(s) autenticado(s) por el método de devolución indicado arriba.`),
  });

  sections.push({
    id: 'AP_CHECKLIST', type: 'paragraph',
    text: _('SUBMISSION CHECKLIST:\n☐ Original notarized document(s)\n☐ This cover letter\n☐ Required fee (check or money order payable to California Secretary of State — verify current fee at sos.ca.gov)\n☐ Prepaid return envelope or label\n☐ Copy of valid ID (optional but recommended)',
            'LISTA DE VERIFICACIÓN DE ENVÍO:\n☐ Documento(s) original(es) notariado(s)\n☐ Esta carta de presentación\n☐ Tarifa requerida (cheque o giro postal a nombre de California Secretary of State — verifique la tarifa actual en sos.ca.gov)\n☐ Sobre o etiqueta de devolución prepagado(a)\n☐ Copia de identificación válida (opcional pero recomendado)'),
    style: 'checklist',
  });

  sections.push({
    id: 'AP_CLOSE', type: 'paragraph',
    text: _('Thank you for your assistance with this matter.\n\nSincerely,', 'Gracias por su asistencia en este asunto.\n\nAtentamente,'),
  });

  sections.push({
    id: 'AP_SIG', type: 'signatures',
    blocks: [
      { label: _('Signature', 'Firma'), name: applicantName },
      { label: _('Printed Name', 'Nombre en letra de molde'), name: applicantName },
      { label: _('Date', 'Fecha'), name: execDate },
    ],
  });

  return sections;
}
