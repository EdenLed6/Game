package com.nihongo.beginner.data.lessons

import com.nihongo.beginner.data.*

object Lesson02 {
    val lesson = Lesson(
        id = 2,
        number = "שיעור 2",
        title = "מילות ברכה",
        subtitle = "Greetings",
        emoji = "🙏",
        grammarPoints = listOf(
            GrammarPoint(
                title = "ברכות ביפנית",
                content = "תמיד מברכים יחד עם קידה קלה. ביפנית יש שפה פורמלית ולא פורמלית. מקובל לפנות בצורה פורמלית. חשוב מאוד לא להשתמש בצורה הלא פורמלית עם אנשים שאינם קרובים."
            ),
            GrammarPoint(
                title = "פורמלי vs. לא פורמלי",
                content = "הצורה הפורמלית: Ohayougozaimasu, Arigatougozaimasu, Oyasuminasai\nהצורה הלא פורמלית (*): Ohayou, Arigatou, Oyasumi\n* לשימוש עם חברים קרובים/משפחה בלבד"
            )
        ),
        vocabulary = listOf(
            VocabItem(japanese = "おはよう", romaji = "Ohayou", hebrew = "בוקר טוב (לא פורמלי)", emoji = "😊", imageKeyword = "morning sunrise stretch happy"),
            VocabItem(japanese = "おはようございます", romaji = "Ohayougozaimasu", hebrew = "בוקר טוב (פורמלי)", emoji = "🌅", imageKeyword = "morning bow greeting formal"),
            VocabItem(japanese = "こんにちは", romaji = "Konnichiwa", hebrew = "שלום / צהריים טובים", emoji = "👋", imageKeyword = "waving hello smiling outdoor"),
            VocabItem(japanese = "ありがとう", romaji = "Arigatou", hebrew = "תודה (לא פורמלי)", emoji = "❤️", imageKeyword = "gratitude thank you hands"),
            VocabItem(japanese = "ありがとうございます", romaji = "Arigatougozaimasu", hebrew = "תודה (פורמלי)", emoji = "🙏", imageKeyword = "formal bow thank you"),
            VocabItem(japanese = "すいません", romaji = "Suimasen", hebrew = "סליחה / התנצלות", emoji = "🙇", imageKeyword = "sorry apologize bow"),
            VocabItem(japanese = "こんばんは", romaji = "Konbanwa", hebrew = "ערב טוב", emoji = "🌙", imageKeyword = "evening city dusk lights"),
            VocabItem(japanese = "おやすみ", romaji = "Oyasumi", hebrew = "לילה טוב (לא פורמלי)", emoji = "😴", imageKeyword = "sleeping night peaceful moon"),
            VocabItem(japanese = "おやすみなさい", romaji = "Oyasuminasai", hebrew = "לילה טוב (פורמלי)", emoji = "🌟", imageKeyword = "goodnight stars peaceful"),
            VocabItem(japanese = "いただきます", romaji = "Itadakimasu", hebrew = "ברכה לפני האוכל", emoji = "🍱", imageKeyword = "japanese meal rice chopsticks"),
            VocabItem(japanese = "ごちそうさまでした", romaji = "Gochisou sama deshita", hebrew = "ברכה אחרי האוכל", emoji = "🍽️", imageKeyword = "empty bowl satisfied meal"),
            VocabItem(japanese = "おつかれさま", romaji = "Otsukare sama", hebrew = "כל הכבוד / אחרי עבודה", emoji = "💪", imageKeyword = "tired office worker end of day"),
            VocabItem(japanese = "はじめまして", romaji = "Hajimemashite", hebrew = "נעים להכיר", emoji = "🤝", imageKeyword = "handshake meeting first time"),
            VocabItem(japanese = "よろしくおねがいします", romaji = "Yoroshiku onegai shimasu", hebrew = "שמחה לשמור קשר", emoji = "🤗"),
            VocabItem(japanese = "さようなら", romaji = "Sayounara", hebrew = "להתראות", emoji = "👋", imageKeyword = "goodbye farewell waving"),
            VocabItem(japanese = "いってきます", romaji = "Ittekimasu", hebrew = "אני הולך/ת (יוצא/ת מהבית)", emoji = "🚶", imageKeyword = "leaving home door bag"),
            VocabItem(japanese = "いってらっしゃい", romaji = "Itterasshai", hebrew = "לך/כי בשלום (תגובה)", emoji = "🏠", imageKeyword = "waving doorway home departure")
        ),
        examples = listOf(
            Example(
                romaji = "Ohayougozaimasu!",
                japanese = "おはようございます！",
                hebrew = "בוקר טוב! (בבוקר)"
            ),
            Example(
                romaji = "A: Itadakimasu! / B: Gochisou sama deshita.",
                japanese = "いただきます！/ ごちそうさまでした。",
                hebrew = "לפני האוכל / אחרי האוכל"
            ),
            Example(
                romaji = "A: Hajimemashite. Watashi wa Yamada desu. Yoroshiku onegaishimasu.",
                japanese = "はじめまして。わたしはやまだです。よろしくおねがいします。",
                hebrew = "פגישה ראשונה: נעים להכיר, אני יאמדה, שמחה להכיר."
            ),
            Example(
                romaji = "A: Ittekimasu! / B: Itterasshai!",
                japanese = "いってきます！/ いってらっしゃい！",
                hebrew = "יוצא/ת מהבית / תגובה: לך בשלום"
            )
        ),
        exercises = listOf(
            QuizQuestion(
                question = "איך אומרים 'בוקר טוב' בצורה פורמלית?",
                options = listOf("Ohayou", "Ohayougozaimasu", "Konnichiwa", "Konbanwa"),
                correctIndex = 1,
                explanation = "יש קיצור יומיומי ויש גרסה ארוכה ופורמלית של אותה ברכה"
            ),
            QuizQuestion(
                question = "מה אומרים לפני האוכל?",
                options = listOf("Sayounara", "Itadakimasu", "Otsukare sama", "Suimasen"),
                correctIndex = 1,
                explanation = "ביפנית יש ביטוי מיוחד לפני שמתחילים לאכול — כמו 'בתיאבון' אבל שונה"
            ),
            QuizQuestion(
                question = "מה פירוש Suimasen?",
                options = listOf("תודה", "שלום", "סליחה", "להתראות"),
                correctIndex = 2,
                explanation = "Suimasen נשמע כ-'sorry/excuse me' — מה ביטוי כזה מביע?"
            ),
            QuizQuestion(
                question = "איך אומרים 'ערב טוב'?",
                options = listOf("Ohayou", "Konnichiwa", "Konbanwa", "Oyasumi"),
                correctIndex = 2,
                explanation = "Konban = ערב, Konnichiwa = שלום (בשעות הצהריים)"
            ),
            QuizQuestion(
                question = "מה פירוש Hajimemashite?",
                options = listOf("להתראות", "בוקר טוב", "נעים להכיר", "תודה רבה"),
                correctIndex = 2,
                explanation = "Hajime = התחלה ביפנית — ואמנם הביטוי אומרים בהיכרות ראשונה"
            ),
            QuizQuestion(
                question = "מה עונים כשמישהו אומר Ittekimasu?",
                options = listOf("Sayounara", "Itterasshai", "Oyasumi", "Otsukare sama"),
                correctIndex = 1,
                explanation = "Ittekimasu = 'אני הולך' — מה מנחים מישהו שיוצא ויחזור?"
            ),
            QuizQuestion(
                question = "איזו ברכה משתמשים אחרי אוכל?",
                options = listOf("Itadakimasu", "Konnichiwa", "Gochisou sama deshita", "Hajimemashite"),
                correctIndex = 2,
                explanation = "יש ברכה לפני האוכל ויש ברכה מקבילה אחרי — מה שמה?"
            ),
            QuizQuestion(
                question = "מה אומרים אחרי עבודה קשה?",
                options = listOf("Arigatou", "Suimasen", "Otsukare sama", "Konbanwa"),
                correctIndex = 2,
                explanation = "Otsukare = עייפות/מאמץ — מה אומרים כשמכירים במאמץ של מישהו?"
            )
        ),
        videoUrl = "https://player.vimeo.com/video/1032825918"
    )
}
