// app/portal/documents/page.js

"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const T = {
  es: {
    heading: 'Documentos', back: '← Panel', filterAll: 'Todos', 
    nav: {dashboard:'Panel', clients:'Mis Clientes', documents:'Documentos', earnings:'Ganancias', resources:'Recursos'},
    status: {paid:'Pagado', pending_payment:'Pago Pendiente', draft:'Borrador', processing:'Procesando', completed:'Completado'},
    type: {
      general_poa:'Poder Notarial General', limited_poa:'Poder Notarial Limitado', 
      living_trust:'Fideicomiso', llc_formation:'LLC', bill_of_sale:'Carta de Venta', 
      affidavit:'Declaración Jurada', travel_authorization:'Carta de Viaje',
      authorization_letter:'Carta de Viaje', guardianship:'Designación de Guardián',
      guardianship_designation:'Designación de Guardián', revocation_poa:'Revocación POA',
      promissory_note:'Pagaré', pour_over_will:'Testamento', simple_will:'Testamento Simple',
      hipaa_authorization:'HIPAA', certification_of_trust:'Cert. Fideicomiso',
      s_corp_formation:'S-Corp', c_corp_formation:'C-Corp', corporate_minutes:'Actas',
      banking_resolution:'Resolución Bancaria', small_estate_affidavit:'Pequeño Patrimonio',
      quitclaim_deed:'Quitclaim', contractor_agreement:'Contrato Contratista',
      demand_letter:'Carta de Cobro', apostille_letter:'Apostilla', simple_doc:'Documento Legal',
    },
    loading: 'Cargando documentos...', noDocuments: 'No hay documentos aún.',
    client: 'Cliente', date: 'Fecha', download: 'Descargar',
  },
  en: {
    heading: 'Documents', back: '← Dashboard', filterAll: 'All',
    nav: {dashboard:'Dashboard', clients:'My Clients', documents:'Documents', earnings:'Earnings', resources:'Resources'},
    status: {paid:'Paid', pending_payment:'Pending Payment', draft:'Draft', processing:'Processing', completed:'Completed'},
    type: {
      general_poa:'General POA', limited_poa:'Limited POA', living_trust:'Living Trust', 
      llc_formation:'LLC', bill_of_sale:'Bill of Sale', affidavit:'Affidavit', 
      travel_authorization:'Travel Authorization', authorization_letter:'Travel Authorization',
      guardianship:'Guardianship', guardianship_designation:'Guardianship Designation',
      revocation_poa:'POA Revocation', promissory_note:'Promissory Note',
      pour_over_will:'Pour-Over Will', simple_will:'Simple Will',
      hipaa_authorization:'HIPAA Authorization', certification_of_trust:'Cert. of Trust',
      s_corp_formation:'S-Corp', c_corp_formation:'C-Corp', corporate_minutes:'Corp. Minutes',
      banking_resolution:'Banking Resolution', small_estate_affidavit:'Small Estate',
      quitclaim_deed:'Quitclaim Deed', contractor_agreement:'Contractor Agreement',
      demand_letter:'Demand Letter', apostille_letter:'Apostille Letter', simple_doc:'Legal Document',
    },
    loading: 'Loading documents...', noDocuments: 'No documents yet.',
    client: 'Client', date: 'Date', download: 'Download',
  }
};

