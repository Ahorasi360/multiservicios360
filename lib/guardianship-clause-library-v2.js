// ═══════════════════════════════════════════════════════════════════
// MULTI SERVICIOS 360 — GUARDIAN NOMINATION & EMERGENCY MINOR
// PROTECTION PACKAGE — CALIFORNIA
// ═══════════════════════════════════════════════════════════════════
// Governing Law:
//   California Probate Code §§1500–1502, §§2100–2113
//   California Family Code §3040 et seq.
//   California Civil Code §1189 (Notary Acknowledgment)
//   HIPAA: 45 CFR §164.502(g) (Personal Representative)
//   FERPA: 20 U.S.C. §1232g (Educational Records)
// ═══════════════════════════════════════════════════════════════════
// Tier Structure:
//   BASIC    → Sections A, B(1 successor), C(death only), D(limited), E(witness)
//   STANDARD → All of Basic + B(2 successors), C(all triggers), D(full powers), E(witness+notary)
//   PREMIUM  → All of Standard + F(attachments: custody affidavit, school auth, medical auth, emergency declaration)
// ═══════════════════════════════════════════════════════════════════

import { formatDateLong } from './clause-libraries';

// ─────────────────────────────────────────────────────────
// MASTER BUILDER
// ─────────────────────────────────────────────────────────

