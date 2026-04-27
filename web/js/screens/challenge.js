// Mirrors GameChallengeActivity.kt + activity_game_challenge.xml
//
// Layout 1:1:
//   • Vertical LinearLayout, background = @color/background
//   • Hero block (bg_gradient_hero, padding 20/44/20/16)
//       - MaterialToolbar (white nav + title)
//       - Stats row: bg_stats_chip x 2  (high score weight 1, current weight 2)
//       - LinearProgressIndicator (gold over #4A1A16)
//       - Counter line (white, alpha 0.75, 11sp)
//   • Game card (24dp radius, padding 20dp, weight 1)
//       - Prompt row: prompt (22sp bold) + 48dp speak button
//       - 4 Option buttons (App.Button.Option, 8dp gap)
//       - Feedback line (visibility INVISIBLE while idle)
//   • Result LinearLayout (visibility GONE while playing)
//
// Behaviour 1:1 with GameChallengeActivity:
//   • restartGame  → questions = shuffled deck, take(12), reset stats
//   • showQuestion → progress = index*100/size, counter, stats text "ניקוד: X   חיים: ♥...   רצף: Y"
//                    paint each option white w/ red text, enable, set text
//   • onOptionSelected → disable all, paint correct = green/white, paint
//                        wrong = red/white, score += 100 + streak*15, streak++ on
//                        correct, lives-- on wrong; postDelayed 1100ms → next.
//   • showResult   → hide game, show result screen, save high score if new.

import { el, mount, shuffle } from "../dom.js";
import { Router } from "../router.js";
import { Speaker } from "../speaker.js";
import { Progress } from "../store.js";

const NEXT_DELAY_MS = 1100;          // mirrors postDelayed(..., 1100)

export function Challenge(data) {
  const state = {
    questions: shuffle(buildChallengeDeck(data.lessons)).slice(0, 12),
    index: 0,
    score: 0,
    lives: 3,
    streak: 0,
    highScore: Progress.getChallengeHighScore(),
    selected: null,
    submitted: false,
    finished: false,
    isNewRecord: false,
    pendingTimer: null,
  };

  function clearTimer() {
    if (state.pendingTimer != null) {
      clearTimeout(state.pendingTimer);
      state.pendingTimer = null;
    }
  }

  function render() {
    if (state.finished) return renderResult();
    if (state.index >= state.questions.length || state.lives <= 0) {
      return showResult();
    }
    const q = state.questions[state.index];
    const total = state.questions.length;
    const progressPct = Math.floor((state.index * 100) / total);

    // Stats row text — mirrors:
    //   "ניקוד: $score   חיים: ${"♥".repeat(lives)}   רצף: $streak"
    const statsText = `ניקוד: ${state.score}   חיים: ${"♥".repeat(state.lives)}   רצף: ${state.streak}`;

    const optionEls = q.options.map((opt, i) => {
      let cls = "challenge-option";
      if (state.submitted) {
        if (i === q.correctIndex) cls += " is-correct";
        else if (i === state.selected) cls += " is-wrong";
      }
      return el("button", {
        type: "button",
        class: cls,
        disabled: state.submitted,
        onClick: () => onOptionSelected(i),
      }, opt);
    });

    const view = el("div", { class: "page" },
      // Hero block
      el("section", { class: "challenge-hero bg-gradient-hero" },
        el("div", { class: "app-toolbar" },
          el("button", {
            type: "button",
            class: "back-btn",
            "aria-label": "חזור",
            onClick: () => { clearTimer(); Router.go("/"); },
          },
            // Android navigationIcon points "back" at start of writing direction.
            // In RTL the visual arrow is →; CSS already lays it out at the start.
            el("span", { html: "&#8594;" }),
          ),
          el("h1", { class: "title" }, "אתגר נינג׳ה"),
        ),

        // Stats row
        el("div", { class: "challenge-stats-row" },
          el("div", { class: "challenge-stat-chip high-score" },
            el("span", { class: "emoji" }, "🏆"),
            el("span", { class: "value" }, `שיא: ${state.highScore}`),
          ),
          el("div", { class: "challenge-stat-chip current" },
            el("span", { class: "value", id: "challengeStatsValue" }, statsText),
          ),
        ),

        // Progress indicator
        el("div", { class: "challenge-progress", role: "progressbar",
                    "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": progressPct },
          el("div", { class: "fill", style: { width: progressPct + "%" } }),
        ),

        // Counter "שאלה X מתוך Y"
        el("div", { class: "challenge-counter" },
          `שאלה ${state.index + 1} מתוך ${total}`,
        ),
      ),

      // Game card
      el("section", { class: "challenge-card anim-fade-in" },
        el("div", { class: "challenge-prompt-row" },
          el("div", { class: "challenge-prompt", id: "challengePrompt" }, q.prompt),
          el("button", {
            type: "button",
            class: "challenge-speak-btn",
            "aria-label": "השמעה",
            onClick: () => Speaker.speak(q.prompt),
          },
            // Inline ic_volume.svg — the same path used in app/res/drawable/ic_volume.xml.
            el("span", { html:
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">' +
              '<path fill="currentColor" d="M3,9v6h4l5,5V4L7,9H3zm13.5,3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-0.73 2.5-2.25 2.5-4.02z"/>' +
              '<path fill="currentColor" d="M14,3.23v2.06c2.89,0.86 5,3.54 5,6.71s-2.11,5.85-5,6.71v2.06c4.01-0.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>' +
              '</svg>',
            }),
          ),
        ),

        el("div", { class: "challenge-options" }, optionEls),

        el("div", {
          class: "challenge-feedback" + (state.submitted ? "" : " is-hidden"),
          id: "challengeFeedback",
        },
          state.submitted
            ? (state.selected === q.correctIndex
                ? `נכון! ${q.explanation}`
                : `לא נכון. ${q.explanation}`)
            : " ",
        ),
      ),
    );

    mount(view);

    // Once mounted, briefly pop the score-chip on a correct answer to mirror the
    // gentle gamification beat from the original app.
    if (state.submitted && state.selected === state.questions[state.index].correctIndex) {
      const chip = document.getElementById("challengeStatsValue");
      if (chip) {
        chip.classList.remove("is-score-pop");
        // force reflow before re-adding to restart animation
        void chip.offsetWidth;
        chip.classList.add("is-score-pop");
      }
    }
    // Heart shake when a life was just lost.
    if (state.submitted && state.selected != null
        && state.selected !== state.questions[state.index].correctIndex) {
      const chip = document.getElementById("challengeStatsValue");
      if (chip) {
        chip.classList.remove("is-shaking");
        void chip.offsetWidth;
        chip.classList.add("is-shaking");
      }
    }
  }

  function onOptionSelected(i) {
    if (state.submitted) return;
    const q = state.questions[state.index];
    state.selected = i;
    state.submitted = true;

    if (i === q.correctIndex) {
      state.streak += 1;
      state.score += 100 + state.streak * 15;
    } else {
      state.lives -= 1;
      state.streak = 0;
    }

    render();

    // postDelayed({ showQuestion() }, 1100)
    clearTimer();
    state.pendingTimer = setTimeout(() => {
      state.pendingTimer = null;
      state.index += 1;
      state.selected = null;
      state.submitted = false;
      render();
    }, NEXT_DELAY_MS);
  }

  function showResult() {
    state.isNewRecord = state.score > state.highScore;
    if (state.isNewRecord) {
      Progress.saveChallengeHighScore(state.score);
      state.highScore = state.score;
    }
    state.finished = true;
    renderResult();
  }

  function renderResult() {
    const title = state.isNewRecord ? "שיא חדש!" : "סיום אתגר";
    const message = state.lives <= 0
      ? "נגמרו החיים, אבל כל סיבוב מחזק את הזיכרון."
      : `השלמת את כל האתגר. השיא שלך: ${state.highScore}`;

    const view = el("div", { class: "page" },
      // Hero header is kept so the screen feels continuous with the gameplay.
      el("section", { class: "challenge-hero bg-gradient-hero" },
        el("div", { class: "app-toolbar" },
          el("button", {
            type: "button",
            class: "back-btn",
            "aria-label": "חזור",
            onClick: () => Router.go("/"),
          },
            el("span", { html: "&#8594;" }),
          ),
          el("h1", { class: "title" }, "אתגר נינג׳ה"),
        ),
      ),

      el("section", { class: "challenge-result anim-fade-in" },
        el("div", { class: "title anim-bounce" }, title),
        el("div", { class: "final-score anim-scale-in" }, String(state.score)),
        el("div", { class: "message" }, message),
        el("div", { class: "btn-row" },
          el("button", {
            type: "button",
            class: "btn btn-gold",
            onClick: () => restartGame(),
          }, "🔄  שחק שוב"),
          el("button", {
            type: "button",
            class: "btn btn-outlined",
            onClick: () => Router.go("/"),
          }, "חזור למסך הראשי"),
        ),
      ),
    );

    mount(view);
  }

  function restartGame() {
    clearTimer();
    state.questions = shuffle(buildChallengeDeck(data.lessons)).slice(0, 12);
    state.index = 0;
    state.score = 0;
    state.lives = 3;
    state.streak = 0;
    state.selected = null;
    state.submitted = false;
    state.finished = false;
    state.isNewRecord = false;
    state.highScore = Progress.getChallengeHighScore();
    render();
  }

  render();
}

