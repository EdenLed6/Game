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
            VocabItem(japanese = "ペン", romaji = "Pen", hebrew = "עט", emoji = "✏️", imageKeyword = "pen writing stationery"),
            VocabItem(japanese = "コーヒー", romaji = "Ko-hi-", hebrew = "קפה", emoji = "☕", imageKeyword = "coffee cup cafe latte"),
            VocabItem(japanese = "ほん", romaji = "Hon", hebrew = "ספר", emoji = "📖", imageKeyword = "open book reading library"),
            VocabItem(japanese = "スマホ", romaji = "Sumaho", hebrew = "טלפון חכם", emoji = "📱", imageKeyword = "smartphone screen modern"),
            VocabItem(japanese = "ノート", romaji = "No-to", hebrew = "מחברת", emoji = "📓", imageKeyword = "notebook spiral blank page"),
            VocabItem(japanese = "とけい", romaji = "Tokei", hebrew = "שעון", emoji = "⌚", imageKeyword = "wristwatch elegant time"),
            VocabItem(japanese = "かばん", romaji = "Kaban", hebrew = "תיק", emoji = "👜", imageKeyword = "leather shoulder bag"),
            VocabItem(japanese = "シャツ", romaji = "Shatsu", hebrew = "חולצה", emoji = "👕", imageKeyword = "shirt clothing folded")
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
                correctIndex = 1,
                explanation = "no (の) מקביל ל-'של' בעברית — אבל הסדר במשפט שונה"
            ),
            QuizQuestion(
                question = "איך אומרים 'עט של סוזוקי'?",
                options = listOf("pen no Suzuki san", "Suzuki san no pen", "Suzuki san pen no", "no pen Suzuki san"),
                correctIndex = 1,
                explanation = "ביפנית הבעלים בא לפני החפץ (הפוך מעברית)"
            ),
            QuizQuestion(
                question = "מה הסדר הנכון?",
                options = listOf("חפץ + no + בעלים", "בעלים + no + חפץ", "no + בעלים + חפץ", "חפץ + בעלים + no"),
                correctIndex = 1,
                explanation = "חשוב על 'pen of Suzuki' באנגלית — זה הסדר ביפנית"
            ),
            QuizQuestion(
                question = "'Kore wa watashi no sumaho desu' פירושו:",
                options = listOf("זה לא הטלפון שלי", "זה הטלפון שלך", "זה הטלפון שלי", "השאלה: האם זה הטלפון שלי?"),
                correctIndex = 2,
                explanation = "kore = זה (קרוב לדובר), watashi no = שלי"
            ),
            QuizQuestion(
                question = "איך אומרים 'מחברת של הונדה'?",
                options = listOf("no-to no Honda san", "Honda san no no-to", "Honda no-to san", "no Honda san to"),
                correctIndex = 1,
                explanation = "no-to = מחברת, Honda san = הבעלים — מה הסדר?"
            ),
            QuizQuestion(
                question = "'Sore wa Tanaka san no tokei janaidesu' פירושו:",
                options = listOf("זה השעון של טאנקה", "זה לא השעון של טאנקה", "האם זה השעון של טאנקה?", "השעון של טאנקה שם"),
                correctIndex = 1,
                explanation = "tokei = שעון, sore = זה (קרוב לשומע), janaidesu = שלילה"
            ),
            QuizQuestion(
                question = "מה ניתן לשלב אחרי '[בעלים] no [חפץ]'?",
                options = listOf("רק desu", "רק janaidesu", "גם desu וגם janaidesu", "שאלה בלבד"),
                correctIndex = 2,
                explanation = "no מציין שייכות — ניתן לחבר אחריו הן חיוב והן שלילה"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1032830077",
        practiceCards = listOf(
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "עט של מר סוזוקי",
                answer = "Suzuki san no pen",
                audioText = "Suzuki san no pen",
                inputHint = "כתבו את התעתיק היפני..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "זה הקפה שלי.",
                answer = "Kore wa watashi no ko-hi- desu.",
                audioText = "Kore wa watashi no ko-hi- desu",
                inputHint = "כתבו את המשפט בתעתיק..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "המחברת שלי",
                answer = "Watashi no no-to",
                audioText = "Watashi no no-to",
                inputHint = "כתבו את התעתיק היפני..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "הטלפון החכם שלך",
                answer = "Anata no sumaho",
                audioText = "Anata no sumaho",
                inputHint = "כתבו את התעתיק היפני..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "ספר של מר הונדה",
                answer = "Honda san no hon",
                audioText = "Honda san no hon",
                inputHint = "כתבו את התעתיק היפני..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "זה לא התיק של ריהי.",
                answer = "Sore wa Rihi san no kaban janaidesu.",
                audioText = "Sore wa Rihi san no kaban janaidesu",
                inputHint = "כתבו את המשפט בתעתיק..."
            )
        )
    )
}
