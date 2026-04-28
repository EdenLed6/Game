// complete.js — Step 6 (showComplete, LessonJourneyActivity.kt:1404–1491).
//
// Reached only when the QUIZ step finished with a passing score (>= 80%).
// The fail/retry path is owned by the QUIZ step itself (Kotlin :1325–1397)
// and never enters this renderer.
//
// Side effects on entering COMPLETE — mirroring Kotlin onQuizComplete()
// at LessonJourneyActivity.kt:1316–1325. The QUIZ step is responsible for
// calling Progress.markLessonCompleted(lesson.id) before transitioning;
// this renderer adds the XP reward and ticks the daily-activity streak,
// guarded by a per-lesson `awarded` set so re-entering the step (e.g.
// the user navigates back and forward) does not double-award.
//
// Visual layout (per Kotlin :1404–1491):
//
//   ┌────────────────────────────────────────────┐
//   │              🎉   (80sp emoji)             │
//   │           כל הכבוד!  (28sp red bold)        │
//   │  השלמת את השיעור <title>!  (16sp on-surf)  │
//   │       ┌──────────────────────┐             │
//   │       │   +100 XP ⭐ (24sp)  │  gold card   │
//   │       └──────────────────────┘             │
//   └────────────────────────────────────────────┘
//
// The shell owns the bottom continue button. We set its label to
// "המשך ללמוד" (Kotlin :1406) and let journey.advance() route to
// nextOf("complete") = null → router.go("#/learn").

import { el } from "../../dom.js";
import { addXP, recordActivity } from "../../store.js";

// Module-level guard — keyed by lesson id. Re-entering COMPLETE for the
// same lesson within a session must not re-award XP or re-tick the streak.
// recordActivity() is itself same-day idempotent on the streak counter,
// but we still gate it here so the call happens at most once per lesson
// per session, matching the Kotlin behaviour of running the side-effects
// exactly once at the QUIZ→COMPLETE boundary.
const awarded = new Set();

export function Complete({ hostEl, lesson, journey, ctx }) {
  // ── Side effects (Kotlin :1322–1323) ──
  // Per-lesson guard so going back and forward through the journey within
  // a single session can't double-award. The persistent storage layer
  // (store.js → localStorage) is the source of truth across sessions.
  const lessonKey = Number(lesson.id);
  if (!awarded.has(lessonKey)) {
    awarded.add(lessonKey);
    try { addXP(100); } catch (_) { /* ignore — quota / private mode */ }
    try { recordActivity(); } catch (_) { /* ignore */ }
  }

  // ── Bottom button label (Kotlin :1406) ──
  // The shell resets the label to "המשך" before each step renders
  // (lesson-journey.js :230), so we set it every mount.
  if (journey && typeof journey.setContinueLabel === "function") {
    journey.setContinueLabel("המשך ללמוד");
  }
  // Continue → nextOf("complete") = null → router.go("#/learn")
  // (lesson-journey.js :250–255). No override needed — the default
  // onContinue path already does the right thing.

  // ── Body content ──
  const children = [];

  // Celebration emoji (Kotlin :1427–1435 — 80sp)
  children.push(
    el("div", { class: "lj-complete__emoji", "aria-hidden": "true" }, "🎉"),
  );

  // "כל הכבוד!" (Kotlin :1438–1448 — 28sp bold, primary red)
  children.push(
    el("h2", { class: "lj-complete__title" }, "כל הכבוד!"),
  );

  // "השלמת את השיעור <title>!" (Kotlin :1451–1460 — 16sp on-surface)
  children.push(
    el(
      "p",
      { class: "lj-complete__subtitle" },
      `השלמת את השיעור ${lesson.title || ""}!`,
    ),
  );

  // XP badge card (Kotlin :1463–1487 — colorSecondary #F59E0B fill,
  // 20dp radius, 1dp gold stroke, 32×16 padding, "+100 XP ⭐" 24sp bold).
  // Kotlin uses goldStroke (#F59E0B) which equals the fill — effectively
  // a borderless gold card with a subtle elevation shadow.
  children.push(
    el(
      "div",
      { class: "lj-complete__xp-card" },
      el("span", { class: "lj-complete__xp-text" }, "+100 XP ⭐"),
    ),
  );

  hostEl.appendChild(
    el("div", { class: "lj-step lj-step--complete" }, ...children),
  );
}
