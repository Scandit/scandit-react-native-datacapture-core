/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.utils

import androidx.annotation.VisibleForTesting
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

@VisibleForTesting
class TestEventEmitter : RCTDeviceEventEmitter {
    private val mutableEvents = mutableListOf<Event>()

    val events: List<Event>
        get() = mutableEvents

    override fun emit(eventName: String, data: Any?) {
        mutableEvents += Event(eventName, data as WritableMap?)
    }
}

data class Event(val name: String, val data: WritableMap? = null)
