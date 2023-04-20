package com.fsihack4autism.abaclicker.model

import androidx.databinding.ObservableInt

data class Counter(val objective: Objective) {

    var count: ObservableInt = ObservableInt(0);

    fun increment() {
        count.set(count.get() + 1)
    }
}