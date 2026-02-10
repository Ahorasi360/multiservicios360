// Updated: 2026-01-22 - Fixed field names, added execution date input, proper page breaks
"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PDFDocument } from 'pdf-lib';

// Spanish to English relationship translations
const RELATIONSHIP_TRANSLATIONS = {
  // Immediate family
  'esposo': 'husband',
  'esposa': 'wife',
  'hijo': 'son',
  'hija': 'daughter',
  'padre': 'father',
  'madre': 'mother',
  'hermano': 'brother',
  'hermana': 'sister',
  
  // In-laws
  'suegro': 'father-in-law',
  'suegra': 'mother-in-law',
  'cuñado': 'brother-in-law',
  'cuñada': 'sister-in-law',
  'yerno': 'son-in-law',
  'nuera': 'daughter-in-law',
  'consuegro': 'co-father-in-law',
  'consuegra': 'co-mother-in-law',
  
  // Extended family
  'abuelo': 'grandfather',
  'abuela': 'grandmother',
  'nieto': 'grandson',
  'nieta': 'granddaughter',
  'tio': 'uncle',
  'tío': 'uncle',
  'tia': 'aunt',
  'tía': 'aunt',
  'primo': 'cousin',
  'prima': 'cousin',
  'sobrino': 'nephew',
  'sobrina': 'niece',
  
  // Step family
  'padrastro': 'stepfather',
  'madrastra': 'stepmother',
  'hijastro': 'stepson',
  'hijastra': 'stepdaughter',
  'hermanastro': 'stepbrother',
  'hermanastra': 'stepsister',
  
  // Other relationships
  'amigo': 'friend',
  'amiga': 'friend',
  'novio': 'boyfriend',
  'novia': 'girlfriend',
  'prometido': 'fiancé',
  'prometida': 'fiancée',
  'pareja': 'partner',
  'vecino': 'neighbor',
  'vecina': 'neighbor',
  'colega': 'colleague',
  'jefe': 'boss',
  'empleado': 'employee',
  'empleada': 'employee',
  'socio': 'business partner',
  'socia': 'business partner',
  'abogado': 'attorney',
  'abogada': 'attorney',
  'contador': 'accountant',
  'contadora': 'accountant',
  
  // Great relatives
  'bisabuelo': 'great-grandfather',
  'bisabuela': 'great-grandmother',
  'bisnieto': 'great-grandson',
  'bisnieta': 'great-granddaughter',
  'tataraabuelo': 'great-great-grandfather',
  'tataraabuela': 'great-great-grandmother',
};

// Function to translate relationship from Spanish to English
const translateRelationship = (spanishRelationship) => {
  if (!spanishRelationship) return spanishRelationship;
  
  const lower = spanishRelationship.toLowerCase().trim();
  
  // Check for exact match
  if (RELATIONSHIP_TRANSLATIONS[lower]) {
    // Preserve original capitalization style
    const translation = RELATIONSHIP_TRANSLATIONS[lower];
    if (spanishRelationship[0] === spanishRelationship[0].toUpperCase()) {
      return translation.charAt(0).toUpperCase() + translation.slice(1);
    }
    return translation;
  }
  
  // If no translation found, return original
  return spanishRelationship;
};

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
    <path d="M2 2l7.586 7.586"></path>
    <circle cx="11" cy="11" r="2"></circle>
  </svg>
);

