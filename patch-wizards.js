const fs = require('fs');

const patch = '\n  // Partner mode: pre-fill client info\n  useEffect(() => {\n    if (typeof window !== "undefined") {\n      const params = new URLSearchParams(window.location.search);\n      if (params.get("partner_mode") === "true") {\n        const name = localStorage.getItem("portal_client_name") || "";\n        const email = localStorage.getItem("portal_client_email") || "";\n        const phone = localStorage.getItem("portal_client_phone") || "";\n        const lang = localStorage.getItem("portal_client_language") || "es";\n        if (name) setClientName(name);\n        if (email) setClientEmail(email);\n        if (phone) setClientPhone(phone);\n        if (lang) setLanguage(lang);\n      }\n    }\n  }, []);\n';

const files = [
  'app/poa/poa-wizard.js',
  'app/limited-poa/limited-poa-wizard.js',
  'app/trust/trust-wizard.js',
  'app/llc/llc-wizard.js'
];

files.forEach(function(f) {
  try {
    var code = fs.readFileSync(f, 'utf8');
    if (code.includes('portal_client_name')) {
      console.log(f + ' - ALREADY PATCHED, skipping');
      return;
    }
    var marker = code.indexOf('const handleSend');
    if (marker === -1) {
      marker = code.indexOf('const toggleUpsell');
    }
    if (marker === -1) {
      console.log(f + ' - NO MARKER FOUND, skipping');
      return;
    }
    code = code.slice(0, marker) + patch + '\n  ' + code.slice(marker);
    fs.writeFileSync(f, code, 'utf8');
    console.log(f + ' - PATCHED OK');
  } catch(e) {
    console.log(f + ' - ERROR: ' + e.message);
  }
});