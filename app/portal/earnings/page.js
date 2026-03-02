// app/portal/earnings/page.js

"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const T = {
  es: {
    heading: 'Mis Ganancias', back: '← Panel', brand: 'Portal de Socios', partnerAccount: 'Cuenta de Socio', membership: '💳 Membresía', signOut: 'Cerrar Sesión',
    nav: {dashboard:'Panel', clients:'Mis Clientes', documents:'Documentos', earnings:'Ganancias', resources:'Recursos'},
    totalEarnings: 'Total Ganado', pendingPayout: 'Pago Pendiente', paidOut: 'Pagado', totalDocs: 'Documentos Totales',
    all: 'Todos', thisMonth: 'Este Mes', lastMonth: 'Mes Anterior',
    status: {pending:'Pendiente', paid:'Pagado', cancelled:'Cancelado'},
    filterAll: 'Todos', loading: 'Cargando ganancias...', noEarnings: 'Sin ganancias aún.',
    type: {
      general_poa:'Poder Notarial General', limited_poa:'Poder Notarial Limitado', 
      living_trust:'Fideicomiso', llc_formation:'LLC', bill_of_sale:'Carta de Venta', 
      affidavit:'Declaración Jurada', travel_authorization:'Carta de Viaje',
      authorization_letter:'Carta de Viaje', guardianship_designation:'Designación de Guardián',
      revocation_poa:'Revocación de Poder', promissory_note:'Pagaré',
      pour_over_will:'Testamento', simple_will:'Testamento Simple',
      hipaa_authorization:'Autorización HIPAA', certification_of_trust:'Cert. de Fideicomiso',
      s_corp_formation:'Formación S-Corp', c_corp_formation:'Formación C-Corp',
      corporate_minutes:'Actas Corporativas', banking_resolution:'Resolución Bancaria',
      small_estate_affidavit:'Pequeño Patrimonio §13100', quitclaim_deed:'Escritura Quitclaim',
      contractor_agreement:'Contrato de Contratista', demand_letter:'Carta de Cobro',
      apostille_letter:'Carta de Apostilla', simple_doc:'Documento Legal',
    },
    commission: 'Comisión', date: 'Fecha',
  },
  en: {
    heading: 'My Earnings', back: '← Dashboard', brand: 'Partner Portal', partnerAccount: 'Partner Account', membership: '💳 Membership', signOut: 'Sign Out',
    nav: {dashboard:'Dashboard', clients:'My Clients', documents:'Documents', earnings:'Earnings', resources:'Resources'},
    totalEarnings: 'Total Earnings', pendingPayout: 'Pending Payout', paidOut: 'Paid Out', totalDocs: 'Total Documents',
    all: 'All', thisMonth: 'This Month', lastMonth: 'Last Month',
    status: {pending:'Pending', paid:'Paid', cancelled:'Cancelled'},
    filterAll: 'All', loading: 'Loading earnings...', noEarnings: 'No earnings yet.',
    type: {
      general_poa:'General POA', limited_poa:'Limited POA', 
      living_trust:'Living Trust', llc_formation:'LLC Formation', bill_of_sale:'Bill of Sale', 
      affidavit:'Affidavit', travel_authorization:'Travel Authorization',
      authorization_letter:'Travel Authorization', guardianship_designation:'Guardianship',
      revocation_poa:'POA Revocation', promissory_note:'Promissory Note',
      pour_over_will:'Pour-Over Will', simple_will:'Simple Will',
      hipaa_authorization:'HIPAA Authorization', certification_of_trust:'Cert. of Trust',
      s_corp_formation:'S-Corp Formation', c_corp_formation:'C-Corp Formation',
      corporate_minutes:'Corporate Minutes', banking_resolution:'Banking Resolution',
      small_estate_affidavit:'Small Estate Affidavit §13100', quitclaim_deed:'Quitclaim Deed',
      contractor_agreement:'Contractor Agreement', demand_letter:'Demand Letter',
      apostille_letter:'Apostille Letter', simple_doc:'Legal Document',
    },
    commission: 'Commission', date: 'Date',
  }
};

