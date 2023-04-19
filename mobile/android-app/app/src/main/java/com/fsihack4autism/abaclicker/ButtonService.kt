package com.fsihack4autism.abaclicker
import android.os.CountDownTimer
import android.util.Log

class ButtonService {

    private val secondsCtr = 0;



    fun buttonPressed(buttonId: String): String {
        Log.d("btn", buttonId);
        return "A";
    }



}