/* global React, ReactDOM, KIMURA, HomeScreen, ProfileScreen, MediaScreen,
   LessonScreen, PhoneFrame, TabBar, TweaksPanel, useTweaks, TweakSection, TweakRadio */
const { useState, useEffect } = React;

function App() {
  const [tab, setTab] = useState("home");
  const [view, setView] = useState({ name:"home" });
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "theme": "default"
  }/*EDITMODE-END*/);

  useEffect(()=>{
    document.documentElement.setAttribute("data-theme", tweaks.theme === "default" ? "" : tweaks.theme);
  }, [tweaks.theme]);

  const openLesson = (unit) => setView({ name:"lesson", unit });
  const home = () => { setView({ name:"home" }); setTab("home"); };

  let body;
  if (view.name === "home") {
    if (tab === "home")         body = <HomeScreen onOpenLesson={openLesson} setTab={setTab}/>;
    else if (tab === "media")   body = <MediaScreen/>;
    else if (tab === "profile") body = <ProfileScreen/>;
  }
  else if (view.name === "lesson") {
    body = <LessonScreen unit={view.unit} onBack={home} onComplete={home}/>;
  }

  const showTabs = view.name === "home";

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", padding:"30px 0" }}>
      <PhoneFrame>
        <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", background:"var(--c-cream)" }}>
          <div style={{ flex:1, minHeight:0, position:"relative" }}>
            {body}
          </div>
          {showTabs && <TabBar tab={tab} setTab={setTab}/>}
          {/* Home indicator */}
          <div style={{ height:24, background:"var(--c-cream-4)", display:"grid", placeItems:"center", flex:"0 0 auto" }}>
            <div style={{ width:120, height:4, borderRadius:2, background:"var(--c-ink)", opacity:0.3 }}/>
          </div>
        </div>
      </PhoneFrame>

      <TweaksPanel title="Tweaks">
        <TweakSection title="ערכת צבעים">
          <TweakRadio
            value={tweaks.theme}
            onChange={(v)=>setTweak("theme", v)}
            options={[
              { value:"default", label:"אדום קרם" },
              { value:"indigo",  label:"אינדיגו" },
              { value:"sakura",  label:"סאקורה" },
              { value:"mono",    label:"מונוכרום" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
