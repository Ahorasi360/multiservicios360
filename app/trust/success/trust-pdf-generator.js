"use client";
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';

const CA_NOTARY_PDF_URL = '/api/ca-notary-pdf';
// ============================================================
// CALIFORNIA LIVING TRUST - ATTORNEY-GRADE PDF GENERATOR
// Version 2.1 - Fixed box padding and page numbering
// Target: 18-25 pages minimum
// ============================================================

export function generateTrustPDF(intakeData, tier = 'trust_plus', agreementData = null) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;
  let articleNum = 0;
  let sectionNum = 0;

  // ============ HELPER FUNCTIONS ============
  const addPage = () => { doc.addPage(); y = margin; };
  
  const checkPageBreak = (needed = 20) => {
    if (y + needed > pageHeight - 25) addPage();
  };

  const centerText = (text, fontSize = 12, style = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('times', style);
    doc.text(text, pageWidth / 2, y, { align: 'center' });
    y += fontSize * 0.45;
  };

  const addArticle = (title) => {
    articleNum++;
    sectionNum = 0;
    checkPageBreak(25);
    y += 10;
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text(`ARTICLE ${toRoman(articleNum)}`, margin, y);
    y += 6;
    doc.text(title.toUpperCase(), margin, y);
    y += 10;
  };

  const addSection = (title, content) => {
    sectionNum++;
    checkPageBreak(25);
    doc.setFontSize(11);
    doc.setFont('times', 'bold');
    doc.text(`Section ${articleNum}.${sectionNum}. ${title}`, margin, y);
    y += 6;
    if (content) {
      doc.setFont('times', 'normal');
      const lines = doc.splitTextToSize(content, contentWidth);
      lines.forEach(line => {
        checkPageBreak(6);
        doc.text(line, margin, y);
        y += 5;
      });
      y += 4;
    }
  };

  const addSubsection = (letter, title, content) => {
    checkPageBreak(20);
    doc.setFontSize(11);
    doc.setFont('times', 'bold');
    doc.text(`(${letter}) ${title}.`, margin + 10, y);
    y += 6;
    if (content) {
      doc.setFont('times', 'normal');
      const lines = doc.splitTextToSize(content, contentWidth - 15);
      lines.forEach(line => {
        checkPageBreak(6);
        doc.text(line, margin + 10, y);
        y += 5;
      });
      y += 3;
    }
  };

  const addText = (content, indent = 0) => {
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    const lines = doc.splitTextToSize(content, contentWidth - indent);
    lines.forEach(line => {
      checkPageBreak(6);
      doc.text(line, margin + indent, y);
      y += 5;
    });
    y += 3;
  };

  const toRoman = (num) => {
    const numerals = ['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];
    return numerals[num] || String(num);
  };

  // Format name to Title Case
  const formatName = (name) => {
    if (!name) return '[NAME]';
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // ============ EXTRACT AND FORMAT DATA ============
  const d = intakeData || {};
  const trustorName = formatName(d.trustor_name || d.full_legal_name);
  const trustorAddress = d.trustor_address || d.address || '[ADDRESS]';
  const spouseName = formatName(d.spouse_name || '');
  const isJoint = d.is_joint_trust === true || d.is_joint_trust === 'yes';
  // FIX #1: Apply formatName to county for proper capitalization
  const county = formatName(d.county || 'Los Angeles');
  const trustDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const trustName = isJoint && spouseName 
    ? `The ${trustorName} and ${spouseName} Family Trust`
    : `The ${trustorName} Living Trust`;
  const trustNameDated = `${trustName}, dated ${trustDate}`;

  // Pronouns and references
  const TR = isJoint ? 'Trustors' : 'Trustor';
  const TRlc = isJoint ? 'trustors' : 'trustor';
  const TE = isJoint ? 'Trustees' : 'Trustee';
  const TElc = isJoint ? 'trustees' : 'trustee';
  const PRON = isJoint ? 'they' : 'he or she';
  const PRONcap = isJoint ? 'They' : 'He or She';
  const POSS = isJoint ? 'their' : 'his or her';
  const POSScap = isJoint ? 'Their' : 'His or Her';
  const OBJ = isJoint ? 'them' : 'him or her';
  const VERB = isJoint ? 'have' : 'has';
  const VERBs = isJoint ? '' : 's';

  // Translate common Spanish relationship terms to English
  const translateRelationship = (rel) => {
    if (!rel) return '';
    const translations = {
      'hermano': 'brother',
      'hermana': 'sister',
      'padre': 'father',
      'madre': 'mother',
      'hijo': 'son',
      'hija': 'daughter',
      'esposo': 'husband',
      'esposa': 'wife',
      'tio': 'uncle',
      'tía': 'aunt',
      'tia': 'aunt',
      'primo': 'cousin (male)',
      'prima': 'cousin (female)',
      'abuelo': 'grandfather',
      'abuela': 'grandmother',
      'nieto': 'grandson',
      'nieta': 'granddaughter',
      'sobrino': 'nephew',
      'sobrina': 'niece',
      'suegro': 'father-in-law',
      'suegra': 'mother-in-law',
      'cuñado': 'brother-in-law',
      'cuñada': 'sister-in-law',
      'cunado': 'brother-in-law',
      'cunada': 'sister-in-law',
      'amigo': 'friend (male)',
      'amiga': 'friend (female)',
      'vecino': 'neighbor (male)',
      'vecina': 'neighbor (female)'
    };
    const lower = rel.toLowerCase().trim();
    return translations[lower] || rel;
  };

  const successor1 = formatName(d.successor_trustee_1_name) || '[FIRST SUCCESSOR TRUSTEE]';
  const successor1Rel = translateRelationship(d.successor_trustee_1_relationship || '');
  const successor2 = formatName(d.successor_trustee_2_name) || '[SECOND SUCCESSOR TRUSTEE]';
  const successor2Rel = translateRelationship(d.successor_trustee_2_relationship || '');

  // FIX #2: Normalize beneficiaries - format each name properly
  const rawBeneficiaries = d.primary_beneficiaries || '[BENEFICIARIES TO BE NAMED]';
  // Split by comma, format each name, rejoin
  const beneficiaries = rawBeneficiaries.split(',').map(name => {
    // Remove any numbers from names (like "Jean paul 50" -> "Jean paul")
    const cleanName = name.replace(/\d+/g, '').trim();
    return formatName(cleanName);
  }).filter(n => n && n !== '[Name]').join(', ') || '[BENEFICIARIES TO BE NAMED]';
  
  // FIX #3: Normalize shares to proper legal language
  let beneficiaryShares = d.beneficiary_shares || 'in equal shares';
  const rawShares = (beneficiaryShares + '').toLowerCase().trim();
  
  // Count beneficiaries for share calculation
  const beneficiaryCount = beneficiaries.split(',').filter(b => b.trim()).length;
  
  // Convert various formats to proper legal language
  if (rawShares.includes('/')) {
    // "50/50" format
    beneficiaryShares = 'in equal shares (fifty percent (50%) each)';
  } else if (/\d/.test(rawShares)) {
    // Contains numbers like "50" or "Jean paul 50, Anthony 50"
    if (beneficiaryCount === 2) {
      beneficiaryShares = 'in equal shares (fifty percent (50%) each)';
    } else if (beneficiaryCount === 3) {
      beneficiaryShares = 'in equal shares (thirty-three and one-third percent (33.33%) each)';
    } else if (beneficiaryCount === 4) {
      beneficiaryShares = 'in equal shares (twenty-five percent (25%) each)';
    } else if (beneficiaryCount >= 5) {
      beneficiaryShares = 'in equal shares, per stirpes';
    } else {
      beneficiaryShares = 'in equal shares';
    }
  } else if (rawShares === 'equal' || rawShares === 'equally' || rawShares.includes('equal')) {
    if (beneficiaryCount === 2) {
      beneficiaryShares = 'in equal shares (fifty percent (50%) each)';
    } else {
      beneficiaryShares = 'in equal shares, per stirpes';
    }
  }

  const includePlus = tier === 'trust_plus' || tier === 'trust_elite';
  const includeElite = tier === 'trust_elite';

  // ============================================================
  // COVER PAGE
  // ============================================================
  y = 45;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.line(margin, y - 5, pageWidth - margin, y - 5);

  y += 8;
  centerText('DECLARATION OF TRUST', 22, 'bold');
  y += 12;
  centerText('CALIFORNIA REVOCABLE LIVING TRUST', 14, 'bold');
  y += 25;

  doc.setLineWidth(0.5);
  doc.line(margin + 30, y, pageWidth - margin - 30, y);
  y += 18;

  centerText(trustName, 15, 'bold');
  y += 8;
  centerText(`Dated: ${trustDate}`, 12, 'normal');
  y += 25;

  centerText(`County of ${county}, State of California`, 11, 'normal');

  y += 30;
  doc.setFillColor(248, 248, 248);
  doc.setDrawColor(180, 180, 180);
  doc.rect(margin + 10, y, contentWidth - 20, 70, 'FD');

  y += 15;
  centerText(TR.toUpperCase(), 10, 'bold');
  y += 8;
  if (isJoint && spouseName) {
    centerText(`${trustorName}`, 12, 'normal');
    y += 6;
    centerText(`${spouseName}`, 12, 'normal');
  } else {
    centerText(trustorName, 12, 'normal');
  }
  y += 12;
  centerText(`INITIAL ${TE.toUpperCase()}`, 10, 'bold');
  y += 8;
  if (isJoint && spouseName) {
    centerText(`${trustorName} and ${spouseName}`, 12, 'normal');
  } else {
    centerText(trustorName, 12, 'normal');
  }

  y += 40;
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);

  // ============================================================
  // TABLE OF CONTENTS
  // ============================================================
  addPage();
  y = 30;
  centerText('TABLE OF CONTENTS', 14, 'bold');
  y += 15;

  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  const toc = [
    'ARTICLE I - CREATION AND IDENTIFICATION',
    'ARTICLE II - DEFINITIONS AND INTERPRETATION',
    'ARTICLE III - TRUST PROPERTY',
    'ARTICLE IV - TRUSTEES',
    'ARTICLE V - TRUSTEE POWERS',
    'ARTICLE VI - DISTRIBUTIONS DURING LIFETIME',
    'ARTICLE VII - INCAPACITY PROVISIONS',
    'ARTICLE VIII - DISTRIBUTIONS AT DEATH',
    'ARTICLE IX - ADMINISTRATION',
    'ARTICLE X - PROTECTIVE PROVISIONS',
    'ARTICLE XI - GENERAL PROVISIONS',
    'ARTICLE XII - EXECUTION',
    '',
    'SCHEDULE A - PROPERTY TRANSFERRED TO TRUST',
    '',
    'CALIFORNIA NOTARY ACKNOWLEDGMENT (Instructions)',
  ];
  toc.forEach(item => {
    if (item) {
      doc.text(item, margin, y);
    }
    y += 6;
  });

  // ============================================================
  // ARTICLE I - CREATION AND IDENTIFICATION
  // ============================================================
  addPage();
  y = 25;
  centerText('DECLARATION OF TRUST', 13, 'bold');
  y += 5;
  centerText(trustName, 11, 'italic');
  y += 12;

  addArticle('CREATION AND IDENTIFICATION');

  // Section 1.1 - Declaration of Trust
  addSection('Declaration of Trust',
    isJoint
      ? `This Declaration of Trust (the "Trust Agreement" or "Trust") is made and entered into as of ${trustDate}, by ${trustorName} and ${spouseName}, as ${TR} and as initial ${TE}, for the purpose of creating a revocable living trust pursuant to the laws of the State of California.`
      : `This Declaration of Trust (the "Trust Agreement" or "Trust") is made and entered into as of ${trustDate}, by ${trustorName}, as ${TR} and as initial ${TE}, for the purpose of creating a revocable living trust pursuant to the laws of the State of California.`
  );

  // Section 1.2 - Trust Name
  addSection('Trust Name',
    `This Trust shall be known as "${trustNameDated}" and may be referred to herein as the "Trust." Any assets held in this Trust may be titled in the name of the Trust or in the name of the ${TE}.`
  );

  // Section 1.3 - Identification of Trustor(s)
  addSection('Identification of ' + TR,
    isJoint
      ? `The ${TR} of this Trust are ${trustorName} and ${spouseName}, who are husband and wife, whose current residence address is ${trustorAddress}. All references herein to the "${TR}" shall include the ${TR}' personal representatives, heirs, and legal successors where applicable. The ${TR} are also referred to herein as the "Grantors" or "Settlors."`
      : `The ${TR} of this Trust is ${trustorName}, whose current residence address is ${trustorAddress}. All references herein to the "${TR}" shall include the ${TR}'s personal representative, heirs, and legal successors where applicable. The ${TR} is also referred to herein as the "Grantor" or "Settlor."`
  );

  // Section 1.4 - Intent to Create Trust
  addSection('Intent to Create Trust',
    `The ${TR} hereby declare${VERBs} ${POSS} intention to create a valid and enforceable trust under the laws of the State of California and to transfer property to the ${TE} to be held, administered, and distributed solely in accordance with the terms and conditions of this Trust Agreement. The ${TR} intend${VERBs} that this Trust be effective immediately upon execution.`
  );

  // Section 1.5 - Revocability
  addSection('Revocability',
    isJoint
      ? `This Trust shall be revocable during the lifetime of either ${TR}. Either ${TR} may, at any time during ${POSS} lifetime, by written instrument delivered to the ${TE}: (a) revoke this Trust in whole or in part; (b) amend or modify any provision of this Trust; (c) change the beneficiaries or their interests; or (d) withdraw any or all property from this Trust. Upon the death of the first ${TR}, this Trust shall become irrevocable with respect to the deceased ${TR}'s share of the Trust estate, and the surviving ${TR} shall have no power to revoke, amend, or alter the provisions relating to the deceased ${TR}'s share.`
      : `This Trust shall be revocable during the lifetime of the ${TR}. The ${TR} may, at any time during ${POSS} lifetime, by written instrument delivered to the ${TE}: (a) revoke this Trust in whole or in part; (b) amend or modify any provision of this Trust; (c) change the beneficiaries or their interests; or (d) withdraw any or all property from this Trust. This Trust shall become irrevocable upon the death of the ${TR}.`
  );

  // Section 1.6 - Governing Law
  addSection('Governing Law',
    `This Trust shall be governed by, construed, and administered in accordance with the laws of the State of California, including the California Probate Code, as amended from time to time. Questions concerning the validity of this Trust and the construction of its provisions shall be determined by California law regardless of the situs of any Trust property.`
  );

  // Section 1.7 - Trust Purpose
  addSection('Trust Purpose',
    `The purpose of this Trust is to provide for the orderly management, conservation, protection, and distribution of the Trust estate for the benefit of the ${TR} during ${POSS} lifetime, to provide for the management of the Trust estate in the event of the ${TR}'s incapacity, and upon the ${TR}'s death, to distribute the Trust estate to the beneficiaries named herein, all while avoiding the costs, delays, and publicity of probate administration.`
  );

  // ============================================================
  // ARTICLE II - DEFINITIONS AND INTERPRETATION (STRUCTURAL)
  // ============================================================
  addArticle('DEFINITIONS AND INTERPRETATION');

  addSection('Definitions',
    `As used in this Trust Agreement, the following terms shall have the meanings set forth below:`
  );

  addSubsection('a', '"Beneficiary"',
    `Any person or entity entitled to receive income or principal from the Trust, whether currently or in the future.`
  );

  addSubsection('b', '"Child" or "Children"',
    `The biological and legally adopted children of the person referred to, including children born or adopted after the execution of this Trust, but excluding stepchildren unless specifically included.`
  );

  addSubsection('c', '"Descendant" or "Descendants"',
    `All biological and legally adopted lineal descendants of a person of all generations, with the relationship of parent and child at each generation determined by applicable state law.`
  );

  addSubsection('d', '"Disability" or "Incapacity"',
    `The inability of a person to manage ${POSS} financial affairs by reason of mental or physical illness, injury, or deterioration, as determined pursuant to Article VII of this Trust.`
  );

  addSubsection('e', '"Education"',
    `Tuition, fees, books, supplies, room, board, and travel expenses for: (i) primary and secondary school; (ii) college or university; (iii) graduate or professional school; (iv) vocational or technical training; and (v) any special needs education.`
  );

  addSubsection('f', '"Fiduciary"',
    `Any ${TE}, executor, administrator, guardian, conservator, or other person or entity acting in a fiduciary capacity under this Trust or applicable law.`
  );

  addSubsection('g', '"Health"',
    `Medical, dental, hospital, nursing, and related care, including insurance premiums for such care.`
  );

  addSubsection('h', '"Issue"',
    `Descendants of all generations, determined by applicable state law.`
  );

  addSubsection('i', '"Maintenance and Support"',
    `The reasonable and necessary costs of food, clothing, shelter, transportation, recreation, and other expenses consistent with the beneficiary's accustomed standard of living.`
  );

  addSubsection('j', '"Per Stirpes"',
    `Distribution by right of representation, meaning that if a beneficiary predeceases the ${TR}, that beneficiary's share passes to ${POSS} then-living descendants, divided into as many equal shares as there are then-living children of such deceased beneficiary and deceased children with then-living descendants.`
  );

  addSubsection('k', '"Trust Estate"',
    `All property held by the ${TE} under this Trust Agreement, including the initial trust property, additions, accumulated income, and the proceeds of any trust property.`
  );

  // Section - Construction of Terms
  addSection('Construction of Terms',
    `Words importing the singular number shall include the plural, and vice versa. Words importing the masculine gender shall include the feminine and neuter genders, and vice versa. References to any statute or regulation include subsequent amendments and successor provisions. The words "include" and "including" shall not be construed as terms of limitation.`
  );

  // Section - Headings (STRUCTURAL)
  addSection('Headings',
    `Article and section headings used in this Trust Agreement are for convenience of reference only and shall not affect the meaning or construction of any provision.`
  );

  // ============================================================
  // ARTICLE III - TRUST PROPERTY
  // ============================================================
  addArticle('TRUST PROPERTY');

  addSection('Initial Trust Property',
    `The ${TR} hereby transfer${VERBs}, assign${VERBs}, and convey${VERBs} to the ${TE} all property described in Schedule A attached hereto and incorporated herein by reference. The ${TE} hereby acknowledge${VERBs} receipt of such property and agree${VERBs} to hold, administer, and distribute the same in accordance with the terms of this Trust.`
  );

  addSection('Additional Property',
    `The ${TR} or any other person may, from time to time, transfer additional property to this Trust by deed, assignment, will, beneficiary designation, or other appropriate instrument. Any such additional property shall become part of the Trust estate and shall be held, administered, and distributed in accordance with the terms of this Trust Agreement.`
  );

  addSection('Character of Trust Property',
    isJoint
      ? `Unless otherwise specified in writing, all property transferred to this Trust by both ${TR} shall be presumed to be community property. Separate property transferred by either ${TR} shall retain its character as separate property and shall be accounted for separately. The character of property as community or separate shall be determined by applicable California law.`
      : `Property transferred to this Trust shall retain its character as separate or community property as determined by applicable California law. The ${TE} shall maintain adequate records to identify the character of all Trust property.`
  );

  addSection('Acceptance of Property',
    `The ${TE} shall not be required to accept any property that the ${TE}, in ${POSS} sole discretion, determines to be impractical or inadvisable to administer, including property that may expose the Trust to liability or that requires management expertise the ${TE} does not possess.`
  );

  // ============================================================
  // ARTICLE IV - TRUSTEES
  // ============================================================
  addArticle('TRUSTEES');

  addSection('Appointment of Initial ' + TE,
    isJoint
      ? `${trustorName} and ${spouseName} are hereby appointed as the initial Co-${TE} of this Trust. The Co-${TE} shall serve together with full power and authority to act jointly in all matters concerning the Trust. The ${TE} hereby accept the appointment and the duties and responsibilities imposed by this Trust.`
      : `${trustorName} is hereby appointed as the initial ${TE} of this Trust. The ${TE} hereby accepts the appointment and the duties and responsibilities imposed by this Trust.`
  );

  addSection('Successor ' + TE,
    `If ${isJoint ? 'both initial ' + TE + ' are unable or unwilling' : 'the initial ' + TE + ' is unable or unwilling'} to serve, or cease${VERBs} to serve for any reason, the following individuals shall serve as Successor ${TE} in the order named:\n\n` +
    `First Successor ${TE}: ${successor1}${successor1Rel ? ' (' + successor1Rel + ')' : ''}\n\n` +
    `Second Successor ${TE}: ${successor2}${successor2Rel ? ' (' + successor2Rel + ')' : ''}\n\n` +
    `If no named Successor ${TE} is able and willing to serve, the adult beneficiaries then entitled to receive mandatory distributions from this Trust shall, by majority vote, appoint a Successor ${TE}. If the beneficiaries cannot agree, any beneficiary may petition the appropriate court to appoint a ${TE}.`
  );

  addSection(TE + ' Acceptance',
    `Any ${TE} named herein shall evidence acceptance of the office of ${TE} by: (a) signing a written acceptance delivered to the ${TR} if living, or to the beneficiaries; (b) taking possession or control of Trust assets; or (c) otherwise acting in the capacity of ${TE}. A nominated ${TE} who fails to accept within sixty (60) days of receiving notice of nomination shall be deemed to have declined.`
  );

  // STRUCTURAL: Co-Trustee Provisions
  if (isJoint || includePlus) {
    addSection('Co-' + TE + ' Provisions',
      `If at any time more than one ${TE} is serving:\n\n` +
      `(a) Authority to Act. The Co-${TE} shall exercise all powers jointly and must act by unanimous agreement, except that any Co-${TE} may act alone to: (i) delegate ministerial duties; (ii) execute documents to carry out a decision previously agreed upon; (iii) take emergency action to preserve Trust assets; and (iv) perform any act that by its nature must be performed by one person.\n\n` +
      `(b) Disagreement. If the Co-${TE} cannot agree on any matter, they shall submit the dispute to mediation. If mediation fails, any Co-${TE} may petition the court for instructions.\n\n` +
      `(c) Liability. Each Co-${TE} shall be responsible only for ${POSS} own acts and omissions and shall not be liable for the acts or omissions of any other Co-${TE}.`
    );
  }

  // STRUCTURAL: Trustee Resignation
  addSection(TE + ' Resignation',
    `Any ${TE} may resign at any time by giving thirty (30) days written notice to: (a) the ${TR}, if living and competent; (b) any Co-${TE}; and (c) the adult beneficiaries then entitled to receive distributions. The resignation shall be effective upon the earlier of: (i) the appointment and acceptance of a successor ${TE}; or (ii) the expiration of the thirty (30) day notice period. A resigning ${TE} shall continue to serve until a successor accepts the office, unless the court permits earlier termination of duties.`
  );

  // STRUCTURAL: Trustee Removal
  addSection(TE + ' Removal',
    `(a) During ${TR}'s Lifetime. The ${TR} may remove any ${TE} at any time, with or without cause, by written notice delivered to the ${TE}.\n\n` +
    `(b) After ${TR}'s Death. After the death ${isJoint ? 'of the surviving ' + TR : 'of the ' + TR}, any ${TE} may be removed by: (i) unanimous agreement of the adult beneficiaries then entitled to receive mandatory distributions; or (ii) court order upon petition of any beneficiary showing cause.\n\n` +
    `(c) Effect of Removal. Removal shall be effective immediately upon delivery of notice or court order, and the removed ${TE} shall promptly deliver all Trust assets and records to the successor ${TE}.`
  );

  // STRUCTURAL: Standard of Care
  addSection('Standard of Care',
    `The ${TE} shall administer the Trust with the care, skill, prudence, and diligence that a prudent person acting in a like capacity and familiar with such matters would use in the conduct of an enterprise of like character and with like aims, in accordance with California Probate Code Section 16040. The ${TE} shall:\n\n` +
    `(a) Administer the Trust solely in the interest of the beneficiaries;\n\n` +
    `(b) Deal impartially with all beneficiaries, taking into account their respective interests;\n\n` +
    `(c) Take reasonable steps to take and maintain control of Trust property;\n\n` +
    `(d) Keep adequate records of the administration of the Trust; and\n\n` +
    `(e) Keep Trust property separate from the ${TE}'s own property and clearly identified as Trust property.`
  );

  // Trustee Compensation
  addSection(TE + ' Compensation',
    `(a) Family ${TE}. Any ${TE} who is a family member of the ${TR} shall be entitled to reasonable compensation for services rendered as ${TE}, unless such compensation is waived in writing.\n\n` +
    `(b) Professional ${TE}. Any professional or corporate ${TE} shall be entitled to compensation at its published rates in effect at the time services are rendered.\n\n` +
    `(c) Expenses. All ${TE} shall be entitled to reimbursement for reasonable expenses incurred in the administration of the Trust, including travel expenses, professional fees, and costs of litigation.`
  );

  // STRUCTURAL: Bond Waiver
  addSection('Waiver of Bond',
    `No ${TE} named in this Trust Agreement or appointed pursuant to its provisions shall be required to furnish any bond, surety, or other security in any jurisdiction for the faithful performance of ${POSS} duties, and any such requirement is hereby expressly waived. If any court or other authority requires a bond notwithstanding this waiver, the bond shall be in the minimum amount permitted by law and without sureties.`
  );

  // ============================================================
  // ARTICLE V - TRUSTEE POWERS
  // ============================================================
  addArticle('TRUSTEE POWERS');

  addSection('General Grant of Powers',
    `The ${TE} shall have all powers granted to trustees under California Probate Code Sections 16200 through 16249, as amended, and all other powers necessary or advisable to carry out the purposes of this Trust. The ${TE} may exercise these powers without prior court authorization and without notice to any beneficiary, except as otherwise required by law or this Trust Agreement.`
  );

  addSection('Power to Retain Property',
    `The ${TE} may retain any property received by the Trust, including property that does not produce income or is not of a type considered appropriate for trust investment under the prudent investor rule, for such period as the ${TE} determines appropriate.`
  );

  addSection('Power to Invest and Reinvest',
    `The ${TE} may invest and reinvest Trust property in any type of investment, including stocks, bonds, mutual funds, real estate, mortgages, notes, insurance, annuities, and any other property, real or personal, domestic or foreign, as the ${TE} deems advisable, without being limited to investments authorized by law for trust funds.`
  );

  addSection('Power to Sell and Exchange',
    `The ${TE} may sell, exchange, or otherwise dispose of any Trust property at public or private sale, for cash or credit, with or without security, upon such terms and conditions as the ${TE} determines appropriate.`
  );

  addSection('Power to Manage Real Property',
    `With respect to any real property held in this Trust, the ${TE} may: (a) lease for any term, even beyond the anticipated term of the Trust; (b) grant easements or other interests; (c) partition, subdivide, develop, or improve; (d) construct, renovate, demolish, or remove improvements; (e) purchase insurance; (f) pay taxes and assessments; (g) contest taxes and assessments; (h) comply with homeowners' association requirements; (i) enter into management agreements; and (j) mortgage, pledge, or encumber.`
  );

  addSection('Power to Borrow',
    `The ${TE} may borrow money for any Trust purpose, from any lender including the ${TE} personally (at prevailing market rates), and may secure such borrowing by mortgage, pledge, or other encumbrance of Trust property.`
  );

  addSection('Power to Lend',
    `The ${TE} may lend money to any person, including beneficiaries of this Trust, upon such terms as the ${TE} determines appropriate, with or without security.`
  );

  addSection('Power to Distribute',
    `The ${TE} may make distributions in cash, in kind, or partly in each. The ${TE} may make non-pro-rata distributions and may distribute undivided interests in property. The ${TE}'s determination of value for distribution purposes shall be binding on all beneficiaries.`
  );

  addSection('Power to Hire Professionals',
    `The ${TE} may employ and pay reasonable compensation to attorneys, accountants, investment advisors, tax professionals, real estate agents, property managers, and other professionals. The ${TE} may delegate discretionary powers to investment advisors pursuant to California Probate Code Section 16052. The ${TE} shall not be liable for the acts or omissions of any agent selected with reasonable care.`
  );

  // Business powers
  addSection('Power Regarding Business Interests',
    `The ${TE} may continue, participate in, or terminate any business interest held in the Trust. The ${TE} may form, reorganize, or dissolve corporations, partnerships, or limited liability companies. The ${TE} may invest additional funds in any business and may guarantee business obligations. The ${TE} shall not be liable for any loss resulting from the continuation of a business if the ${TE} acts in good faith.`
  );

  // Digital Assets (Plus/Elite)
  if (includePlus) {
    addSection('Power Regarding Digital Assets',
      `The ${TE} is authorized to access, manage, and control the ${TR}'s digital assets pursuant to the California Revised Uniform Fiduciary Access to Digital Assets Act (California Probate Code Sections 870-884). Digital assets include, without limitation: (a) email accounts; (b) social media accounts; (c) cloud storage; (d) cryptocurrency and blockchain-based assets; (e) online banking and investment accounts; (f) domain names and websites; and (g) digital files, photos, and documents. The ${TR} hereby consent${VERBs} to the disclosure of the content of ${POSS} electronic communications to the ${TE}.`
    );
  }

  addSection('Power to Compromise Claims',
    `The ${TE} may compromise, settle, submit to arbitration, release, or abandon any claim or demand in favor of or against the Trust on whatever terms the ${TE} deems advisable.`
  );

  addSection('Power to Execute Documents',
    `The ${TE} may execute any documents necessary or appropriate to carry out the purposes of this Trust, including deeds, contracts, notes, mortgages, leases, and any other instruments.`
  );

  // ============================================================
  // ARTICLE VI - DISTRIBUTIONS DURING LIFETIME
  // ============================================================
  addArticle('DISTRIBUTIONS DURING LIFETIME');

  if (isJoint) {
    addSection('During Joint Lifetimes',
      `During the joint lifetimes of both ${TR} and while both are competent, the ${TE} shall hold, manage, invest, and reinvest the Trust estate and shall pay to or apply for the benefit of the ${TR} such amounts of income and principal as either ${TR} may request from time to time, or as the ${TE} deems necessary for the ${TR}' health, education, maintenance, and support in their accustomed standard of living. Either ${TR} may withdraw any or all of the Trust property at any time without the consent of the other.`
    );

    addSection('Upon Death of First ' + TR,
      `Upon the death of the first ${TR}, the surviving ${TR} shall continue to serve as sole ${TE} and shall be entitled to receive: (a) all income of the Trust; and (b) such principal as necessary for the surviving ${TR}'s health, education, maintenance, and support in ${POSS} accustomed standard of living. The surviving ${TR} may not revoke or amend provisions relating to the distribution of the deceased ${TR}'s share upon the surviving ${TR}'s death.`
    );
  } else {
    addSection('During ' + TR + "'s Lifetime",
      `During the lifetime of the ${TR} and while the ${TR} is competent, the ${TE} shall hold, manage, invest, and reinvest the Trust estate and shall pay to or apply for the benefit of the ${TR} such amounts of income and principal as the ${TR} may request from time to time, or as the ${TE} deems necessary for the ${TR}'s health, education, maintenance, and support in ${POSS} accustomed standard of living. The ${TR} may withdraw any or all of the Trust property at any time.`
    );
  }

  addSection('Discretionary Distributions',
    `In making discretionary distributions for a beneficiary's health, education, maintenance, and support, the ${TE} may consider: (a) the beneficiary's other income and resources; (b) the beneficiary's accustomed standard of living; (c) the beneficiary's age, health, and life expectancy; (d) the needs of other beneficiaries; and (e) the size and nature of the Trust estate.`
  );

  // ============================================================
  // ARTICLE VII - INCAPACITY PROVISIONS (FULL MODULE)
  // ============================================================
  addArticle('INCAPACITY PROVISIONS');

  addSection('Definition of Incapacity',
    `For purposes of this Trust, the ${TR} shall be deemed "incapacitated" or "disabled" if the ${TR} is unable to manage ${POSS} financial affairs by reason of mental illness, mental deficiency, physical illness or disability, chronic use of drugs or alcohol, confinement, detention by a foreign power, disappearance, or other inability to manage ${POSS} affairs, whether temporary or permanent.`
  );

  addSection('Determination of Incapacity',
    `The ${TR}'s incapacity shall be established by one of the following methods:\n\n` +
    `(a) Primary Method: Written declarations by two (2) licensed physicians, each stating that the ${TR} is unable to manage ${POSS} financial affairs. At least one physician should be the ${TR}'s primary care physician if reasonably available.\n\n` +
    `(b) Alternative Method: A written declaration by one (1) licensed physician and one (1) licensed clinical psychologist, each stating that the ${TR} is unable to manage ${POSS} financial affairs.\n\n` +
    `(c) Court Determination: An adjudication by a court of competent jurisdiction that the ${TR} is incapacitated or that a conservator or guardian of the ${TR}'s estate has been appointed.\n\n` +
    `The written declarations shall be dated within thirty (30) days of each other and shall describe the nature of the incapacity. The ${TE} may rely on such declarations without liability.`
  );

  addSection('Temporary vs. Permanent Incapacity',
    `(a) Temporary Incapacity. If the incapacity is certified as likely temporary, the acting ${TE} shall provide monthly reports to the ${TR}'s family members designated herein and shall facilitate the ${TR}'s recovery by ensuring access to appropriate medical care.\n\n` +
    `(b) Permanent Incapacity. If the incapacity is certified as likely permanent, the acting ${TE} shall proceed with long-term administration of the Trust for the ${TR}'s benefit, including planning for the ${TR}'s care needs.`
  );

  addSection('Authority Upon Incapacity',
    `Upon determination of the ${TR}'s incapacity:\n\n` +
    `(a) The Successor ${TE} shall immediately assume full power and authority to act as ${TE}.\n\n` +
    `(b) The acting ${TE} shall manage the Trust estate for the ${TR}'s benefit, including: (i) paying living expenses; (ii) paying for medical care, nursing care, and related expenses; (iii) maintaining the ${TR}'s residence; (iv) paying insurance premiums; (v) paying taxes; (vi) making gifts consistent with the ${TR}'s prior practice; and (vii) taking any other action the ${TE} deems necessary for the ${TR}'s comfort and welfare.\n\n` +
    `(c) The ${TE} shall maintain the ${TR}'s accustomed standard of living to the extent the Trust estate permits.`
  );

  addSection('Restoration of Capacity',
    `If the ${TR} recovers from incapacity, as certified in writing by one (1) licensed physician stating that the ${TR} is able to manage ${POSS} financial affairs, the ${TR} shall resume serving as ${TE} upon written notice to the acting ${TE}. The acting ${TE} shall promptly deliver all Trust assets and records to the restored ${TR}. The acting ${TE} shall provide a complete accounting of all actions taken during the ${TR}'s incapacity.`
  );

  addSection('Authorization to Obtain Medical Information',
    `The ${TR} hereby authorize${VERBs} any physician, hospital, or other medical provider to release medical information concerning the ${TR}'s capacity to the ${TE} or any person nominated as ${TE}. This authorization is intended to comply with the Health Insurance Portability and Accountability Act (HIPAA) and any similar state laws. The ${TR} intend${VERBs} this authorization to be effective during any period of incapacity. A copy of this authorization shall be as effective as the original.`
  );

  addSection('Protection of ' + TE,
    `Any ${TE} acting in reliance on a determination of incapacity made in accordance with this Article shall be protected from liability to the ${TR} and all other persons for any actions taken in good faith during the period of incapacity.`
  );

  // ============================================================
  // ARTICLE VIII - DISTRIBUTIONS AT DEATH
  // ============================================================
  addArticle('DISTRIBUTIONS AT DEATH');

  addSection('Payment of Final Expenses',
    `Upon the death of the ${TR}${isJoint ? ' (or upon the death of the surviving ' + TR + ')' : ''}, the ${TE} shall pay from the Trust estate: (a) the ${TR}'s funeral and burial or cremation expenses; (b) the expenses of the ${TR}'s last illness; (c) the costs of administering the ${TR}'s estate, including legal and accounting fees; and (d) any other expenses properly payable by the ${TR}'s estate that are not paid from other sources.`
  );

  addSection('Payment of Debts',
    `The ${TE} shall pay the ${TR}'s legally enforceable debts that are presented to the ${TE} in a timely manner. The ${TE} may, in ${POSS} discretion, pay debts that are barred by the statute of limitations or other defenses if the ${TE} determines payment is appropriate. The ${TE} shall not be required to pay any debt that the ${TE} reasonably believes is not a valid obligation of the ${TR}.`
  );

  // STRUCTURAL: Tax Apportionment
  addSection('Tax Apportionment',
    `(a) Estate and Inheritance Taxes. All estate, inheritance, succession, and other death taxes (including any interest and penalties) payable by reason of the ${TR}'s death shall be paid from the residue of the Trust estate without apportionment and without reimbursement from any beneficiary or from any property passing outside this Trust.\n\n` +
    `(b) Generation-Skipping Taxes. Any generation-skipping transfer tax shall be charged to the property that gives rise to the tax.\n\n` +
    `(c) Income Taxes. The ${TE} may elect to treat any distribution made within sixty-five (65) days of the close of the Trust's taxable year as having been made on the last day of such taxable year.`
  );

  // FIX #4: Improved distribution section with proper legal language
  addSection('Distribution of Residual Estate',
    `After payment of all expenses, debts, and taxes, the ${TE} shall distribute the remaining Trust estate (the "Residual Estate") to the following named beneficiaries, ${beneficiaryShares}:\n\n` +
    `Primary Beneficiaries: ${beneficiaries}\n\n` +
    `The distributions shall be made as soon as practicable after the ${TR}'s death, subject to the ${TE}'s right to retain reasonable reserves for anticipated expenses.`
  );

  addSection('Per Stirpes Distribution',
    `Unless otherwise specified, all distributions under this Trust shall be made per stirpes. If any beneficiary predeceases the ${TR} (or is deemed to have predeceased under the survivorship requirement), that beneficiary's share shall pass to such beneficiary's then-living descendants, by right of representation. If a deceased beneficiary leaves no surviving descendants, that beneficiary's share shall be divided equally among the remaining beneficiaries or their descendants.`
  );

  addSection('Survivorship Requirement',
    `A beneficiary must survive the ${TR} by at least thirty (30) days to be entitled to any distribution under this Trust. If a beneficiary fails to survive the ${TR} by this period, the beneficiary shall be deemed to have predeceased the ${TR}, and the beneficiary's share shall be distributed as provided in this Trust. This survivorship requirement shall not apply to any charitable beneficiary.`
  );

  // STRUCTURAL: Simultaneous Death
  addSection('Simultaneous Death',
    `If the ${TR} and any beneficiary die simultaneously, or under circumstances that make it impossible or impractical to determine who died first, each beneficiary shall be deemed to have predeceased the ${TR}. ${isJoint ? 'If both ' + TR + ' die simultaneously, they shall be deemed to have died in the following order for purposes of this Trust: ' + spouseName + ' shall be deemed to have predeceased ' + trustorName + ', unless a different order is established by clear and convincing evidence.' : ''}`
  );

  addSection('Lapse and Anti-Lapse',
    `If any gift under this Trust lapses because the beneficiary predeceases the ${TR} without surviving descendants, the lapsed share shall be added to and distributed with the residue of the Trust. If all named beneficiaries and their descendants predecease the ${TR}, the Trust estate shall be distributed to the ${TR}'s heirs at law as determined under California law.`
  );

  // Minor's Trust (Plus/Elite)
  if (includePlus && d.has_minor_children) {
    const distAge = d.minor_distribution_age || '25';
    const minorTrustee = formatName(d.minor_trust_trustee) || successor1;

    addSection("Minor's Trust Provisions",
      `(a) Creation. Any distribution to a beneficiary who has not attained the age of ${distAge} years shall not be distributed outright but shall be held in a separate trust (the "Minor's Trust") for that beneficiary until ${PRON} attains such age.\n\n` +
      `(b) Distributions During Minority. The ${TE} may distribute to or for the benefit of the beneficiary such amounts of income and principal as the ${TE} deems necessary for the beneficiary's health, education, maintenance, and support, considering the beneficiary's other resources.\n\n` +
      `(c) Education Priority. The ${TE} is encouraged to give priority to distributions for the beneficiary's education, including college, graduate school, and vocational training.\n\n` +
      `(d) Final Distribution. Upon the beneficiary attaining age ${distAge}, the ${TE} shall distribute the entire remaining balance of the Minor's Trust to the beneficiary, free of trust.\n\n` +
      `(e) Death Before Final Distribution. If the beneficiary dies before receiving complete distribution, the remaining balance shall be distributed to the beneficiary's descendants per stirpes, or if none, to the beneficiary's estate.\n\n` +
      `(f) Minor's Trust ${TE}. ${minorTrustee} shall serve as ${TE} of any Minor's Trust created hereunder. If ${PRON} is unable or unwilling to serve, the next named Successor ${TE} shall serve.`
    );
  }

  // Staggered Distributions (Elite)
  if (includeElite && d.staggered_distribution) {
    addSection('Staggered Distributions',
      `Notwithstanding any other provision, distributions to any beneficiary under the age of thirty-five (35) shall be made in stages as follows: (a) one-third (1/3) of the beneficiary's share upon attaining age twenty-five (25); (b) one-half (1/2) of the remaining balance upon attaining age thirty (30); and (c) the entire remaining balance upon attaining age thirty-five (35). Until complete distribution, the undistributed share shall be held in trust and the ${TE} may make discretionary distributions for the beneficiary's health, education, maintenance, and support.`
    );
  }

  // After-born children
  if (includePlus) {
    addSection('After-Born and Adopted Children',
      `References to "children" or "descendants" in this Trust include children born or legally adopted after the execution of this Trust, unless expressly excluded. An adopted child shall be treated as a child of the adoptive parent(s) and not as a child of the biological parent(s), unless the adoption is by a stepparent.`
    );
  }

  // Special Needs (Elite)
  if (includeElite && d.beneficiary_on_benefits === 'yes') {
    addSection('Special Needs Provisions',
      `IMPORTANT: ATTORNEY REVIEW RECOMMENDED. If any beneficiary is receiving or may receive means-tested government benefits (including but not limited to Supplemental Security Income (SSI), Medicaid/Medi-Cal, or other similar benefits), distributions for such beneficiary shall be made solely in the ${TE}'s absolute discretion and shall be used only to supplement, not supplant, any government benefits. Distributions shall not be used for basic food or shelter if such use would reduce the beneficiary's government benefits. It is the ${TR}'s intent to create a supplemental needs trust for any such beneficiary. The ${TE} is authorized to establish a separate special needs trust if necessary to protect the beneficiary's eligibility for government benefits.`
    );
  }

  // ============================================================
  // ARTICLE IX - ADMINISTRATION
  // ============================================================
  addArticle('ADMINISTRATION');

  // STRUCTURAL: Accounting & Reporting
  addSection('Accounting and Reporting',
    `(a) During ${TR}'s Lifetime. During the ${TR}'s lifetime and competency, the ${TE} shall not be required to render accountings except upon the ${TR}'s written request.\n\n` +
    `(b) After ${TR}'s Death. After the ${TR}'s death${isJoint ? ' (or after the death of the surviving ' + TR + ')' : ''}, the ${TE} shall provide annual accountings to all adult beneficiaries then entitled to receive mandatory distributions. The accounting shall show: (i) all Trust property on hand at the beginning of the period; (ii) all receipts and disbursements during the period; (iii) all distributions made; (iv) compensation paid; and (v) all property on hand at the end of the period.\n\n` +
    `(c) Waiver. Any beneficiary may waive the right to receive accountings by written notice to the ${TE}. The ${TE} may seek court approval of accountings to obtain discharge from liability.`
  );

  addSection('Reserve Authority',
    `The ${TE} may withhold from distribution such reserves as the ${TE} deems reasonably necessary for: (a) anticipated debts and expenses; (b) taxes; (c) claims; (d) contingent liabilities; and (e) the orderly administration of the Trust. Any property withheld shall be distributed when the ${TE} determines the reserve is no longer necessary.`
  );

  addSection('Distribution in Kind',
    `The ${TE} may make distributions in cash or in kind, or partly in each. The ${TE} may make non-pro-rata distributions of property. The ${TE}'s determination of the value of property distributed in kind shall be binding on all beneficiaries, provided the ${TE} acts in good faith.`
  );

  addSection('Tangible Personal Property',
    `The ${TE} shall distribute tangible personal property in accordance with any written memorandum or list signed by the ${TR}, whether or not such memorandum has testamentary significance. Items not disposed of by such memorandum shall be distributed equally among the beneficiaries, or sold and the proceeds distributed if the beneficiaries cannot agree on a division.`
  );

  // STRUCTURAL: Reliance by Third Parties
  addSection('Reliance by Third Parties',
    `Banks, brokers, title companies, transfer agents, and other third parties may rely on a certification of trust or other evidence of the ${TE}'s authority without requiring a complete copy of this Trust Agreement. Any person dealing with the ${TE} shall not be required to: (a) see to the application of any money or property delivered to the ${TE}; (b) inquire into the propriety of any transaction; (c) see to the performance of the Trust; or (d) inquire whether the ${TE}'s acts are authorized. Any person who acts in good faith reliance on a written statement of the ${TE} shall be fully protected.`
  );

  // STRUCTURAL: Notice Procedures
  addSection('Notice Procedures',
    `(a) Method. Any notice required or permitted under this Trust shall be in writing and shall be delivered personally, sent by certified or registered mail (return receipt requested), or sent by overnight courier to the last known address of the recipient.\n\n` +
    `(b) Effective Date. Notice shall be effective upon: (i) personal delivery; (ii) three (3) days after mailing if sent by certified or registered mail; or (iii) one (1) day after sending if sent by overnight courier.\n\n` +
    `(c) Change of Address. Any party may change ${POSS} address for notice purposes by written notice to the other parties.`
  );

  // ============================================================
  // ARTICLE X - PROTECTIVE PROVISIONS
  // ============================================================
  addArticle('PROTECTIVE PROVISIONS');

  // STRUCTURAL: Spendthrift Protection
  addSection('Spendthrift Protection',
    `(a) Restrictions. No beneficiary shall have the power to anticipate, assign, pledge, encumber, or otherwise transfer ${POSS} interest in the income or principal of any trust created under this Trust Agreement. No interest of any beneficiary shall be subject to claims of the beneficiary's creditors, spouse, or former spouse, or to legal process, prior to actual distribution to the beneficiary.\n\n` +
    `(b) Exceptions. This spendthrift protection shall not prevent: (i) the ${TE} from making distributions directly to third parties for the benefit of a beneficiary; (ii) any beneficiary who is serving as ${TE} from exercising discretion over ${POSS} own distributions to the extent permitted herein; or (iii) enforcement of any lawful claim for child support or spousal support to the extent required by law.\n\n` +
    `(c) Maximum Protection. This spendthrift provision shall be enforced to the maximum extent permitted by applicable law.`
  );

  // STRUCTURAL: Governing Venue & Situs
  addSection('Trust Situs and Venue',
    `(a) Situs. The situs of this Trust shall be the State of California, County of ${county}.\n\n` +
    `(b) Venue. Any action or proceeding relating to this Trust shall be brought in the Superior Court of California, County of ${county}, which shall have exclusive jurisdiction over all matters relating to this Trust.\n\n` +
    `(c) Change of Situs. The ${TE} may change the situs of the Trust to another state if the ${TE} determines that a change is in the best interests of the Trust and its beneficiaries. Upon any change of situs, the law of the new situs shall govern administration of the Trust, but questions of validity and construction shall continue to be governed by California law.`
  );

  // STRUCTURAL: Severability
  addSection('Severability',
    `If any provision of this Trust is held invalid, illegal, or unenforceable by a court of competent jurisdiction, the validity, legality, and enforceability of the remaining provisions shall not in any way be affected or impaired thereby. The invalid, illegal, or unenforceable provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable while preserving the ${TR}'s intent.`
  );

  // ============================================================
  // ARTICLE XI - GENERAL PROVISIONS
  // ============================================================
  addArticle('GENERAL PROVISIONS');

  addSection('Entire Agreement',
    `This Trust Agreement constitutes the entire agreement between the ${TR} and the ${TE} regarding the subject matter hereof. This Trust Agreement supersedes all prior agreements and understandings, whether written or oral.`
  );

  // Mediation (Plus/Elite)
  if (includePlus) {
    addSection('Mediation',
      `Any dispute arising under or relating to this Trust shall first be submitted to mediation before a mutually agreed-upon mediator in ${county} County, California. The costs of mediation shall be paid from the Trust estate. No party shall commence litigation until mediation has been completed or the other party has failed to participate in mediation within sixty (60) days of a written request.`
    );
  }

  // Attorney Fees (Plus/Elite)
  if (includePlus) {
    addSection('Attorney Fees',
      `In any action or proceeding to enforce or interpret any provision of this Trust, the prevailing party shall be entitled to recover reasonable attorney fees and costs from the non-prevailing party or from the Trust estate, as the court determines appropriate.`
    );
  }

  // No-Contest (Elite)
  if (includeElite && d.has_no_contest) {
    addSection('No-Contest Clause',
      `IMPORTANT: READ CAREFULLY. If any beneficiary, directly or indirectly, contests or attacks this Trust or any of its provisions, or conspires with or assists anyone in any such contest, or pursues any claim against the ${TR}'s estate or the ${TE} that the ${TE} reasonably believes is without merit, that beneficiary shall forfeit ${POSS} entire interest in the Trust and shall be treated as if ${PRON} predeceased the ${TR} without descendants. This no-contest clause shall be enforced to the fullest extent permitted by California Probate Code Section 21311. A contest brought with probable cause, as defined by California law, shall not trigger this forfeiture.`
    );
  }

  addSection('Amendments',
    `Any amendment to this Trust must be in writing, signed by the ${TR} (or by the surviving ${TR} if this is a joint trust and one ${TR} has died), and delivered to the ${TE}. No oral modification shall be effective.`
  );

  addSection('Counterparts',
    `This Trust Agreement may be executed in multiple counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.`
  );

  // ============================================================
  // ARTICLE XII - EXECUTION
  // ============================================================
  addArticle('EXECUTION');

  addSection(TR + ' Execution',
    `IN WITNESS WHEREOF, the ${TR} ${VERB} executed this Declaration of Trust as of the date first written above, declaring ${POSS} intention to create a valid revocable living trust under the laws of the State of California.`
  );

  // Signature lines
  y += 10;
  checkPageBreak(isJoint ? 120 : 70);
  
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text(TR.toUpperCase() + ':', margin, y);
  
  y += 25;
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 90, y);
  y += 5;
  doc.setFont('times', 'normal');
  doc.text(trustorName + ', ' + TR, margin, y);
  y += 12;
  doc.text('Date: _________________________________', margin, y);

  if (isJoint && spouseName) {
    y += 30;
    doc.line(margin, y, margin + 90, y);
    y += 5;
    doc.text(spouseName + ', ' + TR, margin, y);
    y += 12;
    doc.text('Date: _________________________________', margin, y);
  }

  // Trustee Acceptance
  y += 25;
  checkPageBreak(isJoint ? 100 : 60);
  
  doc.setFont('times', 'bold');
  doc.text(TE.toUpperCase() + ' ACCEPTANCE:', margin, y);
  y += 10;
  
  doc.setFont('times', 'normal');
  addText(`The undersigned ${TE} hereby acknowledge${VERBs} receipt of the Trust estate and accept${VERBs} the appointment as ${TE} and all of the duties and responsibilities of the office of ${TE}.`);

  y += 10;
  doc.line(margin, y, margin + 90, y);
  y += 5;
  doc.text(trustorName + ', ' + TE, margin, y);
  y += 12;
  doc.text('Date: _________________________________', margin, y);

  if (isJoint && spouseName) {
    y += 25;
    doc.line(margin, y, margin + 90, y);
    y += 5;
    doc.text(spouseName + ', ' + TE, margin, y);
    y += 12;
    doc.text('Date: _________________________________', margin, y);
  }

  // ============================================================
  // SCHEDULE A - TRUST PROPERTY
  // ============================================================
  addPage();
  y = 30;
  centerText('SCHEDULE A', 14, 'bold');
  y += 5;
  centerText('PROPERTY TRANSFERRED TO TRUST', 12, 'bold');
  y += 5;
  centerText(trustName, 10, 'italic');
  y += 15;

  addText(`The following property is hereby transferred to and shall be held as part of the ${trustName}:`);
  y += 8;

  // Save starting position for the box
  const boxStartY = y;
  y += 5;

  // Real Property
  doc.setFont('times', 'bold');
  doc.text('1. REAL PROPERTY:', margin + 5, y);
  y += 7;
  doc.setFont('times', 'normal');
  if (d.properties) {
    const props = d.properties.split(';');
    props.forEach((prop, i) => {
      if (prop.trim()) {
        const lines = doc.splitTextToSize(`${String.fromCharCode(97 + i)}) ${prop.trim()}`, contentWidth - 20);
        lines.forEach(line => {
          doc.text(line, margin + 10, y);
          y += 5;
        });
      }
    });
  } else {
    doc.text('[Real property to be transferred by separate deed]', margin + 10, y);
    y += 5;
  }
  y += 5;

  // Personal Property
  doc.setFont('times', 'bold');
  doc.text('2. TANGIBLE PERSONAL PROPERTY:', margin + 5, y);
  y += 7;
  doc.setFont('times', 'normal');
  doc.text('All furniture, furnishings, appliances, artwork, jewelry, clothing, vehicles,', margin + 10, y);
  y += 5;
  doc.text('and other tangible personal property owned by the ' + TR + '.', margin + 10, y);
  y += 8;

  // Financial Accounts
  doc.setFont('times', 'bold');
  doc.text('3. FINANCIAL ACCOUNTS:', margin + 5, y);
  y += 7;
  doc.setFont('times', 'normal');
  doc.text('All bank accounts, investment accounts, brokerage accounts, and retirement', margin + 10, y);
  y += 5;
  doc.text('accounts (to the extent transferable) registered in the name of the Trust.', margin + 10, y);
  y += 8;

  // Business Interests
  if (d.owns_business) {
    doc.setFont('times', 'bold');
    doc.text('4. BUSINESS INTERESTS:', margin + 5, y);
    y += 7;
    doc.setFont('times', 'normal');
    doc.text('All interests in corporations, partnerships, LLCs, and other business entities.', margin + 10, y);
    y += 8;
  }

  // Digital Assets
  if (d.has_digital_assets) {
    const num = d.owns_business ? '5' : '4';
    doc.setFont('times', 'bold');
    doc.text(num + '. DIGITAL ASSETS:', margin + 5, y);
    y += 7;
    doc.setFont('times', 'normal');
    doc.text('Cryptocurrency, digital accounts, and other digital property.', margin + 10, y);
    y += 5;
  }

  // Draw the box around Schedule A content with dynamic height
  const boxEndY = y + 5;
  const boxHeight = boxEndY - boxStartY;
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(margin, boxStartY - 5, contentWidth, boxHeight + 5, 'S');

  y += 20;
  addText('The ' + TR + ' may transfer additional property to this Trust at any time by: (a) executing a written assignment; (b) titling property in the name of the Trust; or (c) designating the Trust as beneficiary.');

  y += 15;
  doc.setFont('times', 'normal');
  doc.text(TR + ' Initials: _______ ' + (isJoint ? '_______ ' : '') + '     Date: __________________', margin, y);

  // ============================================================
  // NOTARY ACKNOWLEDGMENT INSTRUCTIONS
  // ============================================================
  addPage();
  y = 30;
  centerText('CALIFORNIA NOTARY ACKNOWLEDGMENT', 14, 'bold');
  centerText('INSTRUCTIONS', 12, 'bold');
  y += 15;

  // FIX: Yellow box - increased height and padding
  doc.setFillColor(255, 250, 235);
  doc.setDrawColor(220, 180, 50);
  doc.setLineWidth(1);
  doc.rect(margin, y, contentWidth, 62, 'FD');
  y += 20;
  
  centerText('IMPORTANT: DO NOT SIGN THIS DOCUMENT UNTIL', 11, 'bold');
  y += 6;
  centerText('YOU ARE IN THE PRESENCE OF A CALIFORNIA NOTARY PUBLIC', 11, 'bold');
  y += 12;
  
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  centerText('The official California Notary Acknowledgment form is included', 10, 'normal');
  y += 5;
  centerText('at the end of this document for your convenience.', 10, 'normal');
  doc.setTextColor(0, 0, 0);

  y += 20;
  addText('A notary public or other officer completing this certificate verifies only the identity of the individual who signed the document to which this certificate is attached, and not the truthfulness, accuracy, or validity of that document.');

  y += 5;
  doc.setFont('times', 'bold');
  doc.text('SIGNING INSTRUCTIONS:', margin, y);
  y += 10;
  doc.setFont('times', 'normal');

  const instructions = [
    '1. Schedule an appointment with a California notary public.',
    '2. Bring valid government-issued photo identification (driver\'s license, passport, etc.).',
    '3. ' + (isJoint ? 'Both ' + TRlc : 'The ' + TRlc) + ' must appear before the notary together.',
    '4. Sign the Trust Agreement in the presence of the notary.',
    '5. The notary will complete and attach the official acknowledgment certificate.',
    '6. Keep the original signed and notarized Trust in a safe, fireproof location.',
    '7. Provide copies to your successor trustee(s) and financial institutions.',
    '8. Record any real property transfer deeds with the county recorder.'
  ];

  instructions.forEach(inst => {
    checkPageBreak(7);
    doc.text(inst, margin + 5, y);
    y += 7;
  });

  y += 15;
  // FIX: Green box - increased height for content
  doc.setFillColor(230, 255, 230);
  doc.setDrawColor(100, 180, 100);
  doc.rect(margin, y, contentWidth, 50, 'FD');
  y += 20;
