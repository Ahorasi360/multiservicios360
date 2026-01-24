"use client";
import React, { useState, useEffect, useRef } from 'react';

const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>);
const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>);

// Questions organized by category
const QUESTIONS = [
  // Principal & Agent Info
  { field: 'principal_name', question_en: "What is the full legal name of the Principal (person granting power)?", question_es: "¿Cuál es el nombre legal completo del Poderdante (persona que otorga el poder)?", type: 'text', section: 'principal' },
  { field: 'principal_address', question_en: "What is the Principal's complete address?", question_es: "¿Cuál es la dirección completa del Poderdante?", type: 'text', section: 'principal' },
  { field: 'agent_name', question_en: "Who will be the Agent (person receiving the limited power)?", question_es: "¿Quién será el Apoderado (persona que recibe el poder limitado)?", type: 'text', section: 'agent' },
  { field: 'agent_address', question_en: "What is the Agent's complete address?", question_es: "¿Cuál es la dirección completa del Apoderado?", type: 'text', section: 'agent' },
  
  // POA Settings
  { field: 'is_durable', question_en: "Should this Limited POA be DURABLE (survive your incapacity)?", question_es: "¿Debe este Poder Limitado ser DURADERO (sobrevivir su incapacidad)?", type: 'boolean', section: 'settings', warning_en: "Warning: A durable POA remains valid even if you become incapacitated.", warning_es: "Advertencia: Un poder duradero permanece válido incluso si usted queda incapacitado." },
  { field: 'effective_date_type', question_en: "When should this Limited POA become effective?", question_es: "¿Cuándo debe entrar en vigor este Poder Limitado?", type: 'select', section: 'settings', options: [
    { value: 'upon_signing', label_en: 'Upon signing', label_es: 'Al firmar' },
    { value: 'specific_date', label_en: 'On a specific date', label_es: 'En una fecha específica' }
  ]},
  { field: 'effective_date', question_en: "What is the specific effective date? (MM/DD/YYYY)", question_es: "¿Cuál es la fecha específica de vigencia? (MM/DD/AAAA)", type: 'text', section: 'settings', showIf: { field: 'effective_date_type', value: 'specific_date' } },
  { field: 'termination_type', question_en: "When should this Limited POA terminate?", question_es: "¿Cuándo debe terminar este Poder Limitado?", type: 'select', section: 'settings', options: [
    { value: 'upon_completion', label_en: 'Upon completion of the transaction', label_es: 'Al completar la transacción' },
    { value: 'specific_date', label_en: 'On a specific date', label_es: 'En una fecha específica' },
    { value: 'written_revocation', label_en: 'Upon written revocation', label_es: 'Mediante revocación escrita' }
  ]},
  { field: 'termination_date', question_en: "What is the termination date? (MM/DD/YYYY)", question_es: "¿Cuál es la fecha de terminación? (MM/DD/AAAA)", type: 'text', section: 'settings', showIf: { field: 'termination_type', value: 'specific_date' } },

  // Purpose Category
  { field: 'purpose_category', question_en: "What is the PRIMARY purpose of this Limited POA?", question_es: "¿Cuál es el propósito PRINCIPAL de este Poder Limitado?", type: 'select', section: 'purpose', options: [
    { value: 'real_estate', label_en: 'Real Estate Transaction', label_es: 'Transacción de Bienes Raíces' },
    { value: 'banking', label_en: 'Banking / Financial', label_es: 'Bancario / Financiero' },
    { value: 'tax', label_en: 'Tax Matters', label_es: 'Asuntos Fiscales' },
    { value: 'business', label_en: 'Business / Entity', label_es: 'Negocios / Entidad' },
    { value: 'vehicle', label_en: 'Vehicle / DMV', label_es: 'Vehículo / DMV' },
    { value: 'insurance', label_en: 'Insurance / Claims', label_es: 'Seguros / Reclamos' }
  ]},

  // REAL ESTATE QUESTIONS
  { field: 're_transaction_type', question_en: "What type of real estate transaction?", question_es: "¿Qué tipo de transacción de bienes raíces?", type: 'select', section: 'real_estate', showIf: { field: 'purpose_category', value: 'real_estate' }, options: [
    { value: 'sell', label_en: 'Sell property', label_es: 'Vender propiedad' },
    { value: 'buy', label_en: 'Buy property', label_es: 'Comprar propiedad' },
    { value: 'refinance', label_en: 'Refinance property', label_es: 'Refinanciar propiedad' },
    { value: 'transfer_to_trust', label_en: 'Transfer to trust', label_es: 'Transferir a fideicomiso' },
    { value: 'lease', label_en: 'Lease property', label_es: 'Arrendar propiedad' }
  ]},
  { field: 're_property_address', question_en: "What is the property address?", question_es: "¿Cuál es la dirección de la propiedad?", type: 'text', section: 'real_estate', showIf: { field: 'purpose_category', value: 'real_estate' } },
  { field: 're_property_county', question_en: "What county is the property in?", question_es: "¿En qué condado está la propiedad?", type: 'text', section: 'real_estate', showIf: { field: 'purpose_category', value: 'real_estate' } },
  { field: 're_property_apn', question_en: "What is the APN (Assessor's Parcel Number)?", question_es: "¿Cuál es el APN (Número de Parcela del Tasador)?", type: 'text', section: 'real_estate', showIf: { field: 'purpose_category', value: 'real_estate' } },
  { field: 're_sign_deed', question_en: "Authorize Agent to sign deeds (grant deed, quitclaim, trust transfer)?", question_es: "¿Autorizar al Apoderado a firmar escrituras?", type: 'boolean', section: 'real_estate', showIf: { field: 'purpose_category', value: 'real_estate' } },
  { field: 're_sign_escrow', question_en: "Authorize Agent to sign escrow instructions and closing documents?", question_es: "¿Autorizar al Apoderado a firmar instrucciones de escrow y documentos de cierre?", type: 'boolean', section: 'real_estate', showIf: { field: 'purpose_category', value: 'real_estate' } },
  { field: 're_sign_tax_forms', question_en: "Authorize Agent to sign California FTB Form 593 and PCOR?", question_es: "¿Autorizar al Apoderado a firmar el Formulario 593 del FTB de California y PCOR?", type: 'boolean', section: 'real_estate', showIf: { field: 'purpose_category', value: 'real_estate' } },
  { field: 're_receive_proceeds', question_en: "Authorize Agent to receive and disburse sale proceeds?", question_es: "¿Autorizar al Apoderado a recibir y desembolsar los fondos de la venta?", type: 'boolean', section: 'real_estate', showIf: { field: 'purpose_category', value: 'real_estate' } },
  { field: 're_coordinate_recording', question_en: "Authorize Agent to coordinate recording with County Recorder?", question_es: "¿Autorizar al Apoderado a coordinar el registro con el Registrador del Condado?", type: 'boolean', section: 'real_estate', showIf: { field: 'purpose_category', value: 'real_estate' } },

  // BANKING QUESTIONS
  { field: 'bank_name', question_en: "What is the name of the bank?", question_es: "¿Cuál es el nombre del banco?", type: 'text', section: 'banking', showIf: { field: 'purpose_category', value: 'banking' } },
  { field: 'bank_account_last4', question_en: "What are the last 4 digits of the account number?", question_es: "¿Cuáles son los últimos 4 dígitos del número de cuenta?", type: 'text', section: 'banking', showIf: { field: 'purpose_category', value: 'banking' } },
  { field: 'bank_deposit', question_en: "Authorize Agent to deposit funds?", question_es: "¿Autorizar al Apoderado a depositar fondos?", type: 'boolean', section: 'banking', showIf: { field: 'purpose_category', value: 'banking' } },
  { field: 'bank_withdraw', question_en: "Authorize Agent to withdraw funds?", question_es: "¿Autorizar al Apoderado a retirar fondos?", type: 'boolean', section: 'banking', showIf: { field: 'purpose_category', value: 'banking' } },
  { field: 'bank_withdraw_limit', question_en: "What is the maximum withdrawal amount in dollars?", question_es: "¿Cuál es el monto máximo de retiro en dólares?", type: 'text', section: 'banking', showIf: { field: 'bank_withdraw', value: true } },
  { field: 'bank_endorse_checks', question_en: "Authorize Agent to endorse checks?", question_es: "¿Autorizar al Apoderado a endosar cheques?", type: 'boolean', section: 'banking', showIf: { field: 'purpose_category', value: 'banking' } },
  { field: 'bank_wire', question_en: "Authorize Agent to wire funds for this transaction?", question_es: "¿Autorizar al Apoderado a transferir fondos para esta transacción?", type: 'boolean', section: 'banking', showIf: { field: 'purpose_category', value: 'banking' } },
  { field: 'bank_safe_deposit', question_en: "Authorize Agent to access safe deposit box?", question_es: "¿Autorizar al Apoderado a acceder a la caja de seguridad?", type: 'boolean', section: 'banking', showIf: { field: 'purpose_category', value: 'banking' } },

  // TAX QUESTIONS
  { field: 'tax_irs', question_en: "Authorize Agent to communicate with the IRS?", question_es: "¿Autorizar al Apoderado a comunicarse con el IRS?", type: 'boolean', section: 'tax', showIf: { field: 'purpose_category', value: 'tax' } },
  { field: 'tax_ftb', question_en: "Authorize Agent to communicate with California FTB?", question_es: "¿Autorizar al Apoderado a comunicarse con el FTB de California?", type: 'boolean', section: 'tax', showIf: { field: 'purpose_category', value: 'tax' } },
  { field: 'tax_sign_returns', question_en: "Authorize Agent to sign tax returns?", question_es: "¿Autorizar al Apoderado a firmar declaraciones de impuestos?", type: 'boolean', section: 'tax', showIf: { field: 'purpose_category', value: 'tax' } },
  { field: 'tax_years', question_en: "For which tax years? (e.g., 2023, 2024)", question_es: "¿Para qué años fiscales? (ej., 2023, 2024)", type: 'text', section: 'tax', showIf: { field: 'tax_sign_returns', value: true } },
  { field: 'tax_form_2848', question_en: "Authorize Agent to execute IRS Form 2848?", question_es: "¿Autorizar al Apoderado a ejecutar el Formulario 2848 del IRS?", type: 'boolean', section: 'tax', showIf: { field: 'purpose_category', value: 'tax' } },
  { field: 'tax_receive_refunds', question_en: "Authorize Agent to receive tax refunds?", question_es: "¿Autorizar al Apoderado a recibir reembolsos de impuestos?", type: 'boolean', section: 'tax', showIf: { field: 'purpose_category', value: 'tax' } },

  // BUSINESS QUESTIONS
  { field: 'biz_entity_type', question_en: "What type of business entity?", question_es: "¿Qué tipo de entidad comercial?", type: 'select', section: 'business', showIf: { field: 'purpose_category', value: 'business' }, options: [
    { value: 'llc', label_en: 'LLC', label_es: 'LLC' },
    { value: 'corporation', label_en: 'Corporation', label_es: 'Corporación' },
    { value: 'partnership', label_en: 'Partnership', label_es: 'Sociedad' }
  ]},
  { field: 'biz_entity_name', question_en: "What is the business/entity name?", question_es: "¿Cuál es el nombre de la empresa/entidad?", type: 'text', section: 'business', showIf: { field: 'purpose_category', value: 'business' } },
  { field: 'biz_form_entity', question_en: "Authorize Agent to form the entity with Secretary of State?", question_es: "¿Autorizar al Apoderado a formar la entidad con el Secretario de Estado?", type: 'boolean', section: 'business', showIf: { field: 'purpose_category', value: 'business' } },
  { field: 'biz_obtain_ein', question_en: "Authorize Agent to obtain an EIN?", question_es: "¿Autorizar al Apoderado a obtener un EIN?", type: 'boolean', section: 'business', showIf: { field: 'purpose_category', value: 'business' } },
  { field: 'biz_sign_docs', question_en: "Authorize Agent to sign Operating Agreement or Bylaws?", question_es: "¿Autorizar al Apoderado a firmar el Acuerdo Operativo o Estatutos?", type: 'boolean', section: 'business', showIf: { field: 'purpose_category', value: 'business' } },
  { field: 'biz_open_account', question_en: "Authorize Agent to open a business bank account?", question_es: "¿Autorizar al Apoderado a abrir una cuenta bancaria comercial?", type: 'boolean', section: 'business', showIf: { field: 'purpose_category', value: 'business' } },

  // VEHICLE QUESTIONS
  { field: 'vehicle_action', question_en: "What vehicle action is needed?", question_es: "¿Qué acción de vehículo se necesita?", type: 'select', section: 'vehicle', showIf: { field: 'purpose_category', value: 'vehicle' }, options: [
    { value: 'transfer_title', label_en: 'Transfer title', label_es: 'Transferir título' },
    { value: 'register', label_en: 'Register vehicle', label_es: 'Registrar vehículo' },
    { value: 'duplicate_title', label_en: 'Obtain duplicate title', label_es: 'Obtener título duplicado' },
    { value: 'sell', label_en: 'Sell vehicle', label_es: 'Vender vehículo' }
  ]},
  { field: 'vehicle_year', question_en: "What is the vehicle year?", question_es: "¿Cuál es el año del vehículo?", type: 'text', section: 'vehicle', showIf: { field: 'purpose_category', value: 'vehicle' } },
  { field: 'vehicle_make', question_en: "What is the vehicle make?", question_es: "¿Cuál es la marca del vehículo?", type: 'text', section: 'vehicle', showIf: { field: 'purpose_category', value: 'vehicle' } },
  { field: 'vehicle_model', question_en: "What is the vehicle model?", question_es: "¿Cuál es el modelo del vehículo?", type: 'text', section: 'vehicle', showIf: { field: 'purpose_category', value: 'vehicle' } },
  { field: 'vehicle_vin', question_en: "What is the VIN (Vehicle Identification Number)?", question_es: "¿Cuál es el VIN (Número de Identificación del Vehículo)?", type: 'text', section: 'vehicle', showIf: { field: 'purpose_category', value: 'vehicle' } },

  // INSURANCE QUESTIONS
  { field: 'insurance_claim_desc', question_en: "Briefly describe the insurance claim or matter:", question_es: "Describa brevemente el reclamo o asunto de seguro:", type: 'text', section: 'insurance', showIf: { field: 'purpose_category', value: 'insurance' } },
  { field: 'insurance_submit_claim', question_en: "Authorize Agent to submit insurance claims?", question_es: "¿Autorizar al Apoderado a presentar reclamos de seguro?", type: 'boolean', section: 'insurance', showIf: { field: 'purpose_category', value: 'insurance' } },
  { field: 'insurance_endorse_checks', question_en: "Authorize Agent to endorse settlement checks?", question_es: "¿Autorizar al Apoderado a endosar cheques de liquidación?", type: 'boolean', section: 'insurance', showIf: { field: 'purpose_category', value: 'insurance' } },
  { field: 'insurance_execute_releases', question_en: "Authorize Agent to execute releases?", question_es: "¿Autorizar al Apoderado a ejecutar liberaciones?", type: 'boolean', section: 'insurance', showIf: { field: 'purpose_category', value: 'insurance' } },

  // Third Party Reliance
  { field: 'third_party_reliance', question_en: "Include third-party reliance clause (recommended)?", question_es: "¿Incluir cláusula de confianza de terceros (recomendado)?", type: 'boolean', section: 'final' },
  { field: 'agent_indemnification', question_en: "Include Agent indemnification clause?", question_es: "¿Incluir cláusula de indemnización del Apoderado?", type: 'boolean', section: 'final' },
  { field: 'agent_compensated', question_en: "Will the Agent be compensated?", question_es: "¿El Apoderado será compensado?", type: 'boolean', section: 'final' },

  // Recording
  { field: 'authorized_for_recording', question_en: "Will this POA need to be recorded with the County Recorder?", question_es: "¿Este poder necesitará ser registrado con el Registrador del Condado?", type: 'boolean', section: 'final' },
];

