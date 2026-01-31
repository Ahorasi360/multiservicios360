# MULTISERVICIOS 360 - MASTER HANDOFF DOCUMENT
Last Updated: January 31, 2026

## PROJECT OVERVIEW
Multiservicios 360 is a California-based legal document automation platform (NOT a law firm).
We provide self-service software for preparing legal documents. Users answer questions, system builds documents.
- Bilingual: English/Spanish
- Target: Latino community in California

## TECH STACK
- Next.js 14 (App Router)
- Supabase (database + auth)
- Stripe (payments)
- jsPDF (PDF generation)
- Tailwind CSS v4 (but use INLINE STYLES for production reliability)
- Vercel (hosting)
- Domain: multiservicios360.net

## CRITICAL DESIGN RULES
1. Use INLINE STYLES (not Tailwind classes) - Tailwind doesn't compile reliably on Vercel
2. External notary PDF - Pull from link, DO NOT generate notary acknowledgment with AI
3. Chat-based intake - Plain English questions, NO legal terminology exposed to users
4. No checkboxes for clauses - System determines clauses from user answers
5. UPL Compliance - We are "software platform", never "legal services"

## WHAT'S ALREADY BUILT & WORKING
- Main website (multiservicios360.net)
- General POA wizard (/poa) - 32 questions, chat-based, Stripe, PDF generation
- Limited POA wizard (/limited-poa)
- Admin Dashboard (/admin) - Password: MS360Admin2026!
- Admin Partners Management (/admin/partners)
- Partner Portal (/portal/login) - Email: test@partner.com / Password: partner123
- Partner Portal pages: dashboard, clients, documents, earnings, new-document
- Waitlist system
- Stripe integration
- Supabase connection

## WHAT NEEDS TO BE BUILT
1. Partner Registration Page (/portal/register) - Public application form
2. Sales Rep System - Database + login + dashboard for tracking commissions
3. Owner Dashboard - Single command center
4. CALIFORNIA LIVING TRUST WIZARD (priority)

## TRUST SYSTEM ARCHITECTURE
Follow POA pattern:
- Chat-based intake wizard (~30-40 questions)
- Rules engine: User answers -> facts object -> system picks clauses
- jsPDF generation from clause library
- External notary PDF appended from link
- Supabase storage for vault subscribers

## TRUST CLAUSE LIBRARY
Total: ~100+ clauses
- REQUIRED (27-35): Always included, locked
- OPTIONAL (~60): Included based on user answers (Plus/Elite tiers)
- ADVANCED (~45): Gated - triggers attorney review or acknowledgment (Elite tier)

## TRUST PRICING (Software fees only)
- Trust Core: $599 - Required clauses only
- Trust Plus: $899 - Required + Optional clauses
- Trust Elite: $1,299 - Required + Optional + Advanced clauses
- Trust Vault: $99/year - Storage, version history, regeneration
- Trust Vault Plus: $149/year - + 1 amendment credit

## COMPLIANCE LANGUAGE
- ALWAYS SAY: "Self-prepared using our software"
- NEVER SAY: "Attorney-drafted", "Legal services", "Estate planning advice"
- Attorney review is OPTIONAL and SEPARATE (not included in pricing)

## PARTNER SYSTEM
Three partner types:
- Referral Partners (20% commission)
- Wholesale Partners (buy at wholesale)
- White Label Partners (full branding)

Sales Rep Commission:
- 5% of partner's platform software sales
- First 30 days only
- NOT on setup fees, attorney fees, legal services

## DATABASE TABLES (Supabase)
Existing: poa_matters, limited_poa_matters, waitlist_leads, partners, partner_clients, partner_referrals
Needed: sales_reps, trust_matters

## CREDENTIALS
- Admin Dashboard: /admin - Password: MS360Admin2026!
- Partner Portal: /portal/login - test@partner.com / partner123
- Vercel: ahorasimultiservicio360@gmail.com
- Supabase URL: https://wwaovysvcsesahcltuai.supabase.co

## ENV VARIABLES (.env.local)
ADMIN_PASSWORD=MS360Admin2026!
NEXT_PUBLIC_SUPABASE_URL=https://wwaovysvcsesahcltuai.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

## GIT COMMANDS
cd "C:\Users\anthony galeano\desktop\multiservicios360"
git status
git add .
git commit -m "message"
git push origin main

## COMMON ISSUES & FIXES
1. Tailwind not working on production -> Use inline styles instead
2. Admin password not working -> Check ADMIN_PASSWORD in .env.local AND Vercel
3. Build fails -> Check for page.js in api/ folders (should only be route.js)
4. 404 on production -> Code not pushed to git or deployment failed

## START BUILDING TRUST
1. Create /app/trust/page.js (wizard)
2. Create /app/trust/trust-wizard.js (chat component)
3. Create /app/api/trust/matters/route.js (save to Supabase)
4. Create /app/api/stripe/trust-checkout/route.js
5. Create trust_matters table in Supabase
6. Use inline styles (copy admin page pattern)
7. Follow POA wizard structure for questions
