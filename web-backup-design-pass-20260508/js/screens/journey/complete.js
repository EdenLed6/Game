// complete.js — Step 6 of LessonJourney (port of design's DonePhase).
//
// Layout (per design_handoff_kimura_redesign/screen-lesson.jsx):
//
//   ┌─ centered column, full-height ─────────────────────────┐
//   │ .complete-grade   (130×130 circle, red gradient if      │
//   │                    passed / muted brown if not)         │
//   │   .jp 74px = grade kanji                                │
//   │     優 ≥90% / 良 ≥80% / 可 ≥60% / 再 < 60%               │
//   │ <h2>שיעור הושלם!</h2>  or  "כמעט שם..."                  │
//   │ "{lesson.number} · {lesson.title}"                      │
//   │ ┌─ .complete-stats card (3-up grid) ────────────────┐   │
//   │ │ +XP   |   ACCURACY   |   GRADE                    │   │
//   │ └────────────────────────────────────────────────────┘   │
//   │ "{score} מתוך {total} תשובות נכונות"                    │
//   │ if !passed: red box "נדרש ציון של 80% לפחות..."         │
//   │ ┌─ buttons (full-width) ────────────────────────────┐   │
//   │ │ passed: "חזרה למפת השיעורים"                       │   │
//   │ │ failed: "🔄 נסו שוב את המבחן" + "יציאה ללא השלמה"  │   │
//   │ └────────────────────────────────────────────────────┘   │
//   └────────────────────────────────────────────────────────┘
//
// On pass, the journey shell already advanced here (quiz.js calls
// setQuizComplete(true)). This step records progress + XP + streak.

import { el } from "../../dom.js";
import { markLessonCompleted, addXP, recordActivity } from "../../store.js";

const PASS = 80;

function gradeFor(pct) {
  if (pct >= 90) return "優";
  if (pct >= 80) return "良";
  if (pct >= 60) return "可";
  return "再";
}

function statBox(label, value, icon) {
  return el(
    "div",
    { class: "complete-stat" },
    el(
      "div",
      { class: "complete-stat__row" },
      el("span", { class: "complete-stat__icon",
                   "aria-hidden": "true" }, icon),
      el("span", { class: "complete-stat__value" }, value),
    ),
    el("div", { class: "complete-stat__label" }, label),
  );
}

export function Complete({ hostEl, lesson, journey, ctx }) {
  // Pull score from quiz state if available; default to 100% (no quiz).
  const total = Array.isArray(lesson.exercises) ? lesson.exercises.length : 0;
  // The shell doesn't pass score directly. Read from a quiz cache if
  // the quiz module set one — otherwise assume passed.
  const score = (window.__kimuraQuizScore != null) ? window.__kimuraQuizScore : total;
  const pct = total ? Math.round((score / total) * 100) : 100;
  const passed = pct >= PASS;
  const grade = gradeFor(pct);
  const xp = passed ? (score * 15 + 30) : 0;

  // Persist progress on pass (idempotent — Set semantics).
  if (passed) {
    try {
      markLessonCompleted(lesson.id);
      addXP(xp);
      recordActivity();
    } catch (_) { /* ignore quota / private mode */ }
  }

  const router = ctx && ctx.router;
  const onBack = () => { if (router) router.go("#/learn"); };

  // The shell hides its own continue button on this step (we don't
  // need it — the buttons are inline below).
  if (typeof journey.setContinueVisible === "function") {
    journey.setContinueVisible(false);
  }

  const circle = el(
    "div",
    {
      class: "complete-grade" + (passed ? " complete-grade--pass" : " complete-grade--fail"),
    },
    el("div", { class: "complete-grade__char jp" }, grade),
  );

  const statsCard = el(
    "div",
    { class: "card complete-stats" },
    statBox("XP", passed ? "+" + xp : "—", "⚡"),
    statBox("דיוק", total ? pct + "%" : "—", "🏆"),
    statBox("ציון", grade, "★"),
  );

  const correctLine = total > 0
    ? el("div", { class: "complete-correct" },
        score + " מתוך " + total + " תשובות נכונות")
    : null;

  const failBox = (!passed && total > 0)
    ? el(
        "div",
        { class: "complete-fail" },
        el("strong", null, "נדרש ציון של " + PASS + "% לפחות "),
        el("span", null, "כדי לסיים את השיעור."),
        el("br", null),
        el("span", null, "חזרו על המבחן ותצליחו!"),
      )
    : null;

  // Action buttons — pass = single primary; fail = retry primary + ghost exit.
  let actions;
  if (passed) {
    actions = el(
      "button",
      {
        type: "button",
        class: "btn btn-primary complete-action",
        onClick: onBack,
      },
      "חזרה למפת השיעורים",
    );
  } else {
    const onRetry = () => {
      // Reset quiz cache + jump back to quiz phase.
      window.__kimuraQuizScore = 0;
      // Re-enter the quiz step by calling the shell's goto via location hash.
      const lessonId = lesson.id;
      if (router) router.go("#/lesson/" + lessonId + "/quiz");
    };
    actions = el(
      "div",
      { class: "complete-actions" },
      el(
        "button",
        {
          type: "button",
          class: "btn btn-primary complete-action",
          onClick: onRetry,
        },
        "🔄 נסו שוב את המבחן",
      ),
      el(
        "button",
        {
          type: "button",
          class: "btn btn-ghost complete-action",
          onClick: onBack,
        },
        "יציאה ללא השלמה",
      ),
    );
  }

  hostEl.appendChild(
    el(
      "div",
      { class: "lj-step lj-step--complete complete-phase" },
      circle,
      el(
        "h2",
        { class: "complete-title" },
        passed ? "שיעור הושלם!" : "כמעט שם...",
      ),
      el(
        "div",
        { class: "complete-subtitle" },
        (lesson.number || "") + " · " + (lesson.title || ""),
      ),
      statsCard,
      correctLine,
      failBox,
      actions,
    ),
  );
}
