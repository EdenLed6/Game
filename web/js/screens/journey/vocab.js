// vocab.js — Step 3 of LessonJourney.
//
// 1:1 port of LessonJourneyActivity.showVocabPage() (Kotlin :459–509) and
// buildVocabRow() (Kotlin :587–671). Back-button rewind mirrors :204–213.
//
// Behavior summary:
//   • Section header "מילים חדשות 📝" rendered once at the top.
//   • Vocab cards revealed PROGRESSIVELY — one per Continue tap. Each card
//     shows an emoji bubble (72×72, 16dp radius, pastel background cycling
//     through emojiColors), a text block (Japanese / romaji / Hebrew) and a
//     red speaker button that calls speaker.speak(item.japanese).
//   • Continue label: "הבא ↓" while items remain, "לתרגול →" on the last.
//   • Continue progressive-reveal is implemented via journey.onContinueOverride.
//     Once the final item is shown the override is cleared so the shell's
//     default nextOf() advances to PRACTICE.
//   • Back button: if vocabRevealIndex > 1, decrement + re-render and return
//     true. Otherwise return false and let the shell go back to TEACH (the
//     shell's default handler calls goto("teach"), and the TEACH step will
//     restore itself with all items revealed — that's TEACH's responsibility
//     as the Kotlin code does the same in onBack at :204–213).
//   • Auto-scroll to the newly added card after appending.

import { el } from "../../dom.js";
import { speak } from "../../speaker.js";

// LessonJourneyActivity.kt:454–457 — the exact emojiColors list. Kept
// verbatim so cards cycle through the same six pastels as the Android app.
// (The agent prompt's eight-color palette is a paraphrase; the Kotlin source
// is the truth, per "READ ONLY" rules.)
const EMOJI_COLORS = [
  "#FFE4E1", // misty rose
  "#E3F2FD", // light blue
  "#FFF9C4", // light yellow
  "#E8F5E9", // mint
  "#F3E5F5", // lavender
  "#FFECB3", // amber
];

// Module-level cache, keyed by lesson.id. Lets back/forward through the
// journey preserve how many items the user has revealed within VOCAB.
const revealCache = new Map();

function getRevealIndex(lessonId, total) {
  const cached = revealCache.get(lessonId);
  // Show at least one card on first entry (mirrors appendVocabItem at
  // the end of showVocabPage, Kotlin :482).
  if (typeof cached !== "number" || cached < 1) return Math.min(1, total);
  return Math.min(cached, total);
}

function setRevealIndex(lessonId, n) {
  revealCache.set(lessonId, n);
}

// Build one vocab card. 1:1 port of buildVocabRow (Kotlin :587–671).
function buildVocabRow(item, bgColor) {
  const emojiBox = el(
    "div",
    {
      class: "lj-vocab__emoji-box",
      style: { background: bgColor },
      "aria-hidden": "true",
    },
    el(
      "span",
      { class: "lj-vocab__emoji" },
      // Kotlin :615 — fall back to the JP flag emoji when the item has none.
      item.emoji && String(item.emoji).trim().length > 0 ? item.emoji : "🇯🇵",
    ),
  );

  // Japanese (large bold, LTR isolation, lang="ja"). Tap also speaks, mirroring
  // the Kotlin onClick on tvJapanese (:636).
  const jpText = el(
    "span",
    {
      class: "lj-vocab__jp dir-ltr",
      lang: "ja",
      role: "button",
      tabindex: "0",
      onClick: () => speak(item.japanese || ""),
      onKeydown: (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          speak(item.japanese || "");
        }
      },
    },
    item.japanese || "",
  );

  const romajiText = el(
    "span",
    { class: "lj-vocab__romaji dir-ltr", lang: "en" },
    item.romaji || "",
  );

  const hebrewText = el(
    "span",
    { class: "lj-vocab__hebrew" },
    item.hebrew || "",
  );

  const textBlock = el(
    "div",
    { class: "lj-vocab__text" },
    jpText,
    romajiText,
    hebrewText,
  );

  // Red speaker button — sits on the start side under RTL (visually far end
  // opposite the emoji bubble). Mirrors the MaterialButton at Kotlin :655–667.
  const speakerBtn = el(
    "button",
    {
      type: "button",
      class: "lj-speaker lj-speaker--lg lj-vocab__speaker",
      "aria-label": "השמע",
      onClick: () => speak(item.japanese || ""),
    },
    "🔊",
  );

  return el(
    "div",
    { class: "lj-card lj-vocab__card" },
    el(
      "div",
      { class: "lj-vocab__row" },
      emojiBox,
      textBlock,
      speakerBtn,
    ),
  );
}

