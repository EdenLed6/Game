package com.nihongo.beginner

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import com.nihongo.beginner.data.ProgressManager
import com.nihongo.beginner.databinding.FragmentProfileBinding

class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnResetProgress.setOnClickListener {
            AlertDialog.Builder(requireContext())
                .setTitle("איפוס התקדמות")
                .setMessage("האם לאפס את כל ההתקדמות שלך? פעולה זו אינה ניתנת לביטול.")
                .setPositiveButton("אפס") { _, _ ->
                    ProgressManager.resetProgress(requireContext())
                    refresh()
                }
                .setNegativeButton("ביטול", null)
                .show()
        }

        refresh()
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    private fun refresh() {
        val ctx = requireContext()
        val completed = ProgressManager.getCompletedCount(ctx)
        val total = ProgressManager.getTotalLessons()
        val xp = ProgressManager.getTotalXP(ctx)
        val streak = ProgressManager.getStreak(ctx)
        val percent = (completed * 100) / total

        binding.tvStatStreak.text = streak.toString()
        binding.tvStatXP.text = xp.toString()
        binding.tvStatLessons.text = "$completed/$total"
        binding.tvProgressPercent.text = "$percent%"
        binding.progressCourse.progress = percent
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
