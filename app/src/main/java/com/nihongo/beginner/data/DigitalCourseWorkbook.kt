package com.nihongo.beginner.data

object DigitalCourseWorkbook {
    private val pageTexts: Map<Int, String> = mapOf(
        1 to """い
う
え
か
き
く
け
こ
さ
せ
そ
な
に
ぬ
ね
ひ
ふ
へ
ほ
ま
み
む
も
や
ゆ
よ
ら
り
れ
ろ
わ
お
קורס יפנית 
למתחילים 
⽇ 本 語
初 級 コ ー ス""".trimIndent(),
        2 to """מבוא לחוברת התרגול 
– יפנית למתחילים 
ברוכים הבאים לחוברת התרגול שלכם בלימוד השפה היפנית! 
חוברת זו נבנתה במיוחד עבור תלמידי הקורס, במטרה לעזור לכם 
להעמיק את ההבנה, לתרגל בצורה עצמאית, ולשפר את הביטחון בקריאה, 
כתיבה, דקדוק ושיחה. 
מה תמצאו בחוברת
סיכומים תמציתיים של 
 נושאים דקדוקיים 
תרגולים ממוקדים 
דיאלוגים קצרים - לתרגול 
הבנה, קריאה והגייה. 
ימת אוצר מילים שימושית רש 
המלצות ללמידה אפקטיבית 
קראו את הסיכומים – אך כתבו אותם מחדש במילים שלכם במחברת 
 נפרדת. - מחקרים מראים שסיכום עצמי מגביר את ההבנה והזיכרון 
בצעו את התרגולים ללא עזרים – ואז בדקו את עצמכם. 
 עברו שוב על תרגולים קודמים מדי שבוע 
קראו בקול רם את הדיאלוגים – מומלץ להקליט את עצמכם ולשמוע. 
あ
*חוברת זו מיועדת לשימוש אישי בלבד כחלק 
אין לשכפל, להעביר או להפיץ את  מהקורס. 
 החוברת לגורמים אחרים ללא אישור 
 
ניתן ורצוי להדפיס את החוברת – ולשמור אותה 
לצורך תרגול עצמאי.""".trimIndent(),
        3 to """הגיה 
יפנית היא שפה פשוטה מבחינת ההגייה
(a i u e oשפה ללא עיצורים )חייבים לסיים עם תנועה
”nניתן לסיים את המילה עם עיצור
 
J a p a n g l i s hתרגיל
1 . C i n e m a 
2 . L o v e 
3 . I n s t a g r a m 
4 . M i l k 
5 . L o u i s V u i t t o n 
6 .שם שלך 
J a p a n g l i s hהפכו את המילים הבאות ל־ 
1
האלטרנטיבה 
המילה 
J a p a n g l i s h
V   →   B
v i n t a g e 
b i n t e j i
R →  יפני R
 r o b o t
 r o b o t o
L →  יפני R
I s r a e l
I s u r a e r u
C i →   S h i
S i v a n
 S h i b a n
Z i →   J i
Z i v a
J i b a
צלילים הלא קיימים ביפנית + אלטרנטיבה""".trimIndent(),
        4 to """- מילות ברכה 2שיעור 
תמיד מברכים יחד עם קידה 
ביפנית יש שפה פורמלית ולא פורמלית 
מקובל לפנות בצורה פורמלית 
♡)לשים לב 
לא לפנות בצורה לא פורמלית - לא מקובל( 
רשימת מילות ברכה
בוקר טוב 
 בוקר טוב 
שלום 
תודה * 
 תודה 
סליחה 
ערב טוב 
לילה טוב 
O h a y o u
O h a y o u g o z a i m a s u
K o n n i c h i w a
A r i g a t o u
A r i g a t o u g o z a i m a s u
S u i m a s e n
K o n b a n w a
O y a s u m i
*צורה לא פורמלית 
I t a d a k i m a s u
G o c h i s o u s a m a ( d e s h i t a )
O t s u k a r e s a m a
H a j i m e m a s h i t e
Y o r o s h i k u o n e g a i s h i m a s u
ברכה לפני הארוחה 
ברכה אחרי העבודה 
ברכה אחרי מאמץ 
נעים להכיר 
ברכה לשמירת הקשר 
2""".trimIndent(),
        5 to """こ ん に ち は
は じ め ま し て
・ ・ ・ で す 
よ ろ し く お ね が い し ま す
Konnichiwa
Hajimemashite
...Desu
Yoroshiku onegaishimasu
תבנית הצגה עצמית
מוזמנים לשלוח 
לליהי הקלטה 
של הצגה 
עצמית 
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
3""".trimIndent(),
        6 to """תרגיל מילות ברכה
התאימו את הברכה לתמונה
4""".trimIndent(),
        7 to """7 .
9 .
תרגיל מילות ברכה - תשובה
O h a y o u A r i g a t o u K o n b a n w a
S u i m a s e n G o c h i s o u s a m a d e s h i t ai t a d a k i m a s u
i t t e k i m a s u
i t t e r a s s h a i
H a j i m e m a s h i t e S a y o u n a r a 
O y a s u m i n a s a i K o n n i c h i w a
5""".trimIndent(),
        8 to """w a . . . d e s u . . . - 4שיעור 
דיאלוג
こ ん に ち は
は じ め ま し て
わ た し は や ま だ た ろ う で す
エ ン ジ ニ ア で す
よ ろ し く お ね が い し ま す
Konnichiwa 
Hajimemashite
Watashi wa Yamada Tarou desu
Enjinia desu
Yoroshiku onegaishimasu
はじめまして
わたしはきむらりひです
にほんごのせんせいです
よろしくおねがいします
Hajimemashite
Watashi wa Kimura Lihi desu
Nihongo no sensei desu
Yoroshiku onegaishimasu
אוצר מילים
こ ん に ち は
K o n n i c h i w a
שלום
は じ め ま し て
H a j i m e m a s h i t e
נעים להכיר
わ た し
W a t a s h i
אני
え ん じ に あ
E n j i n i a
מהנדס
よ ろ し く お ね が い し ま す
Y o r o s h i k u o n e g a i s h i m a s u
ברכה לתחילת/שמירת קשר
に ほ ん
N i h o n
יפן
〜 ご
〜 g o
שפה ה
せ ん せ い
S e n s e i
מורה
6""".trimIndent(),
        9 to """... w a ... d e s uדוגמה
... W A . . . D E S U - 4שיעור 
1 . W a t a s h i w a R i h i d e s u (אני ליהי )
2 . T a n a k a s a n w a S e n s e i d e s u (מר טאנקה הוא מורה )
3 . K o r e w a I p h o n e ( A i h o n ) d e s u (זה איפון )
4 . A n a t a w a R i h i d e s u k a (את ליהי האם )
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
 - סיומת פורמליתdesu
 - מילית לציון נושאwa
מוסיפים בסוף משפט )אחרי שמות עצם
נותן משקל של הווה / עתיד desu
ביפנית אין הבדל בין
הווה-עתיד, זכר-נקבה, יחיד-רבים.
Kaמשפט שאלה על ידי תוספת
7""".trimIndent(),
        10 to """... w a ... d e s uתרגיל
... W A . . . D E S U - 4שיעור 
.1 אני מורה 
.2 אני מתכנת 
.3 טאנקה הוא מהנדס 
.4 טאנקה היא מדריכה 
.5 מנהל סוזוקי הוא האם 
.6 האם סוזוקי הוא מנהל מכירות 
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
8""".trimIndent(),
        11 to """w a . . . d e s u . . . - 4שיעור 
אוצר מילים
イ ス ラ エ ル
I s u r a e r u
ישראל
フ ラ ン ス
F u r a n s u
צרפת
ア メ リ カ
A m e r i c a
ארה"ב
ロ シ ア
R o s h i a
רוסיה
に ほ ん
N i h o n
יפן
か ん こ く
K a n k o k u
קוראה
ち ゅ う ご く
C h u g o k u
סין
: אדם ממוצא j i n
 אחרי שם המדינה וליצור מילה J i nניתן להוסיף את מילה 
 חדשה, “אדם ממוצא...” 
לדוג: 
N i h o n + J i n = N i h o n j i n
יפן אדם ממוצא + איש יפני = 
9""".trimIndent(),
        12 to """... w a ... d e s uתרגיל
... W A . . . D E S U - 4שיעור 
. 1 אני ישראלי/ת 
.2 אני יפני/ת 
.3 האם אתה יפני 
.4 האם קימורה סאן אמריקאי 
.5 דוד הוא צרפתי 
.6 ואן סאן היא סינית 
J i nתרגיל: הרכבת משפטים עם
Tom
Maria
Tanaka
Wan
Kim
Anna
Bob
1 . M a r i a s a n w a F u r a n s u j i n d e s u
2 . 
3 . 
4 . 
5 . 
6 . 
7 . 
 
1 0""".trimIndent(),
        13 to """- 5שיעור 
w a . . . j a n a i d e s u . . .
דיאלוג
A : K im s a n w a C h u g o k u jin d e s u k a .
B : Iie , K im s a n w a C h u g o k u jin ja n a i d e s u .
 K a n k o k u jin d e s u .
A : S u z u k i s a n w a K a n k o k u jin d e s u k a .
B : Iie , K a n k o k u jin ja n a id e s u .
 N ih o n jin d e s u .
A : き む さ ん は ち ゅ う ご く じ ん で す か ？
B : い い え 、 き む さ ん は ち ゅ う ご く じ ん じ ゃ な い で す 。
 か ん こ く じ ん で す 。
A : す ず き さ ん は か ん こ く じ ん で す か ？
B : い い え 、 か ん こ く じ ん じ ゃ な い で す 。
 に ほ ん じ ん で す
 - סיומת פורמלית - שלילהjanaidesu
סדר בניית משפטים לא משתנה
דוגמה:
Kim san wa Chugoku jin desu ka.
Iie, Kim san wa Chugoku jin janai desu.
ציון נושא
שלילה
סיומת פורמלית
"סיני לא הוא קים , לא "
1 1""".trimIndent(),
        14 to """... w a ... j a n a i d e s uתרגיל
 - 5שיעור 
. 1 אני לא ישראלי/ת 
.2 אני לא מורה 
.3 טנאקה לא מהנדס 
.4 האם אתה לא יפני 
.5 קים היא לא מדריכה 
.6 ואן סאן היא לא סינית 
1 . W a t a s h i w a R i h i d e s u 
2 . S u z u k i s a n w a e n j i n i a d e s u 
3 . T a n a k a s a n w a k a n k o k u j i n d e s u 
4 . K i m u r a s a n w a F u r a n s u j i n d e s u 
5 . W a t a s h i w a s e - r u s u m a n e - j a - d e s u 
6 . N o a s a n w a i n s u t o r a k u t a - d e s u 
7 . N a m i s a n w a N i h o n j i n d e s u 
8 . T o m u s a n w a P u r o g u r a m a - d e s u 
תרגול שלילה
 תהפכו את המשפטים הבאים לצורת שלילה ותתרגמו לעברית בבקשה 
1 2""".trimIndent(),
        15 to """... n oדוגמה
- של 6שיעור 
1 . S u z u k i s a n n o p e n (סוזוקי מר של עט )
2 . H o n d a s a n n o n o - t o (מר הונדה של מחברת )
3 . K a w a s a k i s a n n o s h a t s u (חולצה של גברת קווסקי )
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
" : מילית המציינת שייכות )"שלno の"
 באנגליתsסדר הפוך מעברית )מקביל ל
S u z u k i s a n n o p e n
מר סוזוקי
של
עט
= עט של מר סוזוקי 
1 3""".trimIndent(),
        16 to """” n oתרגיל: שייכות
.1זה קפה שלי 
.2זה ספר של ליהי 
.3זה טלפון של מאי 
.4זו מחברת של מייקו 
.5זה לא שעון של טאנקה 
.6זו לא חולצה של סוזוקי 
.7זה לא עט של תום 
.8זה לא תיק של איש יפני 
1 . K o r e w a w a t a s h i n o k o - h i - d e s u
2 . 
3 . 
4 . 
5 . 
6 . 
7 . 
8 . 
תתרגמו את המשפטים הבאים 
אוצר מילים
コ ー ヒ ー k o - h i -קפה 
ほ ん h o nספר 
ス マ ホ s u m a h oטלפון חכם 
ノ ー ト n o - t oמחברת 
と け い t o k e iשעון 
か ば ん k a b a nתיק 
シ ャ ツ s h a t s uחולצה 
ペ ン p e nעט 
1 4""".trimIndent(),
        17 to """- 7שיעור 
k o r e s o r e a r e 
דיאלוג
A : K o r e w a o s o b a d e s u k a .
B : I i e , s o r e w a r a - m e n d e s u y o .
 o i s h i i d e s u y o .
A : K o r e w a o n i k u d e s u n e .
B : H a i , o n i k u d e s u .
A : こ れ は お そ ば で す か ？
B : い い え 、 そ れ は ラ ー メ ン で す よ 。
 お い し い で す よ 。
A : こ れ は お に く で す か ？
B : は い 、 お に く で す 。
ラ ー メ ン
R a m e n
ראמן
そ ば
s o b a
אטריות סובה
に く
n i k u
בשר
お い し い
o i s h i i
טעים
ね
n e
סיומת ריכוך
こ れ
k o r e
זה
אוצר מילים
1 5""".trimIndent(),
        18 to """＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
- 7שיעור 
k o r e s o r e a r e 
בשפה היפנית ישנם שלושה סוגים של "זה 
 : "זה" הקרוב לדובר k o r e
 :"זה" הקרוב לשומע s o r e
 :"זה" הרחוק מכולם a r e
1 6""".trimIndent(),
        19 to """- מספרים שיעור בונוס 
ゼ ロ ∕ れ い
い ち
に
さ ん
よ ん ∕ し
ご
ろ く
な な ∕ し ち
は ち
き ゅ う
じ ゅ う
zero/ rei
ichi
ni
san
yon / shi
go
roku
nana/ shichi
hachi
kyuu
juu 
0
1
2
3
4
5
6
7
8
9
10
juu ichi
juu ni
juu san
juu yon / juu shi
juu go
juu roku
juu nana/ juu shichi
juu hachi
juu kyuu
ni juu 
ni juu ichi
11
12
13
14
15
16
17
18
19
2 0
2 1
1 7""".trimIndent(),
        20 to """- מספרים שיעור בונוס 
juu 
 ni juu
san juu 
yon juu 
go juu 
 roku juu
nana juu 
hachi juu 
kyuu juu 
hyaku
1 0
2 0
3 0
4 0
5 0
6 0
7 0
8 0
9 0
1 0 0
hyaku
ni hyaku
*san byaku
yon hyaku
go hyaku
*roppyaku
nana hyaku
*happyaku
kyuu hyaku
1 0 0
2 0 0
3 0 0
4 0 0
5 0 0
6 0 0
7 0 0
8 0 0
9 0 0
1 8""".trimIndent(),
        21 to """- מספרים שיעור בונוס 
sen
 ni sen
*san zen
yon sen
go sen
 roku sen
nana sen
*hassen
kyuu sen
1 0 0 0
2 0 0 0
3 0 0 0
4 0 0 0
5 0 0 0
6 0 0 0
7 0 0 0
8 0 0 0
9 0 0 0
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
1 9""".trimIndent(),
        22 to """תרגיל
מספרים תרגול 
בבקשה ביפנית המספרים את תכתבו ** 
1 . 8
2 . 1 7
3 . 5 6
4 . 2 0
5 . 1 9
6 . 1 0 8
7 . 2 4 0
8 . 6 8 9
9 . 9 9 0
1 0 . 7 0 0 0
1 1 . 9 0 2 0
1 2 . 1 9 9 5
1 3 . 7 6 5 3
1 4 . 8 3 0 0
1 5 . 5 1 3 2
1 6 . 6 6 9 8
1 . h a c h i
2 . 
3 . 
4 . 
5 . 
6 . 
7 . 
8 . 
9 . 
1 0 . 
1 1 . 
1 2 . 
1 3 . 
1 4 . 
1 5 . 
1 6 . 
2 0""".trimIndent(),
        23 to """מספרים תרגול 
תשובות *
1 . 8
2 . 1 7
3 . 5 6
4 . 2 0
5 . 1 9
6 . 1 0 8
7 . 2 4 0
8 . 6 8 9
9 . 9 9 0
1 0 . 7 0 0 0
1 1 . 9 0 2 0
1 2 . 1 9 9 5
1 3 . 2 6 5 3
1 4 . 8 3 0 0
1 5 . 5 1 3 2
1 6 . 6 6 9 8
1 . h a c h i
2 . j u u n a n a
3 . g o j u u r o k u
4 . n i j u u
5 . j u u k y u u
6 . h y a k u h a c h i
7 . n i h y a k u y o n j u u
8 . r o p p y a k u h a c h i j u u k y u u
9 . k y u u h u a k u k y u u j u u
1 0 . n a n a s e n
1 1 . k y u u s e n n i j u u
1 2 . s e n k y u u h y a k u k y u u j u u g o
1 3 . n i s e n r o p p y a k u g o j u u s a n 
1 4 . h a s s e n s a n b y a k u
1 5 . g o s e n h y a k u s a n j u u n i
1 6 . r o k u s e n r o p p y a k u k y u u j u u
h a c h i
2 1""".trimIndent(),
        24 to """מספרים תרגול 
*הנכון המספר את ותכתבו היפנית את תקראו 
1 . g o
2 . k y u u
3 . z e r o
4 . j u u
5 . j u u r o k u
6 . s a n j u u
7 . y o n j u u h a c h i
8 . k y u u j u u n i
9 . j u u n a n a
1 0 . h y a k u y o n
1 1 . s a n b y a k u
1 2 . r o p p y a k u s a n j u u
1 3 . s e n h a p p y a k u n a n a j u u
1 4 . h a s s e n j u u g o
1 5 . y o n s e n k y u u h y a k u
1 6 . n i s e n s a n b y a k u g o j u u
1 . 5
2 . 
3 . 
4 . 
5 . 
6 . 
7 . 
8 . 
9 . 
1 0 . 
1 1 . 
1 2 . 
1 3 . 
1 4 . 
1 5 . 
1 6 .
2 2""".trimIndent(),
        25 to """מספרים תרגול 
תשובות 
1 . g o
2 . k y u u
3 . z e r o
4 . j u u
5 . j u u r o k u
6 . s a n j u u
7 . y o n j u u h a c h i
8 . k y u u j u u n i
9 . j u u n a n a
1 0 . h y a k u y o n
1 1 . s a n b y a k u
1 2 . r o p p y a k u s a n j u u
1 3 . s e n h a p p y a k u n a n a j u u
1 4 . h a s s e n j u u g o
1 5 . y o n s e n k y u u h y a k u
1 6 . n i s e n s a n b y a k u g o j u u
1 . 5
2 . 9 
3 . 0
4 . 1 0
5 . 1 6
6 . 3 0
7 . 4 8
8 . 9 2
9 . 1 7
1 0 . 1 0 4
1 1 . 3 0 0
1 2 . 6 3 0
1 3 . 1 8 7 0
1 4 . 8 0 1 5
1 5 . 4 9 0 0
1 6 . 2 3 5 0
2 3""".trimIndent(),
        26 to """- 8שיעור 
k o n o s o n o a n o
בשפה היפנית ישנם שלושה סוגים של "זה 
: "זה" הקרוב לדובר k o n o
 :"זה" הקרוב לשומע s o n o
 :"זה" הרחוק מכולם a n o
 חייב לבוא שם עצם k o n o , s o n o , a n oאחרי 
k o n o , s o n o , a n o + n o u n 
 k o n o s o n o a n o דוגמה
1 . K o n o n o - t o w a 1 0 0 e n d e s u ( ין 1 0 0המחברת הזאת )
2 . S o n o o s o b a w a o i s h i i d e s u k a ? (האם סובה הזה טעים )
3 . A n o n i h o n j i n w a S u z u k i s a n j a n a i d e s u (היפני ההוא לא סוזוקי )
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
2 4""".trimIndent(),
        27 to """- 8שיעור 
k o n o s o n o a n o
ス マ ホ
S u m a h o
סמארט-פון / טלפון חכם
カ ー ド
K a a d o
כרטיס אשראי
と け い
T o k e i
שעון
か さ
K a s a
מטריה
さ い ふ
S a i f u
ארנק
か ば ん
K a b a n
תיק
く つ
K u t s u
נעליים
ぼ う し
B o u s h i
כובע
אוצר מילים
2 5""".trimIndent(),
        28 to """- 8שיעור 
k o n o s o n o a n o
תרגיל בניית משפטים
￥ 1200
￥ 680
￥ 815
￥ 460
1 .
2 .
3 .
4 .
1 . K o n o b o u s h i w a s e n n i h y a k u e n d e s u
2 . S o n o k a s a w a r o p p y a k u h a c h i j u u e n d e s u
3 . A n o h o n w a h a p p y a k u j u u g o e n d e s u
4 . K o n o p e n w a y o n h y a k u r o k u j u u e n d e s u
￥ 8600
￥ 999
￥ 2740
￥ 1300
5 .
6 .
7 .
8 .
5 . A n o s a i f u w a h a s s e n r o p p y a k u e n d e s u
6 . S o n o s h a t s u w a k y u h y a k u k y u j u u k y u e n d e s u
7 . K o n o k a b a n w a n i s e n n a n a h y a k u y o n j u u e n d e s u
8 . S o n o t o k e i w a s e n s a n b y a k u e n d e s u
2 6""".trimIndent(),
        29 to """- פועל 9שיעור 
い く
I k u
ללכת
き く
K i k u
לשמוע
か え る
K a e r u
לחזור
の む
N o m u
לשתות
よ む
Y o m u
לקרוא
は な す
H a n a s u
לדבר
た べ る
T a b e r u
לאכול
ね る
N e r u
לישון
み る
M i r u
לראות
す る
S u r u
לעשות
く る
K u r u
לבוא
אוצר מילים
2 7""".trimIndent(),
        30 to """- סיומת פורמלית לפעלים m a s u
 - מילית לציון נושא w a
 לפועל אחרי ההטיה m a s uמוסיפים 
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
 - פועל 9 + 1 0שיעור 
Taberu masu 
 
Kikui masu
Ru →masu
U →i masu
Ru verb : 
U verb : 
Taberu
Kiku
→
→
דוגמה
1 . W a t a s h i w a t a b e m a s u (אני אוכלת )
2 . H o n d a s a n w a n o m i m a s u (מר הונדה שותה )
3 . N i h o n j i n w a b e n k y o u s h i m a s u (היפני לומד )
2 8""".trimIndent(),
        31 to """- פועל 9 + 1 0שיעור 
תרגול בניית משפטים
1 .
5 .
4 .3 .2 .
8 .7 .6 .
1 . S u z u k i s a n w a t a b e m a s u
2 . 
3 . 
4 . 
5 . 
6 . 
7 . 
8 . 
*התשובות בקורס עצמו
2 9""".trimIndent(),
        32 to """- סיומת פורמלית - שלילה לפעלים m a s e n
סדר בניית משפטים לא משתנה 
"k aניתן לשנות לשאלה על ידי הוספת 
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
 - פועל 9 + 1 0שיעור 
דוגמה
1 . S u z u k i s a n w a k i k i m a s u k a ? (האם גברת סוזוקי שומעת )
2 . S u z u k i s a n w a k i k i m a s e n (גברת סוזוקי לא שומעת )
3 . S u z u k i s a n w a t a b e m a s e n (גברת סוזוקי לא אוכלת )
3 0""".trimIndent(),
        33 to """- פועל 9 + 1 0שיעור 
 (עתיד / הווה ) פעלים הטיית תרגול 
*בבקשה הטבלה את תמלאו 
צורת מילון 
חיוב 
שלילה 
 e a t 
T a b e r u
T a b e m a s u
T a b e m a s e n
 s e e
g e t u p
 s l e e p
s p e a k
l i s t e n
g o
r e a d
d r i n k
r e t u r n
d o
c o m e
s t u d y
3 1""".trimIndent(),
        34 to """- פועל 9 + 1 0שיעור 
 (עתיד / הווה ) פעלים הטיית תרגול 
*תשובה 
צורת מילון 
חיוב 
שלילה 
 e a t 
T a b e r u
T a b e m a s u
T a b e m a s e n
 s e e
M i r u
M i m a s u
M i m a s e n
g e t u p
O k i r u
O k i m a s u
O k i m a s e n
 s l e e p
N e r u
N e m a s u
N e m a s e n
s p e a k
H a n a s u
H a n a s h i m a s u
H a n a s h i m a s e n
l i s t e n
K i k u
K i k i m a s u
K i k i m a s e n
g o
I k u
I k i m a s u
I k i m a s e n
r e a d
Y o m u
Y o m i m a s u
Y o m i m a s e n
d r i n k
N o m u
N o m i m a s u
N o m i m a s e n
r e t u r n
K a e r u
K a e r i m a s u
K a e r i m a s e n
d o
S u r u
S h i m a s u
S h i m a s e n
c o m e
K u r u
K i m a s u
K i m a s e n
s t u d y
B e n k y o u s u r u
B e n k y o u
s h i m a s u
B e n k y o u
s h i m a s e n
3 2""".trimIndent(),
        35 to """דיאלוג
אוצר מילים
- פועל 1 1שיעור 
A : H o n d a s a n w a s a k a n a w o ta b e m a s u k a ?
B : Iie , W a ta s h i w a b e jita ria n d e s u .
 T a k e d a s a n w a ?
A : W a ta s h i w a s a k a n a w o ta b e m a s u y o . 
 B i- ru w o n o m im a s u k a ?
B : Iie , B i- ru w a c h itto ....
 W a ta s h i w a w a in w o n o m im a s u n e ...
A : ほ ん だ さ ん は さ か な を た べ ま す か ？
B : い い え 、 わ た し は ベ ジ タ リ ア ン で す 。
  た け だ さ ん は ？
A : わ た し は さ か な を た べ ま す よ 。
  ビ ー ル を の み ま す か ？
B : い い え 、 ビ ー ル は ち ょ っ と …
 わ た し は ワ イ ン を の み ま す ね …
さ か な s a k a n aדג 
ベ ジ タ リ ア ン b e j i t a r i a nצמחוני/ת 
ビ ー ル b i - r uבירה 
ワ イ ン w a i nיין 
ち ょ っ と c h o t t oקצת 
3 3""".trimIndent(),
        36 to """: מציין מושא )אובייקט を   w o
מגיעה אחרי המושא )אובייקט 
 "oהגייה היא 
מיקום המושא הוא לפני הפועל 
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
 - פועל 1 1שיעור 
דוגמה
1 . W a t a s h i w a e i g a w o m i m a s u
2 . W a t a s h i w a F u r a n s u g o w o h a n a s h i m a s u
3 . W a t a s h i w a n i h o n g o n o h o n w o y o m i m a s u
3 4""".trimIndent(),
        37 to """- פועל 1 1שיעור 
תרגול בניית משפטים
1 . S u z u k i s a n w a h a n b a - g a - w o t a b e m a s u
2 . 
3 . 
4 . 
5 . 
6 . 
7 . 
8 . 
*התשובות בקורס עצמו
hamba-ga- ongaku ko-hi-   nihongo hon terebi
ハンバーガー  おんがく  コーヒー  にほんご   ほん     テレビ
1. 4.3.2. 5. 6.
3 5""".trimIndent(),
        38 to """דיאלוג
אוצר מילים
- פועל 1 2שיעור 
W a ta s h i w a 7 ji n i o k im a s u
8 ji n i a s a g o h a n w o ta b e m a s u
9 ji n i s h ig o to w o s h im a s u
11 ji n i k o - h i- w o n o m im a s u
17 ji n i y o g a w o s h im a s u
19 ji h a n n i b a n g o h a n w o ta b e m a s u
2 3 ji n i n e m a s u
わ た し は 7 じ に お き ま す 。
8 じ に あ さ ご は ん を た べ ま す 。
9 じ に し ご と を し ま す 。
11 じ に コ ー ヒ ー を の み ま す 。
17 じ に ヨ ガ を し ま す 。
19 じ に ば ん ご は ん を た べ ま す 。
2 3 じ に ね ま す 。
ご は ん g o h a nאוכל / אורז 
あ さ ご は ん a s a g o h a nארוחת בוקר 
ひ る ご は ん h i r u g o h a nארוחת צהריים 
ば ん ご は ん b a n g o h a nארוחת ערב 
し ご と s h i g o t oעבודה 
〜 じ 〜 j i ( o ' c l o c kשעה 
3 6""".trimIndent(),
        39 to """: מילית לציון זמן に   n i
מגיעה אחרי הזמן 
 רק אחרי זמן ספציפי )שעות / תאריכים( に   n iמוסיפים 
מיקום הזמן הוא אחרי הנושא 
 - פועל 1 2שיעור 
דוגמה
סדר בניית משפטים 
1 . W a t a s h i w a 6 j i n i t a b e m a s u
2 . W a t a s h i w a 6 j i n i p i z a w o t a b e m a s u
3 . W a t a s h i w a i m a p i z a w o t a b e m a s u
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
3 7""".trimIndent(),
        40 to """- פועל 1 2שיעור 
תרגול בניית משפטים
W a t a s h i w a 7 j i h a n n i o k i m a s u
1 . 
2 . 
3 . 
4 . 
5 . 
6 . 
7 . 
*התשובות בקורס עצמו
work 
study Japanese
3 8""".trimIndent(),
        41 to """- פועל 1 2שיעור 
תרגול בניית משפטים - תכתבו את לו”ז יומי שלכם
W a t a s h i w a 7 j i h a n n i o k i m a s u
1 . 
2 . 
3 . 
4 . 
5 . 
6 . 
7 . 
*התשובות בקורס עצמו
work 
study Japanese
3 9""".trimIndent(),
        42 to """: מילית לציון מקום で   d e
 אחרי מיקום בו הפועלה קורת で   d eמוסיפים 
מיקום יהיה אחרי הזמן 
 - פועל 1 3שיעור 
דוגמה
סדר בניית משפטים 
1 . W a t a s h i w a r e s u t o r a n d e t a b e m a s u
2 . W a t a s h i w a r e s u t o r a n d e p i z a w o t a b e m a s u
3 . W a t a s h i w a 6 j i n i r e s u t o r a n d e p i z a w o t a b e m a s u
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
4 0""".trimIndent(),
        43 to """- פועל 1 3שיעור 
תרגול בניית משפטים - תרכיבו משפטים עם מקום ופועל 
1 . W a t a s h i w a a s a k i c c h i n d e n i h o n g o w o h a n a s h i m a s u
2 . 
3 . 
4 . 
5 . 
6 . 
7 . 
8 . 
*התשובות בקורס עצמו
Jimu
Hoteru
Hoteru
Ofisu
Resutoran
Pabu
Kicchin
Ribingu rumu
4 1""".trimIndent(),
        44 to """- פועל 1 3שיעור 
תרגול בניית משפטים - תרכיבו משפטים עם מקום, זמן ופועל 
1 . W a t a s h i w a 4 j i n i k i c c h i n d e ( n i h o n g o w o ) h a n a s h i m a s u
2 . 
3 . 
4 . 
5 . 
6 . 
7 . 
8 . 
*התשובות בקורס עצמו
Jimu
Hoteru
Hoteru
Ofisu
Resutoran
Pabu
Kicchin
Ribingu rumu
4 2""".trimIndent(),
        45 to """: מילית לציון כיוון に   n i
מגיעה לפני הפעולה 
 אחרי היעד に   n iמוסיפים 
で d e ו に   n iלשים לב להבדל בין 
 - פועל 1 4שיעור 
דוגמה
1 . W a t a s h i w a T o k y o u n i i k i m a s u 
2 . W a t a s h i w a 6 j i n i T o k y o u n i i k i m a s u
3 . W a t a s h i w a k u r u m a d e T o k y o u n i i k i m a s u
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
לכיוון
במקום
4 3""".trimIndent(),
        46 to """- פועל 1 4שיעור 
תרגול בניית משפטים - תרכיבו משפטים עם כיוון 
1 .                                                  
2 . 
3 . 
4 . 
5 . 
6 . 
*התשובות בקורס עצמו
 ②
③
 ④
 ⑤
 ⑥
jimu
resutoran
hoteru
shoppingu
mo-ru
umi
uchi
/ie
 ①
4 4""".trimIndent(),
        47 to """דיאלוג
אוצר מילים
- עבר 1 4שיעור 
W a ta s h i w a k in o u 6 ji n i o k im a s h ita
U c h i d e a s a g o h a n w o ta b e m a s h ita
T e re b i d e n ih o n n o e ig a w o m im a s h ita .
S o s h ite Jim u n i ik im a s h ita .
Jim u d e y o g a w o s h im a s h ita .
8 ji n i b a n g o h a n w o ta b e m a s h ita .
わ た し は き の う 6 じ に お き ま し た
う ち で あ さ ご は ん を た べ ま し た
て れ び で に ほ ん の え い が を み ま し た
そ し て 、 じ む に い き ま し た
じ む で よ が を し ま し た 。
８ じ に ば ん ご は ん を た べ ま し た
き の う
k i n o u
אתמול
そ し て
s o s h i t e
ו )חיבור למשפטים
4 5""".trimIndent(),
        48 to """Taberu mashita
 
Kikui mashita
Ru →mashita
U →i mashita
 - סיומת עבר פורמלית לפעלים m a s h i t a
סיומת עבר פורמלית בשלילה - m a s e n d e s h i t a
אחרי ההטיה מוסיפים לפועל 
 - עבר 1 5שיעור 
דוגמה
1 . W a t a s h i w a n o m i m a s h i t a
2 . W a t a s h i w a 6 j i n i w a i n w o n o m i m a s h i t a
3 . W a t a s h i w a 6 j i n i n i h o n n o w a i n w o n o m i m a s h i t a
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
Ru verb : 
U verb : 
Taberu
Kiku
→
→
4 6""".trimIndent(),
        49 to """- עבר 1 5שיעור 
 (עבר ) פעלים הטיית תרגול 
בבקשה הטבלה את תמלאו *
צורת מילון חיוב שלילה 
 e a t T a b e r u T a b e m a s h i t a T a b e m a s e n d e s h i t a
 s e e
g e t u p
 s l e e p
s p e a k
l i s t e n
g o
r e a d
d r i n k
r e t u r n
d o
c o m e
s t u d y
4 7""".trimIndent(),
        50 to """- עבר 1 5שיעור 
 (עבר ) פעלים הטיית תרגול 
תשובות *
צורת מילון חיוב שלילה 
 e a t T a b e r u T a b e m a s h i t a T a b e m a s e n d e s h i t a
 s e e M i r u M i m a s h i t a M i m a s e n d e s h i t a
g e t u p O k i r u O k i m a s h i t a O k i m a s e n d e s h i t a
 s l e e p N e r u N e m a s h i t a N e m a s e n d e s h i t a
s p e a k H a n a s u H a n a s h i m a s h i t a H a n a s h i m a s e n d e s h i t a
l i s t e n K i k u K i k i m a s h i t a K i k i m a s e n d e s h i t a
g o I k u I k i m a s h i t a I k i m a s e n d e s h i t a
r e a d Y o m u Y o m i m a s h i t a Y o m i m a s e n d e s h i t a
d r i n k N o m u N o m i m a s h i t a N o m i m a s e n d e s h i t a
r e t u r n K a e r u K a e r i m a s h i t a K a e r i m a s e n d e s h i t a
d o S u r u S h i m a s h i t a S h i m a s e n d e s h i t a
c o m e K u r u K i m a s h i t a K i m a s e n d e s h i t a
s t u d y B e n k y o u s u r u B e n k y o u
s h i m a s h i t a
B e n k y o u
s h i m a s e n d e s h i t a
4 8""".trimIndent(),
        51 to """- סיומת עבר פורמלית לשמות עצם d e s h i t a
- סיומת עבר פורמלית בשלילה j a n a k a t t a d e s u
מוסיפים לשמות עצם 
 - עבר 1 6שיעור 
דוגמה
1 . S u z u k i s a n w a s e n s e i d e s h i t a
2 . K o r e w a w a t a s h i n o h o n j a n a k a t t a d e s u
3 . A r e w a n i h o n n o e i g a d e s h i t a
4 . A s a g o h a n w a s a r a d a j a n a k a t t a d e s u y o
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿ ＿
הערות
desu →deshita
janaidesu → janakattadesu
4 9""".trimIndent(),
        52 to """- עבר 1 6שיעור 
תשנו את המפשטים הבאים לצורת עבר 
1 .                                                  
2 . 
3 . 
4 . 
5 . 
6 . 
7 . 
8 . 
*התשובות בקורס עצמו
1 . watashi wa sensei desu
2 . kore wa watashi no hon desu
3 . sore wa Suzuki san no pen janaidesu
4 . watashi wa purogurama- desu
5 . okaasan wa nihongo no sensei janaidesu
6 . kore wa tomodachi no shigoto desu
7 . soko wa resutoran desuka.
8 . koko wa resutoran janaidesu
5 0""".trimIndent(),
        53 to """סיכום 
5 1
P r e s e n t a f f .
で す
d e s u
じ ゃ な か っ た で す
J a n a k a t t a d e s u
で し た
d e s h i t a
じ ゃ な い で す
J a n a i d e s u
P r e s e n t n e g .
 P a s t a f f .
 P a s t n e g .
הטיות - שמות עצם 
הטיות - פועל 
い き ま す
I k i m a s u
し ま せ ん
S h i m a s e n
P r e s e n t a f f .
た べ ま す
T a b e m a s u
た べ ま せ ん で し た
T a b e m a s e n
d e s h i t a
た べ ま し た
T a b e m a s h i t a
た べ ま せ ん
T a b e m a s e n
い き ま せ ん で し た
I k i m a s e n d e s h i t a
い き ま し た
I k i m a s h i t a
し ま す
S h i m a s u
い き ま せ ん
I k i m a s e n
し ま せ ん で し た
S h i m a s e n d e s h i t a
し ま し た
S h i m a s h i t a
P r e s e n t n e g .
 P a s t a f f .
 P a s t n e g .
R u -
v e r b
i r r e g u l a r 
U -
v e r b
き ま す
K i m a s u
き ま せ ん
K i m a s e n
き ま し た
K i m a s h i t a
き ま せ ん で し た
K i m a s e n d e s h i t a""".trimIndent(),
        54 to """סיכום 
5 2
מיליות 
は
WA
の
NO
に
NI
で
DE
を
WO
ציון נושא
שייכות “של
 ציון
אובייקט
ציון זמן “ב
ציון כיוון “ל”
ציון מקום “ב
ציון אמצעי “ב”
סדר בניית משפטים 
は に で   を  ます
/ מושא
אובייקט
wa   ni de wo   masu
נושא
פועל
זמן
מיקום""".trimIndent(),
        55 to """קורס יפנית 
למתחילים 
⽇ 本 語 コ ー ス
O t s u k a r e s a m a""".trimIndent(),
    )

