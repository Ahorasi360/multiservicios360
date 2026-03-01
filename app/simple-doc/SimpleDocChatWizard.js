"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SIMPLE_DOC_TYPES } from '../../lib/simple-doc-config';
import { useDraftSave } from '../../lib/useDraftSave';
import Navbar from '../components/Navbar';

const SendIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);
const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>);

// Convert config fields to chat questions
function buildQuestions(docConfig) {
  return docConfig.fields.map(field => ({
    field: field.id,
    type: field.type === 'textarea' ? 'text' : field.type === 'number' ? 'text' : field.type === 'date' ? 'text' : field.type,
    fieldType: field.type, // preserve original for validation
    required: field.required !== false,
    options: field.type === 'select' ? field.options : undefined,
    question_en: docConfig.translations.en.fields[field.id]?.label || field.id,
    question_es: docConfig.translations.es.fields[field.id]?.label || field.id,
    placeholder_en: docConfig.translations.en.fields[field.id]?.placeholder || '',
    placeholder_es: docConfig.translations.es.fields[field.id]?.placeholder || '',
    selectOptions_en: field.type === 'select' ? docConfig.translations.en.fields[field.id]?.options : undefined,
    selectOptions_es: field.type === 'select' ? docConfig.translations.es.fields[field.id]?.options : undefined,
  }));
}

const WIZARD_TRANSLATIONS = {
  en: {
    subtitle: 'Multi Servicios 360',
    greeting: "Hello! I'll help you prepare your document. Let's start with the information we need.",
    send: 'Send',
    progress: 'Progress',
    submit: 'Proceed to Payment',
    clientInfo: 'Client Information',
    clientName: 'Your Full Name',
    clientEmail: 'Your Email',
    clientPhone: 'Your Phone (optional)',
    partnerCode: 'Referral Code (optional)',
    continue: 'Continue to Questions',
    back: 'Back',
    yes: 'Yes',
    no: 'No',
    options: 'Options:',
    saved: 'Saved:',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    clickToEdit: 'Click to edit',
    pleaseAnswer: 'Please provide an answer.',
    pleaseSelect: 'Please select one of the options.',
    paying: 'Processing...',
    legalNote: 'Note: Your document will be provided in both English and Spanish.',
    yourAnswers: 'Your Answers',
    answersWillAppear: 'Your answers will appear here',
    allQuestionsAnswered: 'All questions answered! Review your answers and proceed to payment.',
    errorTryAgain: 'Error. Please try again.',
    provideNameEmail: 'Please provide your name and email',
    failedSubmit: 'Failed to submit.',
    typeAnswer: 'Type your answer...',
    orderSummary: 'Order Summary',
    platformAccess: 'Document Preparation - Platform Access',
    total: 'Total',
    price: 'Price',
    secure: '100% secure payment with Stripe',
    includes: 'Includes delivery to your secure Digital Vault',
    disclaimer: 'Multi Servicios 360 is a self-help legal document preparation platform. We are not a law firm and do not provide legal advice.',
    tierClarification: 'Clarification: This service provides software access only. Multiservicios 360 does not prepare documents for you. You create your own documents using our guided software tools.',
    paymentNote: 'Payment for platform access.',
    optional: '(Optional)',
    required: '(Required)',
    skipOptional: 'Type "skip" to skip this optional question.',
    skipped: 'Skipped',
    reviewBeforePayment: 'Please review your answers before proceeding to payment.',
    dateFormat: 'Format: MM/DD/YYYY',
    numberFormat: 'Enter a number',
  },
  es: {
    subtitle: 'Multi Servicios 360',
    greeting: '¡Hola! Le ayudaré a preparar su documento. Comencemos con la información que necesitamos.',
    send: 'Enviar',
    progress: 'Progreso',
    submit: 'Continuar al Pago',
    clientInfo: 'Información de Contacto',
    clientName: 'Nombre Completo',
    clientEmail: 'Correo Electrónico',
    clientPhone: 'Teléfono (opcional)',
    partnerCode: 'Código de Referencia (opcional)',
    continue: 'Continuar a las Preguntas',
    back: 'Regresar',
    yes: 'Sí',
    no: 'No',
    options: 'Opciones:',
    saved: 'Guardado:',
    edit: 'Editar',
    save: 'Guardar',
    cancel: 'Cancelar',
    clickToEdit: 'Clic para editar',
    pleaseAnswer: 'Por favor proporcione una respuesta.',
    pleaseSelect: 'Por favor seleccione una de las opciones.',
    paying: 'Procesando...',
    legalNote: 'Nota: Su documento será proporcionado en Inglés y Español.',
    yourAnswers: 'Sus Respuestas',
    answersWillAppear: 'Sus respuestas aparecerán aquí',
    allQuestionsAnswered: '¡Todas las preguntas contestadas! Revise sus respuestas y proceda al pago.',
    errorTryAgain: 'Error. Intente de nuevo.',
    provideNameEmail: 'Por favor proporcione su nombre y correo electrónico',
    failedSubmit: 'Error al enviar.',
    typeAnswer: 'Escriba su respuesta...',
    orderSummary: 'Resumen del Pedido',
    platformAccess: 'Preparación de Documento - Acceso a Plataforma',
    total: 'Total',
    price: 'Precio',
    secure: 'Pago 100% seguro con Stripe',
    includes: 'Incluye entrega en su Bóveda Digital segura',
    disclaimer: 'Multi Servicios 360 es una plataforma de preparación de documentos legales de autoayuda. No somos un bufete de abogados y no proporcionamos asesoría legal.',
    tierClarification: 'Aclaración: Este servicio proporciona acceso únicamente a software. Multiservicios 360 no prepara documentos por usted. Usted crea sus propios documentos usando nuestras herramientas guiadas de software.',
    paymentNote: 'Pago por acceso a la plataforma.',
    optional: '(Opcional)',
    required: '(Requerido)',
    skipOptional: 'Escriba "saltar" para omitir esta pregunta opcional.',
    skipped: 'Omitido',
    reviewBeforePayment: 'Por favor revise sus respuestas antes de proceder al pago.',
    dateFormat: 'Formato: MM/DD/AAAA',
    numberFormat: 'Ingrese un número',
  }
};

