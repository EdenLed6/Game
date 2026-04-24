package com.nihongo.beginner

import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import com.nihongo.beginner.audio.PronunciationSpeaker
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.data.ProgressManager
import com.nihongo.beginner.databinding.ActivityGameChallengeBinding

class GameChallengeActivity : AppCompatActivity() {

    private data class ChallengeQuestion(
        val prompt: String,
        val options: List<String>,
        val correctIndex: Int,
        val explanation: String
    )

    private lateinit var binding: ActivityGameChallengeBinding
    private lateinit var speaker: PronunciationSpeaker
    private lateinit var questions: List<ChallengeQuestion>
    private var currentIndex = 0
    private var score = 0
    private var lives = 3
    private var streak = 0
    private var highScore = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityGameChallengeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener { finish() }

        speaker = PronunciationSpeaker(this)
        highScore = ProgressManager.getChallengeHighScore(this)
        binding.btnChallengeReplay.setOnClickListener { restartGame() }
        binding.btnChallengeBack.setOnClickListener { finish() }

        optionButtons().forEachIndexed { index, button ->
            button.setOnClickListener { onOptionSelected(index) }
        }

        restartGame()
    }

    private fun restartGame() {
        questions = buildChallengeDeck().shuffled().take(12)
        currentIndex = 0
        score = 0
        lives = 3
        streak = 0

        binding.layoutChallengeResult.visibility = View.GONE
        binding.layoutChallengeGame.visibility = View.VISIBLE
        binding.tvChallengeHighScore.text = "שיא: $highScore"
        showQuestion()
    }

    private fun showQuestion() {
        if (currentIndex >= questions.size || lives <= 0) {
            showResult()
            return
        }

        val question = questions[currentIndex]
        binding.progressChallenge.progress = currentIndex * 100 / questions.size
        binding.tvChallengeCounter.text = "שאלה ${currentIndex + 1} מתוך ${questions.size}"
        binding.tvChallengeStats.text = "ניקוד: $score   חיים: ${"♥".repeat(lives)}   רצף: $streak"
        binding.tvChallengePrompt.text = question.prompt
        binding.tvChallengeFeedback.visibility = View.INVISIBLE

        binding.btnSpeakChallenge.setOnClickListener { speaker.speak(questions[currentIndex].prompt) }

        optionButtons().forEachIndexed { index, button ->
            button.isEnabled = true
            button.text = question.options[index]
            button.backgroundTintList = ColorStateList.valueOf(Color.WHITE)
            button.setTextColor(getColor(R.color.colorPrimary))
        }
    }

    private fun onOptionSelected(selectedIndex: Int) {
        val question = questions[currentIndex]
        optionButtons().forEach { it.isEnabled = false }

        val isCorrect = selectedIndex == question.correctIndex
        val correctColor = getColor(R.color.correct_green)
        val wrongColor = getColor(R.color.wrong_red)

        optionButtons()[question.correctIndex].backgroundTintList = ColorStateList.valueOf(correctColor)
        optionButtons()[question.correctIndex].setTextColor(Color.WHITE)

        if (isCorrect) {
            streak++
            score += 100 + (streak * 15)
            binding.tvChallengeFeedback.text = "נכון! ${question.explanation}"
        } else {
            lives--
            streak = 0
            optionButtons()[selectedIndex].backgroundTintList = ColorStateList.valueOf(wrongColor)
            optionButtons()[selectedIndex].setTextColor(Color.WHITE)
            binding.tvChallengeFeedback.text = "לא נכון. ${question.explanation}"
        }

        binding.tvChallengeFeedback.visibility = View.VISIBLE
        currentIndex++
        binding.tvChallengeFeedback.postDelayed({ showQuestion() }, 1100)
    }

    private fun showResult() {
        val isNewRecord = score > highScore
        if (isNewRecord) {
            highScore = score
            ProgressManager.saveChallengeHighScore(this, score)
        }

        binding.layoutChallengeGame.visibility = View.GONE
        binding.layoutChallengeResult.visibility = View.VISIBLE
        binding.tvChallengeFinalScore.text = score.toString()
        binding.tvChallengeResultTitle.text = if (isNewRecord) "שיא חדש!" else "סיום אתגר"
        binding.tvChallengeResultMessage.text =
            if (lives <= 0) "נגמרו החיים, אבל כל סיבוב מחזק את הזיכרון."
            else "השלמת את כל האתגר. השיא שלך: $highScore"
    }

    private fun buildChallengeDeck(): List<ChallengeQuestion> {
        val lessons = LessonData.getAllLessons()
        val quizQuestions = lessons.flatMap { lesson ->
            lesson.exercises.map { quiz ->
                ChallengeQuestion(
                    prompt = quiz.question,
                    options = quiz.options,
                    correctIndex = quiz.correctIndex,
                    explanation = quiz.explanation.ifBlank { "מתוך ${lesson.title}" }
                )
            }
        }

        val vocabulary = lessons.flatMap { it.vocabulary }.distinctBy { it.japanese + it.hebrew }
        val hebrewOptions = vocabulary.map { it.hebrew }.distinct()
        val japaneseOptions = vocabulary.map { it.japanese }.distinct()

        val vocabQuestions = vocabulary.flatMap { item ->
            listOfNotNull(
                makeQuestion(
                    prompt = "מה הפירוש של ${item.japanese} (${item.romaji})?",
                    correct = item.hebrew,
                    pool = hebrewOptions,
                    explanation = "${item.japanese} = ${item.hebrew}"
                ),
                makeQuestion(
                    prompt = "איזו מילה יפנית מתאימה ל-${item.hebrew}?",
                    correct = item.japanese,
                    pool = japaneseOptions,
                    explanation = "${item.hebrew} = ${item.japanese}"
                )
            )
        }

        return (quizQuestions + vocabQuestions).filter { it.options.size == 4 }
    }

    private fun makeQuestion(
        prompt: String,
        correct: String,
        pool: List<String>,
        explanation: String
    ): ChallengeQuestion? {
        val wrongOptions = pool.filter { it != correct }.shuffled().take(3)
        if (wrongOptions.size < 3) return null
        val options = (wrongOptions + correct).shuffled()
        return ChallengeQuestion(prompt, options, options.indexOf(correct), explanation)
    }

    private fun optionButtons(): List<MaterialButton> = listOf(
        binding.btnChallengeOption0,
        binding.btnChallengeOption1,
        binding.btnChallengeOption2,
        binding.btnChallengeOption3
    )

    override fun onDestroy() {
        speaker.shutdown()
        super.onDestroy()
    }
}
