// user-store.js — globals mirror of the existing web/js/store.js
// (which uses ES module imports and isn't accessible from the design's
// classic <script> tags). Same localStorage key namespace, so any
// progress the user accumulated under the previous web app shows up
// automatically here — no migration step.

(function () {
  var NS = "kimura.";
  var KEY_COMPLETED      = NS + "completed_lessons";    // JSON array of int
  var KEY_XP             = NS + "total_xp";             // int
  var KEY_STREAK         = NS + "streak_count";         // int
  var KEY_LAST_DAY       = NS + "last_activity_day";    // int (epoch days)
  var KEY_PROFILE_NAME   = NS + "profile_name";         // string
  var KEY_PROFILE_PHOTO  = NS + "profile_photo";        // dataURL

  // ---------- low-level helpers ----------
  function read(key, fallback) {
    if (fallback === undefined) fallback = null;
    try {
      var v = localStorage.getItem(key);
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* quota / private mode */ }
  }
  function readInt(key, fb) {
    if (fb === undefined) fb = 0;
    var v = read(key);
    if (v == null) return fb;
    var n = parseInt(v, 10);
    return isFinite(n) ? n : fb;
  }
  function readJSON(key, fb) {
    var v = read(key);
    if (v == null) return fb;
    try { return JSON.parse(v); } catch (e) { return fb; }
  }

  // ---------- completed lessons ----------
  function getCompletedIds() {
    var arr = readJSON(KEY_COMPLETED, []);
    if (!Array.isArray(arr)) return new Set();
    var s = new Set();
    for (var i = 0; i < arr.length; i++) {
      var n = Number(arr[i]);
      if (isFinite(n)) s.add(n);
    }
    return s;
  }
  function isLessonCompleted(id) { return getCompletedIds().has(Number(id)); }
  function markLessonCompleted(id) {
    var set = getCompletedIds();
    set.add(Number(id));
    var out = [];
    set.forEach(function (n) { out.push(n); });
    write(KEY_COMPLETED, JSON.stringify(out));
  }
  // Sequential unlock: lesson 1 always unlocked; lesson N unlocked if N-1 completed.
  function isLessonUnlocked(id) {
    var n = Number(id);
    if (n <= 1) return true;
    return isLessonCompleted(n - 1);
  }
  // First unlocked-but-not-completed lesson in the 1..total range
  function getCurrentLessonId(total) {
    var ids = getCompletedIds();
    for (var i = 1; i <= total; i++) {
      if (!ids.has(i) && isLessonUnlocked(i)) return i;
    }
    return null;
  }

  // ---------- XP ----------
  function getTotalXP() { return readInt(KEY_XP, 0); }
  function addXP(amount) {
    var next = getTotalXP() + Number(amount || 0);
    write(KEY_XP, String(next));
    return next;
  }

  // ---------- Streak ----------
  function getStreak() { return readInt(KEY_STREAK, 0); }
  // Mirrors ProgressManager.recordActivity(): keep / +1 / reset based on
  // last activity day. epochDay = floor(Date.now() / 86_400_000) in UTC.
  function recordActivity() {
    var today = Math.floor(Date.now() / 86400000);
    var last  = readInt(KEY_LAST_DAY, -1);
    var cur   = getStreak();
    var next;
    if (last === today)         next = cur || 1;
    else if (last === today - 1) next = cur + 1;
    else                         next = 1;
    write(KEY_STREAK,   String(next));
    write(KEY_LAST_DAY, String(today));
    return next;
  }

  // ---------- Profile ----------
  function getProfileName()           { return read(KEY_PROFILE_NAME, "הלומד שלי"); }
  function setProfileName(name) {
    var v = (name || "").trim() || "הלומד שלי";
    write(KEY_PROFILE_NAME, v);
  }
  function getProfilePhoto()          { return read(KEY_PROFILE_PHOTO, null); }
  function setProfilePhoto(dataUrl) {
    if (!dataUrl) { try { localStorage.removeItem(KEY_PROFILE_PHOTO); } catch (e) {} return; }
    write(KEY_PROFILE_PHOTO, dataUrl);
  }

  // ---------- Hearts (not tracked yet — static getter for now) ----------
  function getHearts() { return 5; }

  window.KimuraStore = {
    getCompletedIds:      getCompletedIds,
    isLessonCompleted:    isLessonCompleted,
    isLessonUnlocked:     isLessonUnlocked,
    markLessonCompleted:  markLessonCompleted,
    getCurrentLessonId:   getCurrentLessonId,
    getTotalXP:           getTotalXP,
    addXP:                addXP,
    getStreak:            getStreak,
    recordActivity:       recordActivity,
    getProfileName:       getProfileName,
    setProfileName:       setProfileName,
    getProfilePhoto:      getProfilePhoto,
    setProfilePhoto:      setProfilePhoto,
    getHearts:            getHearts,
  };
})();
