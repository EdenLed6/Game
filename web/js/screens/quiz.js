// quiz.js — 1:1 port of activity_quiz.xml + QuizActivity.kt.
//
// Layout (top → bottom):
//   1) Header (HeaderLinearLayout port, bg_header.png) holding
//        - Toolbar (back arrow + "חידון" title)
//        - LinearProgressIndicator (gold #F59E0B over #4A1A16 track, 4dp radius)
//        - "שאלה N מתוך M" counter (12sp, white @ 0.8)
//   2) Scroll body (padding 20dp) holding
//        - Question card (MaterialCardView 20dp radius, 1dp stroke, surface
//          background, 20dp inner padding) with question text + 48dp circular
//          speaker button.
//        - 4 option rows. Each row = an option button (16dp radius, 58dp min,
//          surface bg, 2dp red stroke) PLUS a 44dp circular red speaker button
//          on the right.
//        - Feedback card (16dp radius, dividerSoft stroke) — visible after
//          submit; shows the question's explanation.
//        - Full-width red Submit button → after submit becomes Next.
//   3) Results layout (replaces body when finished):
//        - 72sp emoji
//        - 52sp red final score "score / total"
//        - 18sp bold message
//        - 14sp muted summary ("דיוק: X% · נדרש 80% כדי להשלים את השיעור")
//        - achievement pill
//        - "שחק שוב" + "חזור לשיעור" buttons
//
// Speaker buttons next to the question and each option play the text via
// Speaker.speak(). On a passing score (>=80%) the lesson is marked complete.

import { el, mount } from "../dom.js";

// Mirrors QuizActivity.kt — `if (percent >= 80)` everywhere.
const PASS_THRESHOLD = 80;

// Inline ic_volume.svg — red speaker glyph; we recolor via fill="currentColor".
function volumeIconWhite() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  const p1 = document.createElementNS(ns, "path");
  p1.setAttribute("fill", "currentColor");
  p1.setAttribute(
    "d",
    "M3,9v6h4l5,5V4L7,9H3zm13.5,3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-0.73 2.5-2.25 2.5-4.02z"
  );
  const p2 = document.createElementNS(ns, "path");
  p2.setAttribute("fill", "currentColor");
  p2.setAttribute(
    "d",
    "M14,3.23v2.06c2.89,0.86 5,3.54 5,6.71s-2.11,5.85-5,6.71v2.06c4.01-0.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
  );
  svg.appendChild(p1);
  svg.appendChild(p2);
  return svg;
}

// Hebrew range — used to decide whether to speak an option (Japanese vs Hebrew).
const HEBREW_RANGE = /[֐-׿]/;
function isHebrew(text) {
  return HEBREW_RANGE.test(String(text || ""));
}

// Strip Hebrew tokens to get the romaji/Japanese portion of a question.
function extractRomaji(text) {
  return String(text || "")
    .split(/\s+/)
    .filter(w => w.length > 0 && !HEBREW_RANGE.test(w))
    .join(" ")
    .trim();
}

