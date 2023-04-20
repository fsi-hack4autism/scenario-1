package com.fsihack4autism.abaclicker.model

import android.app.Activity
import androidx.databinding.ObservableInt

abstract class Event(open val objective: Objective) {

    var count: ObservableInt = ObservableInt(0);

    abstract fun handleEvent()
}