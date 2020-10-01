/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.utils

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

// To DI the event emitter, but avoid calling getJSModule before a module's initialize()
class LazyEventEmitter(private val reactContext: ReactApplicationContext) : RCTDeviceEventEmitter {
    private val delegate by lazy { reactContext.getJSModule<RCTDeviceEventEmitter>() }

    override fun emit(eventName: String, data: Any?) {
        delegate.emit(eventName, data)
    }
}
