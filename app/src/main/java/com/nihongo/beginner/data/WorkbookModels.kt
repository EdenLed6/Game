package com.nihongo.beginner.data

enum class WorkbookExerciseType {
    TYPED_ANSWER,
    FILL_BLANK,
    IMAGE_MATCH,
    TEXT_MATCH,
    SENTENCE_ORDER,
    DIALOGUE_COMPLETE,
    FREE_WRITING,
    LISTENING,
    PAGE_NOTES
}

data class WorkbookSection(
    val id: String,
    val lessonId: Int,
    val title: String,
    val pageRange: String,
    val exercises: List<WorkbookExercise>
)

data class WorkbookExercise(
    val id: String,
    val lessonId: Int,
    val pageNumber: Int,
    val title: String,
    val type: WorkbookExerciseType,
    val prompt: String,
    val referenceText: String,
    val japaneseToSpeak: String = "",
    val hints: List<ExerciseHint> = emptyList(),
    val expectedAnswers: List<String> = emptyList(),
    val options: List<String> = emptyList(),
    val maxAnswerLength: Int = 800
)

data class ExerciseHint(
    val text: String
)

