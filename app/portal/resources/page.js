// app/portal/resources/page.js - BILINGUAL ES/EN
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const T = {
  es: {
    title: 'Recursos de Marketing', brand: 'Portal de Socios', partnerAccount: 'Cuenta de Socio', membership: '💳 Membresía', signOut: 'Cerrar Sesión', back: '← Volver al Panel',
    nav: { dashboard: 'Panel', clients: 'Mis Clientes', documents: 'Documentos', earnings: 'Ganancias', resources: 'Recursos' },
    heading: '📦 Recursos de Marketing', desc: 'Descarga flyers, posters y materiales de marketing para tu oficina',
    all: 'Todos', loading: 'Cargando recursos...', empty: 'No hay recursos disponibles aún',
    emptyDesc: 'Vuelve pronto — la oficina central está preparando materiales para ti.',
    download: '⬇️ Descargar', unavailable: 'No disponible',
    cats: { flyers: 'Flyers', posters: 'Posters', brochures: 'Folletos', social_media: 'Redes Sociales', training: 'Capacitación', general: 'General' },
  },
  en: {
    title: 'Marketing Resources', brand: 'Partner Portal', partnerAccount: 'Partner Account', membership: '💳 Membership', signOut: 'Sign Out', back: '← Back to Dashboard',
    nav: { dashboard: 'Dashboard', clients: 'My Clients', documents: 'Documents', earnings: 'Earnings', resources: 'Resources' },
    heading: '📦 Marketing Resources', desc: 'Download flyers, posters, and marketing materials for your office',
    all: 'All', loading: 'Loading resources...', empty: 'No resources available yet',
    emptyDesc: 'Check back soon — headquarters is preparing marketing materials for you.',
    download: '⬇️ Download', unavailable: 'Unavailable',
    cats: { flyers: 'Flyers', posters: 'Posters', brochures: 'Brochures', social_media: 'Social Media', training: 'Training', general: 'General' },
  }
};

export default function PortalResourcesPage() {
  const router = useRouter();
  const [lang, setLang] = useState('es');
  const [partnerId, setPartnerId] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [partner, setPartner] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const t = T[lang];

  useEffect(() => {
    const savedLang = localStorage.getItem('portal_lang') || 'es';
    setLang(savedLang);
    const id = localStorage.getItem('partner_id');
    const name = localStorage.getItem('partner_name');
    if (!id) { router.push('/portal/login'); return; }
    setPartnerId(id); setPartnerName(name || '');
    setPartner({ id, business_name: name || '', commission_rate: localStorage.getItem('partner_commission_rate') || '20' });
    fetchResources(id);
  }, []);

  function toggleLang() { const nl = lang === 'es' ? 'en' : 'es'; setLang(nl); localStorage.setItem('portal_lang', nl); }

  function handleLogout() { ['partner_token','partner_id','partner_name','partner_commission_rate','partner_referral_code'].forEach(k => localStorage.removeItem(k)); router.push('/portal/login'); }

  async function fetchResources(id) {
    try {
      const res = await fetch(`/api/portal/resources?partner_id=${id}`);
      const data = await res.json();
      if (data.success) setResources(data.resources || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  const catMeta = {
    flyers: { icon: '📄', color: '#3B82F6' }, posters: { icon: '🖼️', color: '#8B5CF6' },
    brochures: { icon: '📰', color: '#059669' }, social_media: { icon: '📱', color: '#D97706' },
    training: { icon: '📚', color: '#DC2626' }, general: { icon: '📋', color: '#64748B' },
  };

  const filtered = filter === 'all' ? resources : resources.filter(r => r.category === filter);
  const formatSize = (bytes) => bytes > 1024*1024 ? (bytes/1024/1024).toFixed(1)+' MB' : Math.round(bytes/1024)+' KB';

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'#64748B' }}>{t.loading}</div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC' }}>

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
            <button onClick={() => router.push('/portal/earnings')} className="px-4 py-3 text-sm font-medium border-b-2 transition-colors text-slate-600 hover:text-slate-800 border-transparent hover:border-slate-300">{t.nav.earnings}</button>
            <button onClick={() => router.push('/portal/resources')} className="px-4 py-3 text-sm font-medium border-b-2 transition-colors text-blue-600 border-blue-600">{lang === 'es' ? '📦 Recursos' : '📦 Resources'}</button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ marginBottom:24 }}>
          <h2 style={{ fontSize:24, fontWeight:700, color:'#1E293B', margin:'0 0 6px' }}>{t.heading}</h2>
          <p style={{ color:'#64748B', margin:0 }}>{t.desc}</p>
        </div>

        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
          <button onClick={() => setFilter('all')} style={{ padding:'8px 18px', borderRadius:20, fontSize:13, fontWeight:600, cursor:'pointer', background:filter==='all'?'#3B82F6':'#fff', color:filter==='all'?'#fff':'#64748B', border:'1px solid #E2E8F0' }}>
            {t.all} ({resources.length})
          </button>
          {Object.entries(catMeta).map(([key, cat]) => {
            const count = resources.filter(r => r.category === key).length;
            if (!count) return null;
            return (
              <button key={key} onClick={() => setFilter(key)} style={{ padding:'8px 18px', borderRadius:20, fontSize:13, fontWeight:600, cursor:'pointer', background:filter===key?'#3B82F6':'#fff', color:filter===key?'#fff':'#64748B', border:'1px solid #E2E8F0' }}>
                {cat.icon} {t.cats[key]} ({count})
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:16, padding:64, textAlign:'center', border:'1px solid #E2E8F0' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
            <h3 style={{ fontSize:18, fontWeight:600, color:'#1E293B', margin:'0 0 8px' }}>{t.empty}</h3>
            <p style={{ color:'#64748B', margin:0 }}>{t.emptyDesc}</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
            {filtered.map(r => {
              const cat = catMeta[r.category] || catMeta.general;
              const isPDF = r.file_type === 'application/pdf';
              const isImage = r.file_type?.startsWith('image/');
              return (
                <div key={r.id} style={{ background:'#fff', borderRadius:16, border:'1px solid #E2E8F0', overflow:'hidden' }}>
                  <div style={{ height:4, background:cat.color }} />
                  <div style={{ padding:20 }}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                      <div style={{ width:48, height:48, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, background:`${cat.color}15` }}>
                        {isPDF ? '📄' : isImage ? '🖼️' : cat.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14, color:'#1E293B' }}>{r.title}</div>
                        <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20, background:`${cat.color}15`, color:cat.color }}>{t.cats[r.category] || r.category}</span>
                      </div>
                    </div>
                    {r.description && <p style={{ fontSize:13, color:'#64748B', margin:'0 0 12px' }}>{r.description}</p>}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:11, color:'#94A3B8' }}>{formatSize(r.file_size)}</span>
                      {r.download_url
                        ? <a href={r.download_url} download={r.file_name} target="_blank" rel="noreferrer" style={{ padding:'8px 16px', background:'#3B82F6', color:'#fff', borderRadius:8, fontSize:13, fontWeight:600, textDecoration:'none' }}>{t.download}</a>
                        : <span style={{ fontSize:12, color:'#94A3B8' }}>{t.unavailable}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
