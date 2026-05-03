/* global React, I, KIMURA, getLesson, speakJa, isSpeakable, confettiBurst, TopBand */
const { useState: usL, useRef: urL, useMemo: umL, useEffect: ueL } = React;

// ─────────────────────────────────────────────────────────────────
// Unified LessonScreen — walks through phases of a real lesson
// ─────────────────────────────────────────────────────────────────
function LessonScreen({ unit, onBack, onComplete }) {
  const lesson = getLesson(unit.id);
  if (!lesson) return <div style={{padding:24}}>Lesson not found</div>;

  const phases = umL(() => {
    const list = [];
    if (lesson.videoUrl)               list.push({ kind:"video" });
    list.push({ kind:"intro" });
    if (lesson.grammarPoints?.length)  list.push({ kind:"grammar" });
    if (lesson.vocabulary?.length)     list.push({ kind:"vocab" });
    if (lesson.examples?.length)       list.push({ kind:"examples" });
    if (lesson.practiceCards?.length)  list.push({ kind:"practice" });
    if (lesson.exercises?.length)      list.push({ kind:"quiz" });
    list.push({ kind:"done" });
    return list;
  }, [lesson.id]);

  const [phaseIdx, setPhaseIdx] = usL(0);
  const [score, setScore] = usL(0);
  const [quizKey, setQuizKey] = usL(0); // bump to remount QuizPhase on retry
  const phase = phases[phaseIdx];

  // Find the index of the quiz phase, so retry can jump back to it
  const quizPhaseIdx = phases.findIndex(p => p.kind === "quiz");
  const retryQuiz = () => {
    setScore(0);
    setQuizKey(k => k + 1);
    if (quizPhaseIdx >= 0) setPhaseIdx(quizPhaseIdx);
  };

  const next = () => setPhaseIdx(i => Math.min(i+1, phases.length-1));
  const prev = () => phaseIdx === 0 ? onBack() : setPhaseIdx(i => i-1);

  const realPhases = phases.filter(p => p.kind !== "intro" && p.kind !== "done");
  const realIdx = phases.slice(0, phaseIdx).filter(p => p.kind !== "intro" && p.kind !== "done").length;
  const showProgress = phase.kind !== "intro" && phase.kind !== "done";
  const pct = phase.kind === "done" ? 100 : Math.round((realIdx / Math.max(1, realPhases.length)) * 100);

  return (
    <div className="kimura-screen screen-enter">
      <TopBand
        title={lesson.title}
        subtitle={lesson.number + " · " + lesson.subtitle}
        onBack={prev}
        right={
          <button onClick={onBack} className="tap" style={{
            width:32, height:32, borderRadius:"50%", background:"rgba(255,255,255,0.12)",
            border:0, color:"#fff", display:"grid", placeItems:"center", cursor:"pointer"
          }} aria-label="חזרה למסך הבית" title="חזרה למסך הבית">
            <I.Home size={16}/>
          </button>
        }
      />
      {showProgress && (
        <div style={{ padding:"8px 18px 0" }}>
          <div className="progress-track"><div className="progress-fill" style={{ width: pct+"%" }}/></div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"var(--c-ink-soft)", marginTop:5, fontWeight:600, letterSpacing:"0.04em" }}>
            <span>{phaseLabel(phase.kind)}</span>
            <span dir="ltr">{realIdx+1} / {realPhases.length}</span>
          </div>
        </div>
      )}

      <div className="kimura-content" style={{ padding: phase.kind==="done" ? "20px 18px" : "16px 18px 24px" }}>
        {phase.kind === "video"    && <VideoPhase    lesson={lesson} onNext={next} onSkip={next}/>}
        {phase.kind === "intro"    && <IntroPhase    lesson={lesson} onStart={next}/>}
        {phase.kind === "grammar"  && <GrammarPhase  lesson={lesson} onNext={next}/>}
        {phase.kind === "vocab"    && <VocabPhase    lesson={lesson} onNext={next}/>}
        {phase.kind === "examples" && <ExamplesPhase lesson={lesson} onNext={next}/>}
        {phase.kind === "practice" && <PracticePhase lesson={lesson} onNext={next}/>}
        {phase.kind === "quiz"     && <QuizPhase     key={quizKey} lesson={lesson} onNext={(s)=>{ setScore(s); next(); }}/>}
        {phase.kind === "done"     && <DonePhase     lesson={lesson} score={score} total={lesson.exercises.length} onBack={onComplete} onRetry={retryQuiz}/>}
      </div>
    </div>
  );
}

