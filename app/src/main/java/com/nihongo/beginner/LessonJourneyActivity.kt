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
import android.webkit.WebChromeClient
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
    private var quizScore = 0

    private var lessonWebView: WebView? = null
    private var fullscreenCallback: WebChromeClient.CustomViewCallback? = null
    private var videoFullscreenContainer: FrameLayout? = null

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

    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        if (videoFullscreenContainer != null) exitVideoFullscreen()
        else super.onBackPressed()
    }

    private fun exitVideoFullscreen() {
        fullscreenCallback?.onCustomViewHidden()
        fullscreenCallback = null
        videoFullscreenContainer?.removeAllViews()
        (window.decorView as? FrameLayout)?.removeView(videoFullscreenContainer)
        videoFullscreenContainer = null
        @Suppress("DEPRECATION")
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_VISIBLE
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
            Step.QUIZ -> { quizIndex = 0; quizScore = 0; showQuizQuestion() }
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
                val maxCards = lesson.practiceCards.size
                if (maxCards == 0 || practiceIndex >= maxCards - 1) {
                    showStep(Step.QUIZ)
                } else {
                    practiceIndex++
                    showPracticeCard()
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
            Step.QUIZ -> { quizIndex = 0; quizScore = 0; showStep(Step.PRACTICE) }
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
    @SuppressLint("SetJavaScriptEnabled", "ClickableViewAccessibility")
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
                allowContentAccess = false
                allowFileAccess = false
            }
            isLongClickable = false
            setOnLongClickListener { true }
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView, url: String) = true
                override fun onPageFinished(view: WebView, url: String) {
                    view.evaluateJavascript(
                        "document.body.style.cssText+='-webkit-user-select:none;user-select:none;';", null
                    )
                }
            }
            webChromeClient = object : WebChromeClient() {
                override fun onShowCustomView(view: View, callback: CustomViewCallback) {
                    fullscreenCallback = callback
                    val container = FrameLayout(this@LessonJourneyActivity).apply {
                        setBackgroundColor(Color.BLACK)
                        layoutParams = FrameLayout.LayoutParams(
                            FrameLayout.LayoutParams.MATCH_PARENT,
                            FrameLayout.LayoutParams.MATCH_PARENT
                        )
                    }
                    container.addView(view, FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT
                    ))
                    (window.decorView as FrameLayout).addView(container)
                    videoFullscreenContainer = container
                    @Suppress("DEPRECATION")
                    window.decorView.systemUiVisibility = (
                        View.SYSTEM_UI_FLAG_FULLSCREEN or
                        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    )
                }
                override fun onHideCustomView() = exitVideoFullscreen()
            }
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
            isClickable = true
            isFocusable = true
            setOnClickListener { speaker.speak(vocab.japanese) }
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
            setPadding(dp(18), dp(18), dp(18), dp(18))
        }
        inner.addView(TextView(this).apply {
            text = grammar.title
            textSize = 18f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.colorPrimary))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(12) }
        })
        inner.addView(TextView(this).apply {
            text = grammar.content
            textSize = 16f
            setLineSpacing(0f, 1.5f)
            setTextColor(colorInt(R.color.onSurface))
            isSingleLine = false
        })
        if (!grammar.pattern.isNullOrBlank()) {
            inner.addView(TextView(this).apply {
                text = grammar.pattern
                textSize = 15f
                setLineSpacing(0f, 1.3f)
                setTextColor(colorInt(R.color.colorPrimary))
                setPadding(dp(14), dp(12), dp(14), dp(12))
                background = GradientDrawable().apply {
                    shape = GradientDrawable.RECTANGLE
                    cornerRadius = dp(10).toFloat()
                    setColor(colorInt(R.color.surfaceSoft))
                }
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
                ).also { it.topMargin = dp(14) }
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
            isClickable = true
            isFocusable = true
            setOnClickListener { speaker.speak(example.romaji) }
        })
        if (example.japanese.isNotBlank()) {
            row.addView(TextView(this).apply {
                text = "    ${example.japanese}"
                textSize = 14f
                setTextColor(colorInt(R.color.onSurfaceMuted))
                isClickable = true
                isFocusable = true
                setOnClickListener { speaker.speak(example.japanese) }
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
    // PRACTICE — write the answer, then check or peek
    // ─────────────────────────────────────────────────────────────

    private fun showPracticeCard() {
        val cards = lesson.practiceCards
        val maxCards = cards.size
        if (maxCards == 0) { showStep(Step.QUIZ); return }

        val card = cards[practiceIndex]
        val isLast = practiceIndex >= maxCards - 1

        binding.btnContinue.isEnabled = false
        binding.btnContinue.text = if (isLast) "לחידון →" else "הבא"

        val scrollView = ScrollView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }

        val container = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(16), dp(20), dp(24))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }

        // Counter
        container.addView(TextView(this).apply {
            text = "${practiceIndex + 1} / $maxCards"
            textSize = 13f
            setTextColor(colorInt(R.color.onSurfaceMuted))
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(6) }
        })

        // Instruction label
        container.addView(TextView(this).apply {
            text = card.promptLabel
            textSize = 15f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.onSurfaceMuted))
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(14) }
        })

        // Prompt card
        val promptCard = MaterialCardView(this).apply {
            radius = dp(20).toFloat()
            strokeWidth = dp(1)
            strokeColor = colorInt(R.color.optionStroke)
            cardElevation = 0f
            setCardBackgroundColor(colorInt(R.color.surface))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(20) }
        }
        promptCard.addView(TextView(this).apply {
            text = card.prompt
            textSize = 26f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.onSurface))
            gravity = Gravity.CENTER
            isSingleLine = false
            setPadding(dp(20), dp(24), dp(20), dp(24))
        })
        container.addView(promptCard)

        // Input field
        val editText = android.widget.EditText(this).apply {
            hint = card.inputHint
            textSize = 17f
            setTextColor(colorInt(R.color.onSurface))
            setHintTextColor(colorInt(R.color.onSurfaceMuted))
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                cornerRadius = dp(12).toFloat()
                setColor(colorInt(R.color.surface))
                setStroke(dp(1), colorInt(R.color.cardStroke))
            }
            setPadding(dp(16), dp(14), dp(16), dp(14))
            isSingleLine = false
            maxLines = 3
            imeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_DONE
            inputType = android.text.InputType.TYPE_CLASS_TEXT or
                    android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(14) }
        }
        container.addView(editText)

        // Feedback label (hidden)
        val feedbackLabel = TextView(this).apply {
            textSize = 15f
            setTypeface(null, Typeface.BOLD)
            gravity = Gravity.CENTER
            visibility = View.GONE
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(10) }
        }
        container.addView(feedbackLabel)

        // Answer reveal area (hidden)
        val answerCard = MaterialCardView(this).apply {
            radius = dp(16).toFloat()
            strokeWidth = dp(1)
            strokeColor = colorInt(R.color.cardStroke)
            cardElevation = 0f
            setCardBackgroundColor(colorInt(R.color.surface))
            visibility = View.GONE
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(14) }
        }
        val answerInner = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(dp(16), dp(16), dp(16), dp(16))
        }
        answerInner.addView(TextView(this).apply {
            text = card.answer
            textSize = 20f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.colorPrimary))
            gravity = Gravity.CENTER
            isSingleLine = false
            if (card.audioText.isNotBlank()) {
                isClickable = true
                isFocusable = true
                setOnClickListener { speaker.speak(card.audioText) }
            }
        })
        if (card.answerSub.isNotBlank()) {
            answerInner.addView(TextView(this).apply {
                text = card.answerSub
                textSize = 14f
                setTextColor(colorInt(R.color.onSurfaceMuted))
                gravity = Gravity.CENTER
                isSingleLine = false
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).also { it.topMargin = dp(6) }
            })
        }
        if (card.audioText.isNotBlank()) {
            answerInner.addView(MaterialButton(this, null, com.google.android.material.R.attr.materialButtonStyle).apply {
                text = "🔊"
                textSize = 17f
                layoutParams = LinearLayout.LayoutParams(dp(48), dp(48)).also {
                    it.topMargin = dp(10)
                    it.gravity = Gravity.CENTER_HORIZONTAL
                }
                setPadding(0, 0, 0, 0)
                insetTop = 0; insetBottom = 0
                cornerRadius = dp(24)
                strokeColor = ColorStateList.valueOf(colorInt(R.color.colorPrimaryDark))
                strokeWidth = dp(2)
                backgroundTintList = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
                setTextColor(colorInt(R.color.white))
                setOnClickListener { speaker.speak(card.audioText) }
            })
        }
        answerCard.addView(answerInner)
        container.addView(answerCard)

        fun revealAnswer(correct: Boolean?) {
            answerCard.visibility = View.VISIBLE
            binding.btnContinue.isEnabled = true
            val imm = getSystemService(android.content.Context.INPUT_METHOD_SERVICE)
                    as android.view.inputmethod.InputMethodManager
            imm.hideSoftInputFromWindow(editText.windowToken, 0)
            when (correct) {
                true -> {
                    feedbackLabel.text = "✓ נכון!"
                    feedbackLabel.setTextColor(colorInt(R.color.correct_green))
                    feedbackLabel.visibility = View.VISIBLE
                    answerCard.setCardBackgroundColor(0xFFE8F5E9.toInt())
                    if (card.audioText.isNotBlank()) {
                        binding.root.post { speaker.speak(card.audioText) }
                    }
                }
                false -> {
                    feedbackLabel.text = "✗ לא מדויק — התשובה הנכונה:"
                    feedbackLabel.setTextColor(colorInt(R.color.wrong_red))
                    feedbackLabel.visibility = View.VISIBLE
                    answerCard.setCardBackgroundColor(0xFFFFF3E0.toInt())
                }
                null -> {
                    feedbackLabel.visibility = View.GONE
                    answerCard.setCardBackgroundColor(colorInt(R.color.surface))
                }
            }
        }

        // Buttons row
        val btnRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }

        val btnCheck = MaterialButton(this, null, com.google.android.material.R.attr.materialButtonStyle).apply {
            text = "בדוק ✓"
            isAllCaps = false
            textSize = 15f
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).also {
                it.marginEnd = dp(8)
            }
            backgroundTintList = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
            strokeColor = ColorStateList.valueOf(colorInt(R.color.colorPrimaryDark))
            strokeWidth = dp(2)
            cornerRadius = dp(14)
            stateListAnimator = null
        }

        val btnPeek = MaterialButton(this, null, com.google.android.material.R.attr.materialButtonOutlinedStyle).apply {
            text = "גלה 👁"
            isAllCaps = false
            textSize = 15f
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
            strokeColor = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
            strokeWidth = dp(1)
            setTextColor(colorInt(R.color.colorPrimary))
            backgroundTintList = ColorStateList.valueOf(android.graphics.Color.TRANSPARENT)
            cornerRadius = dp(14)
            stateListAnimator = null
        }

        btnCheck.setOnClickListener {
            val input = editText.text.toString()
            val correct = normalizeAnswer(input) == normalizeAnswer(card.answer)
            revealAnswer(correct)
            btnCheck.isEnabled = false
            btnPeek.isEnabled = false
        }

        btnPeek.setOnClickListener {
            revealAnswer(null)
            btnCheck.isEnabled = false
            btnPeek.isEnabled = false
        }

        btnRow.addView(btnCheck)
        btnRow.addView(btnPeek)
        container.addView(btnRow)

        scrollView.addView(container)
        setContent(scrollView)

        editText.post { editText.requestFocus() }
    }

    private fun normalizeAnswer(s: String): String =
        s.trim().lowercase().trimEnd('.', '?', '!', '。', '？').replace("\\s+".toRegex(), " ")

    // ─────────────────────────────────────────────────────────────
    // QUIZ
    // ─────────────────────────────────────────────────────────────

    private fun showQuizQuestion() {
        if (quizIndex >= lesson.exercises.size) {
            onQuizComplete()
            return
        }

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

        // Progress indicator
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

        // Question card with speak button
        val questionCard = MaterialCardView(this).apply {
            radius = dp(20).toFloat()
            strokeWidth = dp(1)
            strokeColor = colorInt(R.color.optionStroke)
            cardElevation = 0f
            setCardBackgroundColor(colorInt(R.color.surface))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.bottomMargin = dp(20) }
        }
        val questionRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(20), dp(24), dp(20), dp(24))
        }
        val questionTextView = TextView(this).apply {
            text = question.question
            textSize = 18f
            setTypeface(null, Typeface.BOLD)
            setTextColor(colorInt(R.color.onSurface))
            isSingleLine = false
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
                .also { it.marginEnd = dp(12) }
        }
        val speakQuestionBtn = MaterialButton(this).apply {
            layoutParams = LinearLayout.LayoutParams(dp(44), dp(44))
            insetTop = 0; insetBottom = 0
            minWidth = 0; minHeight = 0
            cornerRadius = dp(22)
            backgroundTintList = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
            strokeColor = ColorStateList.valueOf(colorInt(R.color.colorPrimaryDark))
            strokeWidth = dp(2)
            icon = ContextCompat.getDrawable(this@LessonJourneyActivity, R.drawable.ic_volume)
            iconTint = ColorStateList.valueOf(colorInt(R.color.white))
            iconSize = dp(20)
            iconPadding = 0
            iconGravity = MaterialButton.ICON_GRAVITY_TEXT_START
            stateListAnimator = null
            setOnClickListener { speaker.speak(question.question) }
        }
        questionRow.addView(questionTextView)
        if (!question.question.isHebrew()) questionRow.addView(speakQuestionBtn)
        questionCard.addView(questionRow)
        val romajiInQuestion = question.question.extractRomaji()
        if (romajiInQuestion.isNotBlank()) {
            questionCard.isClickable = true
            questionCard.isFocusable = true
            questionCard.setOnClickListener { speaker.speak(romajiInQuestion) }
        }
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
            ).also { it.bottomMargin = dp(12) }
        }
        container.addView(feedbackLabel)

        // Hint card (shown after wrong answer)
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

        // Option buttons + speak buttons
        val optionButtons = mutableListOf<MaterialButton>()
        var selectedOptionIndex: Int? = null
        var checkButton: MaterialButton? = null
        var nextButton: MaterialButton? = null

        question.options.forEachIndexed { index, optionText ->
            val row = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                gravity = Gravity.CENTER_VERTICAL
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).also { it.bottomMargin = dp(10) }
            }
            val btn = MaterialButton(this, null, com.google.android.material.R.attr.materialButtonOutlinedStyle).apply {
                text = optionText
                textSize = 15f
                isAllCaps = false
                setTextColor(colorInt(R.color.onSurface))
                backgroundTintList = ColorStateList.valueOf(colorInt(R.color.surface))
                strokeColor = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
                strokeWidth = dp(2)
                cornerRadius = dp(16)
                setPadding(dp(20), 0, dp(20), 0)
                minHeight = dp(58)
                gravity = Gravity.START or Gravity.CENTER_VERTICAL
                stateListAnimator = null
                layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
            }
            btn.setOnClickListener {
                selectedOptionIndex = index
                optionButtons.forEachIndexed { i, b ->
                    if (i == index) {
                        b.backgroundTintList = ColorStateList.valueOf(colorInt(R.color.selected_yellow))
                        b.strokeColor = ColorStateList.valueOf(colorInt(R.color.selected_yellow_stroke))
                        b.setTextColor(colorInt(R.color.onSurface))
                    } else {
                        b.backgroundTintList = ColorStateList.valueOf(colorInt(R.color.surface))
                        b.strokeColor = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
                        b.setTextColor(colorInt(R.color.onSurface))
                    }
                }
                checkButton?.isEnabled = true
            }
            if (!optionText.isHebrew()) {
                btn.setOnLongClickListener { speaker.speak(optionText); true }
            }
            val speakBtn = MaterialButton(this).apply {
                layoutParams = LinearLayout.LayoutParams(dp(44), dp(44)).also { it.marginStart = dp(8) }
                insetTop = 0; insetBottom = 0
                minWidth = 0; minHeight = 0
                cornerRadius = dp(22)
                backgroundTintList = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
                strokeColor = ColorStateList.valueOf(colorInt(R.color.colorPrimaryDark))
                strokeWidth = dp(2)
                icon = ContextCompat.getDrawable(this@LessonJourneyActivity, R.drawable.ic_volume)
                iconTint = ColorStateList.valueOf(colorInt(R.color.white))
                iconSize = dp(20)
                iconPadding = 0
                iconGravity = MaterialButton.ICON_GRAVITY_TEXT_START
                stateListAnimator = null
                setOnClickListener { speaker.speak(optionText) }
            }
            optionButtons.add(btn)
            row.addView(btn)
            if (!optionText.isHebrew()) row.addView(speakBtn)
            container.addView(row)
        }

        // Check button (disabled until an option is selected)
        checkButton = MaterialButton(this).apply {
            text = "בדוק ✓"
            isAllCaps = false
            backgroundTintList = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
            setTextColor(Color.WHITE)
            cornerRadius = dp(14)
            stateListAnimator = null
            isEnabled = false
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).also { it.topMargin = dp(8); it.bottomMargin = dp(8) }
        }
        checkButton!!.setOnClickListener {
            val selected = selectedOptionIndex ?: return@setOnClickListener
            checkButton!!.isEnabled = false
            optionButtons.forEach { it.isEnabled = false }

            val correct = question.correctIndex
            optionButtons[correct].backgroundTintList = ColorStateList.valueOf(colorInt(R.color.correct_green))
            optionButtons[correct].setTextColor(colorInt(R.color.white))
            optionButtons[correct].strokeColor = ColorStateList.valueOf(colorInt(R.color.correct_green))

            if (selected == correct) {
                quizScore++
                feedbackLabel.text = "✓ נכון!"
                feedbackLabel.setTextColor(colorInt(R.color.correct_green))
            } else {
                optionButtons[selected].backgroundTintList = ColorStateList.valueOf(colorInt(R.color.wrong_red))
                optionButtons[selected].setTextColor(colorInt(R.color.white))
                optionButtons[selected].strokeColor = ColorStateList.valueOf(colorInt(R.color.wrong_red))
                feedbackLabel.text = "✗ לא נכון"
                feedbackLabel.setTextColor(colorInt(R.color.wrong_red))
                if (question.explanation.isNotBlank()) {
                    hintText.text = question.explanation
                    hintCard.visibility = View.VISIBLE
                }
            }
            feedbackLabel.visibility = View.VISIBLE
            nextButton?.visibility = View.VISIBLE
        }
        container.addView(checkButton)

        // Next button (hidden until answer is checked)
        nextButton = MaterialButton(this).apply {
            text = "הבא ▶"
            isAllCaps = false
            backgroundTintList = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
            setTextColor(Color.WHITE)
            cornerRadius = dp(14)
            stateListAnimator = null
            visibility = View.GONE
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }
        nextButton!!.setOnClickListener {
            quizIndex++
            showQuizQuestion()
        }
        container.addView(nextButton)

        scrollView.addView(container)
        setContent(scrollView)
    }

    private fun onQuizComplete() {
        val total = lesson.exercises.size
        val percent = if (total > 0) quizScore * 100 / total else 0

        if (percent >= 80) {
            ProgressManager.markLessonCompleted(this, lesson.id)
            ProgressManager.addXP(this, 100)
            ProgressManager.recordActivity(this)
            showStep(Step.COMPLETE)
        } else {
            binding.btnContinue.visibility = View.GONE

            val container = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                gravity = Gravity.CENTER
                setPadding(dp(32), dp(48), dp(32), dp(48))
                layoutParams = FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.MATCH_PARENT
                )
            }
            container.addView(TextView(this).apply {
                text = "📚"
                textSize = 64f
                gravity = Gravity.CENTER
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).also { it.bottomMargin = dp(16) }
            })
            container.addView(TextView(this).apply {
                text = "$quizScore / $total"
                textSize = 48f
                setTypeface(null, Typeface.BOLD)
                setTextColor(colorInt(R.color.colorPrimary))
                gravity = Gravity.CENTER
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).also { it.bottomMargin = dp(8) }
            })
            container.addView(TextView(this).apply {
                text = "ניקוד: $percent%"
                textSize = 18f
                setTypeface(null, Typeface.BOLD)
                setTextColor(colorInt(R.color.onSurface))
                gravity = Gravity.CENTER
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).also { it.bottomMargin = dp(12) }
            })
            container.addView(TextView(this).apply {
                text = "נדרש 80% כדי לעבור את השיעור. נסה שוב!"
                textSize = 15f
                setTextColor(colorInt(R.color.onSurfaceMuted))
                gravity = Gravity.CENTER
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).also { it.bottomMargin = dp(32) }
            })
            val retryBtn = MaterialButton(this).apply {
                text = "נסה שוב"
                isAllCaps = false
                backgroundTintList = ColorStateList.valueOf(colorInt(R.color.colorPrimary))
                setTextColor(Color.WHITE)
                cornerRadius = dp(14)
                stateListAnimator = null
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                )
            }
            retryBtn.setOnClickListener {
                quizIndex = 0
                quizScore = 0
                showQuizQuestion()
            }
            container.addView(retryBtn)
            setContent(container)
        }
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

    private fun String.isHebrew() = any { it in '֐'..'׿' }

    private fun String.extractRomaji() =
        split("\\s+".toRegex())
            .filter { w -> w.isNotBlank() && w.none { it in '֐'..'׿' } }
            .joinToString(" ").trim()
}
