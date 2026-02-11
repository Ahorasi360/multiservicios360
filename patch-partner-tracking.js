const fs = require('fs');

// =============================================
// STEP 1: Patch all 4 wizards to send partner_id
// =============================================

// --- POA WIZARD ---
var f = 'app/poa/poa-wizard.js';
var code = fs.readFileSync(f, 'utf8');
if (!code.includes('partner_id:')) {
  // Add partner_id to the fetch body where it posts to /api/poa/matters
  code = code.replace(
    "client_phone: clientPhone,",
    "client_phone: clientPhone,\n          partner_id: typeof window !== 'undefined' ? localStorage.getItem('partner_id') || null : null,"
  );
  fs.writeFileSync(f, code, 'utf8');
  console.log(f + ' - PATCHED');
} else {
  console.log(f + ' - ALREADY PATCHED');
}

// --- LIMITED POA WIZARD ---
f = 'app/limited-poa/limited-poa-wizard.js';
code = fs.readFileSync(f, 'utf8');
if (!code.includes('partner_id:')) {
  code = code.replace(
    "client_phone: clientPhone,",
    "client_phone: clientPhone,\n          partner_id: typeof window !== 'undefined' ? localStorage.getItem('partner_id') || null : null,"
  );
  fs.writeFileSync(f, code, 'utf8');
  console.log(f + ' - PATCHED');
} else {
  console.log(f + ' - ALREADY PATCHED');
}

// --- TRUST WIZARD ---
f = 'app/trust/trust-wizard.js';
code = fs.readFileSync(f, 'utf8');
if (!code.includes('partner_id:')) {
  code = code.replace(
    "client_phone: clientPhone,",
    "client_phone: clientPhone,\n          partner_id: typeof window !== 'undefined' ? localStorage.getItem('partner_id') || null : null,"
  );
  fs.writeFileSync(f, code, 'utf8');
  console.log(f + ' - PATCHED');
} else {
  console.log(f + ' - ALREADY PATCHED');
}

// --- LLC WIZARD ---
f = 'app/llc/llc-wizard.js';
code = fs.readFileSync(f, 'utf8');
if (!code.includes('partner_id:')) {
  code = code.replace(
    "client_phone: clientPhone,",
    "client_phone: clientPhone,\n          partner_id: typeof window !== 'undefined' ? localStorage.getItem('partner_id') || null : null,"
  );
  fs.writeFileSync(f, code, 'utf8');
  console.log(f + ' - PATCHED');
} else {
  console.log(f + ' - ALREADY PATCHED');
}

// =============================================
// STEP 2: Patch all 4 API routes to save partner_id
// =============================================

// --- POA MATTERS API ---
f = 'app/api/poa/matters/route.js';
code = fs.readFileSync(f, 'utf8');
if (!code.includes('partner_id')) {
  // Add partner_id to destructuring
  code = code.replace('client_phone,', 'client_phone, partner_id,');
  // Add partner_id to insert
  code = code.replace(
    /\.insert\(\{/,
    '.insert({\n        partner_id: partner_id || null,'
  );
  fs.writeFileSync(f, code, 'utf8');
  console.log(f + ' - PATCHED');
} else {
  console.log(f + ' - ALREADY PATCHED');
}

// --- LIMITED POA MATTERS API ---
f = 'app/api/limited-poa/matters/route.js';
code = fs.readFileSync(f, 'utf8');
if (!code.includes('partner_id')) {
  code = code.replace('client_phone,', 'client_phone, partner_id,');
  code = code.replace(
    /\.insert\(\[?\{/,
    function(match) { return match + '\n        partner_id: partner_id || null,'; }
  );
  fs.writeFileSync(f, code, 'utf8');
  console.log(f + ' - PATCHED');
} else {
  console.log(f + ' - ALREADY PATCHED');
}

// --- TRUST MATTERS API ---
f = 'app/api/trust/matters/route.js';
code = fs.readFileSync(f, 'utf8');
if (!code.includes('partner_id')) {
  code = code.replace('client_phone,', 'client_phone, partner_id,');
  code = code.replace(
    /\.insert\(\{/,
    '.insert({\n        partner_id: partner_id || null,'
  );
  fs.writeFileSync(f, code, 'utf8');
  console.log(f + ' - PATCHED');
} else {
  console.log(f + ' - ALREADY PATCHED');
}

// --- LLC MATTERS API ---
f = 'app/api/llc/matters/route.js';
code = fs.readFileSync(f, 'utf8');
if (!code.includes('partner_id')) {
  code = code.replace('client_phone,', 'client_phone, partner_id,');
  code = code.replace(
    /\.insert\(\{/,
    '.insert({\n        partner_id: partner_id || null,'
  );
  fs.writeFileSync(f, code, 'utf8');
  console.log(f + ' - PATCHED');
} else {
  console.log(f + ' - ALREADY PATCHED');
}

console.log('\nDone! All wizards and APIs now track partner_id.');