// app/portal/new-document/page.js
"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function NewDocumentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [commissionRate, setCommissionRate] = useState(20);

  useEffect(() => {
    const partnerId = localStorage.getItem('partner_id');
    if (!partnerId) { router.push('/portal/login'); return; }
    setCommissionRate(parseInt(localStorage.getItem('partner_commission_rate') || '20'));
    fetchClients(partnerId);
  }, []);

  useEffect(() => {
    const clientId = searchParams.get('client_id');
    if (clientId && clients.length > 0) {
      const client = clients.find(c => c.id === clientId);
      if (client) { setSelectedClient(client); setStep(2); }
    }
  }, [searchParams, clients]);

  const fetchClients = async (partnerId) => {
    try {
      const res = await fetch(`/api/portal/clients?partner_id=${partnerId}`);
      const data = await res.json();
      if (data.success) setClients(data.clients || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleStartDocument = (docType) => {
    localStorage.setItem('portal_client_id', selectedClient.id);
    localStorage.setItem('portal_client_name', selectedClient.client_name);
    localStorage.setItem('portal_client_email', selectedClient.client_email || '');
    localStorage.setItem('portal_client_phone', selectedClient.client_phone || '');
    localStorage.setItem('portal_client_language', selectedClient.language_preference || 'es');

    const routes = {
      general_poa: '/poa?partner_mode=true',
      limited_poa: '/limited-poa?partner_mode=true',
      living_trust: '/trust?partner_mode=true',
      llc: '/llc?partner_mode=true',
      authorization_letter: '/simple-doc?type=authorization_letter&partner_mode=true',
      bill_of_sale: '/simple-doc?type=bill_of_sale&partner_mode=true',
      affidavit: '/simple-doc?type=affidavit&partner_mode=true',
      promissory_note: '/simple-doc?type=promissory_note&partner_mode=true',
      guardianship: '/simple-doc?type=guardianship_designation&partner_mode=true',
      revocation_poa: '/simple-doc?type=revocation_poa&partner_mode=true',
    };
    router.push(routes[docType] || '/portal/dashboard');
  };

  const cr = `${commissionRate}%`;

  const docTypes = [
    { key: 'general_poa', label: 'General Durable POA', desc: 'Finances, property, legal matters and more.', price: '$149–$499', color: 'blue' },
    { key: 'limited_poa', label: 'Limited POA', desc: 'Real estate, banking, taxes, vehicles, or custom.', price: '$99–$299', color: 'green' },
    { key: 'living_trust', label: 'Living Trust', desc: 'Revocable trust to avoid probate and protect assets.', price: '$599–$1,299', color: 'purple' },
    { key: 'llc', label: 'LLC Formation', desc: 'California LLC with operating agreement and docs.', price: '$799–$1,499', color: 'amber' },
    { key: 'authorization_letter', label: 'Travel Authorization', desc: 'Travel letter for minor children traveling alone.', price: '$49', color: 'pink' },
    { key: 'bill_of_sale', label: 'Bill of Sale', desc: 'Vehicle, property, or personal item sale documents.', price: '$49', color: 'orange' },
    { key: 'affidavit', label: 'Affidavit', desc: 'Sworn statement for legal or personal use.', price: '$49', color: 'cyan' },
    { key: 'promissory_note', label: 'Promissory Note', desc: 'Loan agreement and repayment terms.', price: '$49', color: 'red' },
    { key: 'guardianship', label: 'Guardianship Designation', desc: 'Designate a guardian for your children.', price: '$99–$299', color: 'teal' },
    { key: 'revocation_poa', label: 'POA Revocation', desc: 'Revoke an existing power of attorney.', price: '$49', color: 'slate' },
  ];

  const colorMap = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500',
    green: 'bg-green-500/20 text-green-400 border-green-500',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500',
    pink: 'bg-pink-500/20 text-pink-400 border-pink-500',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500',
    red: 'bg-red-500/20 text-red-400 border-red-500',
    teal: 'bg-teal-500/20 text-teal-400 border-teal-500',
    slate: 'bg-slate-500/20 text-slate-400 border-slate-500',
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <button onClick={() => router.push('/portal/dashboard')} className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">MS</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-white">Partner Portal</span>
            </button>
            <div className="flex items-center space-x-4">
              <button onClick={() => router.push('/portal/dashboard')} className="text-slate-400 hover:text-white">Dashboard</button>
              <button onClick={() => { localStorage.removeItem('partner_token'); localStorage.removeItem('partner_id'); router.push('/portal/login'); }} className="text-slate-400 hover:text-white">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>1</div>
          <span className={`ml-2 ${step >= 1 ? 'text-white' : 'text-slate-400'}`}>Select Client</span>
          <div className={`w-16 h-1 mx-4 ${step >= 2 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>2</div>
          <span className={`ml-2 ${step >= 2 ? 'text-white' : 'text-slate-400'}`}>Choose Document</span>
        </div>

        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">Select a Client</h1>
              <p className="text-slate-400 mt-2">Choose which client this document is for</p>
            </div>
            {clients.length === 0 ? (
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
                <p className="text-slate-400 mb-4">You need to add a client first</p>
                <button onClick={() => router.push('/portal/clients')} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add a Client</button>
              </div>
            ) : (
              <div className="grid gap-4">
                {clients.map(client => (
                  <button key={client.id} onClick={() => { setSelectedClient(client); setStep(2); }}
                    className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 border border-slate-700 text-left flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">{client.client_name?.charAt(0)?.toUpperCase() || '?'}</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-white font-semibold text-lg">{client.client_name}</p>
                        <p className="text-slate-400">{client.client_email || client.client_phone || 'No contact info'}</p>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-6 text-center">
              <button onClick={() => router.push('/portal/clients')} className="text-blue-400 hover:text-blue-300">+ Add a new client</button>
            </div>
          </div>
        )}

        {step === 2 && selectedClient && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">Choose Document Type</h1>
              <p className="text-slate-400 mt-2">For: <span className="text-white font-medium">{selectedClient.client_name}</span></p>
              <button onClick={() => { setStep(1); setSelectedClient(null); }} className="text-blue-400 hover:text-blue-300 text-sm mt-2">← Change client</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {docTypes.map(doc => {
                const colors = colorMap[doc.color] || colorMap.slate;
                const [bg, text, border] = colors.split(' ');
                return (
                  <button key={doc.key} onClick={() => handleStartDocument(doc.key)}
                    className={`bg-slate-800 hover:bg-slate-700 rounded-xl p-6 border border-slate-700 text-left transition-all hover:border-opacity-100 group`}
                    style={{ '--tw-border-opacity': 0 }}>
                    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                      <span className={`text-xl`}>📄</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{doc.label}</h3>
                    <p className="text-slate-400 text-sm mb-3">{doc.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">{doc.price}</span>
                      <span className="text-emerald-400 text-sm font-medium">Your commission: {cr}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PartnerNewDocument() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <NewDocumentContent />
    </Suspense>
  );
}
// force redeploy Mon Feb 23 00:21:07 UTC 2026
