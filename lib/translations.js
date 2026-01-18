// lib/translations.js

export const translations = {
  en: {
    pageTitle: "California Power of Attorney Intake",
    livePreview: "Live Clause Preview",

    progress: "Progress",
    currentQuestion: "Current question:",
    status: "Status:",
    inProgress: "In progress",
    complete: "Complete",

    includedClauses: "Included Clauses",
    noClausesSelected: "No clauses selected yet.",

    debugFlags: "Debug: Flags",
    debugIntakeData: "Debug: Intake Data",

    send: "Send",
    reset: "Reset",

    greeting:
      "Hello! I'm your AI legal assistant. I'll help you collect the information needed for a California Power of Attorney.",
    intakeComplete: "All set. Intake is complete.",
    reviewClauses: "Review the clause preview panel for selected clauses.",

    inputPlaceholder: "Type your answer…",
    intakeCompleteMsg: "Intake complete.",

    // Toggle
    switchToSpanish: "Español",
    switchToEnglish: "English",

    // Bot helper lines
    optionsHeader: "Options:",
    booleanHint: "Please answer: Yes or No.",
    invalidBoolean: "Invalid response. Please answer Yes or No.",
    invalidSelect: "Invalid response. Please type one of the option values (or the option label).",
    invalidText: "Invalid response. Please enter a valid value.",
    savedPrefix: "Saved:",
    noQuestionsConfigured: "No intake questions are configured.",
    intakeIsComplete: "Intake is complete."
  },

  es: {
    pageTitle: "Chat de Poder Notarial (California)",
    livePreview: "Vista Previa de Cláusulas",

    progress: "Progreso",
    currentQuestion: "Pregunta actual:",
    status: "Estado:",
    inProgress: "En progreso",
    complete: "Completo",

    includedClauses: "Cláusulas Incluidas",
    noClausesSelected: "Aún no se han seleccionado cláusulas.",

    debugFlags: "Depurar: Indicadores",
    debugIntakeData: "Depurar: Datos de Entrada",

    send: "Enviar",
    reset: "Reiniciar",

    greeting:
      "¡Hola! Soy su asistente legal. Le ayudaré a recopilar la información necesaria para un Poder Notarial en California.",
    intakeComplete: "Todo listo. La entrevista está completa.",
    reviewClauses: "Revise el panel de vista previa para ver las cláusulas seleccionadas.",

    inputPlaceholder: "Escriba su respuesta…",
    intakeCompleteMsg: "Entrevista completa.",

    // Toggle
    switchToSpanish: "Español",
    switchToEnglish: "English",

    // Bot helper lines
    optionsHeader: "Opciones:",
    booleanHint: "Por favor responda: Sí o No.",
    invalidBoolean: "Respuesta inválida. Por favor responda Sí o No.",
    invalidSelect: "Respuesta inválida. Escriba uno de los valores (o el texto de la opción).",
    invalidText: "Respuesta inválida. Ingrese un valor válido.",
    savedPrefix: "Guardado:",
    noQuestionsConfigured: "No hay preguntas configuradas.",
    intakeIsComplete: "La entrevista está completa."
  }
};

/**
 * Question translations.
 * Each question id maps to:
 * { label: string, question: string, options?: { [value]: localizedLabel } }
 */
