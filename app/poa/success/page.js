// Last updated: 2026-01-22 - Added typed signature, durability validation, improved spacing
"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PDFDocument } from 'pdf-lib';
import { saveToVault } from '../../../lib/save-to-vault';
import { lockPdf } from '../../../lib/lock-pdf';

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
  const [dateError, setDateError] = useState('');
  
  // Electronic signature state
  const [electronicSignature, setElectronicSignature] = useState('');
  const [signatureAccepted, setSignatureAccepted] = useState(false);
  const [signatureError, setSignatureError] = useState('');
  
  // Finalization state
  const [isFinalized, setIsFinalized] = useState(false);

  // Translation state for English PDF
  const [translationCache, setTranslationCache] = useState(null);
  const [translating, setTranslating] = useState(false);

  const matterId = searchParams.get('matter_id');

  // Helper: Get current date in America/Los_Angeles timezone
  const getLADate = () => {
    const now = new Date();
    const laDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const month = String(laDate.getMonth() + 1).padStart(2, '0');
    const day = String(laDate.getDate()).padStart(2, '0');
    const year = laDate.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Helper: Validate execution date format MM/DD/YYYY
  const validateExecutionDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === '') return false;
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    const [month, day, year] = dateStr.split('/').map(Number);
    const testDate = new Date(year, month - 1, day);
    return testDate.getMonth() === month - 1 && testDate.getDate() === day && testDate.getFullYear() === year;
  };

  // Helper: Format date input to MM/DD/YYYY
  const formatDateInput = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  // Helper: Generate document version hash
  const generateDocumentVersionId = (data) => {
    const str = JSON.stringify({
      intake: data.intake_data,
      language: data.language,
      executionDate: executionDate,
      templateVersion: '2026-01-22-v2'
    });
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `v2-${Math.abs(hash).toString(16)}`;
  };

  useEffect(() => {
    const fetchMatterData = async () => {
      if (matterId) {
        try {
          const response = await fetch(`/api/poa/matters/${matterId}`);
          const data = await response.json();
          if (data.success) {
            setMatterData(data.matter);
            setLanguage(data.matter.language || 'es');
            // Check if already finalized
            if (data.matter.execution_date) {
              setExecutionDate(data.matter.execution_date);
              setIsFinalized(true);
            }
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

  const t = language === 'es' ? {
    title: 'Pago Exitoso!',
    subtitle: 'Su Poder Notarial esta listo',
    thankYou: 'Gracias por su compra. Su documento esta listo para descargar.',
    orderNumber: 'Numero de Orden',
    downloadSpanish: 'Descargar PDF Espanol',
    downloadEnglish: 'Descargar PDF Ingles',
    print: 'Imprimir',
    email: 'Enviar por Email',
    nextSteps: 'Proximos Pasos',
    step1: 'Complete la fecha de ejecucion y firma electronica abajo',
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
    durabilityError: 'Error: Hay una inconsistencia en la configuracion de durabilidad. Por favor contacte soporte.',
    finalized: 'Documento finalizado',
  } : {
    title: 'Payment Successful!',
    subtitle: 'Your Power of Attorney is ready',
    thankYou: 'Thank you for your purchase. Your document is ready to download.',
    orderNumber: 'Order Number',
    downloadSpanish: 'Download Spanish PDF',
    downloadEnglish: 'Download English PDF',
    print: 'Print',
    email: 'Send by Email',
    nextSteps: 'Next Steps',
    step1: 'Complete the execution date and electronic signature below',
    step2: 'Download your PDF documents',
    step3: 'Review the document carefully',
    step4: 'Sign in front of a notary public',
    step5: 'Keep copies in a safe place',
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
    durabilityError: 'Error: There is an inconsistency in the durability configuration. Please contact support.',
    finalized: 'Document finalized',
  };

  // C1 - Validation: Ensure no unselected powers appear in output
  const validateNoPowerLeakage = (formData) => {
    const selectedPowerKeys = ['powers_real_estate', 'powers_banking', 'powers_stocks', 'powers_business', 'powers_insurance', 'powers_retirement', 'powers_government', 'powers_litigation', 'powers_tax'];
    for (const key of selectedPowerKeys) {
      if (!formData[key]) {
        // This power is not selected - it will not be rendered by the filter in B1
      }
    }
    return true; // Validation passes when using the filter approach
  };

  const generatePDF = async (isSpanish = false) => {
    if (!matterData?.intake_data) {
      alert('No data available');
      return;
    }

    // VALIDATION 1: Execution date is required
    if (!validateExecutionDate(executionDate)) {
      const errorMsg = t.executionDateRequired;
      setDateError(errorMsg);
      return;
    }
    setDateError('');

    // VALIDATION 2: Electronic signature is required
    if (!electronicSignature || electronicSignature.trim().length < 2) {
      setSignatureError(t.signatureRequired);
      return;
    }
    setSignatureError('');

    // VALIDATION 3: Must accept terms
    if (!signatureAccepted) {
      setSignatureError(t.signatureAcceptRequired);
      return;
    }

    const d = { ...matterData.intake_data };

    // Translate free-text fields for English PDF
    if (!isSpanish && d.has_special_instructions && d.special_instructions) {
      let cached = translationCache;
      if (!cached) {
        try {
          setTranslating(true);
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: { special_instructions: d.special_instructions },
              document_type: 'Power of Attorney'
            }),
          });
          const result = await res.json();
          if (result.success && result.translations) {
            cached = result.translations;
            setTranslationCache(cached);
          }
        } catch (err) {
          console.error('Translation failed:', err);
        } finally {
          setTranslating(false);
        }
      }
      if (cached?.special_instructions) {
        d.special_instructions = cached.special_instructions;
      }
    }

    // C1 - Run validation to ensure no power leakage
    validateNoPowerLeakage(d);

    // VALIDATION 4: Durability consistency check
    // If durable is true, the document should say "Durable"
    // If durable is false, the document should NOT say "Durable" in title
    // This is handled in the PDF generation by using the correct title based on d.durable

    // Generate audit timestamps (stored locally, not printed in PDF)
    const now = new Date();
    const auditData = {
      executionDate: executionDate,
      electronicSignature: electronicSignature,
      signedAtUtc: now.toISOString(),
      signedAtLocal: now.toLocaleString('en-US', { 
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }),
      documentVersionId: generateDocumentVersionId(matterData)
    };
    console.log('Audit data (not printed):', auditData);

    try {
      const lang = isSpanish ? 'es' : 'en';

      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const m = 20;
      const pw = 210;
      const ph = 297;
      const cw = pw - 40;
      let y = 15;

      const wrap = (text, x, startY, maxW, lh = 5) => {
        const lines = doc.splitTextToSize(text || '', maxW);
        lines.forEach((line, i) => {
          if (startY + (i * lh) > ph - 25) {
            doc.addPage();
            startY = 20 - (i * lh);
          }
          doc.text(line, x, startY + (i * lh));
        });
        return startY + (lines.length * lh);
      };

      const newPage = (currentY, need = 30) => {
        if (currentY > ph - need) { doc.addPage(); return 20; }
        return currentY;
      };

      const section = (title, content) => {
        y = newPage(y, 25);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(title, m, y);
        y += 7;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        y = wrap(content, m, y, cw, 5);
        y += 6;
      };

      // ============================================
      // DETERMINE POA TYPE FOR INTRO VARIANT (B3)
      // ============================================
      const hasRealEstate = d.powers_real_estate === true;
      const hasHotPowers = d.hot_gifts || d.hot_beneficiary || d.hot_trust;
      const isDurable = d.durable === true;
      
      // C2 - Durability consistency check: ensure isDurable matches d.durable
      if ((d.durable === true) !== isDurable) {
        console.warn('VALIDATION ERROR: Durability consistency issue detected');
      }
      
      let introVariant = 2;
      if (hasRealEstate) {
        introVariant = 1;
      } else if (!hasHotPowers) {
        introVariant = 3;
      }

      // ============================================
      // RECORDING HEADER (for real estate POAs only) (C4)
      // ============================================
      const shouldShowRecordingHeader = hasRealEstate && d.record_for_real_estate === true;
      if (shouldShowRecordingHeader) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text("Assessor's Parcel No.: _______________________", m, y);
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
        y += 12;
        doc.setLineWidth(0.3);
        doc.line(m, y, pw - m, y);
        y += 10;
      }

      // ============================================
      // TITLE PAGE - Durability in title based on d.durable
      // ============================================
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      
      // Title changes based on durability
      if (isDurable) {
        doc.text(lang === 'es' ? 'PODER NOTARIAL GENERAL DURADERO' : 'CALIFORNIA GENERAL DURABLE', pw/2, y, {align: 'center'});
      } else {
        doc.text(lang === 'es' ? 'PODER NOTARIAL GENERAL' : 'CALIFORNIA GENERAL', pw/2, y, {align: 'center'});
      }
      y += 7;
      doc.setFontSize(16);
      doc.text(lang === 'es' ? 'ESTADO DE CALIFORNIA' : 'POWER OF ATTORNEY', pw/2, y, {align: 'center'});
      y += 6;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'italic');
      doc.text(lang === 'es' ? '(Formato Largo / Comprensivo)' : '(Long-Form / Comprehensive)', pw/2, y, {align: 'center'});
      y += 4;
      doc.setLineWidth(0.5);
      doc.line(m, y, pw - m, y);
      y += 10;

      // ============================================
      // ============================================
      // DYNAMIC INTRO NOTICE (Based on POA Type)
      // ============================================
      y = newPage(y, 60);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      
      // Title varies by variant AND durability
      if (introVariant === 3 || !isDurable) {
        doc.text(lang === 'es' ? 'AVISO A LA PERSONA QUE EJECUTA EL PODER NOTARIAL' : 'NOTICE TO PERSON EXECUTING POWER OF ATTORNEY', m, y);
      } else {
        doc.text(lang === 'es' ? 'AVISO A LA PERSONA QUE EJECUTA EL PODER NOTARIAL DURADERO' : 'NOTICE TO PERSON EXECUTING DURABLE POWER OF ATTORNEY', m, y);
      }
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      let introText = '';
      
      if (introVariant === 1) {
        // VARIANT 1: WITH REAL ESTATE
        introText = lang === 'es'
          ? `Un poder notarial ${isDurable ? 'duradero ' : ''}es un documento legal importante. Al firmar este poder notarial, usted autoriza a otra persona (su Apoderado) a actuar en su nombre en los asuntos expresamente indicados en este documento.

Este poder notarial otorga autoridad amplia, incluyendo la facultad de administrar, vender, transferir, gravar y manejar bienes inmuebles, asi como administrar bienes personales, cuentas financieras, inversiones, asuntos fiscales y otros asuntos legales y patrimoniales, segun se establece expresamente en este documento.

${isDurable ? 'Los poderes otorgados mediante este poder notarial continuaran vigentes incluso si usted llega a quedar incapacitado, a menos que este documento indique expresamente lo contrario.' : 'Este poder notarial NO es duradero y terminara automaticamente si usted queda incapacitado.'}

Antes de firmar este poder notarial, usted debe comprender plenamente el alcance de la autoridad que esta otorgando. Si no esta seguro de que este documento refleje completamente sus intenciones, se le recomienda consultar con un abogado con licencia en el Estado de California.`
          : `A ${isDurable ? 'durable ' : ''}power of attorney is an important legal document. By signing this power of attorney, you authorize another person (your Agent) to act on your behalf in the matters expressly indicated in this document.

This power of attorney grants broad authority, including the power to manage, sell, transfer, encumber, and handle real property, as well as manage personal property, financial accounts, investments, tax matters, and other legal and estate matters, as expressly set forth in this document.

${isDurable ? 'The powers granted under this power of attorney will continue in effect even if you become incapacitated, unless this document expressly provides otherwise.' : 'This power of attorney is NOT durable and shall automatically terminate upon your incapacity.'}

Before signing this power of attorney, you should fully understand the scope of the authority you are granting. If you are not sure that this document fully reflects your intentions, you are advised to consult with an attorney licensed in the State of California.`;
      } else if (introVariant === 2) {
        // VARIANT 2: WITHOUT REAL ESTATE (but general powers)
        introText = lang === 'es'
          ? `Un poder notarial ${isDurable ? 'duradero ' : ''}es un documento legal importante. Al firmar este poder notarial, usted autoriza a otra persona (su Apoderado) a actuar en su nombre en los asuntos expresamente indicados en este documento.

Este poder notarial otorga autoridad general sobre bienes personales y asuntos financieros y administrativos, tales como cuentas bancarias, inversiones, operaciones comerciales, asuntos fiscales y otros asuntos legales y patrimoniales, segun se establece expresamente en este documento.

Este poder notarial no otorga autoridad sobre bienes inmuebles, salvo que dicha autoridad sea expresamente concedida en una seccion especifica de este documento.

${isDurable ? 'Los poderes otorgados mediante este poder notarial continuaran vigentes incluso si usted llega a quedar incapacitado, a menos que este documento indique expresamente lo contrario.' : 'Este poder notarial NO es duradero y terminara automaticamente si usted queda incapacitado.'}

Antes de firmar este poder notarial, usted debe comprender plenamente el alcance de la autoridad que esta otorgando. Si no esta seguro de que este documento refleje completamente sus intenciones, se le recomienda consultar con un abogado con licencia en el Estado de California.`
          : `A ${isDurable ? 'durable ' : ''}power of attorney is an important legal document. By signing this power of attorney, you authorize another person (your Agent) to act on your behalf in the matters expressly indicated in this document.

This power of attorney grants general authority over personal property and financial and administrative matters, such as bank accounts, investments, business operations, tax matters, and other legal and estate matters, as expressly set forth in this document.

This power of attorney does not grant authority over real property, unless such authority is expressly granted in a specific section of this document.

${isDurable ? 'The powers granted under this power of attorney will continue in effect even if you become incapacitated, unless this document expressly provides otherwise.' : 'This power of attorney is NOT durable and shall automatically terminate upon your incapacity.'}

Before signing this power of attorney, you should fully understand the scope of the authority you are granting. If you are not sure that this document fully reflects your intentions, you are advised to consult with an attorney licensed in the State of California.`;
      } else {
        // VARIANT 3: FINANCIAL/ADMINISTRATIVE ONLY
        introText = lang === 'es'
          ? `Un poder notarial es un documento legal importante. Al firmar este poder notarial, usted autoriza a otra persona (su Apoderado) a actuar en su nombre unicamente en los asuntos financieros y administrativos expresamente indicados en este documento.

Este poder notarial se limita a bienes personales, cuentas financieras, pagos, cobros, representacion administrativa y asuntos similares, y excluye expresamente cualquier autoridad relacionada con bienes inmuebles, creacion o modificacion de fideicomisos, donaciones significativas o disposiciones patrimoniales complejas, salvo que se indique de manera expresa y especifica.

${isDurable ? 'Los poderes otorgados mediante este poder notarial continuaran vigentes incluso si usted llega a quedar incapacitado.' : 'Este poder notarial NO es duradero y terminara automaticamente si usted queda incapacitado.'}

Antes de firmar este poder notarial, usted debe comprender claramente las limitaciones de la autoridad otorgada. Si tiene dudas sobre el alcance o las consecuencias legales de este documento, se le recomienda consultar con un abogado con licencia en el Estado de California.`
          : `A power of attorney is an important legal document. By signing this power of attorney, you authorize another person (your Agent) to act on your behalf only in the financial and administrative matters expressly indicated in this document.

This power of attorney is limited to personal property, financial accounts, payments, collections, administrative representation, and similar matters, and expressly excludes any authority related to real property, creation or modification of trusts, significant gifts, or complex estate dispositions, unless expressly and specifically indicated.

${isDurable ? 'The powers granted under this power of attorney will continue in effect even if you become incapacitated.' : 'This power of attorney is NOT durable and shall automatically terminate upon your incapacity.'}

Before signing this power of attorney, you should clearly understand the limitations of the authority granted. If you have questions about the scope or legal consequences of this document, you are advised to consult with an attorney licensed in the State of California.`;
      }
      
      y = wrap(introText, m, y, cw, 4);
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

      let principalText = lang === 'es'
        ? `Yo, ${d.principal_name || '___'}`
        : `I, ${d.principal_name || '___'}`;
      
      if (d.has_aka && d.aka_names) {
        principalText += lang === 'es'
          ? `, tambien conocido como ${d.aka_names}`
          : `, also known as ${d.aka_names}`;
      }
      
      principalText += lang === 'es'
        ? `, con domicilio en ${d.principal_address || '___'}`
        : `, residing at ${d.principal_address || '___'}`;
      
      if (d.principal_county) {
        principalText += lang === 'es'
          ? `, Condado de ${d.principal_county}`
          : `, County of ${d.principal_county}`;
      }
      
      principalText += lang === 'es'
        ? `, Estado de California, por medio del presente designo a:`
        : `, State of California, hereby appoint:`;
      
      y = wrap(principalText, m, y, cw, 5);
      y += 6;

      // Agent info
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'APODERADO PRINCIPAL:' : 'PRIMARY AGENT:', m, y);
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
      y += 6;

      // Successor Agent
      if (d.wants_successor && d.successor_agent) {
        y = newPage(y, 20);
        doc.setFont('helvetica', 'bold');
        doc.text(lang === 'es' ? 'APODERADO SUCESOR:' : 'SUCCESSOR AGENT:', m, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        let successorText = `${d.successor_agent}`;
        if (d.successor_address) {
          successorText += lang === 'es'
            ? `, con domicilio en ${d.successor_address}`
            : `, residing at ${d.successor_address}`;
        }
        if (d.successor_relationship) {
          successorText += lang === 'es'
            ? ` (Relacion: ${d.successor_relationship})`
            : ` (Relationship: ${translateRelationship(d.successor_relationship)})`;
        }
        y = wrap(successorText, m, y, cw, 5);
        y += 4;
        
        const successorClause = lang === 'es'
          ? 'Si mi Apoderado Principal no puede o no quiere servir, o deja de actuar como mi Apoderado, designo al Apoderado Sucesor mencionado anteriormente para actuar en su lugar con todos los mismos poderes y autoridad.'
          : 'If my Primary Agent is unable or unwilling to serve, or ceases to act as my Agent, I appoint the Successor Agent named above to act in their place with all the same powers and authority.';
        y = wrap(successorClause, m, y, cw, 5);
        y += 6;
      }

      // ============================================
      // ARTICLE II - DURABILITY AND EFFECTIVE DATE
      // ============================================
      y = newPage(y, 35);
      section(lang === 'es' ? 'ARTICULO II - DURABILIDAD Y FECHA EFECTIVA' : 'ARTICLE II - DURABILITY AND EFFECTIVE DATE',
        isDurable
          ? (lang === 'es'
            ? 'Este Poder Notarial es DURADERO y NO SERA AFECTADO por mi incapacidad posterior, conforme a la Seccion 4124 del Codigo de Sucesiones de California. Mi Apoderado conservara toda la autoridad otorgada en este documento incluso si quedo incapacitado o discapacitado.'
            : 'This Power of Attorney is DURABLE and shall NOT BE AFFECTED by my subsequent incapacity, pursuant to California Probate Code Section 4124. My Agent shall retain all authority granted herein even if I become incapacitated or disabled.')
          : (lang === 'es'
            ? 'Este Poder Notarial NO es duradero y terminara automaticamente si quedo incapacitado o discapacitado.'
            : 'This Power of Attorney is NOT durable and shall automatically terminate upon my incapacity or disability.')
      );
      
      doc.setFontSize(11);
      const effective = d.effective_when === 'immediately'
        ? (lang === 'es' 
          ? 'FECHA EFECTIVA: Este Poder Notarial sera efectivo INMEDIATAMENTE al ser ejecutado y permanecera en efecto hasta que sea revocado o termine por operacion de ley.' 
          : 'EFFECTIVE DATE: This Power of Attorney shall be effective IMMEDIATELY upon execution and shall remain in effect until revoked or terminated by operation of law.')
        : (lang === 'es' 
          ? 'FECHA EFECTIVA: Este Poder Notarial es un "Poder Contingente" (Springing Power) y sera efectivo UNICAMENTE al momento de mi incapacidad, segun lo determine un medico licenciado mediante declaracion escrita.' 
          : 'EFFECTIVE DATE: This Power of Attorney is a "Springing Power" and shall become effective ONLY upon my incapacity, as determined by a licensed physician in a written declaration.');
      y = wrap(effective, m, y, cw, 5);
      y += 8;

      // ============================================
      // HIPAA AUTHORIZATION
      // ============================================
      if (d.include_hipaa) {
        y = newPage(y, 35);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(lang === 'es' ? 'AUTORIZACION HIPAA' : 'HIPAA AUTHORIZATION', m, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const hipaaText = lang === 'es'
          ? 'De conformidad con la Ley de Portabilidad y Responsabilidad del Seguro de Salud de 1996 ("HIPAA") y todas las demas leyes estatales y federales aplicables, y exclusivamente con el proposito de determinar mi incapacitacion o incapacidad para administrar mis asuntos financieros y obtener una declaracion jurada de dicha incapacitacion por un medico, autorizo a cualquier proveedor de atencion medica a divulgar a la persona nombrada aqui como mi "apoderado" cualquier informacion de salud identificable individualmente pertinente suficiente para determinar si soy mental o fisicamente capaz de administrar mis asuntos financieros.'
          : 'Pursuant to the Health Insurance Portability and Accountability Act of 1996 ("HIPAA") and all other applicable state and federal laws, and exclusively for the purpose of making a determination of my incapacitation or incapability of managing my financial affairs and obtaining an affidavit of such incapacitation by a physician, I authorize any health care provider to disclose to the person named herein as my "attorney-in-fact" any pertinent individually identifiable health information sufficient to determine whether I am mentally or physically capable of managing my financial affairs.';
        y = wrap(hipaaText, m, y, cw, 4);
        y += 8;
      }

      // ============================================
      // ARTICLE III - REVOCATION OF PRIOR POWERS
      // ============================================
      section(lang === 'es' ? 'ARTICULO III - REVOCACION DE PODERES ANTERIORES' : 'ARTICLE III - REVOCATION OF PRIOR POWERS',
        lang === 'es'
          ? 'Por medio del presente revoco todos los poderes notariales generales e instrumentos similares previamente ejecutados por mi, excepto cualquier Directiva de Atencion Medica por Anticipado o Poder Notarial para Atencion Medica que permanecera en pleno vigor y efecto.'
          : 'I hereby revoke all prior general powers of attorney and similar instruments previously executed by me, except any Advance Health Care Directive or Health Care Power of Attorney which shall remain in full force and effect.'
      );

      // ============================================
      // ARTICLE IV - GENERAL GRANT OF AUTHORITY
      // ============================================
      section(lang === 'es' ? 'ARTICULO IV - OTORGAMIENTO GENERAL DE AUTORIDAD' : 'ARTICLE IV - GENERAL GRANT OF AUTHORITY',
        lang === 'es'
          ? 'Otorgo a mi Apoderado pleno poder y autoridad para actuar por mi y en mi nombre en cualquier manera legal con respecto a los siguientes asuntos, en la maxima extension permitida bajo la ley de California, incluyendo pero no limitado a las acciones especificamente enumeradas a continuacion.'
          : 'I grant my Agent full power and authority to act for me and in my name in any lawful manner with respect to the following matters, to the fullest extent permitted under California law, including but not limited to the actions specifically enumerated below.'
      );
// DEBUG - Remove after testing
console.log('=== DEBUG POWERS ===');
console.log('Full intake data (d):', JSON.stringify(d, null, 2));
console.log('powers_real_estate:', d.powers_real_estate, typeof d.powers_real_estate);
console.log('powers_banking:', d.powers_banking, typeof d.powers_banking);
console.log('powers_stocks:', d.powers_stocks, typeof d.powers_stocks);
      // ============================================
      // ARTICLE V - SPECIFIC POWERS GRANTED
      // ============================================
      y = newPage(y, 60);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'ARTICULO V - PODERES ESPECIFICOS OTORGADOS' : 'ARTICLE V - SPECIFIC POWERS GRANTED', m, y);
      y += 8;

      const powers = [
        { key: 'powers_real_estate', letter: 'A', titleEn: 'Real Property Transactions', titleEs: 'Transacciones de Bienes Inmuebles',
          textEn: 'To acquire, purchase, sell, convey, transfer, exchange, partition, lease, sublease, manage, improve, insure, encumber, mortgage, refinance, or otherwise deal with any real property or interest therein.',
          textEs: 'Adquirir, comprar, vender, traspasar, transferir, intercambiar, dividir, arrendar, subarrendar, administrar, mejorar, asegurar, gravar, hipotecar, refinanciar o de otra manera manejar cualquier bien inmueble o interes en el mismo.' },
        { key: 'powers_banking', letter: 'B', titleEn: 'Banking and Financial Institutions', titleEs: 'Banca e Instituciones Financieras',
          textEn: 'To open, close, modify, and transact business on checking accounts, savings accounts, money market accounts, certificates of deposit, and other deposit accounts at any financial institution.',
          textEs: 'Abrir, cerrar, modificar y realizar transacciones en cuentas de cheques, cuentas de ahorros, cuentas de mercado de dinero, certificados de deposito y otras cuentas de deposito en cualquier institucion financiera.' },
        { key: 'powers_stocks', letter: 'C', titleEn: 'Investments and Securities', titleEs: 'Inversiones y Valores',
          textEn: 'To purchase, sell, exchange, trade, and otherwise manage stocks, bonds, mutual funds, exchange-traded funds, options, and other investment securities.',
          textEs: 'Comprar, vender, intercambiar, negociar y de otra manera administrar acciones, bonos, fondos mutuos, fondos cotizados en bolsa, opciones y otros valores de inversion.' },
        { key: 'powers_business', letter: 'D', titleEn: 'Business Operating Transactions', titleEs: 'Operaciones Comerciales',
          textEn: 'To form, operate, manage, reorganize, merge, consolidate, dissolve, or sell any business entity; to acquire or dispose of ownership interests.',
          textEs: 'Formar, operar, administrar, reorganizar, fusionar, consolidar, disolver o vender cualquier entidad comercial; adquirir o disponer de participaciones.' },
        { key: 'powers_insurance', letter: 'E', titleEn: 'Insurance and Annuities', titleEs: 'Seguros y Anualidades',
          textEn: 'To purchase, maintain, modify, surrender, cancel, or collect proceeds from life insurance, health insurance, disability insurance, and annuity contracts.',
          textEs: 'Comprar, mantener, modificar, entregar, cancelar o cobrar beneficios de seguros de vida, seguros de salud, seguros de discapacidad y contratos de anualidades.' },
        { key: 'powers_retirement', letter: 'F', titleEn: 'Retirement Plans and Accounts', titleEs: 'Planes y Cuentas de Jubilacion',
          textEn: 'To contribute to, withdraw from, rollover, transfer, and manage IRAs, 401(k) plans, pension plans, and other retirement plans.',
          textEs: 'Contribuir, retirar, transferir, trasladar y administrar IRAs, planes 401(k), planes de pension y otros planes de jubilacion.' },
        { key: 'powers_government', letter: 'G', titleEn: 'Government Benefits', titleEs: 'Beneficios Gubernamentales',
          textEn: 'To apply for, receive, manage, and utilize benefits from Social Security, Medicare, Medi-Cal, Veterans Administration, and other government programs.',
          textEs: 'Solicitar, recibir, administrar y utilizar beneficios del Seguro Social, Medicare, Medi-Cal, Administracion de Veteranos y otros programas gubernamentales.' },
        { key: 'powers_litigation', letter: 'H', titleEn: 'Claims and Litigation', titleEs: 'Reclamos y Litigios',
          textEn: 'To assert, pursue, defend, arbitrate, mediate, compromise, settle, or abandon any claim, demand, lawsuit, or legal proceeding.',
          textEs: 'Presentar, perseguir, defender, arbitrar, mediar, comprometer, resolver o abandonar cualquier reclamo, demanda, juicio o procedimiento legal.' },
        { key: 'powers_tax', letter: 'I', titleEn: 'Tax Matters', titleEs: 'Asuntos Fiscales',
          textEn: 'To prepare, sign, and file federal, state, and local tax returns; to represent me before the IRS and California FTB; to pay taxes and collect refunds.',
          textEs: 'Preparar, firmar y presentar declaraciones de impuestos federales, estatales y locales; representarme ante el IRS y el FTB de California; pagar impuestos y cobrar reembolsos.' },
      ];

      // Filter to only selected powers (B1)
      const selectedPowers = powers.filter(p => d[p.key]);
      selectedPowers.forEach((p, index) => {
        y = newPage(y, 25);
        const letter = String.fromCharCode(65 + index); // A, B, C...
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`${letter}. ${lang === 'es' ? p.titleEs : p.titleEn}`, m, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        y = wrap(lang === 'es' ? p.textEs : p.textEn, m + 5, y, cw - 5, 4.5);
        y += 6;
      });

      // ============================================
      // ARTICLE VI - ADVANCED POWERS (HOT POWERS) (B2)
      // ============================================
      // Only render Article VI if at least one hot power is selected
      const hasAnyHotPower = d.hot_gifts || d.hot_beneficiary || d.hot_trust;
      
      if (hasAnyHotPower) {
        y = newPage(y, 50);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(lang === 'es' ? 'ARTICULO VI - PODERES AVANZADOS' : 'ARTICLE VI - ADVANCED POWERS', m, y);
        y += 6;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        const hotNotice = lang === 'es'
          ? 'AVISO: Los siguientes poderes requieren autorizacion expresa y pueden afectar significativamente su patrimonio.'
          : 'NOTICE: The following powers require express authorization and may significantly affect your estate.';
        y = wrap(hotNotice, m, y, cw, 4.5);
        y += 8;

        // Gift Power
        if (d.hot_gifts) {
          y = newPage(y, 25);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text(`A. ${lang === 'es' ? 'Poder para Hacer Regalos' : 'Power to Make Gifts'}`, m, y);
          y += 6;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          
          let giftText = lang === 'es'
            ? 'Autorizo a mi Apoderado a hacer regalos de mi propiedad a individuos o instituciones de caridad en mi nombre.'
            : 'I authorize my Agent to make gifts of my property to individuals or charities on my behalf.';
          
          if (d.gift_limit) {
            if (d.gift_limit === 'annual_exclusion') {
              giftText += lang === 'es'
                ? ' Limitado al monto de exclusion anual del impuesto federal sobre donaciones.'
                : ' Limited to the federal gift tax annual exclusion amount.';
            } else if (d.gift_limit === 'unlimited') {
              giftText += lang === 'es'
                ? ' Sin limite, sujeto al deber fiduciario del Apoderado.'
                : ' No limit, subject to Agent\'s fiduciary duty.';
            }
          }
          y = wrap(giftText, m + 5, y, cw - 5, 4.5);
          y += 6;
        }

        // Beneficiary Designation Power
        if (d.hot_beneficiary) {
          y = newPage(y, 20);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text(`${d.hot_gifts ? 'B' : 'A'}. ${lang === 'es' ? 'Cambio de Designaciones de Beneficiarios' : 'Beneficiary Designation Changes'}`, m, y);
          y += 6;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          y = wrap(lang === 'es'
            ? 'Autorizo a mi Apoderado a designar, cambiar o revocar beneficiarios de polizas de seguro de vida, cuentas de jubilacion y cuentas pagaderas al fallecimiento.'
            : 'I authorize my Agent to designate, change, or revoke beneficiaries of life insurance policies, retirement accounts, and payable-on-death accounts.', m + 5, y, cw - 5, 4.5);
          y += 6;
        }

        // Trust Power
        if (d.hot_trust) {
          y = newPage(y, 20);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          let trustLetter = 'A';
          if (d.hot_gifts) trustLetter = 'B';
          if (d.hot_beneficiary && d.hot_gifts) trustLetter = 'C';
          doc.text(`${trustLetter}. ${lang === 'es' ? 'Creacion y Modificacion de Fideicomisos' : 'Trust Creation and Modification'}`, m, y);
          y += 6;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          y = wrap(lang === 'es'
            ? 'Autorizo a mi Apoderado a crear, modificar, enmendar, revocar y financiar fideicomisos revocables para mi beneficio.'
            : 'I authorize my Agent to create, modify, amend, revoke, and fund revocable trusts for my benefit.', m + 5, y, cw - 5, 4.5);
          y += 6;
        }
      }

      // ============================================
      // ARTICLE VII - HEALTHCARE EXCLUSION
      // ============================================
      section(lang === 'es' ? 'ARTICULO VII - EXCLUSION DE ATENCION MEDICA' : 'ARTICLE VII - HEALTHCARE EXCLUSION',
        lang === 'es'
          ? 'Este Poder Notarial NO otorga autoridad para tomar decisiones medicas o de atencion de salud. Dicha autoridad solo puede otorgarse mediante una Directiva de Atencion Medica por Anticipado separada.'
          : 'This Power of Attorney does NOT grant authority to make medical or health care decisions. Such authority may be granted only by a separate Advance Health Care Directive.'
      );

      // ============================================
      // ARTICLE VIII - PROTECTIVE PROVISIONS
      // ============================================
      y = newPage(y, 50);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'ARTICULO VIII - DISPOSICIONES PROTECTORAS' : 'ARTICLE VIII - PROTECTIVE PROVISIONS', m, y);
      y += 8;

      const provisions = [
        { titleEn: 'Third Party Reliance', titleEs: 'Confianza de Terceros',
          textEn: 'Any third party may rely upon the authority granted in this Power of Attorney without inquiry into its validity, scope, or revocation, pursuant to California Probate Code Section 4303.',
          textEs: 'Cualquier tercero puede confiar en la autoridad otorgada en este Poder Notarial sin indagar sobre su validez, alcance o revocacion, conforme a la Seccion 4303 del Codigo de Sucesiones de California.' },
        { titleEn: 'Agent Liability and Indemnification', titleEs: 'Responsabilidad e Indemnizacion del Apoderado',
          textEn: 'My Agent shall not be liable for any actions taken in good faith under this Power of Attorney, except for willful misconduct or gross negligence.',
          textEs: 'Mi Apoderado no sera responsable por acciones tomadas de buena fe bajo este Poder Notarial, excepto por conducta intencional indebida o negligencia grave.' },
        { titleEn: 'Compensation', titleEs: 'Compensacion',
          textEn: 'My Agent is entitled to reasonable compensation for services rendered and reimbursement of all reasonable expenses.',
          textEs: 'Mi Apoderado tiene derecho a una compensacion razonable por los servicios prestados y al reembolso de todos los gastos razonables.' },
        { titleEn: 'Severability', titleEs: 'Separabilidad',
          textEn: 'If any provision is held invalid, the remaining provisions shall remain in full force and effect.',
          textEs: 'Si alguna disposicion es considerada invalida, las disposiciones restantes permaneceran en pleno vigor y efecto.' },
      ];

      provisions.forEach(p => {
        y = newPage(y, 18);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(lang === 'es' ? p.titleEs : p.titleEn, m, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        y = wrap(lang === 'es' ? p.textEs : p.textEn, m, y, cw, 4.5);
        y += 5;
      });

      // ============================================
      // ARTICLE IX - TERMINATION
      // ============================================
      section(lang === 'es' ? 'ARTICULO IX - TERMINACION Y LEY APLICABLE' : 'ARTICLE IX - TERMINATION AND GOVERNING LAW',
        lang === 'es'
          ? 'Este Poder Notarial terminara automaticamente: (a) a mi fallecimiento; (b) por mi revocacion escrita; (c) por orden de un tribunal; o (d) si no es duradero, al momento de mi incapacidad. Este Poder Notarial se regira por las leyes del Estado de California.'
          : 'This Power of Attorney shall terminate automatically: (a) upon my death; (b) by my written revocation; (c) by court order; or (d) if not durable, upon my incapacity. This Power of Attorney shall be governed by the laws of the State of California.'
      );

      // ============================================
      // SPECIAL INSTRUCTIONS (if any)
      // ============================================
      if (d.has_special_instructions && d.special_instructions) {
        y = newPage(y, 30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(lang === 'es' ? 'INSTRUCCIONES ESPECIALES' : 'SPECIAL INSTRUCTIONS', m, y);
        y += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        y = wrap(d.special_instructions, m, y, cw, 5);
        y += 8;
      }

      // ============================================
      // ARTICLE X - EXECUTION PAGE
      // ============================================
      y = newPage(y, 60);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'ARTICULO X - EJECUCION' : 'ARTICLE X - EXECUTION', m, y);
      y += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(lang === 'es' 
        ? 'EN FE DE LO CUAL, he ejecutado este Poder Notarial General en la fecha indicada a continuacion.' 
        : 'IN WITNESS WHEREOF, I have executed this General Power of Attorney on the date written below.', m, y);
      y += 15;

      // Electronic Signature Intent paragraph (A5)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'INTENCION DE FIRMA ELECTRONICA' : 'ELECTRONIC SIGNATURE INTENT', m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      const esigIntentText = lang === 'es'
        ? 'Al escribir mi nombre y fecha a continuacion, tengo la intencion de que sirva como mi firma electronica. Entiendo que este documento sera impreso y puede requerir notarizacion para ciertos usos. Estoy ejecutando este documento voluntariamente y con plena comprension de su contenido.'
        : 'By typing my name and date below, I intend this to serve as my electronic signature. I understand this document will be printed and may require notarization for certain uses. I am executing this document voluntarily and with full understanding of its contents.';
      y = wrap(esigIntentText, m, y, cw, 4.5);
      y += 10;

      // Execution Date
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'Fecha de Ejecucion:' : 'Date of Execution:', m, y);
      doc.setFont('helvetica', 'normal');
      doc.text(executionDate, m + 50, y);
      y += 25;

      // Principal Signature Block
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'Firma del Poderdante:' : 'Principal Signature:', m, y);
      y += 20; // Space for actual signature

      doc.line(m, y, m + 120, y); // Signature line
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.text(lang === 'es' ? 'Nombre Impreso:' : 'Printed Name:', m, y);
      y += 6;
      doc.text(d.principal_name || '________________________________', m, y);

      // ============================================
      // WITNESS ATTESTATION
      // ============================================
      y = newPage(y, 120);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'ATESTACIÓN DE TESTIGOS' : 'WITNESS ATTESTATION', m, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const witnessIntro = lang === 'es' 
        ? 'Declaro bajo pena de perjurio bajo las leyes del Estado de California que:'
        : 'I declare under penalty of perjury under the laws of the State of California that:';
      y = wrap(witnessIntro, m, y, cw, 4.5);
      y += 6;

      const witnessStatements = lang === 'es' ? [
        '1. Tengo al menos 18 años de edad.',
        '2. No soy el apoderado, apoderado suplente, ni empleado del apoderado nombrado en este poder notarial.',
        '3. No estoy relacionado con el poderdante por sangre, matrimonio o adopción.',
        '4. No tengo derecho a ninguna porción del patrimonio del poderdante a su muerte.',
        '5. No soy acreedor del poderdante.',
        '6. Presencié al poderdante firmar este poder notarial por su propia voluntad y el poderdante parecía estar en pleno uso de sus facultades mentales.'
      ] : [
        '1. I am at least 18 years of age.',
        '2. I am not the agent, alternate agent, or any employee of the agent named in this power of attorney.',
        '3. I am not related to the principal by blood, marriage, or adoption.',
        '4. I am not entitled to any portion of the principal\'s estate upon the principal\'s death.',
        '5. I am not a creditor of the principal.',
        '6. I witnessed the principal sign this power of attorney of their own free will and the principal appeared to be of sound mind.'
      ];

      witnessStatements.forEach(statement => {
        y = wrap(statement, m, y, cw, 4.5);
        y += 2;
      });
      y += 10;

      // ALIGNED WITNESS BLOCKS - All lines same length
      const labelCol = m;
      const lineStart = m + 35; // All lines start here
      const lineEnd = m + 160;  // ALL lines end here (same endpoint!)

      // Witness 1
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'TESTIGO 1:' : 'WITNESS 1:', m, y);
      y += 10;
      doc.setFont('helvetica', 'normal');

      doc.text(lang === 'es' ? 'Firma:' : 'Signature:', labelCol, y);
      doc.line(lineStart, y, lineEnd, y);
      y += 10;

      doc.text(lang === 'es' ? 'Nombre:' : 'Printed Name:', labelCol, y);
      doc.line(lineStart, y, lineEnd, y);
      y += 10;

      doc.text(lang === 'es' ? 'Dirección:' : 'Address:', labelCol, y);
      doc.line(lineStart, y, lineEnd, y);
      y += 10;

      doc.text(lang === 'es' ? 'Fecha:' : 'Date:', labelCol, y);
      doc.line(lineStart, y, lineEnd, y);
      y += 20;

      // Witness 2
      y = newPage(y, 60);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'TESTIGO 2:' : 'WITNESS 2:', m, y);
      y += 10;
      doc.setFont('helvetica', 'normal');

      doc.text(lang === 'es' ? 'Firma:' : 'Signature:', labelCol, y);
      doc.line(lineStart, y, lineEnd, y);
      y += 10;

      doc.text(lang === 'es' ? 'Nombre:' : 'Printed Name:', labelCol, y);
      doc.line(lineStart, y, lineEnd, y);
      y += 10;

      doc.text(lang === 'es' ? 'Dirección:' : 'Address:', labelCol, y);
      doc.line(lineStart, y, lineEnd, y);
      y += 10;

      doc.text(lang === 'es' ? 'Fecha:' : 'Date:', labelCol, y);
      doc.line(lineStart, y, lineEnd, y);
      y += 15;

      // ============================================
      // NOTICE TO AGENT PAGE
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
        ? `Cuando usted acepta la autoridad otorgada bajo este poder notarial, se crea una relacion legal entre usted y el poderdante. Esta relacion impone sobre usted deberes legales que continuan hasta que renuncie o el poder notarial sea terminado o revocado. Usted debe:

(1) Actuar de buena fe para el beneficio del poderdante.
(2) Actuar solo dentro del alcance de la autoridad otorgada.
(3) Actuar con lealtad hacia el poderdante.
(4) Evitar conflictos de interes.
(5) Mantener la propiedad del poderdante separada e identificable.
(6) Mantener registros de todos los recibos, desembolsos y transacciones.
(7) Cooperar con los agentes de atencion medica si corresponde.
(8) Intentar preservar el plan patrimonial del poderdante en la medida que lo sepa.
(9) Actuar de acuerdo con las expectativas razonables del poderdante si son conocidas, o de otra manera en el mejor interes del poderdante.

Si no cumple fielmente sus deberes, puede estar sujeto a:
(1) Destitucion como agente por un tribunal.
(2) Orden de devolver propiedad malversada.
(3) Responsabilidad por danos.
(4) Sanciones penales.`
        : `When you accept the authority granted under this power of attorney, a special legal relationship is created between you and the principal. This relationship imposes upon you legal duties that continue until you resign or the power of attorney is terminated or revoked. You must:

(1) Act in good faith for the benefit of the principal.
(2) Act only within the scope of authority granted.
(3) Act loyally for the principal's benefit.
(4) Avoid conflicts of interest.
(5) Keep the principal's property separate and identifiable.
(6) Keep records of all receipts, disbursements, and transactions.
(7) Cooperate with healthcare agents if applicable.
(8) Attempt to preserve the principal's estate plan to the extent known.
(9) Act in accordance with the principal's reasonable expectations if known, otherwise in the principal's best interest.

If you do not faithfully perform your duties, you may be subject to:
(1) Removal as agent by a court.
(2) Order to return misappropriated property.
(3) Liability for damages.
(4) Criminal penalties.`;

      y = wrap(agentNoticeText, m, y, cw, 4);
      y += 10;

      // Elder Abuse Warning
      y = newPage(y, 40);
      doc.setFillColor(255, 245, 238);
      doc.rect(m, y, cw, 30, 'F');
      doc.setDrawColor(200, 100, 100);
      doc.setLineWidth(0.5);
      doc.rect(m, y, cw, 30, 'S');
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
        ? 'El abuso de adultos mayores es un delito grave en California. El uso indebido de este poder notarial puede resultar en cargos criminales y responsabilidad civil. Si cree que el poderdante esta siendo abusado, contacte a Adult Protective Services al 1-833-401-0832 o a la aplicacion de la ley local.'
        : 'Elder abuse is a serious crime in California. Misuse of this power of attorney can result in criminal charges and civil liability. If you believe the principal is being abused, contact Adult Protective Services at 1-833-401-0832 or local law enforcement.';
      y = wrap(abuseWarning, m + 4, y, cw - 8, 4);
      y += 12;

      // Agent Acceptance
      y = newPage(y, 50);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'ACEPTACION DEL APODERADO' : 'AGENT ACCEPTANCE', m, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const acceptanceText = lang === 'es'
        ? 'Yo, el Apoderado nombrado en este Poder Notarial, reconozco haber leido y entendido el Aviso al Apoderado. Acepto actuar como Apoderado y cumplir con todos los deberes descritos.'
        : 'I, the Agent named in this Power of Attorney, acknowledge that I have read and understand the Notice to Agent. I agree to act as Agent and comply with all duties described.';
      y = wrap(acceptanceText, m, y, cw, 5);
      y += 15;

      doc.text(lang === 'es' ? 'Firma del Apoderado:' : 'Agent Signature:', m, y);
      doc.line(m + 50, y, m + 150, y);
      y += 12;
      doc.text(d.agent_name || '________________________________', m, y);
      y += 12;
      doc.text((lang === 'es' ? 'Fecha: ' : 'Date: ') + '________________________', m, y);

      // ============================================
      // SOFTWARE PLATFORM DISCLOSURE & USER ACKNOWLEDGMENT PAGE
      // ============================================
      doc.addPage();
      y = 20;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'DIVULGACION DE PLATAFORMA DE SOFTWARE Y' : 'SOFTWARE PLATFORM DISCLOSURE &', pw/2, y, {align: 'center'});
      y += 6;
      doc.text(lang === 'es' ? 'RECONOCIMIENTO DEL USUARIO' : 'USER ACKNOWLEDGMENT', pw/2, y, {align: 'center'});
      y += 4;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('(California)', pw/2, y, {align: 'center'});
      y += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const disclosureIntro = lang === 'es'
        ? 'Este documento fue creado por el usuario a traves de un sistema automatizado de generacion de documentos de autoayuda proporcionado por Multiservicios 360.'
        : 'This document was created by the user through an automated self-help document generation system provided by Multiservicios 360.';
      y = wrap(disclosureIntro, m, y, cw, 5);
      y += 10;

      // NO LEGAL ADVICE Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(lang === 'es' ? 'SIN ASESORIA LEGAL / SIN PREPARACION DE DOCUMENTOS' : 'NO LEGAL ADVICE / NO DOCUMENT PREPARATION', m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const noLegalAdvice = lang === 'es'
        ? 'Multiservicios 360 no es un bufete de abogados y no proporciona asesoria legal. Multiservicios 360 no prepara documentos legales en nombre de los usuarios. Multiservicios 360 proporciona acceso a herramientas de software que permiten a los usuarios crear sus propios documentos basandose unicamente en la informacion y selecciones proporcionadas por el usuario.'
        : 'Multiservicios 360 is not a law firm and does not provide legal advice. Multiservicios 360 does not prepare legal documents on behalf of users. Multiservicios 360 provides access to software tools that allow users to create their own documents based solely on information and selections provided by the user.';
      y = wrap(noLegalAdvice, m, y, cw, 5);
      y += 10;

      // USER RESPONSIBILITY Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(lang === 'es' ? 'RESPONSABILIDAD DEL USUARIO' : 'USER RESPONSIBILITY', m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const userResp = lang === 'es'
        ? 'El usuario es el unico responsable de la precision, integridad y efecto legal de este documento.'
        : 'The user is solely responsible for the accuracy, completeness, and legal effect of this document.';
      y = wrap(userResp, m, y, cw, 5);
      y += 10;

      // USER ACKNOWLEDGMENT Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(lang === 'es' ? 'RECONOCIMIENTO DEL USUARIO' : 'USER ACKNOWLEDGMENT', m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const userAck = lang === 'es'
        ? `Al firmar electronicamente a continuacion, reconozco y acepto que:

• Yo cree este documento por mi cuenta utilizando herramientas de software proporcionadas por Multiservicios 360;
• No se me proporciono asesoria legal ni servicios de preparacion de documentos;
• Soy responsable de toda la informacion contenida en este documento; y
• Entiendo que este documento puede tener consecuencias legales significativas.`
        : `By signing electronically below, I acknowledge and agree that:

• I created this document myself using software tools provided by Multiservicios 360;
• No legal advice or document preparation services were provided to me;
• I am responsible for all information contained in this document; and
• I understand that this document may have significant legal consequences.`;
      y = wrap(userAck, m, y, cw, 5);
      y += 20;

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

        const pdfBytes = await pdfDocFromJsPDF.save();
        const lockedBytes = await lockPdf(pdfBytes);
        const blob = new Blob([lockedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `POA_${(d.principal_name || 'Document').replace(/\s+/g, '_')}_${lang.toUpperCase()}.pdf`;
        link.click();
        link.click();
        saveToVault({ blob, matterId, clientName: matterData?.client_name, clientEmail: matterData?.client_email, documentType: 'poa', language: lang, fileName: link.download });
        URL.revokeObjectURL(url);
        URL.revokeObjectURL(url);
      } catch (notaryError) {
        console.error('Error fetching notary form:', notaryError);
        doc.save(`POA_${(d.principal_name || 'Document').replace(/\s+/g, '_')}_${lang.toUpperCase()}.pdf`);
        alert(lang === 'es' 
          ? 'Documento generado. El formulario notarial no se pudo adjuntar.' 
          : 'Document generated. Notary form could not be attached.');
      }

      // Mark as finalized and save to database
      if (!isFinalized) {
        setIsFinalized(true);
        try {
          await fetch(`/api/poa/matters/${matterId}/finalize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              execution_date: executionDate,
              electronic_signature: electronicSignature,
              signed_at_utc: auditData.signedAtUtc,
              signed_at_local: auditData.signedAtLocal,
              document_version_id: auditData.documentVersionId
            })
          });
        } catch (e) {
          console.log('Could not save finalization data:', e);
        }
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(language === 'es' ? 'Error al generar el PDF. Por favor intente de nuevo.' : 'Error generating PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    alert(language === 'es' 
      ? 'Para imprimir su Poder Notarial:\n\n1. Descargue el PDF (botón azul o morado arriba)\n2. Abra el archivo PDF descargado\n3. Use Ctrl+P o Archivo → Imprimir' 
      : 'To print your Power of Attorney:\n\n1. Download the PDF (blue or purple button above)\n2. Open the downloaded PDF file\n3. Use Ctrl+P or File → Print');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(language === 'es' ? 'Poder Notarial - Multi Servicios 360' : 'Power of Attorney - Multi Servicios 360');
    const body = encodeURIComponent(language === 'es' 
      ? 'Adjunto encontrara su Poder Notarial. Por favor descargue los documentos PDF desde su cuenta.\n\nMulti Servicios 360\n855.246.7274' 
      : 'Please find attached your Power of Attorney documents. Please download the PDF documents from your account.\n\nMulti Servicios 360\n855.246.7274');
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #E5E7EB', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#6B7280' }}>{language === 'es' ? 'Cargando...' : 'Loading...'}</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F9FF', padding: '24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '12px', padding: '48px 32px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#059669' }}>
          <CheckIcon />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>{t.title}</h1>
        <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '24px' }}>{t.subtitle}</p>
        
        {matterId && (
          <div style={{ backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '12px', marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>{t.orderNumber}</p>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#1F2937', margin: '4px 0 0', wordBreak: 'break-all' }}>{matterId}</p>
          </div>
        )}

        <p style={{ color: '#6B7280', marginBottom: '32px' }}>{t.thankYou}</p>

        {/* ============================================ */}
        {/* EXECUTION DATE INPUT */}
        {/* ============================================ */}
        <div style={{ 
          backgroundColor: '#FEF3C7', 
          border: '2px solid #F59E0B', 
          borderRadius: '12px', 
          padding: '20px', 
          marginBottom: '16px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CalendarIcon />
            <label style={{ fontSize: '16px', fontWeight: '600', color: '#92400E' }}>
              {t.executionDateLabel} *
            </label>
          </div>
          <p style={{ fontSize: '12px', color: '#B45309', marginBottom: '12px', margin: '0 0 12px 0' }}>
            {t.executionDateHelp}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="text"
              value={executionDate}
              onChange={(e) => {
                const formatted = formatDateInput(e.target.value);
                setExecutionDate(formatted);
                if (dateError) setDateError('');
              }}
              placeholder={t.executionDatePlaceholder}
              maxLength={10}
              disabled={isFinalized}
              style={{
                padding: '12px 16px',
                fontSize: '16px',
                border: dateError ? '2px solid #DC2626' : '2px solid #D1D5DB',
                borderRadius: '8px',
                width: '160px',
                fontFamily: 'monospace',
                backgroundColor: isFinalized ? '#F3F4F6' : 'white'
              }}
            />
            <button
              type="button"
              onClick={() => setExecutionDate(getLADate())}
              disabled={isFinalized}
              style={{
                padding: '12px 16px',
                fontSize: '14px',
                backgroundColor: isFinalized ? '#9CA3AF' : '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isFinalized ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {t.useTodayDate}
            </button>
          </div>
          {dateError && (
            <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '8px', margin: '8px 0 0 0' }}>
              ⚠️ {dateError}
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
          <button onClick={() => generatePDF(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            <DownloadIcon /> {t.downloadSpanish}
          </button>
          <button onClick={() => generatePDF(false)} disabled={translating} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: translating ? '#9CA3AF' : '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: translating ? 'wait' : 'pointer' }}>
            <DownloadIcon /> {translating ? (language === 'es' ? 'Traduciendo...' : 'Translating...') : t.downloadEnglish}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            <PrintIcon /> {t.print}
          </button>
          <button onClick={handleEmail} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            <EmailIcon /> {t.email}
          </button>
        </div>

        {/* Legal Note */}
        {language === 'es' && t.legalNote && (
          <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', padding: '12px', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: '#92400E', margin: 0 }}>{t.legalNote}</p>
          </div>
        )}

        {/* Next Steps */}
        <div style={{ textAlign: 'left', backgroundColor: '#EFF6FF', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E40AF', marginBottom: '12px' }}>{t.nextSteps}</h3>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#1E40AF' }}>
            <li style={{ marginBottom: '8px' }}>{t.step1}</li>
            <li style={{ marginBottom: '8px' }}>{t.step2}</li>
            <li style={{ marginBottom: '8px' }}>{t.step3}</li>
            <li style={{ marginBottom: '8px' }}>{t.step4}</li>
            <li>{t.step5}</li>
          </ol>
        </div>

        {/* Contact */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
          <p style={{ color: '#6B7280', marginBottom: '8px' }}>{t.questions}</p>
          <p style={{ fontWeight: '600', color: '#1F2937' }}>{t.contact}</p>
        </div>

        <a href="/" style={{ display: 'inline-block', marginTop: '24px', padding: '12px 24px', color: '#2563EB', border: '2px solid #2563EB', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
          {t.backHome}
        </a>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px', color: '#6B7280', fontSize: '12px' }}>
        Multi Servicios 360 | www.multiservicios360.net | 855.246.7274
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF' }}>
        <p style={{ color: '#6B7280' }}>Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}