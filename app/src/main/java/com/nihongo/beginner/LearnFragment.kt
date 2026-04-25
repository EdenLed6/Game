package com.nihongo.beginner

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.nihongo.beginner.adapter.LessonPathAdapter
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.data.ProgressManager
import com.nihongo.beginner.databinding.FragmentLearnBinding

class LearnFragment : Fragment() {
    private var _binding: FragmentLearnBinding? = null
    private val binding get() = _binding!!
    private lateinit var pathAdapter: LessonPathAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentLearnBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.rvPath.layoutManager = LinearLayoutManager(requireContext())
        pathAdapter = LessonPathAdapter(emptyList())
        binding.rvPath.adapter = pathAdapter
        refresh()
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    private fun refresh() {
        val ctx = requireContext()
        val completedIds = ProgressManager.getCompletedLessonIds(ctx)
        val items = LessonPathAdapter.buildPathItems(LessonData.getAllLessons(), completedIds)
        pathAdapter.updateItems(items)
        binding.tvStreakCount.text = ProgressManager.getStreak(ctx).toString()
        binding.tvXpCount.text = "${ProgressManager.getTotalXP(ctx)} XP"
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
