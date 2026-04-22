package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson16 {
    val lesson = Lesson(
        id = 16,
        number = "שיעור 15",
        title = "עבר לפעלים: MASHITA",
        subtitle = "MASHITA (ました)",
        emoji = "⏮️",
        grammarPoints = listOf(
            GrammarPoint(
                title = "mashita (ました) - עבר פורמלי חיובי",
                content = "mashita = סיומת עבר פורמלית לפעלים (חיוב).\nמחליפה את 'masu'.",
                pattern = "Tabemasu → Tabemashita"
            ),
            GrammarPoint(
                title = "masen deshita (ませんでした) - עבר שלילי",
                content = "masen deshita = עבר שלילי פורמלי.\nמחליפה את 'masen'.",
                pattern = "Tabemasen → Tabemasendeshita"
            ),
            GrammarPoint(
                title = "הטיית RU verbs לעבר",
                content = "פעלי RU: הורד ru, הוסף mashita",
                pattern = "Taberu → Tabe + mashita = Tabemashita"
            ),
            GrammarPoint(
                title = "הטיית U verbs לעבר",
                content = "פעלי U: שנה u→i, הוסף mashita",
                pattern = "Kiku → Kiki + mashita = Kikimashita\nHanasu → Hanashi + mashita = Hanashimashita"
            ),
            GrammarPoint(
                title = "פעלים לא סדירים בעבר",
                content = "Suru → Shimashita\nKuru → Kimashita\nBenkyou suru → Benkyou shimashita"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "たべる (Taberu)", romaji = "Tabemashita / Tabemasendeshita", hebrew = "אכל/ה / לא אכל/ה", emoji = "🍽️"),
            VocabItem(japanese = "みる (Miru)", romaji = "Mimashita / Mimasendeshita", hebrew = "ראה/ראתה / לא ראה/ה", emoji = "👀"),
            VocabItem(japanese = "おきる (Okiru)", romaji = "Okimashita / Okimasendeshita", hebrew = "קם/ה / לא קם/ה", emoji = "🛏️"),
            VocabItem(japanese = "ねる (Neru)", romaji = "Nemashita / Nemasendeshita", hebrew = "ישן/ה / לא ישן/ה", emoji = "😴"),
            VocabItem(japanese = "はなす (Hanasu)", romaji = "Hanashimashita / Hanashimasendeshita", hebrew = "דיבר/ה / לא דיבר/ה", emoji = "💬"),
            VocabItem(japanese = "きく (Kiku)", romaji = "Kikimashita / Kikimasendeshita", hebrew = "שמע/ה / לא שמע/ה", emoji = "👂"),
            VocabItem(japanese = "いく (Iku)", romaji = "Ikimashita / Ikimasendeshita", hebrew = "הלך/ה / לא הלך/ה", emoji = "🚶"),
            VocabItem(japanese = "よむ (Yomu)", romaji = "Yomimashita / Yomimasendeshita", hebrew = "קרא/ה / לא קרא/ה", emoji = "📖"),
            VocabItem(japanese = "のむ (Nomu)", romaji = "Nomimashita / Nomimasendeshita", hebrew = "שתה/ה / לא שתה/ה", emoji = "🥤"),
            VocabItem(japanese = "かえる (Kaeru)", romaji = "Kaerimashita / Kaerimasendeshita", hebrew = "חזר/ה / לא חזר/ה", emoji = "🏠"),
            VocabItem(japanese = "する (Suru)", romaji = "Shimashita / Shimasendeshita", hebrew = "עשה/ה / לא עשה/ה", emoji = "✅"),
            VocabItem(japanese = "くる (Kuru)", romaji = "Kimashita / Kimasendeshita", hebrew = "בא/ה / לא בא/ה", emoji = "🚶"),
            VocabItem(japanese = "べんきょうする", romaji = "Benkyou shimashita / Benkyou shimasendeshita", hebrew = "למד/ה / לא למד/ה", emoji = "📚")
        ),
        examples = listOf(
            Example(
                romaji = "Watashi wa nomimashita.",
                japanese = "わたしはのみました。",
                hebrew = "שתיתי."
            ),
            Example(
                romaji = "Watashi wa 6 ji ni wain wo nomimashita.",
                japanese = "わたしは6じにワインをのみました。",
                hebrew = "שתיתי יין בשש."
            ),
            Example(
                romaji = "Suzuki san wa kikimasendeshita.",
                japanese = "すずきさんはききませんでした。",
                hebrew = "סוזוקי לא הקשיב/ה."
            ),
            Example(
                romaji = "Watashi wa kinou nihon no eiga wo mimashita.",
                japanese = "わたしはきのうにほんのえいがをみました。",
                hebrew = "אתמול צפיתי בסרט יפני."
            ),
            Example(
                romaji = "Watashi wa benkyou shimasendeshita.",
                japanese = "わたしはべんきょうしませんでした。",
                hebrew = "לא למדתי."
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה צורת העבר של 'Tabemasu'?",
                options = listOf("Taberimashita", "Tabemashita", "Tabemasendeshita", "Tabeshimashita"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה צורת העבר השלילית של 'Nomimasu'?",
                options = listOf("Nomimasen", "Nomimashita", "Nomimasendeshita", "Nominasen"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "'Ikimashita' פירושו:",
                options = listOf("הולך/ת", "הלך/ה", "לא הלך/ה", "ילך/ת"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה צורת העבר של 'Shimasu'?",
                options = listOf("Shirimashita", "Shimashita", "Shishimashita", "Shisumashita"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Kikimasendeshita' פירושו:",
                options = listOf("הקשיב/ה", "לא הקשיב/ה", "יקשיב/ה", "האם הקשיב/ה?"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה צורת העבר של 'Kimasu' (לבוא)?",
                options = listOf("Kimashita", "Kurumashita", "Kirimashita", "Kumashita"),
                correctIndex = 0
            ),
            QuizQuestion(
                question = "'Watashi wa nemasendeshita' פירושו:",
                options = listOf("ישנתי", "לא ישנתי", "אישן", "האם ישנת?"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה ההבדל בין 'mashita' ל-'masen deshita'?",
                options = listOf("אין הבדל", "mashita=חיוב, masen deshita=שלילה", "mashita=שלילה, masen deshita=חיוב", "שניהם שלילה"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Benkyou shimashita' פירושו:",
                options = listOf("לומד/ת", "ילמד/תלמד", "למד/ה", "לא למד/ה"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "מה צורת העבר של 'Hanashimasu'?",
                options = listOf("Hanashimashita", "Hanarimashita", "Hanashita", "Hanasumashita"),
                correctIndex = 0
            )
        )
    )
}
