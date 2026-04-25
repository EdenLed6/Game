package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson13 {
    val lesson = Lesson(
        id = 13,
        number = "שיעור 12",
        title = "מילית הזמן: NI",
        subtitle = "NI Time (に)",
        emoji = "⏰",
        grammarPoints = listOf(
            GrammarPoint(
                title = "ni (に) - מילית זמן ספציפי",
                content = "ni (に) = 'ב-' לציון שעה/תאריך ספציפי.\nמגיעה אחרי הזמן הספציפי.\nרק עם זמן ספציפי! לא עם: ima (עכשיו), kinou (אתמול), mainichi (כל יום).",
                pattern = "[נושא] wa [שעה] ji ni [פועל]"
            ),
            GrammarPoint(
                title = "ji (じ) - שעה",
                content = "ji = o'clock (שעה).\nji han = וחצי.\nדוגמה: 7 ji = 7 בשבע, 19 ji han = 19:30"
            ),
            GrammarPoint(
                title = "סדר המשפט המלא",
                content = "סדר מלא: נושא → זמן + ni → מקום + de → מושא + wo → פועל",
                pattern = "Subject wa [time] ni [place] de [object] wo [verb-masu]"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "ごはん", romaji = "Gohan", hebrew = "אוכל / אורז מבושל", emoji = "🍚", imageKeyword = "rice bowl japanese steaming"),
            VocabItem(japanese = "あさごはん", romaji = "Asagohan", hebrew = "ארוחת בוקר", emoji = "🌅", imageKeyword = "breakfast morning japanese miso soup"),
            VocabItem(japanese = "ひるごはん", romaji = "Hirugohan", hebrew = "ארוחת צהריים", emoji = "☀️", imageKeyword = "lunch bento box japanese"),
            VocabItem(japanese = "ばんごはん", romaji = "Bangohan", hebrew = "ארוחת ערב", emoji = "🌙", imageKeyword = "dinner family table warm food"),
            VocabItem(japanese = "しごと", romaji = "Shigoto", hebrew = "עבודה", emoji = "💼", imageKeyword = "work desk laptop office"),
            VocabItem(japanese = "じ", romaji = "Ji", hebrew = "שעה (o'clock)", emoji = "⏰", imageKeyword = "analog clock time face"),
            VocabItem(japanese = "じはん", romaji = "Ji han", hebrew = "וחצי (half past)", emoji = "🕧"),
            VocabItem(japanese = "いま", romaji = "Ima", hebrew = "עכשיו (ללא ni!)", emoji = "⚡"),
            VocabItem(japanese = "まいにち", romaji = "Mainichi", hebrew = "כל יום (ללא ni!)", emoji = "📅", imageKeyword = "calendar daily routine schedule")
        ),
        examples = listOf(
            Example(
                romaji = "Watashi wa 7 ji ni okimasu.",
                japanese = "わたしは7じにおきます。",
                hebrew = "אני קם/ה בשבע."
            ),
            Example(
                romaji = "8 ji ni asagohan wo tabemasu.",
                japanese = "8じにあさごはんをたべます。",
                hebrew = "בשמונה אוכל/ת ארוחת בוקר."
            ),
            Example(
                romaji = "9 ji ni shigoto wo shimasu.",
                japanese = "9じにしごとをします。",
                hebrew = "בתשע עובד/ת."
            ),
            Example(
                romaji = "17 ji ni yoga wo shimasu.",
                japanese = "17じにヨガをします。",
                hebrew = "ב-17 עושה יוגה."
            ),
            Example(
                romaji = "19 ji han ni bangohan wo tabemasu.",
                japanese = "19じはんにばんごはんをたべます。",
                hebrew = "ב-19:30 אוכל/ת ארוחת ערב."
            ),
            Example(
                romaji = "23 ji ni nemasu.",
                japanese = "23じにねます。",
                hebrew = "ב-23 ישן/ה."
            ),
            Example(
                romaji = "Watashi wa ima tabemasu. (no ni!)",
                japanese = "わたしはいまたべます。",
                hebrew = "אני אוכל/ת עכשיו. (ima = ללא ni)"
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מתי משתמשים ב-'ni' לציון זמן?",
                options = listOf("תמיד עם זמן", "רק עם זמן יחסי (עכשיו, אתמול)", "רק עם שעות ותאריכים ספציפיים", "אחרי כל שם עצם"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "'7 ji ni okimasu' פירושו:",
                options = listOf("אני קם/ה בשש", "אני קם/ה בשבע", "אני ישן/ה בשבע", "בשבע אוכל/ת"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה פירוש 'ji han'?",
                options = listOf("שעה מדויקת", "וחצי (half past)", "שעה ורבע", "חצות"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Ima tabemasu' - למה אין 'ni' אחרי 'ima'?",
                options = listOf("שגיאה", "ima הוא זמן יחסי, לא ספציפי", "ima = שם עצם", "ni לא בא עם אוכל"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "איך אומרים '19:30'?",
                options = listOf("juu kyuu ji", "juu kyuu ji han", "kyuu juu ji han", "juu kyuu han ji"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Bangohan wo tabemasu' עם שעה 8 = ?",
                options = listOf("8 ji bangohan wo tabemasu", "8 ji ni bangohan wo tabemasu", "Bangohan 8 ji ni tabemasu", "8 ni ji bangohan tabemasu"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה פירוש 'Asagohan'?",
                options = listOf("ארוחת ערב", "ארוחת צהריים", "ארוחת בוקר", "אורז"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "'Mainichi shigoto wo shimasu' - למה אין 'ni'?",
                options = listOf("שגיאה", "mainichi = זמן יחסי", "mainichi = שם עצם", "ni בא אחרי shigoto"),
                correctIndex = 1
            )
        )
    )
}
