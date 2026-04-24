package com.nihongo.beginner

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.snackbar.Snackbar
import com.nihongo.beginner.adapter.LessonAdapter
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.data.ProgressManager
import com.nihongo.beginner.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var adapter: LessonAdapter
    private var lastCompletedCount = -1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)

        val lessons = LessonData.getAllLessons()

        binding.rvLessons.layoutManager = LinearLayoutManager(this)

        binding.btnChallenge.setOnClickListener {
            launchWithTransition(Intent(this, GameChallengeActivity::class.java))
        }

        adapter = LessonAdapter(
            lessons = lessons,
            completedIds = emptySet(),
            onClick = { lesson ->
                launchWithTransition(
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

        val percent = completedCount * 100 / 17
        binding.progressBarMain.progress = percent
        binding.tvProgressPercent.text = "$percent%"
        binding.tvProgressText.text = "הושלמו $completedCount מתוך 17 שיעורים"
        binding.tvAchievementBanner.visibility = if (completedCount > 0) View.VISIBLE else View.GONE
        binding.tvAchievementBanner.text = if (completedCount == 17) {
            "כל השיעורים הושלמו. すごい!"
        } else {
            "המשיכי כך: עוד ${17 - completedCount} שיעורים לסיום"
        }

        if (lastCompletedCount >= 0 && completedCount > lastCompletedCount) {
            Snackbar.make(binding.root, "Lesson completed. Progress updated.", Snackbar.LENGTH_SHORT).show()
        }
        lastCompletedCount = completedCount

        adapter.updateCompletedIds(completedIds)
    }

    private fun launchWithTransition(intent: Intent) {
        startActivity(intent)
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)
    }
}