export default function SimpleDocChatWizard({ docType, initialLang = 'es' }) {
  const docConfig = SIMPLE_DOC_TYPES[docType];
  if (!docConfig) return <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>Invalid document type</div>;

  const QUESTIONS = buildQuestions(docConfig);

  const [language, setLanguage] = useState(initialLang);
  const [currentStep, setCurrentStep] = useState('client');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [intakeData, setIntakeData] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [selectedTier, setSelectedTier] = useState(null);
  const [professionalUpsell, setProfessionalUpsell] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const messagesEndRef = useRef(null);

  const isGuardianship = docType === 'guardianship_designation';
  const TIER_PRICING = {
    basic:    { amount: 12900, display: '$129', label_en: 'Basic', label_es: 'Básico' },
    standard: { amount: 19900, display: '$199', label_en: 'Standard', label_es: 'Estándar' },
    premium:  { amount: 29900, display: '$299', label_en: 'Premium', label_es: 'Premium' },
  };

  // Professional upsell — shown for estate planning and corporate docs
  const PROFESSIONAL_UPSELL_DOCS = [
    'pour_over_will', 'simple_will', 'hipaa_authorization', 'certification_of_trust',
    's_corp_formation', 'c_corp_formation', 'corporate_minutes', 'banking_resolution',
    'trust', 'poa', 'limited_poa',
  ];
  const showProfessionalUpsell = PROFESSIONAL_UPSELL_DOCS.includes(docType);
  const PROFESSIONAL_UPSELL_AMOUNT = 19900; // $199
  const professionalUpsellDisplay = '$199';

  const t = WIZARD_TRANSLATIONS[language];

  // Auto-save draft
  const { checkForDraft, markCompleted } = useDraftSave({
    email: clientEmail,
    docType,
    clientName,
    language,
    intakeData,
    currentQuestionIndex,
    messages,
    step: currentStep,
    enabled: !!clientEmail && !draftRestored,
  });
  const docTitle = language === 'es' ? docConfig.translations.es.title : docConfig.translations.en.title;
  const docSubtitle = language === 'es' ? docConfig.translations.es.subtitle : docConfig.translations.en.subtitle;
  const basePrice = isGuardianship && selectedTier ? TIER_PRICING[selectedTier].amount : docConfig.price;
  const basePriceDisplay = isGuardianship && selectedTier ? TIER_PRICING[selectedTier].display : docConfig.priceDisplay;
  const priceCents = basePrice + (professionalUpsell ? PROFESSIONAL_UPSELL_AMOUNT : 0);
  const priceDisplay = professionalUpsell
    ? `$${(priceCents / 100).toFixed(0)}`
    : basePriceDisplay;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Partner mode: pre-fill client info
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('partner_mode') === 'true') {
        const name = localStorage.getItem('portal_client_name') || '';
        const email = localStorage.getItem('portal_client_email') || '';
        const phone = localStorage.getItem('portal_client_phone') || '';
        const lang = localStorage.getItem('portal_client_language') || 'es';
        const code = localStorage.getItem('partner_code') || '';
        if (name) setClientName(name);
        if (email) setClientEmail(email);
        if (phone) setClientPhone(phone);
        if (code) setPartnerCode(code);
        if (lang) setLanguage(lang);
      }
    }
  }, []);

  useEffect(() => {
    if (currentStep === 'intake' && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t.greeting }]);
      const q = QUESTIONS[0];
      const questionText = language === 'en' ? q.question_en : q.question_es;
      const isOptional = !q.required;
      let fullQuestion = questionText + (isOptional ? ` ${t.optional}` : '');

      // Add format hints
      if (q.fieldType === 'date') fullQuestion += `\n\n${t.dateFormat}`;
      if (q.fieldType === 'number') fullQuestion += `\n\n${t.numberFormat}`;
      if (isOptional) fullQuestion += `\n${t.skipOptional}`;

      // Add select options
      if (q.type === 'select' && q.options) {
        const optLabels = language === 'en' ? q.selectOptions_en : q.selectOptions_es;
        fullQuestion += '\n\n' + t.options + '\n' + q.options.map((o, i) => `${i + 1}. ${optLabels?.[o] || o}`).join('\n');
      }

      setTimeout(() => { setMessages(prev => [...prev, { role: 'assistant', content: fullQuestion }]); }, 500);
    }
  }, [currentStep]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const currentQuestion = QUESTIONS[currentQuestionIndex];
      let parsedValue = userMessage;

      // Handle skip for optional fields
      const skipWords = ['skip', 'saltar', 'omitir', 'n/a', 'na', 'none', 'ninguno'];
      if (!currentQuestion.required && skipWords.includes(userMessage.toLowerCase())) {
        parsedValue = '';
        setMessages(prev => [...prev, { role: 'assistant', content: `${t.saved} ${t.skipped}` }]);
        advanceToNext(currentQuestionIndex, { ...intakeData });
        return;
      }

      // Validate select options
      if (currentQuestion.type === 'select') {
        const n = userMessage.toLowerCase().trim();
        const idx = parseInt(n) - 1;
        let matched = false;
        if (!isNaN(idx) && idx >= 0 && idx < currentQuestion.options.length) {
          parsedValue = currentQuestion.options[idx];
          matched = true;
        } else {
          // Try matching by option value or label
          for (const opt of currentQuestion.options) {
            const optLabels = language === 'en' ? currentQuestion.selectOptions_en : currentQuestion.selectOptions_es;
            const label = optLabels?.[opt] || opt;
            if (n === opt.toLowerCase() || n === label.toLowerCase()) {
              parsedValue = opt;
              matched = true;
              break;
            }
          }
        }
        if (!matched) {
          setMessages(prev => [...prev, { role: 'assistant', content: t.pleaseSelect }]);
          setIsLoading(false);
          return;
        }
      }

      // Validate required text
      if (currentQuestion.required && !parsedValue.trim()) {
        setMessages(prev => [...prev, { role: 'assistant', content: t.pleaseAnswer }]);
        setIsLoading(false);
        return;
      }

      const newData = { ...intakeData, [currentQuestion.field]: parsedValue };
      setIntakeData(newData);

      // Display saved value
      let displayVal = parsedValue;
      if (currentQuestion.type === 'select') {
        const optLabels = language === 'en' ? currentQuestion.selectOptions_en : currentQuestion.selectOptions_es;
        displayVal = optLabels?.[parsedValue] || parsedValue;
      }
      setMessages(prev => [...prev, { role: 'assistant', content: `${t.saved} ${displayVal}` }]);

      advanceToNext(currentQuestionIndex, newData);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: t.errorTryAgain }]);
      setIsLoading(false);
    }
  };

  const advanceToNext = (currentIdx, newData) => {
    const nextIdx = currentIdx + 1;
    setCurrentQuestionIndex(nextIdx);

    setTimeout(() => {
      if (nextIdx < QUESTIONS.length) {
        const nq = QUESTIONS[nextIdx];
        const qt = language === 'en' ? nq.question_en : nq.question_es;
        const isOptional = !nq.required;
        let fullQuestion = qt + (isOptional ? ` ${t.optional}` : '');

        if (nq.fieldType === 'date') fullQuestion += `\n\n${t.dateFormat}`;
        if (nq.fieldType === 'number') fullQuestion += `\n\n${t.numberFormat}`;
        if (isOptional) fullQuestion += `\n${t.skipOptional}`;

        if (nq.type === 'select' && nq.options) {
          const optLabels = language === 'en' ? nq.selectOptions_en : nq.selectOptions_es;
          fullQuestion += '\n\n' + t.options + '\n' + nq.options.map((o, i) => `${i + 1}. ${optLabels?.[o] || o}`).join('\n');
        }

        setMessages(prev => [...prev, { role: 'assistant', content: fullQuestion }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `✅ ${t.allQuestionsAnswered}` }]);
        setCurrentStep('payment');
      }
      setIsLoading(false);
    }, 500);
  };

  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const cancelEditing = () => { setEditingField(null); setEditValue(''); };

  const saveEdit = (field) => {
    const newData = { ...intakeData, [field]: editValue };
    setIntakeData(newData);
    setEditingField(null);
    setEditValue('');
  };

  const handleSubmit = async () => {
    if (!clientName || !clientEmail) { alert(t.provideNameEmail); return; }
    setIsLoading(true);
    try {
      // Save matter first
      const saveRes = await fetch('/api/simple-doc/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: docType,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          partner_code: partnerCode,
          form_data: intakeData,
          language,
          tier: selectedTier || undefined,
        })
      });
      const saveData = await saveRes.json();
      if (!saveData.success || !saveData.matterId) {
        alert(saveData.error || t.failedSubmit);
        setIsLoading(false);
        return;
      }

      // Create Stripe checkout
      const stripeRes = await fetch('/api/simple-doc/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matter_id: saveData.matterId,
          document_type: docType,
          client_name: clientName,
          client_email: clientEmail,
          language,
          tier: selectedTier || undefined,
        })
      });
      const stripeData = await stripeRes.json();
      if (stripeData.url) {
        await markCompleted(); // Mark draft as done before redirect
        window.location.href = stripeData.url;
      } else {
        alert(stripeData.error || t.failedSubmit);
      }
    } catch (e) {
      alert(t.failedSubmit);
    }
    setIsLoading(false);
  };

  const getLivePreview = () => {
    const entries = Object.entries(intakeData);
    if (entries.length === 0) return <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>{t.answersWillAppear}</p>;

    return (
      <div style={{ padding: '12px' }}>
        {entries.map(([key, value]) => {
          const q = QUESTIONS.find(x => x.field === key);
          if (!q) return null;
          const isEditing = editingField === key;
          const label = language === 'en' ? q.question_en : q.question_es;
          let displayVal = value;
          if (q.type === 'select') {
            const optLabels = language === 'en' ? q.selectOptions_en : q.selectOptions_es;
            displayVal = optLabels?.[value] || value;
          }
          if (!value && value !== 0) displayVal = t.skipped;

          return (
            <div key={key} style={{
              padding: '10px 12px',
              borderBottom: '1px solid #F3F4F6',
              fontSize: '13px',
              backgroundColor: isEditing ? '#EFF6FF' : 'transparent',
              borderRadius: isEditing ? '8px' : '0',
              marginBottom: isEditing ? '8px' : '0'
            }}>
              <div style={{ color: '#6B7280', marginBottom: '4px', fontSize: '12px' }}>
                {label.length > 60 ? label.substring(0, 60) + '...' : label}
              </div>

              {isEditing ? (
                <div style={{ marginTop: '8px' }}>
                  {q.type === 'select' ? (
                    <select value={editValue} onChange={(e) => setEditValue(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', marginBottom: '8px' }}>
                      {q.options?.map((opt) => {
                        const optLabels = language === 'en' ? q.selectOptions_en : q.selectOptions_es;
                        return <option key={opt} value={opt}>{optLabels?.[opt] || opt}</option>;
                      })}
                    </select>
                  ) : (
                    <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', marginBottom: '8px' }} />
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => saveEdit(key)}
                      style={{ padding: '6px 12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                      {t.save}
                    </button>
                    <button onClick={cancelEditing}
                      style={{ padding: '6px 12px', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                      {t.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                <div onClick={() => startEditing(key, value)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '4px 0' }}
                  title={t.clickToEdit}>
                  <span style={{ fontWeight: '600', color: '#1F2937' }}>
                    {String(displayVal).length > 35 ? String(displayVal).substring(0, 35) + '...' : displayVal}
                  </span>
                  <span style={{ fontSize: '11px', color: '#9CA3AF', padding: '2px 6px', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>
                    {t.edit}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const st = {
    container: { minHeight: '100vh', backgroundColor: '#F0F9FF', padding: '24px' },
    inner: { maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    logo: { display: 'flex', alignItems: 'center', gap: '12px' },
    logoIcon: { width: '48px', height: '48px', backgroundColor: '#2563EB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#1F2937' },
    subtitle: { fontSize: '14px', color: '#6B7280' },
    langToggle: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', cursor: 'pointer' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    input: { width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', outline: 'none' },
    btnPrimary: { width: '100%', padding: '14px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
    btnGreen: { backgroundColor: '#059669', color: 'white' },
    btnDisabled: { backgroundColor: '#9CA3AF', cursor: 'not-allowed' },
    chatContainer: { height: '55vh', minHeight: '260px', overflowY: 'auto', marginBottom: '16px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' },
    msgUser: { backgroundColor: '#2563EB', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', maxWidth: '80%', marginLeft: 'auto', marginBottom: '12px' },
    msgAssistant: { backgroundColor: 'white', color: '#1F2937', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', maxWidth: '80%', marginBottom: '12px', border: '1px solid #E5E7EB', whiteSpace: 'pre-wrap' },
    badge: { backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
    progressBar: { height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' },
    progressFill: { height: '100%', backgroundColor: '#2563EB', borderRadius: '4px', transition: 'width 0.3s ease' },
  };

  const answeredCount = Object.keys(intakeData).filter(k => intakeData[k] !== '').length;
  const totalRequired = QUESTIONS.filter(q => q.required).length;
  const progress = QUESTIONS.length > 0 ? Math.round((answeredCount / QUESTIONS.length) * 100) : 0;

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Navbar lang={language} currentPath={typeof window !== 'undefined' ? window.location.pathname : ''} />
    <div style={st.container}>
      <div style={st.inner}>
        {/* Header - matches POA exactly */}
        <div style={st.header}>
          <div style={st.logo}>
            <div style={st.logoIcon}>MS</div>
            <div>
              <div style={st.title}>{docTitle}</div>
              <div style={st.subtitle}>{docSubtitle} — {t.subtitle}</div>
            </div>
          </div>
          <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} style={st.langToggle}>
            <GlobeIcon />
            <span style={{ fontWeight: '600' }}>{language === 'en' ? 'Español' : 'English'}</span>
          </button>
        </div>

        {/* Step 0: Tier Selection — Guardianship only */}
        {isGuardianship && !selectedTier && currentStep === 'client' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E3A8A', marginBottom: '8px' }}>
                {language === 'es' ? 'Elija Su Nivel de Protección' : 'Choose Your Protection Level'}
              </h2>
              <p style={{ color: '#6B7280', fontSize: '15px' }}>
                {language === 'es'
                  ? 'Cada nivel incluye un documento legalmente válido en California. Los niveles superiores añaden cláusulas adicionales y documentos complementarios.'
                  : 'Every level includes a legally valid California document. Higher levels add additional clauses and supplementary documents.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
              {/* BASIC */}
              <div onClick={() => setSelectedTier('basic')} style={{ cursor: 'pointer', border: '2px solid #E2E8F0', borderRadius: '16px', padding: '28px 20px', textAlign: 'center', backgroundColor: 'white', transition: 'all 0.2s', position: 'relative' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  {language === 'es' ? 'Básico' : 'Basic'}
                </div>
                <div style={{ fontSize: '40px', fontWeight: '800', color: '#1E3A8A', marginBottom: '4px' }}>$129</div>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>
                  {language === 'es' ? 'Protección esencial' : 'Essential protection'}
                </div>
                <ul style={{ textAlign: 'left', fontSize: '13px', color: '#475569', lineHeight: '2.2', paddingLeft: '16px', margin: '0 0 20px 0' }}>
                  <li>{language === 'es' ? 'Nominación de guardián principal' : 'Primary guardian nomination'}</li>
                  <li>{language === 'es' ? '1 guardián sucesor' : '1 successor guardian'}</li>
                  <li>{language === 'es' ? 'Activación por fallecimiento' : 'Death activation clause'}</li>
                  <li>{language === 'es' ? 'Custodia física y residencia' : 'Physical custody & residence'}</li>
                  <li>{language === 'es' ? 'Bloque de testigos' : 'Witness block'}</li>
                  <li>{language === 'es' ? 'PDF bilingüe (EN/ES)' : 'Bilingual PDF (EN/ES)'}</li>
                </ul>
                <div style={{ padding: '12px', backgroundColor: '#F0F9FF', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#1E40AF' }}>
                  {language === 'es' ? 'Seleccionar →' : 'Select →'}
                </div>
              </div>

              {/* STANDARD — MOST POPULAR */}
              <div onClick={() => setSelectedTier('standard')} style={{ cursor: 'pointer', border: '3px solid #2563EB', borderRadius: '16px', padding: '28px 20px', textAlign: 'center', backgroundColor: 'white', transition: 'all 0.2s', position: 'relative', boxShadow: '0 8px 25px rgba(37,99,235,0.15)', transform: 'scale(1.03)' }}>
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2563EB', color: 'white', padding: '4px 20px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {language === 'es' ? '⭐ Más Popular' : '⭐ Most Popular'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  {language === 'es' ? 'Estándar' : 'Standard'}
                </div>
                <div style={{ fontSize: '40px', fontWeight: '800', color: '#2563EB', marginBottom: '4px' }}>$199</div>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>
                  {language === 'es' ? 'Protección completa' : 'Complete protection'}
                </div>
                <ul style={{ textAlign: 'left', fontSize: '13px', color: '#475569', lineHeight: '2.2', paddingLeft: '16px', margin: '0 0 20px 0' }}>
                  <li><strong>{language === 'es' ? 'Todo del Básico, más:' : 'Everything in Basic, plus:'}</strong></li>
                  <li>{language === 'es' ? 'Activación por incapacidad médica' : 'Medical incapacity activation'}</li>
                  <li>{language === 'es' ? 'Activación por detención migratoria' : 'Immigration detention activation'}</li>
                  <li>{language === 'es' ? 'Custodia temporal de emergencia' : 'Temporary emergency custody'}</li>
                  <li style={{ color: '#2563EB', fontWeight: '600' }}>{language === 'es' ? '🏥 Autorización médica + HIPAA' : '🏥 Medical authority + HIPAA'}</li>
                  <li style={{ color: '#2563EB', fontWeight: '600' }}>{language === 'es' ? '🎓 Autorización educativa + FERPA' : '🎓 Educational authority + FERPA'}</li>
                  <li>{language === 'es' ? '✈️ Autoridad de viaje nacional/internacional' : '✈️ Domestic/international travel authority'}</li>
                  <li>{language === 'es' ? '💰 Autoridad financiera y beneficios' : '💰 Financial & benefits authority'}</li>
                  <li>{language === 'es' ? '📋 Reconocimiento notarial (§1189)' : '📋 Notary acknowledgment (§1189)'}</li>
                </ul>
                <div style={{ padding: '12px', backgroundColor: '#2563EB', borderRadius: '8px', fontSize: '14px', fontWeight: '700', color: 'white' }}>
                  {language === 'es' ? 'Seleccionar →' : 'Select →'}
                </div>
              </div>

              {/* PREMIUM */}
              <div onClick={() => setSelectedTier('premium')} style={{ cursor: 'pointer', border: '2px solid #F59E0B', borderRadius: '16px', padding: '28px 20px', textAlign: 'center', backgroundColor: '#FFFBEB', transition: 'all 0.2s', position: 'relative' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#B45309', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  {language === 'es' ? 'Premium' : 'Premium'}
                </div>
                <div style={{ fontSize: '40px', fontWeight: '800', color: '#B45309', marginBottom: '4px' }}>$299</div>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>
                  {language === 'es' ? 'Paquete completo con anexos' : 'Complete package with attachments'}
                </div>
                <ul style={{ textAlign: 'left', fontSize: '13px', color: '#475569', lineHeight: '2.2', paddingLeft: '16px', margin: '0 0 20px 0' }}>
                  <li><strong>{language === 'es' ? 'Todo del Estándar, más:' : 'Everything in Standard, plus:'}</strong></li>
                  <li>{language === 'es' ? '2º guardián sucesor' : '2nd successor guardian'}</li>
                  <li style={{ color: '#B45309', fontWeight: '600' }}>{language === 'es' ? '📄 Declaración jurada de custodia temporal' : '📄 Temporary custody affidavit'}</li>
                  <li style={{ color: '#B45309', fontWeight: '600' }}>{language === 'es' ? '🏫 Formulario de autorización escolar' : '🏫 School authorization form'}</li>
                  <li style={{ color: '#B45309', fontWeight: '600' }}>{language === 'es' ? '🏥 Formulario de autorización médica' : '🏥 Medical authorization form'}</li>
                  <li style={{ color: '#B45309', fontWeight: '600' }}>{language === 'es' ? '🚨 Declaración de cuidador de emergencia' : '🚨 Emergency caregiver declaration'}</li>
                  <li>{language === 'es' ? '12–15 páginas profesionales' : '12–15 professional pages'}</li>
                </ul>
                <div style={{ padding: '12px', backgroundColor: '#F59E0B', borderRadius: '8px', fontSize: '14px', fontWeight: '700', color: 'white' }}>
                  {language === 'es' ? 'Seleccionar →' : 'Select →'}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center', marginTop: '20px', lineHeight: '1.5' }}>
              {language === 'es'
                ? 'Todos los niveles cumplen con el Código de Sucesiones de California §§1500–1502. Multi Servicios 360 es una plataforma de autoayuda. No proporcionamos asesoría legal.'
                : 'All levels comply with California Probate Code §§1500–1502. Multi Servicios 360 is a self-help platform. We do not provide legal advice.'}
            </p>
          </div>
        )}

        {/* Step 1: Client Info - matches POA */}
        {currentStep === 'client' && (!isGuardianship || selectedTier) && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={st.card}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>{t.clientInfo}</h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>{t.clientName} *</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} style={st.input} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>{t.clientEmail} *</label>
                <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={st.input} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>{t.clientPhone}</label>
                <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} style={st.input} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>{t.partnerCode}</label>
                <input type="text" value={partnerCode} onChange={e => setPartnerCode(e.target.value)} style={st.input} placeholder="MS360-XXXX" />
              </div>

              {/* Price display */}
              <div style={{ background: '#F0F9FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>{t.price}</div>
                {isGuardianship && selectedTier && (
                  <div style={{ display: 'inline-block', backgroundColor: selectedTier === 'premium' ? '#FEF3C7' : selectedTier === 'standard' ? '#DBEAFE' : '#F1F5F9', color: selectedTier === 'premium' ? '#B45309' : selectedTier === 'standard' ? '#1E40AF' : '#475569', padding: '3px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {TIER_PRICING[selectedTier][language === 'es' ? 'label_es' : 'label_en']}
                  </div>
                )}
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#2563EB' }}>{priceDisplay}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>🔒 {t.secure}</div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>📦 {t.includes}</div>
                {isGuardianship && selectedTier && (
                  <button onClick={() => setSelectedTier(null)} style={{ marginTop: '8px', fontSize: '12px', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    {language === 'es' ? '← Cambiar nivel' : '← Change tier'}
                  </button>
                )}
              </div>

              <button onClick={async () => {
                if (!clientName || !clientEmail) { alert(t.provideNameEmail); return; }
                // Check for existing draft
                const draft = await checkForDraft(clientEmail);
                if (draft && Object.keys(draft.intake_data || {}).length > 0) {
                  const lang = draft.language || 'es';
                  const msg = lang === 'en'
                    ? `We found a saved draft from ${new Date(draft.updated_at).toLocaleDateString('en-US')}. Do you want to continue where you left off?`
                    : `Encontramos un borrador guardado del ${new Date(draft.updated_at).toLocaleDateString('es-US')}. ¿Deseas continuar donde lo dejaste?`;
                  if (window.confirm(msg)) {
                    setIntakeData(draft.intake_data || {});
                    setCurrentQuestionIndex(draft.current_question_index || 0);
                    if (draft.messages?.length > 0) setMessages(draft.messages);
                    setDraftRestored(true);
                  }
                }
                setCurrentStep('intake');
              }}
                style={{ ...st.btnPrimary, ...st.btnGreen }}>
                {t.continue}
              </button>

              <p style={{ fontSize: '11px', color: '#6B7280', textAlign: 'center', marginTop: '12px', lineHeight: '1.4' }}>
                {t.disclaimer}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Chat Q&A - matches POA layout */}
        {currentStep === 'intake' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '12px' : '24px' }}>
            {/* Left: Chat */}
            <div style={st.card}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{t.progress}</span>
                  <span style={st.badge}>{progress}%</span>
                </div>
                <div style={st.progressBar}>
                  <div style={{ ...st.progressFill, width: `${progress}%` }}></div>
                </div>
              </div>

              <div style={st.chatContainer}>
                {messages.map((msg, i) => (
                  <div key={i} style={msg.role === 'user' ? st.msgUser : st.msgAssistant}>{msg.content}</div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder={t.typeAnswer}
                  style={{ ...st.input, flex: 1 }}
                  disabled={isLoading || currentStep === 'payment'}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  style={{ padding: '12px 20px', backgroundColor: isLoading || !input.trim() ? '#9CA3AF' : '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer' }}>
                  <SendIcon />
                </button>
              </div>

              {language === 'es' && <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '12px', textAlign: 'center' }}>{t.legalNote}</p>}
            </div>

            {/* Right: Answers sidebar */}
            <div style={st.card}>
              <div style={{ padding: '12px 20px', borderBottom: '2px solid #E5E7EB', marginBottom: '16px' }}>
                <span style={{ fontWeight: '600', color: '#2563EB', fontSize: '16px' }}>
                  {t.yourAnswers}
                </span>
                <span style={{ ...st.badge, marginLeft: '8px' }}>{answeredCount}/{QUESTIONS.length}</span>
              </div>

              <div style={{ maxHeight: '440px', overflowY: 'auto' }}>
                {getLivePreview()}
              </div>

              {answeredCount >= totalRequired && Object.keys(intakeData).length === QUESTIONS.length && (
                <div style={{ marginTop: '16px' }}>
                  <button onClick={() => setCurrentStep('payment')}
                    style={{ ...st.btnPrimary, ...st.btnGreen }}>
                    {t.continue}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Payment - matches POA tier selection layout */}
        {currentStep === 'payment' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '12px' : '24px' }}>
            {/* Left: Review */}
            <div style={st.card}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>{t.reviewBeforePayment}</h2>

              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {getLivePreview()}
              </div>

              <button onClick={() => setCurrentStep('intake')}
                style={{ marginTop: '16px', padding: '10px 20px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%' }}>
                ← {t.back}
              </button>
            </div>

            {/* Right: Order Summary + Pay */}
            <div>
              <div style={{ ...st.card, marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>{t.orderSummary}</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>{t.platformAccess}{isGuardianship && selectedTier ? ` — ${TIER_PRICING[selectedTier][language === 'es' ? 'label_es' : 'label_en']}` : ''}</span>
                  <span>{basePriceDisplay}</span>
                </div>

                {professionalUpsell && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#2563EB' }}>
                    <span>{language === 'es' ? '⚖️ Conexión con Profesional' : '⚖️ Professional Review'}</span>
                    <span>{professionalUpsellDisplay}</span>
                  </div>
                )}

                <div style={{ borderTop: '2px solid #1F2937', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px' }}>
                  <span>{t.total}</span>
                  <span style={{ color: '#2563EB' }}>{priceDisplay}</span>
                </div>

                {/* Professional Attorney Upsell */}
                {showProfessionalUpsell && (
                  <div
                    onClick={() => setProfessionalUpsell(!professionalUpsell)}
                    style={{ marginTop: '16px', padding: '14px 16px', backgroundColor: professionalUpsell ? '#EFF6FF' : '#F8FAFC', borderRadius: '8px', border: `2px solid ${professionalUpsell ? '#2563EB' : '#E2E8F0'}`, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${professionalUpsell ? '#2563EB' : '#9CA3AF'}`, backgroundColor: professionalUpsell ? '#2563EB' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        {professionalUpsell && <span style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#1F2937' }}>
                          {language === 'es'
                            ? (['s_corp_formation', 'c_corp_formation', 'corporate_minutes', 'banking_resolution'].includes(docType)
                                ? '⚖️ Revisión por Abogado Corporativo — '
                                : '⚖️ Revisión por Abogado — ')
                            : (['s_corp_formation', 'c_corp_formation', 'corporate_minutes', 'banking_resolution'].includes(docType)
                                ? '⚖️ Corporate Attorney Review — '
                                : '⚖️ Attorney Review — ')}
                          <span style={{ color: '#059669' }}>{professionalUpsellDisplay}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', lineHeight: '1.5' }}>
                          {language === 'es'
                            ? (['s_corp_formation', 'c_corp_formation', 'corporate_minutes', 'banking_resolution'].includes(docType)
                                ? 'Un abogado corporativo de nuestra red revisará su documento y le contactará dentro de 48 horas con sus recomendaciones.'
                                : 'Un abogado de nuestra red revisará su documento y le contactará dentro de 48 horas. Incluye recomendaciones de notarización si aplica.')
                            : (['s_corp_formation', 'c_corp_formation', 'corporate_minutes', 'banking_resolution'].includes(docType)
                                ? 'A corporate attorney from our network will review your document and contact you within 48 hours with recommendations.'
                                : 'An attorney from our network will review your document and contact you within 48 hours. Includes notarization guidance if applicable.')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compliance clarification */}
                <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#FEF3C7', borderRadius: '8px', border: '1px solid #F59E0B' }}>
                  <p style={{ fontSize: '12px', color: '#92400E', margin: 0, lineHeight: '1.5' }}>
                    {t.tierClarification}
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  style={{ ...st.btnPrimary, marginTop: '16px', ...(isLoading ? st.btnDisabled : st.btnGreen) }}>
                  {isLoading ? t.paying : `${t.submit} — ${priceDisplay}`}
                </button>

                <p style={{ fontSize: '11px', color: '#6B7280', textAlign: 'center', marginTop: '8px' }}>
                  {t.paymentNote}
                </p>
              </div>

              {/* Doc info card */}
              <div style={st.card}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  {language === 'en' ? 'What You Get' : '¿Qué Incluye?'}
                </h3>
                {isGuardianship && selectedTier ? (
                  <ul style={{ fontSize: '14px', color: '#374151', lineHeight: '2', paddingLeft: '20px', margin: 0 }}>
                    <li>{language === 'en' ? 'Guardian Nomination (PDF, EN/ES)' : 'Nominación de Guardián (PDF, EN/ES)'}</li>
                    <li>{language === 'en' ? 'Primary guardian + 1 successor' : 'Guardián principal + 1 sucesor'}</li>
                    {(selectedTier === 'standard' || selectedTier === 'premium') && <>
                      <li style={{ color: '#2563EB', fontWeight: '500' }}>{language === 'en' ? 'HIPAA medical authorization' : 'Autorización médica HIPAA'}</li>
                      <li style={{ color: '#2563EB', fontWeight: '500' }}>{language === 'en' ? 'FERPA educational authorization' : 'Autorización educativa FERPA'}</li>
                      <li>{language === 'en' ? 'Travel + financial + benefits authority' : 'Autoridad de viaje + financiera + beneficios'}</li>
                      <li>{language === 'en' ? 'Notary acknowledgment (CA §1189)' : 'Reconocimiento notarial (CA §1189)'}</li>
                    </>}
                    {selectedTier === 'premium' && <>
                      <li style={{ color: '#B45309', fontWeight: '500' }}>{language === 'en' ? '2nd successor guardian' : '2° guardián sucesor'}</li>
                      <li style={{ color: '#B45309', fontWeight: '500' }}>{language === 'en' ? 'Temporary Custody Affidavit' : 'Declaración Jurada de Custodia'}</li>
                      <li style={{ color: '#B45309', fontWeight: '500' }}>{language === 'en' ? 'School Authorization Form' : 'Formulario de Autorización Escolar'}</li>
                      <li style={{ color: '#B45309', fontWeight: '500' }}>{language === 'en' ? 'Medical Authorization Form' : 'Formulario de Autorización Médica'}</li>
                      <li style={{ color: '#B45309', fontWeight: '500' }}>{language === 'en' ? 'Emergency Caregiver Declaration' : 'Declaración de Cuidador de Emergencia'}</li>
                    </>}
                    <li>{language === 'en' ? 'Secure Digital Vault access (90 days)' : 'Acceso a Bóveda Digital segura (90 días)'}</li>
                  </ul>
                ) : (
                  <ul style={{ fontSize: '14px', color: '#374151', lineHeight: '2', paddingLeft: '20px', margin: 0 }}>
                    <li>{language === 'en' ? 'Self-prepared document in PDF format' : 'Documento autopreparado en formato PDF'}</li>
                    <li>{language === 'en' ? 'Both English and Spanish versions' : 'Versiones en Inglés y Español'}</li>
                    <li>{language === 'en' ? 'Electronic signature page' : 'Página de firma electrónica'}</li>
                    <li>{language === 'en' ? 'Secure Digital Vault access (90 days)' : 'Acceso a Bóveda Digital segura (90 días)'}</li>
                    <li>{language === 'en' ? 'Software Platform Disclosure included' : 'Divulgación de Plataforma de Software incluida'}</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer - matches POA */}
        <div style={{ textAlign: 'center', padding: '16px', color: '#6B7280', fontSize: '12px' }}>
          <p style={{ margin: 0 }}>Multi Servicios 360 | www.multiservicios360.net | 855.246.7274</p>
        </div>
      </div>
    </div>
    </div>
  );
}
