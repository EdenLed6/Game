// practice.js — Step 4 of LessonJourney.
//
// 1:1 port of LessonJourneyActivity.showPracticeCard() (Kotlin :767–1032)
// and normalizeAnswer() (Kotlin :1034).
//
// The journey shell owns the header, progress bar, step title, back arrow
// and the bottom continue button. This step renders only the body content
// into the host element it receives:
//
//   ┌──────────────────────────────────────────┐
//   │            X / N (counter)               │
//   │         מה תגידו? (instruction)          │
//   │   ┌─────── prompt card ───────┐          │
//   │   │  card.prompt (26sp bold)  │          │
//   │   └───────────────────────────┘          │
//   │   <textarea placeholder=inputHint, 3 rows>│
//   │   [feedback line — hidden by default]    │
//   │   ┌─── answer reveal card ────┐          │
//   │   │  answer (20sp bold red)   │ (hidden) │
//   │   │  answerSub (16sp muted)   │          │
//   │   │  [44dp 🔊 button]         │          │
//   │   └───────────────────────────┘          │
//   │   [בדוק ✓]   [גלה 👁]                    │
//   └──────────────────────────────────────────┘
//
// One practice card at a time. The bottom continue button reads "הבא" until
// the last card, then "לחידון →". CONTINUE moves to the next card if more
// remain (intercepted via journey.onContinueOverride); on the last card it
// returns false so the shell's nextOf() advances to QUIZ.
//
// The PRACTICE step keeps `practiceIndex` in module-scope state. The shell's
// back arrow on PRACTICE rewinds out of the step entirely (to VOCAB or TEACH
// depending on whether the lesson has vocab) — see lesson-journey.js
// onBack() and Kotlin :214–222.

import { el } from "../../dom.js";
import { speak } from "../../speaker.js";

// ─────────────────────────────────────────────────────────────
// normalizeAnswer — port of Kotlin :1034
//   s.trim().lowercase()
//    .trimEnd('.', '?', '!', '。', '？')
//    .replace("\\s+".toRegex(), " ")
// ─────────────────────────────────────────────────────────────
function normalizeAnswer(s) {
  if (s == null) return "";
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[.?!。？]+$/, "")
    .replace(/\s+/g, " ");
}

// Per-step state. We keep this in module scope so re-entering the step
// (e.g. after the back arrow) starts fresh — the shell's `goto()` calls
// the renderer once per entry and we reset on first render.
let practiceIndex = 0;

