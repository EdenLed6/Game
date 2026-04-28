// teach.js — Step 2 of LessonJourney.
//
// 1:1 port of LessonJourneyActivity.showTeachPage() (Kotlin :511–574),
// plus the per-item card builders buildGrammarBlock() (:673–723) and
// buildExampleRow() (:725–761), plus the back-button rewind from
// onBack() (:196–203). buildTeachCards() (:121–126) is inlined here.
//
// The Activity's TEACH page concatenates [...grammarPoints, ...examples]
// (the VocabItem branch in the orchestrator is dead in the current data
// model — vocabulary always lives in its own VOCAB step) and reveals
// them ONE AT A TIME each time the user taps the bottom continue button.
// Inserting a section header ("דקדוק 📖" / "דוגמאות 💬") whenever the
// item type changes (Kotlin :544–550). The continue button label updates
// per appendTeachItem() :567–572:
//   • more cards remain  → "הבא ↓"
//   • last card shown + lesson.vocabulary.length > 0 → "מילים חדשות →"
//   • last card shown + no vocab → "לתרגול →"
//
// Back-button rewind (Kotlin onBack :196–203): while teachRevealIndex > 1,
// each tap of the toolbar back arrow decrements the reveal index and
// re-renders. Only when teachRevealIndex <= 1 does the shell's default
// back behavior run (→ INTRO).
//
// State persistence:
//   The shell's renderStep() tears down hostEl on every render. We keep
//   a module-level cache keyed by `lesson.id` so that
//     INTRO → TEACH(reveal 3 of 5) → VOCAB → back → TEACH
//   restores the user's previous reveal position rather than starting
//   over. Kotlin does this in onBack() :206–208 by re-running
//   appendTeachItem() until teachRevealIndex catches up; we do the same
//   thing by reading the cached index. The cache is cleared when:
//     • the shell calls back into TEACH from INTRO (teachRevealIndex
//       becomes 1 — fresh start)
//     • the user navigates away to a different lesson (different id)
//
// `preserveState` from the shell tells us whether this render is a
// rerender of the same step (e.g. continue-tap appended a card and
// asked us to redraw). For TEACH every render reads from the cache, so
// the flag has no effect on us — we still honor it for symmetry.

import { el } from "../../dom.js";
import { speak } from "../../speaker.js";

// ─────────────────────────────────────────────────────────────
// Module-level reveal-index cache
// Keyed by lesson.id so navigating across lessons resets cleanly.
// ─────────────────────────────────────────────────────────────

const _state = new Map(); // lessonId -> { revealIndex }

function getRevealIndex(lessonId) {
  const s = _state.get(lessonId);
  return s ? s.revealIndex : 0;
}
function setRevealIndex(lessonId, n) {
  _state.set(lessonId, { revealIndex: n });
}
function clearRevealIndex(lessonId) {
  _state.delete(lessonId);
}

// ─────────────────────────────────────────────────────────────
// Card builders
// ─────────────────────────────────────────────────────────────

// buildGrammarBlock — Kotlin :673–723.
// surfaceAlt card with a 4dp red side stripe (.lj-teach-grammar adds the
// stripe via border-inline-start), 16dp inner padding (foundation .lj-card),
// title 16sp bold primary, body 15sp 1.55, optional pattern block at the
// bottom on a surface-soft background.
function buildGrammarCard(grammar) {
  const children = [
    el("h3", { class: "lj-card__title" }, grammar.title || ""),
    el("p", { class: "lj-card__body" }, grammar.content || ""),
  ];
  const pattern = typeof grammar.pattern === "string" ? grammar.pattern.trim() : "";
  if (pattern.length > 0) {
    children.push(
      el("div", { class: "lj-grammar-pattern" }, pattern),
    );
  }
  return el(
    "section",
    { class: "lj-card lj-teach-grammar" },
    ...children,
  );
}

// buildExampleRow — Kotlin :725–761.
// surfaceAlt card with a 4dp teal side stripe. Vertical layout: romaji
// (18sp bold italic, LTR), japanese (16sp muted, LTR, lang="ja"), hebrew
// chip (15sp bold red on surface-soft pill). Tapping any of the JP-side
// lines triggers TTS via speaker.speak() — same as buildExampleRow's
// setOnClickListener calls (:740, :749).
function buildExampleRow(example) {
  const romaji = example.romaji || "";
  const japanese = example.japanese || "";
  const hebrew = example.hebrew || "";

  const children = [];

  if (romaji) {
    children.push(
      el(
        "p",
        {
          class: "lj-example-romaji dir-ltr",
          role: "button",
          tabindex: "0",
          "aria-label": romaji,
          onClick: () => speak(romaji),
          onKeydown: (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); speak(romaji); }
          },
        },
        romaji,
      ),
    );
  }

  if (japanese) {
    children.push(
      el(
        "p",
        {
          class: "lj-example-japanese dir-ltr",
          lang: "ja",
          role: "button",
          tabindex: "0",
          "aria-label": japanese,
          onClick: () => speak(japanese),
          onKeydown: (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); speak(japanese); }
          },
        },
        japanese,
      ),
    );
  }

  if (hebrew) {
    children.push(
      el("span", { class: "lj-card-hebrew" }, hebrew),
    );
  }

  return el(
    "section",
    { class: "lj-card lj-teach-example" },
    ...children,
  );
}

// Section header — red bar + label (foundation .lj-section / .lj-section__bar).
// Kotlin sectionLabel() (:576–585) is muted-color text only; the journey
// shell's sibling steps render section headers with the red bar accent
// (visible in the .lj-section foundation rule), so we follow that
// convention here for visual consistency.
function buildSectionHeader(label) {
  return el(
    "div",
    { class: "lj-section" },
    el("span", { class: "lj-section__bar", "aria-hidden": "true" }),
    el("span", { class: "lj-section__label" }, label),
  );
}

