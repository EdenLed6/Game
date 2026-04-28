// speaker.js — Web Speech API TTS for Japanese (and Hebrew fallback).
//
// Mirrors the audio button behavior in the Android app — when the user
// taps a vocab/example/practice card, we speak the Japanese text.

let voicesReady = null;

function ensureVoices() {
  if (voicesReady) return voicesReady;
  voicesReady = new Promise(resolve => {
    if (!("speechSynthesis" in window)) { resolve([]); return; }
    const list = window.speechSynthesis.getVoices();
    if (list && list.length) { resolve(list); return; }
    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(v || []);
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    // Safety timeout
    setTimeout(() => resolve(window.speechSynthesis.getVoices() || []), 1500);
  });
  return voicesReady;
}

function pickVoice(voices, lang) {
  if (!voices || !voices.length) return null;
  const exact = voices.find(v => v.lang && v.lang.toLowerCase() === lang.toLowerCase());
  if (exact) return exact;
  const prefix = lang.slice(0, 2).toLowerCase();
  return voices.find(v => v.lang && v.lang.toLowerCase().startsWith(prefix)) || null;
}

export async function speak(text, opts = {}) {
  if (!text) return;
  if (!("speechSynthesis" in window)) return;
  const lang = opts.lang || "ja-JP";
  const rate = opts.rate ?? 0.95;
  const pitch = opts.pitch ?? 1.0;

  const voices = await ensureVoices();
  const voice = pickVoice(voices, lang);

  // Stop anything currently speaking — match the Android tap-to-speak behavior
  try { window.speechSynthesis.cancel(); } catch {}

  const utter = new SpeechSynthesisUtterance(String(text));
  utter.lang = lang;
  utter.rate = rate;
  utter.pitch = pitch;
  if (voice) utter.voice = voice;

  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (!("speechSynthesis" in window)) return;
  try { window.speechSynthesis.cancel(); } catch {}
}

export function isSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
