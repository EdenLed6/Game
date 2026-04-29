// quiz.js — Step 5 of LessonJourney (showQuizQuestion + onQuizComplete).
//
// 1:1 port of LessonJourneyActivity.showQuizQuestion() (Kotlin :1041–1314)
// and the failure-retry path in onQuizComplete() (Kotlin :1316–1397).
//
// IMPORTANT: this is the IN-JOURNEY quiz, NOT the standalone QuizActivity.
// The shell hides the bottom continue button while this step is active —
// the quiz manages its own check / next buttons internally. On a passing
// score (>=80%) we call journey.setQuizComplete(true) to advance to
// COMPLETE; on fail we render a retry card in-place and reset state.
//
// Quiz state lives only inside this renderer — re-entering the step (e.g.
// from the retry card) starts a fresh attempt. There is no progress chip
// or running-score display during the quiz: the Android version just
// shows "שאלה N / total" centered above each question.

import { el } from "../../dom.js";
import { speak } from "../../speaker.js";
import { markLessonCompleted } from "../../store.js";

// ─────────────────────────────────────────────────────────────
// Helpers — re-derived locally per task spec (do NOT import).
// Kotlin :1493–1498 — the same heuristic the standalone quiz uses.
// ─────────────────────────────────────────────────────────────

// True if the string contains any Hebrew code-point (U+0590..U+05FF).
// Mirrors the Kotlin String.isHebrew() extension.
function isHebrew(s) {
  if (typeof s !== "string") return false;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 0x0590 && c <= 0x05FF) return true;
  }
  return false;
}

// Whitespace-split, drop tokens that contain ANY Hebrew character, keep
// everything else (Latin / Japanese / digits / punctuation), join with
// single spaces. Used to decide whether to show a speaker button: if the
// extracted romaji is non-empty, there's something speakable.
function extractRomaji(s) {
  if (typeof s !== "string" || s.length === 0) return "";
  return s
    .split(/\s+/)
    .filter((w) => w.length > 0 && !isHebrew(w))
    .join(" ")
    .trim();
}

// ─────────────────────────────────────────────────────────────
// Speaker button (red, 44dp default / 48dp for the question card).
// Kotlin :1103–1118 + :1226–1241.
// ─────────────────────────────────────────────────────────────

function speakerButton(text, { large = false, ariaLabel = "השמע" } = {}) {
  return el(
    "button",
    {
      type: "button",
      class: large
        ? "lj-speaker lj-speaker--lg lj-quiz__speaker"
        : "lj-speaker lj-quiz__speaker",
      "aria-label": ariaLabel,
      onClick: (ev) => {
        ev.stopPropagation();
        speak(text);
      },
    },
    "🔊",
  );
}

// ─────────────────────────────────────────────────────────────
// Renderer
// ─────────────────────────────────────────────────────────────

