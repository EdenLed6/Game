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
            VocabItem(japanese = "たべる (Taberu)", romaji = "Tabemasu / Tabemasen", hebrew = "לאכול", emoji = "🍽️", imageKeyword = "eating chopsticks japanese food"),
            VocabItem(japanese = "みる (Miru)", romaji = "Mimasu / Mimasen", hebrew = "לראות", emoji = "👀", imageKeyword = "watching television screen"),
            VocabItem(japanese = "おきる (Okiru)", romaji = "Okimasu / Okimasen", hebrew = "לקום", emoji = "🛏️", imageKeyword = "waking up morning bed sunrise"),
            VocabItem(japanese = "ねる (Neru)", romaji = "Nemasu / Nemasen", hebrew = "לישון", emoji = "😴", imageKeyword = "sleeping bed peaceful night"),
            VocabItem(japanese = "はなす (Hanasu)", romaji = "Hanashimasu / Hanashimasen", hebrew = "לדבר", emoji = "💬", imageKeyword = "talking conversation friends"),
            VocabItem(japanese = "きく (Kiku)", romaji = "Kikimasu / Kikimasen", hebrew = "לשמוע", emoji = "👂", imageKeyword = "listening headphones music"),
            VocabItem(japanese = "いく (Iku)", romaji = "Ikimasu / Ikimasen", hebrew = "ללכת", emoji = "🚶", imageKeyword = "walking path outdoor backpack"),
            VocabItem(japanese = "よむ (Yomu)", romaji = "Yomimasu / Yomimasen", hebrew = "לקרוא", emoji = "📖", imageKeyword = "reading book person relax"),
            VocabItem(japanese = "のむ (Nomu)", romaji = "Nomimasu / Nomimasen", hebrew = "לשתות", emoji = "🥤", imageKeyword = "drinking water glass refreshing"),
            VocabItem(japanese = "かえる (Kaeru)", romaji = "Kaerimasu / Kaerimasen", hebrew = "לחזור", emoji = "🏠", imageKeyword = "returning home front door house"),
            VocabItem(japanese = "する (Suru)", romaji = "Shimasu / Shimasen", hebrew = "לעשות (לא סדיר)", emoji = "✅", imageKeyword = "working hands creating activity"),
            VocabItem(japanese = "くる (Kuru)", romaji = "Kimasu / Kimasen", hebrew = "לבוא (לא סדיר)", emoji = "🚶", imageKeyword = "person walking approaching street"),
            VocabItem(japanese = "べんきょうする", romaji = "Benkyou shimasu / Benkyou shimasen", hebrew = "ללמוד", emoji = "📚", imageKeyword = "studying desk books lamp student")
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
                correctIndex = 1,
                explanation = "RU verb: מסירים -ru, מוסיפים -masu"
            ),
            QuizQuestion(
                question = "מה צורת ה-masu של 'Kiku'?",
                options = listOf("Kikumasu", "Kikimasu", "Kikusmasu", "Kiimasu"),
                correctIndex = 1,
                explanation = "U verb: תנועת הסיומת הופכת ל-i, מוסיפים -masu — ki+masu"
            ),
            QuizQuestion(
                question = "מה צורת השלילה של 'Tabemasu'?",
                options = listOf("Tabejanai", "Tabemasen", "Tabenai", "Tabemasuka"),
                correctIndex = 1,
                explanation = "שלילה של masu = -masen (לא -janai)"
            ),
            QuizQuestion(
                question = "מה צורת ה-masu של 'Suru' (לא סדיר)?",
                options = listOf("Surumasu", "Simasu", "Shimasu", "Surimasu"),
                correctIndex = 2,
                explanation = "suru לא סדיר — צורת ה-masu שלו ייחודית ואינה נגזרת מהרגיל"
            ),
            QuizQuestion(
                question = "'Watashi wa nemasu' פירושו:",
                options = listOf("אני ישן/ה", "אני קם/ה", "אני אוכל/ת", "אני שותה"),
                correctIndex = 0,
                explanation = "neru = לישון (RU verb), masu = הווה חיובי"
            ),
            QuizQuestion(
                question = "מה צורת ה-masu של 'Hanasu'?",
                options = listOf("Hanamasu", "Hanasumasu", "Hanashimasu", "Hanasimasu"),
                correctIndex = 2,
                explanation = "hanasu: su → shi + masu — שינוי פונטי ייחודי"
            ),
            QuizQuestion(
                question = "'Kikimasen' פירושו:",
                options = listOf("מקשיב/ה", "לא מקשיב/ה", "אשמע", "האם תשמע?"),
                correctIndex = 1,
                explanation = "masen = שלילת masu — kiki+masen"
            ),
            QuizQuestion(
                question = "מה צורת ה-masu של 'Kuru' (לא סדיר)?",
                options = listOf("Kurumasu", "Kimasu", "Kumasu", "Kirumasu"),
                correctIndex = 1,
                explanation = "kuru לא סדיר — התוצאה אינה kurumasu"
            ),
            QuizQuestion(
                question = "'Honda san wa nomimasu ka?' = ?",
                options = listOf("הונדה שותה", "האם הונדה שותה?", "הונדה לא שותה", "מה הונדה שותה?"),
                correctIndex = 1,
                explanation = "ka בסוף הופך כל משפט לשאלה"
            ),
            QuizQuestion(
                question = "מה צורת ה-masu של 'Kaeru'?",
                options = listOf("Kaemasu", "Kaerimasu", "Kaerumasu", "Kaemasu"),
                correctIndex = 1,
                explanation = "kaeru = RU verb: מסירים -ru, מוסיפים -masu"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1033824712"
    )
}