centerText('CALIFORNIA NOTARY ACKNOWLEDGMENT', 10, 'bold');
y += 5;
centerText('FORM ATTACHED', 10, 'bold');
y += 6;
centerText('See final page of this document - California Civil Code Section 1189', 8, 'italic');
  // ============================================================
  // PLATFORM DISCLOSURE (on separate page, can be detached)
  // ============================================================
  addPage();
  y = 25;
  centerText('SOFTWARE PLATFORM DISCLOSURE', 13, 'bold');
  centerText('AND USER ACKNOWLEDGMENT', 13, 'bold');
  y += 12;
  
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.text('IMPORTANT: PLEASE READ CAREFULLY BEFORE SIGNING', margin, y);
  y += 10;

  doc.setFont('times', 'normal');
  doc.setFontSize(9);

  const disclosures = [
    '1. NATURE OF SERVICE: Multi Servicios 360 provides a software platform for self-preparation of legal documents. This platform is NOT a law firm and does NOT provide legal advice, legal representation, or attorney services of any kind.',
    
    '2. SELF-PREPARED DOCUMENT: This California Living Trust was self-prepared by the user using our software platform. The user entered all information, selected all options, and made all decisions regarding the content of this document. Multi Servicios 360 did not draft, review, approve, or modify the legal content.',
    
    '3. NO ATTORNEY-CLIENT RELATIONSHIP: Use of this software does not create an attorney-client relationship between the user and Multi Servicios 360, or between the user and any attorney. No attorney has reviewed this specific document unless separately arranged and paid for by the user.',
    
    '4. LIMITATIONS: This software is designed for straightforward estate planning situations. Complex situations require professional legal assistance, including but not limited to: (a) estates exceeding federal or state exemption amounts; (b) beneficiaries with special needs; (c) complex business ownership structures; (d) real property in multiple states; (e) blended families with complex inheritance wishes; (f) tax planning matters; and (g) international assets or beneficiaries.',
    
    '5. RECOMMENDATION: We strongly recommend consulting with a licensed California estate planning attorney if you have any questions about whether this document meets your specific needs.',
    
    '6. USER RESPONSIBILITY: The user is solely responsible for: (a) the accuracy and completeness of all information entered; (b) ensuring this document meets their specific legal needs; (c) proper execution and notarization; (d) funding the trust by properly transferring assets; (e) recording any real property transfer deeds; and (f) storing the original document safely.',
    
    '7. NO WARRANTY: This document is provided "as is" without warranty of any kind, express or implied. Multi Servicios 360 makes no warranty that this document will achieve any particular legal, tax, or other result.',
    
    '8. UPDATES: Laws change over time. This document is based on California law as of the date of generation. The user is responsible for keeping estate planning documents current and should review this document with an attorney periodically.'
  ];

  disclosures.forEach(disc => {
    checkPageBreak(20);
    const lines = doc.splitTextToSize(disc, contentWidth);
    lines.forEach(line => {
      doc.text(line, margin, y);
      y += 4;
    });
    y += 2;
  });

  y += 5;
  checkPageBreak(70);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.text('USER ACKNOWLEDGMENT AND AGREEMENT', margin, y);
  y += 8;

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  addText('By using this software and generating this document, I acknowledge and agree that:');

  const acks = [
    '• I have read and understand the above disclosures',
    '• I am preparing this document for my own use (or for someone who authorized me to do so)',
    '• I understand this is a self-prepared legal document, not prepared by an attorney',
    '• I understand Multi Servicios 360 is not a law firm and has not provided legal advice',
    '• I am responsible for the accuracy of all information in this document',
    '• I understand I should consult an attorney if I have complex circumstances or questions',
    '• I agree to the Terms of Service and Privacy Policy of Multi Servicios 360'
  ];

  acks.forEach(ack => {
    checkPageBreak(6);
    doc.text(ack, margin + 5, y);
    y += 5;
  });

  y += 10;
  checkPageBreak(50);

  // Agreement signature
  if (agreementData && agreementData.agreed) {
    doc.setFont('times', 'bold');
    doc.text('ELECTRONIC SIGNATURE AND AGREEMENT:', margin, y);
    y += 10;
    doc.setFont('times', 'normal');
    doc.text(`User Name: ${agreementData.name || trustorName}`, margin, y);
    y += 6;
    doc.text(`Agreement Date: ${agreementData.date || trustDate}`, margin, y);
    y += 6;
    doc.text(`Agreement Time: ${agreementData.time || new Date().toLocaleTimeString()}`, margin, y);
    y += 6;
    doc.text(`IP Address: ${agreementData.ip || '[Recorded by system]'}`, margin, y);
    y += 8;
    doc.setFont('times', 'bold');
    doc.text('☑ I AGREE to all terms, conditions, and disclosures stated above.', margin, y);
  } else {
    doc.setFont('times', 'bold');
    doc.text('USER SIGNATURE:', margin, y);
    y += 20;
    doc.line(margin, y, margin + 100, y);
    y += 5;
    doc.setFont('times', 'normal');
    doc.text('Signature', margin, y);
    y += 15;
    doc.text('Date: ______________________________', margin, y);
    y += 15;
    doc.text('Printed Name: ______________________________', margin, y);
  }

  y += 20;
  doc.setFontSize(8);
  doc.setFont('times', 'italic');
  doc.text('Multi Servicios 360 | www.multiservicios360.net | (855) 246-7274', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('Document generated: ' + new Date().toLocaleString(), pageWidth / 2, y, { align: 'center' });

  // ============================================================
  // ADD PAGE NUMBERS - TRUST PAGES ONLY
  // ============================================================
  const totalPages = doc.internal.getNumberOfPages();
  const trustEndPage = totalPages - 3; // Exclude Notary Instructions + Platform Disclosure
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont('times', 'normal');
    doc.setTextColor(100, 100, 100);
    
    doc.text(trustName, pageWidth / 2, pageHeight - 12, { align: 'center' });
    
    if (i <= trustEndPage) {
      // Trust document pages
      doc.text(`Page ${i} of ${trustEndPage}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
    } else {
      // Appendix pages (Notary Instructions, Platform Disclosure)
      doc.text('Appendix', pageWidth / 2, pageHeight - 6, { align: 'center' });
    }
    
    doc.setTextColor(0, 0, 0);
  }

  return doc;
}

// ============================================================
// EXPORT FUNCTIONS
// ============================================================

export async function downloadTrustPDF(intakeData, tier, agreementData) {
  const blob = await getTrustPDFBlob(intakeData, tier, agreementData);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const name = (intakeData?.trustor_name || 'Living_Trust').replace(/\s+/g, '_');
  link.href = url;
  link.download = `${name}_California_Living_Trust.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function getTrustPDFBlob(intakeData, tier, agreementData) {
  const trustDoc = generateTrustPDF(intakeData, tier, agreementData);
  const trustBytes = trustDoc.output('arraybuffer');
  
  // Fetch and merge CA notary form
  try {
    const notaryResponse = await fetch(CA_NOTARY_PDF_URL);
    if (notaryResponse.ok) {
      const notaryBytes = await notaryResponse.arrayBuffer();
      
      const mergedPdf = await PDFDocument.create();
      
      const trustPdf = await PDFDocument.load(trustBytes);
      const trustPages = await mergedPdf.copyPages(trustPdf, trustPdf.getPageIndices());
      trustPages.forEach(page => mergedPdf.addPage(page));
      
      const notaryPdf = await PDFDocument.load(notaryBytes);
      const notaryPages = await mergedPdf.copyPages(notaryPdf, notaryPdf.getPageIndices());
      notaryPages.forEach(page => mergedPdf.addPage(page));
      
      const mergedBytes = await mergedPdf.save();
      return new Blob([mergedBytes], { type: 'application/pdf' });
    }
  } catch (error) {
    console.error('Could not fetch/merge notary PDF:', error);
  }
  
  return new Blob([trustBytes], { type: 'application/pdf' });
}

export function getTrustPDFBase64(intakeData, tier, agreementData) {
  const doc = generateTrustPDF(intakeData, tier, agreementData);
  return doc.output('datauristring');
}