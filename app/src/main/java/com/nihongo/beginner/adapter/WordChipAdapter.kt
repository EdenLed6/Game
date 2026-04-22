package com.nihongo.beginner.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.nihongo.beginner.databinding.ItemWordChipBinding

class WordChipAdapter(
    private var words: List<String>,
    private val onChipClick: (index: Int) -> Unit
) : RecyclerView.Adapter<WordChipAdapter.WordChipViewHolder>() {

    inner class WordChipViewHolder(private val binding: ItemWordChipBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(word: String, index: Int) {
            binding.tvChipWord.text = word
            binding.root.visibility = View.VISIBLE
            binding.root.setOnClickListener {
                onChipClick(index)
                binding.root.visibility = View.GONE
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): WordChipViewHolder {
        val binding = ItemWordChipBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return WordChipViewHolder(binding)
    }

    override fun onBindViewHolder(holder: WordChipViewHolder, position: Int) {
        holder.bind(words[position], position)
    }

    override fun getItemCount(): Int = words.size

    fun resetChips(newWords: List<String>) {
        words = newWords
        notifyDataSetChanged()
    }

    fun getWord(index: Int): String = words[index]
}
