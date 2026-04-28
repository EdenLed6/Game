// sentence-builder.js — 1:1 port of SentenceBuilderActivity.kt + activity_sentence_builder.xml.
//
// Source of truth:
//   /home/user/Game/.ui-source/app/src/main/res/layout/activity_sentence_builder.xml
//   /home/user/Game/.ui-source/app/src/main/res/layout/item_word_chip.xml
//   /home/user/Game/.ui-source/app/src/main/java/com/nihongo/beginner/SentenceBuilderActivity.kt
//   /home/user/Game/.ui-source/app/src/main/java/com/nihongo/beginner/adapter/WordChipAdapter.kt
//
// Game loop:
//   - Pull the lesson's example list (lesson.examples).
//   - For each example: tvSbQuestion = example.hebrew. Split example.romaji on
//     whitespace, shuffle words, render as chips (4-col GridLayoutManager).
//   - Tap a chip → it disappears (fade+shrink 220ms), word is appended to the
//     built sentence shown in tvSbBuilt.
//   - Tap a built-sentence chip → it returns to the grid (bounce-in 360ms).
//   - Press "בדוק תשובה": case-insensitive trimmed equality of joined romaji
//     against example.romaji. Score increments on correct. Reveal "השאלה הבאה".
//   - When all examples are exhausted → result screen "🧩" + "score / N" +
//     "🔄 שחק שוב" + "חזור לשיעור".

import { el, mount } from "../dom.js";

