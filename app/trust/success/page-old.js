"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { jsPDF } from 'jspdf';

// ============================================================
// TRUST SUCCESS PAGE WITH BUILT-IN PDF GENERATOR
// Single file - no external imports needed
// ============================================================

function TrustSuccessContent() {
  const searchParams = useSearchParams();
  const matterId = searchParams.get('matter_id');
  
  const [language, setLanguage] = useState('es');
  const [matter, setMatter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const t = language === 'es' ? {
    title: '¡Pago Exitoso!',
    message: 'Su Fideicomiso en Vida de California está listo.',
    downloadBtn: 'Descargar PDF',
    printBtn: 'Imprimir',
    emailBtn: 'Enviar por Correo',
    viewBtn: 'Ver PDF',
    nextSteps: 'Próximos Pasos:',
    step1: '1. Descargue y revise su documento.',
    step2: '2. Firme frente a un notario público de California.',
    step3: '3. Transfiera sus activos al fideicomiso.',
    step4: '4. Guarde el documento original en lugar seguro.',
    questions: '¿Preguntas? Llámenos al (855) 246-7274',
    backHome: 'Volver al Inicio',
    orderId: 'Orden:',
    tier: 'Paquete:',
    emailModalTitle: 'Enviar por Correo',
    emailLabel: 'Correo Electrónico:',
    sendBtn: 'Enviar',
    cancelBtn: 'Cancelar',
    emailSuccess: '¡Enviado!',
    loading: 'Preparando documento...',
    notaryReminder: '⚠️ IMPORTANTE: Debe firmarse frente a un notario de California.',
    notaryLink: 'Descargar Formulario de Notario',
    tiers: { trust_core: 'Básico ($599)', trust_plus: 'Plus ($899)', trust_elite: 'Elite ($1,299)' }
  } : {
    title: 'Payment Successful!',
    message: 'Your California Living Trust is ready.',
    downloadBtn: 'Download PDF',
    printBtn: 'Print',
    emailBtn: 'Email',
    viewBtn: 'View PDF',
    nextSteps: 'Next Steps:',
    step1: '1. Download and review your document.',
    step2: '2. Sign in front of a California Notary Public.',
    step3: '3. Transfer your assets to the trust.',
    step4: '4. Store the original document safely.',
    questions: 'Questions? Call (855) 246-7274',
    backHome: 'Back to Home',
    orderId: 'Order:',
    tier: 'Package:',
    emailModalTitle: 'Send via Email',
    emailLabel: 'Email Address:',
    sendBtn: 'Send',
    cancelBtn: 'Cancel',
    emailSuccess: 'Sent!',
    loading: 'Preparing document...',
    notaryReminder: '⚠️ IMPORTANT: Must be signed before a California Notary.',
    notaryLink: 'Download CA Notary Form',
    tiers: { trust_core: 'Core ($599)', trust_plus: 'Plus ($899)', trust_elite: 'Elite ($1,299)' }
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
        generatePDF(data.matter);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // PDF GENERATOR - BUILT IN
  // ============================================================
  const generatePDF = (matterData) => {
    if (!matterData) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;
    let articleNum = 0;
    let sectionNum = 0;

    const addPage = () => { doc.addPage(); y = margin; };
    const checkPageBreak = (needed = 20) => { if (y + needed > pageHeight - 25) addPage(); };
    
    const centerText = (text, fontSize = 12, style = 'normal') => {
      doc.setFontSize(fontSize);
      doc.setFont('times', style);
      doc.text(text, pageWidth / 2, y, { align: 'center' });
      y += fontSize * 0.45;
    };

    const addArticle = (title) => {
      articleNum++;
      sectionNum = 0;
      checkPageBreak(25);
      y += 8;
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text(`ARTICLE ${toRoman(articleNum)}`, margin, y);
      y += 6;
      doc.text(title.toUpperCase(), margin, y);
      y += 10;
    };

    const addSection = (title, content) => {
      sectionNum++;
      checkPageBreak(25);
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.text(`Section ${articleNum}.${sectionNum}. ${title}`, margin, y);
      y += 6;
      if (content) {
        doc.setFont('times', 'normal');
        const lines = doc.splitTextToSize(content, contentWidth);
        lines.forEach(line => { checkPageBreak(6); doc.text(line, margin, y); y += 5; });
        y += 4;
      }
    };

    const addText = (content) => {
      doc.setFontSize(11);
      doc.setFont('times', 'normal');
      const lines = doc.splitTextToSize(content, contentWidth);
      lines.forEach(line => { checkPageBreak(6); doc.text(line, margin, y); y += 5; });
      y += 3;
    };

    const toRoman = (num) => ['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV'][num] || String(num);

    // Extract data
    const d = matterData.intake_data || {};
    const trustorName = d.trustor_name || matterData.client_name || '[TRUSTOR NAME]';
    const spouseName = d.spouse_name || '';
    const isJoint = d.is_joint_trust === true || d.is_joint_trust === 'yes';
    const county = d.county || 'Los Angeles';
    const trustDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const trustName = isJoint && spouseName ? `The ${trustorName} and ${spouseName} Trust dated ${trustDate}` : `The ${trustorName} Trust dated ${trustDate}`;
    const TR = isJoint ? 'Trustors' : 'Trustor';
    const TE = isJoint ? 'Trustees' : 'Trustee';
    const POSS = isJoint ? 'their' : 'his or her';
    const successor1 = d.successor_trustee_1_name || '[SUCCESSOR TRUSTEE 1]';
    const successor2 = d.successor_trustee_2_name || '[SUCCESSOR TRUSTEE 2]';
    const beneficiaries = d.primary_beneficiaries || '[BENEFICIARIES]';
    const shares = d.beneficiary_shares || 'in equal shares';
    const tier = matterData.review_tier || 'trust_plus';
    const includePlus = tier === 'trust_plus' || tier === 'trust_elite';
    const includeElite = tier === 'trust_elite';

    // ===== COVER PAGE =====
    y = 50;
    doc.setDrawColor(60, 60, 60);
    doc.setLineWidth(2);
    doc.line(margin, y - 8, pageWidth - margin, y - 8);
    y += 5;
    centerText('DECLARATION OF TRUST', 22, 'bold');
    y += 8;
    centerText('CALIFORNIA REVOCABLE LIVING TRUST', 14, 'bold');
    y += 20;
    doc.setLineWidth(0.5);
    doc.line(margin + 35, y, pageWidth - margin - 35, y);
    y += 15;
    centerText(trustName, 14, 'italic');
    y += 25;
    centerText(`Effective Date: ${trustDate}`, 11, 'normal');
    y += 6;
    centerText(`County of ${county}, State of California`, 11, 'normal');
    y += 30;
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(180, 180, 180);
    doc.rect(margin + 15, y, contentWidth - 30, 50, 'FD');
    y += 15;
    centerText(TR.toUpperCase(), 10, 'bold');
    y += 7;
    centerText(isJoint && spouseName ? `${trustorName} and ${spouseName}` : trustorName, 12, 'normal');
    y += 12;
    centerText(`INITIAL ${TE.toUpperCase()}`, 10, 'bold');
    y += 7;
    centerText(isJoint && spouseName ? `${trustorName} and ${spouseName}` : trustorName, 12, 'normal');
    y += 40;
    doc.setLineWidth(2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;
    doc.setFontSize(9);
    doc.setFont('times', 'italic');
    doc.text('This document was self-prepared using Multi Servicios 360 software. Not legal advice.', pageWidth / 2, y, { align: 'center' });

    // ===== TABLE OF CONTENTS =====
    addPage();
    y = 30;
    centerText('TABLE OF CONTENTS', 14, 'bold');
    y += 15;
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    ['ARTICLE I - CREATION OF TRUST', 'ARTICLE II - TRUST PROPERTY', 'ARTICLE III - TRUSTEES', 'ARTICLE IV - TRUSTEE POWERS', 'ARTICLE V - DISTRIBUTIONS DURING LIFETIME', 'ARTICLE VI - INCAPACITY PROVISIONS', 'ARTICLE VII - DISTRIBUTIONS AT DEATH', 'ARTICLE VIII - ADMINISTRATION', 'ARTICLE IX - GENERAL PROVISIONS', 'ARTICLE X - EXECUTION', 'SCHEDULE A - TRUST PROPERTY', 'NOTARY ACKNOWLEDGMENT INSTRUCTIONS', 'PLATFORM DISCLOSURE'].forEach(item => {
      checkPageBreak(7);
      doc.text(item, margin, y);
      y += 7;
    });

    // ===== ARTICLE I - CREATION =====
    addPage();
    y = 25;
    centerText('DECLARATION OF TRUST', 13, 'bold');
    y += 10;
    addArticle('CREATION OF TRUST');
    addSection('Declaration', isJoint ? `This Declaration of Trust is made by ${trustorName} and ${spouseName}, as ${TR}, effective ${trustDate}, under California law.` : `This Declaration of Trust is made by ${trustorName}, as ${TR}, effective ${trustDate}, under California law.`);
    addSection('Identification', isJoint ? `The ${TR} are ${trustorName} and ${spouseName}.` : `The ${TR} is ${trustorName}.`);
    addSection('Trust Name', `This Trust shall be known as "${trustName}."`);
    addSection('Intent', `The ${TR} intends to create a valid trust to hold, manage, and distribute property.`);
    addSection('Revocability', isJoint ? `This Trust is revocable by either ${TR} during lifetime. Upon death, it becomes irrevocable.` : `This Trust is revocable during the ${TR}'s lifetime.`);
    addSection('Governing Law', 'This Trust is governed by California law.');
    addSection('Purpose', 'To manage, conserve, and distribute the Trust estate for beneficiaries.');

    // ===== ARTICLE II - PROPERTY =====
    addArticle('TRUST PROPERTY');
    addSection('Trust Property', `The Trust estate consists of all property transferred to the ${TE}, as described in Schedule A.`);
    addSection('Additional Property', `The ${TR} may add property at any time.`);

    // ===== ARTICLE III - TRUSTEES =====
    addArticle('TRUSTEES');
    addSection('Initial ' + TE, isJoint ? `${trustorName} and ${spouseName} are the initial Co-${TE}.` : `${trustorName} is the initial ${TE}.`);
    addSection('Successor ' + TE, `If the ${TE} cannot serve:\n\nFirst: ${successor1}\nSecond: ${successor2}`);
    addSection('Acceptance', `${TE} accepts by acting or written acceptance.`);
    addSection('Compensation', `${TE} is entitled to reasonable compensation.`);
    addSection('No Bond', `No bond required.`);
    if (includePlus) {
      addSection('Resignation', `${TE} may resign with 30 days written notice.`);
      addSection('Removal', `${TE} may be removed by ${TR} or majority of beneficiaries.`);
    }

    // ===== ARTICLE IV - POWERS =====
    addArticle('TRUSTEE POWERS');
    addSection('General Powers', `${TE} has all powers under California Probate Code §16200-16249.`);
    addSection('Asset Management', `${TE} may collect, hold, manage, invest, sell, lease, mortgage Trust property.`);
    addSection('Hire Professionals', `${TE} may employ attorneys, accountants, advisors.`);
    addSection('Borrow', `${TE} may borrow money and encumber Trust property.`);
    addSection('Distributions', `${TE} may distribute in cash or kind.`);
    if (includePlus) addSection('Real Property', `${TE} may lease, improve, sell real property.`);
    if (includeElite && d.has_digital_assets) addSection('Digital Assets', `${TE} may manage digital assets under California law.`);
    if (includeElite && d.owns_business) addSection('Business', `${TE} may continue or liquidate business interests.`);

    // ===== ARTICLE V - LIFETIME DISTRIBUTIONS =====
    addArticle('DISTRIBUTIONS DURING LIFETIME');
    if (isJoint) {
      addSection('Joint Lifetimes', `During both ${TR}' lifetimes, Trust assets used for health, education, maintenance, support.`);
      addSection('First Death', `Surviving ${TR} continues as ${TE} and beneficiary.`);
    } else {
      addSection('During Lifetime', `During ${TR}'s lifetime, Trust assets used for health, education, maintenance, support.`);
    }

    // ===== ARTICLE VI - INCAPACITY =====
    addArticle('INCAPACITY PROVISIONS');
    addSection('Determination', `Incapacity determined by two licensed physicians.`);
    addSection('Management', `Upon incapacity, Successor ${TE} manages Trust for ${TR}'s benefit.`);
    addSection('Recovery', `Upon recovery, ${TR} resumes as ${TE}.`);

    // ===== ARTICLE VII - DEATH DISTRIBUTIONS =====
    addArticle('DISTRIBUTIONS AT DEATH');
    addSection('Final Expenses', `Pay final expenses, medical costs, funeral costs.`);
    addSection('Debts and Taxes', `Pay legally enforceable debts and taxes.`);
    addSection('Residual Distribution', `Distribute remaining estate to:\n\n${beneficiaries}\n\nShares: ${shares}`);
    if (includePlus) {
      addSection('Per Stirpes', `If beneficiary predeceases, share passes to descendants.`);
      addSection('Survivorship', `Beneficiary must survive by 30 days to inherit.`);
    }
    if (includePlus && d.has_minor_children) {
      const distAge = d.minor_distribution_age || '25';
      addSection("Minor's Trust", `Shares for minors held until age ${distAge}.`);
    }

    // ===== ARTICLE VIII - ADMINISTRATION =====
    addArticle('ADMINISTRATION');
    if (includePlus) {
      addSection('Accountings', `${TE} provides annual accountings to beneficiaries.`);
      addSection('Reserves', `${TE} may retain reserves for expenses.`);
    }
    addSection('Property Memo', `${TE} distributes tangible property per written memorandum.`);

    // ===== ARTICLE IX - GENERAL =====
    addArticle('GENERAL PROVISIONS');
    addSection('Spendthrift', `Beneficiary interests protected from creditors.`);
    addSection('Severability', `Invalid provisions do not affect others.`);
    addSection('Construction', `Gender words include all genders; singular includes plural.`);
    addSection('Headings', `Headings for convenience only.`);
    if (includePlus) addSection('Mediation', `Disputes first submitted to mediation.`);
    if (includeElite && d.has_no_contest) addSection('No-Contest', `Contesting beneficiary forfeits share (CA Probate Code §21311).`);

    // ===== ARTICLE X - EXECUTION =====
    addArticle('EXECUTION');
    addSection('Execution', `IN WITNESS WHEREOF, the ${TR} ${isJoint ? 'have' : 'has'} executed this Trust.`);
    y += 15;
    checkPageBreak(60);
    doc.setFont('times', 'bold');
    doc.text(TR.toUpperCase() + ':', margin, y);
    y += 25;
    doc.line(margin, y, margin + 85, y);
    y += 5;
    doc.setFont('times', 'normal');
    doc.text(trustorName, margin, y);
    y += 12;
    doc.text('Date: _______________________________', margin, y);
    if (isJoint && spouseName) {
      y += 25;
      doc.line(margin, y, margin + 85, y);
      y += 5;
      doc.text(spouseName, margin, y);
      y += 12;
      doc.text('Date: _______________________________', margin, y);
    }

    // ===== SCHEDULE A =====
    addPage();
    y = 30;
    centerText('SCHEDULE A', 14, 'bold');
    y += 6;
    centerText('TRUST PROPERTY', 12, 'bold');
    y += 15;
    addText('The following property is transferred to the Trust:');
    y += 8;
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, y, contentWidth, 80, 'F');
    y += 10;
    doc.setFont('times', 'bold');
    doc.text('1. REAL PROPERTY:', margin + 5, y);
    y += 7;
    doc.setFont('times', 'normal');
    doc.text(d.properties ? `   ${d.properties}` : '   [List properties]', margin + 5, y);
    y += 12;
    doc.setFont('times', 'bold');
    doc.text('2. PERSONAL PROPERTY:', margin + 5, y);
    y += 7;
    doc.setFont('times', 'normal');
    doc.text('   All furniture, jewelry, vehicles, personal items.', margin + 5, y);
    y += 12;
    doc.setFont('times', 'bold');
    doc.text('3. FINANCIAL ACCOUNTS:', margin + 5, y);
    y += 7;
    doc.setFont('times', 'normal');
    doc.text('   Bank and investment accounts retitled to Trust.', margin + 5, y);
    y += 20;
    doc.text(`${TR} Initials: _______ ${isJoint ? '_______' : ''}     Date: _______________`, margin, y);

    // ===== NOTARY INSTRUCTIONS =====
    addPage();
    y = 30;
    centerText('NOTARY ACKNOWLEDGMENT INSTRUCTIONS', 14, 'bold');
    y += 20;
    doc.setFillColor(255, 250, 230);
    doc.setDrawColor(230, 180, 0);
    doc.rect(margin, y, contentWidth, 35, 'FD');
    y += 15;
    centerText('ATTACH CALIFORNIA ALL-PURPOSE ACKNOWLEDGMENT', 11, 'bold');
    y += 8;
    doc.setTextColor(0, 0, 200);
    doc.text('https://notary.cdn.sos.ca.gov/forms/notary-ack.pdf', pageWidth / 2, y, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y += 25;
    addText('The notary verifies identity only, not document validity.');
    addText(`${TR} must appear before a California Notary with valid photo ID.`);

    // ===== PLATFORM DISCLOSURE =====
    addPage();
    y = 30;
    centerText('SOFTWARE PLATFORM DISCLOSURE', 14, 'bold');
    y += 15;
    doc.setFont('times', 'bold');
    doc.text('IMPORTANT NOTICE:', margin, y);
    y += 10;
    doc.setFont('times', 'normal');
    const disclosures = [
      '1. Multi Servicios 360 provides software for self-preparation of legal documents.',
      '2. This is NOT a law firm and does NOT provide legal advice.',
      '3. This document was self-prepared by the user.',
      '4. No attorney-client relationship is created.',
      '5. For complex situations, consult a licensed attorney.',
      '6. User is responsible for accuracy of all information.',
      '7. Document provided "as is" without warranty.'
    ];
    disclosures.forEach(d => { doc.text(d, margin, y); y += 7; });
    y += 15;
    doc.setFont('times', 'bold');
    doc.text('USER ACKNOWLEDGMENT:', margin, y);
    y += 10;
    doc.setFont('times', 'normal');
    doc.text(`Name: ${matterData.client_name || trustorName}`, margin, y);
    y += 7;
    doc.text(`Date: ${new Date(matterData.created_at || Date.now()).toLocaleDateString()}`, margin, y);
    y += 7;
    doc.text('Agreement: I agree to the above disclosures.', margin, y);
    y += 20;
    doc.setFontSize(9);
    doc.text('Multi Servicios 360 | www.multiservicios360.net | (855) 246-7274', pageWidth / 2, y, { align: 'center' });

    // ===== PAGE NUMBERS =====
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(trustName, pageWidth / 2, pageHeight - 12, { align: 'center' });
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
      doc.setTextColor(0, 0, 0);
    }

    setPdfBlob(doc.output('blob'));
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(matter?.client_name || 'Trust').replace(/\s+/g, '_')}_Living_Trust.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const win = window.open(url, '_blank');
    if (win) win.onload = () => win.print();
  };

  const handleView = () => {
    if (!pdfBlob) return;
    window.open(URL.createObjectURL(pdfBlob), '_blank');
  };

  const handleEmailSend = async () => {
    if (!emailTo || !pdfBlob) return;
    setEmailSending(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const res = await fetch('/api/send-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: emailTo,
            subject: 'Your California Living Trust - Multi Servicios 360',
            documentType: 'trust',
            pdfBase64: reader.result.split(',')[1],
            fileName: `${(matter?.client_name || 'Trust').replace(/\s+/g, '_')}_Living_Trust.pdf`,
            clientName: matter?.client_name
          })
        });
        if (res.ok) {
          setEmailSent(true);
          setTimeout(() => { setShowEmailModal(false); setEmailSent(false); }, 2000);
        }
      };
      reader.readAsDataURL(pdfBlob);
    } catch (e) { console.error(e); }
    setEmailSending(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #E9D5FF', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#6B7280' }}>{t.loading}</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3FF', padding: '24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(124,58,237,0.15)', textAlign: 'center' }}>
          
          {/* Success Icon */}
          <div style={{ width: '80px', height: '80px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>{t.title}</h1>
          <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '24px' }}>{t.message}</p>

          {/* Order Info */}
          {matter && (
            <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6B7280' }}>{t.orderId}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{matterId?.substring(0, 8).toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>{t.tier}</span>
                <span style={{ fontWeight: '600', color: '#7C3AED' }}>{t.tiers[matter.review_tier] || matter.review_tier}</span>
              </div>
            </div>
          )}

          {/* Main Download Button */}
          <button onClick={handleDownload} style={{ padding: '16px 32px', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', marginBottom: '16px', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
            ⬇️ {t.downloadBtn}
          </button>

          {/* Secondary Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button onClick={handleView} style={{ padding: '12px 20px', backgroundColor: 'white', color: '#7C3AED', border: '2px solid #7C3AED', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>👁️ {t.viewBtn}</button>
            <button onClick={handlePrint} style={{ padding: '12px 20px', backgroundColor: 'white', color: '#7C3AED', border: '2px solid #7C3AED', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>🖨️ {t.printBtn}</button>
            <button onClick={() => setShowEmailModal(true)} style={{ padding: '12px 20px', backgroundColor: 'white', color: '#7C3AED', border: '2px solid #7C3AED', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>✉️ {t.emailBtn}</button>
          </div>

          {/* Notary Warning */}
          <div style={{ backgroundColor: '#FEF3C7', border: '2px solid #F59E0B', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            <p style={{ color: '#92400E', fontWeight: '700', margin: '0 0 8px 0' }}>{t.notaryReminder}</p>
            <a href="https://notary.cdn.sos.ca.gov/forms/notary-ack.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#92400E', fontWeight: '600', textDecoration: 'underline' }}>
              📄 {t.notaryLink}
            </a>
          </div>

          {/* Next Steps */}
          <div style={{ backgroundColor: '#FAF5FF', padding: '20px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left' }}>
            <h3 style={{ color: '#7C3AED', marginBottom: '12px', margin: '0 0 12px 0' }}>{t.nextSteps}</h3>
            <p style={{ color: '#4B5563', margin: '0 0 6px 0', fontSize: '14px' }}>{t.step1}</p>
            <p style={{ color: '#92400E', margin: '0 0 6px 0', fontSize: '14px', fontWeight: '600' }}>{t.step2}</p>
            <p style={{ color: '#4B5563', margin: '0 0 6px 0', fontSize: '14px' }}>{t.step3}</p>
            <p style={{ color: '#4B5563', margin: 0, fontSize: '14px' }}>{t.step4}</p>
          </div>

          <p style={{ color: '#6B7280', marginBottom: '20px' }}>{t.questions}</p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} style={{ padding: '10px 16px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {language === 'en' ? '🇲🇽 Español' : '🇺🇸 English'}
            </button>
            <a href="/" style={{ padding: '10px 20px', backgroundColor: '#F3F4F6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontWeight: '600' }}>{t.backHome}</a>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '12px', marginTop: '20px' }}>Multi Servicios 360 | (855) 246-7274</p>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '400px' }}>
            {emailSent ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p style={{ color: '#059669', fontWeight: '600' }}>{t.emailSuccess}</p>
              </div>
            ) : (
              <>
                <h3 style={{ margin: '0 0 20px', color: '#1F2937' }}>{t.emailModalTitle}</h3>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4B5563' }}>{t.emailLabel}</label>
                <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', marginBottom: '20px', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowEmailModal(false)} style={{ padding: '10px 20px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{t.cancelBtn}</button>
                  <button onClick={handleEmailSend} disabled={emailSending} style={{ padding: '10px 20px', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: emailSending ? 0.7 : 1 }}>{emailSending ? '...' : t.sendBtn}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrustSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></div>}>
      <TrustSuccessContent />
    </Suspense>
  );
}