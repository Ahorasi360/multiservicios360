"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function ProtegeClient() {
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.telefono) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/leads/protege-tu-casa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* STICKY NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '12px 16px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '11px' }}>M360</div>
            <span style={{ fontWeight: '700', fontSize: '15px', color: '#1E3A8A' }}>Multi Servicios 360</span>
          </Link>
          <a href="tel:8552467274" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#1E3A8A', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px' }}>
            📞 855.246.7274
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #1D4ED8 100%)', color: 'white', padding: '60px 16px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />

        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(252,211,77,0.2)', border: '1px solid rgba(252,211,77,0.4)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', fontWeight: '600', color: '#FCD34D', marginBottom: '24px', letterSpacing: '0.5px' }}>
            🏠 PARA PROPIETARIOS EN CALIFORNIA
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', lineHeight: '1.15', marginBottom: '20px' }}>
            Su casa le costó años de trabajo.<br />
            <span style={{ color: '#FCD34D' }}>No deje que Probate se la quite a su familia.</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', lineHeight: '1.65', color: 'rgba(255,255,255,0.88)', marginBottom: '36px', maxWidth: '620px', margin: '0 auto 36px' }}>
            Sin un Fideicomiso en Vida (Living Trust), cuando usted fallezca su casa <strong>no pasa directo a su familia</strong>. 
            La corte toma el control. El proceso puede tardar <strong>1 a 2 años</strong> y costarle a los suyos entre <strong>$15,000 y $30,000</strong>.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/trust" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', backgroundColor: '#FCD34D', color: '#1E3A8A', textDecoration: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '16px', boxShadow: '0 4px 20px rgba(252,211,77,0.4)' }}>
              🛡️ Proteger Mi Casa Ahora
            </Link>
            <a href="tel:8552467274" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 28px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '15px', border: '1px solid rgba(255,255,255,0.25)' }}>
              📞 Llamar Gratis
            </a>
          </div>
          <p style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>Desde $599 · En español e inglés · Sin abogado</p>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section style={{ padding: '64px 16px', backgroundColor: '#FFF8F0' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>
              ¿Qué pasa si usted muere sin Living Trust?
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280', maxWidth: '540px', margin: '0 auto' }}>
              Esto es lo que le espera a su familia — y le pasa a miles de familias latinas en California cada año.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { icon: '⏳', title: '1 a 2 años esperando', desc: 'Nadie puede vender, rentar ni hacer nada con la propiedad mientras la corte decide.' },
              { icon: '💸', title: '$15,000 – $30,000', desc: 'En honorarios de abogados, costos de la corte y fees de administración del Probate.' },
              { icon: '😰', title: 'Estrés y conflictos', desc: 'Los herederos quedan en incertidumbre y a veces pelean entre ellos sin poder avanzar.' },
              { icon: '🏛️', title: 'La corte decide', desc: 'Un juez que no conoce a su familia decide quién recibe qué — aunque usted lo haya decidido diferente.' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #FEE2E2', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#DC2626', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ fontSize: '13.5px', color: '#6B7280', lineHeight: '1.55' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section style={{ padding: '64px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>
              La solución: un Fideicomiso en Vida
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280', maxWidth: '560px', margin: '0 auto' }}>
              Con un Living Trust correctamente preparado, su casa pasa directamente a su familia — sin corte, sin esperar, sin gastar miles de dólares.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {[
              { icon: '✅', title: 'Sin Probate', desc: 'Su familia recibe la propiedad directamente, sin necesidad de ir a la corte.' },
              { icon: '⚡', title: 'Proceso rápido', desc: 'En lugar de 1-2 años, la transferencia puede completarse en semanas.' },
              { icon: '💰', title: 'Ahorra miles', desc: 'Evita $15,000-$30,000 en costos de Probate. El trust paga solo una vez.' },
              { icon: '📋', title: 'Usted decide', desc: 'Usted elige quién hereda qué, con sus propias condiciones y deseos.' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: '#F0FDF4', borderRadius: '12px', padding: '24px', border: '1px solid #BBF7D0', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#15803D', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ fontSize: '13.5px', color: '#6B7280', lineHeight: '1.55' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '64px 16px', backgroundColor: '#F8FAFF' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>
              ¿Cómo funciona el proceso?
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280' }}>Simple, en español, sin necesidad de ir a una oficina de abogados.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { num: '1', title: 'Llene el formulario en línea', desc: 'Nuestro sistema le guía paso a paso en español. Solo contesta preguntas sencillas sobre su familia y su propiedad. Tarda 20-30 minutos.', time: '20-30 min' },
              { num: '2', title: 'Recibe su documento', desc: 'Preparamos su Fideicomiso en Vida en español e inglés. Lo revisa y nos confirma que todo está correcto.', time: '1-2 días' },
              { num: '3', title: 'Firma ante notario', desc: 'Firma el documento ante un notario público. Puede usar su propio notario ($15/firma) o solicitar servicio a domicilio.', time: '1 día' },
              { num: '4', title: 'Trust Deed y registro', desc: 'Preparamos la escritura que transfiere su casa al fideicomiso y la registramos en el condado. Su casa queda oficialmente protegida.', time: '1-2 semanas' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', backgroundColor: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#1E3A8A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>{step.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#111827' }}>{step.title}</div>
                    <div style={{ fontSize: '12px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '3px 10px', borderRadius: '12px', fontWeight: '600' }}>{step.time}</div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '64px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>
              Precios claros y transparentes
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280' }}>Sin sorpresas. El precio depende de su situación familiar.</p>
          </div>

          <div style={{ backgroundColor: '#F8FAFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #DBEAFE', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#1E3A8A', padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr auto', color: 'white', fontWeight: '700', fontSize: '14px' }}>
              <span>Servicio</span><span>Precio</span>
            </div>
            {[
              { service: 'Fideicomiso individual (1 persona, 1 heredero)', price: '$599', highlight: false },
              { service: 'Fideicomiso matrimonio (2 personas)', price: '$999', highlight: false },
              { service: 'Cada heredero adicional', price: '+ $200', highlight: false },
              { service: 'Trust Deed + registro en el condado (por propiedad)', price: '$500', highlight: false },
              { service: 'Notarización en oficina (por firma)', price: '$15', highlight: false },
              { service: 'Notario a domicilio', price: '$150 + $15/firma', highlight: false },
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '14px 24px', borderBottom: '1px solid #E5E7EB', backgroundColor: i % 2 === 0 ? 'white' : '#F8FAFF', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>{row.service}</span>
                <span style={{ fontWeight: '700', fontSize: '15px', color: '#1E3A8A', whiteSpace: 'nowrap' }}>{row.price}</span>
              </div>
            ))}
          </div>

          {/* Comparison box */}
          <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', borderRadius: '12px', padding: '24px', textAlign: 'center', border: '2px solid #F59E0B' }}>
            <div style={{ fontSize: '14px', color: '#92400E', marginBottom: '8px', fontWeight: '600' }}>COMPARE</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#92400E' }}>Living Trust completo</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#15803D' }}>~$1,500</div>
              </div>
              <div style={{ fontSize: '28px', color: '#92400E' }}>VS</div>
              <div>
                <div style={{ fontSize: '13px', color: '#92400E' }}>Probate sin trust</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#DC2626' }}>$15,000–$30,000</div>
                <div style={{ fontSize: '11px', color: '#92400E' }}>+ 1 a 2 años esperando</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section style={{ padding: '48px 16px', backgroundColor: '#F8FAFF' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>💬</div>
          <blockquote style={{ fontSize: '17px', fontStyle: 'italic', color: '#374151', lineHeight: '1.7', marginBottom: '16px' }}>
            "Yo pensé que eso era solo para gente rica. Pero cuando mi vecino murió sin trust, su familia tardó casi dos años para poder vender la casa. Eso me hizo pensar y lo hice de inmediato."
          </blockquote>
          <div style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '600' }}>— Cliente de Multi Servicios 360, Los Ángeles, CA</div>
        </div>
      </section>

      {/* LEAD CAPTURE FORM */}
      <section style={{ padding: '64px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>
              ¿Tiene preguntas? Le llamamos gratis
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280' }}>
              Déjenos sus datos y un especialista le contacta en menos de 24 horas — sin compromiso.
            </p>
          </div>

          {status === 'success' ? (
            <div style={{ backgroundColor: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#15803D', marginBottom: '8px' }}>¡Recibimos su solicitud!</h3>
              <p style={{ fontSize: '15px', color: '#374151' }}>Le llamaremos a la brevedad. Si prefiere llamar ahora: <strong>855.246.7274</strong></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#F8FAFF', borderRadius: '16px', padding: '32px', border: '1px solid #DBEAFE' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  placeholder="María García"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Teléfono *
                </label>
                <input
                  type="tel"
                  placeholder="(213) 555-0000"
                  value={form.telefono}
                  onChange={e => setForm({ ...form, telefono: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Email <span style={{ fontWeight: '400', color: '#9CA3AF' }}>(opcional)</span>
                </label>
                <input
                  type="email"
                  placeholder="maria@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{ width: '100%', padding: '16px', backgroundColor: status === 'loading' ? '#93C5FD' : '#1E3A8A', color: 'white', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: '800', cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
              >
                {status === 'loading' ? 'Enviando...' : '📞 Quiero mi consulta gratuita'}
              </button>
              {status === 'error' && (
                <p style={{ marginTop: '12px', fontSize: '13px', color: '#DC2626', textAlign: 'center' }}>
                  Hubo un error. Por favor llame directamente al 855.246.7274
                </p>
              )}
              <p style={{ marginTop: '12px', fontSize: '12px', color: '#9CA3AF', textAlign: 'center' }}>
                Su información es privada y nunca se comparte con terceros.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '64px 16px', background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', marginBottom: '16px' }}>
            No espere más para proteger lo que tanto le costó
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginBottom: '36px', lineHeight: '1.65' }}>
            El proceso toma solo 20-30 minutos en línea. Nosotros hacemos el resto. Su familia se lo agradecerá.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
            <Link href="/trust" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '18px 36px', backgroundColor: '#FCD34D', color: '#1E3A8A', textDecoration: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '17px', boxShadow: '0 4px 20px rgba(252,211,77,0.4)' }}>
              🛡️ Comenzar Mi Fideicomiso
            </Link>
            <a href="tel:8552467274" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '18px 28px', backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '16px', border: '1px solid rgba(255,255,255,0.3)' }}>
              📞 855.246.7274
            </a>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
            Multi Servicios 360 prepara documentos de autoayuda. No somos abogados. Desde $599.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#111827', color: '#9CA3AF', padding: '24px 16px', textAlign: 'center', fontSize: '12px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Multi Servicios 360</Link>
          {' · '}
          <a href="tel:8552467274" style={{ color: '#9CA3AF', textDecoration: 'none' }}>855.246.7274</a>
          {' · '}
          <a href="mailto:info@multiservicios360.net" style={{ color: '#9CA3AF', textDecoration: 'none' }}>info@multiservicios360.net</a>
          <br /><br />
          Multi Servicios 360 proporciona herramientas de preparación de documentos de autoayuda. No somos un bufete de abogados y no proporcionamos asesoría legal. Para situaciones legales complejas consulte con un abogado licenciado en California.
        </div>
      </footer>

    </div>
  );
}
