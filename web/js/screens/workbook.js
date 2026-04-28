// workbook.js — 1:1 port of WorkbookActivity.kt (programmatic layout).
//
// Source of truth:
//   /home/user/Game/.ui-source/app/src/main/java/com/nihongo/beginner/WorkbookActivity.kt
//   /home/user/Game/.ui-source/app/src/main/java/com/nihongo/beginner/data/WorkbookModels.kt
//   /home/user/Game/.ui-source/app/src/main/java/com/nihongo/beginner/data/WorkbookProgressManager.kt
//   /home/user/Game/.ui-source/app/src/main/java/com/nihongo/beginner/data/DigitalCourseWorkbook.kt
//
// Layout (top → bottom):
//   - Toolbar — white background, primary-red back arrow + "Page N" title.
//   - Progress label "Workbook progress: A of B completed".
//   - Linear progress bar (primary-red).
//   - Stacked white-ish cards in a scroll view:
//       * headerCard:    "Digital course workbook" + title + type-label + prompt + (optional "Hear Japanese" button).
//       * referenceCard: "Original booklet reference" + multi-line referenceText.
//       * answerCard:    "Your answer" + (optional answer-bank) + textarea (saved on input) + "Check" + "Save done".
//       * helpCard:      "Need help?" + revealed hints + "Show hint" + "Open lesson info".
//   - Bottom nav row: Back (left/right per RTL) + Next.
//
// Persistence keys mirror WorkbookProgressManager.kt:
//   answer_<id>      string (max 1200 chars stored)
//   complete_<id>    bool
//   attempts_<id>    int
//   hint_<id>        int
// We use the same prefixes and store in localStorage under "kimura.workbook." namespace
// (Android prefs file: nihongo_workbook_private — irrelevant to web port).

import { el, mount, clear } from "../dom.js";

// ---------- WorkbookProgressManager web shim ----------
const NS = "kimura.workbook.";
const PREFS = {
  answer:   id => NS + "answer_"   + id,
  complete: id => NS + "complete_" + id,
  attempts: id => NS + "attempts_" + id,
  hint:     id => NS + "hint_"     + id,
};
const MAX_STORED_ANSWER = 1200;

function readPref(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : v;
  } catch { return fallback; }
}
function writePref(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}
function readBool(key) {
  return readPref(key, "0") === "1";
}
function readInt(key) {
  const v = parseInt(readPref(key, "0") || "0", 10);
  return Number.isFinite(v) ? v : 0;
}

const Progress = {
  saveAnswer(id, ans)        { writePref(PREFS.answer(id), String(ans || "").slice(0, MAX_STORED_ANSWER)); },
  getAnswer(id)              { return readPref(PREFS.answer(id), "") || ""; },
  markComplete(id)           { writePref(PREFS.complete(id), "1"); },
  isComplete(id)             { return readBool(PREFS.complete(id)); },
  recordAttempt(id)          { writePref(PREFS.attempts(id), String(readInt(PREFS.attempts(id)) + 1)); },
  revealNextHint(id, max)    {
    const next = Math.min(readInt(PREFS.hint(id)) + 1, max);
    writePref(PREFS.hint(id), String(next));
    return next;
  },
  getRevealedHintCount(id)   { return readInt(PREFS.hint(id)); },
};

function getExercisesForLesson(workbook, lessonId) {
  const all = (workbook && Array.isArray(workbook.interactiveExercises))
    ? workbook.interactiveExercises : [];
  return all.filter(e => Number(e.lessonId) === Number(lessonId));
}

function lessonCompletedCount(workbook, lessonId) {
  const exs = getExercisesForLesson(workbook, lessonId);
  return exs.reduce((acc, e) => acc + (Progress.isComplete(e.id) ? 1 : 0), 0);
}

function lessonExerciseCount(workbook, lessonId) {
  return getExercisesForLesson(workbook, lessonId).length;
}

// ---------- normalization (NFKC, matches Kotlin) ----------
function normalizeAnswer(value) {
  let v = String(value || "").toLowerCase().trim();
  if (typeof v.normalize === "function") v = v.normalize("NFKC");
  return v.replace(/\s+/g, " ");
}

// ---------- type label (mirrors typeLabel() Kotlin when) ----------
const TYPE_LABEL = {
  TYPED_ANSWER:      "Typed answer",
  FILL_BLANK:        "Fill in the blanks",
  IMAGE_MATCH:       "Match text to picture",
  TEXT_MATCH:        "Matching",
  SENTENCE_ORDER:    "Sentence building",
  DIALOGUE_COMPLETE: "Dialogue completion",
  FREE_WRITING:      "Writing practice",
  LISTENING:         "Listening",
  PAGE_NOTES:        "PDF page practice",
};

