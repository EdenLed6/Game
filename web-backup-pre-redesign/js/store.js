// store.js — progress + profile persistence
//
// Mirrors ProgressManager.kt (XP, streak, completed lessons, challenge high score)
// and ProfileFragment's "nihongo_profile" prefs (name, photo).
//
// Storage keys are namespaced "kimura.*" in localStorage.

const NS = "kimura.";

const KEY_COMPLETED       = NS + "completed_lessons";       // JSON array of int
const KEY_CHALLENGE_HIGH  = NS + "challenge_high_score";    // int
const KEY_XP              = NS + "total_xp";                // int
const KEY_STREAK          = NS + "streak_count";            // int
const KEY_LAST_DAY        = NS + "last_activity_day";       // int (epoch days)
const KEY_PROFILE_NAME    = NS + "profile_name";            // string
const KEY_PROFILE_PHOTO   = NS + "profile_photo";           // dataURL

// Display total — matches ProgressManager.getTotalLessons()
export const TOTAL_LESSONS = 17;

// ---------- low-level helpers ----------
function read(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : v;
  } catch { return fallback; }
}
function write(key, value) {
  try { localStorage.setItem(key, value); } catch { /* quota / private mode */ }
}
function readInt(key, fb = 0) {
  const v = read(key);
  if (v == null) return fb;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fb;
}
function readJSON(key, fb) {
  const v = read(key);
  if (v == null) return fb;
  try { return JSON.parse(v); } catch { return fb; }
}

// ---------- completed lessons ----------
export function getCompletedLessonIds() {
  const arr = readJSON(KEY_COMPLETED, []);
  if (!Array.isArray(arr)) return new Set();
  return new Set(arr.map(n => Number(n)).filter(Number.isFinite));
}

export function isLessonCompleted(id) {
  return getCompletedLessonIds().has(Number(id));
}

export function markLessonCompleted(id) {
  const set = getCompletedLessonIds();
  set.add(Number(id));
  write(KEY_COMPLETED, JSON.stringify([...set]));
}

export function getCompletedCount() {
  return getCompletedLessonIds().size;
}

// Sequential unlock: lesson 1 always unlocked; lesson N unlocked if N-1 completed
export function isLessonUnlocked(id) {
  const n = Number(id);
  if (n <= 1) return true;
  return isLessonCompleted(n - 1);
}

// ---------- XP ----------
export function getTotalXP() { return readInt(KEY_XP, 0); }

export function addXP(amount) {
  const next = getTotalXP() + Number(amount || 0);
  write(KEY_XP, String(next));
  return next;
}

// ---------- Streak ----------
export function getStreak() { return readInt(KEY_STREAK, 0); }

// Equivalent of ProgressManager.recordActivity().
// epochDay = floor(Date.now() / 86_400_000) in UTC.
export function recordActivity() {
  const today = Math.floor(Date.now() / 86400000);
  const last  = readInt(KEY_LAST_DAY, -1);
  const cur   = getStreak();
  let next;
  if (last === today)        next = cur || 1;
  else if (last === today-1) next = cur + 1;
  else                       next = 1;
  write(KEY_STREAK,    String(next));
  write(KEY_LAST_DAY,  String(today));
  return next;
}

// ---------- Challenge high score ----------
export function getChallengeHighScore() { return readInt(KEY_CHALLENGE_HIGH, 0); }

export function saveChallengeHighScore(score) {
  const cur = getChallengeHighScore();
  if (score > cur) write(KEY_CHALLENGE_HIGH, String(score));
}

// ---------- Profile ----------
export function getProfileName() {
  return read(KEY_PROFILE_NAME, "הלומד שלי");
}
export function setProfileName(name) {
  const v = (name || "").trim() || "הלומד שלי";
  write(KEY_PROFILE_NAME, v);
}

export function getProfilePhoto() {
  return read(KEY_PROFILE_PHOTO, null);
}
export function setProfilePhoto(dataUrl) {
  if (!dataUrl) {
    try { localStorage.removeItem(KEY_PROFILE_PHOTO); } catch {}
    return;
  }
  write(KEY_PROFILE_PHOTO, dataUrl);
}

// ---------- Reset ----------
export function resetProgress() {
  for (const k of [KEY_COMPLETED, KEY_CHALLENGE_HIGH, KEY_XP, KEY_STREAK, KEY_LAST_DAY]) {
    try { localStorage.removeItem(k); } catch {}
  }
}