export default function PartnerEarnings() {
  const router = useRouter();
  const [lang, setLang] = useState('es');
  const t = T[lang];
  const [earnings, setEarnings] = useState([]);
  const [partner, setPartner] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState('all'); // all, this_month, last_month
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, paid

  useEffect(() => {
    const savedLang = localStorage.getItem('portal_lang') || 'es'; setLang(savedLang);
    const partnerId = localStorage.getItem('partner_id');
    const partnerName = localStorage.getItem('partner_name');
    const commissionRate = localStorage.getItem('partner_commission_rate') || '20';
    if (!partnerId) {
      router.push('/portal/login');
      return;
    }
    setPartner({ id: partnerId, business_name: partnerName, commission_rate: commissionRate });
    fetchEarnings(partnerId);
  }, []);

  const fetchEarnings = async (partnerId) => {
    try {
      const res = await fetch(`/api/portal/earnings?partner_id=${partnerId}`);
      const data = await res.json();
      if (data.success) {
        setEarnings(data.earnings || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error('Failed to fetch earnings:', err);
    }
    setLoading(false);
  };

  const formatMoney = (amount) => {
    return '$' + (amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-emerald-500/20 text-emerald-400',
      pending: 'bg-amber-500/20 text-amber-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    const labels = {
      paid: 'Paid',
      pending: 'Pending',
      cancelled: 'Cancelled',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getDocTypeBadge = (type) => {
    const styles = {
      general_poa: 'bg-blue-100 text-blue-700',
      limited_poa: 'bg-green-100 text-green-700',
      living_trust: 'bg-purple-500/20 text-purple-400',
      llc_formation: 'bg-orange-500/20 text-orange-400',
      authorization_letter: 'bg-pink-500/20 text-pink-400',
      travel_authorization: 'bg-pink-500/20 text-pink-400',
      bill_of_sale: 'bg-amber-500/20 text-amber-400',
      affidavit: 'bg-cyan-500/20 text-cyan-400',
      promissory_note: 'bg-red-500/20 text-red-400',
      guardianship_designation: 'bg-teal-500/20 text-teal-400',
      s_corp_formation: 'bg-emerald-500/20 text-emerald-400',
      c_corp_formation: 'bg-sky-500/20 text-sky-400',
    };
    const t2 = T[lang];
    const label = (t2?.type && t2.type[type]) || type?.replace(/_/g, ' ') || type;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[type] || 'bg-slate-100 text-slate-600'}`}>
        {label}
      </span>
    );
  };

  // Filter earnings based on period and status
  const filteredEarnings = earnings.filter(earning => {
    // Status filter
    if (statusFilter !== 'all' && earning.status !== statusFilter) return false;

    // Period filter
    if (periodFilter !== 'all') {
      const earningDate = new Date(earning.created_at);
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      if (periodFilter === 'this_month' && earningDate < thisMonthStart) return false;
      if (periodFilter === 'last_month' && (earningDate < lastMonthStart || earningDate > lastMonthEnd)) return false;
    }

    return true;
  });

  // Calculate filtered totals
  const filteredPending = filteredEarnings
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + (e.commission_amount || 0), 0);
  
  const filteredPaid = filteredEarnings
    .filter(e => e.status === 'paid')
    .reduce((sum, e) => sum + (e.commission_amount || 0), 0);

  const handleLogout = () => {
    localStorage.removeItem('partner_token');
    localStorage.removeItem('partner_id');
    localStorage.removeItem('partner_name');
    router.push('/portal/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  function toggleLang() { const nl=lang==='es'?'en':'es'; setLang(nl); localStorage.setItem('portal_lang',nl); }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      

      {/* Navigation Tabs */}
      {/* Professional Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">MS</span>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-slate-800">Multi Servicios 360</h1>
                  <p className="text-xs text-slate-500">{t.brand}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center text-sm text-slate-600">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:8552467274" className="hover:text-blue-600 font-medium">(855) 246-7274</a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-800">{partner?.business_name}</p>
                  <p className="text-xs text-slate-500">{t.partnerAccount}</p>
                </div>
                <button onClick={() => window.location.href = '/portal/membership'} className="px-4 py-2 text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">{t.membership}</button>
                <button onClick={toggleLang} className="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">{lang === 'es' ? 'EN' : 'ES'}</button>
                <button onClick={handleLogout} className="px-4 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">{t.signOut}</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button onClick={() => router.push('/portal/dashboard')} className="px-4 py-3 text-sm font-medium border-b-2 transition-colors text-slate-600 hover:text-slate-800 border-transparent hover:border-slate-300">{t.nav.dashboard}</button>
            <button onClick={() => router.push('/portal/clients')} className="px-4 py-3 text-sm font-medium border-b-2 transition-colors text-slate-600 hover:text-slate-800 border-transparent hover:border-slate-300">{t.nav.clients}</button>
            <button onClick={() => router.push('/portal/documents')} className="px-4 py-3 text-sm font-medium border-b-2 transition-colors text-slate-600 hover:text-slate-800 border-transparent hover:border-slate-300">{t.nav.documents}</button>
            <button onClick={() => router.push('/portal/earnings')} className="px-4 py-3 text-sm font-medium border-b-2 transition-colors text-blue-600 border-blue-600">{t.nav.earnings}</button>
            <button onClick={() => router.push('/portal/resources')} className="px-4 py-3 text-sm font-medium border-b-2 transition-colors text-slate-600 hover:text-slate-800 border-transparent hover:border-slate-300">{lang === 'es' ? '📦 Recursos' : '📦 Resources'}</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Earnings</h1>
          <p className="text-slate-500 mt-1">Track your commissions and payouts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Total Earned</p>
                <p className="text-3xl font-bold text-white mt-1">{formatMoney(stats?.totalEarned)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Pending Payout</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">{formatMoney(stats?.pendingPayout)}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-2">Paid out on the 1st of each month</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Paid Out</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">{formatMoney(stats?.totalPaid)}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Commission Rate</p>
                <p className="text-3xl font-bold text-white mt-1">20%</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Info Banner */}
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-white font-semibold">How Payouts Work</h3>
              <p className="text-slate-300 text-sm mt-1">
                Commissions are calculated at 20% of each completed sale. Payouts are processed on the 1st of each month 
                for all earnings from the previous month. You'll receive payment via your preferred method (Zelle, check, or direct deposit).
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setPeriodFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                periodFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setPeriodFilter('this_month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                periodFilter === 'this_month' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriodFilter('last_month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                periodFilter === 'last_month' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Last Month
            </button>
          </div>

          <div className="flex bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'pending' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'paid' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Paid
            </button>
          </div>
        </div>

        {/* Filtered Summary */}
        {(periodFilter !== 'all' || statusFilter !== 'all') && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-slate-500 text-sm">Filtered Pending</p>
              <p className="text-xl font-bold text-amber-400">{formatMoney(filteredPending)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-slate-500 text-sm">Filtered Paid</p>
              <p className="text-xl font-bold text-emerald-400">{formatMoney(filteredPaid)}</p>
            </div>
          </div>
        )}

        {/* Earnings List */}
        {filteredEarnings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-400 mb-4">
              {earnings.length === 0 ? 'No earnings yet' : 'No earnings match your filters'}
            </p>
            {earnings.length === 0 && (
              <button
                onClick={() => router.push('/portal/new-document')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create your first document
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Document</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden md:table-cell">Sale Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Commission</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden sm:table-cell">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEarnings.map((earning) => (
                    <tr key={earning.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-slate-800 font-medium">
                              {earning.client_name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-slate-800 font-medium">{earning.client_name || 'Unknown Client'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getDocTypeBadge(earning.document_type)}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-slate-300">{formatMoney(earning.sale_amount)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-emerald-600 font-semibold">{formatMoney(earning.commission_amount)}</p>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        {getStatusBadge(earning.status)}
                        {earning.paid_at && (
                          <p className="text-slate-500 text-xs mt-1">
                            Paid: {new Date(earning.paid_at).toLocaleDateString()}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm hidden lg:table-cell">
                        {new Date(earning.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
