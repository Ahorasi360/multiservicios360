// OA Clause Library Manifest
// Generated for Multi Servicios 360 LLC Operating Agreement Automation
// California RULLCA Compliant
//
// MERGE FIELD TOKENS:
// {{company_name}}           - Full LLC name (e.g., "Acme Holdings LLC")
// {{company_suffix}}         - LLC suffix chosen (LLC, L.L.C.)
// {{effective_date}}         - Date of agreement
// {{formation_date}}         - Date Articles filed with CA SOS
// {{principal_address}}      - Full principal address
// {{agent_name}}             - Registered agent name
// {{agent_address}}          - Registered agent address
// {{management_reference}}   - "Members" (member-managed) or "Manager(s)" (manager-managed)
// {{member_reference}}       - "Member" (single) or "Members" (multi)
// {{member_names_and_clause}}- "John Doe (the 'Member')" or "John Doe and Jane Doe (collectively, the 'Members')"
// {{member_1_name}}          - First member full legal name
// {{member_1_address}}       - First member address
// {{member_1_contribution}}  - First member capital contribution amount
// {{member_1_percentage}}    - First member percentage interest
// {{member_2_name}}          - Second member (if multi)
// {{member_2_address}}       - Second member address
// {{member_2_contribution}}  - Second member capital contribution
// {{member_2_percentage}}    - Second member percentage
// {{member_3_name}}          - Third member (if applicable)
// {{member_3_address}}       - Third member address
// {{member_3_contribution}}  - Third member capital contribution
// {{member_3_percentage}}    - Third member percentage
// {{total_contributions}}    - Sum of all contributions
// {{manager_1_name}}         - First manager name (if manager-managed)
// {{manager_1_address}}      - First manager address
// {{manager_2_name}}         - Second manager (if applicable)
// {{manager_2_address}}      - Second manager address
// {{manager_count}}          - Number of managers
// {{tax_classification_text}}- "a disregarded entity" (single) or "a partnership" (multi)
// {{tax_matters_member_name}}- Name of tax matters member/partnership representative
// {{business_purpose_text}}  - Full purpose text based on wizard selection
// {{debt_threshold}}         - Dollar threshold requiring member approval (default $25,000)
// {{amendment_threshold}}    - "the sole Member" or "all Members"
// {{mediation_county}}       - County for mediation (default Los Angeles)
// {{arbitration_county}}     - County for arbitration (default Los Angeles)
// {{venue_county}}           - County for litigation venue (default Los Angeles)
// {{authorized_signer_name}} - Name of person signing on behalf of Company
// {{authorized_signer_title}}- Title of authorized signer
// {{member_label_1}}         - "SOLE MEMBER" or "MEMBER 1"
// {{member_label_2}}         - "MEMBER 2"
// {{member_label_3}}         - "MEMBER 3"
// {{spouse_name}}            - Spouse name (if spousal consent)
// {{member_name_requiring_consent}} - Member whose spouse signs consent
//
// CONDITIONAL BLOCKS:
// {{#if variable}}...{{/if}} - Include block only if variable exists/truthy

