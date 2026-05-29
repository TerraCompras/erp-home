import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const ADMIN_EMAIL = "federico.ruiz@terra-mare.com.ar";

const EMPRESAS = [
  {
    id: "parana",
    nombre: "Parana Logística",
    descripcion: "Transporte marítimo y fluvial sobre la Hidrovía, apoyo offshore y rescate y salvamento.",
    icono: "🚢",
    logo: "/PL.png",
    color: "#213363",
    url: "https://integra.paranalogistica.com.ar",
    activo: true,
    modulos: ["compras", "viveres", "projects", "mantenimiento", "reparaciones", "certificados", "documentos", "tripulaciones", "cost-tracker"],
    modulosLabel: { compras:"Compras", viveres:"Víveres", projects:"Projects", mantenimiento:"Mantenimiento", reparaciones:"Reparaciones", certificados:"Certificados", documentos:"Documentos", tripulaciones:"Tripulaciones", "cost-tracker":"Cost Tracker" },
  },
  {
    id: "cleansea",
    nombre: "Clean Sea",
    descripcion: "Respuesta y prevención de derrames, salvamento marítimo y transferencia de cargas líquidas.",
    icono: "⚓",
    logo: "/CS.png",
    color: "#1A7A6E",
    url: "https://integra.cleansea.com.ar",
    activo: true,
    modulos: ["inventario", "viveres"],
    modulosLabel: { inventario:"Inventario", viveres:"Víveres" },
  },
  {
    id: "terramare",
    nombre: "Terra Mare Services",
    descripcion: "Servicios de apoyo a oil & gas: tripulaciones, husbandry, logística y contenedores DNV/ISO.",
    icono: "🌊",
    logo: "/logo-tm.png",
    color: "#235C96",
    url: "https://integra.home.terra-mare.com.ar",
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
    modulos: ["ais-analyzer", "transporte-arena", "evaluacion-gdm"],
    modulosLabel: { "ais-analyzer":"AIS Analyzer", "transporte-arena":"Transporte de Arena", "evaluacion-gdm":"Evaluación GdM" },
    esProyectos: true,
  },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --navy:    #0D1B2E;
  --navy2:   #132040;
  --navy3:   #213363;
  --teal:    #1A7A6E;
  --teal2:   #22998A;
  --teal-lt: rgba(26,122,110,0.15);
  --blue:    #235C96;
  --mid:     #6381A7;
  --light:   #A5B5CC;
  --bg:      #F0F4F8;
  --surface: #FFFFFF;
  --border:  #D6E0ED;
  --text:    #0D1B2E;
  --muted:   #6381A7;
  --sans:    'Montserrat', sans-serif;
  --mono:    'DM Mono', monospace;
}
body { font-family: var(--sans); background: var(--bg); color: var(--text); min-height: 100vh; }

