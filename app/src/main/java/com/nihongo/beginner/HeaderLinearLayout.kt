package com.nihongo.beginner

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Matrix
import android.graphics.Paint
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.AttributeSet
import android.widget.LinearLayout

class HeaderLinearLayout @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : LinearLayout(context, attrs, defStyleAttr) {

    private var headerBitmap: Bitmap? = null
    private val bitmapPaint = Paint(Paint.FILTER_BITMAP_FLAG or Paint.ANTI_ALIAS_FLAG)
    private val drawMatrix = Matrix()

    init {
        setWillNotDraw(false)
    }

    // Intercept background set from XML — extract bitmap for proper center-crop drawing.
    override fun setBackground(background: Drawable?) {
        if (background is BitmapDrawable) {
            headerBitmap = background.bitmap
            super.setBackground(null)
        } else {
            super.setBackground(background)
        }
    }

    override fun getSuggestedMinimumHeight() = 0
    override fun getSuggestedMinimumWidth() = 0

    override fun onDraw(canvas: Canvas) {
        val bmp = headerBitmap ?: return
        val vw = width.toFloat()
        val vh = height.toFloat()
        if (vw == 0f || vh == 0f) return

        // Center-crop: scale so both dimensions are filled, clip the excess.
        val scale = maxOf(vw / bmp.width, vh / bmp.height)
        val left = (vw - bmp.width * scale) / 2f
        val top = (vh - bmp.height * scale) / 2f

        drawMatrix.setScale(scale, scale)
        drawMatrix.postTranslate(left, top)
        canvas.drawBitmap(bmp, drawMatrix, bitmapPaint)
    }
}