    fun pageText(pageNumber: Int): String = pageTexts[pageNumber].orEmpty()

    fun getSectionsForLesson(lessonId: Int): List<WorkbookSection> {
        val exercises = getExercisesForLesson(lessonId)
        if (exercises.isEmpty()) return emptyList()
        val pages = exercises.map { it.pageNumber }.distinct().sorted()
        return listOf(WorkbookSection("digital-lesson-$lessonId", lessonId, lessonTitle(lessonId), "${pages.first()}-${pages.last()}", exercises))
    }

    fun getExercisesForLesson(lessonId: Int): List<WorkbookExercise> {
        val pageExercises = pageTexts.keys.sorted().mapNotNull { page ->
            val mappedLesson = lessonForPage(page) ?: return@mapNotNull null
            if (mappedLesson != lessonId) return@mapNotNull null
            WorkbookExercise(
                id = "digital-p${page.toString().padStart(2, '0')}-notes",
                lessonId = mappedLesson,
                pageNumber = page,
                title = "Workbook page $page",
                type = WorkbookExerciseType.PAGE_NOTES,
                prompt = "Read this workbook page, then write your notes or answer exactly as you would in the printed booklet.",
                referenceText = pageText(page),
                japaneseToSpeak = pageText(page).japaneseSnippet(),
                hints = listOf(ExerciseHint("Use the reference text above as the original booklet content for this page."), ExerciseHint("If this page is an answer page, compare it only after trying the previous exercise.")),
                maxAnswerLength = 1200
            )
        }
        return (interactiveExercises().filter { it.lessonId == lessonId } + pageExercises).sortedWith(compareBy<WorkbookExercise> { it.pageNumber }.thenBy { it.id })
    }