export function SentenceBuilder({ host, ctx, params }) {
  ensureStyle();

  const router  = ctx.router;
  const lessonId = Number(params && params.id);
  const backTo   = lessonId ? `#/lesson/${lessonId}` : "#/learn";

  const lesson = (ctx.lessons || []).find(l => Number(l.id) === lessonId);
  const examples = (lesson && Array.isArray(lesson.examples)) ? lesson.examples : [];

  if (!examples.length) {
    mount(host, el("div", { class: "screen sb-screen" },
      el("div", { class: "sb-header bg-gradient-hero" },
        el("button", {
          class: "sb-header__back",
          type: "button",
          "aria-label": "חזור",
          onClick: () => router.go(backTo),
        }, el("img", { src: "assets/icons/ic_arrow_back.svg", alt: "" })),
        // Toolbar in activity_sentence_builder.xml has no app:title set — leave empty.
        el("h1", { class: "sb-header__title" }, ""),
      ),
      el("div", { class: "stub-screen" }, "לא נמצאו תרגילי משפטים בשיעור הזה."),
    ));
    return;
  }

  // ---------- state ----------
  const state = {
    currentIndex: 0,
    score: 0,
    chips: [],          // [{ word, taken: bool }]
    built: [],          // [{ chipIndex, word }]
    checked: false,
  };

  // ---------- DOM ----------
  const tvScore       = el("span", { class: "sb-score-badge bg-score-badge" });
  const tvInstruction = el("p",  { class: "sb-instruction" }, "סדר את המילים כדי לבנות את המשפט");
  const tvQuestion    = el("p",  { class: "sb-question" });
  const builtRow      = el("div", { class: "sb-built__row dir-ltr" });
  const builtCard     = el("div", { class: "sb-built" }, builtRow);
  const wordsGrid     = el("div", { class: "sb-words dir-ltr" });
  const tvFeedback    = el("p",  { class: "sb-feedback" });
  const cardFeedback  = el("div", { class: "sb-feedback-card" }, tvFeedback);
  const btnCheck      = el("button", {
    class: "btn btn--block sb-check",
    type: "button",
    onClick: () => onCheck(),
  }, "בדוק תשובה");
  const btnNext       = el("button", {
    class: "btn btn--block sb-next",
    type: "button",
    onClick: () => onAdvance(),
  }, "השאלה הבאה");

  const gameCard = el("div", { class: "sb-card" },
    tvInstruction,
    tvQuestion,
    builtCard,
    wordsGrid,
    cardFeedback,
    btnCheck,
    btnNext,
  );

  const tvFinal = el("div", { class: "sb-final-score" });
  const resultLayout = el("div", { class: "sb-result", style: { display: "none" } },
    el("div", { class: "sb-result__emoji" }, "🧩"),
    tvFinal,
    el("button", {
      class: "btn btn--gold btn--block sb-result__btn",
      type: "button",
      onClick: () => restart(),
    }, "🔄  שחק שוב"),
    el("button", {
      class: "btn btn--block sb-result__btn",
      type: "button",
      onClick: () => router.go(backTo),
    }, "חזור לשיעור"),
  );

  const screen = el("div", { class: "screen sb-screen" },
    el("div", { class: "sb-header bg-gradient-hero" },
      el("button", {
        class: "sb-header__back",
        type: "button",
        "aria-label": "חזור",
        onClick: () => router.go(backTo),
      }, el("img", { src: "assets/icons/ic_arrow_back.svg", alt: "" })),
      // activity_sentence_builder.xml has no app:title — toolbar inherits the
      // application label ("Kimura").
      el("h1", { class: "sb-header__title" }, "Kimura"),
      el("div", { class: "sb-header__score-row" }, tvScore),
    ),
    el("div", { class: "sb-body" },
      gameCard,
      resultLayout,
    ),
  );

  // ---------- helpers ----------
  function shuffleArr(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function setScore(n) {
    tvScore.textContent = `ניקוד: ${n}`;
  }

  function renderChips() {
    while (wordsGrid.firstChild) wordsGrid.removeChild(wordsGrid.firstChild);
    state.chips.forEach((chip, idx) => {
      const node = el("button", {
        class: "sb-chip",
        type: "button",
        onClick: (ev) => takeChip(idx, ev.currentTarget),
      }, chip.word);
      if (chip.taken) {
        node.classList.add("sb-chip--gone");
      }
      wordsGrid.appendChild(node);
    });
  }

  function renderBuilt() {
    while (builtRow.firstChild) builtRow.removeChild(builtRow.firstChild);
    if (!state.built.length) {
      const placeholder = el("span", { class: "sb-built__placeholder" }, "");
      builtRow.appendChild(placeholder);
      return;
    }
    state.built.forEach((entry, i) => {
      const node = el("button", {
        class: "sb-built-chip",
        type: "button",
        onClick: () => returnChip(i),
      }, entry.word);
      builtRow.appendChild(node);
    });
  }

  function takeChip(chipIndex, btnEl) {
    if (state.checked) return;
    const chip = state.chips[chipIndex];
    if (!chip || chip.taken) return;
    chip.taken = true;
    state.built.push({ chipIndex, word: chip.word });

    // 220ms fade+shrink animation, then hide.
    btnEl.classList.add("sb-chip--leaving");
    setTimeout(() => {
      btnEl.classList.remove("sb-chip--leaving");
      btnEl.classList.add("sb-chip--gone");
      // Re-render built row to attach new chip
      renderBuilt();
    }, 220);
  }

  function returnChip(builtPos) {
    if (state.checked) return;
    const entry = state.built[builtPos];
    if (!entry) return;
    state.built.splice(builtPos, 1);
    state.chips[entry.chipIndex].taken = false;

    // Animate the grid chip back in (bounce 360ms)
    const gridChild = wordsGrid.children[entry.chipIndex];
    if (gridChild) {
      gridChild.classList.remove("sb-chip--gone");
      gridChild.classList.remove("sb-chip--returning");
      void gridChild.offsetWidth;
      gridChild.classList.add("sb-chip--returning");
      setTimeout(() => gridChild.classList.remove("sb-chip--returning"), 360);
    }
    renderBuilt();
  }

  function loadQuestion() {
    state.checked = false;
    state.built = [];
    const example = examples[state.currentIndex];

    tvQuestion.textContent    = example.hebrew || "";
    tvInstruction.textContent = "סדר את המילים כדי לבנות את המשפט";

    // Hide feedback, show check, hide next
    tvFeedback.textContent = "";
    cardFeedback.classList.remove(
      "sb-feedback-card--visible",
      "sb-feedback-card--correct",
      "sb-feedback-card--wrong",
    );
    btnCheck.style.display = "";
    btnNext.style.display  = "none";

    // Words: split romaji on whitespace, shuffle.
    const words = String(example.romaji || "").trim().split(/\s+/).filter(Boolean);
    const shuffled = shuffleArr(words);
    state.chips = shuffled.map(w => ({ word: w, taken: false }));

    renderChips();
    renderBuilt();
    setScore(state.score);
  }

  function onCheck() {
    if (state.checked) return;
    const example = examples[state.currentIndex];
    const built = state.built.map(e => e.word).join(" ").trim();
    const expected = String(example.romaji || "").trim();
    const correct = built.toLowerCase() === expected.toLowerCase();

    cardFeedback.classList.add("sb-feedback-card--visible");
    if (correct) {
      state.score++;
      tvFeedback.textContent = "נכון! 🎉";
      cardFeedback.classList.add("sb-feedback-card--correct");
    } else {
      tvFeedback.textContent = `לא נכון. התשובה: ${example.romaji}`;
      cardFeedback.classList.add("sb-feedback-card--wrong");
    }
    state.checked = true;
    btnCheck.style.display = "none";
    btnNext.style.display  = "";
    setScore(state.score);
  }

  function onAdvance() {
    state.currentIndex++;
    if (state.currentIndex < examples.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    gameCard.style.display = "none";
    resultLayout.style.display = "";
    tvFinal.textContent = `${state.score} / ${examples.length}`;
    resultLayout.classList.remove("sb-result--in");
    void resultLayout.offsetWidth;
    resultLayout.classList.add("sb-result--in");
  }

  function restart() {
    state.currentIndex = 0;
    state.score = 0;
    setScore(0);
    resultLayout.style.display = "none";
    gameCard.style.display = "";
    loadQuestion();
  }

  // Initial render
  setScore(0);
  mount(host, screen);
  loadQuestion();
}

// ---------- stylesheet injection (idempotent) ----------
function ensureStyle() {
  for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (l.getAttribute("href") === "css/screens/sentence-builder.css") return;
  }
  const link = document.createElement("link");
  link.rel  = "stylesheet";
  link.href = "css/screens/sentence-builder.css";
  document.head.appendChild(link);
}
