// lib/poa/clauses.ca.js
// California Power of Attorney – English controlling clauses

export const POA_CLAUSES_CA = [
  {
    id: "DURABILITY",
    title: "Durability",
    requires: ["DURABLE"],
    text:
      "This Power of Attorney shall not be affected by the subsequent incapacity of the Principal and shall remain in full force and effect."
  },

  {
    id: "EFFECTIVE_IMMEDIATE",
    title: "Effective Date",
    requires: ["EFFECTIVE_IMMEDIATELY"],
    text:
      "This Power of Attorney is effective immediately upon execution."
  },

  {
    id: "SPRINGING",
    title: "Springing Effectiveness",
    requires: ["SPRINGING"],
    text:
      "This Power of Attorney becomes effective upon the Principal’s incapacity as determined in accordance with the standard stated in this instrument."
  },

  {
    id: "REAL_ESTATE",
    title: "Real Property Transactions",
    requires: ["AUTH_REAL_ESTATE"],
    text:
      "My Agent is authorized to buy, sell, convey, lease, encumber, refinance, and otherwise manage real property, including signing deeds and related instruments as permitted by law."
  },

  {
    id: "BANKING",
    title: "Banking Transactions",
    requires: ["AUTH_BANKING"],
    text:
      "My Agent is authorized to open, close, and manage bank accounts; deposit and withdraw funds; endorse checks; access safe deposit boxes; and conduct other banking transactions as permitted by law."
  },

  {
    id: "TAX",
    title: "Tax Matters",
    requires: ["AUTH_TAX"],
    text:
      "My Agent is authorized to prepare, sign, and file federal, state, and local tax returns and related documents; obtain confidential tax information from taxing authorities; and otherwise act regarding tax matters as permitted by law."
  },

  {
    id: "HOT_GIFTS",
    title: "Authority to Make Gifts",
    requires: ["HOT_MAKE_GIFTS"],
    text:
      "My Agent is authorized to make gifts on my behalf, subject to any limitations stated in this instrument and applicable law."
  },

  {
    id: "RECORDING_NOTICE",
    title: "Recording for Real Estate Use",
    requires: ["REAL_ESTATE_RECORDING_INTENDED"],
    text:
      "The Principal intends that this Power of Attorney may be recorded for real estate purposes. The Agent is authorized to execute and deliver any additional certificates or acknowledgments reasonably required for recording."
  }
];


