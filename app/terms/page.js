"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);
const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const MailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const ArrowLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>);

const TRANSLATIONS = {
  es: {
    title: 'Términos de Servicio',
    lastUpdated: 'Última actualización',
    backHome: 'Volver al Inicio',
    sections: {
      intro: {
        title: '1. Introducción y Aceptación',
        content: `Bienvenido a Multi Servicios 360 ("nosotros", "nuestro" o la "Compañía"). Al acceder o utilizar nuestro sitio web multiservicios360.net (el "Sitio") y nuestros servicios de preparación de documentos, usted acepta estar sujeto a estos Términos de Servicio ("Términos"). Si no está de acuerdo con estos Términos, no utilice nuestros servicios.

AVISO IMPORTANTE: MULTI SERVICIOS 360 NO ES UN BUFETE DE ABOGADOS Y NO PROPORCIONA ASESORÍA LEGAL. Somos un servicio de preparación de documentos legales de autoayuda.`
      },
      notLawFirm: {
        title: '2. No Somos un Bufete de Abogados',
        content: `ESTE ES UN PUNTO CRÍTICO QUE USTED DEBE ENTENDER:

• Multi Servicios 360 NO es un bufete de abogados.
• Multi Servicios 360 NO proporciona asesoría legal.
• Multi Servicios 360 NO puede representarlo en ningún asunto legal.
• Los empleados y representantes de Multi Servicios 360 NO son abogados (a menos que se indique expresamente lo contrario en el contexto de servicios opcionales de revisión de abogados).
• Multi Servicios 360 NO puede proporcionar asesoramiento sobre qué documentos son apropiados para su situación específica.

Nosotros proporcionamos una plataforma de autoayuda para la preparación de documentos legales basada únicamente en la información que usted proporciona.`
      },
      noAttorneyClient: {
        title: '3. No Existe Relación Abogado-Cliente',
        content: `El uso de este sitio web y nuestros servicios NO crea una relación abogado-cliente entre usted y Multi Servicios 360, sus empleados, contratistas o afiliados.

• Ninguna comunicación con Multi Servicios 360 constituye asesoría legal.
• La información proporcionada en este sitio web es solo para fines informativos generales.
• No debe confiar en ninguna información de este sitio web como sustituto del asesoramiento legal profesional.
• Si necesita asesoría legal, debe consultar con un abogado licenciado.`
      },
      selfHelp: {
        title: '4. Servicio de Autoayuda',
        content: `Multi Servicios 360 proporciona un servicio de preparación de documentos legales de autoayuda. Esto significa:

• Usted proporciona toda la información necesaria para preparar sus documentos.
• Usted selecciona los poderes, opciones y disposiciones incluidos en sus documentos.
• Usted es responsable de la exactitud y completitud de la información que proporciona.
• La plataforma NO recomienda ni selecciona opciones legales por usted.
• Usted toma todas las decisiones sobre el contenido de sus documentos.

DECLARACIÓN DE CONTROL DEL USUARIO: Usted reconoce y acepta que USTED selecciona los poderes y opciones incluidos en su documento. La plataforma no recomienda ni selecciona opciones legales por usted.`
      },
      attorneyReview: {
        title: '5. Revisión de Abogados (Servicio Opcional)',
        content: `Multi Servicios 360 ofrece, como servicio OPCIONAL y SEPARADO, la posibilidad de que un abogado independiente revise sus documentos.

• La revisión de abogados es completamente opcional y no es necesaria para usar nuestros servicios básicos.
• Los abogados que proporcionan servicios de revisión son INDEPENDIENTES y NO son empleados de Multi Servicios 360.
• Los abogados son licenciados en el Estado de California.
• Si elige la revisión de abogados, se establecerá una relación separada entre usted y el abogado revisor.
• Multi Servicios 360 no controla ni supervisa el trabajo de los abogados independientes.
• Los honorarios por la revisión de abogados son separados y se indican claramente antes de la compra.

Cualquier relación abogado-cliente que resulte de la revisión de abogados es únicamente entre usted y el abogado independiente, NO con Multi Servicios 360.`
      },
      userResponsibilities: {
        title: '6. Responsabilidades del Usuario',
        content: `Al utilizar nuestros servicios, usted acepta:

• Proporcionar información veraz, precisa, actual y completa.
• Revisar cuidadosamente todos los documentos antes de firmarlos.
• Entender que usted es responsable de todas las selecciones y decisiones en sus documentos.
• Obtener asesoría legal independiente si tiene preguntas sobre sus derechos legales.
• No usar nuestros servicios para ningún propósito ilegal o no autorizado.
• Cumplir con todas las leyes aplicables al usar nuestros servicios.

USTED ES RESPONSABLE de verificar que los documentos sean apropiados para su situación específica.`
      },
      limitations: {
        title: '7. Limitaciones de Nuestros Servicios',
        content: `Nuestros servicios tienen las siguientes limitaciones:

• No proporcionamos asesoría legal ni recomendaciones legales.
• No podemos garantizar que los documentos sean apropiados para su situación específica.
• No podemos garantizar ningún resultado legal particular.
• No proporcionamos servicios de representación legal.
• No podemos responder preguntas que requieran juicio legal o interpretación de la ley.
• No somos responsables de cambios en las leyes que puedan afectar sus documentos después de su preparación.

Los documentos se preparan basándose en las leyes vigentes de California al momento de la preparación.`
      },
      pricing: {
        title: '8. Precios y Pagos',
        content: `• Todos los precios se muestran en dólares estadounidenses (USD).
• Los precios incluyen la preparación del documento según se describe en cada servicio.
• Los servicios adicionales (como revisión de abogados, coordinación notarial, o registro de condado) tienen cargos adicionales que se muestran claramente.
• El pago debe completarse antes de recibir los documentos finales.
• Aceptamos pagos mediante tarjetas de crédito y débito a través de procesadores de pago seguros.`
      },
      refunds: {
        title: '9. Política de Reembolsos',
        content: `• Debido a la naturaleza digital de nuestros servicios, generalmente no ofrecemos reembolsos una vez que el proceso de preparación del documento ha comenzado.
• Si hay un error atribuible a Multi Servicios 360, corregiremos el documento sin cargo adicional.
• Las solicitudes de reembolso serán evaluadas caso por caso.
• Para solicitar un reembolso, contáctenos dentro de los 30 días posteriores a su compra.`
      },
      disclaimer: {
        title: '10. Descargo de Responsabilidad',
        content: `LOS SERVICIOS SE PROPORCIONAN "TAL CUAL" Y "SEGÚN DISPONIBILIDAD" SIN GARANTÍAS DE NINGÚN TIPO, YA SEAN EXPRESAS O IMPLÍCITAS.

MULTI SERVICIOS 360 EXPRESAMENTE RENUNCIA A TODAS LAS GARANTÍAS, INCLUYENDO, PERO NO LIMITADO A:

• Garantías implícitas de comerciabilidad
• Idoneidad para un propósito particular
• No infracción
• Garantías de que los servicios serán ininterrumpidos o libres de errores
• Garantías de que los documentos lograrán algún resultado legal particular

USTED ACEPTA QUE EL USO DE NUESTROS SERVICIOS ES BAJO SU PROPIO RIESGO.`
      },
      liability: {
        title: '11. Limitación de Responsabilidad',
        content: `EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE:

• Multi Servicios 360, sus directores, empleados, agentes y afiliados NO serán responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo.
• Nuestra responsabilidad total por cualquier reclamo relacionado con nuestros servicios no excederá el monto que usted pagó por el servicio específico en cuestión.
• Esta limitación de responsabilidad se aplica independientemente de la teoría legal bajo la cual se busque la responsabilidad.

Algunos estados no permiten la exclusión o limitación de ciertos daños, por lo que algunas de las limitaciones anteriores pueden no aplicarse a usted.`
      },
      indemnification: {
        title: '12. Indemnización',
        content: `Usted acepta indemnizar, defender y mantener indemne a Multi Servicios 360, sus directores, empleados, agentes y afiliados de y contra cualquier reclamo, responsabilidad, daño, pérdida y gasto (incluyendo honorarios razonables de abogados) que surjan de:

• Su uso de nuestros servicios
• Su violación de estos Términos
• Su violación de cualquier ley o los derechos de terceros
• Cualquier información inexacta o incompleta que usted proporcione`
      },
      intellectualProperty: {
        title: '13. Propiedad Intelectual',
        content: `• Todo el contenido del sitio web, incluyendo textos, gráficos, logotipos, iconos, imágenes y software, es propiedad de Multi Servicios 360 o sus licenciantes.
• No puede copiar, reproducir, distribuir o crear obras derivadas de nuestro contenido sin autorización escrita.
• Los documentos que preparamos para usted son de su propiedad una vez que se complete el pago.`
      },
      privacy: {
        title: '14. Privacidad',
        content: `Su privacidad es importante para nosotros. Nuestra recopilación y uso de su información personal se rige por nuestra Política de Privacidad, que se incorpora a estos Términos por referencia. Al usar nuestros servicios, usted consiente la recopilación y uso de su información como se describe en nuestra Política de Privacidad.`
      },
      governing: {
        title: '15. Ley Aplicable y Jurisdicción',
        content: `• Estos Términos se regirán e interpretarán de acuerdo con las leyes del Estado de California, sin dar efecto a ningún principio de conflicto de leyes.
• Cualquier disputa que surja de o en relación con estos Términos o nuestros servicios estará sujeta a la jurisdicción exclusiva de los tribunales estatales y federales ubicados en el Condado de Los Ángeles, California.
• Usted acepta someterse a la jurisdicción personal de dichos tribunales.`
      },
      arbitration: {
        title: '16. Arbitraje',
        content: `ACUERDO DE ARBITRAJE: Usted y Multi Servicios 360 acuerdan que cualquier disputa, reclamo o controversia que surja de o se relacione con estos Términos o nuestros servicios se resolverá mediante arbitraje vinculante, en lugar de en un tribunal.

• El arbitraje se llevará a cabo de acuerdo con las reglas de la Asociación Americana de Arbitraje (AAA).
• El arbitraje se llevará a cabo en Los Ángeles, California.
• El árbitro aplicará la ley de California.
• La decisión del árbitro será final y vinculante.

RENUNCIA A DEMANDAS COLECTIVAS: Usted acepta que cualquier arbitraje o procedimiento se llevará a cabo únicamente de forma individual, y no como parte de una acción colectiva, consolidada o representativa.`
      },
      changes: {
        title: '17. Cambios a estos Términos',
        content: `• Nos reservamos el derecho de modificar estos Términos en cualquier momento.
• Los cambios entrarán en vigencia inmediatamente después de su publicación en el sitio web.
• Su uso continuado de nuestros servicios después de cualquier cambio constituye su aceptación de los nuevos Términos.
• Es su responsabilidad revisar estos Términos periódicamente.`
      },
      termination: {
        title: '18. Terminación',
        content: `• Podemos terminar o suspender su acceso a nuestros servicios inmediatamente, sin previo aviso, por cualquier motivo.
• Tras la terminación, su derecho a usar nuestros servicios cesará inmediatamente.
• Las disposiciones de estos Términos que por su naturaleza deberían sobrevivir a la terminación, sobrevivirán.`
      },
      severability: {
        title: '19. Divisibilidad',
        content: `Si alguna disposición de estos Términos se considera inválida, ilegal o inaplicable por un tribunal de jurisdicción competente, dicha disposición se modificará e interpretará para lograr los objetivos de dicha disposición en la mayor medida posible bajo la ley aplicable, y las disposiciones restantes continuarán en pleno vigor y efecto.`
      },
      contact: {
        title: '20. Información de Contacto',
        content: `Si tiene preguntas sobre estos Términos de Servicio, puede contactarnos:

Multi Servicios 360
Beverly Hills, CA
Teléfono: 855.246.7274
Email: info@multiservicios360.net
Horario: Lunes - Viernes, 9am - 6pm (Hora del Pacífico)`
      },
      acknowledgment: {
        title: '21. Reconocimiento',
        content: `AL UTILIZAR NUESTROS SERVICIOS, USTED RECONOCE QUE:

• Ha leído y entendido estos Términos de Servicio.
• Multi Servicios 360 NO es un bufete de abogados y NO proporciona asesoría legal.
• El uso de este sitio web NO crea una relación abogado-cliente.
• USTED es responsable de seleccionar las opciones y poderes en sus documentos.
• La revisión de abogados es OPCIONAL y proporcionada por abogados INDEPENDIENTES.
• Acepta estar sujeto a estos Términos de Servicio.`
      }
    }
  },
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated',
    backHome: 'Back to Home',
    sections: {
      intro: {
        title: '1. Introduction and Acceptance',
        content: `Welcome to Multi Servicios 360 ("we", "our" or the "Company"). By accessing or using our website multiservicios360.net (the "Site") and our document preparation services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use our services.

IMPORTANT NOTICE: MULTI SERVICIOS 360 IS NOT A LAW FIRM AND DOES NOT PROVIDE LEGAL ADVICE. We are a self-help legal document preparation service.`
      },
      notLawFirm: {
        title: '2. We Are Not a Law Firm',
        content: `THIS IS A CRITICAL POINT YOU MUST UNDERSTAND:

• Multi Servicios 360 is NOT a law firm.
• Multi Servicios 360 does NOT provide legal advice.
• Multi Servicios 360 CANNOT represent you in any legal matter.
• Employees and representatives of Multi Servicios 360 are NOT attorneys (unless expressly stated otherwise in the context of optional attorney review services).
• Multi Servicios 360 CANNOT provide advice about which documents are appropriate for your specific situation.

We provide a self-help platform for legal document preparation based solely on the information you provide.`
      },
      noAttorneyClient: {
        title: '3. No Attorney-Client Relationship',
        content: `The use of this website and our services does NOT create an attorney-client relationship between you and Multi Servicios 360, its employees, contractors, or affiliates.

• No communication with Multi Servicios 360 constitutes legal advice.
• Information provided on this website is for general informational purposes only.
• You should not rely on any information on this website as a substitute for professional legal advice.
• If you need legal advice, you should consult with a licensed attorney.`
      },
      selfHelp: {
        title: '4. Self-Help Service',
        content: `Multi Servicios 360 provides a self-help legal document preparation service. This means:

• You provide all information necessary to prepare your documents.
• You select the powers, options, and provisions included in your documents.
• You are responsible for the accuracy and completeness of the information you provide.
• The platform does NOT recommend or select legal options for you.
• You make all decisions about the content of your documents.

USER CONTROL STATEMENT: You acknowledge and agree that YOU select the powers and options included in your document. The platform does not recommend or select legal options for you.`
      },
      attorneyReview: {
        title: '5. Attorney Review (Optional Service)',
        content: `Multi Servicios 360 offers, as an OPTIONAL and SEPARATE service, the possibility of having an independent attorney review your documents.

• Attorney review is completely optional and not required to use our basic services.
• Attorneys who provide review services are INDEPENDENT and are NOT employees of Multi Servicios 360.
• Attorneys are licensed in the State of California.
• If you choose attorney review, a separate relationship will be established between you and the reviewing attorney.
• Multi Servicios 360 does not control or supervise the work of independent attorneys.
• Fees for attorney review are separate and clearly indicated before purchase.

Any attorney-client relationship that results from attorney review is solely between you and the independent attorney, NOT with Multi Servicios 360.`
      },
      userResponsibilities: {
        title: '6. User Responsibilities',
        content: `By using our services, you agree to:

• Provide true, accurate, current, and complete information.
• Carefully review all documents before signing them.
• Understand that you are responsible for all selections and decisions in your documents.
• Obtain independent legal advice if you have questions about your legal rights.
• Not use our services for any illegal or unauthorized purpose.
• Comply with all applicable laws when using our services.

YOU ARE RESPONSIBLE for verifying that the documents are appropriate for your specific situation.`
      },
      limitations: {
        title: '7. Limitations of Our Services',
        content: `Our services have the following limitations:

• We do not provide legal advice or legal recommendations.
• We cannot guarantee that documents are appropriate for your specific situation.
• We cannot guarantee any particular legal outcome.
• We do not provide legal representation services.
• We cannot answer questions that require legal judgment or interpretation of the law.
• We are not responsible for changes in laws that may affect your documents after their preparation.

Documents are prepared based on California laws in effect at the time of preparation.`
      },
      pricing: {
        title: '8. Pricing and Payments',
        content: `• All prices are displayed in US dollars (USD).
• Prices include document preparation as described in each service.
• Additional services (such as attorney review, notary coordination, or county recording) have additional charges that are clearly displayed.
• Payment must be completed before receiving final documents.
• We accept payments via credit and debit cards through secure payment processors.`
      },
      refunds: {
        title: '9. Refund Policy',
        content: `• Due to the digital nature of our services, we generally do not offer refunds once the document preparation process has begun.
• If there is an error attributable to Multi Servicios 360, we will correct the document at no additional charge.
• Refund requests will be evaluated on a case-by-case basis.
• To request a refund, contact us within 30 days of your purchase.`
      },
      disclaimer: {
        title: '10. Disclaimer of Warranties',
        content: `THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

MULTI SERVICIOS 360 EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING, BUT NOT LIMITED TO:

• Implied warranties of merchantability
• Fitness for a particular purpose
• Non-infringement
• Warranties that the services will be uninterrupted or error-free
• Warranties that the documents will achieve any particular legal result

YOU AGREE THAT YOUR USE OF OUR SERVICES IS AT YOUR SOLE RISK.`
      },
      liability: {
        title: '11. Limitation of Liability',
        content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:

• Multi Servicios 360, its directors, employees, agents, and affiliates shall NOT be liable for any indirect, incidental, special, consequential, or punitive damages.
• Our total liability for any claim related to our services shall not exceed the amount you paid for the specific service in question.
• This limitation of liability applies regardless of the legal theory under which liability is sought.

Some states do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you.`
      },
      indemnification: {
        title: '12. Indemnification',
        content: `You agree to indemnify, defend, and hold harmless Multi Servicios 360, its directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising from:

• Your use of our services
• Your violation of these Terms
• Your violation of any law or the rights of third parties
• Any inaccurate or incomplete information you provide`
      },
      intellectualProperty: {
        title: '13. Intellectual Property',
        content: `• All website content, including text, graphics, logos, icons, images, and software, is the property of Multi Servicios 360 or its licensors.
• You may not copy, reproduce, distribute, or create derivative works from our content without written authorization.
• Documents we prepare for you are your property once payment is completed.`
      },
      privacy: {
        title: '14. Privacy',
        content: `Your privacy is important to us. Our collection and use of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.`
      },
      governing: {
        title: '15. Governing Law and Jurisdiction',
        content: `• These Terms shall be governed by and construed in accordance with the laws of the State of California, without giving effect to any principles of conflicts of laws.
• Any dispute arising out of or in connection with these Terms or our services shall be subject to the exclusive jurisdiction of the state and federal courts located in Los Angeles County, California.
• You agree to submit to the personal jurisdiction of such courts.`
      },
      arbitration: {
        title: '16. Arbitration',
        content: `ARBITRATION AGREEMENT: You and Multi Servicios 360 agree that any dispute, claim, or controversy arising out of or relating to these Terms or our services shall be resolved by binding arbitration, rather than in court.

• Arbitration shall be conducted in accordance with the rules of the American Arbitration Association (AAA).
• Arbitration shall take place in Los Angeles, California.
• The arbitrator shall apply California law.
• The arbitrator's decision shall be final and binding.

CLASS ACTION WAIVER: You agree that any arbitration or proceeding shall be conducted only on an individual basis, and not as part of a class, consolidated, or representative action.`
      },
      changes: {
        title: '17. Changes to These Terms',
        content: `• We reserve the right to modify these Terms at any time.
• Changes will become effective immediately upon posting on the website.
• Your continued use of our services after any changes constitutes your acceptance of the new Terms.
• It is your responsibility to review these Terms periodically.`
      },
      termination: {
        title: '18. Termination',
        content: `• We may terminate or suspend your access to our services immediately, without prior notice, for any reason.
• Upon termination, your right to use our services will immediately cease.
• Provisions of these Terms that by their nature should survive termination shall survive.`
      },
      severability: {
        title: '19. Severability',
        content: `If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions shall continue in full force and effect.`
      },
      contact: {
        title: '20. Contact Information',
        content: `If you have questions about these Terms of Service, you can contact us:

Multi Servicios 360
Beverly Hills, CA
Phone: 855.246.7274
Email: info@multiservicios360.net
Hours: Monday - Friday, 9am - 6pm (Pacific Time)`
      },
      acknowledgment: {
        title: '21. Acknowledgment',
        content: `BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT:

• You have read and understood these Terms of Service.
• Multi Servicios 360 is NOT a law firm and does NOT provide legal advice.
• Use of this website does NOT create an attorney-client relationship.
• YOU are responsible for selecting the options and powers in your documents.
• Attorney review is OPTIONAL and provided by INDEPENDENT attorneys.
• You agree to be bound by these Terms of Service.`
      }
    }
  }
};

export default function TermsOfServicePage() {
  const [language, setLanguage] = useState('es');
  const t = TRANSLATIONS[language];

  const sectionOrder = [
    'intro', 'notLawFirm', 'noAttorneyClient', 'selfHelp', 'attorneyReview',
    'userResponsibilities', 'limitations', 'pricing', 'refunds', 'disclaimer',
    'liability', 'indemnification', 'intellectualProperty', 'privacy', 'governing',
    'arbitration', 'changes', 'termination', 'severability', 'contact', 'acknowledgment'
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
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1E3A8A', marginBottom: '8px' }}>{t.title}</h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '32px' }}>{t.lastUpdated}: January 2025</p>

          {/* Important Notice Box */}
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
            <p style={{ color: '#991B1B', fontWeight: '600', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
              {language === 'es' 
                ? '⚠️ AVISO IMPORTANTE: Multi Servicios 360 NO es un bufete de abogados y NO proporciona asesoría legal. Este es un servicio de preparación de documentos legales de autoayuda. El uso de este sitio web NO crea una relación abogado-cliente.'
                : '⚠️ IMPORTANT NOTICE: Multi Servicios 360 is NOT a law firm and does NOT provide legal advice. This is a self-help legal document preparation service. Use of this website does NOT create an attorney-client relationship.'}
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
        </div>

        {/* Footer Contact */}
        <div style={{ textAlign: 'center', marginTop: '40px', padding: '24px', backgroundColor: 'white', borderRadius: '12px' }}>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '12px' }}>
            {language === 'es' ? '¿Preguntas sobre estos términos?' : 'Questions about these terms?'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
            <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E3A8A', textDecoration: 'none', fontWeight: '600' }}>
              <PhoneIcon /> 855.246.7274
            </a>
            <a href="mailto:info@multiservicios360.net" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E3A8A', textDecoration: 'none', fontWeight: '600' }}>
              <MailIcon /> info@multiservicios360.net
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F172A', color: 'white', padding: '24px 16px', textAlign: 'center' }}>
        <p style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>© 2026 Multi Servicios 360. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
      </footer>
    </div>
  );
}