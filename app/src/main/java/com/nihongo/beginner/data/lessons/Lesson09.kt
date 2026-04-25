package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson09 {
    val lesson = Lesson(
        id = 9,
        number = "שיעור 8",
        title = "KONO / SONO / ANO",
        subtitle = "この・その・あの",
        emoji = "📍",
        grammarPoints = listOf(
            GrammarPoint(
                title = "kono/sono/ano - כמו kore/sore/are + שם עצם",
                content = "kono/sono/ano = כמו kore/sore/are אבל חייב לבוא אחריהם שם עצם.\nkono = 'ה...הזה/הזאת' (קרוב לדובר)\nsono = 'ה...ההוא/ההיא' (קרוב לשומע)\nano = 'ה...ההוא/ההיא' (רחוק משניהם)",
                pattern = "kono/sono/ano + [שם עצם] + wa ... desu"
            ),
            GrammarPoint(
                title = "en (円) - ין יפני",
                content = "en = ין יפני (מטבע). משתמשים עם מחירים. דוגמה: sen ni hyaku en = 1200 ין"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "スマホ", romaji = "Sumaho", hebrew = "טלפון חכם", emoji = "📱"),
            VocabItem(japanese = "カード", romaji = "Kaado", hebrew = "כרטיס אשראי", emoji = "💳", imageKeyword = "credit card payment wallet"),
            VocabItem(japanese = "とけい", romaji = "Tokei", hebrew = "שעון", emoji = "⌚"),
            VocabItem(japanese = "かさ", romaji = "Kasa", hebrew = "מטריה", emoji = "☂️", imageKeyword = "umbrella rain colorful"),
            VocabItem(japanese = "さいふ", romaji = "Saifu", hebrew = "ארנק", emoji = "👛", imageKeyword = "leather wallet open cards"),
            VocabItem(japanese = "かばん", romaji = "Kaban", hebrew = "תיק", emoji = "👜"),
            VocabItem(japanese = "くつ", romaji = "Kutsu", hebrew = "נעליים", emoji = "👟", imageKeyword = "sneakers shoes clean white"),
            VocabItem(japanese = "ぼうし", romaji = "Boushi", hebrew = "כובע", emoji = "🎩", imageKeyword = "stylish hat fashion"),
            VocabItem(japanese = "えん", romaji = "En", hebrew = "ין (מטבע יפני)", emoji = "💴", imageKeyword = "japanese yen coins currency")
        ),
        examples = listOf(
            Example(
                romaji = "Kono no-to wa hyaku en desu.",
                japanese = "このノートはひゃくえんです。",
                hebrew = "המחברת הזאת עולה 100 ין."
            ),
            Example(
                romaji = "Sono osoba wa oishii desu ka?",
                japanese = "そのおそばはおいしいですか？",
                hebrew = "האם הסובה ההיא טעים?"
            ),
            Example(
                romaji = "Ano nihonjin wa Suzuki san janaidesu.",
                japanese = "あのにほんじんはすずきさんじゃないです。",
                hebrew = "אותו יפני אינו סוזוקי."
            ),
            Example(
                romaji = "Kono boushi wa sen ni hyaku en desu.",
                japanese = "このぼうしはせんにひゃくえんです。",
                hebrew = "הכובע הזה עולה 1,200 ין."
            ),
            Example(
                romaji = "Sono kasa wa roppyaku hachi juu en desu.",
                japanese = "そのかさはろっぴゃくはちじゅうえんです。",
                hebrew = "המטריה ההיא עולה 680 ין."
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה ההבדל בין 'kore' ל-'kono'?",
                options = listOf("אין הבדל", "kono חייב לבוא לפני שם עצם, kore לא", "kore חייב לבוא לפני שם עצם, kono לא", "kono=קרוב, kore=רחוק"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Kono tokei wa...' פירושו:",
                options = listOf("השעון שם...", "השעון ההוא...", "השעון הזה...", "איזה שעון?"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "איך אומרים 'המטריה ההיא' (קרוב לשומע)?",
                options = listOf("kono kasa", "sono kasa", "ano kasa", "are kasa"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה פירוש 'En'?",
                options = listOf("ין יפני", "שעון", "כרטיס אשראי", "ארנק"),
                correctIndex = 0
            ),
            QuizQuestion(
                question = "'Ano saifu wa hassen en desu' פירושו:",
                options = listOf("הארנק הזה 8,000 ין", "הארנק ההוא (רחוק) 8,000 ין", "הארנק שלי 8,000 ין", "האם הארנק 8,000 ין?"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מתי משתמשים ב-'sono'?",
                options = listOf("קרוב לדובר", "רחוק משניהם", "קרוב לשומע", "כשאין שם עצם"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "'Kono kaban wa ni sen nana hyaku en desu' = כמה ין?",
                options = listOf("1,700", "2,700", "2,070", "27,000"),
                correctIndex = 1
            )
        )
    )
}
