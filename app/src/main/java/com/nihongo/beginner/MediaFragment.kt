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
import com.nihongo.beginner.databinding.FragmentMediaBinding

class MediaFragment : Fragment() {

    private var _binding: FragmentMediaBinding? = null
    private val binding get() = _binding!!

    private val schoolerUrl = "https://my.schooler.biz/s/63734/login"
    private val spotifyShowUrl = "https://open.spotify.com/show/6T5VhT26vZS4HflX3Wtvt4"
    private val spotifyEmbedUrl = "https://open.spotify.com/embed/show/6T5VhT26vZS4HflX3Wtvt4?utm_source=generator&theme=0"
    private val showcaseEmbedUrl = "https://vimeo.com/showcase/12053803/embed"

    private data class VideoItem(val title: String, val vimeoId: String)

    private val extraVideos = listOf(
        VideoItem("טיולים ליפן", "1150067870"),
        VideoItem("בקשה / הזמנה", "1012066739"),
        VideoItem("תארים", "1011931837"),
        VideoItem("תרבות האוכל — חלק א", "1011930627"),
        VideoItem("תרבות האוכל — חלק ב", "1011931577"),
        VideoItem("Arimasu — יש / נמצא", "1011928545")
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

        setupWebView(binding.webViewSpotify, spotifyEmbedUrl)
        setupWebView(binding.webViewShowcase, showcaseEmbedUrl)

        buildExtraVideoList()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView(webView: WebView, url: String) {
        with(webView.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = false
            loadWithOverviewMode = true
            useWideViewPort = true
        }
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                openUrl(request.url.toString())
                return true
            }
        }
        webView.loadUrl(url)
    }

    private fun buildExtraVideoList() {
        val list = binding.extraVideoList
        val ctx = requireContext()
        val primary = ContextCompat.getColor(ctx, R.color.colorPrimary)
        val onSurface = ContextCompat.getColor(ctx, R.color.onSurface)
        val stroke = ContextCompat.getColor(ctx, R.color.cardStroke)
        fun dp(v: Int) = (v * ctx.resources.displayMetrics.density + 0.5f).toInt()

        extraVideos.forEachIndexed { index, item ->
            val row = LinearLayout(ctx).apply {
                orientation = LinearLayout.HORIZONTAL
                gravity = Gravity.CENTER_VERTICAL
                setPadding(0, dp(8), 0, dp(8))
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                )
            }

            row.addView(TextView(ctx).apply {
                text = "▶  ${item.title}"
                textSize = 14f
                setTypeface(null, Typeface.NORMAL)
                setTextColor(onSurface)
                layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
            })

            row.addView(MaterialButton(ctx, null, com.google.android.material.R.attr.materialButtonOutlinedStyle).apply {
                text = "צפה"
                textSize = 12f
                minHeight = dp(36)
                setTextColor(primary)
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                )
                setOnClickListener { playVideo(item) }
            })

            list.addView(row)

            if (index < extraVideos.lastIndex) {
                list.addView(View(ctx).apply {
                    setBackgroundColor(stroke)
                    layoutParams = LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT, dp(1)
                    )
                })
            }
        }
    }

    private fun playVideo(item: VideoItem) {
        startActivity(
            Intent(requireContext(), VideoPlayerActivity::class.java)
                .putExtra(VideoPlayerActivity.EXTRA_URL, "https://vimeo.com/${item.vimeoId}")
                .putExtra(VideoPlayerActivity.EXTRA_TITLE, item.title)
        )
    }

    private fun openUrl(url: String) {
        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
    }

    override fun onDestroyView() {
        super.onDestroyView()
        binding.webViewSpotify.destroy()
        binding.webViewShowcase.destroy()
        _binding = null
    }
}
