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
    val exercises: List<QuizQuestion>
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
    val emoji: String = ""
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
