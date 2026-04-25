package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson20 {
    val lesson = Lesson(
        id = 20,
        number = "מטיילים 3",
        title = "מקומות",
        subtitle = "ばしょ (Basho)",
        emoji = "🗺️",
        grammarPoints = listOf(
            GrammarPoint(
                title = "שאלת מיקום — どこ (doko)?",
                content = "דרך לשאול 'איפה': [מקום] はどこですか？",
                pattern = "えきはどこですか？(Eki wa doko desu ka? — איפה התחנה?)"
            ),
            GrammarPoint(
                title = "מילית で (de) — מקום הפעולה",
                content = "מציינת היכן מתרחשת פעולה:\nレストランでたべます = אוכל במסעדה",
                pattern = "[מקום] で [פעולה]"
            ),
            GrammarPoint(
                title = "מילית に (ni) — כיוון/יעד",
                content = "מציינת לאן הולכים:\nえきに いきます = הולך לתחנה",
                pattern = "[מקום] に いきます"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "えき", romaji = "Eki", hebrew = "תחנת רכבת", emoji = "🚉", imageKeyword = "train station japan platform"),
            VocabItem(japanese = "ホテル", romaji = "Hoteru", hebrew = "מלון", emoji = "🏨", imageKeyword = "hotel building luxury"),
            VocabItem(japanese = "くうこう", romaji = "Kuukou", hebrew = "שדה תעופה", emoji = "✈️", imageKeyword = "airport terminal planes"),
            VocabItem(japanese = "バスてい", romaji = "Basutei", hebrew = "תחנת אוטובוס", emoji = "🚌", imageKeyword = "bus stop sign street"),
            VocabItem(japanese = "レストラン", romaji = "Resutoran", hebrew = "מסעדה", emoji = "🍽️", imageKeyword = "restaurant dining interior"),
            VocabItem(japanese = "デパート", romaji = "Depaato", hebrew = "כלבו", emoji = "🏬", imageKeyword = "department store shopping mall"),
            VocabItem(japanese = "スーパー", romaji = "Suupaa", hebrew = "סופרמרקט", emoji = "🛒", imageKeyword = "supermarket grocery store"),
            VocabItem(japanese = "ぎんこう", romaji = "Ginkou", hebrew = "בנק", emoji = "🏦", imageKeyword = "bank building finance"),
            VocabItem(japanese = "びょういん", romaji = "Byouin", hebrew = "בית חולים", emoji = "🏥", imageKeyword = "hospital medical building"),
            VocabItem(japanese = "じんじゃ", romaji = "Jinja", hebrew = "מקדש שינטו", emoji = "⛩️", imageKeyword = "shinto shrine torii gate japan"),
            VocabItem(japanese = "おてら", romaji = "Otera", hebrew = "מקדש בודהיסטי", emoji = "🛕", imageKeyword = "buddhist temple pagoda japan"),
            VocabItem(japanese = "けいさつ", romaji = "Keisatsu", hebrew = "משטרה", emoji = "👮", imageKeyword = "police station japan")
        ),
        examples = listOf(
            Example(romaji = "Eki wa doko desu ka?", japanese = "えきはどこですか？", hebrew = "איפה תחנת הרכבת?"),
            Example(romaji = "Hoteru ni ikimasu.", japanese = "ホテルにいきます。", hebrew = "אני הולך/ת למלון."),
            Example(romaji = "Resutoran de tabemasu.", japanese = "レストランでたべます。", hebrew = "אני אוכל/ת במסעדה."),
            Example(romaji = "Kuukou wa doko desu ka?", japanese = "くうこうはどこですか？", hebrew = "איפה שדה התעופה?"),
            Example(romaji = "Ginkou ni ikitai desu.", japanese = "ぎんこうにいきたいです。", hebrew = "אני רוצה ללכת לבנק."),
            Example(romaji = "Jinja wa kirei desu.", japanese = "じんじゃはきれいです。", hebrew = "המקדש יפה.")
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה פירוש えき?",
                options = listOf("שדה תעופה", "תחנת רכבת", "מלון", "תחנת אוטובוס"),
                correctIndex = 1,
                explanation = "えき (eki) = תחנת רכבת. ביפן קיימת רשת רכבות ענפה ותחנות הן מוקד מרכזי"
            ),
            QuizQuestion(
                question = "איזה particle מציין 'היכן מתרחשת פעולה'?",
                options = listOf("に", "を", "で", "の"),
                correctIndex = 2,
                explanation = "で (de) = מקום הפעולה. ההבדל: レストランで (אוכל שם) לעומת レストランに (הולך לשם)"
            ),
            QuizQuestion(
                question = "כיצד שואלים 'איפה המלון'?",
                options = listOf("ホテルにいきます", "ホテルはどこですか", "ホテルがあります", "ホテルでたべます"),
                correctIndex = 1,
                explanation = "どこ = איפה. [מקום] はどこですか = שאלת מיקום בסיסית"
            ),
            QuizQuestion(
                question = "מה ההבדל בין じんじゃ לבין おてら?",
                options = listOf("שניהם אותו הדבר", "じんじゃ = שינטו, おてら = בודהיסטי", "じんじゃ = בודהיסטי, おてら = שינטו", "じんじゃ = כנסייה, おてら = מסגד"),
                correctIndex = 1,
                explanation = "שתי דתות עיקריות ביפן: שינטו (じんじゃ — jinja) ובודהיזם (おてら — otera)"
            ),
            QuizQuestion(
                question = "כיצד אומרים 'הולך לתחנת הרכבת'?",
                options = listOf("えきでいきます", "えきをいきます", "えきにいきます", "えきのいきます"),
                correctIndex = 2,
                explanation = "に (ni) = כיוון/יעד. לכן: えきに いきます = הולך לתחנה"
            ),
            QuizQuestion(
                question = "מה פירוש くうこう?",
                options = listOf("שדה תעופה", "נמל ים", "תחנת רכבת", "מסוף אוטובוסים"),
                correctIndex = 0,
                explanation = "くうこう (kuukou) = שדה תעופה. מורכב מ-空 (שמיים) + 港 (נמל)"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1150067870"
    )
}