export function buildGuardianshipDesignationV2(d, lang, executionDate) {
  const sections = [];
  const _ = (en, es) => lang === 'es' ? es : en;

  // ── Derived Values ──
  const p1 = d.parent1_name || '___';
  const p1Addr = d.parent1_address || '___';
  const p1Phone = d.parent1_phone || '___';
  const p1DOB = d.parent1_dob || '';
  const hasTwoParents = !!d.parent2_name;
  const p2 = d.parent2_name || '';
  const p2Addr = d.parent2_address || p1Addr;
  const p2Phone = d.parent2_phone || '';
  const p2DOB = d.parent2_dob || '';

  const iWe = hasTwoParents ? _('We', 'Nosotros') : _('I', 'Yo');
  const myOur = hasTwoParents ? _('our', 'nuestro(s)') : _('my', 'mi(s)');
  const amAre = hasTwoParents ? _('are', 'somos') : _('am', 'soy');
  const haveHas = hasTwoParents ? _('have', 'tenemos') : _('have', 'tengo');
  const parentLabel = hasTwoParents
    ? _('parent(s)', 'padre(s)/madre(s)')
    : _('parent', 'padre/madre');

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
      `We, ${p1}, date of birth ${p1DOB || '___'}, currently residing at ${p1Addr}, and ${p2}, date of birth ${p2DOB || '___'}, currently residing at ${p2Addr}, being the natural and/or legal parent(s) of the minor child(ren) identified herein (collectively, the "Minor(s)"), do hereby declare under penalty of perjury pursuant to the laws of the State of California as follows:`,
      `Nosotros, ${p1}, fecha de nacimiento ${p1DOB || '___'}, con domicilio actual en ${p1Addr}, y ${p2}, fecha de nacimiento ${p2DOB || '___'}, con domicilio actual en ${p2Addr}, siendo los padres naturales y/o legales del/los menor(es) identificados en el presente instrumento (colectivamente, los "Menores"), declaramos bajo pena de perjurio conforme a las leyes del Estado de California lo siguiente:`
    )
    : _(
      `I, ${p1}, date of birth ${p1DOB || '___'}, currently residing at ${p1Addr}, being the natural and/or legal parent of the minor child(ren) identified herein (collectively, the "Minor(s)"), do hereby declare under penalty of perjury pursuant to the laws of the State of California as follows:`,
      `Yo, ${p1}, fecha de nacimiento ${p1DOB || '___'}, con domicilio actual en ${p1Addr}, siendo el/la padre/madre natural y/o legal del/los menor(es) identificados en el presente instrumento (colectivamente, los "Menores"), declaro bajo pena de perjurio conforme a las leyes del Estado de California lo siguiente:`
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
      { label: _('Telephone', 'Teléfono'), value: d.guardian_phone || '___' },
      { label: _('Relationship to Minor(s)', 'Relación con los Menores'), value: d.guardian_relationship || '___' },
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
        ...(d.alternate_guardian_phone ? [{ label: _('Telephone', 'Teléfono'), value: d.alternate_guardian_phone }] : []),
        ...(d.alternate_guardian_relationship ? [{ label: _('Relationship to Minor(s)', 'Relación con los Menores'), value: d.alternate_guardian_relationship }] : []),
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
        `Fallecimiento de ${hasTwoParents ? 'ambos padres' : 'el padre/madre firmante'}. Ante el fallecimiento de ${hasTwoParents ? 'ambos padres firmantes' : 'el padre/madre firmante'}, el Guardián nominado tendrá autoridad inmediata para asumir la custodia física de los Menores, sujeto a confirmación judicial conforme a la Sección 1500 del Código de Sucesiones.`
      ),
      // C.1b — Incapacity with medical certification (Standard+)
      ...(isStandard ? [_(
        `Legal incapacity as determined by a court of competent jurisdiction, or physical or mental incapacity as certified in writing by two (2) licensed physicians stating that the ${parentLabel} ${amAre} unable to provide adequate care, supervision, and protection for the Minor(s).`,
        `Incapacidad legal determinada por tribunal competente, o incapacidad física o mental certificada por escrito por dos (2) médicos licenciados que declaren que ${hasTwoParents ? 'los padres' : 'el padre/madre'} no ${hasTwoParents ? 'pueden' : 'puede'} proporcionar cuidado, supervisión y protección adecuados para los Menores.`
      )] : []),
      // C.1c — Temporary emergency (Standard+)
      ...(isStandard ? [_(
        `Temporary emergency circumstances in which the ${parentLabel} ${amAre} unavailable to provide care due to hospitalization, emergency medical treatment, or sudden inability to communicate. In such emergency, the Guardian may assume temporary physical custody for a period not to exceed thirty (30) days without court order, pending judicial review if the emergency extends beyond such period.`,
        `Circunstancias de emergencia temporal en las que ${hasTwoParents ? 'los padres no están' : 'el padre/madre no está'} disponible(s) para proporcionar cuidado debido a hospitalización, tratamiento médico de emergencia, o incapacidad súbita para comunicarse. En dicha emergencia, el Guardián podrá asumir custodia física temporal por un período no mayor a treinta (30) días sin orden judicial, pendiente revisión judicial si la emergencia se extiende más allá de dicho período.`
      )] : []),
      // C.1d — Immigration detention (Standard+)
      ...(isStandard ? [_(
        `Immigration detention or involuntary prolonged absence. If the ${parentLabel} ${amAre} detained by immigration authorities or otherwise involuntarily absent, this Nomination shall serve as evidence of parental intent and the Guardian shall have authority to provide for the immediate needs of the Minor(s).`,
        `Detención migratoria o ausencia involuntaria prolongada. Si ${hasTwoParents ? 'los padres son detenidos' : 'el padre/madre es detenido/a'} por autoridades migratorias o se encuentra(n) involuntariamente ausente(s), esta Nominación servirá como evidencia de intención parental y el Guardián tendrá autoridad para atender las necesidades inmediatas de los Menores.`
      )] : []),
      // C.1e — Military deployment (Standard+ AND conditional)
      ...(hasMilitary && isStandard ? [_(
        `Military deployment. If the ${parentLabel} ${amAre} deployed for military service, this Nomination shall activate for the duration of the deployment and any period of transition not to exceed sixty (60) days following return from deployment.`,
        `Despliegue militar. Si ${hasTwoParents ? 'los padres son desplegados' : 'el padre/madre es desplegado/a'} para servicio militar, esta Nominación se activará por la duración del despliegue y cualquier período de transición no mayor a sesenta (60) días posterior al retorno del despliegue.`
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
        `Conforme a la Ley de Portabilidad y Responsabilidad del Seguro de Salud de 1996 ("HIPAA"), 45 C.F.R. §164.502(g), ${hasTwoParents ? 'los padres autorizan' : 'el padre/madre autoriza'} al Guardián a actuar como representante personal de los Menores para todos los propósitos bajo HIPAA, incluyendo pero no limitado a: acceder, revisar y obtener copias de toda información de salud protegida ("PHI") relacionada con los Menores; comunicarse con proveedores de salud respecto al diagnóstico, tratamiento y pronóstico de los Menores; autorizar la divulgación de registros médicos a terceros según sea razonablemente necesario; y tomar decisiones de salud en nombre de los Menores. Todas las entidades cubiertas según HIPAA quedan dirigidas a reconocer al Guardián como representante personal de los Menores y a proporcionar acceso completo a toda PHI al presentar este instrumento.`
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
        `Conforme a la Ley de Derechos Educativos y Privacidad Familiar ("FERPA"), 20 U.S.C. §1232g, y las disposiciones aplicables del Código de Educación de California, ${hasTwoParents ? 'los padres autorizan' : 'el padre/madre autoriza'} al Guardián a ejercer autoridad educativa plena sobre los Menores, incluyendo pero no limitado a: inscripción y retiro de escuelas públicas, privadas o charter; acceso y revisión de todos los registros educativos, incluyendo calificaciones, asistencia, registros disciplinarios y programas de educación individualizada ("IEP"); consentimiento para evaluaciones educativas, pruebas y servicios de educación especial; asistencia y participación en conferencias de padres y maestros, reuniones escolares y procedimientos IEP; autorización de excursiones y actividades patrocinadas por la escuela; y todas las decisiones respecto a la colocación educativa, currículo y programas académicos de los Menores. Todas las instituciones educativas quedan dirigidas a reconocer al Guardián como padre o tutor legal de los Menores para propósitos de FERPA y a proporcionar acceso completo a registros educativos al presentar este instrumento.`
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
        `${hasTwoParents ? 'Los padres incluyen' : 'El padre/madre incluye'} las siguientes directrices adicionales respecto al cuidado, crianza y bienestar de los Menores. El Guardián hará su mejor esfuerzo por cumplir estas directrices en la medida razonablemente practicable:`
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
        `Esta Nominación no termina, suspende ni limita los derechos parentales de ${hasTwoParents ? 'ninguno de los padres' : 'el padre/madre firmante'} mientras ${hasTwoParents ? 'dicho padre/madre esté' : 'esté'} vivo/a, competente y no sujeto/a a ninguna de las condiciones de activación establecidas en el presente.`
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
        'Esta Nominación permanecerá vigente hasta la primera de las siguientes: (a) que los Menores cumplan dieciocho (18) años de edad; (b) revocación por instrumento escrito ejecutado por padre/madre competente y entregado al Guardián nominado; (c) emisión de orden judicial que sustituya esta Nominación; o (d) el fallecimiento del último Guardián nominado sobreviviente sin sucesor.'
      ),
      _(
        `${hasTwoParents ? 'Either parent' : 'The undersigned parent'} may revoke this Nomination at any time by executing a written revocation, signed and dated, and delivering a copy thereof to the nominated Guardian and any successor Guardians named herein.`,
        `${hasTwoParents ? 'Cualquiera de los padres' : 'El padre/madre firmante'} podrá revocar esta Nominación en cualquier momento ejecutando una revocación escrita, firmada y fechada, y entregando copia de la misma al Guardián nominado y cualquier Guardián sucesor nombrado en el presente.`
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
      `El instrumento anterior fue firmado por ${hasTwoParents ? p1 + ' y ' + p2 : p1} en nuestra presencia, y nosotros, a su solicitud, hemos suscrito nuestros nombres como testigos del mismo. Cada uno de nosotros declara bajo pena de perjurio conforme a las leyes del Estado de California que ${hasTwoParents ? 'los padres' : 'el padre/madre'}, según nuestro mejor conocimiento, se ${hasTwoParents ? 'encuentran' : 'encuentra'} en pleno uso de facultades mentales, no actúa(n) bajo coacción, y ejecutó/ejecutaron este instrumento voluntariamente.`
    ),
    witnesses: [
      { label: _('Witness 1', 'Testigo 1') },
      { label: _('Witness 2', 'Testigo 2') },
    ],
  });

  // ── NOTARY ACKNOWLEDGMENT (E.2) ──
  // Clause ID: GD_NOTARY | Tier: Standard+ | Trigger: Standard & Premium only
  // California Civil Code §1189 — Current statutory language
  if (isStandard) {
  sections.push({
    id: 'GD_NOTARY', type: 'article',
    article_num: '',
    title: _('NOTARY ACKNOWLEDGMENT', 'RECONOCIMIENTO NOTARIAL'),
    text: _(
      `A notary public or other officer completing this certificate verifies only the identity of the individual who signed the document to which this certificate is attached, and not the truthfulness, accuracy, or validity of that document.

State of California
County of ${county}

On ${execDate}, before me, ________________________, a notary public, personally appeared ${hasTwoParents ? p1 + ' and ' + p2 : p1}, who proved to me on the basis of satisfactory evidence to be the person(s) whose name(s) is/are subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their authorized capacity(ies), and that by his/her/their signature(s) on the instrument the person(s), or the entity upon behalf of which the person(s) acted, executed the instrument.

I certify under PENALTY OF PERJURY under the laws of the State of California that the foregoing paragraph is true and correct.

WITNESS my hand and official seal.`,
      `Un notario público u otro funcionario que complete este certificado verifica únicamente la identidad de la persona que firmó el documento al cual se adjunta este certificado, y no la veracidad, exactitud o validez de dicho documento.

Estado de California
Condado de ${county}

El ${execDate}, ante mí, ________________________, notario público, compareció personalmente ${hasTwoParents ? p1 + ' y ' + p2 : p1}, quien(es) me demostró/demostraron ser la(s) persona(s) cuyo(s) nombre(s) está(n) suscrito(s) al instrumento adjunto y reconoció/reconocieron ante mí que ejecutó/ejecutaron el mismo en su(s) capacidad(es) autorizada(s), y que mediante su(s) firma(s) en el instrumento, la(s) persona(s), o la entidad en cuyo nombre actuó/actuaron, ejecutó/ejecutaron el instrumento.

Certifico bajo PENA DE PERJURIO conforme a las leyes del Estado de California que el párrafo anterior es verdadero y correcto.

DOY FE con mi mano y sello oficial.`
    ),
  });
  } // end isStandard gate for notary


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

