# CALIFORNIA TRUST - INTAKE QUESTIONS
Last Updated: January 31, 2026

## INSTRUCTIONS FOR AI
- Questions are plain English (no legal jargon)
- User never sees clause names
- System determines clauses from answers
- Bilingual support (EN/ES)
- Follow chat-based wizard pattern from POA

---

## SECTION 1: ABOUT YOU (Trustor)

### Q1. What is your full legal name?
- Maps to: IDENTIFICATION OF TRUSTOR, TRUST NAME
- Variable: trustor_name

### Q2. What is your current address?
- Maps to: IDENTIFICATION OF TRUSTOR
- Variable: trustor_address

### Q3. What is your date of birth?
- Maps to: (internal validation)
- Variable: trustor_dob

### Q4. What is your phone number?
- Maps to: (contact info)
- Variable: trustor_phone

### Q5. What is your email address?
- Maps to: (contact info)
- Variable: trustor_email

---

## SECTION 2: MARITAL STATUS

### Q6. What is your marital status?
- Options: Single / Married / Domestic Partnership / Divorced / Widowed
- Maps to: Trust structure (individual vs joint)
- Variable: marital_status

### Q7. (If married/partnered) What is your spouse/partner's full legal name?
- Maps to: CO-TRUSTOR identification
- Variable: spouse_name

### Q8. (If married/partnered) Will this be a joint trust with your spouse/partner?
- Options: Yes / No
- Maps to: Trust structure
- Variable: is_joint_trust

### Q9. (If married in CA) Is your property community property or separate property?
- Options: Community / Separate / Mix of both
- Maps to: COMMUNITY PROPERTY TREATMENT
- Variable: property_type

---

## SECTION 3: TRUST TYPE

### Q10. Do you want the ability to change or cancel this trust during your lifetime?
- Options: Yes (Revocable) / No (Irrevocable)
- Maps to: REVOCABILITY CLAUSE
- Variable: is_revocable
- Note: 99% choose Revocable

---

## SECTION 4: TRUSTEES

### Q11. Who will manage the trust while you are alive and able?
- Options: Myself / Myself and spouse / Someone else
- Maps to: INITIAL TRUSTEE APPOINTMENT
- Variable: initial_trustee

### Q12. If you become unable to manage your affairs, who should take over as trustee?
- Maps to: SUCCESSOR TRUSTEE, INCAPACITY PROVISIONS
- Variable: successor_trustee_1_name

### Q13. What is this person's relationship to you?
- Variable: successor_trustee_1_relationship

### Q14. What is their phone number?
- Variable: successor_trustee_1_phone

### Q15. If your first choice cannot serve, who is your backup?
- Maps to: SUCCESSOR TRUSTEE (alternate)
- Variable: successor_trustee_2_name

### Q16. What is this backup person's relationship to you?
- Variable: successor_trustee_2_relationship

### Q17. (If joint trust) Should both trustees act together, or can either act alone?
- Options: Must act together / Either can act alone
- Maps to: CO-TRUSTEES clause
- Variable: trustee_action_type

---

## SECTION 5: BENEFICIARIES

### Q18. Who should receive your trust assets after you pass away?
- Options: Spouse / Children equally / Children unequally / Other people / Charity / Combination
- Maps to: RESIDUAL DISTRIBUTION
- Variable: beneficiary_type

### Q19. Please list your primary beneficiaries (name and relationship):
- Maps to: BENEFICIARY IDENTIFICATION
- Variable: primary_beneficiaries[] (array)

### Q20. What percentage should each receive?
- Maps to: RESIDUAL DISTRIBUTION, UNEQUAL DISTRIBUTIONS
- Variable: beneficiary_shares[]

### Q21. If a beneficiary passes away before you, should their share go to:
- Options: Their children (per stirpes) / Remaining beneficiaries (per capita) / Someone specific
- Maps to: PER STIRPES or PER CAPITA clause
- Variable: distribution_method

### Q22. Should a beneficiary be required to survive you by a certain period to inherit?
- Options: No requirement / 120 hours (5 days) / 30 days
- Maps to: 120-HOUR SURVIVORSHIP or none
- Variable: survivorship_requirement

---

## SECTION 6: CHILDREN & MINORS

### Q23. Do you have any children under 18?
- Options: Yes / No
- Maps to: MINOR'S TRUST
- Variable: has_minor_children

