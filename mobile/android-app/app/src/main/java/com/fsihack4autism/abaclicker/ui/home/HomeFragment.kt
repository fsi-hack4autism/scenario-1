package com.fsihack4autism.abaclicker.ui.home

import CountUpTimer
import android.R
import android.os.Bundle
import android.os.CountDownTimer
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.fsihack4autism.abaclicker.ButtonService
import com.fsihack4autism.abaclicker.databinding.FragmentHomeBinding


class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null

    private var _buttonService = ButtonService();
    private var _timerIsRunning = false;
    private var counter1 = 0

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

        val textView: TextView = binding.textHome
        homeViewModel.text.observe(viewLifecycleOwner) {
            textView.text = it
        }

        //todo: migrate counter into buttonservice
        binding.behavior1.setOnClickListener {
            val tv = binding.textHome;
            val btnTxt = "Button A pressed";
            tv.text = _buttonService.buttonPressed(btnTxt);
            counter1++
            binding.behavior1.text = "Counter $counter1"
        }

        //todo: migrate timer into buttonservice
        binding.behavior2.setOnClickListener {
            val tv = binding.textHome
            val timerText = binding.textHome2
            val duration = 1000000
            tv.text = "Button 2 pressed"

            var stopwatch = object : CountUpTimer(duration.toLong()) {
                override fun onTick(second: Int) {
                    timerText.text = second.toString()
                }
                override fun onFinish() {
                    timerText.text = (duration/1000).toString()
                    _timerIsRunning=false
                }
            }
            stopwatch.start()
            _timerIsRunning=true
        }

        binding.behavior3.setOnClickListener {
            val tv = binding.textHome
            tv.text = "Button 3 pressed"
        }

        binding.behavior4.setOnClickListener {
            val tv = binding.textHome
            tv.text = "Button 4 pressed"
        }

        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}