// lib/poa/mapIntakeToFlags.js
import { POA_FLAG_SCHEMA } from "./decision.schema";

export function mapIntakeToFlags(intake) {
  const flags = { ...POA_FLAG_SCHEMA };

  // Durable
  flags.DURABLE = intake.durable === true;

  // Effective timing
  if (intake.effective_when === "immediately") {
    flags.EFFECTIVE_IMMEDIATELY = true;
    flags.SPRINGING = false;
  } else if (intake.effective_when === "upon_incapacity") {
    flags.EFFECTIVE_IMMEDIATELY = false;
    flags.SPRINGING = true;
  } else {
    // Safe defaults
    flags.EFFECTIVE_IMMEDIATELY = true;
    flags.SPRINGING = false;
  }

  // Powers (your schema uses flat IDs)
  flags.AUTH_REAL_ESTATE = intake.powers_real_estate === true;
  flags.AUTH_BANKING = intake.powers_banking === true;
  flags.AUTH_TAX = intake.powers_tax === true;

  // Hot powers (flat ID)
  flags.HOT_MAKE_GIFTS = intake.hot_gifts === true;

  // Recording intent (only relevant if real estate powers granted)
  flags.REAL_ESTATE_RECORDING_INTENDED =
    flags.AUTH_REAL_ESTATE && intake.record_for_real_estate === true;

  return flags;
}
