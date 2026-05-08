// quiz.js — Step 5 of LessonJourney (port of design's QuizPhase).
//
// Layout (per design_handoff_kimura_redesign/screen-lesson.jsx):
//
//   "שאלה {qi+1} מתוך {N} · ניקוד {score}"     (10px ink-soft tag line)
//   ┌─ .card.quiz-question (with shake on wrong) ────────────┐
//   │ {question} (Frank Ruhl Libre 17px, 700)                 │
//   └─────────────────────────────────────────────────────────┘
//   ┌─ option list (scrollable) ─────────────────────────────┐
//   │ .choice.tap data-state={selected|correct|wrong|""}      │
//   │   .choice-num א/ב/ג/ד                                   │
//   │   text (Hebrew or Japanese)                             │
//   │   ▶ btn-icon if speakable                                │
//   │   ✓ if correct, ✕ if wrong                              │
//   └─────────────────────────────────────────────────────────┘
//   (verdict + explanation card on submit)
//   ┌─ .quiz-explain (jade tint if correct, cream-2 if wrong) ┐
//   │ "הסבר:" + explanation                                   │
//   └─────────────────────────────────────────────────────────┘
//   <button btn-primary> "בדיקה" (or "סיום שיעור" / "הבא")
//
// The journey shell's continue button is hidden — the quiz owns its
// own check/next button. On final answer (≥80%), the shell's
// `setQuizComplete(true)` advances to "complete"; on retry the user
// is brought back to the start of this phase.

import { el } from "../../dom.js";
import { speak } from "../../speaker.js";

const HEBREW_LABELS = ["א", "ב", "ג", "ד", "ה", "ו"];

// Detect if a string contains anything that should be spoken (Latin /
// Japanese — but never spoken if it's pure Hebrew).
function isSpeakable(s) {
  if (!s) return false;
  return /[A-Za-zĀ-ž぀-ヿ一-鿿]/.test(s);
}

function isJapanese(s) {
  return /[぀-ヿ一-鿿]/.test(s || "");
}

function audioBtn(text, sizePx) {
  return el(
    "button",
    {
      type: "button",
      class: "btn-icon audio-pulse choice__audio",
      style: { width: sizePx + "px", height: sizePx + "px",
               background: "var(--c-cream-2)",
               color: "var(--c-red-deep)",
               flex: "0 0 auto" },
      "aria-label": "השמע",
      onClick: (e) => {
        e.stopPropagation();
        const t = e.currentTarget;
        t.classList.add("playing");
        speak(text);
        setTimeout(() => t.classList.remove("playing"), 900);
      },
    },
    el("span", { "aria-hidden": "true", style: { fontSize: "12px" } }, "🔊"),
  );
}

export function Quiz({ hostEl, lesson, journey }) {
  journey.setContinueVisible(false);

  const list = Array.isArray(lesson.exercises) ? lesson.exercises : [];
  if (list.length === 0) {
    journey.setQuizComplete(true);
    return;
  }

  let qi = 0;
  let picked = null;
  let verdict = null; // "correct" | "wrong" | null
  let score = 0;
  let shakeKey = 0;

  function rebuild() {
    hostEl.innerHTML = "";
    hostEl.appendChild(buildPhase());
  }

  function choose(i) {
    if (verdict) return;
    picked = i;
    rebuild();
  }

  function submitAnswer() {
    if (picked == null) return;
    const q = list[qi];
    const ok = picked === Number(q.correctIndex);
    verdict = ok ? "correct" : "wrong";
    if (ok) score += 1;
    else shakeKey += 1;
    rebuild();
  }

  function advance() {
    if (qi >= list.length - 1) {
      // Lesson done — pass threshold 80%. Stash the final score so
      // the Complete phase can read it (we lift it through a global
      // because the journey shell renderer chain doesn't pipe phase
      // state through props).
      window.__kimuraQuizScore = score;
      const pct = Math.round((score / list.length) * 100);
      const passed = pct >= 80;
      if (passed) {
        journey.setQuizComplete(true);
      } else {
        // Failed — advance to Complete anyway so it can show the
        // "fail + retry" UI.
        journey.advance();
      }
      return;
    }
    qi += 1;
    picked = null;
    verdict = null;
    rebuild();
  }

  function buildPhase() {
    const q = list[qi];
    const meta = el(
      "div",
      { class: "quiz-meta" },
      "שאלה " + (qi + 1) + " מתוך " + list.length + " · ניקוד " + score,
    );

    const cardCls = ["card", "quiz-question"];
    if (shakeKey % 2 === 1) cardCls.push("shake");

    const questionCard = el(
      "div",
      { class: cardCls.join(" ") },
      el("div", { class: "quiz-question__text" }, q.question || ""),
    );

    const opts = Array.isArray(q.options) ? q.options : [];
    const correctIdx = Number(q.correctIndex);
    const optionsList = el("div", { class: "quiz-options" });
    opts.forEach((opt, i) => {
      let state = "";
      if (picked === i && !verdict) state = "selected";
      if (verdict) {
        if (i === correctIdx) state = "correct";
        else if (i === picked) state = "wrong";
      }
      const optStr = String(opt == null ? "" : opt);
      const speakable = isSpeakable(optStr);
      const jp = isJapanese(optStr);

      const choiceEl = el(
        "div",
        {
          class: "choice tap",
          role: "button",
          tabindex: "0",
          "data-state": state,
          onClick: () => choose(i),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              choose(i);
            }
          },
        },
        el("span", { class: "choice-num" }, HEBREW_LABELS[i] || String(i + 1)),
        el(
          "span",
          {
            class: "choice-text" + (jp ? " jp" : ""),
            style: jp
              ? { fontFamily: "var(--f-jp)", fontSize: "20px",
                  lineHeight: "1.3", textAlign: "start", flex: "1 1 auto" }
              : { fontFamily: "var(--f-he-sans)", fontSize: "14px",
                  lineHeight: "1.3", textAlign: "start", flex: "1 1 auto" },
          },
          optStr,
        ),
        speakable ? audioBtn(optStr, 28) : null,
        state === "correct"
          ? el("span", { class: "choice__verdict-icon",
                         "aria-hidden": "true" }, "✓")
          : null,
        state === "wrong"
          ? el("span", { class: "choice__verdict-icon",
                         "aria-hidden": "true" }, "✕")
          : null,
      );
      optionsList.appendChild(choiceEl);
    });

    const explain = (verdict && q.explanation)
      ? el(
          "div",
          {
            class: "quiz-explain"
              + (verdict === "correct"
                ? " quiz-explain--correct"
                : " quiz-explain--wrong"),
          },
          el("strong", { class: "quiz-explain__tag" }, "הסבר:"),
          el("span", null, " " + q.explanation),
        )
      : null;

    const action = verdict
      ? el(
          "button",
          {
            type: "button",
            class: "btn btn-primary quiz-action",
            onClick: advance,
          },
          qi >= list.length - 1 ? "סיום שיעור ←" : "הבא ←",
        )
      : el(
          "button",
          {
            type: "button",
            class: "btn btn-primary quiz-action",
            disabled: picked == null ? "true" : undefined,
            onClick: submitAnswer,
          },
          "בדיקה",
        );

    return el(
      "div",
      { class: "lj-step lj-step--quiz quiz-phase" },
      meta,
      questionCard,
      optionsList,
      explain,
      action,
    );
  }

  hostEl.appendChild(buildPhase());
}
