// vocab.js — Step 3 of LessonJourney (port of design's VocabPhase).
//
// Layout (per design_handoff_kimura_redesign/screen-lesson.jsx):
//
//   ┌─ .card.vocab-card  (single tall card, fills available height) ┐
//   │ ┌─ .vocab-card__head (red-6% bg, dashed cream-3 border) ────┐ │
//   │ │ 📖  "{N} מילים"           "הקישו לשמיעה"                  │ │
//   │ └────────────────────────────────────────────────────────────┘ │
//   │ ┌─ .vocab-list (scrollable) ─────────────────────────────────┐ │
//   │ │ row: emoji  romaji+japanese  hebrew  ▶                     │ │
//   │ │   romaji = Cormorant italic, red-deep, 19px               │ │
//   │ │   japanese = Noto Serif JP, ink-soft, 13px                │ │
//   │ │   hebrew (right) = ink, 13px, 700                          │ │
//   │ │   speaker = btn-icon (32×32) on the trailing edge          │ │
//   │ │   tapping ANY part of the row plays the romaji audio       │ │
//   │ │ ─── (1px dashed cream-3 between rows) ─────                │ │
//   │ └────────────────────────────────────────────────────────────┘ │
//   └────────────────────────────────────────────────────────────────┘
//
// Continue button (in shell): "המשך ←" — advances to practice (or quiz
// if no practiceCards).

import { el } from "../../dom.js";
import { speak } from "../../speaker.js";

function vocabRow(item) {
  const audioText = item.romaji || item.japanese || "";
  let speakerEl;

  const playAudio = (e) => {
    if (e) e.stopPropagation();
    if (!audioText) return;
    if (speakerEl) speakerEl.classList.add("playing");
    speak(audioText);
    setTimeout(() => {
      if (speakerEl) speakerEl.classList.remove("playing");
    }, 900);
  };

  speakerEl = el(
    "button",
    {
      type: "button",
      class: "btn-icon audio-pulse vocab-row__speaker",
      "aria-label": "השמע",
      onClick: playAudio,
    },
    el("span", { "aria-hidden": "true" }, "🔊"),
  );

  return el(
    "div",
    {
      class: "vocab-row",
      role: "button",
      tabindex: "0",
      onClick: playAudio,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          playAudio(e);
        }
      },
    },
    el("div", { class: "vocab-row__emoji" }, item.emoji || "•"),
    el(
      "div",
      { class: "vocab-row__main" },
      el("div", { class: "vocab-row__romaji" }, item.romaji || ""),
      el("div", { class: "vocab-row__japanese jp" }, item.japanese || ""),
    ),
    el("div", { class: "vocab-row__hebrew" }, item.hebrew || ""),
    speakerEl,
  );
}

export function Vocab({ hostEl, lesson, journey }) {
  journey.setContinueLabel("המשך ←");

  const list = Array.isArray(lesson.vocabulary) ? lesson.vocabulary : [];

  hostEl.appendChild(
    el(
      "div",
      { class: "lj-step lj-step--vocab vocab-phase" },
      el(
        "div",
        { class: "card vocab-card" },
        el(
          "div",
          { class: "vocab-card__head" },
          el("span", { "aria-hidden": "true",
                       style: { fontSize: "16px" } }, "📖"),
          el("strong", { class: "vocab-card__count" },
             list.length + " מילים"),
          el("span", { class: "vocab-card__hint" }, "הקישו לשמיעה"),
        ),
        el(
          "div",
          { class: "vocab-list" },
          ...list.map(vocabRow),
        ),
      ),
    ),
  );
}
