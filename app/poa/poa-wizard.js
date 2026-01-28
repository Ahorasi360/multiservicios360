"use client";
import React, { useState, useEffect, useRef } from 'react';

const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>);
const DownloadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>);
const PrintIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>);
const EmailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>);

const QUESTIONS = [
  // === SECTION 1: PRINCIPAL INFORMATION ===
  { field: 'principal_name', question_en: "What is the full legal name of the Principal (person granting power)?", question_es: "¿Cuál es el nombre legal completo del Poderdante (persona que otorga el poder)?", type: 'text', section: 'principal' },
  { field: 'has_aka', question_en: "Does the Principal have any other names (AKA/maiden name/former name)?", question_es: "¿El Poderdante tiene otros nombres (también conocido como/nombre de soltera/nombre anterior)?", type: 'boolean', section: 'principal' },
  { field: 'aka_names', question_en: "Please list all other names (separate with commas):", question_es: "Por favor liste todos los otros nombres (separe con comas):", type: 'text', showIf: { field: 'has_aka', value: true }, section: 'principal' },
  { field: 'principal_address', question_en: "What is the Principal's complete address?", question_es: "¿Cuál es la dirección completa del Poderdante (calle, ciudad, estado, código postal)?", type: 'text', section: 'principal' },
  { field: 'principal_county', question_en: "What county does the Principal reside in?", question_es: "¿En qué condado reside el Poderdante (ejemplo: Los Angeles, Orange, San Diego)?", type: 'text', section: 'principal' },
  
  // === SECTION 2: AGENT INFORMATION ===
  { field: 'agent_name', question_en: "Who would you like to appoint as your Agent (Attorney-in-Fact)?", question_es: "¿A quién le gustaría nombrar como su Apoderado (la persona autorizada para actuar en su nombre)?", type: 'text', section: 'agent' },
  { field: 'agent_address', question_en: "What is the Agent's complete address?", question_es: "¿Cuál es la dirección completa del Apoderado?", type: 'text', section: 'agent' },
  { field: 'agent_relationship', question_en: "What is the Agent's relationship to the Principal (spouse, child, sibling, friend, etc.)?", question_es: "¿Cuál es la relación del Apoderado con el Poderdante (esposo/a, hijo/a, hermano/a, amigo/a, etc.)?", type: 'text', section: 'agent' },
  
  // === SECTION 3: SUCCESSOR AGENT ===
  { field: 'wants_successor', question_en: "Would you like to name a Successor Agent (backup if primary agent cannot serve)?", question_es: "¿Desea nombrar un Apoderado Sucesor (respaldo si el apoderado principal no puede servir)?", type: 'boolean', section: 'successor' },
  { field: 'successor_agent', question_en: "What is the full name of your Successor Agent?", question_es: "¿Cuál es el nombre completo del Apoderado Sucesor?", type: 'text', showIf: { field: 'wants_successor', value: true }, section: 'successor' },
  { field: 'successor_address', question_en: "What is the Successor Agent's complete address?", question_es: "¿Cuál es la dirección completa del Apoderado Sucesor?", type: 'text', showIf: { field: 'wants_successor', value: true }, section: 'successor' },
  { field: 'successor_relationship', question_en: "What is the Successor Agent's relationship to the Principal (spouse, child, sibling, friend, etc.)?", question_es: "¿Cuál es la relación del Apoderado Sucesor con el Poderdante (esposo/a, hijo/a, hermano/a, amigo/a, etc.)?", type: 'text', showIf: { field: 'wants_successor', value: true }, section: 'successor' },
  
  // === SECTION 4: POA TYPE & EFFECTIVENESS ===
  { field: 'durable', question_en: "Should this Power of Attorney be DURABLE (remain valid even if you become incapacitated)?", question_es: "¿Debe este Poder Notarial ser DURADERO (permanecer válido incluso si usted queda incapacitado)?", type: 'boolean', section: 'type' },
  { field: 'effective_when', question_en: "When should this Power of Attorney become effective?", question_es: "¿Cuándo debe entrar en vigor este Poder Notarial?", type: 'select', options: [{ value: 'immediately', label_en: 'Immediately upon signing', label_es: 'Inmediatamente al firmar' }, { value: 'upon_incapacity', label_en: 'Only upon my incapacity (Springing POA)', label_es: 'Solo si quedo incapacitado (Poder Contingente)' }], section: 'type' },
  
  // === SECTION 5: FINANCIAL POWERS ===
  { field: 'powers_real_estate', question_en: "Grant authority over REAL ESTATE transactions (buy, sell, refinance property)?", question_es: "¿Otorgar autoridad sobre transacciones de BIENES RAÍCES (comprar, vender, refinanciar propiedades)?", type: 'boolean', section: 'powers' },
  { field: 'powers_banking', question_en: "Grant authority over BANKING and financial accounts (checking, savings, CDs)?", question_es: "¿Otorgar autoridad sobre cuentas BANCARIAS y financieras (cuentas de cheques, ahorros, CDs)?", type: 'boolean', section: 'powers' },
  { field: 'powers_stocks', question_en: "Grant authority over STOCKS, BONDS, and investments (brokerage accounts, mutual funds)?", question_es: "¿Otorgar autoridad sobre ACCIONES, BONOS e inversiones (cuentas de corretaje, fondos mutuos)?", type: 'boolean', section: 'powers' },
  { field: 'powers_business', question_en: "Grant authority over BUSINESS operations (LLCs, corporations, partnerships)?", question_es: "¿Otorgar autoridad sobre OPERACIONES COMERCIALES (LLCs, corporaciones, sociedades)?", type: 'boolean', section: 'powers' },
  { field: 'powers_insurance', question_en: "Grant authority over INSURANCE policies and claims (life, health, property)?", question_es: "¿Otorgar autoridad sobre pólizas y reclamos de SEGUROS (vida, salud, propiedad)?", type: 'boolean', section: 'powers' },
  { field: 'powers_retirement', question_en: "Grant authority over RETIREMENT accounts (IRA, 401k, pension, annuities)?", question_es: "¿Otorgar autoridad sobre cuentas de JUBILACIÓN (IRA, 401k, pensión, anualidades)?", type: 'boolean', section: 'powers' },
  { field: 'powers_government', question_en: "Grant authority over GOVERNMENT BENEFITS (Social Security, Medicare, Medi-Cal, VA)?", question_es: "¿Otorgar autoridad sobre BENEFICIOS GUBERNAMENTALES (Seguro Social, Medicare, Medi-Cal, VA)?", type: 'boolean', section: 'powers' },
  { field: 'powers_litigation', question_en: "Grant authority over CLAIMS and LITIGATION (lawsuits, settlements, legal disputes)?", question_es: "¿Otorgar autoridad sobre RECLAMOS Y LITIGIOS (demandas, acuerdos, disputas legales)?", type: 'boolean', section: 'powers' },
  { field: 'powers_tax', question_en: "Grant authority over TAX matters (IRS, California FTB, file returns)?", question_es: "¿Otorgar autoridad sobre asuntos FISCALES (IRS, FTB de California, presentar declaraciones)?", type: 'boolean', section: 'powers' },
  
  // === SECTION 6: ADVANCED/HOT POWERS ===
  { field: 'hot_gifts', question_en: "Authorize Agent to MAKE GIFTS on your behalf (WARNING: This is a significant power)?", question_es: "¿Autorizar al Apoderado a HACER REGALOS en su nombre (ADVERTENCIA: Este es un poder significativo)?", type: 'boolean', section: 'advanced' },
  { field: 'gift_limit', question_en: "What is the maximum gift amount per person per year?", question_es: "¿Cuál es el monto máximo de regalo por persona por año?", type: 'select', showIf: { field: 'hot_gifts', value: true }, options: [{ value: 'annual_exclusion', label_en: 'Annual gift tax exclusion ($19,000 in 2025-2026)', label_es: 'Exclusión anual de impuesto sobre regalos ($19,000 en 2025-2026)' }, { value: 'unlimited', label_en: 'No limit (use with extreme caution)', label_es: 'Sin límite (usar con extrema precaución)' }, { value: 'custom', label_en: 'Custom amount', label_es: 'Monto personalizado' }], section: 'advanced' },
  { field: 'hot_beneficiary', question_en: "Authorize Agent to change BENEFICIARY designations (life insurance, retirement accounts)?", question_es: "¿Autorizar al Apoderado a cambiar designaciones de BENEFICIARIOS (seguros de vida, cuentas de jubilación)?", type: 'boolean', section: 'advanced' },
  { field: 'hot_trust', question_en: "Authorize Agent to create, amend, or revoke TRUSTS (living trusts, revocable trusts)?", question_es: "¿Autorizar al Apoderado a crear, modificar o revocar FIDEICOMISOS (fideicomisos en vida, fideicomisos revocables)?", type: 'boolean', section: 'advanced' },
  
  // === SECTION 7: HIPAA AUTHORIZATION ===
  { field: 'include_hipaa', question_en: "Include HIPAA Authorization (access to medical records for financial decision-making)?", question_es: "¿Incluir Autorización HIPAA (acceso a registros médicos para tomar decisiones financieras)?", type: 'boolean', section: 'hipaa' },
  
  // === SECTION 8: RECORDING & REAL ESTATE ===
  { field: 'record_for_real_estate', question_en: "Do you intend to RECORD this POA with the County Recorder (required for real estate transactions)?", question_es: "¿Pretende REGISTRAR este Poder Notarial con el Registrador del Condado (requerido para transacciones de bienes raíces)?", type: 'boolean', section: 'recording' },
  { field: 'recording_county', question_en: "Which county will this be recorded in?", question_es: "¿En qué condado se registrará (ejemplo: Los Angeles, Orange, San Diego)?", type: 'text', showIf: { field: 'record_for_real_estate', value: true }, section: 'recording' },
  
  // === SECTION 9: SPECIAL INSTRUCTIONS ===
  { field: 'has_special_instructions', question_en: "Do you have any special instructions or limitations for your Agent?", question_es: "¿Tiene instrucciones especiales o limitaciones para su Apoderado?", type: 'boolean', section: 'special' },
  { field: 'special_instructions', question_en: "Please describe your special instructions:", question_es: "Por favor describa sus instrucciones especiales (sea específico):", type: 'text', showIf: { field: 'has_special_instructions', value: true }, section: 'special' },
];

