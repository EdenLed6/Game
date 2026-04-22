package com.nihongo.beginner.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.nihongo.beginner.data.Lesson
import com.nihongo.beginner.databinding.ItemLessonCardBinding

class LessonAdapter(
    private val lessons: List<Lesson>,
    private val onClick: (Lesson) -> Unit
) : RecyclerView.Adapter<LessonAdapter.LessonViewHolder>() {

    inner class LessonViewHolder(private val binding: ItemLessonCardBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(lesson: Lesson) {
            binding.tvEmoji.text = lesson.emoji
            binding.tvLessonNumber.text = lesson.number
            binding.tvTitle.text = lesson.title
            binding.tvSubtitle.text = lesson.subtitle
            binding.root.setOnClickListener { onClick(lesson) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LessonViewHolder {
        val binding = ItemLessonCardBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return LessonViewHolder(binding)
    }

    override fun onBindViewHolder(holder: LessonViewHolder, position: Int) {
        holder.bind(lessons[position])
    }

    override fun getItemCount(): Int = lessons.size
}
