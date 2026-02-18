'use client';
import { useState } from 'react';
import Link from 'next/link';

const categoryLabels = {
  es: { all: 'Todos', legal: 'Tips Legales', news: 'Noticias', community: 'Comunidad', immigration: 'Inmigración' },
  en: { all: 'All', legal: 'Legal Tips', news: 'News', community: 'Community', immigration: 'Immigration' },
};

const categoryColors = {
  legal: { bg: 'bg-blue-100', text: 'text-blue-800' },
  news: { bg: 'bg-green-100', text: 'text-green-800' },
  community: { bg: 'bg-purple-100', text: 'text-purple-800' },
  immigration: { bg: 'bg-amber-100', text: 'text-amber-800' },
  general: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

const translations = {
  es: { heroTitle: 'Blog y Recursos', heroSub: 'Artículos legales, noticias y recursos para la comunidad latina en California', readMore: 'Leer más →', noPosts: 'No hay artículos en esta categoría todavía.', minRead: 'min de lectura' },
  en: { heroTitle: 'Blog & Resources', heroSub: 'Legal articles, news, and resources for the Latino community in California', readMore: 'Read more →', noPosts: 'No posts in this category yet.', minRead: 'min read' },
};

function formatDate(dateStr, lang) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function estimateReadTime(excerpt) {
  return Math.max(2, Math.ceil((excerpt || '').split(/\s+/).length / 40));
}

function getButtonClass(isActive) {
  if (isActive) return 'px-4 py-2 rounded-full text-sm font-semibold transition-colors bg-blue-800 text-white shadow-md';
  return 'px-4 py-2 rounded-full text-sm font-semibold transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200';
}

function getCatBadgeClass(cat) {
  return cat.bg + ' ' + cat.text + ' text-[11px] font-bold px-2.5 py-1 rounded-full';
}

export default function BlogListClient({ posts }) {
  const [lang, setLang] = useState('es');
  const [activeCategory, setActiveCategory] = useState('all');
  const t = translations[lang];
  const cats = categoryLabels[lang];
  const filtered = activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="bg-amber-400"><div className="max-w-7xl mx-auto px-4 py-2"><p className="text-gray-900 text-xs text-center font-medium">{lang === 'es' ? 'Multi Servicios 360 no es un bufete de abogados y no proporciona asesoría legal.' : 'Multi Servicios 360 is not a law firm and does not provide legal advice.'}</p></div></div>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center shadow-md"><span className="text-white font-extrabold text-xs">M360</span></div>
            <div className="hidden sm:block"><span className="text-gray-900 font-bold text-sm block leading-tight">Multi Servicios 360</span><span className="text-gray-500 text-[10px] uppercase tracking-widest">Document Preparation</span></div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#services" className="text-gray-700 hover:text-blue-700 text-sm font-medium no-underline">{lang === 'es' ? 'Servicios' : 'Services'}</Link>
            <Link href="/por-que-nosotros" className="text-gray-700 hover:text-blue-700 text-sm font-medium no-underline">{lang === 'es' ? '¿Por Qué Nosotros?' : 'Why Us?'}</Link>
            <Link href="/nuestra-historia" className="text-gray-700 hover:text-blue-700 text-sm font-medium no-underline">{lang === 'es' ? 'Nuestra Historia' : 'Our Story'}</Link>
            <Link href="/blog" className="text-blue-700 font-bold text-sm no-underline border-b-2 border-blue-700 pb-0.5">Blog</Link>
            <Link href="/contacto" className="text-gray-700 hover:text-blue-700 text-sm font-medium no-underline">{lang === 'es' ? 'Contacto' : 'Contact'}</Link>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">🌐 {lang === 'es' ? 'EN' : 'ES'}</button>
            <a href="tel:8552467274" className="hidden sm:inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm px-4 py-2 rounded-full no-underline transition-colors shadow-sm">📞 855.246.7274</a>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-14 sm:py-18">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{t.heroTitle}</h1>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">{t.heroSub}</p>
        </div>
      </section>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(cats).map(([key, label]) => (
              <button key={key} onClick={() => setActiveCategory(key)} className={getButtonClass(activeCategory === key)}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16"><p className="text-gray-400 text-lg">{t.noPosts}</p></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => {
                const cat = categoryColors[post.category] || categoryColors.general;
                const title = lang === 'en' ? post.title_en : post.title;
                const excerpt = lang === 'en' ? post.excerpt_en : post.excerpt;
                const postUrl = '/blog/' + post.slug;
                return (
                  <Link key={post.slug} href={postUrl} className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 no-underline overflow-hidden border border-gray-100">
                    <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-blue-50 relative overflow-hidden flex items-center justify-center">
                      {post.image ? (<img src={post.image} alt={title} className="w-full h-full object-cover" />) : (
                        <div className="w-16 h-16 bg-blue-800/10 rounded-2xl flex items-center justify-center">
                          <svg className="w-8 h-8 text-blue-800/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                        </div>
                      )}
                      <div className="absolute top-3 left-3"><span className={getCatBadgeClass(cat)}>{cats[post.category] || post.category}</span></div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2"><span>{formatDate(post.date, lang)}</span><span>·</span><span>{estimateReadTime(excerpt)} {t.minRead}</span></div>
                      <h2 className="text-gray-900 font-bold text-base mb-2 group-hover:text-blue-700 transition-colors leading-snug">{title}</h2>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-3">{excerpt}</p>
                      <span className="text-blue-700 font-semibold text-sm group-hover:text-blue-900 transition-colors">{t.readMore}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">{lang === 'es' ? '¿Necesita preparar documentos legales?' : 'Need to prepare legal documents?'}</h2>
         <p className="text-gray-500 text-sm mb-6">{lang === 'es' ? 'Nuestra plataforma le permite hacerlo usted mismo, en español e inglés, en minutos.' : 'Our platform lets you do it yourself, in Spanish and English, in minutes.'}</p>  <div className="flex flex-wrap justify-center gap-3">
  <Link href="/poa" className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-5 py-3 rounded-lg no-underline shadow-md transition-colors">{lang === 'es' ? 'Poder General →' : 'General POA →'}</Link>
            <Link href="/limited-poa" className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-5 py-3 rounded-lg no-underline shadow-md transition-colors">{lang === 'es' ? 'Poder Limitado →' : 'Limited POA →'}</Link>
            <Link href="/trust" className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-5 py-3 rounded-lg no-underline shadow-md transition-colors">{lang === 'es' ? 'Fideicomiso en Vida →' : 'Living Trust →'}</Link>
            <Link href="/llc" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-5 py-3 rounded-lg no-underline shadow-md transition-colors">{lang === 'es' ? 'Formar LLC →' : 'Form LLC →'}</Link></div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white pt-10 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-8 mb-6">
            <div><div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center"><span className="text-white font-extrabold text-[10px]">M360</span></div><span className="text-white font-bold text-sm">Multi Servicios 360</span></div><p className="text-gray-400 text-xs leading-relaxed">{lang === 'es' ? 'Plataforma de preparación de documentos legales de autoayuda para la comunidad latina en California.' : 'Self-help legal document preparation platform for the Latino community in California.'}</p></div>
            <div><h3 className="text-white font-bold text-xs uppercase tracking-wider mb-2">{lang === 'es' ? 'Servicios' : 'Services'}</h3><ul className="space-y-1 list-none p-0 m-0"><li><Link href="/poa" className="text-gray-400 hover:text-white text-xs no-underline">General Power of Attorney</Link></li><li><Link href="/limited-poa" className="text-gray-400 hover:text-white text-xs no-underline">Limited Power of Attorney</Link></li><li><Link href="/trust" className="text-gray-400 hover:text-white text-xs no-underline">California Living Trust</Link></li><li><Link href="/llc" className="text-gray-400 hover:text-white text-xs no-underline">{lang === 'es' ? 'Formación de LLC' : 'LLC Formation'}</Link></li></ul></div>
            <div><h3 className="text-white font-bold text-xs uppercase tracking-wider mb-2">{lang === 'es' ? 'Contacto' : 'Contact'}</h3><ul className="space-y-1 list-none p-0 m-0"><li><a href="tel:8552467274" className="text-gray-400 hover:text-white text-xs no-underline">855.246.7274</a></li><li><a href="mailto:info@multiservicios360.net" className="text-gray-400 hover:text-white text-xs no-underline">info@multiservicios360.net</a></li><li className="text-gray-500 text-xs">{lang === 'es' ? 'Lun - Vie: 9am - 6pm' : 'Mon - Fri: 9am - 6pm'}</li><li className="text-gray-500 text-xs">Beverly Hills, CA</li></ul></div>
          </div>
          <div className="border-t border-gray-800 pt-4">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-3"><Link href="/nuestra-historia" className="text-gray-500 hover:text-white text-xs no-underline">{lang === 'es' ? 'Nuestra Historia' : 'Our Story'}</Link><Link href="/contacto" className="text-gray-500 hover:text-white text-xs no-underline">{lang === 'es' ? 'Contacto' : 'Contact'}</Link><Link href="/terms" className="text-gray-500 hover:text-white text-xs no-underline">{lang === 'es' ? 'Términos' : 'Terms'}</Link><Link href="/privacy" className="text-gray-500 hover:text-white text-xs no-underline">{lang === 'es' ? 'Privacidad' : 'Privacy'}</Link><Link href="/blog" className="text-gray-500 hover:text-white text-xs no-underline">Blog</Link></div>
            <p className="text-gray-600 text-xs text-center">© 2026 Multi Servicios 360. {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.3)]"><a href="tel:8552467274" className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-800 to-blue-900 text-white no-underline font-bold text-base py-4">📞 <span>{lang === 'es' ? 'Llámenos:' : 'Call Us:'}</span> <span className="text-yellow-400 font-extrabold">855.246.7274</span></a></div>
      <div className="h-16 md:hidden" />
    </div>
  );
}