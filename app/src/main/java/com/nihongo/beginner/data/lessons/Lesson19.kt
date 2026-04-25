package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson19 {
    val lesson = Lesson(
        id = 19,
        number = "מטיילים 2",
        title = "הזמנה במסעדה",
        subtitle = "レストランで注文",
        emoji = "🍣",
        grammarPoints = listOf(
            GrammarPoint(
                title = "הזמנת אוכל — ください / おねがいします",
                content = "שתי דרכים לבקש:\n• ください (kudasai) — ישיר ומנומס\n• おねגaishimasu (onegaishimasu) — מנומס יותר",
                pattern = "[item] を ください / おねがいします"
            ),
            GrammarPoint(
                title = "מידות — S/M/L",
                content = "• エス (esu) = S\n• エム (emu) = M\n• エル (eru) = L\nמשמש בעיקר לקפה, שתייה, מנות.",
                pattern = "エム サイズ を ください。"
            ),
            GrammarPoint(
                title = "טמפרטורה — ホット / アイス",
                content = "• ホット (hotto) = חם\n• アイス (aisu) = קר/עם קרח\nמשמש לשתייה חמה/קרה.",
                pattern = "ホット コーヒー を ください。"
            ),
            GrammarPoint(
                title = "שאלת המלצה — おすすめはありますか？",
                content = "שאלה מנומסת לבקש המלצה מהמלצר.",
                pattern = "おすすめはありますか？(Osusume wa arimasu ka?)"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "おすすめ", romaji = "Osusume", hebrew = "המלצה", emoji = "⭐", imageKeyword = "recommendation star menu choice"),
            VocabItem(japanese = "ホット", romaji = "Hotto", hebrew = "חם", emoji = "♨️", imageKeyword = "hot steam warm drink"),
            VocabItem(japanese = "アイス", romaji = "Aisu", hebrew = "קר / קרח", emoji = "🧊", imageKeyword = "ice cold drink"),
            VocabItem(japanese = "サイズ", romaji = "Saizu", hebrew = "גודל", emoji = "📏", imageKeyword = "size small medium large"),
            VocabItem(japanese = "メニュー", romaji = "Menyuu", hebrew = "תפריט", emoji = "📋", imageKeyword = "menu restaurant food list"),
            VocabItem(japanese = "おかいけい", romaji = "Okaikei", hebrew = "חשבון", emoji = "🧾", imageKeyword = "bill receipt restaurant check"),
            VocabItem(japanese = "おみず", romaji = "Omizu", hebrew = "מים", emoji = "💧", imageKeyword = "water glass clear"),
            VocabItem(japanese = "さとう", romaji = "Satou", hebrew = "סוכר", emoji = "🍬", imageKeyword = "sugar white spoon"),
            VocabItem(japanese = "しお", romaji = "Shio", hebrew = "מלח", emoji = "🧂", imageKeyword = "salt shaker white"),
            VocabItem(japanese = "こしょう", romaji = "Koshou", hebrew = "פלפל", emoji = "🌶️", imageKeyword = "black pepper spice")
        ),
        examples = listOf(
            Example(romaji = "Osusume wa arimasu ka?", japanese = "おすすめはありますか？", hebrew = "יש לכם המלצה?"),
            Example(romaji = "Hotto koohii wo kudasai.", japanese = "ホットコーヒーをください。", hebrew = "קפה חם בבקשה."),
            Example(romaji = "Emu saizu wo onegaishimasu.", japanese = "エムサイズをおねがいします。", hebrew = "מידה M בבקשה."),
            Example(romaji = "Okaikei wo onegaishimasu.", japanese = "おかいけいをおねがいします。", hebrew = "את החשבון בבקשה."),
            Example(romaji = "Omizu wo kudasai.", japanese = "おみずをください。", hebrew = "מים בבקשה."),
            Example(romaji = "Menyu wo misete kudasai.", japanese = "メニューをみせてください。", hebrew = "הראה לי את התפריט בבקשה.")
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה ההבדל בין ください לבין おねがいします?",
                options = listOf("אין הבדל", "ください = חם, おねがいします = קר", "ください = ישיר, おねがいします = יותר מנומס", "ください = שאלה, おねがいします = בקשה"),
                correctIndex = 2,
                explanation = "שניהם בקשה, אך おねがいします מנומס יותר ומתאים יותר למסעדות רשמיות"
            ),
            QuizQuestion(
                question = "כיצד מבקשים 'קפה קר' ביפנית?",
                options = listOf("ホットコーヒーをください", "コーヒーをください", "アイスコーヒーをください", "コーヒーはいくらですか"),
                correctIndex = 2,
                explanation = "アイス (aisu) = קר/קרח, ואחריו שם המשקה + をください"
            ),
            QuizQuestion(
                question = "מה פירוש おかいけい?",
                options = listOf("תפריט", "המלצה", "חשבון", "מנה"),
                correctIndex = 2,
                explanation = "おかいけい (okaikei) = חשבון — זו הדרך המנומסת לבקש את החשבון במסעדה"
            ),
            QuizQuestion(
                question = "איך שואלים אם יש המלצה?",
                options = listOf("おすすめをください", "おすすめはありますか", "おすすめがほしい", "おすすめはなんですか"),
                correctIndex = 1,
                explanation = "ありますか = שאלת קיום. おすすめはありますか = האם יש המלצה?"
            ),
            QuizQuestion(
                question = "מה זה ホット במסעדה?",
                options = listOf("מרק חם", "קר/קרח", "חריף", "חם (טמפרטורת שתייה)"),
                correctIndex = 3,
                explanation = "ホット (hotto) = hot, בניגוד לアイス (aisu) = cold — משמש לתיאור טמפרטורת שתייה"
            ),
            QuizQuestion(
                question = "כיצד מבקשים מידה L?",
                options = listOf("エス サイズ", "エム サイズ", "エル サイズ", "ラージ サイズ"),
                correctIndex = 2,
                explanation = "האותיות S/M/L נקראות ביפנית: エス/エム/エル — קריאה בסגנון אנגלי"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1011931577"
    )
}
