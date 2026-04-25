package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson12 {
    val lesson = Lesson(
        id = 12,
        number = "שיעור 11",
        title = "מילית המושא: WO",
        subtitle = "WO (を)",
        emoji = "🎯",
        grammarPoints = listOf(
            GrammarPoint(
                title = "wo (を) - מילית מושא",
                content = "wo (を) = מציינת מושא (אובייקט) של הפועל.\nמגיעה אחרי המושא, לפני הפועל.\nהגייה: 'o' (למרות שנכתב wo).",
                pattern = "[נושא] wa [מושא] wo [פועל-masu]"
            ),
            GrammarPoint(
                title = "סדר המשפט",
                content = "סדר קבוע: נושא → זמן → מקום → מושא → פועל\nהמושא תמיד לפני הפועל."
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "さかな", romaji = "Sakana", hebrew = "דג", emoji = "🐟", imageKeyword = "fresh fish seafood market"),
            VocabItem(japanese = "ベジタリアン", romaji = "Bejitarian", hebrew = "צמחוני/ת", emoji = "🥗", imageKeyword = "vegetables salad colorful healthy"),
            VocabItem(japanese = "ビール", romaji = "Bi-ru", hebrew = "בירה", emoji = "🍺", imageKeyword = "beer mug cold foam"),
            VocabItem(japanese = "ワイン", romaji = "Wain", hebrew = "יין", emoji = "🍷", imageKeyword = "wine glass red grapes"),
            VocabItem(japanese = "ちょっと", romaji = "Chotto", hebrew = "קצת", emoji = "🤏"),
            VocabItem(japanese = "えいが", romaji = "Eiga", hebrew = "סרט", emoji = "🎬", imageKeyword = "cinema film clapper movie"),
            VocabItem(japanese = "にほんご", romaji = "Nihongo", hebrew = "יפנית (שפה)", emoji = "🇯🇵", imageKeyword = "japanese calligraphy brush kanji"),
            VocabItem(japanese = "フランス語", romaji = "Furansugo", hebrew = "צרפתית (שפה)", emoji = "🇫🇷", imageKeyword = "paris france eiffel tower language"),
            VocabItem(japanese = "ハンバーガー", romaji = "Hamba-ga-", hebrew = "המבורגר", emoji = "🍔", imageKeyword = "hamburger tall bun fresh"),
            VocabItem(japanese = "おんがく", romaji = "Ongaku", hebrew = "מוסיקה", emoji = "🎵", imageKeyword = "music headphones notes colorful"),
            VocabItem(japanese = "テレビ", romaji = "Terebi", hebrew = "טלוויזיה", emoji = "📺", imageKeyword = "television flatscreen modern")
        ),
        examples = listOf(
            Example(
                romaji = "Watashi wa eiga wo mimasu.",
                japanese = "わたしはえいがをみます。",
                hebrew = "אני צופה בסרט."
            ),
            Example(
                romaji = "Watashi wa Furansugo wo hanashimasu.",
                japanese = "わたしはフランス語をはなします。",
                hebrew = "אני מדבר/ת צרפתית."
            ),
            Example(
                romaji = "Watashi wa nihongo no hon wo yomimasu.",
                japanese = "わたしはにほんごのほんをよみます。",
                hebrew = "אני קורא/ת ספר יפנית."
            ),
            Example(
                romaji = "A: Honda san wa sakana wo tabemasuka? / B: Iie, watashi wa bejitarian desu. / A: Wain wo nomimasuka? / B: Iie, bi-ru wa chotto... Watashi wa wain wo nomimasu ne.",
                japanese = "ほんださんはさかなをたべますか？/ いいえ、わたしはベジタリアンです。/ ワインをのみますか？/ いいえ、ビールはちょっと...わたしはワインをのみますね。",
                hebrew = "דיאלוג: האם הונדה אוכל/ת דגים? / לא, אני צמחוני/ת. / האם שותה יין? / לא, בירה קצת... אני שותה יין, נכון."
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה עושה המילית 'wo' במשפט?",
                options = listOf("מציינת נושא", "מציינת מושא", "מציינת זמן", "מציינת מקום"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Watashi wa eiga wo mimasu' פירושו:",
                options = listOf("אני שומע/ת סרט", "אני צופה בסרט", "אני עושה סרט", "אני קורא/ת סרט"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "איפה מגיעה 'wo' במשפט?",
                options = listOf("אחרי הנושא", "אחרי הפועל", "אחרי המושא לפני הפועל", "בתחילת המשפט"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "איך אומרים 'אני שותה בירה'?",
                options = listOf("Watashi wa bi-ru wo nomimasu", "Watashi wo bi-ru wa nomimasu", "Bi-ru wo watashi wa nomimasu", "Watashi wa nomimasu bi-ru wo"),
                correctIndex = 0
            ),
            QuizQuestion(
                question = "מה פירוש 'Chotto'?",
                options = listOf("הרבה", "קצת", "בסדר", "לא"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Nihongo wo hanashimasu' פירושו:",
                options = listOf("לומד/ת יפנית", "כותב/ת יפנית", "מדבר/ת יפנית", "קורא/ת יפנית"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "מה הגייה נכונה של 'を'?",
                options = listOf("wo", "o", "we", "wi"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Ongaku wo kikimasu' פירושו:",
                options = listOf("עושה מוסיקה", "מקשיב/ה למוסיקה", "כותב/ת מוסיקה", "רואה מוסיקה"),
                correctIndex = 1
            )
        )
    )
}
