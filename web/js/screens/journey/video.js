// video.js — Step 1 of LessonJourney (port of design's VideoPhase).
//
// Layout (per design_handoff_kimura_redesign/screen-lesson.jsx VideoPhase):
//
//   ┌─ video frame (16:10, black bg, rounded 16px) ──────────┐
//   │ Initial state: red-deep gradient placeholder + huge JP │
//   │   glyph @ 6% opacity in background, glassy round play  │
//   │   button + lesson title + subtitle + "הקש לניגון · עם  │
//   │   קול" hint. Tapping anywhere swaps in the iframe.     │
//   │ After tap: <iframe> with autoplay=1 muted=0 controls=1 │
//   └────────────────────────────────────────────────────────┘
//   ┌─ controls hint chips row ──────────────────────────────┐
//   │ [🔊 קול]  [⛶ מסך מלא]  [⏩ מהירות]  [CC כתוביות]      │
//   └────────────────────────────────────────────────────────┘
//   "כל הכפתורים זמינים בנגן עצמו..."
//
//   <button btn-primary> "סיימתי לצפות ←"
//   <button btn-ghost> "דלגו על הסרטון"
//
// The journey shell's continue button is hidden — phase has its own
// inline buttons (matches the design).

import { el } from "../../dom.js";

function buildVimeoUrl(rawUrl) {
  // Vimeo: autoplay=1 (since the click is the user gesture), muted=0
  // so audio plays, controls visible (no controls=0).
  const params = "autoplay=1&muted=0&playsinline=1&title=0&byline=0&portrait=0";
  if (typeof rawUrl !== "string" || rawUrl.length === 0) return "";
  const sep = rawUrl.includes("?") ? "&" : "?";
  return rawUrl + sep + params;
}

function controlChip(icon, label) {
  return el("div", { class: "video-chip" },
    el("span", { class: "video-chip__icon", "aria-hidden": "true" }, icon),
    el("span", { class: "video-chip__label" }, label),
  );
}

export function Video({ hostEl, lesson, journey }) {
  // Phase has its own action buttons; hide the shell's continue.
  journey.setContinueVisible(false);

  let showPlayer = false;

  function rebuild() {
    hostEl.innerHTML = "";
    hostEl.appendChild(buildPhase());
  }

  function play() {
    showPlayer = true;
    rebuild();
  }

  function buildPhase() {
    const frame = el("div", { class: "video-frame" });
    if (showPlayer) {
      const iframe = el("iframe", {
        class: "video-frame__iframe",
        src: buildVimeoUrl(lesson.videoUrl || ""),
        frameborder: "0",
        allow: "autoplay; fullscreen; picture-in-picture; encrypted-media",
        allowfullscreen: "",
        title: lesson.title || "video",
      });
      frame.appendChild(iframe);
      // Stop playback before the next step renders.
      if (typeof journey.onDispose === "function") {
        journey.onDispose(() => {
          try { iframe.src = ""; } catch (_) { /* ignore */ }
        });
      }
    } else {
      const placeholder = el("button",
        {
          type: "button",
          class: "video-frame__placeholder",
          onClick: play,
          "aria-label": "הפעל וידאו",
        },
        el("div", { class: "video-frame__bg-glyph jp",
                    "aria-hidden": "true" },
          lesson.glyph || ""),
        el(
          "div",
          { class: "video-frame__center" },
          el("div", { class: "video-frame__play-circle" },
            el("span", { "aria-hidden": "true" }, "▶")),
          el("div", { class: "video-frame__title" }, lesson.title || ""),
          el("div", { class: "video-frame__subtitle" }, lesson.subtitle || ""),
          el("div", { class: "video-frame__hint" }, "הקש לניגון · עם קול"),
        ),
      );
      frame.appendChild(placeholder);
    }

    const chipsRow = el("div", { class: "video-chips" },
      controlChip("🔊", "קול"),
      controlChip("⛶", "מסך מלא"),
      controlChip("⏩", "מהירות"),
      controlChip("CC", "כתוביות"),
    );

    const helpLine = el("div", { class: "video-help" },
      "כל הכפתורים זמינים בנגן עצמו (הצג/הסתר על־ידי הזזת העכבר/הקשה על הסרטון).");

    const spacer = el("div", { class: "video-spacer" });

    const doneBtn = el("button",
      {
        type: "button",
        class: "btn btn-primary video-action",
        onClick: () => journey.advance(),
      },
      "סיימתי לצפות ←",
    );
    const skipBtn = el("button",
      {
        type: "button",
        class: "btn btn-ghost video-action",
        onClick: () => journey.advance(),
      },
      "דלגו על הסרטון",
    );

    return el("div", { class: "lj-step lj-step--video video-phase" },
      frame, chipsRow, helpLine, spacer, doneBtn, skipBtn);
  }

  hostEl.appendChild(buildPhase());
}
