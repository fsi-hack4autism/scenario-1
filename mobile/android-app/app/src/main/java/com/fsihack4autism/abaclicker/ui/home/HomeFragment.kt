package com.fsihack4autism.abaclicker.ui.home

import CountUpTimer
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.databinding.Observable
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.fsihack4autism.abaclicker.databinding.FragmentHomeBinding
import com.fsihack4autism.abaclicker.model.Counter
import com.fsihack4autism.abaclicker.model.MetricType
import com.fsihack4autism.abaclicker.model.Objective


class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private var _timerIsRunning = false;

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        val bundle = arguments

        val homeViewModel =
            ViewModelProvider(this).get(HomeViewModel::class.java)

        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        val root: View = binding.root

        //val textView: TextView = binding.textHome
        //homeViewModel.text.observe(viewLifecycleOwner) {
        //    textView.text = it
        //}
        val objective1 = Objective("Undecipherable Language", MetricType.Counter)
        val languageCounter = Counter(objective1)

        languageCounter.count.addOnPropertyChangedCallback(object : Observable.OnPropertyChangedCallback() {
            override fun onPropertyChanged(sender: Observable?, propertyId: Int) {
                // Update the text of the TextView when the ObservableInt changes
                val tv = binding.objectiveButton1.getChildAt(2) as TextView
                tv.text = languageCounter.count.get().toString()
            }
        })

        binding.objectiveButton1.setOnClickListener {
            val tv = binding.objectiveButton1.getChildAt(2) as TextView
            languageCounter.increment()
        }

  //      binding.objectiveButton2.setOnClickListener {
 //           val duration = 1000000;
 //           val tv = binding.objectiveButton1.getChildAt(2) as TextView
//            val stopwatch = object : CountUpTimer(duration.toLong()) {
//                override fun onTick(second: Int) {
//                    if(_timerIsRunning)
//                        timerText.text = second.toString()
//                }
//                override fun onFinish() {
//                    timerText.text = (duration/1000).toString()
//                    _timerIsRunning=false
//                }
//            }
//
//            if(_timerIsRunning){
//                tv.text = "Timer Stopped"
//                stopwatch.cancel();
//            }
//            else {
//                tv.text = "Timer Started"
//                stopwatch.start()
//            }
//
//            _timerIsRunning = !_timerIsRunning;
     //   }

//        binding.objectiveButton3.setOnClickListener {
//            tv.text = "Button 3 pressed"
//        }
//
//        binding.objectiveButton4.setOnClickListener {
//            tv.text = "Button 4 pressed"
//        }

        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}