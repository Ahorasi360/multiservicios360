// app/trust/success/page.js
"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTrustPDFBlob } from './trust-pdf-generator';
import { saveToVault } from '../../../lib/save-to-vault';
import { lockPdf } from '../../../lib/lock-pdf';

function TrustSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const matterId = searchParams.get('matter_id');
  
  const [language, setLanguage] = useState('es');
  const [matter, setMatter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Electronic signature state
  const [electronicSignature, setElectronicSignature] = useState('');
  const [signatureAccepted, setSignatureAccepted] = useState(false);
  const [signatureError, setSignatureError] = useState('');
  const [executionDate, setExecutionDate] = useState('');
  const [signatureComplete, setSignatureComplete] = useState(false);

  // Set default execution date
  useEffect(() => {
    const now = new Date();
    setExecutionDate(`${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}/${now.getFullYear()}`);
  }, []);

  const t = language === 'es' ? {
    title: '¡Pago Exitoso!',
    subtitle: 'Gracias por su compra',
    message: 'Su Fideicomiso en Vida de California está listo para descargar.',
    downloadBtn: 'Descargar Documento PDF',
    printBtn: 'Imprimir',
    emailBtn: 'Enviar por Correo',
    viewBtn: 'Ver PDF',
    generatingPdf: 'Generando documento...',
    nextSteps: 'Próximos Pasos Importantes:',
    step1: '1. Complete la firma electrónica abajo.',
    step2: '2. Descargue y revise su documento cuidadosamente.',
    step3: '3. IMPORTANTE: Firme el documento frente a un notario público de California.',
    step4: '4. Transfiera sus activos al fideicomiso (retitule bienes raíces, cuentas bancarias, etc.).',
    step5: '5. Guarde el documento original firmado y notarizado en un lugar seguro.',
    step6: '6. Considere consultar con un abogado para situaciones complejas.',
    questions: '¿Preguntas?',
    contact: 'Llámenos al (855) 246-7274',
    backHome: 'Volver al Inicio',
    orderId: 'ID de Orden:',
    tier: 'Paquete:',
    emailModalTitle: 'Enviar Documento por Correo',
    emailLabel: 'Correo Electrónico:',
    sendBtn: 'Enviar',
    cancelBtn: 'Cancelar',
    emailSuccess: '¡Correo enviado exitosamente!',
    loading: 'Preparando su documento...',
    notaryReminder: '⚠️ IMPORTANTE: Este documento DEBE ser firmado frente a un notario público de California para ser válido. El formulario de notario de California ya está incluido en su documento.',
    agreementDate: 'Fecha de Acuerdo:',
    tiers: {
      trust_core: 'Fideicomiso Básico ($599)',
      trust_plus: 'Fideicomiso Plus ($899)',
      trust_elite: 'Fideicomiso Elite ($1,299)'
    },
    // Signature translations
    signatureSection: 'Firma Electrónica y Aceptación',
    executionDateLabel: 'Fecha de Ejecución',
    executionDateHelp: 'Esta es la fecha en que está firmando el documento del Fideicomiso.',
    signatureLabel: 'Firma Electrónica (Requerida)',
    signaturePlaceholder: 'Escriba su nombre legal completo',
    signatureHelp: 'Al escribir su nombre, confirma que creó este documento usted mismo usando las herramientas de software de Multi Servicios 360.',
    signatureRequired: 'La firma electrónica es obligatoria.',
    signatureAcceptLabel: 'Acepto que creé este documento yo mismo usando las herramientas de software de Multi Servicios 360, y que no recibí asesoría legal. Entiendo que esta es una plataforma de preparación de documentos de autoayuda.',
    signatureAcceptRequired: 'Debe aceptar los términos para continuar.',
    signatureNameMismatch: 'Su firma debe coincidir con el nombre del cliente en archivo.',
    executionDateRequired: 'La fecha de ejecución es obligatoria.',
    signBeforeDownload: 'Complete la firma electrónica arriba antes de descargar.',
    signatureConfirmed: '✅ Firma electrónica completada'
  } : {
    title: 'Payment Successful!',
    subtitle: 'Thank you for your purchase',
    message: 'Your California Living Trust is ready to download.',
    downloadBtn: 'Download PDF Document',
    printBtn: 'Print',
    emailBtn: 'Send via Email',
    viewBtn: 'View PDF',
    generatingPdf: 'Generating document...',
    nextSteps: 'Important Next Steps:',
    step1: '1. Complete the electronic signature below.',
    step2: '2. Download and review your document carefully.',
    step3: '3. IMPORTANT: Sign the document in front of a California Notary Public.',
    step4: '4. Transfer your assets to the trust (retitle real estate, bank accounts, etc.).',
    step5: '5. Store the original signed and notarized document in a safe place.',
    step6: '6. Consider consulting with an attorney for complex situations.',
    questions: 'Questions?',
    contact: 'Call us at (855) 246-7274',
    backHome: 'Back to Home',
    orderId: 'Order ID:',
    tier: 'Package:',
    emailModalTitle: 'Send Document via Email',
    emailLabel: 'Email Address:',
    sendBtn: 'Send',
    cancelBtn: 'Cancel',
    emailSuccess: 'Email sent successfully!',
    loading: 'Preparing your document...',
    notaryReminder: '⚠️ IMPORTANT: This document MUST be signed in front of a California Notary Public to be valid. The California notary form is already included in your document.',
    agreementDate: 'Agreement Date:',
    tiers: {
      trust_core: 'Trust Core ($599)',
      trust_plus: 'Trust Plus ($899)',
      trust_elite: 'Trust Elite ($1,299)'
    },
    // Signature translations
    signatureSection: 'Electronic Signature & Acceptance',
    executionDateLabel: 'Execution Date',
    executionDateHelp: 'This is the date you are signing the Trust document.',
    signatureLabel: 'Electronic Signature (Required)',
    signaturePlaceholder: 'Type your full legal name',
    signatureHelp: 'By typing your name, you confirm that you created this document yourself using Multi Servicios 360 software tools.',
    signatureRequired: 'Electronic signature is required.',
    signatureAcceptLabel: 'I accept that I created this document myself using Multi Servicios 360 software tools, and that I did not receive legal advice. I understand this is a self-help document preparation platform.',
    signatureAcceptRequired: 'You must accept the terms to continue.',
    signatureNameMismatch: 'Your signature must match the client name on file.',
    executionDateRequired: 'Execution date is required.',
    signBeforeDownload: 'Complete the electronic signature above before downloading.',
    signatureConfirmed: '✅ Electronic signature completed'
  };

  useEffect(() => {
    if (matterId) {
      fetchMatter();
    } else {
      setLoading(false);
    }
  }, [matterId]);

  const fetchMatter = async () => {
    try {
      const res = await fetch(`/api/trust/matters/${matterId}`);
      if (res.ok) {
        const data = await res.json();
        setMatter(data.matter);
        setEmailTo(data.matter?.client_email || '');
        
        // Restore signature if already signed
        if (data.matter?.electronic_signature) {
          setElectronicSignature(data.matter.electronic_signature);
          setSignatureAccepted(true);
          setSignatureComplete(true);
        }
        
        // Generate PDF with agreement data
        setPdfGenerating(true);
        const agreementData = {
          name: data.matter?.client_name,
          date: new Date(data.matter?.created_at).toLocaleDateString(),
          time: new Date(data.matter?.created_at).toLocaleTimeString(),
          agreed: true
        };
        
        try {
          const blob = await getTrustPDFBlob(
            data.matter?.intake_data || {},
            data.matter?.review_tier || 'trust_plus',
            agreementData
          );
          // Lock the PDF to prevent editing
          const blobBytes = new Uint8Array(await blob.arrayBuffer());
          const lockedBytes = await lockPdf(blobBytes);
          setPdfBlob(new Blob([lockedBytes], { type: 'application/pdf' }));
        } catch (pdfError) {
          console.error('PDF generation error:', pdfError);
        }
        setPdfGenerating(false);
      }
    } catch (error) {
      console.error('Error fetching matter:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Signature Validation
  // ============================================
  const validateSignature = () => {
    if (!executionDate || executionDate.trim().length < 6) {
      setSignatureError(t.executionDateRequired);
      return false;
    }
    if (!electronicSignature || electronicSignature.trim().length < 2) {
      setSignatureError(t.signatureRequired);
      return false;
    }
    // Name match check
    const sigNorm = electronicSignature.trim().toLowerCase().replace(/\s+/g, ' ');
    const clientNorm = (matter?.client_name || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (clientNorm && sigNorm !== clientNorm) {
      const sigParts = sigNorm.split(' ');
      const clientParts = clientNorm.split(' ');
      const hasMatch = sigParts.some(p => clientParts.includes(p) && p.length > 2);
      if (!hasMatch) {
        setSignatureError(t.signatureNameMismatch);
        return false;
      }
    }
    if (!signatureAccepted) {
      setSignatureError(t.signatureAcceptRequired);
      return false;
    }
    setSignatureError('');
    return true;
  };

  const handleSignatureConfirm = async () => {
    if (!validateSignature()) return;
    setSignatureComplete(true);

    // Save audit trail to Supabase
    const now = new Date();
    try {
      await fetch(`/api/trust/matters/${matterId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          electronic_signature: electronicSignature.trim(),
          signed_at_utc: now.toISOString(),
          signed_at_local: now.toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZoneName: 'short'
          }),
          execution_date: executionDate,
          documents_generated: true,
          document_generated_at: now.toISOString()
        })
      });
    } catch (err) {
      console.warn('Audit save failed:', err);
    }
  };

  // ============================================
  // Generate Signature Addendum PDF
  // ============================================
  const generateSignatureAddendum = async () => {
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const m = 72, pageW = 612, pageH = 792, cw = pageW - m * 2;
    let y = m;

    // ---- ELECTRONIC SIGNATURE INTENT ----
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.text('ELECTRONIC SIGNATURE INTENT', pageW / 2, y, { align: 'center' });
    y += 24;

    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    const sigIntent = 'By typing my name and date below, I intend this to serve as my electronic signature pursuant to the California Uniform Electronic Transactions Act (Civil Code Sections 1633.1 et seq.) and the federal ESIGN Act (15 U.S.C. Sections 7001-7006). I understand this document must be notarized to be valid and that I am executing this acknowledgment voluntarily and with full understanding of the document contents.';
    const siLines = doc.splitTextToSize(sigIntent, cw);
    doc.text(siLines, m, y);
    y += siLines.length * 13 + 16;

    // Acknowledgment
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text('USER ACKNOWLEDGMENT', m, y);
    y += 16;
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    const ackLines = [
      'By signing electronically below, I acknowledge and agree that:',
      '',
      '• I created this Living Trust document myself using Multi Servicios 360 software tools.',
      '• Multi Servicios 360 is NOT a law firm and did NOT provide me with legal advice.',
      '• No attorney-client relationship exists between me and Multi Servicios 360.',
      '• I am solely responsible for the contents of this document.',
      '• I understand that this document may have significant legal consequences.',
      '• I understand this document MUST be signed in front of a California Notary Public to be valid.',
      '• I understand I must fund the trust by transferring assets into it for it to be effective.'
    ];
    for (const line of ackLines) {
      if (!line) { y += 6; continue; }
      const w = doc.splitTextToSize(line, cw);
      doc.text(w, m, y);
      y += w.length * 13 + 2;
    }
    y += 20;

    // Signature Box
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text('ELECTRONIC SIGNATURE — SETTLOR / TRUSTOR:', m, y);
    y += 16;
    doc.setDrawColor(107, 33, 168);
    doc.setLineWidth(1.5);
    doc.rect(m, y, cw, 40);
    doc.setFont('courier', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(107, 33, 168);
    doc.text(electronicSignature, m + 8, y + 25);
    doc.setTextColor(0);
    y += 50;

    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.text(`Name: ${electronicSignature}`, m, y); y += 14;
    doc.text(`Title: Settlor / Trustor`, m, y); y += 14;
    doc.text(`Date: ${executionDate}`, m, y); y += 14;
    const now = new Date();
    const signedAt = now.toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZoneName: 'short'
    });
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(`Signed electronically: ${signedAt}`, m, y);
    doc.setTextColor(0);
    y += 30;

    // Co-trustor signature line (if applicable)
    const coTrustorName = matter?.intake_data?.spouse_name || matter?.intake_data?.co_trustor_name;
    if (coTrustorName) {
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.text('CO-SETTLOR / CO-TRUSTOR SIGNATURE:', m, y);
      y += 16;
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.text(`Name: ${coTrustorName}`, m, y); y += 18;
      doc.text('Signature:', m, y);
      doc.line(m + 60, y, m + cw * 0.6, y); y += 18;
      doc.text('Date:', m, y);
      doc.line(m + 40, y, m + cw * 0.35, y); y += 30;
    }

    // ---- DOCUMENT CERTIFICATE ----
    doc.addPage();
    y = m;
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.text('DOCUMENT CERTIFICATE', pageW / 2, y, { align: 'center' });
    y += 24;
    doc.setDrawColor(107, 33, 168);
    doc.setLineWidth(1);
    doc.rect(m, y, cw, 180);
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    y += 16;
    const trustName = matter?.intake_data?.trust_name || `${matter?.client_name || 'Trust'} Living Trust`;
    const certData = [
      ['Document', `California Living Trust — ${trustName}`],
      ['Matter ID', matterId || 'N/A'],
      ['Stripe Session', sessionId || 'N/A'],
      ['Purchaser', matter?.client_name || 'N/A'],
      ['Purchaser Email', matter?.client_email || 'N/A'],
      ['Electronic Signature', electronicSignature],
      ['Execution Date', executionDate],
      ['Generated', new Date().toISOString()],
      ['Tier', t.tiers[matter?.review_tier] || matter?.review_tier || 'N/A'],
      ['Platform', 'Multi Servicios 360 Corporation']
    ];
    for (const [label, value] of certData) {
      doc.setFont('times', 'bold');
      doc.text(`${label}:`, m + 12, y);
      doc.setFont('times', 'normal');
      doc.text(String(value), m + 130, y);
      y += 14;
    }
    y += 10;
    doc.setFontSize(9);
    const certNote = doc.splitTextToSize('This certificate verifies this document was generated through a single paid transaction and is tied to the above identifiers. Any copy without this certificate page may not be authentic.', cw - 24);
    doc.text(certNote, m + 12, y);

    // ---- SOFTWARE DISCLOSURE ----
    y += certNote.length * 12 + 30;
    if (y > pageH - 250) { doc.addPage(); y = m; }
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.text('SOFTWARE PLATFORM DISCLOSURE', pageW / 2, y, { align: 'center' });
    y += 24;
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    const disc = [
      'This Living Trust document was created by the user using the Multi Servicios 360 software platform.',
      '',
      'Multi Servicios 360 is a software technology company. It is NOT a law firm, does NOT provide legal advice, and does NOT represent any party in legal matters.',
      '',
      'The user acknowledges that:',
      '• The user created this document themselves using software tools provided by Multi Servicios 360.',
      '• No attorney-client relationship exists between the user and Multi Servicios 360.',
      '• Multi Servicios 360 did not review this document for legal accuracy or completeness.',
      '• The user is solely responsible for the contents of this document.',
      '• Multi Servicios 360 recommends consulting with a licensed California attorney.',
      '',
      'Multi Servicios 360 Corporation | Beverly Hills, California',
      'www.multiservicios360.net | 855.246.7274'
    ];
    for (const line of disc) {
      if (!line) { y += 8; continue; }
      const w = doc.splitTextToSize(line, cw);
      if (y + w.length * 13 + 5 > pageH - m) { doc.addPage(); y = m; }
      doc.text(w, m, y);
      y += w.length * 13 + 3;
    }

    // Page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('times', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(`Signature Addendum — Page ${i} of ${totalPages}`, pageW / 2, pageH - 20, { align: 'center' });
      doc.setTextColor(0);
    }

    return doc.output('blob');
  };

  // ============================================
  // Download handlers
  // ============================================
  const handleDownload = async () => {
    if (!pdfBlob || !signatureComplete) return;
    const name = (matter?.client_name || 'Trust').replace(/\s+/g, '_');

    // Download main Trust PDF
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}_California_Living_Trust.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    URL.revokeObjectURL(sigUrl);
        saveToVault({ blob: sigBlob, matterId, clientName: matter?.client_name, clientEmail: matter?.client_email, documentType: 'trust-signature', language: 'en', fileName: sigLink.download });

    // Generate and download signature addendum
    try {
      const sigBlob = await generateSignatureAddendum();
      const sigUrl = URL.createObjectURL(sigBlob);
      const sigLink = document.createElement('a');
      sigLink.href = sigUrl;
      sigLink.download = `${name}_Signature_Addendum.pdf`;
      setTimeout(() => {
        sigLink.click();
        URL.revokeObjectURL(sigUrl);
      }, 1000); // slight delay so both downloads register
    } catch (err) {
      console.error('Signature addendum generation failed:', err);
    }
  };

  const handlePrint = () => {
    if (!pdfBlob || !signatureComplete) return;
    const url = URL.createObjectURL(pdfBlob);
    const win = window.open(url, '_blank');
    if (win) { win.onload = () => win.print(); }
  };

  const handleView = () => {
    if (!pdfBlob || !signatureComplete) return;
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  };

  const handleEmailSend = async () => {
    if (!emailTo || !pdfBlob || !signatureComplete) return;
    setEmailSending(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const res = await fetch('/api/send-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: emailTo,
            subject: language === 'es' 
              ? 'Su Fideicomiso en Vida de California - Multi Servicios 360' 
              : 'Your California Living Trust - Multi Servicios 360',
            documentType: 'trust',
            pdfBase64: reader.result.split(',')[1],
            fileName: `${(matter?.client_name || 'Trust').replace(/\s+/g, '_')}_California_Living_Trust.pdf`,
            clientName: matter?.client_name
          })
        });
        if (res.ok) {
          setEmailSent(true);
          setTimeout(() => { setShowEmailModal(false); setEmailSent(false); }, 2000);
        }
      };
      reader.readAsDataURL(pdfBlob);
    } catch (e) { console.error(e); } finally { setEmailSending(false); }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid #E9D5FF', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>{t.loading}</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3FF', padding: '24px' }}>
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        
        {/* Success Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(124,58,237,0.15)' }}>
          
          {/* Success Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 8px 0' }}>{t.title}</h1>
            <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>{t.message}</p>
          </div>

          {/* Order Info */}
          {matter && (
            <div style={{ backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '10px', marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6B7280', fontWeight: '500' }}>{t.orderId}</span>
                <span style={{ fontFamily: 'monospace', color: '#1F2937', fontWeight: '600' }}>{matterId?.substring(0, 8).toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6B7280', fontWeight: '500' }}>{t.tier}</span>
                <span style={{ fontWeight: '600', color: '#7C3AED' }}>{t.tiers[matter.review_tier] || matter.review_tier}</span>
              </div>
              {matter.created_at && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280', fontWeight: '500' }}>{t.agreementDate}</span>
                  <span style={{ color: '#1F2937' }}>{new Date(matter.created_at).toLocaleDateString()} {new Date(matter.created_at).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          )}

          {/* ============ ELECTRONIC SIGNATURE SECTION ============ */}
          <div style={{
            backgroundColor: signatureComplete ? '#F0FDF4' : 'white',
            border: signatureComplete ? '2px solid #22C55E' : '2px solid #7C3AED',
            borderRadius: '12px', padding: '24px', marginBottom: '25px'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: signatureComplete ? '#15803D' : '#7C3AED', margin: '0 0 16px 0' }}>
              ✍️ {t.signatureSection}
            </h3>

            {signatureComplete ? (
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#15803D', margin: 0 }}>{t.signatureConfirmed}</p>
                <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px' }}>
                  {electronicSignature} — {executionDate}
                </p>
              </div>
            ) : (
              <>
                {/* Execution Date */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{t.executionDateLabel} *</label>
                  <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px', marginTop: 0 }}>{t.executionDateHelp}</p>
                  <input type="text" value={executionDate}
                    onChange={e => { setExecutionDate(e.target.value); if (signatureError) setSignatureError(''); }}
                    placeholder="MM/DD/YYYY"
                    style={{ width: '200px', padding: '10px 14px', border: '2px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Electronic Signature */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{t.signatureLabel} *</label>
                  <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px', marginTop: 0 }}>{t.signatureHelp}</p>
                  <input type="text" value={electronicSignature}
                    onChange={e => { setElectronicSignature(e.target.value); if (signatureError) setSignatureError(''); }}
                    placeholder={t.signaturePlaceholder}
                    style={{
                      width: '100%', padding: '14px 16px',
                      border: signatureError ? '2px solid #DC2626' : '2px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '20px',
                      fontFamily: "'Times New Roman', serif",
                      fontStyle: 'italic', fontWeight: 'bold',
                      color: '#7C3AED', boxSizing: 'border-box',
                      backgroundColor: '#FAFAFA'
                    }}
                  />
                </div>

                {/* Acceptance Checkbox */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={signatureAccepted}
                      onChange={e => { setSignatureAccepted(e.target.checked); if (signatureError) setSignatureError(''); }}
                      style={{ marginTop: '4px', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>{t.signatureAcceptLabel}</span>
                  </label>
                </div>

                {/* Signature Error */}
                {signatureError && (
                  <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
                    <p style={{ color: '#DC2626', fontSize: '13px', fontWeight: '600', margin: 0 }}>⚠️ {signatureError}</p>
                  </div>
                )}

                {/* Confirm Signature Button */}
                <button onClick={handleSignatureConfirm}
                  style={{
                    padding: '14px 28px', backgroundColor: '#7C3AED', color: 'white',
                    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
                    cursor: 'pointer', width: '100%'
                  }}>
                  {language === 'es' ? 'Confirmar Firma' : 'Confirm Signature'}
                </button>
              </>
            )}
          </div>

          {/* Notary Reminder */}
          <div style={{ backgroundColor: '#FEF3C7', border: '2px solid #F59E0B', padding: '20px', borderRadius: '10px', marginBottom: '25px' }}>
            <p style={{ color: '#92400E', fontWeight: '700', margin: 0, fontSize: '14px' }}>{t.notaryReminder}</p>
          </div>

          {/* PDF Generation Status */}
          {pdfGenerating && (
            <div style={{ textAlign: 'center', padding: '20px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #E9D5FF', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }}></div>
              <p style={{ color: '#7C3AED', fontWeight: '500' }}>{t.generatingPdf}</p>
            </div>
          )}

          {/* Action Buttons — only active after signature */}
          {!pdfGenerating && pdfBlob && (
            <>
              {!signatureComplete && (
                <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#FEF2F2', borderRadius: '8px', marginBottom: '20px' }}>
                  <p style={{ color: '#DC2626', fontSize: '14px', fontWeight: '500', margin: 0 }}>⚠️ {t.signBeforeDownload}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '25px', flexWrap: 'wrap' }}>
                <button onClick={handleDownload} disabled={!signatureComplete}
                  style={{ 
                    padding: '16px 32px', 
                    backgroundColor: signatureComplete ? '#7C3AED' : '#D1D5DB', 
                    color: 'white', border: 'none', borderRadius: '10px', 
                    fontSize: '16px', fontWeight: '600', 
                    cursor: signatureComplete ? 'pointer' : 'not-allowed', 
                    display: 'flex', alignItems: 'center', gap: '10px',
                    boxShadow: signatureComplete ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
                    opacity: signatureComplete ? 1 : 0.6
                  }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  {t.downloadBtn}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '25px', flexWrap: 'wrap' }}>
                <button onClick={handleView} disabled={!signatureComplete}
                  style={{ padding: '12px 24px', backgroundColor: 'white', color: signatureComplete ? '#7C3AED' : '#9CA3AF', border: `2px solid ${signatureComplete ? '#7C3AED' : '#D1D5DB'}`, borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: signatureComplete ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  👁️ {t.viewBtn}
                </button>
                <button onClick={handlePrint} disabled={!signatureComplete}
                  style={{ padding: '12px 24px', backgroundColor: 'white', color: signatureComplete ? '#7C3AED' : '#9CA3AF', border: `2px solid ${signatureComplete ? '#7C3AED' : '#D1D5DB'}`, borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: signatureComplete ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🖨️ {t.printBtn}
                </button>
                <button onClick={() => signatureComplete && setShowEmailModal(true)} disabled={!signatureComplete}
                  style={{ padding: '12px 24px', backgroundColor: 'white', color: signatureComplete ? '#7C3AED' : '#9CA3AF', border: `2px solid ${signatureComplete ? '#7C3AED' : '#D1D5DB'}`, borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: signatureComplete ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ✉️ {t.emailBtn}
                </button>
              </div>
            </>
          )}

          {/* Next Steps */}
          <div style={{ backgroundColor: '#FAF5FF', padding: '24px', borderRadius: '10px', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#7C3AED', marginBottom: '16px', margin: '0 0 16px 0' }}>{t.nextSteps}</h3>
            <div style={{ color: '#4B5563', lineHeight: '1.9', fontSize: '14px' }}>
              <p style={{ margin: '0 0 10px 0' }}>{t.step1}</p>
              <p style={{ margin: '0 0 10px 0' }}>{t.step2}</p>
              <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#92400E' }}>{t.step3}</p>
              <p style={{ margin: '0 0 10px 0' }}>{t.step4}</p>
              <p style={{ margin: '0 0 10px 0' }}>{t.step5}</p>
              <p style={{ margin: 0 }}>{t.step6}</p>
            </div>
          </div>

          {/* Contact & Actions */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ fontWeight: '600', color: '#1F2937', marginBottom: '6px' }}>{t.questions}</p>
            <p style={{ color: '#6B7280', margin: 0 }}>{t.contact}</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} 
              style={{ padding: '12px 20px', backgroundColor: 'white', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
              {language === 'en' ? 'Español' : 'English'}
            </button>
            <a href="/" style={{ padding: '12px 24px', backgroundColor: '#F3F4F6', color: '#374151', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', fontSize: '14px', display: 'inline-block' }}>
              {t.backHome}
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF', fontSize: '12px' }}>
          <p style={{ margin: 0 }}>Multi Servicios 360 | www.multiservicios360.net | (855) 246-7274</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '11px' }}>
            Este documento fue auto-preparado usando nuestra plataforma de software. No constituye asesoría legal.
          </p>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', width: '90%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            {emailSent ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ width: '70px', height: '70px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p style={{ color: '#059669', fontWeight: '600', fontSize: '18px', margin: 0 }}>{t.emailSuccess}</p>
              </div>
            ) : (
              <>
                <h3 style={{ margin: '0 0 24px', color: '#1F2937', fontSize: '20px' }}>{t.emailModalTitle}</h3>
                <label style={{ display: 'block', marginBottom: '10px', color: '#4B5563', fontWeight: '500' }}>{t.emailLabel}</label>
                <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)}
                  style={{ width: '100%', padding: '14px', border: '2px solid #E5E7EB', borderRadius: '10px', fontSize: '16px', marginBottom: '24px', boxSizing: 'border-box', outline: 'none' }} />
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowEmailModal(false)} style={{ padding: '12px 24px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>{t.cancelBtn}</button>
                  <button onClick={handleEmailSend} disabled={emailSending} style={{ padding: '12px 28px', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', opacity: emailSending ? 0.7 : 1, fontWeight: '600' }}>{emailSending ? '...' : t.sendBtn}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function TrustSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6B7280' }}>Loading...</p>
      </div>
    }>
      <TrustSuccessContent />
    </Suspense>
  );
}