const TRANSLATIONS = {
  en: { 
    title: "California Power of Attorney", 
    subtitle: "Multi Servicios 360", 
    greeting: "Hello! I'll help you create a comprehensive Power of Attorney. Let's get started with the Principal's information.", 
    send: "Send", 
    progress: "Progress", 
    tierSelect: "Select Review Tier", 
    submit: "Unlock Document", 
    tierClarification: "Clarification: This service does not include legal services. Documents are self-prepared. Attorneys are independent, and any review or consultation is subject to availability and contracted separately.", 
    upsellNotaryDesc: "Administrative notary coordination (independent provider)", 
    basePrice: "Platform Access", 
    paymentNote: "Payment for platform access.", 
    clientInfo: "Client Information", 
    clientName: "Your Full Name", 
    clientEmail: "Your Email", 
    clientPhone: "Your Phone (optional)", 
    continue: "Continue to Questions", 
    back: "Back",
    yes: "Yes", 
    no: "No", 
    options: "Options:", 
    saved: "Saved:", 
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    clickToEdit: "Click to edit", 
    pleaseAnswer: "Please answer Yes or No.", 
    pleaseSelect: "Please select one of the options.", 
    paying: "Processing...", 
    legalNote: "Note: Your document will be provided in both English and Spanish.", 
    yourAnswers: "Your Answers", 
    answersWillAppear: "Your answers will appear here", 
    allQuestionsAnswered: "All questions answered! Now select a review tier below.", 
    errorTryAgain: "Error. Please try again.", 
    provideNameEmail: "Please provide your name and email", 
    failedSubmit: "Failed to submit.", 
    typeAnswer: "Type your answer...", 
    upsellNotary: "NOTARY COORDINATION", 
    upsellNotaryDesc: "Remote Online Notary coordination", 
    upsellNotaryPrice: "+$150", 
    upsellNotarySave: "Convenient", 
    upsellRecording: "RECORDING COORDINATION", 
    upsellRecordingDesc: "County recording for real estate POA", 
    upsellRecordingPrice: "+$250", 
    upsellRecordingSave: "Real Estate", 
    upsellAmendment: "FUTURE AMENDMENTS", 
    upsellAmendmentDesc: "One amendment within 12 months", 
    upsellAmendmentPrice: "+$99", 
    upsellAmendmentSave: "Save Later", 
    addOns: "Add-On Services", 
    addOnsSubtitle: "Enhance your package", 
    orderSummary: "Order Summary", 
    basePrice: "Base Price", 
    total: "Total", 
    selectedAddOns: "Selected Add-Ons",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    clickToEdit: "Click to edit",
    sections: {
      principal: "Principal Information",
      agent: "Agent Information", 
      successor: "Successor Agent",
      type: "POA Type & Effectiveness",
      powers: "Financial Powers",
      advanced: "Advanced Powers",
      hipaa: "HIPAA Authorization",
      recording: "Recording",
      special: "Special Instructions"
    }
  },
  es: { 
    title: "Poder Notarial de California", 
    subtitle: "Multi Servicios 360", 
    greeting: "¡Hola! Le ayudaré a crear un Poder Notarial completo. Comencemos con la información del Poderdante.", 
    send: "Enviar", 
    progress: "Progreso", 
    tierSelect: "Seleccionar Nivel", 
    submit: "Desbloquear Documento", 
    tierClarification: "Aclaración: Este servicio no incluye servicios legales. Los documentos son autopreparados. Los abogados son independientes y cualquier revisión o consulta está sujeta a disponibilidad y se contrata por separado.", 
    upsellNotaryDesc: "Coordinación administrativa de notario (proveedor independiente)", 
    basePrice: "Acceso a la Plataforma", 
    paymentNote: "Pago por acceso a la plataforma.", 
    clientInfo: "Información del Cliente", 
    clientName: "Su Nombre Completo", 
    clientEmail: "Su Correo Electrónico", 
    clientPhone: "Su Teléfono (opcional)", 
    continue: "Continuar", 
    back: "Atrás",
    yes: "Sí", 
    no: "No", 
    options: "Opciones:", 
    saved: "Guardado:", 
    edit: "Editar",
    save: "Guardar",
    cancel: "Cancelar",
    clickToEdit: "Clic para editar", 
    pleaseAnswer: "Por favor responda Sí o No.", 
    pleaseSelect: "Por favor seleccione una de las opciones.", 
    paying: "Procesando...", 
    legalNote: "Nota: El documento oficial estará en inglés según la ley de California.", 
    yourAnswers: "Sus Respuestas", 
    answersWillAppear: "Sus respuestas aparecerán aquí", 
    allQuestionsAnswered: "¡Todas las preguntas respondidas! Ahora seleccione un nivel abajo.", 
    errorTryAgain: "Error. Por favor intente de nuevo.", 
    provideNameEmail: "Por favor proporcione su nombre y correo", 
    failedSubmit: "Error al enviar.", 
    typeAnswer: "Escriba su respuesta...", 
    upsellNotary: "COORDINACIÓN DE NOTARIO", 
    upsellNotaryDesc: "Coordinación de notario en línea", 
    upsellNotaryPrice: "+$150", 
    upsellNotarySave: "Conveniente", 
    upsellRecording: "COORDINACIÓN DE REGISTRO", 
    upsellRecordingDesc: "Registro del condado para POA de bienes raíces", 
    upsellRecordingPrice: "+$250", 
    upsellRecordingSave: "Bienes Raíces", 
    upsellAmendment: "ENMIENDAS FUTURAS", 
    upsellAmendmentDesc: "Una enmienda en 12 meses", 
    upsellAmendmentPrice: "+$99", 
    upsellAmendmentSave: "Ahorre", 
    addOns: "Servicios Adicionales", 
    addOnsSubtitle: "Mejore su paquete", 
    orderSummary: "Resumen del Pedido", 
    basePrice: "Precio Base", 
    total: "Total", 
    selectedAddOns: "Servicios Adicionales",
    edit: "Editar",
    save: "Guardar",
    cancel: "Cancelar",
    clickToEdit: "Clic para editar",
    sections: {
      principal: "Información del Poderdante",
      agent: "Información del Apoderado",
      successor: "Apoderado Sucesor",
      type: "Tipo y Vigencia del POA",
      powers: "Poderes Financieros",
      advanced: "Poderes Avanzados",
      hipaa: "Autorización HIPAA",
      recording: "Registro",
      special: "Instrucciones Especiales"
    }
  }
};

