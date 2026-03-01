// lib/useDraftSave.js
// Reusable hook for auto-saving document wizard progress
// Usage: const { checkForDraft } = useDraftSave({ email, docType, clientName, language, intakeData, currentQuestionIndex, messages, step })

import { useEffect, useRef, useCallback } from 'react';

export function useDraftSave({
  email,
  docType,
  clientName,
  language,
  intakeData,
  currentQuestionIndex,
  messages,
  step,
  partnerCode,
  enabled = true,
}) {
  const saveTimeout = useRef(null);
  const lastSaved = useRef(null);

  const saveDraft = useCallback(async () => {
    if (!email || !docType || !enabled) return;
    // Don't save if nothing meaningful has been entered
    if (Object.keys(intakeData || {}).length === 0 && currentQuestionIndex === 0) return;

    const payload = {
      email,
      doc_type: docType,
      language,
      client_name: clientName,
      intake_data: intakeData,
      current_question_index: currentQuestionIndex,
      messages: (messages || []).slice(-20), // only save last 20 messages to keep payload small
      step,
      partner_code: partnerCode,
    };

    const key = JSON.stringify(payload);
    if (key === lastSaved.current) return; // nothing changed
    lastSaved.current = key;

    try {
      await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // Silent fail — don't interrupt user flow
    }
  }, [email, docType, language, clientName, intakeData, currentQuestionIndex, messages, step, partnerCode, enabled]);

  // Auto-save 2 seconds after any change
  useEffect(() => {
    if (!email || !enabled) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(saveDraft, 2000);
    return () => clearTimeout(saveTimeout.current);
  }, [saveDraft, email, enabled]);

  // Mark draft as completed when payment succeeds
  const markCompleted = useCallback(async () => {
    if (!email || !docType) return;
    try {
      await fetch('/api/drafts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, doc_type: docType }),
      });
    } catch (e) {}
  }, [email, docType]);

  // Check for existing draft when user enters email
  const checkForDraft = useCallback(async (emailToCheck) => {
    if (!emailToCheck || !docType) return null;
    try {
      const res = await fetch(`/api/drafts?email=${encodeURIComponent(emailToCheck)}&doc_type=${docType}`);
      const { draft } = await res.json();
      return draft;
    } catch (e) {
      return null;
    }
  }, [docType]);

  return { saveDraft, markCompleted, checkForDraft };
}
