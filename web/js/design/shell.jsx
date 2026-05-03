/* global React, I */
const { useState, useEffect, useRef } = React;

// ── Phone frame (adaptive — scales + on small viewports goes fullscreen) ──
function PhoneFrame({ children, w=390, h=820 }) {
  const [mode, setMode] = useState(() => computeMode(w, h));
  useEffect(() => {
    const onResize = () => setMode(computeMode(w, h));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [w, h]);

  // Fullscreen mode for narrow viewports — no bezel, fills the screen
  if (mode.fullscreen) {
    return (
      <div style={{
        width: "100vw", height: "100dvh", maxWidth: "100%",
        background:"#000", position:"relative", overflow:"hidden",
      }}>
        <div style={{ width:"100%", height:"100%", background:"#000", position:"relative" }}>
          {children}
        </div>
      </div>
    );
  }

  // Bezel mode — scale down if needed so it always fits
  return (
    <div style={{
      width: w * mode.scale, height: h * mode.scale,
      display:"flex", justifyContent:"center", alignItems:"center",
    }}>
      <div style={{
        width: w, height: h, position:"relative",
        borderRadius: 48, padding: 12,
        background: "linear-gradient(160deg,#1a1410,#3a2a22)",
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.1) inset",
        transform: `scale(${mode.scale})`,
        transformOrigin: "center center",
      }}>
        <div style={{
          position:"absolute", top:8, left:"50%", transform:"translateX(-50%)",
          width: 110, height: 28, background:"#000", borderRadius:20, zIndex:30
        }}/>
        <div style={{
          width:"100%", height:"100%", borderRadius:38, overflow:"hidden",
          background:"#000", position:"relative",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function computeMode(w, h) {
  if (typeof window === "undefined") return { scale:1, fullscreen:false };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // Below 480px wide, drop the bezel — phone-sized device, just fill
  if (vw < 480) return { scale:1, fullscreen:true };
  // Otherwise scale to fit — leave 40px room each side
  const sw = (vw - 40) / w;
  const sh = (vh - 40) / h;
  const scale = Math.min(1, sw, sh);
  return { scale, fullscreen:false };
}

// ── Status bar (simple) ──
function StatusBar({ dark=false }) {
  const c = dark ? "#fff" : "var(--c-ink)";
  return (
    <div style={{
      direction:"ltr",
      height: 36, paddingTop: 4,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"6px 26px 0",
      fontFamily:"-apple-system, sans-serif",
      fontSize: 14, fontWeight: 600, color: c,
      flex:"0 0 auto",
      background:"transparent",
      position:"relative", zIndex:20,
    }}>
      <span>9:41</span>
      <div style={{ display:"flex", gap:5, alignItems:"center" }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><path fill={c} d="M1 7h2v3H1zm4-2h2v5H5zm4-2h2v7H9zm4-2h2v9h-2z"/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke={c} strokeWidth="1.2"><path d="M.5 4a10 10 0 0 1 14 0M3 6.5a6.5 6.5 0 0 1 9 0M5.5 9a3 3 0 0 1 4 0"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x=".5" y=".5" width="21" height="11" rx="2.5" fill="none" stroke={c} opacity="0.4"/><rect x="2" y="2" width="18" height="8" rx="1.5" fill={c}/><rect x="22" y="4" width="2" height="4" rx="1" fill={c} opacity="0.4"/></svg>
      </div>
    </div>
  );
}

// ── Top band: red brocade with title + optional back button ──
function TopBand({ title, subtitle, onBack, right, big=false, children }) {
  return (
    <div className="top-band" style={{ paddingTop: 0 }}>
      <StatusBar dark={true}/>
      <div style={{ padding: big ? "8px 18px 12px" : "6px 18px 10px", position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:28 }}>
          <div style={{ width: 32 }}>
            {onBack && (
              <button onClick={onBack} className="tap" style={{
                width:32, height:32, borderRadius:"50%",
                background:"rgba(255,255,255,0.12)", border:0, color:"#fff",
                display:"grid", placeItems:"center", cursor:"pointer"
              }} aria-label="חזור">
                <I.ChevR size={16}/>
              </button>
            )}
          </div>
          <div style={{ flex:1, textAlign:"center" }}>
            <h1 className="page-title" style={{ fontSize: big ? 20 : 17, margin:0 }}>{title}</h1>
            {subtitle && <div className="page-subtitle" style={{fontSize:11}}>{subtitle}</div>}
          </div>
          <div style={{ width: 32, display:"flex", justifyContent:"flex-end" }}>{right}</div>
        </div>
        {children}
      </div>
      <div className="gold-line"/>
    </div>
  );
}

// ── Bottom tab bar ──
// In RTL, flex first child is RIGHTMOST. Order: profile (right), home (center), media (left).
function TabBar({ tab, setTab }) {
  const tabs = [
    { id:"profile", label:"פרופיל", img:"assets/nav_profile_icon.png" },
    { id:"home",    label:"למד",    img:"assets/nav_home_icon.png" },
    { id:"media",   label:"מדיה",   img:"assets/nav_media_icon.png" },
  ];
  return (
    <div className="tab-bar">
      {tabs.map(t => (
        <button key={t.id}
          className="tab-btn"
          data-active={tab===t.id}
          onClick={()=>setTab(t.id)}
        >
          <div className="tab-icon">
            <img src={t.img} alt="" draggable={false}/>
          </div>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Decorative background (clean — no flowers) ──
function InkBackground({ variant="path" }) {
  return (
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }}
         viewBox="0 0 390 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="mtnG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(178,58,45,0.06)"/>
          <stop offset="100%" stopColor="rgba(178,58,45,0)"/>
        </linearGradient>
      </defs>
      <path d="M0 720 Q 60 580, 120 640 T 240 600 T 390 660 L 390 800 L 0 800 Z" fill="url(#mtnG)"/>
    </svg>
  );
}

// ── XP / streak chip used in top band ──
function StatChip({ icon, value, color }) {
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:"rgba(255,255,255,0.15)",
      backdropFilter:"blur(10px)",
      padding:"5px 10px", borderRadius:999,
      fontSize:13, fontWeight:700, color:"#fff",
      border:"1px solid rgba(255,255,255,0.2)",
    }}>
      <span style={{ color: color || "#fff", display:"inline-flex" }}>{icon}</span>
      <span>{value}</span>
    </div>
  );
}

window.PhoneFrame = PhoneFrame;
window.TopBand = TopBand;
window.TabBar = TabBar;
window.StatusBar = StatusBar;
window.InkBackground = InkBackground;
window.StatChip = StatChip;