const TIERS = [
  { 
    value: 'draft_only', 
    label_en: 'Self-Prepared Document (Basic Access)', 
    label_es: 'Documento Autopreparado (Acceso Básico)', 
    price: 149, 
    desc_en: 'Software access to prepare your Power of Attorney. PDF in English and Spanish.', 
    desc_es: 'Acceso al software para preparar su Poder Notarial. PDF en Inglés y Español.' 
  },
  { 
    value: 'attorney_review_silent', 
    label_en: 'Professional Review (Advanced Platform)', 
    label_es: 'Revisión Profesional (Plataforma Avanzada)', 
    price: 349, 
    desc_en: 'Platform infrastructure for optional legal review, subject to availability of independent California-licensed attorneys (estimated delivery 48 hours).', 
    desc_es: 'Infraestructura de plataforma para revisión legal opcional, sujeta a disponibilidad de abogados independientes licenciados en California (entrega estimada 48 horas).', 
    popular: true 
  },
  { 
    value: 'attorney_review_call', 
    label_en: 'Professional Consultation (Premium Platform)', 
    label_es: 'Consulta Profesional (Plataforma Premium)', 
    price: 499, 
    desc_en: 'Infrastructure to coordinate an optional legal consultation, subject to availability of independent licensed attorneys (up to 30 min) + optional review (48 hours).', 
    desc_es: 'Infraestructura para coordinación de consulta legal opcional, sujeta a disponibilidad de abogados independientes licenciados (hasta 30 min) + revisión opcional (48 horas).' 
  },
];

