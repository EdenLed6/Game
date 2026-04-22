package com.nihongo.beginner.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.nihongo.beginner.data.VocabItem
import com.nihongo.beginner.databinding.ItemVocabBinding

class VocabAdapter(
    private val items: List<VocabItem>
) : RecyclerView.Adapter<VocabAdapter.VocabViewHolder>() {

    inner class VocabViewHolder(private val binding: ItemVocabBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: VocabItem) {
            binding.tvVocabEmoji.text = item.emoji
            binding.tvJapanese.text = item.japanese
            binding.tvRomaji.text = item.romaji
            binding.tvHebrew.text = item.hebrew
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VocabViewHolder {
        val binding = ItemVocabBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return VocabViewHolder(binding)
    }

    override fun onBindViewHolder(holder: VocabViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size
}
