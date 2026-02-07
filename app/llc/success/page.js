// app/llc/success/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LLCSuccessPage() {
  const searchParams = useSearchParams();
  const matterId = searchParams.get('matter_id');
  const sessionId = searchParams.get('session_id');

  const [matter, setMatter] = useState(null);
  const [documentEn, setDocumentEn] = useState(null);
  const [documentEs, setDocumentEs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingEn, setGeneratingEn] = useState(false);
  const [generatingEs, setGeneratingEs] = useState(false);
  const [language, setLanguage] = useState('en'); // UI language toggle
  const [emailing, setEmailing] = useState(false);
  const pdfGenerated = useRef(false);

  // Electronic signature state
  const [electronicSignature, setElectronicSignature] = useState('');
  const [signatureAccepted, setSignatureAccepted] = useState(false);
  const [signatureError, setSignatureError] = useState('');
  const [executionDate, setExecutionDate] = useState('');

  // ============================================
  // Bilingual UI strings
  // ============================================
  const t = {
    en: {
      title: 'LLC Formation Complete!',
      subtitle: 'Your payment has been processed successfully.',
      preparing: 'Preparing your Operating Agreement...',
      loading: 'Loading your order...',
      downloadEN: '📄 Download English PDF',
      downloadES: '📄 Descargar en Español',
      printOA: '🖨️ Print',
      emailOA: '📧 Email PDF',
      emailSending: 'Sending...',
      emailSent: '✅ Sent!',
      emailFailed: '❌ Failed',
      generatingEn: 'Generating...',
      generatingEs: 'Generando...',
      orderSummary: 'Order Summary',
      tier: 'Package',
      client: 'Client',
      email: 'Email',
      llcName: 'LLC Name',
      total: 'Total Paid',
      filingSpeed: 'Filing Speed',
      nextSteps: 'Next Steps',
      step1: 'Complete the execution date and electronic signature below.',
      step2: 'Download and review your Operating Agreement carefully.',
      step3: 'Sign the Operating Agreement (all members must sign).',
      step4: 'We will file your Articles of Organization with the CA Secretary of State.',
      step5: 'Apply for your Federal EIN at irs.gov after receiving your SOS confirmation.',
      step6: 'File your Statement of Information (SOI) within 90 days of formation.',
      entityVault: 'Your documents are stored securely in your Entity Vault™.',
      attorneyWarning: 'Attorney Review Recommended',
      attorneyNote: 'The following sections contain complex provisions that may benefit from attorney review:',
      softwareDisclosure: 'Software Platform Disclosure',
      disclosureText: 'This Operating Agreement was generated using Multi Servicios 360 software platform. Multi Servicios 360 is not a law firm and does not provide legal advice. Users create documents themselves using our software tools. We recommend consulting with a licensed attorney for complex business structures.',
      errorTitle: 'Something went wrong',
      errorText: 'We could not load your order. Please contact support.',
      support: 'Need help? Call 855.246.7274 or email support@multiservicios360.net',
      switchLang: 'Español',
      signatureSection: 'Electronic Signature & Execution',
      executionDateLabel: 'Execution Date',
      executionDateHelp: 'This is the date you are signing the Operating Agreement.',
      signatureLabel: 'Electronic Signature (Required)',
      signaturePlaceholder: 'Type your full legal name',
      signatureHelp: 'By typing your name, you confirm that you created this document yourself.',
      signatureRequired: 'Electronic signature is required.',
      signatureAcceptLabel: 'I accept that I created this document myself using Multi Servicios 360 software tools, and that I did not receive legal advice. I understand this is a self-help document preparation platform.',
      signatureAcceptRequired: 'You must accept the terms to continue.',
      signatureNameMismatch: 'Your signature must match the client name on file.',
      executionDateRequired: 'Execution date is required.'
    },
    es: {
      title: '¡Formación de LLC Completada!',
      subtitle: 'Su pago ha sido procesado exitosamente.',
      preparing: 'Preparando su Acuerdo Operativo...',
      loading: 'Cargando su orden...',
      downloadEN: '📄 Download English PDF',
      downloadES: '📄 Descargar en Español',
      printOA: '🖨️ Imprimir',
      emailOA: '📧 Enviar PDF',
      emailSending: 'Enviando...',
      emailSent: '✅ ¡Enviado!',
      emailFailed: '❌ Error',
      generatingEn: 'Generating...',
      generatingEs: 'Generando...',
      orderSummary: 'Resumen de Orden',
      tier: 'Paquete',
      client: 'Cliente',
      email: 'Correo',
      llcName: 'Nombre LLC',
      total: 'Total Pagado',
      filingSpeed: 'Velocidad de Registro',
      nextSteps: 'Próximos Pasos',
      step1: 'Complete la fecha de ejecución y firma electrónica abajo.',
      step2: 'Descargue y revise su Acuerdo Operativo cuidadosamente.',
      step3: 'Firme el Acuerdo Operativo (todos los miembros deben firmar).',
      step4: 'Nosotros registraremos sus Artículos de Organización con el Secretario de Estado de CA.',
      step5: 'Solicite su EIN Federal en irs.gov después de recibir su confirmación del SOS.',
      step6: 'Presente su Declaración de Información (SOI) dentro de 90 días de la formación.',
      entityVault: 'Sus documentos están almacenados de forma segura en su Entity Vault™.',
      attorneyWarning: 'Revisión de Abogado Recomendada',
      attorneyNote: 'Las siguientes secciones contienen provisiones complejas que pueden beneficiarse de revisión legal:',
      softwareDisclosure: 'Divulgación de Plataforma de Software',
      disclosureText: 'Este Acuerdo Operativo fue generado usando la plataforma de software Multi Servicios 360. Multi Servicios 360 no es un bufete de abogados y no proporciona asesoría legal. Los usuarios crean documentos ellos mismos usando nuestras herramientas de software. Recomendamos consultar con un abogado licenciado para estructuras comerciales complejas.',
      errorTitle: 'Algo salió mal',
      errorText: 'No pudimos cargar su orden. Por favor contacte soporte.',
      support: '¿Necesita ayuda? Llame al 855.246.7274 o envíe correo a support@multiservicios360.net',
      switchLang: 'English',
      signatureSection: 'Firma Electrónica y Ejecución',
      executionDateLabel: 'Fecha de Ejecución',
      executionDateHelp: 'Esta es la fecha en que está firmando el Acuerdo Operativo.',
      signatureLabel: 'Firma Electrónica (Requerida)',
      signaturePlaceholder: 'Escriba su nombre legal completo',
      signatureHelp: 'Al escribir su nombre, confirma que creó este documento usted mismo.',
      signatureRequired: 'La firma electrónica es obligatoria.',
      signatureAcceptLabel: 'Acepto que creé este documento yo mismo usando las herramientas de software de Multi Servicios 360, y que no recibí asesoría legal. Entiendo que esta es una plataforma de preparación de documentos de autoayuda.',
      signatureAcceptRequired: 'Debe aceptar los términos para continuar.',
      signatureNameMismatch: 'Su firma debe coincidir con el nombre del cliente en archivo.',
      executionDateRequired: 'La fecha de ejecución es obligatoria.'
    }
  };

  const tx = t[language];
  const tierLabels = { llc_standard: 'LLC Standard ($799)', llc_plus: 'LLC Plus ($1,199)', llc_elite: 'LLC Elite ($1,699)' };
  const speedLabels = { standard: 'Standard (5-7 days)', expedite_24hr: '24-Hour Expedite', expedite_same_day: 'Same Day' };

  // ============================================
  // Parse effective_date — "hoy"/"today" → real date
  // ============================================
  const parseEffectiveDate = (raw) => {
    if (!raw) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const trimmed = raw.trim().toLowerCase();
    if (trimmed === 'hoy' || trimmed === 'today') {
      return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    const parts = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (parts) {
      const d = new Date(parseInt(parts[3]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return raw;
  };

  // ============================================
  // Load matter
  // ============================================
  useEffect(() => {
    if (!matterId) { setError('No matter ID'); setLoading(false); return; }
    async function loadMatter() {
      try {
        const res = await fetch(`/api/llc/matters?id=${matterId}`);
        const data = await res.json();
        if (data.success && data.matter) {
          setMatter(data.matter);
          setLanguage(data.matter.language || 'en');
          if (data.matter.electronic_signature) {
            setElectronicSignature(data.matter.electronic_signature);
            setSignatureAccepted(true);
          }
        } else { setError(data.error || 'Matter not found'); }
      } catch (err) { setError('Failed to load order'); }
      setLoading(false);
    }
    loadMatter();
  }, [matterId]);

  // Default execution date
  useEffect(() => {
    const now = new Date();
    setExecutionDate(`${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}/${now.getFullYear()}`);
  }, []);

  // Parse "hoy"/"today" in execution date
  const handleExecutionDateChange = (val) => {
    const lower = val.trim().toLowerCase();
    if (lower === 'hoy' || lower === 'today') {
      const now = new Date();
      setExecutionDate(`${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}/${now.getFullYear()}`);
    } else {
      setExecutionDate(val);
    }
    if (signatureError) setSignatureError('');
  };

  // ============================================
  // Generate English OA on page load
  // ============================================
  useEffect(() => {
    if (!matter || pdfGenerated.current) return;
    pdfGenerated.current = true;
    async function generateOA() {
      try {
        const res = await fetch('/api/llc/generate-oa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matterId: matter.id, language: 'en' })
        });
        const data = await res.json();
        if (data.success) setDocumentEn(data.document);
      } catch (err) { console.error('OA generation failed:', err); }
    }
    generateOA();
  }, [matter]);

  // ============================================
  // Validate Signature
  // ============================================
  const validateSignature = () => {
    if (!executionDate || executionDate.trim().length < 6) { setSignatureError(tx.executionDateRequired); return false; }
    if (!electronicSignature || electronicSignature.trim().length < 2) { setSignatureError(tx.signatureRequired); return false; }
    const sigNorm = electronicSignature.trim().toLowerCase().replace(/\s+/g, ' ');
    const clientNorm = (matter?.client_name || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (clientNorm && sigNorm !== clientNorm) {
      const sigParts = sigNorm.split(' ');
      const clientParts = clientNorm.split(' ');
      const hasMatch = sigParts.some(p => clientParts.includes(p) && p.length > 2);
      if (!hasMatch) { setSignatureError(tx.signatureNameMismatch); return false; }
    }
    if (!signatureAccepted) { setSignatureError(tx.signatureAcceptRequired); return false; }
    setSignatureError('');
    return true;
  };

  // ============================================
  // Build PDF — accepts document data + language
  // ============================================
  const buildPDF = async (docData, pdfLang = 'en') => {
    if (!docData) return null;

    const isEs = pdfLang === 'es';
    const now = new Date();
    const auditData = {
      electronicSignature: electronicSignature.trim(),
      signedAtUtc: now.toISOString(),
      signedAtLocal: now.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' }),
      executionDate, matterId: matter?.id, sessionId
    };

    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const m = 72, pageW = 612, pageH = 792, cw = pageW - m * 2;
    let y = m;
    const addPage = () => { doc.addPage(); y = m; };
    const checkPage = (needed = 60) => { if (y + needed > pageH - m) addPage(); };

    // ---- TITLE PAGE ----
    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    y = 200;
    const titleLines = doc.splitTextToSize(docData.title, cw);
    doc.text(titleLines, pageW / 2, y, { align: 'center' });
    y += titleLines.length * 22;
    doc.setFontSize(14);
    doc.setFont('times', 'normal');
    doc.text(docData.subtitle, pageW / 2, y + 10, { align: 'center' });
    y += 50;
    doc.setFontSize(12);
    const effectiveDate = parseEffectiveDate(matter?.intake_data?.effective_date);
    const edLabel = isEs ? 'Fecha Efectiva' : 'Effective Date';
    doc.text(`${edLabel}: ${effectiveDate}`, pageW / 2, y, { align: 'center' });

    // Footer
    doc.setFontSize(8); doc.setTextColor(128);
    const footer1 = isEs
      ? 'Generado por la Plataforma de Software Multi Servicios 360'
      : 'Generated by Multi Servicios 360 Software Platform';
    const footer2 = isEs
      ? 'Este es un documento generado por software, no constituye asesoría legal.'
      : 'This is a software-generated document, not legal advice.';
    doc.text(footer1, pageW / 2, pageH - 40, { align: 'center' });
    doc.text(footer2, pageW / 2, pageH - 28, { align: 'center' });
    doc.setTextColor(0);

    // ---- CONTENT PAGES ----
    addPage();
    for (const section of docData.sections) {
      if (section.articleLabel) {
        checkPage(80); doc.setFont('times', 'bold'); doc.setFontSize(13);
        doc.text(section.articleLabel, m, y); y += 18;
        doc.setFontSize(12); doc.text(section.title.toUpperCase(), m, y); y += 24;
      } else if (section.clauseId === 'OA_000') {
        doc.setFont('times', 'bold'); doc.setFontSize(13);
        const preambleTitle = isEs ? 'ACUERDO OPERATIVO' : 'OPERATING AGREEMENT';
        doc.text(preambleTitle, pageW / 2, y, { align: 'center' }); y += 24;
      } else {
        checkPage(60); doc.setFont('times', 'bold'); doc.setFontSize(13);
        doc.text(section.title.toUpperCase(), m, y); y += 24;
      }
      if (section.attorneyReview) {
        checkPage(40); doc.setFillColor(255, 249, 219); doc.rect(m, y - 4, cw, 20, 'F');
        doc.setFont('times', 'bolditalic'); doc.setFontSize(9); doc.setTextColor(146, 64, 14);
        const arText = isEs
          ? 'REVISIÓN DE ABOGADO RECOMENDADA PARA ESTA SECCIÓN'
          : 'ATTORNEY REVIEW RECOMMENDED FOR THIS SECTION';
        doc.text(arText, m + 8, y + 10);
        doc.setTextColor(0); y += 28;
      }
      doc.setFont('times', 'normal'); doc.setFontSize(11);
      const paragraphs = section.content.split('\n\n').filter(p => p.trim());
      for (const para of paragraphs) {
        const trimmed = para.trim();
        if (!trimmed) continue;
        // Detect section headings (English + Spanish)
        const isSH = /^\d+\.\d*\s/.test(trimmed) || /^Section\s/i.test(trimmed) || /^Sección\s/i.test(trimmed);
        if (isSH) doc.setFont('times', 'bold');
        const lines = doc.splitTextToSize(trimmed, cw);
        checkPage(lines.length * 14 + 10);
        doc.text(lines, m, y); y += lines.length * 14 + 8;
        if (isSH) doc.setFont('times', 'normal');
      }
      y += 12;
    }

    // ---- ELECTRONIC SIGNATURE INTENT ----
    addPage();
    doc.setFont('times', 'bold'); doc.setFontSize(14);
    const sigTitle = isEs ? 'DECLARACIÓN DE FIRMA ELECTRÓNICA' : 'ELECTRONIC SIGNATURE INTENT';
    doc.text(sigTitle, pageW / 2, y, { align: 'center' }); y += 24;
    doc.setFont('times', 'normal'); doc.setFontSize(10);

    const sigIntent = isEs
      ? 'Al escribir mi nombre y fecha a continuación, pretendo que esto sirva como mi firma electrónica de conformidad con la Ley Uniforme de Transacciones Electrónicas de California (Código Civil Secciones 1633.1 y siguientes) y la Ley federal ESIGN (15 U.S.C. Secciones 7001-7006). Entiendo que este documento será impreso y puede requerir firmas adicionales de todos los miembros. Estoy ejecutando este documento voluntariamente y con pleno entendimiento de su contenido.'
      : 'By typing my name and date below, I intend this to serve as my electronic signature pursuant to the California Uniform Electronic Transactions Act (Civil Code Sections 1633.1 et seq.) and the federal ESIGN Act (15 U.S.C. Sections 7001-7006). I understand this document will be printed and may require additional signatures from all members. I am executing this document voluntarily and with full understanding of its contents.';
    const siLines = doc.splitTextToSize(sigIntent, cw);
    doc.text(siLines, m, y); y += siLines.length * 13 + 16;

    // Acknowledgment
    doc.setFont('times', 'bold'); doc.setFontSize(11);
    const ackTitle = isEs ? 'RECONOCIMIENTO DEL USUARIO' : 'USER ACKNOWLEDGMENT';
    doc.text(ackTitle, m, y); y += 16;
    doc.setFont('times', 'normal'); doc.setFontSize(10);

    const ackLines = isEs ? [
      'Al firmar electrónicamente a continuación, reconozco y acepto que:',
      '', '• Creé este Acuerdo Operativo yo mismo usando las herramientas de software de Multi Servicios 360.',
      '• Multi Servicios 360 NO es un bufete de abogados y NO me proporcionó asesoría legal.',
      '• No existe relación abogado-cliente entre yo y Multi Servicios 360.',
      '• Soy el único responsable del contenido de este documento.',
      '• Entiendo que este documento puede tener consecuencias legales significativas.'
    ] : [
      'By signing electronically below, I acknowledge and agree that:',
      '', '• I created this Operating Agreement myself using Multi Servicios 360 software tools.',
      '• Multi Servicios 360 is NOT a law firm and did NOT provide me with legal advice.',
      '• No attorney-client relationship exists between me and Multi Servicios 360.',
      '• I am solely responsible for the contents of this document.',
      '• I understand that this document may have significant legal consequences.'
    ];
    for (const line of ackLines) {
      if (!line) { y += 6; continue; }
      const w = doc.splitTextToSize(line, cw); doc.text(w, m, y); y += w.length * 13 + 2;
    }
    y += 20;

    // Signature Box
    doc.setFont('times', 'bold'); doc.setFontSize(11);
    const sigLabel = isEs ? 'FIRMA ELECTRÓNICA:' : 'ELECTRONIC SIGNATURE:';
    doc.text(sigLabel, m, y); y += 16;
    doc.setDrawColor(30, 58, 138); doc.setLineWidth(1.5); doc.rect(m, y, cw, 40);
    doc.setFont('courier', 'bold'); doc.setFontSize(14); doc.setTextColor(30, 58, 138);
    doc.text(electronicSignature, m + 8, y + 25);
    doc.setTextColor(0); y += 50;

    doc.setFont('times', 'normal'); doc.setFontSize(10);
    const nameLabel = isEs ? 'Nombre' : 'Name';
    const titleLabel = isEs ? 'Título' : 'Title';
    const dateLabel = isEs ? 'Fecha' : 'Date';
    const memberTitle = matter?.intake_data?.management_type === 'manager'
      ? (isEs ? 'Gerente' : 'Manager')
      : (isEs ? 'Miembro' : 'Member');
    doc.text(`${nameLabel}: ${electronicSignature}`, m, y); y += 14;
    doc.text(`${titleLabel}: ${memberTitle}`, m, y); y += 14;
    doc.text(`${dateLabel}: ${executionDate}`, m, y); y += 14;
    doc.setFontSize(8); doc.setTextColor(128);
    const signedLabel = isEs ? 'Firmado electrónicamente' : 'Signed electronically';
    doc.text(`${signedLabel}: ${auditData.signedAtLocal}`, m, y);
    doc.setTextColor(0); y += 30;

    // Additional member signature lines
    const memberCount = parseInt(matter?.intake_data?.member_count) || 1;
    if (memberCount > 1) {
      doc.setFont('times', 'bold'); doc.setFontSize(11);
      const addSigTitle = isEs ? 'FIRMAS DE MIEMBROS ADICIONALES:' : 'ADDITIONAL MEMBER SIGNATURES:';
      doc.text(addSigTitle, m, y); y += 20;
      const members = [];
      if (matter?.intake_data?.member_2_name) members.push(matter.intake_data.member_2_name);
      if (matter?.intake_data?.member_3_name) members.push(matter.intake_data.member_3_name);
      doc.setFont('times', 'normal'); doc.setFontSize(10);
      for (const name of members) {
        checkPage(80);
        const mLabel = isEs ? 'Miembro' : 'Member';
        const sLabel = isEs ? 'Firma' : 'Signature';
        const dLabel = isEs ? 'Fecha' : 'Date';
        doc.text(`${mLabel}: ${name}`, m, y); y += 18;
        doc.text(`${sLabel}:`, m, y); doc.line(m + 60, y, m + cw * 0.6, y); y += 18;
        doc.text(`${dLabel}:`, m, y); doc.line(m + 40, y, m + cw * 0.35, y); y += 28;
      }
    }

    // ---- DOCUMENT CERTIFICATE ----
    addPage();
    doc.setFont('times', 'bold'); doc.setFontSize(14);
    const certTitle = isEs ? 'CERTIFICADO DEL DOCUMENTO' : 'DOCUMENT CERTIFICATE';
    doc.text(certTitle, pageW / 2, y, { align: 'center' }); y += 24;
    doc.setDrawColor(30, 58, 138); doc.setLineWidth(1); doc.rect(m, y, cw, 190);
    doc.setFont('times', 'normal'); doc.setFontSize(10); y += 16;
    const certData = [
      [isEs ? 'Documento' : 'Document', `${isEs ? 'Acuerdo Operativo' : 'Operating Agreement'} - ${matter?.intake_data?.llc_name || 'LLC'} ${matter?.intake_data?.llc_suffix || 'LLC'}`],
      ['Matter ID', matter?.id || 'N/A'],
      ['Stripe Session', sessionId || 'N/A'],
      [isEs ? 'Comprador' : 'Purchaser', matter?.client_name || 'N/A'],
      [isEs ? 'Correo' : 'Email', matter?.client_email || 'N/A'],
      [isEs ? 'Firma Electrónica' : 'Electronic Signature', electronicSignature],
      [isEs ? 'Fecha de Ejecución' : 'Execution Date', executionDate],
      [isEs ? 'Generado' : 'Generated', new Date().toISOString()],
      [isEs ? 'Paquete' : 'Tier', tierLabels[matter?.review_tier] || matter?.review_tier || 'N/A'],
      [isEs ? 'Plataforma' : 'Platform', 'Multi Servicios 360 Corporation'],
      [isEs ? 'Idioma' : 'Language', isEs ? 'Español' : 'English']
    ];
    for (const [label, value] of certData) {
      doc.setFont('times', 'bold'); doc.text(`${label}:`, m + 12, y);
      doc.setFont('times', 'normal'); doc.text(String(value), m + 140, y); y += 14;
    }
    y += 10;
    doc.setFontSize(9);
    const certNote = isEs
      ? 'Este certificado verifica que este documento fue generado a través de una transacción pagada y está vinculado a los identificadores anteriores.'
      : 'This certificate verifies this document was generated through a single paid transaction and is tied to the above identifiers.';
    const certNoteLines = doc.splitTextToSize(certNote, cw - 24);
    doc.text(certNoteLines, m + 12, y);

    // ---- SOFTWARE DISCLOSURE ----
    y += certNoteLines.length * 12 + 30;
    checkPage(200);
    if (y > pageH - 250) addPage();
    doc.setFont('times', 'bold'); doc.setFontSize(14);
    const discTitle = isEs ? 'DIVULGACIÓN DE PLATAFORMA DE SOFTWARE' : 'SOFTWARE PLATFORM DISCLOSURE';
    doc.text(discTitle, pageW / 2, y, { align: 'center' }); y += 24;
    doc.setFont('times', 'normal'); doc.setFontSize(10);

    const disc = isEs ? [
      'Este Acuerdo Operativo fue creado por el usuario usando la plataforma de software Multi Servicios 360.',
      '', 'Multi Servicios 360 es una empresa de tecnología de software. NO es un bufete de abogados, NO proporciona asesoría legal, y NO representa a ninguna parte en asuntos legales.',
      '', 'El usuario reconoce que:',
      '• El usuario creó este documento él mismo usando las herramientas de software proporcionadas por Multi Servicios 360.',
      '• No existe relación abogado-cliente entre el usuario y Multi Servicios 360.',
      '• Multi Servicios 360 no revisó este documento por precisión legal o completitud.',
      '• El usuario es el único responsable del contenido de este documento.',
      '• Multi Servicios 360 recomienda consultar con un abogado licenciado de California.',
      '', 'Multi Servicios 360 Corporation | Beverly Hills, California',
      'www.multiservicios360.net | 855.246.7274'
    ] : [
      'This Operating Agreement was created by the user using the Multi Servicios 360 software platform.',
      '', 'Multi Servicios 360 is a software technology company. It is NOT a law firm, does NOT provide legal advice, and does NOT represent any party in legal matters.',
      '', 'The user acknowledges that:',
      '• The user created this document themselves using software tools provided by Multi Servicios 360.',
      '• No attorney-client relationship exists between the user and Multi Servicios 360.',
      '• Multi Servicios 360 did not review this document for legal accuracy or completeness.',
      '• The user is solely responsible for the contents of this document.',
      '• Multi Servicios 360 recommends consulting with a licensed California attorney.',
      '', 'Multi Servicios 360 Corporation | Beverly Hills, California',
      'www.multiservicios360.net | 855.246.7274'
    ];
    for (const line of disc) {
      if (!line) { y += 8; continue; }
      const w = doc.splitTextToSize(line, cw); checkPage(w.length * 13 + 5); doc.text(w, m, y); y += w.length * 13 + 3;
    }

    // ---- PAGE NUMBERS ----
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
      doc.setPage(i); doc.setFont('times', 'normal'); doc.setFontSize(9); doc.setTextColor(128);
      const pgLabel = isEs ? 'Página' : 'Page';
      const ofLabel = isEs ? 'de' : 'of';
      doc.text(`${pgLabel} ${i - 1} ${ofLabel} ${totalPages - 1}`, pageW / 2, pageH - 20, { align: 'center' }); doc.setTextColor(0);
    }

    // Save audit
    try {
      await fetch('/api/llc/matters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: matter.id, updates: {
          electronic_signature: electronicSignature, signed_at_utc: auditData.signedAtUtc,
          signed_at_local: auditData.signedAtLocal, execution_date: executionDate,
          documents_generated: true, document_generated_at: auditData.signedAtUtc
        }})
      });
    } catch (err) { console.warn('Audit save failed:', err); }

    return doc;
  };

  // ============================================
  // Download English PDF
  // ============================================
  const handleDownloadEnglish = async () => {
    if (!documentEn) return;
    if (!validateSignature()) return;
    setGeneratingEn(true);
    try {
      const doc = await buildPDF(documentEn, 'en');
      if (doc) {
        const companyName = (matter?.intake_data?.llc_name || 'LLC').replace(/[^a-zA-Z0-9]/g, '_');
        doc.save(`Operating_Agreement_${companyName}.pdf`);
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('PDF generation failed. Please try again.');
    }
    setGeneratingEn(false);
  };

  // ============================================
  // Download Spanish PDF
  // ============================================
  const handleDownloadSpanish = async () => {
    if (!validateSignature()) return;
    setGeneratingEs(true);
    try {
      // Generate Spanish OA on demand if not cached
      let esDoc = documentEs;
      if (!esDoc) {
        const res = await fetch('/api/llc/generate-oa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matterId: matter.id, language: 'es' })
        });
        const data = await res.json();
        if (data.success) {
          esDoc = data.document;
          setDocumentEs(esDoc);
        } else {
          alert('Error generating Spanish PDF.');
          setGeneratingEs(false);
          return;
        }
      }
      const doc = await buildPDF(esDoc, 'es');
      if (doc) {
        const companyName = (matter?.intake_data?.llc_name || 'LLC').replace(/[^a-zA-Z0-9]/g, '_');
        doc.save(`Acuerdo_Operativo_${companyName}.pdf`);
      }
    } catch (err) {
      console.error('Spanish PDF error:', err);
      alert('Error generating Spanish PDF.');
    }
    setGeneratingEs(false);
  };

  // ============================================
  // Print PDF (uses UI language toggle)
  // ============================================
  const handlePrintPDF = async () => {
    const useDoc = language === 'es' && documentEs ? documentEs : documentEn;
    if (!useDoc) return;
    if (!validateSignature()) return;
    setGeneratingEn(true);
    try {
      const pdfLang = language === 'es' && documentEs ? 'es' : 'en';
      const doc = await buildPDF(useDoc, pdfLang);
      if (doc) {
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.addEventListener('load', () => { printWindow.print(); });
        }
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      }
    } catch (err) {
      console.error('Print error:', err);
      alert('Print failed. Please download the PDF and print manually.');
    }
    setGeneratingEn(false);
  };

  // ============================================
  // Email PDF (uses UI language toggle)
  // ============================================
  const handleEmailPDF = async () => {
    const useDoc = language === 'es' && documentEs ? documentEs : documentEn;
    if (!useDoc) return;
    if (!validateSignature()) return;
    setEmailing(true);
    try {
      const pdfLang = language === 'es' && documentEs ? 'es' : 'en';
      const doc = await buildPDF(useDoc, pdfLang);
      if (doc) {
        const base64 = doc.output('datauristring').split(',')[1];
        const companyName = (matter?.intake_data?.llc_name || 'LLC').replace(/[^a-zA-Z0-9]/g, '_');
        const res = await fetch('/api/send-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: matter.client_email,
            subject: pdfLang === 'es'
              ? `Su Acuerdo Operativo — ${matter?.intake_data?.llc_name || 'LLC'} ${matter?.intake_data?.llc_suffix || 'LLC'}`
              : `Your Operating Agreement — ${matter?.intake_data?.llc_name || 'LLC'} ${matter?.intake_data?.llc_suffix || 'LLC'}`,
            documentName: pdfLang === 'es'
              ? `Acuerdo_Operativo_${companyName}.pdf`
              : `Operating_Agreement_${companyName}.pdf`,
            base64Pdf: base64,
            clientName: matter.client_name,
            documentType: 'Operating Agreement',
            language: pdfLang
          })
        });
        const data = await res.json();
        if (data.success) {
          setEmailing('sent');
          setTimeout(() => setEmailing(false), 3000);
        } else {
          setEmailing('failed');
          setTimeout(() => setEmailing(false), 3000);
        }
      }
    } catch (err) {
      console.error('Email error:', err);
      setEmailing('failed');
      setTimeout(() => setEmailing(false), 3000);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF6FF' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div><p style={{ fontSize: '18px', color: '#1E3A8A' }}>{tx.loading}</p></div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <h2 style={{ fontSize: '20px', color: '#991B1B' }}>{tx.errorTitle}</h2>
        <p style={{ color: '#7F1D1D', marginTop: '8px' }}>{error}</p>
        <p style={{ color: '#6B7280', marginTop: '16px', fontSize: '14px' }}>{tx.support}</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EFF6FF', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Language toggle */}
        <div style={{ textAlign: 'right', marginBottom: '16px' }}>
          <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} style={{ padding: '6px 16px', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            🌐 {tx.switchLang}
          </button>
        </div>

        {/* Success header */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1E3A8A', marginBottom: '8px' }}>{tx.title}</h1>
          <p style={{ fontSize: '16px', color: '#6B7280' }}>{tx.subtitle}</p>
        </div>

        {/* Order Summary */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>{tx.orderSummary}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><span style={{ color: '#6B7280', fontSize: '14px' }}>{tx.client}</span><div style={{ fontWeight: '600' }}>{matter.client_name}</div></div>
            <div><span style={{ color: '#6B7280', fontSize: '14px' }}>{tx.email}</span><div style={{ fontWeight: '600' }}>{matter.client_email}</div></div>
            <div><span style={{ color: '#6B7280', fontSize: '14px' }}>{tx.llcName}</span><div style={{ fontWeight: '600' }}>{matter.intake_data?.llc_name} {matter.intake_data?.llc_suffix || 'LLC'}</div></div>
            <div><span style={{ color: '#6B7280', fontSize: '14px' }}>{tx.tier}</span><div style={{ fontWeight: '600' }}>{tierLabels[matter.review_tier] || matter.review_tier}</div></div>
            <div><span style={{ color: '#6B7280', fontSize: '14px' }}>{tx.filingSpeed}</span><div style={{ fontWeight: '600' }}>{speedLabels[matter.filing_speed] || matter.filing_speed}</div></div>
            <div><span style={{ color: '#6B7280', fontSize: '14px' }}>{tx.total}</span><div style={{ fontWeight: '600', color: '#059669', fontSize: '18px' }}>${matter.total_price?.toLocaleString()}</div></div>
          </div>
        </div>

        {/* Attorney Warning */}
        {documentEn?.attorneyFlagged?.length > 0 && (
          <div style={{ backgroundColor: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#92400E', marginBottom: '8px' }}>⚠️ {tx.attorneyWarning}</h3>
            <p style={{ fontSize: '14px', color: '#78350F', marginBottom: '8px' }}>{tx.attorneyNote}</p>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {documentEn.attorneyFlagged.map((item, i) => <li key={i} style={{ fontSize: '14px', color: '#92400E', marginBottom: '4px' }}>{item}</li>)}
            </ul>
          </div>
        )}

        {/* ============ ELECTRONIC SIGNATURE ============ */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px', border: '2px solid #1E3A8A' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E3A8A', marginBottom: '16px' }}>✍️ {tx.signatureSection}</h2>

          {/* Execution Date */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{tx.executionDateLabel} *</label>
            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>{tx.executionDateHelp}</p>
            <input type="text" value={executionDate} onChange={e => handleExecutionDateChange(e.target.value)} placeholder="MM/DD/YYYY"
              style={{ width: '200px', padding: '10px 14px', border: '2px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', fontFamily: 'monospace', boxSizing: 'border-box' }} />
          </div>

          {/* Electronic Signature */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{tx.signatureLabel} *</label>
            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>{tx.signatureHelp}</p>
            <input type="text" value={electronicSignature}
              onChange={e => { setElectronicSignature(e.target.value); if (signatureError) setSignatureError(''); }}
              placeholder={tx.signaturePlaceholder}
              style={{ width: '100%', padding: '14px 16px', border: signatureError ? '2px solid #DC2626' : '2px solid #D1D5DB', borderRadius: '8px', fontSize: '20px', fontFamily: "'Times New Roman', serif", fontStyle: 'italic', fontWeight: 'bold', color: '#1E3A8A', boxSizing: 'border-box', backgroundColor: '#FAFAFA' }} />
          </div>

          {/* Acceptance */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={signatureAccepted}
                onChange={e => { setSignatureAccepted(e.target.checked); if (signatureError) setSignatureError(''); }}
                style={{ marginTop: '4px', width: '18px', height: '18px', cursor: 'pointer' }} />
              <span style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>{tx.signatureAcceptLabel}</span>
            </label>
          </div>

          {/* Error */}
          {signatureError && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
              <p style={{ color: '#DC2626', fontSize: '13px', fontWeight: '600', margin: 0 }}>⚠️ {signatureError}</p>
            </div>
          )}

          {/* ============ 4-BUTTON ACTION PANEL ============ */}
          {!documentEn ? (
            <div style={{ textAlign: 'center' }}><p style={{ color: '#6B7280' }}>⏳ {tx.preparing}</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {/* Row 1: Download English + Download Spanish */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleDownloadEnglish} disabled={generatingEn} style={{
                  flex: 1, padding: '16px 20px', backgroundColor: generatingEn ? '#9CA3AF' : '#1E3A8A', color: 'white',
                  border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
                  cursor: generatingEn ? 'not-allowed' : 'pointer'
                }}>
                  {generatingEn ? 'Generating...' : '📄 Download English PDF'}
                </button>

                <button onClick={handleDownloadSpanish} disabled={generatingEs} style={{
                  flex: 1, padding: '16px 20px', backgroundColor: generatingEs ? '#9CA3AF' : '#065F46', color: 'white',
                  border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
                  cursor: generatingEs ? 'not-allowed' : 'pointer'
                }}>
                  {generatingEs ? 'Generando...' : '📄 Descargar en Español'}
                </button>
              </div>

              {/* Row 2: Print + Email */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handlePrintPDF} disabled={generatingEn} style={{
                  flex: 1, padding: '12px 16px', backgroundColor: 'white', color: '#1E3A8A',
                  border: '2px solid #1E3A8A', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                  cursor: generatingEn ? 'not-allowed' : 'pointer'
                }}>{tx.printOA}</button>

                <button onClick={handleEmailPDF} disabled={generatingEn || emailing === true} style={{
                  flex: 1, padding: '12px 16px',
                  backgroundColor: emailing === 'sent' ? '#059669' : emailing === 'failed' ? '#DC2626' : 'white',
                  color: emailing === 'sent' || emailing === 'failed' ? 'white' : '#1E3A8A',
                  border: `2px solid ${emailing === 'sent' ? '#059669' : emailing === 'failed' ? '#DC2626' : '#1E3A8A'}`,
                  borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                  cursor: generatingEn || emailing === true ? 'not-allowed' : 'pointer'
                }}>
                  {emailing === true ? tx.emailSending :
                   emailing === 'sent' ? tx.emailSent :
                   emailing === 'failed' ? tx.emailFailed :
                   tx.emailOA}
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Entity Vault */}
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ color: '#065F46', fontSize: '14px', fontWeight: '500' }}>🔒 {tx.entityVault}</p>
        </div>

        {/* Next Steps */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>{tx.nextSteps}</h2>
          <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '2' }}>
            {[tx.step1, tx.step2, tx.step3, tx.step4, tx.step5, tx.step6].map((s, i) => (
              <li key={i} style={{ fontSize: '14px', color: '#374151', fontWeight: i === 3 ? '600' : '400' }}>{s}</li>
            ))}
          </ol>
        </div>

        {/* Software Disclosure */}
        <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6B7280', marginBottom: '8px' }}>{tx.softwareDisclosure}</h3>
          <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: '1.6' }}>{tx.disclosureText}</p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF', fontSize: '13px' }}>
          <p>{tx.support}</p>
          <p style={{ marginTop: '8px' }}>© {new Date().getFullYear()} Multi Servicios 360 Corporation</p>
        </div>
      </div>
    </div>
  );
}