export const questionTranslations = {
  en: {
    principal_name: {
      label: "Principal's Name",
      question:
        "What is the full legal name of the person granting the power (the Principal)?"
    },
    principal_address: {
      label: "Principal's Address",
      question: "What is the Principal's complete address in California?"
    },
    agent_name: {
      label: "Agent's Name",
      question:
        "Who would you like to appoint as the Agent (Attorney-in-Fact)? Provide their full legal name."
    },
    agent_address: {
      label: "Agent's Address",
      question: "What is the Agent's complete address?"
    },
    agent_relationship: {
      label: "Agent's Relationship",
      question: "What is the Agent's relationship to the Principal?"
    },
    successor_agent: {
      label: "Successor Agent",
      question:
        "Would you like to name a Successor Agent (if the first agent cannot serve)? If yes, provide their full name. If no, type 'none'."
    },
    durable: {
      label: "Durable Power of Attorney",
      question:
        "Should this Power of Attorney remain effective if the principal becomes incapacitated? (Yes/No)"
    },
    effective_when: {
      label: "When Effective",
      question: "When should the Power of Attorney become effective?",
      options: {
        immediately: "Immediately (upon signing)",
        upon_incapacity: "Only upon incapacity (springing)"
      }
    },
    powers_real_estate: {
      label: "Real Estate Powers",
      question: "Should the agent have authority over real estate transactions? (Yes/No)"
    },
    powers_banking: {
      label: "Banking Powers",
      question: "Should the agent have authority over banking transactions? (Yes/No)"
    },
    powers_stocks: {
      label: "Stock and Bond Powers",
      question: "Should the agent have authority over stock and bond transactions? (Yes/No)"
    },
    powers_business: {
      label: "Business Powers",
      question: "Should the agent have authority over business operating transactions? (Yes/No)"
    },
    powers_insurance: {
      label: "Insurance Powers",
      question: "Should the agent have authority over insurance and annuity transactions? (Yes/No)"
    },
    powers_litigation: {
      label: "Claims and Litigation Powers",
      question: "Should the agent have authority over claims and litigation? (Yes/No)"
    },
    powers_tax: {
      label: "Tax Powers",
      question: "Should the agent have authority to handle tax matters? (Yes/No)"
    },
    hot_gifts: {
      label: "Gifting Authority (Hot Power)",
      question: "Should the agent have authority to make gifts on behalf of the principal? (Yes/No)"
    },
    special_instructions: {
      label: "Special Instructions",
      question:
        "Are there any special instructions, limitations, or conditions you want to include? If none, type 'none'."
    },
    record_for_real_estate: {
      label: "Recording (if Real Estate)",
      question:
        "If real estate powers are granted, do you intend to record the POA for real estate use? (Yes/No)"
    }
  },

  es: {
    principal_name: {
      label: "Nombre del Poderdante",
      question:
        "¿Cuál es el nombre legal completo de la persona que otorga el poder (el Poderdante)?"
    },
    principal_address: {
      label: "Dirección del Poderdante",
      question: "¿Cuál es la dirección completa del Poderdante en California?"
    },
    agent_name: {
      label: "Nombre del Apoderado",
      question:
        "¿A quién le gustaría nombrar como Agente (Apoderado)? Proporcione su nombre legal completo."
    },
    agent_address: {
      label: "Dirección del Apoderado",
      question: "¿Cuál es la dirección completa del Apoderado?"
    },
    agent_relationship: {
      label: "Relación con el Poderdante",
      question: "¿Cuál es la relación del Apoderado con el Poderdante?"
    },
    successor_agent: {
      label: "Apoderado Sucesor",
      question:
        "¿Desea nombrar un Apoderado Sucesor (si el primer apoderado no puede servir)? Si sí, proporcione su nombre completo. Si no, escriba 'ninguno'."
    },
    durable: {
      label: "Poder Duradero",
      question:
        "¿Debe este Poder Notarial permanecer vigente si el poderdante queda incapacitado? (Sí/No)"
    },
    effective_when: {
      label: "Cuándo Entra en Vigor",
      question: "¿Cuándo debe entrar en vigor el Poder Notarial?",
      options: {
        immediately: "Inmediatamente (al firmar)",
        upon_incapacity: "Solo ante incapacidad (contingente)"
      }
    },
    powers_real_estate: {
      label: "Poderes de Bienes Raíces",
      question: "¿Debe el apoderado tener autoridad sobre transacciones de bienes raíces? (Sí/No)"
    },
    powers_banking: {
      label: "Poderes Bancarios",
      question: "¿Debe el apoderado tener autoridad sobre transacciones bancarias? (Sí/No)"
    },
    powers_stocks: {
      label: "Acciones y Bonos",
      question: "¿Debe el apoderado tener autoridad sobre transacciones de acciones y bonos? (Sí/No)"
    },
    powers_business: {
      label: "Operaciones Comerciales",
      question: "¿Debe el apoderado tener autoridad sobre operaciones comerciales? (Sí/No)"
    },
    powers_insurance: {
      label: "Seguros y Anualidades",
      question: "¿Debe el apoderado tener autoridad sobre transacciones de seguros y anualidades? (Sí/No)"
    },
    powers_litigation: {
      label: "Reclamos y Litigios",
      question: "¿Debe el apoderado tener autoridad sobre reclamos y litigios? (Sí/No)"
    },
    powers_tax: {
      label: "Asuntos Fiscales",
      question: "¿Debe el apoderado tener autoridad para manejar asuntos fiscales? (Sí/No)"
    },
    hot_gifts: {
      label: "Autoridad para Regalos (Poder Especial)",
      question: "¿Debe el apoderado tener autoridad para hacer regalos en nombre del poderdante? (Sí/No)"
    },
    special_instructions: {
      label: "Instrucciones Especiales",
      question:
        "¿Hay alguna instrucción especial, limitación o condición que desee incluir? Si no, escriba 'ninguno'."
    },
    record_for_real_estate: {
      label: "Registro (si hay Bienes Raíces)",
      question:
        "Si se otorgan poderes sobre bienes raíces, ¿pretende registrar el Poder Notarial para uso inmobiliario? (Sí/No)"
    }
  }
};
