package com.nihongo.beginner.audio

import android.content.Context
import android.speech.tts.TextToSpeech
import java.util.Locale

class PronunciationSpeaker(context: Context) : TextToSpeech.OnInitListener {

    private var ready = false
    private val tts = TextToSpeech(context.applicationContext, this)

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts.setLanguage(Locale.JAPANESE)
            ready = result != TextToSpeech.LANG_MISSING_DATA &&
                result != TextToSpeech.LANG_NOT_SUPPORTED
            tts.setSpeechRate(0.86f)
        }
    }

    fun speak(text: String) {
        if (text.isBlank() || !ready) return
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "jp-${text.hashCode()}")
    }

    fun shutdown() {
        tts.stop()
        tts.shutdown()
    }
}
