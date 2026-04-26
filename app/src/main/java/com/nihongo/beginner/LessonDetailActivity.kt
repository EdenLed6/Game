package com.nihongo.beginner

import android.graphics.BitmapFactory
import android.graphics.drawable.BitmapDrawable
import android.os.Bundle
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.tabs.TabLayoutMediator
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

        binding.viewPager.adapter = LessonPagerAdapter(this, lessonId)
        TabLayoutMediator(binding.tabLayout, binding.viewPager) { tab, pos ->
            tab.text = if (pos == 0) "תוכן השיעור" else "מילים חדשות"
        }.attach()
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            onBackPressedDispatcher.onBackPressed()
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    override fun finish() {
        super.finish()
        @Suppress("DEPRECATION")
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)
    }
}
