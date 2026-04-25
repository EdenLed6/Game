package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson05 {
    val lesson = Lesson(
        id = 5,
        number = "שיעור 5",
        title = "שלילה: JANAIDESU",
        subtitle = "JANAIDESU",
        emoji = "❌",
        grammarPoints = listOf(
            GrammarPoint(
                title = "janaidesu (じゃないです) - שלילה",
                content = "janaidesu = הצורה השלילית הפורמלית של desu.\nסדר המשפט לא משתנה - רק מחליפים desu ב-janaidesu.",
                pattern = "[נושא] wa [שם עצם] janaidesu"
            ),
            GrammarPoint(
                title = "Iie / Hai - תשובות",
                content = "Iie (いいえ) = לא\nHai (はい) = כן\nבמענה לשאלה: Iie, [subject] wa [noun] janaidesu."
            ),
            GrammarPoint(
                title = "שאלה בשלילה",
                content = "ניתן לשאול שאלה שלילית על ידי הוספת 'ka' בסוף.",
                pattern = "[נושא] wa [שם עצם] janaidesu ka?"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "いいえ", romaji = "Iie", hebrew = "לא", emoji = "❌", imageKeyword = "no wrong red x sign"),
            VocabItem(japanese = "はい", romaji = "Hai", hebrew = "כן", emoji = "✅", imageKeyword = "yes correct green check"),
            VocabItem(japanese = "わたし", romaji = "Watashi", hebrew = "אני", emoji = "👤"),
            VocabItem(japanese = "あなた", romaji = "Anata", hebrew = "אתה/את", emoji = "👉"),
            VocabItem(japanese = "さん", romaji = "San", hebrew = "אדוני/גברת (תואר כבוד)", emoji = "🎩"),
            VocabItem(japanese = "せんせい", romaji = "Sensei", hebrew = "מורה", emoji = "📚"),
            VocabItem(japanese = "えんじにあ", romaji = "Enjinia", hebrew = "מהנדס", emoji = "🔧"),
            VocabItem(japanese = "にほんじん", romaji = "Nihonjin", hebrew = "יפני/ת", emoji = "🇯🇵", imageKeyword = "japan traditional yukata festival"),
            VocabItem(japanese = "かんこくじん", romaji = "Kankokujin", hebrew = "קוריאני/ת", emoji = "🇰🇷", imageKeyword = "korea hanbok traditional dress"),
            VocabItem(japanese = "ちゅうごくじん", romaji = "Chugokujin", hebrew = "סיני/ת", emoji = "🇨🇳", imageKeyword = "china traditional dress qipao")
        ),
        examples = listOf(
            Example(
                romaji = "Kim san wa Chugoku jin desu ka?",
                japanese = "キムさんはちゅうごくじんですか？",
                hebrew = "האם קים הוא/היא סיני/ת?"
            ),
            Example(
                romaji = "Iie, Kim san wa Chugoku jin janaidesu. Kankoku jin desu.",
                japanese = "いいえ、キムさんはちゅうごくじんじゃないです。かんこくじんです。",
                hebrew = "לא, קים לא סיני/ת. הוא/היא קוריאני/ת."
            ),
            Example(
                romaji = "Watashi wa sensei janaidesu.",
                japanese = "わたしはせんせいじゃないです。",
                hebrew = "אני לא מורה."
            ),
            Example(
                romaji = "Suzuki san wa enjinia janaidesu ka?",
                japanese = "すずきさんはえんじにあじゃないですか？",
                hebrew = "האם סוזוקי אינו/ה מהנדס/ת?"
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "איך אומרים 'אני לא מורה'?",
                options = listOf(
                    "Watashi wa sensei desu",
                    "Watashi wa sensei janaidesu",
                    "Watashi wa sensei ka",
                    "Sensei wa watashi janaidesu"
                ),
                correctIndex = 1,
                explanation = "שלילה = מחליפים את desu בסיומת השלילה"
            ),
            QuizQuestion(
                question = "מה פירוש 'Iie'?",
                options = listOf("כן", "אולי", "לא", "בסדר"),
                correctIndex = 2,
                explanation = "הפוך מ-Hai"
            ),
            QuizQuestion(
                question = "'Kim san wa Chugoku jin janaidesu' פירושו:",
                options = listOf(
                    "קים הוא סיני",
                    "האם קים סיני?",
                    "קים אינו/ה סיני/ת",
                    "אני לא סיני"
                ),
                correctIndex = 2,
                explanation = "Chugoku = סין, jin = לאום, janaidesu = שלילה"
            ),
            QuizQuestion(
                question = "מה ההבדל בין desu ל-janaidesu?",
                options = listOf(
                    "desu=עתיד, janaidesu=עבר",
                    "desu=חיוב, janaidesu=שלילה",
                    "desu=שאלה, janaidesu=תשובה",
                    "אין הבדל"
                ),
                correctIndex = 1,
                explanation = "desu = הצהרה חיובית — janaidesu מבטל ומהפך אותה"
            ),
            QuizQuestion(
                question = "איך שואלים 'האם סוזוקי לא יפני?'",
                options = listOf(
                    "Suzuki san wa Nihon jin desu ka",
                    "Suzuki san wa Nihon jin janaidesu ka",
                    "Suzuki san wa Nihon janaidesu",
                    "Iie Suzuki san"
                ),
                correctIndex = 1,
                explanation = "שאלה = מוסיפים ka — גם לשלילה"
            ),
            QuizQuestion(
                question = "מה התשובה ל-'Hai'?",
                options = listOf("כן", "לא", "אולי", "סליחה"),
                correctIndex = 0,
                explanation = "Hai ו-Iie הם שני הקטבים"
            ),
            QuizQuestion(
                question = "איך אומרים 'ואן לא סינייה'?",
                options = listOf(
                    "Wan san wa Chugoku jin desu",
                    "Wan san wa Chugoku jin janaidesu",
                    "Wan san wa Kankoku jin desu",
                    "Iie Wan san"
                ),
                correctIndex = 1,
                explanation = "Chugoku = סין, Wan san = שם, janaidesu = שלילה"
            ),
            QuizQuestion(
                question = "סדר המשפט בשלילה הוא...",
                options = listOf(
                    "שונה מחיוב",
                    "זהה לחיוב",
                    "הפוך מחיוב",
                    "תלוי בנושא"
                ),
                correctIndex = 1,
                explanation = "הסדר ביפנית יציב — רק הסיומת משתנה"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1032829563"
    )
}
