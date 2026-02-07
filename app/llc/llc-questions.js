// LLC Questions - With tier trigger logic

export const QUESTIONS = [
  // ============ LLC NAME SECTION ============
  {
    id: 1,
    section: 'llc_name',
    field: 'llc_name',
    type: 'text',
    question_en: 'What would you like to name your LLC?\n\n(Don\'t include the suffix like "LLC" - we\'ll add that next)',
    question_es: '¿Cómo le gustaría nombrar su LLC?\n\n(No incluya el sufijo como "LLC" - lo agregaremos después)',
    placeholder_en: 'e.g., Sunrise Consulting',
    placeholder_es: 'ej., Sunrise Consulting',
    required: true,
    validation: 'llc_name'
  },
  {
    id: 2,
    section: 'llc_name',
    field: 'llc_suffix',
    type: 'select',
    question_en: 'Select the suffix for your LLC name:',
    question_es: 'Seleccione el sufijo para el nombre de su LLC:',
    options: [
      { value: 'LLC', label_en: 'LLC', label_es: 'LLC' },
      { value: 'L.L.C.', label_en: 'L.L.C.', label_es: 'L.L.C.' },
      { value: 'Limited Liability Company', label_en: 'Limited Liability Company', label_es: 'Limited Liability Company' }
    ],
    required: true
  },

  // ============ BUSINESS INFO SECTION ============
  {
    id: 3,
    section: 'business',
    field: 'business_purpose',
    type: 'select',
    question_en: 'What is the primary purpose of your LLC?',
    question_es: '¿Cuál es el propósito principal de su LLC?',
    options: [
      { value: 'general', label_en: 'General Business (any lawful business)', label_es: 'Negocio General (cualquier negocio legal)' },
      { value: 'professional', label_en: 'Professional Services', label_es: 'Servicios Profesionales' },
      { value: 'real_estate', label_en: 'Real Estate', label_es: 'Bienes Raíces' },
      { value: 'consulting', label_en: 'Consulting', label_es: 'Consultoría' },
      { value: 'ecommerce', label_en: 'E-commerce/Online', label_es: 'E-commerce/En línea' },
      { value: 'other', label_en: 'Other', label_es: 'Otro' }
    ],
    required: true
  },
  {
    id: 4,
    section: 'business',
    field: 'business_purpose_other',
    type: 'text',
    question_en: 'Please describe your business purpose:',
    question_es: 'Por favor describa el propósito de su negocio:',
    showIf: { field: 'business_purpose', value: 'other' },
    required: true
  },
  {
    id: 5,
    section: 'business',
    field: 'principal_street',
    type: 'text',
    question_en: 'What is the principal business address?\n\n⚠️ Street address ONLY — we will ask for city and ZIP code separately in the next questions.\n\nExample: 123 Main Street, Suite 100',
    question_es: '¿Cuál es la dirección principal del negocio?\n\n⚠️ SOLO la calle — le pediremos la ciudad y código postal por separado en las siguientes preguntas.\n\nEjemplo: 123 Calle Principal, Suite 100',
    placeholder_en: '123 Main Street, Suite 100',
    placeholder_es: '123 Calle Principal, Suite 100',
    required: true
  },
  {
    id: 6,
    section: 'business',
    field: 'principal_city',
    type: 'text',
    question_en: 'City ONLY (do not include state or ZIP):\n\nExample: Los Angeles',
    question_es: 'SOLO la ciudad (no incluya estado ni código postal):\n\nEjemplo: Los Angeles',
    placeholder_en: 'Los Angeles',
    placeholder_es: 'Los Angeles',
    required: true
  },
  {
    id: 7,
    section: 'business',
    field: 'principal_zip',
    type: 'text',
    question_en: 'ZIP Code ONLY (5 digits):\n\nExample: 90012',
    question_es: 'SOLO el Código Postal (5 dígitos):\n\nEjemplo: 90012',
    placeholder_en: '90001',
    placeholder_es: '90001',
    required: true,
    validation: 'zip'
  },

  // ============ EFFECTIVE DATE SECTION ============
  {
    id: 37,
    section: 'business',
    field: 'effective_date',
    type: 'text',
    question_en: 'What is the effective date for the Operating Agreement?\n\nThis is typically the date you plan to sign. Use format: MM/DD/YYYY\n\nExample: 02/15/2026\n\nIf you\'re not sure, type "today" and we\'ll use today\'s date.',
    question_es: '¿Cuál es la fecha efectiva del Acuerdo Operativo?\n\nEsta es típicamente la fecha en que planea firmar. Use formato: MM/DD/YYYY\n\nEjemplo: 02/15/2026\n\nSi no está seguro, escriba "hoy" y usaremos la fecha de hoy.',
    placeholder_en: 'MM/DD/YYYY or "today"',
    placeholder_es: 'MM/DD/YYYY o "hoy"',
    required: true
  },

  // ============ MEMBERS SECTION ============
  {
    id: 8,
    section: 'members',
    field: 'member_count',
    type: 'select',
    question_en: 'How many members (owners) will your LLC have?',
    question_es: '¿Cuántos miembros (dueños) tendrá su LLC?',
    options: [
      { value: 1, label_en: 'Just me (1 member)', label_es: 'Solo yo (1 miembro)' },
      { value: 2, label_en: 'Two members', label_es: 'Dos miembros' },
      { value: 3, label_en: 'Three or more members', label_es: 'Tres o más miembros' }
    ],
    required: true,
    tierTrigger: { value: 3, upgradeTo: 'llc_plus', reason: 'More than 2 members requires LLC Plus' }
  },
  
  // Member 1 details (always shown)
  {
    id: 9,
    section: 'members',
    field: 'member_1_name',
    type: 'text',
    question_en: 'Member 1 - Full Legal Name:\n\n⚠️ This name MUST match your government-issued ID exactly. It will appear on all legal documents.',
    question_es: 'Miembro 1 - Nombre Legal Completo:\n\n⚠️ Este nombre DEBE coincidir exactamente con su identificación oficial. Aparecerá en todos los documentos legales.',
    required: true
  },
  {
    id: 10,
    section: 'members',
    field: 'member_1_address',
    type: 'text',
    question_en: 'Member 1 - Full Address (Street, City, State, ZIP):\n\nExample: 456 Oak Ave, Los Angeles, CA 90012',
    question_es: 'Miembro 1 - Dirección Completa (Calle, Ciudad, Estado, Código Postal):\n\nEjemplo: 456 Oak Ave, Los Angeles, CA 90012',
    required: true
  },

  // ============ CAPITAL CONTRIBUTION ============
  {
    id: 38,
    section: 'members',
    field: 'member_1_contribution',
    type: 'text',
    question_en: 'Member 1 - Initial Capital Contribution Amount:\n\nThis is the money or property you are investing into the LLC to start.\n\nEnter a dollar amount (e.g., 1000, 5000, 10000)\n\nIf none yet, type "0".',
    question_es: 'Miembro 1 - Monto de Contribución de Capital Inicial:\n\nEsto es el dinero o propiedad que está invirtiendo en la LLC para comenzar.\n\nIngrese un monto en dólares (ej., 1000, 5000, 10000)\n\nSi no tiene aún, escriba "0".',
    placeholder_en: 'e.g., 5000',
    placeholder_es: 'ej., 5000',
    required: true
  },

  // Member 2 details (shown if 2+ members)
  {
    id: 11,
    section: 'members',
    field: 'member_2_name',
    type: 'text',
    question_en: 'Member 2 - Full Legal Name:\n\n⚠️ Must match their government-issued ID exactly.',
    question_es: 'Miembro 2 - Nombre Legal Completo:\n\n⚠️ Debe coincidir exactamente con su identificación oficial.',
    showIf: { field: 'member_count', values: [2, 3] },
    required: true
  },
  {
    id: 12,
    section: 'members',
    field: 'member_2_address',
    type: 'text',
    question_en: 'Member 2 - Full Address (Street, City, State, ZIP):',
    question_es: 'Miembro 2 - Dirección Completa (Calle, Ciudad, Estado, Código Postal):',
    showIf: { field: 'member_count', values: [2, 3] },
    required: true
  },
  {
    id: 39,
    section: 'members',
    field: 'member_2_contribution',
    type: 'text',
    question_en: 'Member 2 - Initial Capital Contribution Amount:\n\nEnter a dollar amount (e.g., 1000, 5000)',
    question_es: 'Miembro 2 - Monto de Contribución de Capital Inicial:\n\nIngrese un monto en dólares (ej., 1000, 5000)',
    placeholder_en: 'e.g., 5000',
    placeholder_es: 'ej., 5000',
    showIf: { field: 'member_count', values: [2, 3] },
    required: true
  },

  // Member 3 details (shown if 3+ members)
  {
    id: 13,
    section: 'members',
    field: 'member_3_name',
    type: 'text',
    question_en: 'Member 3 - Full Legal Name:\n\n⚠️ Must match their government-issued ID exactly.',
    question_es: 'Miembro 3 - Nombre Legal Completo:\n\n⚠️ Debe coincidir exactamente con su identificación oficial.',
    showIf: { field: 'member_count', value: 3 },
    required: true
  },
  {
    id: 14,
    section: 'members',
    field: 'member_3_address',
    type: 'text',
    question_en: 'Member 3 - Full Address (Street, City, State, ZIP):',
    question_es: 'Miembro 3 - Dirección Completa (Calle, Ciudad, Estado, Código Postal):',
    showIf: { field: 'member_count', value: 3 },
    required: true
  },
  {
    id: 40,
    section: 'members',
    field: 'member_3_contribution',
    type: 'text',
    question_en: 'Member 3 - Initial Capital Contribution Amount:\n\nEnter a dollar amount (e.g., 1000, 5000)',
    question_es: 'Miembro 3 - Monto de Contribución de Capital Inicial:\n\nIngrese un monto en dólares (ej., 1000, 5000)',
    placeholder_en: 'e.g., 5000',
    placeholder_es: 'ej., 5000',
    showIf: { field: 'member_count', value: 3 },
    required: true
  },
  {
    id: 15,
    section: 'members',
    field: 'additional_members',
    type: 'text',
    question_en: 'Please list any additional members (name, address, and contribution amount for each, separated by semicolons):',
    question_es: 'Por favor liste miembros adicionales (nombre, dirección, y monto de contribución de cada uno, separados por punto y coma):',
    showIf: { field: 'member_count', value: 3 },
    required: false,
    note: 'For 4+ members'
  },

  // Ownership split (for 2+ members)
  {
    id: 16,
    section: 'members',
    field: 'equal_ownership',
    type: 'boolean',
    question_en: 'Will all members have EQUAL ownership?\n\nYes = Each member owns the same percentage\nNo = Members have different ownership percentages',
    question_es: '¿Todos los miembros tendrán propiedad IGUAL?\n\nSí = Cada miembro posee el mismo porcentaje\nNo = Los miembros tienen diferentes porcentajes de propiedad',
    showIf: { field: 'member_count', values: [2, 3] },
    required: true,
    tierTrigger: { value: false, upgradeTo: 'llc_plus', reason: 'Unequal ownership requires LLC Plus' }
  },
  {
    id: 17,
    section: 'members',
    field: 'ownership_split',
    type: 'text',
    question_en: 'What percentage does each member own?\n\n(Example: "Member 1: 60%, Member 2: 40%")',
    question_es: '¿Qué porcentaje posee cada miembro?\n\n(Ejemplo: "Miembro 1: 60%, Miembro 2: 40%")',
    showIf: { field: 'equal_ownership', value: false },
    required: true,
    note: 'Must total 100%'
  },

  // Silent partners / Investors
  {
    id: 18,
    section: 'members',
    field: 'has_silent_partners',
    type: 'boolean',
    question_en: 'Will any members be "silent partners" (investors who don\'t participate in daily operations)?',
    question_es: '¿Algún miembro será "socio silencioso" (inversionistas que no participan en operaciones diarias)?',
    showIf: { field: 'member_count', values: [2, 3] },
    required: true,
    tierTrigger: { value: true, upgradeTo: 'llc_plus', reason: 'Silent partners require LLC Plus' }
  },
  {
    id: 19,
    section: 'members',
    field: 'has_investors',
    type: 'boolean',
    question_en: 'Do you have or expect outside investors in this LLC?',
    question_es: '¿Tiene o espera inversionistas externos en esta LLC?',
    required: true,
    tierTrigger: { value: true, upgradeTo: 'llc_elite', reason: 'Outside investors recommend LLC Elite' }
  },

  // ============ MANAGEMENT SECTION ============
  {
    id: 20,
    section: 'management',
    field: 'management_type',
    type: 'select',
    question_en: 'How will the LLC be managed?\n\nMember-Managed = All members participate in running the business\nManager-Managed = One or more designated managers run the business',
    question_es: '¿Cómo se administrará la LLC?\n\nAdministrado por Miembros = Todos los miembros participan en el negocio\nAdministrado por Gerente = Uno o más gerentes designados manejan el negocio',
    options: [
      { value: 'member', label_en: 'Member-Managed', label_es: 'Administrado por Miembros' },
      { value: 'manager', label_en: 'Manager-Managed', label_es: 'Administrado por Gerente(s)' }
    ],
    required: true
  },
  {
    id: 21,
    section: 'management',
    field: 'manager_count',
    type: 'select',
    question_en: 'How many managers will the LLC have?',
    question_es: '¿Cuántos gerentes tendrá la LLC?',
    showIf: { field: 'management_type', value: 'manager' },
    options: [
      { value: 1, label_en: 'One manager', label_es: 'Un gerente' },
      { value: 2, label_en: 'Two managers', label_es: 'Dos gerentes' },
      { value: 3, label_en: 'Three or more managers', label_es: 'Tres o más gerentes' }
    ],
    required: true,
    tierTrigger: { values: [2, 3], upgradeTo: 'llc_plus', reason: 'Multiple managers require LLC Plus' }
  },
  {
    id: 22,
    section: 'management',
    field: 'manager_1_name',
    type: 'text',
    question_en: 'Manager 1 - Full Legal Name:',
    question_es: 'Gerente 1 - Nombre Legal Completo:',
    showIf: { field: 'management_type', value: 'manager' },
    required: true
  },
  {
    id: 23,
    section: 'management',
    field: 'manager_1_address',
    type: 'text',
    question_en: 'Manager 1 - Full Address (Street, City, State, ZIP):',
    question_es: 'Gerente 1 - Dirección Completa (Calle, Ciudad, Estado, Código Postal):',
    showIf: { field: 'management_type', value: 'manager' },
    required: true
  },
  {
    id: 24,
    section: 'management',
    field: 'manager_2_name',
    type: 'text',
    question_en: 'Manager 2 - Full Legal Name:',
    question_es: 'Gerente 2 - Nombre Legal Completo:',
    showIf: { field: 'manager_count', values: [2, 3] },
    required: true
  },
  {
    id: 25,
    section: 'management',
    field: 'manager_2_address',
    type: 'text',
    question_en: 'Manager 2 - Full Address (Street, City, State, ZIP):',
    question_es: 'Gerente 2 - Dirección Completa (Calle, Ciudad, Estado, Código Postal):',
    showIf: { field: 'manager_count', values: [2, 3] },
    required: true
  },

  // Advanced management options (trigger Plus)
  {
    id: 26,
    section: 'management',
    field: 'needs_custom_voting',
    type: 'boolean',
    question_en: 'Do you need custom voting thresholds?\n\n(e.g., requiring 75% vote for major decisions instead of simple majority)',
    question_es: '¿Necesita umbrales de votación personalizados?\n\n(ej., requerir 75% de votos para decisiones importantes en lugar de mayoría simple)',
    showIf: { field: 'member_count', values: [2, 3] },
    required: true,
    tierTrigger: { value: true, upgradeTo: 'llc_plus', reason: 'Custom voting requires LLC Plus' }
  },
  {
    id: 27,
    section: 'management',
    field: 'needs_transfer_restrictions',
    type: 'boolean',
    question_en: 'Do you want restrictions on transferring membership interests?\n\n(e.g., requiring other members\' approval before selling your share)',
    question_es: '¿Desea restricciones para transferir intereses de membresía?\n\n(ej., requerir aprobación de otros miembros antes de vender su parte)',
    showIf: { field: 'member_count', values: [2, 3] },
    required: true,
    tierTrigger: { value: true, upgradeTo: 'llc_plus', reason: 'Transfer restrictions require LLC Plus' }
  },
  {
    id: 28,
    section: 'management',
    field: 'needs_removal_clauses',
    type: 'boolean',
    question_en: 'Do you need manager removal or deadlock resolution clauses?',
    question_es: '¿Necesita cláusulas de remoción de gerentes o resolución de empates?',
    showIf: { field: 'management_type', value: 'manager' },
    required: true,
    tierTrigger: { value: true, upgradeTo: 'llc_plus', reason: 'Removal clauses require LLC Plus' }
  },

  // ============ REGISTERED AGENT SECTION ============
  {
    id: 29,
    section: 'registered_agent',
    field: 'agent_type',
    type: 'select',
    question_en: 'Who will be the Registered Agent for your LLC?\n\nThe Registered Agent receives legal documents on behalf of your LLC and must have a California physical address.',
    question_es: '¿Quién será el Agente Registrado de su LLC?\n\nEl Agente Registrado recibe documentos legales en nombre de su LLC y debe tener una dirección física en California.',
    options: [
      { value: 'self', label_en: 'I will be my own Registered Agent', label_es: 'Yo seré mi propio Agente Registrado' },
      { value: 'other', label_en: 'Another individual', label_es: 'Otra persona' },
      { value: 'platform', label_en: 'Use Multi Servicios 360 ($199/year)', label_es: 'Usar Multi Servicios 360 ($199/año)' }
    ],
    required: true
  },
  {
    id: 30,
    section: 'registered_agent',
    field: 'agent_name',
    type: 'text',
    question_en: 'Registered Agent - Full Legal Name:',
    question_es: 'Agente Registrado - Nombre Legal Completo:',
    showIf: { field: 'agent_type', value: 'other' },
    required: true
  },
  {
    id: 31,
    section: 'registered_agent',
    field: 'agent_address',
    type: 'text',
    question_en: 'Registered Agent - California Street Address (no P.O. Box):\n\nMust be a physical address in California.',
    question_es: 'Agente Registrado - Dirección Física en California (sin P.O. Box):\n\nDebe ser una dirección física en California.',
    showIf: { field: 'agent_type', values: ['self', 'other'] },
    required: true,
    note: 'Must be a California physical address'
  },

  // ============ ADDITIONAL OPTIONS ============
  {
    id: 32,
    section: 'management',
    field: 'wants_attorney_review',
    type: 'boolean',
    question_en: 'Would you like attorney review coordination?\n\nWe can coordinate with an independent licensed attorney to review your documents. Attorney fees are separate and not included in platform pricing.',
    question_es: '¿Le gustaría coordinación de revisión de abogado?\n\nPodemos coordinar con un abogado independiente licenciado para revisar sus documentos. Los honorarios del abogado son separados y no están incluidos en el precio de la plataforma.',
    required: true,
    tierTrigger: { value: true, upgradeTo: 'llc_elite', reason: 'Attorney coordination included in LLC Elite' }
  },
  {
    id: 33,
    section: 'management',
    field: 'wants_white_glove',
    type: 'boolean',
    question_en: 'Would you like white-glove service with priority support and a dedicated validation checklist?',
    question_es: '¿Le gustaría servicio premium con soporte prioritario y una lista de validación dedicada?',
    required: true,
    tierTrigger: { value: true, upgradeTo: 'llc_elite', reason: 'White-glove service is LLC Elite' }
  },

  // ============ FILING SECTION ============
  {
    id: 34,
    section: 'filing',
    field: 'filing_speed',
    type: 'select',
    question_en: 'Select your preferred filing speed:\n\nNote: These are California Secretary of State fees, paid separately.',
    question_es: 'Seleccione su velocidad de presentación preferida:\n\nNota: Estas son tarifas de la Secretaría del Estado de CA, pagadas por separado.',
    options: [
      { value: 'standard', label_en: 'Standard Filing - $70 (5-7 days)', label_es: 'Estándar - $70 (5-7 días)' },
      { value: 'expedite_24hr', label_en: '24-Hour Expedite - $350', label_es: 'Expeditado 24 Horas - $350' },
      { value: 'expedite_same_day', label_en: 'Same-Day Processing - $750', label_es: 'Mismo Día - $750' }
    ],
    required: true
  },

  // ============ FINAL CONFIRMATION ============
  {
    id: 35,
    section: 'review',
    field: 'confirm_accuracy',
    type: 'boolean',
    question_en: 'I confirm that all information provided is accurate and complete to the best of my knowledge.',
    question_es: 'Confirmo que toda la información proporcionada es precisa y completa según mi mejor conocimiento.',
    required: true
  },
  {
    id: 36,
    section: 'review',
    field: 'accept_terms',
    type: 'boolean',
    question_en: 'I understand that Multi Servicios 360 is not a law firm, does not provide legal advice, and that I am using a self-help document preparation platform.',
    question_es: 'Entiendo que Multi Servicios 360 no es un bufete de abogados, no proporciona asesoría legal, y que estoy usando una plataforma de preparación de documentos de autoayuda.',
    required: true
  }
];

// Get questions by section
export const getQuestionsBySection = (section) => {
  return QUESTIONS.filter(q => q.section === section);
};

// Get visible questions based on current data
export const getVisibleQuestions = (intakeData) => {
  return QUESTIONS.filter(q => {
    if (!q.showIf) return true;
    const { field, value, values } = q.showIf;
    if (values) return values.includes(intakeData[field]);
    return intakeData[field] === value;
  });
};

// Check if a question triggers a tier upgrade
export const checkTierTrigger = (question, value) => {
  if (!question.tierTrigger) return null;
  
  const trigger = question.tierTrigger;
  
  if (trigger.values && trigger.values.includes(value)) {
    return { upgradeTo: trigger.upgradeTo, reason: trigger.reason };
  }
  
  if (trigger.value === value) {
    return { upgradeTo: trigger.upgradeTo, reason: trigger.reason };
  }
  
  return null;
};