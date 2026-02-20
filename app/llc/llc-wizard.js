"use client";
import React, { useState, useEffect, useRef } from 'react';
import { QUESTIONS, checkTierTrigger } from './llc-questions';
import { TRANSLATIONS } from './llc-translations';
import {
  TIERS, ENTITY_VAULT, UPSELLS, STATE_FEES,
  calculateTotal, getStateFee, detectRequiredTier,
  getUpsellLabel, getUpsellDesc, getUpsellPrice, getUpsellBadge,
  STYLES as st, SendIcon, GlobeIcon
} from './llc-config';

// ============================================
// Document Preview Component
// ============================================
function DocumentPreview({ intakeData, language, isPaid }) {
  const t = TRANSLATIONS[language];
  const fullLLCName = intakeData.llc_name
    ? `${intakeData.llc_name} ${intakeData.llc_suffix || 'LLC'}`
    : '[LLC Name]';
  const fullAddress = intakeData.principal_street
    ? `${intakeData.principal_street}, ${intakeData.principal_city || ''}, CA ${intakeData.principal_zip || ''}`
    : '[Address]';
  const purposes = {
    general: 'Any lawful business purpose',
    professional: 'Professional services',
    real_estate: 'Real estate investment and management',
    consulting: 'Consulting services',
    ecommerce: 'E-commerce and online business',
    other: intakeData.business_purpose_other || 'Other lawful purpose'
  };
  const hide = (c, n = 0) => isPaid ? c : (!c ? '[PROTECTED]' : (n > 0 && c.length > n ? c.substring(0, n) + '···' : '[PROTECTED]'));

  return (
    <div style={{ position: 'relative', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '24px', fontFamily: 'Times New Roman, serif', fontSize: '12px', lineHeight: '1.4', maxHeight: '500px', overflowY: 'auto' }}>
      {!isPaid && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', fontSize: '32px', fontWeight: 'bold', color: 'rgba(30,58,138,0.1)', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10 }}>{t.previewWatermark}</div>}
      <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #1F2937', paddingBottom: '12px' }}>
        <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '4px' }}>{t.previewState}</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{t.previewTitle}</div>
        <div style={{ fontSize: '12px', color: '#6B7280' }}>{t.previewSubtitle}</div>
      </div>
      {[ 
        ['1', t.previewLLCName, <span style={{ fontSize: '14px', fontWeight: '600' }}>{hide(fullLLCName, 10)}</span>],
        ['2', t.previewPurpose, <span>{purposes[intakeData.business_purpose] || '[Purpose]'}</span>],
        ['3', t.previewAddress, <span style={{ filter: isPaid ? 'none' : 'blur(3px)' }}>{hide(fullAddress)}</span>],
        ['4', t.previewAgent, <>
          <div>{intakeData.agent_type === 'platform' ? 'Multi Servicios 360' : intakeData.agent_type === 'self' ? hide(intakeData.member_1_name || '[Your Name]', 5) : hide(intakeData.agent_name || '[Agent Name]', 5)}</div>
          <div style={{ fontSize: '10px', color: '#6B7280' }}>{intakeData.agent_type === 'platform' ? 'Beverly Hills, CA' : hide(intakeData.agent_address || '[Agent Address]')}</div>
        </>],
        ['5', t.previewManagement, <span>{intakeData.management_type === 'manager' ? t.previewManagerManaged : t.previewMemberManaged}</span>],
      ].map(([num, label, content]) => (
        <div key={num} style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '8px', color: '#1E3A8A' }}>{num}. {label}</div>
          {content}
        </div>
      ))}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '8px', color: '#1E3A8A' }}>6. {t.previewMembers}</div>
        {intakeData.member_1_name && <div>• {hide(intakeData.member_1_name, 5)}</div>}
        {intakeData.member_2_name && <div>• {hide(intakeData.member_2_name, 5)}</div>}
        {intakeData.member_3_name && <div>• {hide(intakeData.member_3_name, 5)}</div>}
        {!intakeData.member_1_name && <div style={{ color: '#9CA3AF' }}>[Members will be listed here]</div>}
      </div>
      {!isPaid && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, white)', padding: '30px 16px 16px', textAlign: 'center' }}><p style={{ color: '#6B7280', fontSize: '12px' }}>{language === 'es' ? 'Complete el pago para ver completo' : 'Complete payment to view full document'}</p></div>}
    </div>
  );
}

