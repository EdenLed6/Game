package com.nihongo.beginner

import android.os.Bundle
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.nihongo.beginner.adapter.ExampleAdapter
import com.nihongo.beginner.adapter.GrammarAdapter
import com.nihongo.beginner.adapter.VocabAdapter
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.databinding.ActivityLessonDetailBinding

class LessonDetailActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_LESSON_ID = "lesson_id"
    }

    private lateinit var binding: ActivityLessonDetailBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLessonDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

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
            binding.rvVocab.adapter = VocabAdapter(lesson.vocabulary)
        }

        // Examples section
        if (lesson.examples.isEmpty()) {
            binding.tvExamplesHeader.visibility = View.GONE
            binding.rvExamples.visibility = View.GONE
        } else {
            binding.tvExamplesHeader.visibility = View.VISIBLE
            binding.rvExamples.visibility = View.VISIBLE
            binding.rvExamples.layoutManager = LinearLayoutManager(this)
            binding.rvExamples.adapter = ExampleAdapter(lesson.examples)
        }

    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            onBackPressedDispatcher.onBackPressed()
            return true
        }
        return super.onOptionsItemSelected(item)
    }
}
