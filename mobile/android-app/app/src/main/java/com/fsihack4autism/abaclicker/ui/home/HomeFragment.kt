package com.fsihack4autism.abaclicker.ui.home

import android.R
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.fsihack4autism.abaclicker.databinding.FragmentHomeBinding


class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
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

        binding.behavior1.setOnClickListener {
            counter1++
            binding.behavior1.text = "Counter $counter1"
        }

        binding.behavior2.setOnClickListener {
            val tv = binding.textHome
            tv.text = "Button 2 pressed"
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