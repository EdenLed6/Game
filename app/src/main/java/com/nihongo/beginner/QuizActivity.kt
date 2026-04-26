package com.nihongo.beginner

import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.snackbar.Snackbar
import com.nihongo.beginner.audio.PronunciationSpeaker
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.data.ProgressManager
import com.nihongo.beginner.data.QuizQuestion
import com.nihongo.beginner.databinding.ActivityQuizBinding

class QuizActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_LESSON_ID = "lesson_id"
    }

    private lateinit var binding: ActivityQuizBinding
    private lateinit var speaker: PronunciationSpeaker
    private var lessonId: Int = -1
    private var currentIndex = 0
    private var score = 0
    private var selectedIndex: Int? = null
    private var submitted = false
    private var lessonCompletedThisRun = false
    private lateinit var questions: List<QuizQuestion>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityQuizBinding.inflate(layoutInflater)
        setContentView(binding.root)

        lessonId = intent.getIntExtra(EXTRA_LESSON_ID, -1)
        val lesson = LessonData.getLessonById(lessonId)
        if (lesson == null) {
            finish()
            return
        }

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener { finish() }

        speaker = PronunciationSpeaker(this)

        questions = lesson.exercises
        val total = questions.size

        fun resetButtonColors() {
            val buttons = listOf(binding.btnOption0, binding.btnOption1, binding.btnOption2, binding.btnOption3)
            buttons.forEach {
                it.backgroundTintList = ColorStateList.valueOf(getColor(R.color.white))
                it.setTextColor(getColor(R.color.onSurface))
            }
        }

        fun setOptionSelected(index: Int) {
            if (submitted) return
            selectedIndex = index
            resetButtonColors()
            optionButtons().forEachIndexed { i, button ->
                if (i == index) {
                    button.backgroundTintList = ColorStateList.valueOf(getColor(R.color.selected_yellow))
                    button.setTextColor(getColor(R.color.onSurface))
                }
            }
            binding.btnSubmit.isEnabled = true
        }

        fun showQuestion() {
            val question = questions[currentIndex]
            selectedIndex = null
            submitted = false
            binding.tvQuestionCounter.text = "שאלה ${currentIndex + 1} מתוך $total"
            binding.progressBarQuiz.progress = currentIndex * 100 / total
            binding.tvQuestion.text = question.question
            binding.btnSpeakQuestion.visibility = View.VISIBLE
            val options = question.options
            optionButtons().forEachIndexed { i, btn ->
                btn.text = if (i < options.size) options[i] else ""
                btn.visibility = if (i < options.size) View.VISIBLE else View.GONE
                btn.isEnabled = i < options.size
            }
            speakOptionButtons().forEachIndexed { i, btn ->
                btn.visibility = if (i < options.size) View.VISIBLE else View.GONE
            }
            resetButtonColors()
            binding.tvFeedback.text = ""
            binding.tvFeedback.visibility = View.GONE
            binding.cardFeedback.visibility = View.GONE
            binding.btnSubmit.visibility = View.VISIBLE
            binding.btnSubmit.isEnabled = false
            binding.btnNext.visibility = View.GONE
        }

        fun showResults() {
            binding.tvQuestionCounter.visibility = View.GONE
            binding.progressBarQuiz.visibility = View.GONE
            binding.tvQuestion.visibility = View.GONE
            optionButtons().forEach { it.visibility = View.GONE }
            binding.tvFeedback.visibility = View.GONE
            binding.cardFeedback.visibility = View.GONE
            binding.btnSubmit.visibility = View.GONE
            binding.btnNext.visibility = View.GONE
            binding.layoutResults.visibility = View.VISIBLE

            binding.tvFinalScore.text = "$score / $total"
            val percent = score * 100 / total
            binding.tvResultSummary.text = "דיוק: $percent% · נדרש 80% כדי להשלים את השיעור"
            if (percent >= 80) {
                binding.tvResultEmoji.text = "🎉"
                binding.tvResultMessage.text = "כל הכבוד! עברת את השיעור!"
                binding.tvResultAchievement.text = "השיעור סומן כהושלם. ההתקדמות שלך נשמרה במכשיר."
                ProgressManager.markLessonCompleted(this, lessonId)
                lessonCompletedThisRun = true
                Snackbar.make(binding.root, "Achievement unlocked: lesson completed", Snackbar.LENGTH_LONG).show()
            } else {
                binding.tvResultEmoji.text = "📚"
                binding.tvResultMessage.text = "נסה שוב כדי לעבור את השיעור (80% נדרש)"
                binding.tvResultAchievement.text = "אפשר לחזור על החידון. הניקוד מתאפס רק כשלוחצים שחק שוב."
            }
        }

        fun submitAnswer() {
            if (submitted) return
            val selected = selectedIndex ?: return
            submitted = true
            val question = questions[currentIndex]
            optionButtons().forEach { it.isEnabled = false }

            val correctIndex = question.correctIndex
            optionButtons()[correctIndex].backgroundTintList = ColorStateList.valueOf(getColor(R.color.correct_green))
            optionButtons()[correctIndex].setTextColor(Color.WHITE)
            if (selected != correctIndex) {
                optionButtons()[selected].backgroundTintList = ColorStateList.valueOf(getColor(R.color.wrong_red))
                optionButtons()[selected].setTextColor(Color.WHITE)
            } else {
                score++
            }

            binding.tvFeedback.text = question.explanation.ifBlank {
                if (selected == correctIndex) "Correct." else "Review the lesson notes and try the next one."
            }
            binding.tvFeedback.visibility = View.VISIBLE
            binding.cardFeedback.visibility = View.VISIBLE
            binding.btnSubmit.visibility = View.GONE
            binding.btnNext.visibility = View.VISIBLE
        }

        binding.btnOption0.setOnClickListener { setOptionSelected(0) }
        binding.btnOption1.setOnClickListener { setOptionSelected(1) }
        binding.btnOption2.setOnClickListener { setOptionSelected(2) }
        binding.btnOption3.setOnClickListener { setOptionSelected(3) }
        binding.btnSpeakOption0.setOnClickListener { if (questions[currentIndex].options.size > 0) speaker.speak(questions[currentIndex].options[0]) }
        binding.btnSpeakOption1.setOnClickListener { if (questions[currentIndex].options.size > 1) speaker.speak(questions[currentIndex].options[1]) }
        binding.btnSpeakOption2.setOnClickListener { if (questions[currentIndex].options.size > 2) speaker.speak(questions[currentIndex].options[2]) }
        binding.btnSpeakOption3.setOnClickListener { if (questions[currentIndex].options.size > 3) speaker.speak(questions[currentIndex].options[3]) }
        binding.btnSubmit.setOnClickListener { submitAnswer() }
        binding.btnSpeakQuestion.setOnClickListener { speaker.speak(questions[currentIndex].question) }

        binding.btnNext.setOnClickListener {
            currentIndex++
            if (currentIndex < total) {
                showQuestion()
            } else {
                showResults()
            }
        }

        binding.btnReplay.setOnClickListener {
            currentIndex = 0
            score = 0
            selectedIndex = null
            submitted = false
            lessonCompletedThisRun = false
            binding.layoutResults.visibility = View.GONE
            binding.tvQuestionCounter.visibility = View.VISIBLE
            binding.progressBarQuiz.visibility = View.VISIBLE
            binding.tvQuestion.visibility = View.VISIBLE
            optionButtons().forEach { it.visibility = View.VISIBLE }
            showQuestion()
        }

        binding.btnBackToLesson.setOnClickListener { finish() }

        showQuestion()
    }

    private fun optionButtons() = listOf(
        binding.btnOption0,
        binding.btnOption1,
        binding.btnOption2,
        binding.btnOption3
    )

    private fun speakOptionButtons() = listOf(
        binding.btnSpeakOption0,
        binding.btnSpeakOption1,
        binding.btnSpeakOption2,
        binding.btnSpeakOption3
    )

    override fun onDestroy() {
        speaker.shutdown()
        super.onDestroy()
    }

    override fun finish() {
        super.finish()
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)
    }
}