    private fun String.japaneseSnippet(): String = filter { it in '\u3040'..'\u30ff' || it in '\u4e00'..'\u9faf' }.take(80)

    private fun lessonForPage(page: Int): Int? = when (page) {
        in 1..3 -> 1
        in 4..7 -> 2
        in 8..12 -> 4
        in 13..14 -> 5
        in 15..16 -> 6
        in 17..18 -> 7
        in 19..28 -> 8
        in 29..34 -> 9
        in 35..37 -> 11
        in 38..41 -> 12
        in 42..44 -> 13
        in 45..48 -> 14
        in 49..50 -> 15
        in 51..52 -> 16
        in 53..55 -> 17
        else -> null
    }

    private fun lessonTitle(lessonId: Int): String = when (lessonId) {
        1 -> "Pronunciation and Japanglish"
        2 -> "Greetings and self introduction"
        4 -> "wa ... desu"
        5 -> "Negative sentences"
        6 -> "no possession"
        7 -> "kore/sore/are"
        8 -> "Numbers and kono/sono/ano"
        9 -> "Verb forms"
        11 -> "Object marker wo"
        12 -> "Time marker ni"
        13 -> "Place marker de"
        14 -> "Direction ni and past dialogue"
        15 -> "Past verb conjugation"
        16 -> "Past nouns and negatives"
        17 -> "Course summary"
        else -> "Digital course workbook"
    }


