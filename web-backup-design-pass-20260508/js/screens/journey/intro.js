// intro.js — Step 2 of the Lesson Journey (port of design's IntroPhase).
//
// 1:1 visual port of design_handoff_kimura_redesign/screen-lesson.jsx
// IntroPhase. The journey shell owns the top band; this step renders
// only the body. The video is NOT here anymore — it's a separate
// phase before intro.
//
//   ┌─ .card.intro-card ─────────────────────────────────┐
//   │ .hanko (top-leading, rotated -8deg, lesson.glyph)  │
//   │ "{lesson.number}" (red-deep tag, 11px uppercase)   │
//   │ <h1>{lesson.title}</h1>                            │
//   │ <div>{lesson.subtitle}</div>  (Cormorant italic)   │
//   │ <div class="jp">{lesson.glyph}</div>  (red-deep,   │
//   │   80px Noto Serif JP)                              │
//   └────────────────────────────────────────────────────┘
//
//   "בשיעור הזה" tag + .intro-sections list:
//     ▸ דקדוק / מילים / דוגמאות / תרגול / מבחן (only those that exist)
//
//   Continue button (in shell): "התחל שיעור ←"

import { el } from "../../dom.js";

function sectionRow({ icon, label, count }) {
  return el("div", { class: "intro-sections__row" },
    el("div", { class: "intro-sections__icon",
                "aria-hidden": "true" }, icon),
    el("div", { class: "intro-sections__label" }, label),
    el("div", { class: "intro-sections__count" }, String(count)),
  );
}

export function Intro({ hostEl, lesson, journey }) {
  journey.setContinueLabel("התחל שיעור ←");

  const sections = [];
  if (lesson.grammarPoints && lesson.grammarPoints.length > 0) {
    sections.push({ icon: "📖", label: "דקדוק", count: lesson.grammarPoints.length });
  }
  if (lesson.vocabulary && lesson.vocabulary.length > 0) {
    sections.push({ icon: "✨", label: "מילים", count: lesson.vocabulary.length });
  }
  if (lesson.examples && lesson.examples.length > 0) {
    sections.push({ icon: "📄", label: "דוגמאות", count: lesson.examples.length });
  }
  if (lesson.practiceCards && lesson.practiceCards.length > 0) {
    sections.push({ icon: "🔄", label: "תרגול", count: lesson.practiceCards.length });
  }
  if (lesson.exercises && lesson.exercises.length > 0) {
    sections.push({ icon: "🏆", label: "מבחן", count: lesson.exercises.length });
  }

  const heroCard = el("div", { class: "card intro-card" },
    el("div", { class: "hanko intro-card__hanko",
                "aria-hidden": "true" },
       lesson.glyph || (lesson.emoji || "?")),
    el("div", { class: "intro-card__number" },
       (lesson.number || "").toUpperCase()),
    el("h1", { class: "intro-card__title" }, lesson.title || ""),
    el("div", { class: "intro-card__subtitle" }, lesson.subtitle || ""),
    el("div", { class: "intro-card__big-glyph jp", "aria-hidden": "true" },
       lesson.glyph || lesson.emoji || ""),
  );

  const sectionsBlock = el("section", { class: "intro-sections" },
    el("div", { class: "intro-sections__heading" }, "בשיעור הזה"),
    el("div", { class: "intro-sections__list" },
      ...sections.map(sectionRow),
    ),
  );

  hostEl.appendChild(
    el("div", { class: "lj-step lj-step--intro intro-phase" },
      heroCard, sectionsBlock),
  );
}
