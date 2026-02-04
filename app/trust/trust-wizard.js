"use client";
import React, { useState, useEffect, useRef } from 'react';
import { QUESTIONS } from './trust-questions';
import { TRANSLATIONS } from './trust-translations';
import { TIERS, UPSELLS, getUpsellLabel, getUpsellDesc, getUpsellPrice, getUpsellBadge, calculateTotal, STYLES as st, SendIcon, GlobeIcon } from './trust-config';

// Document Preview Component
function DocumentPreview({ intakeData, language, isPaid }) {
  const labels = language === 'es' ? {
    title: 'DECLARACIÓN DE FIDEICOMISO', subtitle: 'Estado de California', trustor: 'FIDEICOMITENTE', trustee: 'FIDEICOMISARIO',
    successor: 'SUCESOR', beneficiaries: 'BENEFICIARIOS', assets: 'ACTIVOS', revocable: 'REVOCABILIDAD',
    revocableYes: 'Este fideicomiso ES REVOCABLE.', revocableNo: 'Este fideicomiso es IRREVOCABLE.',
    watermark: 'VISTA PREVIA', payToUnlock: 'Complete el pago para ver completo', hidden: '[PROTEGIDO]', joint: 'Fideicomiso Conjunto'
  } : {
    title: 'DECLARATION OF TRUST', subtitle: 'State of California', trustor: 'TRUSTOR', trustee: 'TRUSTEE',
    successor: 'SUCCESSOR TRUSTEE', beneficiaries: 'BENEFICIARIES', assets: 'ASSETS', revocable: 'REVOCABILITY',
    revocableYes: 'This Trust IS REVOCABLE.', revocableNo: 'This Trust is IRREVOCABLE.',
    watermark: 'PREVIEW', payToUnlock: 'Complete payment to view', hidden: '[PROTECTED]', joint: 'Joint Trust'
  };
  const hide = (c, n = 0) => isPaid ? c : (!c ? labels.hidden : (n > 0 && c.length > n ? c.substring(0, n) + '···' : labels.hidden));
  const trustName = intakeData.trustor_name ? `The ${intakeData.trustor_name} Trust` : 'The [Name] Trust';

  return (
    <div style={{ position: 'relative', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '24px', fontFamily: 'Times New Roman, serif', fontSize: '12px', lineHeight: '1.4', maxHeight: '500px', overflowY: 'auto' }}>
      {!isPaid && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', fontSize: '32px', fontWeight: 'bold', color: 'rgba(239,68,68,0.15)', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10 }}>{labels.watermark}</div>}
      <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #1F2937', paddingBottom: '12px' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{labels.title}</div>
        <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>{hide(trustName, 10)}</div>
        <div style={{ fontSize: '12px', color: '#6B7280' }}>{labels.subtitle}</div>
        {intakeData.is_joint_trust && <div style={{ fontSize: '11px', color: '#2563EB', marginTop: '4px' }}>({labels.joint})</div>}
      </div>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '4px' }}>{labels.trustor}</div>
        <div><strong>Name:</strong> {hide(intakeData.trustor_name, 5)}</div>
        <div style={{ filter: isPaid ? 'none' : 'blur(3px)' }}><strong>Address:</strong> {hide(intakeData.trustor_address)}</div>
        {intakeData.spouse_name && intakeData.is_joint_trust && <div><strong>Co-Trustor:</strong> {hide(intakeData.spouse_name, 5)}</div>}
      </div>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '4px' }}>{labels.trustee}</div>
        <div><strong>Initial:</strong> {intakeData.initial_trustee === 'myself' ? hide(intakeData.trustor_name, 5) : intakeData.initial_trustee === 'myself_and_spouse' ? 'Trustor & Spouse' : hide(intakeData.initial_trustee)}</div>
      </div>
      {intakeData.successor_trustee_1_name && <div style={{ marginBottom: '12px' }}><div style={{ fontWeight: 'bold', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '4px' }}>{labels.successor}</div><div><strong>1st:</strong> {hide(intakeData.successor_trustee_1_name, 5)}</div>{intakeData.successor_trustee_2_name && <div><strong>2nd:</strong> {hide(intakeData.successor_trustee_2_name, 5)}</div>}</div>}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '4px' }}>{labels.beneficiaries}</div>
        <div style={{ filter: isPaid ? 'none' : 'blur(3px)' }}>{hide(intakeData.primary_beneficiaries)}</div>
        {intakeData.beneficiary_shares && <div style={{ fontSize: '10px', color: '#6B7280', filter: isPaid ? 'none' : 'blur(3px)' }}>Shares: {hide(intakeData.beneficiary_shares)}</div>}
      </div>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '4px' }}>{labels.revocable}</div>
        <p style={{ margin: 0, fontSize: '10px' }}>{intakeData.is_revocable !== false ? labels.revocableYes : labels.revocableNo}</p>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #E5E7EB', paddingBottom: '2px', marginBottom: '4px' }}>{labels.assets}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '10px' }}>
          {[['owns_ca_real_estate', 'CA Real Estate'], ['owns_business', 'Business'], ['has_digital_assets', 'Digital Assets'], ['has_specific_gifts', 'Specific Gifts']].map(([k, l]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '12px', height: '12px', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>{intakeData[k] ? 'X' : ''}</span><span>{l}</span></div>
          ))}
        </div>
      </div>
      {intakeData.has_minor_children && <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#FEF3C7', borderRadius: '4px' }}><div style={{ fontWeight: 'bold', fontSize: '10px' }}>📋 Minor's Trust Included</div><div style={{ fontSize: '9px', color: '#92400E' }}>Distribution age: {intakeData.minor_distribution_age || '18'}</div></div>}
      {!isPaid && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, white)', padding: '30px 16px 16px', textAlign: 'center' }}><p style={{ color: '#6B7280', fontSize: '12px' }}>{labels.payToUnlock}</p></div>}
    </div>
  );
}