const TRANSLATIONS = {
  en: { 
    title: "California Limited Power of Attorney", 
    subtitle: "Multi Servicios 360", 
    greeting: "Hello! I'll help you create a Limited Power of Attorney for a specific purpose. Let's get started.", 
    send: "Send", 
    progress: "Progress", 
    tierSelect: "Select Review Tier", 
    submit: "Submit", 
    clientInfo: "Client Information", 
    clientName: "Your Full Name", 
    clientEmail: "Your Email", 
    clientPhone: "Your Phone (optional)", 
    continue: "Continue to Questions", 
    yes: "Yes", 
    no: "No", 
    options: "Options:", 
    saved: "✓ Saved:", 
    pleaseAnswer: "Please answer Yes or No.", 
    pleaseSelect: "Please select an option.", 
    paying: "Processing...", 
    legalNote: "Note: The official document will be in English as required by California law. You will receive a Spanish translation for reference.", 
    yourAnswers: "Document Preview", 
    answersWillAppear: "Your document will appear here as you answer questions", 
    allQuestionsAnswered: "All questions answered! Select a review tier.", 
    errorTryAgain: "Error. Please try again.", 
    provideNameEmail: "Please provide your name and email", 
    typeAnswer: "Type your answer...", 
    limitedPurpose: "LIMITED PURPOSE POA",
    docTitle: "LIMITED POWER OF ATTORNEY",
    principal: "PRINCIPAL",
    agent: "AGENT",
    purpose: "PURPOSE",
    powers: "POWERS GRANTED",
    effective: "EFFECTIVE DATE",
    termination: "TERMINATION",
    durable: "DURABLE",
    notDurable: "NOT DURABLE",
    locked: "Complete all questions to see full document",
    watermark: "DRAFT - NOT VALID UNTIL PAYMENT",
    sections: {
      principal: "📋 Principal Information",
      agent: "👤 Agent Information",
      settings: "⚙️ POA Settings",
      purpose: "🎯 Purpose",
      real_estate: "🏠 Real Estate Details",
      banking: "🏦 Banking Details",
      tax: "📊 Tax Details",
      business: "💼 Business Details",
      vehicle: "🚗 Vehicle Details",
      insurance: "🛡️ Insurance Details",
      final: "✅ Final Options"
    }
  },
  es: { 
    title: "Poder Notarial Limitado de California", 
    subtitle: "Multi Servicios 360", 
    greeting: "¡Hola! Le ayudaré a crear un Poder Notarial Limitado para un propósito específico. Comencemos.", 
    send: "Enviar", 
    progress: "Progreso", 
    tierSelect: "Seleccionar Nivel", 
    submit: "Enviar", 
    clientInfo: "Información del Cliente", 
    clientName: "Su Nombre Completo", 
    clientEmail: "Su Correo Electrónico", 
    clientPhone: "Su Teléfono (opcional)", 
    continue: "Continuar a las Preguntas", 
    yes: "Sí", 
    no: "No", 
    options: "Opciones:", 
    saved: "✓ Guardado:", 
    pleaseAnswer: "Por favor responda Sí o No.", 
    pleaseSelect: "Por favor seleccione una opción.", 
    paying: "Procesando...", 
    legalNote: "Nota: El documento oficial estará en inglés según lo requiere la ley de California. Recibirá una traducción al español para su referencia.", 
    yourAnswers: "Vista Previa del Documento", 
    answersWillAppear: "Su documento aparecerá aquí mientras contesta las preguntas", 
    allQuestionsAnswered: "¡Todas las preguntas respondidas! Seleccione un nivel.", 
    errorTryAgain: "Error. Intente de nuevo.", 
    provideNameEmail: "Por favor proporcione su nombre y correo", 
    typeAnswer: "Escriba su respuesta...", 
    limitedPurpose: "PODER LIMITADO",
    docTitle: "PODER NOTARIAL LIMITADO",
    principal: "PODERDANTE",
    agent: "APODERADO",
    purpose: "PROPÓSITO",
    powers: "PODERES OTORGADOS",
    effective: "FECHA DE VIGENCIA",
    termination: "TERMINACIÓN",
    durable: "DURADERO",
    notDurable: "NO DURADERO",
    locked: "Complete todas las preguntas para ver el documento completo",
    watermark: "BORRADOR - NO VÁLIDO HASTA EL PAGO",
    sections: {
      principal: "📋 Información del Poderdante",
      agent: "👤 Información del Apoderado",
      settings: "⚙️ Configuración del Poder",
      purpose: "🎯 Propósito",
      real_estate: "🏠 Detalles de Bienes Raíces",
      banking: "🏦 Detalles Bancarios",
      tax: "📊 Detalles Fiscales",
      business: "💼 Detalles de Negocio",
      vehicle: "🚗 Detalles del Vehículo",
      insurance: "🛡️ Detalles de Seguro",
      final: "✅ Opciones Finales"
    }
  }
};

