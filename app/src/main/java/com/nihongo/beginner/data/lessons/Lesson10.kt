package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson10 {
    val lesson = Lesson(
        id = 10,
        number = "שיעור 9",
        title = "פעלים: אוצר מילים",
        subtitle = "Verbs Vocabulary",
        emoji = "🏃",
        grammarPoints = listOf(
            GrammarPoint(
                title = "שתי קבוצות פעלים",
                content = "ביפנית יש שתי קבוצות עיקריות:\n• פעלי RU (Group 2): מסתיימים ב-ru\n  דוגמאות: Taberu, Miru, Neru, Okiru\n• פעלי U (Group 1): מסתיימים ב-u אחרת\n  דוגמאות: Kiku, Iku, Yomu, Nomu, Kaeru, Hanasu"
            ),
            GrammarPoint(
                title = "פעלים לא סדירים",
                content = "שני פעלים לא סדירים:\n• Suru (する) = לעשות → Shimasu\n• Kuru (くる) = לבוא → Kimasu\nצורת המילון (dictionary form) = הצורה הבסיסית"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "たべる", romaji = "Taberu", hebrew = "לאכול", emoji = "🍽️"),
            VocabItem(japanese = "みる", romaji = "Miru", hebrew = "לראות / לצפות", emoji = "👀"),
            VocabItem(japanese = "おきる", romaji = "Okiru", hebrew = "לקום", emoji = "🛏️"),
            VocabItem(japanese = "ねる", romaji = "Neru", hebrew = "לישון", emoji = "😴"),
            VocabItem(japanese = "はなす", romaji = "Hanasu", hebrew = "לדבר", emoji = "💬"),
            VocabItem(japanese = "きく", romaji = "Kiku", hebrew = "לשמוע / להקשיב", emoji = "👂"),
            VocabItem(japanese = "いく", romaji = "Iku", hebrew = "ללכת / לנסוע", emoji = "🚶"),
            VocabItem(japanese = "よむ", romaji = "Yomu", hebrew = "לקרוא", emoji = "📖"),
            VocabItem(japanese = "のむ", romaji = "Nomu", hebrew = "לשתות", emoji = "🥤"),
            VocabItem(japanese = "かえる", romaji = "Kaeru", hebrew = "לחזור", emoji = "🏠"),
            VocabItem(japanese = "する", romaji = "Suru", hebrew = "לעשות (לא סדיר)", emoji = "✅"),
            VocabItem(japanese = "くる", romaji = "Kuru", hebrew = "לבוא (לא סדיר)", emoji = "🚶"),
            VocabItem(japanese = "べんきょうする", romaji = "Benkyou suru", hebrew = "ללמוד", emoji = "📚")
        ),
        examples = listOf(
            Example(
                romaji = "Taberu = לאכול (RU verb)",
                hebrew = "RU verb: הורד ru, הוסף masu = Tabemasu"
            ),
            Example(
                romaji = "Kiku = לשמוע (U verb)",
                hebrew = "U verb: שנה u→i, הוסף masu = Kikimasu"
            ),
            Example(
                romaji = "Suru → Shimasu (irregular!)",
                hebrew = "לא סדיר: לעשות → עושה"
            ),
            Example(
                romaji = "Kuru → Kimasu (irregular!)",
                hebrew = "לא סדיר: לבוא → בא/ה"
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "'Taberu' שייך לאיזו קבוצה?",
                options = listOf("U verb", "RU verb", "לא סדיר", "Group 3"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה פירוש 'Nomu'?",
                options = listOf("לאכול", "לשתות", "לישון", "לקרוא"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Suru' הוא...",
                options = listOf("RU verb", "U verb", "פועל לא סדיר", "Group 1"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "מה פירוש 'Kaeru'?",
                options = listOf("לבוא", "ללכת", "לחזור", "לקום"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "'Kiku' שייך לאיזו קבוצה?",
                options = listOf("RU verb", "U verb", "לא סדיר", "אף אחד"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה פירוש 'Okiru'?",
                options = listOf("לישון", "לקום", "לדבר", "לקרוא"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Miru' = ?",
                options = listOf("לשמוע", "לדבר", "לראות/לצפות", "לקרוא"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "'Kuru' הוא פועל לא סדיר. מה צורת ה-masu שלו?",
                options = listOf("Kurumasu", "Shimasu", "Kimasu", "Kurimas"),
                correctIndex = 2
            )
        )
    )
}
