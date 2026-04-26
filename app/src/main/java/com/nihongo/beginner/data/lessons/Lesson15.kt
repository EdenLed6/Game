package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson15 {
    val lesson = Lesson(
        id = 15,
        number = "שיעור 14",
        title = "מילית הכיוון: NI",
        subtitle = "NI Direction (に)",
        emoji = "➡️",
        grammarPoints = listOf(
            GrammarPoint(
                title = "ni (に) - כיוון / יעד",
                content = "ni (に) = 'ל-' / 'אל' - מציינת יעד / כיוון.\nמשמשת עם פעלי תנועה: iku (ללכת), kuru (לבוא), kaeru (לחזור).",
                pattern = "[נושא] wa [יעד] ni [פועל תנועה]"
            ),
            GrammarPoint(
                title = "de vs. ni - ההבדל",
                content = "de = מקום שבו הפעולה מתרחשת\nni = יעד שאליו הולכים\nדוגמה:\n• Jimu de yoga wo shimasu = עושה יוגה בחדר כושר (de)\n• Jimu ni ikimasu = הולך/ת לחדר כושר (ni)"
            ),
            GrammarPoint(
                title = "soshite (そして) - חיבור משפטים",
                content = "soshite = 'ו-' / 'ואז' - מחבר בין שני משפטים.\nדוגמה: Jimu ni ikimashita. Soshite, yoga wo shimashita."
            ),
            GrammarPoint(
                title = "kinou (きのう) - אתמול",
                content = "kinou = אתמול. זמן יחסי → ללא ni!\nדוגמה: Kinou eiga wo mimashita. (ללא ni אחרי kinou)"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "きのう", romaji = "Kinou", hebrew = "אתמול", emoji = "📅"),
            VocabItem(japanese = "そして", romaji = "Soshite", hebrew = "ואז / ו- (חיבור)", emoji = "🔗"),
            VocabItem(japanese = "うみ", romaji = "Umi", hebrew = "ים", emoji = "🌊", imageKeyword = "ocean sea waves blue beach"),
            VocabItem(japanese = "しょっぴんぐもーる", romaji = "Shoppingu mo-ru", hebrew = "קניון", emoji = "🛍️", imageKeyword = "shopping mall interior stores"),
            VocabItem(japanese = "とうきょう", romaji = "Tokyou", hebrew = "טוקיו", emoji = "🗼", imageKeyword = "tokyo tower night city lights"),
            VocabItem(japanese = "うち / いえ", romaji = "Uchi / Ie", hebrew = "הבית", emoji = "🏠"),
            VocabItem(japanese = "ジム", romaji = "Jimu", hebrew = "חדר כושר", emoji = "💪")
        ),
        examples = listOf(
            Example(
                romaji = "Watashi wa Tokyou ni ikimasu.",
                japanese = "わたしはとうきょうにいきます。",
                hebrew = "אני הולך/ת לטוקיו."
            ),
            Example(
                romaji = "Watashi wa 6 ji ni Tokyou ni ikimasu.",
                japanese = "わたしは6じにとうきょうにいきます。",
                hebrew = "אני הולך/ת לטוקיו בשש."
            ),
            Example(
                romaji = "Watashi wa kuruma de Tokyou ni ikimasu.",
                japanese = "わたしはくるまでとうきょうにいきます。",
                hebrew = "אני הולך/ת לטוקיו במכונית."
            ),
            Example(
                romaji = "Watashi wa kinou 6 ji ni okimashita. Uchi de asagohan wo tabemashita. Soshite, jimu ni ikimashita. Jimu de yoga wo shimashita.",
                japanese = "わたしはきのう6じにおきました。うちであさごはんをたべました。そして、ジムにいきました。ジムでヨガをしました。",
                hebrew = "אתמול קמתי בשש. אכלתי ארוחת בוקר בבית. ואז הלכתי לחדר כושר. עשיתי יוגה בחדר כושר."
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "מה ההבדל בין 'de' ל-'ni' לגבי מקום?",
                options = listOf("שניהם זהים", "de=מקום הפעולה, ni=יעד תנועה", "ni=מקום הפעולה, de=יעד", "de=זמן, ni=מקום"),
                correctIndex = 1,
                explanation = "de = היכן הפעולה מתרחשת, ni = לאן הולכים"
            ),
            QuizQuestion(
                question = "'Umi ni ikimasu' פירושו:",
                options = listOf("שוחה בים", "הולך/ת לים", "שוחה מהים", "גר/ה ליד הים"),
                correctIndex = 1,
                explanation = "umi = ים, ikimasu = ללכת — ni = כיוון/יעד"
            ),
            QuizQuestion(
                question = "'Jimu de yoga wo shimasu' - 'de' מציין:",
                options = listOf("יעד - לחדר כושר", "מקום הפעולה - בחדר כושר", "אמצעי", "זמן"),
                correctIndex = 1,
                explanation = "הפעולה (yoga) מתרחשת בחדר הכושר — de = מקום פעולה"
            ),
            QuizQuestion(
                question = "מה פירוש 'soshite'?",
                options = listOf("אבל", "כי", "ואז / ו-", "אם"),
                correctIndex = 2,
                explanation = "soshite מחבר שני אירועים או פעולות"
            ),
            QuizQuestion(
                question = "'Kinou' (אתמול) - האם מוסיפים 'ni'?",
                options = listOf("כן, תמיד", "לא, זמן יחסי", "כן, אם יש שעה", "לפעמים"),
                correctIndex = 1,
                explanation = "kinou = אתמול — האם זה זמן עם מספר ספציפי?"
            ),
            QuizQuestion(
                question = "'Watashi wa shoppingu mo-ru ni kaerimasu' פירושו:",
                options = listOf("הולך/ת לקניון", "חוזר/ת לקניון", "קונה בקניון", "גר/ה בקניון"),
                correctIndex = 1,
                explanation = "kaeru = לחזור, ni = יעד"
            ),
            QuizQuestion(
                question = "'Watashi wa kuruma de Tokyou ni ikimasu' - כמה מיליות?",
                options = listOf("אחת (de)", "אחת (ni)", "שתיים (de + ni)", "שלוש"),
                correctIndex = 2,
                explanation = "de = אמצעי, ni = יעד — שתי מיליות שונות"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1033593749",
        practiceCards = listOf(
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "אני הולך/ת לטוקיו.",
                answer = "Watashi wa Tokyou ni ikimasu.",
                audioText = "Watashi wa Tokyou ni ikimasu",
                inputHint = "כתבו את המשפט בתעתיק..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "אני הולך/ת לחדר כושר.",
                answer = "Watashi wa jimu ni ikimasu.",
                audioText = "Watashi wa jimu ni ikimasu",
                inputHint = "כתבו את המשפט בתעתיק..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "אני הולך/ת לטוקיו במכונית.",
                answer = "Watashi wa kuruma de Tokyou ni ikimasu.",
                audioText = "Watashi wa kuruma de Tokyou ni ikimasu",
                inputHint = "כתבו את המשפט בתעתיק..."
            ),
            PracticeCard(
                promptLabel = "כיצד אומרים ביפנית?",
                prompt = "ים",
                answer = "Umi",
                audioText = "Umi",
                inputHint = "כתבו את התעתיק היפני..."
            ),
            PracticeCard(
                promptLabel = "כיצד אומרים ביפנית?",
                prompt = "קניון",
                answer = "Shoppingu mo-ru",
                audioText = "Shoppingu mo-ru",
                inputHint = "כתבו את התעתיק היפני..."
            ),
            PracticeCard(
                promptLabel = "תרגמו לרומאג'י:",
                prompt = "אתמול הלכתי לחדר כושר.",
                answer = "Kinou jimu ni ikimashita.",
                audioText = "Kinou jimu ni ikimashita",
                inputHint = "כתבו את המשפט בתעתיק..."
            )
        )
    )
}
