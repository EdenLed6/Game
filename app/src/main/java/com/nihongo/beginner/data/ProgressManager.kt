package com.nihongo.beginner.data

import android.content.Context

object ProgressManager {
    private const val PREFS_NAME = "nihongo_progress"
    private const val KEY_COMPLETED = "completed_lessons"
    private const val KEY_CHALLENGE_HIGH_SCORE = "challenge_high_score"
    private const val KEY_XP = "total_xp"
    private const val KEY_STREAK = "streak_count"
    private const val KEY_LAST_ACTIVITY_DAY = "last_activity_day"

    fun markLessonCompleted(context: Context, lessonId: Int) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val completed = prefs.getStringSet(KEY_COMPLETED, mutableSetOf())!!.toMutableSet()
        completed.add(lessonId.toString())
        prefs.edit().putStringSet(KEY_COMPLETED, completed).apply()
    }

    fun isLessonCompleted(context: Context, lessonId: Int): Boolean {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getStringSet(KEY_COMPLETED, emptySet())!!.contains(lessonId.toString())
    }

    fun getCompletedCount(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getStringSet(KEY_COMPLETED, emptySet())!!.size
    }

    fun getTotalLessons(): Int = 17

    fun getChallengeHighScore(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_CHALLENGE_HIGH_SCORE, 0)
    }

    fun saveChallengeHighScore(context: Context, score: Int) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        if (score > prefs.getInt(KEY_CHALLENGE_HIGH_SCORE, 0)) {
            prefs.edit().putInt(KEY_CHALLENGE_HIGH_SCORE, score).apply()
        }
    }

    fun resetProgress(context: Context) {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit().clear().apply()
    }

    // Returns Set<Int> of completed lesson IDs
    fun getCompletedLessonIds(context: Context): Set<Int> {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getStringSet(KEY_COMPLETED, emptySet())!!.map { it.toInt() }.toSet()
    }

    // Sequential unlock: lesson 1 always unlocked; lesson N unlocked if lesson N-1 is completed
    fun isLessonUnlocked(context: Context, lessonId: Int): Boolean {
        if (lessonId == 1) return true
        return isLessonCompleted(context, lessonId - 1)
    }

    fun getTotalXP(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_XP, 0)
    }

    fun addXP(context: Context, amount: Int) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val current = prefs.getInt(KEY_XP, 0)
        prefs.edit().putInt(KEY_XP, current + amount).apply()
    }

    fun getStreak(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_STREAK, 0)
    }

    fun recordActivity(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val todayDay = java.util.concurrent.TimeUnit.MILLISECONDS.toDays(System.currentTimeMillis()).toInt()
        val lastDay = prefs.getInt(KEY_LAST_ACTIVITY_DAY, -1)
        val currentStreak = prefs.getInt(KEY_STREAK, 0)
        val newStreak = when {
            lastDay == todayDay -> currentStreak // already recorded today
            lastDay == todayDay - 1 -> currentStreak + 1 // consecutive day
            else -> 1 // streak broken, restart
        }
        prefs.edit()
            .putInt(KEY_STREAK, newStreak)
            .putInt(KEY_LAST_ACTIVITY_DAY, todayDay)
            .apply()
    }
}
