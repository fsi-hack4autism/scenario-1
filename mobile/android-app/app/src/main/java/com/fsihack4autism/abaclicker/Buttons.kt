package com.fsihack4autism.abaclicker

import com.fsihack4autism.abaclicker.model.Counter
import com.fsihack4autism.abaclicker.model.Duration
import com.fsihack4autism.abaclicker.model.Latency
import com.fsihack4autism.abaclicker.model.MetricType
import com.fsihack4autism.abaclicker.model.Objective

object Buttons : ButtonsImpl() {

}

open class ButtonsImpl() {
    var button1 : Counter = Counter(Objective("Undecipherable Language", MetricType.Counter))
    var button2 : Duration = Duration(Objective("Tantrum", MetricType.Duration))
    var button3 : Latency = Latency(Objective("Time To Get Ready", MetricType.Latency))
    var button4 : Counter = Counter(Objective("Rare Event", MetricType.Counter))
}