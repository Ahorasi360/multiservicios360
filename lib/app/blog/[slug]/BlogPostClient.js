'use client';
import Link from 'next/link';

var categoryLabels = {
  es: { legal: 'Tips Legales', news: 'Noticias', community: 'Comunidad', immigration: 'Inmigración', general: 'General' },
  en: { legal: 'Legal Tips', news: 'News', community: 'Community', immigration: 'Immigration', general: 'General' },
};

var categoryColors = {
  legal: 'bg-blue-100 text-blue-800',
  news: 'bg-green-100 text-green-800',
  community: 'bg-purple-100 text-purple-800',
  immigration: 'bg-amber-100 text-amber-800',
  general: 'bg-gray-100 text-gray-800',
};

var translations = {
  es: {
    backBlog: '← Volver al Blog',
    by: 'Por',
    minRead: 'min de lectura',
    related: 'Artículos Relacionados',
    readMore: 'Leer más →',
    ctaTitle: '¿Necesita preparar documentos legales?',
    ctaSub: 'Nuestra plataforma le permite hacerlo usted mismo, en español e inglés, en minutos.',
    share: 'Compartir',
    disclaimer: 'Multi Servicios 360 no es un bufete de abogados y no proporciona asesoría legal.',
    services: 'Servicios',
    whyUs: '¿Por Qué Nosotros?',
    ourStory: 'Nuestra Historia',
    contact: 'Contacto',
    callUs: 'Llámenos:',
    allRights: 'Todos los derechos reservados.',
    poaBtn: 'Poder General →',
    lpoaBtn: 'Poder Limitado →',
    trustBtn: 'Fideicomiso en Vida →',
    llcBtn: 'Formar LLC →',
  },
  en: {
    backBlog: '← Back to Blog',
    by: 'By',
    minRead: 'min read',
    related: 'Related Articles',
    readMore: 'Read more →',
    ctaTitle: 'Need to prepare legal documents?',
    ctaSub: 'Our platform lets you do it yourself, in Spanish and English, in minutes.',
    share: 'Share',
    disclaimer: 'Multi Servicios 360 is not a law firm and does not provide legal advice.',
    services: 'Services',
    whyUs: 'Why Us?',
    ourStory: 'Our Story',
    contact: 'Contact',
    callUs: 'Call Us:',
    allRights: 'All rights reserved.',
    poaBtn: 'General POA →',
    lpoaBtn: 'Limited POA →',
    trustBtn: 'Living Trust →',
    llcBtn: 'Form LLC →',
  },
};

function formatDate(dateStr, lang) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  return d.toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function estimateReadTime(text) {
  var words = (text || '').split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

function renderMarkdown(md) {
  if (!md) return '';

  var html = md
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg shadow-md my-6 max-w-full" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, text, url) {
      if (url.startsWith('/') || url.startsWith('#')) {
        return '<a href="' + url + '" class="text-blue-700 underline hover:text-blue-900 font-semibold">' + text + '</a>';
      }
      return '<a href="' + url + '" class="text-blue-700 underline hover:text-blue-900" target="_blank" rel="noopener">' + text + '</a>';
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr class="my-8 border-gray-200" />')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-900 mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-10 mb-4">$1</h2>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-600 bg-blue-50 pl-4 py-3 pr-4 my-6 rounded-r-lg text-gray-700 italic">$1</blockquote>');

  html = html.replace(/((?:^[-*] .+\n?)+)/gm, function(match) {
    var items = match.trim().split('\n').map(function(line) {
      var text = line.replace(/^[-*] /, '');
      return '<li class="flex items-start gap-2 mb-1.5"><span class="text-blue-600 mt-1 flex-shrink-0">•</span><span>' + text + '</span></li>';
    }).join('');
    return '<ul class="my-4 space-y-1">' + items + '</ul>';
  });

  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, function(match) {
    var items = match.trim().split('\n').map(function(line, i) {
      var text = line.replace(/^\d+\. /, '');
      return '<li class="flex items-start gap-2 mb-1.5"><span class="text-blue-700 font-bold flex-shrink-0">' + (i + 1) + '.</span><span>' + text + '</span></li>';
    }).join('');
    return '<ol class="my-4 space-y-1">' + items + '</ol>';
  });

  html = html
    .split('\n\n')
    .map(function(block) {
      var trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<')) return trimmed;
      return '<p class="text-gray-700 leading-relaxed mb-4">' + trimmed.replace(/\n/g, '<br/>') + '</p>';
    })
    .join('\n');

  return html;
}

