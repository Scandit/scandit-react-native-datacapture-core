/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.listener

import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.scandit.datacapture.core.source.FrameSource
import com.scandit.datacapture.core.source.FrameSourceListener
import com.scandit.datacapture.core.source.FrameSourceState
import com.scandit.datacapture.core.source.toJson
import com.scandit.datacapture.reactnative.core.utils.writableMap
import java.util.concurrent.atomic.AtomicBoolean

class RCTFrameSourceListener(
    private val eventEmitter: RCTDeviceEventEmitter
) : FrameSourceListener {

    companion object {
        private const val ON_STATE_CHANGED_EVENT_NAME = "frameSourceListener-didChangeState"

        private const val FIELD_STATE = "state"
    }

    internal var hasNativeListeners: AtomicBoolean = AtomicBoolean(false)

    override fun onStateChanged(frameSource: FrameSource, newState: FrameSourceState) {
        if (!hasNativeListeners.get()) return

        val params = writableMap {
            putString(FIELD_STATE, newState.toJson())
        }
        eventEmitter.emit(ON_STATE_CHANGED_EVENT_NAME, params)
    }
}
