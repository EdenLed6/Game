package com.nihongo.beginner

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.appcompat.app.AppCompatActivity

class VideoPlayerActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_URL = "video_url"
        const val EXTRA_TITLE = "video_title"
    }

    private lateinit var webView: WebView
    private var fullscreenCallback: WebChromeClient.CustomViewCallback? = null
    private var videoFullscreenContainer: FrameLayout? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val url = intent.getStringExtra(EXTRA_URL) ?: run { finish(); return }
        val title = intent.getStringExtra(EXTRA_TITLE) ?: ""

        supportActionBar?.apply {
            this.title = title
            setDisplayHomeAsUpEnabled(true)
        }

        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        webView = WebView(this).apply {
            with(settings) {
                javaScriptEnabled = true
                domStorageEnabled = true
                mediaPlaybackRequiresUserGesture = false
                loadWithOverviewMode = true
                useWideViewPort = true
            }
            isLongClickable = false
            setOnLongClickListener { true }
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest) = true
                override fun onPageFinished(view: WebView, url: String) {
                    view.evaluateJavascript("""
                        (function(){
                            var s=document.createElement('style');
                            s.textContent='*{-webkit-user-select:none!important;user-select:none!important}'
                                +'[class*="overflow"],[class*="share"],[class*="vp-logo"],[class*="vimeo-logo"],[class*="vimeoLogo"]{display:none!important}';
                            document.head&&document.head.appendChild(s);
                        })();
                    """.trimIndent(), null)
                }
            }
            webChromeClient = object : WebChromeClient() {
                @Suppress("DEPRECATION")
                override fun onShowCustomView(view: View, callback: CustomViewCallback) {
                    fullscreenCallback = callback
                    val container = FrameLayout(this@VideoPlayerActivity).apply {
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
                    window.decorView.systemUiVisibility = (
                        View.SYSTEM_UI_FLAG_FULLSCREEN or
                        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    )
                }
                override fun onHideCustomView() = restoreFromVideoFullscreen()
            }
        }

        setContentView(webView)

        val videoId = url.substringAfterLast("/").substringBefore("?")
        webView.loadUrl("https://player.vimeo.com/video/$videoId?autoplay=0&title=0&byline=0&portrait=0&share=0&pip=0&vimeo_logo=0")
    }

    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        if (videoFullscreenContainer != null) {
            fullscreenCallback?.onCustomViewHidden()
            restoreFromVideoFullscreen()
        } else super.onBackPressed()
    }

    @Suppress("DEPRECATION")
    private fun restoreFromVideoFullscreen() {
        fullscreenCallback = null
        videoFullscreenContainer?.removeAllViews()
        (window.decorView as? FrameLayout)?.removeView(videoFullscreenContainer)
        videoFullscreenContainer = null
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_VISIBLE
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            if (videoFullscreenContainer != null) {
                fullscreenCallback?.onCustomViewHidden()
                restoreFromVideoFullscreen()
            } else finish()
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    override fun onDestroy() {
        super.onDestroy()
        webView.destroy()
    }
}