// ─────────────────────────────────────────────────────────────
// Step renderer
// ─────────────────────────────────────────────────────────────

export function Teach({ hostEl, lesson, journey, ctx, preserveState }) {
  void ctx;          // not needed; lesson carries everything
  void preserveState; // see header comment — cache is the source of truth

  // teachAllItems = [...grammarPoints, ...examples] — Kotlin :121–126 + :513–514.
  const grammarPoints = Array.isArray(lesson.grammarPoints) ? lesson.grammarPoints : [];
  const examples = Array.isArray(lesson.examples) ? lesson.examples : [];
  const teachAllItems = [...grammarPoints, ...examples];

  // Resolve the current reveal index. If the cache is empty (first entry
  // into TEACH, or fresh after a clear) we start with 1 visible item —
  // mirrors Kotlin :535 (`appendTeachItem()` immediately after building
  // the page). If the cache holds a stale index larger than the dataset
  // (shouldn't normally happen, but lessons can change at runtime if
  // hot-reloaded) we clamp it.
  const totalItems = teachAllItems.length;
  let revealIndex = getRevealIndex(lesson.id);
  if (revealIndex <= 0) revealIndex = Math.min(1, totalItems);
  if (revealIndex > totalItems) revealIndex = totalItems;
  setRevealIndex(lesson.id, revealIndex);

  // ───── Build the step DOM ─────

  const stepRoot = el("div", { class: "lj-step lj-step--teach" });

  // Track whether each card type's section header has been emitted yet
  // so a later type-change inserts a header. Kotlin checks `prev !is X`
  // each time a new item is appended (:544–550); the equivalent here is
  // "have we shown a header for this type before this item".
  let lastType = null;
  let lastCardEl = null;

  for (let i = 0; i < revealIndex; i++) {
    const item = teachAllItems[i];
    const itemType = i < grammarPoints.length ? "grammar" : "example";

    if (itemType !== lastType) {
      // Section header (Kotlin :545–550). VocabItem branch is dead in
      // this step (vocabulary lives in VOCAB), so we only emit the two
      // grammar / example labels.
      const headerLabel = itemType === "grammar" ? "דקדוק 📖" : "דוגמאות 💬";
      stepRoot.appendChild(buildSectionHeader(headerLabel));
      lastType = itemType;
    }

    const cardEl = itemType === "grammar"
      ? buildGrammarCard(item)
      : buildExampleRow(item);
    stepRoot.appendChild(cardEl);
    lastCardEl = cardEl;
  }

  hostEl.appendChild(stepRoot);

  // ───── Continue button label (Kotlin :567–572) ─────

  const allDone = revealIndex >= totalItems;
  const hasVocab = Array.isArray(lesson.vocabulary) && lesson.vocabulary.length > 0;
  let continueLabel;
  if (!allDone)             continueLabel = "הבא ↓";
  else if (hasVocab)        continueLabel = "מילים חדשות →";
  else                      continueLabel = "לתרגול →";

  if (journey && typeof journey.setContinueLabel === "function") {
    journey.setContinueLabel(continueLabel);
  }

  // ───── Continue override ─────
  // While more cards remain, we intercept the shell's continue button to
  // reveal the next card in place (Kotlin onContinue :164–165). Once the
  // last card is shown we clear the override so the shell's default
  // nextOf() runs and advances to VOCAB or PRACTICE.
  if (journey) {
    if (allDone) {
      journey.onContinueOverride = null;
    } else {
      journey.onContinueOverride = () => {
        const cur = getRevealIndex(lesson.id);
        if (cur < totalItems) {
          setRevealIndex(lesson.id, cur + 1);
          journey.rerender();
        } else {
          // No more cards — let the shell advance.
          journey.onContinueOverride = null;
          journey.advance();
        }
        return true;
      };
    }

    // ───── Back override (Kotlin onBack :196–203) ─────
    // If revealIndex > 1, decrement and re-render (handled = true).
    // Else clear our cache so the next entry into TEACH starts fresh,
    // and return false so the shell goes to INTRO via its default branch.
    journey.onBackOverride = () => {
      const cur = getRevealIndex(lesson.id);
      if (cur > 1) {
        setRevealIndex(lesson.id, cur - 1);
        journey.rerender();
        return true;
      }
      // Reset for next visit so a fresh INTRO→TEACH starts at index 1.
      clearRevealIndex(lesson.id);
      return false;
    };

    // The shell does not clear these overrides when transitioning to a
    // different step — register a disposer so leaving TEACH (advancing
    // to VOCAB / PRACTICE, or backing out to INTRO) cleanly hands the
    // continue and back buttons back to the shell defaults.
    if (typeof journey.onDispose === "function") {
      journey.onDispose(() => {
        journey.onContinueOverride = null;
        journey.onBackOverride = null;
      });
    }
  }

  // ───── Auto-scroll to the newly revealed card ─────
  // Kotlin :564 calls `teachScrollView.fullScroll(View.FOCUS_DOWN)` after
  // appending. The shell's host (`.lj-step-host`) is the scroll container.
  // We scroll the last card into view on the next frame so layout has
  // settled. On the very first reveal there's no prior scroll, so this
  // is effectively a no-op then.
  if (lastCardEl) {
    requestAnimationFrame(() => {
      try {
        lastCardEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } catch (_) {
        // Older browsers — fallback to direct scrollTop assignment on
        // the scroll host. The shell uses .lj-step-host as the scroller.
        const scroller = hostEl.closest(".lj-step-host") || hostEl;
        scroller.scrollTop = scroller.scrollHeight;
      }
    });
  }
}
