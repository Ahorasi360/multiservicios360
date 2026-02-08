// app/vault/vault-translations.js
export const vaultTranslations = {
  en: {
    // Landing page
    heroTitle: 'Your Document Vault',
    heroSubtitle: 'Access your completed legal documents securely. Enter your access code below.',
    codeLabel: 'Access Code',
    codePlaceholder: 'Enter your access code',
    submitButton: 'Access My Documents',
    directLinkHint: 'You can also use the direct link from your email.',
    
    // Vault view
    vaultTitle: 'Document Vault',
    welcomeBack: 'Welcome',
    matterLabel: 'Matter',
    documentsLabel: 'Your Documents',
    downloadButton: 'Download',
    downloadAllButton: 'Download All',
    generatedOn: 'Generated',
    uploadedOn: 'Uploaded',
    fileSize: 'Size',
    expiresOn: 'Access expires',
    expirationWarning: 'Your vault access expires soon. Download your documents now.',
    expiredMessage: 'This access code has expired. Please contact us for a new link.',
    invalidToken: 'Invalid access code. Please check your code and try again.',
    noDocuments: 'No documents available yet. Your documents are being prepared.',
    
    // Document types
    docTypes: {
      poa_general: 'General Power of Attorney',
      poa_limited: 'Limited Power of Attorney',
      living_trust: 'Living Trust',
      operating_agreement: 'Operating Agreement',
      articles_of_org: 'Articles of Organization',
      ein_letter: 'EIN Confirmation Letter',
      sos_filing: 'Secretary of State Filing',
      amendment: 'Amendment',
      certificate: 'Certificate',
      other: 'Document',
    },
    
    // Languages
    langLabels: {
      en: 'English',
      es: 'Spanish',
    },
    
    // Footer / support
    supportText: 'Need help? Contact us at',
    supportEmail: 'support@multiservicios360.net',
    poweredBy: 'Multi Servicios 360 — Software Platform for Legal Document Preparation',
    disclaimer: 'Multi Servicios 360 is a software platform, not a law firm. We do not provide legal advice.',
    
    // Loading / errors
    loading: 'Loading your documents...',
    error: 'Something went wrong. Please try again.',
    rateLimited: 'Too many attempts. Please wait a moment and try again.',
  },
  
  es: {
    heroTitle: 'Su Bóveda de Documentos',
    heroSubtitle: 'Acceda a sus documentos legales completados de forma segura. Ingrese su código de acceso abajo.',
    codeLabel: 'Código de Acceso',
    codePlaceholder: 'Ingrese su código de acceso',
    submitButton: 'Acceder a Mis Documentos',
    directLinkHint: 'También puede usar el enlace directo de su correo electrónico.',
    
    vaultTitle: 'Bóveda de Documentos',
    welcomeBack: 'Bienvenido/a',
    matterLabel: 'Asunto',
    documentsLabel: 'Sus Documentos',
    downloadButton: 'Descargar',
    downloadAllButton: 'Descargar Todos',
    generatedOn: 'Generado',
    uploadedOn: 'Subido',
    fileSize: 'Tamaño',
    expiresOn: 'El acceso expira',
    expirationWarning: 'Su acceso a la bóveda expira pronto. Descargue sus documentos ahora.',
    expiredMessage: 'Este código de acceso ha expirado. Contáctenos para un nuevo enlace.',
    invalidToken: 'Código de acceso inválido. Verifique su código e intente de nuevo.',
    noDocuments: 'No hay documentos disponibles todavía. Sus documentos están siendo preparados.',
    
    docTypes: {
      poa_general: 'Poder Notarial General',
      poa_limited: 'Poder Notarial Limitado',
      living_trust: 'Fideicomiso en Vida',
      operating_agreement: 'Acuerdo Operativo',
      articles_of_org: 'Artículos de Organización',
      ein_letter: 'Carta de Confirmación EIN',
      sos_filing: 'Registro ante Secretaría de Estado',
      amendment: 'Enmienda',
      certificate: 'Certificado',
      other: 'Documento',
    },
    
    langLabels: {
      en: 'Inglés',
      es: 'Español',
    },
    
    supportText: '¿Necesita ayuda? Contáctenos en',
    supportEmail: 'support@multiservicios360.net',
    poweredBy: 'Multi Servicios 360 — Plataforma de Software para Preparación de Documentos Legales',
    disclaimer: 'Multi Servicios 360 es una plataforma de software, no un bufete de abogados. No proporcionamos asesoría legal.',
    
    loading: 'Cargando sus documentos...',
    error: 'Algo salió mal. Por favor intente de nuevo.',
    rateLimited: 'Demasiados intentos. Espere un momento e intente de nuevo.',
  },
};
