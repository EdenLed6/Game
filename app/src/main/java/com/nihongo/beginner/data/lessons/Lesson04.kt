package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson04 {
    val lesson = Lesson(
        id = 4,
        number = "שיעור 4",
        title = "מבנה: WA…DESU",
        subtitle = "WA…DESU",
        emoji = "💬",
        grammarPoints = listOf(
            GrammarPoint(
                title = "wa (は) - מילית נושא",
                content = "wa (は) מציינת את נושא המשפט. מגיעה אחרי הנושא.",
                pattern = "[נושא] wa [שם עצם] desu"
            ),
            GrammarPoint(
                title = "desu (です) - סיומת פורמלית",
                content = "desu (です) = סיומת פורמלית. נותנת משקל הווה/עתיד. ביפנית אין הבדל בין: הווה-עתיד, זכר-נקבה, יחיד-רבים."
            ),
            GrammarPoint(
                title = "שאלות עם ka (か)",
                content = "להפיכת משפט לשאלה: מוסיפים 'ka' בסוף.",
                pattern = "[נושא] wa [שם עצם] desu ka?"
            ),
            GrammarPoint(
                title = "jin (じん) - ממוצא",
                content = "מוסיפים 'jin' אחרי שם מדינה ליצירת לאומיות.\nדוגמה: Nihon + jin = Nihonjin (יפני/ת)",
                pattern = "[מדינה] + jin = [לאומיות]"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "わたし", romaji = "Watashi", hebrew = "אני", emoji = "👤"),
            VocabItem(japanese = "あなた", romaji = "Anata", hebrew = "אתה/את", emoji = "👉"),
            VocabItem(japanese = "さん", romaji = "San", hebrew = "אדוני/גברת", emoji = "🎩"),
            VocabItem(japanese = "せんせい", romaji = "Sensei", hebrew = "מורה", emoji = "📚"),
            VocabItem(japanese = "えんじにあ", romaji = "Enjinia", hebrew = "מהנדס", emoji = "🔧"),
            VocabItem(japanese = "プログラマー", romaji = "Purogurema-", hebrew = "מתכנת/ת", emoji = "💻", imageKeyword = "programmer laptop coding screen"),
            VocabItem(japanese = "マネージャー", romaji = "Mane-ja-", hebrew = "מנהל/ת", emoji = "👔", imageKeyword = "manager office suit professional"),
            VocabItem(japanese = "インストラクター", romaji = "Insutorakuta-", hebrew = "מדריך/ה", emoji = "🏋️", imageKeyword = "fitness instructor training exercise"),
            VocabItem(japanese = "がくせい", romaji = "Gakusei", hebrew = "תלמיד/סטודנט", emoji = "🎓"),
            VocabItem(japanese = "にほん", romaji = "Nihon", hebrew = "יפן", emoji = "🇯🇵", imageKeyword = "mount fuji japan cherry blossom"),
            VocabItem(japanese = "イスラエル", romaji = "Isuraeru", hebrew = "ישראל", emoji = "🇮🇱"),
            VocabItem(japanese = "フランス", romaji = "Furansu", hebrew = "צרפת", emoji = "🇫🇷", imageKeyword = "eiffel tower paris france"),
            VocabItem(japanese = "アメリカ", romaji = "Amerika", hebrew = "ארה\"ב", emoji = "🇺🇸", imageKeyword = "statue of liberty usa new york"),
            VocabItem(japanese = "ロシア", romaji = "Roshia", hebrew = "רוסיה", emoji = "🇷🇺", imageKeyword = "moscow russia red square"),
            VocabItem(japanese = "かんこく", romaji = "Kankoku", hebrew = "קוריאה", emoji = "🇰🇷", imageKeyword = "korea palace traditional Seoul"),
            VocabItem(japanese = "ちゅうごく", romaji = "Chugoku", hebrew = "סין", emoji = "🇨🇳", imageKeyword = "great wall china mountains"),
            VocabItem(japanese = "じん", romaji = "Jin", hebrew = "אדם ממוצא [מדינה]", emoji = "🌍")
        ),
        examples = listOf(
            Example(
                romaji = "Watashi wa Rihi desu.",
                japanese = "わたしはりひです。",
                hebrew = "אני ריהי."
            ),
            Example(
                romaji = "Tanaka san wa sensei desu.",
                japanese = "たなかさんはせんせいです。",
                hebrew = "מר טאנקה הוא מורה."
            ),
            Example(
                romaji = "Anata wa enjinia desu ka?",
                japanese = "あなたはえんじにあですか？",
                hebrew = "האם אתה/את מהנדס/ת?"
            ),
            Example(
                romaji = "Watashi wa Isuraeru jin desu.",
                japanese = "わたしはイスラエルじんです。",
                hebrew = "אני ישראלי/ת."
            ),
            Example(
                romaji = "Maria san wa Furansu jin desu.",
                japanese = "マリアさんはフランスじんです。",
                hebrew = "מריה היא צרפתייה."
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה עושה המילית 'wa' במשפט?",
                options = listOf("מציינת פועל", "מציינת נושא", "מציינת מושא", "מציינת זמן"),
                correctIndex = 1,
                explanation = "wa (は) היא חלקיק שמתייג את הנושא — על מי/מה אנחנו מדברים"
            ),
            QuizQuestion(
                question = "איך אומרים 'אני מורה'?",
                options = listOf("Watashi wa sensei ka", "Watashi wa sensei desu", "Anata wa sensei desu", "Sensei wa watashi desu"),
                correctIndex = 1,
                explanation = "הסדר: אני + wa + מורה + desu"
            ),
            QuizQuestion(
                question = "איך הופכים משפט לשאלה?",
                options = listOf("מוסיפים 'ne' בסוף", "מוסיפים 'ka' בסוף", "מוסיפים 'wa' בתחילה", "משנים את הסדר"),
                correctIndex = 1,
                explanation = "ביפנית לא צריך לשנות סדר מילים לשאלה — מספיק להוסיף מילה אחת בסוף"
            ),
            QuizQuestion(
                question = "מה פירוש 'Nihonjin'?",
                options = listOf("ספר יפני", "שפה יפנית", "יפני/ת (אדם ממוצא יפן)", "מנהל יפני"),
                correctIndex = 2,
                explanation = "Nihon = יפן, jin = אדם ממוצא/לאום"
            ),
            QuizQuestion(
                question = "איך אומרים 'האם אתה מתכנת?'",
                options = listOf("Watashi wa purogurema- desu", "Anata wa purogurema- desu ka", "Anata wa purogurema- ka", "Purogurema- wa anata desu"),
                correctIndex = 1,
                explanation = "Purogurema = Programmer, anata = אתה, שאלה = ka בסוף"
            ),
            QuizQuestion(
                question = "ביפנית 'desu' משמש עבור...",
                options = listOf("עבר בלבד", "עתיד בלבד", "הווה ועתיד, זכר ונקבה, יחיד ורבים", "זכר בלבד"),
                correctIndex = 2,
                explanation = "ביפנית desu לא משתנה לפי מין, מספר או זמן — זו אחת מהפשטויות שלה"
            ),
            QuizQuestion(
                question = "איך אומרים 'ישראלי/ת'?",
                options = listOf("Isuraeru go", "Isuraeru jin", "Isuraeru san", "Isuraeru no"),
                correctIndex = 1,
                explanation = "Isuraeru = ישראל — מה הסיומת שמציינת לאום?"
            ),
            QuizQuestion(
                question = "'Kimura san wa mane-ja- desu' פירושו:",
                options = listOf("האם קימורה מנהל?", "קימורה הוא/היא לא מנהל/ת", "קימורה הוא/היא מנהל/ת", "אני מנהל"),
                correctIndex = 2,
                explanation = "Mane-ja = Manager, desu = הצהרה חיובית הווה"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1032827425"
    )
}
