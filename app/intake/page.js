'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { POA_INTAKE_SCHEMA } from '../../lib/poa/intake.schema.js';
import { mapIntakeToFlags } from '../../lib/poa/mapIntakeToFlags.js';
import { assemblePOA } from '../../lib/poa/assemble.js';
import { translations, questionTranslations } from '../../lib/translations.js';

/**
 * Utilities
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) current[k] = value;
    else {
      current[k] = current[k] || {};
      current = current[k];
    }
  });
}

function getValueByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function isQuestionVisible(q, intakeData) {
  if (!q?.showIf) return true;
  const actual = getValueByPath(intakeData, q.showIf.id);
  return actual === q.showIf.equals;
}

function findNextVisibleIndex(startIndex, intakeData) {
  for (let i = startIndex; i < POA_INTAKE_SCHEMA.length; i++) {
    if (isQuestionVisible(POA_INTAKE_SCHEMA[i], intakeData)) return i;
  }
  return -1;
}

function coerceAnswer(rawInput, question) {
  const raw = (rawInput ?? '').trim();
  const lower = raw.toLowerCase();

  if (question.type === 'boolean') {
    if (['y', 'yes', 'true', '1', 'si', 'sí'].includes(lower)) return true;
    if (['n', 'no', 'false', '0'].includes(lower)) return false;
    return null;
  }

  if (question.type === 'select') {
    const opts = question.options || [];
    const found = opts.find(
      (o) =>
        String(o.value).toLowerCase() === lower ||
        String(o.label || '').toLowerCase() === lower
    );
    return found ? found.value : null;
  }

  return raw.length ? raw : null;
}

function formatAnswer(answer, question, language, qtEntry) {
  if (question.type === 'boolean') {
    return language === 'es' ? (answer ? 'Sí' : 'No') : (answer ? 'Yes' : 'No');
  }

  if (question.type === 'select') {
    // Prefer localized option label from translations
    const localizedOpt = qtEntry?.options?.[answer];
    if (localizedOpt) return localizedOpt;

    const opt = (question.options || []).find((o) => o.value === answer);
    return opt ? opt.label : String(answer);
  }

  return String(answer);
}

/**
 * Page
 */
