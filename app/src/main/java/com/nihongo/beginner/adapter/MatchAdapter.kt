package com.nihongo.beginner.adapter

import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.nihongo.beginner.databinding.ItemMatchWordBinding

class MatchAdapter(
    private val words: List<String>,
    private val onItemClick: (index: Int) -> Unit
) : RecyclerView.Adapter<MatchAdapter.MatchViewHolder>() {

    enum class State {
        NORMAL, SELECTED, MATCHED, WRONG
    }

    private val states = MutableList(words.size) { State.NORMAL }

    inner class MatchViewHolder(private val binding: ItemMatchWordBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(word: String, state: State, position: Int) {
            binding.tvMatchWord.text = word
            when (state) {
                State.NORMAL -> {
                    binding.cardWord.setCardBackgroundColor(Color.WHITE)
                    binding.cardWord.isClickable = true
                    binding.cardWord.setOnClickListener { onItemClick(position) }
                }
                State.SELECTED -> {
                    binding.cardWord.setCardBackgroundColor(Color.parseColor("#FFF176"))
                    binding.cardWord.isClickable = true
                    binding.cardWord.setOnClickListener { onItemClick(position) }
                }
                State.MATCHED -> {
                    binding.cardWord.setCardBackgroundColor(Color.parseColor("#A5D6A7"))
                    binding.cardWord.isClickable = false
                    binding.cardWord.setOnClickListener(null)
                }
                State.WRONG -> {
                    binding.cardWord.setCardBackgroundColor(Color.parseColor("#EF9A9A"))
                    binding.cardWord.isClickable = true
                    binding.cardWord.setOnClickListener { onItemClick(position) }
                }
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MatchViewHolder {
        val binding = ItemMatchWordBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return MatchViewHolder(binding)
    }

    override fun onBindViewHolder(holder: MatchViewHolder, position: Int) {
        holder.bind(words[position], states[position], position)
    }

    override fun getItemCount(): Int = words.size

    fun setItemState(index: Int, state: State) {
        states[index] = state
        notifyItemChanged(index)
    }

    fun getWord(index: Int): String = words[index]

    fun resetItem(index: Int) {
        setItemState(index, State.NORMAL)
    }

    fun disableAll() {
        for (i in states.indices) {
            states[i] = State.MATCHED
        }
        notifyDataSetChanged()
    }
}