const UPSELLS = [{ id: 'notary', price: 150 }, { id: 'recording', price: 250 }, { id: 'amendment', price: 99 }];

const DocumentPreview = ({ intakeData, language, isPaid }) => {
  const t = language === 'es' ? { 
    title: 'PODER NOTARIAL GENERAL', 
    subtitle: 'Estado de California', 
    principal: 'PODERDANTE', 
    agent: 'APODERADO', 
    powers: 'PODERES OTORGADOS', 
    realEstate: 'Bienes Raíces', 
    banking: 'Bancarias', 
    stocks: 'Acciones/Bonos', 
    business: 'Comerciales', 
    insurance: 'Seguros', 
    retirement: 'Jubilación',
    government: 'Beneficios Gob.',
    litigation: 'Litigios', 
    tax: 'Fiscales', 
    gifts: 'Regalos', 
    durable: 'DURABILIDAD', 
    durableYes: 'Este Poder PERMANECERÁ VIGENTE si queda incapacitado.', 
    durableNo: 'Este Poder quedará sin efecto si queda incapacitado.', 
    effective: 'VIGENCIA', 
    effectiveImmediate: 'Entra en vigor INMEDIATAMENTE.', 
    effectiveIncapacity: 'Entra en vigor ante incapacidad.', 
    watermark: 'VISTA PREVIA', 
    payToUnlock: 'Complete el pago para ver completo', 
    hiddenContent: '[PROTEGIDO]', 
    successor: 'SUCESOR',
    hipaa: 'HIPAA',
    aka: 'También conocido como'
  } : { 
    title: 'GENERAL POWER OF ATTORNEY', 
    subtitle: 'State of California', 
    principal: 'PRINCIPAL', 
    agent: 'AGENT', 
    powers: 'POWERS GRANTED', 
    realEstate: 'Real Estate', 
    banking: 'Banking', 
    stocks: 'Stocks/Bonds', 
    business: 'Business', 
    insurance: 'Insurance', 
    retirement: 'Retirement',
    government: 'Gov. Benefits',
    litigation: 'Litigation', 
    tax: 'Tax', 
    gifts: 'Gifts', 
    durable: 'DURABILITY', 
    durableYes: 'SHALL REMAIN IN EFFECT if incapacitated.', 
    durableNo: 'Shall become void if incapacitated.', 
    effective: 'EFFECTIVE DATE', 
    effectiveImmediate: 'Effective IMMEDIATELY.', 
    effectiveIncapacity: 'Effective upon incapacity.', 
    watermark: 'PREVIEW', 
    payToUnlock: 'Complete payment to view', 
    hiddenContent: '[PROTECTED]', 
    successor: 'SUCCESSOR',
    hipaa: 'HIPAA',
    aka: 'Also Known As'
  };
  
  const powers = [
    { key: 'powers_real_estate', label: t.realEstate },
    { key: 'powers_banking', label: t.banking },
    { key: 'powers_stocks', label: t.stocks },
    { key: 'powers_business', label: t.business },
    { key: 'powers_insurance', label: t.insurance },
    { key: 'powers_retirement', label: t.retirement },
    { key: 'powers_government', label: t.government },
    { key: 'powers_litigation', label: t.litigation },
    { key: 'powers_tax', label: t.tax },
    { key: 'hot_gifts', label: t.gifts }
  ];
  
  const hideContent = (content, showFirst = 0) => { 
    if (isPaid) return content; 
    if (!content) return t.hiddenContent; 
    if (showFirst > 0 && content.length > showFirst) return content.substring(0, showFirst) + '···'; 
    return t.hiddenContent; 
  };
  
  return (
    <div style={{ position: 'relative', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '24px', fontFamily: 'Times New Roman, serif', fontSize: '12px', lineHeight: '1.4', maxHeight: '500px', overflowY: 'auto' }}>
      {!isPaid && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', fontSize: '32px', fontWeight: 'bold', color: 'rgba(239, 68, 68, 0.15)', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10 }}>{t.watermark}</div>}
      
      <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #1F2937', paddingBottom: '12px' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{t.title}</div>
        <div style={{ fontSize: '12px', color: '#6B7280' }}>{t.subtitle}</div>
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '4px' }}>{t.principal}</div>
        <div><strong>Name:</strong> {hideContent(intakeData.principal_name, 5)}</div>
        {intakeData.has_aka && intakeData.aka_names && (
          <div style={{ fontSize: '11px', color: '#6B7280' }}><strong>{t.aka}:</strong> {hideContent(intakeData.aka_names, 5)}</div>
        )}
        <div style={{ filter: isPaid ? 'none' : 'blur(3px)' }}><strong>Address:</strong> {hideContent(intakeData.principal_address)}</div>
        {intakeData.principal_county && <div style={{ filter: isPaid ? 'none' : 'blur(3px)' }}><strong>County:</strong> {hideContent(intakeData.principal_county)}</div>}
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '4px' }}>{t.agent}</div>
        <div><strong>Name:</strong> {hideContent(intakeData.agent_name, 5)}</div>
        <div style={{ filter: isPaid ? 'none' : 'blur(3px)' }}><strong>Address:</strong> {hideContent(intakeData.agent_address)}</div>
      </div>
      
      {intakeData.wants_successor && intakeData.successor_agent && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold' }}>{t.successor}</div>
          <div>{hideContent(intakeData.successor_agent, 5)}</div>
        </div>
      )}
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '4px' }}>{t.powers}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          {powers.map((p) => (
            <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '12px', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>{intakeData[p.key] ? 'X' : ''}</span>
              <span style={{ fontSize: '10px' }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {intakeData.include_hipaa && (
        <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#FEF3C7', borderRadius: '4px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '10px' }}>? {t.hipaa} Authorization Included</div>
        </div>
      )}
      
      <div style={{ marginBottom: '12px', filter: isPaid ? 'none' : 'blur(3px)' }}>
        <div style={{ fontWeight: 'bold' }}>{t.durable}</div>
        <p style={{ margin: 0, fontSize: '10px' }}>{intakeData.durable ? t.durableYes : t.durableNo}</p>
      </div>
      
      <div style={{ marginBottom: '12px', filter: isPaid ? 'none' : 'blur(3px)' }}>
        <div style={{ fontWeight: 'bold' }}>{t.effective}</div>
        <p style={{ margin: 0, fontSize: '10px' }}>{intakeData.effective_when === 'immediately' ? t.effectiveImmediate : t.effectiveIncapacity}</p>
      </div>
      
      {!isPaid && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, white)', padding: '30px 16px 16px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontSize: '12px' }}>{t.payToUnlock}</p>
        </div>
      )}
    </div>
  );
};