export function Vocab({ hostEl, lesson, journey, ctx, preserveState }) {
  void ctx;
  void preserveState; // The cache handles state across re-renders/back-navigation.

  const items = Array.isArray(lesson.vocabulary) ? lesson.vocabulary : [];
  const total = items.length;

  // Defensive: if the journey routed us here with no vocab, just hand control
  // back to the shell (it will advance to PRACTICE on Continue).
  if (total === 0) {
    journey.onContinueOverride = null;
    journey.onBackOverride = null;
    hostEl.appendChild(
      el("div", { class: "lj-step lj-step--vocab" },
        el("p", { class: "lj-counter" }, "אין מילים חדשות בשיעור זה")),
    );
    return;
  }

  // Resolve current reveal count (1..total).
  let revealIndex = getRevealIndex(lesson.id, total);

  // Section header (Kotlin :463–467, :478) — render once at the top.
  const sectionHeader = el(
    "h2",
    { class: "lj-section lj-vocab__section" },
    el("span", { class: "lj-section__bar", "aria-hidden": "true" }),
    "מילים חדשות 📝",
  );

  // Container for the cards. We append to it directly when revealing new
  // items so older cards don't replay their slide-up animation.
  const cardsHost = el("div", { class: "lj-vocab__cards" });

  const stepRoot = el(
    "div",
    { class: "lj-step lj-step--vocab" },
    sectionHeader,
    cardsHost,
  );

  hostEl.appendChild(stepRoot);

  // Render the first `revealIndex` cards.
  for (let i = 0; i < revealIndex; i++) {
    cardsHost.appendChild(buildVocabRow(items[i], EMOJI_COLORS[i % EMOJI_COLORS.length]));
  }

  // Sync the persistent cache with what's actually on screen.
  setRevealIndex(lesson.id, revealIndex);

  // ── Continue button wiring ────────────────────────────────────────────
  function syncContinue() {
    // Kotlin :490 — label flips on the last reveal.
    if (revealIndex >= total) {
      journey.setContinueLabel("לתרגול →");
      journey.onContinueOverride = null; // Let the shell advance to PRACTICE.
    } else {
      journey.setContinueLabel("הבא ↓");
      journey.onContinueOverride = () => {
        appendNext();
        return true;
      };
    }
  }

  function appendNext() {
    if (revealIndex >= total) return;
    const item = items[revealIndex];
    const card = buildVocabRow(item, EMOJI_COLORS[revealIndex % EMOJI_COLORS.length]);
    cardsHost.appendChild(card);
    revealIndex++;
    setRevealIndex(lesson.id, revealIndex);
    syncContinue();

    // Auto-scroll to the newly added card. Mirrors the
    // ScrollView.fullScroll(FOCUS_DOWN) call at Kotlin :489. Use rAF so the
    // browser has laid out the new card before we scroll.
    requestAnimationFrame(() => {
      try {
        card.scrollIntoView({ behavior: "smooth", block: "end" });
      } catch (_) {
        // Older browsers without smooth scrolling — fall back to instant.
        card.scrollIntoView(false);
      }
    });
  }

  syncContinue();

  // ── Back button wiring (Kotlin :204–213) ──────────────────────────────
  // If the user has revealed more than one card, back rewinds inside the
  // VOCAB page. Otherwise we return false so the shell falls through to its
  // default (goto("teach")). The reset of revealIndex to total happens when
  // the user comes back FORWARD into VOCAB from PRACTICE — handled by the
  // shell's onBack (lesson-journey.js :286), which calls VOCAB with the
  // cache still pointing at `total`, so all cards reappear.
  journey.onBackOverride = () => {
    if (revealIndex > 1) {
      revealIndex -= 1;
      setRevealIndex(lesson.id, revealIndex);
      journey.rerender();
      return true;
    }
    // Reset the cache so re-entering VOCAB shows just the first card again
    // (mirrors Kotlin showVocabPage which always resets vocabRevealIndex=0
    // and then appendVocabItem()).
    setRevealIndex(lesson.id, 1);
    return false;
  };

  // Clean up overrides when leaving the step so they don't leak into the
  // next step's Continue/Back handling.
  if (typeof journey.onDispose === "function") {
    journey.onDispose(() => {
      journey.onContinueOverride = null;
      journey.onBackOverride = null;
    });
  }
}
