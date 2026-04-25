package com.nihongo.beginner

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.ColorFilter
import android.graphics.Matrix
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.AttributeSet
import android.widget.LinearLayout

/**
 * Drawable that renders a bitmap with centerCrop scaling and reports zero
 * intrinsic/minimum dimensions, so it never inflates the view's measured size.
 */
private class CenterCropDrawable(private val bitmap: Bitmap) : Drawable() {
    private val paint = Paint(Paint.FILTER_BITMAP_FLAG or Paint.ANTI_ALIAS_FLAG)
    private val matrix = Matrix()

    override fun draw(canvas: Canvas) {
        val b = bounds
        val vw = b.width().toFloat()
        val vh = b.height().toFloat()
        if (vw == 0f || vh == 0f) return

        val scale = maxOf(vw / bitmap.width, vh / bitmap.height)
        val left = b.left + (vw - bitmap.width * scale) / 2f
        val top  = b.top  + (vh - bitmap.height * scale) / 2f

        matrix.setScale(scale, scale)
        matrix.postTranslate(left, top)
        canvas.drawBitmap(bitmap, matrix, paint)
    }

    override fun setAlpha(alpha: Int) { paint.alpha = alpha }
    override fun setColorFilter(cf: ColorFilter?) { paint.colorFilter = cf }
    override fun getOpacity() = PixelFormat.TRANSLUCENT
    override fun getIntrinsicWidth()  = -1
    override fun getIntrinsicHeight() = -1
    override fun getMinimumWidth()  = 0
    override fun getMinimumHeight() = 0
}

class HeaderLinearLayout @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : LinearLayout(context, attrs, defStyleAttr) {

    // When XML sets a BitmapDrawable background, swap it for a CenterCropDrawable
    // so the image always fills full width without inflating the view height.
    override fun setBackground(background: Drawable?) {
        if (background is BitmapDrawable) {
            super.setBackground(CenterCropDrawable(background.bitmap))
        } else {
            super.setBackground(background)
        }
    }

    override fun getSuggestedMinimumHeight() = 0
    override fun getSuggestedMinimumWidth()  = 0
}
