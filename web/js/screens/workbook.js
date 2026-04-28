// Mirrors WorkbookActivity.kt (no XML; the screen is built programmatically).
//
// Layout 1:1 with WorkbookActivity#buildShell + #renderExercise:
//   • root LinearLayout vertical, background = surface (#FFFFFF)
//   • MaterialToolbar — title = "Page <pageNumber>"; navigation back arrow,
//     setBackgroundColor(white), titleTextColor + navigationIcon = colorPrimary
//   • progressText  — "Workbook progress: A of B completed", 14sp center
//   • ProgressBar   — primary tint, 8dp tall, marginStart/End 18dp
//   • ScrollView with vertical content padded 18/16/18/18:
//       headerCard       (label small muted, title 24sp bold, type label 14sp gold,
//                         prompt 16sp, optional "Hear Japanese" button)
//       referenceCard    (header 18sp bold, body 15sp)
//       answerCard       (header, optional answer-bank text, EditText, two action
//                         buttons "Check" / "Save done")
//       helpCard         (header, instructions, optional revealed hints,
//                         "Show hint" + "Open lesson info" buttons)
//   • Bottom nav row — Back / Next, both equal weight, 6dp gap, padding 12/8/12/12
//
// Behaviour 1:1 with WorkbookActivity:
//   • buildShell + renderExercise (re-rendered on every action)
//   • check(): WorkbookProgressManager.recordAttempt then validate; blank ⇒ "Write
//              something first"; expectedAnswers empty ⇒ "Saved" + markComplete;
//              otherwise normalize + substring-match.
//   • Save done ⇒ markComplete + re-render
//   • Show hint ⇒ revealNextHint + re-render
//   • Open lesson info ⇒ Material dialog showing grammarPoints / vocabulary / examples
//     We render an in-page modal because the web app has no native dialog system.
//   • Back/Next ⇒ navigate exercises[currentIndex] within the lesson

import { el, mount } from "../dom.js";
import { Router } from "../router.js";
import { Speaker } from "../speaker.js";
import { Workbook } from "../store.js";

// Mirrors WorkbookActivity#typeLabel.
const TYPE_LABEL = {
  TYPED_ANSWER: "Typed answer",
  FILL_BLANK: "Fill in the blanks",
  IMAGE_MATCH: "Match text to picture",
  TEXT_MATCH: "Matching",
  SENTENCE_ORDER: "Sentence building",
  DIALOGUE_COMPLETE: "Dialogue completion",
  FREE_WRITING: "Writing practice",
  LISTENING: "Listening",
  PAGE_NOTES: "PDF page practice",
};

// Mirrors WorkbookActivity#normalizeAnswer.
function normalizeAnswer(value) {
  return (value || "")
    .toLowerCase()
    .trim()
    .normalize("NFKC")
    .replace(/\s+/g, " ");
}

