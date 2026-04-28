// quiz.js — Step 5 (showQuizQuestion, LessonJourneyActivity.kt:1041–1314).
//
// IMPORTANT: this is the IN-JOURNEY quiz, NOT the standalone QuizActivity.
// The shell hides the bottom continue button while this step is active —
// the quiz manages its own check / next buttons internally.
//
// Stub. The QUIZ step agent rewrites this file end-to-end.

import { el } from "../../dom.js";

export function Quiz({ hostEl, lesson, journey }) {
  // Hide the shell's continue button — quiz owns its own controls.
  journey.setContinueVisible(false);

  hostEl.appendChild(
    el(
      "div",
      { class: "lj-step lj-step--stub" },
      el("p", {}, `QUIZ step (lesson ${lesson.id}) — pending agent build`),
    ),
  );
}
