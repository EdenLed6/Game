package com.nihongo.beginner

import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.nihongo.beginner.databinding.ActivityNumberGameBinding

class NumberGameActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_LESSON_ID = "lesson_id"
    }

    private lateinit var binding: ActivityNumberGameBinding
    private var score = 0
    private var round = 0
    private var correctIndex = 0
    private var isTypeA = true

    private fun numberToRomaji(n: Int): String {
        if (n == 0) return "zero"
        val parts = mutableListOf<String>()
        var remaining = n

        val thousands = remaining / 1000
        remaining %= 1000
        if (thousands > 0) {
            parts.add(
                when (thousands) {
                    1 -> "sen"
                    2 -> "ni-sen"
                    3 -> "san-zen"
                    4 -> "yon-sen"
                    5 -> "go-sen"
                    6 -> "roku-sen"
                    7 -> "nana-sen"
                    8 -> "has-sen"
                    9 -> "kyuu-sen"
                    else -> ""
                }
            )
        }

        val hundreds = remaining / 100
        remaining %= 100
        if (hundreds > 0) {
            parts.add(
                when (hundreds) {
                    1 -> "hyaku"
                    2 -> "ni-hyaku"
                    3 -> "san-byaku"
                    4 -> "yon-hyaku"
                    5 -> "go-hyaku"
                    6 -> "rop-pyaku"
                    7 -> "nana-hyaku"
                    8 -> "hap-pyaku"
                    9 -> "kyuu-hyaku"
                    else -> ""
                }
            )
        }

        val tens = remaining / 10
        remaining %= 10
        if (tens > 0) {
            parts.add(
                when (tens) {
                    1 -> "juu"
                    2 -> "ni-juu"
                    3 -> "san-juu"
                    4 -> "yon-juu"
                    5 -> "go-juu"
                    6 -> "roku-juu"
                    7 -> "nana-juu"
                    8 -> "hachi-juu"
                    9 -> "kyuu-juu"
                    else -> ""
                }
            )
        }

        if (remaining > 0) {
            parts.add(
                when (remaining) {
                    1 -> "ichi"
                    2 -> "ni"
                    3 -> "san"
                    4 -> "yon"
                    5 -> "go"
                    6 -> "roku"
                    7 -> "nana"
                    8 -> "hachi"
                    9 -> "kyuu"
                    else -> ""
                }
            )
        }

        return parts.filter { it.isNotEmpty() }.joinToString(" ")
    }

    private fun generateWrongNumbers(correct: Int, count: Int): List<Int> {
        val wrongs = mutableListOf<Int>()
        while (wrongs.size < count) {
            val candidate = (1..9999).random()
            if (candidate != correct && candidate !in wrongs) {
                wrongs.add(candidate)
            }
        }
        return wrongs
    }

    private fun startRound() {
        val optionButtons = listOf(
            binding.btnNumOpt0, binding.btnNumOpt1, binding.btnNumOpt2, binding.btnNumOpt3
        )
        optionButtons.forEach {
            it.isEnabled = true
            it.backgroundTintList = ColorStateList.valueOf(getColor(R.color.white))
            it.setTextColor(getColor(R.color.onSurface))
        }
        binding.tvNumFeedback.visibility = View.INVISIBLE

        val number = (1..9999).random()
        isTypeA = (round % 2 == 0)

        val wrongNumbers = generateWrongNumbers(number, 3)
        val allNumbers = (listOf(number) + wrongNumbers).shuffled()
        val shuffledCorrectIndex = allNumbers.indexOf(number)
        correctIndex = shuffledCorrectIndex

        if (isTypeA) {
            binding.tvNumQuestion.text = "כיצד אומרים את המספר ביפנית?"
            binding.tvNumDisplay.text = number.toString()
            allNumbers.forEachIndexed { i, n ->
                optionButtons[i].text = numberToRomaji(n)
            }
        } else {
            binding.tvNumQuestion.text = "מה המספר?"
            binding.tvNumDisplay.text = numberToRomaji(number)
            allNumbers.forEachIndexed { i, n ->
                optionButtons[i].text = n.toString()
            }
        }
    }

    private fun showResult() {
        binding.layoutNumResult.visibility = View.VISIBLE
        binding.tvNumQuestion.visibility = View.GONE
        binding.tvNumDisplay.visibility = View.GONE
        binding.btnNumOpt0.visibility = View.GONE
        binding.btnNumOpt1.visibility = View.GONE
        binding.btnNumOpt2.visibility = View.GONE
        binding.btnNumOpt3.visibility = View.GONE
        binding.tvNumFeedback.visibility = View.GONE
        binding.tvNumFinalScore.text = "$score / 10"
    }

    private fun onOptionSelected(selectedIndex: Int) {
        val optionButtons = listOf(
            binding.btnNumOpt0, binding.btnNumOpt1, binding.btnNumOpt2, binding.btnNumOpt3
        )
        optionButtons.forEach { it.isEnabled = false }

        optionButtons[correctIndex].backgroundTintList = ColorStateList.valueOf(getColor(R.color.correct_green))
        optionButtons[correctIndex].setTextColor(Color.WHITE)
        if (selectedIndex != correctIndex) {
            optionButtons[selectedIndex].backgroundTintList = ColorStateList.valueOf(getColor(R.color.wrong_red))
            optionButtons[selectedIndex].setTextColor(Color.WHITE)
            binding.tvNumFeedback.text = "לא נכון! התשובה הנכונה מודגשת בירוק"
        } else {
            score++
            binding.tvNumScore.text = "ניקוד: $score"
            binding.tvNumFeedback.text = "נכון!"
        }
        binding.tvNumFeedback.visibility = View.VISIBLE

        round++
        if (round >= 10) {
            binding.tvNumFeedback.postDelayed({ showResult() }, 1000)
        } else {
            binding.tvNumFeedback.postDelayed({ startRound() }, 1000)
        }
    }

    private fun restartGame() {
        score = 0
        round = 0
        binding.tvNumScore.text = "ניקוד: 0"
        binding.layoutNumResult.visibility = View.GONE
        binding.tvNumQuestion.visibility = View.VISIBLE
        binding.tvNumDisplay.visibility = View.VISIBLE
        binding.btnNumOpt0.visibility = View.VISIBLE
        binding.btnNumOpt1.visibility = View.VISIBLE
        binding.btnNumOpt2.visibility = View.VISIBLE
        binding.btnNumOpt3.visibility = View.VISIBLE
        startRound()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityNumberGameBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener { finish() }

        binding.layoutNumResult.visibility = View.GONE
        binding.tvNumScore.text = "ניקוד: 0"

        binding.btnNumOpt0.setOnClickListener { onOptionSelected(0) }
        binding.btnNumOpt1.setOnClickListener { onOptionSelected(1) }
        binding.btnNumOpt2.setOnClickListener { onOptionSelected(2) }
        binding.btnNumOpt3.setOnClickListener { onOptionSelected(3) }

        binding.btnNumReplay.setOnClickListener { restartGame() }
        binding.btnNumBack.setOnClickListener { finish() }

        startRound()
    }
}
