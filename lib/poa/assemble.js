// lib/poa/assemble.js
import { POA_CLAUSES_CA } from "./clauses.ca";

/**
 * IMPORTANT LEGAL RULE (California):
 * - The official legal document is generated in English only.
 * - Any Spanish version provided is an informational courtesy copy ONLY.
 *   In case of conflict, the English version controls.
 */

const SPANISH_BONUS_DISCLAIMER = [
  "AVISO IMPORTANTE (TRADUCCIÓN INFORMATIVA):",
  "Esta traducción al español se proporciona únicamente como cortesía informativa.",
  "La versión legal oficial de este documento es la versión en inglés.",
  "En caso de conflicto o discrepancia, prevalecerá la versión en inglés."
].join("\n");

export function assemblePOA(flags, options = {}) {
  const {
    includeSpanishBonus = false,
    // Optional: provide your own translator function later (AI or template-based).
    // It must accept an English string and return a Spanish string.
    translateToSpanish = null
  } = options;

  const included = POA_CLAUSES_CA.filter((c) =>
    c.requires.every((k) => flags[k] === true)
  );

  // OFFICIAL ENGLISH OUTPUT (source of truth)
  const englishText = included.map((c) => `${c.title}\n${c.text}`).join("\n\n");

  const result = {
    includedTitles: included.map((c) => c.title),
    text: englishText, // keep existing field name for compatibility
    official: {
      language: "en",
      text: englishText
    }
  };

  // OPTIONAL: Spanish courtesy copy (bonus)
  if (includeSpanishBonus) {
    let translatedBody = null;

    // If no translator is provided, we still return a safe placeholder
    // so your UI/export layer can handle it gracefully.
    if (typeof translateToSpanish === "function") {
      try {
        translatedBody = translateToSpanish(englishText);
      } catch (e) {
        translatedBody = null;
      }
    }

    result.bonusSpanish = {
      language: "es",
      disclaimer: SPANISH_BONUS_DISCLAIMER,
      // If translatedBody is null, the export layer can decide what to do:
      // - show disclaimer only, or
      // - hide the Spanish copy option until translator is configured
      text: translatedBody,
      // Convenience combined block for PDF export if you want it:
      combined:
        (translatedBody
          ? `${SPANISH_BONUS_DISCLAIMER}\n\n${translatedBody}`
          : `${SPANISH_BONUS_DISCLAIMER}\n\n[Traducción pendiente de configuración]`)
    };
  }

  return result;
}

