// lesson-journey.js — 1:1 port of LessonJourneyActivity.kt.
//
// The Activity walks the user through a lesson in 6 sequential steps:
//
//   INTRO → TEACH → VOCAB → PRACTICE → QUIZ → COMPLETE
//
// VOCAB is skipped if `lesson.vocabulary.length === 0`.
// PRACTICE is skipped if `lesson.practiceCards.length === 0`.
// COMPLETE is reached only on quiz score >= 80%; otherwise the QUIZ step shows
// a retry card that resets the quiz.
//
// This module is the SHELL: header banner, progress indicator, step title,
// back arrow, persistent bottom continue button, FrameLayout-equivalent host
// for the active step's content. It mirrors activity_lesson_journey.xml.
//
// Each step is a separate module under web/js/screens/journey/*.js. A step
// module exports `function StepName({ hostEl, lesson, journey, ctx })`. The
// shell calls the step's renderer when entering the step. The step renders
// into `hostEl` and uses `journey.advance()` / `journey.back()` /
// `journey.setQuizComplete(passed)` to drive transitions.

import { el, mount } from "../dom.js";
import { Intro }    from "./journey/intro.js";
import { Teach }    from "./journey/teach.js";
import { Vocab }    from "./journey/vocab.js";
import { Practice } from "./journey/practice.js";
import { Quiz }     from "./journey/quiz.js";
import { Complete } from "./journey/complete.js";

// ─────────────────────────────────────────────────────────────
// Step state machine — mirrors the `Step` enum in
// LessonJourneyActivity.kt:33 and showStep() at :128–158.
// ─────────────────────────────────────────────────────────────

const STEPS = ["intro", "teach", "vocab", "practice", "quiz", "complete"];

// LessonJourneyActivity.kt:133–140 — progress bar % per step
const PROGRESS = {
  intro:    0,
  teach:    15,
  vocab:    40,
  practice: 60,
  quiz:     80,
  complete: 100,
};

// LessonJourneyActivity.kt:142–149 — step title ("intro" uses the lesson title)
function titleFor(step, lesson) {
  switch (step) {
    case "intro":    return lesson.title;
    case "teach":    return "למד";
    case "vocab":    return "מילים חדשות";
    case "practice": return "תרגל";
    case "quiz":     return "חידון";
    case "complete": return "הושלם! 🎉";
  }
  return "";
}

