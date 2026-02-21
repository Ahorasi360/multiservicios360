// app/portal/resources/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalResourcesPage() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const id = localStorage.getItem('partner_id');
    const name = localStorage.getItem('partner_name');
    if (!id) { router.push('/portal/login'); return; }
    setPartnerId(id);
    setPartnerName(name || '');
    fetchResources(id);
  }, []);

  async function fetchResources(id) {
    try {
      const res = await fetch(`/api/portal/resources?partner_id=${id}`);
      const data = await res.json();
      if (data.success) setResources(data.resources || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  const categories = {
    flyers: { label: 'Flyers', icon: '📄', color: '#3B82F6' },
    posters: { label: 'Posters', icon: '🖼️', color: '#8B5CF6' },
    brochures: { label: 'Brochures', icon: '📰', color: '#059669' },
    social_media: { label: 'Social Media', icon: '📱', color: '#D97706' },
    training: { label: 'Training', icon: '📚', color: '#DC2626' },
    general: { label: 'General', icon: '📋', color: '#64748B' },
  };

  const filtered = filter === 'all' ? resources : resources.filter(r => r.category === filter);
  const formatSize = (bytes) => bytes > 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + ' MB' : Math.round(bytes / 1024) + ' KB';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">MS</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">Marketing Resources</h1>
                <p className="text-xs text-slate-500">{partnerName}</p>
              </div>
            </div>
            <button onClick={() => router.push('/portal/dashboard')} className="px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - match portal style */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button onClick={() => router.push('/portal/dashboard')} className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300">Dashboard</button>
            <button onClick={() => router.push('/portal/clients')} className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300">My Clients</button>
            <button onClick={() => router.push('/portal/documents')} className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300">Documents</button>
            <button onClick={() => router.push('/portal/earnings')} className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300">Earnings</button>
            <button className="px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Resources</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">📦 Marketing Resources</h2>
          <p className="text-slate-600 mt-1">Download flyers, posters, and marketing materials for your office</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            All ({resources.length})
          </button>
          {Object.entries(categories).map(([key, cat]) => {
            const count = resources.filter(r => r.category === key).length;
            if (count === 0) return null;
            return (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === key ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                {cat.icon} {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Resources Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No resources available yet</h3>
            <p className="text-slate-500">Check back soon — headquarters is preparing marketing materials for you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(resource => {
              const cat = categories[resource.category] || categories.general;
              const isImage = resource.file_type?.startsWith('image/');
              const isPDF = resource.file_type === 'application/pdf';
              return (
                <div key={resource.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* File type indicator */}
                  <div className="h-3" style={{ background: cat.color }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${cat.color}15` }}>
                          {isPDF ? '📄' : isImage ? '🖼️' : cat.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 text-sm leading-tight">{resource.title}</h3>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: `${cat.color}15`, color: cat.color }}>
                            {cat.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    {resource.description && (
                      <p className="text-slate-500 text-sm mb-3 line-clamp-2">{resource.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-400">
                        {formatSize(resource.file_size)} • {resource.file_name}
                      </div>
                      {resource.download_url ? (
                        <a href={resource.download_url} download={resource.file_name} target="_blank" rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                          ⬇️ Download
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Unavailable</span>
                      )}
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
