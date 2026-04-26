package com.nihongo.beginner

import android.annotation.SuppressLint
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.webkit.WebView
import android.webkit.WebViewClient
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

    private enum class Step { INTRO, TEACH, VOCAB, PRACTICE, QUIZ, COMPLETE }

    private lateinit var binding: ActivityLessonJourneyBinding
    private lateinit var lesson: Lesson
    private lateinit var speaker: PronunciationSpeaker
    private lateinit var teachCards: List<Any>

    private var currentStep = Step.INTRO
    private var teachIndex = 0
    private var practiceIndex = 0
    private var quizIndex = 0
    private var quizWrongCount = 0

    private var lessonWebView: WebView? = null

    // Progressive reveal for teach page
    private val teachAllItems = mutableListOf<Any>()
    private var teachRevealIndex = 0
    private lateinit var teachScrollView: ScrollView
    private lateinit var teachPageLayout: LinearLayout

    // Progressive reveal for vocab page
    private val vocabAllItems = mutableListOf<VocabItem>()
    private var vocabRevealIndex = 0
    private lateinit var vocabScrollView: ScrollView
    private lateinit var vocabPageLayout: LinearLayout

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

        binding.btnBack.setOnClickListener { onBack() }
        binding.btnContinue.setOnClickListener { onContinue() }

        showStep(Step.INTRO)
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
        speaker.shutdown()
        lessonWebView?.destroy()
        lessonWebView = null
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
        cards.addAll(lesson.examples)
        return cards
    }

    private fun showStep(step: Step) {
        currentStep = step
        if (step != Step.QUIZ) {
            binding.btnContinue.visibility = View.VISIBLE
        }
        val progress = when (step) {
            Step.INTRO -> 0
            Step.TEACH -> 15
            Step.VOCAB -> 40
            Step.PRACTICE -> 60
            Step.QUIZ -> 80
            Step.COMPLETE -> 100
        }
        binding.progressJourney.progress = progress
        binding.tvStepTitle.text = when (step) {
            Step.INTRO -> lesson.title
            Step.TEACH -> "למד"
            Step.VOCAB -> "מילים חדשות"
            Step.PRACTICE -> "תרגל"
            Step.QUIZ -> "חידון"
            Step.COMPLETE -> "הושלם! 🎉"
        }
        when (step) {
            Step.INTRO -> showIntro()
            Step.TEACH -> showTeachPage()
            Step.VOCAB -> showVocabPage()
            Step.PRACTICE -> { practiceIndex = 0; showPracticeCard() }
            Step.QUIZ -> { quizIndex = 0; showQuizQuestion() }
            Step.COMPLETE -> showComplete()
        }
    }

    private fun onContinue() {
        when (currentStep) {
            Step.INTRO -> showStep(Step.TEACH)
            Step.TEACH -> {
                if (teachRevealIndex < teachAllItems.size) {
                    appendTeachItem()
                } else if (lesson.vocabulary.isNotEmpty()) {
                    showStep(Step.VOCAB)
                } else {
                    showStep(Step.PRACTICE)
                }
            }
            Step.VOCAB -> {
                if (vocabRevealIndex < vocabAllItems.size) {
                    appendVocabItem()
                } else {
                    showStep(Step.PRACTICE)
                }
            }
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

    private fun onBack() {
        when (currentStep) {
            Step.INTRO -> finish()
            Step.TEACH -> {
                if (teachRevealIndex <= 1) {
                    showStep(Step.INTRO)
                } else {
                    teachRevealIndex--
                    rebuildTeachPage()
                }
            }
            Step.VOCAB -> {
                if (vocabRevealIndex <= 1) {
                    // Go back to TEACH with all items revealed
                    showStep(Step.TEACH)
                    while (teachRevealIndex < teachAllItems.size) appendTeachItem()
                } else {
                    vocabRevealIndex--
                    rebuildVocabPage()
                }
            }
            Step.PRACTICE -> {
                if (lesson.vocabulary.isNotEmpty()) {
                    showStep(Step.VOCAB)
                    while (vocabRevealIndex < vocabAllItems.size) appendVocabItem()
                } else {
                    showStep(Step.TEACH)
                    while (teachRevealIndex < teachAllItems.size) appendTeachItem()
                }
            }
            Step.QUIZ -> { quizIndex = 0; showStep(Step.PRACTICE) }
            Step.COMPLETE -> finish()
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

        // Video card — shown only if the lesson has a Vimeo URL
        if (lesson.videoUrl.isNotEmpty()) {
            container.addView(View(this).apply {
                layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(20))
            })
            container.addView(buildVideoCard(lesson.videoUrl))
        }

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

    @SuppressLint("SetJavaScriptEnabled")
    private fun buildVideoCard(videoUrl: String): MaterialCardView {
        val card = MaterialCardView(this).apply {
            radius = dp(16).toFloat()
            strokeWidth = 0
            cardElevation = 4f
            setCardBackgroundColor(0xFF111111.toInt())
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }

        val webView = WebView(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, dp(210)
            )
            with(settings) {
                javaScriptEnabled = true
                domStorageEnabled = true
                mediaPlaybackRequiresUserGesture = false
                loadWithOverviewMode = true
                useWideViewPort = true
            }
            webViewClient = WebViewClient()
            webChromeClient = android.webkit.WebChromeClient()
            loadUrl("$videoUrl?autoplay=0&title=0&byline=0&portrait=0")
        }
        lessonWebView = webView
        card.addView(webView)
        return card
    }

    // ─────────────────────────────────────────────────────────────
    // TEACH — progressive reveal: each Next press adds the next item
    // ─────────────────────────────────────────────────────────────

    private val emojiColors = listOf(
        0xFFFFE4E1.toInt(), 0xFFE3F2FD.toInt(), 0xFFFFF9C4.toInt(),
        0xFFE8F5E9.toInt(), 0xFFF3E5F5.toInt(), 0xFFFFECB3.toInt()
    )

    private fun showVocabPage() {
        vocabAllItems.clear()
        vocabAllItems.addAll(lesson.vocabulary)
        vocabRevealIndex = 0

        vocabScrollView = ScrollView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }
        vocabPageLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(12), dp(16), dp(24))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }
        vocabPageLayout.addView(sectionLabel("מילים חדשות 📝"))
        vocabScrollView.addView(vocabPageLayout)
        setContent(vocabScrollView)

        appendVocabItem()
    }

    private fun appendVocabItem() {
        if (vocabRevealIndex >= vocabAllItems.size) return
        vocabPageLayout.addView(buildVocabRow(vocabAllItems[vocabRevealIndex], emojiColors[vocabRevealIndex % emojiColors.size]))
        vocabRevealIndex++
        vocabScrollView.post { vocabScrollView.fullScroll(View.FOCUS_DOWN) }
        binding.btnContinue.text = if (vocabRevealIndex >= vocabAllItems.size) "לתרגול →" else "הבא ↓"
        binding.btnContinue.isEnabled = true
    }

    private fun rebuildTeachPage() {
        teachPageLayout.removeAllViews()
        val target = teachRevealIndex
        teachRevealIndex = 0
        repeat(target) { appendTeachItem() }
        teachScrollView.post { teachScrollView.fullScroll(View.FOCUS_DOWN) }
    }

    private fun rebuildVocabPage() {
        vocabPageLayout.removeAllViews()
        vocabPageLayout.addView(sectionLabel("מילים חדשות 📝"))
        val target = vocabRevealIndex
        vocabRevealIndex = 0
        repeat(target) { appendVocabItem() }
        vocabScrollView.post { vocabScrollView.fullScroll(View.FOCUS_DOWN) }
    }

    private fun showTeachPage() {
        teachAllItems.clear()
        teachAllItems.addAll(lesson.grammarPoints)
        teachAllItems.addAll(lesson.examples)
        teachRevealIndex = 0

        teachScrollView = ScrollView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }
        teachPageLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(12), dp(16), dp(24))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }
        teachScrollView.addView(teachPageLayout)
        setContent(teachScrollView)

        // Show first item immediately
        appendTeachItem()
    }

    private fun appendTeachItem() {
        if (teachRevealIndex >= teachAllItems.size) return
        val item = teachAllItems[teachRevealIndex]
        val prev = if (teachRevealIndex > 0) teachAllItems[teachRevealIndex - 1] else null

        // Add section header when type changes
        when {
            item is VocabItem && prev !is VocabItem ->
                teachPageLayout.addView(sectionLabel("מילים חדשות 📝"))
            item is GrammarPoint && prev !is GrammarPoint ->
                teachPageLayout.addView(sectionLabel("דקדוק 📖"))
            item is Example && prev !is Example ->
                teachPageLayout.addView(sectionLabel("דוגמאות 💬"))
        }

        val vocabIndex = teachAllItems.take(teachRevealIndex + 1).count { it is VocabItem } - 1
        val view: View = when (item) {
            is VocabItem -> buildVocabRow(item, emojiColors[vocabIndex.coerceAtLeast(0) % emojiColors.size])
            is GrammarPoint -> buildGrammarBlock(item)
            is Example -> buildExampleRow(item)
            else -> return
        }
        teachPageLayout.addView(view)
        teachRevealIndex++

        // Scroll to newly added item
        teachScrollView.post { teachScrollView.fullScroll(View.FOCUS_DOWN) }

        // Update button label
        val allDone = teachRevealIndex >= teachAllItems.size
        binding.btnContinue.text = when {
            !allDone -> "הבא ↓"
            lesson.vocabulary.isNotEmpty() -> "מילים חדשות →"
            else -> "לתרגול →"
        }
        binding.btnContinue.isEnabled = true
    }

    private fun sectionLabel(text: String): TextView = TextView(this).apply {
        this.text = text
        textSize = 14f
        setTypeface(null, Typeface.BOLD)
        setTextColor(colorInt(R.color.onSurfaceMuted))
        layoutParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        ).also { it.topMargin = dp(14); it.bottomMargin = dp(8) }
    }

    private fun buildVocabRow(vocab: VocabItem, bgColor: Int): MaterialCardView {
        val card = MaterialCardView(this).apply {
            radius = dp(16).toFloat()
            strokeWidth = dp(1)
            strokeColor = colorInt(R.color.cardStroke)
            cardElevation = dp(2).toFloat()
            setCardBackgroundColor(colorInt(R.color.surface))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(10) }
        }
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(14), dp(14), dp(10), dp(14))
        }

        // Emoji box
        val emojiBox = FrameLayout(this).apply {
            layoutParams = LinearLayout.LayoutParams(dp(72), dp(72)).also { it.marginEnd = dp(16) }
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                cornerRadius = dp(16).toFloat()
                setColor(bgColor)
            }
        }
        emojiBox.addView(TextView(this).apply {
            text = if (vocab.emoji.isNotBlank()) vocab.emoji else "🇯🇵"
            textSize = 34f
            gravity = Gravity.CENTER
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT
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
            textSize = 26f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.onSurface))
        })
        textBlock.addView(TextView(this).apply {
            text = vocab.romaji
            textSize = 14f
            setTextColor(colorInt(R.color.onSurfaceMuted))
        })
        textBlock.addView(TextView(this).apply {
            text = vocab.hebrew
            textSize = 17f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.colorPrimary))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp(3) }
        })
        row.addView(textBlock)

        // Speak button — solid red, matches App.Button style
        row.addView(MaterialButton(this, null, com.google.android.material.R.attr.materialButtonStyle).apply {
            text = "🔊"
            textSize = 17f
            layoutParams = LinearLayout.LayoutParams(dp(48), dp(48)).also { it.marginStart = dp(8) }
            setPadding(0, 0, 0, 0)
            insetTop = 0; insetBottom = 0
            cornerRadius = dp(24)
            strokeColor = ColorStateList.valueOf(colorInt(R.color.colorPrimaryDark))
            strokeWidth = dp(2)
            backgroundTintList = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
            setTextColor(colorInt(R.color.white))
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
            cardElevation = dp(2).toFloat()
            setCardBackgroundColor(colorInt(R.color.surface))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(10) }
        }
        val inner = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(16), dp(16), dp(16))
        }
        inner.addView(TextView(this).apply {
            text = grammar.title
            textSize = 17f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.colorPrimary))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(10) }
        })
        inner.addView(TextView(this).apply {
            text = grammar.content
            textSize = 15f
            setTextColor(colorInt(R.color.onSurface))
            isSingleLine = false
        })
        if (!grammar.pattern.isNullOrBlank()) {
            inner.addView(TextView(this).apply {
                text = grammar.pattern
                textSize = 14f
                setTextColor(colorInt(R.color.onSurfaceMuted))
                setPadding(dp(12), dp(10), dp(12), dp(10))
                background = GradientDrawable().apply {
                    shape = GradientDrawable.RECTANGLE
                    cornerRadius = dp(8).toFloat()
                    setColor(colorInt(R.color.surfaceSoft))
                }
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
                ).also { it.topMargin = dp(12) }
            })
        }
        card.addView(inner)
        return card
    }

    private fun buildExampleRow(example: Example): LinearLayout {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(6), dp(4), dp(6), dp(4))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(12) }
        }
        row.addView(TextView(this).apply {
            text = "▸  ${example.romaji}"
            textSize = 17f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.onSurface))
        })
        if (example.japanese.isNotBlank()) {
            row.addView(TextView(this).apply {
                text = "    ${example.japanese}"
                textSize = 14f
                setTextColor(colorInt(R.color.onSurfaceMuted))
            })
        }
        row.addView(TextView(this).apply {
            text = "    ${example.hebrew}"
            textSize = 16f
            setTextColor(colorInt(R.color.colorPrimary))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
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

        // Hint card — shown on wrong answer, stays visible while user retries
        val hintCard = MaterialCardView(this).apply {
            radius = dp(12).toFloat()
            strokeWidth = 0
            cardElevation = 0f
            setCardBackgroundColor(0xFFE8F4FD.toInt())
            visibility = View.GONE
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(12) }
        }
        val hintInner = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(14), dp(12), dp(14), dp(12))
        }
        hintInner.addView(TextView(this).apply {
            text = "💡"
            textSize = 18f
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.marginEnd = dp(10) }
        })
        val hintText = TextView(this).apply {
            textSize = 14f
            setTextColor(0xFF1565C0.toInt())
            isSingleLine = false
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
        }
        hintInner.addView(hintText)
        hintCard.addView(hintInner)
        container.addView(hintCard)
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

                    // Show hint if explanation exists — stays visible while user retries
                    if (question.explanation.isNotBlank()) {
                        hintText.text = question.explanation
                        hintCard.visibility = View.VISIBLE
                    }

                    handler.postDelayed({
                        btn.backgroundTintList = ColorStateList.valueOf(colorInt(R.color.white))
                        btn.setTextColor(colorInt(R.color.onSurface))
                        btn.strokeColor = ColorStateList.valueOf(colorInt(R.color.optionStroke))
                        feedbackLabel.visibility = View.INVISIBLE
                        // hintCard stays visible so user can read it while retrying
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
