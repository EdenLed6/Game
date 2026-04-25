package com.nihongo.beginner

import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import com.nihongo.beginner.audio.PronunciationSpeaker
import com.nihongo.beginner.data.*
import com.nihongo.beginner.databinding.ActivityLessonJourneyBinding

class LessonJourneyActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_LESSON_ID = "lesson_id"
    }

    private enum class Step { INTRO, TEACH, PRACTICE, QUIZ, COMPLETE }

    private lateinit var binding: ActivityLessonJourneyBinding
    private lateinit var lesson: Lesson
    private lateinit var speaker: PronunciationSpeaker
    private lateinit var teachCards: List<Any>

    private var currentStep = Step.INTRO
    private var teachIndex = 0
    private var practiceIndex = 0
    private var quizIndex = 0
    private var quizWrongCount = 0

    private val handler = Handler(Looper.getMainLooper())

    // ─────────────────────────────────────────────────────────────
    // Lifecycle
    // ─────────────────────────────────────────────────────────────

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLessonJourneyBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val lessonId = intent.getIntExtra(EXTRA_LESSON_ID, -1)
        lesson = LessonData.getLessonById(lessonId) ?: run { finish(); return }
        speaker = PronunciationSpeaker(this)

        teachCards = buildTeachCards()

        binding.btnBack.setOnClickListener { finish() }
        binding.btnContinue.setOnClickListener { onContinue() }

        showStep(Step.INTRO)
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
        speaker.shutdown()
    }

    override fun finish() {
        super.finish()
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
    }

    // ─────────────────────────────────────────────────────────────
    // Step orchestration
    // ─────────────────────────────────────────────────────────────

    private fun buildTeachCards(): List<Any> {
        val cards = mutableListOf<Any>()
        cards.addAll(lesson.grammarPoints)
        cards.addAll(lesson.vocabulary)
        cards.addAll(lesson.examples)
        return cards
    }

    private fun showStep(step: Step) {
        currentStep = step
        // Ensure the bottom button is visible for all steps except QUIZ
        // (QUIZ manages its own visibility since it handles flow inline)
        if (step != Step.QUIZ) {
            binding.btnContinue.visibility = View.VISIBLE
        }
        val progress = when (step) {
            Step.INTRO -> 0
            Step.TEACH -> 20
            Step.PRACTICE -> 55
            Step.QUIZ -> 75
            Step.COMPLETE -> 100
        }
        binding.progressJourney.progress = progress
        binding.tvStepTitle.text = when (step) {
            Step.INTRO -> lesson.title
            Step.TEACH -> "למד"
            Step.PRACTICE -> "תרגל"
            Step.QUIZ -> "חידון"
            Step.COMPLETE -> "הושלם! 🎉"
        }
        when (step) {
            Step.INTRO -> showIntro()
            Step.TEACH -> showTeachPage()
            Step.PRACTICE -> { practiceIndex = 0; showPracticeCard() }
            Step.QUIZ -> { quizIndex = 0; showQuizQuestion() }
            Step.COMPLETE -> showComplete()
        }
    }

    private fun onContinue() {
        when (currentStep) {
            Step.INTRO -> showStep(Step.TEACH)
            Step.TEACH -> showStep(Step.PRACTICE)
            Step.PRACTICE -> {
                val maxCards = minOf(lesson.vocabulary.size, 4)
                if (practiceIndex < maxCards - 1) {
                    practiceIndex++
                    showPracticeCard()
                } else {
                    showStep(Step.QUIZ)
                }
            }
            Step.COMPLETE -> finish()
            else -> { /* Quiz handles its own clicks */ }
        }
    }

    // ─────────────────────────────────────────────────────────────
    // Helper
    // ─────────────────────────────────────────────────────────────

    private fun setContent(view: View) {
        binding.contentContainer.removeAllViews()
        binding.contentContainer.addView(view)
    }

    private fun dp(value: Int): Int =
        (value * resources.displayMetrics.density + 0.5f).toInt()

    private fun colorInt(colorRes: Int): Int =
        ContextCompat.getColor(this, colorRes)

    // ─────────────────────────────────────────────────────────────
    // INTRO
    // ─────────────────────────────────────────────────────────────

    private fun showIntro() {
        binding.btnContinue.text = "התחל ✨"
        binding.btnContinue.isEnabled = true

        val scrollView = ScrollView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }

        val container = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            setPadding(dp(20), 0, dp(20), dp(20))
        }

        // Top spacer
        container.addView(View(this).apply {
            layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(48))
        })

        // Emoji
        container.addView(TextView(this).apply {
            text = lesson.emoji
            textSize = 80f
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        })

        // Title
        container.addView(TextView(this).apply {
            text = lesson.title
            textSize = 28f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.colorPrimary))
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp(16) }
        })

        // Subtitle
        container.addView(TextView(this).apply {
            text = lesson.subtitle
            textSize = 16f
            setTextColor(colorInt(R.color.onSurfaceMuted))
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp(8) }
        })

        // Spacer
        container.addView(View(this).apply {
            layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(24))
        })

        // Preview card
        val card = MaterialCardView(this).apply {
            radius = dp(20).toFloat()
            strokeWidth = dp(1)
            strokeColor = colorInt(R.color.cardStroke)
            cardElevation = 0f
            setCardBackgroundColor(colorInt(R.color.surface))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }

        val cardInner = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(20), dp(20), dp(20))
        }

        cardInner.addView(TextView(this).apply {
            text = "בשיעור זה תלמד:"
            textSize = 14f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.onSurface))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(12) }
        })

        val vocabPreview = lesson.vocabulary.take(3)
        vocabPreview.forEach { vocab ->
            cardInner.addView(TextView(this).apply {
                text = "• ${vocab.japanese} = ${vocab.hebrew}"
                textSize = 14f
                setTextColor(colorInt(R.color.onSurface))
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).also { it.bottomMargin = dp(6) }
            })
        }

        card.addView(cardInner)
        container.addView(card)
        scrollView.addView(container)
        setContent(scrollView)
    }

    // ─────────────────────────────────────────────────────────────
    // TEACH — single scrollable page with all content
    // ─────────────────────────────────────────────────────────────

    private val emojiColors = listOf(
        0xFFFFE4E1.toInt(), 0xFFE3F2FD.toInt(), 0xFFFFF9C4.toInt(),
        0xFFE8F5E9.toInt(), 0xFFF3E5F5.toInt(), 0xFFFFECB3.toInt()
    )

    private fun showTeachPage() {
        binding.btnContinue.text = "לתרגול →"
        binding.btnContinue.isEnabled = true

        val scrollView = ScrollView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }

        val page = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(12), dp(16), dp(24))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }

        // ── Vocabulary section ──────────────────────────────────
        if (lesson.vocabulary.isNotEmpty()) {
            page.addView(sectionLabel("מילים חדשות 📝"))
            lesson.vocabulary.forEachIndexed { i, vocab ->
                page.addView(buildVocabRow(vocab, emojiColors[i % emojiColors.size]))
            }
        }

        // ── Grammar section ─────────────────────────────────────
        if (lesson.grammarPoints.isNotEmpty()) {
            page.addView(sectionLabel("דקדוק 📖"))
            lesson.grammarPoints.forEach { grammar ->
                page.addView(buildGrammarBlock(grammar))
            }
        }

        // ── Examples section ────────────────────────────────────
        if (lesson.examples.isNotEmpty()) {
            page.addView(sectionLabel("דוגמאות 💬"))
            lesson.examples.forEach { example ->
                page.addView(buildExampleRow(example))
            }
        }

        scrollView.addView(page)
        setContent(scrollView)
    }

    private fun sectionLabel(text: String): TextView = TextView(this).apply {
        this.text = text
        textSize = 13f
        setTypeface(null, Typeface.BOLD)
        setTextColor(colorInt(R.color.onSurfaceMuted))
        layoutParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        ).also { it.topMargin = dp(12); it.bottomMargin = dp(8) }
    }

    private fun buildVocabRow(vocab: VocabItem, bgColor: Int): MaterialCardView {
        val card = MaterialCardView(this).apply {
            radius = dp(16).toFloat()
            strokeWidth = dp(1)
            strokeColor = colorInt(R.color.cardStroke)
            cardElevation = dp(1).toFloat()
            setCardBackgroundColor(colorInt(R.color.surface))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(10) }
        }

        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(12), dp(12), dp(8), dp(12))
        }

        // Emoji box
        val emojiBox = FrameLayout(this).apply {
            layoutParams = LinearLayout.LayoutParams(dp(64), dp(64)).also {
                it.marginEnd = dp(14)
            }
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                cornerRadius = dp(14).toFloat()
                setColor(bgColor)
            }
        }
        emojiBox.addView(TextView(this).apply {
            text = if (vocab.emoji.isNotBlank()) vocab.emoji else "🇯🇵"
            textSize = 30f
            gravity = Gravity.CENTER
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        })
        row.addView(emojiBox)

        // Text block
        val textBlock = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
        }
        textBlock.addView(TextView(this).apply {
            text = vocab.japanese
            textSize = 22f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.onSurface))
        })
        textBlock.addView(TextView(this).apply {
            text = vocab.romaji
            textSize = 12f
            setTextColor(colorInt(R.color.onSurfaceMuted))
        })
        textBlock.addView(TextView(this).apply {
            text = vocab.hebrew
            textSize = 14f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.colorPrimary))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp(2) }
        })
        row.addView(textBlock)

        // Speak button
        row.addView(MaterialButton(this, null, com.google.android.material.R.attr.materialButtonOutlinedStyle).apply {
            text = "🔊"
            textSize = 16f
            layoutParams = LinearLayout.LayoutParams(dp(44), dp(44)).also {
                it.marginStart = dp(8)
            }
            setPadding(0, 0, 0, 0)
            strokeColor = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
            strokeWidth = dp(1)
            setTextColor(colorInt(R.color.colorPrimary))
            backgroundTintList = ColorStateList.valueOf(Color.TRANSPARENT)
            setOnClickListener { speaker.speak(vocab.japanese) }
        })

        card.addView(row)
        return card
    }

    private fun buildGrammarBlock(grammar: GrammarPoint): MaterialCardView {
        val card = MaterialCardView(this).apply {
            radius = dp(16).toFloat()
            strokeWidth = dp(1)
            strokeColor = colorInt(R.color.cardStroke)
            cardElevation = dp(1).toFloat()
            setCardBackgroundColor(colorInt(R.color.surface))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(10) }
        }
        val inner = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(14), dp(16), dp(14))
        }
        inner.addView(TextView(this).apply {
            text = grammar.title
            textSize = 15f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.colorPrimary))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(8) }
        })
        inner.addView(TextView(this).apply {
            text = grammar.content
            textSize = 14f
            setTextColor(colorInt(R.color.onSurface))
            isSingleLine = false
        })
        if (!grammar.pattern.isNullOrBlank()) {
            inner.addView(TextView(this).apply {
                text = grammar.pattern
                textSize = 13f
                setTextColor(colorInt(R.color.onSurfaceMuted))
                setPadding(dp(12), dp(10), dp(12), dp(10))
                background = GradientDrawable().apply {
                    shape = GradientDrawable.RECTANGLE
                    cornerRadius = dp(8).toFloat()
                    setColor(colorInt(R.color.surfaceSoft))
                }
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).also { it.topMargin = dp(10) }
            })
        }
        card.addView(inner)
        return card
    }

    private fun buildExampleRow(example: Example): LinearLayout {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(4), dp(4), dp(4), dp(4))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(10) }
        }
        row.addView(TextView(this).apply {
            text = "▸  ${example.romaji}"
            textSize = 15f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.onSurface))
        })
        if (example.japanese.isNotBlank()) {
            row.addView(TextView(this).apply {
                text = "    ${example.japanese}"
                textSize = 13f
                setTextColor(colorInt(R.color.onSurfaceMuted))
            })
        }
        row.addView(TextView(this).apply {
            text = "    ${example.hebrew}"
            textSize = 14f
            setTextColor(colorInt(R.color.colorPrimary))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp(2) }
        })
        return row
    }

    // ─────────────────────────────────────────────────────────────
    // PRACTICE (flashcards)
    // ─────────────────────────────────────────────────────────────

    private fun showPracticeCard() {
        val maxCards = minOf(lesson.vocabulary.size, 4)
        val isLast = practiceIndex >= maxCards - 1

        // Initially hide the continue button until card is flipped
        binding.btnContinue.isEnabled = false
        binding.btnContinue.text = if (isLast) "לחידון →" else "הבא"

        val vocab = lesson.vocabulary[practiceIndex]

        val root = FrameLayout(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }

        val outerPad = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(dp(20), dp(20), dp(20), dp(20))
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }

        // Counter label
        outerPad.addView(TextView(this).apply {
            text = "${practiceIndex + 1} / $maxCards"
            textSize = 13f
            setTextColor(colorInt(R.color.onSurfaceMuted))
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(12) }
        })

        // Tap hint label
        val hintLabel = TextView(this).apply {
            text = "הקש לגלות את התרגום"
            textSize = 13f
            setTextColor(colorInt(R.color.onSurfaceMuted))
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp(12) }
        }

        // Flashcard
        val card = MaterialCardView(this).apply {
            radius = dp(20).toFloat()
            strokeWidth = dp(1)
            strokeColor = colorInt(R.color.cardStroke)
            cardElevation = dp(4).toFloat()
            setCardBackgroundColor(colorInt(R.color.surface))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dp(240)
            )
            isClickable = true
            isFocusable = true
        }

        val cardInner = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(dp(24), dp(24), dp(24), dp(24))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
        }

        // Front: Japanese
        val tvJapanese = TextView(this).apply {
            text = vocab.japanese
            textSize = 48f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.onSurface))
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }

        // Back: Hebrew + romaji (hidden initially)
        val tvHebrew = TextView(this).apply {
            text = vocab.hebrew
            textSize = 24f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.colorPrimary))
            gravity = Gravity.CENTER
            visibility = View.GONE
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp(8) }
        }

        val tvRomaji = TextView(this).apply {
            text = vocab.romaji
            textSize = 14f
            setTextColor(colorInt(R.color.onSurfaceMuted))
            gravity = Gravity.CENTER
            visibility = View.GONE
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp(4) }
        }

        val btnSpeak = MaterialButton(this, null, com.google.android.material.R.attr.materialButtonOutlinedStyle).apply {
            text = "🔊"
            textSize = 18f
            layoutParams = LinearLayout.LayoutParams(dp(52), dp(52)).also {
                it.topMargin = dp(10)
                it.gravity = Gravity.CENTER_HORIZONTAL
            }
            setPadding(0, 0, 0, 0)
            strokeColor = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
            strokeWidth = dp(1)
            setTextColor(colorInt(R.color.colorPrimary))
            backgroundTintList = ColorStateList.valueOf(Color.TRANSPARENT)
            setOnClickListener { speaker.speak(vocab.japanese) }
        }

        cardInner.addView(tvJapanese)
        cardInner.addView(btnSpeak)
        cardInner.addView(tvHebrew)
        cardInner.addView(tvRomaji)
        card.addView(cardInner)

        card.setOnClickListener {
            tvHebrew.visibility = View.VISIBLE
            tvRomaji.visibility = View.VISIBLE
            hintLabel.visibility = View.GONE
            card.setCardBackgroundColor(colorInt(R.color.surfaceSoft))
            binding.btnContinue.isEnabled = true
        }

        outerPad.addView(card)
        outerPad.addView(hintLabel)
        root.addView(outerPad)
        setContent(root)
        binding.root.post { speaker.speak(vocab.japanese) }
    }

    // ─────────────────────────────────────────────────────────────
    // QUIZ
    // ─────────────────────────────────────────────────────────────

    private fun showQuizQuestion() {
        if (quizIndex >= lesson.exercises.size) {
            onQuizComplete()
            return
        }

        // Hide the bottom continue button — quiz manages its own flow
        binding.btnContinue.visibility = View.GONE

        val question = lesson.exercises[quizIndex]

        val scrollView = ScrollView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }

        val container = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(20), dp(20), dp(20))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }

        // Progress indicator (e.g. "שאלה 1 / 8")
        container.addView(TextView(this).apply {
            text = "שאלה ${quizIndex + 1} / ${lesson.exercises.size}"
            textSize = 13f
            setTextColor(colorInt(R.color.onSurfaceMuted))
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(16) }
        })

        // Question card
        val questionCard = MaterialCardView(this).apply {
            radius = dp(20).toFloat()
            strokeWidth = dp(1)
            strokeColor = colorInt(R.color.cardStroke)
            cardElevation = 0f
            setCardBackgroundColor(colorInt(R.color.surfaceSoft))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(20) }
        }

        questionCard.addView(TextView(this).apply {
            text = question.question
            textSize = 20f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.onSurface))
            gravity = Gravity.CENTER
            setPadding(dp(20), dp(24), dp(20), dp(24))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        })

        container.addView(questionCard)

        // Feedback label (initially invisible)
        val feedbackLabel = TextView(this).apply {
            textSize = 15f
            setTypeface(null, Typeface.BOLD)
            gravity = Gravity.CENTER
            visibility = View.INVISIBLE
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also {
                it.bottomMargin = dp(12)
            }
        }
        container.addView(feedbackLabel)

        // Option buttons
        val optionButtons = mutableListOf<MaterialButton>()

        question.options.forEachIndexed { index, optionText ->
            val btn = MaterialButton(this, null, com.google.android.material.R.attr.materialButtonOutlinedStyle).apply {
                text = optionText
                textSize = 15f
                isAllCaps = false
                setTextColor(colorInt(R.color.onSurface))
                backgroundTintList = ColorStateList.valueOf(colorInt(R.color.white))
                strokeColor = ColorStateList.valueOf(colorInt(R.color.optionStroke))
                strokeWidth = dp(2)
                cornerRadius = dp(16)
                setPadding(dp(20), 0, dp(20), 0)
                minHeight = dp(58)
                gravity = Gravity.START or Gravity.CENTER_VERTICAL
                stateListAnimator = null
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).also { it.bottomMargin = dp(10) }
            }

            btn.setOnClickListener {
                // Disable all buttons while processing
                optionButtons.forEach { it.isEnabled = false }

                if (index == question.correctIndex) {
                    // Correct answer
                    btn.backgroundTintList = ColorStateList.valueOf(colorInt(R.color.correct_green))
                    btn.setTextColor(colorInt(R.color.white))
                    btn.strokeColor = ColorStateList.valueOf(colorInt(R.color.correct_green))
                    feedbackLabel.text = "✓ נכון!"
                    feedbackLabel.setTextColor(colorInt(R.color.correct_green))
                    feedbackLabel.visibility = View.VISIBLE
                    quizWrongCount = 0

                    handler.postDelayed({
                        quizIndex++
                        binding.btnContinue.visibility = View.VISIBLE
                        showQuizQuestion()
                    }, 800)
                } else {
                    // Wrong answer
                    btn.backgroundTintList = ColorStateList.valueOf(colorInt(R.color.wrong_red))
                    btn.setTextColor(colorInt(R.color.white))
                    btn.strokeColor = ColorStateList.valueOf(colorInt(R.color.wrong_red))
                    feedbackLabel.text = "✗ נסה שוב"
                    feedbackLabel.setTextColor(colorInt(R.color.wrong_red))
                    feedbackLabel.visibility = View.VISIBLE
                    quizWrongCount++

                    handler.postDelayed({
                        // Re-enable all buttons except the wrong one; reset wrong button colour
                        btn.backgroundTintList = ColorStateList.valueOf(colorInt(R.color.white))
                        btn.setTextColor(colorInt(R.color.onSurface))
                        btn.strokeColor = ColorStateList.valueOf(colorInt(R.color.optionStroke))
                        feedbackLabel.visibility = View.INVISIBLE
                        optionButtons.forEach { it.isEnabled = true }
                    }, 1000)
                }
            }

            optionButtons.add(btn)
            container.addView(btn)
        }

        scrollView.addView(container)
        setContent(scrollView)
    }

    private fun onQuizComplete() {
        ProgressManager.markLessonCompleted(this, lesson.id)
        ProgressManager.addXP(this, 100)
        ProgressManager.recordActivity(this)
        showStep(Step.COMPLETE)
    }

    // ─────────────────────────────────────────────────────────────
    // COMPLETE
    // ─────────────────────────────────────────────────────────────

    private fun showComplete() {
        binding.btnContinue.visibility = View.VISIBLE
        binding.btnContinue.text = "המשך ללמוד"
        binding.btnContinue.isEnabled = true

        val scrollView = ScrollView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }

        val container = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL
            setPadding(dp(20), dp(48), dp(20), dp(20))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }

        // Celebration emoji
        container.addView(TextView(this).apply {
            text = "🎉"
            textSize = 80f
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(16) }
        })

        // כל הכבוד!
        container.addView(TextView(this).apply {
            text = "כל הכבוד!"
            textSize = 28f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.colorPrimary))
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(8) }
        })

        // Lesson complete message
        container.addView(TextView(this).apply {
            text = "השלמת את השיעור ${lesson.title}!"
            textSize = 16f
            setTextColor(colorInt(R.color.onSurface))
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(32) }
        })

        // XP Badge card
        val xpCard = MaterialCardView(this).apply {
            radius = dp(20).toFloat()
            strokeWidth = dp(1)
            strokeColor = colorInt(R.color.goldStroke)
            cardElevation = dp(2).toFloat()
            setCardBackgroundColor(colorInt(R.color.colorSecondary))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also {
                it.gravity = Gravity.CENTER_HORIZONTAL
                it.bottomMargin = dp(32)
            }
        }

        xpCard.addView(TextView(this).apply {
            text = "+100 XP ⭐"
            textSize = 24f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.onSurface))
            gravity = Gravity.CENTER
            setPadding(dp(32), dp(16), dp(32), dp(16))
        })

        container.addView(xpCard)

        scrollView.addView(container)
        setContent(scrollView)
    }
}