export function Quiz({ host, ctx, params }) {
  const { lessons, router, store, speaker } = ctx;
  const lessonId = Number(params.id);
  const lesson = (lessons || []).find(l => Number(l.id) === lessonId);

  if (!lesson || !Array.isArray(lesson.exercises) || lesson.exercises.length === 0) {
    router.go(`#/lesson/${lessonId}`);
    return;
  }

  const state = {
    questions: lesson.exercises,
    index: 0,
    score: 0,
    selected: null,
    submitted: false,
    finished: false,
    completedThisRun: false,
  };

  // ---- Render --------------------------------------------------------------
  function render() {
    const root = el(
      "div",
      { class: "screen quiz-screen" },
      renderHeader(),
      state.finished ? renderResults() : renderBody()
    );
    mount(host, root);
  }

  function renderHeader() {
    const total = state.questions.length;
    // Mirror QuizActivity: progressBarQuiz.progress = currentIndex * 100 / total (Kotlin int div).
    const percent = state.finished
      ? 100
      : Math.floor((state.index * 100) / total);

    return el(
      "header",
      { class: "quiz-header" },
      el(
        "div",
        { class: "quiz-header__top" },
        el(
          "button",
          {
            type: "button",
            class: "quiz-header__back",
            "aria-label": "חזור",
            onClick: () => router.back(),
          },
          el("img", { src: "assets/icons/ic_arrow_back.svg", alt: "" })
        ),
        // QuizActivity layout has no app:title — toolbar inherits the
        // application label ("Kimura" from <application android:label="…">).
        el("h1", { class: "quiz-header__title" }, "Kimura")
      ),
      // LinearProgressIndicator (gold over dark-red track)
      !state.finished
        ? el(
            "div",
            { class: "quiz-progress", role: "progressbar",
              "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": percent },
            el("div", { class: "quiz-progress__fill", style: { width: percent + "%" } })
          )
        : null,
      !state.finished
        ? el(
            "p",
            { class: "quiz-counter" },
            `שאלה ${state.index + 1} מתוך ${total}`
          )
        : null
    );
  }

  function renderBody() {
    const q = state.questions[state.index];
    const options = (q.options || []).slice(0, 4);
    const showQuestionSpeak = extractRomaji(q.question || "").length > 0;

    return el(
      "main",
      { class: "quiz-body" },
      // Question card — MaterialCardView, surface, 20dp radius, 1dp stroke
      el(
        "section",
        { class: "quiz-question-card" },
        el("p", { class: "quiz-question-text" }, q.question || ""),
        showQuestionSpeak
          ? el(
              "button",
              {
                type: "button",
                class: "quiz-speak quiz-speak--question",
                "aria-label": "השמע שאלה",
                onClick: () => {
                  const r = extractRomaji(q.question || "");
                  if (r) speaker.speak(r);
                },
              },
              volumeIconWhite()
            )
          : null
      ),
      // Option rows: option button + circular speaker button (only if not Hebrew)
      ...options.map((opt, i) => renderOptionRow(opt, i)),
      // Feedback card — visible only after submit. Fallback strings match
      // QuizActivity.submitAnswer():
      //   if (selected == correctIndex) "Correct." else "Review the lesson notes and try the next one."
      state.submitted
        ? el(
            "div",
            { class: "quiz-feedback" },
            (q.explanation && q.explanation.trim()) ||
              (state.selected === q.correctIndex
                ? "Correct."
                : "Review the lesson notes and try the next one.")
          )
        : null,
      // Submit / Next button — Kotlin layout literals: btnSubmit="בדיקת תשובה",
      // btnNext="השאלה הבאה ▶". The Next button text never changes on the
      // last question.
      state.submitted
        ? el(
            "button",
            {
              type: "button",
              class: "btn btn--block quiz-action quiz-action--next",
              onClick: onNext,
            },
            "השאלה הבאה ▶"
          )
        : el(
            "button",
            {
              type: "button",
              class: "btn btn--block quiz-action quiz-action--submit",
              disabled: state.selected == null,
              onClick: onSubmit,
            },
            "בדיקת תשובה"
          )
    );
  }

  function renderOptionRow(opt, i) {
    const q = state.questions[state.index];
    let stateClass = "";
    if (state.submitted) {
      if (i === q.correctIndex) stateClass = "is-correct";
      else if (i === state.selected) stateClass = "is-wrong";
    } else if (state.selected === i) {
      stateClass = "is-selected";
    }

    return el(
      "div",
      { class: "quiz-option-row" },
      el(
        "button",
        {
          type: "button",
          class: ["quiz-option", stateClass].filter(Boolean).join(" "),
          disabled: state.submitted,
          onClick: () => onSelect(i),
        },
        opt
      ),
      !isHebrew(opt)
        ? el(
            "button",
            {
              type: "button",
              class: "quiz-speak quiz-speak--option",
              "aria-label": "השמע אפשרות",
              onClick: (e) => {
                e.stopPropagation();
                speaker.speak(opt);
              },
            },
            volumeIconWhite()
          )
        : null
    );
  }

  function renderResults() {
    const total = state.questions.length;
    // Mirror QuizActivity: val percent = score * 100 / total (Kotlin int div).
    const percent = Math.floor((state.score * 100) / total);
    const passed = percent >= PASS_THRESHOLD;
    return el(
      "main",
      { class: "quiz-results" },
      el("p", { class: "quiz-results__emoji" }, passed ? "🎉" : "📚"),
      el("p", { class: "quiz-results__score" }, `${state.score} / ${total}`),
      el(
        "p",
        { class: "quiz-results__message" },
        passed ? "כל הכבוד! עברת את השיעור!" : "נסה שוב כדי לעבור את השיעור (80% נדרש)"
      ),
      el(
        "p",
        { class: "quiz-results__summary" },
        `דיוק: ${percent}% · נדרש ${PASS_THRESHOLD}% כדי להשלים את השיעור`
      ),
      el(
        "p",
        { class: "quiz-results__achievement bg-achievement-pill" },
        passed
          ? "השיעור סומן כהושלם. ההתקדמות שלך נשמרה במכשיר."
          : "אפשר לחזור על החידון. הניקוד מתאפס רק כשלוחצים שחק שוב."
      ),
      el(
        "button",
        {
          type: "button",
          class: "btn btn--block quiz-results__btn",
          onClick: onReplay,
        },
        "שחק שוב"
      ),
      el(
        "button",
        {
          type: "button",
          class: "btn btn--outlined btn--block quiz-results__btn",
          onClick: () => router.go(`#/lesson/${lessonId}`),
        },
        "חזור לשיעור"
      )
    );
  }

  // ---- Handlers ------------------------------------------------------------
  function onSelect(i) {
    if (state.submitted) return;
    state.selected = i;
    render();
  }

  function onSubmit() {
    if (state.submitted || state.selected == null) return;
    state.submitted = true;
    const q = state.questions[state.index];
    if (state.selected === q.correctIndex) state.score++;
    render();
  }

  function onNext() {
    if (state.index + 1 < state.questions.length) {
      state.index++;
      state.selected = null;
      state.submitted = false;
      render();
    } else {
      // Quiz finished — mark completion if passed.
      // Mirror QuizActivity.kt exactly: only ProgressManager.markLessonCompleted
      // is called; no XP and no recordActivity (those live in LessonJourneyActivity).
      const total = state.questions.length;
      const percent = Math.floor((state.score * 100) / total);
      if (percent >= PASS_THRESHOLD && !state.completedThisRun) {
        try { store.markLessonCompleted(lessonId); } catch {}
        state.completedThisRun = true;
      }
      state.finished = true;
      render();
    }
  }

  function onReplay() {
    state.index = 0;
    state.score = 0;
    state.selected = null;
    state.submitted = false;
    state.finished = false;
    state.completedThisRun = false;
    render();
  }

  render();
}
