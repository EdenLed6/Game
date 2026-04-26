package com.nihongo.beginner.data

data class Lesson(
    val id: Int,
    val number: String,
    val title: String,
    val subtitle: String,
    val emoji: String,
    val grammarPoints: List<GrammarPoint>,
    val vocabulary: List<VocabItem>,
    val examples: List<Example>,
    val exercises: List<QuizQuestion>,
    val videoUrl: String = "",
    val practiceCards: List<PracticeCard> = emptyList()
)

data class GrammarPoint(
    val title: String,
    val content: String,
    val pattern: String? = null
)

data class VocabItem(
    val japanese: String,
    val romaji: String,
    val hebrew: String,
    val emoji: String = "",
    val imageKeyword: String = ""
)

data class Example(
    val romaji: String,
    val japanese: String = "",
    val hebrew: String
)

data class QuizQuestion(
    val question: String,
    val options: List<String>,
    val correctIndex: Int,
    val explanation: String = ""
)

data class PracticeCard(
    val promptLabel: String,
    val prompt: String,
    val answer: String,
    val answerSub: String = "",
    val audioText: String = "",
    val inputHint: String = "כתבו את התשובה..."
)