export default function PartnerDocuments() {
  const router = useRouter();
  const [lang, setLang] = useState('es');
  const t = T[lang];
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, general_poa, limited_poa
  const [statusFilter, setStatusFilter] = useState('all'); // all, paid, pending_payment

  useEffect(() => {
    const savedLang = localStorage.getItem('portal_lang') || 'es'; setLang(savedLang);
    const partnerId = localStorage.getItem('partner_id');
    if (!partnerId) {
      router.push('/portal/login');
      return;
    }
    fetchDocuments(partnerId);
  }, []);

  const fetchDocuments = async (partnerId) => {
    try {
      const res = await fetch(`/api/portal/documents?partner_id=${partnerId}`);
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
    setLoading(false);
  };

  const handleDownload = async (doc) => {
    // This would trigger PDF generation/download
    // For now, we'll show an alert
    alert(`Download feature coming soon for: ${doc.client_name}'s ${doc.document_type}`);
  };

  const filteredDocuments = documents.filter(doc => {
    const typeMatch = filter === 'all' || doc.document_type === filter;
    const statusMatch = statusFilter === 'all' || doc.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-emerald-500/20 text-emerald-400',
      completed: 'bg-emerald-500/20 text-emerald-400',
      pending_payment: 'bg-amber-500/20 text-amber-400',
      draft: 'bg-slate-500/20 text-slate-400',
    };
    const labels = {
      paid: 'Paid',
      completed: 'Completed',
      pending_payment: 'Pending Payment',
      draft: 'Draft',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getDocTypeBadge = (type) => {
    const styles = {
      general_poa: 'bg-blue-500/20 text-blue-400',
      limited_poa: 'bg-green-500/20 text-green-400',
      living_trust: 'bg-purple-500/20 text-purple-400',
      llc_formation: 'bg-yellow-500/20 text-yellow-400',
      authorization_letter: 'bg-pink-500/20 text-pink-400',
      bill_of_sale: 'bg-orange-500/20 text-orange-400',
      affidavit: 'bg-cyan-500/20 text-cyan-400',
      promissory_note: 'bg-red-500/20 text-red-400',
      guardianship_designation: 'bg-teal-500/20 text-teal-400',
      revocation_poa: 'bg-slate-500/20 text-slate-400',
    };
    const labels = {
      general_poa: 'General POA',
      limited_poa: 'Limited POA',
      living_trust: 'Living Trust',
      llc_formation: 'LLC Formation',
      authorization_letter: 'Travel Authorization',
      bill_of_sale: 'Bill of Sale',
      affidavit: 'Affidavit',
      promissory_note: 'Promissory Note',
      guardianship_designation: 'Guardianship',
      revocation_poa: 'POA Revocation',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[type] || 'bg-slate-500/20 text-slate-400'}`}>
        {labels[type] || type}
      </span>
    );
  };

  const formatMoney = (amount) => {
    return '$' + (amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
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


  function toggleLang() { const nl=lang==='es'?'en':'es'; setLang(nl); localStorage.setItem('portal_lang',nl); }
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Documents</h1>
            <p className="text-slate-400 mt-1">{documents.length} total documents</p>
          </div>
          <button
            onClick={() => router.push('/portal/new-document')}
            className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            + New Document
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex flex-wrap bg-slate-800 rounded-lg p-1 gap-1">
            {[
              { key: 'all', label: 'All Types' },
              { key: 'general_poa', label: 'General POA' },
              { key: 'limited_poa', label: 'Limited POA' },
              { key: 'living_trust', label: 'Living Trust' },
              { key: 'llc_formation', label: 'LLC' },
              { key: 'authorization_letter', label: 'Travel Auth' },
              { key: 'bill_of_sale', label: 'Bill of Sale' },
              { key: 'affidavit', label: 'Affidavit' },
              { key: 'promissory_note', label: 'Promissory' },
              { key: 'guardianship_designation', label: 'Guardianship' },
            ].map(t => (
              <button key={t.key} onClick={() => setFilter(t.key)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === t.key ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'paid' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter('pending_payment')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'pending_payment' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-400 mb-4">
              {documents.length === 0 ? 'No documents yet' : 'No documents match your filters'}
            </p>
            {documents.length === 0 && (
              <button
                onClick={() => router.push('/portal/new-document')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create your first document
              </button>
            )}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Document</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden md:table-cell">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden sm:table-cell">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden lg:table-cell">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-medium">
                              {doc.client_name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-white font-medium">{doc.client_name}</p>
                            <p className="text-slate-400 text-sm sm:hidden">{getDocTypeBadge(doc.document_type)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getDocTypeBadge(doc.document_type)}
                        {doc.category && (
                          <p className="text-slate-500 text-xs mt-1 capitalize">{doc.category.replace('_', ' ')}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-white font-medium">{formatMoney(doc.total_price)}</p>
                        <p className="text-emerald-400 text-sm">Commission: {formatMoney(doc.total_price * 0.20)}</p>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm hidden lg:table-cell">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {(doc.status === 'paid' || doc.status === 'completed') && (
                            <button
                              onClick={() => handleDownload(doc)}
                              className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          )}
                          <button
                            className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {documents.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <p className="text-slate-400 text-sm">Total Documents</p>
              <p className="text-3xl font-bold text-white mt-1">{documents.length}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <p className="text-slate-400 text-sm">Total Sales</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatMoney(documents.filter(d => d.status === 'paid').reduce((sum, d) => sum + (d.total_price || 0), 0))}
              </p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <p className="text-slate-400 text-sm">Your Earnings (20%)</p>
              <p className="text-3xl font-bold text-emerald-400 mt-1">
                {formatMoney(documents.filter(d => d.status === 'paid').reduce((sum, d) => sum + ((d.total_price || 0) * 0.20), 0))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}