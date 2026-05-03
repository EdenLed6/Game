// teach.js — Step 2 of LessonJourney (port of design's GrammarPhase
// + ExamplesPhase, merged into one step to fit the existing 6-phase
// shell).
//
// Layout (per design_handoff_kimura_redesign/screen-lesson.jsx):
//
//   ┌─ tab row (only if grammarPoints.length > 1) ────────────┐
//   │ [חלק 1] [חלק 2] [חלק 3] …                                │
//   └──────────────────────────────────────────────────────────┘
//   ┌─ .card (active grammar point) ──────────────────────────┐
//   │ "דקדוק" tag (red-deep, 11px, letterSpacing)              │
//   │ <h2>{point.title}</h2> (Frank Ruhl Libre 20px)           │
//   │ <div whitespace-pre-wrap>{point.content}</div> (14px)    │
//   └──────────────────────────────────────────────────────────┘
//
//   If lesson.examples exist, each rendered as a sub-card under a
//   "דוגמאות" heading:
//
//   ┌─ .card.example-card (× N) ──────────────────────────────┐
//   │ "דוגמה {i+1}" tag (red-deep) + .btn-icon speaker         │
//   │ romaji (Cormorant italic, red-deep, 20px)                │
//   │ japanese (Noto Sans JP, ink-soft, 14px)                  │
//   │ ─── (dashed divider, only if hebrew) ───                 │
//   │ hebrew (ink, 13px, 600)                                  │
//   └──────────────────────────────────────────────────────────┘
//
// Continue button (in shell): "המשך לאוצר מילים ←" when the last
// grammar tab is active, otherwise "החלק הבא ←" (advances within tabs
// before moving on).

import { el } from "../../dom.js";
import { speak } from "../../speaker.js";

// Module-level cache so the user's tab selection persists if she
// goes forward to vocab and comes back.
const CACHE = new Map(); // lessonId → activeTabIdx

function audioBtn(text, sizePx) {
  return el(
    "button",
    {
      type: "button",
      class: "btn-icon audio-pulse",
      style: { width: (sizePx || 30) + "px", height: (sizePx || 30) + "px",
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
    el("span", { "aria-hidden": "true", style: { fontSize: "14px" } }, "🔊"),
  );
}

function exampleCard(ex, idx) {
  const audioText = ex.romaji || ex.japanese || "";
  return el(
    "div",
    { class: "card example-card" },
    el(
      "div",
      { class: "example-card__head" },
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

export function Teach({ hostEl, lesson, journey }) {
  const grammarPoints = Array.isArray(lesson.grammarPoints) ? lesson.grammarPoints : [];
  const examples = Array.isArray(lesson.examples) ? lesson.examples : [];
  const hasGrammar = grammarPoints.length > 0;
  const hasExamples = examples.length > 0;

  // Restore prior tab selection or start at 0.
  let active = CACHE.get(lesson.id) || 0;
  if (active >= grammarPoints.length) active = 0;

  // Advance label depends on tab position.
  const updateContinueLabel = () => {
    if (hasGrammar && grammarPoints.length > 1 && active < grammarPoints.length - 1) {
      journey.setContinueLabel("החלק הבא ←");
    } else if (lesson.vocabulary && lesson.vocabulary.length > 0) {
      journey.setContinueLabel("מילים חדשות ←");
    } else {
      journey.setContinueLabel("לתרגול ←");
    }
  };

  // Override the journey shell's onContinue so multi-part grammar can
  // advance through tabs first before letting the shell move to the
  // next phase.
  journey.onContinueOverride = () => {
    if (hasGrammar && grammarPoints.length > 1 && active < grammarPoints.length - 1) {
      active = active + 1;
      CACHE.set(lesson.id, active);
      journey.rerender();
      return true; // handled — don't advance phase
    }
    CACHE.delete(lesson.id);
    return false; // let the shell advance to vocab/practice/quiz
  };

  // Override back so it rewinds tabs first.
  journey.onBackOverride = () => {
    if (hasGrammar && grammarPoints.length > 1 && active > 0) {
      active = active - 1;
      CACHE.set(lesson.id, active);
      journey.rerender();
      return true;
    }
    CACHE.delete(lesson.id);
    return false;
  };

  updateContinueLabel();

  // ── Tabs (only if multi-part) ─────────────────────────────
  let tabsRow = null;
  if (hasGrammar && grammarPoints.length > 1) {
    tabsRow = el(
      "div",
      { class: "teach-tabs" },
      ...grammarPoints.map((_, i) => el(
        "button",
        {
          type: "button",
          class: "teach-tabs__btn" + (i === active ? " teach-tabs__btn--active" : ""),
          onClick: () => {
            active = i;
            CACHE.set(lesson.id, active);
            journey.rerender();
          },
        },
        "חלק " + (i + 1),
      )),
    );
  }

  // ── Active grammar point card ─────────────────────────────
  let grammarCard = null;
  if (hasGrammar) {
    const p = grammarPoints[active];
    grammarCard = el(
      "div",
      { class: "card teach-card" },
      el("div", { class: "teach-card__tag" }, "דקדוק"),
      el("h2", { class: "teach-card__title" }, p.title || ""),
      el("div", { class: "teach-card__content" }, p.content || ""),
    );
  }

  // ── Examples list (shown after the grammar card on the LAST
  //    tab — keeps the design's separate "examples" phase content
  //    inside our 6-phase shell, so users see grammar before
  //    examples and don't get a separate phase). ───────────────
  let examplesBlock = null;
  if (hasExamples && (!hasGrammar || active === grammarPoints.length - 1)) {
    examplesBlock = el(
      "div",
      { class: "teach-examples" },
      el("div", { class: "teach-examples__heading" }, "דוגמאות"),
      el(
        "div",
        { class: "teach-examples__list" },
        ...examples.map((ex, i) => exampleCard(ex, i)),
      ),
    );
  }

  hostEl.appendChild(
    el(
      "div",
      { class: "lj-step lj-step--teach teach-phase" },
      tabsRow,
      grammarCard,
      examplesBlock,
    ),
  );
}