function phaseLabel(kind) {
  return ({
    video: "סרטון", grammar: "דקדוק", vocab: "אוצר מילים", examples: "דוגמאות",
    practice: "תרגול", quiz: "מבחן",
  })[kind] || "";
}

// ── Video phase ─────────────────────────────────────
// Vimeo: autoplay UNMUTED (browsers allow, since the click that triggers playback is the gesture)
// Visible default controls (fullscreen, speed, etc) via &controls=1
function VideoPhase({ lesson, onNext, onSkip }) {
  const [showPlayer, setShowPlayer] = usL(false);
  // Vimeo URL params: autoplay=1, muted=0 (unmuted), controls visible by default in Vimeo player
  const src = lesson.videoUrl + "?autoplay=1&muted=0&playsinline=1&title=0&byline=0&portrait=0";

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:14 }}>
      <div style={{
        position:"relative", aspectRatio:"16 / 10", borderRadius:16, overflow:"hidden",
        background:"#000", boxShadow:"0 10px 24px -10px rgba(0,0,0,0.4)",
      }}>
        {showPlayer ? (
          <iframe
            src={src}
            style={{ width:"100%", height:"100%", border:0 }}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            title={lesson.title}
          />
        ) : (
          <div style={{
            width:"100%", height:"100%", position:"relative",
            background:"linear-gradient(160deg, var(--c-red-deep), #2a0e0a)",
            display:"grid", placeItems:"center", cursor:"pointer",
          }} onClick={()=>setShowPlayer(true)}>
            <div className="jp" style={{ position:"absolute", inset:0, display:"grid", placeItems:"center", color:"rgba(255,255,255,0.06)", fontSize:200, fontWeight:700, lineHeight:1 }}>{lesson.glyph}</div>
            <div style={{ position:"relative", textAlign:"center", color:"#fff" }}>
              <div style={{
                width:72, height:72, borderRadius:"50%", background:"rgba(255,255,255,0.18)",
                backdropFilter:"blur(8px)", border:"2px solid rgba(255,255,255,0.4)",
                display:"grid", placeItems:"center", margin:"0 auto",
                boxShadow:"0 8px 24px rgba(0,0,0,0.4)",
              }}>
                <I.Play size={28}/>
              </div>
              <div style={{ fontFamily:"var(--f-he)", fontWeight:700, fontSize:16, marginTop:14 }}>{lesson.title}</div>
              <div style={{ fontSize:11, opacity:0.75, marginTop:2, fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic" }}>{lesson.subtitle}</div>
              <div style={{ fontSize:10, opacity:0.6, marginTop:8, letterSpacing:"0.1em" }}>הקש לניגון · עם קול</div>
            </div>
          </div>
        )}
      </div>

      {/* Controls hint row — clarify what's available */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <ControlHint icon={<I.Speaker size={11}/>} label="קול"/>
        <ControlHint icon={<FullscreenIcon/>}      label="מסך מלא"/>
        <ControlHint icon={<SpeedIcon/>}            label="מהירות"/>
        <ControlHint icon={<CCIcon/>}               label="כתוביות"/>
      </div>
      <div style={{ fontSize:11, color:"var(--c-ink-soft)", lineHeight:1.5 }}>
        כל הכפתורים זמינים בנגן עצמו (הצג/הסתר על-ידי הזזת העכבר/הקשה על הסרטון).
      </div>

      <div style={{ flex:1 }}/>

      <button className="btn btn-primary" style={{ width:"100%" }} onClick={onNext}>סיימתי לצפות ←</button>
      <button className="btn btn-ghost" style={{ width:"100%", marginTop:-6 }} onClick={onSkip}>דלגו על הסרטון</button>
    </div>
  );
}

function ControlHint({ icon, label }) {
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"5px 10px", borderRadius:999,
      background:"color-mix(in oklab, var(--c-gold) 14%, transparent)",
      color:"var(--c-ink)", fontSize:11, fontWeight:600,
    }}>{icon}<span>{label}</span></div>
  );
}
const FullscreenIcon = () => <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6"/></svg>;
const SpeedIcon = () => <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 13l4-3M9 3h6"/></svg>;
const CCIcon = () => <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M9 12h-1.5M9 14h-1.5M14 12h-1.5M14 14h-1.5"/></svg>;

