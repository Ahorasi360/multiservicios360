"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTrustPDFBlob } from './trust-pdf-generator';

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
    step1: '1. Descargue y revise su documento cuidadosamente.',
    step2: '2. IMPORTANTE: Firme el documento frente a un notario público de California.',
    step3: '3. Transfiera sus activos al fideicomiso (retitule bienes raíces, cuentas bancarias, etc.).',
    step4: '4. Guarde el documento original firmado y notarizado en un lugar seguro.',
    step5: '5. Considere consultar con un abogado para situaciones complejas.',
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
    }
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
    step1: '1. Download and review your document carefully.',
    step2: '2. IMPORTANT: Sign the document in front of a California Notary Public.',
    step3: '3. Transfer your assets to the trust (retitle real estate, bank accounts, etc.).',
    step4: '4. Store the original signed and notarized document in a safe place.',
    step5: '5. Consider consulting with an attorney for complex situations.',
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
    }
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
        
        // Generate PDF with agreement data (async - fetches and merges notary PDF)
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
          setPdfBlob(blob);
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

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    const name = (matter?.client_name || 'Trust').replace(/\s+/g, '_');
    link.download = `${name}_California_Living_Trust.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const win = window.open(url, '_blank');
    if (win) {
      win.onload = () => win.print();
    }
  };

  const handleView = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
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
          setTimeout(() => { 
            setShowEmailModal(false); 
            setEmailSent(false); 
          }, 2000);
        }
      };
      reader.readAsDataURL(pdfBlob);
    } catch (e) { 
      console.error(e); 
    } finally {
      setEmailSending(false);
    }
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

          {/* PDF Generation Status */}
          {pdfGenerating && (
            <div style={{ textAlign: 'center', padding: '20px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #E9D5FF', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }}></div>
              <p style={{ color: '#7C3AED', fontWeight: '500' }}>{t.generatingPdf}</p>
            </div>
          )}

          {/* Action Buttons */}
          {!pdfGenerating && pdfBlob && (
            <>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '25px', flexWrap: 'wrap' }}>
                <button onClick={handleDownload} style={{ 
                  padding: '16px 32px', 
                  backgroundColor: '#7C3AED', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.3)'
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
                <button onClick={handleView} style={{ 
                  padding: '12px 24px', 
                  backgroundColor: 'white', 
                  color: '#7C3AED', 
                  border: '2px solid #7C3AED', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  👁️ {t.viewBtn}
                </button>
                <button onClick={handlePrint} style={{ 
                  padding: '12px 24px', 
                  backgroundColor: 'white', 
                  color: '#7C3AED', 
                  border: '2px solid #7C3AED', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🖨️ {t.printBtn}
                </button>
                <button onClick={() => setShowEmailModal(true)} style={{ 
                  padding: '12px 24px', 
                  backgroundColor: 'white', 
                  color: '#7C3AED', 
                  border: '2px solid #7C3AED', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  ✉️ {t.emailBtn}
                </button>
              </div>
            </>
          )}

          {/* Notary Reminder */}
          <div style={{ 
            backgroundColor: '#FEF3C7', 
            border: '2px solid #F59E0B', 
            padding: '20px', 
            borderRadius: '10px', 
            marginBottom: '25px' 
          }}>
            <p style={{ color: '#92400E', fontWeight: '700', margin: 0, fontSize: '14px' }}>{t.notaryReminder}</p>
          </div>

          {/* Next Steps */}
          <div style={{ backgroundColor: '#FAF5FF', padding: '24px', borderRadius: '10px', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#7C3AED', marginBottom: '16px', margin: '0 0 16px 0' }}>{t.nextSteps}</h3>
            <div style={{ color: '#4B5563', lineHeight: '1.9', fontSize: '14px' }}>
              <p style={{ margin: '0 0 10px 0' }}>{t.step1}</p>
              <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#92400E' }}>{t.step2}</p>
              <p style={{ margin: '0 0 10px 0' }}>{t.step3}</p>
              <p style={{ margin: '0 0 10px 0' }}>{t.step4}</p>
              <p style={{ margin: 0 }}>{t.step5}</p>
            </div>
          </div>

          {/* Contact & Actions */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ fontWeight: '600', color: '#1F2937', marginBottom: '6px' }}>{t.questions}</p>
            <p style={{ color: '#6B7280', margin: 0 }}>{t.contact}</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} 
              style={{ 
                padding: '12px 20px', 
                backgroundColor: 'white', 
                color: '#6B7280', 
                border: '1px solid #D1D5DB', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {language === 'en' ? '🇲🇽 Español' : '🇺🇸 English'}
            </button>
            <a 
              href="/" 
              style={{ 
                padding: '12px 24px', 
                backgroundColor: '#F3F4F6', 
                color: '#374151', 
                borderRadius: '8px', 
                fontWeight: '600', 
                textDecoration: 'none',
                fontSize: '14px',
                display: 'inline-block'
              }}
            >
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
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '28px', 
            width: '90%', 
            maxWidth: '420px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            {emailSent ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  backgroundColor: '#D1FAE5', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 20px' 
                }}>
                  <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p style={{ color: '#059669', fontWeight: '600', fontSize: '18px', margin: 0 }}>{t.emailSuccess}</p>
              </div>
            ) : (
              <>
                <h3 style={{ margin: '0 0 24px', color: '#1F2937', fontSize: '20px' }}>{t.emailModalTitle}</h3>
                <label style={{ display: 'block', marginBottom: '10px', color: '#4B5563', fontWeight: '500' }}>{t.emailLabel}</label>
                <input 
                  type="email" 
                  value={emailTo} 
                  onChange={(e) => setEmailTo(e.target.value)} 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    border: '2px solid #E5E7EB', 
                    borderRadius: '10px', 
                    fontSize: '16px', 
                    marginBottom: '24px', 
                    boxSizing: 'border-box',
                    outline: 'none'
                  }} 
                />
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setShowEmailModal(false)} 
                    style={{ 
                      padding: '12px 24px', 
                      backgroundColor: '#F3F4F6', 
                      color: '#374151', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {t.cancelBtn}
                  </button>
                  <button 
                    onClick={handleEmailSend} 
                    disabled={emailSending} 
                    style={{ 
                      padding: '12px 28px', 
                      backgroundColor: '#7C3AED', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      opacity: emailSending ? 0.7 : 1,
                      fontWeight: '600'
                    }}
                  >
                    {emailSending ? '...' : t.sendBtn}
                  </button>
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