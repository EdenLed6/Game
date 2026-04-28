// teach.js — Step 2 (showTeachPage, LessonJourneyActivity.kt:511–574 +
// :673–761 for the per-item card builders).
//
// Stub. The TEACH step agent rewrites this file end-to-end.

import { el } from "../../dom.js";

export function Teach({ hostEl, lesson }) {
  hostEl.appendChild(
    el(
      "div",
      { class: "lj-step lj-step--stub" },
      el("p", {}, `TEACH step (lesson ${lesson.id}) — pending agent build`),
    ),
  );
}