export function Practice({ hostEl, lesson, journey, preserveState }) {
  const cards = Array.isArray(lesson.practiceCards) ? lesson.practiceCards : [];
  const total = cards.length;

  // The shell already skips PRACTICE when total === 0 via nextOf(); guard
  // anyway so a deep-link to #/lesson/:id/practice on a vocab-only lesson
  // doesn't blow up.
  if (total === 0) {
    journey.advance();
    return;
  }

  // Reset on a fresh entry into the step. `preserveState` is true only for
  // shell-initiated re-renders (rerender()), which we don't use here. Any
  // top-level entry (goto from VOCAB/TEACH or back from QUIZ) resets to
  // the first card to mirror the Kotlin behavior — Kotlin's onBack from
  // QUIZ at :223 sets quizIndex/quizScore back to 0 but leaves practiceIndex
  // intact. The simplest faithful port is to leave practiceIndex sticky
  // across navigations within the lifetime of the screen but clamp it.
  if (!preserveState) {
    if (practiceIndex >= total || practiceIndex < 0) practiceIndex = 0;
  }

  // Render the current card. Re-renders happen when CONTINUE moves to the
  // next card without leaving the step.
  function render() {
    const card = cards[practiceIndex];
    const isLast = practiceIndex >= total - 1;

    // ── Bottom continue button (Kotlin :775–776) ──
    journey.setContinueLabel(isLast ? "לחידון →" : "הבא");
    journey.setContinueEnabled(false);

    // CONTINUE handler: if more cards remain, advance the index and re-render
    // (return true to swallow the shell's default advance). On the last card,
    // return false so the shell's nextOf() takes us to QUIZ.
    journey.onContinueOverride = () => {
      if (practiceIndex < total - 1) {
        practiceIndex++;
        render();
        return true;
      }
      return false;
    };

    // ── Counter (Kotlin :795–804) ──
    const counterEl = el(
      "p",
      { class: "lj-counter lj-practice__counter" },
      `${practiceIndex + 1} / ${total}`,
    );

    // ── Instruction label (Kotlin :807–817) ──
    const labelEl = el(
      "p",
      { class: "lj-practice__label" },
      card.promptLabel || "",
    );

    // ── Prompt card (Kotlin :820–840) ──
    const promptCard = el(
      "div",
      { class: "lj-card lj-practice__prompt" },
      el("p", { class: "lj-practice__prompt-text" }, card.prompt || ""),
    );

    // ── Input field (Kotlin :843–865) ──
    // <textarea> with 3 rows, native auto-direction so Hebrew/Japanese input
    // both render correctly. The accessible label is the instruction text.
    const inputId = `lj-practice-input-${lesson.id}-${practiceIndex}`;
    const srLabel = el(
      "label",
      { class: "lj-practice__sr-label", for: inputId },
      card.promptLabel || "תשובה",
    );
    const inputEl = el("textarea", {
      id: inputId,
      class: "lj-practice__input",
      rows: 3,
      dir: "auto",
      placeholder: card.inputHint || "כתבו את התשובה...",
      autocapitalize: "sentences",
      autocomplete: "off",
      spellcheck: "false",
    });

    // ── Feedback line (Kotlin :868–878) ──
    const feedbackEl = el("p", {
      class: "lj-practice__feedback",
      hidden: true,
    });

    // ── Answer reveal card (Kotlin :881–943) ──
    const answerTextEl = el(
      "p",
      { class: "lj-practice__answer-text" },
      card.answer || "",
    );

    const answerInner = [answerTextEl];
    if (card.answerSub && String(card.answerSub).trim().length > 0) {
      answerInner.push(
        el("p", { class: "lj-practice__answer-sub", dir: "auto" }, card.answerSub),
      );
    }
    const hasAudio = typeof card.audioText === "string" && card.audioText.trim().length > 0;
    if (hasAudio) {
      // Make the answer text itself click-to-speak as well (Kotlin :905–909).
      answerTextEl.classList.add("lj-practice__answer-text--clickable");
      answerTextEl.setAttribute("role", "button");
      answerTextEl.setAttribute("tabindex", "0");
      answerTextEl.addEventListener("click", () => speak(card.audioText));
      answerTextEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          speak(card.audioText);
        }
      });

      // 44dp circular red speaker button (Kotlin :924–941 — the Kotlin code
      // creates a 48dp button but the spec says 44dp; honor the spec).
      answerInner.push(
        el(
          "button",
          {
            type: "button",
            class: "lj-speaker lj-practice__speaker",
            "aria-label": "השמע",
            onClick: () => speak(card.audioText),
          },
          el("span", { "aria-hidden": "true" }, "🔊"),
        ),
      );
    }
    const answerCard = el(
      "div",
      { class: "lj-card lj-practice__answer", hidden: true },
      ...answerInner,
    );

    // ── Reveal logic (Kotlin :945–972) ──
    // outcome: true = correct, false = wrong, null = peek (no check)
    function revealAnswer(outcome) {
      answerCard.hidden = false;
      // Tint via class — three states match Kotlin :956 / :965 / :969.
      answerCard.classList.remove(
        "lj-practice__answer--correct",
        "lj-practice__answer--wrong",
        "lj-practice__answer--peek",
      );
      if (outcome === true) {
        answerCard.classList.add("lj-practice__answer--correct");
        feedbackEl.textContent = "✓ נכון!";
        feedbackEl.classList.remove("lj-practice__feedback--wrong");
        feedbackEl.classList.add("lj-practice__feedback--correct");
        feedbackEl.hidden = false;
        if (hasAudio) {
          // Mirror Kotlin's binding.root.post { speaker.speak(card.audioText) }
          // (:958) — fire on the next tick so the reveal animation has begun.
          setTimeout(() => speak(card.audioText), 0);
        }
      } else if (outcome === false) {
        answerCard.classList.add("lj-practice__answer--wrong");
        feedbackEl.textContent = "✗ לא מדויק — התשובה הנכונה:";
        feedbackEl.classList.remove("lj-practice__feedback--correct");
        feedbackEl.classList.add("lj-practice__feedback--wrong");
        feedbackEl.hidden = false;
      } else {
        answerCard.classList.add("lj-practice__answer--peek");
        feedbackEl.hidden = true;
      }
      // Enable the bottom continue button (Kotlin :947).
      journey.setContinueEnabled(true);
      // Hide the on-screen keyboard on mobile (Kotlin :948–950).
      try { inputEl.blur(); } catch (_) { /* ignore */ }
    }

    // ── Buttons row (Kotlin :975–1026) ──
    const btnCheck = el(
      "button",
      {
        type: "button",
        class: "btn lj-practice__btn lj-practice__btn--check",
      },
      "בדוק ✓",
    );
    const btnPeek = el(
      "button",
      {
        type: "button",
        class: "btn lj-practice__btn lj-practice__btn--peek",
      },
      "גלה 👁",
    );

    btnCheck.addEventListener("click", () => {
      const correct =
        normalizeAnswer(inputEl.value) === normalizeAnswer(card.answer || "");
      revealAnswer(correct);
      btnCheck.disabled = true;
      btnPeek.disabled = true;
    });
    btnPeek.addEventListener("click", () => {
      revealAnswer(null);
      btnCheck.disabled = true;
      btnPeek.disabled = true;
    });

    const btnRow = el(
      "div",
      { class: "lj-practice__btn-row" },
      btnCheck,
      btnPeek,
    );

    // ── Mount ──
    hostEl.innerHTML = "";
    hostEl.appendChild(
      el(
        "div",
        { class: "lj-step lj-step--practice" },
        counterEl,
        labelEl,
        promptCard,
        srLabel,
        inputEl,
        feedbackEl,
        answerCard,
        btnRow,
      ),
    );

    // Focus the input on mount (Kotlin :1031). Use rAF so the textarea is in
    // the DOM and visible before we focus — avoids scroll jumps on iOS.
    requestAnimationFrame(() => {
      try { inputEl.focus({ preventScroll: false }); } catch (_) { /* ignore */ }
    });
  }

  // Clear our continue override when the step is torn down so the next
  // step starts with a clean shell.
  journey.onDispose && journey.onDispose(() => {
    if (journey.onContinueOverride) journey.onContinueOverride = null;
    // Reset the index so re-entering the lesson starts at card 1.
    practiceIndex = 0;
  });

  render();
}
