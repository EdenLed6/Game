package com.nihongo.beginner

import android.content.Context
import android.util.AttributeSet
import android.widget.LinearLayout

class HeaderLinearLayout @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : LinearLayout(context, attrs, defStyleAttr) {
    // Prevent the background drawable's intrinsic/minimum size from
    // inflating this view — height stays content-driven.
    override fun getSuggestedMinimumHeight() = 0
    override fun getSuggestedMinimumWidth() = 0
}
