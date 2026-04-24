package com.nihongo.beginner

import android.content.Intent
import android.os.Bundle
import android.text.InputFilter
import android.view.Gravity
import android.view.MenuItem
import android.view.View
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.widget.doAfterTextChanged
import com.google.android.material.appbar.MaterialToolbar
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.nihongo.beginner.audio.PronunciationSpeaker
import com.nihongo.beginner.data.DigitalCourseWorkbook
import com.nihongo.beginner.data.LessonData
import com.nihongo.beginner.data.WorkbookExercise
import com.nihongo.beginner.data.WorkbookExerciseType
import com.nihongo.beginner.data.WorkbookProgressManager
import java.text.Normalizer

class WorkbookActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_LESSON_ID = "lesson_id"
    }

    private lateinit var speaker: PronunciationSpeaker
    private lateinit var toolbar: MaterialToolbar
    private lateinit var progressBar: ProgressBar
    private lateinit var progressText: TextView
    private lateinit var content: LinearLayout
    private lateinit var previousButton: MaterialButton
    private lateinit var nextButton: MaterialButton
    private var lessonId = 1
    private var currentIndex = 0
    private var exercises: List<WorkbookExercise> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        speaker = PronunciationSpeaker(this)
        lessonId = intent.getIntExtra(EXTRA_LESSON_ID, 1)
        exercises = DigitalCourseWorkbook.getExercisesForLesson(lessonId)

        if (exercises.isEmpty()) {
            finish()
            return
        }

        buildShell()
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Workbook"
        renderExercise()
    }

    private fun buildShell() {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(color(R.color.surface))
        }

        toolbar = MaterialToolbar(this).apply {
            setBackgroundColor(color(R.color.white))
            setTitleTextColor(color(R.color.colorPrimary))
            navigationIcon?.setTint(color(R.color.colorPrimary))
        }
        root.addView(toolbar, LinearLayout.LayoutParams(match, dp(56)))

        progressText = TextView(this).apply {
            setTextColor(color(R.color.onSurface))
            textSize = 14f
            gravity = Gravity.CENTER
            setPadding(dp(16), dp(10), dp(16), dp(4))
        }
        root.addView(progressText, LinearLayout.LayoutParams(match, wrap))

        progressBar = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            max = 100
            progressTintList = android.content.res.ColorStateList.valueOf(color(R.color.colorPrimary))
        }
        root.addView(progressBar, LinearLayout.LayoutParams(match, dp(8)).apply {
            marginStart = dp(18)
            marginEnd = dp(18)
        })

        val scrollView = ScrollView(this).apply { isFillViewport = false }
        content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(16), dp(18), dp(18))
        }
        scrollView.addView(content, LinearLayout.LayoutParams(match, wrap))
        root.addView(scrollView, LinearLayout.LayoutParams(match, 0, 1f))

        val nav = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(dp(12), dp(8), dp(12), dp(12))
            gravity = Gravity.CENTER
        }
        previousButton = MaterialButton(this).apply {
            text = "Back"
            setOnClickListener {
                currentIndex = (currentIndex - 1).coerceAtLeast(0)
                renderExercise()
            }
        }
        nextButton = MaterialButton(this).apply {
            text = "Next"
            setOnClickListener {
                currentIndex = (currentIndex + 1).coerceAtMost(exercises.lastIndex)
                renderExercise()
            }
        }
        nav.addView(previousButton, LinearLayout.LayoutParams(0, wrap, 1f).apply { marginEnd = dp(6) })
        nav.addView(nextButton, LinearLayout.LayoutParams(0, wrap, 1f).apply { marginStart = dp(6) })
        root.addView(nav, LinearLayout.LayoutParams(match, wrap))
        setContentView(root)
    }

    private fun renderExercise() {
        val exercise = exercises[currentIndex]
        supportActionBar?.title = "Page ${exercise.pageNumber}"
        content.removeAllViews()

        val completed = WorkbookProgressManager.getLessonCompletedCount(this, lessonId)
        val total = WorkbookProgressManager.getLessonExerciseCount(lessonId).coerceAtLeast(1)
        progressBar.progress = completed * 100 / total
        progressText.text = "Workbook progress: $completed of $total completed"

        content.addView(headerCard(exercise))
        content.addView(referenceCard(exercise))
        content.addView(answerCard(exercise))
        content.addView(helpCard(exercise))

        previousButton.isEnabled = currentIndex > 0
        nextButton.isEnabled = currentIndex < exercises.lastIndex
    }

    private fun headerCard(exercise: WorkbookExercise): View = card {
        addLabel("Digital course workbook", 13f, R.color.onSurfaceMuted)
        addLabel(exercise.title, 24f, R.color.onSurface, bold = true)
        addLabel(typeLabel(exercise.type), 14f, R.color.colorSecondary, bold = true)
        addLabel(exercise.prompt, 16f, R.color.onSurface)

        if (exercise.japaneseToSpeak.isNotBlank()) {
            addButton("Hear Japanese") { speaker.speak(exercise.japaneseToSpeak) }
        }
    }

    private fun referenceCard(exercise: WorkbookExercise): View = card {
        addLabel("Original booklet reference", 18f, R.color.onSurface, bold = true)
        addLabel(exercise.referenceText, 15f, R.color.onSurface)
    }

    private fun answerCard(exercise: WorkbookExercise): View = card {
        addLabel("Your answer", 18f, R.color.onSurface, bold = true)

        if (exercise.options.isNotEmpty()) {
            addLabel("Answer bank: ${exercise.options.joinToString("  |  ")}", 14f, R.color.onSurfaceMuted)
        }

        val answerInput = EditText(this@WorkbookActivity).apply {
            minLines = if (exercise.type == WorkbookExerciseType.FREE_WRITING || exercise.type == WorkbookExerciseType.PAGE_NOTES) 5 else 3
            gravity = Gravity.TOP or Gravity.START
            hint = "Type here. Your answer is saved only on this phone."
            setText(WorkbookProgressManager.getAnswer(this@WorkbookActivity, exercise.id))
            filters = arrayOf(InputFilter.LengthFilter(exercise.maxAnswerLength))
            setTextColor(color(R.color.onSurface))
            setHintTextColor(color(R.color.onSurfaceMuted))
            doAfterTextChanged {
                WorkbookProgressManager.saveAnswer(this@WorkbookActivity, exercise.id, it?.toString().orEmpty())
            }
        }
        addView(answerInput, LinearLayout.LayoutParams(match, wrap).apply {
            topMargin = dp(8)
            bottomMargin = dp(12)
        })

        val actions = LinearLayout(this@WorkbookActivity).apply { orientation = LinearLayout.HORIZONTAL }
        actions.addView(materialButton("Check") {
            checkAnswer(exercise, answerInput.text.toString())
        }, LinearLayout.LayoutParams(0, wrap, 1f).apply { marginEnd = dp(6) })
        actions.addView(materialButton("Save done") {
            WorkbookProgressManager.markComplete(this@WorkbookActivity, exercise.id)
            renderExercise()
        }, LinearLayout.LayoutParams(0, wrap, 1f).apply { marginStart = dp(6) })
        addView(actions)
    }

    private fun helpCard(exercise: WorkbookExercise): View = card {
        addLabel("Need help?", 18f, R.color.onSurface, bold = true)
        addLabel("Use hints or open the lesson info. Your current answer stays saved.", 14f, R.color.onSurfaceMuted)

        val hintCount = WorkbookProgressManager.getRevealedHintCount(this@WorkbookActivity, exercise.id)
        if (hintCount > 0) {
            exercise.hints.take(hintCount).forEachIndexed { index, hint ->
                addLabel("Hint ${index + 1}: ${hint.text}", 15f, R.color.onSurface)
            }
        }

        addButton("Show hint") {
            WorkbookProgressManager.revealNextHint(this@WorkbookActivity, exercise.id, exercise.hints.size)
            renderExercise()
        }
        addButton("Open lesson info") { showLessonReference() }
    }

    private fun checkAnswer(exercise: WorkbookExercise, answer: String) {
        WorkbookProgressManager.recordAttempt(this, exercise.id)
        if (answer.isBlank()) {
            showMessage("Write something first", "Your draft is private and saved on this phone.")
            return
        }

        if (exercise.expectedAnswers.isEmpty()) {
            WorkbookProgressManager.markComplete(this, exercise.id)
            showMessage("Saved", "This is an open workbook task, so it is saved without strict grading.")
            renderExercise()
            return
        }

        val normalizedAnswer = normalizeAnswer(answer)
        val matched = exercise.expectedAnswers.any { normalizedAnswer.contains(normalizeAnswer(it)) }
        if (matched) {
            WorkbookProgressManager.markComplete(this, exercise.id)
            showMessage("Nice work", "Your answer includes one of the expected patterns.")
            renderExercise()
        } else {
            showMessage("Not yet", "Use a hint or reopen the lesson info, then try again.")
        }
    }

    private fun showLessonReference() {
        val lesson = LessonData.getLessonById(lessonId)
        if (lesson == null) {
            showMessage("Lesson info", "No lesson reference was found.")
            return
        }

        val grammar = lesson.grammarPoints.joinToString("\n\n") {
            "${it.title}\n${it.pattern.orEmpty()}\n${it.content}"
        }
        val vocab = lesson.vocabulary.joinToString("\n") {
            "${it.japanese}  ${it.romaji}  -  ${it.hebrew}"
        }
        val examples = lesson.examples.joinToString("\n") {
            "${it.japanese}  ${it.romaji}  -  ${it.hebrew}"
        }

        MaterialAlertDialogBuilder(this)
            .setTitle(lesson.title)
            .setMessage(listOf(grammar, vocab, examples).filter { it.isNotBlank() }.joinToString("\n\n"))
            .setPositiveButton("Back to exercise", null)
            .show()
    }

    private fun showMessage(title: String, message: String) {
        MaterialAlertDialogBuilder(this)
            .setTitle(title)
            .setMessage(message)
            .setPositiveButton("OK", null)
            .show()
    }

    private fun card(block: LinearLayout.() -> Unit): MaterialCardView {
        val inner = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(16), dp(16), dp(16))
            block()
        }
        return MaterialCardView(this).apply {
            radius = dp(5).toFloat()
            cardElevation = dp(1).toFloat()
            setCardBackgroundColor(color(R.color.surfaceAlt))
            strokeWidth = dp(1)
            strokeColor = color(R.color.black)
            addView(inner)
            layoutParams = LinearLayout.LayoutParams(match, wrap).apply {
                bottomMargin = dp(14)
            }
        }
    }

    private fun LinearLayout.addLabel(textValue: String, size: Float, colorId: Int, bold: Boolean = false) {
        addView(TextView(this@WorkbookActivity).apply {
            text = textValue
            textSize = size
            setTextColor(color(colorId))
            includeFontPadding = true
            if (bold) typeface = android.graphics.Typeface.DEFAULT_BOLD
            setPadding(0, dp(4), 0, dp(4))
        })
    }

    private fun LinearLayout.addButton(label: String, onClick: () -> Unit) {
        addView(materialButton(label, onClick), LinearLayout.LayoutParams(match, wrap).apply {
            topMargin = dp(10)
        })
    }

    private fun materialButton(label: String, onClick: () -> Unit): MaterialButton {
        return MaterialButton(this).apply {
            text = label
            setOnClickListener { onClick() }
        }
    }

    private fun typeLabel(type: WorkbookExerciseType): String = when (type) {
        WorkbookExerciseType.TYPED_ANSWER -> "Typed answer"
        WorkbookExerciseType.FILL_BLANK -> "Fill in the blanks"
        WorkbookExerciseType.IMAGE_MATCH -> "Match text to picture"
        WorkbookExerciseType.TEXT_MATCH -> "Matching"
        WorkbookExerciseType.SENTENCE_ORDER -> "Sentence building"
        WorkbookExerciseType.DIALOGUE_COMPLETE -> "Dialogue completion"
        WorkbookExerciseType.FREE_WRITING -> "Writing practice"
        WorkbookExerciseType.LISTENING -> "Listening"
        WorkbookExerciseType.PAGE_NOTES -> "PDF page practice"
    }

    private fun normalizeAnswer(value: String): String {
        return Normalizer.normalize(value.lowercase().trim(), Normalizer.Form.NFKC)
            .replace(Regex("\\s+"), " ")
    }

    private fun color(resId: Int): Int = ContextCompat.getColor(this, resId)
    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            onBackPressedDispatcher.onBackPressed()
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    override fun onDestroy() {
        speaker.shutdown()
        super.onDestroy()
    }
}

private const val match = LinearLayout.LayoutParams.MATCH_PARENT
private const val wrap = LinearLayout.LayoutParams.WRAP_CONTENT