// ── Intro phase ─────────────────────────────────────
function IntroPhase({ lesson, onStart }) {
  const sections = [];
  if (lesson.videoUrl)               sections.push({ icon:<I.Play size={14}/>,    label:"סרטון פתיחה",    count:"1" });
  if (lesson.grammarPoints?.length)  sections.push({ icon:<I.Book size={14}/>,    label:"דקדוק",          count: lesson.grammarPoints.length });
  if (lesson.vocabulary?.length)     sections.push({ icon:<I.Sparkle size={14}/>, label:"מילים",          count: lesson.vocabulary.length });
  if (lesson.examples?.length)       sections.push({ icon:<I.FileText size={14}/>,label:"דוגמאות",         count: lesson.examples.length });
  if (lesson.practiceCards?.length)  sections.push({ icon:<I.Refresh size={14}/>, label:"תרגול",          count: lesson.practiceCards.length });
  if (lesson.exercises?.length)      sections.push({ icon:<I.Trophy size={14}/>,  label:"מבחן",            count: lesson.exercises.length });

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div className="card" style={{ padding:24, textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div className="hanko" style={{ position:"absolute", top:14, left:14, transform:"rotate(-8deg)", width:46, height:46, fontSize:18 }}>{lesson.glyph}</div>
        <div style={{ fontSize:11, color:"var(--c-red-deep)", fontWeight:700, letterSpacing:"0.1em" }}>{lesson.number.toUpperCase()}</div>
        <h1 style={{ fontFamily:"var(--f-he)", fontSize:30, fontWeight:700, margin:"6px 0 4px", color:"var(--c-ink)" }}>{lesson.title}</h1>
        <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", fontSize:18, color:"var(--c-ink-soft)" }}>{lesson.subtitle}</div>
        <div className="jp" style={{ fontSize:80, color:"var(--c-red-deep)", lineHeight:1, marginTop:18, fontWeight:600 }}>{lesson.glyph}</div>
      </div>

      <div style={{ marginTop:18 }}>
        <div style={{ fontSize:11, color:"var(--c-ink-soft)", fontWeight:700, letterSpacing:"0.06em", marginBottom:10 }}>בשיעור הזה</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {sections.map((s, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"var(--c-cream-2)", borderRadius:12, border:"1px solid var(--c-cream-3)" }}>
              <div style={{ width:32, height:32, borderRadius:10, background:"color-mix(in oklab, var(--c-red) 12%, var(--c-cream-4))", display:"grid", placeItems:"center", color:"var(--c-red-deep)" }}>{s.icon}</div>
              <div style={{ flex:1, fontFamily:"var(--f-he)", fontWeight:700, fontSize:14 }}>{s.label}</div>
              <div style={{ fontSize:13, color:"var(--c-ink-soft)", fontWeight:600 }}>{s.count}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" style={{ width:"100%", marginTop:"auto", marginBlockStart:24 }} onClick={onStart}>
        התחל שיעור ←
      </button>
    </div>
  );
}

// ── Grammar phase ─────────────────────────────────
function GrammarPhase({ lesson, onNext }) {
  const [active, setActive] = usL(0);
  const points = lesson.grammarPoints;
  const p = points[active];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, height:"100%" }}>
      {points.length > 1 && (
        <div style={{ display:"flex", gap:6 }}>
          {points.map((g, i) => (
            <button key={i} onClick={()=>setActive(i)} className="tap" style={{
              flex:1, padding:"9px 6px", borderRadius:10, border:0, cursor:"pointer",
              background: i===active?"var(--c-red)":"var(--c-cream-2)",
              color: i===active?"#fff":"var(--c-ink-soft)",
              fontWeight:700, fontSize:12, fontFamily:"var(--f-he-sans)",
            }}>חלק {i+1}</button>
          ))}
        </div>
      )}

      <div className="card" style={{ padding:20, position:"relative", flex:1, overflow:"auto" }}>
        <div style={{ fontSize:11, color:"var(--c-red-deep)", fontWeight:700, letterSpacing:"0.06em" }}>דקדוק</div>
        <h2 style={{ fontFamily:"var(--f-he)", fontSize:20, fontWeight:700, margin:"4px 0 12px", color:"var(--c-ink)" }}>{p.title}</h2>
        <div style={{ fontSize:14, color:"var(--c-ink)", lineHeight:1.7, whiteSpace:"pre-wrap" }}>{p.content}</div>
      </div>

      {points.length > 1 && active < points.length - 1 ? (
        <button className="btn btn-primary" style={{ width:"100%" }} onClick={()=>setActive(a=>a+1)}>החלק הבא ←</button>
      ) : (
        <button className="btn btn-primary" style={{ width:"100%" }} onClick={onNext}>המשך לאוצר מילים ←</button>
      )}
    </div>
  );
}

