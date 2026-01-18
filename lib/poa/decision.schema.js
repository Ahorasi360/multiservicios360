// lib/poa/decision.schema.js

export const POA_FLAG_SCHEMA = {
  // Core
  DURABLE: false,
  EFFECTIVE_IMMEDIATELY: false,
  SPRINGING: false,

  // Powers
  AUTH_REAL_ESTATE: false,
  AUTH_BANKING: false,
  AUTH_TAX: false,

  // Hot powers
  HOT_MAKE_GIFTS: false,

  // Optional / future
  REQUIRE_ACCOUNTING: false,

  // Recording logic
  REAL_ESTATE_RECORDING_INTENDED: false
};