export function Quiz({ hostEl, lesson, journey, ctx }) {
  // Per task spec + Kotlin :1047 / :1326 — the bottom shell button is hidden
  // for the entire QUIZ step, including the retry card. Re-call on every
  // render to be safe (the shell resets it before each step).
  journey.setContinueVisible(false);

  const exercises = Array.isArray(lesson.exercises) ? lesson.exercises : [];
  const total = exercises.length;

  // Per Kotlin :155 — entering QUIZ resets index/score. Renderers are called
  // anew each time the shell enters a step, so plain locals suffice.
  let quizIndex = 0;
  let quizScore = 0;

  // Defensive: a lesson with no exercises shouldn't reach here, but if it
  // does, immediately treat it as a pass so the journey advances cleanly.
  if (total === 0) {
    markLessonCompleted(lesson.id);
    journey.setQuizComplete(true);
    return;
  }

  function renderQuestion() {
    journey.setContinueVisible(false);
    hostEl.innerHTML = "";

    if (quizIndex >= total) {
      onQuizComplete();
      return;
    }

    const q = exercises[quizIndex];

    // ── Counter (Kotlin :1066–1075) ──
    const counter = el(
      "p",
      { class: "lj-counter lj-quiz__counter" },
      `שאלה ${quizIndex + 1} / ${total}`,
    );

    // ── Question card (Kotlin :1078–1128) ──
    const questionText = el(
      "p",
      { class: "lj-quiz__question-text" },
      q.question || "",
    );
    const questionRow = el(
      "div",
      { class: "lj-quiz__question-row" },
      questionText,
    );
    // Per user request: only the question card has its speaker button
    // removed. The question TEXT itself becomes the tap target (click
    // the word to hear it). Options below keep their speakers + their
    // original click-to-select behavior. Only enabled when the question
    // has speakable non-Hebrew content.
    const questionRomaji = extractRomaji(q.question || "");
    if (questionRomaji.length > 0) {
      questionText.classList.add("lj-quiz__question-text--clickable");
      questionText.setAttribute("role", "button");
      questionText.setAttribute("tabindex", "0");
      questionText.setAttribute("aria-label", "השמע את השאלה");
      questionText.addEventListener("click", () => {
        speak(questionRomaji);
      });
      questionText.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          speak(questionRomaji);
        }
      });
    }
    const questionCard = el(
      "div",
      { class: "lj-card lj-quiz__question-card" },
      questionRow,
    );

    // ── Feedback label (Kotlin :1131–1141 — invisible until checked) ──
    const feedbackLabel = el(
      "p",
      { class: "lj-quiz__feedback", "aria-live": "polite" },
      "",
    );

    // ── Hint card (Kotlin :1144–1176 — hidden until wrong + has explanation) ──
    const hintText = el("span", { class: "lj-quiz__hint-text" }, "");
    const hintCard = el(
      "div",
      { class: "lj-quiz__hint", hidden: true },
      el("span", { class: "lj-quiz__hint-icon", "aria-hidden": "true" }, "💡"),
      hintText,
    );

    // ── Options (Kotlin :1184–1246) ──
    const optionsWrap = el("div", { class: "lj-quiz__options" });
    const optionButtons = [];
    let selectedIndex = null;
    let answered = false;

    const options = Array.isArray(q.options) ? q.options : [];
    options.forEach((optionText, idx) => {
      const text = String(optionText ?? "");
      const btn = el(
        "button",
        {
          type: "button",
          class: "lj-quiz__option bg-option-default",
          "data-index": String(idx),
        },
        el("span", { class: "lj-quiz__option-label" }, text),
      );

      btn.addEventListener("click", () => {
        if (answered) return;
        selectedIndex = idx;
        // Re-tint each option: selected gets the yellow-on-gold treatment,
        // others revert to the default washi outlined style.
        optionButtons.forEach((b, i) => {
          b.classList.remove(
            "bg-option-default",
            "bg-option-selected",
            "bg-option-correct",
            "bg-option-wrong",
            "lj-quiz__option--correct",
            "lj-quiz__option--wrong",
          );
          b.classList.add(i === idx ? "bg-option-selected" : "bg-option-default");
        });
        checkBtn.disabled = false;
      });

      // Long-press to speak the option (mirrors Kotlin :1223–1225). Optional
      // QoL — single-tap is reserved for selecting.
      const optRomaji = extractRomaji(text);
      if (optRomaji.length > 0) {
        let lpTimer = null;
        const startLP = () => {
          lpTimer = setTimeout(() => {
            lpTimer = null;
            speak(optRomaji);
          }, 500);
        };
        const cancelLP = () => {
          if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
        };
        btn.addEventListener("pointerdown", startLP);
        btn.addEventListener("pointerup", cancelLP);
        btn.addEventListener("pointerleave", cancelLP);
        btn.addEventListener("pointercancel", cancelLP);
      }

      optionButtons.push(btn);

      const row = el("div", { class: "lj-quiz__option-row" }, btn);
      // Kotlin :1244 — speaker button is only rendered when the option text
      // has any non-Hebrew speakable content.
      if (optRomaji.length > 0) {
        row.appendChild(
          speakerButton(optRomaji, {
            large: false,
            ariaLabel: "השמע אפשרות",
          }),
        );
      }
      optionsWrap.appendChild(row);
    });

    // ── Check button (Kotlin :1249–1290) ──
    const checkBtn = el(
      "button",
      {
        type: "button",
        class: "btn btn--block lj-quiz__check",
        disabled: "true",
      },
      "בדוק ✓",
    );

    // ── Next button (Kotlin :1293–1310) ──
    const nextBtn = el(
      "button",
      {
        type: "button",
        class: "btn btn--block lj-quiz__next",
        hidden: true,
      },
      // The on-screen label in the Kotlin shows "הבא ▶". The task brief
      // mentions "השאלה הבאה ▶"; on the LAST question we say "סיים ✓" so
      // the user knows they're finishing rather than continuing.
      "השאלה הבאה ▶",
    );

    checkBtn.addEventListener("click", () => {
      if (answered) return;
      if (selectedIndex == null) return;
      answered = true;

      const correct = Number(q.correctIndex);

      // Disable everything once the answer is locked in.
      checkBtn.disabled = true;
      optionButtons.forEach((b) => { b.disabled = true; });

      // Highlight the correct option in green (white text via CSS modifier).
      const correctBtn = optionButtons[correct];
      if (correctBtn) {
        correctBtn.classList.remove(
          "bg-option-default",
          "bg-option-selected",
          "bg-option-wrong",
        );
        correctBtn.classList.add("bg-option-correct", "lj-quiz__option--correct");
      }

      if (selectedIndex === correct) {
        quizScore += 1;
        feedbackLabel.textContent = "✓ נכון!";
        feedbackLabel.classList.add("lj-quiz__feedback--correct");
        feedbackLabel.classList.remove("lj-quiz__feedback--wrong");
        feedbackLabel.style.visibility = "visible";
      } else {
        const chosen = optionButtons[selectedIndex];
        if (chosen) {
          chosen.classList.remove(
            "bg-option-default",
            "bg-option-selected",
            "bg-option-correct",
          );
          chosen.classList.add("bg-option-wrong", "lj-quiz__option--wrong");
        }
        feedbackLabel.textContent = "✗ לא נכון";
        feedbackLabel.classList.add("lj-quiz__feedback--wrong");
        feedbackLabel.classList.remove("lj-quiz__feedback--correct");
        feedbackLabel.style.visibility = "visible";

        const expl = (q.explanation || "").trim();
        if (expl.length > 0) {
          hintText.textContent = expl;
          hintCard.hidden = false;
        }
      }

      checkBtn.hidden = true;
      nextBtn.hidden = false;

      // On the last question, retitle the next button so users know it
      // finishes the quiz rather than continuing to another question.
      if (quizIndex === total - 1) {
        nextBtn.textContent = "סיים ✓";
      }
    });

    nextBtn.addEventListener("click", () => {
      quizIndex += 1;
      renderQuestion();
    });

    // ── Mount ──
    hostEl.appendChild(
      el(
        "div",
        { class: "lj-step lj-step--quiz" },
        counter,
        questionCard,
        feedbackLabel,
        hintCard,
        optionsWrap,
        checkBtn,
        nextBtn,
      ),
    );
  }

  function onQuizComplete() {
    // Kotlin :1316–1324 — pass uses integer math (Math.floor of percent).
    const percent = total > 0 ? Math.floor((quizScore * 100) / total) : 0;

    if (percent >= 80) {
      // Mark progress + hand control back to the shell. The shell decides
      // when to advance to COMPLETE (and may layer XP / streak there).
      try { markLessonCompleted(lesson.id); } catch (_) { /* ignore */ }
      journey.setQuizComplete(true);
      return;
    }

    // ── Failure retry card (Kotlin :1326–1397) ──
    journey.setContinueVisible(false);
    hostEl.innerHTML = "";

    const retryBtn = el(
      "button",
      { type: "button", class: "btn btn--block lj-quiz__retry-btn" },
      "נסה שוב",
    );
    retryBtn.addEventListener("click", () => {
      quizIndex = 0;
      quizScore = 0;
      renderQuestion();
    });

    // Secondary "back to learn map" button — task brief addition. Falls back
    // to journey.advance() if no router is available on ctx.
    const backBtn = el(
      "button",
      { type: "button", class: "btn btn--outlined btn--block lj-quiz__retry-back" },
      "חזור לנתיב",
    );
    backBtn.addEventListener("click", () => {
      const router = ctx && ctx.router;
      if (router && typeof router.go === "function") {
        router.go("#/learn");
      } else if (typeof journey.advance === "function") {
        journey.advance();
      }
    });

    const retryCard = el(
      "div",
      { class: "lj-step lj-step--quiz lj-quiz__retry" },
      el("div", { class: "lj-quiz__retry-emoji", "aria-hidden": "true" }, "📚"),
      el(
        "div",
        { class: "lj-quiz__retry-score" },
        `${quizScore} / ${total}`,
      ),
      el(
        "div",
        { class: "lj-quiz__retry-percent" },
        `ניקוד: ${percent}%`,
      ),
      el(
        "p",
        { class: "lj-quiz__retry-hint" },
        "אופס — מתחת ל-80%. נדרש 80% כדי לעבור את השיעור. נסה שוב!",
      ),
      retryBtn,
      backBtn,
    );

    hostEl.appendChild(retryCard);
  }

  // Kick off question 1.
  renderQuestion();
}
