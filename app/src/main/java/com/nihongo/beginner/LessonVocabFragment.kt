package com.nihongo.beginner

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.nihongo.beginner.adapter.VocabAdapter
import com.nihongo.beginner.audio.PronunciationSpeaker
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.databinding.PageLessonVocabBinding

class LessonVocabFragment : Fragment() {

    private var _binding: PageLessonVocabBinding? = null
    private val binding get() = _binding!!
    private lateinit var speaker: PronunciationSpeaker

    companion object {
        private const val ARG_LESSON_ID = "lesson_id"
        fun newInstance(lessonId: Int) = LessonVocabFragment().apply {
            arguments = Bundle().apply { putInt(ARG_LESSON_ID, lessonId) }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = PageLessonVocabBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        speaker = PronunciationSpeaker(requireContext())

        val lessonId = arguments?.getInt(ARG_LESSON_ID) ?: return
        val lesson = LessonData.getLessonById(lessonId) ?: return

        if (lesson.vocabulary.isEmpty()) {
            binding.rvVocab.visibility = View.GONE
            binding.tvNoVocab.visibility = View.VISIBLE
        } else {
            binding.rvVocab.layoutManager = LinearLayoutManager(requireContext())
            binding.rvVocab.adapter = VocabAdapter(lesson.vocabulary) { speaker.speak(it) }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        if (::speaker.isInitialized) speaker.shutdown()
        _binding = null
    }
}
