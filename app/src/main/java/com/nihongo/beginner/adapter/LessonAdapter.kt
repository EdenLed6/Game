package com.nihongo.beginner.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.card.MaterialCardView
import com.nihongo.beginner.R
import com.nihongo.beginner.data.Lesson
import com.nihongo.beginner.databinding.ItemLessonCardBinding

class LessonAdapter(
    private val lessons: List<Lesson>,
    private var completedIds: Set<Int>,
    private val onClick: (Lesson) -> Unit
) : RecyclerView.Adapter<LessonAdapter.LessonViewHolder>() {

    inner class LessonViewHolder(private val binding: ItemLessonCardBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(lesson: Lesson) {
            val completed = lesson.id in completedIds
            binding.tvEmoji.text = lesson.emoji
            binding.tvLessonNumber.text = lesson.number
            binding.tvTitle.text = lesson.title
            binding.tvSubtitle.text = lesson.subtitle
            binding.ivCompleted.visibility = if (completed) View.VISIBLE else View.GONE
            binding.tvCompletionLabel.visibility = if (completed) View.VISIBLE else View.GONE
            binding.cardLesson.applyCompletedStyle(completed)
            binding.root.setOnClickListener { onClick(lesson) }
        }

        fun updateCompletionOnly(lesson: Lesson) {
            val completed = lesson.id in completedIds
            binding.ivCompleted.visibility = if (completed) View.VISIBLE else View.GONE
            binding.tvCompletionLabel.visibility = if (completed) View.VISIBLE else View.GONE
            binding.cardLesson.applyCompletedStyle(completed)
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

    override fun onBindViewHolder(holder: LessonViewHolder, position: Int, payloads: MutableList<Any>) {
        if (payloads.contains(PAYLOAD_COMPLETION)) {
            holder.updateCompletionOnly(lessons[position])
        } else {
            super.onBindViewHolder(holder, position, payloads)
        }
    }

    override fun getItemCount(): Int = lessons.size

    fun updateCompletedIds(newCompletedIds: Set<Int>) {
        val changedIds = completedIds symmetricDifference newCompletedIds
        completedIds = newCompletedIds
        changedIds.forEach { changedId ->
            val index = lessons.indexOfFirst { it.id == changedId }
            if (index >= 0) notifyItemChanged(index, PAYLOAD_COMPLETION)
        }
    }

    private fun MaterialCardView.applyCompletedStyle(completed: Boolean) {
        val color = if (completed) R.color.correct_green else R.color.cardStroke
        strokeWidth = if (completed) 2 else 1
        strokeColor = ContextCompat.getColor(context, color)
    }

    private infix fun Set<Int>.symmetricDifference(other: Set<Int>): Set<Int> {
        return (this - other) + (other - this)
    }

    companion object {
        private const val PAYLOAD_COMPLETION = "completion"
    }
}
