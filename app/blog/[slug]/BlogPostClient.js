'use client';
import Link from 'next/link';
import { useState, useCallback } from 'react';

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
    share: 'Compartir este artículo',
    copyLink: 'Copiar enlace',
    copied: '¡Copiado!',
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
    share: 'Share this article',
    copyLink: 'Copy link',
    copied: 'Copied!',
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
  return d.toLocaleDateString(lang === 'es' ? 'es' : 'en-US', {
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

// ─── ShareButtons Component ──────────────────────────────────────────────────
function ShareButtons({ title, slug, lang, shareLabel, copyLabel, copiedLabel }) {
  const [copied, setCopied] = useState(false);
  const [igCopied, setIgCopied] = useState(false);
  const [ttCopied, setTtCopied] = useState(false);

  var url = 'https://multiservicios360.net' + (lang === 'en' ? '/en/blog/' : '/blog/') + slug;
  var encoded = encodeURIComponent(url);
  var encodedTitle = encodeURIComponent(title);
  var wa = encodeURIComponent(title + '\n\n' + url);

  var copyToClipboard = useCallback(function(text, setter) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() {
        setter(true);
        setTimeout(function() { setter(false); }, 2500);
      });
    }
  }, []);

  var nativeShare = useCallback(function() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: title, url: url }).catch(function() {});
    }
  }, [title, url]);

  var hasMobileShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="border-t border-gray-200 mt-10 pt-6">
      <p className="text-gray-600 text-sm font-bold mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        {shareLabel}
      </p>

      {/* Row 1 — Primary social platforms */}
      <div className="flex flex-wrap gap-2 mb-3">

        {/* Facebook */}
        <a href={'https://www.facebook.com/sharer/sharer.php?u=' + encoded}
          target="_blank" rel="noopener noreferrer" title="Facebook"
          className="flex items-center gap-2 px-3 py-2 bg-[#1877F2] hover:bg-[#0d65d9] text-white rounded-lg no-underline transition-colors text-xs font-semibold shadow-sm">
          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          Facebook
        </a>

        {/* WhatsApp */}
        <a href={'https://wa.me/?text=' + wa}
          target="_blank" rel="noopener noreferrer" title="WhatsApp"
          className="flex items-center gap-2 px-3 py-2 bg-[#25D366] hover:bg-[#1db954] text-white rounded-lg no-underline transition-colors text-xs font-semibold shadow-sm">
          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>

        {/* X / Twitter */}
        <a href={'https://twitter.com/intent/tweet?text=' + encodedTitle + '&url=' + encoded + '&via=MS360Legal'}
          target="_blank" rel="noopener noreferrer" title="X / Twitter"
          className="flex items-center gap-2 px-3 py-2 bg-black hover:bg-gray-800 text-white rounded-lg no-underline transition-colors text-xs font-semibold shadow-sm">
          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          X
        </a>

        {/* Telegram */}
        <a href={'https://t.me/share/url?url=' + encoded + '&text=' + encodedTitle}
          target="_blank" rel="noopener noreferrer" title="Telegram"
          className="flex items-center gap-2 px-3 py-2 bg-[#229ED9] hover:bg-[#1a8bbf] text-white rounded-lg no-underline transition-colors text-xs font-semibold shadow-sm">
          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          Telegram
        </a>

        {/* LinkedIn */}
        <a href={'https://www.linkedin.com/sharing/share-offsite/?url=' + encoded}
          target="_blank" rel="noopener noreferrer" title="LinkedIn"
          className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2] hover:bg-[#085196] text-white rounded-lg no-underline transition-colors text-xs font-semibold shadow-sm">
          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>

        {/* Pinterest */}
        <a href={'https://pinterest.com/pin/create/button/?url=' + encoded + '&description=' + encodedTitle}
          target="_blank" rel="noopener noreferrer" title="Pinterest"
          className="flex items-center gap-2 px-3 py-2 bg-[#E60023] hover:bg-[#c0001d] text-white rounded-lg no-underline transition-colors text-xs font-semibold shadow-sm">
          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
          Pinterest
        </a>

      </div>

      {/* Row 2 — App-based + copy */}
      <div className="flex flex-wrap gap-2 mb-1">

        {/* Threads */}
        <a href={'https://www.threads.net/intent/post?text=' + encodedTitle + '%0A%0A' + encoded}
          target="_blank" rel="noopener noreferrer" title="Threads"
          className="flex items-center gap-2 px-3 py-2 bg-black hover:bg-gray-900 text-white rounded-lg no-underline transition-colors text-xs font-semibold shadow-sm">
          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.52.85-6.374 2.495-8.423C5.845 1.185 8.598 0 12.18 0c3.582 0 6.335 1.185 8.185 3.645 1.62 2.034 2.495 4.888 2.495 8.423 0 3.518-.875 6.372-2.495 8.39l-.012.018c-1.85 2.297-4.6 3.5-8.167 3.524zm.083-21.654c-3.068 0-5.411.968-6.96 2.88C3.75 7.162 3 9.61 3 12.068c0 2.46.75 4.908 2.309 6.842 1.549 1.912 3.892 2.88 6.96 2.88 3.065-.015 5.41-1.007 6.96-2.87 1.557-1.934 2.271-4.382 2.271-6.843 0-2.459-.714-4.906-2.271-6.84-1.55-1.934-3.895-2.891-6.96-2.891zm-.344 16.32a4.71 4.71 0 01-2.74-.824 4.4 4.4 0 01-1.665-2.208 7.58 7.58 0 01-.505-2.88v-.023c0-1.096.167-2.1.505-3.003a4.4 4.4 0 011.665-2.208 4.71 4.71 0 012.74-.824c.966 0 1.826.237 2.58.71.754.474 1.34 1.14 1.76 2 .419.858.629 1.858.629 3 0 1.13-.21 2.123-.628 2.978a4.42 4.42 0 01-1.762 2.004 4.71 4.71 0 01-2.579.278zm.083-9.64c-.825 0-1.493.35-2.003 1.05-.51.699-.765 1.626-.765 2.78v.023c0 1.157.255 2.084.765 2.782.51.699 1.178 1.048 2.003 1.048.816 0 1.475-.35 1.98-1.048.503-.698.754-1.625.754-2.782 0-1.154-.251-2.081-.753-2.78-.506-.7-1.165-1.05-1.981-1.05v-.023z"/></svg>
          Threads
        </a>

        {/* Instagram — copy link (no direct share API) */}
        <button
          onClick={function() { copyToClipboard(url, setIgCopied); }}
          title="Copiar para Instagram"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-white text-xs font-semibold shadow-sm transition-all cursor-pointer border-0"
          style={{ background: igCopied ? '#16a34a' : 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' }}>
          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          {igCopied ? '✓ Copiado' : 'Instagram'}
        </button>

        {/* TikTok — copy link */}
        <button
          onClick={function() { copyToClipboard(url, setTtCopied); }}
          title="Copiar para TikTok"
          className="flex items-center gap-2 px-3 py-2 bg-black hover:bg-gray-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer border-0"
          style={ttCopied ? { backgroundColor: '#16a34a' } : {}}>
          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.8a8.18 8.18 0 004.78 1.52V6.87a4.85 4.85 0 01-1.01-.18z"/></svg>
          {ttCopied ? '✓ Copiado' : 'TikTok'}
        </button>

        {/* YouTube Shorts — copy link */}
        <a href={'https://www.youtube.com/@MultiServicios360'}
          target="_blank" rel="noopener noreferrer" title="YouTube"
          className="flex items-center gap-2 px-3 py-2 bg-[#FF0000] hover:bg-[#cc0000] text-white rounded-lg no-underline transition-colors text-xs font-semibold shadow-sm">
          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          YouTube
        </a>

        {/* SMS / iMessage */}
        <a href={'sms:?body=' + wa}
          title="Enviar por SMS"
          className="flex items-center gap-2 px-3 py-2 bg-[#34C759] hover:bg-[#28a046] text-white rounded-lg no-underline transition-colors text-xs font-semibold shadow-sm">
          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          SMS
        </a>

        {/* Copy Link */}
        <button
          onClick={function() { copyToClipboard(url, setCopied); }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer border-0"
          style={{ backgroundColor: copied ? '#16a34a' : '#6366f1', color: 'white' }}>
          {copied
            ? <><svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>{copiedLabel}</>
            : <><svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>{copyLabel}</>
          }
        </button>

        {/* Native share (mobile only) */}
        {hasMobileShare && (
          <button
            onClick={nativeShare}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer border-0">
            <svg className="w-4 h-4 fill-none flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            {lang === 'es' ? 'Más opciones' : 'More options'}
          </button>
        )}

      </div>
      <p className="text-gray-400 text-xs mt-2">
        {lang === 'es'
          ? '📲 Para Instagram y TikTok: copia el enlace y pégalo en tu bio o historia'
          : '📲 For Instagram & TikTok: copy the link and paste it in your bio or story'}
      </p>
    </div>
  );
}

// ─── Main BlogPostClient ──────────────────────────────────────────────────────
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

        <ShareButtons title={title} slug={post.slug} lang={lang} shareLabel={t.share} copyLabel={t.copyLink} copiedLabel={t.copied} />
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
            <Link href={lang === 'en' ? '/en/more-services' : '/mas-servicios'} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-3 rounded-lg no-underline shadow-md transition-colors">{lang === 'en' ? 'More Services →' : 'Más Servicios →'}</Link>
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