// ── Vocab phase ─────────────────────────────────────
// Speaker button explicitly speaks ONLY romaji/japanese (never Hebrew)
function VocabPhase({ lesson, onNext }) {
  const [playing, setPlaying] = usL(-1);
  const list = lesson.vocabulary;

  const playVocab = (e, i, v) => {
    if (e) e.stopPropagation();
    // explicit: speak the Japanese pronunciation only
    setPlaying(i);
    speakJa(v.romaji || v.japanese);
    setTimeout(()=>setPlaying(-1), 900);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:14 }}>
      <div className="card" style={{ padding:0, overflow:"hidden", flex:1, display:"flex", flexDirection:"column", minHeight:0 }}>
        <div style={{ padding:"12px 14px", display:"flex", alignItems:"center", gap:10, background:"color-mix(in oklab, var(--c-red) 6%, transparent)", borderBottom:"1px solid var(--c-cream-3)", flex:"0 0 auto" }}>
          <I.Book size={16}/>
          <strong style={{ fontFamily:"var(--f-he)", fontSize:14 }}>{list.length} מילים</strong>
          <span style={{ marginInlineStart:"auto", fontSize:11, color:"var(--c-ink-soft)" }}>הקישו לשמיעה</span>
        </div>
        <div style={{ flex:1, overflow:"auto" }}>
          {list.map((v, i) => (
            <div key={i} className="vocab-row" onClick={(e)=>playVocab(e, i, v)} style={{ cursor:"pointer" }}>
              <div style={{ flex:"0 0 auto", fontSize:22, lineHeight:1 }}>{v.emoji}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", fontSize:19, fontWeight:600, color:"var(--c-red-deep)", lineHeight:1.15 }}>{v.romaji}</div>
                <div className="jp" style={{ fontSize:13, fontWeight:500, color:"var(--c-ink-soft)", lineHeight:1.2, marginTop:2 }}>{v.japanese}</div>
              </div>
              <div style={{ fontWeight:700, fontSize:13, color:"var(--c-ink)", textAlign:"start", flex:"0 0 auto", maxWidth:"40%", lineHeight:1.2 }}>{v.hebrew}</div>
              <button
                className={`btn-icon audio-pulse ${playing===i?"playing":""}`}
                style={{ width:32, height:32, flex:"0 0 auto" }}
                aria-label="השמע"
                onClick={(e)=>playVocab(e, i, v)}
                type="button"
              >
                <I.Speaker size={14}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" style={{ width:"100%" }} onClick={onNext}>המשך ←</button>
    </div>
  );
}

// ── Examples phase ──────────────────────────────────
function ExamplesPhase({ lesson, onNext }) {
  const list = lesson.examples;
  const [playing, setPlaying] = usL(-1);
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:14 }}>
      <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column", gap:10 }}>
        {list.map((ex, i) => (
          <div key={i} className="card" style={{ padding:16, position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
              <div style={{ fontSize:10, color:"var(--c-red-deep)", fontWeight:700, letterSpacing:"0.06em" }}>דוגמה {i+1}</div>
              {(ex.romaji || ex.japanese) && (
                <button className={`btn-icon audio-pulse ${playing===i?"playing":""}`} style={{ width:30, height:30, flex:"0 0 auto" }} aria-label="השמע" type="button" onClick={()=>{ setPlaying(i); speakJa(ex.romaji || ex.japanese); setTimeout(()=>setPlaying(-1), 1200); }}>
                  <I.Speaker size={13}/>
                </button>
              )}
            </div>
            {ex.romaji && (
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", color:"var(--c-red-deep)", fontSize:20, fontWeight:600, lineHeight:1.3, marginTop:6 }}>{ex.romaji}</div>
            )}
            {ex.japanese && (
              <div className="jp" style={{ fontSize:14, color:"var(--c-ink-soft)", fontWeight:500, lineHeight:1.4, marginTop:4 }}>{ex.japanese}</div>
            )}
            {ex.hebrew && (
              <div style={{ borderTop:"1px dashed var(--c-cream-3)", marginTop:10, paddingTop:10, fontSize:13, fontWeight:600, color:"var(--c-ink)", lineHeight:1.5 }}>{ex.hebrew}</div>
            )}
          </div>
        ))}
      </div>

      <button className="btn btn-primary" style={{ width:"100%" }} onClick={onNext}>לתרגול ←</button>
    </div>
  );
}

