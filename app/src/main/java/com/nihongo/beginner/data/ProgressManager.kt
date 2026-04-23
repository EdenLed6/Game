package com.nihongo.beginner.data

import android.content.Context

object ProgressManager {
    private const val PREFS_NAME = "nihongo_progress"
    private const val KEY_COMPLETED = "completed_lessons"
    private const val KEY_CHALLENGE_HIGH_SCORE = "challenge_high_score"

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
}
