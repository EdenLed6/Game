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

  // Show TweaksPanel (theme picker) only when the URL includes ?tweaks
  // — otherwise it's debug UI that shouldn't appear in production.
  const showTweaks = typeof window !== "undefined" &&
    window.location.search.indexOf("tweaks") !== -1;

  return (
    <div style={{ display:"flex", flex:"1 1 auto", minHeight:0, width:"100%" }}>
      <PhoneFrame>
        <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", background:"var(--c-cream)" }}>
          <div style={{ flex:1, minHeight:0, position:"relative" }}>
            {body}
          </div>
          {showTabs && <TabBar tab={tab} setTab={setTab}/>}
        </div>
      </PhoneFrame>

      {showTweaks && (
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
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