// ── Practice phase (with voice recording option) ─────────────
function PracticePhase({ lesson, onNext }) {
  const list = lesson.practiceCards;
  const [idx, setIdx] = usL(0);
  const [val, setVal] = usL("");
  const [verdict, setVerdict] = usL(null);
  const [shakeKey, setShakeKey] = usL(0);
  const [recording, setRecording] = usL(false);
  const [recError, setRecError] = usL(null);
  const recogRef = urL(null);
  const card = list[idx];

  const norm = (s) => (s||"").trim().toLowerCase().replace(/[\s\-_.,!?]/g, "");

  const submit = (text) => {
    const t = text != null ? text : val;
    if (!t.trim()) return;
    const ok = norm(t) === norm(card.answer);
    setVerdict(ok ? "correct" : "wrong");
    if (!ok) setShakeKey(k=>k+1);
  };
  const reveal = () => setVerdict("reveal");
  const nextCard = () => {
    if (idx >= list.length - 1) { onNext(); return; }
    setVerdict(null); setVal(""); setRecError(null); setIdx(i=>i+1);
  };

  // Voice recording (Web Speech Recognition)
  const startRecording = () => {
    setRecError(null);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setRecError("הקלטת קול אינה נתמכת בדפדפן הזה. נסו דפדפן אחר."); return; }
    try {
      const r = new SR();
      // Try Japanese first; falls back gracefully if engine doesn't support
      r.lang = "ja-JP";
      r.continuous = false;
      r.interimResults = false;
      r.maxAlternatives = 3;
      r.onresult = (ev) => {
        const alts = [];
        for (let i = 0; i < ev.results[0].length; i++) alts.push(ev.results[0][i].transcript);
        // pick best matching alternative
        let pick = alts[0];
        for (const a of alts) if (norm(a) === norm(card.answer)) { pick = a; break; }
        setVal(pick);
        setRecording(false);
        setTimeout(()=>submit(pick), 200);
      };
      r.onerror = (ev) => {
        setRecError(ev.error === "not-allowed" ? "אין הרשאת מיקרופון." : "ההקלטה נכשלה — נסו שוב.");
        setRecording(false);
      };
      r.onend = () => setRecording(false);
      recogRef.current = r;
      setRecording(true);
      r.start();
    } catch(e) { setRecError("לא ניתן להתחיל הקלטה."); setRecording(false); }
  };
  const stopRecording = () => { try { recogRef.current?.stop(); } catch(e){} setRecording(false); };
  ueL(() => () => { try { recogRef.current?.abort(); } catch(e){} }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:14 }}>
      <div className={`card ${shakeKey ? "shake":""}`} key={shakeKey} style={{ padding:20, flex:1, display:"flex", flexDirection:"column", gap:14, minHeight:0 }}>
        <div style={{ fontSize:10, color:"var(--c-red-deep)", fontWeight:700, letterSpacing:"0.06em" }}>{card.promptLabel} · {idx+1}/{list.length}</div>

        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10 }}>
          <SpeakableText text={card.prompt} style={{ fontFamily:"var(--f-he)", fontSize:24, fontWeight:700, color:"var(--c-ink)", textAlign:"center", lineHeight:1.3 }}/>
          {card.audioText && (
            <button className="btn-icon audio-pulse" type="button" onClick={()=>speakJa(card.audioText)} aria-label="השמע" style={{ marginTop:4 }}>
              <I.Speaker size={18}/>
            </button>
          )}
        </div>

        {verdict !== "correct" && verdict !== "reveal" && (
          <>
            <input
              value={val}
              onChange={e=>setVal(e.target.value)}
              onKeyDown={e=>{ if (e.key==="Enter") submit(); }}
              placeholder={card.inputHint || "תשובה..."}
              className="practice-input"
              dir="auto"
              autoFocus
            />
            <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center" }}>
              <div style={{ fontSize:11, color:"var(--c-ink-soft)" }}>או הקליטו את התשובה:</div>
              <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                className="tap"
                aria-label={recording ? "עצור הקלטה" : "הקלט תשובה"}
                style={{
                  width:42, height:42, borderRadius:"50%", border:0, cursor:"pointer",
                  background: recording ? "#C84B3A" : "var(--c-red)",
                  color:"#fff", display:"grid", placeItems:"center",
                  boxShadow: recording ? "0 0 0 6px color-mix(in oklab, #C84B3A 24%, transparent)" : "0 4px 10px -3px var(--c-red-deep)",
                  animation: recording ? "rec-pulse 1.2s ease-in-out infinite" : "none",
                }}
              >
                <I.Mic size={18}/>
              </button>
            </div>
            {recError && <div style={{ fontSize:11, color:"#C84B3A", textAlign:"center" }}>{recError}</div>}
          </>
        )}

        {(verdict === "correct" || verdict === "reveal") && (
          <div style={{ padding:"12px 14px", borderRadius:12, background: verdict==="correct" ? "color-mix(in oklab, var(--c-jade) 14%, var(--c-cream-4))" : "var(--c-cream-2)", border:"1px solid var(--c-cream-3)", textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, color:"var(--c-ink-soft)", fontWeight:700, letterSpacing:"0.06em" }}>תשובה</div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", fontSize:22, fontWeight:600, color:"var(--c-red-deep)", marginTop:4 }}>{card.answer}</div>
              {card.answerSub && <div style={{ fontSize:13, color:"var(--c-ink-soft)", marginTop:4 }}>{card.answerSub}</div>}
            </div>
            <button className="btn-icon audio-pulse" type="button" onClick={()=>speakJa(card.audioText || card.answer)} aria-label="השמע" style={{ width:36, height:36, flex:"0 0 auto" }}>
              <I.Speaker size={16}/>
            </button>
          </div>
        )}

        {verdict === "wrong" && (
          <div style={{ padding:"10px 12px", borderRadius:10, background:"color-mix(in oklab, #C84B3A 14%, var(--c-cream-4))", border:"1px solid color-mix(in oklab, #C84B3A 24%, transparent)", color:"var(--c-red-deep)", fontWeight:600, fontSize:13, textAlign:"center" }}>
            לא מדויק — נסו שוב או הציצו בתשובה
          </div>
        )}
      </div>

      {verdict === "correct" || verdict === "reveal" ? (
        <button className="btn btn-primary" style={{ width:"100%" }} onClick={nextCard}>
          {idx >= list.length - 1 ? "סיום תרגול ←" : "הבא ←"}
        </button>
      ) : (
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn btn-ghost" type="button" style={{ flex:1 }} onClick={reveal}>הצג תשובה</button>
          <button className="btn btn-primary" type="button" style={{ flex:1.4 }} onClick={()=>submit()} disabled={!val.trim()}>בדיקה</button>
        </div>
      )}
    </div>
  );
}

