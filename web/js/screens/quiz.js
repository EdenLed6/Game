// Quiz screen — pixel-1:1 port of activity_quiz.xml + QuizActivity.kt.
//
// The Android layout is a vertical LinearLayout:
//   1) Gradient hero  (paddingTop=44, side=20, paddingBottom=20)
//        - MaterialToolbar (back arrow + title)
//        - LinearProgressIndicator (gold/F59E0B on track #4A1A16)
//        - "שאלה N מתוך M" counter (white 12sp 0.8 alpha)
//   2) NestedScrollView (padding=20dp) holding
//        - Question card (MaterialCardView, 20dp radius, 1dp stroke, 2dp elev)
//          * Question text (20sp bold) + speak icon-button (48x48 circle)
//        - Four App.Button.Option cards (16dp radius, 58dp min height)
//        - Optional feedback card (16dp radius, 1dp dividerSoft stroke)
//        - Submit (filled red 28dp pill) / Next (outlined red pill) button
//   3) Results layout (replaces body when done): emoji 72sp, 52sp red score,
//      18sp bold message, 14sp muted summary, gold achievement pill,
//      filled "שחק שוב" + outlined "חזור לשיעור" buttons.

import { el, mount } from "../dom.js";
import { Router } from "../router.js";
import { Speaker } from "../speaker.js";
import { Progress } from "../store.js";

