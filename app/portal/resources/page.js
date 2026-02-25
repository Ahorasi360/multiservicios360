// app/portal/resources/page.js - BILINGUAL ES/EN
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const T = {
  es: {
    title: 'Recursos de Marketing', brand: 'MS', back: '← Volver al Panel',
    nav: { dashboard: 'Panel', clients: 'Mis Clientes', documents: 'Documentos', earnings: 'Ganancias', resources: 'Recursos' },
    heading: '📦 Recursos de Marketing', desc: 'Descarga flyers, posters y materiales de marketing para tu oficina',
    all: 'Todos', loading: 'Cargando recursos...', empty: 'No hay recursos disponibles aún',
    emptyDesc: 'Vuelve pronto — la oficina central está preparando materiales para ti.',
    download: '⬇️ Descargar', unavailable: 'No disponible',
    cats: { flyers: 'Flyers', posters: 'Posters', brochures: 'Folletos', social_media: 'Redes Sociales', training: 'Capacitación', general: 'General' },
  },
  en: {
    title: 'Marketing Resources', brand: 'MS', back: '← Back to Dashboard',
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
    fetchResources(id);
  }, []);

  function toggleLang() { const nl = lang === 'es' ? 'en' : 'es'; setLang(nl); localStorage.setItem('portal_lang', nl); }

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
      <header style={{ background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'0 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', height:64 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:40, height:40, background:'linear-gradient(135deg,#3B82F6,#1E3A8A)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontWeight:'bold', color:'#fff', fontSize:14 }}>{t.brand}</span>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:16, color:'#1E293B' }}>{t.title}</div>
              <div style={{ fontSize:12, color:'#64748B' }}>{partnerName}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={toggleLang} style={{ padding:'6px 12px', background:'#F1F5F9', border:'1px solid #E2E8F0', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', color:'#475569' }}>
              {lang==='es'?'🇺🇸 English':'🇲🇽 Español'}
            </button>
            <button onClick={() => router.push('/portal/dashboard')} style={{ padding:'8px 16px', fontSize:13, color:'#64748B', border:'none', background:'transparent', cursor:'pointer' }}>{t.back}</button>
          </div>
        </div>
      </header>

      <nav style={{ background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'0 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', gap:0 }}>
          {[['dashboard','/portal/dashboard'],['clients','/portal/clients'],['documents','/portal/documents'],['earnings','/portal/earnings'],['resources','/portal/resources']].map(([key,path])=>(
            <button key={key} onClick={() => router.push(path)} style={{ padding:'12px 16px', fontSize:14, fontWeight:500, color: key==='resources'?'#3B82F6':'#64748B', borderBottom: key==='resources'?'2px solid #3B82F6':'2px solid transparent', background:'transparent', border:'none', borderBottom: key==='resources'?'2px solid #3B82F6':'2px solid transparent', cursor:'pointer' }}>
              {t.nav[key]}
            </button>
          ))}
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
