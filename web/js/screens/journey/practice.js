// practice.js — Step 4 of LessonJourney (port of design's PracticePhase).
//
// Layout (per design_handoff_kimura_redesign/screen-lesson.jsx):
//
//   ┌─ .card.practice-card  (with shake on wrong) ───────────────┐
//   │ "{promptLabel} · {idx+1}/{N}" tag (red-deep, 10px)          │
//   │ ┌─ centered prompt area ────────────────────────────────┐   │
//   │ │ {prompt} (Frank Ruhl Libre 24px, 700)                 │   │
//   │ │ [optional: 🔊 audio button below the prompt]          │   │
//   │ └───────────────────────────────────────────────────────┘   │
//   │  (Either input + check/peek buttons OR a feedback card)     │
//   │ <input class="practice-input" placeholder=cardHint>          │
//   │ "או הקליטו את התשובה:"  [🎤 mic button]                     │
//   │ (on submit/peek)                                            │
//   │   green correct card OR cream reveal card with audio        │
//   │   OR shake + "לא מדויק — נסו שוב או הציצו בתשובה"          │
//   └─────────────────────────────────────────────────────────────┘
//
// The journey shell's continue button is hidden during this phase; the
// practice card has its own action buttons (Check / Peek / Next).

import { el } from "../../dom.js";
import { speak } from "../../speaker.js";

const CACHE = new Map(); // lessonId → { idx, val, verdict }

function normalize(s) {
  return (s || "").trim().toLowerCase().replace(/[\s\-_.,!?]/g, "");
}

function audioBtn(text, sizePx) {
  return el(
    "button",
    {
      type: "button",
      class: "btn-icon audio-pulse practice-card__audio",
      style: { width: sizePx + "px", height: sizePx + "px",
               flex: "0 0 auto" },
      "aria-label": "השמע",
      onClick: (e) => {
        e.stopPropagation();
        const t = e.currentTarget;
        t.classList.add("playing");
        speak(text);
        setTimeout(() => t.classList.remove("playing"), 1100);
      },
    },
    el("span", { "aria-hidden": "true" }, "🔊"),
  );
}

