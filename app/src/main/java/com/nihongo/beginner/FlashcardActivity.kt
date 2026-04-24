package com.nihongo.beginner

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.nihongo.beginner.audio.PronunciationSpeaker
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.data.VocabItem
import com.nihongo.beginner.databinding.ActivityFlashcardBinding
import android.view.View

class FlashcardActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_LESSON_ID = "lesson_id"
    }

    private lateinit var binding: ActivityFlashcardBinding
    private lateinit var speaker: PronunciationSpeaker
    private lateinit var vocab: List<VocabItem>
    private var currentIndex = 0
    private var showingFront = true

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityFlashcardBinding.inflate(layoutInflater)
        setContentView(binding.root)
        speaker = PronunciationSpeaker(this)

        val lessonId = intent.getIntExtra(EXTRA_LESSON_ID, -1)
        val lesson = LessonData.getLessonById(lessonId)
        if (lesson == null) {
            finish()
            return
        }

        vocab = lesson.vocabulary
        if (vocab.isEmpty()) {
            finish()
            return
        }

        setSupportActionBar(binding.toolbar)
        binding.toolbar.setNavigationOnClickListener { finish() }

        binding.cardFront.setOnClickListener { toggleCard() }
        binding.cardBack.setOnClickListener { toggleCard() }
        binding.btnFlip.setOnClickListener { toggleCard() }
        binding.btnSpeakCard.setOnClickListener { speaker.speak(vocab[currentIndex].japanese) }

        binding.btnPrev.setOnClickListener {
            if (currentIndex > 0) {
                currentIndex--
                showingFront = true
                updateCard()
            }
        }

        binding.btnNext.setOnClickListener {
            if (currentIndex < vocab.size - 1) {
                currentIndex++
                showingFront = true
                updateCard()
            }
        }

        updateCard()
    }

    private fun toggleCard() {
        showingFront = !showingFront
        updateCardVisibility()
    }

    private fun updateCard() {
        val item = vocab[currentIndex]
        binding.tvCardCounter.text = "${currentIndex + 1} / ${vocab.size}"

        binding.tvFrontJapanese.text = item.japanese
        binding.tvFrontRomaji.text = item.romaji
        binding.tvHintTap.text = "הקש להפיכה"

        binding.tvBackHebrew.text = item.hebrew
        binding.tvBackJapanese.text = item.japanese
        binding.tvBackRomaji.text = item.romaji
        binding.tvBackEmoji.text = item.emoji

        binding.btnPrev.isEnabled = currentIndex > 0
        binding.btnNext.isEnabled = currentIndex < vocab.size - 1

        updateCardVisibility()
    }

    private fun updateCardVisibility() {
        if (showingFront) {
            binding.cardFront.visibility = View.VISIBLE
            binding.cardBack.visibility = View.GONE
        } else {
            binding.cardFront.visibility = View.GONE
            binding.cardBack.visibility = View.VISIBLE
        }
    }

    override fun onDestroy() {
        speaker.shutdown()
        super.onDestroy()
    }
}
