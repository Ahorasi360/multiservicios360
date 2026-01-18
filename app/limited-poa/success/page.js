"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { jsPDF } from 'jspdf';

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
    subtitle: 'Su Poder Notarial Limitado esta listo',
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
    subtitle: 'Your Limited Power of Attorney is ready',
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

  const generatePDF = (isSpanish = false) => {
    if (!matterData?.intake_data) {
      alert('No data available');
      return;
    }
    const d = matterData.intake_data;
    const doc = new jsPDF();
    const lang = isSpanish ? 'es' : 'en';
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

    // Get POA type display name
    const getPoaTypeName = (type) => {
      const types = {
        'real_estate': { en: 'Real Estate', es: 'Bienes Raices' },
        'vehicle': { en: 'Vehicle', es: 'Vehiculo' },
        'banking': { en: 'Banking', es: 'Bancario' },
        'tax': { en: 'Tax', es: 'Impuestos' },
        'business': { en: 'Business', es: 'Negocios' },
        'child': { en: 'Minor Child', es: 'Menor de Edad' },
        'medical': { en: 'Medical Records', es: 'Registros Medicos' },
        'government': { en: 'Government Benefits', es: 'Beneficios del Gobierno' },
        'legal': { en: 'Legal Matters', es: 'Asuntos Legales' },
        'insurance': { en: 'Insurance', es: 'Seguros' },
      };
      return types[type] ? types[type][lang] : type;
    };

    const poaType = d.poa_type || 'general';
    const poaTypeName = getPoaTypeName(poaType);

    // ============================================
    // RECORDING HEADER (for real estate POAs)
    // ============================================
    if (poaType === 'real_estate' || d.record_for_real_estate) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text("Assessor's Parcel No.: " + (d.apn || '_______________________'), m, y);
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
    doc.text(lang === 'es' ? 'PODER NOTARIAL LIMITADO' : 'CALIFORNIA LIMITED', pw/2, y, {align: 'center'});
    y += 7;
    doc.setFontSize(16);
    doc.text(lang === 'es' ? 'ESTADO DE CALIFORNIA' : 'POWER OF ATTORNEY', pw/2, y, {align: 'center'});
    y += 7;
    doc.setFontSize(14);
    doc.text(`(${poaTypeName})`, pw/2, y, {align: 'center'});
    y += 4;
    doc.setLineWidth(0.5);
    doc.line(m, y, pw - m, y);
    y += 10;

    // ============================================
    // ATTORNEY REVIEW NOTICE (Recommended)
    // ============================================
    doc.setFillColor(240, 240, 240);
    doc.rect(m, y, cw, 38, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'AVISO DE REVISION DE ABOGADO (Recomendado)' : 'ATTORNEY REVIEW NOTICE (Recommended)', m + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const attorneyNotice = lang === 'es' 
      ? 'Este Poder Notarial Limitado esta disenado para propositos claramente definidos. Puede desear consultar con un abogado con licencia de California si: esta otorgando autoridad sobre bienes raices, esta otorgando autoridad sobre activos financieros significativos, no esta seguro de que este documento refleje completamente sus intenciones, o tiene una estructura patrimonial o empresarial compleja. La revision de un abogado no es requerida para que este documento sea valido bajo la ley de California.'
      : 'This Limited Power of Attorney is designed for clearly defined purposes. You may wish to consult with a licensed California attorney if: you are granting authority involving real estate, you are granting authority involving significant financial assets, you are uncertain whether this document fully reflects your intentions, or you have a complex estate or business structure. Attorney review is not required for this document to be valid under California law.';
    y = wrap(attorneyNotice, m + 4, y + 12, cw - 8, 4);
    y += 10;

    // ============================================
    // STATUTORY NOTICE TO PRINCIPAL (California Probate Code § 4128)
    // ============================================
    y = newPage(y, 80);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'AVISO A LA PERSONA QUE EJECUTA EL PODER NOTARIAL' : 'NOTICE TO PERSON EXECUTING POWER OF ATTORNEY', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    const noticeText = lang === 'es' 
      ? `Un poder notarial es un documento legal importante. Al firmar este poder notarial, usted esta autorizando a otra persona a actuar en su nombre, el poderdante. Antes de firmar este poder notarial, debe conocer estos hechos importantes:

Su agente (apoderado) no tiene obligacion de actuar a menos que usted y su agente acuerden lo contrario por escrito.

Este documento otorga a su agente los poderes limitados especificamente descritos en este documento. Este es un Poder Notarial LIMITADO y solo autoriza las acciones expresamente indicadas.

Su agente tendra derecho a recibir un pago razonable por los servicios prestados bajo este poder notarial a menos que usted disponga lo contrario.

Solo puede enmendar o cambiar este poder notarial ejecutando un nuevo poder notarial o ejecutando una enmienda con las mismas formalidades que un original.

Tiene derecho a revocar o terminar este poder notarial en cualquier momento, siempre que sea competente.

Este poder notarial debe estar fechado y debe ser reconocido ante un notario publico o firmado por dos testigos.

Debe leer este poder notarial cuidadosamente. El poder notarial es importante para usted. Si no entiende el poder notarial, o alguna disposicion del mismo, debe obtener la asistencia de un abogado u otra persona calificada.`
      : `A power of attorney is an important legal document. By signing the power of attorney, you are authorizing another person to act for you, the principal. Before you sign this power of attorney, you should know these important facts:

Your agent (attorney-in-fact) has no duty to act unless you and your agent agree otherwise in writing.

This document gives your agent the limited powers specifically described in this document. This is a LIMITED Power of Attorney and only authorizes the actions expressly stated herein.

Your agent will have the right to receive reasonable payment for services provided under this power of attorney unless you provide otherwise in this power of attorney.

You can amend or change this power of attorney only by executing a new power of attorney or by executing an amendment through the same formalities as an original.

You have the right to revoke or terminate this power of attorney at any time, so long as you are competent.

This power of attorney must be dated and must be acknowledged before a notary public or signed by two witnesses.

You should read this power of attorney carefully. The power of attorney is important to you. If you do not understand the power of attorney, or any provision of it, then you should obtain the assistance of an attorney or other qualified person.`;
    
    y = wrap(noticeText, m, y, cw, 4);
    y += 8;

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
        : ` (Relationship: ${d.agent_relationship})`;
    }
    y = wrap(agentText, m, y, cw, 5);
    y += 4;

    const asAgent = lang === 'es'
      ? 'como mi Apoderado (Attorney-in-Fact), para actuar en mi nombre de acuerdo con los terminos LIMITADOS de este Poder Notarial.'
      : 'as my Attorney-in-Fact (Agent), to act in my name and on my behalf pursuant to the LIMITED terms of this Power of Attorney.';
    y = wrap(asAgent, m, y, cw, 5);
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
        ? 'Si mi Apoderado Principal no puede o no quiere servir, o deja de actuar como mi Apoderado, designo al Apoderado Sucesor mencionado anteriormente para actuar en su lugar con todos los mismos poderes limitados y autoridad.'
        : 'If my Primary Agent is unable or unwilling to serve, or ceases to act as my Agent, I appoint the Successor Agent named above to act in their place with all the same limited powers and authority.';
      y = wrap(successorClause, m, y, cw, 5);
      y += 6;
    }

    // ============================================
    // ARTICLE II - SCOPE AND PURPOSE
    // ============================================
    y = newPage(y, 40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO II - ALCANCE Y PROPOSITO' : 'ARTICLE II - SCOPE AND PURPOSE', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const scopeText = lang === 'es'
      ? `Este es un PODER NOTARIAL LIMITADO. La autoridad otorgada en este documento esta especificamente limitada a asuntos de ${poaTypeName} como se describe a continuacion. Mi Apoderado NO tiene autoridad para actuar en mi nombre en ningun otro asunto no expresamente autorizado en este documento.`
      : `This is a LIMITED POWER OF ATTORNEY. The authority granted in this document is specifically limited to ${poaTypeName} matters as described below. My Agent does NOT have authority to act on my behalf in any other matters not expressly authorized in this document.`;
    y = wrap(scopeText, m, y, cw, 5);
    y += 8;

    // ============================================
    // ARTICLE III - EFFECTIVE DATE AND DURATION
    // ============================================
    section(lang === 'es' ? 'ARTICULO III - FECHA EFECTIVA Y DURACION' : 'ARTICLE III - EFFECTIVE DATE AND DURATION',
      lang === 'es'
        ? `Este Poder Notarial Limitado sera efectivo INMEDIATAMENTE al ser ejecutado${d.expiration_date ? ` y expirara el ${d.expiration_date}` : ' y permanecera en efecto hasta que sea revocado por escrito o hasta que se complete el proposito especifico para el cual fue otorgado'}. Este Poder Notarial NO es duradero y terminara automaticamente si quedo incapacitado o discapacitado.`
        : `This Limited Power of Attorney shall be effective IMMEDIATELY upon execution${d.expiration_date ? ` and shall expire on ${d.expiration_date}` : ' and shall remain in effect until revoked in writing or until the specific purpose for which it was granted is completed'}. This Power of Attorney is NOT durable and shall automatically terminate upon my incapacity or disability.`
    );

    // ============================================
    // ARTICLE IV - SPECIFIC LIMITED POWERS GRANTED
    // ============================================
    y = newPage(y, 60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO IV - PODERES LIMITADOS ESPECIFICOS OTORGADOS' : 'ARTICLE IV - SPECIFIC LIMITED POWERS GRANTED', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const powersIntro = lang === 'es'
      ? `Otorgo a mi Apoderado los siguientes poderes LIMITADOS con respecto a asuntos de ${poaTypeName} UNICAMENTE:`
      : `I grant my Agent the following LIMITED powers with respect to ${poaTypeName} matters ONLY:`;
    y = wrap(powersIntro, m, y, cw, 5);
    y += 6;

    // Type-specific powers
    const getTypePowers = () => {
      switch(poaType) {
        case 'real_estate':
          return lang === 'es' ? [
            'Firmar todos los documentos necesarios para completar la venta, compra, refinanciamiento o transferencia de bienes inmuebles',
            'Ejecutar escrituras de concesion, escrituras de renuncia, escrituras de fideicomiso y reconveyances',
            'Firmar documentos de cierre y declaraciones de liquidacion',
            'Recibir y desembolsar fondos relacionados con la transaccion',
            'Contratar con agentes de bienes raices, companias de titulo y companias de deposito en garantia',
            'Firmar declaraciones de divulgacion y otros formularios requeridos',
          ] : [
            'Sign all documents necessary to complete the sale, purchase, refinancing, or transfer of real property',
            'Execute grant deeds, quitclaim deeds, deeds of trust, and reconveyances',
            'Sign closing documents and settlement statements',
            'Receive and disburse funds related to the transaction',
            'Contract with real estate agents, title companies, and escrow companies',
            'Sign disclosure statements and other required forms',
          ];
        case 'vehicle':
          return lang === 'es' ? [
            'Firmar el titulo del vehiculo y documentos de transferencia',
            'Completar formularios del DMV incluyendo REG 262 y REG 227',
            'Registrar o transferir el registro del vehiculo',
            'Obtener placas duplicadas o documentos de titulo',
            'Firmar documentos de venta o compra de vehiculo',
            'Manejar reclamos de seguro relacionados con el vehiculo',
          ] : [
            'Sign vehicle title and transfer documents',
            'Complete DMV forms including REG 262 and REG 227',
            'Register or transfer vehicle registration',
            'Obtain duplicate plates or title documents',
            'Sign vehicle sale or purchase documents',
            'Handle insurance claims related to the vehicle',
          ];
        case 'banking':
          return lang === 'es' ? [
            'Abrir, cerrar o modificar cuentas bancarias',
            'Depositar y retirar fondos',
            'Firmar cheques y autorizar transferencias electronicas',
            'Acceder a cajas de seguridad',
            'Obtener estados de cuenta e informacion de cuentas',
            'Negociar con instituciones financieras sobre terminos de cuentas',
          ] : [
            'Open, close, or modify bank accounts',
            'Deposit and withdraw funds',
            'Sign checks and authorize electronic transfers',
            'Access safe deposit boxes',
            'Obtain account statements and information',
            'Negotiate with financial institutions regarding account terms',
          ];
        case 'tax':
          return lang === 'es' ? [
            'Preparar, firmar y presentar declaraciones de impuestos federales, estatales y locales',
            'Representarme ante el IRS, FTB y otras autoridades fiscales',
            'Firmar Formulario IRS 2848 (Poder Notarial) y Formulario 8821 (Autorizacion de Informacion Fiscal)',
            'Reclamar reembolsos y recibir cheques de reembolso',
            'Responder a auditorias y avisos fiscales',
            'Negociar y resolver disputas fiscales',
          ] : [
            'Prepare, sign, and file federal, state, and local tax returns',
            'Represent me before the IRS, FTB, and other tax authorities',
            'Sign IRS Form 2848 (Power of Attorney) and Form 8821 (Tax Information Authorization)',
            'Claim refunds and receive refund checks',
            'Respond to audits and tax notices',
            'Negotiate and settle tax disputes',
          ];
        case 'business':
          return lang === 'es' ? [
            'Firmar contratos y acuerdos comerciales',
            'Administrar operaciones comerciales diarias',
            'Contratar y despedir empleados',
            'Abrir y administrar cuentas bancarias comerciales',
            'Firmar documentos relacionados con permisos y licencias comerciales',
            'Representar el negocio en negociaciones y tratos',
          ] : [
            'Sign business contracts and agreements',
            'Manage day-to-day business operations',
            'Hire and terminate employees',
            'Open and manage business bank accounts',
            'Sign documents related to business permits and licenses',
            'Represent the business in negotiations and dealings',
          ];
        case 'insurance':
          return lang === 'es' ? [
            'Solicitar y obtener polizas de seguro',
            'Presentar reclamos bajo polizas existentes',
            'Cobrar beneficios de seguros',
            'Cancelar o modificar cobertura de seguro',
            'Negociar acuerdos con companias de seguros',
            'Firmar documentos de seguro en mi nombre',
          ] : [
            'Apply for and obtain insurance policies',
            'File claims under existing policies',
            'Collect insurance proceeds',
            'Cancel or modify insurance coverage',
            'Negotiate settlements with insurance companies',
            'Sign insurance documents on my behalf',
          ];
        case 'government':
          return lang === 'es' ? [
            'Solicitar beneficios del Seguro Social, Medicare, Medi-Cal y otros programas gubernamentales',
            'Recibir y administrar pagos de beneficios',
            'Representarme ante agencias gubernamentales',
            'Apelar decisiones adversas',
            'Firmar formularios y solicitudes',
            'Obtener informacion sobre mis beneficios',
          ] : [
            'Apply for Social Security, Medicare, Medi-Cal, and other government benefits',
            'Receive and manage benefit payments',
            'Represent me before government agencies',
            'Appeal adverse decisions',
            'Sign forms and applications',
            'Obtain information about my benefits',
          ];
        default:
          return lang === 'es' ? [
            'Los poderes especificos como se describe en las instrucciones especiales a continuacion',
          ] : [
            'Specific powers as described in the special instructions below',
          ];
      }
    };

    const typePowers = getTypePowers();
    typePowers.forEach((power, index) => {
      y = newPage(y, 12);
      doc.setFontSize(10);
      doc.text(`${index + 1}.`, m, y);
      y = wrap(power, m + 8, y, cw - 8, 4.5);
      y += 3;
    });
    y += 5;

    // Property/Transaction specific details
    if (d.property_address || d.vehicle_info || d.account_info || d.specific_transaction) {
      y = newPage(y, 30);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'PROPIEDAD/TRANSACCION ESPECIFICA:' : 'SPECIFIC PROPERTY/TRANSACTION:', m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      
      if (d.property_address) {
        y = wrap((lang === 'es' ? 'Direccion de la Propiedad: ' : 'Property Address: ') + d.property_address, m, y, cw, 5);
        y += 3;
      }
      if (d.apn) {
        y = wrap((lang === 'es' ? 'Numero de Parcela del Tasador (APN): ' : "Assessor's Parcel Number (APN): ") + d.apn, m, y, cw, 5);
        y += 3;
      }
      if (d.vehicle_info) {
        y = wrap((lang === 'es' ? 'Informacion del Vehiculo: ' : 'Vehicle Information: ') + d.vehicle_info, m, y, cw, 5);
        y += 3;
      }
      if (d.account_info) {
        y = wrap((lang === 'es' ? 'Informacion de la Cuenta: ' : 'Account Information: ') + d.account_info, m, y, cw, 5);
        y += 3;
      }
      if (d.specific_transaction) {
        y = wrap((lang === 'es' ? 'Transaccion Especifica: ' : 'Specific Transaction: ') + d.specific_transaction, m, y, cw, 5);
        y += 3;
      }
      y += 5;
    }

    // ============================================
    // ARTICLE V - LIMITATIONS ON AUTHORITY
    // ============================================
    section(lang === 'es' ? 'ARTICULO V - LIMITACIONES DE AUTORIDAD' : 'ARTICLE V - LIMITATIONS ON AUTHORITY',
      lang === 'es'
        ? `Este Poder Notarial esta LIMITADO a los propositos especificos descritos anteriormente. Mi Apoderado NO tiene autoridad para: (a) Actuar en cualquier asunto no expresamente autorizado en este documento; (b) Tomar decisiones de atencion medica; (c) Hacer regalos de mi propiedad; (d) Cambiar designaciones de beneficiarios; (e) Crear, modificar o revocar un fideicomiso; (f) Delegar autoridad a otra persona.`
        : `This Power of Attorney is LIMITED to the specific purposes described above. My Agent does NOT have authority to: (a) Act in any matter not expressly authorized in this document; (b) Make health care decisions; (c) Make gifts of my property; (d) Change beneficiary designations; (e) Create, modify, or revoke a trust; (f) Delegate authority to another person.`
    );

    // Special Instructions
    if (d.special_instructions && d.has_special_instructions) {
      y = newPage(y, 25);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'INSTRUCCIONES ESPECIALES:' : 'SPECIAL INSTRUCTIONS:', m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      y = wrap(d.special_instructions, m, y, cw, 5);
      y += 8;
    }

    // ============================================
    // ARTICLE VI - GENERAL PROVISIONS
    // ============================================
    y = newPage(y, 60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO VI - DISPOSICIONES GENERALES' : 'ARTICLE VI - GENERAL PROVISIONS', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    const provisions = lang === 'es' ? [
      '1) Confianza de Terceros. Cualquier tercero puede confiar en la autoridad otorgada en este Poder Notarial conforme a la Seccion 4303 del Codigo de Sucesiones de California.',
      '2) Indemnizacion. Mi Apoderado sera indemnizado de mi patrimonio por cualquier responsabilidad que surja de acciones de buena fe tomadas conforme a este Poder Notarial.',
      '3) Compensacion. Mi Apoderado tiene derecho a una compensacion razonable por los servicios prestados, a menos que se renuncie expresamente.',
      '4) Divisibilidad. Si alguna disposicion de este Poder Notarial es invalida, las disposiciones restantes permaneceran en efecto.',
      '5) Ley Aplicable. Este Poder Notarial se regira por las leyes del Estado de California.',
      '6) Revocacion. Puedo revocar este Poder Notarial en cualquier momento mediante notificacion escrita a mi Apoderado.',
    ] : [
      '1) Third Party Reliance. Any third party may rely upon the authority granted in this Power of Attorney pursuant to California Probate Code Section 4303.',
      '2) Indemnification. My Agent shall be indemnified from my estate for any liability arising from good faith actions taken pursuant to this Power of Attorney.',
      '3) Compensation. My Agent is entitled to reasonable compensation for services rendered, unless expressly waived.',
      '4) Severability. If any provision of this Power of Attorney is invalid, the remaining provisions shall remain in effect.',
      '5) Governing Law. This Power of Attorney shall be governed by the laws of the State of California.',
      '6) Revocation. I may revoke this Power of Attorney at any time by written notice to my Agent.',
    ];

    provisions.forEach(prov => {
      y = newPage(y, 12);
      y = wrap(prov, m, y, cw, 4);
      y += 3;
    });

    // ============================================
    // EXECUTION PAGE
    // ============================================
    y = newPage(y, 80);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO VII - EJECUCION' : 'ARTICLE VII - EXECUTION', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(lang === 'es' 
      ? 'EN FE DE LO CUAL, he ejecutado este Poder Notarial Limitado en la fecha indicada a continuacion.' 
      : 'IN WITNESS WHEREOF, I have executed this Limited Power of Attorney on the date written below.', m, y);
    y += 12;
    doc.text((lang === 'es' ? 'Fecha de Ejecucion: ' : 'Date of Execution: ') + '________________________', m, y);
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
    // NOTARY ACKNOWLEDGMENT - NEW PAGE (FIXED WITH CA SOS DISCLAIMER BOX)
    // ============================================
    doc.addPage();
    y = 20;
    
    // Top border line
    doc.setLineWidth(1);
    doc.line(m, y, pw - m, y);
    y += 8;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'RECONOCIMIENTO NOTARIAL DE CALIFORNIA' : 'CALIFORNIA ALL-PURPOSE ACKNOWLEDGMENT', pw/2, y, {align: 'center'});
    y += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(lang === 'es' ? 'CODIGO CIVIL §1189' : 'CIVIL CODE §1189', pw/2, y, {align: 'center'});
    y += 5;
    
    // Bottom border line after header
    doc.setLineWidth(1);
    doc.line(m, y, pw - m, y);
    y += 10;

    // ===== REQUIRED DISCLAIMER BOX (California Secretary of State format) =====
    const disclaimerBoxY = y;
    const disclaimerBoxHeight = 18;
    doc.setLineWidth(0.5);
    doc.rect(m, disclaimerBoxY, cw, disclaimerBoxHeight);
    
    // Disclaimer text inside the box
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const disclaimerLine1 = lang === 'es'
      ? 'Un notario publico u otro oficial que complete este certificado verifica solamente la identidad de la persona'
      : 'A notary public or other officer completing this certificate verifies only the identity of the individual';
    const disclaimerLine2 = lang === 'es'
      ? 'que firmo el documento al cual este certificado esta adjunto, y no la veracidad, exactitud o validez de ese documento.'
      : 'who signed the document to which this certificate is attached, and not the truthfulness, accuracy, or validity of that document.';
    
    doc.text(disclaimerLine1, m + 2, disclaimerBoxY + 7);
    doc.text(disclaimerLine2, m + 2, disclaimerBoxY + 12);
    
    y = disclaimerBoxY + disclaimerBoxHeight + 8;
    
    // Decorative line
    doc.setLineWidth(0.3);
    doc.line(m, y, pw - m, y);
    y += 10;

    // State and County
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(lang === 'es' ? 'Estado de California' : 'State of California', m, y);
    y += 7;
    doc.text((lang === 'es' ? 'Condado de ' : 'County of ') + (d.principal_county || '______________________________'), m, y);
    y += 12;

    // On date before me
    doc.text((lang === 'es' ? 'El ' : 'On ') + '_________________________ ' + (lang === 'es' ? 'ante mi, ' : 'before me, ') + '_________________________________________,', m, y);
    y += 5;
    doc.setFontSize(8);
    doc.text(lang === 'es' ? '                    (Fecha)                                                                        (Nombre y Titulo del Notario)' : '                    (Date)                                                                              (Notary Name and Title)', m, y);
    y += 10;

    // Personally appeared
    doc.setFontSize(11);
    doc.text((lang === 'es' ? 'comparecio personalmente ' : 'personally appeared ') + (d.principal_name || '________________________________________________') + ',', m, y);
    y += 12;

    // Main acknowledgment text
    doc.setFontSize(10);
    const notaryText = lang === 'es'
      ? 'quien me demostro, basandose en evidencia satisfactoria, ser la(s) persona(s) cuyo(s) nombre(s) esta(n) suscrito(s) al instrumento adjunto y reconocio ante mi que el/ella/ellos ejecuto el mismo en su(s) capacidad(es) autorizada(s), y que mediante su(s) firma(s) en el instrumento, la(s) persona(s), o la entidad en nombre de la cual la(s) persona(s) actuo, ejecuto el instrumento.'
      : 'who proved to me on the basis of satisfactory evidence to be the person(s) whose name(s) is/are subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their authorized capacity(ies), and that by his/her/their signature(s) on the instrument the person(s), or the entity upon behalf of which the person(s) acted, executed the instrument.';
    y = wrap(notaryText, m, y, cw, 5);
    y += 10;

    // Certification under penalty of perjury
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    const certifyText = lang === 'es'
      ? 'Certifico bajo PENA DE PERJURIO bajo las leyes del Estado de California que el parrafo anterior es verdadero y correcto.'
      : 'I certify under PENALTY OF PERJURY under the laws of the State of California that the foregoing paragraph is true and correct.';
    y = wrap(certifyText, m, y, cw, 5);
    y += 10;

    // WITNESS my hand
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(lang === 'es' ? 'DOY FE con mi firma y sello oficial.' : 'WITNESS my hand and official seal.', m, y);
    y += 15;

    // Signature line
    doc.text((lang === 'es' ? 'Firma del Notario: ' : 'Notary Public Signature: ') + '________________________________________', m, y);
    y += 15;

    // Two-column layout: Seal box on left, optional info on right
    const sealBoxY = y;
    
    // Seal box (left side)
    doc.setLineWidth(0.5);
    doc.rect(m, sealBoxY, 55, 40);
    doc.setFontSize(9);
    doc.text(lang === 'es' ? 'SELLO NOTARIAL' : 'NOTARY SEAL', m + 12, sealBoxY + 22);
    
    // Optional information section (right side)
    const optX = m + 65;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'INFORMACION OPCIONAL' : 'OPTIONAL INFORMATION', optX, sealBoxY + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const optText1 = lang === 'es'
      ? 'Aunque esta seccion es opcional, completarla puede'
      : 'Though this section is optional, completing it may';
    const optText2 = lang === 'es'
      ? 'disuadir alteraciones o adjuntos fraudulentos de este'
      : 'deter alteration or fraudulent attachment of this';
    const optText3 = lang === 'es'
      ? 'reconocimiento a un documento no autorizado.'
      : 'acknowledgment to an unauthorized document.';
    doc.text(optText1, optX, sealBoxY + 10);
    doc.text(optText2, optX, sealBoxY + 14);
    doc.text(optText3, optX, sealBoxY + 18);
    
    doc.setFontSize(8);
    doc.text((lang === 'es' ? 'Descripcion del Documento Adjunto:' : 'Description of Attached Document:'), optX, sealBoxY + 25);
    doc.text((lang === 'es' ? `Titulo o Tipo: Poder Notarial Limitado (${poaTypeName})` : `Title or Type: Limited Power of Attorney (${poaTypeName})`), optX, sealBoxY + 30);
    doc.text((lang === 'es' ? 'Numero de Paginas: _____ Fecha: _____' : 'Number of Pages: _____ Date: _____'), optX, sealBoxY + 35);
    
    y = sealBoxY + 48;

    // Commission expires
    doc.setFontSize(9);
    doc.text((lang === 'es' ? 'Mi Comision Expira: ' : 'My Commission Expires: ') + '_________________________', m, y);
    y += 8;
    
    // Bottom decorative line
    doc.setLineWidth(0.3);
    doc.line(m, y, pw - m, y);
    y += 8;
    
    // ===== BOTTOM DISCLAIMER BOX (matching California SOS format) =====
    const bottomBoxY = y;
    const bottomBoxHeight = 32;
    doc.setLineWidth(1);
    doc.rect(m, bottomBoxY, cw, bottomBoxHeight);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    const impDisclaimer = lang === 'es' ? 'AVISO IMPORTANTE' : 'IMPORTANT NOTICE';
    const impWidth = doc.getTextWidth(impDisclaimer);
    doc.text(impDisclaimer, (pw - impWidth) / 2, bottomBoxY + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    
    const bottomLines = lang === 'es' ? [
      'Un notario publico u otro oficial que complete este certificado verifica solamente la identidad de la persona que firmo',
      'el documento al cual este certificado esta adjunto, y no la veracidad, exactitud o validez de ese documento.',
      '',
      `Este certificado esta adjunto a un documento titulado "Poder Notarial Limitado (${poaTypeName})."`,
      'El notario publico no es responsable de ninguna declaracion hecha en el documento por ninguna de las partes.',
      'La ley estatal prohibe a un notario publico actuar como consultor de inmigracion o proporcionar asesoramiento legal.'
    ] : [
      'A notary public or other officer completing this certificate verifies only the identity of the individual who signed the',
      'document to which this certificate is attached, and not the truthfulness, accuracy, or validity of that document.',
      '',
      `This certificate is attached to a document titled "Limited Power of Attorney (${poaTypeName})."`,
      'The notary public is not responsible for any statements made in the document by any party.',
      'State law prohibits a notary public from acting as an immigration consultant or providing legal advice.'
    ];
    
    let lineY = bottomBoxY + 10;
    bottomLines.forEach(line => {
      if (line === '') {
        lineY += 2;
      } else {
        doc.text(line, m + 2, lineY);
        lineY += 4;
      }
    });

    // ============================================
    // NOTICE TO AGENT PAGE (California Probate Code § 4128)
    // ============================================
    doc.addPage();
    y = 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'AVISO A LA PERSONA QUE ACEPTA' : 'NOTICE TO PERSON ACCEPTING', pw/2, y, {align: 'center'});
    y += 6;
    doc.text(lang === 'es' ? 'NOMBRAMIENTO COMO APODERADO' : 'APPOINTMENT AS ATTORNEY-IN-FACT', pw/2, y, {align: 'center'});
    y += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const agentNotice = lang === 'es'
      ? `Al actuar o aceptar actuar como el agente (apoderado) bajo este poder notarial, usted asume las responsabilidades fiduciarias y otras responsabilidades legales de un agente. Estas responsabilidades incluyen:

1. El deber legal de actuar unicamente en interes del poderdante y evitar conflictos de interes.

2. El deber legal de mantener la propiedad del poderdante separada y distinta de cualquier otra propiedad que usted posea o controle.

3. El deber legal de actuar SOLAMENTE dentro del alcance limitado de autoridad otorgada en este documento.

No puede transferir la propiedad del poderdante a usted mismo sin una contraprestacion completa y adecuada, ni aceptar un regalo de la propiedad del poderdante. Si transfiere la propiedad del poderdante a usted mismo sin autorizacion especifica, puede ser procesado por fraude y/o malversacion.

Si el poderdante tiene 65 anos de edad o mas en el momento en que la propiedad le es transferida sin autorizacion, tambien puede ser procesado por abuso de ancianos bajo la Seccion 368 del Codigo Penal. Ademas del enjuiciamiento penal, tambien puede ser demandado en un tribunal civil.`
      : `By acting or agreeing to act as the agent (attorney-in-fact) under this power of attorney you assume the fiduciary and other legal responsibilities of an agent. These responsibilities include:

1. The legal duty to act solely in the interest of the principal and to avoid conflicts of interest.

2. The legal duty to keep the principal's property separate and distinct from any other property owned or controlled by you.

3. The legal duty to act ONLY within the limited scope of authority granted in this document.

You may not transfer the principal's property to yourself without full and adequate consideration or accept a gift of the principal's property. If you transfer the principal's property to yourself without specific authorization, you may be prosecuted for fraud and/or embezzlement.

If the principal is 65 years of age or older at the time that the property is transferred to you without authority, you may also be prosecuted for elder abuse under Penal Code Section 368. In addition to criminal prosecution, you may also be sued in civil court.`;

    y = wrap(agentNotice, m, y, cw, 5);
    y += 15;

    doc.setFont('helvetica', 'bold');
    const acknowledgment = lang === 'es'
      ? 'He leido el aviso anterior y entiendo los deberes legales y fiduciarios que asumo al actuar o aceptar actuar como el agente (apoderado) bajo los terminos de este poder notarial LIMITADO.'
      : 'I have read the foregoing notice and I understand the legal and fiduciary duties that I assume by acting or agreeing to act as the agent (attorney-in-fact) under the terms of this LIMITED power of attorney.';
    y = wrap(acknowledgment, m, y, cw, 5);
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.text((lang === 'es' ? 'Fecha: ' : 'Date: ') + '___________________', m, y);
    y += 20;
    doc.line(m, y, m + 80, y);
    y += 5;
    doc.text((lang === 'es' ? 'Firma de ' : 'Signature of ') + (d.agent_name || 'Agent'), m, y);

    // ============================================
    // OPTIONAL: WITNESS ATTESTATION PAGE
    // ============================================
    doc.addPage();
    y = 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'DECLARACION DE TESTIGOS (OPCIONAL)' : 'WITNESS ATTESTATION (OPTIONAL)', pw/2, y, {align: 'center'});
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(lang === 'es' ? '(No requerido por ley de California, pero recomendado)' : '(Not required by California law, but recommended)', pw/2, y, {align: 'center'});
    y += 3;
    doc.line(m, y, pw - m, y);
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const witnessText = lang === 'es'
      ? 'Nosotros, los abajo firmantes, declaramos bajo pena de perjurio bajo las leyes del Estado de California que el Poderdante firmo este Poder Notarial Limitado en nuestra presencia, y que a nuestro leal saber y entender el Poderdante es mayor de dieciocho (18) anos de edad, de mente sana, y bajo ninguna restriccion o influencia indebida.\n\nDeclaramos ademas que no somos el Apoderado designado en este documento, que no estamos relacionados con el Poderdante por sangre, matrimonio o adopcion, y que no tenemos derecho a ninguna parte del patrimonio del Poderdante al fallecer bajo un testamento o por operacion de ley.'
      : 'We, the undersigned, declare under penalty of perjury under the laws of the State of California that the Principal signed this Limited Power of Attorney in our presence, and that to the best of our knowledge the Principal is over eighteen (18) years of age, of sound mind, and under no constraint or undue influence.\n\nWe further declare that we are not the Agent designated in this document, that we are not related to the Principal by blood, marriage, or adoption, and that we are not entitled to any part of the Principal\'s estate upon death under a will or by operation of law.';
    y = wrap(witnessText, m, y, cw, 5);
    y += 20;

    // Witness 1
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'TESTIGO 1:' : 'WITNESS 1:', m, y);
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.line(m, y, m + 80, y);
    doc.text(lang === 'es' ? 'Firma' : 'Signature', m, y + 5);
    doc.line(m + 100, y, pw - m, y);
    doc.text(lang === 'es' ? 'Fecha' : 'Date', m + 100, y + 5);
    y += 15;
    doc.line(m, y, m + 80, y);
    doc.text(lang === 'es' ? 'Nombre Impreso' : 'Printed Name', m, y + 5);
    y += 15;
    doc.line(m, y, pw - m, y);
    doc.text(lang === 'es' ? 'Direccion' : 'Address', m, y + 5);
    y += 25;

    // Witness 2
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'TESTIGO 2:' : 'WITNESS 2:', m, y);
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.line(m, y, m + 80, y);
    doc.text(lang === 'es' ? 'Firma' : 'Signature', m, y + 5);
    doc.line(m + 100, y, pw - m, y);
    doc.text(lang === 'es' ? 'Fecha' : 'Date', m + 100, y + 5);
    y += 15;
    doc.line(m, y, m + 80, y);
    doc.text(lang === 'es' ? 'Nombre Impreso' : 'Printed Name', m, y + 5);
    y += 15;
    doc.line(m, y, pw - m, y);
    doc.text(lang === 'es' ? 'Direccion' : 'Address', m, y + 5);

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

    // Save the PDF
    const fileName = `Limited_POA_${poaTypeName}_${(d.principal_name || 'Document').replace(/\s+/g, '_')}_${lang.toUpperCase()}.pdf`;
    doc.save(fileName);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(language === 'es' ? 'Poder Notarial Limitado - Multi Servicios 360' : 'Limited Power of Attorney - Multi Servicios 360');
    const body = encodeURIComponent(language === 'es' 
      ? 'Adjunto encontrara su Poder Notarial Limitado. Por favor descargue los documentos PDF desde su cuenta.\n\nMulti Servicios 360\n855.246.7274' 
      : 'Please find attached your Limited Power of Attorney documents. Please download the PDF documents from your account.\n\nMulti Servicios 360\n855.246.7274');
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

export default function LimitedPOAPaymentSuccessPage() {
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