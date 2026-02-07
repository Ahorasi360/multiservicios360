// app/llc/success/page.js
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function LLCSuccessContent() {
  const searchParams = useSearchParams();
  const matterId = searchParams.get('matter_id');
  const sessionId = searchParams.get('session_id');

  const [matter, setMatter] = useState(null);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [language, setLanguage] = useState('en');
  const pdfGenerated = useRef(false);

  const t = {
    en: {
      title: 'LLC Formation Complete!',
      subtitle: 'Your payment has been processed successfully.',
      preparing: 'Preparing your Operating Agreement...',
      loading: 'Loading your order...',
      downloadOA: 'Download Operating Agreement (PDF)',
      generating: 'Generating PDF...',
      orderSummary: 'Order Summary',
      tier: 'Package',
      client: 'Client',
      email: 'Email',
      llcName: 'LLC Name',
      total: 'Total Paid',
      filingSpeed: 'Filing Speed',
      nextSteps: 'Next Steps',
      step1: 'Review your Operating Agreement carefully.',
      step2: 'Sign the Operating Agreement (all members must sign).',
      step3: 'We will file your Articles of Organization with the CA Secretary of State.',
      step4: 'Apply for your Federal EIN at irs.gov after receiving your SOS confirmation.',
      step5: 'File your Statement of Information (SOI) within 90 days of formation.',
      entityVault: 'Your documents are stored securely in your Entity Vault™.',
      attorneyWarning: 'Attorney Review Recommended',
      attorneyNote: 'The following sections contain complex provisions that may benefit from attorney review:',
      softwareDisclosure: 'Software Platform Disclosure',
      disclosureText: 'This Operating Agreement was generated using Multi Servicios 360 software platform. Multi Servicios 360 is not a law firm and does not provide legal advice. Users create documents themselves using our software tools. We recommend consulting with a licensed attorney for complex business structures.',
      errorTitle: 'Something went wrong',
      errorText: 'We could not load your order. Please contact support.',
      support: 'Need help? Call 855.246.7274 or email support@multiservicios360.net',
      switchLang: 'Español'
    },
    es: {
      title: '¡Formación de LLC Completada!',
      subtitle: 'Su pago ha sido procesado exitosamente.',
      preparing: 'Preparando su Acuerdo Operativo...',
      loading: 'Cargando su orden...',
      downloadOA: 'Descargar Acuerdo Operativo (PDF)',
      generating: 'Generando PDF...',
      orderSummary: 'Resumen de Orden',
      tier: 'Paquete',
      client: 'Cliente',
      email: 'Correo',
      llcName: 'Nombre LLC',
      total: 'Total Pagado',
      filingSpeed: 'Velocidad de Registro',
      nextSteps: 'Próximos Pasos',
      step1: 'Revise su Acuerdo Operativo cuidadosamente.',
      step2: 'Firme el Acuerdo Operativo (todos los miembros deben firmar).',
      step3: 'Nosotros registraremos sus Artículos de Organización con el Secretario de Estado de CA.',
      step4: 'Solicite su EIN Federal en irs.gov después de recibir su confirmación del SOS.',
      step5: 'Presente su Declaración de Información (SOI) dentro de 90 días de la formación.',
      entityVault: 'Sus documentos están almacenados de forma segura en su Entity Vault™.',
      attorneyWarning: 'Revisión de Abogado Recomendada',
      attorneyNote: 'Las siguientes secciones contienen provisiones complejas que pueden beneficiarse de revisión legal:',
      softwareDisclosure: 'Divulgación de Plataforma de Software',
      disclosureText: 'Este Acuerdo Operativo fue generado usando la plataforma de software Multi Servicios 360. Multi Servicios 360 no es un bufete de abogados y no proporciona asesoría legal. Los usuarios crean documentos ellos mismos usando nuestras herramientas de software. Recomendamos consultar con un abogado licenciado para estructuras comerciales complejas.',
      errorTitle: 'Algo salió mal',
      errorText: 'No pudimos cargar su orden. Por favor contacte soporte.',
      support: '¿Necesita ayuda? Llame al 855.246.7274 o envíe correo a support@multiservicios360.net',
      switchLang: 'English'
    }
  };

  const tx = t[language];
  const tierLabels = {
    llc_standard: 'LLC Standard ($799)',
    llc_plus: 'LLC Plus ($1,199)',
    llc_elite: 'LLC Elite ($1,699)'
  };
  const speedLabels = {
    standard: 'Standard (5-7 days)',
    expedite_24hr: '24-Hour Expedite',
    expedite_same_day: 'Same Day'
  };

  // ============================================
  // Load matter from Supabase
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
        } else {
          setError(data.error || 'Matter not found');
        }
      } catch (err) {
        setError('Failed to load order');
      }
      setLoading(false);
    }

    loadMatter();
  }, [matterId]);

  // ============================================
  // Generate OA once matter loads
  // ============================================
  useEffect(() => {
    if (!matter || pdfGenerated.current) return;
    pdfGenerated.current = true;

    async function generateOA() {
      try {
        const res = await fetch('/api/llc/generate-oa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matterId: matter.id })
        });
        const data = await res.json();
        if (data.success) {
          setDocument(data.document);
        }
      } catch (err) {
        console.error('OA generation failed:', err);
      }
    }

    generateOA();
  }, [matter]);

  // ============================================
  // PDF Generation (jsPDF)
  // ============================================
  const handleDownloadPDF = async () => {
    if (!document) return;
    setGenerating(true);

    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
      const doc = new jsPDF({ unit: 'pt', format: 'letter' });

      const margin = 72; // 1 inch
      const pageW = 612;
      const pageH = 792;
      const contentW = pageW - margin * 2;
      let y = margin;

      const addPage = () => { doc.addPage(); y = margin; };
      const checkPage = (needed = 60) => { if (y + needed > pageH - margin) addPage(); };

      // ---- TITLE PAGE ----
      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      y = 200;
      const titleLines = doc.splitTextToSize(document.title, contentW);
      doc.text(titleLines, pageW / 2, y, { align: 'center' });
      y += titleLines.length * 22;

      doc.setFontSize(14);
      doc.setFont('times', 'normal');
      doc.text(document.subtitle, pageW / 2, y + 10, { align: 'center' });
      y += 50;

      doc.setFontSize(12);
      const effectiveDate = matter?.intake_data?.effective_date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Effective Date: ${effectiveDate}`, pageW / 2, y, { align: 'center' });

      // Software platform footer on title page
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text('Generated by Multi Servicios 360 Software Platform', pageW / 2, pageH - 40, { align: 'center' });
      doc.text('This is a software-generated document, not legal advice.', pageW / 2, pageH - 28, { align: 'center' });
      doc.setTextColor(0);

      // ---- CONTENT PAGES ----
      addPage();

      for (const section of document.sections) {
        // Article heading
        if (section.articleLabel) {
          checkPage(80);
          doc.setFont('times', 'bold');
          doc.setFontSize(13);
          doc.text(section.articleLabel, margin, y);
          y += 18;
          doc.setFontSize(12);
          doc.text(section.title.toUpperCase(), margin, y);
          y += 24;
        
        } else {
          // Schedules / Signature block
          checkPage(60);
          doc.setFont('times', 'bold');
          doc.setFontSize(13);
          doc.text(section.title.toUpperCase(), margin, y);
          y += 24;
        }

        // Attorney review flag
        if (section.attorneyReview) {
          checkPage(40);
          doc.setFillColor(255, 249, 219); // light yellow
          doc.rect(margin, y - 4, contentW, 20, 'F');
          doc.setFont('times', 'bolditalic');
          doc.setFontSize(9);
          doc.setTextColor(146, 64, 14);
          doc.text('⚠ ATTORNEY REVIEW RECOMMENDED FOR THIS SECTION', margin + 8, y + 10);
          doc.setTextColor(0);
          y += 28;
        }

        // Body text
        doc.setFont('times', 'normal');
        doc.setFontSize(11);

        const paragraphs = section.content.split('\n\n').filter(p => p.trim());
        for (const para of paragraphs) {
          const trimmed = para.trim();
          if (!trimmed) continue;

          // Check if it's a section heading (starts with number and period)
          const isSectionHead = /^\d+\.\d*\s/.test(trimmed) || /^Section\s/i.test(trimmed);
          if (isSectionHead) {
            doc.setFont('times', 'bold');
          }

          const lines = doc.splitTextToSize(trimmed, contentW);
          const blockHeight = lines.length * 14;
          checkPage(blockHeight + 10);

          doc.text(lines, margin, y);
          y += blockHeight + 8;

          if (isSectionHead) {
            doc.setFont('times', 'normal');
          }
        }

        y += 12; // extra space between articles
      }

      // ---- SOFTWARE PLATFORM DISCLOSURE (last page) ----
      addPage();
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.text('SOFTWARE PLATFORM DISCLOSURE & USER ACKNOWLEDGMENT', pageW / 2, y, { align: 'center' });
      y += 30;

      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      const disclosureText = [
        'This Operating Agreement was created by the user using the Multi Servicios 360 software platform.',
        '',
        'Multi Servicios 360 is a software technology company. It is NOT a law firm, does NOT provide legal advice, and does NOT represent any party in legal matters.',
        '',
        'The user acknowledges that:',
        '• The user created this document themselves using software tools provided by Multi Servicios 360.',
        '• No attorney-client relationship exists between the user and Multi Servicios 360.',
        '• Multi Servicios 360 did not review this document for legal accuracy or completeness.',
        '• The user is solely responsible for the contents of this document.',
        '• The user understands that this document may have significant legal consequences.',
        '• Multi Servicios 360 recommends that the user consult with a licensed California attorney before executing this document.',
        '',
        'Multi Servicios 360 Corporation',
        'Beverly Hills, California',
        'www.multiservicios360.net | 855.246.7274'
      ];

      for (const line of disclosureText) {
        if (!line) { y += 8; continue; }
        const wrapped = doc.splitTextToSize(line, contentW);
        checkPage(wrapped.length * 13 + 5);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 13 + 3;
      }

      // ---- PAGE NUMBERS ----
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 2; i <= totalPages; i++) { // skip title page
        doc.setPage(i);
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(128);
        doc.text(`Page ${i - 1} of ${totalPages - 1}`, pageW / 2, pageH - 20, { align: 'center' });
        doc.setTextColor(0);
      }

      // Save
      const companyName = (matter?.intake_data?.llc_name || 'LLC').replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`Operating_Agreement_${companyName}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('PDF generation failed. Please try again.');
    }

    setGenerating(false);
  };

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF6FF' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <p style={{ fontSize: '18px', color: '#1E3A8A' }}>{tx.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h2 style={{ fontSize: '20px', color: '#991B1B' }}>{tx.errorTitle}</h2>
          <p style={{ color: '#7F1D1D', marginTop: '8px' }}>{error}</p>
          <p style={{ color: '#6B7280', marginTop: '16px', fontSize: '14px' }}>{tx.support}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EFF6FF', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Language toggle */}
        <div style={{ textAlign: 'right', marginBottom: '16px' }}>
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            style={{ padding: '6px 16px', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
          >
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

        {/* Attorney Warning (if applicable) */}
        {document?.attorneyFlagged?.length > 0 && (
          <div style={{ backgroundColor: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#92400E', marginBottom: '8px' }}>⚠️ {tx.attorneyWarning}</h3>
            <p style={{ fontSize: '14px', color: '#78350F', marginBottom: '8px' }}>{tx.attorneyNote}</p>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {document.attorneyFlagged.map((item, i) => (
                <li key={i} style={{ fontSize: '14px', color: '#92400E', marginBottom: '4px' }}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Download Button */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px', textAlign: 'center' }}>
          {!document ? (
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              <p style={{ color: '#6B7280' }}>{tx.preparing}</p>
            </div>
          ) : (
            <button
              onClick={handleDownloadPDF}
              disabled={generating}
              style={{
                padding: '16px 32px',
                backgroundColor: generating ? '#9CA3AF' : '#1E3A8A',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: generating ? 'not-allowed' : 'pointer',
                width: '100%',
                maxWidth: '400px'
              }}
            >
              {generating ? tx.generating : tx.downloadOA}
            </button>
          )}
        </div>

        {/* Entity Vault notice */}
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ color: '#065F46', fontSize: '14px', fontWeight: '500' }}>🔒 {tx.entityVault}</p>
        </div>

        {/* Next Steps */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>{tx.nextSteps}</h2>
          <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '2' }}>
            <li style={{ fontSize: '14px', color: '#374151' }}>{tx.step1}</li>
            <li style={{ fontSize: '14px', color: '#374151' }}>{tx.step2}</li>
            <li style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>{tx.step3}</li>
            <li style={{ fontSize: '14px', color: '#374151' }}>{tx.step4}</li>
            <li style={{ fontSize: '14px', color: '#374151' }}>{tx.step5}</li>
          </ol>
        </div>

        {/* Software Disclosure */}
        <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6B7280', marginBottom: '8px' }}>{tx.softwareDisclosure}</h3>
          <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: '1.6' }}>{tx.disclosureText}</p>
        </div>

        {/* Support */}
        <div style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF', fontSize: '13px' }}>
          <p>{tx.support}</p>
          <p style={{ marginTop: '8px' }}>© {new Date().getFullYear()} Multi Servicios 360 Corporation. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
export default function LLCSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></div>}>
      <LLCSuccessContent />
    </Suspense>
  );
}