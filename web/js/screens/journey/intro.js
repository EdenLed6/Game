// intro.js — Step 1 of LessonJourneyActivity (renderIntro,
// LessonJourneyActivity.kt:247–367 + buildVideoCard at :369–448).
//
// Stub. The INTRO step agent rewrites this file end-to-end.

import { el } from "../../dom.js";

export function Intro({ hostEl, lesson }) {
  hostEl.appendChild(
    el(
      "div",
      { class: "lj-step lj-step--stub" },
      el("p", {}, `INTRO step (lesson ${lesson.id}) — pending agent build`),
    ),
  );
}
