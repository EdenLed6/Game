package com.nihongo.beginner

import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import com.nihongo.beginner.adapter.WordChipAdapter
import com.nihongo.beginner.data.Example
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.databinding.ActivitySentenceBuilderBinding

class SentenceBuilderActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_LESSON_ID = "lesson_id"
    }

    private lateinit var binding: ActivitySentenceBuilderBinding
    private lateinit var examples: List<Example>
    private lateinit var chipAdapter: WordChipAdapter

    private var currentIndex = 0
    private var score = 0
    private val builtWords = mutableListOf<String>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySentenceBuilderBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val lessonId = intent.getIntExtra(EXTRA_LESSON_ID, -1)
        val lesson = LessonData.getLessonById(lessonId)
        if (lesson == null) {
            finish()
            return
        }

        examples = lesson.examples
        if (examples.isEmpty()) {
            finish()
            return
        }

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener { finish() }

        chipAdapter = WordChipAdapter(emptyList()) { index ->
            val word = chipAdapter.getWord(index)
            builtWords.add(word)
            updateBuiltText()
        }

        binding.rvSbWords.layoutManager = GridLayoutManager(this, 4)
        binding.rvSbWords.adapter = chipAdapter

        binding.layoutSbResult.visibility = View.GONE

        binding.btnSbCheck.setOnClickListener { checkAnswer() }
        binding.btnSbNext.setOnClickListener { advanceQuestion() }
        binding.btnSbReplay.setOnClickListener { restartGame() }
        binding.btnSbBack.setOnClickListener { finish() }

        loadQuestion()
    }

    private fun loadQuestion() {
        val example = examples[currentIndex]
        builtWords.clear()

        binding.tvSbQuestion.text = example.hebrew
        binding.tvSbInstruction.text = "סדר את המילים כדי לבנות את המשפט"
        binding.tvSbBuilt.text = ""
        binding.tvSbFeedback.text = ""
        binding.tvSbFeedback.visibility = View.INVISIBLE
        binding.btnSbCheck.visibility = View.VISIBLE
        binding.btnSbNext.visibility = View.GONE
        updateScore()

        val words = example.romaji.trim().split(" ").toMutableList()
        words.shuffle()
        chipAdapter.resetChips(words)
    }

    private fun updateBuiltText() {
        binding.tvSbBuilt.text = builtWords.joinToString(" ")
    }

    private fun updateScore() {
        binding.tvSbScore.text = "ניקוד: $score"
    }

    private fun checkAnswer() {
        val example = examples[currentIndex]
        val built = builtWords.joinToString(" ").trim()
        if (built.equals(example.romaji.trim(), ignoreCase = true)) {
            score++
            binding.tvSbFeedback.text = "נכון! 🎉"
        } else {
            binding.tvSbFeedback.text = "לא נכון. התשובה: ${example.romaji}"
        }
        binding.tvSbFeedback.visibility = View.VISIBLE
        binding.btnSbCheck.visibility = View.GONE
        binding.btnSbNext.visibility = View.VISIBLE
        updateScore()
    }

    private fun advanceQuestion() {
        currentIndex++
        if (currentIndex < examples.size) {
            loadQuestion()
        } else {
            showResults()
        }
    }

    private fun showResults() {
        binding.layoutSbResult.visibility = View.VISIBLE
        binding.tvSbFinalScore.text = "$score / ${examples.size}"
    }

    private fun restartGame() {
        currentIndex = 0
        score = 0
        binding.layoutSbResult.visibility = View.GONE
        loadQuestion()
    }
}
