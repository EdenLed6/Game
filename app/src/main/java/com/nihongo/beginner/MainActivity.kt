package com.nihongo.beginner

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.nihongo.beginner.adapter.LessonAdapter
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.data.ProgressManager
import com.nihongo.beginner.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var adapter: LessonAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)

        val lessons = LessonData.getAllLessons()

        binding.rvLessons.layoutManager = LinearLayoutManager(this)

        binding.btnChallenge.setOnClickListener {
            startActivity(Intent(this, GameChallengeActivity::class.java))
        }

        adapter = LessonAdapter(
            lessons = lessons,
            completedIds = emptySet(),
            onClick = { lesson ->
                startActivity(
                    Intent(this, LessonDetailActivity::class.java).apply {
                        putExtra(LessonDetailActivity.EXTRA_LESSON_ID, lesson.id)
                    }
                )
            }
        )
        binding.rvLessons.adapter = adapter
    }

    override fun onResume() {
        super.onResume()
        val completedCount = ProgressManager.getCompletedCount(this)
        val completedIds = (1..17)
            .filter { ProgressManager.isLessonCompleted(this, it) }
            .toSet()

        binding.progressBarMain.progress = completedCount * 100 / 17
        binding.tvProgressText.text = "הושלמו $completedCount מתוך 17 שיעורים"

        adapter.updateCompletedIds(completedIds)
    }
}
