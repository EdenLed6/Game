/* global React, I, KIMURA, TopBand, StatChip, InkBackground */
const { useState: us4, useRef: ur4 } = React;

// ─── Profile ─────────────────────────────
function ProfileScreen() {
  const u = KIMURA.user;
  const [name, setName] = us4(u.name);
  const [editing, setEditing] = us4(false);
  const [avatar, setAvatar] = us4(null); // dataURL of uploaded image
  const fileRef = ur4(null);
  const xpPct = Math.round((u.xp/u.xpNext)*100);

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target.result);
    reader.readAsDataURL(f);
  };

  return (
    <div className="kimura-screen screen-enter">
      <TopBand title="הפרופיל שלי" subtitle={<span className="jp" style={{letterSpacing:2}}>私のプロフィール</span>} big/>
      <div className="kimura-content">
        <div style={{ position:"relative", padding:"18px 18px 28px", zIndex:1 }}>
          {/* Profile card — sits below top-band so it's fully visible & editable */}
          <div className="card" style={{ padding:18, position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              {/* Avatar — clickable to change image */}
              <button
                onClick={()=>fileRef.current && fileRef.current.click()}
                aria-label="שנה תמונת פרופיל"
                style={{
                  width:72, height:72, borderRadius:"50%",
                  background: avatar ? `center/cover no-repeat url(${avatar})` : "linear-gradient(160deg,var(--c-red),var(--c-red-deep))",
                  display:"grid", placeItems:"center", color:"#fff", flex:"0 0 auto",
                  boxShadow:"0 8px 18px -8px var(--c-red-deep)", border:"3px solid var(--c-cream-4)",
                  position:"relative", cursor:"pointer", padding:0
                }}>
                {!avatar && <span className="jp" style={{ fontSize:32, fontWeight:600 }}>{u.nameJp[0]}</span>}
                {/* Camera badge */}
                <span style={{
                  position:"absolute", bottom:-2, left:-2,
                  width:26, height:26, borderRadius:"50%",
                  background:"var(--c-cream-4)", border:"2px solid var(--c-red)",
                  display:"grid", placeItems:"center", color:"var(--c-red-deep)", fontSize:13
                }}>📷</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>

              <div style={{ flex:1, minWidth:0 }}>
                {editing ? (
                  <input
                    autoFocus
                    value={name}
                    onChange={e=>setName(e.target.value)}
                    onBlur={()=>setEditing(false)}
                    onKeyDown={e=>{ if(e.key==="Enter") setEditing(false); }}
                    style={{
                      fontFamily:"var(--f-he)", fontSize:20, fontWeight:700, lineHeight:1.2,
                      width:"100%", border:"2px solid var(--c-red)", borderRadius:8,
                      padding:"4px 8px", background:"#fff", outline:"none", color:"var(--c-ink)"
                    }}/>
                ) : (
                  <button onClick={()=>setEditing(true)} style={{
                    background:"none", border:0, padding:0, cursor:"pointer",
                    fontFamily:"var(--f-he)", fontSize:20, fontWeight:700, lineHeight:1.2,
                    color:"var(--c-ink)", textAlign:"right", display:"inline-flex", alignItems:"center", gap:6
                  }}>
                    {name}
                    <span style={{ fontSize:13, color:"var(--c-red)", opacity:0.7 }}>✎</span>
                  </button>
                )}
                <div style={{ fontSize:12, color:"var(--c-ink-soft)", marginTop:4 }}>רמה {u.level} · תלמיד מתקדם</div>
              </div>
            </div>
            <div className="progress-track" style={{ marginTop:14, height:6 }}>
              <div className="progress-fill" style={{ width: xpPct+"%" }}/>
            </div>
            <div style={{ fontSize:11, color:"var(--c-ink-soft)", marginTop:4, textAlign:"left" }}>{u.xp} / {u.xpNext} XP</div>
          </div>

          {/* Big stats */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:14 }}>
            <BigStat icon={<I.Flame size={20}/>} value={u.streak} label="ימים רצוף" tint="#FFB87A"/>
            <BigStat icon={<I.Bolt size={20}/>} value={u.xp} label="סה״כ XP" tint="#C99A4B"/>
            <BigStat icon={<I.Trophy size={20}/>} value="3" label="הישגים" tint="var(--c-red)"/>
          </div>

          {/* Achievements */}
          <h3 style={{ fontFamily:"var(--f-he)", fontSize:16, fontWeight:700, margin:"22px 0 10px" }}>הישגים</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10 }}>
            {KIMURA.ach.map(a => (
              <div key={a.id} className="card lift" style={{
                padding:14, display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                opacity: a.earned?1:0.55, position:"relative"
              }}>
                <div style={{
                  width:54, height:54, borderRadius:"50%",
                  background: a.earned?"linear-gradient(160deg, var(--c-red), var(--c-red-deep))":"var(--c-cream-3)",
                  color: a.earned?"#fff":"var(--c-ink-soft)",
                  display:"grid", placeItems:"center"
                }}>
                  <span className="jp" style={{ fontSize:24, fontWeight:600 }}>{a.glyph}</span>
                </div>
                <div style={{ fontSize:11, fontWeight:700, textAlign:"center", color:"var(--c-ink)" }}>{a.name}</div>
                {!a.earned && <div style={{ position:"absolute", top:8, left:8, color:"var(--c-ink-soft)" }}><I.Lock size={12}/></div>}
              </div>
            ))}
          </div>

          {/* Weekly activity */}
          <h3 style={{ fontFamily:"var(--f-he)", fontSize:16, fontWeight:700, margin:"22px 0 10px" }}>פעילות שבועית</h3>
          <div className="card" style={{ padding:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", height:90, gap:6, direction:"ltr" }}>
              {[40,60,80,30,90,70,50].map((h, i) => (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ width:"100%", height: h+"%", borderRadius:"6px 6px 2px 2px",
                    background: i===6?"linear-gradient(180deg, var(--c-red), var(--c-red-deep))":"linear-gradient(180deg, var(--c-cream-3), var(--c-cream-2))" }}/>
                  <span style={{ fontSize:10, color:"var(--c-ink-soft)" }}>{["א","ב","ג","ד","ה","ו","ש"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function BigStat({ icon, value, label, tint }) {
  return (
    <div className="card" style={{ padding:14, textAlign:"center" }}>
      <div style={{ color:tint, display:"inline-flex", marginBottom:4 }}>{icon}</div>
      <div style={{ fontFamily:"var(--f-he)", fontSize:22, fontWeight:700 }}>{value}</div>
      <div style={{ fontSize:11, color:"var(--c-ink-soft)", marginTop:1 }}>{label}</div>
    </div>
  );
}

// ─── Media ─────────────────────────────
function MediaScreen() {
  const [filter, setFilter] = us4("all");
  const items = KIMURA.media.filter(m => filter==="all" || m.kind===filter);
  const filters = [
    { id:"all", label:"הכל" },
    { id:"video", label:"וידאו", icon:<I.Media size={14}/> },
    { id:"audio", label:"שמע", icon:<I.Headphones size={14}/> },
    { id:"article", label:"מאמרים", icon:<I.FileText size={14}/> },
    { id:"music", label:"מוזיקה", icon:<I.MusicNote size={14}/> },
  ];
  const iconFor = (k) => k==="video"?<I.Media size={20}/> : k==="audio"?<I.Headphones size={20}/> : k==="music"?<I.MusicNote size={20}/> : <I.FileText size={20}/>;
  return (
    <div className="kimura-screen screen-enter">
      <TopBand title="תכנים נוספים" subtitle={<span className="jp" style={{letterSpacing:2}}>追加コンテンツ</span>} big/>
      <div className="kimura-content" style={{ padding:"18px 18px 28px" }}>
        {/* Featured */}
        <div className="card lift" style={{ padding:0, overflow:"hidden", cursor:"pointer", position:"relative" }}>
          <div style={{ height:140, background:"linear-gradient(160deg, var(--c-red) 0%, var(--c-red-deep) 100%)", position:"relative", display:"flex", alignItems:"flex-end", padding:14 }}>
            <div className="hanko" style={{ position:"absolute", top:14, left:14, transform:"rotate(-6deg)" }}>新</div>
            <div className="jp" style={{ position:"absolute", right:-10, top:-20, fontSize:160, color:"rgba(255,255,255,0.08)", fontWeight:600 }}>桜</div>
            <div style={{ color:"#fff", position:"relative", zIndex:1 }}>
              <div style={{ fontSize:11, fontWeight:700, opacity:0.85, letterSpacing:"0.06em" }}>מומלץ השבוע</div>
              <div style={{ fontFamily:"var(--f-he)", fontSize:20, fontWeight:700, marginTop:2 }}>טקס התה היפני</div>
            </div>
          </div>
          <div style={{ padding:"12px 14px", display:"flex", alignItems:"center", gap:10 }}>
            <button className="btn-icon" style={{ width:38, height:38 }}><I.Play size={14}/></button>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>וידאו · 12:08</div>
              <div style={{ fontSize:11, color:"var(--c-ink-soft)" }}>הסבר תרבותי</div>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", padding:"14px 0 4px", marginInline:-2 }}>
          {filters.map(f => (
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{
              flex:"0 0 auto", display:"inline-flex", alignItems:"center", gap:5,
              padding:"7px 12px", borderRadius:999, border:0, cursor:"pointer",
              background: filter===f.id?"var(--c-red)":"var(--c-cream-2)",
              color: filter===f.id?"#fff":"var(--c-ink-soft)",
              fontWeight:700, fontSize:13, fontFamily:"var(--f-he-sans)",
            }}>{f.icon}{f.label}</button>
          ))}
        </div>

        {/* List */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:6 }}>
          {items.map(m => (
            <div key={m.id} className="card lift" style={{ padding:12, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
              <div style={{
                width:54, height:54, borderRadius:14, flex:"0 0 auto",
                background:"linear-gradient(160deg, var(--c-red-soft), var(--c-red-deep))",
                color:"#fff", display:"grid", placeItems:"center"
              }}>
                <span className="jp" style={{ fontSize:24, fontWeight:600 }}>{m.glyph}</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"var(--f-he)", fontSize:15, fontWeight:700, color:"var(--c-ink)" }}>{m.title}</div>
                <div style={{ fontSize:11, color:"var(--c-ink-soft)", marginTop:2 }}>{m.tag} · {m.duration}</div>
              </div>
              <button className="btn-icon" style={{ width:36, height:36, background:"var(--c-cream-2)", color:"var(--c-red-deep)" }}>
                {iconFor(m.kind)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.ProfileScreen = ProfileScreen;
window.MediaScreen = MediaScreen;