// Main Component
export default function TrustIntakeWizard() {
  const [language, setLanguage] = useState('es');
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
  const [reviewTier, setReviewTier] = useState('trust_plus');
  const [selectedUpsells, setSelectedUpsells] = useState([]);
  const [previewTab, setPreviewTab] = useState('answers');
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [attorneyFlags, setAttorneyFlags] = useState([]);
  const messagesEndRef = useRef(null);
  const t = TRANSLATIONS[language];

  const shouldShowQuestion = (q, data) => {
    if (!q.showIf) return true;
    const { field, value, values } = q.showIf;
    return values ? values.includes(data[field]) : data[field] === value;
  };

  const getVisibleQuestions = () => QUESTIONS.filter(q => shouldShowQuestion(q, intakeData));
  const visibleQuestions = getVisibleQuestions();
  const progress = visibleQuestions.length > 0 ? Math.round((Object.keys(intakeData).length / visibleQuestions.length) * 100) : 0;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (currentStep === 'intake' && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t.greeting }]);
      const vq = getVisibleQuestions();
      const q = vq[0];
      const txt = language === 'en' ? q.question_en : q.question_es;
      setTimeout(() => setMessages(prev => [...prev, { role: 'assistant', content: `📋 ${t.sections[q.section]}\n\n${txt}` }]), 500);
    }
  }, [currentStep]);

  const toggleUpsell = (id) => {
    if (id === 'vault' && selectedUpsells.includes('vault_plus')) setSelectedUpsells(p => p.filter(x => x !== 'vault_plus').concat('vault'));
    else if (id === 'vault_plus' && selectedUpsells.includes('vault')) setSelectedUpsells(p => p.filter(x => x !== 'vault').concat('vault_plus'));
    else setSelectedUpsells(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

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

      if (cq.type === 'boolean') {
        const n = userMsg.toLowerCase();
        if (n.includes('yes') || n.includes('si') || n.includes('sí') || n === 'y' || n === 's') val = true;
        else if (n.includes('no') || n === 'n') val = false;
        else { setMessages(p => [...p, { role: 'assistant', content: t.pleaseAnswer }]); setIsLoading(false); return; }
      } else if (cq.type === 'select') {
        const n = userMsg.toLowerCase().trim();
        let opt = null;
        const idx = parseInt(n) - 1;
        if (!isNaN(idx) && idx >= 0 && idx < cq.options.length) opt = cq.options[idx];
        if (!opt) opt = cq.options.find(o => o.value.toLowerCase() === n || o.label_en.toLowerCase().includes(n) || o.label_es.toLowerCase().includes(n));
        if (opt) val = opt.value;
        else { setMessages(p => [...p, { role: 'assistant', content: t.pleaseSelect }]); setIsLoading(false); return; }
      }

      const newData = { ...intakeData, [cq.field]: val };
      setIntakeData(newData);

      if (cq.note?.includes('attorney') && (val === true || val === 'yes')) setAttorneyFlags(p => [...p, cq.field]);

      const dv = val === true ? t.yes : val === false ? t.no : val;
      let savedMsg = `${t.saved} ${dv}`;
      if ((val === true || val === 'yes') && cq.note?.includes('attorney')) savedMsg += `\n\n${t.attorneyFlag}`;
      setMessages(p => [...p, { role: 'assistant', content: savedMsg }]);

      const newVQ = QUESTIONS.filter(q => shouldShowQuestion(q, newData));
      const cfi = newVQ.findIndex(q => q.field === cq.field);
      const nextIdx = cfi + 1;
      setCurrentQuestionIndex(nextIdx);

      setTimeout(() => {
        if (nextIdx < newVQ.length) {
          const nq = newVQ[nextIdx];
          const qt = language === 'en' ? nq.question_en : nq.question_es;
          let fq = cq.section !== nq.section && t.sections[nq.section] ? `📋 ${t.sections[nq.section]}\n\n${qt}` : qt;
          if (nq.type === 'select' && nq.options) fq += '\n\n' + t.options + '\n' + nq.options.map((o, i) => `${i + 1}. ${language === 'en' ? o.label_en : o.label_es}`).join('\n');
          else if (nq.type === 'boolean') fq += `\n\n${t.options}\n• ${t.yes}\n• ${t.no}`;
          setMessages(p => [...p, { role: 'assistant', content: fq }]);
        } else {
          let msg = `✅ ${t.allQuestionsAnswered}`;
          if (newData.has_poa === 'no') msg += `\n\n${t.poaUpsell}`;
          if (newData.has_healthcare_directive === 'no') msg += `\n\n${t.healthcareUpsell}`;
          setMessages(p => [...p, { role: 'assistant', content: msg }]);
          setCurrentStep('tier');
        }
        setIsLoading(false);
      }, 500);
    } catch { setMessages(p => [...p, { role: 'assistant', content: t.errorTryAgain }]); setIsLoading(false); }
  };

  const startEditing = (f, v) => { setEditingField(f); setEditValue(v === true ? 'true' : v === false ? 'false' : v); };
  const cancelEditing = () => { setEditingField(null); setEditValue(''); };

  const saveEdit = (f) => {
    const q = QUESTIONS.find(x => x.field === f);
    if (!q) return;
    let nv = editValue;
    if (q.type === 'boolean') nv = editValue === 'true';
    const nd = { ...intakeData, [f]: nv };
    if (q.type === 'boolean' && nv === false) QUESTIONS.forEach(x => { if (x.showIf?.field === f) delete nd[x.field]; });
    setIntakeData(nd);
    cancelEditing();
  };

  const handleSubmit = async () => {
    if (!clientName || !clientEmail) { alert(t.provideNameEmail); return; }
    setIsLoading(true);
    try {
      const res = await fetch('/api/trust/matters', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_name: clientName, client_email: clientEmail, client_phone: clientPhone, review_tier: reviewTier, intake_data: intakeData, language, selected_addons: selectedUpsells, attorney_flags: attorneyFlags }) });
      const result = await res.json();
      if (result.success && result.matter?.id) {
        const sr = await fetch('/api/stripe/trust-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tier: reviewTier, addons: selectedUpsells, clientName, clientEmail, intakeData, language, matterId: result.matter.id }) });
        const sd = await sr.json();
        if (sd.url) window.location.href = sd.url;
        else alert(t.failedSubmit);
      } else alert(result.error || t.failedSubmit);
    } catch { alert(t.failedSubmit); }
    setIsLoading(false);
  };

  const getLivePreview = () => {
    const entries = Object.entries(intakeData);
    if (entries.length === 0) return <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>{t.answersWillAppear}</p>;
    const sections = {};
    entries.forEach(([k, v]) => { const q = QUESTIONS.find(x => x.field === k); const s = q?.section || 'other'; if (!sections[s]) sections[s] = []; sections[s].push({ key: k, value: v, question: q }); });
    return (
      <div style={{ padding: '12px' }}>
        {Object.entries(sections).map(([sec, items]) => (
          <div key={sec} style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#7C3AED', marginBottom: '8px', textTransform: 'uppercase' }}>{t.sections[sec] || sec}</div>
            {items.map(({ key, value, question }) => {
              const isEd = editingField === key;
              let dv = value === true ? t.yes : value === false ? t.no : value;
              if (question?.type === 'select' && question.options) { const o = question.options.find(x => x.value === value); if (o) dv = language === 'en' ? o.label_en : o.label_es; }
              const lbl = question ? (language === 'en' ? question.question_en : question.question_es) : key;
              return (
                <div key={key} style={{ padding: '10px 12px', borderBottom: '1px solid #F3F4F6', fontSize: '13px', backgroundColor: isEd ? '#FAF5FF' : 'transparent', borderRadius: isEd ? '8px' : '0', marginBottom: isEd ? '8px' : '0' }}>
                  <div style={{ color: '#6B7280', marginBottom: '4px', fontSize: '12px' }}>{lbl.length > 60 ? lbl.substring(0, 60) + '...' : lbl}</div>
                  {isEd ? (
                    <div style={{ marginTop: '8px' }}>
                      {question?.type === 'boolean' ? (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          {['true', 'false'].map(bv => <button key={bv} onClick={() => setEditValue(bv)} style={{ padding: '8px 16px', border: '2px solid', borderColor: editValue === bv ? '#7C3AED' : '#D1D5DB', borderRadius: '6px', backgroundColor: editValue === bv ? '#FAF5FF' : 'white', color: editValue === bv ? '#7C3AED' : '#374151', fontWeight: '600', cursor: 'pointer' }}>{bv === 'true' ? t.yes : t.no}</button>)}
                        </div>
                      ) : question?.type === 'select' ? (
                        <select value={editValue} onChange={e => setEditValue(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', marginBottom: '8px' }}>
                          {question.options?.map(o => <option key={o.value} value={o.value}>{language === 'en' ? o.label_en : o.label_es}</option>)}
                        </select>
                      ) : <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', marginBottom: '8px' }} />}
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

  // RENDER
  return (
    <div style={st.container}>
      <div style={st.inner}>
        {/* Header */}
        <div style={st.header}>
          <div style={st.logo}><div style={st.logoIcon}>MS</div><div><div style={st.title}>{t.title}</div><div style={st.subtitle}>{t.subtitle}</div></div></div>
          <button onClick={() => setLanguage(language === 'en' ? 'es' : 'en')} style={st.langToggle}><GlobeIcon /><span style={{ fontWeight: '600' }}>{language === 'en' ? 'Español' : 'English'}</span></button>
        </div>

        {/* Step 1: Client Info */}
        {currentStep === 'client' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={st.card}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>{t.clientInfo}</h2>
              <div style={{ marginBottom: '16px' }}><label style={st.label}>{t.clientName} *</label><input type="text" value={clientName} onChange={e => setClientName(e.target.value)} style={st.input} /></div>
              <div style={{ marginBottom: '16px' }}><label style={st.label}>{t.clientEmail} *</label><input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={st.input} /></div>
              <div style={{ marginBottom: '24px' }}><label style={st.label}>{t.clientPhone}</label><input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} style={st.input} /></div>
              <button onClick={() => { if (clientName && clientEmail) setCurrentStep('intake'); else alert(t.provideNameEmail); }} style={{ ...st.btnPrimary, ...st.btnPurple }}>{t.continue}</button>
            </div>
          </div>
        )}

        {/* Step 2: Intake Questions */}
        {currentStep === 'intake' && (
          <div style={st.grid2}>
            <div style={st.card}>
              <div style={{ marginBottom: '16px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ fontSize: '14px', fontWeight: '500' }}>{t.progress}</span><span style={st.badge}>{progress}%</span></div><div style={st.progressBar}><div style={{ ...st.progressFill, width: `${progress}%` }}></div></div></div>
              <div style={st.chatContainer}>{messages.map((m, i) => <div key={i} style={m.role === 'user' ? st.msgUser : st.msgAssistant}>{m.content}</div>)}<div ref={messagesEndRef} /></div>
              <div style={{ display: 'flex', gap: '8px' }}><input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder={t.typeAnswer} style={{ ...st.input, flex: 1 }} disabled={isLoading} /><button onClick={handleSend} disabled={isLoading || !input.trim()} style={{ padding: '12px 20px', backgroundColor: isLoading || !input.trim() ? '#9CA3AF' : '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer' }}><SendIcon /></button></div>
              {language === 'es' && <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '12px', textAlign: 'center' }}>{t.legalNote}</p>}
            </div>
            <div style={st.card}>
              <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '16px' }}>
                <button onClick={() => setPreviewTab('answers')} style={{ ...st.tabButton, ...(previewTab === 'answers' ? st.tabActive : st.tabInactive) }}>{t.yourAnswers}<span style={{ ...st.badge, marginLeft: '8px' }}>{Object.keys(intakeData).length}/{visibleQuestions.length}</span></button>
                <button onClick={() => setPreviewTab('document')} style={{ ...st.tabButton, ...(previewTab === 'document' ? st.tabActive : st.tabInactive) }}>{t.document}</button>
              </div>
              {previewTab === 'answers' ? <div style={{ maxHeight: '440px', overflowY: 'auto' }}>{getLivePreview()}</div> : <DocumentPreview intakeData={intakeData} language={language} isPaid={isPaid} />}
              {Object.keys(intakeData).length === visibleQuestions.length && visibleQuestions.length > 0 && <div style={{ marginTop: '16px' }}><button onClick={() => setCurrentStep('tier')} style={{ ...st.btnPrimary, ...st.btnPurple }}>{t.continue}</button></div>}
            </div>
          </div>
        )}

        {/* Step 3: Tier Selection */}
        {currentStep === 'tier' && (
          <div style={st.grid2}>
            <div style={st.card}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>{t.tierSelect}</h2>
              {TIERS.map(tier => (
                <button key={tier.value} onClick={() => setReviewTier(tier.value)} style={{ ...st.tierCard, ...(reviewTier === tier.value ? st.tierCardSelected : {}) }}>
                  {tier.popular && <div style={st.popularBadge}>{t.popular}</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}><div style={{ flex: 1, paddingRight: '16px' }}><div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{language === 'en' ? tier.label_en : tier.label_es}</div><div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.4' }}>{language === 'en' ? tier.desc_en : tier.desc_es}</div></div><div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7C3AED', marginLeft: '12px' }}>${tier.price}</div></div>
                </button>
              ))}
              <div style={{ ...st.warningBox, marginTop: '16px', marginBottom: '24px' }}><p style={st.warningText}>{t.tierClarification}</p></div>
              <div style={{ marginTop: '24px' }}><h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{t.addOns}</h3><p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>{t.addOnsSubtitle}</p>
                {UPSELLS.map(u => (
                  <div key={u.id} onClick={() => toggleUpsell(u.id)} style={{ ...st.upsellCard, ...(selectedUpsells.includes(u.id) ? st.upsellCardSelected : {}) }}>
                    <div style={st.upsellHeader}><div><div style={{ fontWeight: '600' }}>{getUpsellLabel(u.id, t)}</div><div style={{ fontSize: '13px', color: '#6B7280' }}>{getUpsellDesc(u.id, t)}</div></div><div style={{ textAlign: 'right' }}><div style={{ fontWeight: 'bold', color: '#059669' }}>{getUpsellPrice(u.id, t)}</div><div style={st.upsellBadge}>{getUpsellBadge(u.id, t)}</div></div></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ ...st.card, marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>{t.orderSummary}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>{t.basePrice}</span><span>${TIERS.find(x => x.value === reviewTier)?.price}</span></div>
                {selectedUpsells.length > 0 && <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '8px', marginTop: '8px' }}><div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>{t.selectedAddOns}:</div>{selectedUpsells.map(id => <div key={id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}><span>{getUpsellLabel(id, t)}</span><span>+${UPSELLS.find(x => x.id === id)?.price}</span></div>)}</div>}
                <div style={{ borderTop: '2px solid #1F2937', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px' }}><span>{t.total}</span><span style={{ color: '#7C3AED' }}>${calculateTotal(reviewTier, selectedUpsells)}</span></div>
                <div><button onClick={handleSubmit} disabled={isLoading} style={{ ...st.btnPrimary, marginTop: '16px', ...(isLoading ? st.btnDisabled : st.btnPurple) }}>{isLoading ? t.paying : `${t.submit} - $${calculateTotal(reviewTier, selectedUpsells)}`}</button><p style={{ fontSize: '11px', color: '#6B7280', textAlign: 'center', marginTop: '8px' }}>{t.paymentNote}</p></div>
              </div>
              {attorneyFlags.length > 0 && <div style={{ ...st.card, marginBottom: '16px', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}><h4 style={{ fontSize: '14px', fontWeight: '600', color: '#92400E', marginBottom: '8px' }}>⚠️ {t.attorneyReviewRecommended}</h4><p style={{ fontSize: '12px', color: '#92400E', margin: 0 }}>{t.attorneyReviewMessage} {attorneyFlags.join(', ')}</p></div>}
              <div style={st.card}><h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>{t.preview}</h3><DocumentPreview intakeData={intakeData} language={language} isPaid={isPaid} /></div>
            </div>
          </div>
        )}

        <div style={st.footer}><p style={{ margin: 0 }}>Multi Servicios 360 | www.multiservicios360.net | 855.246.7274</p></div>
      </div>
    </div>
  );
}
