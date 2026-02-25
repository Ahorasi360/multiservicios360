export const dynamic = 'force-dynamic';
// app/api/llc/generate-oa/route.js
// Operating Agreement PDF Assembler
// Reads clause library → filters by tier/intake → replaces tokens → generates PDF
//
// Usage: POST /api/llc/generate-oa
// Body: { matterId: string } or { intakeData: {}, tier: string }

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SPANISH_CLAUSES, SPANISH_PURPOSES } from '../../../../lib/oa-clauses-es';


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// =====================================================
// CLAUSE MANIFEST (inline to avoid import issues on Vercel)
// =====================================================
const CLAUSE_MANIFEST = [
  { clause_id: 'OA_000', file: 'OA_000_PREAMBLE.md', title: 'Preamble and Recitals', section_order: 0, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_001', file: 'OA_001_FORMATION.md', title: 'Formation and Organization', section_order: 1, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_002', file: 'OA_002_PURPOSE.md', title: 'Purpose and Powers', section_order: 2, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_003', file: 'OA_003_DEFINITIONS.md', title: 'Definitions', section_order: 3, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_004', file: 'OA_004_MEMBERS_SINGLE.md', title: 'Members (Single-Member)', section_order: 4, tier: 'All', llc_type: 'single', triggers: ['member_count==1'], mutually_exclusive_with: ['OA_005'], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_005', file: 'OA_005_MEMBERS_MULTI.md', title: 'Members (Multi-Member)', section_order: 4, tier: 'All', llc_type: 'multi', triggers: ['member_count>1'], mutually_exclusive_with: ['OA_004'], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_006', file: 'OA_006_CAPITAL_CONTRIBUTIONS.md', title: 'Capital Contributions', section_order: 5, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_007', file: 'OA_007_MGMT_MEMBER_MANAGED.md', title: 'Management (Member-Managed)', section_order: 6, tier: 'All', llc_type: 'All', triggers: ['management_type==member'], mutually_exclusive_with: ['OA_008'], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_008', file: 'OA_008_MGMT_MANAGER_MANAGED.md', title: 'Management (Manager-Managed)', section_order: 6, tier: 'llc_plus', llc_type: 'All', triggers: ['management_type==manager'], mutually_exclusive_with: ['OA_007'], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_009', file: 'OA_009_VOTING_MEETINGS.md', title: 'Voting and Meetings', section_order: 7, tier: 'All', llc_type: 'multi', triggers: ['member_count>1'], mutually_exclusive_with: [], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_010', file: 'OA_010_ALLOCATIONS.md', title: 'Allocations of Profit and Loss', section_order: 8, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_011', file: 'OA_011_DISTRIBUTIONS.md', title: 'Distributions', section_order: 9, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_012', file: 'OA_012_TAX_MATTERS.md', title: 'Tax Matters', section_order: 10, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_013', file: 'OA_013_TRANSFER_RESTRICTIONS.md', title: 'Transfer Restrictions', section_order: 11, tier: 'All', llc_type: 'multi', triggers: ['member_count>1'], mutually_exclusive_with: [], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_014', file: 'OA_014_RIGHT_OF_FIRST_REFUSAL.md', title: 'Right of First Refusal', section_order: 12, tier: 'llc_plus', llc_type: 'multi', triggers: ['member_count>1'], mutually_exclusive_with: [], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_015', file: 'OA_015_NEW_MEMBERS.md', title: 'Admission of New Members', section_order: 13, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_016', file: 'OA_016_WITHDRAWAL.md', title: 'Withdrawal of Members', section_order: 14, tier: 'All', llc_type: 'multi', triggers: ['member_count>1'], mutually_exclusive_with: [], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_017', file: 'OA_017_DISSOLUTION.md', title: 'Dissolution and Winding Up', section_order: 15, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_018', file: 'OA_018_INDEMNIFICATION.md', title: 'Indemnification', section_order: 16, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_019', file: 'OA_019_LIMITATION_OF_LIABILITY.md', title: 'Limitation of Liability', section_order: 17, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_020', file: 'OA_020_BOOKS_RECORDS.md', title: 'Books and Records', section_order: 18, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_021', file: 'OA_021_CONFIDENTIALITY.md', title: 'Confidentiality', section_order: 19, tier: 'llc_plus', llc_type: 'multi', triggers: ['member_count>1'], mutually_exclusive_with: [], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_022', file: 'OA_022_NON_COMPETE.md', title: 'Non-Competition', section_order: 20, tier: 'llc_elite', llc_type: 'multi', triggers: ['member_count>1', 'wants_non_compete==true'], mutually_exclusive_with: [], attorney_review_required: true, always_include: false },
  { clause_id: 'OA_023', file: 'OA_023_DISPUTE_RESOLUTION.md', title: 'Dispute Resolution', section_order: 21, tier: 'All', llc_type: 'multi', triggers: ['member_count>1'], mutually_exclusive_with: [], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_024', file: 'OA_024_BUY_SELL.md', title: 'Buy-Sell / Buyout Provisions', section_order: 22, tier: 'llc_elite', llc_type: 'multi', triggers: ['member_count>1'], mutually_exclusive_with: ['OA_025'], attorney_review_required: true, always_include: false },
  { clause_id: 'OA_025', file: 'OA_025_DEATH_INCAPACITY.md', title: 'Death and Incapacity', section_order: 22, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: ['OA_024'], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_026', file: 'OA_026_INSURANCE.md', title: 'Insurance', section_order: 23, tier: 'llc_plus', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_027', file: 'OA_027_INTELLECTUAL_PROPERTY.md', title: 'Intellectual Property', section_order: 24, tier: 'llc_plus', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_028', file: 'OA_028_DEADLOCK.md', title: 'Deadlock Resolution', section_order: 25, tier: 'llc_elite', llc_type: 'multi', triggers: ['member_count==2', 'equal_ownership==true'], mutually_exclusive_with: [], attorney_review_required: true, always_include: false },
  { clause_id: 'OA_029', file: 'OA_029_SPOUSAL_CONSENT.md', title: 'Spousal Consent', section_order: 26, tier: 'llc_plus', llc_type: 'All', triggers: ['has_spouse==true'], mutually_exclusive_with: [], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_030', file: 'OA_030_AMENDMENT.md', title: 'Amendment', section_order: 27, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_031', file: 'OA_031_ENTIRE_AGREEMENT.md', title: 'Entire Agreement', section_order: 28, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_032', file: 'OA_032_GOVERNING_LAW.md', title: 'Governing Law', section_order: 29, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_033', file: 'OA_033_SEVERABILITY.md', title: 'Severability', section_order: 30, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_034', file: 'OA_034_NOTICES.md', title: 'Notices', section_order: 31, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_035', file: 'OA_035_COUNTERPARTS.md', title: 'Counterparts', section_order: 32, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_036', file: 'OA_036_FORCE_MAJEURE.md', title: 'Force Majeure', section_order: 33, tier: 'llc_elite', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_037', file: 'OA_037_WAIVER_GENERAL.md', title: 'Waiver and General Provisions', section_order: 34, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_038', file: 'OA_038_SCHEDULE_A.md', title: 'Schedule A — Members', section_order: 90, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
  { clause_id: 'OA_039', file: 'OA_039_SCHEDULE_B.md', title: 'Schedule B — Managers', section_order: 91, tier: 'All', llc_type: 'All', triggers: ['management_type==manager'], mutually_exclusive_with: [], attorney_review_required: false, always_include: false },
  { clause_id: 'OA_040', file: 'OA_040_SIGNATURE_BLOCK.md', title: 'Signature Block', section_order: 99, tier: 'All', llc_type: 'All', triggers: [], mutually_exclusive_with: [], attorney_review_required: false, always_include: true },
];

// =====================================================
// TIER HIERARCHY
// =====================================================
const TIER_LEVELS = { llc_standard: 1, llc_plus: 2, llc_elite: 3 };

function tierIncludes(clauseTier, selectedTier) {
  if (clauseTier === 'All') return true;
  return (TIER_LEVELS[selectedTier] || 1) >= (TIER_LEVELS[clauseTier] || 1);
}

// =====================================================
// TRIGGER EVALUATOR
// =====================================================
function evaluateTrigger(trigger, intakeData) {
  const match = trigger.match(/^(\w+)(==|!=|>|<|>=|<=)(.+)$/);
  if (!match) return true;

  const [, field, op, rawVal] = match;
  const actual = intakeData[field];
  if (actual === undefined || actual === null) return false;

  const numActual = Number(actual);
  const numExpect = Number(rawVal);
  const isNum = !isNaN(numActual) && !isNaN(numExpect);

  switch (op) {
    case '==': return isNum ? numActual === numExpect : String(actual) === rawVal;
    case '!=': return isNum ? numActual !== numExpect : String(actual) !== rawVal;
    case '>':  return isNum && numActual > numExpect;
    case '<':  return isNum && numActual < numExpect;
    case '>=': return isNum && numActual >= numExpect;
    case '<=': return isNum && numActual <= numExpect;
    default: return true;
  }
}

// =====================================================
// CLAUSE SELECTOR
// =====================================================
function selectClauses(intakeData, tier) {
  const memberCount = parseInt(intakeData.member_count) || 1;
  const llcType = memberCount === 1 ? 'single' : 'multi';

  const sorted = [...CLAUSE_MANIFEST].sort((a, b) => a.section_order - b.section_order);

  const selected = [];
  const excluded = new Set();

  for (const clause of sorted) {
    if (excluded.has(clause.clause_id)) continue;
    if (!tierIncludes(clause.tier, tier)) continue;
    if (clause.llc_type !== 'All' && clause.llc_type !== llcType) continue;

    if (clause.always_include) {
      if (!excluded.has(clause.clause_id)) {
        selected.push(clause);
        (clause.mutually_exclusive_with || []).forEach(id => excluded.add(id));
      }
      continue;
    }

    if (clause.triggers && clause.triggers.length > 0) {
      const allPass = clause.triggers.every(t => evaluateTrigger(t, intakeData));
      if (!allPass) continue;
    }

    selected.push(clause);
    (clause.mutually_exclusive_with || []).forEach(id => excluded.add(id));
  }

  return selected;
}

// =====================================================
// TOKEN REPLACEMENT
// =====================================================
function buildTokenMap(intakeData) {
  const memberCount = parseInt(intakeData.member_count) || 1;
  const isSingle = memberCount === 1;
  const isManagerManaged = intakeData.management_type === 'manager';

  const purposes = {
    general: 'to engage in any and all lawful business activities for which a limited liability company may be organized under the California Revised Uniform Limited Liability Company Act',
    professional: 'to provide professional services as permitted by applicable law',
    real_estate: 'to acquire, hold, manage, develop, lease, and dispose of real property and interests therein',
    other: intakeData.business_purpose_other || 'to engage in any lawful business purpose'
  };

  let memberNamesClause = '';
  if (isSingle) {
    memberNamesClause = `${intakeData.member_1_name || '[MEMBER NAME]'} (the "Member")`;
  } else {
    const names = [];
    if (intakeData.member_1_name) names.push(intakeData.member_1_name);
    if (intakeData.member_2_name) names.push(intakeData.member_2_name);
    if (intakeData.member_3_name) names.push(intakeData.member_3_name);
    memberNamesClause = names.length > 0
      ? `${names.join(' and ')} (collectively, the "Members")`
      : '[MEMBER NAMES] (collectively, the "Members")';
  }

  const fullAddress = [
    intakeData.principal_street,
    intakeData.principal_city,
    'CA',
    intakeData.principal_zip
  ].filter(Boolean).join(', ') || '[PRINCIPAL ADDRESS]';

  let agentName = '[REGISTERED AGENT]';
  let agentAddress = '[AGENT ADDRESS]';
  if (intakeData.agent_type === 'platform') {
    agentName = 'Multi Servicios 360';
    agentAddress = 'Beverly Hills, CA 90210';
  } else if (intakeData.agent_type === 'self') {
    agentName = intakeData.member_1_name || '[YOUR NAME]';
    agentAddress = fullAddress;
  } else {
    agentName = intakeData.agent_name || '[REGISTERED AGENT]';
    agentAddress = intakeData.agent_address || '[AGENT ADDRESS]';
  }

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let effectiveDate = today;
  if (intakeData.effective_date) {
    const raw = intakeData.effective_date.trim().toLowerCase();
    if (raw === 'today' || raw === 'hoy') {
      effectiveDate = today;
    } else {
      const parts = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (parts) {
        const d = new Date(parseInt(parts[3]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        effectiveDate = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } else {
        effectiveDate = intakeData.effective_date;
      }
    }
  }

  const formatContribution = (val) => {
    if (!val || val === '0') return '$0';
    const num = parseFloat(String(val).replace(/[$,]/g, ''));
    if (isNaN(num)) return '$' + val;
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const c1 = parseFloat(String(intakeData.member_1_contribution || '0').replace(/[$,]/g, '')) || 0;
  const c2 = parseFloat(String(intakeData.member_2_contribution || '0').replace(/[$,]/g, '')) || 0;
  const c3 = parseFloat(String(intakeData.member_3_contribution || '0').replace(/[$,]/g, '')) || 0;
  const totalContributions = c1 + c2 + c3;

  return {
    '{{company_name}}': `${intakeData.llc_name || '[LLC NAME]'} ${intakeData.llc_suffix || 'LLC'}`,
    '{{company_suffix}}': intakeData.llc_suffix || 'LLC',
    '{{effective_date}}': effectiveDate,
    '{{formation_date}}': '_______________, 20____',
    '{{principal_address}}': fullAddress,
    '{{agent_name}}': agentName,
    '{{agent_address}}': agentAddress,
    '{{management_reference}}': isManagerManaged ? 'Manager(s)' : 'Members',
    '{{member_reference}}': isSingle ? 'Member' : 'Members',
    '{{member_names_and_clause}}': memberNamesClause,
    '{{member_1_name}}': intakeData.member_1_name || '[MEMBER 1 NAME]',
    '{{member_1_address}}': intakeData.member_1_address || '[MEMBER 1 ADDRESS]',
    '{{member_1_contribution}}': formatContribution(intakeData.member_1_contribution),
    '{{member_1_percentage}}': intakeData.member_1_percentage || (isSingle ? '100' : '[PERCENTAGE]'),
    '{{member_2_name}}': intakeData.member_2_name || '[MEMBER 2 NAME]',
    '{{member_2_address}}': intakeData.member_2_address || '[MEMBER 2 ADDRESS]',
    '{{member_2_contribution}}': formatContribution(intakeData.member_2_contribution),
    '{{member_2_percentage}}': intakeData.member_2_percentage || '[PERCENTAGE]',
    '{{member_3_name}}': intakeData.member_3_name || '[MEMBER 3 NAME]',
    '{{member_3_address}}': intakeData.member_3_address || '[MEMBER 3 ADDRESS]',
    '{{member_3_contribution}}': formatContribution(intakeData.member_3_contribution),
    '{{member_3_percentage}}': intakeData.member_3_percentage || '[PERCENTAGE]',
    '{{total_contributions}}': '$' + totalContributions.toLocaleString('en-US'),
    '{{manager_1_name}}': intakeData.manager_1_name || intakeData.member_1_name || '[MANAGER NAME]',
    '{{manager_1_address}}': intakeData.manager_1_address || intakeData.member_1_address || '[MANAGER ADDRESS]',
    '{{manager_2_name}}': intakeData.manager_2_name || '[MANAGER 2 NAME]',
    '{{manager_2_address}}': intakeData.manager_2_address || '[MANAGER 2 ADDRESS]',
    '{{manager_count}}': String(intakeData.manager_count || 1),
    '{{tax_classification_text}}': isSingle ? 'a disregarded entity' : 'a partnership',
    '{{tax_matters_member_name}}': intakeData.tax_matters_member || intakeData.member_1_name || '[TAX MATTERS MEMBER]',
    '{{business_purpose_text}}': purposes[intakeData.business_purpose] || purposes.general,
    '{{debt_threshold}}': intakeData.debt_threshold || '25,000',
    '{{amendment_threshold}}': isSingle ? 'the sole Member' : 'all Members',
    '{{mediation_county}}': intakeData.mediation_county || 'Los Angeles',
    '{{arbitration_county}}': intakeData.arbitration_county || 'Los Angeles',
    '{{venue_county}}': intakeData.venue_county || 'Los Angeles',
    '{{authorized_signer_name}}': intakeData.authorized_signer_name || intakeData.member_1_name || '[AUTHORIZED SIGNER]',
    '{{authorized_signer_title}}': intakeData.authorized_signer_title || (isManagerManaged ? 'Manager' : 'Member'),
    '{{member_label_1}}': isSingle ? 'SOLE MEMBER' : 'MEMBER 1',
    '{{member_label_2}}': 'MEMBER 2',
    '{{member_label_3}}': 'MEMBER 3',
    '{{spouse_name}}': intakeData.spouse_name || '[SPOUSE NAME]',
    '{{member_name_requiring_consent}}': intakeData.member_name_requiring_consent || intakeData.member_1_name || '[MEMBER NAME]',
    // Spanish tokens
    '{{member_reference_es}}': isSingle ? 'el Miembro' : 'los Miembros',
    '{{business_purpose_text_es}}': purposes[intakeData.business_purpose] || purposes.general,
    '{{tax_classification_text_es}}': isSingle ? 'una entidad no considerada separada de su propietario' : 'una sociedad',
    '{{authorized_signer_title_es}}': isManagerManaged ? 'Gerente' : 'Miembro',
    '{{member_label_1_es}}': isSingle ? 'MIEMBRO ÚNICO' : 'MIEMBRO 1',
    '{{member_label_2_es}}': 'MIEMBRO 2',
    '{{member_label_3_es}}': 'MIEMBRO 3',
  };
}

function replaceTokens(text, tokenMap) {
  let result = text;
  for (const [token, value] of Object.entries(tokenMap)) {
    result = result.replaceAll(token, value);
  }
  result = result.replace(/\$\$/g, '$');
  return result;
}

function processConditionals(text, intakeData) {
  return text.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, variable, content) => {
    const val = intakeData[variable];
    if (val && val !== false && val !== 'false' && val !== '' && val !== '0') {
      return content;
    }
    return '';
  });
}

// =====================================================
// MARKDOWN → STRUCTURED TEXT
// =====================================================
function stripYamlFrontMatter(text) {
  return text.replace(/^---[\s\S]*?---\n*/, '');
}

function cleanMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^---$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// =====================================================
// ARTICLE NUMBERING
// =====================================================
function romanNumeral(num) {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
  }
  return result;
}

// =====================================================
// SINGLE-MEMBER LANGUAGE NORMALIZATION
// =====================================================
function normalizeSingleMemberText(text, lang) {
  if (lang === 'es') {
    text = text.replace(/consentimiento escrito unánime de todos los Miembros/g, 'consentimiento escrito del Miembro Único');
    text = text.replace(/Mayoría de Interés/g, 'Miembro Único');
    text = text.replace(/los Miembros restantes/g, 'el Miembro');
    text = text.replace(/Miembros restantes/g, 'el Miembro');
    text = text.replace(/(?<!\bde )los Miembros/g, 'el Miembro');
    text = text.replace(/Los Miembros/g, 'El Miembro');
  } else {
    text = text.replace(/unanimous written consent of all Members/g, 'written consent of the Sole Member');
    text = text.replace(/Majority in Interest/g, 'Sole Member');
    text = text.replace(/the remaining Members/g, 'the Member');
    text = text.replace(/remaining Members/g, 'the Member');
    text = text.replace(/the Members/g, 'the Member');
    text = text.replace(/The Members/g, 'The Member');
  }
  return text;
}

// =====================================================
// MAIN ASSEMBLER
// =====================================================
async function assembleOA(intakeData, tier, language = 'en') {
  const selectedClauses = selectClauses(intakeData, tier);
  const tokenMap = buildTokenMap(intakeData);
  const clauseDir = path.join(process.cwd(), 'lib', 'oa-clauses');

  const sections = [];
  let articleNum = 0;
  const attorneyFlagged = [];

  for (const clause of selectedClauses) {
    const filePath = path.join(clauseDir, clause.file);
    let content;

    // Spanish: use JS map instead of .md files
    if (language === 'es' && SPANISH_CLAUSES[clause.clause_id]) {
      content = SPANISH_CLAUSES[clause.clause_id];
    } else {
      try {
        content = fs.readFileSync(filePath, 'utf-8');
      } catch (err) {
        console.warn(`Missing clause file: ${clause.file}`);
        continue;
      }
    }

    // Step 1: Strip YAML front matter
    content = stripYamlFrontMatter(content);

    // Step 2: Replace tokens
    content = replaceTokens(content, tokenMap);

    // Step 3: Process conditionals
    content = processConditionals(content, intakeData);

    // Step 4: Clean markdown (strips ## headers, bold markers, etc.)
    content = cleanMarkdown(content);

    // Step 5: Strip duplicate preamble title block AFTER markdown is cleaned
    // (Title page already shows this info, so remove it from body text)
    if (clause.clause_id === 'OA_000') {
      content = content.replace(/^OPERATING AGREEMENT[\s\S]*?A California Limited Liability Company\s*\n*/i, '');
      content = content.replace(/^ACUERDO OPERATIVO[\s\S]*?Una Compañía de Responsabilidad Limitada de California\s*\n*/i, '');
    }

    // Step 6: Single-member language normalization
    const memberCount = parseInt(intakeData.member_count) || 1;
    if (memberCount === 1) {
      content = normalizeSingleMemberText(content, language);
    }

    // Step 7: Renumber articles (skip preamble, schedules, and signature block)
    let articleLabel = '';
    if (clause.section_order >= 1 && clause.section_order < 90) {
      articleNum++;
      articleLabel = language === 'es'
        ? `ARTÍCULO ${romanNumeral(articleNum)}`
        : `ARTICLE ${romanNumeral(articleNum)}`;
    }

    sections.push({
      clauseId: clause.clause_id,
      title: clause.title,
      articleLabel,
      content,
      attorneyReview: clause.attorney_review_required
    });

    if (clause.attorney_review_required) {
      attorneyFlagged.push(clause.title);
    }
  }

  return { sections, attorneyFlagged, clauseCount: selectedClauses.length };
}

// =====================================================
// API ROUTE HANDLER
// =====================================================
export async function POST(request) {
  try {
    const body = await request.json();
    let intakeData, tier;

    // Option 1: Load from Supabase by matterId
    if (body.matterId) {
      const { data, error } = await supabase
        .from('llc_matters')
        .select('*')
        .eq('id', body.matterId)
        .single();

      if (error || !data) {
        return NextResponse.json({ success: false, error: 'Matter not found' }, { status: 404 });
      }

      intakeData = data.intake_data || {};
      tier = data.review_tier || 'llc_standard';
    }
    // Option 2: Direct intake data
    else if (body.intakeData) {
      intakeData = body.intakeData;
      tier = body.tier || 'llc_standard';
    } else {
      return NextResponse.json({ success: false, error: 'matterId or intakeData required' }, { status: 400 });
    }

    const language = body.language || 'en';
    const { sections, attorneyFlagged, clauseCount } = await assembleOA(intakeData, tier, language);

    // Build title/subtitle based on language
    const companyFull = `${(intakeData.llc_name || '[LLC NAME]').toUpperCase()} ${(intakeData.llc_suffix || 'LLC').toUpperCase()}`;
    const docTitle = language === 'es'
      ? `ACUERDO OPERATIVO DE ${companyFull}`
      : `OPERATING AGREEMENT OF ${companyFull}`;
    const docSubtitle = language === 'es'
      ? 'Una Compañía de Responsabilidad Limitada de California'
      : 'A California Limited Liability Company';

    return NextResponse.json({
      success: true,
      document: {
        title: docTitle,
        subtitle: docSubtitle,
        sections,
        clauseCount,
        attorneyFlagged,
        tier,
        language,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('OA assembler error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Assembly failed' },
      { status: 500 }
    );
  }
}