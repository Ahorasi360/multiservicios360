// Last updated: 2026-01-22
"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PDFDocument } from 'pdf-lib';

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

function SuccessContent() {
  const searchParams = useSearchParams();
  const [matterData, setMatterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('es');
  const [executionDate, setExecutionDate] = useState('');
  const [dateError, setDateError] = useState('');

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
    // Check if it's a valid date
    const [month, day, year] = dateStr.split('/').map(Number);
    const testDate = new Date(year, month - 1, day);
    return testDate.getMonth() === month - 1 && testDate.getDate() === day && testDate.getFullYear() === year;
  };

  // Helper: Format date input to MM/DD/YYYY
  const formatDateInput = (value) => {
    // Remove non-digits
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
      templateVersion: '2026-01-22'
    });
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `v1-${Math.abs(hash).toString(16)}`;
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
    step1: 'Descargue sus documentos PDF',
    step2: 'Revise el documento cuidadosamente',
    step3: 'Firme ante un notario publico',
    step4: 'Guarde copias en un lugar seguro',
    questions: 'Preguntas?',
    contact: 'Contactenos al 855.246.7274',
    backHome: 'Volver al Inicio',
    legalNote: 'Nota: El documento en ingles es el documento legal oficial. El documento en espanol es para su referencia.',
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
    step1: 'Download your PDF documents',
    step2: 'Review the document carefully',
    step3: 'Sign in front of a notary public',
    step4: 'Keep copies in a safe place',
    questions: 'Questions?',
    contact: 'Contact us at 855.246.7274',
    backHome: 'Back to Home',
    legalNote: '',
  };

  const generatePDF = async (isSpanish = false) => {
    if (!matterData?.intake_data) {
      alert('No data available');
      return;
    }

    // VALIDATION: Execution date is required
    if (!validateExecutionDate(executionDate)) {
      const errorMsg = language === 'es' 
        ? 'La fecha de ejecución es obligatoria.' 
        : 'Execution date is required.';
      setDateError(errorMsg);
      alert(errorMsg);
      return;
    }
    setDateError('');

    // Generate audit timestamps (stored locally, not printed in PDF)
    const now = new Date();
    const auditData = {
      executionDate: executionDate,
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
      const d = matterData.intake_data;
      const lang = isSpanish ? 'es' : 'en';

      // Create a new PDF document using jsPDF for content generation
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const m = 20;
      const pw = 210;
      const cw = pw - 40;
      let y = 15;

      const wrap = (text, x, startY, maxW, lh = 5) => {
        const lines = doc.splitTextToSize(text || '', maxW);
        lines.forEach((line, i) => doc.text(line, x, startY + (i * lh)));
        return startY + (lines.length * lh);
      };

      const newPage = (currentY, need = 30) => {
        if (currentY > 270 - need) { doc.addPage(); return 20; }
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
      // DETERMINE POA TYPE FOR INTRO VARIANT
      // ============================================
      const hasRealEstate = d.powers_real_estate === true;
      const hasHotPowers = d.hot_gifts || d.hot_beneficiary || d.hot_trust;
      
      // Determine which intro variant to use
      // Variant 1: Real Estate = YES
      // Variant 2: Real Estate = NO (but general powers)
      // Variant 3: Financial/Administrative only (no real estate, no hot powers)
      let introVariant = 2; // Default to Variant 2
      if (hasRealEstate) {
        introVariant = 1;
      } else if (!hasHotPowers) {
        introVariant = 3;
      }

      // ============================================
      // RECORDING HEADER (for real estate POAs only)
      // ============================================
      if (hasRealEstate && d.record_for_real_estate) {
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
      // TITLE PAGE
      // ============================================
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'PODER NOTARIAL GENERAL DURADERO' : 'CALIFORNIA GENERAL DURABLE', pw/2, y, {align: 'center'});
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
      // DYNAMIC INTRO NOTICE (Based on POA Type)
      // ============================================
      y = newPage(y, 60);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      
      // Title varies by variant
      if (introVariant === 3) {
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
          ? `Un poder notarial duradero es un documento legal importante. Al firmar este poder notarial, usted autoriza a otra persona (su Apoderado) a actuar en su nombre en los asuntos expresamente indicados en este documento.

Este poder notarial otorga autoridad amplia, incluyendo la facultad de administrar, vender, transferir, gravar y manejar bienes inmuebles, asi como administrar bienes personales, cuentas financieras, inversiones, asuntos fiscales y otros asuntos legales y patrimoniales, segun se establece expresamente en este documento.

Los poderes otorgados mediante este poder notarial continuaran vigentes incluso si usted llega a quedar incapacitado, a menos que este documento indique expresamente lo contrario.

Antes de firmar este poder notarial, usted debe comprender plenamente el alcance de la autoridad que esta otorgando. Si no esta seguro de que este documento refleje completamente sus intenciones, se le recomienda consultar con un abogado con licencia en el Estado de California.`
          : `A durable power of attorney is an important legal document. By signing this power of attorney, you authorize another person (your Agent) to act on your behalf in the matters expressly indicated in this document.

This power of attorney grants broad authority, including the power to manage, sell, transfer, encumber, and handle real property, as well as manage personal property, financial accounts, investments, tax matters, and other legal and estate matters, as expressly set forth in this document.

The powers granted under this power of attorney will continue in effect even if you become incapacitated, unless this document expressly provides otherwise.

Before signing this power of attorney, you should fully understand the scope of the authority you are granting. If you are not sure that this document fully reflects your intentions, you are advised to consult with an attorney licensed in the State of California.`;
      } else if (introVariant === 2) {
        // VARIANT 2: WITHOUT REAL ESTATE (but general powers)
        introText = lang === 'es'
          ? `Un poder notarial duradero es un documento legal importante. Al firmar este poder notarial, usted autoriza a otra persona (su Apoderado) a actuar en su nombre en los asuntos expresamente indicados en este documento.

Este poder notarial otorga autoridad general sobre bienes personales y asuntos financieros y administrativos, tales como cuentas bancarias, inversiones, operaciones comerciales, asuntos fiscales y otros asuntos legales y patrimoniales, segun se establece expresamente en este documento.

Este poder notarial no otorga autoridad sobre bienes inmuebles, salvo que dicha autoridad sea expresamente concedida en una seccion especifica de este documento.

Los poderes otorgados mediante este poder notarial continuaran vigentes incluso si usted llega a quedar incapacitado, a menos que este documento indique expresamente lo contrario.

Antes de firmar este poder notarial, usted debe comprender plenamente el alcance de la autoridad que esta otorgando. Si no esta seguro de que este documento refleje completamente sus intenciones, se le recomienda consultar con un abogado con licencia en el Estado de California.`
          : `A durable power of attorney is an important legal document. By signing this power of attorney, you authorize another person (your Agent) to act on your behalf in the matters expressly indicated in this document.

This power of attorney grants general authority over personal property and financial and administrative matters, such as bank accounts, investments, business operations, tax matters, and other legal and estate matters, as expressly set forth in this document.

This power of attorney does not grant authority over real property, unless such authority is expressly granted in a specific section of this document.

The powers granted under this power of attorney will continue in effect even if you become incapacitated, unless this document expressly provides otherwise.

Before signing this power of attorney, you should fully understand the scope of the authority you are granting. If you are not sure that this document fully reflects your intentions, you are advised to consult with an attorney licensed in the State of California.`;
      } else {
        // VARIANT 3: FINANCIAL/ADMINISTRATIVE ONLY
        introText = lang === 'es'
          ? `Un poder notarial es un documento legal importante. Al firmar este poder notarial, usted autoriza a otra persona (su Apoderado) a actuar en su nombre unicamente en los asuntos financieros y administrativos expresamente indicados en este documento.

Este poder notarial se limita a bienes personales, cuentas financieras, pagos, cobros, representacion administrativa y asuntos similares, y excluye expresamente cualquier autoridad relacionada con bienes inmuebles, creacion o modificacion de fideicomisos, donaciones significativas o disposiciones patrimoniales complejas, salvo que se indique de manera expresa y especifica.

Antes de firmar este poder notarial, usted debe comprender claramente las limitaciones de la autoridad otorgada. Si tiene dudas sobre el alcance o las consecuencias legales de este documento, se le recomienda consultar con un abogado con licencia en el Estado de California.`
          : `A power of attorney is an important legal document. By signing this power of attorney, you authorize another person (your Agent) to act on your behalf only in the financial and administrative matters expressly indicated in this document.

This power of attorney is limited to personal property, financial accounts, payments, collections, administrative representation, and similar matters, and expressly excludes any authority related to real property, creation or modification of trusts, significant gifts, or complex estate dispositions, unless expressly and specifically indicated.

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

      // Principal info with AKA names
      let principalText = lang === 'es'
        ? `Yo, ${d.principal_name || '___'}`
        : `I, ${d.principal_name || '___'}`;
      
      // Add AKA names if present
      if (d.has_aka && d.aka_names) {
        principalText += lang === 'es'
          ? `, tambien conocido como ${d.aka_names}`
          : `, also known as ${d.aka_names}`;
      }
      
      // Add address and county
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
          : ` (Relationship: ${d.agent_relationship})`;
      }
      y = wrap(agentText, m, y, cw, 5);
      y += 6;

      // Successor Agent (if selected)
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
            : ` (Relationship: ${d.successor_relationship})`;
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
        d.durable
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
      y = newPage(y, 35);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'AUTORIZACION HIPAA' : 'HIPAA AUTHORIZATION', m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const hipaaText = lang === 'es'
        ? 'De conformidad con la Ley de Portabilidad y Responsabilidad del Seguro de Salud de 1996 ("HIPAA") y todas las demas leyes estatales y federales aplicables, y exclusivamente con el proposito de determinar mi incapacitacion o incapacidad para administrar mis asuntos financieros y obtener una declaracion jurada de dicha incapacitacion por un medico, autorizo a cualquier proveedor de atencion medica a divulgar a la persona nombrada aqui como mi "apoderado" cualquier informacion de salud identificable individualmente pertinente suficiente para determinar si soy mental o fisicamente capaz de administrar mis asuntos financieros. Al ejercer dicha autoridad, mi apoderado constituye mi "representante personal" segun lo definido por HIPAA.'
        : 'Pursuant to the Health Insurance Portability and Accountability Act of 1996 ("HIPAA") and all other applicable state and federal laws, and exclusively for the purpose of making a determination of my incapacitation or incapability of managing my financial affairs and obtaining an affidavit of such incapacitation by a physician, I authorize any health care provider to disclose to the person named herein as my "attorney-in-fact" any pertinent individually identifiable health information sufficient to determine whether I am mentally or physically capable of managing my financial affairs. In exercising such authority, my attorney-in-fact constitutes my "personal representative" as defined by HIPAA.';
      y = wrap(hipaaText, m, y, cw, 4);
      y += 8;

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
          textEn: 'To acquire, purchase, sell, convey, transfer, exchange, partition, lease, sublease, manage, improve, insure, encumber, mortgage, refinance, or otherwise deal with any real property or interest therein, including the execution and recording of grant deeds, trust transfer deeds, quitclaim deeds, deeds of trust, reconveyances, leases, and all related instruments.',
          textEs: 'Adquirir, comprar, vender, traspasar, transferir, intercambiar, dividir, arrendar, subarrendar, administrar, mejorar, asegurar, gravar, hipotecar, refinanciar o de otra manera manejar cualquier bien inmueble o interes en el mismo, incluyendo la ejecucion y registro de escrituras de concesion, escrituras de transferencia de fideicomiso, escrituras de renuncia, escrituras de fideicomiso, reconveyances, arrendamientos y todos los instrumentos relacionados.' },
        { key: 'powers_banking', letter: 'B', titleEn: 'Banking and Financial Institutions', titleEs: 'Banca e Instituciones Financieras',
          textEn: 'To open, close, modify, and transact business on checking accounts, savings accounts, money market accounts, certificates of deposit, and other deposit accounts at any bank, savings and loan, credit union, or other financial institution; to deposit and withdraw funds by any means; to endorse, negotiate, and collect checks, drafts, and other negotiable instruments; to obtain statements, records, and information concerning my accounts.',
          textEs: 'Abrir, cerrar, modificar y realizar transacciones en cuentas de cheques, cuentas de ahorros, cuentas de mercado de dinero, certificados de deposito y otras cuentas de deposito en cualquier banco, asociacion de ahorro y prestamo, cooperativa de credito u otra institucion financiera; depositar y retirar fondos por cualquier medio; endosar, negociar y cobrar cheques, giros y otros instrumentos negociables; obtener estados de cuenta, registros e informacion sobre mis cuentas.' },
        { key: 'powers_stocks', letter: 'C', titleEn: 'Investments and Securities', titleEs: 'Inversiones y Valores',
          textEn: 'To purchase, sell, exchange, trade, surrender, tender, vote proxies, and otherwise manage stocks, bonds, mutual funds, exchange-traded funds, options, commodities, futures contracts, and other investment securities; to open, modify, and close brokerage accounts; to exercise subscription rights and conversion privileges.',
          textEs: 'Comprar, vender, intercambiar, negociar, entregar, ofrecer, votar poderes y de otra manera administrar acciones, bonos, fondos mutuos, fondos cotizados en bolsa, opciones, materias primas, contratos de futuros y otros valores de inversion; abrir, modificar y cerrar cuentas de corretaje; ejercer derechos de suscripcion y privilegios de conversion.' },
        { key: 'powers_business', letter: 'D', titleEn: 'Business Operating Transactions', titleEs: 'Operaciones Comerciales',
          textEn: 'To form, operate, manage, reorganize, merge, consolidate, dissolve, or sell any sole proprietorship, partnership, limited liability company, corporation, or other business entity; to acquire or dispose of ownership interests; to execute operating agreements, partnership agreements, shareholder agreements, buy-sell agreements, and related documents.',
          textEs: 'Formar, operar, administrar, reorganizar, fusionar, consolidar, disolver o vender cualquier empresa individual, sociedad, compania de responsabilidad limitada, corporacion u otra entidad comercial; adquirir o disponer de participaciones; ejecutar acuerdos operativos, acuerdos de sociedad, acuerdos de accionistas, acuerdos de compra-venta y documentos relacionados.' },
        { key: 'powers_insurance', letter: 'E', titleEn: 'Insurance and Annuities', titleEs: 'Seguros y Anualidades',
          textEn: 'To purchase, maintain, modify, surrender, cancel, or collect proceeds and benefits from life insurance, health insurance, disability insurance, long-term care insurance, property insurance, liability insurance, and annuity contracts; to designate and change beneficiaries where permitted; to borrow against cash values.',
          textEs: 'Comprar, mantener, modificar, entregar, cancelar o cobrar beneficios y ganancias de seguros de vida, seguros de salud, seguros de discapacidad, seguros de cuidado a largo plazo, seguros de propiedad, seguros de responsabilidad y contratos de anualidades; designar y cambiar beneficiarios donde este permitido; tomar prestamos contra valores en efectivo.' },
        { key: 'powers_retirement', letter: 'F', titleEn: 'Retirement Plans and Accounts', titleEs: 'Planes y Cuentas de Jubilacion',
          textEn: 'To contribute to, withdraw from, rollover, transfer, and manage Individual Retirement Accounts (IRAs), Roth IRAs, SEP-IRAs, SIMPLE IRAs, 401(k) plans, 403(b) plans, pension plans, profit-sharing plans, and other qualified and non-qualified retirement plans; to make investment elections and beneficiary designations where permitted.',
          textEs: 'Contribuir, retirar, transferir, trasladar y administrar Cuentas Individuales de Jubilacion (IRAs), Roth IRAs, SEP-IRAs, SIMPLE IRAs, planes 401(k), planes 403(b), planes de pension, planes de participacion en las ganancias y otros planes de jubilacion calificados y no calificados; hacer elecciones de inversion y designaciones de beneficiarios donde este permitido.' },
        { key: 'powers_government', letter: 'G', titleEn: 'Government Benefits', titleEs: 'Beneficios Gubernamentales',
          textEn: 'To apply for, receive, manage, and utilize benefits from Social Security Administration, Medicare, Medi-Cal (Medicaid), Veterans Administration, unemployment compensation, workers\' compensation, and other federal, state, or local government programs; to represent me before government agencies and appeal adverse decisions.',
          textEs: 'Solicitar, recibir, administrar y utilizar beneficios de la Administracion del Seguro Social, Medicare, Medi-Cal (Medicaid), Administracion de Veteranos, compensacion por desempleo, compensacion de trabajadores y otros programas gubernamentales federales, estatales o locales; representarme ante agencias gubernamentales y apelar decisiones adversas.' },
        { key: 'powers_litigation', letter: 'H', titleEn: 'Claims and Litigation', titleEs: 'Reclamos y Litigios',
          textEn: 'To assert, pursue, defend, arbitrate, mediate, compromise, settle, dismiss, or abandon any claim, demand, lawsuit, or legal proceeding in which I may be involved; to retain and discharge attorneys, experts, and other professionals; to execute settlement agreements, releases, and related documents.',
          textEs: 'Presentar, perseguir, defender, arbitrar, mediar, comprometer, resolver, desestimar o abandonar cualquier reclamo, demanda, juicio o procedimiento legal en el que pueda estar involucrado; contratar y despedir abogados, expertos y otros profesionales; ejecutar acuerdos de resolucion, liberaciones y documentos relacionados.' },
        { key: 'powers_tax', letter: 'I', titleEn: 'Tax Matters', titleEs: 'Asuntos Fiscales',
          textEn: 'To prepare, sign, and file federal, state, and local income tax returns, gift tax returns, and other tax documents; to represent me before the Internal Revenue Service, California Franchise Tax Board, and other taxing authorities; to execute IRS Forms 2848 (Power of Attorney) and 8821 (Tax Information Authorization); to pay taxes owed and collect refunds; to contest tax assessments and negotiate settlements.',
          textEs: 'Preparar, firmar y presentar declaraciones de impuestos federales, estatales y locales sobre la renta, declaraciones de impuestos sobre donaciones y otros documentos fiscales; representarme ante el Servicio de Impuestos Internos, la Junta de Franquicias de California y otras autoridades fiscales; ejecutar Formularios IRS 2848 (Poder Notarial) y 8821 (Autorizacion de Informacion Fiscal); pagar impuestos adeudados y cobrar reembolsos; impugnar evaluaciones fiscales y negociar acuerdos.' },
      ];

      powers.forEach(p => {
        y = newPage(y, 25);
        const checked = d[p.key] ? '[X]' : '[ ]';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`${checked} ${p.letter}. ${lang === 'es' ? p.titleEs : p.titleEn}`, m, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        y = wrap(lang === 'es' ? p.textEs : p.textEn, m + 5, y, cw - 5, 4.5);
        y += 6;
      });

      // ============================================
      // ARTICLE VI - ADVANCED POWERS (HOT POWERS)
      // ============================================
      y = newPage(y, 50);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'ARTICULO VI - PODERES AVANZADOS (PODERES ESPECIALES)' : 'ARTICLE VI - ADVANCED POWERS (HOT POWERS)', m, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      const hotNotice = lang === 'es'
        ? 'AVISO: Los siguientes poderes son considerados "poderes especiales" que requieren autorizacion expresa. Estos poderes permiten a su Apoderado tomar acciones que pueden afectar significativamente su patrimonio.'
        : 'NOTICE: The following powers are considered "hot powers" that require express authorization. These powers allow your Agent to take actions that may significantly affect your estate.';
      y = wrap(hotNotice, m, y, cw, 4.5);
      y += 8;

      // Gift Power with limit
      y = newPage(y, 25);
      const giftChecked = d.hot_gifts ? '[X]' : '[ ]';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`${giftChecked} A. ${lang === 'es' ? 'Poder para Hacer Regalos' : 'Power to Make Gifts'}`, m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      let giftText = lang === 'es'
        ? 'Autorizo a mi Apoderado a hacer regalos de mi propiedad a individuos o instituciones de caridad en mi nombre.'
        : 'I authorize my Agent to make gifts of my property to individuals or charities on my behalf.';
      
      if (d.hot_gifts && d.gift_limit) {
        if (d.gift_limit === 'annual_exclusion') {
          giftText += lang === 'es'
            ? ' Los regalos estan limitados al monto de exclusion anual del impuesto federal sobre donaciones ($18,000 por beneficiario en 2024) por ano calendario.'
            : ' Gifts are limited to the federal gift tax annual exclusion amount ($18,000 per donee in 2024) per calendar year.';
        } else if (d.gift_limit === 'unlimited') {
          giftText += lang === 'es'
            ? ' No hay limite en el monto de los regalos, sujeto al deber fiduciario del Apoderado de actuar en mi mejor interes.'
            : ' There is no limit on the amount of gifts, subject to the Agent\'s fiduciary duty to act in my best interest.';
        } else if (d.gift_limit === 'custom') {
          giftText += lang === 'es'
            ? ' Los regalos estan sujetos a las limitaciones especificas establecidas en las instrucciones especiales de este documento.'
            : ' Gifts are subject to the specific limitations set forth in the special instructions of this document.';
        }
      }
      y = wrap(giftText, m + 5, y, cw - 5, 4.5);
      y += 6;

      // Beneficiary Designation Power
      y = newPage(y, 20);
      const beneficiaryChecked = d.hot_beneficiary ? '[X]' : '[ ]';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`${beneficiaryChecked} B. ${lang === 'es' ? 'Cambio de Designaciones de Beneficiarios' : 'Beneficiary Designation Changes'}`, m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      y = wrap(lang === 'es'
        ? 'Autorizo a mi Apoderado a designar, cambiar o revocar beneficiarios de polizas de seguro de vida, cuentas de jubilacion, cuentas pagaderas al fallecimiento y cuentas de transferencia al fallecimiento, donde lo permita la ley y los terminos de la cuenta.'
        : 'I authorize my Agent to designate, change, or revoke beneficiaries of life insurance policies, retirement accounts, payable-on-death accounts, and transfer-on-death accounts, where permitted by law and the account terms.', m + 5, y, cw - 5, 4.5);
      y += 6;

      // Trust Power
      y = newPage(y, 20);
      const trustChecked = d.hot_trust ? '[X]' : '[ ]';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`${trustChecked} C. ${lang === 'es' ? 'Creacion y Modificacion de Fideicomisos' : 'Trust Creation and Modification'}`, m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      y = wrap(lang === 'es'
        ? 'Autorizo a mi Apoderado a crear, modificar, enmendar, revocar y financiar fideicomisos revocables para mi beneficio, consistente con mi plan patrimonial existente.'
        : 'I authorize my Agent to create, modify, amend, revoke, and fund revocable trusts for my benefit, consistent with my existing estate plan.', m + 5, y, cw - 5, 4.5);
      y += 6;

      // Digital Assets Power (always included)
      y = newPage(y, 20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`[X] D. ${lang === 'es' ? 'Activos Digitales' : 'Digital Assets'}`, m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      y = wrap(lang === 'es'
        ? 'Autorizo a mi Apoderado a acceder, administrar, controlar, eliminar, transferir y disponer de mis activos digitales, cuentas en linea, criptomonedas y comunicaciones electronicas, segun lo permita la Ley Revisada Uniforme de Acceso Fiduciario a Activos Digitales (RUFADAA) y otras leyes aplicables.'
        : 'I authorize my Agent to access, manage, control, delete, transfer, and dispose of my digital assets, online accounts, cryptocurrencies, and electronic communications, as permitted by the Revised Uniform Fiduciary Access to Digital Assets Act (RUFADAA) and other applicable laws.', m + 5, y, cw - 5, 4.5);
      y += 8;

      // ============================================
      // ARTICLE VII - HEALTHCARE EXCLUSION
      // ============================================
      section(lang === 'es' ? 'ARTICULO VII - EXCLUSION DE ATENCION MEDICA' : 'ARTICLE VII - HEALTHCARE EXCLUSION',
        lang === 'es'
          ? 'Este Poder Notarial NO otorga autoridad para tomar decisiones medicas o de atencion de salud, incluyendo decisiones sobre tratamiento medico, hospitalizacion, cirugia, medicamentos, o atencion al final de la vida. Dicha autoridad solo puede otorgarse mediante una Directiva de Atencion Medica por Anticipado separada conforme a la Seccion 4700 y siguientes del Codigo de Sucesiones de California.'
          : 'This Power of Attorney does NOT grant authority to make medical or health care decisions, including decisions regarding medical treatment, hospitalization, surgery, medication, or end-of-life care. Such authority may be granted only by a separate Advance Health Care Directive pursuant to California Probate Code Section 4700 et seq.'
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
          textEn: 'Any third party may rely upon the authority granted in this Power of Attorney without inquiry into its validity, scope, or revocation, pursuant to California Probate Code Section 4303. A third party who acts in good faith reliance on this Power of Attorney shall not be liable for any damages arising from such reliance.',
          textEs: 'Cualquier tercero puede confiar en la autoridad otorgada en este Poder Notarial sin indagar sobre su validez, alcance o revocacion, conforme a la Seccion 4303 del Codigo de Sucesiones de California. Un tercero que actue de buena fe confiando en este Poder Notarial no sera responsable de ningun dano que surja de dicha confianza.' },
        { titleEn: 'Agent Liability and Indemnification', titleEs: 'Responsabilidad e Indemnizacion del Apoderado',
          textEn: 'My Agent shall not be liable for any actions taken in good faith under this Power of Attorney, except for actions constituting willful misconduct, gross negligence, or breach of fiduciary duty. My Agent shall be indemnified from my estate for any liability arising from good faith actions taken pursuant to this Power of Attorney.',
          textEs: 'Mi Apoderado no sera responsable por acciones tomadas de buena fe bajo este Poder Notarial, excepto por acciones que constituyan conducta intencional indebida, negligencia grave o incumplimiento del deber fiduciario. Mi Apoderado sera indemnizado de mi patrimonio por cualquier responsabilidad que surja de acciones de buena fe tomadas conforme a este Poder Notarial.' },
        { titleEn: 'Compensation and Reimbursement', titleEs: 'Compensacion y Reembolso',
          textEn: 'My Agent is entitled to reasonable compensation for services rendered and reimbursement of all reasonable expenses incurred in the performance of duties under this Power of Attorney, unless compensation is expressly waived in writing.',
          textEs: 'Mi Apoderado tiene derecho a una compensacion razonable por los servicios prestados y al reembolso de todos los gastos razonables incurridos en el desempeno de sus deberes bajo este Poder Notarial, a menos que la compensacion sea expresamente renunciada por escrito.' },
        { titleEn: 'Severability', titleEs: 'Separabilidad',
          textEn: 'If any provision of this Power of Attorney is held invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect to the maximum extent permitted by law.',
          textEs: 'Si alguna disposicion de este Poder Notarial es considerada invalida, ilegal o inaplicable por un tribunal de jurisdiccion competente, las disposiciones restantes permaneceran en pleno vigor y efecto en la maxima extension permitida por la ley.' },
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
      // ARTICLE IX - TERMINATION AND GOVERNING LAW
      // ============================================
      section(lang === 'es' ? 'ARTICULO IX - TERMINACION Y LEY APLICABLE' : 'ARTICLE IX - TERMINATION AND GOVERNING LAW',
        lang === 'es'
          ? 'Este Poder Notarial terminara automaticamente: (a) a mi fallecimiento; (b) por mi revocacion escrita entregada a mi Apoderado; (c) por orden de un tribunal de jurisdiccion competente; o (d) si este Poder Notarial no es duradero, al momento de mi incapacidad. Este Poder Notarial se regira e interpretara de acuerdo con las leyes del Estado de California.'
          : 'This Power of Attorney shall terminate automatically: (a) upon my death; (b) by my written revocation delivered to my Agent; (c) by order of a court of competent jurisdiction; or (d) if this Power of Attorney is not durable, upon my incapacity. This Power of Attorney shall be governed by and construed in accordance with the laws of the State of California.'
      );

      // ============================================
      // SPECIAL INSTRUCTIONS (if any)
      // ============================================
      if (d.has_special_instructions && d.special_instructions) {
        y = newPage(y, 30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(lang === 'es' ? 'INSTRUCCIONES ESPECIALES Y LIMITACIONES' : 'SPECIAL INSTRUCTIONS AND LIMITATIONS', m, y);
        y += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        y = wrap(d.special_instructions, m, y, cw, 5);
        y += 8;
      }

      // ============================================
      // RECORDING NOTICE (if for real estate)
      // ============================================
      if (hasRealEstate && d.record_for_real_estate) {
        y = newPage(y, 25);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(lang === 'es' ? 'AVISO DE REGISTRO' : 'RECORDING NOTICE', m, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        let recordingText = lang === 'es'
          ? 'Este Poder Notarial esta destinado a ser registrado con el Registrador del Condado para su uso en transacciones de bienes raices.'
          : 'This Power of Attorney is intended to be recorded with the County Recorder for use in real property transactions.';
        if (d.recording_county) {
          recordingText += lang === 'es'
            ? ` Condado previsto para registro: ${d.recording_county}.`
            : ` Intended recording county: ${d.recording_county}.`;
        }
        y = wrap(recordingText, m, y, cw, 5);
        y += 8;
      }

      // ============================================
      // ARTICLE X - EXECUTION PAGE
      // ============================================
      y = newPage(y, 80);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'ARTICULO X - EJECUCION' : 'ARTICLE X - EXECUTION', m, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(lang === 'es' 
        ? 'EN FE DE LO CUAL, he ejecutado este Poder Notarial General Duradero en la fecha indicada a continuacion.' 
        : 'IN WITNESS WHEREOF, I have executed this General Durable Power of Attorney on the date written below.', m, y);
      y += 12;

      // EXECUTION DATE - Required field (Time is NOT printed per spec)
      // Render filled date if available, otherwise show blanks for draft mode
      const displayDate = executionDate && validateExecutionDate(executionDate) 
        ? executionDate 
        : '____/____/______';
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'Fecha de Ejecucion: ' : 'Date of Execution: ', m, y);
      doc.setFont('helvetica', 'normal');
      const dateLabel = lang === 'es' ? 'Fecha de Ejecucion: ' : 'Date of Execution: ';
      const dateLabelWidth = doc.getTextWidth(dateLabel);
      doc.text(displayDate, m + dateLabelWidth, y);
      y += 20;

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
      doc.setFontSize(10);
      const agentNoticeText = lang === 'es'
        ? `Cuando usted acepta la autoridad otorgada bajo este poder notarial, se crea una relacion legal entre usted y el poderdante. Esta relacion impone sobre usted deberes legales que continuan hasta que renuncie o el poder notarial sea terminado o revocado. Usted debe:

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

(4) Usted puede estar sujeto a sanciones penales por actividades que constituyan conducta criminal.

Si su ejercicio de autoridad de alguna manera viola la ley o es inconsistente con el poder notarial, usted puede ser personalmente responsable no solo ante el poderdante sino tambien ante otras personas lesionadas como resultado de sus acciones.`
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

(4) You may be subject to criminal penalties for activities that constitute criminal conduct.

If your exercise of authority in any way violates the law or is inconsistent with the power of attorney, you may be personally liable not only to the principal but also to other persons injured as a result of your actions.`;

      y = wrap(agentNoticeText, m, y, cw, 4);
      y += 10;

      // Elder Abuse Warning
      y = newPage(y, 40);
      doc.setFillColor(255, 245, 238);
      doc.rect(m, y, cw, 35, 'F');
      doc.setDrawColor(200, 100, 100);
      doc.setLineWidth(0.5);
      doc.rect(m, y, cw, 35, 'S');
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
        ? 'El abuso de adultos mayores es un delito grave en California. El uso indebido de este poder notarial para robar o defraudar al poderdante puede resultar en cargos criminales y responsabilidad civil. Si sospecha de abuso, comuniquese con los Servicios de Proteccion de Adultos o la policia local.'
        : 'Elder abuse is a serious crime in California. Misuse of this power of attorney to steal from or defraud the principal can result in criminal charges and civil liability. If you suspect abuse, contact Adult Protective Services or local law enforcement.';
      y = wrap(abuseWarning, m + 4, y, cw - 8, 4);
      y += 15;

      // Agent Acceptance Signature
      y = newPage(y, 50);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'ACEPTACION DEL APODERADO' : 'AGENT ACCEPTANCE', m, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const acceptanceText = lang === 'es'
        ? 'Yo, el Apoderado nombrado en este Poder Notarial, reconozco haber leido y entendido el Aviso al Apoderado anterior. Acepto actuar como Apoderado bajo este Poder Notarial y acepto cumplir con todos los deberes descritos anteriormente.'
        : 'I, the Agent named in this Power of Attorney, acknowledge that I have read and understand the Notice to Agent above. I agree to act as Agent under this Power of Attorney and agree to comply with all duties described above.';
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
        ? 'Nosotros, los abajo firmantes, declaramos que el Poderdante firmo este Poder Notarial en nuestra presencia, o reconocio ante nosotros que la firma en este documento es suya. El Poderdante parecia estar en su sano juicio y no actuaba bajo coaccion, fraude o influencia indebida. Somos mayores de 18 anos y no somos nombrados como Apoderado o Apoderado Sucesor en este documento.'
        : 'We, the undersigned, declare that the Principal signed this Power of Attorney in our presence, or acknowledged to us that the signature on this document is theirs. The Principal appeared to be of sound mind and not acting under duress, fraud, or undue influence. We are at least 18 years of age and are not named as Agent or Successor Agent in this document.';
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
      doc.text(lang === 'es' ? '(California)' : '(California)', pw/2, y, {align: 'center'});
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
        ? 'Multiservicios 360 no es un bufete de abogados y no proporciona asesoria legal. Multiservicios 360 no prepara documentos legales en nombre de los usuarios. Multiservicios 360 proporciona acceso a herramientas de software que permiten a los usuarios crear sus propios documentos basandose unicamente en la informacion y selecciones proporcionadas por el usuario.\n\nNo se crea ninguna relacion abogado-cliente por el uso de este sistema. Cualquier servicio de revision o consulta de abogados, si se ofrece, se proporciona por separado y solo a solicitud expresa del usuario.'
        : 'Multiservicios 360 is not a law firm and does not provide legal advice. Multiservicios 360 does not prepare legal documents on behalf of users. Multiservicios 360 provides access to software tools that allow users to create their own documents based solely on information and selections provided by the user.\n\nNo attorney-client relationship is created by the use of this system. Any attorney review or consultation services, if offered, are provided separately and only upon the user\'s express request.';
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
        ? 'El usuario es el unico responsable de la precision, integridad y efecto legal de este documento. Multiservicios 360 no revisa, valida ni aprueba el contenido de los documentos generados por el usuario a menos que se solicite expresamente la revision de un abogado.'
        : 'The user is solely responsible for the accuracy, completeness, and legal effect of this document. Multiservicios 360 does not review, validate, or approve the substance of user-generated documents unless attorney review is expressly requested.';
      y = wrap(userResp, m, y, cw, 5);
      y += 10;

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
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(lang === 'es' ? 'RECONOCIMIENTO DEL USUARIO' : 'USER ACKNOWLEDGMENT', m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const userAck = lang === 'es'
        ? `Al firmar a continuacion, reconozco y acepto que:

• Yo cree este documento por mi cuenta utilizando herramientas de software proporcionadas por Multiservicios 360;

• No se me proporciono asesoria legal ni servicios de preparacion de documentos;

• Soy responsable de toda la informacion contenida en este documento; y

• Entiendo que este documento puede tener consecuencias legales significativas.`
        : `By signing below, I acknowledge and agree that:

• I created this document myself using software tools provided by Multiservicios 360;

• No legal advice or document preparation services were provided to me;

• I am responsible for all information contained in this document; and

• I understand that this document may have significant legal consequences.`;
      y = wrap(userAck, m, y, cw, 5);
      y += 20;

      // Signature lines
      doc.text(lang === 'es' ? 'Firma del Usuario: ' : 'User Signature: ', m, y);
      doc.line(m + 40, y, m + 140, y);
      y += 12;
      doc.text(lang === 'es' ? 'Nombre Impreso: ' : 'Printed Name: ', m, y);
      doc.line(m + 40, y, m + 140, y);
      y += 12;
      doc.text(lang === 'es' ? 'Fecha: ' : 'Date: ', m, y);
      doc.line(m + 20, y, m + 80, y);

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
        link.download = `POA_${(d.principal_name || 'Document').replace(/\s+/g, '_')}_${lang.toUpperCase()}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (notaryError) {
        console.error('Error fetching notary form:', notaryError);
        // Fallback - just save the document without the notary form and show alert
        doc.save(`POA_${(d.principal_name || 'Document').replace(/\s+/g, '_')}_${lang.toUpperCase()}.pdf`);
        alert(lang === 'es' 
          ? 'Documento generado. Por favor descargue el formulario notarial de: /api/notary-form' 
          : 'Document generated. Please download notary form from: /api/notary-form');
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(language === 'es' ? 'Error al generar el PDF. Por favor intente de nuevo.' : 'Error generating PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
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

        {/* Execution Date Input - Required before download */}
        <div style={{ 
          backgroundColor: '#FEF3C7', 
          border: '2px solid #F59E0B', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#92400E',
            marginBottom: '8px'
          }}>
            {language === 'es' ? 'Fecha de Ejecución (Requerida)' : 'Execution Date (Required)'} *
          </label>
          <p style={{ 
            fontSize: '12px', 
            color: '#B45309', 
            marginBottom: '12px',
            margin: '0 0 12px 0'
          }}>
            {language === 'es' 
              ? 'Ingrese la fecha en que firmará este documento (MM/DD/AAAA)' 
              : 'Enter the date you will sign this document (MM/DD/YYYY)'}
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
              placeholder="MM/DD/YYYY"
              maxLength={10}
              style={{
                padding: '12px 16px',
                fontSize: '16px',
                border: dateError ? '2px solid #DC2626' : '2px solid #D1D5DB',
                borderRadius: '6px',
                width: '160px',
                fontFamily: 'monospace'
              }}
            />
            <button
              type="button"
              onClick={() => setExecutionDate(getLADate())}
              style={{
                padding: '12px 16px',
                fontSize: '12px',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {language === 'es' ? 'Usar Fecha de Hoy' : "Use Today's Date"}
            </button>
          </div>
          {dateError && (
            <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '8px', margin: '8px 0 0 0' }}>
              {dateError}
            </p>
          )}
        </div>

        {/* Download Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <button onClick={() => generatePDF(language === 'es')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            <DownloadIcon /> {language === 'es' ? t.downloadSpanish : t.downloadEnglish}
          </button>
          
          {language === 'es' ? (
            <button onClick={() => generatePDF(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              <DownloadIcon /> {t.downloadEnglish}
            </button>
          ) : (
            <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              <PrintIcon /> {t.print}
            </button>
          )}
          
          {language === 'es' && (
            <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              <PrintIcon /> {t.print}
            </button>
          )}
          
          <button onClick={handleEmail} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            <EmailIcon /> {t.email}
          </button>
        </div>

        {/* Legal Note for Spanish users */}
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
            <li>{t.step4}</li>
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