### Q24. (If yes) Please list their names and ages:
- Variable: minor_children[]

### Q25. (If yes) At what age should they receive their inheritance?
- Options: 18 / 21 / 25 / Staggered (1/3 at 25, 1/3 at 30, 1/3 at 35)
- Maps to: MINOR'S TRUST, AGE-STAGGERED DISTRIBUTIONS
- Variable: minor_distribution_age

### Q26. (If yes) Who should manage their inheritance until they reach that age?
- Maps to: MINOR'S TRUST trustee
- Variable: minor_trust_trustee

### Q27. Do you have any children or grandchildren not listed who you want to exclude?
- Maps to: OMITTED HEIRS awareness
- Variable: has_excluded_children
- Note: Flag for attorney review if yes

### Q28. Do you have any children who were adopted or born after today?
- Options: Should be included automatically / Should NOT be included
- Maps to: AFTER-BORN/ADOPTED CHILDREN clause
- Variable: afterborn_included

---

## SECTION 7: SPECIAL BENEFICIARY SITUATIONS

### Q29. Does any beneficiary receive government benefits like SSI, Medicaid, or disability?
- Options: Yes / No / Not sure
- Maps to: SPECIAL NEEDS TRUST (ADVANCED - attorney flag)
- Variable: beneficiary_on_benefits
- Note: If yes → trigger attorney review flag

### Q30. Do you want to place any conditions on inheritance (like finishing college, staying drug-free)?
- Options: Yes / No
- Maps to: INCENTIVE TRUST (ADVANCED)
- Variable: has_conditions
- Note: If yes → Elite tier required + attorney flag

---

## SECTION 8: ASSETS

### Q31. Do you own real estate in California?
- Options: Yes / No
- Maps to: REAL PROPERTY MANAGEMENT, SCHEDULE A
- Variable: owns_ca_real_estate

### Q32. (If yes) How many properties?
- Variable: num_properties

### Q33. (If yes) Please provide the address of each property:
- Variable: properties[]

### Q34. Do you own real estate outside California?
- Options: Yes / No
- Maps to: INTERNATIONAL ASSETS (ADVANCED)
- Variable: owns_out_of_state_property

### Q35. Do you own a business or have business interests?
- Options: Yes / No
- Maps to: BUSINESS CONTINUATION clause
- Variable: owns_business

### Q36. Do you have digital assets (cryptocurrency, online accounts, social media)?
- Options: Yes / No
- Maps to: DIGITAL ASSETS AUTHORITY, ONLINE ACCOUNT ACCESS
- Variable: has_digital_assets

### Q37. Do you have specific items (jewelry, art, cars) you want to leave to specific people?
- Options: Yes / No
- Maps to: TANGIBLE PERSONAL PROPERTY MEMORANDUM
- Variable: has_specific_gifts

---

## SECTION 9: INCAPACITY

### Q38. If you become incapacitated, how should that be determined?
- Options: Two doctors agree / One doctor agrees / Court decides
- Maps to: INCAPACITY DEFINITION
- Variable: incapacity_determination
- Default: Two doctors

### Q39. Have you already created a Power of Attorney for finances?
- Options: Yes / No / Not sure
- Maps to: (informational - may upsell POA)
- Variable: has_poa

### Q40. Have you already created a Healthcare Directive?
- Options: Yes / No / Not sure
- Maps to: (informational)
- Variable: has_healthcare_directive

---

## SECTION 10: DISPUTES & ADMINISTRATION

### Q41. If there's a dispute about the trust, how should it be resolved?
- Options: Mediation first, then court / Go directly to court / Binding arbitration
- Maps to: MEDIATION REQUIREMENT or ARBITRATION (ADVANCED)
- Variable: dispute_resolution

### Q42. Should a beneficiary who unsuccessfully challenges the trust lose their inheritance?
- Options: Yes / No
- Maps to: NO-CONTEST (IN TERROREM) - ADVANCED
- Variable: has_no_contest

### Q43. Should the trustee be required to provide annual reports to beneficiaries?
- Options: Yes / No (waive accounting)
- Maps to: ACCOUNTING WAIVER
- Variable: require_accounting

---

## SECTION 11: FINAL DETAILS

### Q44. What county do you live in?
- Maps to: JURISDICTION & VENUE
- Variable: county

