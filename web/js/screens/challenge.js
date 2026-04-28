// challenge.js — 1:1 port of GameChallengeActivity.kt + activity_game_challenge.xml.
//
// Source of truth:
//   /home/user/Game/.ui-source/app/src/main/res/layout/activity_game_challenge.xml
//   /home/user/Game/.ui-source/app/src/main/java/com/nihongo/beginner/GameChallengeActivity.kt
//
// Mechanics (preserved verbatim):
//   - Build deck from all lessons:
//       * Every quiz exercise (question/options/correctIndex/explanation),
//         filter to ones with exactly 4 options.
//       * Two vocab questions per vocab item: "מה הפירוש של X (romaji)?"
//         and "איזו מילה יפנית מתאימה ל-Y?", each with 3 random distractors
//         drawn from the same pool. Filter to ones with exactly 4 options.
//   - Shuffle, take 12.
//   - Lives = 3, streak = 0, score = 0.
//   - Correct: streak++; score += 100 + streak*15.
//   - Wrong: lives--; streak = 0. (Heart shake animation.)
//   - 1100ms delay → next question (or showResult() when lives==0 or i==12).
//   - Result screen:
//       title = "שיא חדש!" if score > prevHigh else "סיום אתגר"
//       finalScore = score (big)
//       message: lives<=0 → "נגמרו החיים..." else "השלמת את כל האתגר. השיא שלך: $high"

import { el, mount } from "../dom.js";

const QUESTION_DELAY_MS = 1100;
const DECK_SIZE = 12;
const STARTING_LIVES = 3;

