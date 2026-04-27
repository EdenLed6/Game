// Web Speech API — mirror of audio/PronunciationSpeaker.kt
const synth = typeof speechSynthesis !== "undefined" ? speechSynthesis : null;

let voicesCache = [];
function loadVoices() {
  if (!synth) return;
  voicesCache = synth.getVoices() || [];
}
if (synth) {
  loadVoices();
  synth.onvoiceschanged = loadVoices;
}

function pickJaVoice() {
  if (!voicesCache.length) loadVoices();
  return voicesCache.find(v => /^ja(-|_|$)/i.test(v.lang)) || null;
}

export const Speaker = {
  speak(text) {
    if (!synth || !text) return;
    try {
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "ja-JP";
      utter.rate = 0.9;
      utter.pitch = 1.0;
      const v = pickJaVoice();
      if (v) utter.voice = v;
      synth.speak(utter);
    } catch (e) {
      console.warn("speak failed", e);
    }
  },
  stop() {
    try { synth && synth.cancel(); } catch {}
  },
};
