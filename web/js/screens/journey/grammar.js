// grammar.js — Step 3 of LessonJourney (port of design's GrammarPhase).
//
// Layout (per design_handoff_kimura_redesign/screen-lesson.jsx GrammarPhase):
//
//   ┌─ tab row (only if grammarPoints.length > 1) ────────────┐
//   │ [חלק 1] [חלק 2] [חלק 3] …   active = red bg + white txt │
//   └──────────────────────────────────────────────────────────┘
//   ┌─ .card.teach-card (active grammar point) ───────────────┐
//   │ "דקדוק" tag (red-deep, 11px, letterSpacing)              │
//   │ <h2>{point.title}</h2> (Frank Ruhl Libre 20px)           │
//   │ <div whitespace-pre-wrap>{point.content}</div> (14px)    │
//   └──────────────────────────────────────────────────────────┘
//
// Continue label per design:
//   "החלק הבא ←" (mid-tabs) or "המשך לאוצר מילים ←" (final).
// Examples are NO longer here — they have their own phase now.

import { el } from "../../dom.js";

const CACHE = new Map(); // lessonId → activeTabIdx

export function Grammar({ hostEl, lesson, journey }) {
  const points = Array.isArray(lesson.grammarPoints) ? lesson.grammarPoints : [];
  if (points.length === 0) {
    journey.advance();
    return;
  }

  let active = CACHE.get(lesson.id) || 0;
  if (active >= points.length) active = 0;

  const updateContinueLabel = () => {
    if (points.length > 1 && active < points.length - 1) {
      journey.setContinueLabel("החלק הבא ←");
    } else {
      journey.setContinueLabel("המשך לאוצר מילים ←");
    }
  };

  // Tabs advance the in-phase active index before allowing the journey
  // shell to advance to the next phase.
  journey.onContinueOverride = () => {
    if (points.length > 1 && active < points.length - 1) {
      active = active + 1;
      CACHE.set(lesson.id, active);
      journey.rerender();
      return true;
    }
    CACHE.delete(lesson.id);
    return false;
  };

  journey.onBackOverride = () => {
    if (points.length > 1 && active > 0) {
      active = active - 1;
      CACHE.set(lesson.id, active);
      journey.rerender();
      return true;
    }
    CACHE.delete(lesson.id);
    return false;
  };

  updateContinueLabel();

  let tabsRow = null;
  if (points.length > 1) {
    tabsRow = el("div", { class: "teach-tabs" },
      ...points.map((_, i) => el(
        "button",
        {
          type: "button",
          class: "teach-tabs__btn"
            + (i === active ? " teach-tabs__btn--active" : ""),
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

  const p = points[active];
  const grammarCard = el("div", { class: "card teach-card" },
    el("div", { class: "teach-card__tag" }, "דקדוק"),
    el("h2", { class: "teach-card__title" }, p.title || ""),
    el("div", { class: "teach-card__content" }, p.content || ""),
  );

  hostEl.appendChild(
    el("div", { class: "lj-step lj-step--grammar grammar-phase" },
      tabsRow, grammarCard),
  );
}