// SpeakableText: renders a string and inserts inline ▶ icons next to romaji/japanese tokens
// so the user can click to hear individual transliterated words within Hebrew prompts.
function SpeakableText({ text, style }) {
  if (!text) return null;
  // Tokenize: Japanese kana/kanji or contiguous A-Z/a-z'-ē tokens
  const re = /([\u3040-\u30ff\u4e00-\u9fff]+|[A-Za-zĀ-ž'"\-ʼ]+)/g;
  const parts = [];
  let last = 0; let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ kind:"text", val: text.slice(last, m.index) });
    parts.push({ kind:"speak", val: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind:"text", val: text.slice(last) });
  return (
    <div style={style}>
      {parts.map((p, i) => p.kind === "text"
        ? <span key={i}>{p.val}</span>
        : <SpeakableToken key={i} word={p.val}/>
      )}
    </div>
  );
}
function SpeakableToken({ word }) {
  const [playing, setPlaying] = usL(false);
  const isJP = /[\u3040-\u30ff\u4e00-\u9fff]/.test(word);
  return (
    <span
      onClick={(e)=>{ e.stopPropagation(); setPlaying(true); speakJa(word); setTimeout(()=>setPlaying(false), 800); }}
      style={{
        display:"inline-flex", alignItems:"center", gap:3, cursor:"pointer",
        padding: isJP ? "0 4px" : "0 3px",
        borderRadius:6,
        background: playing ? "color-mix(in oklab, var(--c-red) 18%, transparent)" : "color-mix(in oklab, var(--c-gold) 18%, transparent)",
        color:"var(--c-red-deep)",
        fontFamily: isJP ? "var(--f-jp)" : "'Cormorant Garamond', serif",
        fontStyle: isJP ? "normal" : "italic",
        fontWeight: 600,
        transition:"all .15s",
      }}
      title="הקש לשמיעה"
    >
      <span>{word}</span>
      <I.Speaker size={10}/>
    </span>
  );
}

