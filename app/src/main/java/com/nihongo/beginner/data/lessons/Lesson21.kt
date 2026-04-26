package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson21 {
    val lesson = Lesson(
        id = 21,
        number = "מטיילים 4",
        title = "בקשה והזמנה",
        subtitle = "アレルギーと注文",
        emoji = "🙏",
        grammarPoints = listOf(
            GrammarPoint(
                title = "הצהרת אלרגיה — アレルギーです",
                content = "חשוב מאוד: כיצד להצהיר על אלרגיה במסעדה.\n[מזון] + アレルギーです",
                pattern = "えびアレルギーです。(Ebi arerugii desu — יש לי אלרגיה לשרימפס)"
            ),
            GrammarPoint(
                title = "לא יכול לאכול — が食べられません",
                content = "צורת אי-יכולת לאכול מזון מסוים.\n[מזון] + が + 食べられません",
                pattern = "ぶたにく が たべられません。(Butaniku ga taberaremasen — לא יכול לאכול חזיר)"
            ),
            GrammarPoint(
                title = "בקשת הדגמה — てください",
                content = "בקשה מנומסת:\nみせてください (misete kudasai) = הראה לי\nかいてください (kaite kudasai) = כתוב לי",
                pattern = "[פועל] + てください"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "アレルギー", romaji = "Arerugii", hebrew = "אלרגיה", emoji = "⚠️", imageKeyword = "allergy warning sign food"),
            VocabItem(japanese = "たべられません", romaji = "Taberaremasen", hebrew = "לא יכול לאכול", emoji = "🚫", imageKeyword = "no food prohibited sign"),
            VocabItem(japanese = "ぶたにく", romaji = "Butaniku", hebrew = "בשר חזיר", emoji = "🐷", imageKeyword = "pork meat pig"),
            VocabItem(japanese = "ぎゅうにく", romaji = "Gyuuniku", hebrew = "בשר בקר", emoji = "🥩", imageKeyword = "beef steak meat red"),
            VocabItem(japanese = "さかな", romaji = "Sakana", hebrew = "דג", emoji = "🐟", imageKeyword = "fish seafood ocean"),
            VocabItem(japanese = "えび", romaji = "Ebi", hebrew = "שרימפס", emoji = "🦐", imageKeyword = "shrimp prawn seafood"),
            VocabItem(japanese = "たまご", romaji = "Tamago", hebrew = "ביצה", emoji = "🥚", imageKeyword = "egg white yellow"),
            VocabItem(japanese = "ちゅうもん", romaji = "Chuumon", hebrew = "הזמנה", emoji = "📝", imageKeyword = "order food notepad waiter"),
            VocabItem(japanese = "みせてください", romaji = "Misete kudasai", hebrew = "הראה לי", emoji = "👁️", imageKeyword = "show display point gesture"),
            VocabItem(japanese = "にゅうさんぶつ", romaji = "Nyuusanbutsu", hebrew = "מוצרי חלב", emoji = "🧀", imageKeyword = "dairy milk cheese butter")
        ),
        examples = listOf(
            Example(romaji = "Tamago arerugii desu.", japanese = "たまごアレルギーです。", hebrew = "יש לי אלרגיה לביצים."),
            Example(romaji = "Butaniku ga taberaremasen.", japanese = "ぶたにくがたべられません。", hebrew = "אני לא יכול/ה לאכול בשר חזיר."),
            Example(romaji = "Sakana ga taberaremasen.", japanese = "さかながたべられません。", hebrew = "אני לא יכול/ה לאכול דג."),
            Example(romaji = "Kore wa nani desu ka?", japanese = "これはなんですか？", hebrew = "מה זה?"),
            Example(romaji = "Menyu wo misete kudasai.", japanese = "メニューをみせてください。", hebrew = "הראה לי את התפריט בבקשה."),
            Example(romaji = "Ebi wa haitte imasu ka?", japanese = "えびははいっていますか？", hebrew = "האם יש שרימפס בזה?")
        ),
        exercises = listOf(
            QuizQuestion(
                question = "כיצד מצהירים על אלרגיה לביצים?",
                options = listOf("たまごがすきじゃない", "たまごアレルギーです", "たまごをください", "たまごがあります"),
                correctIndex = 1,
                explanation = "[מזון] + アレルギーです = יש לי אלרגיה ל... זו הצורה הסטנדרטית במסעדות"
            ),
            QuizQuestion(
                question = "מה פירוש たべられません?",
                options = listOf("אני לא אוהב/ת לאכול", "אני לא יכול/ה לאכול", "אני לא רוצה לאכול", "אין מה לאכול"),
                correctIndex = 1,
                explanation = "食べられません = צורת שלילה של יכולת. חשוב להבדיל: 'לא רוצה' vs 'לא יכול' (מגבלה/אלרגיה)"
            ),
            QuizQuestion(
                question = "מה פירוש ぶたにく?",
                options = listOf("בשר בקר", "עוף", "בשר חזיר", "דג"),
                correctIndex = 2,
                explanation = "ぶた (buta) = חזיר, にく (niku) = בשר. שילוב: ぶたにく = בשר חזיר"
            ),
            QuizQuestion(
                question = "כיצד שואלים 'האם יש שרימפס בזה'?",
                options = listOf("えびをください", "えびアレルギーです", "えびははいっていますか", "えびがすきです"),
                correctIndex = 2,
                explanation = "はいっていますか = האם נכלל בפנים? שימושי לבדיקת רכיבים במנה"
            ),
            QuizQuestion(
                question = "מה פירוש みせてください?",
                options = listOf("תן לי בבקשה", "הראה לי בבקשה", "עזור לי בבקשה", "כתוב לי בבקשה"),
                correctIndex = 1,
                explanation = "みせて = צורת て של 見せる (להראות) + ください = בקשה מנומסת"
            ),
            QuizQuestion(
                question = "מה ההבדל בין ぎゅうにく לבין ぶたにく?",
                options = listOf("שניהם אותו הדבר", "ぎゅうにく = חזיר, ぶたにく = בקר", "ぎゅうにく = בקר, ぶたにく = חזיר", "ぎゅうにく = עוף, ぶたにく = דג"),
                correctIndex = 2,
                explanation = "ぎゅう (gyuu) = פרה/בקר, ぶた (buta) = חזיר — חשוב למי שמגביל סוגי בשר"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1012066739",
        practiceCards = listOf(
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "יש לי אלרגיה לביצים.",
                answer = "Tamago arerugii desu.",
                audioText = "Tamago arerugii desu",
                inputHint = "כתבו את המשפט בתעתיק..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "אני לא יכול/ה לאכול בשר חזיר.",
                answer = "Butaniku ga taberaremasen.",
                audioText = "Butaniku ga taberaremasen",
                inputHint = "כתבו את המשפט בתעתיק..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "הראה לי את התפריט בבקשה.",
                answer = "Menyu wo misete kudasai.",
                audioText = "Menyu wo misete kudasai",
                inputHint = "כתבו את המשפט בתעתיק..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "האם יש שרימפס בזה?",
                answer = "Ebi wa haitte imasu ka?",
                audioText = "Ebi wa haitte imasu ka",
                inputHint = "כתבו את המשפט בתעתיק..."
            ),
            PracticeCard(
                promptLabel = "כיצד אומרים ביפנית?",
                prompt = "לא יכול לאכול",
                answer = "Taberaremasen",
                audioText = "Taberaremasen",
                inputHint = "כתבו את התעתיק היפני..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "אני לא יכול/ה לאכול דג.",
                answer = "Sakana ga taberaremasen.",
                audioText = "Sakana ga taberaremasen",
                inputHint = "כתבו את המשפט בתעתיק..."
            )
        )
    )
}
