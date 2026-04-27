// localStorage-backed mirror of ProgressManager.kt + WorkbookProgressManager.kt

const NS_PROGRESS = "nihongo_progress:";
const NS_WORKBOOK = "nihongo_workbook:";
const KEY_COMPLETED = NS_PROGRESS + "completed_lessons";
const KEY_HIGH_SCORE = NS_PROGRESS + "challenge_high_score";

const TOTAL_LESSONS = 17;

function readSet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function writeSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

export const Progress = {
  getTotalLessons() { return TOTAL_LESSONS; },

  markLessonCompleted(lessonId) {
    const set = readSet(KEY_COMPLETED);
    set.add(String(lessonId));
    writeSet(KEY_COMPLETED, set);
  },

  isLessonCompleted(lessonId) {
    return readSet(KEY_COMPLETED).has(String(lessonId));
  },

  getCompletedCount() {
    return readSet(KEY_COMPLETED).size;
  },

  getCompletedIds() {
    return [...readSet(KEY_COMPLETED)].map(s => parseInt(s, 10)).filter(n => !isNaN(n));
  },

  getChallengeHighScore() {
    const v = parseInt(localStorage.getItem(KEY_HIGH_SCORE) || "0", 10);
    return isNaN(v) ? 0 : v;
  },

  saveChallengeHighScore(score) {
    const cur = this.getChallengeHighScore();
    if (score > cur) {
      localStorage.setItem(KEY_HIGH_SCORE, String(score));
      return true;
    }
    return false;
  },

  resetAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(NS_PROGRESS) || k.startsWith(NS_WORKBOOK))
      .forEach(k => localStorage.removeItem(k));
  },
};

export const Workbook = {
  saveAnswer(exerciseId, text, maxLength = 1200) {
    const trimmed = (text || "").slice(0, maxLength);
    localStorage.setItem(NS_WORKBOOK + "answer_" + exerciseId, trimmed);
  },
  getAnswer(exerciseId) {
    return localStorage.getItem(NS_WORKBOOK + "answer_" + exerciseId) || "";
  },
  markComplete(exerciseId, complete = true) {
    if (complete) {
      localStorage.setItem(NS_WORKBOOK + "complete_" + exerciseId, "1");
    } else {
      localStorage.removeItem(NS_WORKBOOK + "complete_" + exerciseId);
    }
  },
  isComplete(exerciseId) {
    return localStorage.getItem(NS_WORKBOOK + "complete_" + exerciseId) === "1";
  },
  recordAttempt(exerciseId) {
    const key = NS_WORKBOOK + "attempts_" + exerciseId;
    const cur = parseInt(localStorage.getItem(key) || "0", 10) || 0;
    localStorage.setItem(key, String(cur + 1));
    return cur + 1;
  },
  getAttempts(exerciseId) {
    return parseInt(localStorage.getItem(NS_WORKBOOK + "attempts_" + exerciseId) || "0", 10) || 0;
  },
  revealNextHint(exerciseId, total) {
    const key = NS_WORKBOOK + "hint_" + exerciseId;
    const cur = parseInt(localStorage.getItem(key) || "0", 10) || 0;
    const next = Math.min(cur + 1, total);
    localStorage.setItem(key, String(next));
    return next;
  },
  getRevealedHintCount(exerciseId) {
    return parseInt(localStorage.getItem(NS_WORKBOOK + "hint_" + exerciseId) || "0", 10) || 0;
  },
  getLessonCompletedCount(lessonId, exercises) {
    return exercises.filter(e => e.lessonId === lessonId && this.isComplete(e.id)).length;
  },
};