// ── Quiz phase ──────────────────────────────────────
function QuizPhase({ lesson, onNext }) {
  const list = lesson.exercises;
  const [qi, setQi] = usL(0);
  const [picked, setPicked] = usL(null);
  const [verdict, setVerdict] = usL(null);
  const [score, setScore] = usL(0);
  const [shakeKey, setShakeKey] = usL(0);
  const [playingOpt, setPlayingOpt] = usL(-1);
  const burstHost = urL(null);

  const q = list[qi];

  const choose = (i) => { if (verdict) return; setPicked(i); };
  const submit = () => {
    if (picked == null) return;
    const ok = picked === q.correctIndex;
    setVerdict(ok ? "correct" : "wrong");
    if (ok) { setScore(s=>s+1); confettiBurst(burstHost.current); }
    else setShakeKey(k=>k+1);
  };
  const advance = () => {
    if (qi >= list.length - 1) {
      onNext(score + (verdict === "correct" ? 1 : 0));
      return;
    }
    setVerdict(null); setPicked(null); setQi(i=>i+1);
  };
  const playOpt = (e, i, text) => {
    e.stopPropagation();
    setPlayingOpt(i);
    speakJa(text); // strips Hebrew automatically
    setTimeout(()=>setPlayingOpt(-1), 900);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:12, position:"relative" }} ref={burstHost}>
      <div style={{ fontSize:10, color:"var(--c-ink-soft)", fontWeight:600 }}>שאלה {qi+1} מתוך {list.length} · ניקוד {score}</div>
      <div className={`card ${shakeKey ? "shake":""}`} key={shakeKey} style={{ padding:18, flex:"0 0 auto" }}>
        <SpeakableText text={q.question} style={{ fontFamily:"var(--f-he)", fontSize:17, fontWeight:700, lineHeight:1.6, color:"var(--c-ink)" }}/>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1, overflow:"auto" }}>
        {q.options.map((c, i) => {
          let state = picked===i ? "selected" : null;
          if (verdict) {
            if (i === q.correctIndex) state = "correct";
            else if (i === picked) state = "wrong";
          }
          const isJP = /[\u3040-\u30ff\u4e00-\u9fff]/.test(c);
          const speakable = isSpeakable(c);
          return (
            <div key={i} role="button" tabIndex={0} className="choice tap" data-state={state||""}
                 onClick={()=>choose(i)}
                 onKeyDown={(e)=>{ if (e.key==="Enter" || e.key===" ") { e.preventDefault(); choose(i); } }}>
              <span className="choice-num">{["א","ב","ג","ד","ה","ו"][i]}</span>
              <span style={{ flex:1, fontFamily: isJP ? "var(--f-jp)":"var(--f-he-sans)", fontSize: isJP?20:14, lineHeight:1.3, textAlign:"start" }}>{c}</span>
              {speakable && (
                <button
                  type="button"
                  className={`btn-icon audio-pulse ${playingOpt===i?"playing":""}`}
                  style={{ width:28, height:28, flex:"0 0 auto", background:"var(--c-cream-2)", color:"var(--c-red-deep)" }}
                  aria-label="השמע"
                  onClick={(e)=>playOpt(e, i, c)}
                >
                  <I.Speaker size={12}/>
                </button>
              )}
              {state==="correct" && <I.Check size={16}/>}
              {state==="wrong" && <I.Close size={16}/>}
            </div>
          );
        })}
      </div>

      {verdict && q.explanation && (
        <div style={{
          padding:"10px 12px", borderRadius:10, fontSize:12, lineHeight:1.5,
          background: verdict==="correct" ? "color-mix(in oklab, var(--c-jade) 14%, var(--c-cream-4))" : "var(--c-cream-2)",
          border:"1px solid var(--c-cream-3)", color:"var(--c-ink)",
        }}>
          <strong style={{ color:"var(--c-red-deep)", marginInlineEnd:6 }}>הסבר:</strong>{q.explanation}
        </div>
      )}

      {verdict ? (
        <button className="btn btn-primary" type="button" style={{ width:"100%" }} onClick={advance}>
          {qi >= list.length - 1 ? "סיום שיעור ←" : "הבא ←"}
        </button>
      ) : (
        <button className="btn btn-primary" type="button" style={{ width:"100%" }} onClick={submit} disabled={picked==null}>בדיקה</button>
      )}
    </div>
  );
}