Yo/Nosotros, ${hasTwoParents ? p1 + ' y ' + p2 : p1}, ${hasTwoParents ? 'somos los padres legales' : 'soy el padre/madre legal'} de los siguientes hijos menores:

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

Yo/Nosotros, ${hasTwoParents ? p1 + ' y ' + p2 : p1}, ${hasTwoParents ? 'somos los padres legales' : 'soy el padre/madre legal'} de los siguientes hijos menores:

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
Telephone: ${d.guardian_phone || '___'}
Relationship: ${d.guardian_relationship || '___'}

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
Teléfono: ${d.guardian_phone || '___'}
Relación: ${d.guardian_relationship || '___'}

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
// ENGINE INTEGRATION — LOGIC MAP
// ═══════════════════════════════════════════════════════════════════
//
// MANDATORY CLAUSES (Always included):
//   GD_TITLE_SUB, GD_TITLE_COMPLIANCE
//   GD_ART_PARENT_ID
//   GD_ART_MINOR_ID
//   GD_ART_PRIMARY
//   GD_ART_ACTIVATION (death, incapacity, emergency, immigration, court)
//   GD_ART_POWERS (custody, residence, benefits, financial, insurance, general)
//   GD_ART_LIMITS
//   GD_ART_DURATION
//   GD_ART_LAW
//   GD_EXEC, GD_SIG, GD_WITNESS
//
// CONDITIONAL CLAUSES:
//   GD_ART_SUCC1          → IF alternate_guardian_name provided
//   GD_ART_SUCC2          → IF second_alternate_name provided
//   GD_PWR_MEDICAL/HIPAA  → IF medical_authority === 'yes'
//   GD_PWR_MENTAL_HEALTH  → IF medical_authority === 'yes'
//   GD_PWR_EDUCATION      → IF education_authority === 'yes'
//   GD_PWR_TRAVEL         → IF travel_authority === 'yes'
//   GD_ART_SPECIAL        → IF special_instructions provided
//   Military deployment   → IF military_deployment === true
//   GD_NOTARY             → Standard & Premium tiers
//   GD_ATTACH_CUSTODY     → Premium tier
//   GD_ATTACH_SCHOOL      → Premium tier + education_authority
//   GD_ATTACH_MEDICAL     → Premium tier + medical_authority
//   GD_ATTACH_EMERGENCY   → Premium tier
//
// ═══════════════════════════════════════════════════════════════════
// TIER ASSEMBLY:
//   BASIC ($129):
//     Core clauses + 1 successor + death activation + limited powers
//     Witness block only (no notary)
//     ~5-6 pages
//
//   STANDARD ($199):
//     All Basic + 2 successors + all activation conditions
//     Full powers (HIPAA, FERPA, travel, financial, insurance)
//     Witness + Notary acknowledgment
//     ~8-10 pages
//
//   PREMIUM ($299):
//     All Standard + Attachments (Custody Affidavit, School Auth,
//     Medical Auth, Emergency Declaration)
//     ~12-15 pages
// ═══════════════════════════════════════════════════════════════════
