import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const EMPRESAS = [
  {
    id: "parana",
    nombre: "Parana Logística",
    descripcion: "Operaciones logísticas y marítimas. Gestión de flota, compras, víveres, mantenimiento y reparaciones.",
    icono: "🚢",
    logo: "/Cs.png",
    color: "#213363",
    url: "https://erp-portal-fawn.vercel.app",
    activo: true,
    modulos: ["Compras", "Víveres", "Projects", "Mantenimiento", "Reparaciones"],
    buques: ["Atlantic Dama", "Golondrina de Mar"],
  },
  {
    id: "cleansea",
    nombre: "Clean Sea",
    descripcion: "Operaciones de limpieza y servicios marítimos especializados.",
    icono: "⚓",
    logo: "/PL.png",
    color: "#1A7A6E",
    url: null,
    activo: false,
    modulos: ["Compras", "Mantenimiento"],
    buques: ["Clean Sea I", "Clean Sea II", "Clean Sea III"],
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
    modulos: ["Transporte Arena"],
    buques: [],
  },
  {
    id: "proyectos",
    nombre: "Evaluación de Proyectos",
    descripcion: "Herramientas de análisis para evaluación de inversiones y nuevos negocios del grupo.",
    icono: "📊",
    logo: null,
    color: "#7C3AED",
    url: null,
    activo: true,
    modulos: [],
    buques: [],
    esProyectos: true,
  },
];

const PROYECTOS = [
  {
    id: "ais-analyzer",
    nombre: "AIS Analyzer",
    descripcion: "Análisis AIS por viaje, etiquetado de servicios y modelo financiero integrado.",
    color: "#235C96",
    url: null,
    activo: false,
    tags: ["AIS", "TIR / VAN", "Base de zarpe"],
  },
  {
    id: "arena",
    nombre: "Transporte de Arena",
    descripcion: "Evaluación económica Zárate–SAE. Modelo Monte Carlo P10–P90.",
    color: "#854F0B",
    url: "https://terra-mare-portal-9w3x.vercel.app",
    activo: true,
    tags: ["Monte Carlo", "Logística fluvial"],
  },
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

/* GRID — 4 columnas */
.empresas-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
@media (max-width: 1100px) { .empresas-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 580px)  { .empresas-grid { grid-template-columns: 1fr; } }

/* EMPRESA CARD */
.empresa-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all .2s; position: relative; box-shadow: 0 2px 8px rgba(33,51,99,.06); display: flex; flex-direction: column; }
.empresa-card.activo { cursor: pointer; }
.empresa-card.activo:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(33,51,99,.14); border-color: var(--card-color); }
.empresa-card.inactivo { opacity: .65; }
.empresa-card.sin-acceso { opacity: .4; cursor: not-allowed; }
.empresa-card.es-proyectos { cursor: default; }
.empresa-card.es-proyectos:hover { transform: none; box-shadow: 0 2px 8px rgba(33,51,99,.06); border-color: var(--border); }

