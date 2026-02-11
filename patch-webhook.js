const fs = require('fs');
var f = 'app/api/stripe/webhook/route.js';
var code = fs.readFileSync(f, 'utf8');

if (code.includes('partner_referrals')) {
  console.log('ALREADY PATCHED');
  process.exit();
}

// Add commission logic after the vault creation block, before the closing "} else {"
var commissionCode = `

      // ----------------------------------------------
      // CREATE PARTNER COMMISSION IF PARTNER REFERRED
      // ----------------------------------------------
      try {
        // Look up the matter to check for partner_id
        const { data: matterData } = await supabase
          .from(tableName)
          .select('partner_id')
          .eq('id', matterId)
          .single();

        if (matterData?.partner_id) {
          // Get the partner's commission rate
          const { data: partnerData } = await supabase
            .from('partners')
            .select('commission_rate, business_name')
            .eq('id', matterData.partner_id)
            .single();

          const commissionRate = partnerData?.commission_rate || 20;
          const commissionAmount = totalPrice ? (totalPrice * commissionRate / 100) : 0;

          // Create referral/commission record
          const { error: refError } = await supabase
            .from('partner_referrals')
            .insert({
              partner_id: matterData.partner_id,
              matter_id: matterId,
              document_type: documentType,
              client_name: session.customer_details?.name || session.metadata?.clientName || '',
              total_amount: totalPrice,
              commission_rate: commissionRate,
              commission_amount: commissionAmount,
              status: 'pending',
            });

          if (refError) {
            console.error('Commission creation failed:', refError);
          } else {
            console.log('Commission created: $' + commissionAmount + ' for partner ' + (partnerData?.business_name || matterData.partner_id));
          }
        }
      } catch (commErr) {
        console.error('Commission error (non-critical):', commErr);
      }
`;

// Insert before "} else {" (the "No matterId" block)
code = code.replace(
  "    } else {\n      console.log('No matterId in metadata');",
  commissionCode + "\n    } else {\n      console.log('No matterId in metadata');"
);

fs.writeFileSync(f, code, 'utf8');
console.log('WEBHOOK PATCHED - commission tracking added');