    private fun interactiveExercises(): List<WorkbookExercise> = listOf(
        WorkbookExercise(
            id = "digital-p03-japanglish",
            lessonId = 1,
            pageNumber = 3,
            title = "Japanglish conversion",
            type = WorkbookExerciseType.FREE_WRITING,
            prompt = "Convert the words from the booklet into Japanglish: Cinema, Love, Instagram, Milk, Louis Vuitton, and your name.",
            referenceText = pageText(3),
            japaneseToSpeak = pageText(3).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("Japanese syllables usually end with a vowel: a, i, u, e, o."),
                ExerciseHint("V often becomes B, L/R become Japanese R, and CI can become SHI."),
                ExerciseHint("Say each word out loud and add a vowel when the sound cannot end naturally.")
            ),
            maxAnswerLength = 900
        ),
        WorkbookExercise(
            id = "digital-p05-self-intro",
            lessonId = 2,
            pageNumber = 5,
            title = "Write your self introduction",
            type = WorkbookExerciseType.FREE_WRITING,
            prompt = "Write your self introduction using: Konnichiwa, Hajimemashite, ... desu, Yoroshiku onegaishimasu.",
            referenceText = pageText(5),
            japaneseToSpeak = pageText(5).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("Start with Konnichiwa."),
                ExerciseHint("Use your name before desu."),
                ExerciseHint("End politely with Yoroshiku onegaishimasu.")
            ),
            maxAnswerLength = 900
        ),
        WorkbookExercise(
            id = "digital-p06-greeting-match",
            lessonId = 2,
            pageNumber = 6,
            title = "Match greetings to situations",
            type = WorkbookExerciseType.TEXT_MATCH,
            prompt = "Match each greeting from the PDF to the correct situation or picture idea. Type pairs such as: Ohayou = morning.",
            referenceText = pageText(6) + "\n\nAnswers page:\n" + pageText(7),
            japaneseToSpeak = (pageText(6) + pageText(7)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("Use page 7 only if you are stuck; it contains the answer bank."),
                ExerciseHint("Ohayou is morning. Itadakimasu is before eating."),
                ExerciseHint("Ittekimasu and Itterasshai are a pair used when someone leaves home.")
            ),
            options = listOf("Ohayou", "Arigatou", "Konbanwa", "Suimasen", "Itadakimasu", "Ittekimasu", "Itterasshai", "Hajimemashite", "Sayounara", "Oyasuminasai", "Konnichiwa")
        ),
        WorkbookExercise(
            id = "digital-p10-wa-desu-translation",
            lessonId = 4,
            pageNumber = 10,
            title = "Translate with wa ... desu",
            type = WorkbookExerciseType.FILL_BLANK,
            prompt = "Translate the six Hebrew sentences from the workbook into romaji Japanese using wa ... desu / desu ka.",
            referenceText = pageText(9) + "\n\nExercise page:\n" + pageText(10),
            japaneseToSpeak = (pageText(9) + pageText(10)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("Use wa after the topic: Watashi wa ..."),
                ExerciseHint("Use desu at the end of a positive noun sentence."),
                ExerciseHint("For a yes/no question, add ka after desu.")
            ),
            expectedAnswers = listOf("watashi wa sensei desu", "watashi wa purogurama desu", "tanaka san wa enjinia desu"),
            maxAnswerLength = 1000
        ),
        WorkbookExercise(
            id = "digital-p12-jin-sentences",
            lessonId = 4,
            pageNumber = 12,
            title = "Build sentences with jin",
            type = WorkbookExerciseType.FREE_WRITING,
            prompt = "Complete the workbook task: write nationality sentences for Tom, Maria, Tanaka, Wan, Kim, Anna, and Bob.",
            referenceText = pageText(11) + "\n\nExercise page:\n" + pageText(12),
            japaneseToSpeak = (pageText(45) + pageText(46)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("Country + jin means a person from that country."),
                ExerciseHint("Keep the pattern: Name san wa Country jin desu."),
                ExerciseHint("For a question, keep the same order and add ka.")
            ),
            maxAnswerLength = 1000
        ),
        WorkbookExercise(
            id = "digital-p14-negative-practice",
            lessonId = 5,
            pageNumber = 14,
            title = "Change sentences to negative",
            type = WorkbookExerciseType.DIALOGUE_COMPLETE,
            prompt = "Turn the workbook sentences into negative form and translate them to Hebrew.",
            referenceText = pageText(13) + "\n\nExercise page:\n" + pageText(14),
            japaneseToSpeak = (pageText(35) + pageText(36)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("Replace desu with janai desu for noun/adjective-style negative sentences."),
                ExerciseHint("The sentence order does not change."),
                ExerciseHint("For a negative question, add ka after janai desu.")
            ),
            maxAnswerLength = 1200
        ),
        WorkbookExercise(
            id = "digital-p16-no-possession",
            lessonId = 6,
            pageNumber = 16,
            title = "Possession with no",
            type = WorkbookExerciseType.FILL_BLANK,
            prompt = "Translate the possession sentences from the workbook using no, such as 'my coffee' or 'Lihi's book'.",
            referenceText = pageText(15) + "\n\nExercise page:\n" + pageText(16),
            japaneseToSpeak = (pageText(15) + pageText(16)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("no connects owner + thing."),
                ExerciseHint("Owner comes first: Suzuki san no pen."),
                ExerciseHint("Use janai desu when the sentence says 'is not'.")
            ),
            maxAnswerLength = 1000
        ),
        WorkbookExercise(
            id = "digital-p22-numbers-write",
            lessonId = 8,
            pageNumber = 22,
            title = "Write the numbers in Japanese",
            type = WorkbookExerciseType.TYPED_ANSWER,
            prompt = "Write the workbook number list in Japanese romaji.",
            referenceText = pageText(19) + "\n" + pageText(20) + "\n" + pageText(21) + "\n\nExercise page:\n" + pageText(22),
            japaneseToSpeak = (pageText(19) + pageText(20)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("Build tens as juu, ni juu, san juu..."),
                ExerciseHint("Hundreds use hyaku, with special forms like sanbyaku and happyaku."),
                ExerciseHint("Thousands use sen, with special forms like sanzen and hassen.")
            ),
            maxAnswerLength = 1200
        ),
        WorkbookExercise(
            id = "digital-p28-kono-prices",
            lessonId = 8,
            pageNumber = 28,
            title = "Build kono/sono/ano price sentences",
            type = WorkbookExerciseType.SENTENCE_ORDER,
            prompt = "Use the page pictures/prices to build sentences like: Kono boushi wa sen ni hyaku en desu.",
            referenceText = pageText(26) + "\n" + pageText(27) + "\n\nExercise page:\n" + pageText(28),
            japaneseToSpeak = (pageText(15) + pageText(16)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("kono/sono/ano comes before the noun."),
                ExerciseHint("Use wa after the item phrase."),
                ExerciseHint("Finish with the price + en desu.")
            ),
            maxAnswerLength = 1200
        ),
        WorkbookExercise(
            id = "digital-p33-verb-table",
            lessonId = 9,
            pageNumber = 33,
            title = "Verb present/future table",
            type = WorkbookExerciseType.FILL_BLANK,
            prompt = "Fill the verb table: dictionary form, positive masu form, and negative masen form.",
            referenceText = pageText(29) + "\n" + pageText(32) + "\n\nExercise page:\n" + pageText(33),
            japaneseToSpeak = (pageText(29) + pageText(33)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("Ru verbs often change ru to masu/masen."),
                ExerciseHint("U verbs change the final sound before masu/masen."),
                ExerciseHint("Use the answer page only after trying: page 34.")
            ),
            maxAnswerLength = 1400
        ),
        WorkbookExercise(
            id = "digital-p37-wo-practice",
            lessonId = 11,
            pageNumber = 37,
            title = "Build sentences with wo",
            type = WorkbookExerciseType.SENTENCE_ORDER,
            prompt = "Build the workbook sentences with object marker wo.",
            referenceText = pageText(35) + "\n" + pageText(36) + "\n\nExercise page:\n" + pageText(37),
            japaneseToSpeak = (pageText(35) + pageText(36)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("wo marks the object, the thing receiving the action."),
                ExerciseHint("The object usually comes before the verb."),
                ExerciseHint("Pronounce ? as o.")
            ),
            maxAnswerLength = 1200
        ),
        WorkbookExercise(
            id = "digital-p41-daily-schedule",
            lessonId = 12,
            pageNumber = 41,
            title = "Write your daily schedule",
            type = WorkbookExerciseType.FREE_WRITING,
            prompt = "Write your daily schedule using specific times and ni where needed.",
            referenceText = pageText(38) + "\n" + pageText(39) + "\n\nExercise page:\n" + pageText(41),
            japaneseToSpeak = (pageText(38) + pageText(39)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("Use ni after a specific time."),
                ExerciseHint("The time phrase comes after the topic."),
                ExerciseHint("Do not use ni after broad words like mainichi unless the lesson says so.")
            ),
            maxAnswerLength = 1400
        ),
        WorkbookExercise(
            id = "digital-p44-time-place-verb",
            lessonId = 13,
            pageNumber = 44,
            title = "Place, time, and verb sentences",
            type = WorkbookExerciseType.SENTENCE_ORDER,
            prompt = "Build the workbook sentences with place, time, and verb.",
            referenceText = pageText(42) + "\n" + pageText(43) + "\n\nExercise page:\n" + pageText(44),
            japaneseToSpeak = (pageText(42) + pageText(43)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("de marks where the action happens."),
                ExerciseHint("ni marks a specific time."),
                ExerciseHint("A common order is topic + time + place + object + verb.")
            ),
            maxAnswerLength = 1300
        ),
        WorkbookExercise(
            id = "digital-p46-direction-ni",
            lessonId = 14,
            pageNumber = 46,
            title = "Build direction sentences",
            type = WorkbookExerciseType.SENTENCE_ORDER,
            prompt = "Build the workbook sentences with direction marker ni.",
            referenceText = pageText(45) + "\n\nExercise page:\n" + pageText(46),
            japaneseToSpeak = (pageText(45) + pageText(46)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("Direction ni means 'to' a destination."),
                ExerciseHint("Do not confuse direction ni with place de."),
                ExerciseHint("Use destination + ni before motion verbs like iku or kaeru.")
            ),
            maxAnswerLength = 1200
        ),
        WorkbookExercise(
            id = "digital-p49-past-verb-table",
            lessonId = 15,
            pageNumber = 49,
            title = "Past verb table",
            type = WorkbookExerciseType.FILL_BLANK,
            prompt = "Fill the past-tense verb table from the workbook.",
            referenceText = pageText(47) + "\n" + pageText(48) + "\n\nExercise page:\n" + pageText(49),
            japaneseToSpeak = (pageText(45) + pageText(46)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("Positive past polite verbs end in mashita."),
                ExerciseHint("Negative past polite verbs end in masen deshita."),
                ExerciseHint("Use page 50 as the answer page only after trying.")
            ),
            maxAnswerLength = 1400
        ),
        WorkbookExercise(
            id = "digital-p52-past-nouns",
            lessonId = 16,
            pageNumber = 52,
            title = "Change sentences to past tense",
            type = WorkbookExerciseType.FILL_BLANK,
            prompt = "Change the workbook sentences into past tense.",
            referenceText = pageText(51) + "\n\nExercise page:\n" + pageText(52),
            japaneseToSpeak = (pageText(45) + pageText(46)).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("For nouns, positive past is deshita."),
                ExerciseHint("For noun negative past, use janakatta desu."),
                ExerciseHint("Keep the sentence order the same.")
            ),
            maxAnswerLength = 1300
        ),
        WorkbookExercise(
            id = "digital-p54-particles-review",
            lessonId = 17,
            pageNumber = 54,
            title = "Particles review",
            type = WorkbookExerciseType.FREE_WRITING,
            prompt = "Write your own example sentence for each particle in the summary: wa, no, ni, de, wo.",
            referenceText = pageText(53) + "\n\nParticles page:\n" + pageText(54),
            japaneseToSpeak = pageText(54).japaneseSnippet(),
            hints = listOf(
                ExerciseHint("wa marks the topic."),
                ExerciseHint("no marks possession."),
                ExerciseHint("ni can mark time or direction; de marks action place; wo marks object.")
            ),
            maxAnswerLength = 1500
        )
    )

}
