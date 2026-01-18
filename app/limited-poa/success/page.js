"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { jsPDF } from 'jspdf';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

function SuccessContent() {
  const searchParams = useSearchParams();
  const [matterData, setMatterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('es');

  const matterId = searchParams.get('matter_id');

  useEffect(() => {
    const fetchMatterData = async () => {
      if (matterId) {
        try {
          const response = await fetch(`/api/poa/matters/${matterId}`);
          const data = await response.json();
          if (data.success) {
            setMatterData(data.matter);
            setLanguage(data.matter.language || 'es');
          }
        } catch (error) {
          console.error('Error fetching matter:', error);
        }
      }
      setLoading(false);
    };
    fetchMatterData();
  }, [matterId]);

  const t = language === 'es' ? {
    title: 'Pago Exitoso!',
    subtitle: 'Su Poder Notarial esta listo',
    thankYou: 'Gracias por su compra. Su documento esta listo para descargar.',
    orderNumber: 'Numero de Orden',
    downloadSpanish: 'Descargar PDF Espanol',
    downloadEnglish: 'Descargar PDF Ingles',
    print: 'Imprimir',
    email: 'Enviar por Email',
    nextSteps: 'Proximos Pasos',
    step1: 'Descargue sus documentos PDF',
    step2: 'Revise el documento cuidadosamente',
    step3: 'Firme ante un notario publico',
    step4: 'Guarde copias en un lugar seguro',
    questions: 'Preguntas?',
    contact: 'Contactenos al 855.246.7274',
    backHome: 'Volver al Inicio',
    legalNote: 'Nota: El documento en ingles es el documento legal oficial. El documento en espanol es para su referencia.',
  } : {
    title: 'Payment Successful!',
    subtitle: 'Your Power of Attorney is ready',
    thankYou: 'Thank you for your purchase. Your document is ready to download.',
    orderNumber: 'Order Number',
    downloadSpanish: 'Download Spanish PDF',
    downloadEnglish: 'Download English PDF',
    print: 'Print',
    email: 'Send by Email',
    nextSteps: 'Next Steps',
    step1: 'Download your PDF documents',
    step2: 'Review the document carefully',
    step3: 'Sign in front of a notary public',
    step4: 'Keep copies in a safe place',
    questions: 'Questions?',
    contact: 'Contact us at 855.246.7274',
    backHome: 'Back to Home',
    legalNote: '',
  };

  const generatePDF = (isSpanish = false) => {
    if (!matterData?.intake_data) {
      alert('No data available');
      return;
    }
    const d = matterData.intake_data;
    const doc = new jsPDF();
    const lang = isSpanish ? 'es' : 'en';
    const m = 20; // margin
    const pw = 210; // page width
    const cw = pw - 40; // content width
    let y = 15;

    // Helper functions
    const wrap = (text, x, startY, maxW, lh = 5) => {
      const lines = doc.splitTextToSize(text || '', maxW);
      lines.forEach((line, i) => doc.text(line, x, startY + (i * lh)));
      return startY + (lines.length * lh);
    };

    const newPage = (currentY, need = 30) => {
      if (currentY > 270 - need) { doc.addPage(); return 20; }
      return currentY;
    };

    const section = (title, content, isBold = false) => {
      y = newPage(y, 25);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(title, m, y);
      y += 6;
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(10);
      y = wrap(content, m, y, cw, 4.5);
      y += 6;
    };

    // ============================================
    // RECORDING HEADER (for real estate POAs)
    // ============================================
    if (d.record_for_real_estate) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text("Assessor's Parcel No.: _______________________", m, y);
      y += 8;
      doc.text("RECORDING REQUESTED BY:", m, y);
      y += 4;
      doc.text(d.principal_name || '[Principal Name]', m, y);
      y += 4;
      doc.text(d.principal_address || '[Principal Address]', m, y);
      y += 8;
      doc.text("WHEN RECORDED MAIL TO:", m, y);
      y += 4;
      doc.text(d.principal_name || '[Principal Name]', m, y);
      y += 4;
      doc.text(d.principal_address || '[Principal Address]', m, y);
      y += 12;
      doc.setLineWidth(0.3);
      doc.line(m, y, pw - m, y);
      y += 10;
    }

    // ============================================
    // TITLE
    // ============================================
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'PODER NOTARIAL GENERAL DURADERO' : 'CALIFORNIA GENERAL DURABLE', pw/2, y, {align: 'center'});
    y += 7;
    doc.setFontSize(14);
    doc.text(lang === 'es' ? 'ESTADO DE CALIFORNIA' : 'POWER OF ATTORNEY', pw/2, y, {align: 'center'});
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(m, y, pw - m, y);
    y += 8;

    // ============================================
    // ATTORNEY REVIEW NOTICE (Your Approved Language)
    // ============================================
    doc.setFillColor(240, 240, 240);
    doc.rect(m, y, cw, 38, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'AVISO DE REVISION DE ABOGADO (Recomendado)' : 'ATTORNEY REVIEW NOTICE (Recommended)', m + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const attorneyNotice = lang === 'es' 
      ? 'Este Poder Notarial General esta disenado para propositos claramente definidos. Puede desear consultar con un abogado con licencia de California si: esta otorgando autoridad sobre bienes raices, esta otorgando autoridad sobre activos financieros significativos, no esta seguro de que este documento refleje completamente sus intenciones, o tiene una estructura patrimonial o empresarial compleja. La revision de un abogado no es requerida para que este documento sea valido bajo la ley de California.'
      : 'This General Power of Attorney is designed for clearly defined purposes. You may wish to consult with a licensed California attorney if: you are granting authority involving real estate, you are granting authority involving significant financial assets, you are uncertain whether this document fully reflects your intentions, or you have a complex estate or business structure. Attorney review is not required for this document to be valid under California law.';
    y = wrap(attorneyNotice, m + 4, y + 12, cw - 8, 4);
    y += 10;

    // ============================================
    // STATUTORY NOTICE TO PRINCIPAL (California Probate Code § 4128)
    // ============================================
    y = newPage(y, 80);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'AVISO A LA PERSONA QUE EJECUTA EL PODER NOTARIAL DURADERO' : 'NOTICE TO PERSON EXECUTING DURABLE POWER OF ATTORNEY', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    const noticeText = lang === 'es' 
      ? `Un poder notarial duradero es un documento legal importante. Al firmar este poder notarial duradero, usted esta autorizando a otra persona a actuar en su nombre, el poderdante. Antes de firmar este poder notarial duradero, debe conocer estos hechos importantes:

Su agente (apoderado) no tiene obligacion de actuar a menos que usted y su agente acuerden lo contrario por escrito.

Este documento otorga a su agente los poderes para administrar, disponer, vender y traspasar sus bienes inmuebles y personales, y para usar su propiedad como garantia si su agente pide dinero prestado en su nombre. Este documento no otorga a su agente el poder de aceptar o recibir ninguna de sus propiedades, en fideicomiso o de otra manera, como regalo, a menos que usted autorice especificamente al agente para aceptar o recibir un regalo.

Su agente tendra derecho a recibir un pago razonable por los servicios prestados bajo este poder notarial duradero a menos que usted disponga lo contrario.

Los poderes que otorga a su agente continuaran existiendo durante toda su vida, a menos que establezca que el poder notarial durara por un periodo mas corto o a menos que termine el poder notarial. Los poderes que otorga a su agente en este poder notarial duradero continuaran existiendo incluso si ya no puede tomar sus propias decisiones respecto a la administracion de su propiedad.

Solo puede enmendar o cambiar este poder notarial duradero ejecutando un nuevo poder notarial duradero o ejecutando una enmienda con las mismas formalidades que un original.

Tiene derecho a revocar o terminar este poder notarial duradero en cualquier momento, siempre que sea competente.

Este poder notarial duradero debe estar fechado y debe ser reconocido ante un notario publico o firmado por dos testigos.

Debe leer este poder notarial duradero cuidadosamente. El poder notarial duradero es importante para usted. Si no entiende el poder notarial duradero, o alguna disposicion del mismo, debe obtener la asistencia de un abogado u otra persona calificada.`
      : `A durable power of attorney is an important legal document. By signing the durable power of attorney, you are authorizing another person to act for you, the principal. Before you sign this durable power of attorney, you should know these important facts:

Your agent (attorney-in-fact) has no duty to act unless you and your agent agree otherwise in writing.

This document gives your agent the powers to manage, dispose of, sell, and convey your real and personal property, and to use your property as security if your agent borrows money on your behalf. This document does not give your agent the power to accept or receive any of your property, in trust or otherwise, as a gift, unless you specifically authorize the agent to accept or receive a gift.

Your agent will have the right to receive reasonable payment for services provided under this durable power of attorney unless you provide otherwise in this power of attorney.

The powers you give your agent will continue to exist for your entire lifetime, unless you state that the durable power of attorney will last for a shorter period of time or unless you otherwise terminate the durable power of attorney. The powers you give your agent in this durable power of attorney will continue to exist even if you can no longer make your own decisions respecting the management of your property.

You can amend or change this durable power of attorney only by executing a new durable power of attorney or by executing an amendment through the same formalities as an original.

You have the right to revoke or terminate this durable power of attorney at any time, so long as you are competent.

This durable power of attorney must be dated and must be acknowledged before a notary public or signed by two witnesses.

You should read this durable power of attorney carefully. The durable power of attorney is important to you. If you do not understand the durable power of attorney, or any provision of it, then you should obtain the assistance of an attorney or other qualified person.`;
    
    y = wrap(noticeText, m, y, cw, 4);
    y += 8;

    // ============================================
    // ARTICLE I - IDENTIFICATION OF PARTIES
    // ============================================
    y = newPage(y, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO I - IDENTIFICACION DE LAS PARTES' : 'ARTICLE I - IDENTIFICATION OF PARTIES', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const article1 = lang === 'es'
      ? `Yo, ${d.principal_name || '[NOMBRE DEL PODERDANTE]'}${d.principal_aka ? ', tambien conocido/a como ' + d.principal_aka : ''}, residente de ${d.principal_address || '[DIRECCION]'}, Estado de California, por la presente nombro y designo a:`
      : `I, ${d.principal_name || '[PRINCIPAL NAME]'}${d.principal_aka ? ', also known as ' + d.principal_aka : ''}, a resident of ${d.principal_address || '[ADDRESS]'}, State of California, do hereby appoint and designate:`;
    y = wrap(article1, m, y, cw, 5);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.text(d.agent_name || '[AGENT NAME]', m + 10, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text((lang === 'es' ? 'Direccion: ' : 'Address: ') + (d.agent_address || '[AGENT ADDRESS]'), m + 10, y);
    y += 5;
    doc.text((lang === 'es' ? 'Relacion: ' : 'Relationship: ') + (d.agent_relationship || '[RELATIONSHIP]'), m + 10, y);
    y += 8;

    const asAgent = lang === 'es'
      ? 'como mi Apoderado (Attorney-in-Fact), para actuar en mi nombre de acuerdo con los terminos de este Poder Notarial General Duradero.'
      : 'as my Attorney-in-Fact (Agent), to act in my name and on my behalf pursuant to the terms of this General Durable Power of Attorney.';
    y = wrap(asAgent, m, y, cw, 5);
    y += 8;

    // Successor Agent
    if (d.wants_successor && d.successor_agent) {
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'APODERADO SUCESOR:' : 'SUCCESSOR AGENT:', m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      const successorText = lang === 'es'
        ? `Si ${d.agent_name || 'mi Apoderado'} renuncia, o no puede o no quiere servir o continuar sirviendo como mi apoderado, o es removido por orden judicial, nombro a la siguiente persona para servir como mi apoderado sucesor:`
        : `If ${d.agent_name || 'my Agent'} resigns, or is unable or unwilling to serve or continue to serve as my attorney-in-fact, or is removed by court order, I appoint the following person to serve as my successor attorney-in-fact:`;
      y = wrap(successorText, m, y, cw, 5);
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.text(d.successor_agent, m + 10, y);
      y += 8;
    }

    // ============================================
    // ARTICLE II - DURABILITY AND EFFECTIVE DATE
    // ============================================
    y = newPage(y, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO II - DURABILIDAD Y FECHA DE VIGENCIA' : 'ARTICLE II - DURABILITY AND EFFECTIVE DATE', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    if (d.durable) {
      const durableText = lang === 'es'
        ? 'Este Poder Notarial ES DURADERO y PERMANECERA EN EFECTO incluso si yo quedo discapacitado o incapacitado. Mi discapacidad o incapacidad sera determinada por mi medico (o un medico elegido por mi apoderado si no tengo un medico o si mi medico no esta disponible) y establecida en una certificacion escrita.'
        : 'This Power of Attorney IS DURABLE and SHALL REMAIN IN EFFECT even if I become disabled or incapacitated. My disability or incapacity will be determined by my physician (or a physician chosen by my attorney-in-fact if I do not have a physician or if my physician is unavailable) and set forth in a written certification.';
      y = wrap(durableText, m, y, cw, 5);
    } else {
      const nonDurableText = lang === 'es'
        ? 'Este Poder Notarial NO ES DURADERO y terminara automaticamente si yo quedo discapacitado o incapacitado.'
        : 'This Power of Attorney is NOT DURABLE and shall automatically terminate upon my disability or incapacity.';
      y = wrap(nonDurableText, m, y, cw, 5);
    }
    y += 4;

    if (d.effective_when === 'immediately') {
      const immediateText = lang === 'es'
        ? 'Este Poder Notarial entrara en vigor INMEDIATAMENTE al momento de su ejecucion.'
        : 'This Power of Attorney shall become effective IMMEDIATELY upon execution.';
      y = wrap(immediateText, m, y, cw, 5);
    } else {
      const incapacityText = lang === 'es'
        ? 'Este Poder Notarial entrara en vigor SOLAMENTE ante mi incapacidad (Poder Notarial Latente).'
        : 'This Power of Attorney shall become effective ONLY upon my incapacity (Springing Power of Attorney).';
      y = wrap(incapacityText, m, y, cw, 5);
    }
    y += 8;

    // ============================================
    // HIPAA AUTHORIZATION
    // ============================================
    y = newPage(y, 35);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'AUTORIZACION HIPAA' : 'HIPAA AUTHORIZATION', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const hipaaText = lang === 'es'
      ? 'De conformidad con la Ley de Portabilidad y Responsabilidad del Seguro de Salud de 1996 ("HIPAA") y todas las demas leyes estatales y federales aplicables, y exclusivamente con el proposito de determinar mi incapacitacion o incapacidad para administrar mis asuntos financieros y obtener una declaracion jurada de dicha incapacitacion por un medico, autorizo a cualquier proveedor de atencion medica a divulgar a la persona nombrada aqui como mi "apoderado" cualquier informacion de salud identificable individualmente pertinente suficiente para determinar si soy mental o fisicamente capaz de administrar mis asuntos financieros. Al ejercer dicha autoridad, mi apoderado constituye mi "representante personal" segun lo definido por HIPAA.'
      : 'Pursuant to the Health Insurance Portability and Accountability Act of 1996 ("HIPAA") and all other applicable state and federal laws, and exclusively for the purpose of making a determination of my incapacitation or incapability of managing my financial affairs and obtaining an affidavit of such incapacitation by a physician, I authorize any health care provider to disclose to the person named herein as my "attorney-in-fact" any pertinent individually identifiable health information sufficient to determine whether I am mentally or physically capable of managing my financial affairs. In exercising such authority, my attorney-in-fact constitutes my "personal representative" as defined by HIPAA.';
    y = wrap(hipaaText, m, y, cw, 4);
    y += 8;

    // ============================================
    // ARTICLE III - POWERS GRANTED
    // ============================================
    y = newPage(y, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO III - PODERES OTORGADOS' : 'ARTICLE III - POWERS GRANTED', m, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const powersIntro = lang === 'es'
      ? 'En la medida permitida por la ley, mi apoderado puede actuar en mi nombre, lugar y representacion en cualquier forma en que yo mismo podria con respecto a los siguientes asuntos:'
      : 'To the extent permitted by law, my attorney-in-fact may act in my name, place, and stead in any way that I myself could with respect to the following matters:';
    y = wrap(powersIntro, m, y, cw, 5);
    y += 6;

    const powersList = [
      { key: 'powers_real_estate', en: 'REAL ESTATE TRANSACTIONS: Manage, sell, transfer, lease, mortgage, pledge, refinance, insure, maintain, improve, collect and receive rent, sale proceeds, and earnings, pay taxes, assessments, and charges, and perform any and all other acts with respect to real property.', es: 'TRANSACCIONES DE BIENES RAICES: Administrar, vender, transferir, arrendar, hipotecar, pignorar, refinanciar, asegurar, mantener, mejorar, cobrar y recibir rentas, ganancias de ventas, y realizar cualquier otro acto con respecto a bienes inmuebles.' },
      { key: 'powers_banking', en: 'BANKING AND FINANCIAL TRANSACTIONS: Conduct any business with banks, savings and loan associations, credit unions, and other financial institutions, including signing checks, depositing and withdrawing funds, opening and closing accounts, accessing safe deposit boxes, and borrowing money.', es: 'TRANSACCIONES BANCARIAS Y FINANCIERAS: Realizar cualquier negocio con bancos, asociaciones de ahorro y prestamo, cooperativas de credito y otras instituciones financieras, incluyendo firmar cheques, depositar y retirar fondos, abrir y cerrar cuentas, acceder a cajas de seguridad y pedir dinero prestado.' },
      { key: 'powers_stocks', en: 'STOCK AND BOND TRANSACTIONS: Buy, sell, pledge, and exchange stocks, mutual funds, bonds, options, commodity futures, and all other types of securities.', es: 'TRANSACCIONES DE ACCIONES Y BONOS: Comprar, vender, pignorar e intercambiar acciones, fondos mutuos, bonos, opciones, futuros de materias primas y todos los demas tipos de valores.' },
      { key: 'powers_business', en: 'BUSINESS OPERATION TRANSACTIONS: Buy, sell, expand, reduce, or terminate a business interest, manage and operate any business, enter into contracts, hire and discharge employees.', es: 'TRANSACCIONES DE OPERACIONES COMERCIALES: Comprar, vender, expandir, reducir o terminar un interes comercial, administrar y operar cualquier negocio, celebrar contratos, contratar y despedir empleados.' },
      { key: 'powers_insurance', en: 'INSURANCE AND ANNUITY TRANSACTIONS: Obtain, modify, renew, convert, rescind, pay premiums on, or terminate insurance and annuities of all types.', es: 'TRANSACCIONES DE SEGUROS Y ANUALIDADES: Obtener, modificar, renovar, convertir, rescindir, pagar primas o terminar seguros y anualidades de todo tipo.' },
      { key: 'powers_litigation', en: 'CLAIMS AND LITIGATION: Act for me in all legal matters, retain and discharge attorneys, appear for me in actions and proceedings, commence actions, settle claims, and pay judgments.', es: 'RECLAMOS Y LITIGIOS: Actuar por mi en todos los asuntos legales, retener y despedir abogados, comparecer por mi en acciones y procedimientos, iniciar acciones, resolver reclamos y pagar sentencias.' },
      { key: 'powers_tax', en: 'TAX MATTERS: Prepare, sign, and file tax returns, represent me before tax authorities, receive refunds, and make elections with respect to federal, state, and local taxes.', es: 'ASUNTOS FISCALES: Preparar, firmar y presentar declaraciones de impuestos, representarme ante autoridades fiscales, recibir reembolsos y hacer elecciones con respecto a impuestos federales, estatales y locales.' },
      { key: 'powers_retirement', en: 'RETIREMENT PLAN TRANSACTIONS: Act in all matters that affect my retirement, deferred compensation, or pension plans, including selecting payment options and designating beneficiaries.', es: 'TRANSACCIONES DE PLANES DE JUBILACION: Actuar en todos los asuntos que afecten mis planes de jubilacion, compensacion diferida o pensiones, incluyendo seleccionar opciones de pago y designar beneficiarios.' },
      { key: 'powers_government', en: 'GOVERNMENT BENEFITS: Claim and collect benefits from Social Security, Medicare, Medicaid, or other government programs.', es: 'BENEFICIOS GUBERNAMENTALES: Reclamar y cobrar beneficios del Seguro Social, Medicare, Medicaid u otros programas gubernamentales.' },
      { key: 'powers_estate_trust', en: 'ESTATE AND TRUST TRANSACTIONS: Act in all matters affecting trusts, probate estates, and to transfer property to a living trust I created.', es: 'TRANSACCIONES DE PATRIMONIO Y FIDEICOMISO: Actuar en todos los asuntos que afecten fideicomisos, sucesiones testamentarias y transferir propiedad a un fideicomiso en vida que haya creado.' },
    ];

    powersList.forEach(power => {
      if (d[power.key]) {
        y = newPage(y, 20);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const powerText = lang === 'es' ? power.es : power.en;
        doc.text('☑', m, y);
        y = wrap(powerText, m + 8, y, cw - 8, 4);
        y += 4;
      }
    });

    // GIFTS
    if (d.hot_gifts) {
      y = newPage(y, 15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      const giftText = lang === 'es'
        ? '☑ REGALOS: Hacer regalos de mis activos, incluyendo condonacion de deudas. Mi apoderado tiene permitido dar cualquiera de mis activos, intereses o derechos, directa o indirectamente, a si mismo/a, o a sus acreedores.'
        : '☑ GIFTS: Make gifts from my assets, including debt forgiveness. My attorney-in-fact is permitted to give any of my assets, interests or rights, directly or indirectly, to himself or herself, or to his or her creditors.';
      y = wrap(giftText, m, y, cw, 4);
      y += 6;
    }

    // Special Instructions
    if (d.special_instructions && d.has_special_instructions) {
      y = newPage(y, 25);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'INSTRUCCIONES ESPECIALES:' : 'SPECIAL INSTRUCTIONS:', m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      y = wrap(d.special_instructions, m, y, cw, 5);
      y += 8;
    }

    // ============================================
    // ARTICLE IV - GENERAL PROVISIONS
    // ============================================
    y = newPage(y, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO IV - DISPOSICIONES GENERALES' : 'ARTICLE IV - GENERAL PROVISIONS', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    const provisions = lang === 'es' ? [
      '1) Confianza de Terceros. Por la presente acepto que cualquier tercero que reciba una copia debidamente ejecutada de este documento puede confiar y actuar bajo el mismo.',
      '2) Divisibilidad. Si alguna disposicion de este poder notarial se considera invalida o inaplicable, esta invalidez o inaplicabilidad no afectara las otras disposiciones.',
      '3) Revocacion de Poderes Anteriores. Revoco todos los poderes notariales duraderos que me nombran como poderdante ejecutados antes de este documento, excluyendo especificamente cualquier poder notarial de atencion medica.',
      '4) Revocacion. Puedo revocar este poder notarial en cualquier momento.',
      '5) Mantenimiento de Registros. Mi apoderado debe mantener registros de todas las acciones tomadas en mi nombre.',
      '6) Compensacion. Mi apoderado tiene derecho a una compensacion razonable por los servicios prestados.',
    ] : [
      '1) Reliance By Third Parties. I hereby agree that any third party receiving a duly executed copy of this document may rely on and act under it.',
      '2) Severability. If any provision in this power of attorney is found to be invalid or unenforceable, this invalidity or unenforceability will not affect the other provisions.',
      '3) Revocation of Prior Powers of Attorney. I revoke all durable powers of attorney naming me as principal executed prior to this document, specifically excluding any health care powers of attorney.',
      '4) Revocation. I may revoke this power of attorney at any time.',
      '5) Maintenance of Records. My attorney-in-fact must maintain records of all actions taken on my behalf.',
      '6) Compensation. My attorney-in-fact is entitled to reasonable compensation for services provided.',
    ];

    provisions.forEach(prov => {
      y = newPage(y, 12);
      y = wrap(prov, m, y, cw, 4);
      y += 3;
    });

    // ============================================
    // EXECUTION
    // ============================================
    y = newPage(y, 50);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'EN TESTIMONIO DE LO CUAL' : 'IN WITNESS WHEREOF', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const witnessText = lang === 'es'
      ? 'El abajo firmante ha ejecutado este poder notarial en la fecha indicada a continuacion.'
      : 'The undersigned has executed this power of attorney on the date set forth below.';
    y = wrap(witnessText, m, y, cw, 5);
    y += 15;

    doc.text((lang === 'es' ? 'Fecha: ' : 'Date: ') + '___________________', m, y);
    y += 20;
    doc.line(m, y, m + 80, y);
    y += 5;
    doc.text((lang === 'es' ? 'Firma de ' : 'Signature of ') + (d.principal_name || 'Principal'), m, y);
    y += 20;

    // ============================================
    // NOTARY ACKNOWLEDGMENT
    // ============================================
    y = newPage(y, 80);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'RECONOCIMIENTO DEL NOTARIO PUBLICO' : 'ACKNOWLEDGMENT OF NOTARY PUBLIC', pw/2, y, {align: 'center'});
    y += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const notaryNotice = lang === 'es'
      ? 'Un notario publico u otro oficial que complete este certificado verifica unicamente la identidad de la persona que firmo el documento al cual este certificado esta adjunto, y no la veracidad, exactitud o validez de ese documento.'
      : 'A notary public or other officer completing this certificate verifies only the identity of the individual who signed the document to which this certificate is attached, and not the truthfulness, accuracy, or validity of that document.';
    doc.setDrawColor(0);
    doc.rect(m, y, cw, 18);
    y = wrap(notaryNotice, m + 2, y + 4, cw - 4, 4);
    y += 10;

    doc.setFontSize(10);
    doc.text('State of California', m, y);
    y += 6;
    doc.text('County of ______________________________', m, y);
    y += 10;

    doc.text('On _________________________ before me, _________________________________________,', m, y);
    y += 5;
    doc.setFontSize(8);
    doc.text('                                                                                    Notary Public', m + 80, y);
    y += 8;

    doc.setFontSize(10);
    doc.text('personally appeared ______________________________________________________________,', m, y);
    y += 10;

    doc.setFontSize(9);
    const notaryText = lang === 'es'
      ? 'quien me demostro, sobre la base de evidencia satisfactoria, ser la persona cuyo nombre esta suscrito al instrumento adjunto y me reconocio que el/ella ejecuto el mismo en su capacidad autorizada, y que mediante su firma en el instrumento la persona, o la entidad en nombre de la cual la persona actuo, ejecuto el instrumento.'
      : 'who proved to me on the basis of satisfactory evidence to be the person(s) whose name(s) is/are subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their authorized capacity(ies), and that by his/her/their signature(s) on the instrument the person(s), or the entity upon behalf of which the person(s) acted, executed the instrument.';
    y = wrap(notaryText, m, y, cw, 4.5);
    y += 10;

    doc.setFont('helvetica', 'bold');
    const penaltyText = lang === 'es'
      ? 'Certifico bajo PENA DE PERJURIO bajo las leyes del Estado de California que el parrafo anterior es verdadero y correcto.'
      : 'I certify under PENALTY OF PERJURY under the laws of the State of California that the foregoing paragraph is true and correct.';
    y = wrap(penaltyText, m, y, cw, 5);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.text(lang === 'es' ? 'ATESTIGUO mi firma y sello oficial.' : 'WITNESS my hand and official seal.', m, y);
    y += 15;
    doc.text((lang === 'es' ? 'Firma del Notario: ' : 'Notary Public Signature: ') + '________________________________________', m, y);
    y += 20;

    // Seal box
    y = newPage(y, 45);
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(m, y, 50, 35);
    doc.setFontSize(9);
    doc.text('(Seal)', m + 18, y + 18);

    // ============================================
    // NOTICE TO AGENT (California Probate Code § 4128)
    // ============================================
    doc.addPage();
    y = 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'AVISO A LA PERSONA QUE ACEPTA' : 'NOTICE TO PERSON ACCEPTING', pw/2, y, {align: 'center'});
    y += 6;
    doc.text(lang === 'es' ? 'NOMBRAMIENTO COMO APODERADO' : 'APPOINTMENT AS ATTORNEY-IN-FACT', pw/2, y, {align: 'center'});
    y += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const agentNotice = lang === 'es'
      ? `Al actuar o aceptar actuar como el agente (apoderado) bajo este poder notarial, usted asume las responsabilidades fiduciarias y otras responsabilidades legales de un agente. Estas responsabilidades incluyen:

1. El deber legal de actuar unicamente en interes del poderdante y evitar conflictos de interes.

2. El deber legal de mantener la propiedad del poderdante separada y distinta de cualquier otra propiedad que usted posea o controle.

No puede transferir la propiedad del poderdante a usted mismo sin una contraprestacion completa y adecuada, ni aceptar un regalo de la propiedad del poderdante a menos que este poder notarial lo autorice especificamente a transferir propiedad a usted mismo o aceptar un regalo de la propiedad del poderdante. Si transfiere la propiedad del poderdante a usted mismo sin autorizacion especifica en el poder notarial, puede ser procesado por fraude y/o malversacion.

Si el poderdante tiene 65 anos de edad o mas en el momento en que la propiedad le es transferida sin autorizacion, tambien puede ser procesado por abuso de ancianos bajo la Seccion 368 del Codigo Penal. Ademas del enjuiciamiento penal, tambien puede ser demandado en un tribunal civil.`
      : `By acting or agreeing to act as the agent (attorney-in-fact) under this power of attorney you assume the fiduciary and other legal responsibilities of an agent. These responsibilities include:

1. The legal duty to act solely in the interest of the principal and to avoid conflicts of interest.

2. The legal duty to keep the principal's property separate and distinct from any other property owned or controlled by you.

You may not transfer the principal's property to yourself without full and adequate consideration or accept a gift of the principal's property unless this power of attorney specifically authorizes you to transfer property to yourself or accept a gift of the principal's property. If you transfer the principal's property to yourself without specific authorization in the power of attorney, you may be prosecuted for fraud and/or embezzlement.

If the principal is 65 years of age or older at the time that the property is transferred to you without authority, you may also be prosecuted for elder abuse under Penal Code Section 368. In addition to criminal prosecution, you may also be sued in civil court.`;

    y = wrap(agentNotice, m, y, cw, 5);
    y += 15;

    doc.setFont('helvetica', 'bold');
    const acknowledgment = lang === 'es'
      ? 'He leido el aviso anterior y entiendo los deberes legales y fiduciarios que asumo al actuar o aceptar actuar como el agente (apoderado) bajo los terminos de este poder notarial.'
      : 'I have read the foregoing notice and I understand the legal and fiduciary duties that I assume by acting or agreeing to act as the agent (attorney-in-fact) under the terms of this power of attorney.';
    y = wrap(acknowledgment, m, y, cw, 5);
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.text((lang === 'es' ? 'Fecha: ' : 'Date: ') + '___________________', m, y);
    y += 20;
    doc.line(m, y, m + 80, y);
    y += 5;
    doc.text((lang === 'es' ? 'Firma de ' : 'Signature of ') + (d.agent_name || 'Agent'), m, y);

    // ============================================
    // FOOTER ON ALL PAGES
    // ============================================
    const pageCount = doc.internal.getNumberOfPages();
    const footer = 'Multi Servicios 360 | www.multiservicios360.net | 855.246.7274';
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(footer, pw/2, 290, {align: 'center'});
      doc.text((lang === 'es' ? 'Pagina ' : 'Page ') + i + (lang === 'es' ? ' de ' : ' of ') + pageCount, pw - m, 290, {align: 'right'});
      doc.setTextColor(0);
    }

    doc.save(`POA_${(d.principal_name || 'Document').replace(/\s+/g, '_')}_${lang.toUpperCase()}.pdf`);
  };

 const handlePrint = () => {
  const doc = generatePDF(matterData.intake_data, language);
  doc.autoPrint();
  window.open(doc.output('bloburl'), '_blank');
};

  const handleEmail = () => {
    const subject = encodeURIComponent(language === 'es' ? 'Poder Notarial - Multi Servicios 360' : 'Power of Attorney - Multi Servicios 360');
    const body = encodeURIComponent(language === 'es' 
      ? 'Adjunto encontrara su Poder Notarial. Por favor descargue los documentos PDF desde su cuenta.\n\nMulti Servicios 360\n855.246.7274' 
      : 'Please find attached your Power of Attorney documents. Please download the PDF documents from your account.\n\nMulti Servicios 360\n855.246.7274');
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F9FF', padding: '24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '12px', padding: '48px 32px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#059669' }}>
          <CheckIcon />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>{t.title}</h1>
        <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '24px' }}>{t.subtitle}</p>
        
        {matterId && (
          <div style={{ backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '12px', marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>{t.orderNumber}</p>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#1F2937', margin: '4px 0 0', wordBreak: 'break-all' }}>{matterId}</p>
          </div>
        )}

        <p style={{ color: '#6B7280', marginBottom: '32px' }}>{t.thankYou}</p>

        {/* 4 Buttons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {/* Primary PDF Button - Always show in user's language */}
          <button onClick={() => generatePDF(language === 'es')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            <DownloadIcon /> {language === 'es' ? t.downloadSpanish : t.downloadEnglish}
          </button>
          
          {/* Secondary PDF Button - Only show English if user chose Spanish */}
          {language === 'es' ? (
            <button onClick={() => generatePDF(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              <DownloadIcon /> {t.downloadEnglish}
            </button>
          ) : (
            <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              <PrintIcon /> {t.print}
            </button>
          )}
          
          {/* Print Button - Only show if Spanish (since English users get it in second slot) */}
          {language === 'es' && (
            <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              <PrintIcon /> {t.print}
            </button>
          )}
          
          {/* Email Button */}
          <button onClick={handleEmail} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            <EmailIcon /> {t.email}
          </button>
        </div>

        {/* Legal Note for Spanish users */}
        {language === 'es' && t.legalNote && (
          <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', padding: '12px', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: '#92400E', margin: 0 }}>{t.legalNote}</p>
          </div>
        )}

        <div style={{ textAlign: 'left', backgroundColor: '#EFF6FF', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E40AF', marginBottom: '12px' }}>{t.nextSteps}</h3>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#1E40AF' }}>
            <li style={{ marginBottom: '8px' }}>{t.step1}</li>
            <li style={{ marginBottom: '8px' }}>{t.step2}</li>
            <li style={{ marginBottom: '8px' }}>{t.step3}</li>
            <li>{t.step4}</li>
          </ol>
        </div>

        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
          <p style={{ color: '#6B7280', marginBottom: '8px' }}>{t.questions}</p>
          <p style={{ fontWeight: '600', color: '#1F2937' }}>{t.contact}</p>
        </div>

        <a href="/" style={{ display: 'inline-block', marginTop: '24px', padding: '12px 24px', color: '#2563EB', border: '2px solid #2563EB', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
          {t.backHome}
        </a>
      </div>
      <div style={{ textAlign: 'center', padding: '24px', color: '#6B7280', fontSize: '12px' }}>
        Multi Servicios 360 | www.multiservicios360.net | 855.246.7274
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}
