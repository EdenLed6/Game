package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson22 {
    val lesson = Lesson(
        id = 22,
        number = "מטיילים 5",
        title = "תארים",
        subtitle = "けいようし (Keiyooshi)",
        emoji = "✨",
        grammarPoints = listOf(
            GrammarPoint(
                title = "תארי-i (i-adjectives) — い形容詞",
                content = "מסתיימים ב-い. בשלילה מחליפים い ב-くない.\nדוגמה: おいしい (oishii/טעים) → おいしくない (oishikunai/לא טעים)",
                pattern = "[adj-i] ← い → くない = שלילה"
            ),
            GrammarPoint(
                title = "תארי-na (na-adjectives) — な形容詞",
                content = "לא מסתיימים ב-い (בדרך כלל). בשלילה: [adj] + じゃない.\nדוגמה: きれい (kirei/יפה) → きれいじゃない",
                pattern = "[adj-na] + じゃない = שלילה"
            ),
            GrammarPoint(
                title = "תיאור שם עצם",
                content = "i-adj: לפני שם עצם כמות שהוא.\nna-adj: מוסיפים な לפני שם העצם.\nדוגמה: おいしいりょうり (אוכל טעים), きれいなまち (עיר יפה)",
                pattern = "[i-adj] + noun / [na-adj] + な + noun"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "おいしい", romaji = "Oishii", hebrew = "טעים", emoji = "😋", imageKeyword = "delicious food yummy taste"),
            VocabItem(japanese = "かわいい", romaji = "Kawaii", hebrew = "חמוד/מתוק", emoji = "🥰", imageKeyword = "cute adorable kawaii sweet"),
            VocabItem(japanese = "すごい", romaji = "Sugoi", hebrew = "מדהים/וואו", emoji = "🤩", imageKeyword = "amazing wow spectacular incredible"),
            VocabItem(japanese = "おもしろい", romaji = "Omoshiroi", hebrew = "מעניין/מצחיק", emoji = "😄", imageKeyword = "interesting funny amusing"),
            VocabItem(japanese = "おおきい", romaji = "Ookii", hebrew = "גדול", emoji = "🔝", imageKeyword = "big large size tall"),
            VocabItem(japanese = "ちいさい", romaji = "Chiisai", hebrew = "קטן", emoji = "🔻", imageKeyword = "small tiny little mini"),
            VocabItem(japanese = "あつい", romaji = "Atsui", hebrew = "חם (מזג אוויר/מגע)", emoji = "🌡️", imageKeyword = "hot temperature summer heat"),
            VocabItem(japanese = "さむい", romaji = "Samui", hebrew = "קר (מזג אוויר)", emoji = "🥶", imageKeyword = "cold winter freezing snow"),
            VocabItem(japanese = "きれい", romaji = "Kirei", hebrew = "יפה / נקי", emoji = "🌸", imageKeyword = "beautiful clean pretty flowers"),
            VocabItem(japanese = "たのしい", romaji = "Tanoshii", hebrew = "כיפי / שמח", emoji = "🎉", imageKeyword = "fun enjoyable happy party"),
            VocabItem(japanese = "ちかい", romaji = "Chikai", hebrew = "קרוב", emoji = "📍", imageKeyword = "nearby close distance small"),
            VocabItem(japanese = "とおい", romaji = "Tooi", hebrew = "רחוק", emoji = "🗺️", imageKeyword = "far distance remote horizon")
        ),
        examples = listOf(
            Example(romaji = "Kono ryouri wa oishii desu.", japanese = "このりょうりはおいしいです。", hebrew = "האוכל הזה טעים."),
            Example(romaji = "Oishikunai desu.", japanese = "おいしくないです。", hebrew = "זה לא טעים."),
            Example(romaji = "Neko ga kawaii desu.", japanese = "ねこがかわいいです。", hebrew = "החתול חמוד."),
            Example(romaji = "Kirei na machi desu.", japanese = "きれいなまちです。", hebrew = "זו עיר יפה."),
            Example(romaji = "Kyou wa atsui desu ne.", japanese = "きょうはあついですね。", hebrew = "היום חם, נכון?"),
            Example(romaji = "Eki wa tooi desu ka?", japanese = "えきはとおいですか？", hebrew = "האם התחנה רחוקה?")
        ),
        exercises = listOf(
            QuizQuestion(
                question = "כיצד הופכים おいしい (טעים) לשלילה?",
                options = listOf("おいしいじゃない", "おいしくない", "おいしくじゃない", "おいしくないじゃ"),
                correctIndex = 1,
                explanation = "תארי-i: מחליפים את ה-い בסוף ב-くない. לכן: おいしい → おいしくない"
            ),
            QuizQuestion(
                question = "כיצד הופכים きれい (יפה) לשלילה?",
                options = listOf("きれいくない", "きれいじゃない", "きれいない", "きれくない"),
                correctIndex = 1,
                explanation = "きれい הוא תאר-na למרות שנגמר ב-い. לכן שלילה: きれいじゃない ולא くない"
            ),
            QuizQuestion(
                question = "מה פירוש すごい?",
                options = listOf("חמוד", "מדהים/וואו", "מצחיק", "יפה"),
                correctIndex = 1,
                explanation = "すごい (sugoi) = מדהים, וואו, מרשים — ביטוי של התפעלות גדולה"
            ),
            QuizQuestion(
                question = "כיצד אומרים 'עיר יפה' — תאר לפני שם עצם?",
                options = listOf("きれいまち", "きれいなまち", "きれくまち", "まちきれい"),
                correctIndex = 1,
                explanation = "תאר-na לפני שם עצם: [adj] + な + [noun]. לכן: きれいなまち = עיר יפה"
            ),
            QuizQuestion(
                question = "מה ההבדל בין あつい לבין さむい?",
                options = listOf("שניהם אותו הדבר", "あつい = קר, さむい = חם", "あつい = חם, さむい = קר", "あつい = גדול, さむい = קטן"),
                correctIndex = 2,
                explanation = "あつい (atsui) = חם; さむい (samui) = קר. שניהם לתיאור מזג אוויר ותחושה"
            ),
            QuizQuestion(
                question = "מה ההבדל בין i-adjective לבין na-adjective?",
                options = listOf("i-adj מסתיימים ב-な, na-adj ב-い", "i-adj מסתיימים ב-い, na-adj מוסיפים な לפני שם עצם", "אין הבדל", "i-adj = חיובי, na-adj = שלילי"),
                correctIndex = 1,
                explanation = "i-adj: מסתיים ב-い ושלילה ב-くない. na-adj: מוסיף な לפני שם עצם ושלילה ב-じゃない"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1011931837"
    )
}