export default function IntakePage() {
  const [intakeData, setIntakeData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(() => findNextVisibleIndex(0, {}));
  const [userInput, setUserInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Spanish-first UI
  const [language, setLanguage] = useState('es');

  const t = translations?.[language] || translations?.es || {};
  const qt = questionTranslations?.[language] || questionTranslations?.es || {};

  // Always start greeting in Spanish deterministically (avoid t timing on first render)
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'bot',
      text: translations?.es?.greeting || '¡Hola! Soy tu asistente legal.'
    }
  ]);

  const currentQuestion = currentIndex >= 0 ? POA_INTAKE_SCHEMA[currentIndex] : null;

  // Build flags + assembled preview (English-only output handled in assemblePOA)
  const flags = useMemo(() => {
    try {
      return mapIntakeToFlags(intakeData);
    } catch {
      return null;
    }
  }, [intakeData]);

  const assembled = useMemo(() => {
    if (!flags) return { includedTitles: [], text: '' };
    try {
      return assemblePOA(flags);
    } catch {
      return { includedTitles: [], text: '' };
    }
  }, [flags]);

  const didAskInitialQuestionRef = useRef(false);

  const pushBot = (text) => setChatMessages((prev) => [...prev, { type: 'bot', text }]);
  const pushUser = (text) => setChatMessages((prev) => [...prev, { type: 'user', text }]);

  const getLocalizedPrompt = (q) => {
    if (!q) return { label: '', question: '', qtEntry: null };
    const qtEntry = qt?.[q.id] || null;
    return {
      label: qtEntry?.label || q.label || q.id,
      question: qtEntry?.question || q.question || '',
      qtEntry
    };
  };

  const askQuestion = (q) => {
    if (!q) return;

    const { label, question, qtEntry } = getLocalizedPrompt(q);
    pushBot(`${label}: ${question}`);

    if (q.type === 'select' && (q.options || []).length) {
      const localizedOptions = qtEntry?.options || {};
      pushBot(
        `${t.optionsHeader || (language === 'es' ? 'Opciones:' : 'Options:')}\n` +
          q.options
            .map((o) => `- ${o.value} — ${localizedOptions[o.value] || o.label}`)
            .join('\n')
      );
    }

    if (q.type === 'boolean') {
      pushBot(t.booleanHint || (language === 'es' ? 'Por favor responda: Sí o No.' : 'Please answer: Yes or No.'));
    }
  };

  // Ask the first question on mount (once)
  useEffect(() => {
    if (didAskInitialQuestionRef.current) return;
    didAskInitialQuestionRef.current = true;

    const first = findNextVisibleIndex(0, intakeData);
    if (first === -1) {
      setIsComplete(true);
      pushBot(t.noQuestionsConfigured || (language === 'es' ? 'No hay preguntas configuradas.' : 'No intake questions are configured.'));
      return;
    }

    setCurrentIndex(first);
    askQuestion(POA_INTAKE_SCHEMA[first]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When UI language changes, update only the first greeting line
  useEffect(() => {
    setChatMessages((prev) => {
      if (!prev?.length) return prev;
      const first = prev[0];
      if (first?.type !== 'bot') return prev;

      const nextGreeting =
        t.greeting ||
        (language === 'es'
          ? '¡Hola! Soy tu asistente legal. Te ayudaré a recopilar la información necesaria para un Poder Notarial en California.'
          : "Hello! I'm your AI legal assistant. I'll help you collect the information needed for a California Power of Attorney.");

      const cloned = [...prev];
      cloned[0] = { ...cloned[0], text: nextGreeting };
      return cloned;
    });
  }, [language, t.greeting]);

  const handleSendMessage = () => {
    const trimmed = userInput.trim();
    if (!trimmed) return;

    if (isComplete) {
      pushUser(trimmed);
      setUserInput('');
      return;
    }

    if (!currentQuestion) {
      pushUser(trimmed);
      setUserInput('');
      setIsComplete(true);
      pushBot(t.intakeIsComplete || (language === 'es' ? 'La entrevista está completa.' : 'Intake is complete.'));
      return;
    }

    const parsed = coerceAnswer(trimmed, currentQuestion);
    if (parsed === null) {
      pushBot(
        currentQuestion.type === 'boolean'
          ? (t.invalidBoolean || (language === 'es' ? 'Respuesta inválida. Por favor responda Sí o No.' : 'Invalid response. Please answer Yes or No.'))
          : currentQuestion.type === 'select'
          ? (t.invalidSelect || (language === 'es' ? 'Respuesta inválida. Escriba uno de los valores (o el texto de la opción).' : 'Invalid response. Please type one of the option values (or the option label).'))
          : (t.invalidText || (language === 'es' ? 'Respuesta inválida. Ingrese un valor válido.' : 'Invalid response. Please enter a valid value.'))
      );
      return;
    }

    // Save to intakeData
    const updated = { ...intakeData };
    setNestedValue(updated, currentQuestion.id, parsed);
    setIntakeData(updated);

    // Add chat messages
    pushUser(trimmed);

    const { label, qtEntry } = getLocalizedPrompt(currentQuestion);
    pushBot(
      `${t.savedPrefix || (language === 'es' ? 'Guardado:' : 'Saved:')} ${label} = ${formatAnswer(parsed, currentQuestion, language, qtEntry)}`
    );

    // Clear input
    setUserInput('');

    // Next question
    const nextIdx = findNextVisibleIndex(currentIndex + 1, updated);

    if (nextIdx === -1) {
      setIsComplete(true);
      setCurrentIndex(-1);

      pushBot(t.intakeComplete || (language === 'es' ? 'Todo listo. La entrevista está completa.' : 'All set. Intake is complete.'));
      pushBot(t.reviewClauses || (language === 'es' ? 'Revise el panel de vista previa para ver las cláusulas seleccionadas.' : 'Review the clause preview panel for selected clauses.'));
      return;
    }

    setCurrentIndex(nextIdx);
    askQuestion(POA_INTAKE_SCHEMA[nextIdx]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleReset = () => {
    const empty = {};
    const first = findNextVisibleIndex(0, empty);

    setIntakeData(empty);
    setCurrentIndex(first);
    setUserInput('');
    setIsComplete(false);

    setChatMessages([
      {
        type: 'bot',
        text: language === 'es'
          ? (translations?.es?.greeting || '¡Hola! Soy tu asistente legal.')
          : (translations?.en?.greeting || "Hello! I'm your AI legal assistant.")
      }
    ]);

    setTimeout(() => {
      if (first !== -1) askQuestion(POA_INTAKE_SCHEMA[first]);
      else pushBot(t.noQuestionsConfigured || (language === 'es' ? 'No hay preguntas configuradas.' : 'No intake questions are configured.'));
    }, 0);
  };

  // Auto-scroll chat
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 420px',
        gap: 16,
        padding: 16,
        maxWidth: 1200,
        margin: '0 auto'
      }}
    >
      {/* Chat */}
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#fff'
        }}
      >
        {/* Header + Translator Toggle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 12,
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb'
          }}
        >
          <div style={{ fontWeight: 700 }}>
            {t.pageTitle || (language === 'es' ? 'Chat de Poder Notarial (California)' : 'California Power of Attorney Intake')}
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setLanguage('es')}
              disabled={language === 'es'}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                background: language === 'es' ? '#111827' : '#ffffff',
                color: language === 'es' ? '#ffffff' : '#111827',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              {t.switchToSpanish || 'Español'}
            </button>

            <button
              onClick={() => setLanguage('en')}
              disabled={language === 'en'}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                background: language === 'en' ? '#111827' : '#ffffff',
                color: language === 'en' ? '#ffffff' : '#111827',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              {t.switchToEnglish || 'English'}
            </button>
          </div>
        </div>

        <div style={{ padding: 12, height: '65vh', overflowY: 'auto' }}>
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 10
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  whiteSpace: 'pre-wrap',
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  background: msg.type === 'user' ? '#eef2ff' : '#ffffff'
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            padding: 12,
            background: '#f9fafb',
            display: 'flex',
            gap: 8
          }}
        >
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isComplete
                ? (t.intakeCompleteMsg || (language === 'es' ? 'Entrevista completa.' : 'Intake complete.'))
                : (t.inputPlaceholder || (language === 'es' ? 'Escriba su respuesta…' : 'Type your answer…'))
            }
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid #d1d5db'
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid #111827',
              background: '#111827',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {t.send || (language === 'es' ? 'Enviar' : 'Send')}
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid #d1d5db',
              background: '#fff',
              color: '#111827',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {t.reset || (language === 'es' ? 'Reiniciar' : 'Reset')}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#fff'
        }}
      >
        <div
          style={{
            padding: 12,
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb',
            fontWeight: 700
          }}
        >
          {t.livePreview || (language === 'es' ? 'Vista Previa de Cláusulas' : 'Live Clause Preview')}
        </div>

        <div style={{ padding: 12 }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 700 }}>{t.progress || (language === 'es' ? 'Progreso' : 'Progress')}</div>
            <div>
              {t.currentQuestion || (language === 'es' ? 'Pregunta actual:' : 'Current question:')}{' '}
              <strong>{currentQuestion ? getLocalizedPrompt(currentQuestion).label : '—'}</strong>
            </div>
            <div>
              {t.status || (language === 'es' ? 'Estado:' : 'Status:')}{' '}
              <strong>{isComplete ? (t.complete || (language === 'es' ? 'Completo' : 'Complete')) : (t.inProgress || (language === 'es' ? 'En progreso' : 'In progress'))}</strong>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              {t.includedClauses || (language === 'es' ? 'Cláusulas Incluidas' : 'Included Clauses')}
            </div>
            {assembled?.includedTitles?.length ? (
              <ul style={{ marginTop: 0 }}>
                {assembled.includedTitles.map((title) => (
                  <li key={title}>{title}</li>
                ))}
              </ul>
            ) : (
              <div style={{ color: '#6b7280' }}>
                {t.noClausesSelected || (language === 'es' ? 'Aún no se han seleccionado cláusulas.' : 'No clauses selected yet.')}
              </div>
            )}
          </div>

          <details style={{ marginBottom: 10 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 700 }}>
              {t.debugFlags || (language === 'es' ? 'Depurar: Indicadores' : 'Debug: Flags')}
            </summary>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
              {JSON.stringify(flags, null, 2)}
            </pre>
          </details>

          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 700 }}>
              {t.debugIntakeData || (language === 'es' ? 'Depurar: Datos de Entrada' : 'Debug: Intake Data')}
            </summary>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
              {JSON.stringify(intakeData, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}


