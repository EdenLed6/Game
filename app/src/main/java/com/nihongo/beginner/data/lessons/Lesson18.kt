package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson18 {
    val lesson = Lesson(
        id = 18,
        number = "מטיילים 1",
        title = "אוכל ושתייה",
        subtitle = "たべもの・のみもの",
        emoji = "🍜",
        grammarPoints = listOf(
            GrammarPoint(
                title = "שתייה — のみもの (nomimono)",
                content = "מילה כללית לשתייה. בסופר או מסעדה תראו אותה על שלטים.",
                pattern = "[drink name] + ください / おねがいします"
            ),
            GrammarPoint(
                title = "בקשה בסיסית — ください (kudasai)",
                content = "הדרך הפשוטה לבקש משהו. אומרים את שם הדבר + ください.",
                pattern = "ビール ください。(Biiru kudasai — כוס בירה בבקשה)"
            ),
            GrammarPoint(
                title = "כלי אוכל — שאלה ובקשה",
                content = "חשוב לדעת מה לבקש: フォーク (fuoku/מזלג), スプーン (supuun/כפית), おはし (ohashi/מקלות).",
                pattern = "フォーク を ください。(Fuoku wo kudasai — תן לי מזלג בבקשה)"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "ビール", romaji = "Biiru", hebrew = "בירה", emoji = "🍺", imageKeyword = "beer mug cold frothy"),
            VocabItem(japanese = "コーヒー", romaji = "Koohii", hebrew = "קפה", emoji = "☕", imageKeyword = "coffee cup warm steam"),
            VocabItem(japanese = "お茶", romaji = "Ocha", hebrew = "תה ירוק", emoji = "🍵", imageKeyword = "green tea japanese cup"),
            VocabItem(japanese = "紅茶", romaji = "Koucha", hebrew = "תה שחור", emoji = "🫖", imageKeyword = "black tea teacup english"),
            VocabItem(japanese = "ジュース", romaji = "Juusu", hebrew = "מיץ", emoji = "🧃", imageKeyword = "juice glass orange fresh"),
            VocabItem(japanese = "ミルク", romaji = "Miruku", hebrew = "חלב", emoji = "🥛", imageKeyword = "milk glass white fresh"),
            VocabItem(japanese = "ワイン", romaji = "Wain", hebrew = "יין", emoji = "🍷", imageKeyword = "wine glass red elegant"),
            VocabItem(japanese = "お酒", romaji = "Osake", hebrew = "אלכוהול / סאקה", emoji = "🍶", imageKeyword = "sake japanese bottle traditional"),
            VocabItem(japanese = "炭酸水", romaji = "Tansansui", hebrew = "מים מוגזים", emoji = "💧", imageKeyword = "sparkling water bubbles glass"),
            VocabItem(japanese = "おはし", romaji = "Ohashi", hebrew = "מקלות אכילה", emoji = "🥢", imageKeyword = "chopsticks japanese wooden"),
            VocabItem(japanese = "フォーク", romaji = "Fuoku", hebrew = "מזלג", emoji = "🍴", imageKeyword = "fork silverware dining"),
            VocabItem(japanese = "スプーン", romaji = "Supuun", hebrew = "כף", emoji = "🥄", imageKeyword = "spoon silverware dining")
        ),
        examples = listOf(
            Example(romaji = "Ocha wo kudasai.", japanese = "おちゃをください。", hebrew = "תה ירוק בבקשה."),
            Example(romaji = "Biiru wo onegaishimasu.", japanese = "ビールをおねがいします。", hebrew = "בירה בבקשה."),
            Example(romaji = "Ohashi ga arimasu ka?", japanese = "おはしがありますか？", hebrew = "יש מקלות אכילה?"),
            Example(romaji = "Fuoku wo kudasai.", japanese = "フォークをください。", hebrew = "מזלג בבקשה."),
            Example(romaji = "Koohii wa ikura desu ka?", japanese = "コーヒーはいくらですか？", hebrew = "כמה עולה קפה?"),
            Example(romaji = "Wain to biiru ga arimasu.", japanese = "ワインとビールがあります。", hebrew = "יש יין ובירה.")
        ),
        exercises = listOf(
            QuizQuestion(
                question = "איך אומרים 'קפה' ביפנית?",
                options = listOf("コーヒー", "お茶", "ジュース", "ワイン"),
                correctIndex = 0,
                explanation = "מילות לואן מאנגלית (coffee) מבוטאות ביפנית בקטקנה: コーヒー (koohii)"
            ),
            QuizQuestion(
                question = "מה פירושו של ください (kudasai)?",
                options = listOf("תודה", "סליחה", "בבקשה תן לי", "כמה זה עולה?"),
                correctIndex = 2,
                explanation = "ください (kudasai) = בקשה לקבל משהו. מגיע לאחר שם הדבר עם を"
            ),
            QuizQuestion(
                question = "מה ההבדל בין お茶 לבין 紅茶?",
                options = listOf("אין הבדל", "お茶 = תה ירוק, 紅茶 = תה שחור", "お茶 = תה חם, 紅茶 = תה קר", "お茶 = תה יפני, 紅茶 = קפה"),
                correctIndex = 1,
                explanation = "お茶 (ocha) = תה ירוק יפני. 紅茶 (koucha) = תה שחור/אנגלי"
            ),
            QuizQuestion(
                question = "כיצד מבקשים 'בירה בבקשה'?",
                options = listOf("ビール です", "ビール ください", "ビール ありますか", "ビール いくら"),
                correctIndex = 1,
                explanation = "שם הדבר + ください = בקשה בסיסית. ありますか = שאלה האם קיים"
            ),
            QuizQuestion(
                question = "מה פירוש おはし?",
                options = listOf("כפית", "מזלג", "מקלות אכילה", "סכין"),
                correctIndex = 2,
                explanation = "おはし (ohashi) = מקלות האכילה היפניים. הקידומת お מוסיפה נימוס"
            ),
            QuizQuestion(
                question = "איך כותבים 'יין' ביפנית?",
                options = listOf("ワイン", "ウイスキー", "ビール", "コーヒー"),
                correctIndex = 0,
                explanation = "ワイン (wain) בא מהמילה האנגלית wine — קטקנה משמשת למילות לואן"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1011930627"
    )
}
