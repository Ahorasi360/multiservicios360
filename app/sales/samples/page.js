// app/sales/samples/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DOCS = [
  {
    id: 'poa',
    title: 'General Power of Attorney',
    subtitle: 'Poder Notarial General',
    color: '#1E3A8A',
    bg: '#EFF6FF',
    icon: '⚖️',
    price: '$149',
    pages: 4,
    preview: [
      { label: 'Principal Name', value: '_________________ (Principal)' },
      { label: 'Agent/Attorney', value: '_________________ (Agent)' },
      { label: 'Powers Granted', value: 'Real estate, banking, financial transactions, tax matters...' },
      { label: 'Effective Date', value: 'Immediately upon signing' },
      { label: 'Durability', value: '☑ Durable — remains valid if principal becomes incapacitated' },
      { label: 'Witnesses Required', value: '2 witnesses + Notary Public' },
    ],
    highlights: ['California compliant', 'Durable option', 'Bilingual (ES/EN)', 'Same-day delivery'],
  },
  {
    id: 'limited_poa',
    title: 'Limited Power of Attorney',
    subtitle: 'Poder Notarial Limitado',
    color: '#7C3AED',
    bg: '#F5F3FF',
    icon: '📋',
    price: '$99',
    pages: 2,
    preview: [
      { label: 'Principal', value: '_________________ (Principal)' },
      { label: 'Agent', value: '_________________ (Agent)' },
      { label: 'Specific Purpose', value: 'Sell vehicle / Sign documents / Represent at...' },
      { label: 'Expiration', value: 'Specific date or completion of task' },
      { label: 'Limitations', value: 'Agent may NOT act beyond the stated purpose' },
    ],
    highlights: ['Specific purpose only', 'Expires automatically', 'Ideal for vehicle sales', 'Fast & affordable'],
  },
  {
    id: 'trust',
    title: 'California Living Trust',
    subtitle: 'Fideicomiso Revocable en Vida',
    color: '#059669',
    bg: '#ECFDF5',
    icon: '🏠',
    price: '$599',
    pages: 18,
    preview: [
      { label: 'Trustmaker (Grantor)', value: '_________________ (Grantor)' },
      { label: 'Successor Trustee', value: '_________________' },
      { label: 'Beneficiaries', value: 'Spouse, children, or named individuals' },
      { label: 'Assets Covered', value: 'Real estate, bank accounts, investments, personal property' },
      { label: 'Avoids Probate', value: '✅ Yes — assets pass directly to beneficiaries' },
      { label: 'Revocable', value: '✅ Can be modified or revoked at any time' },
    ],
    highlights: ['Avoids probate', 'Protects your family', 'Revocable anytime', 'Includes pour-over will'],
  },
  {
    id: 'llc',
    title: 'LLC Formation',
    subtitle: 'Formación de LLC',
    color: '#D97706',
    bg: '#FFFBEB',
    icon: '🏢',
    price: '$299+',
    pages: 12,
    preview: [
      { label: 'LLC Name', value: '_________________, LLC' },
      { label: 'Registered Agent', value: '_________________' },
      { label: 'Members', value: '_________________ (Member, __%)' },
      { label: 'Management', value: '☑ Member-managed' },
      { label: 'State Filing', value: 'California Secretary of State' },
      { label: 'Documents Included', value: 'Articles of Organization + Operating Agreement + EIN' },
    ],
    highlights: ['Articles of Organization', 'Operating Agreement', 'EIN Application', 'CA SOS filing'],
  },
  {
    id: 'bill_of_sale',
    title: 'Bill of Sale',
    subtitle: 'Carta de Venta',
    color: '#2563EB',
    bg: '#EFF6FF',
    icon: '🚗',
    price: '$49',
    pages: 1,
    preview: [
      { label: 'Seller', value: '_________________' },
      { label: 'Buyer', value: '_________________' },
      { label: 'Item Description', value: 'Vehicle / Property / Equipment...' },
      { label: 'Sale Price', value: '$___________' },
      { label: 'Condition', value: '☑ As-Is  ☐ With Warranty' },
    ],
    highlights: ['Vehicle & property sales', 'Legally binding', 'Bilingual', 'Instant download'],
  },
  {
    id: 'travel_authorization',
    title: 'Travel Authorization Letter',
    subtitle: 'Carta de Autorización de Viaje',
    color: '#0284C7',
    bg: '#F0F9FF',
    icon: '✈️',
    price: '$49',
    pages: 1,
    preview: [
      { label: 'Parent/Guardian', value: '_________________' },
      { label: 'Minor Child', value: '_________________, DOB: __/__/____' },
      { label: 'Authorized Adult', value: '_________________' },
      { label: 'Destination', value: '_________________, Travel dates: __ to __' },
      { label: 'Airline', value: '_________________' },
      { label: 'Emergency Contact', value: 'Phone: _________________' },
    ],
    highlights: ['Airline compliant', 'Notary-ready', 'Bilingual', 'Required for unaccompanied minors'],
  },
  {
    id: 'affidavit',
    title: 'Affidavit',
    subtitle: 'Declaración Jurada',
    color: '#7C3AED',
    bg: '#F5F3FF',
    icon: '📜',
    price: '$49',
    pages: 1,
    preview: [
      { label: 'Affiant (Declarant)', value: '_________________' },
      { label: 'Statement of Truth', value: 'I, _________, being duly sworn, do hereby declare...' },
      { label: 'Facts Declared', value: '[Custom statements per client situation]' },
      { label: 'Sworn Before', value: 'Notary Public, State of California' },
      { label: 'Penalty', value: 'Subject to perjury laws' },
    ],
    highlights: ['Sworn statement', 'Notarized', 'Court-accepted format', 'Custom facts'],
  },
  {
    id: 'guardianship',
    title: 'Guardianship Designation',
    subtitle: 'Designación de Guardián',
    color: '#BE185D',
    bg: '#FDF2F8',
    icon: '👨‍👧',
    price: '$99',
    pages: 2,
    preview: [
      { label: 'Parent/Designating Party', value: '_________________' },
      { label: 'Designated Guardian', value: '_________________' },
      { label: 'Minor Children', value: '_________________ (DOB __)' },
      { label: 'Effective When', value: 'Parent incapacitated, deceased, or unavailable' },
      { label: 'Duration', value: 'Until revoked or court orders otherwise' },
    ],
    highlights: ['Protects your children', 'Court-recognized', 'Bilingual', 'Notary-ready'],
  },
];

