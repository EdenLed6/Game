package com.nihongo.beginner

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.core.content.FileProvider
import androidx.fragment.app.Fragment
import com.nihongo.beginner.databinding.FragmentMediaBinding
import java.io.File

class MediaFragment : Fragment() {

    private var _binding: FragmentMediaBinding? = null
    private val binding get() = _binding!!

    private val schoolerUrl = "https://my.schooler.biz/s/63734/login"
    private val spotifyShowUrl = "https://open.spotify.com/show/6T5VhT26vZS4HflX3Wtvt4"
    private val spotifyEmbedUrl = "https://open.spotify.com/embed/show/6T5VhT26vZS4HflX3Wtvt4?utm_source=generator&theme=0"

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
        binding.btnOpenPdfMain.setOnClickListener { openPdf("course_main.pdf") }
        binding.btnOpenPdfTravelers.setOnClickListener { openPdf("course_travelers.pdf") }

        setupWebView(binding.webViewSpotify, spotifyEmbedUrl)
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

    private fun openPdf(filename: String) {
        try {
            val file = File(requireContext().cacheDir, filename)
            requireContext().assets.open(filename).use { input ->
                file.outputStream().use { output -> input.copyTo(output) }
            }
            val uri = FileProvider.getUriForFile(
                requireContext(),
                "${requireContext().packageName}.fileprovider",
                file
            )
            startActivity(Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(uri, "application/pdf")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            })
        } catch (e: Exception) {
            Toast.makeText(requireContext(), "לא ניתן לפתוח את הקובץ", Toast.LENGTH_SHORT).show()
        }
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
