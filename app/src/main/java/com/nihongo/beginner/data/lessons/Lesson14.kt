package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson14 {
    val lesson = Lesson(
        id = 14,
        number = "שיעור 13",
        title = "מילית המקום: DE",
        subtitle = "DE (で) - Location",
        emoji = "🏠",
        grammarPoints = listOf(
            GrammarPoint(
                title = "de (で) - מקום הפעולה",
                content = "de (で) = 'ב-' / 'אצל' - מציינת מקום שבו הפעולה מתרחשת.\nמגיעה אחרי שם המקום.",
                pattern = "[מקום] de [פועל]"
            ),
            GrammarPoint(
                title = "de (で) - אמצעי / כלי",
                content = "de גם = 'ב-' / 'עם' / 'על ידי' - ציון אמצעי.\nדוגמה: kuruma de = במכונית, basu de = באוטובוס"
            ),
            GrammarPoint(
                title = "סדר המשפט המלא",
                content = "נושא → זמן + ni → מקום + de → מושא + wo → פועל\nהמקום בא אחרי הזמן ולפני המושא.",
                pattern = "[נושא] wa [זמן] ni [מקום] de [מושא] wo [פועל]"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "キッチン", romaji = "Kicchin", hebrew = "מטבח", emoji = "🍳", imageKeyword = "modern kitchen cooking utensils"),
            VocabItem(japanese = "ホテル", romaji = "Hoteru", hebrew = "מלון", emoji = "🏨", imageKeyword = "hotel lobby luxury chandelier"),
            VocabItem(japanese = "リビングルーム", romaji = "Ribingu rumu", hebrew = "סלון", emoji = "🛋️", imageKeyword = "living room cozy sofa plants"),
            VocabItem(japanese = "オフィス", romaji = "Ofisu", hebrew = "משרד", emoji = "🏢", imageKeyword = "open office modern desks"),
            VocabItem(japanese = "ジム", romaji = "Jimu", hebrew = "חדר כושר", emoji = "💪", imageKeyword = "gym weights fitness equipment"),
            VocabItem(japanese = "レストラン", romaji = "Resutoran", hebrew = "מסעדה", emoji = "🍴", imageKeyword = "restaurant interior cozy candles"),
            VocabItem(japanese = "パブ", romaji = "Pabu", hebrew = "בר / פאב", emoji = "🍻", imageKeyword = "pub bar interior drinks"),
            VocabItem(japanese = "うち / いえ", romaji = "Uchi / Ie", hebrew = "בית", emoji = "🏠", imageKeyword = "house exterior cozy garden"),
            VocabItem(japanese = "くるま", romaji = "Kuruma", hebrew = "מכונית", emoji = "🚗", imageKeyword = "car modern sleek vehicle"),
            VocabItem(japanese = "バス", romaji = "Basu", hebrew = "אוטובוס", emoji = "🚌", imageKeyword = "city bus stop urban street")
        ),
        examples = listOf(
            Example(
                romaji = "Watashi wa resutoran de tabemasu.",
                japanese = "わたしはレストランでたべます。",
                hebrew = "אני אוכל/ת במסעדה."
            ),
            Example(
                romaji = "Watashi wa resutoran de piza wo tabemasu.",
                japanese = "わたしはレストランでピザをたべます。",
                hebrew = "אני אוכל/ת פיצה במסעדה."
            ),
            Example(
                romaji = "Watashi wa 6 ji ni resutoran de piza wo tabemasu.",
                japanese = "わたしは6じにレストランでピザをたべます。",
                hebrew = "בשש אני אוכל/ת פיצה במסעדה."
            ),
            Example(
                romaji = "Watashi wa asa kicchin de nihongo wo hanashimasu.",
                japanese = "わたしはあさキッチンでにほんごをはなします。",
                hebrew = "בבוקר אני מדבר/ת יפנית במטבח."
            ),
            Example(
                romaji = "Watashi wa basu de shigoto ni ikimasu.",
                japanese = "わたしはバスでしごとにいきます。",
                hebrew = "אני הולך/ת לעבודה באוטובוס (de=אמצעי)."
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה עושה 'de' במשפט?",
                options = listOf("מציינת כיוון", "מציינת מקום הפעולה או אמצעי", "מציינת זמן", "מציינת נושא"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Jimu de yoga wo shimasu' פירושו:",
                options = listOf("הולך/ת לחדר כושר", "עושה יוגה בחדר כושר", "חדר כושר טוב", "יוגה בחדר"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Basu de ikimasu' - 'basu de' מציין:",
                options = listOf("יעד", "מקום הפעולה", "אמצעי תחבורה", "זמן"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "מה הסדר הנכון?",
                options = listOf("זמן + de → מקום + ni → מושא", "זמן + ni → מקום + de → מושא + wo", "מקום + de → זמן + ni → מושא", "מושא + wo → מקום + de → זמן"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "'Watashi wa ofisu de shigoto wo shimasu' פירושו:",
                options = listOf("אני הולך/ת למשרד", "אני עובד/ת במשרד", "אני גר/ה במשרד", "המשרד שלי"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "מה פירוש 'Kicchin'?",
                options = listOf("סלון", "משרד", "מטבח", "מסעדה"),
                correctIndex = 2
            ),
            QuizQuestion(
                question = "'Kuruma de ikimasu' פירושו:",
                options = listOf("הולך/ת לרכב", "הולך/ת ברכב (במכונית)", "נוהג/ת רכב", "רכב נוסע"),
                correctIndex = 1
            ),
            QuizQuestion(
                question = "איפה מגיעה 'de' במשפט?",
                options = listOf("אחרי הנושא", "אחרי הזמן, לפני המושא", "לפני הנושא", "בסוף המשפט"),
                correctIndex = 1
            )
        )
    )
}
