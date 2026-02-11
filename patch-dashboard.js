const fs = require('fs');

// Fix 1: Dashboard page text
var f1 = 'app/portal/dashboard/page.js';
var code1 = fs.readFileSync(f1, 'utf8');
code1 = code1.replace("POAs & Legal docs", "POAs, Trusts, LLCs & Legal docs");
code1 = code1.replace("Start a new POA", "Start a new document");
fs.writeFileSync(f1, code1, 'utf8');
console.log(f1 + ' - FIXED');

// Fix 2: New document page - add Trust and LLC cards
var f2 = 'app/portal/new-document/page.js';
var code2 = fs.readFileSync(f2, 'utf8');

// Add trust and llc routes
code2 = code2.replace(
  "} else if (docType === 'limited_poa') {\n      router.push('/limited-poa?partner_mode=true');\n    }",
  "} else if (docType === 'limited_poa') {\n      router.push('/limited-poa?partner_mode=true');\n    } else if (docType === 'living_trust') {\n      router.push('/trust?partner_mode=true');\n    } else if (docType === 'llc') {\n      router.push('/llc?partner_mode=true');\n    }"
);

// Add Trust and LLC cards before Coming Soon
var trustLLCCards = `
              {/* Living Trust */}
              <button
                onClick={() => handleStartDocument('living_trust')}
                className="bg-slate-800 hover:bg-slate-700 rounded-xl p-8 border border-slate-700 text-left transition-all hover:border-purple-500 group"
              >
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30">
                  <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Living Trust</h3>
                <p className="text-slate-400 mb-4">
                  Revocable living trust to protect assets, avoid probate, and ensure privacy for your client.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">$599 - $1,299</span>
                  <span className="text-emerald-400 text-sm font-medium">Your commission: 20%</span>
                </div>
              </button>

              {/* LLC Formation */}
              <button
                onClick={() => handleStartDocument('llc')}
                className="bg-slate-800 hover:bg-slate-700 rounded-xl p-8 border border-slate-700 text-left transition-all hover:border-amber-500 group"
              >
                <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/30">
                  <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">LLC Formation</h3>
                <p className="text-slate-400 mb-4">
                  Complete California LLC formation with operating agreement, structure, and compliance docs.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">$799 - $1,499</span>
                  <span className="text-emerald-400 text-sm font-medium">Your commission: 20%</span>
                </div>
              </button>
`;

code2 = code2.replace('{/* Coming Soon */}', trustLLCCards + '\n            {/* Coming Soon */}');

// Replace Coming Soon section to only show Immigration
code2 = code2.replace(
  `<div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 opacity-60">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-white font-medium">Living Trust</h4>
                  <p className="text-slate-500 text-sm mt-1">Estate planning</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 opacity-60">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-medium">LLC Formation</h4>
                  <p className="text-slate-500 text-sm mt-1">Business services</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 opacity-60">`,
  `<div className="grid md:grid-cols-1 gap-4 max-w-sm">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 opacity-60">`
);

fs.writeFileSync(f2, code2, 'utf8');
console.log(f2 + ' - FIXED');