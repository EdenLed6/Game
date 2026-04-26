package com.nihongo.beginner

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter

class LessonPagerAdapter(activity: FragmentActivity, private val lessonId: Int) :
    FragmentStateAdapter(activity) {

    override fun getItemCount() = 2

    override fun createFragment(position: Int): Fragment = when (position) {
        0 -> LessonContentFragment.newInstance(lessonId)
        else -> LessonVocabFragment.newInstance(lessonId)
    }
}