export function Challenge({ host, ctx }) {
  ensureStyle();

  const router  = ctx.router;
  const speaker = ctx.speaker;
  const store   = ctx.store;
  const lessons = Array.isArray(ctx.lessons) ? ctx.lessons : [];

  // ---------- challenge-deck builders ----------
  function shuffleArr(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function makeQuestion(prompt, correct, pool, explanation) {
    const wrongs = shuffleArr(pool.filter(x => x !== correct)).slice(0, 3);
    if (wrongs.length < 3) return null;
    const opts = shuffleArr([correct, ...wrongs]);
    return {
      prompt,
      options: opts,
      correctIndex: opts.indexOf(correct),
      explanation,
    };
  }

  function buildDeck() {
    // Quiz-derived questions.
    const quizQs = [];
    for (const lesson of lessons) {
      const exercises = Array.isArray(lesson.exercises) ? lesson.exercises : [];
      for (const q of exercises) {
        if (!q || !Array.isArray(q.options)) continue;
        const explanation = (q.explanation && q.explanation.trim())
          || `מתוך ${lesson.title || ""}`;
        quizQs.push({
          prompt: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation,
        });
      }
    }

    // Vocab pool — distinct by (japanese + hebrew)
    const seen = new Set();
    const vocab = [];
    for (const lesson of lessons) {
      const items = Array.isArray(lesson.vocabulary) ? lesson.vocabulary : [];
      for (const v of items) {
        if (!v || !v.japanese || !v.hebrew) continue;
        const k = (v.japanese || "") + (v.hebrew || "");
        if (seen.has(k)) continue;
        seen.add(k);
        vocab.push(v);
      }
    }
    const hebrewPool   = [...new Set(vocab.map(v => v.hebrew))];
    const japanesePool = [...new Set(vocab.map(v => v.japanese))];

    const vocabQs = [];
    for (const v of vocab) {
      const q1 = makeQuestion(
        `מה הפירוש של ${v.japanese} (${v.romaji || ""})?`,
        v.hebrew,
        hebrewPool,
        `${v.japanese} = ${v.hebrew}`,
      );
      if (q1) vocabQs.push(q1);
      const q2 = makeQuestion(
        `איזו מילה יפנית מתאימה ל-${v.hebrew}?`,
        v.japanese,
        japanesePool,
        `${v.hebrew} = ${v.japanese}`,
      );
      if (q2) vocabQs.push(q2);
    }

    return [...quizQs, ...vocabQs].filter(q => q.options.length === 4);
  }

  // ---------- state ----------
  const state = {
    deck: [],
    currentIndex: 0,
    score: 0,
    lives: STARTING_LIVES,
    streak: 0,
    highScore: getHighScore(),
    delayHandle: null,
    answered: false,
  };

  function getHighScore() {
    if (store && typeof store.getChallengeHighScore === "function") {
      return store.getChallengeHighScore();
    }
    try {
      const v = parseInt(localStorage.getItem("kimura_challenge_high") || "0", 10);
      return Number.isFinite(v) ? v : 0;
    } catch { return 0; }
  }

  function saveHighScore(score) {
    if (store && typeof store.saveChallengeHighScore === "function") {
      store.saveChallengeHighScore(score);
      return;
    }
    try {
      const cur = parseInt(localStorage.getItem("kimura_challenge_high") || "0", 10);
      if (score > cur) localStorage.setItem("kimura_challenge_high", String(score));
    } catch {}
  }

  // ---------- DOM scaffold ----------
  const tvHigh    = el("span", { class: "ch-stats-chip__value t-gold" });
  const tvStats   = el("span", { class: "ch-stats-chip__value" });
  const heartsBox = el("span", { class: "ch-hearts" });
  const progress  = el("div",  { class: "ch-progress" }, el("div", { class: "ch-progress__bar" }));
  const tvCounter = el("p",    { class: "ch-counter" });
  const tvPrompt  = el("p",    { class: "ch-prompt" });

  const optionButtons = [0, 1, 2, 3].map(i => el("button", {
    class: "ch-option",
    type: "button",
    onClick: () => onSelect(i),
  }));

  const tvFeedback = el("p", { class: "ch-feedback" });

  const btnSpeak = el("button", {
    class: "ch-speak",
    type: "button",
    "aria-label": "השמע שאלה",
    onClick: () => {
      const q = state.deck[state.currentIndex];
      if (q && speaker && speaker.speak) speaker.speak(q.prompt);
    },
  }, el("img", { src: "assets/icons/ic_volume.svg", alt: "" }));

  const gameLayout = el("div", { class: "ch-card" },
    el("div", { class: "ch-prompt-row" },
      tvPrompt,
      btnSpeak,
    ),
    ...optionButtons,
    tvFeedback,
  );

  const tvResultTitle = el("h2", { class: "ch-result__title" });
  const tvFinalScore  = el("div", { class: "ch-result__score" });
  const tvResultMsg   = el("p",  { class: "ch-result__msg" });
  const resultLayout = el("div", { class: "ch-result", style: { display: "none" } },
    tvResultTitle,
    tvFinalScore,
    tvResultMsg,
    el("button", {
      class: "btn btn--gold btn--block ch-result__btn",
      type: "button",
      onClick: () => restart(),
    }, "🔄  שחק שוב"),
    el("button", {
      class: "btn btn--block ch-result__btn",
      type: "button",
      onClick: () => router.go("#/learn"),
    }, "חזור למסך הראשי"),
  );

  const screen = el("div", { class: "screen ch-screen" },
    el("div", { class: "ch-header bg-gradient-hero" },
      el("button", {
        class: "ch-header__back",
        type: "button",
        "aria-label": "חזור",
        onClick: () => router.go("#/learn"),
      }, el("img", { src: "assets/icons/ic_arrow_back.svg", alt: "" })),
      el("h1", { class: "ch-header__title" }, "אתגר נינג׳ה"),
      el("div", { class: "ch-stats-row" },
        el("div", { class: "ch-stats-chip ch-stats-chip--high bg-stats-chip" },
          el("span", { class: "ch-stats-chip__icon" }, "🏆"),
          tvHigh,
        ),
        el("div", { class: "ch-stats-chip ch-stats-chip--main bg-stats-chip" },
          tvStats,
          heartsBox,
        ),
      ),
      progress,
      tvCounter,
    ),
    el("div", { class: "ch-body" },
      gameLayout,
      resultLayout,
    ),
  );

  // ---------- helpers ----------
  function setOptionState(btn, kind /* default | correct | wrong */) {
    btn.classList.remove("ch-option--correct", "ch-option--wrong");
    if (kind === "correct") btn.classList.add("ch-option--correct");
    else if (kind === "wrong") btn.classList.add("ch-option--wrong");
  }

  function renderHearts(lives, lostIndex /* index that just disappeared */) {
    while (heartsBox.firstChild) heartsBox.removeChild(heartsBox.firstChild);
    for (let i = 0; i < STARTING_LIVES; i++) {
      const isFilled = i < lives;
      const span = el("span", {
        class: "ch-heart" + (isFilled ? "" : " ch-heart--empty"),
      }, "♥");
      if (i === lostIndex) span.classList.add("ch-heart--shake");
      heartsBox.appendChild(span);
    }
  }

  function updateStatsRow() {
    tvHigh.textContent  = `שיא: ${state.highScore}`;
    tvStats.textContent = `ניקוד: ${state.score}   רצף: ${state.streak}`;
  }

  function showQuestion() {
    state.answered = false;
    if (state.currentIndex >= state.deck.length || state.lives <= 0) {
      showResult();
      return;
    }
    const q = state.deck[state.currentIndex];
    const pct = Math.floor(state.currentIndex * 100 / state.deck.length);
    progress.firstChild.style.width = `${pct}%`;
    tvCounter.textContent = `שאלה ${state.currentIndex + 1} מתוך ${state.deck.length}`;

    updateStatsRow();
    renderHearts(state.lives, -1);

    tvPrompt.textContent = q.prompt;
    tvFeedback.textContent = "";
    tvFeedback.classList.remove("ch-feedback--visible", "ch-feedback--correct", "ch-feedback--wrong");

    optionButtons.forEach((b, i) => {
      b.disabled = false;
      b.textContent = q.options[i];
      setOptionState(b, "default");
    });
  }

  function onSelect(index) {
    if (state.answered) return;
    state.answered = true;
    const q = state.deck[state.currentIndex];
    optionButtons.forEach(b => { b.disabled = true; });

    setOptionState(optionButtons[q.correctIndex], "correct");
    const isCorrect = (index === q.correctIndex);

    let lostHeartIndex = -1;
    if (isCorrect) {
      state.streak++;
      state.score += 100 + (state.streak * 15);
      tvFeedback.textContent = `נכון! ${q.explanation || ""}`;
      tvFeedback.classList.add("ch-feedback--correct");
    } else {
      lostHeartIndex = state.lives - 1;  // the heart we're about to lose
      state.lives--;
      state.streak = 0;
      setOptionState(optionButtons[index], "wrong");
      tvFeedback.textContent = `לא נכון. ${q.explanation || ""}`;
      tvFeedback.classList.add("ch-feedback--wrong");
    }
    tvFeedback.classList.add("ch-feedback--visible");
    updateStatsRow();
    if (lostHeartIndex >= 0) {
      renderHearts(state.lives, lostHeartIndex);
      // After shake animation completes (.6s), re-render to clean state.
      setTimeout(() => renderHearts(state.lives, -1), 700);
    }

    state.currentIndex++;
    if (state.delayHandle) clearTimeout(state.delayHandle);
    state.delayHandle = setTimeout(() => showQuestion(), QUESTION_DELAY_MS);
  }

  function showResult() {
    const isNewRecord = state.score > state.highScore;
    if (isNewRecord) {
      state.highScore = state.score;
      saveHighScore(state.score);
    }
    gameLayout.style.display = "none";
    resultLayout.style.display = "";
    tvFinalScore.textContent  = String(state.score);
    tvResultTitle.textContent = isNewRecord ? "שיא חדש!" : "סיום אתגר";
    tvResultMsg.textContent   = (state.lives <= 0)
      ? "נגמרו החיים, אבל כל סיבוב מחזק את הזיכרון."
      : `השלמת את כל האתגר. השיא שלך: ${state.highScore}`;

    resultLayout.classList.remove("ch-result--in");
    void resultLayout.offsetWidth;
    resultLayout.classList.add("ch-result--in");
  }

  function restart() {
    if (state.delayHandle) clearTimeout(state.delayHandle);
    const all = buildDeck();
    state.deck = shuffleArr(all).slice(0, DECK_SIZE);
    state.currentIndex = 0;
    state.score = 0;
    state.lives = STARTING_LIVES;
    state.streak = 0;
    gameLayout.style.display = "";
    resultLayout.style.display = "none";
    if (!state.deck.length) {
      tvPrompt.textContent = "אין מספיק שאלות לאתגר.";
      optionButtons.forEach(b => { b.disabled = true; b.textContent = ""; });
      return;
    }
    showQuestion();
  }

  mount(host, screen);
  restart();
}

function ensureStyle() {
  for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (l.getAttribute("href") === "css/screens/challenge.css") return;
  }
  const link = document.createElement("link");
  link.rel  = "stylesheet";
  link.href = "css/screens/challenge.css";
  document.head.appendChild(link);
}
