// TRUST QUESTIONS - 46 questions across 11 sections

export const QUESTIONS = [
  // === SECTION 1: ABOUT YOU (Trustor) ===
  { field: 'trustor_name', question_en: "What is your full legal name?", question_es: "¿Cuál es su nombre legal completo?", type: 'text', section: 'trustor' },
  { field: 'trustor_address', question_en: "What is your current address (street, city, state, zip)?", question_es: "¿Cuál es su dirección actual (calle, ciudad, estado, código postal)?", type: 'text', section: 'trustor' },
  { field: 'trustor_dob', question_en: "What is your date of birth?", question_es: "¿Cuál es su fecha de nacimiento?", type: 'text', section: 'trustor' },
  { field: 'trustor_phone', question_en: "What is your phone number?", question_es: "¿Cuál es su número de teléfono?", type: 'text', section: 'trustor' },
  { field: 'trustor_email', question_en: "What is your email address?", question_es: "¿Cuál es su correo electrónico?", type: 'text', section: 'trustor' },

  // === SECTION 2: MARITAL STATUS ===
  { field: 'marital_status', question_en: "What is your marital status?", question_es: "¿Cuál es su estado civil?", type: 'select', options: [
    { value: 'single', label_en: 'Single', label_es: 'Soltero/a' },
    { value: 'married', label_en: 'Married', label_es: 'Casado/a' },
    { value: 'domestic_partnership', label_en: 'Domestic Partnership', label_es: 'Pareja de hecho' },
    { value: 'divorced', label_en: 'Divorced', label_es: 'Divorciado/a' },
    { value: 'widowed', label_en: 'Widowed', label_es: 'Viudo/a' }
  ], section: 'marital' },
  { field: 'spouse_name', question_en: "What is your spouse/partner's full legal name?", question_es: "¿Cuál es el nombre legal completo de su cónyuge/pareja?", type: 'text', showIf: { field: 'marital_status', values: ['married', 'domestic_partnership'] }, section: 'marital' },
  { field: 'is_joint_trust', question_en: "Will this be a joint trust with your spouse/partner?", question_es: "¿Será este un fideicomiso conjunto con su cónyuge/pareja?", type: 'boolean', showIf: { field: 'marital_status', values: ['married', 'domestic_partnership'] }, section: 'marital' },
  { field: 'property_type', question_en: "Is your property community property or separate property?", question_es: "¿Su propiedad es propiedad comunitaria o propiedad separada?", type: 'select', showIf: { field: 'marital_status', values: ['married', 'domestic_partnership'] }, options: [
    { value: 'community', label_en: 'Community Property', label_es: 'Propiedad Comunitaria' },
    { value: 'separate', label_en: 'Separate Property', label_es: 'Propiedad Separada' },
    { value: 'mixed', label_en: 'Mix of Both', label_es: 'Mezcla de Ambas' }
  ], section: 'marital' },

  // === SECTION 3: TRUST TYPE ===
  { field: 'is_revocable', question_en: "Do you want the ability to change or cancel this trust during your lifetime?", question_es: "¿Desea tener la capacidad de cambiar o cancelar este fideicomiso durante su vida?", type: 'boolean', section: 'trust_type', note: '99% choose Yes (Revocable)' },

  // === SECTION 4: TRUSTEES ===
  { field: 'initial_trustee', question_en: "Who will manage the trust while you are alive and able?", question_es: "¿Quién administrará el fideicomiso mientras usted esté vivo y capaz?", type: 'select', options: [
    { value: 'myself', label_en: 'Myself', label_es: 'Yo mismo/a' },
    { value: 'myself_and_spouse', label_en: 'Myself and Spouse', label_es: 'Yo y mi cónyuge' },
    { value: 'someone_else', label_en: 'Someone Else', label_es: 'Otra persona' }
  ], section: 'trustees' },
  { field: 'successor_trustee_1_name', question_en: "If you become unable to manage your affairs, who should take over as trustee?", question_es: "Si usted no puede administrar sus asuntos, ¿quién debería tomar el cargo de fideicomisario?", type: 'text', section: 'trustees' },
  { field: 'successor_trustee_1_relationship', question_en: "What is this person's relationship to you?", question_es: "¿Cuál es la relación de esta persona con usted?", type: 'text', section: 'trustees' },
  { field: 'successor_trustee_1_phone', question_en: "What is their phone number?", question_es: "¿Cuál es su número de teléfono?", type: 'text', section: 'trustees' },
  { field: 'successor_trustee_2_name', question_en: "If your first choice cannot serve, who is your backup?", question_es: "Si su primera opción no puede servir, ¿quién es su respaldo?", type: 'text', section: 'trustees' },
  { field: 'successor_trustee_2_relationship', question_en: "What is this backup person's relationship to you?", question_es: "¿Cuál es la relación de esta persona de respaldo con usted?", type: 'text', section: 'trustees' },
  { field: 'trustee_action_type', question_en: "Should both trustees act together, or can either act alone?", question_es: "¿Deben ambos fideicomisarios actuar juntos, o cualquiera puede actuar solo?", type: 'select', showIf: { field: 'is_joint_trust', value: true }, options: [
    { value: 'together', label_en: 'Must act together', label_es: 'Deben actuar juntos' },
    { value: 'either', label_en: 'Either can act alone', label_es: 'Cualquiera puede actuar solo' }
  ], section: 'trustees' },

  // === SECTION 5: BENEFICIARIES ===
  { field: 'beneficiary_type', question_en: "Who should receive your trust assets after you pass away?", question_es: "¿Quién debería recibir los activos del fideicomiso después de su fallecimiento?", type: 'select', options: [
    { value: 'spouse', label_en: 'Spouse', label_es: 'Cónyuge' },
    { value: 'children_equal', label_en: 'Children Equally', label_es: 'Hijos por partes iguales' },
    { value: 'children_unequal', label_en: 'Children Unequally', label_es: 'Hijos en partes desiguales' },
    { value: 'other', label_en: 'Other People', label_es: 'Otras personas' },
    { value: 'charity', label_en: 'Charity', label_es: 'Caridad' },
    { value: 'combination', label_en: 'Combination', label_es: 'Combinación' }
  ], section: 'beneficiaries' },
  { field: 'primary_beneficiaries', question_en: "Please list your primary beneficiaries (name and relationship, separated by commas):", question_es: "Por favor liste sus beneficiarios principales (nombre y relación, separados por comas):", type: 'text', section: 'beneficiaries' },
  { field: 'beneficiary_shares', question_en: "What percentage should each receive? (e.g., 'John 50%, Jane 50%')", question_es: "¿Qué porcentaje debe recibir cada uno? (ej., 'Juan 50%, María 50%')", type: 'text', section: 'beneficiaries' },
  { field: 'distribution_method', question_en: "If a beneficiary passes away before you, should their share go to:", question_es: "Si un beneficiario fallece antes que usted, ¿su parte debería ir a:", type: 'select', options: [
    { value: 'per_stirpes', label_en: 'Their children (per stirpes)', label_es: 'Sus hijos (por estirpe)' },
    { value: 'per_capita', label_en: 'Remaining beneficiaries equally', label_es: 'Los beneficiarios restantes por igual' },
    { value: 'specific', label_en: 'Someone specific', label_es: 'Alguien específico' }
  ], section: 'beneficiaries' },
  { field: 'survivorship_requirement', question_en: "Should a beneficiary be required to survive you by a certain period to inherit?", question_es: "¿Debe un beneficiario sobrevivirle por un período determinado para heredar?", type: 'select', options: [
    { value: 'none', label_en: 'No requirement', label_es: 'Sin requisito' },
    { value: '120_hours', label_en: '120 hours (5 days)', label_es: '120 horas (5 días)' },
    { value: '30_days', label_en: '30 days', label_es: '30 días' }
  ], section: 'beneficiaries' },

  // === SECTION 6: CHILDREN & MINORS ===
  { field: 'has_minor_children', question_en: "Do you have any children under 18?", question_es: "¿Tiene hijos menores de 18 años?", type: 'boolean', section: 'children' },
  { field: 'minor_children', question_en: "Please list their names and ages (e.g., 'John 12, Maria 8'):", question_es: "Por favor liste sus nombres y edades (ej., 'Juan 12, María 8'):", type: 'text', showIf: { field: 'has_minor_children', value: true }, section: 'children' },
  { field: 'minor_distribution_age', question_en: "At what age should they receive their inheritance?", question_es: "¿A qué edad deben recibir su herencia?", type: 'select', showIf: { field: 'has_minor_children', value: true }, options: [
    { value: '18', label_en: 'Age 18', label_es: 'A los 18 años' },
    { value: '21', label_en: 'Age 21', label_es: 'A los 21 años' },
    { value: '25', label_en: 'Age 25', label_es: 'A los 25 años' },
    { value: 'staggered', label_en: 'Staggered (1/3 at 25, 1/3 at 30, 1/3 at 35)', label_es: 'Escalonado (1/3 a los 25, 1/3 a los 30, 1/3 a los 35)' }
  ], section: 'children' },
  { field: 'minor_trust_trustee', question_en: "Who should manage their inheritance until they reach that age?", question_es: "¿Quién debe administrar su herencia hasta que alcancen esa edad?", type: 'text', showIf: { field: 'has_minor_children', value: true }, section: 'children' },
  { field: 'has_excluded_children', question_en: "Do you have any children or grandchildren not listed who you want to EXCLUDE?", question_es: "¿Tiene hijos o nietos no listados que desea EXCLUIR?", type: 'boolean', section: 'children', note: 'Flag for attorney review if yes' },
  { field: 'afterborn_included', question_en: "Should children born or adopted after today be automatically included?", question_es: "¿Deben incluirse automáticamente los hijos nacidos o adoptados después de hoy?", type: 'boolean', section: 'children' },

  // === SECTION 7: SPECIAL BENEFICIARY SITUATIONS ===
  { field: 'beneficiary_on_benefits', question_en: "Does any beneficiary receive government benefits like SSI, Medicaid, or disability?", question_es: "¿Algún beneficiario recibe beneficios del gobierno como SSI, Medicaid o discapacidad?", type: 'select', options: [
    { value: 'yes', label_en: 'Yes', label_es: 'Sí' },
    { value: 'no', label_en: 'No', label_es: 'No' },
    { value: 'not_sure', label_en: 'Not Sure', label_es: 'No estoy seguro' }
  ], section: 'special', note: 'Triggers attorney review if yes' },
  { field: 'has_conditions', question_en: "Do you want to place any conditions on inheritance (like finishing college, staying drug-free)?", question_es: "¿Desea poner condiciones a la herencia (como terminar la universidad, mantenerse libre de drogas)?", type: 'boolean', section: 'special', note: 'Elite tier + attorney flag if yes' },

  // === SECTION 8: ASSETS ===
  { field: 'owns_ca_real_estate', question_en: "Do you own real estate in California?", question_es: "¿Es propietario de bienes raíces en California?", type: 'boolean', section: 'assets' },
  { field: 'num_properties', question_en: "How many properties do you own in California?", question_es: "¿Cuántas propiedades posee en California?", type: 'text', showIf: { field: 'owns_ca_real_estate', value: true }, section: 'assets' },
  { field: 'properties', question_en: "Please provide the address of each property (separate with semicolons):", question_es: "Por favor proporcione la dirección de cada propiedad (separe con punto y coma):", type: 'text', showIf: { field: 'owns_ca_real_estate', value: true }, section: 'assets' },
  { field: 'owns_out_of_state_property', question_en: "Do you own real estate OUTSIDE California?", question_es: "¿Es propietario de bienes raíces FUERA de California?", type: 'boolean', section: 'assets', note: 'Triggers attorney flag' },
  { field: 'owns_business', question_en: "Do you own a business or have business interests?", question_es: "¿Es dueño de un negocio o tiene intereses comerciales?", type: 'boolean', section: 'assets' },
  { field: 'has_digital_assets', question_en: "Do you have digital assets (cryptocurrency, online accounts, social media)?", question_es: "¿Tiene activos digitales (criptomonedas, cuentas en línea, redes sociales)?", type: 'boolean', section: 'assets' },
  { field: 'has_specific_gifts', question_en: "Do you have specific items (jewelry, art, cars) you want to leave to specific people?", question_es: "¿Tiene artículos específicos (joyas, arte, autos) que desea dejar a personas específicas?", type: 'boolean', section: 'assets' },

  // === SECTION 9: INCAPACITY ===
  { field: 'incapacity_determination', question_en: "If you become incapacitated, how should that be determined?", question_es: "Si queda incapacitado, ¿cómo debe determinarse eso?", type: 'select', options: [
    { value: 'two_doctors', label_en: 'Two doctors agree', label_es: 'Dos médicos están de acuerdo' },
    { value: 'one_doctor', label_en: 'One doctor agrees', label_es: 'Un médico está de acuerdo' },
    { value: 'court', label_en: 'Court decides', label_es: 'El tribunal decide' }
  ], section: 'incapacity' },
  { field: 'has_poa', question_en: "Have you already created a Power of Attorney for finances?", question_es: "¿Ya ha creado un Poder Notarial para finanzas?", type: 'select', options: [
    { value: 'yes', label_en: 'Yes', label_es: 'Sí' },
    { value: 'no', label_en: 'No', label_es: 'No' },
    { value: 'not_sure', label_en: 'Not Sure', label_es: 'No estoy seguro' }
  ], section: 'incapacity' },
  { field: 'has_healthcare_directive', question_en: "Have you already created a Healthcare Directive?", question_es: "¿Ya ha creado una Directiva de Atención Médica?", type: 'select', options: [
    { value: 'yes', label_en: 'Yes', label_es: 'Sí' },
    { value: 'no', label_en: 'No', label_es: 'No' },
    { value: 'not_sure', label_en: 'Not Sure', label_es: 'No estoy seguro' }
  ], section: 'incapacity' },

  // === SECTION 10: DISPUTES & ADMINISTRATION ===
  { field: 'dispute_resolution', question_en: "If there's a dispute about the trust, how should it be resolved?", question_es: "Si hay una disputa sobre el fideicomiso, ¿cómo debe resolverse?", type: 'select', options: [
    { value: 'mediation', label_en: 'Mediation first, then court', label_es: 'Mediación primero, luego tribunal' },
    { value: 'court', label_en: 'Go directly to court', label_es: 'Ir directamente al tribunal' },
    { value: 'arbitration', label_en: 'Binding arbitration', label_es: 'Arbitraje vinculante' }
  ], section: 'disputes' },
  { field: 'has_no_contest', question_en: "Should a beneficiary who unsuccessfully challenges the trust lose their inheritance?", question_es: "¿Debe un beneficiario que impugna el fideicomiso sin éxito perder su herencia?", type: 'boolean', section: 'disputes' },
  { field: 'require_accounting', question_en: "Should the trustee be required to provide annual reports to beneficiaries?", question_es: "¿Debe el fideicomisario proporcionar informes anuales a los beneficiarios?", type: 'boolean', section: 'disputes' },

  // === SECTION 11: FINAL DETAILS ===
  { field: 'county', question_en: "What county do you live in?", question_es: "¿En qué condado vive?", type: 'text', section: 'final' },
  { field: 'additional_instructions', question_en: "Is there anything else you want included in your trust?", question_es: "¿Hay algo más que desee incluir en su fideicomiso?", type: 'text', section: 'final', note: 'Flag for review if complex' },
];