export default function PoAIntakeWizard() {
  const [language, setLanguage] = useState('es');
  const [currentStep, setCurrentStep] = useState('client');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [intakeData, setIntakeData] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [reviewTier, setReviewTier] = useState('draft_only');
  const [selectedUpsells, setSelectedUpsells] = useState([]);
  const [previewTab, setPreviewTab] = useState('answers');
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const messagesEndRef = useRef(null);
  const t = TRANSLATIONS[language];

  const getVisibleQuestions = () => QUESTIONS.filter(q => { 
    if (!q.showIf) return true; 
    return intakeData[q.showIf.field] === q.showIf.value; 
  });

  const visibleQuestions = getVisibleQuestions();

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (currentStep === 'intake' && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t.greeting }]);
      const visibleQs = getVisibleQuestions();
      const q = visibleQs[0];
      const questionText = language === 'en' ? q.question_en : q.question_es;
      setTimeout(() => { setMessages(prev => [...prev, { role: 'assistant', content: questionText }]); }, 500);
    }
  }, [currentStep]);

  const toggleUpsell = (id) => setSelectedUpsells(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  
  const calculateTotal = () => { 
    const tp = TIERS.find(x => x.value === reviewTier)?.price || 149; 
    return tp + selectedUpsells.reduce((s, id) => s + (UPSELLS.find(u => u.id === id)?.price || 0), 0); 
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);
    
    try {
      const visibleQs = getVisibleQuestions();
      const currentQuestion = visibleQs[currentQuestionIndex];
      let parsedValue = userMessage;
      
      if (currentQuestion.type === 'boolean') {
        const n = userMessage.toLowerCase();
        if (n.includes('yes') || n.includes('si') || n.includes('sí') || n === 'y' || n === 's') parsedValue = true;
        else if (n.includes('no') || n === 'n') parsedValue = false;
        else { setMessages(prev => [...prev, { role: 'assistant', content: t.pleaseAnswer }]); setIsLoading(false); return; }
      } else if (currentQuestion.type === 'select') {
        const n = userMessage.toLowerCase().trim();
        let opt = null;
        
        // Handle effective_when options
        if (currentQuestion.field === 'effective_when') {
          if (n.includes('inmediata') || n.includes('immediate') || n === '1' || n === 'a') {
            opt = currentQuestion.options.find(o => o.value === 'immediately');
          } else if (n.includes('incapaci') || n === '2' || n === 'b') {
            opt = currentQuestion.options.find(o => o.value === 'upon_incapacity');
          }
        } else if (currentQuestion.field === 'gift_limit') {
          if (n.includes('annual') || n.includes('18') || n === '1') {
            opt = currentQuestion.options.find(o => o.value === 'annual_exclusion');
          } else if (n.includes('unlimited') || n.includes('sin') || n === '2') {
            opt = currentQuestion.options.find(o => o.value === 'unlimited');
          } else if (n.includes('custom') || n.includes('personal') || n === '3') {
            opt = currentQuestion.options.find(o => o.value === 'custom');
          }
        } else {
          // Generic option matching by index
          const idx = parseInt(n) - 1;
          if (!isNaN(idx) && idx >= 0 && idx < currentQuestion.options.length) {
            opt = currentQuestion.options[idx];
          }
        }
        
        if (opt) parsedValue = opt.value;
        else { setMessages(prev => [...prev, { role: 'assistant', content: t.pleaseSelect }]); setIsLoading(false); return; }
      }
      
      const newData = { ...intakeData, [currentQuestion.field]: parsedValue };
      setIntakeData(newData);
      
      const dv = parsedValue === true ? t.yes : parsedValue === false ? t.no : parsedValue;
      setMessages(prev => [...prev, { role: 'assistant', content: `${t.saved} ${dv}` }]);
      
      // Recalculate visible questions with new data
      const newVisibleQs = QUESTIONS.filter(q => { 
        if (!q.showIf) return true; 
        return newData[q.showIf.field] === q.showIf.value; 
      });
      
            const currentFieldIndex = newVisibleQs.findIndex(q => q.field === currentQuestion.field);
const nextIdx = currentFieldIndex + 1;
setCurrentQuestionIndex(nextIdx);
      
      setTimeout(() => {
        if (nextIdx < newVisibleQs.length) {
          const nq = newVisibleQs[nextIdx];
          const qt = language === 'en' ? nq.question_en : nq.question_es;
          let fq = qt;
          
          // Add section header if new section
          const currentSection = visibleQs[currentQuestionIndex]?.section;
          const nextSection = nq.section;
          if (currentSection !== nextSection && t.sections[nextSection]) {
            fq = `?? ${t.sections[nextSection]}\n\n${qt}`;
          }
          
          if (nq.type === 'select' && nq.options) {
            fq = fq + '\n\n' + t.options + '\n' + nq.options.map((o, i) => `${i + 1}. ${language === 'en' ? o.label_en : o.label_es}`).join('\n');
          } else if (nq.type === 'boolean') {
            fq = `${fq}\n\n${t.options}\n• ${t.yes}\n• ${t.no}`;
          }
          
          setMessages(prev => [...prev, { role: 'assistant', content: fq }]);
        } else { 
          setMessages(prev => [...prev, { role: 'assistant', content: `? ${t.allQuestionsAnswered}` }]); 
          setCurrentStep('tier'); 
        }
        setIsLoading(false);
      }, 500);
    } catch (e) { 
      setMessages(prev => [...prev, { role: 'assistant', content: t.errorTryAgain }]); 
      setIsLoading(false); 
    }
  };



  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue === true ? 'true' : currentValue === false ? 'false' : currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = (field) => {
    const question = QUESTIONS.find(q => q.field === field);
    if (!question) return;
    
    let newValue = editValue;
    
    if (question.type === 'boolean') {
      newValue = editValue === 'true';
    }
    
    const newData = { ...intakeData, [field]: newValue };
    
    if (question.type === 'boolean' && newValue === false) {
      QUESTIONS.forEach(q => {
        if (q.showIf && q.showIf.field === field) {
          delete newData[q.field];
        }
      });
    }
    
    setIntakeData(newData);
    setEditingField(null);
    setEditValue('');
  };

  const handleSubmit = async () => {
    if (!clientName || !clientEmail) { alert(t.provideNameEmail); return; }
    setIsLoading(true);
    try {
      const res = await fetch('/api/poa/matters', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          client_name: clientName, 
          client_email: clientEmail, 
          client_phone: clientPhone, 
          review_tier: reviewTier, 
          intake_data: intakeData, 
          language, 
          selected_addons: selectedUpsells 
        }) 
      });
      const result = await res.json();
      if (result.success && result.matter?.id) {
  const stripeRes = await fetch('/api/stripe/checkout', { 
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' }, 
  body: JSON.stringify({ 
    tier: reviewTier,
    addons: selectedUpsells,
    clientName: clientName,
    clientEmail: clientEmail,
    intakeData: intakeData,
    language: language,
    matterId: result.matter.id
  }) 
});
        const stripeData = await stripeRes.json();
        if (stripeData.url) window.location.href = stripeData.url;
        else alert(t.failedSubmit);
      } else { alert(result.error || t.failedSubmit); }
    } catch (e) { alert(t.failedSubmit); }
    setIsLoading(false);
  };

  const getLivePreview = () => {
    const entries = Object.entries(intakeData);
    if (entries.length === 0) return <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>{t.answersWillAppear}</p>;
    
    const sections = {};
    entries.forEach(([key, value]) => {
      const q = QUESTIONS.find(x => x.field === key);
      const section = q?.section || 'other';
      if (!sections[section]) sections[section] = [];
      sections[section].push({ key, value, question: q });
    });
    
    return (
      <div style={{ padding: '12px' }}>
        {Object.entries(sections).map(([section, items]) => (
          <div key={section} style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#2563EB', marginBottom: '8px', textTransform: 'uppercase' }}>
              {t.sections[section] || section}
            </div>
            {items.map(({ key, value, question }) => {
              const isEditing = editingField === key;
              const displayValue = value === true ? t.yes : value === false ? t.no : value;
              const label = question ? (language === 'en' ? question.question_en : question.question_es) : key;
              
              return (
                <div 
                  key={key} 
                  style={{ 
                    padding: '10px 12px', 
                    borderBottom: '1px solid #F3F4F6', 
                    fontSize: '13px',
                    backgroundColor: isEditing ? '#EFF6FF' : 'transparent',
                    borderRadius: isEditing ? '8px' : '0',
                    marginBottom: isEditing ? '8px' : '0'
                  }}
                >
                  <div style={{ color: '#6B7280', marginBottom: '4px', fontSize: '12px' }}>
                    {label.length > 60 ? label.substring(0, 60) + '...' : label}
                  </div>
                  
                  {isEditing ? (
                    <div style={{ marginTop: '8px' }}>
                      {question?.type === 'boolean' ? (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <button
                            onClick={() => setEditValue('true')}
                            style={{
                              padding: '8px 16px',
                              border: '2px solid',
                              borderColor: editValue === 'true' ? '#2563EB' : '#D1D5DB',
                              borderRadius: '6px',
                              backgroundColor: editValue === 'true' ? '#EFF6FF' : 'white',
                              color: editValue === 'true' ? '#2563EB' : '#374151',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            {t.yes}
                          </button>
                          <button
                            onClick={() => setEditValue('false')}
                            style={{
                              padding: '8px 16px',
                              border: '2px solid',
                              borderColor: editValue === 'false' ? '#2563EB' : '#D1D5DB',
                              borderRadius: '6px',
                              backgroundColor: editValue === 'false' ? '#EFF6FF' : 'white',
                              color: editValue === 'false' ? '#2563EB' : '#374151',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            {t.no}
                          </button>
                        </div>
                      ) : question?.type === 'select' ? (
                        <select
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            marginBottom: '8px'
                          }}
                        >
                          {question.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {language === 'en' ? opt.label_en : opt.label_es}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            marginBottom: '8px'
                          }}
                        />
                      )}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => saveEdit(key)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#059669',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {t.save}
                        </button>
                        <button
                          onClick={cancelEditing}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#F3F4F6',
                            color: '#374151',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {t.cancel}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => startEditing(key, value)}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '4px 0'
                      }}
                      title={t.clickToEdit}
                    >
                      <span style={{ fontWeight: '600', color: '#1F2937' }}>
                        {String(displayValue).length > 35 ? String(displayValue).substring(0, 35) + '...' : displayValue}
                      </span>
                      <span style={{ 
                        fontSize: '11px', 
                        color: '#9CA3AF',
                        padding: '2px 6px',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '4px'
                      }}>
                        {t.edit}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const st = {
    container: { minHeight: '100vh', backgroundColor: '#F0F9FF', padding: '24px' },
    inner: { maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    logo: { display: 'flex', alignItems: 'center', gap: '12px' },
    logoIcon: { width: '48px', height: '48px', backgroundColor: '#2563EB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#1F2937' },
    subtitle: { fontSize: '14px', color: '#6B7280' },
    langToggle: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', cursor: 'pointer' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    input: { width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none' },
    btnPrimary: { width: '100%', padding: '14px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
    btnGreen: { backgroundColor: '#059669', color: 'white' },
    btnDisabled: { backgroundColor: '#9CA3AF', cursor: 'not-allowed' },
    chatContainer: { height: '400px', overflowY: 'auto', marginBottom: '16px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' },
    msgUser: { backgroundColor: '#2563EB', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', maxWidth: '80%', marginLeft: 'auto', marginBottom: '12px' },
    msgAssistant: { backgroundColor: 'white', color: '#1F2937', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', maxWidth: '80%', marginBottom: '12px', border: '1px solid #E5E7EB', whiteSpace: 'pre-wrap' },
    badge: { backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
    tierCard: { width: '100%', padding: '16px', border: '2px solid #E5E7EB', borderRadius: '12px', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left', marginBottom: '12px', position: 'relative', transition: 'all 0.2s' },
    tierCardSelected: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
    popularBadge: { position: 'absolute', top: '-10px', right: '16px', backgroundColor: '#F59E0B', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
    upsellCard: { padding: '16px', border: '2px solid #E5E7EB', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', transition: 'all 0.2s' },
    upsellCardSelected: { borderColor: '#059669', backgroundColor: '#ECFDF5' },
    upsellHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    upsellBadge: { backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
    progressBar: { height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' },
    progressFill: { height: '100%', backgroundColor: '#2563EB', borderRadius: '4px', transition: 'width 0.3s ease' },
  };

  const progress = visibleQuestions.length > 0 ? Math.round((Object.keys(intakeData).length / visibleQuestions.length) * 100) : 0;

  return (
    <div style={st.container}>
      <div style={st.inner}>
        <div style={st.header}>
          <div style={st.logo}>
            <div style={st.logoIcon}>MS</div>
            <div>
              <div style={st.title}>{t.title}</div>
              <div style={st.subtitle}>{t.subtitle}</div>
            </div>
          </div>
          <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} style={st.langToggle}>
            <GlobeIcon />
            <span style={{ fontWeight: '600' }}>{language === 'en' ? 'Español' : 'English'}</span>
          </button>
        </div>

        {currentStep === 'client' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={st.card}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>{t.clientInfo}</h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>{t.clientName} *</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} style={st.input} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>{t.clientEmail} *</label>
                <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={st.input} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>{t.clientPhone}</label>
                <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} style={st.input} />
              </div>
              <button onClick={() => { if (clientName && clientEmail) setCurrentStep('intake'); else alert(t.provideNameEmail); }} style={{ ...st.btnPrimary, ...st.btnGreen }}>{t.continue}</button>
            </div>
          </div>
        )}

        {currentStep === 'intake' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={st.card}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{t.progress}</span>
                  <span style={st.badge}>{progress}%</span>
                </div>
                <div style={st.progressBar}>
                  <div style={{ ...st.progressFill, width: `${progress}%` }}></div>
                </div>
              </div>
              <div style={st.chatContainer}>
                {messages.map((msg, i) => (
                  <div key={i} style={msg.role === 'user' ? st.msgUser : st.msgAssistant}>{msg.content}</div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyPress={e => e.key === 'Enter' && handleSend()} 
                  placeholder={t.typeAnswer} 
                  style={{ ...st.input, flex: 1 }} 
                  disabled={isLoading} 
                />
                <button 
                  onClick={handleSend} 
                  disabled={isLoading || !input.trim()} 
                  style={{ padding: '12px 20px', backgroundColor: isLoading || !input.trim() ? '#9CA3AF' : '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer' }}
                >
                  <SendIcon />
                </button>
              </div>
              {language === 'es' && <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '12px', textAlign: 'center' }}>{t.legalNote}</p>}
            </div>
            <div style={st.card}>
              <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '16px' }}>
                <button onClick={() => setPreviewTab('answers')} style={{ padding: '12px 20px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '600', color: previewTab === 'answers' ? '#2563EB' : '#6B7280', borderBottom: previewTab === 'answers' ? '2px solid #2563EB' : '2px solid transparent', marginBottom: '-2px' }}>
                  {t.yourAnswers}
                  <span style={{ ...st.badge, marginLeft: '8px' }}>{Object.keys(intakeData).length}/{visibleQuestions.length}</span>
                </button>
                <button onClick={() => setPreviewTab('document')} style={{ padding: '12px 20px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '600', color: previewTab === 'document' ? '#2563EB' : '#6B7280', borderBottom: previewTab === 'document' ? '2px solid #2563EB' : '2px solid transparent', marginBottom: '-2px' }}>
                  {language === 'en' ? 'Document' : 'Documento'}
                </button>
              </div>
              {previewTab === 'answers' ? <div style={{ maxHeight: '440px', overflowY: 'auto' }}>{getLivePreview()}</div> : <DocumentPreview intakeData={intakeData} language={language} isPaid={isPaid} />}
              {Object.keys(intakeData).length === visibleQuestions.length && (
                <div style={{ marginTop: '16px' }}>
                  <button onClick={() => setCurrentStep('tier')} style={{ ...st.btnPrimary, ...st.btnGreen }}>{t.continue}</button>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 'tier' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={st.card}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>{t.tierSelect}</h2>
              {TIERS.map((tier) => (
                <button 
                  key={tier.value} 
                  onClick={() => setReviewTier(tier.value)} 
                  style={{ ...st.tierCard, ...(reviewTier === tier.value ? st.tierCardSelected : {}) }}
                >
                  {tier.popular && <div style={st.popularBadge}>{language === 'en' ? 'Popular' : 'Popular'}</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, paddingRight: '16px' }}>
                      <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                        {language === 'en' ? tier.label_en : tier.label_es}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.4' }}>
                        {language === 'en' ? tier.desc_en : tier.desc_es}
                      </div>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563EB', marginLeft: '12px' }}>${tier.price}</div>
                  </div>
                </button>
              ))}
              {/* COMPLIANCE CLARIFICATION */}
              <div style={{ 
                marginTop: '16px', 
                marginBottom: '24px',
                padding: '12px 16px', 
                backgroundColor: '#FEF3C7', 
                borderRadius: '8px', 
                border: '1px solid #F59E0B'
              }}>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#92400E', 
                  margin: 0, 
                  lineHeight: '1.5' 
                }}>
                  {t.tierClarification}
                </p>
              </div>
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{t.addOns}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>{t.addOnsSubtitle}</p>
                <div onClick={() => toggleUpsell('notary')} style={{ ...st.upsellCard, ...(selectedUpsells.includes('notary') ? st.upsellCardSelected : {}) }}>
                  <div style={st.upsellHeader}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{t.upsellNotary}</div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>{t.upsellNotaryDesc}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#059669' }}>{t.upsellNotaryPrice}</div>
                      <div style={st.upsellBadge}>{t.upsellNotarySave}</div>
                    </div>
                  </div>
                </div>
                <div onClick={() => toggleUpsell('recording')} style={{ ...st.upsellCard, ...(selectedUpsells.includes('recording') ? st.upsellCardSelected : {}) }}>
                  <div style={st.upsellHeader}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{t.upsellRecording}</div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>{t.upsellRecordingDesc}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#059669' }}>{t.upsellRecordingPrice}</div>
                      <div style={st.upsellBadge}>{t.upsellRecordingSave}</div>
                    </div>
                  </div>
                </div>
                <div onClick={() => toggleUpsell('amendment')} style={{ ...st.upsellCard, ...(selectedUpsells.includes('amendment') ? st.upsellCardSelected : {}) }}>
                  <div style={st.upsellHeader}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{t.upsellAmendment}</div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>{t.upsellAmendmentDesc}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#059669' }}>{t.upsellAmendmentPrice}</div>
                      <div style={st.upsellBadge}>{t.upsellAmendmentSave}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div style={{ ...st.card, marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>{t.orderSummary}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>{t.basePrice}</span>
                  <span>${TIERS.find(x => x.value === reviewTier)?.price}</span>
                </div>
                {selectedUpsells.length > 0 && (
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '8px', marginTop: '8px' }}>
                    <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>{t.selectedAddOns}:</div>
                    {selectedUpsells.map(id => { 
                      const u = UPSELLS.find(x => x.id === id); 
                      const lbl = id === 'notary' ? t.upsellNotary : id === 'recording' ? t.upsellRecording : t.upsellAmendment; 
                      return (
                        <div key={id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                          <span>{lbl}</span>
                          <span>+${u?.price}</span>
                        </div>
                      ); 
                    })}
                  </div>
                )}
                <div style={{ borderTop: '2px solid #1F2937', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px' }}>
                  <span>{t.total}</span>
                  <span style={{ color: '#2563EB' }}>${calculateTotal()}</span>
                </div>
                <div>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isLoading} 
                    style={{ ...st.btnPrimary, marginTop: '16px', ...(isLoading ? st.btnDisabled : st.btnGreen) }}
                  >
                    {isLoading ? t.paying : `${t.submit} - $${calculateTotal()}`}
                  </button>
                  <p style={{ 
                    fontSize: '11px', 
                    color: '#6B7280', 
                    textAlign: 'center', 
                    marginTop: '8px' 
                  }}>
                    {t.paymentNote}
                  </p>
                </div>
              </div>
              <div style={st.card}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>{language === 'en' ? 'Preview' : 'Vista Previa'}</h3>
                <DocumentPreview intakeData={intakeData} language={language} isPaid={isPaid} />
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', padding: '16px', color: '#6B7280', fontSize: '12px' }}>
          <p style={{ margin: 0 }}>Multi Servicios 360 | www.multiservicios360.net | 855.246.7274</p>
        </div>
      </div>
    </div>
  );
}
