package com.nihongo.beginner

import android.graphics.Color
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.data.ProgressManager
import com.nihongo.beginner.databinding.ActivityQuizBinding

class QuizActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_LESSON_ID = "lesson_id"
    }

    private lateinit var binding: ActivityQuizBinding
    private var lessonId: Int = -1
    private var currentIndex = 0
    private var score = 0

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

        val questions = lesson.exercises
        val total = questions.size

        fun resetButtonColors() {
            val buttons = listOf(binding.btnOption0, binding.btnOption1, binding.btnOption2, binding.btnOption3)
            buttons.forEach { it.setBackgroundColor(Color.parseColor("#C62828")) }
        }

        fun showQuestion() {
            val question = questions[currentIndex]
            binding.tvQuestionCounter.text = "שאלה ${currentIndex + 1} מתוך $total"
            binding.progressBarQuiz.progress = currentIndex * 100 / total
            binding.tvQuestion.text = question.question
            val options = question.options
            val optionButtons = listOf(binding.btnOption0, binding.btnOption1, binding.btnOption2, binding.btnOption3)
            optionButtons.forEachIndexed { i, btn ->
                btn.text = if (i < options.size) options[i] else ""
                btn.isEnabled = true
            }
            resetButtonColors()
            binding.tvFeedback.text = ""
            binding.tvFeedback.visibility = android.view.View.INVISIBLE
            binding.btnNext.visibility = android.view.View.GONE
        }

        fun showResults() {
            binding.tvQuestionCounter.visibility = android.view.View.GONE
            binding.progressBarQuiz.visibility = android.view.View.GONE
            binding.tvQuestion.visibility = android.view.View.GONE
            binding.btnOption0.visibility = android.view.View.GONE
            binding.btnOption1.visibility = android.view.View.GONE
            binding.btnOption2.visibility = android.view.View.GONE
            binding.btnOption3.visibility = android.view.View.GONE
            binding.tvFeedback.visibility = android.view.View.GONE
            binding.btnNext.visibility = android.view.View.GONE
            binding.layoutResults.visibility = android.view.View.VISIBLE

            binding.tvFinalScore.text = "$score / $total"
            if (score * 100 / total >= 70) {
                binding.tvResultEmoji.text = "🎉"
                binding.tvResultMessage.text = "כל הכבוד! עברת את השיעור!"
                ProgressManager.markLessonCompleted(this, lessonId)
            } else {
                binding.tvResultEmoji.text = "📚"
                binding.tvResultMessage.text = "נסה שוב כדי לעבור את השיעור (70% נדרש)"
            }
        }

        fun onOptionSelected(selectedIndex: Int) {
            val question = questions[currentIndex]
            val optionButtons = listOf(binding.btnOption0, binding.btnOption1, binding.btnOption2, binding.btnOption3)
            optionButtons.forEach { it.isEnabled = false }

            val correctIndex = question.correctIndex
            optionButtons[correctIndex].setBackgroundColor(Color.parseColor("#4CAF50"))
            if (selectedIndex != correctIndex) {
                optionButtons[selectedIndex].setBackgroundColor(Color.parseColor("#F44336"))
            } else {
                score++
            }

            binding.tvFeedback.text = question.explanation
            binding.tvFeedback.visibility = android.view.View.VISIBLE
            binding.btnNext.visibility = android.view.View.VISIBLE
        }

        binding.btnOption0.setOnClickListener { onOptionSelected(0) }
        binding.btnOption1.setOnClickListener { onOptionSelected(1) }
        binding.btnOption2.setOnClickListener { onOptionSelected(2) }
        binding.btnOption3.setOnClickListener { onOptionSelected(3) }

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
            binding.layoutResults.visibility = android.view.View.GONE
            binding.tvQuestionCounter.visibility = android.view.View.VISIBLE
            binding.progressBarQuiz.visibility = android.view.View.VISIBLE
            binding.tvQuestion.visibility = android.view.View.VISIBLE
            binding.btnOption0.visibility = android.view.View.VISIBLE
            binding.btnOption1.visibility = android.view.View.VISIBLE
            binding.btnOption2.visibility = android.view.View.VISIBLE
            binding.btnOption3.visibility = android.view.View.VISIBLE
            showQuestion()
        }

        binding.btnBackToLesson.setOnClickListener { finish() }

        showQuestion()
    }
}
