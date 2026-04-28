// complete.js — Step 6 (showComplete, LessonJourneyActivity.kt:1316–1491,
// including the fail/retry path).
//
// Stub. The COMPLETE step agent rewrites this file end-to-end.

import { el } from "../../dom.js";

export function Complete({ hostEl, lesson }) {
  hostEl.appendChild(
    el(
      "div",
      { class: "lj-step lj-step--stub" },
      el("p", {}, `COMPLETE step (lesson ${lesson.id}) — pending agent build`),
    ),
  );
}
