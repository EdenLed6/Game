package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson08 {
    val lesson = Lesson(
        id = 8,
        number = "בונוס",
        title = "מספרים",
        subtitle = "Numbers",
        emoji = "🔢",
        grammarPoints = listOf(
            GrammarPoint(
                title = "מספרים 0–10",
                content = "0: zero/rei\n1: ichi\n2: ni\n3: san\n4: yon/shi\n5: go\n6: roku\n7: nana/shichi\n8: hachi\n9: kyuu\n10: juu"
            ),
            GrammarPoint(
                title = "מספרים 11–99",
                content = "11–19: juu + ספרה (juu ichi, juu ni, juu san...)\n20–90: ספרה + juu (ni juu, san juu, yon juu, go juu, roku juu, nana juu, hachi juu, kyuu juu)\nדוגמה: 56 = go juu roku"
            ),
            GrammarPoint(
                title = "מאות",
                content = "100: hyaku\n200: ni hyaku\n300: *san byaku (לא סדיר!)\n400: yon hyaku\n500: go hyaku\n600: *roppyaku (לא סדיר!)\n700: nana hyaku\n800: *happyaku (לא סדיר!)\n900: kyuu hyaku"
            ),
            GrammarPoint(
                title = "אלפים",
                content = "1000: sen\n2000: ni sen\n3000: *san zen (לא סדיר!)\n4000: yon sen\n5000: go sen\n6000: roku sen\n7000: nana sen\n8000: *hassen (לא סדיר!)\n9000: kyuu sen\n* = צורה לא סדירה - לשים לב!"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "ゼロ/れい", romaji = "Zero / Rei", hebrew = "0", emoji = "0️⃣"),
            VocabItem(japanese = "いち", romaji = "Ichi", hebrew = "1", emoji = "1️⃣"),
            VocabItem(japanese = "に", romaji = "Ni", hebrew = "2", emoji = "2️⃣"),
            VocabItem(japanese = "さん", romaji = "San", hebrew = "3", emoji = "3️⃣"),
            VocabItem(japanese = "よん/し", romaji = "Yon / Shi", hebrew = "4", emoji = "4️⃣"),
            VocabItem(japanese = "ご", romaji = "Go", hebrew = "5", emoji = "5️⃣"),
            VocabItem(japanese = "ろく", romaji = "Roku", hebrew = "6", emoji = "6️⃣"),
            VocabItem(japanese = "なな/しち", romaji = "Nana / Shichi", hebrew = "7", emoji = "7️⃣"),
            VocabItem(japanese = "はち", romaji = "Hachi", hebrew = "8", emoji = "8️⃣"),
            VocabItem(japanese = "きゅう", romaji = "Kyuu", hebrew = "9", emoji = "9️⃣"),
            VocabItem(japanese = "じゅう", romaji = "Juu", hebrew = "10", emoji = "🔟"),
            VocabItem(japanese = "ひゃく", romaji = "Hyaku", hebrew = "100", emoji = "💯"),
            VocabItem(japanese = "せん", romaji = "Sen", hebrew = "1000", emoji = "💴")
        ),
        examples = listOf(
            Example(
                romaji = "8 = hachi",
                japanese = "8 = はち",
                hebrew = "8 = hachi"
            ),
            Example(
                romaji = "17 = juu nana",
                japanese = "17 = じゅうなな",
                hebrew = "17 = juu nana"
            ),
            Example(
                romaji = "56 = go juu roku",
                japanese = "56 = ごじゅうろく",
                hebrew = "56 = go juu roku"
            ),
            Example(
                romaji = "300 = san byaku (*לא סדיר)",
                japanese = "300 = さんびゃく",
                hebrew = "300 = san byaku (צורה לא סדירה!)"
            ),
            Example(
                romaji = "689 = roppyaku hachi juu kyuu (*לא סדיר)",
                japanese = "689 = ろっぴゃくはちじゅうきゅう",
                hebrew = "689 = roppyaku hachi juu kyuu"
            ),
            Example(
                romaji = "1995 = sen kyuu hyaku kyuu juu go",
                japanese = "1995 = せんきゅうひゃくきゅうじゅうご",
                hebrew = "1995 = sen kyuu hyaku kyuu juu go"
            ),
            Example(
                romaji = "8000 = hassen (*לא סדיר)",
                japanese = "8000 = はっせん",
                hebrew = "8000 = hassen (צורה לא סדירה!)"
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה קוראים למספר 7?",
                options = listOf("roku", "nana", "hachi", "kyuu"),
                correctIndex = 1,
                explanation = "ל-7 יש שתי דרכי קריאה ביפנית: shichi ו-nana"
            ),
            QuizQuestion(
                question = "כיצד אומרים 17?",
                options = listOf("nana juu", "juu nana", "juu shichi", "nana ichi"),
                correctIndex = 1,
                explanation = "עשרות = juu, אחר כך היחידות — juu + ?"
            ),
            QuizQuestion(
                question = "איך אומרים 300?",
                options = listOf("san hyaku", "sanbyaku", "san byaku", "son byaku"),
                correctIndex = 2,
                explanation = "sanbyaku — ה-hyaku משתנה בצירוף מסוים"
            ),
            QuizQuestion(
                question = "מה הצורה הלא סדירה של 600?",
                options = listOf("roku hyaku", "roppyaku", "rokku hyaku", "roku pyaku"),
                correctIndex = 1,
                explanation = "600, 300 ו-800 הן צורות מיוחדות — לא 'roku hyaku' הרגיל"
            ),
            QuizQuestion(
                question = "איך אומרים 8000?",
                options = listOf("hachi sen", "hassen", "hatchi sen", "hassenn"),
                correctIndex = 1,
                explanation = "hassen — לא 'hachi sen' — זו צורה לא סדירה"
            ),
            QuizQuestion(
                question = "'go juu roku' שווה למספר:",
                options = listOf("56", "65", "506", "560"),
                correctIndex = 0,
                explanation = "go=5, juu=10, roku=6 — 5×10+6=?"
            ),
            QuizQuestion(
                question = "איך אומרים 1995?",
                options = listOf("ichi kyuu kyuu go", "sen kyuu hyaku kyuu juu go", "sen kyuu juu go", "kyuu hyaku kyuu juu go"),
                correctIndex = 1,
                explanation = "sen=1000, kyuu hyaku=900, kyuu juu=90, go=5"
            ),
            QuizQuestion(
                question = "מה קוראים ל-4?",
                options = listOf("shi בלבד", "yon בלבד", "yon או shi", "ichi"),
                correctIndex = 2,
                explanation = "ל-4 יש שתי קריאות — אחת יפנית-מקורית ואחת סינית-יפנית"
            ),
            QuizQuestion(
                question = "איך אומרים 3000?",
                options = listOf("san sen", "sanzen", "san zen", "sensen"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "'hachi juu kyuu' שווה למספר:",
                options = listOf("89", "98", "809", "980"),
                correctIndex = 0
            )
        )
    )
}