// LessonJourneyActivity.kt:160–191 — the rules that decide which step comes
// next, including the skip-empty-vocab and skip-empty-practice conditions.
function nextOf(step, lesson) {
  switch (step) {
    case "intro":
      return "teach";
    case "teach":
      return lesson.vocabulary && lesson.vocabulary.length > 0 ? "vocab" : "practice";
    case "vocab":
      return "practice";
    case "practice":
      return "quiz";
    case "quiz":
      return "complete";
    case "complete":
      return null; // finish() — back to Learn
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// Renderer registry
// ─────────────────────────────────────────────────────────────

const RENDERERS = {
  intro:    Intro,
  teach:    Teach,
  vocab:    Vocab,
  practice: Practice,
  quiz:     Quiz,
  complete: Complete,
};

// ─────────────────────────────────────────────────────────────
// Screen entry point
// ─────────────────────────────────────────────────────────────

export function LessonJourney({ host, ctx, params }) {
  const { lessons, router } = ctx;
  const lessonId = Number(params.id);
  const lesson = (lessons || []).find((l) => Number(l.id) === lessonId);

  if (!lesson) {
    router.go("#/learn");
    return;
  }

  // Resolve initial step from the URL (e.g. #/lesson/3/teach), defaulting to
  // INTRO if the URL is just #/lesson/:id or names an unknown step.
  let currentStep = STEPS.includes(params.step) ? params.step : "intro";

  // Disposer registry — step renderers can register cleanup (e.g. clearing
  // a timer, destroying a video iframe). Called before the next render.
  const disposers = [];
  function flushDisposers() {
    while (disposers.length) {
      try { disposers.pop()(); } catch (_) { /* ignore */ }
    }
  }

  // ───── Build outer DOM (design's LessonScreen shell) ─────
  //
  // Mirrors the design's screen-lesson.jsx top-level structure:
  //
  //   .kimura-screen.lesson-journey-screen.screen-enter
  //     header.top-band                ← red header w/ bg_header texture
  //       .top-band__inner
  //         .top-band__row             ← back / title+subtitle / home
  //         .lj-progress (progressbar) ← hidden on intro/complete
  //       .gold-line                   ← gold accent strip
  //     .kimura-content                ← step content scrolls here
  //     button.lj-continue.btn.btn-primary  ← persistent CTA at bottom

  const progressFill = el("div", { class: "lj-progress__fill" });
  const progressBar = el(
    "div",
    {
      class: "lj-progress",
      role: "progressbar",
      "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 0,
    },
    progressFill,
  );

  const titleEl = el("h1", { class: "top-band__title" }, titleFor(currentStep, lesson));
  const subtitleEl = el("p", { class: "top-band__subtitle" }, lesson.number || "");

  const backBtn = el(
    "button",
    {
      type: "button",
      class: "top-band__icon-btn lj-back",
      "aria-label": "חזור",
      onClick: () => onBack(),
    },
    el("span", { "aria-hidden": "true" }, "←"),
  );

  const homeBtn = el(
    "button",
    {
      type: "button",
      class: "top-band__icon-btn lj-home",
      "aria-label": "חזרה לדף הבית",
      onClick: () => router.go("#/learn"),
    },
    el("span", { "aria-hidden": "true" }, "✕"),
  );

  const headerEl = el(
    "header",
    { class: "top-band lj-top-band" },
    el(
      "div",
      { class: "top-band__inner" },
      el(
        "div",
        { class: "top-band__row" },
        el("div", { class: "top-band__slot" }, backBtn),
        el("div", { class: "top-band__title-wrap" }, titleEl, subtitleEl),
        el("div", { class: "top-band__slot" }, homeBtn),
      ),
      progressBar,
    ),
    el("div", { class: "gold-line", "aria-hidden": "true" }),
  );

  // Step host — the .kimura-content where each step renders.
  const hostEl = el("div", { class: "kimura-content lj-step-host" });

  // Bottom continue button — the QUIZ step hides this entirely
  // (LessonJourneyActivity.kt:1047) since the quiz owns its own
  // check/next buttons.
  const continueLabel = el("span", { class: "lj-continue__label" }, "המשך");
  const continueBtn = el(
    "button",
    {
      type: "button",
      class: "btn btn-primary lj-continue",
      onClick: () => onContinue(),
    },
    continueLabel,
  );

  const root = el(
    "div",
    { class: "kimura-screen lesson-journey-screen lesson-journey screen-enter" },
    headerEl,
    hostEl,
    continueBtn,
  );

  mount(host, root);

  // ───── Journey controller — passed to each step renderer ─────

  const journey = {
    advance: () => onContinue(),
    back:    () => onBack(),
    // Step modules call this from the QUIZ step when the user finishes the
    // quiz. The journey decides where to go (COMPLETE if passed, retry if
    // not) but the step itself manages all per-question state.
    setQuizComplete: (passed) => {
      if (passed) goto("complete");
      // On fail, the quiz step renders its own retry card and re-enters
      // itself; nothing for the shell to do.
    },
    // Lets the active step ask the shell to show/hide the bottom button or
    // change its label without re-rendering everything.
    setContinueLabel: (text) => { continueLabel.textContent = text; },
    setContinueVisible: (visible) => {
      continueBtn.style.display = visible ? "" : "none";
    },
    setContinueEnabled: (enabled) => {
      if (enabled) continueBtn.removeAttribute("disabled");
      else continueBtn.setAttribute("disabled", "true");
    },
    // Step renderers register a cleanup to run before the next step.
    onDispose: (fn) => { if (typeof fn === "function") disposers.push(fn); },
    // Some steps (TEACH / VOCAB) update the continue label as the user reveals
    // items — they call this each time. Re-rendering the whole step is fine.
    rerender: () => renderStep(currentStep, /* preserveState */ true),
  };

  // ───── Step rendering ─────

  function renderStep(step, preserveState) {
    flushDisposers();
    currentStep = step;

    // Update header — title, subtitle (number for intro, phase for others),
    // progress bar (hidden on intro/complete).
    titleEl.textContent = titleFor(step, lesson);
    if (step === "intro") {
      subtitleEl.textContent = lesson.number || "";
      progressBar.style.visibility = "hidden";
    } else if (step === "complete") {
      subtitleEl.textContent = lesson.title || "";
      progressBar.style.visibility = "hidden";
    } else {
      subtitleEl.textContent = (lesson.number || "") +
        (lesson.subtitle ? " · " + lesson.subtitle : "");
      progressBar.style.visibility = "visible";
    }
    const pct = PROGRESS[step] ?? 0;
    progressFill.style.width = pct + "%";
    progressBar.setAttribute("aria-valuenow", String(pct));

    // Continue button defaults — the QUIZ step overrides these by calling
    // journey.setContinueVisible(false) in its renderer.
    continueBtn.style.display = "";
    continueBtn.removeAttribute("disabled");
    continueLabel.textContent = "המשך";

    // Clear and mount the step content
    hostEl.innerHTML = "";
    const renderer = RENDERERS[step];
    if (!renderer) {
      hostEl.appendChild(el("p", { class: "lj-error" }, `Unknown step: ${step}`));
      return;
    }
    renderer({ hostEl, lesson, journey, ctx, preserveState: !!preserveState });

    // Reflect the step in the URL so back/forward + reload preserve position.
    const want = step === "intro"
      ? `#/lesson/${lessonId}`
      : `#/lesson/${lessonId}/${step}`;
    if (location.hash !== want) {
      try { history.replaceState(null, "", want); } catch (_) { /* file:// */ }
    }
  }

  function goto(step) {
    if (step === null) {
      flushDisposers();
      router.go("#/learn");
      return;
    }
    renderStep(step, false);
  }

  // ───── onContinue / onBack — mirrors LessonJourneyActivity.onContinue
  //   (:160–191) and onBack (:193–226). Step modules can intercept by
  //   overriding journey.advance via onContinueOverride / onBackOverride
  //   stored on the journey object (TEACH/VOCAB use these for progressive
  //   reveal back-stepping).

  function onContinue() {
    // If the active step needs special handling (e.g. TEACH advancing card
    // by card before moving to VOCAB), it sets journey.onContinueOverride.
    if (typeof journey.onContinueOverride === "function") {
      const handled = journey.onContinueOverride();
      if (handled === true) return;
    }
    const nxt = nextOf(currentStep, lesson);
    goto(nxt);
  }

  function onBack() {
    if (typeof journey.onBackOverride === "function") {
      const handled = journey.onBackOverride();
      if (handled === true) return;
    }
    // Default: previous step, or back to Learn from INTRO.
    switch (currentStep) {
      case "intro":    return router.go("#/learn");
      case "teach":    return goto("intro");
      case "vocab":    return goto("teach");
      case "practice": return goto(lesson.vocabulary && lesson.vocabulary.length > 0 ? "vocab" : "teach");
      case "quiz":     return goto("practice");
      case "complete": return router.go("#/learn");
    }
  }

  // First mount
  renderStep(currentStep, false);
}
