package com.nihongo.beginner.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.nihongo.beginner.data.GrammarPoint
import com.nihongo.beginner.databinding.ItemGrammarBinding

class GrammarAdapter(
    private val items: List<GrammarPoint>
) : RecyclerView.Adapter<GrammarAdapter.GrammarViewHolder>() {

    inner class GrammarViewHolder(private val binding: ItemGrammarBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: GrammarPoint) {
            binding.tvGrammarTitle.text = item.title
            binding.tvGrammarContent.text = item.content
            binding.tvGrammarPattern.visibility = if (item.pattern != null) View.VISIBLE else View.GONE
            if (item.pattern != null) {
                binding.tvGrammarPattern.text = item.pattern
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): GrammarViewHolder {
        val binding = ItemGrammarBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return GrammarViewHolder(binding)
    }

    override fun onBindViewHolder(holder: GrammarViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size
}
