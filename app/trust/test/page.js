"use client";
import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

export default function TrustPDFTestPage() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample data - like a real customer
  const sampleData = {
    trustor_name: 'Anthony Galeano',
    trustor_address: '222 S Figueroa St, Los Angeles, CA 90012',
    spouse_name: 'Maria Galeano',
    is_joint_trust: true,
    is_revocable: true,
    initial_trustee: 'myself_and_spouse',
    successor_trustee_1_name: 'Juan Galeano',
    successor_trustee_1_relationship: 'Son',
    successor_trustee_2_name: 'Sofia Galeano',
    successor_trustee_2_relationship: 'Daughter',
    primary_beneficiaries: 'Juan Galeano (Son), Sofia Galeano (Daughter), Carlos Galeano (Son)',
    beneficiary_shares: 'Equal shares - 33.33% each',
    distribution_method: 'per_stirpes',
    survivorship_requirement: '30_days',
    has_minor_children: true,
    minor_children: 'Carlos 15',
    minor_distribution_age: '25',
    minor_trust_trustee: 'Juan Galeano',
    owns_ca_real_estate: true,
    properties: '222 S Figueroa St, Los Angeles, CA 90012; 456 Beach Blvd, Huntington Beach, CA 92648',
    owns_business: true,
    has_digital_assets: true,
    has_specific_gifts: true,
    incapacity_determination: 'two_doctors',
    dispute_resolution: 'mediation',
    has_no_contest: true,
    require_accounting: true,
    county: 'Los Angeles',
  };

  useEffect(() => {
    generatePDF();
  }, []);

  const generatePDF = () => {
    setLoading(true);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Helper functions
    const addPage = () => { doc.addPage(); y = margin; };
    const checkPageBreak = (needed = 30) => { if (y + needed > pageHeight - margin) addPage(); };
    
    const centerText = (text, yPos, fontSize = 12, style = 'normal') => {
      doc.setFontSize(fontSize);
      doc.setFont('times', style);
      doc.text(text, pageWidth / 2, yPos, { align: 'center' });
    };
    
    const addParagraph = (text, indent = 0) => {
      doc.setFontSize(11);
      doc.setFont('times', 'normal');
      const lines = doc.splitTextToSize(text, contentWidth - indent);
      checkPageBreak(lines.length * 6);
      doc.text(lines, margin + indent, y);
      y += lines.length * 6 + 4;
    };
    
    const addSection = (title) => {
      checkPageBreak(40);
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.text(title, margin, y);
      y += 10;
    };
    
    const addClause = (number, title, content) => {
      checkPageBreak(35);
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.text(`${number}. ${title}`, margin, y);
      y += 7;
      doc.setFont('times', 'normal');
      const lines = doc.splitTextToSize(content, contentWidth - 5);
      doc.text(lines, margin + 5, y);
      y += lines.length * 5 + 6;
    };

    // Data
    const d = sampleData;
    const trustorName = d.trustor_name;
    const spouseName = d.spouse_name;
    const isJoint = d.is_joint_trust;
    const trustName = isJoint ? `The ${trustorName} and ${spouseName} Family Trust` : `The ${trustorName} Living Trust`;
    const trustDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const county = d.county;

    // ==================== COVER PAGE ====================
    y = 50;
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(2);
    doc.line(margin, y - 10, pageWidth - margin, y - 10);
    
    centerText('DECLARATION OF TRUST', y, 22, 'bold');
    y += 12;
    centerText('REVOCABLE LIVING TRUST', y, 16, 'bold');
    y += 25;
    
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin + 30, y, pageWidth - margin - 30, y);
    y += 15;
    
    centerText(trustName, y, 16, 'italic');
    y += 25;
    
    centerText(`Effective Date: ${trustDate}`, y, 12);
    y += 8;
    centerText(`County of ${county}, State of California`, y, 12);
    
    y += 35;
    doc.setFillColor(250, 245, 255);
    doc.rect(margin, y - 5, contentWidth, 50, 'F');
    doc.setDrawColor(124, 58, 237);
    doc.rect(margin, y - 5, contentWidth, 50, 'S');
    
    y += 8;
    centerText('TRUSTORS', y, 11, 'bold');
    y += 8;
    centerText(`${trustorName} and ${spouseName}`, y, 12);
    y += 15;
    centerText('INITIAL TRUSTEES', y, 11, 'bold');
    y += 8;
    centerText(`${trustorName} and ${spouseName}`, y, 12);
    
    y += 45;
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    centerText('This document was self-prepared using Multi Servicios 360 software platform.', y, 10);
    y += 6;
    centerText('This is not legal advice. Consult an attorney for complex situations.', y, 10);
    
    y += 15;
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(2);
    doc.line(margin, y, pageWidth - margin, y);

    // ==================== ARTICLE I - CREATION ====================
    addPage();
    centerText('DECLARATION OF TRUST', y, 14, 'bold');
    y += 5;
    centerText(trustName, y, 11, 'italic');
    y += 15;
    
    addSection('ARTICLE I. CREATION OF TRUST');
    
    addClause('1.1', 'Declaration',
      `We, ${trustorName} and ${spouseName}, husband and wife, residents of ${county} County, California, as Trustors, hereby declare that we hold and will hold all property transferred to this Trust, and any additional property that may be added, IN TRUST, for the uses and purposes set forth in this Declaration of Trust.`);
    
    addClause('1.2', 'Trust Name',
      `This Trust shall be known as "${trustName}" dated ${trustDate}, and may be referred to herein as the "Trust."`);
    
    addClause('1.3', 'Intent to Create Trust',
      'The Trustors declare the intention to create a valid and enforceable trust and to transfer property to the Trustee to be held, managed, and distributed in accordance with the terms of this Trust.');
    
    addClause('1.4', 'Revocability',
      'During the lifetime of either Trustor, this Trust shall be revocable and amendable, in whole or in part, by either Trustor by a written instrument signed by the Trustor and delivered to the Trustee. Upon the death of either Trustor, the Trust shall become irrevocable as to the deceased Trustor\'s share.');
    
    addClause('1.5', 'Governing Law',
      'This Trust shall be governed by and construed in accordance with the laws of the State of California.');
    
    addClause('1.6', 'Trust Property',
      'The Trust estate shall consist of all property transferred to the Trustee by the Trustors, whether described in Schedule A attached hereto or acquired by the Trust thereafter.');

    // ==================== ARTICLE II - TRUSTEES ====================
    addPage();
    addSection('ARTICLE II. TRUSTEES');
    
    addClause('2.1', 'Appointment of Initial Trustees',
      `The Trustors hereby appoint ${trustorName} and ${spouseName} as the initial Co-Trustees of this Trust. The Trustees accept the duties and responsibilities imposed by this Trust.`);
    
    addClause('2.2', 'Successor Trustees',
      `If both initial Trustees resign, become incapacitated, or otherwise cease to serve, the following persons shall serve as Successor Trustee(s), in the order listed:\n\nFirst Successor: ${d.successor_trustee_1_name} (${d.successor_trustee_1_relationship})\nSecond Successor: ${d.successor_trustee_2_name} (${d.successor_trustee_2_relationship})`);
    
    addClause('2.3', 'Trustee Acceptance',
      'Any Trustee named herein shall evidence acceptance of trusteeship by acting in the capacity of Trustee or by executing a written acceptance.');
    
    addClause('2.4', 'General Trustee Powers',
      'The Trustee shall have all powers granted under California Probate Code Sections 16200 through 16249, as amended, and any other powers necessary or advisable to carry out the purposes of this Trust, without court authorization.');
    
    addClause('2.5', 'Power to Manage Trust Assets',
      'The Trustee shall have full power to collect, hold, manage, invest, reinvest, sell, exchange, lease, mortgage, insure, and otherwise deal with Trust property as the Trustee deems appropriate.');
    
    addClause('2.6', 'Power to Hire Professionals',
      'The Trustee may employ attorneys, accountants, financial advisors, and other professionals and may pay reasonable compensation for such services from the Trust estate.');
    
    addClause('2.7', 'Trustee Compensation',
      'The Trustee shall be entitled to reasonable compensation and reimbursement for expenses incurred in the administration of the Trust, unless waived in writing.');
    
    addClause('2.8', 'Waiver of Bond',
      'No bond shall be required of any Trustee serving under this Trust.');

    // ==================== ARTICLE III - DISTRIBUTIONS ====================
    addPage();
    addSection('ARTICLE III. DISTRIBUTIONS DURING LIFETIME');
    
    addClause('3.1', 'During Joint Lifetimes',
      'During the joint lifetimes of both Trustors, the Trustees shall hold, manage, and distribute the Trust estate for the health, education, maintenance, and support of the Trustors as they may request. Either Trustor may withdraw any or all of the Trust property at any time.');
    
    addClause('3.2', 'Upon Death of First Trustor',
      'Upon the death of the first Trustor, the surviving Trustor shall continue to serve as sole Trustee. The surviving Trustor shall be entitled to receive all income from the Trust and such principal as necessary for health, education, maintenance, and support, taking into account the surviving Trustor\'s accustomed standard of living.');

    addSection('ARTICLE IV. DISTRIBUTIONS UPON DEATH');
    
    addClause('4.1', 'Payment of Final Expenses',
      'Upon the death of the surviving Trustor (or upon simultaneous death of both Trustors), the Trustee shall first pay from the Trust estate all legally enforceable debts, final medical expenses, funeral costs, and expenses of last illness.');
    
    addClause('4.2', 'Payment of Taxes',
      'The Trustee shall pay all applicable estate, inheritance, and other taxes from the Trust estate as required by law.');
    
    addClause('4.3', 'Distribution of Residual Estate',
      `After payment of all expenses, debts, and taxes, the remaining Trust estate shall be distributed to the following beneficiaries:\n\n${d.primary_beneficiaries}\n\nShares: ${d.beneficiary_shares}`);
    
    addClause('4.4', 'Per Stirpes Distribution',
      'If any beneficiary predeceases the Trustors, that beneficiary\'s share shall pass to his or her descendants by right of representation (per stirpes). If a beneficiary dies without descendants, that share shall be divided equally among the remaining beneficiaries.');
    
    addClause('4.5', 'Survivorship Requirement',
      'A beneficiary must survive the Trustor by at least thirty (30) days to be entitled to any distribution under this Trust. If a beneficiary fails to survive by this period, their share shall pass as if they had predeceased the Trustor.');

    // ==================== ARTICLE V - MINOR'S TRUST ====================
    addPage();
    addSection("ARTICLE V. MINOR'S TRUST PROVISIONS");
    
    addClause('5.1', "Minor's Trust",
      `Any distribution to a beneficiary under the age of ${d.minor_distribution_age} shall be held in a separate trust (the "Minor's Trust") for that beneficiary until they attain such age. During this time, the Trustee may distribute income and principal for the beneficiary's health, education, maintenance, and support.`);
    
    addClause('5.2', "Minor's Trust Trustee",
      `${d.minor_trust_trustee} shall serve as Trustee of any Minor's Trust created hereunder. If unable to serve, the next Successor Trustee shall serve.`);
    
    addClause('5.3', 'Education Priority',
      "The Trustee is encouraged to prioritize distributions for the beneficiary's education, including college, graduate school, and vocational training.");
    
    addClause('5.4', 'Final Distribution',
      `Upon the beneficiary attaining age ${d.minor_distribution_age}, the Trustee shall distribute the entire remaining balance of the Minor's Trust to the beneficiary, free of trust.`);

    // ==================== ARTICLE VI - INCAPACITY ====================
    addSection('ARTICLE VI. INCAPACITY PROVISIONS');
    
    addClause('6.1', 'Determination of Incapacity',
      'A Trustor shall be deemed incapacitated upon written determination by two (2) licensed physicians stating that the Trustor is unable to manage his or her financial affairs due to mental or physical illness, injury, or deterioration.');
    
    addClause('6.2', 'Management During Incapacity',
      "Upon a Trustor's incapacity, the Co-Trustee (or Successor Trustee if needed) shall assume full management of the Trust and shall use Trust assets for the incapacitated Trustor's health, education, maintenance, support, and comfort, taking into account the Trustor's accustomed standard of living.");
    
    addClause('6.3', 'Recovery from Incapacity',
      'If the Trustor recovers capacity, as certified by one licensed physician, the Trustor shall resume serving as Trustee upon written notice to any acting Trustee.');

    // ==================== ARTICLE VII - SPECIAL PROVISIONS ====================
    addPage();
    addSection('ARTICLE VII. SPECIAL PROVISIONS');
    
    addClause('7.1', 'Digital Assets',
      'The Trustee is authorized to access, manage, and control digital assets pursuant to applicable law, including the California Revised Uniform Fiduciary Access to Digital Assets Act. This includes cryptocurrency, online accounts, social media accounts, email, cloud storage, and digital files. The Trustors authorize the Trustee to access any digital accounts.');
    
    addClause('7.2', 'Business Interests',
      'The Trustee may continue, operate, or liquidate any business interest held in the Trust without liability for loss, provided the Trustee acts in good faith. The Trustee shall have full authority to manage, sell, or liquidate any business interests.');
    
    addClause('7.3', 'Real Property Management',
      'The Trustee may lease, repair, improve, insure, refinance, or sell any real property held in trust. The Trustee shall comply with all homeowners\' association rules and may pay assessments and related charges from Trust funds.');
    
    addClause('7.4', 'Tangible Personal Property',
      'The Trustee shall distribute tangible personal property in accordance with any written memorandum signed by the Trustors, whether or not incorporated herein. Items not disposed of by memorandum shall be distributed equally among the beneficiaries.');

    // ==================== ARTICLE VIII - ADMINISTRATION ====================
    addPage();
    addSection('ARTICLE VIII. ADMINISTRATIVE PROVISIONS');
    
    addClause('8.1', 'Spendthrift Protection',
      'No interest of any beneficiary shall be subject to voluntary or involuntary transfer, assignment, pledge, or seizure by creditors prior to actual distribution. No beneficiary may anticipate, encumber, or assign their interest in the Trust.');
    
    addClause('8.2', 'Accountings',
      'The Trustee shall provide annual accountings to all adult beneficiaries then entitled to receive distributions, showing all receipts, disbursements, and distributions made during the accounting period.');
    
    addClause('8.3', 'Dispute Resolution',
      'Any dispute arising under this Trust shall first be submitted to mediation in the county of the Trustors\' residence. If mediation fails to resolve the dispute within sixty (60) days, the matter may proceed to litigation.');
    
    addClause('8.4', 'No-Contest Clause',
      'Any beneficiary who contests this Trust or any of its provisions, or who challenges the validity of any amendment, without probable cause shall forfeit his or her entire interest in the Trust and shall receive nothing from the Trust estate. This provision shall be enforced to the fullest extent permitted by California Probate Code Section 21311.');
    
    addClause('8.5', 'Severability',
      'If any provision of this Trust is held invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect.');
    
    addClause('8.6', 'Headings',
      'Headings used in this Trust are for convenience only and shall not affect interpretation.');
    
    addClause('8.7', 'Construction',
      'Words of gender shall include all genders, and words in the singular shall include the plural, where the context so requires.');

    // ==================== SIGNATURE PAGE ====================
    addPage();
    y = 35;
    centerText('SIGNATURE PAGE', y, 16, 'bold');
    y += 20;
    
    addParagraph('IN WITNESS WHEREOF, the undersigned Trustors have executed this Declaration of Trust as of the date first written above, intending to create a valid revocable living trust under the laws of the State of California.');
    
    y += 30;
    doc.setFont('times', 'bold');
    doc.text('TRUSTOR:', margin, y);
    y += 25;
    doc.setDrawColor(0);
    doc.line(margin, y, margin + 90, y);
    y += 6;
    doc.setFont('times', 'normal');
    doc.text(trustorName, margin, y);
    y += 15;
    doc.text('Date: ________________________________', margin, y);
    
    y += 35;
    doc.setFont('times', 'bold');
    doc.text('CO-TRUSTOR:', margin, y);
    y += 25;
    doc.line(margin, y, margin + 90, y);
    y += 6;
    doc.setFont('times', 'normal');
    doc.text(spouseName, margin, y);
    y += 15;
    doc.text('Date: ________________________________', margin, y);
    
    y += 35;
    doc.setFillColor(255, 251, 235);
    doc.rect(margin, y, contentWidth, 30, 'F');
    doc.setDrawColor(245, 158, 11);
    doc.rect(margin, y, contentWidth, 30, 'S');
    y += 10;
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.text('IMPORTANT: This document must be notarized to be valid.', margin + 5, y);
    y += 6;
    doc.setFont('times', 'normal');
    doc.text('Both Trustors must sign before a California Notary Public.', margin + 5, y);

    // ==================== NOTARY PAGE ====================
    addPage();
    y = 30;
    centerText('CERTIFICATE OF ACKNOWLEDGMENT', y, 14, 'bold');
    centerText('(California All-Purpose Acknowledgment)', y + 8, 11, 'italic');
    y += 25;
    
    doc.setDrawColor(0);
    doc.rect(margin, y, contentWidth, 180, 'S');
    y += 10;
    
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    
    const notaryX = margin + 5;
    doc.text('A notary public or other officer completing this certificate verifies only the identity of the', notaryX, y);
    y += 6;
    doc.text('individual who signed the document to which this certificate is attached, and not the', notaryX, y);
    y += 6;
    doc.text('truthfulness, accuracy, or validity of that document.', notaryX, y);
    y += 15;
    
    doc.text('State of California', notaryX, y);
    y += 8;
    doc.text('County of ________________________________', notaryX, y);
    y += 15;
    
    doc.text('On _________________________ before me, ________________________________________,', notaryX, y);
    y += 6;
    doc.text('                    (date)                                                              (notary name)', notaryX, y);
    y += 10;
    
    doc.text('personally appeared ____________________________________________________________,', notaryX, y);
    y += 6;
    doc.text('                                                           (name(s) of signer(s))', notaryX, y);
    y += 10;
    
    doc.text('who proved to me on the basis of satisfactory evidence to be the person(s) whose name(s)', notaryX, y);
    y += 6;
    doc.text('is/are subscribed to the within instrument and acknowledged to me that he/she/they', notaryX, y);
    y += 6;
    doc.text('executed the same in his/her/their authorized capacity(ies), and that by his/her/their', notaryX, y);
    y += 6;
    doc.text('signature(s) on the instrument the person(s), or the entity upon behalf of which the', notaryX, y);
    y += 6;
    doc.text('person(s) acted, executed the instrument.', notaryX, y);
    y += 12;
    
    doc.text('I certify under PENALTY OF PERJURY under the laws of the State of California that the', notaryX, y);
    y += 6;
    doc.text('foregoing paragraph is true and correct.', notaryX, y);
    y += 12;
    
    doc.text('WITNESS my hand and official seal.', notaryX, y);
    y += 20;
    
    doc.text('Signature: _________________________________', notaryX, y);
    y += 20;
    
    doc.rect(notaryX, y, 60, 25, 'S');
    doc.setFontSize(9);
    doc.text('(Notary Seal)', notaryX + 18, y + 14);

    // ==================== SCHEDULE A ====================
    addPage();
    y = 30;
    centerText('SCHEDULE A', y, 16, 'bold');
    y += 10;
    centerText('PROPERTY TRANSFERRED TO TRUST', y, 12, 'bold');
    y += 20;
    
    addParagraph('The following property is hereby transferred to and shall be held as part of this Trust. Additional property may be added by written assignment or by designation of the Trust as beneficiary.');
    y += 10;
    
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, y, contentWidth, 120, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.rect(margin, y, contentWidth, 120, 'S');
    y += 10;
    
    doc.setFont('times', 'bold');
    doc.text('1. REAL PROPERTY:', margin + 5, y);
    y += 8;
    doc.setFont('times', 'normal');
    doc.text('    a) 222 S Figueroa St, Los Angeles, CA 90012', margin + 5, y);
    y += 6;
    doc.text('    b) 456 Beach Blvd, Huntington Beach, CA 92648', margin + 5, y);
    y += 12;
    
    doc.setFont('times', 'bold');
    doc.text('2. PERSONAL PROPERTY:', margin + 5, y);
    y += 8;
    doc.setFont('times', 'normal');
    doc.text('    All furniture, furnishings, jewelry, artwork, vehicles, and other tangible', margin + 5, y);
    y += 6;
    doc.text('    personal property owned by the Trustors.', margin + 5, y);
    y += 12;
    
    doc.setFont('times', 'bold');
    doc.text('3. FINANCIAL ACCOUNTS:', margin + 5, y);
    y += 8;
    doc.setFont('times', 'normal');
    doc.text('    All bank accounts, investment accounts, and brokerage accounts retitled to Trust.', margin + 5, y);
    y += 12;
    
    doc.setFont('times', 'bold');
    doc.text('4. BUSINESS INTERESTS:', margin + 5, y);
    y += 8;
    doc.setFont('times', 'normal');
    doc.text('    All business interests, LLC memberships, and partnership interests.', margin + 5, y);
    y += 12;
    
    doc.setFont('times', 'bold');
    doc.text('5. DIGITAL ASSETS:', margin + 5, y);
    y += 8;
    doc.setFont('times', 'normal');
    doc.text('    Cryptocurrency, online accounts, and digital files.', margin + 5, y);
    
    y += 25;
    doc.setFont('times', 'normal');
    doc.text('Trustor Initials: _______ _______          Date: _____________', margin, y);

    // ==================== FOOTER ON ALL PAGES ====================
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont('times', 'normal');
      doc.setTextColor(128);
      doc.text(`${trustName}`, pageWidth / 2, pageHeight - 12, { align: 'center' });
      doc.text(`Page ${i} of ${totalPages} | Multi Servicios 360 | www.multiservicios360.net`, pageWidth / 2, pageHeight - 6, { align: 'center' });
      doc.setTextColor(0);
    }

    // Generate blob URL
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setLoading(false);
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'Living_Trust_Sample.pdf';
      link.click();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1F2937', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '16px', backgroundColor: '#374151', borderRadius: '8px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>📄 Trust Document Preview</h1>
            <p style={{ color: '#9CA3AF', margin: '4px 0 0 0', fontSize: '14px' }}>Sample California Living Trust - Elite Tier</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={generatePDF} style={{ padding: '10px 20px', backgroundColor: '#4B5563', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              🔄 Regenerate
            </button>
            <button onClick={downloadPDF} style={{ padding: '10px 20px', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              ⬇️ Download PDF
            </button>
          </div>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: 'white' }}>
            <p style={{ fontSize: '18px' }}>Generating PDF...</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '10px' }}>
            <iframe
              src={pdfUrl}
              style={{ width: '100%', height: '800px', border: 'none', borderRadius: '4px' }}
              title="Trust PDF Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}