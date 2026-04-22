package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson11 {
    val lesson = Lesson(
        id = 11,
        number = "שיעורים 9-10",
        title = "צורת MASU",
        subtitle = "MASU Form",
        emoji = "✅",
        grammarPoints = listOf(
            GrammarPoint(
                title = "masu (ます) - הווה/עתיד פורמלי",
                content = "masu = סיומת פורמלית לפעלים בהווה ועתיד.\nמשמשת לדיבור פורמלי ומנומס.",
                pattern = "[נושא] wa [מושא] wo [פועל-masu]"
            ),
            GrammarPoint(
                title = "הטיית RU verbs",
                content = "פעלי RU: הורד 'ru', הוסף 'masu'",
                pattern = "Taberu → Tabe + masu = Tabemasu"
            ),
            GrammarPoint(
                title = "הטיית U verbs",
                content = "פעלי U: שנה 'u' → 'i', הוסף 'masu'",
                pattern = "Kiku → Kiki + masu = Kikimasu\nHanasu → Hanashi + masu = Hanashimasu"
            ),
            GrammarPoint(
                title = "פעלים לא סדירים",
                content = "Suru → Shimasu\nKuru → Kimasu\nBenkyou suru → Benkyou shimasu"
            ),
            GrammarPoint(
                title = "masen (ません) - שלילה",
                content = "להטיה שלילית: הורד 'masu', הוסף 'masen'",
                pattern = "Tabemasu → Tabemasen\nKikimasu → Kikimasen"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "たべる (Taberu)", romaji = "Tabemasu / Tabemasen", hebrew = "לאכול", emoji = "🍽️"),
            VocabItem(japanese = "みる (Miru)", romaji = "Mimasu / Mimasen", hebrew = "לראות", emoji = "👀"),
            VocabItem(japanese = "おきる (Okiru)", romaji = "Okimasu / Okimasen", hebrew = "לקום", emoji = "🛏️"),
            VocabItem(japanese = "ねる (Neru)", romaji = "Nemasu / Nemasen", hebrew = "לישון", emoji = "😴"),
            VocabItem(japanese = "はなす (Hanasu)", romaji = "Hanashimasu / Hanashimasen", hebrew = "לדבר", emoji = "💬"),
            VocabItem(japanese = "きく (Kiku)", romaji = "Kikimasu / Kikimasen", hebrew = "לשמוע", emoji = "👂"),
            VocabItem(japanese = "いく (Iku)", romaji = "Ikimasu / Ikimasen", hebrew = "ללכת", emoji = "🚶"),
            VocabItem(japanese = "よむ (Yomu)", romaji = "Yomimasu / Yomimasen", hebrew = "לקרוא", emoji = "📖"),
            VocabItem(japanese = "のむ (Nomu)", romaji = "Nomimasu / Nomimasen", hebrew = "לשתות", emoji = "🥤"),
            VocabItem(japanese = "かえる (Kaeru)", romaji = "Kaerimasu / Kaerimasen", hebrew = "לחזור", emoji = "🏠"),
            VocabItem(japanese = "する (Suru)", romaji = "Shimasu / Shimasen", hebrew = "לעשות (לא סדיר)", emoji = "✅"),
            VocabItem(japanese = "くる (Kuru)", romaji = "Kimasu / Kimasen", hebrew = "לבוא (לא סדיר)", emoji = "🚶"),
            VocabItem(japanese = "べんきょうする", romaji = "Benkyou shimasu / Benkyou shimasen", hebrew = "ללמוד", emoji = "📚")
        ),
        examples = listOf(
            Example(
                romaji = "Watashi wa tabemasu.",
                japanese = "わたしはたべます。",
                hebrew = "אני אוכל/ת."
            ),
            Example(
                romaji = "Honda san wa nomimasu.",
                japanese = "ほんださんはのみます。",
                hebrew = "מר הונדה שותה."
            ),
            Example(
                romaji = "Nihonjin wa benkyou shimasu.",
                japanese = "にほんじんはべんきょうします。",
                hebrew = "היפני/ת לומד/ת."
            ),
            Example(
                romaji = "Suzuki san wa kikimasen.",
                japanese = "すずきさんはききません。",
                hebrew = "סוזוקי לא מקשיב/ה."
            ),
            Example(
                romaji = "Honda san wa sakana wo tabemasuka?",
                japanese = "ほんださんはさかなをたべますか？",
                hebrew = "האם הונדה אוכל/ת דגים?"
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה צורת ה-masu של 'Taberu'?",
                options = listOf("Taberimasu", "Tabemasu", "Taberumasu", "Tabimasu"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה צורת ה-masu של 'Kiku'?",
                options = listOf("Kikumasu", "Kikimasu", "Kikusmasu", "Kiimasu"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה צורת השלילה של 'Tabemasu'?",
                options = listOf("Tabejanai", "Tabemasen", "Tabenai", "Tabemasuka"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה צורת ה-masu של 'Suru' (לא סדיר)?",
                options = listOf("Surumasu", "Simasu", "Shimasu", "Surimasu"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "'Watashi wa nemasu' פירושו:",
                options = listOf("אני ישן/ה", "אני קם/ה", "אני אוכל/ת", "אני שותה"),
                correctIndex = 0
            ),
            QuizQuestion(
                question = "מה צורת ה-masu של 'Hanasu'?",
                options = listOf("Hanamasu", "Hanasumasu", "Hanashimasu", "Hanasimasu"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "'Kikimasen' פירושו:",
                options = listOf("מקשיב/ה", "לא מקשיב/ה", "אשמע", "האם תשמע?"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה צורת ה-masu של 'Kuru' (לא סדיר)?",
                options = listOf("Kurumasu", "Kimasu", "Kumasu", "Kirumasu"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Honda san wa nomimasu ka?' = ?",
                options = listOf("הונדה שותה", "האם הונדה שותה?", "הונדה לא שותה", "מה הונדה שותה?"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה צורת ה-masu של 'Kaeru'?",
                options = listOf("Kaemasu", "Kaerimasu", "Kaerumasu", "Kaemasu"),
                correctIndex = 1
            )
        )
    )
}