export const OA_CLAUSE_MANIFEST = [
  // =====================================================
  // PREAMBLE (always included, always first)
  // =====================================================
  {
    clause_id: 'OA_000',
    file: 'OA_000_PREAMBLE.md',
    title: 'Preamble and Recitals',
    section_order: 0,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: [],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },

  // =====================================================
  // CORE ARTICLES (All tiers)
  // =====================================================
  {
    clause_id: 'OA_001',
    file: 'OA_001_FORMATION.md',
    title: 'Formation and Organization',
    section_order: 1,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: [],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },
  {
    clause_id: 'OA_002',
    file: 'OA_002_PURPOSE.md',
    title: 'Purpose and Powers',
    section_order: 2,
    tier: 'All',
    llc_type: 'All',
    triggers: ['business_purpose'],
    dependencies: ['OA_001'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },
  {
    clause_id: 'OA_003',
    file: 'OA_003_DEFINITIONS.md',
    title: 'Definitions',
    section_order: 3,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_001'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },

  // =====================================================
  // MEMBER ARTICLES (mutually exclusive: single vs multi)
  // =====================================================
  {
    clause_id: 'OA_004',
    file: 'OA_004_MEMBERS_SINGLE.md',
    title: 'Members — Single-Member',
    section_order: 4,
    tier: 'All',
    llc_type: 'single',
    triggers: ['member_count=1'],
    dependencies: ['OA_001', 'OA_003'],
    mutually_exclusive_with: ['OA_005'],
    attorney_review_required: false,
    always_include: false
  },
  {
    clause_id: 'OA_005',
    file: 'OA_005_MEMBERS_MULTI.md',
    title: 'Members — Multi-Member',
    section_order: 4,
    tier: 'All',
    llc_type: 'multi',
    triggers: ['member_count>1'],
    dependencies: ['OA_001', 'OA_003'],
    mutually_exclusive_with: ['OA_004'],
    attorney_review_required: false,
    always_include: false
  },

  // =====================================================
  // CAPITAL & FINANCIAL
  // =====================================================
  {
    clause_id: 'OA_006',
    file: 'OA_006_CAPITAL_CONTRIBUTIONS.md',
    title: 'Capital Contributions',
    section_order: 5,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_003'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },

  // =====================================================
  // MANAGEMENT (mutually exclusive: member vs manager)
  // =====================================================
  {
    clause_id: 'OA_007',
    file: 'OA_007_MGMT_MEMBER_MANAGED.md',
    title: 'Management — Member-Managed',
    section_order: 6,
    tier: 'All',
    llc_type: 'All',
    triggers: ['management_type=member'],
    dependencies: ['OA_001', 'OA_003'],
    mutually_exclusive_with: ['OA_008'],
    attorney_review_required: false,
    always_include: false
  },
  {
    clause_id: 'OA_008',
    file: 'OA_008_MGMT_MANAGER_MANAGED.md',
    title: 'Management — Manager-Managed',
    section_order: 6,
    tier: 'Plus|Elite',
    llc_type: 'All',
    triggers: ['management_type=manager'],
    dependencies: ['OA_001', 'OA_003'],
    mutually_exclusive_with: ['OA_007'],
    attorney_review_required: false,
    always_include: false
  },

  // =====================================================
  // VOTING (multi-member only)
  // =====================================================
  {
    clause_id: 'OA_009',
    file: 'OA_009_VOTING_MEETINGS.md',
    title: 'Voting and Meetings',
    section_order: 7,
    tier: 'All',
    llc_type: 'multi',
    triggers: ['member_count>1'],
    dependencies: ['OA_003', 'OA_005'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: false
  },

  // =====================================================
  // ALLOCATIONS & DISTRIBUTIONS
  // =====================================================
  {
    clause_id: 'OA_010',
    file: 'OA_010_ALLOCATIONS.md',
    title: 'Allocations of Profit and Loss',
    section_order: 8,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_003', 'OA_006'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },
  {
    clause_id: 'OA_011',
    file: 'OA_011_DISTRIBUTIONS.md',
    title: 'Distributions',
    section_order: 9,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_003', 'OA_006', 'OA_010'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },

  // =====================================================
  // TAX
  // =====================================================
  {
    clause_id: 'OA_012',
    file: 'OA_012_TAX_MATTERS.md',
    title: 'Tax Matters',
    section_order: 10,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_003', 'OA_010'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },

  // =====================================================
  // TRANSFER & MEMBERSHIP CHANGES (multi-member)
  // =====================================================
  {
    clause_id: 'OA_013',
    file: 'OA_013_TRANSFER_RESTRICTIONS.md',
    title: 'Transfer Restrictions',
    section_order: 11,
    tier: 'All',
    llc_type: 'multi',
    triggers: ['member_count>1'],
    dependencies: ['OA_003', 'OA_005'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: false
  },
  {
    clause_id: 'OA_014',
    file: 'OA_014_ROFR.md',
    title: 'Right of First Refusal',
    section_order: 12,
    tier: 'Plus|Elite',
    llc_type: 'multi',
    triggers: ['member_count>1', 'has_rofr=true'],
    dependencies: ['OA_003', 'OA_013'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: false
  },
  {
    clause_id: 'OA_015',
    file: 'OA_015_NEW_MEMBERS.md',
    title: 'Admission of New Members',
    section_order: 13,
    tier: 'All',
    llc_type: 'multi',
    triggers: ['member_count>1'],
    dependencies: ['OA_003', 'OA_005', 'OA_006'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: false
  },
  {
    clause_id: 'OA_016',
    file: 'OA_016_WITHDRAWAL.md',
    title: 'Withdrawal and Resignation',
    section_order: 14,
    tier: 'All',
    llc_type: 'multi',
    triggers: ['member_count>1'],
    dependencies: ['OA_003', 'OA_005'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: false
  },

  // =====================================================
  // DISSOLUTION
  // =====================================================
  {
    clause_id: 'OA_017',
    file: 'OA_017_DISSOLUTION.md',
    title: 'Dissolution and Winding Up',
    section_order: 15,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_001', 'OA_003', 'OA_006'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },

  // =====================================================
  // LIABILITY & PROTECTION
  // =====================================================
  {
    clause_id: 'OA_018',
    file: 'OA_018_INDEMNIFICATION.md',
    title: 'Indemnification',
    section_order: 16,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_003'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },
  {
    clause_id: 'OA_019',
    file: 'OA_019_LIMITATION_LIABILITY.md',
    title: 'Limitation of Liability',
    section_order: 17,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_003', 'OA_018'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },

  // =====================================================
  // RECORDS & REPORTING
  // =====================================================
  {
    clause_id: 'OA_020',
    file: 'OA_020_BOOKS_RECORDS.md',
    title: 'Books and Records',
    section_order: 18,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_003'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },

  // =====================================================
  // PROTECTIVE COVENANTS (tier-gated)
  // =====================================================
  {
    clause_id: 'OA_021',
    file: 'OA_021_CONFIDENTIALITY.md',
    title: 'Confidentiality',
    section_order: 19,
    tier: 'Plus|Elite',
    llc_type: 'All',
    triggers: ['has_confidentiality=true'],
    dependencies: ['OA_003'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: false
  },
  {
    clause_id: 'OA_022',
    file: 'OA_022_NONCOMPETE.md',
    title: 'Non-Competition and Non-Solicitation',
    section_order: 20,
    tier: 'Elite',
    llc_type: 'multi',
    triggers: ['has_noncompete=true'],
    dependencies: ['OA_003', 'OA_021'],
    mutually_exclusive_with: [],
    attorney_review_required: true,
    always_include: false
  },

  // =====================================================
  // DISPUTE RESOLUTION
  // =====================================================
  {
    clause_id: 'OA_023',
    file: 'OA_023_DISPUTE_RESOLUTION.md',
    title: 'Dispute Resolution',
    section_order: 21,
    tier: 'All',
    llc_type: 'multi',
    triggers: ['member_count>1'],
    dependencies: ['OA_003'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: false
  },

  // =====================================================
  // ADVANCED PROVISIONS (Elite tier)
  // =====================================================
  {
    clause_id: 'OA_024',
    file: 'OA_024_BUYSELL.md',
    title: 'Buy-Sell and Buyout Provisions',
    section_order: 22,
    tier: 'Elite',
    llc_type: 'multi',
    triggers: ['member_count>1', 'has_buysell=true'],
    dependencies: ['OA_003', 'OA_005', 'OA_013'],
    mutually_exclusive_with: ['OA_025'],
    attorney_review_required: true,
    always_include: false
  },
  {
    clause_id: 'OA_025',
    file: 'OA_025_DEATH_INCAPACITY.md',
    title: 'Death or Incapacity of a Member',
    section_order: 23,
    tier: 'Standard|Plus',
    llc_type: 'multi',
    triggers: ['member_count>1', 'has_buysell=false'],
    dependencies: ['OA_003', 'OA_005'],
    mutually_exclusive_with: ['OA_024'],
    attorney_review_required: false,
    always_include: false
  },
  {
    clause_id: 'OA_026',
    file: 'OA_026_INSURANCE.md',
    title: 'Insurance',
    section_order: 24,
    tier: 'Plus|Elite',
    llc_type: 'All',
    triggers: ['has_insurance_clause=true'],
    dependencies: ['OA_003'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: false
  },
  {
    clause_id: 'OA_027',
    file: 'OA_027_INTELLECTUAL_PROPERTY.md',
    title: 'Intellectual Property',
    section_order: 25,
    tier: 'Plus|Elite',
    llc_type: 'All',
    triggers: ['has_ip_clause=true'],
    dependencies: ['OA_003'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: false
  },
  {
    clause_id: 'OA_028',
    file: 'OA_028_DEADLOCK.md',
    title: 'Deadlock Resolution',
    section_order: 26,
    tier: 'Elite',
    llc_type: 'multi',
    triggers: ['member_count=2', 'has_deadlock_clause=true'],
    dependencies: ['OA_003', 'OA_005', 'OA_009'],
    mutually_exclusive_with: [],
    attorney_review_required: true,
    always_include: false
  },
  {
    clause_id: 'OA_029',
    file: 'OA_029_SPOUSAL_CONSENT.md',
    title: 'Spousal and Community Property Consent',
    section_order: 27,
    tier: 'Plus|Elite',
    llc_type: 'multi',
    triggers: ['has_spousal_consent=true'],
    dependencies: ['OA_003', 'OA_005', 'OA_013'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: false
  },

  // =====================================================
  // GENERAL / BOILERPLATE (All tiers, always included)
  // =====================================================
  {
    clause_id: 'OA_030',
    file: 'OA_030_AMENDMENT.md',
    title: 'Amendment',
    section_order: 28,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_003'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },
  {
    clause_id: 'OA_031',
    file: 'OA_031_ENTIRE_AGREEMENT.md',
    title: 'Entire Agreement',
    section_order: 29,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: [],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },
  {
    clause_id: 'OA_032',
    file: 'OA_032_GOVERNING_LAW.md',
    title: 'Governing Law and Jurisdiction',
    section_order: 30,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: [],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },
  {
    clause_id: 'OA_033',
    file: 'OA_033_SEVERABILITY.md',
    title: 'Severability',
    section_order: 31,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: [],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },
  {
    clause_id: 'OA_034',
    file: 'OA_034_NOTICES.md',
    title: 'Notices',
    section_order: 32,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_003'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },
  {
    clause_id: 'OA_035',
    file: 'OA_035_COUNTERPARTS.md',
    title: 'Counterparts and Electronic Signatures',
    section_order: 33,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: [],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },
  {
    clause_id: 'OA_036',
    file: 'OA_036_FORCE_MAJEURE.md',
    title: 'Force Majeure',
    section_order: 34,
    tier: 'Elite',
    llc_type: 'All',
    triggers: ['has_force_majeure=true'],
    dependencies: ['OA_003'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: false
  },
  {
    clause_id: 'OA_037',
    file: 'OA_037_WAIVER_GENERAL.md',
    title: 'Waiver and Additional Provisions',
    section_order: 35,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: [],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },

  // =====================================================
  // SCHEDULES & EXECUTION (always last)
  // =====================================================
  {
    clause_id: 'OA_038',
    file: 'OA_038_SCHEDULE_A.md',
    title: 'Schedule A — Members',
    section_order: 96,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_001', 'OA_003'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  },
  {
    clause_id: 'OA_039',
    file: 'OA_039_SCHEDULE_B.md',
    title: 'Schedule B — Managers',
    section_order: 97,
    tier: 'Plus|Elite',
    llc_type: 'All',
    triggers: ['management_type=manager'],
    dependencies: ['OA_001', 'OA_008'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: false
  },
  {
    clause_id: 'OA_040',
    file: 'OA_040_SIGNATURE_BLOCK.md',
    title: 'Signature Block',
    section_order: 99,
    tier: 'All',
    llc_type: 'All',
    triggers: [],
    dependencies: ['OA_000'],
    mutually_exclusive_with: [],
    attorney_review_required: false,
    always_include: true
  }
];

// =====================================================
// ASSEMBLY LOGIC REFERENCE
// =====================================================
//
// TIER MAPPING:
//   Standard ($799): ~18-20 clauses — core articles only
//   Plus ($1,199):   ~25-28 clauses — adds ROFR, confidentiality, IP, insurance, spousal consent
//   Elite ($1,699):  ~30-35 clauses — adds buy-sell, deadlock, noncompete, force majeure
//
// ASSEMBLY RULES:
//   1. Sort by section_order ASC
//   2. Include all clauses where always_include = true
//   3. Include clauses matching tier (All = every tier)
//   4. Include clauses matching llc_type (single or multi based on member_count)
//   5. Evaluate triggers against intakeData
//   6. Exclude any clause in mutually_exclusive_with if its counterpart is included
//   7. Renumber Articles sequentially (I, II, III...) based on final included set
//   8. Replace all {{merge_field}} tokens with intakeData values
//   9. Process {{#if}}...{{/if}} conditional blocks
//  10. Flag any clause with attorney_review_required = true
//
// STANDARD TIER INCLUDES:
//   OA_000, OA_001, OA_002, OA_003, OA_004/005, OA_006, OA_007/008,
//   OA_009 (multi), OA_010, OA_011, OA_012, OA_013 (multi),
//   OA_015 (multi), OA_016 (multi), OA_017, OA_018, OA_019, OA_020,
//   OA_023 (multi), OA_025 (multi), OA_030-035, OA_037, OA_038, OA_040
//
// PLUS TIER ADDS:
//   OA_008 (manager option), OA_014, OA_021, OA_026, OA_027, OA_029, OA_039
//
// ELITE TIER ADDS:
//   OA_022, OA_024, OA_028, OA_036
