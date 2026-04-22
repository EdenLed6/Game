package com.nihongo.beginner

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.nihongo.beginner.adapter.MatchAdapter
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.data.VocabItem
import com.nihongo.beginner.databinding.ActivityMatchingBinding

class MatchingGameActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_LESSON_ID = "lesson_id"
    }

    private lateinit var binding: ActivityMatchingBinding
    private lateinit var vocabItems: List<VocabItem>
    private lateinit var leftWords: List<String>
    private lateinit var rightWords: List<String>
    private lateinit var leftAdapter: MatchAdapter
    private lateinit var rightAdapter: MatchAdapter

    private var selectedLeft: Int? = null
    private var selectedRight: Int? = null
    private var score = 0
    private var matchedCount = 0
    private var isProcessing = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMatchingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val lessonId = intent.getIntExtra(EXTRA_LESSON_ID, -1)
        val lesson = LessonData.getLessonById(lessonId)
        if (lesson == null) {
            finish()
            return
        }

        if (lesson.vocabulary.size < 4) {
            finish()
            return
        }

        vocabItems = lesson.vocabulary.shuffled().take(8)

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener { finish() }

        binding.tvMatchInstructions.text = "התאם את המילים היפניות לתרגומן"

        binding.btnMatchAgain.setOnClickListener { startGame() }
        binding.btnMatchBack.setOnClickListener { finish() }

        startGame()
    }

    private fun startGame() {
        selectedLeft = null
        selectedRight = null
        score = 0
        matchedCount = 0
        isProcessing = false

        binding.tvMatchScore.text = "ניקוד: $score"
        binding.layoutMatchComplete.visibility = View.GONE

        val shuffledItems = vocabItems.shuffled()
        leftWords = shuffledItems.map { it.japanese }
        rightWords = shuffledItems.shuffled().map { it.hebrew }

        leftAdapter = MatchAdapter(leftWords) { index -> onLeftItemClick(index) }
        rightAdapter = MatchAdapter(rightWords) { index -> onRightItemClick(index) }

        binding.rvMatchLeft.layoutManager = LinearLayoutManager(this)
        binding.rvMatchLeft.adapter = leftAdapter

        binding.rvMatchRight.layoutManager = LinearLayoutManager(this)
        binding.rvMatchRight.adapter = rightAdapter
    }

    private fun onLeftItemClick(index: Int) {
        if (isProcessing) return
        selectedLeft?.let { prev ->
            if (prev != index) {
                leftAdapter.setItemState(prev, MatchAdapter.State.NORMAL)
            }
        }
        selectedLeft = index
        leftAdapter.setItemState(index, MatchAdapter.State.SELECTED)
        tryMatch()
    }

    private fun onRightItemClick(index: Int) {
        if (isProcessing) return
        selectedRight?.let { prev ->
            if (prev != index) {
                rightAdapter.setItemState(prev, MatchAdapter.State.NORMAL)
            }
        }
        selectedRight = index
        rightAdapter.setItemState(index, MatchAdapter.State.SELECTED)
        tryMatch()
    }

    private fun tryMatch() {
        val left = selectedLeft ?: return
        val right = selectedRight ?: return

        isProcessing = true

        val leftWord = leftAdapter.getWord(left)
        val rightWord = rightAdapter.getWord(right)

        val isMatch = vocabItems.any { it.japanese == leftWord && it.hebrew == rightWord }

        if (isMatch) {
            leftAdapter.setItemState(left, MatchAdapter.State.MATCHED)
            rightAdapter.setItemState(right, MatchAdapter.State.MATCHED)
            score++
            matchedCount++
            binding.tvMatchScore.text = "ניקוד: $score"
            selectedLeft = null
            selectedRight = null
            isProcessing = false
            if (matchedCount == vocabItems.size) {
                showComplete()
            }
        } else {
            leftAdapter.setItemState(left, MatchAdapter.State.WRONG)
            rightAdapter.setItemState(right, MatchAdapter.State.WRONG)
            Handler(Looper.getMainLooper()).postDelayed({
                leftAdapter.resetItem(left)
                rightAdapter.resetItem(right)
                selectedLeft = null
                selectedRight = null
                isProcessing = false
            }, 500)
        }
    }

    private fun showComplete() {
        leftAdapter.disableAll()
        rightAdapter.disableAll()
        binding.tvMatchResult.text = "כל הזוגות הותאמו! ניקוד: $score"
        binding.tvMatchTime.text = ""
        binding.layoutMatchComplete.visibility = View.VISIBLE
    }
}
