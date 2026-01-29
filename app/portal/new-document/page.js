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

  useEffect(() => {
    const partnerId = localStorage.getItem('partner_id');
    if (!partnerId) {
      router.push('/portal/login');
      return;
    }
    fetchClients(partnerId);
  }, []);

  useEffect(() => {
    const clientId = searchParams.get('client_id');
    if (clientId && clients.length > 0) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setSelectedClient(client);
        setStep(2);
      }
    }
  }, [searchParams, clients]);

  const fetchClients = async (partnerId) => {
    try {
      const res = await fetch(`/api/portal/clients?partner_id=${partnerId}`);
      const data = await res.json();
      if (data.success) {
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
    setLoading(false);
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setStep(2);
  };

  const handleStartDocument = (docType) => {
    localStorage.setItem('portal_client_id', selectedClient.id);
    localStorage.setItem('portal_client_name', selectedClient.client_name);
    localStorage.setItem('portal_client_email', selectedClient.client_email || '');
    localStorage.setItem('portal_client_phone', selectedClient.client_phone || '');
    localStorage.setItem('portal_client_language', selectedClient.language_preference || 'es');

    if (docType === 'general_poa') {
      router.push('/poa?partner_mode=true');
    } else if (docType === 'limited_poa') {
      router.push('/limited-poa?partner_mode=true');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('partner_token');
    localStorage.removeItem('partner_id');
    localStorage.removeItem('partner_name');
    router.push('/portal/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => router.push('/portal/dashboard')} className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white">MS</span>
                </div>
                <span className="ml-3 text-xl font-semibold text-white">Partner Portal</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => router.push('/portal/dashboard')} className="text-slate-400 hover:text-white">
                Dashboard
              </button>
              <button onClick={handleLogout} className="text-slate-400 hover:text-white">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= 1 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
            }`}>
              1
            </div>
            <span className={`ml-2 ${step >= 1 ? 'text-white' : 'text-slate-400'}`}>Select Client</span>
          </div>
          <div className={`w-16 h-1 mx-4 ${step >= 2 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= 2 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
            }`}>
              2
            </div>
            <span className={`ml-2 ${step >= 2 ? 'text-white' : 'text-slate-400'}`}>Choose Document</span>
          </div>
        </div>

        {/* Step 1: Select Client */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">Select a Client</h1>
              <p className="text-slate-400 mt-2">Choose which client this document is for</p>
            </div>

            {clients.length === 0 ? (
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-slate-400 mb-4">You need to add a client first</p>
                <button
                  onClick={() => router.push('/portal/clients')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add a Client
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectClient(client)}
                    className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 border border-slate-700 text-left transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {client.client_name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="text-white font-semibold text-lg">{client.client_name}</p>
                        <p className="text-slate-400">{client.client_email || client.client_phone || 'No contact info'}</p>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/portal/clients')}
                className="text-blue-400 hover:text-blue-300"
              >
                + Add a new client
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Document Type */}
        {step === 2 && selectedClient && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">Choose Document Type</h1>
              <p className="text-slate-400 mt-2">
                Creating document for: <span className="text-white font-medium">{selectedClient.client_name}</span>
              </p>
              <button
                onClick={() => { setStep(1); setSelectedClient(null); }}
                className="text-blue-400 hover:text-blue-300 text-sm mt-2"
              >
                ← Change client
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* General POA */}
              <button
                onClick={() => handleStartDocument('general_poa')}
                className="bg-slate-800 hover:bg-slate-700 rounded-xl p-8 border border-slate-700 text-left transition-all hover:border-blue-500 group"
              >
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">General Durable POA</h3>
                <p className="text-slate-400 mb-4">
                  Comprehensive power of attorney covering finances, property, legal matters, and more.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">$149 - $499</span>
                  <span className="text-emerald-400 text-sm font-medium">Your commission: 20%</span>
                </div>
              </button>

              {/* Limited POA */}
              <button
                onClick={() => handleStartDocument('limited_poa')}
                className="bg-slate-800 hover:bg-slate-700 rounded-xl p-8 border border-slate-700 text-left transition-all hover:border-green-500 group"
              >
                <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/30">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Limited POA</h3>
                <p className="text-slate-400 mb-4">
                  Specific power of attorney for real estate, banking, taxes, vehicles, or other categories.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">$99 - $299</span>
                  <span className="text-emerald-400 text-sm font-medium">Your commission: 20%</span>
                </div>
              </button>
            </div>

            {/* Coming Soon */}
            <div className="mt-8">
              <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide mb-4">Coming Soon</h3>
              <div className="grid md:grid-cols-3 gap-4">
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

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 opacity-60">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-medium">Immigration</h4>
                  <p className="text-slate-500 text-sm mt-1">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PartnerNewDocument() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <NewDocumentContent />
    </Suspense>
  );
}