const T = {
  es: {
    brand: 'Documentos de Muestra', brandSub: 'Vista Previa de Ventas — Copias Protegidas',
    back: '← Panel',
    search: 'Buscar documentos...', pages: 'página', clickPreview: 'Clic para ver vista previa →',
    previewTitle: 'Vista Previa del Documento', watermark: '⚠️ Documento de Muestra — Solo para demostración',
    close: '✕ Cerrar', fieldLabels: { 'Principal Name':'Nombre del Titular', 'Agent/Attorney':'Agente/Apoderado', 'Powers Granted':'Poderes Otorgados', 'Principal':'Principal', 'Agent':'Agente', 'Specific Purpose':'Propósito Específico', 'Trustmaker (Grantor)':'Otorgante (Fideicomitente)', 'Successor Trustee':'Fideicomisario Sucesor', 'Beneficiaries':'Beneficiarios', 'LLC Name':'Nombre de la LLC', 'Registered Agent':'Agente Registrado', 'Members':'Miembros', 'Seller':'Vendedor', 'Buyer':'Comprador', 'Item Description':'Descripción del Artículo', 'Parent/Guardian':'Padre/Tutor', 'Minor Child':'Menor de Edad', 'Authorized Adult':'Adulto Autorizado', 'Affiant (Declarant)':'Declarante', 'Statement of Truth':'Declaración de Verdad', 'Facts Declared':'Hechos Declarados', 'Parent/Designating Party':'Padre/Parte Designante', 'Designated Guardian':'Guardián Designado', 'Minor Children':'Menores de Edad' },
  },
  en: {
    brand: 'Sample Documents', brandSub: 'Sales Preview — Protected Copies',
    back: '← Dashboard',
    search: 'Search documents...', pages: 'page', clickPreview: 'Click to see full preview →',
    previewTitle: 'Document Preview', watermark: '⚠️ Sample Document — For demonstration only',
    close: '✕ Close', fieldLabels: {},
  }
};

