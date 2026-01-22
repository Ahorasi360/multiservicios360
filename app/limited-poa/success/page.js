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
    email: 'Email',
    nextSteps: 'Next Steps',
    step1: 'Download your PDF documents',
    step2: 'Review the document carefully',
    step3: 'Sign in front of a notary public',
    step4: 'Store copies in a safe place',
    questions: 'Questions?',
    contact: 'Contact us at 855.246.7274',
    backHome: 'Back to Home',
    legalNote: 'Note: The English document is the official legal document. The Spanish document is for your reference.',
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
      if (d.re_sign_tax_forms) powers.push(lang === 'en' ? 'Sign IRS Form 593 and PCOR' : 'Firmar Formulario 593 del IRS y PCOR');
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

    const d = matterData.intake_data || {};
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const m = 20; // margin
    const cw = pw - (m * 2); // content width
    let y = 20;

    // Helper function to wrap text
    const wrap = (text, x, startY, maxWidth, lineHeight = 5) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        if (startY > ph - 30) {
          doc.addPage();
          startY = 20;
          addFooter();
        }
        doc.text(line, x, startY);
        startY += lineHeight;
      });
      return startY;
    };

    // Helper function for sections
    const section = (title, content) => {
      if (y > ph - 60) {
        doc.addPage();
        y = 20;
        addFooter();
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(title, m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      y = wrap(content, m, y, cw, 5);
      y += 8;
    };

    // Footer function
    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Multi Servicios 360 | www.multiservicios360.net | 855.246.7274`, pw / 2, ph - 10, { align: 'center' });
      doc.text(`Page ${pageCount}`, pw - m, ph - 10, { align: 'right' });
    };

    // Get category name
    const categoryName = getPurposeLabel(d.purpose_category, lang);

    // ===== PAGE 1: TITLE AND HEADER =====
    
    // Recording header for real estate
    if (d.purpose_category === 'real_estate') {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('RECORDING REQUESTED BY:', m, y);
      doc.text('Multi Servicios 360', m, y + 4);
      doc.text('WHEN RECORDED MAIL TO:', m, y + 12);
      doc.text(d.principal_name || '_______________', m, y + 16);
      doc.text(d.principal_address || '_______________', m, y + 20);
      
      doc.text('APN: ' + (d.re_apn || '_______________'), pw - m - 50, y);
      doc.text('Space Above This Line For Recorder\'s Use', pw / 2, y + 28, { align: 'center' });
      doc.setLineWidth(0.5);
      doc.line(m, y + 30, pw - m, y + 30);
      y += 40;
    }

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(lang === 'es' ? 'PODER NOTARIAL LIMITADO' : 'CALIFORNIA LIMITED POWER OF ATTORNEY', pw / 2, y, { align: 'center' });
    y += 6;
    doc.setFontSize(12);
    doc.text(`(${categoryName})`, pw / 2, y, { align: 'center' });
    y += 10;

    // Attorney Review Notice Box
    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(m, y, cw, 35, 2, 2, 'FD');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'AVISO DE REVISION DE ABOGADO' : 'ATTORNEY REVIEW NOTICE', m + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const attorneyNotice = lang === 'es'
      ? 'Este Poder Notarial Limitado esta disenado para un proposito especifico. Se recomienda consultar con un abogado si tiene preguntas sobre el alcance de la autoridad otorgada.'
      : 'This Limited Power of Attorney is designed for a specific purpose. Attorney review is recommended if you have questions about the scope of authority granted.';
    wrap(attorneyNotice, m + 4, y + 12, cw - 8, 4);
    y += 42;

    // Statutory Notice
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(lang === 'es' ? 'AVISO LEGAL (Codigo de Sucesiones de California)' : 'STATUTORY NOTICE (California Probate Code)', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const statutoryNotice = lang === 'es'
      ? 'Este poder notarial limitado autoriza a otra persona (su agente) a actuar en su nombre solo para el proposito especifico indicado. El agente tiene el deber fiduciario de actuar en su mejor interes.'
      : 'This limited power of attorney authorizes another person (your agent) to act on your behalf only for the specific purpose stated. The agent has a fiduciary duty to act in your best interest.';
    y = wrap(statutoryNotice, m, y, cw, 4);
    y += 10;

    // ===== ARTICLE I: PARTIES =====
    section(lang === 'es' ? 'ARTICULO I - PARTES' : 'ARTICLE I - PARTIES',
      lang === 'es'
        ? `Yo, ${d.principal_name || '_______________'}, residente de ${d.principal_address || '_______________'} ("Poderdante"), por medio del presente designo a ${d.agent_name || '_______________'}, residente de ${d.agent_address || '_______________'} ("Apoderado"), para actuar en mi nombre para el proposito limitado descrito en este documento.`
        : `I, ${d.principal_name || '_______________'}, residing at ${d.principal_address || '_______________'} ("Principal"), hereby appoint ${d.agent_name || '_______________'}, residing at ${d.agent_address || '_______________'} ("Agent"), to act on my behalf for the limited purpose described in this document.`
    );

    // ===== ARTICLE II: PURPOSE AND SCOPE =====
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(lang === 'es' ? 'ARTICULO II - PROPOSITO Y ALCANCE' : 'ARTICLE II - PURPOSE AND SCOPE', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const purposeIntro = lang === 'es'
      ? `Este Poder Notarial Limitado se otorga exclusivamente para el siguiente proposito: ${categoryName}.`
      : `This Limited Power of Attorney is granted exclusively for the following purpose: ${categoryName}.`;
    y = wrap(purposeIntro, m, y, cw, 5);
    y += 4;

    // Property details for real estate
    if (d.purpose_category === 'real_estate' && d.re_property_address) {
      const propertyText = lang === 'es'
        ? `Propiedad: ${d.re_property_address}, Condado de ${d.re_property_county || '___'}, California. APN: ${d.re_apn || '___'}`
        : `Property: ${d.re_property_address}, ${d.re_property_county || '___'} County, California. APN: ${d.re_apn || '___'}`;
      y = wrap(propertyText, m, y, cw, 5);
      y += 4;
    }

    // Vehicle details
    if (d.purpose_category === 'vehicle' && d.vehicle_vin) {
      const vehicleText = lang === 'es'
        ? `Vehiculo: ${d.vehicle_year || '___'} ${d.vehicle_make || '___'} ${d.vehicle_model || '___'}, VIN: ${d.vehicle_vin}`
        : `Vehicle: ${d.vehicle_year || '___'} ${d.vehicle_make || '___'} ${d.vehicle_model || '___'}, VIN: ${d.vehicle_vin}`;
      y = wrap(vehicleText, m, y, cw, 5);
      y += 4;
    }

    // Insurance details
    if (d.purpose_category === 'insurance' && d.insurance_claim_description) {
      const insuranceText = lang === 'es'
        ? `Reclamo: ${d.insurance_claim_description}`
        : `Claim: ${d.insurance_claim_description}`;
      y = wrap(insuranceText, m, y, cw, 5);
      y += 4;
    }

    y += 6;

    // ===== ARTICLE III: GRANTED POWERS =====
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(lang === 'es' ? 'ARTICULO III - PODERES OTORGADOS' : 'ARTICLE III - GRANTED POWERS', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const powersIntro = lang === 'es'
      ? 'El Apoderado esta autorizado para realizar las siguientes acciones especificas en mi nombre:'
      : 'The Agent is authorized to perform the following specific actions on my behalf:';
    y = wrap(powersIntro, m, y, cw, 5);
    y += 4;

    const powers = getGrantedPowers(d, lang);
    if (powers.length > 0) {
      powers.forEach((power, index) => {
        if (y > ph - 30) {
          doc.addPage();
          y = 20;
          addFooter();
        }
        doc.text(`${index + 1}. ${power}`, m + 5, y);
        y += 6;
      });
    } else {
      doc.text(lang === 'es' ? '(Poderes especificos no seleccionados)' : '(Specific powers not selected)', m + 5, y);
      y += 6;
    }
    y += 6;

    // ===== ARTICLE IV: LIMITATIONS =====
    section(lang === 'es' ? 'ARTICULO IV - LIMITACIONES' : 'ARTICLE IV - LIMITATIONS',
      lang === 'es'
        ? 'Este Poder Notarial esta estrictamente LIMITADO al proposito especificado anteriormente. El Apoderado NO tiene autoridad para actuar en ningun otro asunto. El Apoderado no puede delegar esta autoridad a otra persona.'
        : 'This Power of Attorney is strictly LIMITED to the purpose specified above. The Agent has NO authority to act in any other matter. The Agent may not delegate this authority to another person.'
    );

    // ===== ARTICLE V: DURATION =====
    let durationText;
    if (d.effective_date === 'upon_signing') {
      durationText = lang === 'es'
        ? `Este Poder Notarial entra en vigor inmediatamente al momento de la firma y terminara ${d.termination_date === 'upon_completion' ? 'al completarse el proposito especificado' : 'en la fecha: ' + (d.termination_specific_date || '___')}.`
        : `This Power of Attorney becomes effective immediately upon signing and shall terminate ${d.termination_date === 'upon_completion' ? 'upon completion of the specified purpose' : 'on the date: ' + (d.termination_specific_date || '___')}.`;
    } else {
      durationText = lang === 'es'
        ? `Este Poder Notarial entrara en vigor en la fecha: ${d.effective_specific_date || '___'} y terminara ${d.termination_date === 'upon_completion' ? 'al completarse el proposito especificado' : 'en la fecha: ' + (d.termination_specific_date || '___')}.`
        : `This Power of Attorney shall become effective on the date: ${d.effective_specific_date || '___'} and shall terminate ${d.termination_date === 'upon_completion' ? 'upon completion of the specified purpose' : 'on the date: ' + (d.termination_specific_date || '___')}.`;
    }
    section(lang === 'es' ? 'ARTICULO V - DURACION' : 'ARTICLE V - DURATION', durationText);

    // Durability clause
    if (d.durable) {
      const durabilityText = lang === 'es'
        ? 'Este Poder Notarial es DURADERO y no sera afectado por mi incapacidad posterior, de conformidad con el Codigo de Sucesiones de California Seccion 4124.'
        : 'This Power of Attorney is DURABLE and shall NOT BE AFFECTED by my subsequent incapacity, pursuant to California Probate Code Section 4124.';
      y = wrap(durabilityText, m, y, cw, 5);
      y += 8;
    }

    // ===== ARTICLE VI: REVOCATION =====
    section(lang === 'es' ? 'ARTICULO VI - REVOCACION' : 'ARTICLE VI - REVOCATION',
      lang === 'es'
        ? 'Tengo el derecho de revocar este Poder Notarial Limitado en cualquier momento mediante notificacion escrita al Apoderado.'
        : 'I have the right to revoke this Limited Power of Attorney at any time by written notice to the Agent.'
    );

    // Check if need new page for signature
    if (y > ph - 100) {
      doc.addPage();
      y = 20;
    }

    // ===== EXECUTION SECTION =====
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(lang === 'es' ? 'EJECUCION' : 'EXECUTION', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const witnessText = lang === 'es'
      ? 'EN FE DE LO CUAL, he ejecutado este Poder Notarial Limitado en la fecha indicada a continuacion.'
      : 'IN WITNESS WHEREOF, I have executed this Limited Power of Attorney on the date written below.';
    y = wrap(witnessText, m, y, cw, 5);
    y += 12;

    // Signature lines
    doc.text(lang === 'es' ? 'Fecha: _______________________' : 'Date: _______________________', m, y);
    y += 15;
    doc.text('_____________________________________________', m, y);
    y += 5;
    doc.text(d.principal_name || '(Principal Name)', m, y);
    doc.text(lang === 'es' ? ', Poderdante' : ', Principal', m + doc.getTextWidth(d.principal_name || '(Principal Name)'), y);
    y += 20;

    // Agent Acknowledgment
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(lang === 'es' ? 'ACEPTACION DEL APODERADO' : 'AGENT ACCEPTANCE', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const agentAck = lang === 'es'
      ? 'Acepto este nombramiento y acepto actuar en el mejor interes del Poderdante, ejerciendo solo la autoridad limitada otorgada en este documento.'
      : 'I accept this appointment and agree to act in the best interest of the Principal, exercising only the limited authority granted in this document.';
    y = wrap(agentAck, m, y, cw, 4);
    y += 10;

    doc.text(lang === 'es' ? 'Fecha: _______________________' : 'Date: _______________________', m, y);
    y += 15;
    doc.text('_____________________________________________', m, y);
    y += 5;
    doc.text(d.agent_name || '(Agent Name)', m, y);
    doc.text(lang === 'es' ? ', Apoderado' : ', Agent', m + doc.getTextWidth(d.agent_name || '(Agent Name)'), y);

    // Add footer to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Multi Servicios 360 | www.multiservicios360.net | 855.246.7274', pw / 2, ph - 10, { align: 'center' });
      doc.text(`Page ${i} of ${totalPages}`, pw - m, ph - 10, { align: 'right' });
    }

    // ===== NOTARY ACKNOWLEDGMENT PAGE =====
    doc.addPage();
    y = 20;

    // Try to fetch and append the official CA notary form
    try {
      const notaryResponse = await fetch('/api/notary-form');
      const notaryFormBytes = await notaryResponse.arrayBuffer();
      const notaryPdf = await PDFDocument.load(notaryFormBytes);
      const pdfDocFromJsPDF = await PDFDocument.load(doc.output('arraybuffer'));
      const [notaryPage] = await pdfDocFromJsPDF.copyPages(notaryPdf, [0]);
      pdfDocFromJsPDF.addPage(notaryPage);

      const pdfBytes = await pdfDocFromJsPDF.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Limited_POA_${categoryName.replace(/\s+/g, '_')}_${(d.principal_name || 'Document').replace(/\s+/g, '_')}_${lang.toUpperCase()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (notaryError) {
      console.error('Error fetching notary form:', notaryError);
      // Fallback - save without notary form
      doc.save(`Limited_POA_${categoryName.replace(/\s+/g, '_')}_${(d.principal_name || 'Document').replace(/\s+/g, '_')}_${lang.toUpperCase()}.pdf`);
      alert(lang === 'es'
        ? 'Documento generado. Por favor descargue el formulario notarial de: /api/notary-form'
        : 'Document generated. Please download notary form from: /api/notary-form');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #E5E7EB', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#6B7280' }}>Loading...</p>
        </div>
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
              onClick={() => alert('Email feature coming soon!')}
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
              <li>{t.step4}</li>
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
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}