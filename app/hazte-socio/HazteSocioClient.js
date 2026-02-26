'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const BLUE = '#1E3A8A';
const BLUE2 = '#1D4ED8';
const GREEN = '#15803D';
const GRAY = '#6B7280';

const PACKAGES = [
  {
    key: 'start',
    name: 'Partner Start',
    price: 499,
    commission: '20%',
    color: '#3B82F6',
    features: ['Acceso al portal de socio', 'Todos los tipos de documentos', '20% comisión por venta', 'Soporte por email'],
  },
  {
    key: 'pro',
    name: 'Partner Pro',
    price: 999,
    commission: '25%',
    color: '#8B5CF6',
    badge: '⭐ Más Popular',
    features: ['Todo lo del Plan Start', '25% comisión por venta', 'Soporte prioritario', 'Materiales con su marca'],
  },
  {
    key: 'elite',
    name: 'Partner Elite',
    price: 2500,
    commission: '30%',
    color: '#D97706',
    badge: '👑 Premium',
    features: ['Todo lo del Plan Pro', '30% comisión por venta', 'Gerente de cuenta dedicado', 'Co-branding personalizado', 'Apoyo de marketing'],
  },
];

function HazteSocioContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || '';

  const [step, setStep] = useState(1); // 1=landing, 2=form, 3=success
  const formRef = useRef(null);
  const [selectedPkg, setSelectedPkg] = useState('pro');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    partner_type: 'tax_preparer',
  });

  // Track page visit
  useEffect(() => {
    if (ref) {
      fetch('/api/leads/hazte-socio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'visit', ref }),
      }).catch(() => {});
    }
  }, [ref]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.business_name || !form.contact_name || !form.email || !form.phone) {
      setError('Por favor llene todos los campos.');
      return;
    }
    setProcessing(true);
    setError('');
    try {
      const res = await fetch('/api/leads/hazte-socio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply', ref, package_key: selectedPkg, ...form }),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else if (data.success) {
        setStep(3);
      } else {
        setError(data.error || 'Error al procesar. Llámenos al 855.246.7274');
      }
    } catch {
      setError('Error de conexión. Llámenos al 855.246.7274');
    }
    setProcessing(false);
  }

  const pkg = PACKAGES.find(p => p.key === selectedPkg);

  if (step === 3) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFF', padding: '40px 16px' }}>
        <div style={{ maxWidth: '480px', width: '100%', backgroundColor: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: GREEN, marginBottom: '12px' }}>¡Solicitud Recibida!</h1>
          <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6', marginBottom: '24px' }}>
            Le contactaremos en menos de 24 horas para completar su registro y darle acceso a su portal de socio.
          </p>
          <p style={{ fontSize: '18px', fontWeight: '800', color: BLUE }}>📞 855.246.7274</p>
          <Link href="/" style={{ display: 'inline-block', marginTop: '24px', color: BLUE, fontSize: '14px' }}>← Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#1F2937' }}>

      {/* HERO */}
      <section style={{ background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE2} 100%)`, color: 'white', padding: '64px 16px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '600', marginBottom: '20px' }}>
            🤝 Red de Socios — Multi Servicios 360
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', lineHeight: '1.2', marginBottom: '20px' }}>
            Gane dinero extra ayudando a su comunidad
          </h1>
          <p style={{ fontSize: '18px', opacity: '0.9', lineHeight: '1.6', marginBottom: '32px' }}>
            Sus clientes necesitan documentos legales. Usted ya tiene su confianza. Nosotros ponemos la plataforma — usted cobra la comisión.
          </p>

          {/* Social proof */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '16px 20px', marginBottom: '32px', textAlign: 'left' }}>
            <p style={{ margin: '0', fontSize: '15px', fontStyle: 'italic', lineHeight: '1.6' }}>
              "Everardo Miramontes, preparador de impuestos con más de 20 años en la comunidad, ya es socio de Multi Servicios 360 y está generando ingresos adicionales para su oficina."
            </p>
          </div>

          <button
            onClick={() => { setStep(2); setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
            style={{ backgroundColor: 'white', color: BLUE, padding: '16px 40px', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: '800', cursor: 'pointer' }}
          >
            Quiero ser socio →
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '64px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', color: BLUE, marginBottom: '48px' }}>
            ¿Cómo funciona?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
            {[
              { icon: '👥', title: 'Su cliente necesita un documento', desc: 'Poder notarial, fideicomiso, LLC — usted lo refiere a la plataforma.' },
              { icon: '💻', title: 'Completan el proceso en línea', desc: 'En español, paso a paso, desde cualquier dispositivo.' },
              { icon: '💰', title: 'Usted recibe su comisión', desc: 'Entre 20% y 30% de cada transacción, directo a su cuenta.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: BLUE, marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: GRAY, lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EARNINGS EXAMPLE */}
      <section style={{ padding: '64px 16px', backgroundColor: '#F0F4FF' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '800', color: BLUE, marginBottom: '12px' }}>
            ¿Cuánto puede ganar?
          </h2>
          <p style={{ color: GRAY, marginBottom: '32px' }}>Un preparador de impuestos típico ve 200+ clientes por temporada</p>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            {[
              { docs: '5 fideicomisos/mes', price: '$999 c/u', commission: '25%', monthly: '$1,248', yearly: '$14,975' },
              { docs: '10 poderes notariales/mes', price: '$299 c/u', commission: '25%', monthly: '$748', yearly: '$8,975' },
              { docs: '2 LLCs/mes', price: '$799 c/u', commission: '25%', monthly: '$399', yearly: '$4,788' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? '1px solid #E5E7EB' : 'none', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>{row.docs}</div>
                  <div style={{ fontSize: '12px', color: GRAY }}>{row.price} × {row.commission}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: GREEN }}>{row.monthly}/mes</div>
                  <div style={{ fontSize: '12px', color: GRAY }}>{row.yearly}/año</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '2px solid #86EFAC' }}>
              <div style={{ fontSize: '14px', color: GRAY }}>Ingreso adicional potencial</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: GREEN }}>$28,738/año</div>
              <div style={{ fontSize: '12px', color: GRAY }}>Solo con los ejemplos anteriores</div>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section style={{ padding: '64px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '800', color: BLUE, textAlign: 'center', marginBottom: '12px' }}>
            Elija su plan
          </h2>
          <p style={{ textAlign: 'center', color: GRAY, marginBottom: '40px' }}>Pago único de registro — sin mensualidades</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {PACKAGES.map(p => (
              <div
                key={p.key}
                onClick={() => { setSelectedPkg(p.key); setStep(2); setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
                style={{ border: `2px solid ${p.color}`, borderRadius: '16px', padding: '28px', cursor: 'pointer', position: 'relative', backgroundColor: 'white', transition: 'transform 0.1s', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              >
                {p.badge && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: p.color, color: 'white', borderRadius: '12px', padding: '4px 14px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                    {p.badge}
                  </div>
                )}
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: p.color, marginBottom: '4px' }}>{p.name}</h3>
                <div style={{ fontSize: '36px', fontWeight: '900', color: '#1F2937', marginBottom: '4px' }}>${p.price}</div>
                <div style={{ fontSize: '13px', color: GRAY, marginBottom: '20px' }}>registro único</div>
                <div style={{ backgroundColor: p.color + '15', borderRadius: '8px', padding: '8px 12px', marginBottom: '20px', textAlign: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: p.color }}>{p.commission}</span>
                  <span style={{ fontSize: '13px', color: p.color, fontWeight: '600' }}> comisión por venta</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {p.features.map((f, i) => (
                    <li key={i} style={{ fontSize: '13px', color: '#374151', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: GREEN, fontWeight: '700', flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button style={{ width: '100%', padding: '12px', backgroundColor: p.color, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
                  Seleccionar →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      {step === 2 && (
        <section id="formulario" ref={formRef} style={{ padding: '64px 16px', backgroundColor: '#F8FAFF' }}>
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: BLUE, textAlign: 'center', marginBottom: '8px' }}>Complete su solicitud</h2>
            <p style={{ textAlign: 'center', color: GRAY, marginBottom: '32px' }}>Plan seleccionado: <strong style={{ color: pkg.color }}>{pkg.name} — ${pkg.price} ({pkg.commission} comisión)</strong></p>

            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              {[
                { key: 'business_name', label: 'Nombre del negocio *', placeholder: 'Garcia Tax Service' },
                { key: 'contact_name', label: 'Nombre del contacto *', placeholder: 'María García' },
                { key: 'email', label: 'Email *', placeholder: 'maria@email.com', type: 'email' },
                { key: 'phone', label: 'Teléfono *', placeholder: '(323) 555-0000', type: 'tel' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Tipo de negocio</label>
                <select
                  value={form.partner_type}
                  onChange={e => setForm({ ...form, partner_type: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }}
                >
                  <option value="tax_preparer">Preparador de Impuestos</option>
                  <option value="notary">Notario Público</option>
                  <option value="insurance">Agente de Seguros</option>
                  <option value="real_estate">Agente de Bienes Raíces</option>
                  <option value="immigration">Consultor de Inmigración</option>
                  <option value="accounting">Contador</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              {/* Package selector */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>Plan seleccionado</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {PACKAGES.map(p => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setSelectedPkg(p.key)}
                      style={{ flex: 1, minWidth: '100px', padding: '10px 8px', border: `2px solid ${selectedPkg === p.key ? p.color : '#E5E7EB'}`, borderRadius: '8px', backgroundColor: selectedPkg === p.key ? p.color + '15' : 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: selectedPkg === p.key ? p.color : GRAY }}
                    >
                      {p.name}<br/>${p.price}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p style={{ color: '#DC2626', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

              <button
                type="submit"
                disabled={processing}
                style={{ width: '100%', padding: '16px', backgroundColor: processing ? '#9CA3AF' : BLUE, color: 'white', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: '800', cursor: processing ? 'not-allowed' : 'pointer' }}
              >
                {processing ? 'Procesando...' : `Registrarme como Socio — $${pkg.price} →`}
              </button>
              <p style={{ textAlign: 'center', fontSize: '12px', color: GRAY, marginTop: '12px' }}>
                Pago seguro vía Stripe. Sin mensualidades.
              </p>
            </form>
          </div>
        </section>
      )}

      {step === 1 && (
        <section style={{ padding: '48px 16px', backgroundColor: BLUE, textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>¿Listo para unirse?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '24px' }}>Everardo ya está generando ingresos. Usted también puede.</p>
          <button
            onClick={() => { setStep(2); setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
            style={{ backgroundColor: 'white', color: BLUE, padding: '16px 40px', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: '800', cursor: 'pointer' }}
          >
            Quiero ser socio →
          </button>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '16px', fontSize: '14px' }}>
            📞 855.246.7274 &nbsp;|&nbsp; info@multiservicios360.net
          </p>
        </section>
      )}
    </div>
  );
}

export default function HazteSocioClient() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>}>
      <HazteSocioContent />
    </Suspense>
  );
}
