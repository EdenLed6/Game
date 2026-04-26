package com.nihongo.beginner

import android.content.Intent
import android.graphics.BitmapFactory
import android.graphics.drawable.BitmapDrawable
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.tabs.TabLayout
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

        binding.appBarLayout.background = object : BitmapDrawable(
            resources, BitmapFactory.decodeResource(resources, R.drawable.bg_header)
        ) {
            override fun getIntrinsicWidth() = -1
            override fun getIntrinsicHeight() = -1
            override fun getMinimumWidth() = 0
            override fun getMinimumHeight() = 0
            init { gravity = android.view.Gravity.FILL_HORIZONTAL or android.view.Gravity.CENTER_VERTICAL }
        }

        val lessonId = intent.getIntExtra(EXTRA_LESSON_ID, 1)
        val lesson = LessonData.getLessonById(lessonId)

        if (lesson == null) {
            finish()
            return
        }

        setSupportActionBar(binding.toolbar)
        supportActionBar?.title = lesson.title
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        binding.tvHeaderEmoji.text = lesson.emoji
        binding.tvHeaderTitle.text = lesson.title
        binding.tvHeaderSubtitle.text = lesson.subtitle

        // Grammar
        binding.rvGrammar.layoutManager = LinearLayoutManager(this)
        binding.rvGrammar.adapter = GrammarAdapter(lesson.grammarPoints)

        // Examples
        if (lesson.examples.isEmpty()) {
            binding.layoutExamplesHeader.visibility = View.GONE
            binding.rvExamples.visibility = View.GONE
        } else {
            binding.rvExamples.layoutManager = LinearLayoutManager(this)
            binding.rvExamples.adapter = ExampleAdapter(lesson.examples) { speaker.speak(it) }
        }

        // Vocabulary (page 2)
        if (lesson.vocabulary.isEmpty()) {
            binding.rvVocab.visibility = View.GONE
            binding.tvVocabHeader.visibility = View.VISIBLE
        } else {
            binding.rvVocab.layoutManager = LinearLayoutManager(this)
            binding.rvVocab.adapter = VocabAdapter(lesson.vocabulary) { speaker.speak(it) }
        }

        // Games
        binding.btnWorkbook.setOnClickListener {
            launchWithTransition(Intent(this, WorkbookActivity::class.java).apply {
                putExtra(WorkbookActivity.EXTRA_LESSON_ID, lesson.id)
            })
        }
        binding.btnQuiz.setOnClickListener {
            launchWithTransition(Intent(this, QuizActivity::class.java).apply {
                putExtra(EXTRA_LESSON_ID, lesson.id)
            })
        }
        binding.btnFlashcards.isEnabled = lesson.vocabulary.isNotEmpty()
        binding.btnFlashcards.setOnClickListener {
            launchWithTransition(Intent(this, FlashcardActivity::class.java).apply {
                putExtra(EXTRA_LESSON_ID, lesson.id)
            })
        }
        binding.btnMatching.isEnabled = lesson.vocabulary.size >= 4
        binding.btnMatching.setOnClickListener {
            launchWithTransition(Intent(this, MatchingGameActivity::class.java).apply {
                putExtra(EXTRA_LESSON_ID, lesson.id)
            })
        }
        if (lesson.id == 8) {
            binding.btnNumberGame.visibility = View.VISIBLE
            binding.btnNumberGame.setOnClickListener {
                launchWithTransition(Intent(this, NumberGameActivity::class.java).apply {
                    putExtra(EXTRA_LESSON_ID, lesson.id)
                })
            }
        }
        if (lesson.id in 11..16) {
            binding.btnSentenceBuilder.visibility = View.VISIBLE
            binding.btnSentenceBuilder.setOnClickListener {
                launchWithTransition(Intent(this, SentenceBuilderActivity::class.java).apply {
                    putExtra(EXTRA_LESSON_ID, lesson.id)
                })
            }
        }

        // Tabs
        binding.tabLayout.addTab(binding.tabLayout.newTab().setText("תוכן השיעור"))
        binding.tabLayout.addTab(binding.tabLayout.newTab().setText("מילים חדשות"))
        binding.tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab) {
                when (tab.position) {
                    0 -> { binding.pageContent.visibility = View.VISIBLE; binding.pageVocab.visibility = View.GONE }
                    1 -> { binding.pageContent.visibility = View.GONE;    binding.pageVocab.visibility = View.VISIBLE }
                }
            }
            override fun onTabUnselected(tab: TabLayout.Tab) {}
            override fun onTabReselected(tab: TabLayout.Tab) {}
        })
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

    private fun launchWithTransition(intent: Intent) {
        startActivity(intent)
        @Suppress("DEPRECATION")
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)
    }

    override fun finish() {
        super.finish()
        @Suppress("DEPRECATION")
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)
    }
}