const TIERS = [
  { value: 'draft_only', label_en: 'Draft Only', label_es: 'Solo Borrador', price: 99, desc_en: 'Limited POA document, English + Spanish PDF', desc_es: 'Documento de Poder Limitado, PDF en Inglés + Español' },
  { value: 'attorney_review', label_en: 'Attorney Review', label_es: 'Revisión de Abogado', price: 199, desc_en: 'Licensed CA attorney review, 48-hour', desc_es: 'Revisión por abogado CA, 48 horas', popular: true },
  { value: 'attorney_consultation', label_en: 'Attorney + Consultation', label_es: 'Abogado + Consulta', price: 299, desc_en: '30-min consultation + review', desc_es: 'Consulta 30 min + revisión' },
];

// Document Preview Component
const DocumentPreview = ({ data, language, isComplete }) => {
  const t = TRANSLATIONS[language];
  
  const getPurposeLabel = () => {
    const purposes = {
      real_estate: language === 'en' ? 'Real Estate Transaction' : 'Transacción de Bienes Raíces',
      banking: language === 'en' ? 'Banking / Financial' : 'Bancario / Financiero',
      tax: language === 'en' ? 'Tax Matters' : 'Asuntos Fiscales',
      business: language === 'en' ? 'Business / Entity' : 'Negocios / Entidad',
      vehicle: language === 'en' ? 'Vehicle / DMV' : 'Vehículo / DMV',
      insurance: language === 'en' ? 'Insurance / Claims' : 'Seguros / Reclamos'
    };
    return purposes[data.purpose_category] || '_______________';
  };

  const getGrantedPowers = () => {
    const powers = [];
    
    // Real Estate Powers
    if (data.purpose_category === 'real_estate') {
      if (data.re_sign_deed) powers.push(language === 'en' ? 'Sign deeds and transfer documents' : 'Firmar escrituras y documentos de transferencia');
      if (data.re_sign_escrow) powers.push(language === 'en' ? 'Sign escrow and closing documents' : 'Firmar documentos de escrow y cierre');
      if (data.re_sign_tax_forms) powers.push(language === 'en' ? 'Sign California FTB Form 593 and PCOR' : 'Firmar Formulario 593 del FTB de California y PCOR');
      if (data.re_receive_proceeds) powers.push(language === 'en' ? 'Receive and disburse sale proceeds' : 'Recibir y desembolsar fondos de venta');
      if (data.re_coordinate_recording) powers.push(language === 'en' ? 'Coordinate county recording' : 'Coordinar registro del condado');
    }
    
    // Banking Powers
    if (data.purpose_category === 'banking') {
      if (data.bank_deposit) powers.push(language === 'en' ? 'Deposit funds' : 'Depositar fondos');
      if (data.bank_withdraw) powers.push(language === 'en' ? `Withdraw funds (max: $${data.bank_withdraw_limit || '___'})` : `Retirar fondos (máx: $${data.bank_withdraw_limit || '___'})`);
      if (data.bank_endorse_checks) powers.push(language === 'en' ? 'Endorse checks' : 'Endosar cheques');
      if (data.bank_wire) powers.push(language === 'en' ? 'Wire funds' : 'Transferir fondos');
      if (data.bank_safe_deposit) powers.push(language === 'en' ? 'Access safe deposit box' : 'Acceder a caja de seguridad');
    }
    
    // Tax Powers
    if (data.purpose_category === 'tax') {
      if (data.tax_irs) powers.push(language === 'en' ? 'Communicate with IRS' : 'Comunicarse con el IRS');
      if (data.tax_ftb) powers.push(language === 'en' ? 'Communicate with CA FTB' : 'Comunicarse con el FTB de CA');
      if (data.tax_sign_returns) powers.push(language === 'en' ? `Sign tax returns (Years: ${data.tax_years || '___'})` : `Firmar declaraciones (Años: ${data.tax_years || '___'})`);
      if (data.tax_form_2848) powers.push(language === 'en' ? 'Execute IRS Form 2848' : 'Ejecutar Formulario 2848');
      if (data.tax_receive_refunds) powers.push(language === 'en' ? 'Receive tax refunds' : 'Recibir reembolsos');
    }
    
    // Business Powers
    if (data.purpose_category === 'business') {
      if (data.biz_form_entity) powers.push(language === 'en' ? 'Form entity with Secretary of State' : 'Formar entidad con Secretario de Estado');
      if (data.biz_obtain_ein) powers.push(language === 'en' ? 'Obtain EIN' : 'Obtener EIN');
      if (data.biz_sign_docs) powers.push(language === 'en' ? 'Sign Operating Agreement/Bylaws' : 'Firmar Acuerdo Operativo/Estatutos');
      if (data.biz_open_account) powers.push(language === 'en' ? 'Open business bank account' : 'Abrir cuenta bancaria comercial');
    }
    
    // Vehicle Powers
    if (data.purpose_category === 'vehicle') {
      const actions = {
        transfer_title: language === 'en' ? 'Transfer vehicle title' : 'Transferir título del vehículo',
        register: language === 'en' ? 'Register vehicle' : 'Registrar vehículo',
        duplicate_title: language === 'en' ? 'Obtain duplicate title' : 'Obtener título duplicado',
        sell: language === 'en' ? 'Sell vehicle' : 'Vender vehículo'
      };
      if (data.vehicle_action) powers.push(actions[data.vehicle_action]);
    }
    
    // Insurance Powers
    if (data.purpose_category === 'insurance') {
      if (data.insurance_submit_claim) powers.push(language === 'en' ? 'Submit insurance claims' : 'Presentar reclamos de seguro');
      if (data.insurance_endorse_checks) powers.push(language === 'en' ? 'Endorse settlement checks' : 'Endosar cheques de liquidación');
      if (data.insurance_execute_releases) powers.push(language === 'en' ? 'Execute releases' : 'Ejecutar liberaciones');
    }
    
    return powers;
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      border: '1px solid #D1D5DB', 
      borderRadius: '8px', 
      padding: '24px',
      fontFamily: 'Georgia, serif',
      fontSize: '12px',
      lineHeight: '1.6',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        fontSize: '48px',
        fontWeight: 'bold',
        color: 'rgba(245, 158, 11, 0.15)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {t.watermark}
      </div>

      {/* Document Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #F59E0B', paddingBottom: '16px' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 'bold', color: '#92400E' }}>{t.docTitle}</h2>
          <p style={{ margin: 0, fontSize: '11px', color: '#B45309' }}>State of California</p>
        </div>

        {/* Principal Section */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400E', margin: '0 0 8px', borderBottom: '1px solid #FDE68A', paddingBottom: '4px' }}>
            {t.principal}
          </h3>
          <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'Name' : 'Nombre'}:</strong> {data.principal_name || '________________________________'}</p>
          <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'Address' : 'Dirección'}:</strong> {data.principal_address || '________________________________'}</p>
        </div>

        {/* Agent Section */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400E', margin: '0 0 8px', borderBottom: '1px solid #FDE68A', paddingBottom: '4px' }}>
            {t.agent}
          </h3>
          <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'Name' : 'Nombre'}:</strong> {data.agent_name || '________________________________'}</p>
          <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'Address' : 'Dirección'}:</strong> {data.agent_address || '________________________________'}</p>
        </div>

        {/* Purpose Section */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400E', margin: '0 0 8px', borderBottom: '1px solid #FDE68A', paddingBottom: '4px' }}>
            {t.purpose}
          </h3>
          <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'Category' : 'Categoría'}:</strong> {getPurposeLabel()}</p>
          
          {/* Category-specific details */}
          {data.purpose_category === 'real_estate' && (
            <>
              <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'Property' : 'Propiedad'}:</strong> {data.re_property_address || '_______________'}</p>
              <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'County' : 'Condado'}:</strong> {data.re_property_county || '_______________'}</p>
              {data.re_property_apn && <p style={{ margin: '4px 0' }}><strong>APN:</strong> {data.re_property_apn}</p>}
            </>
          )}
          
          {data.purpose_category === 'banking' && (
            <>
              <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'Bank' : 'Banco'}:</strong> {data.bank_name || '_______________'}</p>
              <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'Account (last 4)' : 'Cuenta (últimos 4)'}:</strong> ****{data.bank_account_last4 || '____'}</p>
            </>
          )}
          
          {data.purpose_category === 'business' && (
            <>
              <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'Entity Type' : 'Tipo de Entidad'}:</strong> {data.biz_entity_type?.toUpperCase() || '_______________'}</p>
              <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'Entity Name' : 'Nombre de Entidad'}:</strong> {data.biz_entity_name || '_______________'}</p>
            </>
          )}
          
          {data.purpose_category === 'vehicle' && (
            <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'Vehicle' : 'Vehículo'}:</strong> {data.vehicle_year || '____'} {data.vehicle_make || '________'} {data.vehicle_model || '________'} (VIN: {data.vehicle_vin || '_______________'})</p>
          )}
          
          {data.purpose_category === 'insurance' && data.insurance_claim_desc && (
            <p style={{ margin: '4px 0' }}><strong>{language === 'en' ? 'Matter' : 'Asunto'}:</strong> {data.insurance_claim_desc}</p>
          )}
        </div>

        {/* Powers Section */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400E', margin: '0 0 8px', borderBottom: '1px solid #FDE68A', paddingBottom: '4px' }}>
            {t.powers}
          </h3>
          {getGrantedPowers().length > 0 ? (
            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
              {getGrantedPowers().map((power, i) => (
                <li key={i} style={{ margin: '2px 0' }}>{power}</li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: '4px 0', color: '#9CA3AF', fontStyle: 'italic' }}>
              {language === 'en' ? 'Powers will appear as you select them...' : 'Los poderes aparecerán mientras los selecciona...'}
            </p>
          )}
        </div>

        {/* Effective Date & Termination */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400E', margin: '0 0 8px', borderBottom: '1px solid #FDE68A', paddingBottom: '4px' }}>
            {t.effective} / {t.termination}
          </h3>
          <p style={{ margin: '4px 0' }}>
            <strong>{t.effective}:</strong> {data.effective_date_type === 'upon_signing' ? (language === 'en' ? 'Upon signing' : 'Al firmar') : data.effective_date || '_______________'}
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>{t.termination}:</strong> {
              data.termination_type === 'upon_completion' ? (language === 'en' ? 'Upon completion' : 'Al completar') :
              data.termination_type === 'written_revocation' ? (language === 'en' ? 'Upon written revocation' : 'Mediante revocación escrita') :
              data.termination_date || '_______________'
            }
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>{language === 'en' ? 'Durability' : 'Durabilidad'}:</strong> {data.is_durable === true ? t.durable : data.is_durable === false ? t.notDurable : '_______________'}
          </p>
        </div>

        {/* Signature Lines */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
          <p style={{ margin: '16px 0 4px' }}>________________________________</p>
          <p style={{ margin: '0', fontSize: '10px' }}>{data.principal_name || (language === 'en' ? 'Principal Signature' : 'Firma del Poderdante')}</p>
          <p style={{ margin: '16px 0 4px' }}>{language === 'en' ? 'Date' : 'Fecha'}: ________________</p>
        </div>
      </div>
    </div>
  );
};

export default function LimitedPOAWizard() {
  const [language, setLanguage] = useState('es');
  const [currentStep, setCurrentStep] = useState('client');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [intakeData, setIntakeData] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [reviewTier, setReviewTier] = useState('draft_only');
  const [lastSection, setLastSection] = useState('');
  const messagesEndRef = useRef(null);
  const t = TRANSLATIONS[language];

  const getVisibleQuestions = (data = intakeData) => QUESTIONS.filter(q => {
    if (!q.showIf) return true;
    return data[q.showIf.field] === q.showIf.value;
  });

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (currentStep === 'intake' && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t.greeting }]);
      const visibleQs = getVisibleQuestions();
      if (visibleQs.length > 0) {
        const q = visibleQs[0];
        const questionText = language === 'en' ? q.question_en : q.question_es;
        // Show section header
        if (q.section && t.sections[q.section]) {
          setTimeout(() => { setMessages(prev => [...prev, { role: 'assistant', content: t.sections[q.section], isSection: true }]); }, 300);
          setLastSection(q.section);
        }
        setTimeout(() => { setMessages(prev => [...prev, { role: 'assistant', content: questionText }]); }, 600);
      }
    }
  }, [currentStep]);

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
        const lower = userMessage.toLowerCase();
        if (lower.includes('yes') || lower.includes('si') || lower.includes('sí') || lower === 'y' || lower === 's') parsedValue = true;
        else if (lower.includes('no') || lower === 'n') parsedValue = false;
        else { setMessages(prev => [...prev, { role: 'assistant', content: t.pleaseAnswer }]); setIsLoading(false); return; }
      } else if (currentQuestion.type === 'select') {
        const lower = userMessage.toLowerCase().trim();
        const numChoice = parseInt(lower);
        let matchedOption = null;
        
        if (!isNaN(numChoice) && numChoice >= 1 && numChoice <= currentQuestion.options.length) {
          matchedOption = currentQuestion.options[numChoice - 1];
        } else {
          matchedOption = currentQuestion.options.find(o => 
            o.label_en.toLowerCase().includes(lower) || 
            o.label_es.toLowerCase().includes(lower) ||
            o.value.toLowerCase().includes(lower)
          );
        }
        
        if (matchedOption) parsedValue = matchedOption.value;
        else { setMessages(prev => [...prev, { role: 'assistant', content: t.pleaseSelect }]); setIsLoading(false); return; }
      }

      const newData = { ...intakeData, [currentQuestion.field]: parsedValue };
      setIntakeData(newData);

      const displayValue = parsedValue === true ? t.yes : parsedValue === false ? t.no : parsedValue;
      setMessages(prev => [...prev, { role: 'assistant', content: `${t.saved} ${displayValue}` }]);

      // Add warning if applicable
      if (currentQuestion.warning_en && parsedValue === true) {
        const warning = language === 'en' ? currentQuestion.warning_en : currentQuestion.warning_es;
        setTimeout(() => { setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${warning}` }]); }, 300);
      }

      const newVisibleQs = getVisibleQuestions(newData);
      
      // Find the next question index based on the current field
      const currentFieldIndex = newVisibleQs.findIndex(q => q.field === currentQuestion.field);
      const nextIdx = currentFieldIndex + 1;
      setCurrentQuestionIndex(nextIdx);

      setTimeout(() => {
        if (nextIdx < newVisibleQs.length) {
          const nq = newVisibleQs[nextIdx];
          
          // Show section header if section changed
          if (nq.section && nq.section !== lastSection && t.sections[nq.section]) {
            setMessages(prev => [...prev, { role: 'assistant', content: t.sections[nq.section], isSection: true }]);
            setLastSection(nq.section);
          }
          
          const qt = language === 'en' ? nq.question_en : nq.question_es;
          let fullQuestion = qt;
          if (nq.type === 'select' && nq.options) {
            fullQuestion = qt + '\n\n' + t.options + '\n' + nq.options.map((o, i) => `${i + 1}. ${language === 'en' ? o.label_en : o.label_es}`).join('\n');
          } else if (nq.type === 'boolean') {
            fullQuestion = `${qt}\n\n${t.options}\n- ${t.yes}\n- ${t.no}`;
          }
          setMessages(prev => [...prev, { role: 'assistant', content: fullQuestion }]);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: t.allQuestionsAnswered }]);
          setCurrentStep('tier');
        }
        setIsLoading(false);
      }, 600);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: t.errorTryAgain }]);
      setIsLoading(false);
    }
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
          intake_data: { ...intakeData, poa_type: 'limited' },
          language,
          document_type: 'limited_poa'
        })
      });
      const result = await res.json();
      if (result.success) {
        const stripeRes = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier: reviewTier,
            addons: [],
            clientName,
            clientEmail,
            intakeData: { ...intakeData, poa_type: 'limited' },
            language,
            matterId: result.matter.id,
            documentType: 'limited_poa'
          })
        });
        const stripeResult = await stripeRes.json();
        if (stripeResult.success && stripeResult.url) window.location.href = stripeResult.url;
        else { alert('Error creating payment.'); setIsLoading(false); }
      }
    } catch (e) { alert('Error submitting.'); setIsLoading(false); }
  };

  const visibleQuestions = getVisibleQuestions();
  const progress = Math.round((currentQuestionIndex / visibleQuestions.length) * 100);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #FEF3C7, #FDE68A)', padding: '16px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '11px', textAlign: 'center' }}>LIMITED<br/>POA</div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#92400E', margin: 0 }}>{t.title}</h1>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#B45309', margin: 0 }}>{t.subtitle}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>{t.limitedPurpose}</span>
              <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>
                <GlobeIcon /> {language === 'en' ? 'ES' : 'EN'}
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          {currentStep === 'intake' && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#92400E', marginBottom: '4px' }}>
                <span>{t.progress}</span><span>{progress}%</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#FEF3C7', borderRadius: '9999px', height: '8px' }}>
                <div style={{ backgroundColor: '#F59E0B', height: '8px', borderRadius: '9999px', width: `${progress}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Client Info Step */}
        {currentStep === 'client' && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#92400E' }}>{t.clientInfo}</h2>
            <p style={{ fontSize: '12px', color: '#B45309', marginBottom: '16px' }}>{t.legalNote}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#92400E', marginBottom: '4px' }}>{t.clientName}</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#92400E', marginBottom: '4px' }}>{t.clientEmail}</label>
                <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#92400E', marginBottom: '4px' }}>{t.clientPhone}</label>
                <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }} />
              </div>
              <button onClick={() => setCurrentStep('intake')} disabled={!clientName || !clientEmail} style={{ width: '100%', padding: '14px', backgroundColor: !clientName || !clientEmail ? '#D1D5DB' : '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: !clientName || !clientEmail ? 'not-allowed' : 'pointer', fontSize: '16px' }}>{t.continue}</button>
            </div>
          </div>
        )}

        {/* Chat + Preview Layout */}
        {currentStep === 'intake' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Chat Area */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '500px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={msg.isSection ? {
                    textAlign: 'center',
                    padding: '8px 16px',
                    backgroundColor: '#FEF3C7',
                    borderRadius: '20px',
                    color: '#92400E',
                    fontWeight: '600',
                    fontSize: '13px',
                    margin: '8px auto',
                    display: 'inline-block',
                    alignSelf: 'center'
                  } : msg.role === 'user' ? {
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#F59E0B',
                    color: 'white',
                    marginLeft: 'auto',
                    whiteSpace: 'pre-line'
                  } : {
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    whiteSpace: 'pre-line'
                  }}>{msg.content}</div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #E5E7EB', padding: '12px' }}>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder={t.typeAnswer} disabled={isLoading} style={{ flex: 1, padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px' }} />
                <button onClick={handleSend} disabled={isLoading || !input.trim()} style={{ padding: '12px 20px', backgroundColor: isLoading || !input.trim() ? '#D1D5DB' : '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer' }}><SendIcon /></button>
              </div>
            </div>

            {/* Document Preview */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#92400E', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📄 {t.yourAnswers}
              </h3>
              <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                <DocumentPreview data={intakeData} language={language} isComplete={currentStep === 'tier'} />
              </div>
            </div>
          </div>
        )}

        {/* Tier Selection Step */}
        {currentStep === 'tier' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#92400E' }}>{t.tierSelect}</h2>
              {TIERS.map((tier) => (
                <div key={tier.value} onClick={() => setReviewTier(tier.value)} style={{ padding: '16px', border: `2px solid ${reviewTier === tier.value ? '#F59E0B' : '#E5E7EB'}`, borderRadius: '12px', cursor: 'pointer', marginBottom: '12px', backgroundColor: reviewTier === tier.value ? '#FFFBEB' : 'white' }}>
                  {tier.popular && <div style={{ backgroundColor: '#F59E0B', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'inline-block', marginBottom: '8px' }}>Popular</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '16px', color: '#92400E' }}>{language === 'en' ? tier.label_en : tier.label_es}</div>
                      <div style={{ fontSize: '13px', color: '#B45309', marginTop: '4px' }}>{language === 'en' ? tier.desc_en : tier.desc_es}</div>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B' }}>${tier.price}</div>
                  </div>
                </div>
              ))}
              <button onClick={handleSubmit} disabled={isLoading} style={{ width: '100%', padding: '14px', backgroundColor: isLoading ? '#D1D5DB' : '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '16px', marginTop: '8px' }}>
                {isLoading ? t.paying : t.submit} - ${TIERS.find(t => t.value === reviewTier)?.price}
              </button>
            </div>

            {/* Final Document Preview */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>📄 {t.yourAnswers}</h3>
              <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                <DocumentPreview data={intakeData} language={language} isComplete={true} />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '16px', color: '#92400E', fontSize: '12px' }}>
          <p style={{ margin: 0 }}>Multi Servicios 360 | www.multiservicios360.net | 855.246.7274</p>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#B45309' }}>{language === 'en' ? 'This is a legal document preparation service, not legal advice' : 'Este es un servicio de preparación de documentos legales, no asesoría legal'}</p>
        </div>
      </div>

      {/* Responsive styles for mobile */}
      <style jsx>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}