.card-banner { height: 6px; background: var(--card-color); flex-shrink: 0; }
.card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
.card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.card-logo { width: 52px; height: 52px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); background: #f8f8f8; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.card-logo img { width: 100%; height: 100%; object-fit: cover; }
.card-logo-icon { width: 52px; height: 52px; border-radius: 12px; background: var(--card-color); opacity: .15; display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0; }
.card-logo-icon-inner { width: 52px; height: 52px; border-radius: 12px; border: 1px solid var(--card-color); display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0; background: linear-gradient(135deg, #f8f0ff 0%, #ede9fe 100%); }

.badge-activo { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; letter-spacing: .5px; text-transform: uppercase; white-space: nowrap; }
.badge-prox   { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #F3F4F6; color: #6B7280; border: 1px solid #E5E7EB; letter-spacing: .5px; text-transform: uppercase; white-space: nowrap; }
.badge-sin    { font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; letter-spacing: .5px; text-transform: uppercase; white-space: nowrap; }

.card-nombre { font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
.card-desc   { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 16px; }
.card-modulos { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 16px; }
.card-modulo  { font-family: var(--mono); font-size: 9px; padding: 2px 7px; background: #F0F4F8; border: 1px solid var(--border); border-radius: 4px; color: var(--muted); }
.card-buques  { font-size: 11px; color: var(--muted); margin-bottom: 18px; }
.card-buques span { font-weight: 500; color: var(--navy); }
.card-footer { padding: 14px 24px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: #F8FAFC; flex-shrink: 0; }
.card-link { font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px; letter-spacing: .3px; text-transform: uppercase; cursor: pointer; border: none; background: none; font-family: var(--sans); padding: 0; }
.card-link:hover { text-decoration: underline; }
.card-link-disabled { font-size: 11px; font-weight: 500; color: var(--muted); letter-spacing: .3px; }

/* SUB-PROYECTOS dentro de la card */
.proyectos-list { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.proyecto-item { border: 1px solid var(--border); border-left: 3px solid var(--proj-color); border-radius: 8px; padding: 10px 12px; transition: all .15s; }
.proyecto-item.clickable { cursor: pointer; }
.proyecto-item.clickable:hover { background: #F8FAFC; border-color: var(--proj-color); }
.proyecto-item-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.proyecto-item-nombre { font-size: 12px; font-weight: 700; color: var(--navy); }
.proyecto-item-desc   { font-size: 11px; color: var(--muted); line-height: 1.5; margin-bottom: 6px; }
.proyecto-item-tags   { display: flex; gap: 4px; flex-wrap: wrap; }
.proyecto-item-tag    { font-family: var(--mono); font-size: 8px; padding: 1px 6px; background: #F0F4F8; border: 1px solid var(--border); border-radius: 3px; color: var(--muted); }
.badge-mini-activo { font-family: var(--mono); font-size: 7px; font-weight: 700; padding: 2px 6px; border-radius: 3px; background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; letter-spacing: .3px; text-transform: uppercase; white-space: nowrap; }
.badge-mini-dev    { font-family: var(--mono); font-size: 7px; font-weight: 700; padding: 2px 6px; border-radius: 3px; background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE; letter-spacing: .3px; text-transform: uppercase; white-space: nowrap; }

/* FOOTER */
.footer { background: var(--navy); padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; }
.footer-left  { font-size: 11px; color: rgba(255,255,255,.3); font-family: var(--mono); }
.footer-right { font-size: 10px; color: rgba(255,255,255,.2); font-family: var(--mono); }

/* LOADING */
.loading-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--navy); }
.loading-inner { text-align: center; }
.loading-logos { display: flex; justify-content: center; gap: 10px; margin-bottom: 16px; }
.loading-logos img { width: 40px; height: 40px; border-radius: 50%; opacity: .6; animation: pulse 1.5s ease-in-out infinite; }
.loading-logos img:nth-child(2) { animation-delay: .2s; }
.loading-logos img:nth-child(3) { animation-delay: .4s; }
@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:.2} }
.loading-text { font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,.4); letter-spacing: 2px; text-transform: uppercase; }
`;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Email o contraseña incorrectos.");
    } catch {
      setError("Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logos">
          <img src="/PL.png" alt="Parana Logística" />
          <img src="/Cs.png" alt="Clean Sea" />
          <img src="/logo-tm.png" alt="Terra Mare Services" />
        </div>
        <div className="login-title">Grupo Marítimo ERP</div>
        <div className="login-sub">Sistema integrado de gestión</div>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="login-fg">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required autoFocus />
          </div>
          <div className="login-fg">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <div className="login-footer">© {new Date().getFullYear()} Grupo Marítimo · Acceso restringido</div>
      </div>
    </div>
  );
}

function ProyectosSubList() {
  return (
    <div className="proyectos-list">
      {PROYECTOS.map(p => (
        <div
          key={p.id}
          className={`proyecto-item ${p.activo && p.url ? "clickable" : ""}`}
          style={{ "--proj-color": p.color }}
          onClick={(e) => {
            e.stopPropagation();
            if (p.activo && p.url) window.open(p.url, "_blank");
          }}
        >
          <div className="proyecto-item-top">
            <span className="proyecto-item-nombre">{p.nombre}</span>
            {p.activo
              ? <span className="badge-mini-activo">● Activo</span>
              : <span className="badge-mini-dev">Dev</span>
            }
          </div>
          <div className="proyecto-item-desc">{p.descripcion}</div>
          <div className="proyecto-item-tags">
            {p.tags.map(t => <span key={t} className="proyecto-item-tag">{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmpresaCard({ empresa, tieneAcceso }) {
  const esProyectos = empresa.esProyectos;
  const puedeAbrir = !esProyectos && empresa.activo && empresa.url && tieneAcceso;
  const handleClick = () => { if (puedeAbrir) window.open(empresa.url, "_blank"); };

  let claseCard = "empresa-card";
  if (esProyectos) claseCard += " es-proyectos";
  else if (!tieneAcceso) claseCard += " sin-acceso";
  else if (!empresa.activo) claseCard += " inactivo";
  else claseCard += " activo";

  return (
    <div className={claseCard} style={{ "--card-color": empresa.color }} onClick={handleClick}>
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
          : (
            <>
              <div className="card-modulos">
                {empresa.modulos.map(m => <span key={m} className="card-modulo">{m}</span>)}
              </div>
              {empresa.buques.length > 0 && (
                <div className="card-buques">🚢 <span>{empresa.buques.join(", ")}</span></div>
              )}
            </>
          )
        }
      </div>

      <div className="card-footer">
        {esProyectos
          ? <span className="card-link-disabled">{PROYECTOS.length} proyectos</span>
          : !tieneAcceso
            ? <span className="card-link-disabled">Acceso no autorizado</span>
            : puedeAbrir
              ? <span className="card-link" style={{ color: empresa.color }}>Ingresar al portal →</span>
              : <span className="card-link-disabled">En desarrollo</span>
        }
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)" }}>
          {esProyectos
            ? `${PROYECTOS.filter(p => p.activo).length} activos`
            : `${empresa.modulos.length} módulos`
          }
        </span>
      </div>
    </div>
  );
}

function HomePage({ user, empresasPermitidas, onLogout }) {
  return (
    <>
      <header className="header">
        <div className="header-brand">
          <div className="header-logos">
            <img src="/PL.png" alt="Parana Logística" />
            <img src="/Cs.png" alt="Clean Sea" />
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
          <button className="logout-btn" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

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
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [empresasPermitidas, setEmpresasPermitidas] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch {
      setEmpresasPermitidas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  if (loading) {
    return (
      <div className="loading-page">
        <style>{CSS}</style>
        <div className="loading-inner">
          <div className="loading-logos">
            <img src="/PL.png" alt="PL" />
            <img src="/Cs.png" alt="CS" />
            <img src="/logo-tm.png" alt="TM" />
          </div>
          <div className="loading-text">Cargando...</div>
        </div>
      </div>
    );
  }

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
