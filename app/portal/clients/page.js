// app/portal/clients/page.js — BILINGUAL ES/EN
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const T = {
  es: {
    brand: 'Portal de Socios', dashboard: 'Panel', logout: 'Cerrar Sesión',
    myClients: 'Mis Clientes', totalClients: 'clientes en total',
    addNewClient: '+ Agregar Nuevo Cliente', searchPlaceholder: 'Buscar por nombre, email o teléfono...',
    noClients: 'Sin clientes aún', noClientsDesc: 'Comienza agregando tu primer cliente',
    noResults: 'No se encontraron clientes', addFirst: 'Agregar primer cliente',
    colClient: 'Cliente', colContact: 'Contacto', colLang: 'Idioma', colAdded: 'Agregado', colActions: 'Acciones',
    newDoc: 'Nuevo Doc', spanish: 'Español', english: 'Inglés',
    modalTitle: 'Agregar Nuevo Cliente', clientName: 'Nombre del Cliente *',
    email: 'Correo Electrónico', phone: 'Teléfono', prefLang: 'Idioma Preferido',
    cancel: 'Cancelar', addClient: 'Agregar Cliente', saving: 'Guardando...',
    namePlaceholder: 'María García', loading: 'Cargando clientes...',
  },
  en: {
    brand: 'Partner Portal', dashboard: 'Dashboard', logout: 'Logout',
    myClients: 'My Clients', totalClients: 'total clients',
    addNewClient: '+ Add New Client', searchPlaceholder: 'Search by name, email, or phone...',
    noClients: 'No clients yet', noClientsDesc: 'Start by adding your first client',
    noResults: 'No clients found', addFirst: 'Add your first client',
    colClient: 'Client', colContact: 'Contact', colLang: 'Language', colAdded: 'Added', colActions: 'Actions',
    newDoc: 'New Doc', spanish: 'Español', english: 'English',
    modalTitle: 'Add New Client', clientName: 'Client Name *',
    email: 'Email', phone: 'Phone', prefLang: 'Preferred Language',
    cancel: 'Cancel', addClient: 'Add Client', saving: 'Saving...',
    namePlaceholder: 'Maria Garcia', loading: 'Loading clients...',
  }
};

export default function PartnerClients() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ client_name: '', client_email: '', client_phone: '', language_preference: 'es' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('es');
  const t = T[lang];

  useEffect(() => {
    const savedLang = localStorage.getItem('portal_lang') || 'es';
    setLang(savedLang);
    const partnerId = localStorage.getItem('partner_id');
    if (!partnerId) { router.push('/portal/login'); return; }
    fetchClients(partnerId);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'es' ? 'en' : 'es';
    setLang(newLang);
    localStorage.setItem('portal_lang', newLang);
  };

  const fetchClients = async (partnerId) => {
    try {
      const res = await fetch(`/api/portal/clients?partner_id=${partnerId}`);
      const data = await res.json();
      if (data.success) setClients(data.clients || []);
    } catch (err) { console.error('Failed to fetch clients:', err); }
    setLoading(false);
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const partnerId = localStorage.getItem('partner_id');
    try {
      const res = await fetch('/api/portal/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, partner_id: partnerId })
      });
      const data = await res.json();
      if (data.success) {
        setClients([data.client, ...clients]);
        setShowAddModal(false);
        setFormData({ client_name: '', client_email: '', client_phone: '', language_preference: 'es' });
      } else {
        setError(data.error || 'Error al agregar cliente');
      }
    } catch (err) { setError('Error de conexión. Por favor intenta de nuevo.'); }
    setSaving(false);
  };

  const filteredClients = clients.filter(c =>
    c.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.client_phone?.includes(searchTerm)
  );

  const handleLogout = () => {
    ['partner_token','partner_id','partner_name'].forEach(k => localStorage.removeItem(k));
    router.push('/portal/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-400">{t.loading}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <button onClick={() => router.push('/portal/dashboard')} className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow flex items-center justify-center">
                  <span className="text-lg font-bold text-white">MS</span>
                </div>
                <span className="ml-3 text-xl font-bold text-slate-800">Multi Servicios 360</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => router.push('/portal/dashboard')} className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 text-sm">{t.dashboard}</button>
              <button onClick={toggleLang} className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors">
                <span className="text-sm">{lang === 'es' ? '🇺🇸' : '🌎'}</span>
                <span className="text-slate-700 text-sm font-medium">{lang === 'es' ? 'EN' : 'ES'}</span>
              </button>
              <button onClick={handleLogout} className="text-slate-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 text-sm">{t.logout}</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button onClick={() => router.push('/portal/dashboard')} className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300">Dashboard</button>
            <button onClick={() => router.push('/portal/clients')} className="px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">My Clients</button>
            <button onClick={() => router.push('/portal/documents')} className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300">Documents</button>
            <button onClick={() => router.push('/portal/earnings')} className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300">Earnings</button>
            <button onClick={() => router.push('/portal/resources')} className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300">📦 Resources</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{t.myClients}</h1>
            <p className="text-slate-500 mt-1">{clients.length} {t.totalClients}</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all">
            {t.addNewClient}
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-400 mb-2">{searchTerm ? t.noResults : t.noClients}</p>
            <p className="text-slate-500 text-sm mb-6">{!searchTerm && t.noClientsDesc}</p>
            {!searchTerm && (
              <button onClick={() => setShowAddModal(true)} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">{t.addFirst}</button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">{t.colClient}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden md:table-cell">{t.colContact}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden sm:table-cell">{t.colLang}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 hidden lg:table-cell">{t.colAdded}</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-800 font-medium">{client.client_name?.charAt(0)?.toUpperCase() || '?'}</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-slate-800 font-medium">{client.client_name}</p>
                          <p className="text-slate-400 text-sm md:hidden">{client.client_email || client.client_phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-slate-600">{client.client_email || '-'}</p>
                      <p className="text-slate-500 text-sm">{client.client_phone || '-'}</p>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${client.language_preference === 'es' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {client.language_preference === 'es' ? t.spanish : t.english}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm hidden lg:table-cell">{new Date(client.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => router.push(`/portal/new-document?client_id=${client.id}`)}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                        {t.newDoc}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{t.modalTitle}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-600 hover:text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">{t.clientName}</label>
                <input type="text" value={formData.client_name} onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t.namePlaceholder} required />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">{t.email}</label>
                <input type="email" value={formData.client_email} onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="maria@ejemplo.com" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">{t.phone}</label>
                <input type="tel" value={formData.client_phone} onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">{t.prefLang}</label>
                <select value={formData.language_preference} onChange={(e) => setFormData({...formData, language_preference: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="es">🌎 Español</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">{t.cancel}</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50">
                  {saving ? t.saving : t.addClient}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
