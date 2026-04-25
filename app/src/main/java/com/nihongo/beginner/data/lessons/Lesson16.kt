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
            VocabItem(japanese = "たべる (Taberu)", romaji = "Tabemashita / Tabemasendeshita", hebrew = "אכל/ה / לא אכל/ה", emoji = "🍽️", imageKeyword = "eating chopsticks japanese food"),
            VocabItem(japanese = "みる (Miru)", romaji = "Mimashita / Mimasendeshita", hebrew = "ראה/ראתה / לא ראה/ה", emoji = "👀", imageKeyword = "watching television screen"),
            VocabItem(japanese = "おきる (Okiru)", romaji = "Okimashita / Okimasendeshita", hebrew = "קם/ה / לא קם/ה", emoji = "🛏️", imageKeyword = "waking up morning bed sunrise"),
            VocabItem(japanese = "ねる (Neru)", romaji = "Nemashita / Nemasendeshita", hebrew = "ישן/ה / לא ישן/ה", emoji = "😴", imageKeyword = "sleeping bed peaceful night"),
            VocabItem(japanese = "はなす (Hanasu)", romaji = "Hanashimashita / Hanashimasendeshita", hebrew = "דיבר/ה / לא דיבר/ה", emoji = "💬", imageKeyword = "talking conversation friends"),
            VocabItem(japanese = "きく (Kiku)", romaji = "Kikimashita / Kikimasendeshita", hebrew = "שמע/ה / לא שמע/ה", emoji = "👂", imageKeyword = "listening headphones music"),
            VocabItem(japanese = "いく (Iku)", romaji = "Ikimashita / Ikimasendeshita", hebrew = "הלך/ה / לא הלך/ה", emoji = "🚶", imageKeyword = "walking path outdoor backpack"),
            VocabItem(japanese = "よむ (Yomu)", romaji = "Yomimashita / Yomimasendeshita", hebrew = "קרא/ה / לא קרא/ה", emoji = "📖", imageKeyword = "reading book person relax"),
            VocabItem(japanese = "のむ (Nomu)", romaji = "Nomimashita / Nomimasendeshita", hebrew = "שתה/ה / לא שתה/ה", emoji = "🥤", imageKeyword = "drinking water glass refreshing"),
            VocabItem(japanese = "かえる (Kaeru)", romaji = "Kaerimashita / Kaerimasendeshita", hebrew = "חזר/ה / לא חזר/ה", emoji = "🏠", imageKeyword = "returning home front door house"),
            VocabItem(japanese = "する (Suru)", romaji = "Shimashita / Shimasendeshita", hebrew = "עשה/ה / לא עשה/ה", emoji = "✅", imageKeyword = "working hands creating activity"),
            VocabItem(japanese = "くる (Kuru)", romaji = "Kimashita / Kimasendeshita", hebrew = "בא/ה / לא בא/ה", emoji = "🚶", imageKeyword = "person walking approaching street"),
            VocabItem(japanese = "べんきょうする", romaji = "Benkyou shimashita / Benkyou shimasendeshita", hebrew = "למד/ה / לא למד/ה", emoji = "📚", imageKeyword = "studying desk books lamp student")
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
                correctIndex = 1,
                explanation = "masu → mashita לעבר חיובי"
            ),
            QuizQuestion(
                question = "מה צורת העבר השלילית של 'Nomimasu'?",
                options = listOf("Nomimasen", "Nomimashita", "Nomimasendeshita", "Nominasen"),
                correctIndex = 2,
                explanation = "masen → masen deshita לעבר שלילי"
            ),
            QuizQuestion(
                question = "'Ikimashita' פירושו:",
                options = listOf("הולך/ת", "הלך/ה", "לא הלך/ה", "ילך/ת"),
                correctIndex = 1,
                explanation = "mashita = עבר חיובי — iki+mashita"
            ),
            QuizQuestion(
                question = "מה צורת העבר של 'Shimasu'?",
                options = listOf("Shirimashita", "Shimashita", "Shishimashita", "Shisumashita"),
                correctIndex = 1,
                explanation = "shimasu = הווה של suru הלא-סדיר — עבר = ?"
            ),
            QuizQuestion(
                question = "'Kikimasendeshita' פירושו:",
                options = listOf("הקשיב/ה", "לא הקשיב/ה", "יקשיב/ה", "האם הקשיב/ה?"),
                correctIndex = 1,
                explanation = "masen deshita = שלילת עבר"
            ),
            QuizQuestion(
                question = "מה צורת העבר של 'Kimasu' (לבוא)?",
                options = listOf("Kimashita", "Kurumashita", "Kirimashita", "Kumashita"),
                correctIndex = 0,
                explanation = "kimasu = הווה של kuru הלא-סדיר — עבר = ?"
            ),
            QuizQuestion(
                question = "'Watashi wa nemasendeshita' פירושו:",
                options = listOf("ישנתי", "לא ישנתי", "אישן", "האם ישנת?"),
                correctIndex = 1,
                explanation = "neru = לישון, masen deshita = שלילת עבר"
            ),
            QuizQuestion(
                question = "מה ההבדל בין 'mashita' ל-'masen deshita'?",
                options = listOf("אין הבדל", "mashita=חיוב, masen deshita=שלילה", "mashita=שלילה, masen deshita=חיוב", "שניהם שלילה"),
                correctIndex = 1,
                explanation = "שניהם עבר — אחד חיובי ואחד שלילי"
            ),
            QuizQuestion(
                question = "'Benkyou shimashita' פירושו:",
                options = listOf("לומד/ת", "ילמד/תלמד", "למד/ה", "לא למד/ה"),
                correctIndex = 2,
                explanation = "benkyou shimasu = ללמוד, shimashita = עבר חיובי"
            ),
            QuizQuestion(
                question = "מה צורת העבר של 'Hanashimasu'?",
                options = listOf("Hanashimashita", "Hanarimashita", "Hanashita", "Hanasumashita"),
                correctIndex = 0,
                explanation = "masu → mashita — hanashi+mashita"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1033587473"
    )
}
