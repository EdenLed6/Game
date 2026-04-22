package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson06 {
    val lesson = Lesson(
        id = 6,
        number = "שיעור 6",
        title = "שייכות: NO",
        subtitle = "NO (の)",
        emoji = "📦",
        grammarPoints = listOf(
            GrammarPoint(
                title = "no (の) - שייכות",
                content = "no (の) = 'של' - מציין שייכות. הסדר הפוך מעברית (דומה ל-'s באנגלית).",
                pattern = "[בעלים] no [חפץ]"
            ),
            GrammarPoint(
                title = "שילוב עם desu / janaidesu",
                content = "ניתן לשלב no עם desu לבניית משפטים:\nKore wa [בעלים] no [חפץ] desu.\nניתן גם: Kore wa [בעלים] no [חפץ] janaidesu."
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "ペン", romaji = "Pen", hebrew = "עט", emoji = "✏️"),
            VocabItem(japanese = "コーヒー", romaji = "Ko-hi-", hebrew = "קפה", emoji = "☕"),
            VocabItem(japanese = "ほん", romaji = "Hon", hebrew = "ספר", emoji = "📖"),
            VocabItem(japanese = "スマホ", romaji = "Sumaho", hebrew = "טלפון חכם", emoji = "📱"),
            VocabItem(japanese = "ノート", romaji = "No-to", hebrew = "מחברת", emoji = "📓"),
            VocabItem(japanese = "とけい", romaji = "Tokei", hebrew = "שעון", emoji = "⌚"),
            VocabItem(japanese = "かばん", romaji = "Kaban", hebrew = "תיק", emoji = "👜"),
            VocabItem(japanese = "シャツ", romaji = "Shatsu", hebrew = "חולצה", emoji = "👕")
        ),
        examples = listOf(
            Example(
                romaji = "Suzuki san no pen",
                japanese = "すずきさんのペン",
                hebrew = "עט של מר סוזוקי"
            ),
            Example(
                romaji = "Honda san no no-to",
                japanese = "ほんださんのノート",
                hebrew = "מחברת של מר הונדה"
            ),
            Example(
                romaji = "Kore wa watashi no ko-hi- desu.",
                japanese = "これはわたしのコーヒーです。",
                hebrew = "זה הקפה שלי."
            ),
            Example(
                romaji = "Sore wa Rihi san no kaban janaidesu.",
                japanese = "それはりひさんのかばんじゃないです。",
                hebrew = "זה לא התיק של ריהי."
            ),
            Example(
                romaji = "Are wa watashi no nihongo no hon desu.",
                japanese = "あれはわたしのにほんごのほんです。",
                hebrew = "זה הספר יפנית שלי (שם)."
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה פירוש 'no' ביפנית?",
                options = listOf("לא", "של (שייכות)", "זה", "ה-"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "איך אומרים 'עט של סוזוקי'?",
                options = listOf("pen no Suzuki san", "Suzuki san no pen", "Suzuki san pen no", "no pen Suzuki san"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה הסדר הנכון?",
                options = listOf("חפץ + no + בעלים", "בעלים + no + חפץ", "no + בעלים + חפץ", "חפץ + בעלים + no"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Kore wa watashi no sumaho desu' פירושו:",
                options = listOf("זה לא הטלפון שלי", "זה הטלפון שלך", "זה הטלפון שלי", "השאלה: האם זה הטלפון שלי?"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "איך אומרים 'מחברת של הונדה'?",
                options = listOf("no-to no Honda san", "Honda san no no-to", "Honda no-to san", "no Honda san to"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Sore wa Tanaka san no tokei janaidesu' פירושו:",
                options = listOf("זה השעון של טאנקה", "זה לא השעון של טאנקה", "האם זה השעון של טאנקה?", "השעון של טאנקה שם"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה ניתן לשלב אחרי '[בעלים] no [חפץ]'?",
                options = listOf("רק desu", "רק janaidesu", "גם desu וגם janaidesu", "שאלה בלבד"),
                correctIndex = 2
            )
        )
    )
}
