import { NextResponse } from "next/server";
import { createClient } from "../supabase/server";
import { POA_INTAKE_SCHEMA } from "./intake.schema";

export async function POST(req: Request) {
  const body = await req.json();

  // Validate intake_json with Zod
  const parsed = POA_INTAKE_SCHEMA.safeParse(body.intake_json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid intake_json" }, { status: 400 });
  }

  const supabase = await createClient();

  const payload = {
    id: body.matter_id ?? undefined, // allow upsert
    office_id: body.office_id ?? parsed.data.office_id ?? null,
    form_type: body.form_type ?? "poa_financial_ca",
    tier: body.tier ?? parsed.data.tier,
    status: "draft",
    intake_json: parsed.data,
  };

  const { data, error } = await supabase
    .from("matters")
    .upsert(payload, { onConflict: "id" })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ matter_id: data.id });
}
