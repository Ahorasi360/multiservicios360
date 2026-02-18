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
      `This letter of consent is provided in accordance with the recommendations of the U.S. Department of State and U.S. Customs and Border Protection (CBP) for minors traveling internationally. While no U.S. federal law requires this document, CBP officers may request proof of parental consent when a minor crosses the U.S. border accompanied by only one parent or a non-parent adult. Additionally, many countries, including Mexico (Ley de Migración, Artículo 42), Guatemala, Honduras, and El Salvador, require written parental authorization for minors entering or exiting their territory with only one parent or a non-parent.\n\nIt is strongly recommended that this document be notarized to ensure acceptance by border authorities in both countries. The authorizing parent should carry a form of government-issued identification matching the information in this document.`,
      `Esta carta de consentimiento se proporciona de acuerdo con las recomendaciones del Departamento de Estado de EE.UU. y la Oficina de Aduanas y Protección Fronteriza (CBP) para menores que viajan internacionalmente. Si bien ninguna ley federal de EE.UU. requiere este documento, los oficiales de CBP pueden solicitar prueba de consentimiento parental cuando un menor cruza la frontera de EE.UU. acompañado por solo uno de sus progenitores o por un adulto sin parentesco directo. Adicionalmente, muchos países, incluyendo México (Ley de Migración, Artículo 42), Guatemala, Honduras y El Salvador, requieren autorización parental escrita para menores que entran o salen de su territorio acompañados por un solo progenitor o por un tercero.\n\nSe recomienda encarecidamente que este documento sea notarizado para asegurar su aceptación por las autoridades fronterizas de ambos países. La persona que otorga esta autorización debe portar una identificación oficial que coincida con la información de este documento.`
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
    default: return [];
  }
}