function SuccessContent() {
  const searchParams = useSearchParams();
  const [matterData, setMatterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('es');
  
  // Execution date state
  const [executionDate, setExecutionDate] = useState('');
  const [executionDateError, setExecutionDateError] = useState('');
  const [isFinalized, setIsFinalized] = useState(false);
  
  // Electronic signature state
  const [electronicSignature, setElectronicSignature] = useState('');
  const [signatureAccepted, setSignatureAccepted] = useState(false);
  const [signatureError, setSignatureError] = useState('');

  const matterId = searchParams.get('matter_id');

  useEffect(() => {
    const fetchMatterData = async () => {
      if (matterId) {
        try {
          const response = await fetch(`/api/limited-poa/matters/${matterId}`);
          const data = await response.json();
          if (data.success) {
            setMatterData(data.matter);
            setLanguage(data.matter.language || 'es');
            // Check if already finalized
            if (data.matter.execution_date) {
              setExecutionDate(data.matter.execution_date);
              setIsFinalized(true);
            }
            // Load saved electronic signature if exists
            if (data.matter.electronic_signature) {
              setElectronicSignature(data.matter.electronic_signature);
              setSignatureAccepted(true);
            }
          }
        } catch (error) {
          console.error('Error fetching matter:', error);
        }
      }
      setLoading(false);
    };
    fetchMatterData();
  }, [matterId]);

  // Format date input as MM/DD/YYYY
  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }
    setExecutionDate(value);
    setExecutionDateError('');
  };

  // Set today's date (LA timezone)
  const setTodayDate = () => {
    const today = new Date().toLocaleDateString('en-US', {
      timeZone: 'America/Los_Angeles',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    setExecutionDate(today);
    setExecutionDateError('');
  };

  // Validate date format MM/DD/YYYY
  const isValidDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 10) return false;
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    const [month, day, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getMonth() === month - 1 && date.getDate() === day;
  };

  const t = language === 'es' ? {
    title: 'Pago Exitoso!',
    subtitle: 'Su Poder Notarial Limitado esta listo',
    thankYou: 'Gracias por su compra. Su documento esta listo para descargar.',
    orderNumber: 'Numero de Orden',
    downloadSpanish: 'Descargar PDF Espanol',
    downloadEnglish: 'Descargar PDF Ingles',
    print: 'Imprimir',
    email: 'Enviar por Email',
    nextSteps: 'Proximos Pasos',
    step1: 'Ingrese la fecha de ejecucion abajo',
    step2: 'Descargue sus documentos PDF',
    step3: 'Revise el documento cuidadosamente',
    step4: 'Firme ante un notario publico',
    step5: 'Guarde copias en un lugar seguro',
    questions: 'Preguntas?',
    contact: 'Contactenos al 855.246.7274',
    backHome: 'Volver al Inicio',
    legalNote: 'Nota: El documento en ingles es el documento legal oficial. El documento en espanol es para su referencia.',
    executionDateLabel: 'Fecha de Ejecucion (Requerida)',
    executionDatePlaceholder: 'MM/DD/AAAA',
    useTodayDate: 'Usar Fecha de Hoy',
    executionDateRequired: 'La fecha de ejecucion es obligatoria.',
    executionDateInvalid: 'Formato de fecha invalido. Use MM/DD/AAAA.',
    executionDateHelp: 'Esta es la fecha en que firmara el documento ante el notario.',
    signatureLabel: 'Firma Electronica (Requerida)',
    signaturePlaceholder: 'Escriba su nombre completo',
    signatureHelp: 'Al escribir su nombre, confirma que creo este documento usted mismo.',
    signatureRequired: 'La firma electronica es obligatoria.',
    signatureAcceptLabel: 'Acepto que cree este documento yo mismo usando las herramientas de software de Multiservicios 360, y que no recibi asesoria legal.',
    signatureAcceptRequired: 'Debe aceptar los terminos para continuar.',
    finalized: 'Documento finalizado',
  } : {
    title: 'Payment Successful!',
    subtitle: 'Your Limited Power of Attorney is ready',
    thankYou: 'Thank you for your purchase. Your document is ready to download.',
    orderNumber: 'Order Number',
    downloadSpanish: 'Download Spanish PDF',
    downloadEnglish: 'Download English PDF',
    print: 'Print',
    email: 'Email',
    nextSteps: 'Next Steps',
    step1: 'Enter the execution date below',
    step2: 'Download your PDF documents',
    step3: 'Review the document carefully',
    step4: 'Sign in front of a notary public',
    step5: 'Store copies in a safe place',
    questions: 'Questions?',
    contact: 'Contact us at 855.246.7274',
    backHome: 'Back to Home',
    legalNote: 'Note: The English document is the official legal document. The Spanish document is for your reference.',
    executionDateLabel: 'Execution Date (Required)',
    executionDatePlaceholder: 'MM/DD/YYYY',
    useTodayDate: "Use Today's Date",
    executionDateRequired: 'Execution date is required.',
    executionDateInvalid: 'Invalid date format. Use MM/DD/YYYY.',
    executionDateHelp: 'This is the date you will sign the document before the notary.',
    signatureLabel: 'Electronic Signature (Required)',
    signaturePlaceholder: 'Type your full name',
    signatureHelp: 'By typing your name, you confirm that you created this document yourself.',
    signatureRequired: 'Electronic signature is required.',
    signatureAcceptLabel: 'I accept that I created this document myself using Multiservicios 360 software tools, and that I did not receive legal advice.',
    signatureAcceptRequired: 'You must accept the terms to continue.',
    finalized: 'Document finalized',
  };

  // Helper function to get purpose category label
  const getPurposeLabel = (category, lang) => {
    const purposes = {
      real_estate: lang === 'en' ? 'Real Estate Transaction' : 'Transaccion de Bienes Raices',
      banking: lang === 'en' ? 'Banking / Financial' : 'Bancario / Financiero',
      tax: lang === 'en' ? 'Tax Matters' : 'Asuntos Fiscales',
      business: lang === 'en' ? 'Business / Entity' : 'Negocios / Entidad',
      vehicle: lang === 'en' ? 'Vehicle / DMV' : 'Vehiculo / DMV',
      insurance: lang === 'en' ? 'Insurance / Claims' : 'Seguros / Reclamos'
    };
    return purposes[category] || category;
  };

  // Helper function to get granted powers based on category
  const getGrantedPowers = (d, lang) => {
    const powers = [];
    
    if (d.purpose_category === 'real_estate') {
      if (d.re_sign_deed) powers.push(lang === 'en' ? 'Sign deeds and transfer documents' : 'Firmar escrituras y documentos de transferencia');
      if (d.re_sign_escrow) powers.push(lang === 'en' ? 'Sign escrow and closing documents' : 'Firmar documentos de escrow y cierre');
      if (d.re_sign_tax_forms) powers.push(lang === 'en' ? 'Sign California FTB Form 593 and PCOR' : 'Firmar Formulario 593 del FTB de California y PCOR');
      if (d.re_receive_proceeds) powers.push(lang === 'en' ? 'Receive and disburse sale proceeds' : 'Recibir y desembolsar fondos de venta');
      if (d.re_coordinate_recording) powers.push(lang === 'en' ? 'Coordinate county recording' : 'Coordinar registro del condado');
    }
    
    if (d.purpose_category === 'banking') {
      if (d.bank_deposit) powers.push(lang === 'en' ? 'Deposit funds' : 'Depositar fondos');
      if (d.bank_withdraw) powers.push(lang === 'en' ? 'Withdraw funds (max: $' + (d.bank_withdraw_limit || '___') + ')' : 'Retirar fondos (max: $' + (d.bank_withdraw_limit || '___') + ')');
      if (d.bank_endorse_checks) powers.push(lang === 'en' ? 'Endorse checks' : 'Endosar cheques');
      if (d.bank_wire) powers.push(lang === 'en' ? 'Wire funds' : 'Transferir fondos');
      if (d.bank_safe_deposit) powers.push(lang === 'en' ? 'Access safe deposit box' : 'Acceder a caja de seguridad');
    }
    
    if (d.purpose_category === 'tax') {
      if (d.tax_irs) powers.push(lang === 'en' ? 'Communicate with IRS' : 'Comunicarse con el IRS');
      if (d.tax_ftb) powers.push(lang === 'en' ? 'Communicate with CA FTB' : 'Comunicarse con el FTB de CA');
      if (d.tax_sign_returns) powers.push(lang === 'en' ? 'Sign tax returns (Years: ' + (d.tax_years || '___') + ')' : 'Firmar declaraciones (Anos: ' + (d.tax_years || '___') + ')');
      if (d.tax_form_2848) powers.push(lang === 'en' ? 'Execute IRS Form 2848' : 'Ejecutar Formulario 2848');
      if (d.tax_receive_refunds) powers.push(lang === 'en' ? 'Receive tax refunds' : 'Recibir reembolsos');
    }
    
    if (d.purpose_category === 'business') {
      if (d.biz_form_entity) powers.push(lang === 'en' ? 'Form entity with Secretary of State' : 'Formar entidad con Secretario de Estado');
      if (d.biz_obtain_ein) powers.push(lang === 'en' ? 'Obtain EIN' : 'Obtener EIN');
      if (d.biz_sign_docs) powers.push(lang === 'en' ? 'Sign Operating Agreement/Bylaws' : 'Firmar Acuerdo Operativo/Estatutos');
      if (d.biz_open_account) powers.push(lang === 'en' ? 'Open business bank account' : 'Abrir cuenta bancaria comercial');
    }
    
    if (d.purpose_category === 'vehicle') {
      const actions = {
        transfer_title: lang === 'en' ? 'Transfer vehicle title' : 'Transferir titulo del vehiculo',
        register: lang === 'en' ? 'Register vehicle' : 'Registrar vehiculo',
        duplicate_title: lang === 'en' ? 'Obtain duplicate title' : 'Obtener titulo duplicado',
        sell: lang === 'en' ? 'Sell vehicle' : 'Vender vehiculo'
      };
      if (d.vehicle_action) powers.push(actions[d.vehicle_action]);
    }
    
    if (d.purpose_category === 'insurance') {
      if (d.insurance_submit_claim) powers.push(lang === 'en' ? 'Submit insurance claims' : 'Presentar reclamos de seguro');
      if (d.insurance_endorse_checks) powers.push(lang === 'en' ? 'Endorse settlement checks' : 'Endosar cheques de liquidacion');
      if (d.insurance_execute_releases) powers.push(lang === 'en' ? 'Execute releases' : 'Ejecutar liberaciones');
    }
    
    return powers;
  };

  const generatePDF = async (lang) => {
    if (!matterData) return;

    // Validate execution date
    if (!executionDate) {
      setExecutionDateError(t.executionDateRequired);
      return;
    }
    if (!isValidDate(executionDate)) {
      setExecutionDateError(t.executionDateInvalid);
      return;
    }

    // VALIDATION: Electronic signature is required
    if (!electronicSignature || electronicSignature.trim().length < 2) {
      setSignatureError(t.signatureRequired);
      return;
    }
    setSignatureError('');

    // VALIDATION: Must accept terms
    if (!signatureAccepted) {
      setSignatureError(t.signatureAcceptRequired);
      return;
    }

    const d = matterData.intake_data || {};
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const m = 20; // margin
    const cw = pw - (m * 2); // content width
    let y = 20;

    // Helper function to wrap text and handle page breaks
    const wrap = (text, x, startY, maxWidth, lineHeight = 5) => {
      const lines = doc.splitTextToSize(text || '', maxWidth);
      lines.forEach((line) => {
        if (startY > ph - 25) {
          doc.addPage();
          startY = 20;
        }
        doc.text(line, x, startY);
        startY += lineHeight;
      });
      return startY;
    };

    // Helper function to check for new page
    const newPage = (currentY, needed = 30) => {
      if (currentY > ph - needed) {
        doc.addPage();
        return 20;
      }
      return currentY;
    };

    // Helper function for sections
    const section = (title, content) => {
      y = newPage(y, 40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(title, m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      y = wrap(content, m, y, cw, 5);
      y += 8;
    };

    // Get category name
    const categoryName = getPurposeLabel(d.purpose_category, lang);

    // ============================================
    // RECORDING HEADER (for real estate POAs that need recording)
    // ============================================
    if (d.purpose_category === 'real_estate' && d.authorized_for_recording) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text("Assessor's Parcel No.: " + (d.re_property_apn || '_______________________'), m, y);
      y += 8;
      doc.text("RECORDING REQUESTED BY:", m, y);
      y += 4;
      doc.text(d.principal_name || '[Principal Name]', m, y);
      y += 4;
      doc.text(d.principal_address || '[Principal Address]', m, y);
      y += 8;
      doc.text("WHEN RECORDED MAIL TO:", m, y);
      y += 4;
      doc.text(d.principal_name || '[Principal Name]', m, y);
      y += 4;
      doc.text(d.principal_address || '[Principal Address]', m, y);
      y += 10;
      doc.setLineWidth(0.3);
      doc.line(m, y, pw - m, y);
      y += 8;
    }

    // ============================================
    // TITLE PAGE
    // ============================================
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'PODER NOTARIAL LIMITADO' : 'CALIFORNIA LIMITED', pw/2, y, {align: 'center'});
    y += 7;
    doc.setFontSize(16);
    doc.text(lang === 'es' ? 'ESTADO DE CALIFORNIA' : 'POWER OF ATTORNEY', pw/2, y, {align: 'center'});
    y += 6;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text(`(${categoryName})`, pw/2, y, {align: 'center'});
    y += 4;
    doc.setLineWidth(0.5);
    doc.line(m, y, pw - m, y);
    y += 10;

    // ============================================
    // ATTORNEY REVIEW NOTICE
    // ============================================
    doc.setFillColor(240, 240, 240);
    doc.rect(m, y, cw, 32, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'AVISO DE REVISION DE ABOGADO (Recomendado)' : 'ATTORNEY REVIEW NOTICE (Recommended)', m + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const attorneyNotice = lang === 'es' 
      ? 'Este Poder Notarial Limitado esta disenado para un proposito especifico y claramente definido. Puede desear consultar con un abogado con licencia de California si tiene preguntas sobre el alcance de la autoridad otorgada. La revision de un abogado no es requerida para que este documento sea valido bajo la ley de California.'
      : 'This Limited Power of Attorney is designed for a specific, clearly defined purpose. You may wish to consult with a licensed California attorney if you have questions about the scope of authority granted. Attorney review is not required for this document to be valid under California law.';
    wrap(attorneyNotice, m + 4, y + 12, cw - 8, 4);
    y += 38;

    // ============================================
    // STATUTORY NOTICE TO PRINCIPAL (California Probate Code § 4128)
    // ============================================
    y = newPage(y, 80);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'AVISO A LA PERSONA QUE EJECUTA EL PODER NOTARIAL' : 'NOTICE TO PERSON EXECUTING POWER OF ATTORNEY', m, y);
    y += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(lang === 'es' ? '(Codigo de Sucesiones de California § 4128)' : '(California Probate Code § 4128)', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    const noticeText = lang === 'es' 
      ? `Un poder notarial es un documento legal importante. Al firmar este poder notarial, usted esta autorizando a otra persona a actuar en su nombre. Antes de firmar este poder notarial, debe conocer estos hechos importantes:

Su agente (apoderado) no tiene obligacion de actuar a menos que usted y su agente acuerden lo contrario por escrito.

Este documento otorga a su agente los poderes especificamente enumerados en este documento. Su agente debe actuar de acuerdo con sus instrucciones razonables o, en ausencia de instrucciones, en su mejor interes.

Su agente tendra derecho a recibir un pago razonable por los servicios prestados bajo este poder notarial a menos que usted disponga lo contrario.

Los poderes que otorga a su agente continuaran existiendo hasta la fecha de terminacion especificada o hasta que usted revoque este poder notarial.

Solo puede enmendar o cambiar este poder notarial ejecutando un nuevo poder notarial o ejecutando una enmienda con las mismas formalidades que un original.

Tiene derecho a revocar o terminar este poder notarial en cualquier momento, siempre que sea competente.

Este poder notarial debe estar fechado y debe ser reconocido ante un notario publico o firmado por dos testigos.

Debe leer este poder notarial cuidadosamente. Si no entiende el poder notarial, o alguna disposicion del mismo, debe obtener la asistencia de un abogado u otra persona calificada.`
      : `A power of attorney is an important legal document. By signing this power of attorney, you are authorizing another person to act for you. Before you sign this power of attorney, you should know these important facts:

Your agent (attorney-in-fact) has no duty to act unless you and your agent agree otherwise in writing.

This document gives your agent the powers specifically enumerated in this document. Your agent must act in accordance with your reasonable expectations or, in the absence of expectations, in your best interest.

Your agent will have the right to receive reasonable payment for services provided under this power of attorney unless you provide otherwise in this power of attorney.

The powers you give your agent will continue to exist until the termination date specified or until you otherwise terminate the power of attorney.

You can amend or change this power of attorney only by executing a new power of attorney or by executing an amendment through the same formalities as an original.

You have the right to revoke or terminate this power of attorney at any time, so long as you are competent.

This power of attorney must be dated and must be acknowledged before a notary public or signed by two witnesses.

You should read this power of attorney carefully. If you do not understand the power of attorney, or any provision of it, then you should obtain the assistance of an attorney or other qualified person.`;
    
    y = wrap(noticeText, m, y, cw, 4);
    y += 10;

    // ============================================
    // ARTICLE I - IDENTIFICATION OF PARTIES
    // ============================================
    y = newPage(y, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO I - IDENTIFICACION DE LAS PARTES' : 'ARTICLE I - IDENTIFICATION OF PARTIES', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const principalText = lang === 'es'
      ? `Yo, ${d.principal_name || '___'}, con domicilio en ${d.principal_address || '___'}, Estado de California ("Poderdante"), por medio del presente designo a:`
      : `I, ${d.principal_name || '___'}, residing at ${d.principal_address || '___'}, State of California ("Principal"), hereby appoint:`;
    
    y = wrap(principalText, m, y, cw, 5);
    y += 6;

    // Agent info
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'APODERADO:' : 'AGENT:', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    let agentText = `${d.agent_name || '___'}`;
    agentText += lang === 'es'
      ? `, con domicilio en ${d.agent_address || '___'}`
      : `, residing at ${d.agent_address || '___'}`;
    if (d.agent_relationship) {
      agentText += lang === 'es'
        ? ` (Relacion: ${d.agent_relationship})`
        : ` (Relationship: ${translateRelationship(d.agent_relationship)})`;
    }
    y = wrap(agentText, m, y, cw, 5);
    y += 8;

    // ============================================
    // ARTICLE II - PURPOSE AND SCOPE
    // ============================================
    y = newPage(y, 40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO II - PROPOSITO Y ALCANCE' : 'ARTICLE II - PURPOSE AND SCOPE', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    const purposeIntro = lang === 'es'
      ? `Este Poder Notarial Limitado se otorga EXCLUSIVAMENTE para el siguiente proposito especifico: ${categoryName}.`
      : `This Limited Power of Attorney is granted EXCLUSIVELY for the following specific purpose: ${categoryName}.`;
    y = wrap(purposeIntro, m, y, cw, 5);
    y += 6;

    // Property/Subject details based on category
    if (d.purpose_category === 'real_estate' && d.re_property_address) {
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'Propiedad:' : 'Property:', m, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const propertyText = `${d.re_property_address}, ${d.re_property_county || '___'} County, California. APN: ${d.re_property_apn || '___'}`;
      y = wrap(propertyText, m, y, cw, 5);
      y += 4;
    }

    if (d.purpose_category === 'vehicle' && d.vehicle_vin) {
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'Vehiculo:' : 'Vehicle:', m, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const vehicleText = `${d.vehicle_year || '___'} ${d.vehicle_make || '___'} ${d.vehicle_model || '___'}, VIN: ${d.vehicle_vin}, License: ${d.vehicle_license || '___'}`;
      y = wrap(vehicleText, m, y, cw, 5);
      y += 4;
    }

    if (d.purpose_category === 'insurance' && d.insurance_claim_desc) {
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'Reclamo:' : 'Claim:', m, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      y = wrap(d.insurance_claim_desc, m, y, cw, 5);
      y += 4;
    }

    if (d.purpose_category === 'banking' && d.bank_name) {
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'Institucion Financiera:' : 'Financial Institution:', m, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      y = wrap(`${d.bank_name}${d.bank_account_last4 ? ', Account ending in ' + d.bank_account_last4 : ''}`, m, y, cw, 5);
      y += 4;
    }

    y += 6;

    // ============================================
    // ARTICLE III - SPECIFIC POWERS GRANTED
    // ============================================
    y = newPage(y, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO III - PODERES ESPECIFICOS OTORGADOS' : 'ARTICLE III - SPECIFIC POWERS GRANTED', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const powersIntro = lang === 'es'
      ? 'El Apoderado esta autorizado para realizar las siguientes acciones especificas en mi nombre, y SOLAMENTE estas acciones:'
      : 'The Agent is authorized to perform the following specific actions on my behalf, and ONLY these actions:';
    y = wrap(powersIntro, m, y, cw, 5);
    y += 6;

    const powers = getGrantedPowers(d, lang);
    if (powers.length > 0) {
      powers.forEach((power, index) => {
        y = newPage(y, 10);
        doc.text(`[X] ${index + 1}. ${power}`, m + 5, y);
        y += 7;
      });
    } else {
      doc.text(lang === 'es' ? '(Poderes especificos segun lo descrito en el proposito anterior)' : '(Specific powers as described in the purpose above)', m + 5, y);
      y += 7;
    }
    y += 6;

    // ============================================
    // ARTICLE IV - LIMITATIONS
    // ============================================
    section(lang === 'es' ? 'ARTICULO IV - LIMITACIONES' : 'ARTICLE IV - LIMITATIONS',
      lang === 'es'
        ? 'Este Poder Notarial esta ESTRICTAMENTE LIMITADO al proposito especificado anteriormente. El Apoderado NO tiene autoridad para actuar en ningun otro asunto. El Apoderado no puede delegar esta autoridad a otra persona. El Apoderado no puede tomar ninguna accion que exceda el alcance de los poderes especificamente otorgados en este documento.'
        : 'This Power of Attorney is STRICTLY LIMITED to the purpose specified above. The Agent has NO authority to act in any other matter. The Agent may not delegate this authority to another person. The Agent may not take any action that exceeds the scope of the powers specifically granted in this document.'
    );

    // ============================================
    // ARTICLE V - DURATION AND EFFECTIVE DATE (FIXED FIELD NAMES)
    // ============================================
    y = newPage(y, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO V - DURACION Y FECHA EFECTIVA' : 'ARTICLE V - DURATION AND EFFECTIVE DATE', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // FIXED: Using correct field name effective_date_type
    let effectiveText = '';
    if (d.effective_date_type === 'upon_signing' || !d.effective_date_type) {
      effectiveText = lang === 'es'
        ? 'Este Poder Notarial entra en vigor INMEDIATAMENTE al momento de la firma.'
        : 'This Power of Attorney becomes effective IMMEDIATELY upon execution.';
    } else if (d.effective_date_type === 'specific_date') {
      effectiveText = lang === 'es'
        ? `Este Poder Notarial entrara en vigor en la fecha: ${d.effective_date || '___'}.`
        : `This Power of Attorney shall become effective on: ${d.effective_date || '___'}.`;
    }
    y = wrap(effectiveText, m, y, cw, 5);
    y += 4;

    // FIXED: Using correct field name termination_type
    let terminationText = '';
    if (d.termination_type === 'upon_completion' || !d.termination_type) {
      terminationText = lang === 'es'
        ? 'Este Poder Notarial terminara automaticamente al completarse el proposito especificado.'
        : 'This Power of Attorney shall automatically terminate upon completion of the specified purpose.';
    } else if (d.termination_type === 'specific_date') {
      terminationText = lang === 'es'
        ? `Este Poder Notarial terminara en la fecha: ${d.termination_date || '___'}.`
        : `This Power of Attorney shall terminate on: ${d.termination_date || '___'}.`;
    } else if (d.termination_type === 'written_revocation') {
      terminationText = lang === 'es'
        ? 'Este Poder Notarial terminara mediante revocacion escrita por el Poderdante.'
        : 'This Power of Attorney shall terminate upon written revocation by the Principal.';
    }
    y = wrap(terminationText, m, y, cw, 5);
    y += 4;

    // FIXED: Using correct field name is_durable
    if (d.is_durable) {
      const durabilityText = lang === 'es'
        ? 'Este Poder Notarial es DURADERO y no sera afectado por mi incapacidad posterior, de conformidad con el Codigo de Sucesiones de California Seccion 4124.'
        : 'This Power of Attorney is DURABLE and shall NOT BE AFFECTED by my subsequent incapacity, pursuant to California Probate Code Section 4124.';
      y = wrap(durabilityText, m, y, cw, 5);
    } else {
      const nonDurableText = lang === 'es'
        ? 'Este Poder Notarial NO es duradero y terminara automaticamente si quedo incapacitado.'
        : 'This Power of Attorney is NOT durable and shall automatically terminate upon my incapacity.';
      y = wrap(nonDurableText, m, y, cw, 5);
    }
    y += 8;

    // ============================================
    // ARTICLE VI - REVOCATION
    // ============================================
    section(lang === 'es' ? 'ARTICULO VI - REVOCACION' : 'ARTICLE VI - REVOCATION',
      lang === 'es'
        ? 'Tengo el derecho de revocar este Poder Notarial Limitado en cualquier momento mediante notificacion escrita al Apoderado. Dicha revocacion sera efectiva al momento de la entrega de la notificacion al Apoderado.'
        : 'I have the right to revoke this Limited Power of Attorney at any time by written notice to the Agent. Such revocation shall be effective upon delivery of notice to the Agent.'
    );

    // ============================================
    // ARTICLE VII - THIRD PARTY RELIANCE
    // ============================================
    section(lang === 'es' ? 'ARTICULO VII - CONFIANZA DE TERCEROS' : 'ARTICLE VII - THIRD PARTY RELIANCE',
      lang === 'es'
        ? 'Cualquier tercero puede confiar en la autoridad otorgada en este Poder Notarial sin indagar sobre su validez, alcance o revocacion, conforme a la Seccion 4303 del Codigo de Sucesiones de California. Un tercero que actue de buena fe confiando en este Poder Notarial no sera responsable de ningun dano que surja de dicha confianza.'
        : 'Any third party may rely upon the authority granted in this Power of Attorney without inquiry into its validity, scope, or revocation, pursuant to California Probate Code Section 4303. A third party who acts in good faith reliance on this Power of Attorney shall not be liable for any damages arising from such reliance.'
    );

    // ============================================
    // EXECUTION PAGE - FORCE NEW PAGE FOR PROPER SPACING
    // ============================================
    doc.addPage();
    y = 20;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO VIII - EJECUCION' : 'ARTICLE VIII - EXECUTION', m, y);
    y += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const executionIntro = lang === 'es' 
      ? 'EN FE DE LO CUAL, he ejecutado este Poder Notarial Limitado en la fecha indicada a continuacion.' 
      : 'IN WITNESS WHEREOF, I have executed this Limited Power of Attorney on the date written below.';
    y = wrap(executionIntro, m, y, cw, 5);
    y += 15;

    // Execution Date - using the date entered by user
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'Fecha de Ejecucion:' : 'Date of Execution:', m, y);
    doc.setFont('helvetica', 'normal');
    doc.text(executionDate || '____/____/________', m + 50, y);
    y += 25;

    // Principal signature
    doc.line(m, y, m + 100, y);
    y += 6;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(d.principal_name || '________________________', m, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(lang === 'es' ? 'Poderdante (Principal)' : 'Principal', m, y);

    // ============================================
    // NOTICE TO AGENT PAGE (California Probate Code § 4128)
    // ============================================
    doc.addPage();
    y = 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'AVISO AL APODERADO' : 'NOTICE TO AGENT', pw/2, y, {align: 'center'});
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(lang === 'es' ? '(Codigo de Sucesiones de California § 4128)' : '(California Probate Code § 4128)', pw/2, y, {align: 'center'});
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const agentNoticeText = lang === 'es'
      ? `Cuando usted acepta la autoridad otorgada bajo este poder notarial, se crea una relacion legal especial entre usted y el poderdante. Esta relacion impone sobre usted deberes legales que continuan hasta que renuncie o el poder notarial sea terminado o revocado. Usted debe:

(1) Hacer lo que el poderdante le autorice a hacer solo cuando el poderdante quiere que usted actue o no puede tomar sus propias decisiones.

(2) Actuar de buena fe para el beneficio del poderdante.

(3) Hacer solo lo que el poderdante podria hacer legalmente.

(4) Actuar con lealtad hacia el poderdante.

(5) Evitar conflictos que podrian interferir con su capacidad de actuar en el mejor interes del poderdante.

(6) Mantener separada la propiedad del poderdante, a menos que se permita lo contrario.

(7) Mantener registros adecuados de todas las recibos, desembolsos y transacciones realizadas en nombre del poderdante.

(8) Cooperar con una persona que tenga autoridad para tomar decisiones de atencion medica para el poderdante para llevar a cabo los deseos razonables del poderdante.

(9) Intentar preservar el plan patrimonial del poderdante, en la medida que realmente lo conozca, si hacerlo es consistente con los mejores intereses del poderdante basado en toda la informacion relevante, incluyendo la situacion financiera del poderdante y las necesidades previsibles para la atencion medica y de vida.

A menos que el poder notarial disponga lo contrario, su autoridad incluye la autoridad para hacer lo siguiente:

(1) Autorizar que se le permita a otra persona ejercer la autoridad otorgada bajo el poder notarial.

(2) Contratar un abogado, contador u otro profesional o experto para ayudarlo en la realizacion de sus deberes.

(3) Recibir una compensacion razonable por los servicios que preste como agente.

Si no cumple fielmente sus deberes bajo la ley y bajo el poder notarial, usted puede estar sujeto a cualquiera de las siguientes consecuencias:

(1) El tribunal puede destituirlo como agente.

(2) El tribunal puede ordenarle que devuelva cualquier propiedad que haya malversado.

(3) Usted puede ser responsable de cualquier dano que cause al poderdante.

(4) Usted puede estar sujeto a sanciones penales por actividades que constituyan conducta criminal.`
      : `When you accept the authority granted under this power of attorney, a special legal relationship is created between you and the principal. This relationship imposes upon you legal duties that continue until you resign or the power of attorney is terminated or revoked. You must:

(1) Do what the principal authorizes you to do only when the principal wants you to act or cannot make their own decisions.

(2) Act in good faith for the benefit of the principal.

(3) Do only what the principal could lawfully do.

(4) Act loyally for the principal.

(5) Avoid conflicts that would impair your ability to act in the principal's best interest.

(6) Keep the principal's property separate, unless otherwise permitted.

(7) Keep adequate records of all receipts, disbursements, and transactions made on behalf of the principal.

(8) Cooperate with a person that has authority to make health care decisions for the principal to do what you know the principal reasonably expects or, if you do not know the principal's expectations, to act in the principal's best interest.

(9) Attempt to preserve the principal's estate plan, to the extent actually known by you, if preserving the plan is consistent with the principal's best interest based on all relevant information, including the principal's foreseeable obligations and need for maintenance.

Unless the power of attorney otherwise provides, your authority includes the authority to do the following:

(1) Authorize another person to exercise the authority granted under the power of attorney.

(2) Hire an attorney, accountant, or other professional or expert to assist you in performing your duties.

(3) Receive reasonable compensation for services you render as agent.

If you do not faithfully perform your duties under the law and under the power of attorney, you may be subject to any of the following consequences:

(1) The court may remove you as agent.

(2) The court may order you to return any property you have misappropriated.

(3) You may be liable for any damages you cause to the principal.

(4) You may be subject to criminal penalties for activities that constitute criminal conduct.`;

    y = wrap(agentNoticeText, m, y, cw, 4);
    y += 8;

    // ============================================
    // ELDER ABUSE WARNING
    // ============================================
    y = newPage(y, 45);
    doc.setFillColor(255, 245, 238);
    doc.rect(m, y, cw, 38, 'F');
    doc.setDrawColor(200, 100, 100);
    doc.setLineWidth(0.5);
    doc.rect(m, y, cw, 38, 'S');
    y += 6;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 0, 0);
    doc.text(lang === 'es' ? 'ADVERTENCIA SOBRE ABUSO DE ADULTOS MAYORES' : 'ELDER ABUSE WARNING', m + 4, y);
    y += 6;
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const abuseWarning = lang === 'es'
      ? 'El abuso de adultos mayores es un delito grave en California. El uso indebido de este poder notarial para robar o defraudar al poderdante puede resultar en cargos criminales bajo el Codigo Penal de California Seccion 368 y responsabilidad civil. Si sospecha de abuso financiero de un adulto mayor, comuniquese con los Servicios de Proteccion de Adultos al 1-833-401-0832 o la policia local.'
      : 'Elder abuse is a serious crime in California. Misuse of this power of attorney to steal from or defraud the principal can result in criminal charges under California Penal Code Section 368 and civil liability. If you suspect financial abuse of an elder, contact Adult Protective Services at 1-833-401-0832 or local law enforcement.';
    y = wrap(abuseWarning, m + 4, y, cw - 8, 4);
    y += 18;

    // ============================================
    // AGENT ACCEPTANCE SIGNATURE
    // ============================================
    y = newPage(y, 70);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ACEPTACION DEL APODERADO' : 'AGENT ACCEPTANCE', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const acceptanceText = lang === 'es'
      ? 'Yo, el Apoderado nombrado en este Poder Notarial, reconozco haber leido y entendido el Aviso al Apoderado anterior. Acepto actuar como Apoderado bajo este Poder Notarial Limitado y acepto cumplir con todos los deberes descritos anteriormente. Entiendo que mi autoridad esta ESTRICTAMENTE LIMITADA al proposito especificado en este documento.'
      : 'I, the Agent named in this Power of Attorney, acknowledge that I have read and understand the Notice to Agent above. I agree to act as Agent under this Limited Power of Attorney and agree to comply with all duties described above. I understand that my authority is STRICTLY LIMITED to the purpose specified in this document.';
    y = wrap(acceptanceText, m, y, cw, 5);
    y += 15;

    doc.line(m, y, m + 100, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(d.agent_name || '________________________', m, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(lang === 'es' ? 'Firma del Apoderado' : 'Agent Signature', m, y);
    y += 15;
    doc.text((lang === 'es' ? 'Fecha: ' : 'Date: ') + '________________________', m, y);

    // ============================================
    // WITNESS ATTESTATION PAGE
    // ============================================
    doc.addPage();
    y = 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'DECLARACION DE TESTIGOS' : 'WITNESS ATTESTATION', pw/2, y, {align: 'center'});
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const witnessIntro = lang === 'es'
      ? 'Nosotros, los abajo firmantes, declaramos bajo pena de perjurio que:\n\n1. El Poderdante firmo este Poder Notarial en nuestra presencia, o reconocio ante nosotros que la firma en este documento es suya.\n\n2. El Poderdante parecio estar en su sano juicio y no actuaba bajo coaccion, fraude o influencia indebida.\n\n3. Somos mayores de 18 anos de edad.\n\n4. No somos nombrados como Apoderado en este documento.\n\n5. No estamos relacionados con el Poderdante por sangre, matrimonio o adopcion.\n\n6. No somos empleados del Apoderado nombrado en este documento.'
      : 'We, the undersigned, declare under penalty of perjury that:\n\n1. The Principal signed this Power of Attorney in our presence, or acknowledged to us that the signature on this document is theirs.\n\n2. The Principal appeared to be of sound mind and was not acting under duress, fraud, or undue influence.\n\n3. We are at least 18 years of age.\n\n4. We are not named as Agent in this document.\n\n5. We are not related to the Principal by blood, marriage, or adoption.\n\n6. We are not employees of the Agent named in this document.';
    y = wrap(witnessIntro, m, y, cw, 5);
    y += 15;

    // Witness 1
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'TESTIGO 1:' : 'WITNESS 1:', m, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.line(m, y, m + 100, y);
    y += 5;
    doc.text(lang === 'es' ? 'Firma' : 'Signature', m, y);
    y += 10;
    doc.line(m, y, m + 100, y);
    y += 5;
    doc.text(lang === 'es' ? 'Nombre Impreso' : 'Printed Name', m, y);
    y += 10;
    doc.line(m, y, m + 150, y);
    y += 5;
    doc.text(lang === 'es' ? 'Direccion' : 'Address', m, y);
    y += 10;
    doc.text((lang === 'es' ? 'Fecha: ' : 'Date: ') + '________________________', m, y);
    y += 20;

    // Witness 2
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'TESTIGO 2:' : 'WITNESS 2:', m, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.line(m, y, m + 100, y);
    y += 5;
    doc.text(lang === 'es' ? 'Firma' : 'Signature', m, y);
    y += 10;
    doc.line(m, y, m + 100, y);
    y += 5;
    doc.text(lang === 'es' ? 'Nombre Impreso' : 'Printed Name', m, y);
    y += 10;
    doc.line(m, y, m + 150, y);
    y += 5;
    doc.text(lang === 'es' ? 'Direccion' : 'Address', m, y);
    y += 10;
    doc.text((lang === 'es' ? 'Fecha: ' : 'Date: ') + '________________________', m, y);

    // ============================================
    // SOFTWARE PLATFORM DISCLOSURE & USER ACKNOWLEDGMENT
    // ============================================
    doc.addPage();
    y = 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'DIVULGACION DE PLATAFORMA DE SOFTWARE' : 'SOFTWARE PLATFORM DISCLOSURE', pw/2, y, {align: 'center'});
    y += 6;
    doc.text(lang === 'es' ? 'Y RECONOCIMIENTO DEL USUARIO' : '& USER ACKNOWLEDGMENT', pw/2, y, {align: 'center'});
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('(California)', pw/2, y, {align: 'center'});
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const platformIntro = lang === 'es'
      ? 'Este documento fue creado por el usuario a traves de un sistema automatizado de generacion de documentos de autoayuda proporcionado por Multiservicios 360.'
      : 'This document was created by the user through an automated self-help document generation system provided by Multiservicios 360.';
    y = wrap(platformIntro, m, y, cw, 5);
    y += 8;

    // NO LEGAL ADVICE Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(lang === 'es' ? 'SIN ASESORIA LEGAL / SIN PREPARACION DE DOCUMENTOS' : 'NO LEGAL ADVICE / NO DOCUMENT PREPARATION', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const noLegalAdvice = lang === 'es'
      ? 'Multiservicios 360 no es un bufete de abogados y no proporciona asesoramiento legal. Multiservicios 360 no prepara documentos legales en nombre de los usuarios. Multiservicios 360 proporciona acceso a herramientas de software que permiten a los usuarios crear sus propios documentos basados unicamente en la informacion y selecciones proporcionadas por el usuario.\n\nNo se crea ninguna relacion abogado-cliente mediante el uso de este sistema. Cualquier servicio de revision o consulta de abogados, si se ofrece, se proporciona por separado y solo a solicitud expresa del usuario.'
      : 'Multiservicios 360 is not a law firm and does not provide legal advice. Multiservicios 360 does not prepare legal documents on behalf of users. Multiservicios 360 provides access to software tools that allow users to create their own documents based solely on information and selections provided by the user.\n\nNo attorney-client relationship is created by the use of this system. Any attorney review or consultation services, if offered, are provided separately and only upon the user\'s express request.';
    y = wrap(noLegalAdvice, m, y, cw, 5);
    y += 8;

    // USER RESPONSIBILITY Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(lang === 'es' ? 'RESPONSABILIDAD DEL USUARIO' : 'USER RESPONSIBILITY', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const userResp = lang === 'es'
      ? 'El usuario es el unico responsable de la exactitud, integridad y efecto legal de este documento. Multiservicios 360 no revisa, valida ni aprueba el contenido de los documentos generados por el usuario a menos que se solicite expresamente una revision de abogado.'
      : 'The user is solely responsible for the accuracy, completeness, and legal effect of this document. Multiservicios 360 does not review, validate, or approve the substance of user-generated documents unless attorney review is expressly requested.';
    y = wrap(userResp, m, y, cw, 5);
    y += 8;

    // ELECTRONIC SIGNATURE INTENT Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(lang === 'es' ? 'INTENCION DE FIRMA ELECTRONICA' : 'ELECTRONIC SIGNATURE INTENT', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const eSignIntent = lang === 'es'
      ? 'Al firmar a continuacion, confirmo que estoy firmando este reconocimiento electronicamente y que mi firma electronica tiene la intencion de tener el mismo efecto legal que una firma manuscrita.'
      : 'By signing below, I confirm that I am signing this acknowledgment electronically and that my electronic signature is intended to have the same legal effect as a handwritten signature.';
    y = wrap(eSignIntent, m, y, cw, 5);
    y += 10;

    // USER ACKNOWLEDGMENT Section
    y = newPage(y, 80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(lang === 'es' ? 'RECONOCIMIENTO DEL USUARIO' : 'USER ACKNOWLEDGMENT', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const userAckIntro = lang === 'es'
      ? 'Al firmar a continuacion, reconozco y acepto que:'
      : 'By signing below, I acknowledge and agree that:';
    y = wrap(userAckIntro, m, y, cw, 5);
    y += 4;

    const ackPoints = lang === 'es'
      ? [
          'Yo mismo(a) cree este documento usando herramientas de software proporcionadas por Multiservicios 360;',
          'No se me proporciono asesoria legal ni servicios de preparacion de documentos;',
          'Soy responsable de toda la informacion contenida en este documento; y',
          'Entiendo que este documento puede tener consecuencias legales significativas.'
        ]
      : [
          'I created this document myself using software tools provided by Multiservicios 360;',
          'No legal advice or document preparation services were provided to me;',
          'I am responsible for all information contained in this document; and',
          'I understand that this document may have significant legal consequences.'
        ];
    
    ackPoints.forEach((point, idx) => {
      doc.text(`• ${point}`, m + 5, y);
      y += 7;
    });
    y += 10;

    // ELECTRONIC SIGNATURE - Typed signature from user input
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(lang === 'es' ? 'FIRMA ELECTRONICA:' : 'ELECTRONIC SIGNATURE:', m, y);
    y += 10;

    // Draw signature box
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.rect(m, y, 120, 15);

    // Print the typed signature inside the box
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.text(electronicSignature, m + 5, y + 10);
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(lang === 'es' ? 'Fecha: ' : 'Date: ', m, y);
    doc.text(executionDate, m + 20, y);

    // ============================================
    // FOOTER ON ALL PAGES
    // ============================================
    const pc = doc.internal.getNumberOfPages();
    const footer = 'Multi Servicios 360 | www.multiservicios360.net | 855.246.7274';
    for (let i = 1; i <= pc; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(footer, pw/2, 290, {align: 'center'});
      doc.text((lang === 'es' ? 'Pagina ' : 'Page ') + i + (lang === 'es' ? ' de ' : ' of ') + pc, pw - m, 290, {align: 'right'});
      doc.setTextColor(0);
    }

    // ============================================
    // FETCH AND APPEND OFFICIAL CA NOTARY FORM
    // ============================================
    try {
      const notaryResponse = await fetch('/api/notary-form');
      const notaryFormBytes = await notaryResponse.arrayBuffer();
      const notaryPdf = await PDFDocument.load(notaryFormBytes);
      const pdfDocFromJsPDF = await PDFDocument.load(doc.output('arraybuffer'));
      const [notaryPage] = await pdfDocFromJsPDF.copyPages(notaryPdf, [0]);
      pdfDocFromJsPDF.addPage(notaryPage);

      // Save the merged PDF
      const pdfBytes = await pdfDocFromJsPDF.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Limited_POA_${categoryName.replace(/[^a-zA-Z0-9]/g, '_')}_${(d.principal_name || 'Document').replace(/\s+/g, '_')}_${lang.toUpperCase()}.pdf`;
      link.click();
      saveToVault({ blob, matterId, clientName: matterData?.client_name, clientEmail: matterData?.client_email, documentType: 'limited-poa', language: lang, fileName: link.download });
      URL.revokeObjectURL(url);
    } catch (notaryError) {
      console.error('Error fetching notary form:', notaryError);
      // Fallback - just save the document without the notary form
      doc.save(`Limited_POA_${categoryName.replace(/[^a-zA-Z0-9]/g, '_')}_${(d.principal_name || 'Document').replace(/\s+/g, '_')}_${lang.toUpperCase()}.pdf`);
      alert(lang === 'es' 
        ? 'Documento generado. Por favor descargue el formulario notarial por separado.' 
        : 'Document generated. Please download notary form separately.');
    }

    // Mark as finalized (optional - save to database)
    if (!isFinalized) {
      setIsFinalized(true);
      // Optionally save execution date and signature to database
      try {
        await fetch(`/api/limited-poa/matters/${matterId}/finalize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            execution_date: executionDate,
            electronic_signature: electronicSignature,
            signed_at_utc: new Date().toISOString(),
            signed_at_local: new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
          })
        });
      } catch (e) {
        console.log('Could not save finalization data:', e);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #E5E7EB', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#6B7280' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!matterData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF' }}>
        <div style={{ textAlign: 'center', padding: '32px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#DC2626', marginBottom: '16px' }}>No data available</h2>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>Unable to load your document information.</p>
          <a href="/" style={{ color: '#2563EB', textDecoration: 'underline' }}>Return to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F9FF', padding: '32px 16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {/* Success Header */}
        <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', padding: '32px', textAlign: 'center', color: 'white' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckIcon />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px' }}>{t.title}</h1>
          <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>{t.subtitle}</p>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Order Number */}
          <div style={{ backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '16px', marginBottom: '24px', textAlign: 'center' }}>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 4px' }}>{t.orderNumber}</p>
            <p style={{ color: '#1F2937', fontWeight: '600', fontSize: '14px', margin: 0, fontFamily: 'monospace' }}>{matterId}</p>
          </div>

          <p style={{ color: '#4B5563', textAlign: 'center', marginBottom: '24px' }}>{t.thankYou}</p>

          {/* ============================================ */}
          {/* EXECUTION DATE INPUT - REQUIRED BEFORE DOWNLOAD */}
          {/* ============================================ */}
          <div style={{ 
            backgroundColor: '#FEF9C3', 
            border: '2px solid #F59E0B',
            borderRadius: '12px', 
            padding: '20px', 
            marginBottom: '24px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CalendarIcon />
              <label style={{ fontWeight: '600', color: '#92400E', fontSize: '16px' }}>
                {t.executionDateLabel}
              </label>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
              <input
                type="text"
                value={executionDate}
                onChange={handleDateChange}
                placeholder={t.executionDatePlaceholder}
                disabled={isFinalized}
                maxLength={10}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: '18px',
                  fontFamily: 'monospace',
                  border: executionDateError ? '2px solid #DC2626' : '2px solid #D1D5DB',
                  borderRadius: '8px',
                  backgroundColor: isFinalized ? '#F3F4F6' : 'white',
                  textAlign: 'center'
                }}
              />
              <button
                onClick={setTodayDate}
                disabled={isFinalized}
                style={{
                  padding: '12px 16px',
                  backgroundColor: isFinalized ? '#9CA3AF' : '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isFinalized ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}
              >
                {t.useTodayDate}
              </button>
            </div>
            
            {executionDateError && (
              <p style={{ color: '#DC2626', fontSize: '14px', margin: '8px 0 0', fontWeight: '500' }}>
                ⚠️ {executionDateError}
              </p>
            )}
            
            <p style={{ color: '#78716C', fontSize: '13px', margin: '8px 0 0' }}>
              {t.executionDateHelp}
            </p>
            
            {isFinalized && (
              <p style={{ color: '#059669', fontSize: '14px', margin: '8px 0 0', fontWeight: '500' }}>
                ✅ {language === 'es' ? 'Documento finalizado' : 'Document finalized'}
              </p>
            )}
          </div>

          {/* ============================================ */}
          {/* ELECTRONIC SIGNATURE INPUT */}
          {/* ============================================ */}
          <div style={{ 
            backgroundColor: '#EDE9FE', 
            border: '2px solid #8B5CF6', 
            borderRadius: '12px', 
            padding: '20px', 
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <PenIcon />
              <label style={{ fontSize: '16px', fontWeight: '600', color: '#5B21B6' }}>
                {t.signatureLabel} *
              </label>
            </div>
            <p style={{ fontSize: '12px', color: '#6D28D9', marginBottom: '12px', margin: '0 0 12px 0' }}>
              {t.signatureHelp}
            </p>
            <input
              type="text"
              value={electronicSignature}
              onChange={(e) => {
                setElectronicSignature(e.target.value);
                if (signatureError) setSignatureError('');
              }}
              placeholder={t.signaturePlaceholder}
              disabled={isFinalized}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '18px',
                fontFamily: 'cursive, serif',
                fontStyle: 'italic',
                border: signatureError ? '2px solid #DC2626' : '2px solid #D1D5DB',
                borderRadius: '8px',
                marginBottom: '12px',
                backgroundColor: isFinalized ? '#F3F4F6' : 'white',
                boxSizing: 'border-box'
              }}
            />
            
            {/* Acceptance checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: isFinalized ? 'not-allowed' : 'pointer' }}>
              <input
                type="checkbox"
                checked={signatureAccepted}
                onChange={(e) => {
                  setSignatureAccepted(e.target.checked);
                  if (signatureError) setSignatureError('');
                }}
                disabled={isFinalized}
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  marginTop: '2px',
                  accentColor: '#8B5CF6'
                }}
              />
              <span style={{ fontSize: '13px', color: '#5B21B6', lineHeight: '1.4' }}>
                {t.signatureAcceptLabel}
              </span>
            </label>
            
            {signatureError && (
              <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '8px', margin: '8px 0 0 0' }}>
                ⚠️ {signatureError}
              </p>
            )}
            
            {isFinalized && (
              <p style={{ color: '#059669', fontSize: '14px', marginTop: '12px', margin: '12px 0 0 0', fontWeight: '500' }}>
                ✅ {t.finalized}
              </p>
            )}
          </div>

          {/* Download Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <button
              onClick={() => generatePDF('es')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              <DownloadIcon /> {t.downloadSpanish}
            </button>
            <button
              onClick={() => generatePDF('en')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              <DownloadIcon /> {t.downloadEnglish}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              <PrintIcon /> {t.print}
            </button>
            <button
              onClick={() => {
                const subject = encodeURIComponent(language === 'es' ? 'Poder Notarial Limitado - Multi Servicios 360' : 'Limited Power of Attorney - Multi Servicios 360');
                const body = encodeURIComponent(language === 'es' 
                  ? 'Adjunto encontrara su Poder Notarial Limitado. Por favor descargue los documentos PDF desde su cuenta.\n\nMulti Servicios 360\n855.246.7274' 
                  : 'Please find attached your Limited Power of Attorney documents. Please download the PDF documents from your account.\n\nMulti Servicios 360\n855.246.7274');
                window.open(`mailto:?subject=${subject}&body=${body}`);
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              <EmailIcon /> {t.email}
            </button>
          </div>

          {/* Legal Note */}
          <div style={{ backgroundColor: '#FEF3C7', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px' }}>
            <p style={{ color: '#92400E', fontSize: '13px', margin: 0, textAlign: 'center' }}>{t.legalNote}</p>
          </div>

          {/* Next Steps */}
          <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ color: '#1F2937', fontWeight: '600', marginBottom: '12px' }}>{t.nextSteps}</h3>
            <ol style={{ margin: 0, paddingLeft: '20px', color: '#4B5563' }}>
              <li style={{ marginBottom: '8px' }}>{t.step1}</li>
              <li style={{ marginBottom: '8px' }}>{t.step2}</li>
              <li style={{ marginBottom: '8px' }}>{t.step3}</li>
              <li style={{ marginBottom: '8px' }}>{t.step4}</li>
              <li>{t.step5}</li>
            </ol>
          </div>

          {/* Contact */}
          <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
            <p style={{ color: '#6B7280', marginBottom: '4px' }}>{t.questions}</p>
            <p style={{ color: '#1F2937', fontWeight: '600' }}>{t.contact}</p>
          </div>

          {/* Back Home */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <a href="/" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '500' }}>{t.backHome}</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px', color: '#6B7280', fontSize: '12px' }}>
        Multi Servicios 360 | www.multiservicios360.net | 855.246.7274
      </div>
    </div>
  );
}

export default function LimitedPOASuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #E5E7EB', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#6B7280' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}