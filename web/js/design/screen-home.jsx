/* global React, I, KIMURA, KIMURA_CHAPTERS, TopBand, StatChip */
const { useState: useState_h } = React;

// ─── Lesson Path (Home) ─────────────────────────────
function HomeScreen({ onOpenLesson, setTab }) {
  const u = KIMURA.user;
  const xpPct = Math.round((u.xp / u.xpNext) * 100);

  // Group units by chapter
  const byChapter = KIMURA_CHAPTERS.map(ch => ({
    ...ch,
    units: KIMURA.units.filter(uu => uu.chapterId === ch.id),
  }));

  return (
    <div className="kimura-screen screen-enter">
      <TopBand
        title={<img src="assets/kimura_logo.png" alt="קימורה" style={{height:30, filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.3)) brightness(0) invert(1)"}}/>}
        onBack={null}
        right={
          <button className="tap" style={{
            width:32, height:32, borderRadius:"50%", background:"rgba(255,255,255,0.12)", border:0, color:"#fff",
            display:"grid", placeItems:"center", cursor:"pointer"
          }} aria-label="הגדרות"><I.Settings size={16}/></button>
        }
      >
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:6, flexWrap:"wrap" }}>
          <StatChip icon={<I.Flame size={12}/>} value={`${u.streak} ימים`} color="#FFB87A"/>
          <StatChip icon={<I.Bolt size={12}/>} value={`${u.xp} XP`} color="#FFE1A8"/>
          <StatChip icon={<I.Heart size={12}/>} value={u.hearts} color="#FFB7B1"/>
        </div>
        <div className="progress-track" style={{ marginTop:6, background:"rgba(255,255,255,0.18)", height:5 }}>
          <div className="progress-fill" style={{ width: xpPct+"%", background:"linear-gradient(90deg, #FFE1A8, #FFB87A)" }}/>
        </div>
      </TopBand>

      <div className="kimura-content">
        <div style={{ position:"relative", padding:"18px 16px 28px", zIndex:1 }}>
          {byChapter.map((ch, idx) => (
            <ChapterBlock key={ch.id} chapter={ch} firstChapter={idx===0} onOpenLesson={onOpenLesson}/>
          ))}

          {/* Daily review */}
          <div style={{ marginTop:24 }}>
            <SectionHeader>תרגול נוסף</SectionHeader>
            <div className="card" style={{ padding:16, display:"flex", alignItems:"center", gap:12 }}>
              <div className="hanko" style={{transform:"rotate(-6deg)", flex:"0 0 auto"}}>復</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color:"var(--c-ink)" }}>חזרה יומית</div>
                <div style={{ fontSize:11, color:"var(--c-ink-soft)", marginTop:2 }}>15 כרטיסיות שצריך לרענן</div>
              </div>
              <button className="btn btn-primary" style={{ padding:"9px 14px", fontSize:13 }} onClick={()=>onOpenLesson(KIMURA.units[3])}>התחילו</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Chapter block: header + zigzag list of lessons ──
function ChapterBlock({ chapter, firstChapter, onOpenLesson }) {
  const completedCount = chapter.units.filter(u => u.state === "completed").length;
  const total = chapter.units.length;
  const pct = Math.round((completedCount / total) * 100);

  return (
    <div style={{ marginBottom: 22 }}>
      {/* Chapter banner */}
      <div style={{
        position:"relative",
        background:"linear-gradient(135deg, var(--c-red-deep), var(--c-red))",
        color:"#fff",
        borderRadius: 16,
        padding:"12px 16px",
        marginBottom: 14,
        boxShadow:"0 6px 16px -10px rgba(178,58,45,0.5)",
        overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-20, left:-12, fontFamily:"var(--f-jp)", fontSize:90, opacity:0.08, lineHeight:1, fontWeight:700 }}>章</div>
        <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:10, fontWeight:600, opacity:0.7, letterSpacing:"0.1em", textTransform:"uppercase" }}>Chapter {chapter.id}</div>
            <div style={{ fontFamily:"var(--f-he)", fontSize:15, fontWeight:700, marginTop:1, lineHeight:1.2 }}>{chapter.title.replace(/^פרק \d+ · /, "")}</div>
          </div>
          <div style={{ flex:"0 0 auto", textAlign:"left" }}>
            <div style={{ fontSize:11, opacity:0.85 }}>{completedCount}/{total}</div>
            <div style={{ width:48, height:4, background:"rgba(255,255,255,0.25)", borderRadius:2, marginTop:4, overflow:"hidden" }}>
              <div style={{ width: pct+"%", height:"100%", background:"#FFE1A8" }}/>
            </div>
          </div>
        </div>
      </div>

      {/* Zigzag lesson nodes */}
      <ol style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:14 }}>
        {chapter.units.map((unit, i) => {
          const align = i % 2 === 0 ? "flex-start" : "flex-end";
          return (
            <li key={unit.id} style={{ display:"flex", justifyContent: align, position:"relative" }}>
              <UnitNode unit={unit} index={i} onClick={() => unit.state!=="locked" && onOpenLesson(unit)} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
      <span style={{ flex:"0 0 auto", width:24, height:1, background:"var(--c-ink-soft)", opacity:0.3 }}/>
      <h3 style={{
        margin:0, fontFamily:"var(--f-he)", fontWeight:700, fontSize:13,
        letterSpacing:"0.06em", color:"var(--c-ink-soft)",
      }}>{children}</h3>
      <span style={{ flex:1, height:1, background:"var(--c-ink-soft)", opacity:0.15 }}/>
    </div>
  );
}

function UnitNode({ unit, index, onClick }) {
  const isLocked = unit.state === "locked";
  const isCurrent = unit.state === "current";
  const isDone = unit.state === "completed";
  return (
    <div onClick={onClick} style={{ display:"flex", alignItems:"center", gap:12, cursor: isLocked?"not-allowed":"pointer", maxWidth:"86%" }}>
      <div className={`path-node ${isLocked?"locked":""} ${isCurrent?"current":""} ${isDone?"completed":""}`}>
        {isLocked ? <I.Lock size={26}/> : <span style={{ fontSize: (unit.glyph||"").length > 1 ? 22 : 32, lineHeight:1 }}>{unit.glyph}</span>}
      </div>
      <div style={{ flex:1, paddingTop:2, minWidth:0 }}>
        <div style={{ fontSize:10, fontWeight:600, color:"var(--c-red-deep)", letterSpacing:"0.04em", display:"flex", alignItems:"center", gap:6 }}>
          <span>{unit.number}</span>
          {isCurrent && <span style={{ padding:"1px 7px", background:"var(--c-red)", color:"#fff", borderRadius:999, fontSize:9, fontWeight:700 }}>עכשיו</span>}
          {isDone && <I.Check size={11}/>}
        </div>
        <div style={{ fontFamily:"var(--f-he)", fontWeight:700, fontSize:15, color:"var(--c-ink)", marginTop:1, lineHeight:1.25, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
          {unit.title}
        </div>
        <div style={{ fontSize:11, color:"var(--c-ink-soft)", marginTop:1, fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic" }}>{unit.subtitle}</div>
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;
window.SectionHeader = SectionHeader;