// Mirrors buildChallengeDeck() — quiz questions across all lessons + 2 vocab
// questions per item (Hebrew→Japanese, Japanese→Hebrew). Filtered to 4 options.
function buildChallengeDeck(lessons) {
  const quizQuestions = [];
  for (const lesson of lessons) {
    for (const q of lesson.exercises) {
      quizQuestions.push({
        prompt: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: (q.explanation && q.explanation.trim()) || `מתוך ${lesson.title}`,
      });
    }
  }

  // distinctBy { japanese + hebrew }
  const seen = new Set();
  const vocabulary = [];
  for (const lesson of lessons) {
    for (const v of lesson.vocabulary) {
      const key = v.japanese + v.hebrew;
      if (!seen.has(key)) { seen.add(key); vocabulary.push(v); }
    }
  }
  const hebrewPool = [...new Set(vocabulary.map(v => v.hebrew))];
  const japanesePool = [...new Set(vocabulary.map(v => v.japanese))];

  const vocabQuestions = [];
  for (const v of vocabulary) {
    const a = makeQuestion({
      prompt: `מה הפירוש של ${v.japanese} (${v.romaji})?`,
      correct: v.hebrew,
      pool: hebrewPool,
      explanation: `${v.japanese} = ${v.hebrew}`,
    });
    if (a) vocabQuestions.push(a);
    const b = makeQuestion({
      prompt: `איזו מילה יפנית מתאימה ל-${v.hebrew}?`,
      correct: v.japanese,
      pool: japanesePool,
      explanation: `${v.hebrew} = ${v.japanese}`,
    });
    if (b) vocabQuestions.push(b);
  }

  return [...quizQuestions, ...vocabQuestions].filter(q => q.options.length === 4);
}

function makeQuestion({ prompt, correct, pool, explanation }) {
  const wrong = shuffle(pool.filter(x => x !== correct)).slice(0, 3);
  if (wrong.length < 3) return null;
  const options = shuffle([...wrong, correct]);
  return { prompt, options, correctIndex: options.indexOf(correct), explanation };
}
