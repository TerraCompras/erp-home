import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const ADMIN_EMAIL = "federico.ruiz@terra-mare.com.ar";

const EMPRESAS = [
  {
    id: "parana",
    nombre: "Parana Logística",
    descripcion: "Operaciones logísticas y marítimas. Gestión de flota, compras, víveres, mantenimiento y reparaciones.",
    icono: "🚢",
    logo: "/PL.png",
    color: "#213363",
    url: "https://erp-portal-fawn.vercel.app",
    activo: true,
    modulos: ["compras", "viveres", "projects", "mantenimiento", "reparaciones", "certificados", "documentos", "tripulaciones"],
    modulosLabel: { compras:"Compras", viveres:"Víveres", projects:"Projects", mantenimiento:"Mantenimiento", reparaciones:"Reparaciones", certificados:"Certificados", documentos:"Documentos", tripulaciones:"Tripulaciones" },
  },
  {
    id: "cleansea",
    nombre: "Clean Sea",
    descripcion: "Operaciones de limpieza y servicios marítimos especializados.",
    icono: "⚓",
    logo: "/CS.png",
    color: "#1A7A6E",
    url: "https://clean-sea-portal.vercel.app",
    activo: true,
    modulos: ["inventario", "viveres"],
    modulosLabel: { inventario:"Inventario", viveres:"Víveres" },
  },
  {
    id: "terramare",
    nombre: "Terra Mare Services",
    descripcion: "Servicios de crewing y operaciones marítimas para clientes externos.",
    icono: "🌊",
    logo: "/logo-tm.png",
    color: "#235C96",
    url: "https://terra-mare-portal-9w3x.vercel.app",
    activo: true,
    modulos: ["hsqe", "pipeline", "dashboards"],
    modulosLabel: { hsqe:"HSQE", pipeline:"Pipeline", dashboards:"Dashboards" },
  },
  {
    id: "proyectos",
    nombre: "Evaluación de Proyectos",
    descripcion: "Herramientas de análisis para evaluación de inversiones y nuevos negocios del grupo.",
    icono: "📊",
    logo: null,
    color: "#7C3AED",
    url: "https://evaluacion-proyectos.vercel.app",
    activo: true,
    modulos: ["ais-analyzer", "transporte-arena"],
    modulosLabel: { "ais-analyzer":"AIS Analyzer", "transporte-arena":"Transporte de Arena" },
    esProyectos: true,
  },
];

const PROYECTOS = [
  { id:"ais-analyzer", nombre:"AIS Analyzer", color:"#235C96", url:null, activo:false, tags:["AIS","TIR / VAN","Base de zarpe"] },
  { id:"arena", nombre:"Transporte de Arena", color:"#854F0B", url:"https://terra-mare-portal-9w3x.vercel.app", activo:true, tags:["Monte Carlo","Logística fluvial"] },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --navy: #213363; --blue: #235C96; --mid: #6381A7; --light: #A5B5CC;
  --bg: #EEF2F7; --surface: #FFFFFF; --border: #D6E0ED;
  --text: #213363; --muted: #6381A7; --danger: #C0392B;
  --sans: 'Montserrat', sans-serif; --mono: 'DM Mono', monospace;
}
body { font-family: var(--sans); background: var(--bg); color: var(--text); min-height: 100vh; }

