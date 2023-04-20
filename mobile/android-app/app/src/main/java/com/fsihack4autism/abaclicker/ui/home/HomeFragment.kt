package com.fsihack4autism.abaclicker.ui.home

import CountUpTimer
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.fsihack4autism.abaclicker.databinding.FragmentHomeBinding


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
        val homeViewModel =
            ViewModelProvider(this).get(HomeViewModel::class.java)

        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        val root: View = binding.root

        //val textView: TextView = binding.textHome
        //homeViewModel.text.observe(viewLifecycleOwner) {
        //    textView.text = it
        //}


//        binding.behavior1.setOnClickListener {
//            val tv = binding.textHome;
//            //binding.behavior1.te
//            //tv.text = _buttonService.counterClick().toString();
//        }
//
//        binding.behavior2.setOnClickListener {
//            val duration = 1000000;
//            val tv = binding.textHome;
//            val timerText = binding.textHome2
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
//        }
//
//        binding.behavior3.setOnClickListener {
//            val tv = binding.textHome
//            tv.text = "Button 3 pressed"
//        }
//
//        binding.behavior4.setOnClickListener {
//            val tv = binding.textHome
//            tv.text = "Button 4 pressed"
//        }

        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}