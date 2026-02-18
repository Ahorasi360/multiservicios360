"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);
const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const MailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const ArrowLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>);
const ShieldIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);

const TRANSLATIONS = {
  es: {
    title: 'Política de Privacidad',
    lastUpdated: 'Última actualización',
    backHome: 'Volver al Inicio',
    sections: {
      intro: {
        title: '1. Introducción',
        content: `Multi Servicios 360 ("nosotros", "nuestro" o la "Compañía") está comprometido con la protección de su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando utiliza nuestro sitio web multiservicios360.net (el "Sitio") y nuestros servicios de preparación de documentos legales.

Al usar nuestros servicios, usted acepta las prácticas descritas en esta Política de Privacidad. Si no está de acuerdo con esta política, por favor no utilice nuestros servicios.`
      },
      infoCollect: {
        title: '2. Información que Recopilamos',
        content: `Recopilamos información que usted nos proporciona directamente cuando usa nuestros servicios:

INFORMACIÓN PERSONAL:
• Nombre completo
• Dirección postal
• Dirección de correo electrónico
• Número de teléfono
• Fecha de nacimiento

INFORMACIÓN DE DOCUMENTOS DE IDENTIDAD:
• Información de identificación oficial para propósitos de notarización
• Número de licencia de conducir o identificación estatal (cuando sea necesario)

INFORMACIÓN PARA DOCUMENTOS LEGALES:
• Detalles sobre poderdantes (principals)
• Información de apoderados (agents)
• Poderes y autoridades otorgadas
• Información de otras partes nombradas en sus documentos
• Instrucciones especiales y preferencias

INFORMACIÓN DE PAGO:
• Detalles de tarjeta de crédito/débito (procesados de forma segura por Stripe)
• Historial de transacciones

INFORMACIÓN RECOPILADA AUTOMÁTICAMENTE:
• Dirección IP
• Tipo de navegador y dispositivo
• Sistema operativo
• Páginas visitadas y tiempo en el sitio
• Sitios web de referencia
• Datos de ubicación general`
      },
      howWeUse: {
        title: '3. Cómo Usamos Su Información',
        content: `Usamos su información para los siguientes propósitos:

PRESTACIÓN DE SERVICIOS:
• Preparar y generar sus documentos legales
• Procesar sus pagos de forma segura
• Comunicarnos con usted sobre sus pedidos
• Proporcionar soporte al cliente
• Enviar confirmaciones y actualizaciones de pedidos

MEJORA DE SERVICIOS:
• Analizar cómo se utilizan nuestros servicios
• Mejorar nuestro sitio web y experiencia del usuario
• Desarrollar nuevas funciones y servicios

COMUNICACIONES DE MARKETING:
• Enviar información sobre nuevos servicios (con su consentimiento)
• Enviar ofertas promocionales (puede optar por no recibirlas)

CUMPLIMIENTO LEGAL Y SEGURIDAD:
• Cumplir con obligaciones legales
• Detectar y prevenir fraude
• Proteger nuestros derechos legales

NO VENDEMOS SU INFORMACIÓN PERSONAL A TERCEROS.`
      },
      ccpa: {
        title: '4. Derechos de Privacidad de California (CCPA)',
        content: `Si usted es residente de California, tiene los siguientes derechos bajo la Ley de Privacidad del Consumidor de California (CCPA):

DERECHO A SABER:
• Puede solicitar información sobre las categorías de información personal que recopilamos.
• Puede solicitar las piezas específicas de información personal que tenemos sobre usted.
• Puede solicitar información sobre cómo usamos y compartimos su información.

DERECHO A ELIMINAR:
• Puede solicitar que eliminemos su información personal.
• Sujeto a ciertas excepciones legales (como requisitos de retención de registros).

DERECHO A OPTAR POR NO PARTICIPAR:
• Puede optar por no participar en la "venta" de su información personal.
• NOTA: Multi Servicios 360 NO vende información personal.

DERECHO A NO DISCRIMINACIÓN:
• No lo discriminaremos por ejercer sus derechos de CCPA.
• Recibirá el mismo servicio y precios independientemente de sus elecciones de privacidad.

CÓMO EJERCER SUS DERECHOS:
• Email: privacy@multiservicios360.net
• Teléfono: 855-246-7274
• Responderemos a su solicitud dentro de 45 días.`
      },
      dataSharing: {
        title: '5. Compartir Información con Terceros',
        content: `Podemos compartir su información en las siguientes circunstancias:

PROVEEDORES DE SERVICIOS:
• Stripe: Procesamiento de pagos
• Supabase: Almacenamiento seguro de datos
• Vercel: Alojamiento del sitio web
• Servicios de correo electrónico para comunicaciones

ABOGADOS INDEPENDIENTES:
• Si elige el servicio opcional de revisión de abogados
• Solo con su consentimiento expreso
• Los abogados están sujetos a obligaciones de confidencialidad

NOTARIOS:
• Si elige servicios de coordinación notarial
• Solo la información necesaria para completar la notarización

REQUISITOS LEGALES:
• Para cumplir con órdenes judiciales o citaciones
• Para cumplir con requisitos legales aplicables
• Para proteger nuestros derechos legales
• En caso de investigación de fraude

NUNCA vendemos, alquilamos ni intercambiamos su información personal con terceros para fines de marketing.`
      },
      dataSecurity: {
        title: '6. Seguridad de Datos',
        content: `Implementamos medidas técnicas y organizacionales para proteger su información:

MEDIDAS TÉCNICAS:
• Encriptación SSL/TLS para todos los datos en tránsito
• Encriptación de datos en reposo para información sensible
• Firewalls y sistemas de detección de intrusiones
• Copias de seguridad regulares en ubicaciones seguras

MEDIDAS ORGANIZACIONALES:
• Acceso limitado a información personal (solo personal autorizado)
• Capacitación de empleados en seguridad de datos
• Políticas de contraseñas seguras
• Auditorías de seguridad periódicas

PROCESAMIENTO DE PAGOS:
• Procesamiento compatible con PCI-DSS a través de Stripe
• Nunca almacenamos números completos de tarjetas de crédito
• Tokenización de datos de pago

ADVERTENCIA:
Ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro. Aunque nos esforzamos por proteger su información, no podemos garantizar seguridad absoluta.`
      },
      dataRetention: {
        title: '7. Retención de Datos',
        content: `Retenemos su información personal por el tiempo necesario para:

PERÍODOS DE RETENCIÓN:
• Documentos legales preparados: 7 años (requisito legal)
• Registros financieros: 7 años (requisito fiscal)
• Comunicaciones de soporte: 3 años
• Datos de análisis del sitio: 2 años

ELIMINACIÓN DE DATOS:
• Puede solicitar la eliminación de sus datos en cualquier momento.
• Eliminaremos los datos que no estemos legalmente obligados a retener.
• La eliminación se completará dentro de 30 días de la solicitud verificada.

EXCEPCIONES:
• Podemos retener cierta información para cumplir con obligaciones legales.
• Información necesaria para resolver disputas.
• Información requerida para prevenir fraude.`
      },
      cookies: {
        title: '8. Cookies y Tecnologías de Seguimiento',
        content: `Usamos cookies y tecnologías similares para:

COOKIES ESENCIALES:
• Mantener su sesión activa
• Recordar su preferencia de idioma
• Proporcionar funcionalidad básica del sitio

COOKIES DE RENDIMIENTO:
• Analizar cómo se usa nuestro sitio
• Identificar problemas técnicos
• Mejorar el rendimiento del sitio

COOKIES DE FUNCIONALIDAD:
• Recordar sus preferencias
• Personalizar su experiencia

CONTROL DE COOKIES:
• Puede controlar las cookies a través de la configuración de su navegador.
• Puede eliminar las cookies existentes en cualquier momento.
• Bloquear cookies puede afectar la funcionalidad del sitio.

NO usamos cookies para publicidad dirigida ni compartimos datos de cookies con anunciantes.`
      },
      childrenPrivacy: {
        title: '9. Privacidad de Menores',
        content: `Nuestros servicios NO están dirigidos a personas menores de 18 años.

• No recopilamos intencionalmente información de menores de 18 años.
• Si descubrimos que hemos recopilado información de un menor, la eliminaremos inmediatamente.
• Si usted es padre o tutor y cree que su hijo nos ha proporcionado información, contáctenos de inmediato.

CONTACTO PARA ASUNTOS DE MENORES:
Email: privacy@multiservicios360.net
Teléfono: 855-246-7274`
      },
      thirdPartyLinks: {
        title: '10. Enlaces a Sitios de Terceros',
        content: `Nuestro sitio web puede contener enlaces a sitios web de terceros.

• No somos responsables de las prácticas de privacidad de otros sitios.
• Le recomendamos leer las políticas de privacidad de cualquier sitio que visite.
• Los enlaces a terceros no implican nuestro respaldo de esos sitios.

SERVICIOS DE TERCEROS QUE USAMOS:
• Stripe (stripe.com) - Procesamiento de pagos
• Supabase (supabase.com) - Base de datos
• Vercel (vercel.com) - Alojamiento web

Le recomendamos revisar las políticas de privacidad de estos servicios.`
      },
      internationalTransfers: {
        title: '11. Transferencias Internacionales de Datos',
        content: `Sus datos pueden ser procesados en servidores ubicados fuera de su país de residencia.

• Nuestros servidores principales están ubicados en Estados Unidos.
• Tomamos medidas para garantizar que sus datos estén protegidos según las leyes aplicables.
• Al usar nuestros servicios, consiente la transferencia de datos a Estados Unidos.`
      },
      doNotTrack: {
        title: '12. Señales de "No Rastrear"',
        content: `Algunos navegadores ofrecen una función de "No Rastrear" (DNT).

• Actualmente, no hay un estándar uniforme para responder a señales DNT.
• Por lo tanto, nuestro sitio no responde a señales DNT de navegadores.
• Sin embargo, puede controlar el seguimiento a través de la configuración de cookies de su navegador.`
      },
      policyChanges: {
        title: '13. Cambios a Esta Política',
        content: `Podemos actualizar esta Política de Privacidad periódicamente.

• Los cambios entrarán en vigencia al publicarse en esta página.
• Actualizaremos la fecha de "Última actualización" en la parte superior.
• Para cambios materiales, le notificaremos por email o aviso destacado en el sitio.
• Su uso continuado después de los cambios constituye aceptación de la política actualizada.

Le recomendamos revisar esta política periódicamente.`
      },
      yourChoices: {
        title: '14. Sus Opciones y Control',
        content: `Usted tiene control sobre su información:

ACTUALIZAR INFORMACIÓN:
• Puede actualizar su información de cuenta contactándonos.
• Email: info@multiservicios360.net

COMUNICACIONES DE MARKETING:
• Puede optar por no recibir emails promocionales usando el enlace "cancelar suscripción".
• Seguirá recibiendo comunicaciones transaccionales (confirmaciones de pedidos, etc.).

ACCESO A SUS DATOS:
• Puede solicitar una copia de sus datos personales.
• Responderemos dentro de 45 días.

ELIMINAR SU CUENTA:
• Puede solicitar la eliminación de su cuenta y datos.
• Sujeto a requisitos legales de retención.`
      },
      contact: {
        title: '15. Información de Contacto',
        content: `Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos de privacidad, contáctenos:

Multi Servicios 360
Beverly Hills, CA

CONTACTO DE PRIVACIDAD:
Email: privacy@multiservicios360.net
Teléfono: 855.246.7274
Horario: Lunes - Viernes, 9am - 6pm (Hora del Pacífico)

CONTACTO GENERAL:
Email: info@multiservicios360.net
Sitio web: www.multiservicios360.net

Responderemos a todas las consultas de privacidad dentro de 45 días.`
      }
    }
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated',
    backHome: 'Back to Home',
    sections: {
      intro: {
        title: '1. Introduction',
        content: `Multi Servicios 360 ("we", "our" or the "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website multiservicios360.net (the "Site") and our legal document preparation services.

By using our services, you agree to the practices described in this Privacy Policy. If you do not agree with this policy, please do not use our services.`
      },
      infoCollect: {
        title: '2. Information We Collect',
        content: `We collect information that you provide directly to us when using our services:

PERSONAL INFORMATION:
• Full name
• Mailing address
• Email address
• Phone number
• Date of birth

IDENTITY DOCUMENT INFORMATION:
• Official identification information for notarization purposes
• Driver's license or state ID number (when necessary)

LEGAL DOCUMENT INFORMATION:
• Details about principals
• Agent information
• Powers and authorities granted
• Information about other parties named in your documents
• Special instructions and preferences

PAYMENT INFORMATION:
• Credit/debit card details (securely processed by Stripe)
• Transaction history

AUTOMATICALLY COLLECTED INFORMATION:
• IP address
• Browser and device type
• Operating system
• Pages visited and time on site
• Referring websites
• General location data`
      },
      howWeUse: {
        title: '3. How We Use Your Information',
        content: `We use your information for the following purposes:

SERVICE DELIVERY:
• Prepare and generate your legal documents
• Process your payments securely
• Communicate with you about your orders
• Provide customer support
• Send order confirmations and updates

SERVICE IMPROVEMENT:
• Analyze how our services are used
• Improve our website and user experience
• Develop new features and services

MARKETING COMMUNICATIONS:
• Send information about new services (with your consent)
• Send promotional offers (you can opt out)

LEGAL COMPLIANCE AND SECURITY:
• Comply with legal obligations
• Detect and prevent fraud
• Protect our legal rights

WE DO NOT SELL YOUR PERSONAL INFORMATION TO THIRD PARTIES.`
      },
      ccpa: {
        title: '4. California Privacy Rights (CCPA)',
        content: `If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA):

RIGHT TO KNOW:
• You can request information about the categories of personal information we collect.
• You can request the specific pieces of personal information we have about you.
• You can request information about how we use and share your information.

RIGHT TO DELETE:
• You can request that we delete your personal information.
• Subject to certain legal exceptions (such as record retention requirements).

RIGHT TO OPT-OUT:
• You can opt out of the "sale" of your personal information.
• NOTE: Multi Servicios 360 does NOT sell personal information.

RIGHT TO NON-DISCRIMINATION:
• We will not discriminate against you for exercising your CCPA rights.
• You will receive the same service and pricing regardless of your privacy choices.

HOW TO EXERCISE YOUR RIGHTS:
• Email: privacy@multiservicios360.net
• Phone: 855-246-7274
• We will respond to your request within 45 days.`
      },
      dataSharing: {
        title: '5. Sharing Information with Third Parties',
        content: `We may share your information in the following circumstances:

SERVICE PROVIDERS:
• Stripe: Payment processing
• Supabase: Secure data storage
• Vercel: Website hosting
• Email services for communications

INDEPENDENT ATTORNEYS:
• If you choose the optional attorney review service
• Only with your express consent
• Attorneys are subject to confidentiality obligations

NOTARIES:
• If you choose notary coordination services
• Only information necessary to complete notarization

LEGAL REQUIREMENTS:
• To comply with court orders or subpoenas
• To comply with applicable legal requirements
• To protect our legal rights
• In case of fraud investigation

We NEVER sell, rent, or trade your personal information to third parties for marketing purposes.`
      },
      dataSecurity: {
        title: '6. Data Security',
        content: `We implement technical and organizational measures to protect your information:

TECHNICAL MEASURES:
• SSL/TLS encryption for all data in transit
• Encryption at rest for sensitive information
• Firewalls and intrusion detection systems
• Regular backups in secure locations

ORGANIZATIONAL MEASURES:
• Limited access to personal information (authorized personnel only)
• Employee training on data security
• Strong password policies
• Periodic security audits

PAYMENT PROCESSING:
• PCI-DSS compliant processing through Stripe
• We never store complete credit card numbers
• Payment data tokenization

WARNING:
No method of Internet transmission or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`
      },
      dataRetention: {
        title: '7. Data Retention',
        content: `We retain your personal information for the time necessary to:

RETENTION PERIODS:
• Prepared legal documents: 7 years (legal requirement)
• Financial records: 7 years (tax requirement)
• Support communications: 3 years
• Site analytics data: 2 years

DATA DELETION:
• You can request deletion of your data at any time.
• We will delete data we are not legally required to retain.
• Deletion will be completed within 30 days of verified request.

EXCEPTIONS:
• We may retain certain information to comply with legal obligations.
• Information necessary to resolve disputes.
• Information required to prevent fraud.`
      },
      cookies: {
        title: '8. Cookies and Tracking Technologies',
        content: `We use cookies and similar technologies for:

ESSENTIAL COOKIES:
• Keep your session active
• Remember your language preference
• Provide basic site functionality

PERFORMANCE COOKIES:
• Analyze how our site is used
• Identify technical issues
• Improve site performance

FUNCTIONALITY COOKIES:
• Remember your preferences
• Personalize your experience

COOKIE CONTROL:
• You can control cookies through your browser settings.
• You can delete existing cookies at any time.
• Blocking cookies may affect site functionality.

We do NOT use cookies for targeted advertising or share cookie data with advertisers.`
      },
      childrenPrivacy: {
        title: '9. Children\'s Privacy',
        content: `Our services are NOT directed to persons under 18 years of age.

• We do not intentionally collect information from minors under 18.
• If we discover we have collected information from a minor, we will delete it immediately.
• If you are a parent or guardian and believe your child has provided us with information, contact us immediately.

CONTACT FOR MINOR-RELATED MATTERS:
Email: privacy@multiservicios360.net
Phone: 855-246-7274`
      },
      thirdPartyLinks: {
        title: '10. Links to Third-Party Sites',
        content: `Our website may contain links to third-party websites.

• We are not responsible for the privacy practices of other sites.
• We recommend reading the privacy policies of any site you visit.
• Links to third parties do not imply our endorsement of those sites.

THIRD-PARTY SERVICES WE USE:
• Stripe (stripe.com) - Payment processing
• Supabase (supabase.com) - Database
• Vercel (vercel.com) - Web hosting

We recommend reviewing the privacy policies of these services.`
      },
      internationalTransfers: {
        title: '11. International Data Transfers',
        content: `Your data may be processed on servers located outside your country of residence.

• Our main servers are located in the United States.
• We take steps to ensure your data is protected under applicable laws.
• By using our services, you consent to data transfer to the United States.`
      },
      doNotTrack: {
        title: '12. "Do Not Track" Signals',
        content: `Some browsers offer a "Do Not Track" (DNT) feature.

• Currently, there is no uniform standard for responding to DNT signals.
• Therefore, our site does not respond to browser DNT signals.
• However, you can control tracking through your browser's cookie settings.`
      },
      policyChanges: {
        title: '13. Changes to This Policy',
        content: `We may update this Privacy Policy periodically.

• Changes will take effect upon posting on this page.
• We will update the "Last updated" date at the top.
• For material changes, we will notify you by email or prominent notice on the site.
• Your continued use after changes constitutes acceptance of the updated policy.

We recommend reviewing this policy periodically.`
      },
      yourChoices: {
        title: '14. Your Choices and Control',
        content: `You have control over your information:

UPDATE INFORMATION:
• You can update your account information by contacting us.
• Email: info@multiservicios360.net

MARKETING COMMUNICATIONS:
• You can opt out of promotional emails using the "unsubscribe" link.
• You will continue to receive transactional communications (order confirmations, etc.).

ACCESS YOUR DATA:
• You can request a copy of your personal data.
• We will respond within 45 days.

DELETE YOUR ACCOUNT:
• You can request deletion of your account and data.
• Subject to legal retention requirements.`
      },
      contact: {
        title: '15. Contact Information',
        content: `If you have questions about this Privacy Policy or wish to exercise your privacy rights, contact us:

Multi Servicios 360
Beverly Hills, CA

PRIVACY CONTACT:
Email: privacy@multiservicios360.net
Phone: 855.246.7274
Hours: Monday - Friday, 9am - 6pm (Pacific Time)

GENERAL CONTACT:
Email: info@multiservicios360.net
Website: www.multiservicios360.net

We will respond to all privacy inquiries within 45 days.`
      }
    }
  }
};