/* LOGIN */
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0f1d4a 0%, #1a2a5e 50%, #213363 100%); padding: 20px; }
.login-card { background: #fff; border-radius: 16px; padding: 40px; width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,.3); }
.login-logos { display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 24px; }
.login-logos img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #D6E0ED; }
.login-title { text-align: center; font-size: 18px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
.login-sub { text-align: center; font-size: 12px; color: var(--muted); margin-bottom: 28px; font-family: var(--mono); letter-spacing: .5px; }
.login-fg { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.login-fg label { font-size: 10px; color: var(--navy); letter-spacing: .5px; text-transform: uppercase; font-weight: 600; }
.login-fg input { border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; font-size: 13px; font-family: var(--sans); color: var(--text); outline: none; transition: border-color .15s; }
.login-fg input:focus { border-color: var(--blue); }
.login-btn { width: 100%; padding: 11px; background: var(--blue); color: #fff; border: none; border-radius: 8px; font-family: var(--sans); font-size: 13px; font-weight: 600; cursor: pointer; transition: background .15s; margin-top: 6px; letter-spacing: .5px; }
.login-btn:hover { background: var(--navy); }
.login-btn:disabled { opacity: .6; cursor: not-allowed; }
.login-error { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; border-radius: 8px; padding: 10px 14px; font-size: 12px; margin-bottom: 14px; }
.login-footer { text-align: center; font-size: 10px; color: var(--muted); margin-top: 24px; font-family: var(--mono); }

/* HEADER */
.header { background: var(--navy); padding: 0 40px; display: flex; align-items: center; justify-content: space-between; height: 64px; box-shadow: 0 2px 12px rgba(33,51,99,.2); position: sticky; top: 0; z-index: 10; }
.header-brand { display: flex; align-items: center; gap: 16px; }
.header-logos { display: flex; align-items: center; gap: 8px; }
.header-logos img { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1.5px solid rgba(255,255,255,.25); }
.header-divider { width: 1px; height: 28px; background: rgba(255,255,255,.15); margin: 0 4px; }
.header-main { font-size: 13px; font-weight: 700; color: #fff; letter-spacing: 1.5px; text-transform: uppercase; }
.header-sub { font-size: 9px; color: rgba(255,255,255,.45); letter-spacing: .5px; font-family: var(--mono); margin-top: 1px; }
.header-right { display: flex; align-items: center; gap: 16px; }
.header-user-email { font-size: 10px; font-family: var(--mono); color: rgba(255,255,255,.45); }
.logout-btn { background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); color: rgba(255,255,255,.7); font-family: var(--sans); font-size: 10px; font-weight: 600; padding: 5px 12px; border-radius: 6px; cursor: pointer; transition: all .15s; letter-spacing: .3px; }
.logout-btn:hover { background: rgba(255,255,255,.2); color: #fff; }
.admin-tab-btn { background: rgba(255,165,0,.15); border: 1px solid rgba(255,165,0,.3); color: rgba(255,200,50,.9); font-family: var(--sans); font-size: 10px; font-weight: 700; padding: 5px 12px; border-radius: 6px; cursor: pointer; letter-spacing: .3px; transition: all .15s; }
.admin-tab-btn:hover { background: rgba(255,165,0,.25); }
.admin-tab-btn.active { background: rgba(255,165,0,.3); color: #FFD700; border-color: rgba(255,200,50,.5); }

/* HERO */
.hero { background: linear-gradient(135deg, var(--navy) 0%, #1a2a5e 50%, #0f1d4a 100%); padding: 52px 40px 48px; position: relative; overflow: hidden; }
.hero::before { content: ''; position: absolute; top: -60px; right: -60px; width: 300px; height: 300px; border-radius: 50%; background: rgba(35,92,150,.2); pointer-events: none; }
.hero-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; text-align: center; }
.hero-eyebrow { font-family: var(--mono); font-size: 10px; letter-spacing: 3px; color: rgba(255,255,255,.4); text-transform: uppercase; margin-bottom: 10px; }
.hero-title { font-size: 32px; font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 10px; }
.hero-title span { color: #7EB8E8; }
.hero-desc { font-size: 13px; color: rgba(255,255,255,.5); max-width: 480px; line-height: 1.7; margin: 0 auto; }

/* CONTENT */
.content { max-width: 1200px; margin: 0 auto; padding: 48px 40px 80px; }
.section-label { font-family: var(--mono); font-size: 9px; letter-spacing: 2.5px; color: var(--muted); text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
.section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* GRID */
.empresas-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
@media (max-width: 1100px) { .empresas-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 580px)  { .empresas-grid { grid-template-columns: 1fr; } }

/* EMPRESA CARD */
.empresa-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all .2s; position: relative; box-shadow: 0 2px 8px rgba(33,51,99,.06); display: flex; flex-direction: column; }
.empresa-card.activo { cursor: pointer; }
.empresa-card.activo:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(33,51,99,.14); border-color: var(--card-color); }
.empresa-card.inactivo { opacity: .65; }
.empresa-card.sin-acceso { opacity: .4; cursor: not-allowed; }
.empresa-card.es-proyectos { cursor: pointer; }
.empresa-card.es-proyectos:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(33,51,99,.14); border-color: var(--card-color); }
.card-banner { height: 6px; background: var(--card-color); flex-shrink: 0; }
.card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
.card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.card-logo { width: 52px; height: 52px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); background: #f8f8f8; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.card-logo img { width: 100%; height: 100%; object-fit: cover; }
.card-logo-icon-inner { width: 52px; height: 52px; border-radius: 12px; border: 1px solid var(--card-color); display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0; background: linear-gradient(135deg, #f8f0ff 0%, #ede9fe 100%); }
.badge-activo { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; letter-spacing: .5px; text-transform: uppercase; white-space: nowrap; }
.badge-prox   { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #F3F4F6; color: #6B7280; border: 1px solid #E5E7EB; letter-spacing: .5px; text-transform: uppercase; white-space: nowrap; }
.badge-sin    { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; letter-spacing: .5px; text-transform: uppercase; white-space: nowrap; }
.card-nombre { font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
.card-desc   { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 16px; }
.card-modulos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 16px; }
.card-modulo { font-family: var(--sans); font-size: 11px; font-weight: 500; padding: 8px 10px; background: #F0F4F8; border: 1px solid var(--border); border-radius: 8px; color: var(--navy); text-align: center; transition: all .15s; }
.card-modulo.activo { background: var(--card-color-light, #F0F4F8); border-color: var(--card-color); color: var(--card-color); cursor: pointer; }
.card-modulo.activo:hover { background: var(--card-color); color: #fff; }
.card-footer { padding: 14px 24px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: #FAFBFC; }
.card-link { font-size: 12px; font-weight: 600; color: var(--card-color); letter-spacing: .3px; }
.card-link-disabled { font-size: 12px; color: var(--muted); }

/* PROYECTOS SUBLIST */
.proyectos-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; flex: 1; }
.proyecto-item { padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border); background: #F8FAFC; display: flex; flex-direction: column; gap: 4px; transition: all .15s; }
.proyecto-item.activo { cursor: pointer; border-color: var(--proj-color); }
.proyecto-item.activo:hover { background: #F0F4F8; }
.proyecto-nombre { font-size: 12px; font-weight: 600; color: var(--navy); }
.proyecto-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.proyecto-tag { font-family: var(--mono); font-size: 8px; padding: 2px 6px; border-radius: 3px; background: #E0E7F0; color: var(--muted); }

/* FOOTER */
.footer { border-top: 1px solid var(--border); padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; background: var(--surface); }
.footer-left  { font-family: var(--mono); font-size: 10px; color: var(--muted); }
.footer-right { font-family: var(--mono); font-size: 10px; color: var(--light); }

/* LOADING */
.loading-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--navy); }
.loading-inner { text-align: center; }
.loading-logos { display: flex; justify-content: center; gap: 12px; margin-bottom: 20px; }
.loading-logos img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; opacity: .6; }
.loading-text { font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,.4); letter-spacing: 2px; text-transform: uppercase; }

/* ADMIN PANEL */
.admin-content { max-width: 1200px; margin: 0 auto; padding: 40px; }
.admin-header-block { margin-bottom: 32px; }
.admin-title { font-size: 22px; font-weight: 800; color: var(--navy); margin-bottom: 4px; }
.admin-subtitle { font-size: 12px; color: var(--muted); }

.admin-matrix { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
.admin-matrix-header { display: grid; gap: 0; background: var(--navy); }
.admin-user-row { display: grid; border-bottom: 1px solid var(--border); transition: background .15s; }
.admin-user-row:last-child { border-bottom: none; }
.admin-user-row:hover { background: #F8FAFC; }
.admin-cell { padding: 12px 16px; display: flex; align-items: center; font-size: 12px; border-right: 1px solid var(--border); }
.admin-cell:last-child { border-right: none; }
.admin-cell-header { padding: 10px 16px; font-family: var(--mono); font-size: 9px; letter-spacing: 1px; color: rgba(255,255,255,.6); text-transform: uppercase; border-right: 1px solid rgba(255,255,255,.1); }
.admin-cell-header:last-child { border-right: none; }
.admin-user-email { font-family: var(--mono); font-size: 11px; color: var(--navy); font-weight: 600; }
.admin-user-id { font-family: var(--mono); font-size: 9px; color: var(--muted); margin-top: 2px; }

.empresa-col { display: flex; flex-direction: column; gap: 4px; }
.empresa-col-title { font-family: var(--mono); font-size: 9px; letter-spacing: .5px; color: var(--muted); text-transform: uppercase; margin-bottom: 2px; }
.modulo-checks { display: flex; flex-direction: column; gap: 3px; }
.modulo-check-row { display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 2px 4px; border-radius: 4px; transition: background .1s; }
.modulo-check-row:hover { background: #F0F4F8; }
.modulo-check-label { font-size: 11px; color: var(--text); }
.empresa-access-toggle { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; padding: 4px 6px; border-radius: 6px; cursor: pointer; transition: background .1s; }
.empresa-access-toggle:hover { background: #F0F4F8; }
.empresa-access-label { font-size: 12px; font-weight: 600; color: var(--navy); }

.toggle-switch { position: relative; width: 32px; height: 18px; flex-shrink: 0; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; cursor: pointer; inset: 0; background: #CBD5E1; border-radius: 18px; transition: .2s; }
.toggle-slider::before { content: ''; position: absolute; width: 12px; height: 12px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: .2s; }
input:checked + .toggle-slider { background: #1A7A6E; }
input:checked + .toggle-slider::before { transform: translateX(14px); }

.admin-save-badge { font-family: var(--mono); font-size: 9px; padding: 2px 8px; border-radius: 4px; background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; }
.admin-loading { padding: 60px 20px; text-align: center; color: var(--muted); font-size: 12px; }
`;

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage() {
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleLogin = async () => {
    setLoading(true); setError("");
    const { error: e } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (e) setError("Credenciales incorrectas. Verificá tu email y contraseña.");
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logos">
          <img src="/PL.png" alt="PL" /><img src="/CS.png" alt="CS" /><img src="/logo-tm.png" alt="TM" />
        </div>
        <div className="login-title">Grupo Marítimo ERP</div>
        <div className="login-sub">Sistema integrado de gestión</div>
        {error && <div className="login-error">{error}</div>}
        <div className="login-fg">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} placeholder="usuario@terra-mare.com.ar" autoFocus />
        </div>
        <div className="login-fg">
          <label>Contraseña</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={handleKey} placeholder="••••••••" />
        </div>
        <button className="login-btn" onClick={handleLogin} disabled={loading || !email || !pass}>
          {loading ? "Ingresando..." : "Ingresar →"}
        </button>
        <div className="login-footer">Acceso restringido · Solo personal autorizado</div>
      </div>
    </div>
  );
}

// ─── PROYECTOS SUBLIST ────────────────────────────────────────────────────────
function ProyectosSubList() {
  return (
    <div className="proyectos-list">
      {PROYECTOS.map(p => (
        <div key={p.id} className={`proyecto-item ${p.activo ? "activo" : ""}`}
          style={{ "--proj-color": p.color }}
          onClick={() => p.activo && p.url && window.open(p.url, "_blank")}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div className="proyecto-nombre">{p.nombre}</div>
            {p.activo ? <span className="badge-activo">● Activo</span> : <span className="badge-prox">Próximo</span>}
          </div>
          <div className="proyecto-tags">{p.tags.map(t => <span key={t} className="proyecto-tag">{t}</span>)}</div>
        </div>
      ))}
    </div>
  );
}

// ─── EMPRESA CARD ─────────────────────────────────────────────────────────────
function EmpresaCard({ empresa, tieneAcceso }) {
  const esProyectos = !!empresa.esProyectos;
  const puedeAbrir  = tieneAcceso && empresa.activo && empresa.url;
  const handleClick = () => { if (puedeAbrir || esProyectos) window.open(empresa.url, "_self"); };
  const cardClass   = [
    "empresa-card",
    esProyectos ? "es-proyectos" : tieneAcceso && empresa.activo ? "activo" : tieneAcceso ? "inactivo" : "sin-acceso"
  ].join(" ");

  return (
    <div className={cardClass} style={{ "--card-color": empresa.color }} onClick={handleClick}>
      <div className="card-banner" />
      <div className="card-body">
        <div className="card-top">
          {empresa.logo
            ? <div className="card-logo"><img src={empresa.logo} alt={empresa.nombre} /></div>
            : <div className="card-logo-icon-inner">{empresa.icono}</div>
          }
          {esProyectos
            ? <span className="badge-activo">● Activo</span>
            : !tieneAcceso
              ? <span className="badge-sin">Sin acceso</span>
              : empresa.activo
                ? <span className="badge-activo">● Activo</span>
                : <span className="badge-prox">Próximamente</span>
          }
        </div>
        <div className="card-nombre">{empresa.nombre}</div>
        <div className="card-desc">{empresa.descripcion}</div>
        {esProyectos
          ? <ProyectosSubList />
          : <div className="card-modulos">
              {empresa.modulos.map(m => <span key={m} className="card-modulo">{empresa.modulosLabel[m] || m}</span>)}
            </div>
        }
      </div>
      <div className="card-footer">
        {esProyectos && empresa.url
          ? <span className="card-link" style={{ color: empresa.color }}>Ingresar al portal →</span>
          : esProyectos
          ? <span className="card-link-disabled">En desarrollo</span>
          : !tieneAcceso
            ? <span className="card-link-disabled">Acceso no autorizado</span>
            : puedeAbrir
              ? <span className="card-link" style={{ color: empresa.color }}>Ingresar al portal →</span>
              : <span className="card-link-disabled">En desarrollo</span>
        }
        <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)" }}>
          {esProyectos ? `${PROYECTOS.length} proyectos` : `${empresa.modulos.length} módulos`}
        </span>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ─────────────────────────────────────────────────────────────
function AdminPanel() {
  const [usuarios, setUsuarios]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState({});
  const [saved, setSaved]         = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Leer user_roles + emails desde auth.users via RPC o join
        const { data, error } = await supabase
          .from("user_roles")
          .select("user_id, empresas, modulos");
        if (error) throw error;

        // Leer emails de auth.users (requiere service role en prod, acá usamos listUsers si está disponible)
        const { data: { users }, error: e2 } = await supabase.auth.admin.listUsers();
        const emailMap = {};
        if (!e2 && users) users.forEach(u => { emailMap[u.id] = u.email; });

        setUsuarios((data || []).map(r => ({
          ...r,
          email: emailMap[r.user_id] || r.user_id.substring(0,8) + "...",
          empresas: r.empresas || [],
          modulos: r.modulos || [],
        })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleEmpresa = async (userId, empresaId, tieneAcceso) => {
    const user = usuarios.find(u => u.user_id === userId);
    if (!user) return;
    const nuevasEmpresas = tieneAcceso
      ? user.empresas.filter(e => e !== empresaId)
      : [...user.empresas, empresaId];
    await guardar(userId, nuevasEmpresas, user.modulos);
  };

  const toggleModulo = async (userId, moduloId, tieneAcceso) => {
    const user = usuarios.find(u => u.user_id === userId);
    if (!user) return;
    const nuevosModulos = tieneAcceso
      ? user.modulos.filter(m => m !== moduloId)
      : [...user.modulos, moduloId];
    await guardar(userId, user.empresas, nuevosModulos);
  };

  const guardar = async (userId, empresas, modulos) => {
    setSaving(s => ({ ...s, [userId]: true }));
    setUsuarios(prev => prev.map(u => u.user_id === userId ? { ...u, empresas, modulos } : u));
    try {
      await supabase.from("user_roles").update({ empresas, modulos }).eq("user_id", userId);
      setSaved(s => ({ ...s, [userId]: true }));
      setTimeout(() => setSaved(s => ({ ...s, [userId]: false })), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(s => ({ ...s, [userId]: false })); }
  };

  // Calcular ancho de columnas: usuario + una por empresa
  const colWidths = ["280px", ...EMPRESAS.map(() => "1fr")].join(" ");

  return (
    <div className="admin-content">
      <div className="admin-header-block">
        <div className="admin-title">🔐 Administración de accesos</div>
        <div className="admin-subtitle">Gestioná empresas y módulos para cada usuario del sistema.</div>
      </div>

      {loading ? (
        <div className="admin-loading">Cargando usuarios...</div>
      ) : (
        <div className="admin-matrix">
          {/* Header */}
          <div className="admin-matrix-header" style={{ display:"grid", gridTemplateColumns: colWidths }}>
            <div className="admin-cell-header">Usuario</div>
            {EMPRESAS.map(emp => (
              <div key={emp.id} className="admin-cell-header" style={{ color: emp.color === "#213363" ? "rgba(255,255,255,.8)" : emp.color }}>
                {emp.nombre}
              </div>
            ))}
          </div>

          {/* Filas de usuarios */}
          {usuarios.map(user => (
            <div key={user.user_id} className="admin-user-row" style={{ display:"grid", gridTemplateColumns: colWidths }}>
              {/* Email */}
              <div className="admin-cell" style={{ flexDirection:"column", alignItems:"flex-start", gap:2 }}>
                <div className="admin-user-email">{user.email}</div>
                <div className="admin-user-id">{user.user_id.substring(0,16)}...</div>
                {saving[user.user_id] && <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)" }}>Guardando...</span>}
                {saved[user.user_id]  && <span className="admin-save-badge">✓ Guardado</span>}
              </div>

              {/* Columna por empresa */}
              {EMPRESAS.map(emp => {
                const tieneEmpresa = user.empresas.includes(emp.id);
                return (
                  <div key={emp.id} className="admin-cell" style={{ flexDirection:"column", alignItems:"flex-start", gap:6, background: tieneEmpresa ? `${emp.color}06` : "transparent" }}>
                    {/* Toggle empresa */}
                    <label className="empresa-access-toggle">
                      <div className="toggle-switch">
                        <input type="checkbox" checked={tieneEmpresa} onChange={() => toggleEmpresa(user.user_id, emp.id, tieneEmpresa)} />
                        <span className="toggle-slider"></span>
                      </div>
                      <span className="empresa-access-label" style={{ color: tieneEmpresa ? emp.color : "var(--muted)", fontSize:11 }}>
                        {tieneEmpresa ? "Acceso" : "Sin acceso"}
                      </span>
                    </label>

                    {/* Checkboxes de módulos */}
                    {tieneEmpresa && (
                      <div className="modulo-checks">
                        {emp.modulos.map(mod => {
                          const tieneModulo = user.modulos.includes(mod);
                          return (
                            <label key={mod} className="modulo-check-row">
                              <input
                                type="checkbox"
                                checked={tieneModulo}
                                onChange={() => toggleModulo(user.user_id, mod, tieneModulo)}
                                style={{ accentColor: emp.color }}
                              />
                              <span className="modulo-check-label">{emp.modulosLabel[mod] || mod}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ user, empresasPermitidas, onLogout }) {
  const esAdmin = user.email === ADMIN_EMAIL;
  const [tab, setTab] = useState("home");

  return (
    <>
      <header className="header">
        <div className="header-brand">
          <div className="header-logos">
            <img src="/PL.png" alt="Parana Logística" />
            <img src="/CS.png" alt="Clean Sea" />
            <img src="/logo-tm.png" alt="Terra Mare" />
          </div>
          <div className="header-divider" />
          <div>
            <div className="header-main">Grupo Marítimo ERP</div>
            <div className="header-sub">Sistema integrado de gestión</div>
          </div>
        </div>
        <div className="header-right">
          <span className="header-user-email">{user.email}</span>
          {esAdmin && (
            <button
              className={`admin-tab-btn ${tab === "admin" ? "active" : ""}`}
              onClick={() => setTab(tab === "admin" ? "home" : "admin")}
            >
              🔐 Admin
            </button>
          )}
          <button className="logout-btn" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      {tab === "admin" ? (
        <AdminPanel />
      ) : (
        <>
          <div className="hero">
            <div className="hero-content">
              <div className="hero-eyebrow">Sistema integrado de gestión</div>
              <h1 className="hero-title">Grupo <span>Marítimo</span> ERP</h1>
              <p className="hero-desc">Seleccioná la empresa para acceder a su portal de gestión.</p>
            </div>
          </div>
          <div className="content">
            <div className="section-label">Empresas del grupo</div>
            <div className="empresas-grid">
              {EMPRESAS.map(e => (
                <EmpresaCard
                  key={e.id}
                  empresa={e}
                  tieneAcceso={e.esProyectos || empresasPermitidas.includes(e.id)}
                />
              ))}
            </div>
          </div>
          <footer className="footer">
            <div className="footer-left">Grupo Marítimo ERP · Confidencial</div>
            <div className="footer-right">v1.0 — {new Date().getFullYear()}</div>
          </footer>
        </>
      )}
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession]               = useState(null);
  const [empresasPermitidas, setEmpresasPermitidas] = useState([]);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadRoles(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadRoles(session.user.id);
      else { setEmpresasPermitidas([]); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadRoles = async (userId) => {
    try {
      const { data } = await supabase.from("user_roles").select("empresas").eq("user_id", userId).single();
      setEmpresasPermitidas(data?.empresas || []);
    } catch { setEmpresasPermitidas([]); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  if (loading) return (
    <div className="loading-page">
      <style>{CSS}</style>
      <div className="loading-inner">
        <div className="loading-logos">
          <img src="/PL.png" alt="PL" /><img src="/CS.png" alt="CS" /><img src="/logo-tm.png" alt="TM" />
        </div>
        <div className="loading-text">Cargando...</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      {!session
        ? <LoginPage />
        : <HomePage user={session.user} empresasPermitidas={empresasPermitidas} onLogout={handleLogout} />
      }
    </>
  );
}