export function Quiz(data, lessonId) {
  const lesson = data.lessonsById[lessonId];
  if (!lesson || !lesson.exercises || !lesson.exercises.length) {
    Router.go(`/lesson/${lessonId}`);
    return;
  }

  // Mirror QuizActivity field state.
  const state = {
    questions: lesson.exercises,
    index: 0,
    score: 0,
    selected: null,    // selectedIndex
    submitted: false,  // toggled on submit; locks options + reveals feedback
    finished: false,   // flips body → results layout
  };

  // ----- Render -----------------------------------------------------------

  function render() {
    const view = el(
      "div",
      { class: "quiz-screen" },
      hero(),
      state.finished ? renderResults() : renderBody()
    );
    mount(view);
  }

  // Gradient hero with toolbar + progress + counter (always visible until results).
  function hero() {
    const total = state.questions.length;
    const progressPercent = state.finished
      ? 100
      : Math.round((state.index / total) * 100);

    return el(
      "header",
      { class: "quiz-hero" },
      el(
        "div",
        { class: "app-toolbar", style: { paddingTop: "0", paddingBottom: "0" } },
        el(
          "button",
          {
            class: "toolbar-back",
            "aria-label": "חזור",
            onClick: () => Router.go(`/lesson/${lessonId}`),
          },
          // Hebrew/RTL: visual back arrow points right.
          "←"
        ),
        el("h1", { class: "toolbar-title" }, "חידון")
      ),
      // Progress indicator + counter only shown during quiz, not on results.
      !state.finished
        ? el(
            "div",
            { class: "quiz-progress-bar" },
            el("div", {
              class: "fill",
              style: { width: progressPercent + "%" },
            })
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

  // Body: question card + 4 options + (feedback) + submit/next button.
  function renderBody() {
    const q = state.questions[state.index];
    const total = state.questions.length;

    // 4 buttons mirror btnOption0..3. The XML hard-codes 4; we render only as
    // many as the question provides (up to 4) — extras are hidden, matching
    // the Kotlin "btn.visibility = if (i < options.size) VISIBLE else GONE".
    const options = (q.options || []).slice(0, 4);

    const optionEls = options.map((opt, i) => {
      let cls = "quiz-option";
      if (state.submitted) {
        if (i === q.correctIndex) cls += " is-correct";
        else if (i === state.selected) cls += " is-wrong";
      } else if (state.selected === i) {
        cls += " is-selected";
      }
      return el(
        "button",
        {
          class: cls,
          type: "button",
          disabled: state.submitted,
          onClick: () => onSelect(i),
        },
        opt
      );
    });

    return el(
      "main",
      { class: "quiz-body" },
      // Question card
      el(
        "section",
        { class: "quiz-question-card" },
        el("p", { class: "quiz-question-text" }, q.question || ""),
        el(
          "button",
          {
            class: "quiz-speak-btn",
            type: "button",
            "aria-label": "השמע שאלה",
            onClick: () => Speaker.speak(q.question || ""),
          },
          // ic_volume.xml — recreated as a small inline SVG so it always renders
          // even before assets are cached.
          volumeIcon()
        )
      ),
      // Options
      ...optionEls,
      // Feedback card — visible only after submit (mirrors cardFeedback.visibility)
      state.submitted
        ? el(
            "div",
            { class: "quiz-feedback" },
            feedbackText(q)
          )
        : null,
      // Submit / Next button (mutually exclusive, like the XML)
      state.submitted
        ? el(
            "button",
            {
              class: "btn btn-outlined quiz-action",
              type: "button",
              onClick: onNext,
            },
            state.index + 1 < total ? "השאלה הבאה ◀" : "סיום"
          )
        : el(
            "button",
            {
              class: "btn quiz-action",
              type: "button",
              disabled: state.selected == null,
              onClick: onSubmit,
            },
            "בדיקת תשובה"
          )
    );
  }

  // Results layout — mirrors layoutResults block in the XML.
  function renderResults() {
    const total = state.questions.length;
    const percent = Math.floor((state.score * 100) / total);
    const passed = percent >= 70;

    return el(
      "section",
      { class: "quiz-results" },
      el(
        "p",
        { class: "result-emoji" },
        passed ? "🎉" : "📚"
      ),
      el(
        "p",
        { class: "result-final-score" },
        `${state.score} / ${total}`
      ),
      el(
        "p",
        { class: "result-message" },
        passed ? "כל הכבוד! עברת את השיעור!" : "נסה שוב כדי לעבור את השיעור (70% נדרש)"
      ),
      el(
        "p",
        { class: "result-summary" },
        `דיוק: ${percent}% · נדרש 70% כדי להשלים את השיעור`
      ),
      el(
        "p",
        { class: "result-achievement" },
        passed
          ? "השיעור סומן כהושלם. ההתקדמות שלך נשמרה במכשיר."
          : "אפשר לחזור על החידון. הניקוד מתאפס רק כשלוחצים שחק שוב."
      ),
      el(
        "button",
        {
          class: "btn btn-replay",
          type: "button",
          onClick: onReplay,
        },
        "שחק שוב"
      ),
      el(
        "button",
        {
          class: "btn btn-outlined btn-back",
          type: "button",
          onClick: () => Router.go(`/lesson/${lessonId}`),
        },
        "חזור לשיעור"
      )
    );
  }

  // ----- Behaviour --------------------------------------------------------

  function onSelect(i) {
    if (state.submitted) return;
    state.selected = i;
    render();
  }

  function onSubmit() {
    if (state.submitted || state.selected == null) return;
    state.submitted = true;
    if (state.selected === state.questions[state.index].correctIndex) {
      state.score++;
    }
    render();
  }

  function onNext() {
    state.index++;
    state.selected = null;
    state.submitted = false;
    if (state.index >= state.questions.length) {
      // Mirror "showResults": persist progress on a passing run.
      const total = state.questions.length;
      const percent = Math.floor((state.score * 100) / total);
      if (percent >= 70) {
        Progress.markLessonCompleted(lessonId);
      }
      state.finished = true;
    }
    render();
  }

  function onReplay() {
    state.index = 0;
    state.score = 0;
    state.selected = null;
    state.submitted = false;
    state.finished = false;
    render();
  }

  function feedbackText(q) {
    const explanation = (q.explanation || "").trim();
    if (explanation) return explanation;
    return state.selected === q.correctIndex
      ? "Correct."
      : "Review the lesson notes and try the next one.";
  }

  function volumeIcon() {
    // Inline SVG copy of res/drawable/ic_volume.xml (filled to currentColor so it
    // tracks the button's text color when red or white).
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML =
      '<path fill="currentColor" d="M3,9v6h4l5,5V4L7,9H3zm13.5,3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-0.73 2.5-2.25 2.5-4.02z"/>' +
      '<path fill="currentColor" d="M14,3.23v2.06c2.89,0.86 5,3.54 5,6.71s-2.11,5.85-5,6.71v2.06c4.01-0.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    return svg;
  }

  render();
}
