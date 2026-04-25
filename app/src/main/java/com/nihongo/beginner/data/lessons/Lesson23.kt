package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson23 {
    val lesson = Lesson(
        id = 23,
        number = "מטיילים 6",
        title = "יש / נמצא",
        subtitle = "あります・います",
        emoji = "📍",
        grammarPoints = listOf(
            GrammarPoint(
                title = "あります (arimasu) — יש / נמצא (דברים)",
                content = "משמש לדברים דוממים ולצמחים:\nへやにテレビがあります = יש טלוויזיה בחדר",
                pattern = "[מקום] に [דבר] が あります"
            ),
            GrammarPoint(
                title = "います (imasu) — יש / נמצא (אנשים/חיות)",
                content = "משמש לבני אדם ובעלי חיים:\nこうえんにこどもがいます = יש ילדים בגן",
                pattern = "[מקום] に [אדם/חיה] が います"
            ),
            GrammarPoint(
                title = "שלילה — ありません / いません",
                content = "• ありません = אין (דבר)\n• いません = אין (אדם/חיה)\nבסגנון לא רשמי: ない / いない",
                pattern = "[דבר] が ありません / [אדם] が いません"
            ),
            GrammarPoint(
                title = "שאלת מיקום",
                content = "שאלה: [דבר/אדם] はどこに いますか/ありますか？\nתשובה: [מקום] に います/あります",
                pattern = "トイレはどこにありますか？"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "あります", romaji = "Arimasu", hebrew = "יש / נמצא (דברים)", emoji = "📦", imageKeyword = "box object exists there"),
            VocabItem(japanese = "います", romaji = "Imasu", hebrew = "יש / נמצא (אנשים/חיות)", emoji = "🧑", imageKeyword = "person there exists presence"),
            VocabItem(japanese = "トイレ", romaji = "Toire", hebrew = "שירותים", emoji = "🚻", imageKeyword = "toilet bathroom restroom sign"),
            VocabItem(japanese = "ちかく", romaji = "Chikaku", hebrew = "בקרבת מקום", emoji = "📍", imageKeyword = "nearby close location"),
            VocabItem(japanese = "となり", romaji = "Tonari", hebrew = "בצד / שכן", emoji = "↔️", imageKeyword = "beside next adjacent neighbor"),
            VocabItem(japanese = "うえ", romaji = "Ue", hebrew = "על / למעלה", emoji = "⬆️", imageKeyword = "above top upper position"),
            VocabItem(japanese = "した", romaji = "Shita", hebrew = "תחת / למטה", emoji = "⬇️", imageKeyword = "below under lower position"),
            VocabItem(japanese = "まえ", romaji = "Mae", hebrew = "לפני / מול", emoji = "➡️", imageKeyword = "front before facing forward"),
            VocabItem(japanese = "うしろ", romaji = "Ushiro", hebrew = "מאחורי", emoji = "⬅️", imageKeyword = "behind back rear position"),
            VocabItem(japanese = "こうえん", romaji = "Kouen", hebrew = "גן / פארק", emoji = "🌳", imageKeyword = "park garden trees green")
        ),
        examples = listOf(
            Example(romaji = "Toire wa doko ni arimasu ka?", japanese = "トイレはどこにありますか？", hebrew = "איפה השירותים?"),
            Example(romaji = "Eki no chikaku ni arimasu.", japanese = "えきのちかくにあります。", hebrew = "נמצא ליד תחנת הרכבת."),
            Example(romaji = "Kouen ni kodomo ga imasu.", japanese = "こうえんにこどもがいます。", hebrew = "יש ילדים בגן."),
            Example(romaji = "Neko wa doko ni imasu ka?", japanese = "ねこはどこにいますか？", hebrew = "איפה החתול?"),
            Example(romaji = "Teeburu no ue ni arimasu.", japanese = "テーブルのうえにあります。", hebrew = "זה נמצא על השולחן."),
            Example(romaji = "Koko ni wa nani mo arimasen.", japanese = "ここにはなにもありません。", hebrew = "כאן לא נמצא שום דבר.")
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מתי משתמשים ב-あります ומתי ב-います?",
                options = listOf("אין הבדל", "あります = חיות, います = דברים", "あります = דברים, います = אנשים ובעלי חיים", "あります = חיובי, います = שלילי"),
                correctIndex = 2,
                explanation = "ההבדל: あります = קיום של דברים דוממים; います = קיום של אנשים ובעלי חיים"
            ),
            QuizQuestion(
                question = "כיצד שואלים 'איפה השירותים'?",
                options = listOf("トイレはどこにありますか", "トイレにいきます", "トイレがいます", "トイレはなんですか"),
                correctIndex = 0,
                explanation = "שירותים = דבר דומם, לכן: あります. + どこに = היכן/באיפה"
            ),
            QuizQuestion(
                question = "מה פירוש こうえんにこどもがいます?",
                options = listOf("הגן ליד הילדים", "הילדים הולכים לגן", "יש ילדים בגן", "הגן גדול"),
                correctIndex = 2,
                explanation = "[מקום] に [אדם] が います = יש [אדם] ב[מקום]. ילדים = חיים, לכן います"
            ),
            QuizQuestion(
                question = "כיצד אומרים 'אין כלום כאן'?",
                options = listOf("ここになにもいません", "ここになにもありません", "ここにありますない", "ここがありません"),
                correctIndex = 1,
                explanation = "なにも + ありません = אין שום דבר. מבנה: [מקום] に は なにも ありません"
            ),
            QuizQuestion(
                question = "מה פירוש テーブルのうえにあります?",
                options = listOf("השולחן גדול", "נמצא על השולחן", "מתחת לשולחן", "ליד השולחן"),
                correctIndex = 1,
                explanation = "うえ = למעלה/על. テーブルのうえ = על השולחן. + にあります = נמצא שם"
            ),
            QuizQuestion(
                question = "איזו שלילה נכונה לדבר דומם?",
                options = listOf("いません", "ありません", "ないません", "じゃありません"),
                correctIndex = 1,
                explanation = "ありません = שלילה של あります (דברים). いません = שלילה של います (אנשים/חיות)"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1011928545"
    )
}
