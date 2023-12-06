/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.utils

internal object Log {
    private const val TAG = "sdc-rn"

    @JvmStatic
    fun error(message: String) {
        android.util.Log.e(TAG, message)
    }

    @JvmStatic
    fun info(message: String) {
        android.util.Log.i(TAG, message)
    }

    @JvmStatic
    fun error(e: Exception) {
        e.printStackTrace()
    }

    @JvmStatic
    fun error(message: String, e: Exception) {
        android.util.Log.e(TAG, message)
        e.printStackTrace()
    }
}
