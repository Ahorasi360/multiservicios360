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
    const m = 20;
    const pw = 210;
    const cw = pw - 40;
    let y = 15;

    const wrap = (text, x, startY, maxW, lh = 5) => {
      const lines = doc.splitTextToSize(text || '', maxW);
      lines.forEach((line, i) => doc.text(line, x, startY + (i * lh)));
      return startY + (lines.length * lh);
    };

    const newPage = (currentY, need = 30) => {
      if (currentY > 270 - need) { doc.addPage(); return 20; }
      return currentY;
    };

    const section = (title, content) => {
      y = newPage(y, 25);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(title, m, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      y = wrap(content, m, y, cw, 5);
      y += 6;
    };

    // ============================================
    // TITLE PAGE
    // ============================================
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'PODER NOTARIAL GENERAL DURADERO' : 'CALIFORNIA GENERAL DURABLE', pw/2, y, {align: 'center'});
    y += 7;
    doc.setFontSize(16);
    doc.text(lang === 'es' ? 'ESTADO DE CALIFORNIA' : 'POWER OF ATTORNEY', pw/2, y, {align: 'center'});
    y += 6;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.text(lang === 'es' ? '(Formato Largo / Comprensivo)' : '(Long-Form / Comprehensive)', pw/2, y, {align: 'center'});
    y += 4;
    doc.setLineWidth(0.5);
    doc.line(m, y, pw - m, y);
    y += 10;

    // ============================================
    // NOTICE TO PRINCIPAL
    // ============================================
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'AVISO AL PODERDANTE' : 'NOTICE TO PRINCIPAL', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const notice = lang === 'es'
      ? 'Este Poder Notarial otorga a la persona que usted designe como su Apoderado amplia autoridad para administrar su propiedad y asuntos financieros. Esta autoridad puede incluir el poder de vender, traspasar, gravar o disponer de bienes inmuebles y personales sin aviso adicional. Este Poder Notarial no autoriza decisiones medicas o de atencion de salud. Antes de firmar este documento, debe comprender su contenido y efecto legal.'
      : 'This Power of Attorney grants the person you designate as your Attorney-in-Fact broad authority to manage your property and financial affairs. This authority may include the power to sell, convey, encumber, or otherwise dispose of real and personal property without further notice to you. This Power of Attorney does not authorize medical or health care decisions. Before signing this document, you should understand its contents and legal effect.';
    y = wrap(notice, m, y, cw, 5);
    y += 8;

    // ============================================
    // ARTICLE I - IDENTIFICATION OF PARTIES
    // ============================================
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO I - IDENTIFICACION DE LAS PARTES' : 'ARTICLE I - IDENTIFICATION OF PARTIES', m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    // Principal info with AKA names
    let principalText = lang === 'es'
      ? `Yo, ${d.principal_name || '___'}`
      : `I, ${d.principal_name || '___'}`;
    
    // Add AKA names if present
    if (d.has_aka && d.aka_names) {
      principalText += lang === 'es'
        ? `, tambien conocido como ${d.aka_names}`
        : `, also known as ${d.aka_names}`;
    }
    
    // Add address and county
    principalText += lang === 'es'
      ? `, con domicilio en ${d.principal_address || '___'}`
      : `, residing at ${d.principal_address || '___'}`;
    
    if (d.principal_county) {
      principalText += lang === 'es'
        ? `, Condado de ${d.principal_county}`
        : `, County of ${d.principal_county}`;
    }
    
    principalText += lang === 'es'
      ? `, Estado de California, por medio del presente designo a:`
      : `, State of California, hereby appoint:`;
    
    y = wrap(principalText, m, y, cw, 5);
    y += 6;

    // Agent info
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'APODERADO PRINCIPAL:' : 'PRIMARY AGENT:', m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    let agentText = `${d.agent_name || '___'}`;
    agentText += lang === 'es'
      ? `, con domicilio en ${d.agent_address || '___'}`
      : `, residing at ${d.agent_address || '___'}`;
    if (d.agent_relationship) {
      agentText += lang === 'es'
        ? ` (Relacion: ${d.agent_relationship})`
        : ` (Relationship: ${d.agent_relationship})`;
    }
    y = wrap(agentText, m, y, cw, 5);
    y += 6;

    // Successor Agent (if selected)
    if (d.wants_successor && d.successor_agent) {
      y = newPage(y, 20);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'APODERADO SUCESOR:' : 'SUCCESSOR AGENT:', m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      let successorText = `${d.successor_agent}`;
      if (d.successor_address) {
        successorText += lang === 'es'
          ? `, con domicilio en ${d.successor_address}`
          : `, residing at ${d.successor_address}`;
      }
      if (d.successor_relationship) {
        successorText += lang === 'es'
          ? ` (Relacion: ${d.successor_relationship})`
          : ` (Relationship: ${d.successor_relationship})`;
      }
      y = wrap(successorText, m, y, cw, 5);
      y += 4;
      
      const successorClause = lang === 'es'
        ? 'Si mi Apoderado Principal no puede o no quiere servir, o deja de actuar como mi Apoderado, designo al Apoderado Sucesor mencionado anteriormente para actuar en su lugar con todos los mismos poderes y autoridad.'
        : 'If my Primary Agent is unable or unwilling to serve, or ceases to act as my Agent, I appoint the Successor Agent named above to act in their place with all the same powers and authority.';
      y = wrap(successorClause, m, y, cw, 5);
      y += 6;
    }

    // ============================================
    // ARTICLE II - DURABILITY AND EFFECTIVE DATE
    // ============================================
    y = newPage(y, 35);
    section(lang === 'es' ? 'ARTICULO II - DURABILIDAD Y FECHA EFECTIVA' : 'ARTICLE II - DURABILITY AND EFFECTIVE DATE',
      d.durable
        ? (lang === 'es'
          ? 'Este Poder Notarial es DURADERO y NO SERA AFECTADO por mi incapacidad posterior, conforme a la Seccion 4124 del Codigo de Sucesiones de California. Mi Apoderado conservara toda la autoridad otorgada en este documento incluso si quedo incapacitado o discapacitado.'
          : 'This Power of Attorney is DURABLE and shall NOT BE AFFECTED by my subsequent incapacity, pursuant to California Probate Code Section 4124. My Agent shall retain all authority granted herein even if I become incapacitated or disabled.')
        : (lang === 'es'
          ? 'Este Poder Notarial NO es duradero y terminara automaticamente si quedo incapacitado o discapacitado.'
          : 'This Power of Attorney is NOT durable and shall automatically terminate upon my incapacity or disability.')
    );
    
    doc.setFontSize(11);
    const effective = d.effective_when === 'immediately'
      ? (lang === 'es' 
        ? 'FECHA EFECTIVA: Este Poder Notarial sera efectivo INMEDIATAMENTE al ser ejecutado y permanecera en efecto hasta que sea revocado o termine por operacion de ley.' 
        : 'EFFECTIVE DATE: This Power of Attorney shall be effective IMMEDIATELY upon execution and shall remain in effect until revoked or terminated by operation of law.')
      : (lang === 'es' 
        ? 'FECHA EFECTIVA: Este Poder Notarial es un "Poder Contingente" (Springing Power) y sera efectivo UNICAMENTE al momento de mi incapacidad, segun lo determine un medico licenciado mediante declaracion escrita.' 
        : 'EFFECTIVE DATE: This Power of Attorney is a "Springing Power" and shall become effective ONLY upon my incapacity, as determined by a licensed physician in a written declaration.');
    y = wrap(effective, m, y, cw, 5);
    y += 8;

    // ============================================
    // ARTICLE III - REVOCATION OF PRIOR POWERS
    // ============================================
    section(lang === 'es' ? 'ARTICULO III - REVOCACION DE PODERES ANTERIORES' : 'ARTICLE III - REVOCATION OF PRIOR POWERS',
      lang === 'es'
        ? 'Por medio del presente revoco todos los poderes notariales generales e instrumentos similares previamente ejecutados por mi, excepto cualquier Directiva de Atencion Medica por Anticipado o Poder Notarial para Atencion Medica que permanecera en pleno vigor y efecto.'
        : 'I hereby revoke all prior general powers of attorney and similar instruments previously executed by me, except any Advance Health Care Directive or Health Care Power of Attorney which shall remain in full force and effect.'
    );

    // ============================================
    // ARTICLE IV - GENERAL GRANT OF AUTHORITY
    // ============================================
    section(lang === 'es' ? 'ARTICULO IV - OTORGAMIENTO GENERAL DE AUTORIDAD' : 'ARTICLE IV - GENERAL GRANT OF AUTHORITY',
      lang === 'es'
        ? 'Otorgo a mi Apoderado pleno poder y autoridad para actuar por mi y en mi nombre en cualquier manera legal con respecto a los siguientes asuntos, en la maxima extension permitida bajo la ley de California, incluyendo pero no limitado a las acciones especificamente enumeradas a continuacion.'
        : 'I grant my Agent full power and authority to act for me and in my name in any lawful manner with respect to the following matters, to the fullest extent permitted under California law, including but not limited to the actions specifically enumerated below.'
    );

    // ============================================
    // ARTICLE V - SPECIFIC POWERS GRANTED
    // ============================================
    y = newPage(y, 60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO V - PODERES ESPECIFICOS OTORGADOS' : 'ARTICLE V - SPECIFIC POWERS GRANTED', m, y);
    y += 8;

    const powers = [
      { key: 'powers_real_estate', letter: 'A', titleEn: 'Real Property Transactions', titleEs: 'Transacciones de Bienes Inmuebles',
        textEn: 'To acquire, purchase, sell, convey, transfer, exchange, partition, lease, sublease, manage, improve, insure, encumber, mortgage, refinance, or otherwise deal with any real property or interest therein, including the execution and recording of grant deeds, trust transfer deeds, quitclaim deeds, deeds of trust, reconveyances, leases, and all related instruments.',
        textEs: 'Adquirir, comprar, vender, traspasar, transferir, intercambiar, dividir, arrendar, subarrendar, administrar, mejorar, asegurar, gravar, hipotecar, refinanciar o de otra manera manejar cualquier bien inmueble o interes en el mismo, incluyendo la ejecucion y registro de escrituras de concesion, escrituras de transferencia de fideicomiso, escrituras de renuncia, escrituras de fideicomiso, reconveyances, arrendamientos y todos los instrumentos relacionados.' },
      { key: 'powers_banking', letter: 'B', titleEn: 'Banking and Financial Institutions', titleEs: 'Banca e Instituciones Financieras',
        textEn: 'To open, close, modify, and transact business on checking accounts, savings accounts, money market accounts, certificates of deposit, and other deposit accounts at any bank, savings and loan, credit union, or other financial institution; to deposit and withdraw funds by any means; to endorse, negotiate, and collect checks, drafts, and other negotiable instruments; to obtain statements, records, and information concerning my accounts.',
        textEs: 'Abrir, cerrar, modificar y realizar transacciones en cuentas de cheques, cuentas de ahorros, cuentas de mercado de dinero, certificados de deposito y otras cuentas de deposito en cualquier banco, asociacion de ahorro y prestamo, cooperativa de credito u otra institucion financiera; depositar y retirar fondos por cualquier medio; endosar, negociar y cobrar cheques, giros y otros instrumentos negociables; obtener estados de cuenta, registros e informacion sobre mis cuentas.' },
      { key: 'powers_stocks', letter: 'C', titleEn: 'Investments and Securities', titleEs: 'Inversiones y Valores',
        textEn: 'To purchase, sell, exchange, trade, surrender, tender, vote proxies, and otherwise manage stocks, bonds, mutual funds, exchange-traded funds, options, commodities, futures contracts, and other investment securities; to open, modify, and close brokerage accounts; to exercise subscription rights and conversion privileges.',
        textEs: 'Comprar, vender, intercambiar, negociar, entregar, ofrecer, votar poderes y de otra manera administrar acciones, bonos, fondos mutuos, fondos cotizados en bolsa, opciones, materias primas, contratos de futuros y otros valores de inversion; abrir, modificar y cerrar cuentas de corretaje; ejercer derechos de suscripcion y privilegios de conversion.' },
      { key: 'powers_business', letter: 'D', titleEn: 'Business Operating Transactions', titleEs: 'Operaciones Comerciales',
        textEn: 'To form, operate, manage, reorganize, merge, consolidate, dissolve, or sell any sole proprietorship, partnership, limited liability company, corporation, or other business entity; to acquire or dispose of ownership interests; to execute operating agreements, partnership agreements, shareholder agreements, buy-sell agreements, and related documents.',
        textEs: 'Formar, operar, administrar, reorganizar, fusionar, consolidar, disolver o vender cualquier empresa individual, sociedad, compania de responsabilidad limitada, corporacion u otra entidad comercial; adquirir o disponer de participaciones; ejecutar acuerdos operativos, acuerdos de sociedad, acuerdos de accionistas, acuerdos de compra-venta y documentos relacionados.' },
      { key: 'powers_insurance', letter: 'E', titleEn: 'Insurance and Annuities', titleEs: 'Seguros y Anualidades',
        textEn: 'To purchase, maintain, modify, surrender, cancel, or collect proceeds and benefits from life insurance, health insurance, disability insurance, long-term care insurance, property insurance, liability insurance, and annuity contracts; to designate and change beneficiaries where permitted; to borrow against cash values.',
        textEs: 'Comprar, mantener, modificar, entregar, cancelar o cobrar beneficios y ganancias de seguros de vida, seguros de salud, seguros de discapacidad, seguros de cuidado a largo plazo, seguros de propiedad, seguros de responsabilidad y contratos de anualidades; designar y cambiar beneficiarios donde este permitido; tomar prestamos contra valores en efectivo.' },
      { key: 'powers_retirement', letter: 'F', titleEn: 'Retirement Plans and Accounts', titleEs: 'Planes y Cuentas de Jubilacion',
        textEn: 'To contribute to, withdraw from, rollover, transfer, and manage Individual Retirement Accounts (IRAs), Roth IRAs, SEP-IRAs, SIMPLE IRAs, 401(k) plans, 403(b) plans, pension plans, profit-sharing plans, and other qualified and non-qualified retirement plans; to make investment elections and beneficiary designations where permitted.',
        textEs: 'Contribuir, retirar, transferir, trasladar y administrar Cuentas Individuales de Jubilacion (IRAs), Roth IRAs, SEP-IRAs, SIMPLE IRAs, planes 401(k), planes 403(b), planes de pension, planes de participacion en las ganancias y otros planes de jubilacion calificados y no calificados; hacer elecciones de inversion y designaciones de beneficiarios donde este permitido.' },
      { key: 'powers_government', letter: 'G', titleEn: 'Government Benefits', titleEs: 'Beneficios Gubernamentales',
        textEn: 'To apply for, receive, manage, and utilize benefits from Social Security Administration, Medicare, Medi-Cal (Medicaid), Veterans Administration, unemployment compensation, workers\' compensation, and other federal, state, or local government programs; to represent me before government agencies and appeal adverse decisions.',
        textEs: 'Solicitar, recibir, administrar y utilizar beneficios de la Administracion del Seguro Social, Medicare, Medi-Cal (Medicaid), Administracion de Veteranos, compensacion por desempleo, compensacion de trabajadores y otros programas gubernamentales federales, estatales o locales; representarme ante agencias gubernamentales y apelar decisiones adversas.' },
      { key: 'powers_litigation', letter: 'H', titleEn: 'Claims and Litigation', titleEs: 'Reclamos y Litigios',
        textEn: 'To assert, pursue, defend, arbitrate, mediate, compromise, settle, dismiss, or abandon any claim, demand, lawsuit, or legal proceeding in which I may be involved; to retain and discharge attorneys, experts, and other professionals; to execute settlement agreements, releases, and related documents.',
        textEs: 'Presentar, perseguir, defender, arbitrar, mediar, comprometer, resolver, desestimar o abandonar cualquier reclamo, demanda, juicio o procedimiento legal en el que pueda estar involucrado; contratar y despedir abogados, expertos y otros profesionales; ejecutar acuerdos de resolucion, liberaciones y documentos relacionados.' },
      { key: 'powers_tax', letter: 'I', titleEn: 'Tax Matters', titleEs: 'Asuntos Fiscales',
        textEn: 'To prepare, sign, and file federal, state, and local income tax returns, gift tax returns, and other tax documents; to represent me before the Internal Revenue Service, California Franchise Tax Board, and other taxing authorities; to execute IRS Forms 2848 (Power of Attorney) and 8821 (Tax Information Authorization); to pay taxes owed and collect refunds; to contest tax assessments and negotiate settlements.',
        textEs: 'Preparar, firmar y presentar declaraciones de impuestos federales, estatales y locales sobre la renta, declaraciones de impuestos sobre donaciones y otros documentos fiscales; representarme ante el Servicio de Impuestos Internos, la Junta de Franquicias de California y otras autoridades fiscales; ejecutar Formularios IRS 2848 (Poder Notarial) y 8821 (Autorizacion de Informacion Fiscal); pagar impuestos adeudados y cobrar reembolsos; impugnar evaluaciones fiscales y negociar acuerdos.' },
    ];

    powers.forEach(p => {
      y = newPage(y, 25);
      const checked = d[p.key] ? '[X]' : '[ ]';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`${checked} ${p.letter}. ${lang === 'es' ? p.titleEs : p.titleEn}`, m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      y = wrap(lang === 'es' ? p.textEs : p.textEn, m + 5, y, cw - 5, 4.5);
      y += 6;
    });

    // ============================================
    // ARTICLE VI - ADVANCED POWERS (HOT POWERS)
    // ============================================
    y = newPage(y, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'ARTICULO VI - PODERES AVANZADOS (PODERES ESPECIALES)' : 'ARTICLE VI - ADVANCED POWERS (HOT POWERS)', m, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    const hotNotice = lang === 'es'
      ? 'AVISO: Los siguientes poderes son considerados "poderes especiales" que requieren autorizacion expresa. Estos poderes permiten a su Apoderado tomar acciones que pueden afectar significativamente su patrimonio.'
      : 'NOTICE: The following powers are considered "hot powers" that require express authorization. These powers allow your Agent to take actions that may significantly affect your estate.';
    y = wrap(hotNotice, m, y, cw, 4.5);
    y += 8;

    // Gift Power with limit
    y = newPage(y, 25);
    const giftChecked = d.hot_gifts ? '[X]' : '[ ]';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`${giftChecked} A. ${lang === 'es' ? 'Poder para Hacer Regalos' : 'Power to Make Gifts'}`, m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    let giftText = lang === 'es'
      ? 'Autorizo a mi Apoderado a hacer regalos de mi propiedad a individuos o instituciones de caridad en mi nombre.'
      : 'I authorize my Agent to make gifts of my property to individuals or charities on my behalf.';
    
    if (d.hot_gifts && d.gift_limit) {
      if (d.gift_limit === 'annual_exclusion') {
        giftText += lang === 'es'
          ? ' Los regalos estan limitados al monto de exclusion anual del impuesto federal sobre donaciones ($18,000 por beneficiario en 2024) por ano calendario.'
          : ' Gifts are limited to the federal gift tax annual exclusion amount ($18,000 per donee in 2024) per calendar year.';
      } else if (d.gift_limit === 'unlimited') {
        giftText += lang === 'es'
          ? ' No hay limite en el monto de los regalos, sujeto al deber fiduciario del Apoderado de actuar en mi mejor interes.'
          : ' There is no limit on the amount of gifts, subject to the Agent\'s fiduciary duty to act in my best interest.';
      } else if (d.gift_limit === 'custom') {
        giftText += lang === 'es'
          ? ' Los regalos estan sujetos a las limitaciones especificas establecidas en las instrucciones especiales de este documento.'
          : ' Gifts are subject to the specific limitations set forth in the special instructions of this document.';
      }
    }
    y = wrap(giftText, m + 5, y, cw - 5, 4.5);
    y += 6;

    // Beneficiary Designation Power
    y = newPage(y, 20);
    const beneficiaryChecked = d.hot_beneficiary ? '[X]' : '[ ]';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`${beneficiaryChecked} B. ${lang === 'es' ? 'Cambio de Designaciones de Beneficiarios' : 'Beneficiary Designation Changes'}`, m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    y = wrap(lang === 'es'
      ? 'Autorizo a mi Apoderado a designar, cambiar o revocar beneficiarios de polizas de seguro de vida, cuentas de jubilacion, cuentas pagaderas al fallecimiento y cuentas de transferencia al fallecimiento, donde lo permita la ley y los terminos de la cuenta.'
      : 'I authorize my Agent to designate, change, or revoke beneficiaries of life insurance policies, retirement accounts, payable-on-death accounts, and transfer-on-death accounts, where permitted by law and the account terms.', m + 5, y, cw - 5, 4.5);
    y += 6;

    // Trust Power
    y = newPage(y, 20);
    const trustChecked = d.hot_trust ? '[X]' : '[ ]';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`${trustChecked} C. ${lang === 'es' ? 'Creacion y Modificacion de Fideicomisos' : 'Trust Creation and Modification'}`, m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    y = wrap(lang === 'es'
      ? 'Autorizo a mi Apoderado a crear, modificar, enmendar, revocar y financiar fideicomisos revocables para mi beneficio, consistente con mi plan patrimonial existente.'
      : 'I authorize my Agent to create, modify, amend, revoke, and fund revocable trusts for my benefit, consistent with my existing estate plan.', m + 5, y, cw - 5, 4.5);
    y += 6;

    // Digital Assets Power (always included)
    y = newPage(y, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`[X] D. ${lang === 'es' ? 'Activos Digitales' : 'Digital Assets'}`, m, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    y = wrap(lang === 'es'
      ? 'Autorizo a mi Apoderado a acceder, administrar, controlar, eliminar, transferir y disponer de mis activos digitales, cuentas en linea, criptomonedas y comunicaciones electronicas, segun lo permita la Ley Revisada Uniforme de Acceso Fiduciario a Activos Digitales (RUFADAA) y otras leyes aplicables.'
      : 'I authorize my Agent to access, manage, control, delete, transfer, and dispose of my digital assets, online accounts, cryptocurrencies, and electronic communications, as permitted by the Revised Uniform Fiduciary Access to Digital Assets Act (RUFADAA) and other applicable laws.', m + 5, y, cw - 5, 4.5);
    y += 8;

    // ============================================
    // ARTICLE VII - HIPAA AUTHORIZATION (if included)
    // ============================================
    if (d.include_hipaa) {
      y = newPage(y, 45);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'ARTICULO VII - AUTORIZACION HIPAA' : 'ARTICLE VII - HIPAA AUTHORIZATION', m, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const hipaaText = lang === 'es'
        ? 'Autorizo a mi Apoderado a acceder, obtener y recibir informacion de salud protegida (PHI) sobre mi de cualquier proveedor de atencion medica, plan de salud u otra entidad cubierta, segun sea necesario para llevar a cabo los poderes financieros otorgados en este Poder Notarial. Esta autorizacion cumple con los requisitos de la Ley de Portabilidad y Responsabilidad del Seguro Medico de 1996 (HIPAA), 45 C.F.R. §§ 164.502 y 164.508.\n\nEsta autorizacion HIPAA es limitada a informacion financiera y de seguros, y NO autoriza a mi Apoderado a tomar decisiones de atencion medica en mi nombre. Dicha autoridad solo puede ser otorgada mediante una Directiva de Atencion Medica por Anticipado separada.'
        : 'I authorize my Agent to access, obtain, and receive protected health information (PHI) about me from any health care provider, health plan, or other covered entity, as necessary to carry out the financial powers granted in this Power of Attorney. This authorization complies with the requirements of the Health Insurance Portability and Accountability Act of 1996 (HIPAA), 45 C.F.R. §§ 164.502 and 164.508.\n\nThis HIPAA authorization is limited to financial and insurance information, and does NOT authorize my Agent to make health care decisions on my behalf. Such authority may only be granted through a separate Advance Health Care Directive.';
      y = wrap(hipaaText, m, y, cw, 4.5);
      y += 8;
    }

    // ============================================
    // ARTICLE VIII - HEALTHCARE EXCLUSION
    // ============================================
    const articleNum = d.include_hipaa ? 'VIII' : 'VII';
    section(lang === 'es' ? `ARTICULO ${articleNum} - EXCLUSION DE ATENCION MEDICA` : `ARTICLE ${articleNum} - HEALTHCARE EXCLUSION`,
      lang === 'es'
        ? 'Este Poder Notarial NO otorga autoridad para tomar decisiones medicas o de atencion de salud, incluyendo decisiones sobre tratamiento medico, hospitalizacion, cirugia, medicamentos, o atencion al final de la vida. Dicha autoridad solo puede otorgarse mediante una Directiva de Atencion Medica por Anticipado separada conforme a la Seccion 4700 y siguientes del Codigo de Sucesiones de California.'
        : 'This Power of Attorney does NOT grant authority to make medical or health care decisions, including decisions regarding medical treatment, hospitalization, surgery, medication, or end-of-life care. Such authority may be granted only by a separate Advance Health Care Directive pursuant to California Probate Code Section 4700 et seq.'
    );

    // ============================================
    // ARTICLE IX - PROTECTIVE PROVISIONS
    // ============================================
    const articleNum2 = d.include_hipaa ? 'IX' : 'VIII';
    y = newPage(y, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? `ARTICULO ${articleNum2} - DISPOSICIONES PROTECTORAS` : `ARTICLE ${articleNum2} - PROTECTIVE PROVISIONS`, m, y);
    y += 8;

    const provisions = [
      { titleEn: 'Third Party Reliance', titleEs: 'Confianza de Terceros',
        textEn: 'Any third party may rely upon the authority granted in this Power of Attorney without inquiry into its validity, scope, or revocation, pursuant to California Probate Code Section 4303. A third party who acts in good faith reliance on this Power of Attorney shall not be liable for any damages arising from such reliance.',
        textEs: 'Cualquier tercero puede confiar en la autoridad otorgada en este Poder Notarial sin indagar sobre su validez, alcance o revocacion, conforme a la Seccion 4303 del Codigo de Sucesiones de California. Un tercero que actue de buena fe confiando en este Poder Notarial no sera responsable de ningun dano que surja de dicha confianza.' },
      { titleEn: 'Agent Liability and Indemnification', titleEs: 'Responsabilidad e Indemnizacion del Apoderado',
        textEn: 'My Agent shall not be liable for any actions taken in good faith under this Power of Attorney, except for actions constituting willful misconduct, gross negligence, or breach of fiduciary duty. My Agent shall be indemnified from my estate for any liability arising from good faith actions taken pursuant to this Power of Attorney.',
        textEs: 'Mi Apoderado no sera responsable por acciones tomadas de buena fe bajo este Poder Notarial, excepto por acciones que constituyan conducta intencional indebida, negligencia grave o incumplimiento del deber fiduciario. Mi Apoderado sera indemnizado de mi patrimonio por cualquier responsabilidad que surja de acciones de buena fe tomadas conforme a este Poder Notarial.' },
      { titleEn: 'Compensation and Reimbursement', titleEs: 'Compensacion y Reembolso',
        textEn: 'My Agent is entitled to reasonable compensation for services rendered and reimbursement of all reasonable expenses incurred in the performance of duties under this Power of Attorney, unless compensation is expressly waived in writing.',
        textEs: 'Mi Apoderado tiene derecho a una compensacion razonable por los servicios prestados y al reembolso de todos los gastos razonables incurridos en el desempeno de sus deberes bajo este Poder Notarial, a menos que la compensacion sea expresamente renunciada por escrito.' },
      { titleEn: 'Severability', titleEs: 'Separabilidad',
        textEn: 'If any provision of this Power of Attorney is held invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect to the maximum extent permitted by law.',
        textEs: 'Si alguna disposicion de este Poder Notarial es considerada invalida, ilegal o inaplicable por un tribunal de jurisdiccion competente, las disposiciones restantes permaneceran en pleno vigor y efecto en la maxima extension permitida por la ley.' },
    ];

    provisions.forEach(p => {
      y = newPage(y, 18);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? p.titleEs : p.titleEn, m, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      y = wrap(lang === 'es' ? p.textEs : p.textEn, m, y, cw, 4.5);
      y += 5;
    });

    // ============================================
    // ARTICLE X - TERMINATION AND GOVERNING LAW
    // ============================================
    const articleNum3 = d.include_hipaa ? 'X' : 'IX';
    section(lang === 'es' ? `ARTICULO ${articleNum3} - TERMINACION Y LEY APLICABLE` : `ARTICLE ${articleNum3} - TERMINATION AND GOVERNING LAW`,
      lang === 'es'
        ? 'Este Poder Notarial terminara automaticamente: (a) a mi fallecimiento; (b) por mi revocacion escrita entregada a mi Apoderado; (c) por orden de un tribunal de jurisdiccion competente; o (d) si este Poder Notarial no es duradero, al momento de mi incapacidad. Este Poder Notarial se regira e interpretara de acuerdo con las leyes del Estado de California.'
        : 'This Power of Attorney shall terminate automatically: (a) upon my death; (b) by my written revocation delivered to my Agent; (c) by order of a court of competent jurisdiction; or (d) if this Power of Attorney is not durable, upon my incapacity. This Power of Attorney shall be governed by and construed in accordance with the laws of the State of California.'
    );

    // ============================================
    // SPECIAL INSTRUCTIONS (if any)
    // ============================================
    if (d.has_special_instructions && d.special_instructions) {
      y = newPage(y, 30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'INSTRUCCIONES ESPECIALES Y LIMITACIONES' : 'SPECIAL INSTRUCTIONS AND LIMITATIONS', m, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      y = wrap(d.special_instructions, m, y, cw, 5);
      y += 8;
    }

    // ============================================
    // RECORDING NOTICE (if for real estate)
    // ============================================
    if (d.record_for_real_estate) {
      y = newPage(y, 25);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'es' ? 'AVISO DE REGISTRO' : 'RECORDING NOTICE', m, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      let recordingText = lang === 'es'
        ? 'Este Poder Notarial esta destinado a ser registrado con el Registrador del Condado para su uso en transacciones de bienes raices.'
        : 'This Power of Attorney is intended to be recorded with the County Recorder for use in real property transactions.';
      if (d.recording_county) {
        recordingText += lang === 'es'
          ? ` Condado previsto para registro: ${d.recording_county}.`
          : ` Intended recording county: ${d.recording_county}.`;
      }
      y = wrap(recordingText, m, y, cw, 5);
      y += 8;
    }

    // ============================================
    // EXECUTION PAGE
    // ============================================
    y = newPage(y, 80);
    const articleNum4 = d.include_hipaa ? 'XI' : 'X';
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? `ARTICULO ${articleNum4} - EJECUCION` : `ARTICLE ${articleNum4} - EXECUTION`, m, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(lang === 'es' 
      ? 'EN FE DE LO CUAL, he ejecutado este Poder Notarial General Duradero en la fecha indicada a continuacion.' 
      : 'IN WITNESS WHEREOF, I have executed this General Durable Power of Attorney on the date written below.', m, y);
    y += 12;
    doc.text((lang === 'es' ? 'Fecha de Ejecucion: ' : 'Date of Execution: ') + '________________________', m, y);
    y += 20;
    doc.line(m, y, m + 100, y);
    y += 6;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(d.principal_name || '________________________', m, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(lang === 'es' ? 'Poderdante (Principal)' : 'Principal', m, y);

    // ============================================
    // NOTARY ACKNOWLEDGMENT - NEW PAGE
    // ============================================
    doc.addPage();
    y = 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'RECONOCIMIENTO NOTARIAL DE CALIFORNIA' : 'CALIFORNIA ALL-PURPOSE ACKNOWLEDGMENT', pw/2, y, {align: 'center'});
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(lang === 'es' ? '(Codigo Civil de California §1189)' : '(California Civil Code §1189)', pw/2, y, {align: 'center'});
    y += 3;
    doc.line(m, y, pw - m, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('State of California', m, y);
    y += 7;
    doc.text('County of ' + (d.principal_county || '______________________________'), m, y);
    y += 12;

    doc.text('On _________________________ before me, _________________________________________,', m, y);
    y += 5;
    doc.setFontSize(9);
    doc.text('         (Date)                                                               (Notary Name and Title)', m + 5, y);
    y += 10;

    doc.setFontSize(11);
    doc.text('personally appeared ' + (d.principal_name || '________________________________________________') + ',', m, y);
    y += 12;

    doc.setFontSize(10);
    const notaryText = 'who proved to me on the basis of satisfactory evidence to be the person(s) whose name(s) is/are subscribed to the within instrument and acknowledged to me that he/she/they executed the same in his/her/their authorized capacity(ies), and that by his/her/their signature(s) on the instrument the person(s), or the entity upon behalf of which the person(s) acted, executed the instrument.';
    y = wrap(notaryText, m, y, cw, 5.5);
    y += 12;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('I certify under PENALTY OF PERJURY under the laws of the State of California', m, y);
    y += 6;
    doc.text('that the foregoing paragraph is true and correct.', m, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.text('WITNESS my hand and official seal.', m, y);
    y += 18;

    doc.text('Notary Public Signature: ________________________________________', m, y);
    y += 8;
    doc.text('My Commission Expires: _________________________________________', m, y);
    y += 25;

    // Seal box
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(m, y, 60, 45);
    doc.setFontSize(10);
    doc.text('NOTARY SEAL', m + 18, y + 20);
    doc.text('(Sello Notarial)', m + 16, y + 26);

    // ============================================
    // OPTIONAL: WITNESS ATTESTATION PAGE
    // ============================================
    doc.addPage();
    y = 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'DECLARACION DE TESTIGOS (OPCIONAL)' : 'WITNESS ATTESTATION (OPTIONAL)', pw/2, y, {align: 'center'});
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(lang === 'es' ? '(No requerido por ley de California, pero recomendado)' : '(Not required by California law, but recommended)', pw/2, y, {align: 'center'});
    y += 3;
    doc.line(m, y, pw - m, y);
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const witnessText = lang === 'es'
      ? 'Nosotros, los abajo firmantes, declaramos bajo pena de perjurio bajo las leyes del Estado de California que el Poderdante firmo este Poder Notarial en nuestra presencia, y que a nuestro leal saber y entender el Poderdante es mayor de dieciocho (18) anos de edad, de mente sana, y bajo ninguna restriccion o influencia indebida.\n\nDeclaramos ademas que no somos el Apoderado designado en este documento, que no estamos relacionados con el Poderdante por sangre, matrimonio o adopcion, y que no tenemos derecho a ninguna parte del patrimonio del Poderdante al fallecer bajo un testamento o por operacion de ley.'
      : 'We, the undersigned, declare under penalty of perjury under the laws of the State of California that the Principal signed this Power of Attorney in our presence, and that to the best of our knowledge the Principal is over eighteen (18) years of age, of sound mind, and under no constraint or undue influence.\n\nWe further declare that we are not the Agent designated in this document, that we are not related to the Principal by blood, marriage, or adoption, and that we are not entitled to any part of the Principal\'s estate upon death under a will or by operation of law.';
    y = wrap(witnessText, m, y, cw, 5);
    y += 20;

    // Witness 1
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'TESTIGO 1:' : 'WITNESS 1:', m, y);
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.line(m, y, m + 80, y);
    doc.text(lang === 'es' ? 'Firma' : 'Signature', m, y + 5);
    doc.line(m + 100, y, pw - m, y);
    doc.text(lang === 'es' ? 'Fecha' : 'Date', m + 100, y + 5);
    y += 15;
    doc.line(m, y, m + 80, y);
    doc.text(lang === 'es' ? 'Nombre Impreso' : 'Printed Name', m, y + 5);
    y += 15;
    doc.line(m, y, pw - m, y);
    doc.text(lang === 'es' ? 'Direccion' : 'Address', m, y + 5);
    y += 25;

    // Witness 2
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'es' ? 'TESTIGO 2:' : 'WITNESS 2:', m, y);
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.line(m, y, m + 80, y);
    doc.text(lang === 'es' ? 'Firma' : 'Signature', m, y + 5);
    doc.line(m + 100, y, pw - m, y);
    doc.text(lang === 'es' ? 'Fecha' : 'Date', m + 100, y + 5);
    y += 15;
    doc.line(m, y, m + 80, y);
    doc.text(lang === 'es' ? 'Nombre Impreso' : 'Printed Name', m, y + 5);
    y += 15;
    doc.line(m, y, pw - m, y);
    doc.text(lang === 'es' ? 'Direccion' : 'Address', m, y + 5);

    // ============================================
    // FOOTER ON ALL PAGES
    // ============================================
    const pc = doc.internal.getNumberOfPages();
    const footer = 'Multi Servicios 360 | www.multiservicios360.net | 855.246.7274';
    for (let i = 1; i <= pc; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(footer, pw/2, 290, {align: 'center'});
      doc.text((lang === 'es' ? 'Pagina ' : 'Page ') + i + (lang === 'es' ? ' de ' : ' of ') + pc, pw - m, 290, {align: 'right'});
      doc.setTextColor(0);
    }

    // Save the PDF
    const fileName = `POA_${(d.principal_name || 'Document').replace(/\s+/g, '_')}_${lang.toUpperCase()}.pdf`;
    doc.save(fileName);
  };

  const handlePrint = () => {
    window.print();
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #E5E7EB', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#6B7280' }}>{language === 'es' ? 'Cargando...' : 'Loading...'}</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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

        {/* Download Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <button onClick={() => generatePDF(language === 'es')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            <DownloadIcon /> {language === 'es' ? t.downloadSpanish : t.downloadEnglish}
          </button>
          
          {language === 'es' ? (
            <button onClick={() => generatePDF(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              <DownloadIcon /> {t.downloadEnglish}
            </button>
          ) : (
            <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              <PrintIcon /> {t.print}
            </button>
          )}
          
          {language === 'es' && (
            <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              <PrintIcon /> {t.print}
            </button>
          )}
          
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

        {/* Next Steps */}
        <div style={{ textAlign: 'left', backgroundColor: '#EFF6FF', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E40AF', marginBottom: '12px' }}>{t.nextSteps}</h3>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#1E40AF' }}>
            <li style={{ marginBottom: '8px' }}>{t.step1}</li>
            <li style={{ marginBottom: '8px' }}>{t.step2}</li>
            <li style={{ marginBottom: '8px' }}>{t.step3}</li>
            <li>{t.step4}</li>
          </ol>
        </div>

        {/* Contact */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
          <p style={{ color: '#6B7280', marginBottom: '8px' }}>{t.questions}</p>
          <p style={{ fontWeight: '600', color: '#1F2937' }}>{t.contact}</p>
        </div>

        <a href="/" style={{ display: 'inline-block', marginTop: '24px', padding: '12px 24px', color: '#2563EB', border: '2px solid #2563EB', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
          {t.backHome}
        </a>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px', color: '#6B7280', fontSize: '12px' }}>
        Multi Servicios 360 | www.multiservicios360.net | 855.246.7274
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF' }}>
        <p style={{ color: '#6B7280' }}>Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}