package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson03 {
    val lesson = Lesson(
        id = 3,
        number = "שיעור 3",
        title = "הצגה עצמית",
        subtitle = "Self Introduction",
        emoji = "👋",
        grammarPoints = listOf(
            GrammarPoint(
                title = "תבנית הצגה עצמית",
                content = "ארבעה שלבים:\n1. こんにちは (Konnichiwa) - שלום\n2. はじめまして (Hajimemashite) - נעים להכיר\n3. [שם] です ([name] desu) - אני [שם]\n4. よろしくおねがいします (Yoroshiku onegaishimasu) - שמחה לשמור קשר",
                pattern = "Konnichiwa → Hajimemashite → [שם] desu → Yoroshiku onegaishimasu"
            ),
            GrammarPoint(
                title = "desu - הסבר",
                content = "desu (です) = 'הוא/היא/אני' - פועל עזר פורמלי ביפנית. מוסיפים אחרי שמות עצם לסיום משפט. דוגמה: 'Sensei desu' = 'אני מורה'"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "わたし", romaji = "Watashi", hebrew = "אני", emoji = "👤"),
            VocabItem(japanese = "です", romaji = "Desu", hebrew = "הוא/היא/אני (סיומת פורמלית)", emoji = "💬"),
            VocabItem(japanese = "さん", romaji = "San", hebrew = "אדוני/גברת (תואר כבוד)", emoji = "🎩"),
            VocabItem(japanese = "えんじにあ", romaji = "Enjinia", hebrew = "מהנדס", emoji = "🔧", imageKeyword = "engineer blueprint hard hat construction"),
            VocabItem(japanese = "せんせい", romaji = "Sensei", hebrew = "מורה", emoji = "📚", imageKeyword = "teacher classroom blackboard"),
            VocabItem(japanese = "がくせい", romaji = "Gakusei", hebrew = "תלמיד/סטודנט", emoji = "🎓", imageKeyword = "student studying desk books")
        ),
        examples = listOf(
            Example(
                romaji = "Konnichiwa. Hajimemashite. Watashi wa Yamada Tarou desu. Enjinia desu. Yoroshiku onegaishimasu.",
                japanese = "こんにちは。はじめまして。わたしはやまだたろうです。えんじにあです。よろしくおねがいします。",
                hebrew = "שלום, נעים להכיר, אני יאמדה טארו, מהנדס, שמחה לשמור קשר."
            ),
            Example(
                romaji = "Konnichiwa. Hajimemashite. Watashi wa Kimura Rihi desu. Nihongo no sensei desu. Yoroshiku onegaishimasu.",
                japanese = "こんにちは。はじめまして。わたしはきむらりひです。にほんごのせんせいです。よろしくおねがいします。",
                hebrew = "שלום, נעים להכיר, אני קימורה ריהי, מורה ליפנית, שמחה לשמור קשר."
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה השלב הראשון בהצגה עצמית?",
                options = listOf("Hajimemashite", "Konnichiwa", "Desu", "Yoroshiku"),
                correctIndex = 1,
                explanation = "ההצגה פותחת בפנייה לשומע — לא בשם עצמך"
            ),
            QuizQuestion(
                question = "מה פירוש 'Desu' בהצגה עצמית?",
                options = listOf("תודה", "שלום", "סיומת פורמלית (הוא/היא/אני)", "נעים להכיר"),
                correctIndex = 2,
                explanation = "Desu היא סיומת הצהרה רשמית — לא פועל עצמאי"
            ),
            QuizQuestion(
                question = "מה פירוש 'Hajimemashite'?",
                options = listOf("שלום", "תודה", "נעים להכיר", "להתראות"),
                correctIndex = 2,
                explanation = "Hajime = התחלה ביפנית — זה ביטוי שאומרים רק בפגישה ראשונה"
            ),
            QuizQuestion(
                question = "איך אומרים 'אני מהנדס'?",
                options = listOf("Sensei desu", "Enjinia desu", "Gakusei desu", "Watashi desu"),
                correctIndex = 1,
                explanation = "Engineer ביפנית = Enjinia (Japanglish) — מוסיפים desu בסוף"
            ),
            QuizQuestion(
                question = "מה האחרון בהצגה עצמית?",
                options = listOf("Konnichiwa", "Hajimemashite", "Desu", "Yoroshiku onegaishimasu"),
                correctIndex = 3,
                explanation = "Yoroshiku onegaishimasu = 'נא להתייחס אליי בחביבות' — זה המסיים המסורתי"
            ),
            QuizQuestion(
                question = "מה פירוש 'San' כשמוסיפים לשם?",
                options = listOf("חבר", "מורה", "תואר כבוד (אדוני/גברת)", "תלמיד"),
                correctIndex = 2,
                explanation = "San אינו שם, אינו מקצוע — הוא תמיד מגיע אחרי שמו של אדם"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1032806172"
    )
}