export function Practice({ hostEl, lesson, journey }) {
  journey.setContinueVisible(false);

  const list = Array.isArray(lesson.practiceCards) ? lesson.practiceCards : [];
  if (list.length === 0) {
    hostEl.appendChild(el("p", { class: "lj-step--stub" }, "אין כרטיסי תרגול."));
    return;
  }

  const cached = CACHE.get(lesson.id) || { idx: 0, val: "", verdict: null };
  let idx = cached.idx >= list.length ? 0 : cached.idx;
  let val = cached.val || "";
  let verdict = cached.verdict; // "correct" | "wrong" | "reveal" | null
  let recError = null;
  let recognition = null;
  let recording = false;
  let shakeKey = 0;

  const persist = () => CACHE.set(lesson.id, { idx, val, verdict });

  function rebuild() {
    persist();
    hostEl.innerHTML = "";
    hostEl.appendChild(buildPhase());
  }

  function submit(textArg) {
    const text = textArg != null ? textArg : val;
    if (!text.trim()) return;
    const card = list[idx];
    const ok = normalize(text) === normalize(card.answer);
    verdict = ok ? "correct" : "wrong";
    if (!ok) shakeKey += 1;
    rebuild();
  }

  function reveal() {
    verdict = "reveal";
    rebuild();
  }

  function nextCard() {
    if (idx >= list.length - 1) {
      CACHE.delete(lesson.id);
      journey.advance();
      return;
    }
    idx += 1;
    val = "";
    verdict = null;
    recError = null;
    rebuild();
  }

  function startRecording() {
    recError = null;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      recError = "הקלטת קול אינה נתמכת בדפדפן הזה. נסו דפדפן אחר.";
      rebuild();
      return;
    }
    try {
      recognition = new SR();
      recognition.lang = "ja-JP";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;
      recognition.onresult = (ev) => {
        const card = list[idx];
        const alts = [];
        for (let i = 0; i < ev.results[0].length; i++) {
          alts.push(ev.results[0][i].transcript);
        }
        let pick = alts[0];
        for (const a of alts) {
          if (normalize(a) === normalize(card.answer)) { pick = a; break; }
        }
        val = pick;
        recording = false;
        recognition = null;
        setTimeout(() => submit(pick), 200);
      };
      recognition.onerror = (ev) => {
        recError = ev && ev.error === "not-allowed"
          ? "אין הרשאת מיקרופון."
          : "ההקלטה נכשלה — נסו שוב.";
        recording = false;
        recognition = null;
        rebuild();
      };
      recognition.onend = () => {
        recording = false;
      };
      recording = true;
      rebuild();
      recognition.start();
    } catch (e) {
      recError = "לא ניתן להתחיל הקלטה.";
      recording = false;
      recognition = null;
      rebuild();
    }
  }

  function stopRecording() {
    if (recognition) { try { recognition.stop(); } catch (_) {} }
    recording = false;
    recognition = null;
    rebuild();
  }

  // Cleanup on phase teardown
  if (typeof journey.onDispose === "function") {
    journey.onDispose(() => {
      if (recognition) { try { recognition.abort(); } catch (_) {} }
    });
  }

  function buildPhase() {
    const card = list[idx];
    const cardCls = ["card", "practice-card"];
    if (shakeKey % 2 === 1) cardCls.push("shake");

    const container = el(
      "div",
      { class: "lj-step lj-step--practice practice-phase" },
    );

    const cardEl = el(
      "div",
      { class: cardCls.join(" ") },
      el("div", { class: "practice-card__tag" },
         (card.promptLabel || "תרגול") + " · " + (idx + 1) + "/" + list.length),
      el(
        "div",
        { class: "practice-card__prompt-wrap" },
        el("div", { class: "practice-card__prompt" }, card.prompt || ""),
        card.audioText ? audioBtn(card.audioText, 38) : null,
      ),
    );

    if (verdict === "correct" || verdict === "reveal") {
      // Reveal card with answer + audio
      const revealCls = ["practice-card__reveal"];
      revealCls.push(verdict === "correct"
        ? "practice-card__reveal--correct"
        : "practice-card__reveal--peek");

      cardEl.appendChild(
        el(
          "div",
          { class: revealCls.join(" ") },
          el(
            "div",
            { class: "practice-card__reveal-text" },
            el("div", { class: "practice-card__reveal-tag" }, "תשובה"),
            el("div", { class: "practice-card__reveal-answer" }, card.answer || ""),
            card.answerSub
              ? el("div", { class: "practice-card__reveal-sub" }, card.answerSub)
              : null,
          ),
          card.audioText || card.answer
            ? audioBtn(card.audioText || card.answer, 36)
            : null,
        ),
      );
    } else {
      // Input + voice + buttons
      cardEl.appendChild(
        el("input", {
          class: "practice-input",
          type: "text",
          dir: "auto",
          autofocus: "autofocus",
          value: val,
          placeholder: card.inputHint || "תשובה...",
          onInput: (e) => { val = e.target.value; persist(); },
          onKeyDown: (e) => { if (e.key === "Enter") submit(); },
        }),
      );

      const recBtnStyle = {
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        border: "0",
        cursor: "pointer",
        background: recording ? "#C84B3A" : "var(--c-red)",
        color: "#fff",
        display: "grid",
        placeItems: "center",
        boxShadow: recording
          ? "0 0 0 6px color-mix(in oklab, #C84B3A 24%, transparent)"
          : "0 4px 10px -3px var(--c-red-deep)",
        animation: recording ? "rec-pulse 1.2s ease-in-out infinite" : "none",
      };
      cardEl.appendChild(
        el(
          "div",
          { class: "practice-card__rec-row" },
          el("div", { class: "practice-card__rec-hint" }, "או הקליטו את התשובה:"),
          el(
            "button",
            {
              type: "button",
              class: "practice-card__rec-btn",
              "aria-label": recording ? "עצור הקלטה" : "הקלט תשובה",
              onClick: recording ? stopRecording : startRecording,
              style: recBtnStyle,
            },
            el("span", { "aria-hidden": "true",
                         style: { fontSize: "18px" } }, "🎤"),
          ),
        ),
      );
      if (recError) {
        cardEl.appendChild(
          el("div", { class: "practice-card__rec-error" }, recError),
        );
      }
    }

    if (verdict === "wrong") {
      cardEl.appendChild(
        el("div", { class: "practice-card__wrong" },
          "לא מדויק — נסו שוב או הציצו בתשובה"),
      );
    }

    container.appendChild(cardEl);

    // Action buttons (below the card)
    if (verdict === "correct" || verdict === "reveal") {
      container.appendChild(
        el(
          "button",
          {
            type: "button",
            class: "btn btn-primary practice-action",
            onClick: nextCard,
          },
          idx >= list.length - 1 ? "סיום תרגול ←" : "הבא ←",
        ),
      );
    } else {
      container.appendChild(
        el(
          "div",
          { class: "practice-actions" },
          el(
            "button",
            {
              type: "button",
              class: "btn btn-ghost practice-action practice-action--peek",
              onClick: reveal,
            },
            "הצג תשובה",
          ),
          el(
            "button",
            {
              type: "button",
              class: "btn btn-primary practice-action practice-action--check",
              disabled: val.trim() ? undefined : "true",
              onClick: () => submit(),
            },
            "בדיקה",
          ),
        ),
      );
    }

    return container;
  }

  hostEl.appendChild(buildPhase());
}
