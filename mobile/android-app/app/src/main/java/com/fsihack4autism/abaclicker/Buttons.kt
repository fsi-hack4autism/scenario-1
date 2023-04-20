package com.fsihack4autism.abaclicker

import com.fsihack4autism.abaclicker.model.Counter
import com.fsihack4autism.abaclicker.model.MetricType
import com.fsihack4autism.abaclicker.model.Objective

object Buttons {
    var button1 : Counter = Counter(Objective("Undecipherable Language", MetricType.Counter))
    var button2 : Counter = Counter(Objective("Tantrum", MetricType.Counter))
    var button3 : Counter = Counter(Objective("New Words Read", MetricType.Counter))
    var button4 : Counter = Counter(Objective("Rare Event", MetricType.Counter))
}