package com.nihongo.beginner.data

import android.content.Context

object WorkbookProgressManager {
    private const val PREFS_NAME = "nihongo_workbook_private"
    private const val KEY_ANSWER_PREFIX = "answer_"
    private const val KEY_COMPLETE_PREFIX = "complete_"
    private const val KEY_ATTEMPT_PREFIX = "attempts_"
    private const val KEY_HINT_PREFIX = "hint_"
    private const val MAX_STORED_ANSWER_LENGTH = 1200

    fun saveAnswer(context: Context, exerciseId: String, answer: String) {
        val safeAnswer = answer.take(MAX_STORED_ANSWER_LENGTH)
        prefs(context).edit().putString(KEY_ANSWER_PREFIX + exerciseId, safeAnswer).apply()
    }

    fun getAnswer(context: Context, exerciseId: String): String {
        return prefs(context).getString(KEY_ANSWER_PREFIX + exerciseId, "") ?: ""
    }

    fun markComplete(context: Context, exerciseId: String) {
        prefs(context).edit().putBoolean(KEY_COMPLETE_PREFIX + exerciseId, true).apply()
    }

    fun isComplete(context: Context, exerciseId: String): Boolean {
        return prefs(context).getBoolean(KEY_COMPLETE_PREFIX + exerciseId, false)
    }

    fun recordAttempt(context: Context, exerciseId: String) {
        val key = KEY_ATTEMPT_PREFIX + exerciseId
        val current = prefs(context).getInt(key, 0)
        prefs(context).edit().putInt(key, current + 1).apply()
    }

    fun revealNextHint(context: Context, exerciseId: String, maxHints: Int): Int {
        val key = KEY_HINT_PREFIX + exerciseId
        val next = (prefs(context).getInt(key, 0) + 1).coerceAtMost(maxHints)
        prefs(context).edit().putInt(key, next).apply()
        return next
    }

    fun getRevealedHintCount(context: Context, exerciseId: String): Int {
        return prefs(context).getInt(KEY_HINT_PREFIX + exerciseId, 0)
    }

    fun getLessonCompletedCount(context: Context, lessonId: Int): Int {
        return DigitalCourseWorkbook.getExercisesForLesson(lessonId)
            .count { isComplete(context, it.id) }
    }

    fun getLessonExerciseCount(lessonId: Int): Int {
        return DigitalCourseWorkbook.getExercisesForLesson(lessonId).size
    }

    private fun prefs(context: Context) =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
}