export default function PrivacyPolicyPage() {
  const [language, setLanguage] = useState('es');
  const t = TRANSLATIONS[language];

  const sectionOrder = [
    'intro', 'infoCollect', 'howWeUse', 'ccpa', 'dataSharing',
    'dataSecurity', 'dataRetention', 'cookies', 'childrenPrivacy', 
    'thirdPartyLinks', 'internationalTransfers', 'doNotTrack',
    'policyChanges', 'yourChoices', 'contact'
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Header */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>M360</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: '#1E3A8A' }}>Multi Servicios 360</div>
              <div style={{ fontSize: '9px', color: '#64748B', letterSpacing: '0.5px' }}>DOCUMENT PREPARATION</div>
            </div>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/#services" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{language === 'es' ? 'Servicios' : 'Services'}</Link>
            <Link href="/por-que-nosotros" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{language === 'es' ? '¿Por Qué Nosotros?' : 'Why Us?'}</Link>
            <Link href="/nuestra-historia" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{language === 'es' ? 'Nuestra Historia' : 'Our Story'}</Link>
            <Link href="/blog" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>Blog</Link>
            <Link href="/contacto" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>{language === 'es' ? 'Contacto' : 'Contact'}</Link>
            <button onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px', color: '#374151' }}>
              <GlobeIcon /> {language === 'es' ? 'EN' : 'ES'}
            </button>
            <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px' }}>
              <PhoneIcon /> 855.246.7274
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px 80px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3B82F6', textDecoration: 'none', fontWeight: '500', fontSize: '14px', marginBottom: '24px' }}>
          <ArrowLeftIcon /> {t.backHome}
        </Link>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#DBEAFE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A' }}>
              <ShieldIcon />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1E3A8A', margin: 0 }}>{t.title}</h1>
          </div>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '32px' }}>{t.lastUpdated}: January 2026</p>

          {/* Privacy Commitment Box */}
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
            <p style={{ color: '#1E40AF', fontWeight: '600', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
              {language === 'es' 
                ? '🔒 SU PRIVACIDAD ES IMPORTANTE: Multi Servicios 360 está comprometido con la protección de su información personal. NO vendemos su información a terceros. Cumplimos con la Ley de Privacidad del Consumidor de California (CCPA).'
                : '🔒 YOUR PRIVACY MATTERS: Multi Servicios 360 is committed to protecting your personal information. We do NOT sell your information to third parties. We comply with the California Consumer Privacy Act (CCPA).'}
            </p>
          </div>

          {/* Table of Contents */}
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1F2937', marginBottom: '12px' }}>
              {language === 'es' ? 'Índice' : 'Table of Contents'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {sectionOrder.map((key, index) => (
                <a 
                  key={key} 
                  href={`#section-${key}`} 
                  style={{ color: '#3B82F6', textDecoration: 'none', fontSize: '13px', lineHeight: '1.8' }}
                >
                  {index + 1}. {t.sections[key].title.replace(/^\d+\.\s*/, '')}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          {sectionOrder.map((key) => (
            <section key={key} id={`section-${key}`} style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                {t.sections[key].title}
              </h2>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {t.sections[key].content}
              </div>
            </section>
          ))}

          {/* CCPA Rights Summary Box */}
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '20px', marginTop: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#166534', marginBottom: '12px' }}>
              {language === 'es' ? '✅ Resumen de Sus Derechos (CCPA)' : '✅ Summary of Your Rights (CCPA)'}
            </h3>
            <ul style={{ color: '#15803D', fontSize: '14px', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>{language === 'es' ? 'Derecho a saber qué información recopilamos' : 'Right to know what information we collect'}</li>
              <li>{language === 'es' ? 'Derecho a eliminar su información' : 'Right to delete your information'}</li>
              <li>{language === 'es' ? 'Derecho a optar por no participar en ventas (no vendemos datos)' : 'Right to opt-out of sales (we don\'t sell data)'}</li>
              <li>{language === 'es' ? 'Derecho a no ser discriminado' : 'Right to non-discrimination'}</li>
            </ul>
          </div>
        </div>

        {/* Footer Contact */}
        <div style={{ textAlign: 'center', marginTop: '40px', padding: '24px', backgroundColor: 'white', borderRadius: '12px' }}>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '12px' }}>
            {language === 'es' ? '¿Preguntas sobre privacidad?' : 'Privacy questions?'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E3A8A', textDecoration: 'none', fontWeight: '600' }}>
              <PhoneIcon /> 855.246.7274
            </a>
            <a href="mailto:privacy@multiservicios360.net" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E3A8A', textDecoration: 'none', fontWeight: '600' }}>
              <MailIcon /> privacy@multiservicios360.net
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F172A', color: 'white', padding: '24px 16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>
            {language === 'es' ? 'Inicio' : 'Home'}
          </Link>
          <Link href="/blog" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>
            Blog
          </Link>
          <Link href="/terms" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>
            {language === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
          </Link>
          <Link href="/privacy" style={{ color: '#3B82F6', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
            {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
          </Link>
          <Link href="/accessibility" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '13px' }}>
            {language === 'es' ? 'Accesibilidad' : 'Accessibility'}
          </Link>
        </div>
        <p style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>© 2026 Multi Servicios 360. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
      </footer>
    </div>
  );
}