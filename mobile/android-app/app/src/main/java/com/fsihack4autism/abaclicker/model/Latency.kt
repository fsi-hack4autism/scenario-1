package com.fsihack4autism.abaclicker.model

import android.os.CountDownTimer

class Latency(override val objective: Objective) : Event(objective) {

    private var counting : Boolean = false
    private val timer : MyTimer = MyTimer()

    override fun handleEvent() {
        if(!counting) {
            counting = true
            start()
        } else {
            counting = false
            stop()
        }
    }

    private fun increment() {
        count.set(count.get() + 1)
    }

    private fun start() {
        timer.start()
    }

    private fun stop() {
        timer.cancel()
        count.set(0)
    }

    private inner class MyTimer : CountDownTimer(300000, 1000) {
        // adjust the milli seconds here
        override fun onTick(millisUntilFinished: Long) {
            increment()
        }

        override fun onFinish() {
        }
    }

}