### Q45. Is there anything else you want included in your trust?
- Maps to: (free text - flag for review if complex)
- Variable: additional_instructions

### Q46. Which package are you interested in?
- Options: Trust Core ($599) / Trust Plus ($899) / Trust Elite ($1,299)
- Maps to: Tier selection (determines which clauses available)
- Variable: selected_tier

---

## QUESTION-TO-CLAUSE MAPPING SUMMARY

| Question | Clause Triggered | Tier |
|----------|------------------|------|
| Q6-Q9 (married) | Joint trust structure, Community Property | Core |
| Q10 (revocable) | REVOCABILITY clause | Core |
| Q11-Q17 (trustees) | TRUSTEE clauses | Core |
| Q18-Q22 (beneficiaries) | DISTRIBUTION clauses | Core |
| Q21 (per stirpes) | PER STIRPES | Plus |
| Q22 (survivorship) | 120-HOUR SURVIVORSHIP | Plus |
| Q23-Q28 (minors) | MINOR'S TRUST, AGE-STAGGERED | Plus |
| Q29 (benefits) | SPECIAL NEEDS TRUST | Elite + Attorney |
| Q30 (conditions) | INCENTIVE TRUST | Elite + Attorney |
| Q31-Q33 (CA real estate) | REAL PROPERTY MANAGEMENT | Plus |
| Q35 (business) | BUSINESS CONTINUATION | Plus |
| Q36 (digital) | DIGITAL ASSETS | Plus |
| Q37 (specific gifts) | TANGIBLE PROPERTY MEMO | Plus |
| Q41 (mediation) | MEDIATION REQUIREMENT | Plus |
| Q41 (arbitration) | ARBITRATION | Elite + Attorney |
| Q42 (no contest) | NO-CONTEST | Elite |
| Q43 (no accounting) | ACCOUNTING WAIVER | Plus |

---

## RULES ENGINE LOGIC
```javascript
// Example facts object from answers
const facts = {
  marital_status: "married",
  is_joint_trust: true,
  is_revocable: true,
  has_minor_children: true,
  minor_distribution_age: "staggered",
  beneficiary_on_benefits: false,
  owns_ca_real_estate: true,
  has_digital_assets: true,
  dispute_resolution: "mediation",
  selected_tier: "plus"
};

// Rules determine clauses
function determineClauses(facts, tier) {
  const clauses = [...REQUIRED_CLAUSES]; // Always included
  
  if (tier === "plus" || tier === "elite") {
    if (facts.has_minor_children) clauses.push("MINORS_TRUST");
    if (facts.minor_distribution_age === "staggered") clauses.push("AGE_STAGGERED");
    if (facts.owns_ca_real_estate) clauses.push("REAL_PROPERTY_MANAGEMENT");
    if (facts.has_digital_assets) clauses.push("DIGITAL_ASSETS");
    if (facts.dispute_resolution === "mediation") clauses.push("MEDIATION");
  }
  
  if (tier === "elite") {
    if (facts.beneficiary_on_benefits) {
      clauses.push("SPECIAL_NEEDS_TRUST");
      flags.push("ATTORNEY_REVIEW_REQUIRED");
    }
  }
  
  return { clauses, flags };
}
```

---

## TIER GATING

| Tier | Questions Available | Clauses Available |
|------|---------------------|-------------------|
| Core ($599) | Q1-Q22, Q38-Q40, Q44-Q46 | REQUIRED only |
| Plus ($899) | All Core + Q23-Q28, Q31-Q37, Q41, Q43 | REQUIRED + OPTIONAL |
| Elite ($1,299) | All questions | REQUIRED + OPTIONAL + ADVANCED |

---

## ATTORNEY REVIEW TRIGGERS

These answers automatically flag for attorney review:
- Q29: Beneficiary on government benefits → YES
- Q30: Conditional inheritance → YES
- Q27: Excluding children → YES
- Q34: Out-of-state property → YES
- Q41: Binding arbitration → YES
- Q45: Complex additional instructions

---

## BILINGUAL NOTES

All questions need Spanish translations. Example:

**Q1 English:** What is your full legal name?
**Q1 Spanish:** ¿Cuál es su nombre legal completo?

**Q23 English:** Do you have any children under 18?
**Q23 Spanish:** ¿Tiene hijos menores de 18 años?