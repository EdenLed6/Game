package com.nihongo.beginner

import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.nihongo.beginner.adapter.ExampleAdapter
import com.nihongo.beginner.adapter.GrammarAdapter
import com.nihongo.beginner.adapter.VocabAdapter
import com.nihongo.beginner.audio.PronunciationSpeaker
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.databinding.ActivityLessonDetailBinding

class LessonDetailActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_LESSON_ID = "lesson_id"
    }

    private lateinit var binding: ActivityLessonDetailBinding
    private lateinit var speaker: PronunciationSpeaker

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLessonDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)
        speaker = PronunciationSpeaker(this)

        val lessonId = intent.getIntExtra(EXTRA_LESSON_ID, 1)
        val lesson = LessonData.getLessonById(lessonId)

        if (lesson == null) {
            finish()
            return
        }

        // Toolbar
        setSupportActionBar(binding.toolbar)
        supportActionBar?.title = lesson.title
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        // Header
        binding.tvHeaderEmoji.text = lesson.emoji
        binding.tvHeaderTitle.text = lesson.title
        binding.tvHeaderSubtitle.text = lesson.subtitle

        // Grammar RecyclerView
        binding.rvGrammar.layoutManager = LinearLayoutManager(this)
        binding.rvGrammar.adapter = GrammarAdapter(lesson.grammarPoints)

        // Vocabulary section
        if (lesson.vocabulary.isEmpty()) {
            binding.tvVocabHeader.visibility = View.GONE
            binding.rvVocab.visibility = View.GONE
        } else {
            binding.tvVocabHeader.visibility = View.VISIBLE
            binding.rvVocab.visibility = View.VISIBLE
            binding.rvVocab.layoutManager = LinearLayoutManager(this)
            binding.rvVocab.adapter = VocabAdapter(lesson.vocabulary) { speaker.speak(it) }
        }

        // Examples section
        if (lesson.examples.isEmpty()) {
            binding.tvExamplesHeader.visibility = View.GONE
            binding.rvExamples.visibility = View.GONE
        } else {
            binding.tvExamplesHeader.visibility = View.VISIBLE
            binding.rvExamples.visibility = View.VISIBLE
            binding.rvExamples.layoutManager = LinearLayoutManager(this)
            binding.rvExamples.adapter = ExampleAdapter(lesson.examples) { speaker.speak(it) }
        }

        // Games section visibility and state
        binding.tvGamesHeader.visibility = View.VISIBLE

        // Quiz — always available
        binding.btnQuiz.setOnClickListener {
            startActivity(Intent(this, QuizActivity::class.java).apply {
                putExtra(EXTRA_LESSON_ID, lesson.id)
            })
        }

        // Flashcards — enabled only when vocabulary is non-empty
        binding.btnFlashcards.isEnabled = lesson.vocabulary.isNotEmpty()
        binding.btnFlashcards.setOnClickListener {
            startActivity(Intent(this, FlashcardActivity::class.java).apply {
                putExtra(EXTRA_LESSON_ID, lesson.id)
            })
        }

        // Matching — enabled only when vocabulary has at least 4 items
        binding.btnMatching.isEnabled = lesson.vocabulary.size >= 4
        binding.btnMatching.setOnClickListener {
            startActivity(Intent(this, MatchingGameActivity::class.java).apply {
                putExtra(EXTRA_LESSON_ID, lesson.id)
            })
        }

        // Number Game — visible only for lesson 8
        if (lesson.id == 8) {
            binding.btnNumberGame.visibility = View.VISIBLE
            binding.btnNumberGame.setOnClickListener {
                startActivity(Intent(this, NumberGameActivity::class.java).apply {
                    putExtra(EXTRA_LESSON_ID, lesson.id)
                })
            }
        } else {
            binding.btnNumberGame.visibility = View.GONE
        }

        // Sentence Builder — visible only for lessons 11–16
        if (lesson.id in 11..16) {
            binding.btnSentenceBuilder.visibility = View.VISIBLE
            binding.btnSentenceBuilder.setOnClickListener {
                startActivity(Intent(this, SentenceBuilderActivity::class.java).apply {
                    putExtra(EXTRA_LESSON_ID, lesson.id)
                })
            }
        } else {
            binding.btnSentenceBuilder.visibility = View.GONE
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            onBackPressedDispatcher.onBackPressed()
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    override fun onDestroy() {
        speaker.shutdown()
        super.onDestroy()
    }
}
