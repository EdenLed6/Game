package com.nihongo.beginner

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.nihongo.beginner.adapter.ExampleAdapter
import com.nihongo.beginner.adapter.GrammarAdapter
import com.nihongo.beginner.audio.PronunciationSpeaker
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.databinding.PageLessonContentBinding

class LessonContentFragment : Fragment() {

    private var _binding: PageLessonContentBinding? = null
    private val binding get() = _binding!!
    private lateinit var speaker: PronunciationSpeaker

    companion object {
        private const val ARG_LESSON_ID = "lesson_id"
        fun newInstance(lessonId: Int) = LessonContentFragment().apply {
            arguments = Bundle().apply { putInt(ARG_LESSON_ID, lessonId) }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = PageLessonContentBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        speaker = PronunciationSpeaker(requireContext())

        val lessonId = arguments?.getInt(ARG_LESSON_ID) ?: return
        val lesson = LessonData.getLessonById(lessonId) ?: return

        // Grammar
        binding.rvGrammar.layoutManager = LinearLayoutManager(requireContext())
        binding.rvGrammar.adapter = GrammarAdapter(lesson.grammarPoints)

        // Examples
        if (lesson.examples.isEmpty()) {
            binding.layoutExamplesHeader.visibility = View.GONE
            binding.rvExamples.visibility = View.GONE
        } else {
            binding.rvExamples.layoutManager = LinearLayoutManager(requireContext())
            binding.rvExamples.adapter = ExampleAdapter(lesson.examples) { speaker.speak(it) }
        }

        // Games
        binding.btnWorkbook.setOnClickListener {
            launch(Intent(requireContext(), WorkbookActivity::class.java).apply {
                putExtra(WorkbookActivity.EXTRA_LESSON_ID, lesson.id)
            })
        }
        binding.btnQuiz.setOnClickListener {
            launch(Intent(requireContext(), QuizActivity::class.java).apply {
                putExtra(LessonDetailActivity.EXTRA_LESSON_ID, lesson.id)
            })
        }
        binding.btnFlashcards.isEnabled = lesson.vocabulary.isNotEmpty()
        binding.btnFlashcards.setOnClickListener {
            launch(Intent(requireContext(), FlashcardActivity::class.java).apply {
                putExtra(LessonDetailActivity.EXTRA_LESSON_ID, lesson.id)
            })
        }
        binding.btnMatching.isEnabled = lesson.vocabulary.size >= 4
        binding.btnMatching.setOnClickListener {
            launch(Intent(requireContext(), MatchingGameActivity::class.java).apply {
                putExtra(LessonDetailActivity.EXTRA_LESSON_ID, lesson.id)
            })
        }
        if (lesson.id == 8) {
            binding.btnNumberGame.visibility = View.VISIBLE
            binding.btnNumberGame.setOnClickListener {
                launch(Intent(requireContext(), NumberGameActivity::class.java).apply {
                    putExtra(LessonDetailActivity.EXTRA_LESSON_ID, lesson.id)
                })
            }
        }
        if (lesson.id in 11..16) {
            binding.btnSentenceBuilder.visibility = View.VISIBLE
            binding.btnSentenceBuilder.setOnClickListener {
                launch(Intent(requireContext(), SentenceBuilderActivity::class.java).apply {
                    putExtra(LessonDetailActivity.EXTRA_LESSON_ID, lesson.id)
                })
            }
        }
    }

    private fun launch(intent: Intent) {
        startActivity(intent)
        @Suppress("DEPRECATION")
        requireActivity().overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        if (::speaker.isInitialized) speaker.shutdown()
        _binding = null
    }
}