// ── Done phase ──────────────────────────────────────
// PASS THRESHOLD: 80% — below that the lesson cannot be marked complete; user must retry quiz.
function DonePhase({ lesson, score, total, onBack, onRetry }) {
  const pct = total ? Math.round((score/total)*100) : 100;
  const PASS = 80;
  const passed = pct >= PASS;
  const grade = pct >= 90 ? "優" : pct >= 80 ? "良" : pct >= 60 ? "可" : "再";
  const xp = passed ? (score*15 + 30) : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", alignItems:"center", textAlign:"center", padding:"10px 0" }}>
      <div style={{
        width:130, height:130, borderRadius:"50%",
        background: passed
          ? "linear-gradient(160deg, var(--c-red), var(--c-red-deep))"
          : "linear-gradient(160deg, #8e7066, #5a4640)",
        display:"grid", placeItems:"center", color:"#fff",
        boxShadow: passed ? "0 14px 30px -10px var(--c-red-deep)" : "0 14px 30px -10px #2a1f1a",
        marginTop:18,
      }}>
        <div className="jp" style={{ fontSize:74, lineHeight:1, fontWeight:600 }}>{grade}</div>
      </div>
      <h2 style={{ fontFamily:"var(--f-he)", fontSize:24, fontWeight:700, marginTop:20, marginBottom:4 }}>
        {passed ? "שיעור הושלם!" : "כמעט שם..."}
      </h2>
      <div style={{ color:"var(--c-ink-soft)", fontSize:13 }}>{lesson.number} · {lesson.title}</div>

      <div className="card" style={{ width:"100%", padding:14, marginTop:22, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        <Stat label="XP" value={passed ? `+${xp}` : "—"} icon={<I.Bolt size={14}/>}/>
        <Stat label="דיוק" value={total ? pct+"%" : "—"} icon={<I.Trophy size={14}/>}/>
        <Stat label="ציון" value={grade} icon={<I.Star size={14}/>}/>
      </div>

      {total > 0 && (
        <div style={{ marginTop:14, fontSize:13, color:"var(--c-ink-soft)" }}>
          {score} מתוך {total} תשובות נכונות
        </div>
      )}

      {!passed && total > 0 && (
        <div style={{
          marginTop:14, padding:"12px 14px", borderRadius:12,
          background:"color-mix(in oklab, #C84B3A 12%, var(--c-cream-4))",
          border:"1px solid color-mix(in oklab, #C84B3A 24%, transparent)",
          color:"var(--c-red-deep)", fontSize:12, lineHeight:1.5, width:"100%",
        }}>
          <strong>נדרש ציון של {PASS}% לפחות</strong> כדי לסיים את השיעור.<br/>
          חזרו על המבחן ותצליחו!
        </div>
      )}

      {passed ? (
        <button className="btn btn-primary" type="button" style={{ width:"100%", marginTop:"auto" }} onClick={onBack}>חזרה למפת השיעורים</button>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8, width:"100%", marginTop:"auto" }}>
          <button className="btn btn-primary" type="button" style={{ width:"100%" }} onClick={onRetry}>
            <I.Refresh size={16}/> נסו שוב את המבחן
          </button>
          <button className="btn btn-ghost" type="button" style={{ width:"100%" }} onClick={onBack}>
            יציאה ללא השלמה
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div style={{ textAlign:"center", padding:"8px 4px", borderRadius:10, background:"var(--c-cream-2)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4, color:"var(--c-red-deep)", fontWeight:700, fontSize:16 }}>{icon}{value}</div>
      <div style={{ fontSize:10, color:"var(--c-ink-soft)", marginTop:2 }}>{label}</div>
    </div>
  );
}

window.LessonScreen = LessonScreen;
