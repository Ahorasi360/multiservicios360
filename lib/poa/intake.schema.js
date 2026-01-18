import { z } from "zod";

const US_PHONE = z.string().min(7).max(25);

export const POA_INTAKE_SCHEMA = z.object({
  office_id: z.string().uuid().nullable().optional(),
  tier: z
    .enum(["draft", "attorney_silent", "attorney_call"])
    .default("draft"),
  client: z.object({
    legal_name: z.string().min(3),
    email: z.string().email(),
    phone: US_PHONE,
  }),
  acknowledgements: z.object({
    no_medical_poa: z.boolean().default(false),
    accuracy_confirmed: z.boolean().default(false),
    turnaround_ack: z.boolean().default(false),
  }),
});