/* ── LOGIN ── */
.login-page {
  min-height: 100vh;
  display: flex;
  background: var(--navy);
  position: relative;
  overflow: hidden;
}
.login-bg-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(13,27,46,0.95) 0%, rgba(33,51,99,0.80) 60%, rgba(13,27,46,0.95) 100%);
  z-index: 1;
}
.login-bg-lines {
  position: absolute; inset: 0; z-index: 0;
  background-image:
    linear-gradient(rgba(26,122,110,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(26,122,110,0.06) 1px, transparent 1px);
  background-size: 60px 60px;
}
.login-split {
  position: relative; z-index: 2;
  display: flex; width: 100%;
}
.login-left {
  flex: 1;
  display: flex; flex-direction: column; justify-content: center;
  padding: 80px 60px;
  border-right: 1px solid rgba(26,122,110,0.2);
}
.login-left-eyebrow {
  font-family: var(--mono); font-size: 10px; letter-spacing: 3px;
  color: var(--teal2); text-transform: uppercase; margin-bottom: 24px;
}
.login-left-logo-wrap { margin-bottom: 20px; }
.login-left-logo-img  { height: 160px; width: auto; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.92; }
.login-left-line {
  width: 48px; height: 3px; background: var(--teal); margin-bottom: 20px;
}
.login-left-sub {
  font-size: 13px; color: rgba(255,255,255,0.45);
  line-height: 1.7; max-width: 320px; font-style: italic;
}
.login-left-logos {
  display: flex; gap: 12px; margin-top: 48px; align-items: center;
}
.login-left-logos img {
  width: 36px; height: 36px; border-radius: 50%;
  object-fit: cover; border: 1.5px solid rgba(255,255,255,0.2);
  opacity: 0.7;
}
.login-right {
  width: 440px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 60px 48px;
}
.login-card {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(26,122,110,0.3);
  border-radius: 16px;
  padding: 40px 36px;
  backdrop-filter: blur(20px);
}
.login-card-title {
  font-size: 16px; font-weight: 700; color: #fff;
  margin-bottom: 4px; letter-spacing: 0.5px;
}
.login-card-sub {
  font-family: var(--mono); font-size: 10px;
  color: rgba(255,255,255,0.35); letter-spacing: 1px;
  margin-bottom: 28px; text-transform: uppercase;
}
.login-fg { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.login-fg label {
  font-size: 9px; color: rgba(255,255,255,0.4);
  letter-spacing: 1px; text-transform: uppercase; font-weight: 600;
}
.login-fg input {
  border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
  padding: 11px 14px; font-size: 13px; font-family: var(--sans);
  color: #fff; background: rgba(255,255,255,0.06); outline: none;
  transition: border-color .15s;
}
.login-fg input::placeholder { color: rgba(255,255,255,0.2); }
.login-fg input:focus { border-color: var(--teal); background: rgba(255,255,255,0.09); }
.login-btn {
  width: 100%; padding: 12px; margin-top: 8px;
  background: var(--teal); color: #fff;
  border: none; border-radius: 8px;
  font-family: var(--sans); font-size: 13px; font-weight: 700;
  cursor: pointer; transition: background .15s; letter-spacing: .5px;
}
.login-btn:hover { background: var(--teal2); }
.login-btn:disabled { opacity: .5; cursor: not-allowed; }
.login-error {
  background: rgba(239,68,68,0.12); color: #FCA5A5;
  border: 1px solid rgba(239,68,68,0.25); border-radius: 8px;
  padding: 10px 14px; font-size: 12px; margin-bottom: 14px;
}
.login-footer {
  text-align: center; font-family: var(--mono); font-size: 9px;
  color: rgba(255,255,255,0.2); margin-top: 20px; letter-spacing: 1px;
}

/* ── HEADER ── */
.header {
  background: var(--navy); padding: 0 40px;
  display: flex; align-items: center; justify-content: space-between;
  height: 60px; position: sticky; top: 0; z-index: 10;
  border-bottom: 1px solid rgba(26,122,110,0.25);
}
.header-brand { display: flex; align-items: center; gap: 14px; }
.header-integra-logo { display: flex; align-items: center; }
.header-integra-logo img { height: 52px; width: auto; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.9; }
.header-divider { width: 1px; height: 24px; background: rgba(26,122,110,0.35); margin: 0 6px; }
.header-main {
  font-size: 13px; font-weight: 800; color: #fff;
  letter-spacing: 2px; text-transform: uppercase;
}
.header-sub {
  font-size: 9px; color: var(--teal2); letter-spacing: 1px;
  font-family: var(--mono); margin-top: 1px; text-transform: uppercase;
}
.header-right { display: flex; align-items: center; gap: 14px; }
.header-user-email { font-size: 10px; font-family: var(--mono); color: rgba(255,255,255,0.35); }
.logout-btn {
  background: transparent; border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.5); font-family: var(--sans); font-size: 10px;
  font-weight: 600; padding: 5px 12px; border-radius: 6px;
  cursor: pointer; transition: all .15s; letter-spacing: .3px;
}
.logout-btn:hover { border-color: rgba(255,255,255,0.35); color: #fff; }
.admin-tab-btn {
  background: rgba(26,122,110,0.12); border: 1px solid rgba(26,122,110,0.3);
  color: var(--teal2); font-family: var(--sans); font-size: 10px; font-weight: 700;
  padding: 5px 12px; border-radius: 6px; cursor: pointer; letter-spacing: .3px;
  transition: all .15s;
}
.admin-tab-btn:hover { background: rgba(26,122,110,0.22); }
.admin-tab-btn.active { background: rgba(26,122,110,0.25); color: var(--teal2); border-color: rgba(26,122,110,0.5); }

/* ── HERO ── */
.hero {
  background: linear-gradient(160deg, var(--navy) 0%, var(--navy2) 60%, var(--navy3) 100%);
  padding: 56px 40px 52px; position: relative; overflow: hidden;
}
.hero::before {
  content: ''; position: absolute;
  bottom: -80px; right: -80px;
  width: 400px; height: 400px; border-radius: 50%;
  background: radial-gradient(circle, rgba(26,122,110,0.10) 0%, transparent 70%);
  pointer-events: none;
}
.hero::after {
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--teal), transparent);
}
.hero-content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }
.hero-eyebrow {
  font-family: var(--mono); font-size: 10px; letter-spacing: 3px;
  color: var(--teal2); text-transform: uppercase; margin-bottom: 14px;
}
.hero-title {
  font-size: 40px; font-weight: 900; color: #fff;
  line-height: 1.05; margin-bottom: 6px; letter-spacing: -1px;
}
.hero-title span { color: var(--teal2); }
.hero-line { width: 40px; height: 2px; background: var(--teal); margin: 16px 0; }
.hero-desc {
  font-size: 13px; color: rgba(255,255,255,0.45);
  max-width: 480px; line-height: 1.7; font-style: italic;
}

