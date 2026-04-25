package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson07 {
    val lesson = Lesson(
        id = 7,
        number = "שיעור 7",
        title = "KORE / SORE / ARE",
        subtitle = "これ・それ・あれ",
        emoji = "👈",
        grammarPoints = listOf(
            GrammarPoint(
                title = "שלושה סוגי 'זה' ביפנית",
                content = "ביפנית יש 3 מילים ל'זה', לפי מרחק:\n• kore (これ) = זה/זאת - קרוב לדובר\n• sore (それ) = זה/זאת - קרוב לשומע\n• are (あれ) = זה/זאת - רחוק משניהם"
            ),
            GrammarPoint(
                title = "ne (ね) ו-yo (よ) - סיומות",
                content = "ne (ね) = סיומת ריכוך, כמו 'נכון?' - מחפשת אישור\nyo (よ) = סיומת הדגשה, כמו '!' - הדגשת מידע"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "これ", romaji = "Kore", hebrew = "זה/זאת (קרוב לדובר)", emoji = "👈"),
            VocabItem(japanese = "それ", romaji = "Sore", hebrew = "זה/זאת (קרוב לשומע)", emoji = "👉"),
            VocabItem(japanese = "あれ", romaji = "Are", hebrew = "זה/זאת (רחוק משניהם)", emoji = "👀"),
            VocabItem(japanese = "ラーメン", romaji = "Ra-men", hebrew = "ראמן", emoji = "🍜", imageKeyword = "ramen bowl noodles japanese food"),
            VocabItem(japanese = "そば", romaji = "Soba", hebrew = "אטריות סובה", emoji = "🍝", imageKeyword = "soba noodles japanese bowl"),
            VocabItem(japanese = "にく", romaji = "Niku", hebrew = "בשר", emoji = "🥩", imageKeyword = "grilled steak meat bbq"),
            VocabItem(japanese = "おいしい", romaji = "Oishii", hebrew = "טעים", emoji = "😋", imageKeyword = "delicious food happy eating"),
            VocabItem(japanese = "ね", romaji = "Ne", hebrew = "נכון? (סיומת ריכוך)", emoji = "💭"),
            VocabItem(japanese = "よ", romaji = "Yo", hebrew = "! (סיומת הדגשה)", emoji = "❗")
        ),
        examples = listOf(
            Example(
                romaji = "A: Kore wa osoba desu ka?",
                japanese = "これはおそばですか？",
                hebrew = "A: האם זה סובה?"
            ),
            Example(
                romaji = "B: Iie, sore wa ra-men desu yo. Oishii desu yo!",
                japanese = "いいえ、それはラーメンですよ。おいしいですよ！",
                hebrew = "B: לא, זה ראמן! טעים מאוד!"
            ),
            Example(
                romaji = "A: Kore wa oniku desu ne.",
                japanese = "これはおにくですね。",
                hebrew = "A: זה בשר, נכון?"
            ),
            Example(
                romaji = "B: Hai, oniku desu.",
                japanese = "はい、おにくです。",
                hebrew = "B: כן, זה בשר."
            ),
            Example(
                romaji = "Are wa nan desu ka?",
                japanese = "あれはなんですか？",
                hebrew = "מה זה שם (רחוק)?"
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "'kore' פירושו?",
                options = listOf("זה - קרוב לשומע", "זה - רחוק משניהם", "זה - קרוב לדובר", "זה - באמצע"),
                correctIndex = 2,
                explanation = "kore, sore, are — שלושה מרחקים שונים ביחס לדובר ולשומע"
            ),
            QuizQuestion(
                question = "מה ההבדל בין 'sore' ל-'are'?",
                options = listOf("sore=קרוב לדובר, are=קרוב לשומע", "sore=קרוב לשומע, are=רחוק משניהם", "sore=רחוק, are=קרוב לדובר", "אין הבדל"),
                correctIndex = 1,
                explanation = "שלושת המרחקים: קרוב לדובר / קרוב לשומע / רחוק משניהם"
            ),
            QuizQuestion(
                question = "מה פירוש 'ne' בסוף משפט?",
                options = listOf("הדגשה !", "ספק", "חיפוש אישור - נכון?", "שאלה רשמית"),
                correctIndex = 2,
                explanation = "ne בסוף = הדובר מחפש אישור — כמו 'נכון?' בעברית"
            ),
            QuizQuestion(
                question = "'Oishii desu yo!' פירושו:",
                options = listOf("טעים, נכון?", "טעים! (הדגשה)", "לא טעים", "האם טעים?"),
                correctIndex = 1,
                explanation = "yo = הדגשה וביטחון עצמי של הדובר — לא שאלה"
            ),
            QuizQuestion(
                question = "אתה ושומע שלך עומדים ליד עוגה. מה תשתמש?",
                options = listOf("kore", "sore", "are", "kono"),
                correctIndex = 1,
                explanation = "sore = קרוב ל-? — אתה עומד מולו, מי קרוב לעוגה?"
            ),
            QuizQuestion(
                question = "מה פירוש 'Ra-men'?",
                options = listOf("סובה", "בשר", "ראמן", "טעים"),
                correctIndex = 2,
                explanation = "Ra-men הוא אוכל יפני קלאסי עם אטריות"
            ),
            QuizQuestion(
                question = "'Are wa niku desu ne' פירושו:",
                options = listOf("זה בשר, נכון? (רחוק)", "זה בשר! (קרוב)", "האם זה בשר?", "זה לא בשר"),
                correctIndex = 0,
                explanation = "are = רחוק משניהם, ne = חיפוש אישור"
            )
        )
    )
}
