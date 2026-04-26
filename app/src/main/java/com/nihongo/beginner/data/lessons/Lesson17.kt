package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson17 {
    val lesson = Lesson(
        id = 17,
        number = "שיעור 16",
        title = "עבר לשמות עצם: DESHITA",
        subtitle = "DESHITA (でした)",
        emoji = "📚",
        grammarPoints = listOf(
            GrammarPoint(
                title = "deshita (でした) - עבר חיובי לשמות עצם",
                content = "deshita = עבר של desu (חיוב).\nמשמשת עם שמות עצם לציון מצב בעבר.",
                pattern = "[נושא] wa [שם עצם] deshita"
            ),
            GrammarPoint(
                title = "janakatta desu (じゃなかったです) - עבר שלילי",
                content = "janakatta desu = עבר של janaidesu (שלילה).",
                pattern = "[נושא] wa [שם עצם] janakatta desu"
            ),
            GrammarPoint(
                title = "טבלת הטיות - שמות עצם",
                content = "הווה+: desu\nהווה-: janaidesu\nעבר+: deshita\nעבר-: janakatta desu"
            ),
            GrammarPoint(
                title = "סיכום מיליות (particles)",
                content = "は (wa) = נושא\nの (no) = שייכות (של)\nを (wo) = מושא\nに (ni) = זמן ספציפי / כיוון\nで (de) = מקום פעולה / אמצעי"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "おかあさん", romaji = "Okaasan", hebrew = "אמא", emoji = "👩", imageKeyword = "mother child embrace love warm"),
            VocabItem(japanese = "ともだち", romaji = "Tomodachi", hebrew = "חבר/ה", emoji = "👫", imageKeyword = "friends laughing happy together"),
            VocabItem(japanese = "サラダ", romaji = "Sarada", hebrew = "סלט", emoji = "🥗", imageKeyword = "salad fresh colorful bowl vegetables"),
            VocabItem(japanese = "ここ", romaji = "Koko", hebrew = "כאן", emoji = "📍", imageKeyword = "location pin map close"),
            VocabItem(japanese = "そこ", romaji = "Soko", hebrew = "שם (קרוב)", emoji = "📍", imageKeyword = "location marker nearby map pin"),
            VocabItem(japanese = "あそこ", romaji = "Asoko", hebrew = "שם (רחוק)", emoji = "🗺️", imageKeyword = "pointing distance horizon landmark")
        ),
        examples = listOf(
            Example(
                romaji = "Suzuki san wa sensei deshita.",
                japanese = "すずきさんはせんせいでした。",
                hebrew = "סוזוקי היה/תה מורה."
            ),
            Example(
                romaji = "Kore wa watashi no hon janakatta desu.",
                japanese = "これはわたしのほんじゃなかったです。",
                hebrew = "זה לא היה הספר שלי."
            ),
            Example(
                romaji = "Are wa nihon no eiga deshita.",
                japanese = "あれはにほんのえいがでした。",
                hebrew = "זה היה סרט יפני (שם)."
            ),
            Example(
                romaji = "Asagohan wa sarada janakatta desu yo!",
                japanese = "あさごはんはサラダじゃなかったですよ！",
                hebrew = "ארוחת הבוקר לא הייתה סלט!"
            ),
            Example(
                romaji = "Watashi wa gakusei deshita.",
                japanese = "わたしはがくせいでした。",
                hebrew = "הייתי תלמיד/ה."
            ),
            Example(
                romaji = "Koko wa resutoran janakatta desu.",
                japanese = "ここはレストランじゃなかったです。",
                hebrew = "כאן לא הייתה מסעדה."
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה העבר החיובי של 'desu'?",
                options = listOf("deshita", "janaidesu", "janakatta desu", "mashita"),
                correctIndex = 0,
                explanation = "desu = הווה חיובי — הסיומת משתנה לעבר"
            ),
            QuizQuestion(
                question = "'Suzuki san wa sensei deshita' פירושו:",
                options = listOf("סוזוקי הוא מורה", "סוזוקי לא היה/תה מורה", "סוזוקי היה/תה מורה", "האם סוזוקי מורה?"),
                correctIndex = 2,
                explanation = "deshita = עבר חיובי של desu"
            ),
            QuizQuestion(
                question = "מה העבר השלילי של 'janaidesu'?",
                options = listOf("masendeshita", "deshita", "janakatta desu", "janaidesu deshita"),
                correctIndex = 2,
                explanation = "janaidesu = הווה שלילי — בעבר הסיומת משתנה"
            ),
            QuizQuestion(
                question = "'Kore wa watashi no hon janakatta desu' פירושו:",
                options = listOf("זה הספר שלי", "זה לא הספר שלי (עכשיו)", "זה לא היה הספר שלי", "הספר שלי"),
                correctIndex = 2,
                explanation = "janakatta desu = לא היה/הייתה — עבר שלילי"
            ),
            QuizQuestion(
                question = "מה עושה 'wo' במשפט?",
                options = listOf("מציינת נושא", "מציינת שייכות", "מציינת מושא", "מציינת זמן"),
                correctIndex = 2,
                explanation = "wo (を) = חלקיק המושא הישיר"
            ),
            QuizQuestion(
                question = "מה עושה 'no' במשפט?",
                options = listOf("מציינת נושא", "מציינת שייכות (של)", "מציינת מושא", "מציינת כיוון"),
                correctIndex = 1,
                explanation = "no (の) = חלקיק השייכות — 'של'"
            ),
            QuizQuestion(
                question = "'wa' vs 'ga' - מה עושה 'wa'?",
                options = listOf("מציינת מושא", "מציינת שייכות", "מציינת נושא המשפט", "מציינת מקום"),
                correctIndex = 2,
                explanation = "wa = נושא המשפט הכללי; ga = נושא חדש/מודגש"
            ),
            QuizQuestion(
                question = "איזו מילית משמשת עם פעלי תנועה לציון יעד?",
                options = listOf("de", "wo", "no", "ni"),
                correctIndex = 3,
                explanation = "de = מקום הפעולה, ? = כיוון/יעד"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1033587388",
        practiceCards = listOf(
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "סוזוקי היה/תה מורה.",
                answer = "Suzuki san wa sensei deshita.",
                audioText = "Suzuki san wa sensei deshita",
                inputHint = "כתבו את המשפט בתעתיק..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "זה לא היה הספר שלי.",
                answer = "Kore wa watashi no hon janakatta desu.",
                audioText = "Kore wa watashi no hon janakatta desu",
                inputHint = "כתבו את המשפט בתעתיק..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "זה היה סרט יפני.",
                answer = "Are wa nihon no eiga deshita.",
                audioText = "Are wa nihon no eiga deshita",
                inputHint = "כתבו את המשפט בתעתיק..."
            ),
            PracticeCard(
                promptLabel = "הפכו לזמן עבר:",
                prompt = "Watashi wa gakusei desu.",
                answer = "Watashi wa gakusei deshita.",
                audioText = "Watashi wa gakusei deshita",
                inputHint = "כתבו את צורת העבר..."
            ),
            PracticeCard(
                promptLabel = "הפכו לעבר שלילי:",
                prompt = "Kore wa watashi no kaban desu.",
                answer = "Kore wa watashi no kaban janakatta desu.",
                audioText = "Kore wa watashi no kaban janakatta desu",
                inputHint = "כתבו את צורת העבר השלילי..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "ארוחת הבוקר לא הייתה סלט.",
                answer = "Asagohan wa sarada janakatta desu.",
                audioText = "Asagohan wa sarada janakatta desu",
                inputHint = "כתבו את המשפט בתעתיק..."
            )
        )
    )
}
