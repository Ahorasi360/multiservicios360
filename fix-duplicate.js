const fs = require('fs');
var f = 'app/portal/new-document/page.js';
var code = fs.readFileSync(f, 'utf8');

// Find the second Living Trust button and remove it along with the second LLC button
var firstTrust = code.indexOf("handleStartDocument('living_trust')");
var secondTrust = code.indexOf("handleStartDocument('living_trust')", firstTrust + 1);

if (secondTrust === -1) {
  console.log('No duplicate found');
  process.exit();
}

// Find the button start before second Living Trust
var searchBack = code.lastIndexOf('<button', secondTrust);
// Find the end of second LLC Formation button (after second trust)
var secondLLC = code.indexOf("handleStartDocument('llc')", secondTrust);
var llcButtonEnd = code.indexOf('</button>', secondLLC) + '</button>'.length;

code = code.slice(0, searchBack) + code.slice(llcButtonEnd);
fs.writeFileSync(f, code, 'utf8');
console.log('FIXED - removed duplicate cards');