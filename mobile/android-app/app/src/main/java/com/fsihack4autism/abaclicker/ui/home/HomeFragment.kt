package com.fsihack4autism.abaclicker.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.databinding.Observable
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.fsihack4autism.abaclicker.Buttons
import com.fsihack4autism.abaclicker.databinding.FragmentHomeBinding
import com.fsihack4autism.abaclicker.model.Counter
import com.fsihack4autism.abaclicker.model.Event


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
        val homeViewModel = ViewModelProvider(this).get(HomeViewModel::class.java)

        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        val root: View = binding.root

        configureButton(binding.objectiveButton1, Buttons.button1)
        configureButton(binding.objectiveButton2, Buttons.button2)
        configureButton(binding.objectiveButton3, Buttons.button3)
        configureButton(binding.objectiveButton4, Buttons.button4)

        return root
    }

    private fun configureButton(layout: RelativeLayout, event: Event) {
        val nameTextView = layout.getChildAt(0) as TextView
        nameTextView.text = event.objective.name

        val typeTextView = layout.getChildAt(1) as TextView
        typeTextView.text = event.objective.metricType.toString()

        event.count.addOnPropertyChangedCallback(object : Observable.OnPropertyChangedCallback() {
            override fun onPropertyChanged(sender: Observable?, propertyId: Int) {
                // Update the text of the TextView when the ObservableInt changes
                val tv = layout.getChildAt(2) as TextView
                tv.text = event.count.get().toString()
            }
        })

        layout.setOnClickListener {
            val tv = layout.getChildAt(2) as TextView
            event.handleEvent()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}