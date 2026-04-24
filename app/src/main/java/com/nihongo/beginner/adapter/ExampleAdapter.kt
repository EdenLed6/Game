package com.nihongo.beginner.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.nihongo.beginner.data.Example
import com.nihongo.beginner.databinding.ItemExampleBinding

class ExampleAdapter(
    private val items: List<Example>,
    private val onSpeak: (String) -> Unit = {}
) : RecyclerView.Adapter<ExampleAdapter.ExampleViewHolder>() {

    inner class ExampleViewHolder(private val binding: ItemExampleBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: Example) {
            binding.tvExRomaji.text = item.romaji
            binding.tvExJapanese.text = item.japanese
            binding.tvExJapanese.visibility = if (item.japanese.isNotEmpty()) View.VISIBLE else View.GONE
            binding.tvExHebrew.text = item.hebrew
            binding.btnSpeakExample.visibility = if (item.japanese.isNotEmpty()) View.VISIBLE else View.GONE
            binding.btnSpeakExample.setOnClickListener { onSpeak(item.japanese) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ExampleViewHolder {
        val binding = ItemExampleBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ExampleViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ExampleViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size
}
