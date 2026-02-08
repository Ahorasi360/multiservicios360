'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { vaultTranslations } from './vault-translations';

export default function VaultLanding() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const t = vaultTranslations[lang];

  // If ?code= is in URL, auto-redirect
  useEffect(() => {
    const urlCode = searchParams.get('code');
    if (urlCode && urlCode.length > 10) {
      router.push(`/vault/${urlCode}`);
    }
  }, [searchParams, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/vault/${trimmed}`);
      if (res.status === 404) {
        setError(t.invalidToken);
        setLoading(false);
        return;
      }
      if (res.status === 410) {
        setError(t.expiredMessage);
        setLoading(false);
        return;
      }
      if (res.status === 429) {
        setError(t.rateLimited);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(t.error);
        setLoading(false);
        return;
      }
      // Valid token — navigate to vault view
      router.push(`/vault/${trimmed}`);
    } catch {
      setError(t.error);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1E40AF 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Language Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '16px 24px',
      }}>
        <button
          onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
        >
          {lang === 'en' ? 'Español' : 'English'}
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '48px 40px',
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
        }}>
          {/* Logo / Brand */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 16,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.5px',
            }}>
              M360
            </div>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#0F172A',
              margin: '0 0 8px',
            }}>
              {t.heroTitle}
            </h1>
            <p style={{
              fontSize: 15,
              color: '#64748B',
              margin: 0,
              lineHeight: 1.5,
            }}>
              {t.heroSubtitle}
            </p>
          </div>

          {/* Code Input Form */}
          <form onSubmit={handleSubmit}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              color: '#334155',
              marginBottom: 8,
            }}>
              {t.codeLabel}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(''); }}
              placeholder={t.codePlaceholder}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: 16,
                border: `2px solid ${error ? '#EF4444' : '#E2E8F0'}`,
                borderRadius: 10,
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
                letterSpacing: '0.5px',
              }}
              onFocus={(e) => { if (!error) e.target.style.borderColor = '#3B82F6'; }}
              onBlur={(e) => { if (!error) e.target.style.borderColor = '#E2E8F0'; }}
              autoComplete="off"
              spellCheck={false}
            />

            {error && (
              <p style={{
                color: '#EF4444',
                fontSize: 14,
                margin: '8px 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: 20,
                background: loading || !code.trim()
                  ? '#94A3B8'
                  : 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading || !code.trim()
                  ? 'none'
                  : '0 4px 14px rgba(30,58,138,0.3)',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{
                    width: 18, height: 18,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  {t.loading}
                </span>
              ) : (
                t.submitButton
              )}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            fontSize: 13,
            color: '#94A3B8',
            margin: '20px 0 0',
          }}>
            {t.directLinkHint}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '24px',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
      }}>
        <p style={{ margin: '0 0 4px' }}>{t.poweredBy}</p>
        <p style={{ margin: 0 }}>{t.disclaimer}</p>
      </div>

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
