package com.nihongo.beginner

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.nihongo.beginner.adapter.LessonAdapter
import com.nihongo.beginner.data.LessonData
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

        adapter = LessonAdapter(
            lessons = lessons,
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

}
