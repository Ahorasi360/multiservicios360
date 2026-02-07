---
clause_id: OA_040
jurisdiction: CA
doc_type: OPERATING_AGREEMENT
tier: All
section_order: 99
status: draft
version: 1.0.0
title: Signature Block
llc_type: All
triggers: []
dependencies: [OA_000]
mutually_exclusive_with: []
defined_terms_used: [Company, Member, Operating Agreement]
attorney_review_required: false
---

## EXECUTION

**IN WITNESS WHEREOF**, the undersigned {{member_reference}} have executed this Operating Agreement as of the Effective Date first set forth above.

---

**COMPANY:**

**{{company_name}}**

By: ______________________________

Name: {{authorized_signer_name}}

Title: {{authorized_signer_title}}

Date: ______________________________

---

**{{member_label_1}}:**

______________________________

{{member_1_name}}

Date: ______________________________

{{#if member_2_name}}
---

**{{member_label_2}}:**

______________________________

{{member_2_name}}

Date: ______________________________
{{/if}}

{{#if member_3_name}}
---

**{{member_label_3}}:**

______________________________

{{member_3_name}}

Date: ______________________________
{{/if}}

---

{{#if has_spousal_consent}}
## EXHIBIT A — SPOUSAL CONSENT

The undersigned spouse (or registered domestic partner) of {{member_name_requiring_consent}} acknowledges that he/she has read and understands the foregoing Operating Agreement of {{company_name}} (the "Agreement"). The undersigned hereby consents to and agrees to be bound by all provisions of the Agreement that restrict or govern the Transfer or encumbrance of the Membership Interest of {{member_name_requiring_consent}}, including all buy-sell provisions, rights of first refusal, and other Transfer restrictions set forth therein.

The undersigned agrees that his/her community property interest, if any, in the Membership Interest of {{member_name_requiring_consent}} shall be subject to all of the terms and conditions of the Agreement. The undersigned further agrees that in the event of a dissolution of marriage or domestic partnership, the undersigned shall not seek to become a Member or to acquire any direct interest in the Company.

______________________________

{{spouse_name}}

Date: ______________________________
{{/if}}
