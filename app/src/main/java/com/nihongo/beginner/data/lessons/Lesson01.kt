package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson01 {
    val lesson = Lesson(
        id = 1,
        number = "שיעור 1",
        title = "הגיה",
        subtitle = "Pronunciation",
        emoji = "🔤",
        grammarPoints = listOf(
            GrammarPoint(
                title = "יפנית: כללי הגייה",
                content = "יפנית היא שפה פשוטה מבחינת ההגייה. כל מילה חייבת להסתיים בתנועה (a, i, u, e, o) או בעיצור n. כל הברה היא: עיצור + תנועה (ka, ki, ku, ke, ko…)"
            ),
            GrammarPoint(
                title = "Japanglish: צלילים שאינם ביפנית",
                content = "ביפנית חסרים מספר צלילים, לכן מחליפים אותם:\n• V → B (vintage → binteji)\n• R → R יפני (robot → roboto)\n• L → R יפני (Israel → Isuraeru)\n• Si → Shi (Sivan → Shiban)\n• Zi → Ji (Ziva → Jiba)\n• Ci → Shi (cinema → shinema)"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "ビンテージ", romaji = "Binteji", hebrew = "Vintage", emoji = "👗", imageKeyword = "vintage clothing fashion"),
            VocabItem(japanese = "ロボット", romaji = "Roboto", hebrew = "Robot", emoji = "🤖", imageKeyword = "cute robot technology"),
            VocabItem(japanese = "イスラエル", romaji = "Isuraeru", hebrew = "ישראל", emoji = "🇮🇱", imageKeyword = "israel tel aviv"),
            VocabItem(japanese = "シネマ", romaji = "Shinema", hebrew = "Cinema", emoji = "🎬", imageKeyword = "cinema movie theater"),
            VocabItem(japanese = "ミルク", romaji = "Miruku", hebrew = "Milk", emoji = "🥛", imageKeyword = "milk glass fresh"),
            VocabItem(japanese = "インスタグラム", romaji = "Insutagurama", hebrew = "Instagram", emoji = "📸", imageKeyword = "smartphone social media"),
            VocabItem(japanese = "ラブ", romaji = "Rabu", hebrew = "Love", emoji = "❤️", imageKeyword = "love heart romantic"),
            VocabItem(japanese = "コンビニ", romaji = "Konbini", hebrew = "Convenience Store", emoji = "🏪", imageKeyword = "japan convenience store night")
        ),
        examples = listOf(
            Example(
                romaji = "V → B: vintage = binteji",
                hebrew = "הצליל V אינו קיים ביפנית → מחליפים ב-B"
            ),
            Example(
                romaji = "R / L → R יפני: robot = roboto, Israel = Isuraeru",
                hebrew = "R ו-L הופכים ל-R יפני"
            ),
            Example(
                romaji = "Si → Shi: Sivan = Shiban",
                hebrew = "הצליל Si אינו קיים → Shi"
            ),
            Example(
                romaji = "Zi → Ji: Ziva = Jiba",
                hebrew = "הצליל Zi אינו קיים → Ji"
            ),
            Example(
                romaji = "Konnichi-WA, Arigatou, Sayounara",
                hebrew = "כל הברה: עיצור + תנועה"
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "איך תיכתב המילה 'Vintage' ביפנית (Japanglish)?",
                options = listOf("Winteeji", "Binteji", "Vinteeji", "Finteeji"),
                correctIndex = 1,
                explanation = "V אינו קיים ביפנית — חשוב באיזה צליל מחליפים V"
            ),
            QuizQuestion(
                question = "איזה צליל אינו קיים ביפנית?",
                options = listOf("K", "V", "M", "N"),
                correctIndex = 1,
                explanation = "ביפנית K, M, N קיימים — V הוא צליל אנגלי שאין לו מקבילה ביפנית"
            ),
            QuizQuestion(
                question = "איך תיכתב 'Israel' ביפנית?",
                options = listOf("Isurael", "Izraeru", "Isuraeru", "Iserael"),
                correctIndex = 2,
                explanation = "L הופך ל-R יפני, ומוסיפים תנועה בין עיצורים סמוכים"
            ),
            QuizQuestion(
                question = "הצליל 'Si' מוחלף ביפנית ב...?",
                options = listOf("Zi", "Se", "Shi", "Chi"),
                correctIndex = 2,
                explanation = "Si הופך לצליל ש+i — חשוב על צליל ה-SH"
            ),
            QuizQuestion(
                question = "איך תיכתב 'Ziva' ביפנית?",
                options = listOf("Ziba", "Jiba", "Shiva", "Ziva"),
                correctIndex = 1,
                explanation = "Z → J ו-V → B — שני כללי Japanglish גם יחד"
            ),
            QuizQuestion(
                question = "במה מסתיימות כל המילים ביפנית?",
                options = listOf("עיצור", "תנועה או n", "תנועה בלבד", "n בלבד"),
                correctIndex = 1,
                explanation = "יש יוצא מן הכלל: עיצור אחד ספציפי מותר בסוף מילה"
            ),
            QuizQuestion(
                question = "איך תיכתב 'Love' ביפנית?",
                options = listOf("Lobu", "Rabu", "Ravu", "Lobu"),
                correctIndex = 1,
                explanation = "L → R ו-V → B — שתי החלפות ביחד"
            ),
            QuizQuestion(
                question = "איך תיכתב 'Cinema' ביפנית?",
                options = listOf("Sinema", "Chinema", "Shinema", "Kinema"),
                correctIndex = 2,
                explanation = "Ci מחליפים בדומה ל-Si → Shi — מה הצליל המקביל?"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1032805127"
    )
}
