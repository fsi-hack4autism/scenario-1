package com.fsihack4autism.abaclicker.model

class Counter(override val objective: Objective) : Event(objective) {
    override fun handleEvent() {
        count.set(count.get() + 1)
    }
}