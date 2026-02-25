'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { vaultTranslations } from '../vault-translations';

export default function VaultContent({ token }) {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [vaultData, setVaultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState({});

  const t = vaultTranslations[lang];

  useEffect(() => {
    fetchVault();
  }, [token]);

  const fetchVault = async () => {
    try {
      const res = await fetch(`/api/vault/${token}`);
      if (res.status === 404) {
        setError('invalid');
        setLoading(false);
        return;
      }
      if (res.status === 410) {
        setError('expired');
        setLoading(false);
        return;
      }
      if (res.status === 429) {
        setError('ratelimited');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError('generic');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setVaultData(data);
      setLoading(false);
    } catch {
      setError('generic');
      setLoading(false);
    }
  };

  const handleDownload = async (docId, fileName) => {
    setDownloading((prev) => ({ ...prev, [docId]: true }));
    try {
      const res = await fetch(`/api/vault/${token}/download/${docId}`);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert(lang === 'en' ? 'Download failed. Please try again.' : 'Error al descargar. Intente de nuevo.');
    }
    setDownloading((prev) => ({ ...prev, [docId]: false }));
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(lang === 'en' ? 'en-US' : 'es', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntilExpiry = () => {
    if (!vaultData?.expires_at) return 999;
    const diff = new Date(vaultData.expires_at) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Error states
  if (error) {
    const errorMessages = {
      invalid: t.invalidToken,
      expired: t.expiredMessage,
      ratelimited: t.rateLimited,
      generic: t.error,
    };
    return (
      <div style={{
        minHeight: '100vh',
        background: '#F8FAFC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '48px 40px',
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            {error === 'expired' ? '⏰' : '⚠️'}
          </div>
          <p style={{ fontSize: 16, color: '#475569', margin: '0 0 24px', lineHeight: 1.6 }}>
            {errorMessages[error]}
          </p>
          <button
            onClick={() => router.push('/vault')}
            style={{
              padding: '12px 28px',
              background: '#1E3A8A',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {lang === 'en' ? '← Back' : '← Volver'}
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid #E2E8F0',
          borderTopColor: '#1E3A8A',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#64748B', fontSize: 14 }}>{t.loading}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const daysLeft = getDaysUntilExpiry();
  const documents = vaultData?.documents || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
        padding: '24px',
      }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 800,
              color: '#fff',
            }}>
              M360
            </div>
            <div>
            <h1 style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 700,
              margin: '0',
            }}>
              {t.vaultTitle}
            </h1>
            {vaultData?.client_name && (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>
                {t.welcomeBack}, {vaultData.client_name}
              </p>
            )}
            </div>
          </div>
          <button
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {lang === 'en' ? 'Español' : 'English'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px 40px' }}>
        {/* Expiration Warning */}
        {daysLeft <= 7 && daysLeft > 0 && (
          <div style={{
            background: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: 10,
            padding: '14px 18px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14,
            color: '#92400E',
          }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            {t.expirationWarning}
          </div>
        )}

        {/* Matter Info Card */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 4px', fontWeight: 500 }}>
              {t.expiresOn}
            </p>
            <p style={{ fontSize: 15, color: '#334155', margin: 0, fontWeight: 600 }}>
              {formatDate(vaultData?.expires_at)}
            </p>
          </div>
          <div style={{
            background: '#EFF6FF',
            color: '#1E3A8A',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
          }}>
            {documents.length} {lang === 'en' ? 'document' : 'documento'}{documents.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Documents List */}
        <h2 style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#0F172A',
          margin: '0 0 16px',
        }}>
          📄 {t.documentsLabel}
        </h2>

        {documents.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '40px 24px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: 48, margin: '0 0 12px' }}>📂</p>
            <p style={{ color: '#64748B', fontSize: 15 }}>{t.noDocuments}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {documents.map((doc) => (
              <div
                key={doc.id}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '18px 20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  flexWrap: 'wrap',
                  transition: 'box-shadow 0.2s',
                }}
              >
                {/* File Icon */}
                <div style={{
                  width: 44,
                  height: 44,
                  background: '#EFF6FF',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}>
                  📄
                </div>

                {/* File Info */}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#0F172A',
                    margin: '0 0 4px',
                  }}>
                    {t.docTypes[doc.document_type] || doc.document_type}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: 12,
                    fontSize: 13,
                    color: '#94A3B8',
                    flexWrap: 'wrap',
                  }}>
                    <span>{t.langLabels[doc.language] || doc.language}</span>
                    {doc.file_size && (
                      <>
                        <span>•</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>
                      {doc.source === 'uploaded' ? t.uploadedOn : t.generatedOn}{' '}
                      {formatDate(doc.generated_at)}
                    </span>
                  </div>
                </div>

                {/* Language Badge */}
                <div style={{
                  background: doc.language === 'es' ? '#FEF3C7' : '#DBEAFE',
                  color: doc.language === 'es' ? '#92400E' : '#1E3A8A',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {doc.language === 'es' ? 'ES' : 'EN'}
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(doc.id, doc.file_name)}
                  disabled={downloading[doc.id]}
                  style={{
                    padding: '10px 20px',
                    background: downloading[doc.id]
                      ? '#94A3B8'
                      : 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: downloading[doc.id] ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(30,58,138,0.2)',
                    transition: 'all 0.2s',
                  }}
                >
                  {downloading[doc.id] ? (
                    <span style={{
                      width: 14, height: 14,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                  ) : (
                    '⬇️'
                  )}
                  {t.downloadButton}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Support Footer */}
        <div style={{
          marginTop: 40,
          textAlign: 'center',
          padding: '24px',
          borderTop: '1px solid #E2E8F0',
        }}>
          <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 8px' }}>
            {t.supportText}{' '}
            <a
              href={`mailto:${t.supportEmail}`}
              style={{ color: '#1E3A8A', fontWeight: 600, textDecoration: 'none' }}
            >
              {t.supportEmail}
            </a>
          </p>
          <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
            {t.disclaimer}
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
