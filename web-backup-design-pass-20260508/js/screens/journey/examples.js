// examples.js — Step 5 of LessonJourney (port of design's ExamplesPhase).
//
// Layout (per design_handoff_kimura_redesign/screen-lesson.jsx ExamplesPhase):
//
//   Scrollable column of example cards. Each card:
//     ┌───────────────────────────────────────────────────────┐
//     │ "דוגמה N"  (red-deep tag) + .btn-icon speaker (if    │
//     │  there's audio text)                                  │
//     │ {romaji}   (Cormorant italic, red-deep, 20px)         │
//     │ {japanese} .jp (Noto Sans JP, ink-soft, 14px)         │
//     │ ─── (1px dashed cream-3) ───                          │
//     │ {hebrew}   (ink, 13px, 600)                           │
//     └───────────────────────────────────────────────────────┘
//
// Continue label: "לתרגול ←"

import { el } from "../../dom.js";
import { speak } from "../../speaker.js";

function audioBtn(text, sizePx) {
  return el("button",
    {
      type: "button",
      class: "btn-icon audio-pulse",
      style: { width: sizePx + "px", height: sizePx + "px",
               flex: "0 0 auto" },
      "aria-label": "השמע",
      onClick: (e) => {
        e.stopPropagation();
        const t = e.currentTarget;
        t.classList.add("playing");
        speak(text);
        setTimeout(() => t.classList.remove("playing"), 1100);
      },
    },
    el("span", { "aria-hidden": "true",
                 style: { fontSize: "13px" } }, "🔊"),
  );
}

function exampleCard(ex, idx) {
  const audioText = ex.romaji || ex.japanese || "";
  return el("div", { class: "card example-card" },
    el("div", { class: "example-card__head" },
      el("div", { class: "example-card__tag" }, "דוגמה " + (idx + 1)),
      audioText ? audioBtn(audioText, 30) : null,
    ),
    ex.romaji
      ? el("div", { class: "example-card__romaji" }, ex.romaji)
      : null,
    ex.japanese
      ? el("div", { class: "example-card__japanese jp" }, ex.japanese)
      : null,
    ex.hebrew
      ? el("div", { class: "example-card__hebrew" }, ex.hebrew)
      : null,
  );
}

export function Examples({ hostEl, lesson, journey }) {
  journey.setContinueLabel("לתרגול ←");

  const list = Array.isArray(lesson.examples) ? lesson.examples : [];
  if (list.length === 0) {
    journey.advance();
    return;
  }

  hostEl.appendChild(
    el("div", { class: "lj-step lj-step--examples examples-phase" },
      el("div", { class: "examples-list" },
        ...list.map((ex, i) => exampleCard(ex, i)),
      ),
    ),
  );
}
