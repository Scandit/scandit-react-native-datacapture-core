/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.listener

import com.facebook.react.modules.core.DeviceEventManagerModule
import com.scandit.datacapture.core.ui.DataCaptureViewListener
import com.scandit.datacapture.core.ui.orientation.DeviceOrientationMapper
import com.scandit.datacapture.core.ui.orientation.toJson
import com.scandit.datacapture.reactnative.core.utils.writableMap
import java.util.concurrent.atomic.AtomicBoolean

class RCTDataCaptureViewListener(
    private val eventEmitter: DeviceEventManagerModule.RCTDeviceEventEmitter
) : DataCaptureViewListener {

    companion object {
        private const val ON_SIZE_CHANGED_EVENT_NAME = "dataCaptureViewListener-didChangeSize"

        private const val FIELD_SIZE = "size"
        private const val FIELD_WIDTH = "width"
        private const val FIELD_HEIGHT = "height"
        private const val FIELD_ORIENTATION = "orientation"
    }

    internal var hasNativeListeners: AtomicBoolean = AtomicBoolean(false)

    override fun onSizeChanged(width: Int, height: Int, screenRotation: Int) {
        if (!hasNativeListeners.get()) return

        val params = writableMap {
            putMap(
                FIELD_SIZE,
                writableMap {
                    putInt(FIELD_WIDTH, width)
                    putInt(FIELD_HEIGHT, height)
                }
            )
            putString(
                FIELD_ORIENTATION,
                DeviceOrientationMapper()
                    .mapRotationToOrientation(screenRotation).toJson()
            )
        }
        eventEmitter.emit(ON_SIZE_CHANGED_EVENT_NAME, params)
    }
}