// ---------- modal dialog helper (MaterialAlertDialog port) ----------
function showDialog(title, message, opts = {}) {
  const overlay = el("div", { class: "wb-dialog__overlay" });
  const card = el("div", { class: "wb-dialog__card" },
    el("h3", { class: "wb-dialog__title" }, title),
    el("div", { class: "wb-dialog__body" }, message),
    el("div", { class: "wb-dialog__actions" },
      el("button", {
        class: "btn btn--small wb-dialog__btn",
        type: "button",
        onClick: () => { close(); if (opts.onConfirm) opts.onConfirm(); },
      }, opts.confirmText || "OK"),
    ),
  );
  overlay.appendChild(card);
  function close() {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }
  overlay.addEventListener("click", (ev) => { if (ev.target === overlay) close(); });
  document.body.appendChild(overlay);
}

// ---------- screen ----------
export function Workbook({ host, ctx, params }) {
  ensureStyle();

  const router  = ctx.router;
  const speaker = ctx.speaker;
  const workbook = ctx.workbook || { interactiveExercises: [] };
  const lessons  = Array.isArray(ctx.lessons) ? ctx.lessons : [];
  const lessonId = Number(params && params.id) || 1;
  const backTo   = `#/lesson/${lessonId}`;

  const exercises = getExercisesForLesson(workbook, lessonId);

  // Empty state — bail out per Kotlin: finish() if exercises.isEmpty().
  if (!exercises.length) {
    mount(host, el("div", { class: "screen wb-screen" },
      el("div", { class: "wb-toolbar" },
        el("button", {
          class: "wb-toolbar__back",
          type: "button",
          "aria-label": "Back",
          onClick: () => router.go(backTo),
        }, el("img", { src: "assets/icons/ic_arrow_back.svg", alt: "" })),
        el("h1", { class: "wb-toolbar__title" }, "Workbook"),
      ),
      el("div", { class: "wb-empty" }, "אין תרגילי חוברת לשיעור הזה."),
    ));
    return;
  }

  const state = { currentIndex: 0 };

  // ---------- DOM scaffold ----------
  const tvTitle    = el("h1", { class: "wb-toolbar__title" }, "Workbook");
  const progressBar  = el("div", { class: "wb-progress__bar" });
  const progressLabel = el("p",  { class: "wb-progress__label" });
  const content    = el("div", { class: "wb-content" });
  const btnBack    = el("button", {
    class: "btn wb-nav__btn",
    type: "button",
    onClick: () => {
      state.currentIndex = Math.max(0, state.currentIndex - 1);
      render();
    },
  }, "Back");
  const btnNext    = el("button", {
    class: "btn wb-nav__btn",
    type: "button",
    onClick: () => {
      state.currentIndex = Math.min(exercises.length - 1, state.currentIndex + 1);
      render();
    },
  }, "Next");

  const screen = el("div", { class: "screen wb-screen" },
    // Toolbar — white bg, primary-red title + back arrow.
    el("div", { class: "wb-toolbar" },
      el("button", {
        class: "wb-toolbar__back",
        type: "button",
        "aria-label": "Back",
        onClick: () => router.go(backTo),
      }, el("img", { src: "assets/icons/ic_arrow_back.svg", alt: "" })),
      tvTitle,
    ),
    progressLabel,
    el("div", { class: "wb-progress" }, progressBar),
    el("div", { class: "wb-scroll" }, content),
    el("div", { class: "wb-nav" }, btnBack, btnNext),
  );

  // ---------- card builders ----------
  function card(...children) {
    return el("div", { class: "wb-card" }, ...children);
  }
  function label(text, sizeClass, extraClass = "") {
    return el("p", {
      class: `wb-label ${sizeClass} ${extraClass}`.trim(),
    }, text);
  }
  function flatButton(text, onClick) {
    return el("button", {
      class: "btn btn--outlined btn--small wb-card__btn",
      type: "button",
      onClick,
    }, text);
  }

  function headerCard(exercise) {
    const children = [
      label("Digital course workbook", "wb-label--13", "t-muted"),
      label(exercise.title || "", "wb-label--24 t-bold"),
      label(TYPE_LABEL[exercise.type] || "", "wb-label--14 t-bold t-gold"),
      label(exercise.prompt || "", "wb-label--16"),
    ];
    if (exercise.japaneseToSpeak && String(exercise.japaneseToSpeak).trim()) {
      children.push(flatButton("Hear Japanese", () => {
        if (speaker && speaker.speak) speaker.speak(exercise.japaneseToSpeak);
      }));
    }
    return card(...children);
  }

  function referenceCard(exercise) {
    return card(
      label("Original booklet reference", "wb-label--18 t-bold"),
      el("pre", { class: "wb-label wb-label--15 wb-pre" }, exercise.referenceText || ""),
    );
  }

  function answerCard(exercise) {
    const isLong = exercise.type === "FREE_WRITING" || exercise.type === "PAGE_NOTES";
    const minRows = isLong ? 5 : 3;

    const textarea = el("textarea", {
      class: "wb-input",
      rows: minRows,
      maxlength: exercise.maxAnswerLength || 800,
      placeholder: "Type here. Your answer is saved only on this phone.",
      onInput: (ev) => {
        Progress.saveAnswer(exercise.id, ev.currentTarget.value);
      },
    });
    textarea.value = Progress.getAnswer(exercise.id);

    const children = [
      label("Your answer", "wb-label--18 t-bold"),
    ];
    if (Array.isArray(exercise.options) && exercise.options.length) {
      children.push(label(`Answer bank: ${exercise.options.join("  |  ")}`, "wb-label--14 t-muted"));
    }
    children.push(textarea);

    const actions = el("div", { class: "wb-card__actions" },
      el("button", {
        class: "btn btn--small wb-card__btn",
        type: "button",
        onClick: () => checkAnswer(exercise, textarea.value),
      }, "Check"),
      el("button", {
        class: "btn btn--outlined btn--small wb-card__btn",
        type: "button",
        onClick: () => {
          Progress.markComplete(exercise.id);
          render();
        },
      }, "Save done"),
    );
    children.push(actions);

    return card(...children);
  }

  function helpCard(exercise) {
    const hintCount = Progress.getRevealedHintCount(exercise.id);
    const children = [
      label("Need help?", "wb-label--18 t-bold"),
      label("Use hints or open the lesson info. Your current answer stays saved.", "wb-label--14 t-muted"),
    ];
    if (hintCount > 0 && Array.isArray(exercise.hints)) {
      exercise.hints.slice(0, hintCount).forEach((h, i) => {
        children.push(label(`Hint ${i + 1}: ${h.text || ""}`, "wb-label--15"));
      });
    }
    children.push(flatButton("Show hint", () => {
      Progress.revealNextHint(exercise.id, (exercise.hints || []).length);
      render();
    }));
    children.push(flatButton("Open lesson info", () => showLessonReference()));
    return card(...children);
  }

  // ---------- check answer (mirrors Kotlin) ----------
  function checkAnswer(exercise, answer) {
    Progress.recordAttempt(exercise.id);
    if (!String(answer || "").trim()) {
      showDialog("Write something first", "Your draft is private and saved on this phone.");
      return;
    }
    const expected = Array.isArray(exercise.expectedAnswers) ? exercise.expectedAnswers : [];
    if (!expected.length) {
      Progress.markComplete(exercise.id);
      showDialog("Saved", "This is an open workbook task, so it is saved without strict grading.", {
        onConfirm: () => render(),
      });
      return;
    }
    const norm = normalizeAnswer(answer);
    const matched = expected.some(p => norm.includes(normalizeAnswer(p)));
    if (matched) {
      Progress.markComplete(exercise.id);
      showDialog("Nice work", "Your answer includes one of the expected patterns.", {
        onConfirm: () => render(),
      });
    } else {
      showDialog("Not yet", "Use a hint or reopen the lesson info, then try again.");
    }
  }

  function showLessonReference() {
    const lesson = lessons.find(l => Number(l.id) === lessonId);
    if (!lesson) {
      showDialog("Lesson info", "No lesson reference was found.");
      return;
    }
    const grammar  = (lesson.grammarPoints || []).map(g => {
      const pat = g.pattern ? g.pattern : "";
      return `${g.title || ""}\n${pat}\n${g.content || ""}`;
    }).join("\n\n");
    const vocab    = (lesson.vocabulary || []).map(v => `${v.japanese}  ${v.romaji || ""}  -  ${v.hebrew}`).join("\n");
    const examples = (lesson.examples || []).map(e => `${e.japanese || ""}  ${e.romaji || ""}  -  ${e.hebrew || ""}`).join("\n");
    const message  = [grammar, vocab, examples].filter(s => s && s.trim()).join("\n\n");

    showDialog(lesson.title || "Lesson", el("pre", { class: "wb-dialog__pre" }, message), {
      confirmText: "Back to exercise",
    });
  }

  // ---------- render full screen for current exercise ----------
  function render() {
    const exercise = exercises[state.currentIndex];
    tvTitle.textContent = `Page ${exercise.pageNumber}`;

    const completed = lessonCompletedCount(workbook, lessonId);
    const total = Math.max(1, lessonExerciseCount(workbook, lessonId));
    const pct = Math.floor(completed * 100 / total);
    progressBar.style.width = `${pct}%`;
    progressLabel.textContent = `Workbook progress: ${completed} of ${total} completed`;

    clear(content);
    content.appendChild(headerCard(exercise));
    content.appendChild(referenceCard(exercise));
    content.appendChild(answerCard(exercise));
    content.appendChild(helpCard(exercise));

    btnBack.disabled = (state.currentIndex <= 0);
    btnNext.disabled = (state.currentIndex >= exercises.length - 1);

    // scroll to top after render so user sees the new page header.
    const scroll = screen.querySelector(".wb-scroll");
    if (scroll) scroll.scrollTop = 0;
  }

  mount(host, screen);
  render();
}

function ensureStyle() {
  for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (l.getAttribute("href") === "css/screens/workbook.css") return;
  }
  const link = document.createElement("link");
  link.rel  = "stylesheet";
  link.href = "css/screens/workbook.css";
  document.head.appendChild(link);
}
