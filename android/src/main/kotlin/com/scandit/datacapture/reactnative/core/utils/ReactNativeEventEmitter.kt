/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.scandit.datacapture.frameworks.core.events.Emitter
import org.json.JSONObject

// To DI the event emitter, but avoid calling getJSModule before a module's initialize()
class ReactNativeEventEmitter(private val reactContext: ReactApplicationContext) : Emitter {
    private val delegate by lazy { reactContext.getJSModule<RCTDeviceEventEmitter>() }

    override fun emit(eventName: String, payload: MutableMap<String, Any?>) {
        val reactPayload = Arguments.createMap()
        reactPayload.putString("name", eventName)
        reactPayload.putString("data", JSONObject(payload).toString())
        delegate.emit(eventName, reactPayload)
    }
}
