function yn(value) {
  if (value == null) return false;
  const v = String(value).trim().toLowerCase();
  return v === "yes" || v === "y" || v === "true" || v === "1";
}

export function normalizePoaIntake(raw) {
  return {
    principal_name: raw.principal_name || "",
    principal_address: raw.principal_address || "",
    agent_name: raw.agent_name || "",
    agent_address: raw.agent_address || "",
    agent_relationship: raw.agent_relationship || "",
    successor_agent: raw.successor_agent || "",

    durable: yn(raw.durable),
    effective_when: (raw.effective_when || "").trim().toLowerCase(), // "immediately" or "upon_incapacity"

    powers: {
      real_estate: yn(raw.powers_real_estate),
      banking: yn(raw.powers_banking),
      tax: yn(raw.powers_tax)
    },

    hot: {
      gifts: yn(raw.hot_gifts)
    },

    record_for_real_estate: yn(raw.record_for_real_estate),
    special_instructions: raw.special_instructions || ""
  };
}
