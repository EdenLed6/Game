package com.nihongo.beginner

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Typeface
import android.net.Uri
import android.os.Bundle
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import com.nihongo.beginner.databinding.FragmentMediaBinding

class MediaFragment : Fragment() {

    private var _binding: FragmentMediaBinding? = null
    private val binding get() = _binding!!

    private val schoolerUrl = "https://my.schooler.biz/s/63734/login"
    private val spotifyShowUrl = "https://open.spotify.com/show/6T5VhT26vZS4HflX3Wtvt4"
    private val spotifyEmbedUrl = "https://open.spotify.com/embed/show/6T5VhT26vZS4HflX3Wtvt4?utm_source=generator&theme=0"
    private val showcaseUrl = "https://vimeo.com/showcase/12053803"

    private data class VideoItem(val title: String, val url: String)
    private data class VideoSection(val header: String, val items: List<VideoItem>)

    private val videoSections = listOf(
        VideoSection("פתיחה", listOf(
            VideoItem("הקדמה", "https://vimeo.com/1032804188"),
            VideoItem("שיעור 1 — הגיה (חלק א)", "https://vimeo.com/1032805127"),
            VideoItem("שיעור 1 — הגיה (חלק ב)", "https://vimeo.com/1034142993"),
            VideoItem("שיעור 2 — מילות ברכה", "https://vimeo.com/1032825918"),
            VideoItem("שיעור 3 — עקרון בשפה היפנית", "https://vimeo.com/1032806172")
        )),
        VideoSection("דקדוק", listOf(
            VideoItem("שיעור 4 — דקדוק בסיסי (desu)", "https://vimeo.com/1032827425"),
            VideoItem("בונוס — תרגול שיעור 4", "https://vimeo.com/1032828592"),
            VideoItem("שיעור 5 — צורת שלילה", "https://vimeo.com/1032829563"),
            VideoItem("שיעור 6 — שייכות", "https://vimeo.com/1032830077")
        )),
        VideoSection("דקדוק 2", listOf(
            VideoItem("שיעור 7 — kore / sore / are", "https://vimeo.com/1033567027"),
            VideoItem("בונוס — מספרים", "https://vimeo.com/1033567224"),
            VideoItem("שיעור 8 — kono / sono / ano", "https://vimeo.com/1034247067")
        )),
        VideoSection("דקדוק — פעלים", listOf(
            VideoItem("שיעור 9 — פעלים", "https://vimeo.com/1033568073"),
            VideoItem("שיעור 10 — פעלים שלילה", "https://vimeo.com/1033824712"),
            VideoItem("שיעור 11 — בניית משפטים עם פועל", "https://vimeo.com/1033572121"),
            VideoItem("שיעור 12 — משפטים עם זמן", "https://vimeo.com/1033579936"),
            VideoItem("שיעור 13 — משפטים עם מיקום", "https://vimeo.com/1033585539"),
            VideoItem("בונוס — De", "https://vimeo.com/1033585685"),
            VideoItem("שיעור 14 — משפטים עם כיוון", "https://vimeo.com/1033593749"),
            VideoItem("שיעור 15 — צורת עבר", "https://vimeo.com/1033587473"),
            VideoItem("שיעור 16 — צורת עבר 2", "https://vimeo.com/1033587388")
        )),
        VideoSection("סיכום", listOf(
            VideoItem("סיכום", "https://vimeo.com/1033629453"),
            VideoItem("בונוס — קאנג'י 1", "https://vimeo.com/1052638546"),
            VideoItem("בונוס — קאנג'י 2", "https://vimeo.com/1052639114"),
            VideoItem("Otsukare おつかれ", "https://vimeo.com/1033629532")
        ))
    )

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentMediaBinding.inflate(inflater, container, false)
        return binding.root
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnOpenSchooler.setOnClickListener { openUrl(schoolerUrl) }
        binding.cardSchooler.setOnClickListener { openUrl(schoolerUrl) }
        binding.btnOpenSpotify.setOnClickListener { openUrl(spotifyShowUrl) }

        setupSpotifyWebView()
        buildVideoList()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupSpotifyWebView() {
        with(binding.webViewSpotify.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = false
        }
        binding.webViewSpotify.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                openUrl(request.url.toString())
                return true
            }
        }
        binding.webViewSpotify.loadUrl(spotifyEmbedUrl)
    }

    private fun buildVideoList() {
        val list = binding.videoList
        val ctx = requireContext()
        val primary = ContextCompat.getColor(ctx, R.color.colorPrimary)
        val onSurface = ContextCompat.getColor(ctx, R.color.onSurface)
        val muted = ContextCompat.getColor(ctx, R.color.onSurfaceMuted)

        fun dp(v: Int) = (v * ctx.resources.displayMetrics.density + 0.5f).toInt()

        for (section in videoSections) {
            // Section header
            list.addView(TextView(ctx).apply {
                text = section.header
                textSize = 13f
                setTypeface(null, Typeface.BOLD)
                setTextColor(primary)
                setPadding(dp(4), dp(16), dp(4), dp(6))
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                )
            })

            for (item in section.items) {
                val row = LinearLayout(ctx).apply {
                    orientation = LinearLayout.HORIZONTAL
                    gravity = Gravity.CENTER_VERTICAL
                    setPadding(0, dp(6), 0, dp(6))
                    layoutParams = LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                    )
                }

                row.addView(TextView(ctx).apply {
                    text = "▶  ${item.title}"
                    textSize = 14f
                    setTextColor(onSurface)
                    layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
                })

                row.addView(MaterialButton(ctx, null, com.google.android.material.R.attr.materialButtonOutlinedStyle).apply {
                    text = "צפה"
                    textSize = 12f
                    setPadding(dp(12), 0, dp(12), 0)
                    minHeight = dp(36)
                    setTextColor(primary)
                    layoutParams = LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.WRAP_CONTENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                    )
                    setOnClickListener { openUrl(item.url) }
                })

                list.addView(row)

                // Divider
                list.addView(View(ctx).apply {
                    setBackgroundColor(ContextCompat.getColor(ctx, R.color.cardStroke))
                    layoutParams = LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT, dp(1)
                    ).also { it.topMargin = dp(4) }
                })
            }
        }

        // Showcase link
        list.addView(View(ctx).apply {
            layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(12))
        })
        list.addView(MaterialButton(ctx, null, com.google.android.material.R.attr.materialButtonOutlinedStyle).apply {
            text = "כל הסרטונים — Vimeo Showcase"
            setTextColor(primary)
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            setOnClickListener { openUrl(showcaseUrl) }
        })
    }

    private fun openUrl(url: String) {
        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
    }

    override fun onDestroyView() {
        super.onDestroyView()
        binding.webViewSpotify.destroy()
        _binding = null
    }
}
