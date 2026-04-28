// practice.js — Step 4 (showPracticeCard, LessonJourneyActivity.kt:767–1032 +
// normalizeAnswer at :1034).
//
// Stub. The PRACTICE step agent rewrites this file end-to-end.

import { el } from "../../dom.js";

export function Practice({ hostEl, lesson }) {
  hostEl.appendChild(
    el(
      "div",
      { class: "lj-step lj-step--stub" },
      el("p", {}, `PRACTICE step (lesson ${lesson.id}) — pending agent build`),
    ),
  );
}