export default function SalesSamplesPage() {
  const router = useRouter();
  const [lang, setLang] = useState('es');
  const t = T[lang];
  const [repId, setRepId] = useState('');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const savedLang = localStorage.getItem('sales_lang') || 'es'; setLang(savedLang);
    const id = localStorage.getItem('salesId');
    if (!id) { router.push('/sales/login'); return; }
    setRepId(id);
  }, []);

  const filtered = DOCS.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.subtitle.toLowerCase().includes(search.toLowerCase())
  );


  function toggleLang() { const nl=lang==='es'?'en':'es'; setLang(nl); localStorage.setItem('sales_lang',nl); }
  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', fontFamily:'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background:'#1E3A8A', padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:38, height:38, background:'rgba(255,255,255,0.2)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>📄</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:'#fff' }}>Sample Documents</div>
            <div style={{ fontSize:11, color:'#93C5FD' }}>Sales Preview — Protected Copies</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => router.push('/sales/dashboard')}
            style={{ padding:'8px 14px', background:'rgba(255,255,255,0.15)', color:'#fff', border:'none', borderRadius:8, fontSize:13, cursor:'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 20px' }}>
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0F172A', marginBottom:8 }}>Document Samples</h1>
          <p style={{ color:'#64748B', fontSize:14, marginBottom:16 }}>
            Show clients what their finished documents will look like. These are partial previews — the full document is delivered after purchase.
          </p>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search documents..."
            style={{ width:'100%', maxWidth:380, padding:'10px 16px', fontSize:14, border:'2px solid #E2E8F0', borderRadius:10, outline:'none' }} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
          {filtered.map(doc => (
            <div key={doc.id} onClick={() => setSelected(doc)}
              style={{ background:'#fff', borderRadius:14, border:`2px solid ${doc.color}20`, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', cursor:'pointer', overflow:'hidden', transition:'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.06)'; }}>
              
              {/* Card header */}
              <div style={{ background:doc.bg, padding:'18px 20px', borderBottom:`1px solid ${doc.color}15` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontSize:28, marginBottom:6 }}>{doc.icon}</div>
                    <div style={{ fontWeight:700, fontSize:15, color:'#0F172A' }}>{doc.title}</div>
                    <div style={{ fontSize:12, color:'#64748B' }}>{doc.subtitle}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:18, fontWeight:800, color:doc.color }}>{doc.price}</div>
                    <div style={{ fontSize:11, color:'#94A3B8' }}>{doc.pages} page{doc.pages > 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>

              {/* Preview snippet */}
              <div style={{ padding:'16px 20px' }}>
                <div style={{ fontSize:11, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>Preview</div>
                {doc.preview.slice(0, 3).map((f, i) => (
                  <div key={i} style={{ fontSize:12, color:'#475569', marginBottom:4, display:'flex', gap:6 }}>
                    <span style={{ color:'#94A3B8', minWidth:80 }}>{f.label}:</span>
                    <span style={{ color:'#CBD5E1', fontStyle:'italic' }}>{f.value.length > 40 ? f.value.slice(0, 40) + '...' : f.value}</span>
                  </div>
                ))}
                <div style={{ marginTop:10, textAlign:'center', color:doc.color, fontSize:12, fontWeight:600 }}>
                  Click to see full preview →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Preview Modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div style={{ background:'#fff', borderRadius:16, maxWidth:720, width:'100%', maxHeight:'92vh', overflowY:'auto', boxShadow:'0 24px 60px rgba(0,0,0,0.25)' }}>
            
            {/* Modal header */}
            <div style={{ background:selected.bg, padding:'24px 28px', borderBottom:`2px solid ${selected.color}20`, position:'sticky', top:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:32, marginBottom:4 }}>{selected.icon}</div>
                  <h2 style={{ fontSize:20, fontWeight:800, color:'#0F172A', margin:0 }}>{selected.title}</h2>
                  <p style={{ fontSize:13, color:'#64748B', margin:'2px 0 0' }}>{selected.subtitle}</p>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
                  <button onClick={() => setSelected(null)}
                    style={{ background:'rgba(0,0,0,0.1)', border:'none', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:16, color:'#475569' }}>✕</button>
                  <div style={{ fontSize:24, fontWeight:900, color:selected.color }}>{selected.price}</div>
                  <div style={{ fontSize:12, color:'#94A3B8' }}>{selected.pages} pages</div>
                </div>
              </div>
            </div>

            <div style={{ padding:'28px' }}>
              {/* SAMPLE WATERMARK DOCUMENT */}
              <div style={{ position:'relative', background:'#FAFAFA', border:'2px dashed #CBD5E1', borderRadius:12, padding:'28px 32px', marginBottom:24, overflow:'hidden' }}>
                {/* Watermark diagonal text */}
                <div style={{
                  position:'absolute', top:'50%', left:'50%',
                  transform:'translate(-50%, -50%) rotate(-30deg)',
                  fontSize:72, fontWeight:900, color:'rgba(239,68,68,0.07)',
                  letterSpacing:8, whiteSpace:'nowrap', pointerEvents:'none', userSelect:'none',
                  zIndex:1
                }}>SAMPLE</div>

                <div style={{ position:'relative', zIndex:2 }}>
                  {/* Doc header */}
                  <div style={{ textAlign:'center', borderBottom:'2px solid #E2E8F0', paddingBottom:16, marginBottom:20 }}>
                    <div style={{ fontSize:11, color:'#94A3B8', letterSpacing:'0.1em', textTransform:'uppercase' }}>State of California</div>
                    <div style={{ fontSize:18, fontWeight:800, color:'#0F172A', marginTop:4 }}>{selected.title.toUpperCase()}</div>
                    <div style={{ fontSize:12, color:'#64748B', marginTop:2 }}>{selected.subtitle}</div>
                    <div style={{ display:'inline-block', background:'#FEF2F2', border:'1px solid #FECACA', color:'#DC2626', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:6, marginTop:10, letterSpacing:'0.05em' }}>
                      ⚠️ SAMPLE — NOT VALID FOR LEGAL USE
                    </div>
                  </div>

                  {/* Fields */}
                  {selected.preview.map((field, i) => (
                    <div key={i} style={{ marginBottom:12, paddingBottom:12, borderBottom:i < selected.preview.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <div style={{ fontSize:11, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:3 }}>{field.label}</div>
                      <div style={{ fontSize:13, color:'#475569', fontFamily:'Georgia, serif' }}>{field.value}</div>
                    </div>
                  ))}

                  {/* Blurred section */}
                  <div style={{ marginTop:20, position:'relative' }}>
                    <div style={{ filter:'blur(5px)', userSelect:'none', pointerEvents:'none' }}>
                      <div style={{ fontSize:12, color:'#475569', fontFamily:'Georgia, serif', lineHeight:1.8 }}>
                        IN WITNESS WHEREOF, I have hereunto set my hand this _____ day of _____________, 20____.<br/><br/>
                        _____________________________ &nbsp;&nbsp;&nbsp; _____________________________<br/>
                        Principal Signature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date<br/><br/>
                        NOTARY PUBLIC ACKNOWLEDGMENT<br/>
                        State of California<br/>
                        County of _____________________<br/><br/>
                        On this day personally appeared before me _________________________, known to me to be the person whose name is subscribed to the foregoing instrument...
                      </div>
                    </div>
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.4)' }}>
                      <div style={{ background:'#0F172A', color:'#fff', padding:'10px 20px', borderRadius:8, fontSize:13, fontWeight:700, textAlign:'center' }}>
                        🔒 Signature & Notary Section — Full document delivered after purchase
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#0F172A', marginBottom:10 }}>What's Included</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {selected.highlights.map((h, i) => (
                    <span key={i} style={{ background:selected.bg, color:selected.color, border:`1px solid ${selected.color}30`, padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:600 }}>
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing CTA */}
              <div style={{ background:'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius:12, padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ color:'#94A3B8', fontSize:12 }}>Partner price for client</div>
                  <div style={{ color:'#fff', fontSize:22, fontWeight:800 }}>{selected.price}</div>
                  <div style={{ color:'#94A3B8', fontSize:11 }}>Your commission: 20–25% = {
                    selected.price === '$49' ? '$9.80–$12.25' :
                    selected.price === '$99' ? '$19.80–$24.75' :
                    selected.price === '$149' ? '$29.80–$37.25' :
                    selected.price === '$299+' ? '$59.80+' :
                    selected.price === '$599' ? '$119.80–$149.75' : 'varies'
                  }</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <button onClick={() => { setSelected(null); router.push('/sales/register-office'); }}
                    style={{ background:'linear-gradient(135deg,#2563EB,#1D4ED8)', color:'#fff', border:'none', padding:'12px 20px', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', display:'block', marginBottom:8 }}>
                    Register an Office →
                  </button>
                  <button onClick={() => setSelected(null)}
                    style={{ background:'transparent', color:'#94A3B8', border:'1px solid #334155', padding:'8px 20px', borderRadius:10, fontSize:12, cursor:'pointer', width:'100%' }}>
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