// ============================================
// Main Component
// ============================================
export default function LLCIntakeWizard({ initialLang = 'es' }) {
  const [language, setLanguage] = useState(initialLang);
  const [currentStep, setCurrentStep] = useState('client');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [intakeData, setIntakeData] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid] = useState(true);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [reviewTier, setReviewTier] = useState('llc_standard');
  const [selectedUpsells, setSelectedUpsells] = useState([]);
  const [filingSpeed, setFilingSpeed] = useState('standard');
  const [previewTab, setPreviewTab] = useState('answers');
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [attorneyFlags, setAttorneyFlags] = useState([]);
  const messagesEndRef = useRef(null);
  const t = TRANSLATIONS[language];

  // ============================================
  // Question logic
  // ============================================
  const shouldShowQuestion = (q, data) => {
    if (!q.showIf) return true;
    const { field, value, values } = q.showIf;
    return values ? values.includes(data[field]) : data[field] === value;
  };

  const getVisibleQuestions = () => QUESTIONS.filter(q => shouldShowQuestion(q, intakeData));
  const visibleQuestions = getVisibleQuestions();
  const progress = visibleQuestions.length > 0 ? Math.round((Object.keys(intakeData).length / visibleQuestions.length) * 100) : 0;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Start chat when entering intake
  useEffect(() => {
    if (currentStep === 'intake' && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t.greeting }]);
      const vq = getVisibleQuestions();
      const q = vq[0];
      if (q) {
        const txt = language === 'en' ? q.question_en : q.question_es;
        setTimeout(() => setMessages(prev => [...prev, { role: 'assistant', content: `📋 ${t.sections[q.section]}\n\n${txt}` }]), 500);
      }
    }
  }, [currentStep]);

  // Auto-detect required tier when data changes
  useEffect(() => {
    const required = detectRequiredTier(intakeData);
    const requiredTier = TIERS.find(x => x.value === required);
    const currentTier = TIERS.find(x => x.value === reviewTier);
    if (requiredTier && currentTier && requiredTier.price > currentTier.price) {
      setReviewTier(required);
    }
  }, [intakeData]);

  // Auto-add registered agent upsell
  useEffect(() => {
    if (intakeData.agent_type === 'platform' && !selectedUpsells.includes('registered_agent')) {
      setSelectedUpsells(prev => [...prev, 'registered_agent']);
    } else if (intakeData.agent_type !== 'platform' && selectedUpsells.includes('registered_agent')) {
      setSelectedUpsells(prev => prev.filter(u => u !== 'registered_agent'));
    }
  }, [intakeData.agent_type]);

    // ============================================
  // Partner mode: pre-fill client info
  // ============================================
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('partner_mode') === 'true') {
        const name = localStorage.getItem('portal_client_name') || '';
        const email = localStorage.getItem('portal_client_email') || '';
        const phone = localStorage.getItem('portal_client_phone') || '';
        const lang = localStorage.getItem('portal_client_language') || 'es';
        if (name) setClientName(name);
        if (email) setClientEmail(email);
        if (phone) setClientPhone(phone);
        if (lang) setLanguage(lang);
      }
    }
  }, []);
  // ============================================
  // Upsell toggle
  // ============================================
  const toggleUpsell = (id) => {
    if (id === 'registered_agent' && intakeData.agent_type === 'platform') return;
    setSelectedUpsells(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  // ============================================
  // Chat send handler
  // ============================================
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setMessages(p => [...p, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const vq = getVisibleQuestions();
      const cq = vq[currentQuestionIndex];
      let val = userMsg;

      // Parse boolean
      if (cq.type === 'boolean') {
        const n = userMsg.toLowerCase();
        if (n.includes('yes') || n.includes('si') || n.includes('sí') || n === 'y' || n === 's') val = true;
        else if (n.includes('no') || n === 'n') val = false;
        else { setMessages(p => [...p, { role: 'assistant', content: t.pleaseAnswer }]); setIsLoading(false); return; }
      }
      // Parse select
      else if (cq.type === 'select') {
        const n = userMsg.toLowerCase().trim();
        let opt = null;
        const idx = parseInt(n) - 1;
        if (!isNaN(idx) && idx >= 0 && idx < cq.options.length) opt = cq.options[idx];
        if (!opt) opt = cq.options.find(o =>
          o.value.toString().toLowerCase() === n ||
          o.label_en.toLowerCase().includes(n) ||
          o.label_es.toLowerCase().includes(n)
        );
        if (opt) val = opt.value;
        else { setMessages(p => [...p, { role: 'assistant', content: t.pleaseSelect }]); setIsLoading(false); return; }
      }

      const newData = { ...intakeData, [cq.field]: val };
      setIntakeData(newData);

      // Name match check — client name must match at least one member
      if (cq.field === 'member_1_name' || cq.field === 'member_2_name' || cq.field === 'member_3_name') {
        const clientNorm = clientName.trim().toLowerCase().replace(/\s+/g, ' ');
        const allMembers = [
          (newData.member_1_name || '').trim().toLowerCase().replace(/\s+/g, ' '),
          (newData.member_2_name || '').trim().toLowerCase().replace(/\s+/g, ' '),
          (newData.member_3_name || '').trim().toLowerCase().replace(/\s+/g, ' '),
        ].filter(Boolean);
        const match = allMembers.some(m => m === clientNorm || m.includes(clientNorm) || clientNorm.includes(m));
        if (!match && cq.field === 'member_1_name') {
          setMessages(p => [...p, { role: 'assistant', content: language === 'es'
            ? `⚠️ AVISO: El nombre que ingresó ("${val}") no coincide con el nombre del cliente ("${clientName}"). La persona que paga debe ser un miembro de la LLC. Si su nombre legal es diferente, por favor regrese y corrija el nombre del cliente.\n\n¿Desea continuar de todos modos? (Sí/No)`
            : `⚠️ WARNING: The name you entered ("${val}") does not match the client name ("${clientName}"). The person paying must be a member of the LLC. If your legal name is different, please go back and correct the client name.\n\nDo you wish to continue anyway? (Yes/No)`
          }]);
        }
      }

      // Check tier trigger
      const tierTrigger = checkTierTrigger(cq, val);
      if (tierTrigger) {
        // Flag for attorney review if elite
        if (tierTrigger.upgradeTo === 'llc_elite') setAttorneyFlags(p => [...new Set([...p, cq.field])]);
      }

      // Build saved message
      const dv = val === true ? t.yes : val === false ? t.no : val;
      let savedMsg = `${t.saved} ${dv}`;
      if (tierTrigger) savedMsg += `\n\n⚡ ${tierTrigger.reason}`;
      if (cq.note?.includes('attorney') && val === true) savedMsg += `\n\n${t.attorneyFlag}`;
      setMessages(p => [...p, { role: 'assistant', content: savedMsg }]);

      // Next question
      const newVQ = QUESTIONS.filter(q => shouldShowQuestion(q, newData));
      const cfi = newVQ.findIndex(q => q.field === cq.field);
      const nextIdx = cfi + 1;
      setCurrentQuestionIndex(nextIdx);

      setTimeout(() => {
        if (nextIdx < newVQ.length) {
          const nq = newVQ[nextIdx];
          const qt = language === 'en' ? nq.question_en : nq.question_es;
          let fq = cq.section !== nq.section && t.sections[nq.section]
            ? `📋 ${t.sections[nq.section]}\n\n${qt}`
            : qt;
          if (nq.type === 'select' && nq.options) {
            fq += '\n\n' + t.options + '\n' + nq.options.map((o, i) =>
              `${i + 1}. ${language === 'en' ? o.label_en : o.label_es}`
            ).join('\n');
          } else if (nq.type === 'boolean') {
            fq += `\n\n${t.options}\n• ${t.yes}\n• ${t.no}`;
          }
          setMessages(p => [...p, { role: 'assistant', content: fq }]);
        } else {
          // All done
          let msg = `✅ ${t.allQuestionsAnswered}`;
          const required = detectRequiredTier(newData);
          if (required !== 'llc_standard') msg += `\n\n${t.tierUpgradeNotice}`;
          setMessages(p => [...p, { role: 'assistant', content: msg }]);
          setCurrentStep('tier');
        }
        setIsLoading(false);
      }, 500);
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: t.errorTryAgain }]);
      setIsLoading(false);
    }
  };

  // ============================================
  // Edit handlers (Answers panel)
  // ============================================
  const startEditing = (f, v) => { setEditingField(f); setEditValue(v === true ? 'true' : v === false ? 'false' : String(v)); };
  const cancelEditing = () => { setEditingField(null); setEditValue(''); };
  const saveEdit = (f) => {
    const q = QUESTIONS.find(x => x.field === f);
    if (!q) return;
    let nv = editValue;
    if (q.type === 'boolean') nv = editValue === 'true';
    else if (q.type === 'select') {
      const opt = q.options?.find(o => o.value.toString() === editValue);
      if (opt) nv = opt.value;
    }
    const nd = { ...intakeData, [f]: nv };
    // Remove dependent answers if boolean turned false
    if (q.type === 'boolean' && nv === false) {
      QUESTIONS.forEach(x => { if (x.showIf?.field === f) delete nd[x.field]; });
    }
    setIntakeData(nd);
    cancelEditing();
  };

  // ============================================
  // Submit to Supabase + Stripe
  // ============================================
  const handleSubmit = async () => {
    if (!clientName || !clientEmail) { alert(t.provideNameEmail); return; }

    // Verify client name matches at least one member
    const clientNorm = clientName.trim().toLowerCase().replace(/\s+/g, ' ');
    const allMembers = [
      intakeData.member_1_name, intakeData.member_2_name, intakeData.member_3_name
    ].filter(Boolean).map(n => n.trim().toLowerCase().replace(/\s+/g, ' '));
    const nameMatch = allMembers.some(m => m === clientNorm || m.includes(clientNorm) || clientNorm.includes(m));
    if (!nameMatch) {
      const proceed = confirm(language === 'es'
        ? `⚠️ El nombre del cliente ("${clientName}") no coincide con ningún miembro de la LLC. La persona que paga debe aparecer como miembro. ¿Desea continuar de todos modos?`
        : `⚠️ The client name ("${clientName}") does not match any LLC member. The person paying should be listed as a member. Do you wish to continue anyway?`
      );
      if (!proceed) return;
    }
    setIsLoading(true);
    try {
      // Step 1: Create matter in Supabase
      const res = await fetch('/api/llc/matters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          partner_id: typeof window !== 'undefined' ? localStorage.getItem('partner_id') || null : null,
          review_tier: reviewTier,
          intake_data: intakeData,
          language,
          selected_addons: selectedUpsells,
          filing_speed: filingSpeed,
          attorney_flags: attorneyFlags
        })
      });
      const result = await res.json();

      if (result.success && result.matter?.id) {
        // Step 2: Create Stripe checkout
        const sr = await fetch('/api/stripe/llc-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier: reviewTier,
            addons: selectedUpsells,
            filingSpeed,
            clientName,
            clientEmail,
            intakeData,
            language,
            matterId: result.matter.id
          })
        });
        const sd = await sr.json();
        if (sd.url) window.location.href = sd.url;
        else alert(t.errorTryAgain);
      } else {
        alert(result.error || t.errorTryAgain);
      }
    } catch {
      alert(t.errorTryAgain);
    }
    setIsLoading(false);
  };

  // ============================================
  // Live Preview (Answers panel — section grouped, click-to-edit)
  // ============================================
  const getLivePreview = () => {
    const entries = Object.entries(intakeData);
    if (entries.length === 0) return <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>{language === 'es' ? 'Las respuestas aparecerán aquí...' : 'Answers will appear here...'}</p>;
    const sections = {};
    entries.forEach(([k, v]) => {
      const q = QUESTIONS.find(x => x.field === k);
      const s = q?.section || 'other';
      if (!sections[s]) sections[s] = [];
      sections[s].push({ key: k, value: v, question: q });
    });
    return (
      <div style={{ padding: '12px' }}>
        {Object.entries(sections).map(([sec, items]) => (
          <div key={sec} style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', textTransform: 'uppercase' }}>{t.sections[sec] || sec}</div>
            {items.map(({ key, value, question }) => {
              const isEd = editingField === key;
              let dv = value === true ? t.yes : value === false ? t.no : value;
              if (question?.type === 'select' && question.options) {
                const o = question.options.find(x => x.value === value || x.value?.toString() === value?.toString());
                if (o) dv = language === 'en' ? o.label_en : o.label_es;
              }
              const lbl = question ? (language === 'en' ? question.question_en : question.question_es) : key;
              return (
                <div key={key} style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', fontSize: '13px', backgroundColor: isEd ? '#EFF6FF' : 'transparent', borderRadius: isEd ? '8px' : '0', marginBottom: isEd ? '8px' : '0' }}>
                  <div style={{ color: '#6B7280', marginBottom: '4px', fontSize: '12px' }}>{lbl.length > 60 ? lbl.substring(0, 60) + '...' : lbl}</div>
                  {isEd ? (
                    <div style={{ marginTop: '8px' }}>
                      {question?.type === 'boolean' ? (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          {['true', 'false'].map(bv => (
                            <button key={bv} onClick={() => setEditValue(bv)} style={{
                              padding: '8px 16px', border: '2px solid', borderColor: editValue === bv ? '#1E3A8A' : '#D1D5DB',
                              borderRadius: '6px', backgroundColor: editValue === bv ? '#EFF6FF' : 'white',
                              color: editValue === bv ? '#1E3A8A' : '#374151', fontWeight: '600', cursor: 'pointer'
                            }}>{bv === 'true' ? t.yes : t.no}</button>
                          ))}
                        </div>
                      ) : question?.type === 'select' ? (
                        <select value={editValue} onChange={e => setEditValue(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', marginBottom: '8px' }}>
                          {question.options?.map(o => <option key={o.value} value={o.value}>{language === 'en' ? o.label_en : o.label_es}</option>)}
                        </select>
                      ) : (
                        <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', marginBottom: '8px', boxSizing: 'border-box' }} />
                      )}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => saveEdit(key)} style={{ padding: '6px 12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{t.save}</button>
                        <button onClick={cancelEditing} style={{ padding: '6px 12px', backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{t.cancel}</button>
                      </div>
                    </div>
                  ) : (
                    <div onClick={() => startEditing(key, value)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '4px 0' }} title={t.clickToEdit}>
                      <span style={{ fontWeight: '600', color: '#1F2937' }}>{String(dv).length > 35 ? String(dv).substring(0, 35) + '...' : dv}</span>
                      <span style={{ fontSize: '11px', color: '#9CA3AF', padding: '2px 6px', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>{t.edit}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={st.container}>
      <div style={st.inner}>

        {/* ============ HEADER ============ */}
        <div style={st.header}>
          <div style={st.logo}>
            <div style={st.logoIcon}>MS</div>
            <div>
              <div style={st.title}>{t.title}</div>
              <div style={st.subtitle}>{t.subtitle}</div>
            </div>
          </div>
          <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} style={st.langToggle}>
            <GlobeIcon />
            <span style={{ fontWeight: '600' }}>{language === 'en' ? 'Español' : 'English'}</span>
          </button>
        </div>

        {/* ============ STEP 1: CLIENT INFO ============ */}
        {currentStep === 'client' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={st.card}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>{t.clientInfo}</h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={st.label}>{t.clientName} *</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} style={st.input} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={st.label}>{t.clientEmail} *</label>
                <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={st.input} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={st.label}>{t.clientPhone}</label>
                <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} style={st.input} />
              </div>
              <button onClick={() => { if (clientName && clientEmail) setCurrentStep('intake'); else alert(t.provideNameEmail); }} style={{ ...st.btnPrimary, ...st.btnBlue }}>
                {t.continue}
              </button>
            </div>
          </div>
        )}

        {/* ============ STEP 2: INTAKE QUESTIONS ============ */}
        {currentStep === 'intake' && (
          <div style={st.grid2}>
            {/* LEFT: Chat */}
            <div style={st.card}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{t.progress}</span>
                  <span style={st.badge}>{progress}%</span>
                </div>
                <div style={st.progressBar}><div style={{ ...st.progressFill, width: `${progress}%` }}></div></div>
              </div>
              <div style={st.chatContainer}>
                {messages.map((m, i) => (
                  <div key={i} style={m.role === 'user' ? st.msgUser : st.msgAssistant}>{m.content}</div>
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
                  disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading || !input.trim()} style={{
                  padding: '12px 20px', backgroundColor: isLoading || !input.trim() ? '#9CA3AF' : '#1E3A8A',
                  color: 'white', border: 'none', borderRadius: '8px',
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer'
                }}><SendIcon /></button>
              </div>
              {language === 'es' && <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '12px', textAlign: 'center' }}>{t.legalNote}</p>}
            </div>

            {/* RIGHT: Tabs (Answers + Document) */}
            <div style={st.card}>
              <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '16px' }}>
                <button onClick={() => setPreviewTab('answers')} style={{ ...st.tabButton, ...(previewTab === 'answers' ? st.tabActive : st.tabInactive) }}>
                  {t.yourAnswers}
                  <span style={{ ...st.badge, marginLeft: '8px' }}>{Object.keys(intakeData).length}/{visibleQuestions.length}</span>
                </button>
                <button onClick={() => setPreviewTab('document')} style={{ ...st.tabButton, ...(previewTab === 'document' ? st.tabActive : st.tabInactive) }}>
                  {t.document}
                </button>
              </div>
              {previewTab === 'answers'
                ? <div style={{ maxHeight: '440px', overflowY: 'auto' }}>{getLivePreview()}</div>
                : <DocumentPreview intakeData={intakeData} language={language} isPaid={isPaid} />
              }
              {Object.keys(intakeData).length === visibleQuestions.length && visibleQuestions.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <button onClick={() => setCurrentStep('tier')} style={{ ...st.btnPrimary, ...st.btnBlue }}>{t.continue}</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ STEP 3: TIER + UPSELLS + PAYMENT ============ */}
        {currentStep === 'tier' && (
          <div style={st.grid2}>
            {/* LEFT: Tier + Upsells */}
            <div style={st.card}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>{t.tierSelect}</h2>
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px', lineHeight: '1.5' }}>{t.tierValueNote}</p>

              {/* Tier cards */}
              {TIERS.map(tier => {
                const requiredTier = detectRequiredTier(intakeData);
                const isRequired = requiredTier === tier.value && TIERS.find(x => x.value === tier.value)?.price > TIERS[0].price;
                return (
                  <button key={tier.value} onClick={() => {
                    const req = TIERS.find(x => x.value === requiredTier);
                    const sel = TIERS.find(x => x.value === tier.value);
                    if (sel && req && sel.price >= req.price) setReviewTier(tier.value);
                  }} style={{
                    ...st.tierCard,
                    ...(reviewTier === tier.value ? st.tierCardSelected : {}),
                    opacity: (() => { const req = TIERS.find(x => x.value === requiredTier); const sel = TIERS.find(x => x.value === tier.value); return sel && req && sel.price < req.price ? 0.5 : 1; })(),
                    cursor: (() => { const req = TIERS.find(x => x.value === requiredTier); const sel = TIERS.find(x => x.value === tier.value); return sel && req && sel.price < req.price ? 'not-allowed' : 'pointer'; })()
                  }}>
                    {tier.popular && <div style={st.popularBadge}>{t.popular}</div>}
                    {isRequired && <div style={{ position: 'absolute', top: '-10px', left: '12px', backgroundColor: '#DC2626', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '600' }}>REQUIRED</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, paddingRight: '16px' }}>
                        <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{language === 'en' ? tier.label_en : tier.label_es}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.4' }}>{language === 'en' ? tier.desc_en : tier.desc_es}</div>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E3A8A', marginLeft: '12px' }}>${tier.price}</div>
                    </div>
                    {tier.attorney_note_en && (
                      <p style={{ fontSize: '10px', color: '#92400E', backgroundColor: '#FEF3C7', padding: '8px', borderRadius: '4px', margin: '12px 0 0 0' }}>
                        {language === 'en' ? tier.attorney_note_en : tier.attorney_note_es}
                      </p>
                    )}
                  </button>
                );
              })}

              {/* Entity Vault (mandatory, info only) */}
              <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #1E3A8A', borderRadius: '12px', padding: '16px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1E3A8A', margin: 0 }}>{t.vaultTitle}</h4>
                    <p style={{ fontSize: '12px', color: '#374151', margin: '4px 0 0 0' }}>{t.vaultDesc}</p>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#1E3A8A' }}>${ENTITY_VAULT.price}/{t.perYear}</div>
                </div>
              </div>

              {/* Tier clarification */}
              <div style={{ ...st.warningBox, marginTop: '16px', marginBottom: '24px' }}>
                <p style={st.warningText}>{t.tierClarification}</p>
              </div>

              {/* Add-ons */}
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{t.addOns}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>{t.addOnsSubtitle}</p>
                {UPSELLS.map(u => (
                  <div key={u.id} onClick={() => toggleUpsell(u.id)} style={{
                    ...st.upsellCard,
                    ...(selectedUpsells.includes(u.id) ? st.upsellCardSelected : {}),
                    opacity: u.id === 'registered_agent' && intakeData.agent_type === 'platform' ? 0.7 : 1
                  }}>
                    <div style={st.upsellHeader}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{getUpsellLabel(u.id, t)}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280' }}>{getUpsellDesc(u.id, t)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold', color: '#059669' }}>{getUpsellPrice(u.id, t)}</div>
                        {getUpsellBadge(u.id, t) && <div style={st.upsellBadge}>{getUpsellBadge(u.id, t)}</div>}
                      </div>
                    </div>
                    {u.id === 'registered_agent' && intakeData.agent_type === 'platform' && (
                      <div style={{ fontSize: '11px', color: '#1E3A8A', marginTop: '4px' }}>
                        {language === 'es' ? '✓ Incluido — usted seleccionó MS360 como agente' : '✓ Included — you selected MS360 as agent'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* State filing speed */}
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{t.stateFeesTitle}</h3>
                <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>{t.stateFeesDisclaimer}</p>
                {Object.entries(STATE_FEES).map(([key, fee]) => (
                  <label key={key} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px',
                    border: filingSpeed === key ? '2px solid #1E3A8A' : '1px solid #E5E7EB',
                    borderRadius: '8px', marginBottom: '8px', cursor: 'pointer',
                    backgroundColor: filingSpeed === key ? '#EFF6FF' : 'white'
                  }}>
                    <input type="radio" name="filing" checked={filingSpeed === key} onChange={() => setFilingSpeed(key)} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{t.stateFeeLabels[key]}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280' }}>{t.stateFeeTimelines[key]}</div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1E3A8A' }}>${fee.sos_fee}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* RIGHT: Order Summary + Preview */}
            <div>
              <div style={{ ...st.card, marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>{t.orderSummary}</h3>

                {/* Base price */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>{t.basePrice}</span>
                  <span>${TIERS.find(x => x.value === reviewTier)?.price}</span>
                </div>

                {/* Entity Vault */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>{t.entityVault}</span>
                  <span>${ENTITY_VAULT.price}/{t.perYear}</span>
                </div>

                {/* Selected add-ons */}
                {selectedUpsells.length > 0 && (
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '8px', marginTop: '8px' }}>
                    <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>{t.selectedAddOns}:</div>
                    {selectedUpsells.map(id => (
                      <div key={id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                        <span>{getUpsellLabel(id, t)}</span>
                        <span>+{getUpsellPrice(id, t)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* State fees (separate) */}
                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6B7280' }}>
                  <span>{t.stateFees}</span>
                  <span>${getStateFee(filingSpeed)}</span>
                </div>

                {/* Total */}
                <div style={{ borderTop: '2px solid #1F2937', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px' }}>
                  <span>{t.total}</span>
                  <span style={{ color: '#1E3A8A' }}>${calculateTotal(reviewTier, selectedUpsells)}</span>
                </div>

                {/* Pay button */}
                <div>
                  <button onClick={handleSubmit} disabled={isLoading} style={{
                    ...st.btnPrimary, marginTop: '16px',
                    ...(isLoading ? st.btnDisabled : st.btnBlue)
                  }}>
                    {isLoading ? t.paying : `${t.submit} - $${calculateTotal(reviewTier, selectedUpsells)}`}
                  </button>
                  <p style={{ fontSize: '11px', color: '#6B7280', textAlign: 'center', marginTop: '8px' }}>{t.paymentNote}</p>
                </div>
              </div>

              {/* Attorney flags warning */}
              {attorneyFlags.length > 0 && (
                <div style={{ ...st.card, marginBottom: '16px', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#92400E', marginBottom: '8px' }}>⚠️ {t.attorneyReviewRecommended}</h4>
                  <p style={{ fontSize: '12px', color: '#92400E', margin: 0 }}>{t.attorneyReviewMessage} {attorneyFlags.join(', ')}</p>
                </div>
              )}

              {/* Document Preview */}
              <div style={st.card}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>{t.preview}</h3>
                <DocumentPreview intakeData={intakeData} language={language} isPaid={isPaid} />
              </div>
            </div>
          </div>
        )}

        {/* ============ FOOTER ============ */}
        <div style={st.footer}>
          <p style={{ margin: 0 }}>Multi Servicios 360 | www.multiservicios360.net | 855.246.7274</p>
          <p style={{ margin: '4px 0 0', fontSize: '10px' }}>{t.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}