/* ── CONTENT ── */
.content { max-width: 1200px; margin: 0 auto; padding: 48px 40px 80px; }
.section-label {
  font-family: var(--mono); font-size: 9px; letter-spacing: 2.5px;
  color: var(--muted); text-transform: uppercase; margin-bottom: 24px;
  display: flex; align-items: center; gap: 10px;
}
.section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* ── GRID ── */
.empresas-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
@media (max-width: 1100px) { .empresas-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 580px)  { .empresas-grid { grid-template-columns: 1fr; } }

/* ── EMPRESA CARD ── */
.empresa-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; overflow: hidden; transition: all .2s;
  position: relative; box-shadow: 0 2px 8px rgba(11,22,41,0.07);
  display: flex; flex-direction: column;
}
.empresa-card.activo { cursor: pointer; }
.empresa-card.activo:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(11,22,41,0.15);
  border-color: var(--card-color);
}
.empresa-card.inactivo { opacity: .65; }
.empresa-card.sin-acceso { opacity: .4; cursor: not-allowed; }
.card-banner { height: 4px; background: var(--card-color); flex-shrink: 0; }
.card-gold-accent {
  height: 4px; flex-shrink: 0;
  background: linear-gradient(90deg, var(--teal) 0%, var(--teal2) 100%);
}
.card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
.card-top {
  display: flex; align-items: flex-start;
  justify-content: space-between; margin-bottom: 16px;
}
.card-logo {
  width: 52px; height: 52px; border-radius: 12px; overflow: hidden;
  border: 1px solid var(--border); background: #f8f8f8;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
}
.card-logo img { width: 100%; height: 100%; object-fit: cover; }
.card-logo-icon-inner {
  width: 52px; height: 52px; border-radius: 12px;
  border: 1px solid rgba(124,58,237,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 26px; flex-shrink: 0;
  background: linear-gradient(135deg, #f8f0ff 0%, #ede9fe 100%);
}
.badge-activo {
  font-family: var(--mono); font-size: 8px; font-weight: 700;
  padding: 3px 8px; border-radius: 4px;
  background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0;
  letter-spacing: .5px; text-transform: uppercase; white-space: nowrap;
}
.badge-prox {
  font-family: var(--mono); font-size: 8px; font-weight: 700;
  padding: 3px 8px; border-radius: 4px;
  background: #F3F4F6; color: #6B7280; border: 1px solid #E5E7EB;
  letter-spacing: .5px; text-transform: uppercase; white-space: nowrap;
}
.badge-sin {
  font-family: var(--mono); font-size: 8px; font-weight: 700;
  padding: 3px 8px; border-radius: 4px;
  background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA;
  letter-spacing: .5px; text-transform: uppercase; white-space: nowrap;
}
.card-nombre { font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
.card-desc   { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 16px; flex: 1; }
.card-modulos {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 6px; margin-bottom: 16px;
}
.card-modulo {
  font-family: var(--sans); font-size: 11px; font-weight: 500;
  padding: 7px 6px; background: #F0F4F8; border: 1px solid var(--border);
  border-radius: 8px; color: var(--navy); text-align: center;
  transition: all .15s; width: 100%;
}
.card-footer {
  padding: 14px 24px; border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  background: #FAFBFC;
}
.card-link {
  font-size: 12px; font-weight: 700; color: var(--card-color);
  letter-spacing: .3px;
}
.card-link-disabled { font-size: 12px; color: var(--muted); }

/* ── FOOTER ── */
.footer {
  border-top: 1px solid rgba(26,122,110,0.2);
  padding: 20px 40px; display: flex; align-items: center;
  justify-content: space-between;
  background: var(--navy);
}
.footer-left  { font-family: var(--mono); font-size: 10px; color: rgba(255,255,255,0.25); }
.footer-right { font-family: var(--mono); font-size: 10px; color: var(--teal2); opacity: 0.6; }

/* ── LOADING ── */
.loading-page {
  min-height: 100vh; display: flex; align-items: center;
  justify-content: center; background: var(--navy);
}
.loading-inner { text-align: center; }
.loading-integra-logo { display: flex; justify-content: center; margin-bottom: 24px; }
.loading-integra-logo img { height: 60px; width: auto; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.5; }
.loading-text {
  font-family: var(--mono); font-size: 10px;
  color: rgba(255,255,255,0.3); letter-spacing: 3px; text-transform: uppercase;
}

/* ── ADMIN PANEL ── */
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
.admin-cell-header { padding: 10px 16px; font-family: var(--mono); font-size: 9px; letter-spacing: 1px; color: rgba(255,255,255,.5); text-transform: uppercase; border-right: 1px solid rgba(255,255,255,.08); }
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
input:checked + .toggle-slider { background: var(--blue); }
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
    try {
      const { error: e } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (e) setError("Credenciales incorrectas. Verificá tu email y contraseña.");
    } catch {
      setError("Error de conexión. Verificá tu red e intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="login-page">
      <div className="login-bg-lines" />
      <div className="login-bg-overlay" />
      <div className="login-split">
        {/* LEFT — branding */}
        <div className="login-left">
          <div className="login-left-eyebrow">ERP · Plataforma Documental Marítima & Logística</div>
          <div className="login-left-logo-wrap">
            <img src="/integralogo.png" alt="INTEGRA" className="login-left-logo-img" />
          </div>
          <div className="login-left-line" />
          <div className="login-left-sub">
            Servicios Marítimos Integrados · Operaciones Offshore · Respuesta Ambiental · Logística Marítima
          </div>
          <div className="login-left-logos">
            <img src="/PL.png" alt="Parana Logística" />
            <img src="/CS.png" alt="Clean Sea" />
            <img src="/logo-tm.png" alt="Terra Mare" />
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-card-title">Acceso al sistema</div>
            <div className="login-card-sub">Solo personal autorizado</div>
            {error && <div className="login-error">{error}</div>}
            <div className="login-fg">
              <label>Email</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKey}
                placeholder="usuario@terra-mare.com.ar"
                autoFocus
              />
            </div>
            <div className="login-fg">
              <label>Contraseña</label>
              <input
                type="password" value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={handleKey}
                placeholder="••••••••"
              />
            </div>
            <button className="login-btn" onClick={handleLogin} disabled={loading || !email || !pass}>
              {loading ? "Ingresando..." : "Ingresar →"}
            </button>
            <div className="login-footer">INTEGRA · Acceso restringido · Confidencial</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EMPRESA CARD ─────────────────────────────────────────────────────────────
function EmpresaCard({ empresa, tieneAcceso }) {
  const esProyectos = !!empresa.esProyectos;
  const puedeAbrir  = tieneAcceso && empresa.activo && empresa.url;

  // Proyectos: misma lógica que las demás — abre el portal si tiene URL
  const handleClick = () => {
    if (puedeAbrir || (esProyectos && empresa.url)) {
      window.location.href = empresa.url;
    }
  };

  const cardClass = [
    "empresa-card",
    (puedeAbrir || esProyectos) ? "activo"
      : tieneAcceso             ? "inactivo"
                                : "sin-acceso"
  ].join(" ");

  return (
    <div
      className={cardClass}
      style={{ "--card-color": empresa.color }}
      onClick={handleClick}
    >
      {/* Barra superior: dorada para proyectos, color empresa para el resto */}
      {esProyectos
        ? <div className="card-gold-accent" />
        : <div className="card-banner" />
      }

      <div className="card-body">
        <div className="card-top">
          {empresa.logo
            ? <div className="card-logo"><img src={empresa.logo} alt={empresa.nombre} /></div>
            : <div className="card-logo-icon-inner">{empresa.icono}</div>
          }
          {!tieneAcceso && !esProyectos
            ? <span className="badge-sin">Sin acceso</span>
            : empresa.activo
              ? <span className="badge-activo">● Activo</span>
              : <span className="badge-prox">Próximamente</span>
          }
        </div>

        <div className="card-nombre">{empresa.nombre}</div>
        <div className="card-desc">{empresa.descripcion}</div>

        {/* Módulos — igual para todos, incluyendo Proyectos */}
        <div className="card-modulos">
          {empresa.modulos.map(m => (
            <span key={m} className="card-modulo">
              {empresa.modulosLabel[m] || m}
            </span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        {!tieneAcceso && !esProyectos
          ? <span className="card-link-disabled">Acceso no autorizado</span>
          : puedeAbrir || (esProyectos && empresa.url)
            ? <span className="card-link" style={{ color: empresa.color }}>Ingresar al portal →</span>
            : <span className="card-link-disabled">En desarrollo</span>
        }
        <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)" }}>
          {empresa.modulos.length} módulos
        </span>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ─────────────────────────────────────────────────────────────
function AdminPanel({ onVolver }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]         = useState({});
  const [saved, setSaved]           = useState({});
  const [errorGuardar, setErrorGuardar] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc("get_usuarios_con_roles");
        if (error) throw error;
        setUsuarios((data || []).map(r => ({
          ...r,
          empresas: r.empresas || [],
          modulos:  r.modulos  || [],
        })));
      } catch (e) {
        console.error("Error cargando usuarios:", e.message);
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
    // Guardar estado anterior para revertir si falla
    const anterior = usuarios.find(u => u.user_id === userId);
    setSaving(s => ({ ...s, [userId]: true }));
    setErrorGuardar("");
    // Optimistic update
    setUsuarios(prev => prev.map(u => u.user_id === userId ? { ...u, empresas, modulos } : u));
    try {
      const { data: updateData, error: updateError } = await supabase
        .from("user_roles").update({ empresas, modulos })
        .eq("user_id", userId).select();
      if (updateError) throw updateError;
      if (!updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from("user_roles").insert({ user_id: userId, empresas, modulos });
        if (insertError) throw insertError;
      }
      setSaved(s => ({ ...s, [userId]: true }));
      setTimeout(() => setSaved(s => ({ ...s, [userId]: false })), 2000);
    } catch (e) {
      console.error("ERROR GUARDAR:", e);
      setErrorGuardar("Error al guardar. Recargá la página e intentá nuevamente.");
      // Revertir optimistic update
      if (anterior) {
        setUsuarios(prev => prev.map(u => u.user_id === userId
          ? { ...u, empresas: anterior.empresas, modulos: anterior.modulos }
          : u
        ));
      }
    } finally {
      setSaving(s => ({ ...s, [userId]: false }));
    }
  };

  const colWidths = ["280px", ...EMPRESAS.map(() => "1fr")].join(" ");

  return (
    <div className="admin-content">
      <div className="admin-header-block" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <div className="admin-title">🔐 Administración de accesos</div>
          <div className="admin-subtitle">Gestioná empresas y módulos para cada usuario del sistema.</div>
        </div>
        <button onClick={onVolver} style={{ fontFamily:"var(--sans)", fontSize:12, fontWeight:600, color:"var(--blue)", background:"none", border:"1px solid var(--border)", padding:"8px 16px", borderRadius:8, cursor:"pointer" }}>
          ← Volver al inicio
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Cargando usuarios...</div>
      ) : (
        <>
          {errorGuardar && (
            <div style={{ background:"#FEE2E2", color:"#991B1B", border:"1px solid #FECACA", borderRadius:8, padding:"10px 16px", fontSize:12, marginBottom:16 }}>
              ⚠️ {errorGuardar}
            </div>
          )}
          <div className="admin-matrix">
          <div className="admin-matrix-header" style={{ display:"grid", gridTemplateColumns: colWidths }}>
            <div className="admin-cell-header">Usuario</div>
            {EMPRESAS.map(emp => (
              <div key={emp.id} className="admin-cell-header">{emp.nombre}</div>
            ))}
          </div>

          {usuarios.map(user => (
            <div key={user.user_id} className="admin-user-row" style={{ display:"grid", gridTemplateColumns: colWidths }}>
              <div className="admin-cell" style={{ flexDirection:"column", alignItems:"flex-start", gap:2 }}>
                <div className="admin-user-email">{user.email}</div>
                <div className="admin-user-id">{user.user_id.substring(0,16)}...</div>
                {saving[user.user_id] && <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)" }}>Guardando...</span>}
                {saved[user.user_id]  && <span className="admin-save-badge">✓ Guardado</span>}
              </div>

              {EMPRESAS.map(emp => {
                const tieneEmpresa = user.empresas.includes(emp.id);
                return (
                  <div key={emp.id} className="admin-cell" style={{ flexDirection:"column", alignItems:"flex-start", gap:6, background: tieneEmpresa ? `${emp.color}06` : "transparent" }}>
                    <label className="empresa-access-toggle">
                      <div className="toggle-switch">
                        <input type="checkbox" checked={tieneEmpresa} onChange={() => toggleEmpresa(user.user_id, emp.id, tieneEmpresa)} />
                        <span className="toggle-slider"></span>
                      </div>
                      <span className="empresa-access-label" style={{ color: tieneEmpresa ? emp.color : "var(--muted)", fontSize:11 }}>
                        {tieneEmpresa ? "Acceso" : "Sin acceso"}
                      </span>
                    </label>
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
        </>
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
          <div className="header-integra-logo">
            <img src="/integralogo.png" alt="INTEGRA" />
          </div>
          <div className="header-divider" />
          <div>
            <div className="header-main">INTEGRA</div>
            <div className="header-sub">ERP · Plataforma Documental Marítima & Logística</div>
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
        <AdminPanel onVolver={() => setTab("home")} />
      ) : (
        <>
          <div className="hero">
            <div className="hero-content">
              <div className="hero-eyebrow">ERP · Plataforma Documental Marítima & Logística</div>
              <h1 className="hero-title"><span>INTEGRA</span></h1>
              <div className="hero-line" />
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
            <div className="footer-left">INTEGRA · Plataforma Documental Marítima & Logística · Confidencial</div>
            <div className="footer-right">v2.0 — {new Date().getFullYear()}</div>
          </footer>
        </>
      )}
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession]                       = useState(null);
  const [empresasPermitidas, setEmpresasPermitidas] = useState([]);
  const [loading, setLoading]                       = useState(true);

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
      const { data, error } = await supabase
        .from("user_roles").select("empresas").eq("user_id", userId).maybeSingle();
      if (error) console.error("Error cargando roles:", error.message);
      setEmpresasPermitidas(data?.empresas || []);
    } catch {
      setEmpresasPermitidas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  if (loading) return (
    <div className="loading-page">
      <style>{CSS}</style>
      <div className="loading-inner">
        <div className="loading-integra-logo">
          <img src="/integralogo.png" alt="INTEGRA" />
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