export function WorkbookScreen(data, lessonId) {
  const lesson = data.lessonsById[lessonId];
  const exercises = data.allWorkbookExercises.filter(e => e.lessonId === lessonId);
  if (!exercises.length) {
    Router.go(`/lesson/${lessonId}`);
    return;
  }

  const state = {
    index: 0,
    message: null,    // { title, text, error }  — replaces MaterialAlertDialog
    modal: null,      // { title, body }         — replaces "Open lesson info" dialog
  };

  function render() {
    const ex = exercises[state.index];
    const completed = exercises.filter(e => Workbook.isComplete(e.id)).length;
    const total = Math.max(1, exercises.length);
    const percent = Math.floor((completed / total) * 100);
    const hintCount = Workbook.getRevealedHintCount(ex.id);

    const view = el("div", { class: "workbook-page" },
      // Toolbar — title shows the current page number, mirroring
      // supportActionBar?.title = "Page ${exercise.pageNumber}".
      el("header", { class: "workbook-toolbar" },
        el("button", {
          type: "button",
          class: "nav-btn",
          "aria-label": "חזור",
          onClick: () => Router.go(`/lesson/${lessonId}`),
        },
          el("span", { html: "&#8594;" }),
        ),
        el("h1", { class: "title" }, `Page ${ex.pageNumber}`),
      ),

      // progressText
      el("div", { class: "workbook-progress-text" },
        `Workbook progress: ${completed} of ${total} completed`,
      ),

      // progressBar
      el("div", { class: "workbook-progress-bar", role: "progressbar",
                  "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": percent },
        el("div", { class: "fill", style: { width: percent + "%" } }),
      ),

      // ScrollView content
      el("div", { class: "workbook-scroll" },
        headerCard(ex),
        referenceCard(ex),
        answerCard(ex),
        helpCard(ex, hintCount),
        state.message ? messageBlock(state.message) : null,
      ),

      // Bottom nav — Back / Next mirror previousButton / nextButton.
      el("nav", { class: "workbook-nav" },
        el("button", {
          type: "button",
          class: "btn btn-outlined",
          disabled: state.index === 0,
          onClick: () => {
            state.index = Math.max(0, state.index - 1);
            state.message = null;
            render();
          },
        }, "Back"),
        el("button", {
          type: "button",
          class: "btn",
          disabled: state.index >= exercises.length - 1,
          onClick: () => {
            state.index = Math.min(exercises.length - 1, state.index + 1);
            state.message = null;
            render();
          },
        }, "Next"),
      ),

      state.modal ? renderModal() : null,
    );

    mount(view);
  }

  // ---------- Cards ----------

  function headerCard(ex) {
    return el("section", { class: "workbook-card anim-fade-in" },
      el("div", { class: "label muted size-13" }, "Digital course workbook"),
      el("div", { class: "label on-surface size-24 bold" }, ex.title),
      el("div", { class: "label secondary size-14 bold" }, TYPE_LABEL[ex.type] || ex.type),
      el("div", { class: "label on-surface size-16" }, ex.prompt),
      ex.japaneseToSpeak
        ? el("button", {
            type: "button",
            class: "btn stacked-btn",
            onClick: () => Speaker.speak(ex.japaneseToSpeak),
          }, "Hear Japanese")
        : null,
    );
  }

  function referenceCard(ex) {
    return el("section", { class: "workbook-card" },
      el("div", { class: "label on-surface size-18 bold" }, "Original booklet reference"),
      el("div", {
        class: "label on-surface size-15",
        style: { whiteSpace: "pre-wrap" },
      }, ex.referenceText || ""),
    );
  }

  function answerCard(ex) {
    const savedAnswer = Workbook.getAnswer(ex.id);
    const tall = ex.type === "FREE_WRITING" || ex.type === "PAGE_NOTES";

    return el("section", { class: "workbook-card" },
      el("div", { class: "label on-surface size-18 bold" }, "Your answer"),

      ex.options && ex.options.length
        ? el("div", { class: "label muted size-14" },
            `Answer bank: ${ex.options.join("  |  ")}`,
          )
        : null,

      el("textarea", {
        class: "workbook-textarea-input" + (tall ? " tall" : ""),
        placeholder: "Type here. Your answer is saved only on this device.",
        maxLength: ex.maxAnswerLength || 1200,
        rows: tall ? 5 : 3,
        value: savedAnswer,
        oninput: (e) => Workbook.saveAnswer(ex.id, e.target.value, ex.maxAnswerLength),
      }),

      el("div", { class: "workbook-action-row" },
        el("button", {
          type: "button",
          class: "btn",
          onClick: (e) => {
            const ta = e.target.closest(".workbook-card").querySelector("textarea");
            checkAnswer(ex, ta ? ta.value : Workbook.getAnswer(ex.id));
          },
        }, "Check"),
        el("button", {
          type: "button",
          class: "btn btn-outlined",
          onClick: () => {
            Workbook.markComplete(ex.id, true);
            render();
          },
        }, "Save done"),
      ),
    );
  }

  function helpCard(ex, hintCount) {
    const hints = ex.hints || [];
    return el("section", { class: "workbook-card" },
      el("div", { class: "label on-surface size-18 bold" }, "Need help?"),
      el("div", { class: "label muted size-14" },
        "Use hints or open the lesson info. Your current answer stays saved.",
      ),

      hintCount > 0
        ? el("div", { class: "workbook-hint-list" },
            hints.slice(0, hintCount).map((h, i) =>
              el("div", { class: "label on-surface size-15" },
                `Hint ${i + 1}: ${h.text}`),
            ),
          )
        : null,

      el("button", {
        type: "button",
        class: "btn stacked-btn",
        disabled: hints.length === 0 || hintCount >= hints.length,
        onClick: () => {
          Workbook.revealNextHint(ex.id, hints.length);
          render();
        },
      }, "Show hint"),

      el("button", {
        type: "button",
        class: "btn stacked-btn",
        onClick: () => showLessonReference(),
      }, "Open lesson info"),
    );
  }

  // ---------- Behaviour ----------

  function checkAnswer(ex, answer) {
    Workbook.recordAttempt(ex.id);

    if (!answer || !answer.trim()) {
      state.message = {
        title: "Write something first",
        text: "Your draft is private and saved on this device.",
        error: true,
      };
      render();
      return;
    }

    if (!ex.expectedAnswers || ex.expectedAnswers.length === 0) {
      Workbook.markComplete(ex.id, true);
      state.message = {
        title: "Saved",
        text: "This is an open workbook task, so it is saved without strict grading.",
        error: false,
      };
      render();
      return;
    }

    const norm = normalizeAnswer(answer);
    const matched = ex.expectedAnswers.some(a => norm.includes(normalizeAnswer(a)));
    if (matched) {
      Workbook.markComplete(ex.id, true);
      state.message = {
        title: "Nice work",
        text: "Your answer includes one of the expected patterns.",
        error: false,
      };
    } else {
      state.message = {
        title: "Not yet",
        text: "Use a hint or reopen the lesson info, then try again.",
        error: true,
      };
    }
    render();
  }

  function showLessonReference() {
    if (!lesson) {
      state.modal = {
        title: "Lesson info",
        body: "No lesson reference was found.",
      };
      render();
      return;
    }
    const grammar = (lesson.grammarPoints || [])
      .map(g => [g.title, g.pattern || "", g.content].filter(Boolean).join("\n"))
      .join("\n\n");
    const vocab = (lesson.vocabulary || [])
      .map(v => `${v.japanese}  ${v.romaji}  -  ${v.hebrew}`)
      .join("\n");
    const examples = (lesson.examples || [])
      .map(e => `${e.japanese || ""}  ${e.romaji}  -  ${e.hebrew}`)
      .join("\n");
    state.modal = {
      title: lesson.title,
      body: [grammar, vocab, examples].filter(s => s && s.length).join("\n\n"),
    };
    render();
  }

  function messageBlock(msg) {
    return el("div", {
      class: "workbook-message " + (msg.error ? "is-error" : "is-info"),
      role: "status",
    },
      el("strong", { class: "title" }, msg.title),
      msg.text,
    );
  }

  function renderModal() {
    return el("div", {
      class: "workbook-modal-backdrop",
      onClick: (e) => {
        if (e.target === e.currentTarget) {
          state.modal = null;
          render();
        }
      },
    },
      el("div", { class: "workbook-modal" },
        el("h3", {}, state.modal.title),
        el("pre", {}, state.modal.body),
        el("div", { class: "actions" },
          el("button", {
            type: "button",
            class: "btn",
            onClick: () => { state.modal = null; render(); },
          }, "Back to exercise"),
        ),
      ),
    );
  }

  render();
}
