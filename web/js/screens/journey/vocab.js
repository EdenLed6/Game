// vocab.js — Step 3 (showVocabPage, LessonJourneyActivity.kt:459–509 +
// :587–671 for buildVocabRow).
//
// Stub. The VOCAB step agent rewrites this file end-to-end.

import { el } from "../../dom.js";

export function Vocab({ hostEl, lesson }) {
  hostEl.appendChild(
    el(
      "div",
      { class: "lj-step lj-step--stub" },
      el("p", {}, `VOCAB step (lesson ${lesson.id}) — pending agent build`),
    ),
  );
}
