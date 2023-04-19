package com.fsihack4autism.abaclicker
import android.os.CountDownTimer
import android.util.Log

import android.R.attr.data
import java.io.BufferedOutputStream
import java.io.BufferedWriter
import java.io.OutputStream
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL


class ButtonService {

    private val secondsCtr = 0;



    fun buttonPressed(buttonId: String): String {
        Log.d("btn", buttonId);
        return "A";
    }



}