export default function BlogPostClient({ post, relatedPosts, lang }) {
  lang = lang || 'es';
  var t = translations[lang];
  var cats = categoryLabels[lang];

  var hasTranslation = post.hasEnglishContent || (post.content_en && post.content_en !== post.content);
  var title = lang === 'en' ? (post.title_en || post.title) : post.title;
  var content = lang === 'en' ? (post.content_en || post.content) : post.content;
  var readTime = estimateReadTime(content);
  var catColor = categoryColors[post.category] || categoryColors.general;

  var blogBase = lang === 'en' ? '/en/blog' : '/blog';
  var toggleUrl = lang === 'es' ? '/en/blog/' + post.slug : '/blog/' + post.slug;

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <div className="bg-amber-400">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <p className="text-gray-900 text-xs text-center font-medium">{t.disclaimer}</p>
        </div>
      </div>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center shadow-md"><span className="text-white font-extrabold text-xs">M360</span></div>
            <div className="hidden sm:block"><span className="text-gray-900 font-bold text-sm block leading-tight">Multi Servicios 360</span><span className="text-gray-500 text-[10px] uppercase tracking-widest">Document Preparation</span></div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#services" className="text-gray-700 hover:text-blue-700 text-sm font-medium no-underline">{t.services}</Link>
            <Link href="/por-que-nosotros" className="text-gray-700 hover:text-blue-700 text-sm font-medium no-underline">{t.whyUs}</Link>
            <Link href="/nuestra-historia" className="text-gray-700 hover:text-blue-700 text-sm font-medium no-underline">{t.ourStory}</Link>
            <Link href={blogBase} className="text-blue-700 font-bold text-sm no-underline border-b-2 border-blue-700 pb-0.5">Blog</Link>
            <Link href="/contacto" className="text-gray-700 hover:text-blue-700 text-sm font-medium no-underline">{t.contact}</Link>
          </div>
          <div className="flex items-center gap-3">
            {hasTranslation ? (
              <Link href={toggleUrl} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors no-underline">🌐 {lang === 'es' ? 'EN' : 'ES'}</Link>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-gray-200 text-gray-400 cursor-not-allowed">🌐 {lang === 'es' ? 'EN' : 'ES'}</span>
            )}
            <a href="tel:8552467274" className="hidden sm:inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm px-4 py-2 rounded-full no-underline transition-colors shadow-sm">📞 855.246.7274</a>
          </div>
        </div>
      </nav>

      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <Link href={blogBase} className="text-blue-700 hover:text-blue-900 text-sm font-medium no-underline">{t.backBlog}</Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-10">
        {post.image ? (
          <div className="aspect-[2/1] rounded-xl overflow-hidden mb-8 shadow-lg">
            <img src={post.image} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[3/1] rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 mb-8 flex items-center justify-center">
            <div className="w-20 h-20 bg-blue-800/10 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-800/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={catColor + ' text-[11px] font-bold px-2.5 py-1 rounded-full'}>{cats[post.category] || post.category}</span>
          <span className="text-gray-400 text-sm">{formatDate(post.date, lang)}</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400 text-sm">{readTime} {t.minRead}</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400 text-sm">{t.by} {post.author}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">{title}</h1>

        <div className="prose-custom" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />

        <div className="border-t border-gray-200 mt-10 pt-6">
          <p className="text-gray-500 text-sm font-medium mb-3">{t.share}:</p>
          <div className="flex gap-3">
            <a href="https://www.facebook.com/sharer/sharer.php" target="_blank" rel="noopener" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center no-underline transition-colors text-sm font-bold">f</a>
            <a href="https://twitter.com/intent/tweet" target="_blank" rel="noopener" className="w-10 h-10 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center no-underline transition-colors text-sm font-bold">X</a>
            <a href="https://wa.me/" target="_blank" rel="noopener" className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center no-underline transition-colors text-sm font-bold">W</a>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-12 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 text-center">{t.related}</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {relatedPosts.map(function(rp) {
                var rpTitle = lang === 'en' ? (rp.title_en || rp.title) : rp.title;
                var rpUrl = (lang === 'en' ? '/en/blog/' : '/blog/') + rp.slug;
                return (
                  <Link key={rp.slug} href={rpUrl} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all no-underline overflow-hidden border border-gray-100">
                    <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      {rp.image ? (<img src={rp.image} alt={rpTitle} className="w-full h-full object-cover" />) : (
                        <svg className="w-8 h-8 text-blue-800/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-gray-900 font-bold text-sm group-hover:text-blue-700 transition-colors">{rpTitle}</h3>
                      <span className="text-blue-700 text-xs font-semibold mt-2 block">{t.readMore}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">{t.ctaTitle}</h2>
          <p className="text-gray-500 text-sm mb-6">{t.ctaSub}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/poa" className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-5 py-3 rounded-lg no-underline shadow-md transition-colors">{t.poaBtn}</Link>
            <Link href="/limited-poa" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-5 py-3 rounded-lg no-underline shadow-md transition-colors">{t.lpoaBtn}</Link>
            <Link href="/trust" className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-5 py-3 rounded-lg no-underline shadow-md transition-colors">{t.trustBtn}</Link>
            <Link href="/llc" className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm px-5 py-3 rounded-lg no-underline shadow-md transition-colors">{t.llcBtn}</Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white pt-10 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-600 text-[11px] text-center mb-3">{t.disclaimer}</p>
            <p className="text-gray-600 text-xs text-center">© 2026 Multi Servicios 360. {t.allRights}</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.3)]"><a href="tel:8552467274" className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-800 to-blue-900 text-white no-underline font-bold text-base py-4">📞 <span>{t.callUs}</span> <span className="text-yellow-400 font-extrabold">855.246.7274</span></a></div>
      <div className="h-16 md:hidden" />
    </div>
  );
}
