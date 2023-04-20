package com.fsihack4autism.abaclicker.ui.home;

import android.content.Context
import android.graphics.PorterDuff
import android.graphics.Rect
import android.util.AttributeSet;
import android.view.LayoutInflater
import android.widget.RelativeLayout
import androidx.annotation.ColorInt
import androidx.appcompat.content.res.AppCompatResources
import androidx.core.content.ContextCompat
import com.fsihack4autism.abaclicker.R

class ObjectiveButton @JvmOverloads constructor(
    context: Context,
    attrs:AttributeSet? = null,
    defStyleAttr: Int = 0
) : RelativeLayout(context, attrs, defStyleAttr) {

    init {
        // Inflate the layout
        LayoutInflater.from(context).inflate(R.layout.objective_button_layout, this, true)
        //val attributes = context.obtainStyledAttributes(attrs, R.styleable.ObjectiveButton, 0, 0)
        //val buttonBackground = attributes.getResourceId(R.styleable.ObjectiveButton_background, 0)
        //val drawable = ContextCompat.getDrawable(context, buttonBackground)?.mutate()
        //setBackgroundResource(buttonBackground)
        //background

        //attributes.recycle()

        //setPaddingRelative(10, 20, 10, 10)
    }

    // You can add additional methods or properties here as needed

}