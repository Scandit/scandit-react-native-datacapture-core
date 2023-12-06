/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.listener

import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.scandit.datacapture.core.capture.DataCaptureContext
import com.scandit.datacapture.core.capture.DataCaptureContextListener
import com.scandit.datacapture.core.common.ContextStatus
import com.scandit.datacapture.core.common.toJson
import com.scandit.datacapture.reactnative.core.utils.writableMap
import java.util.concurrent.atomic.AtomicBoolean

class RCTDataCaptureContextListener(
    private val eventEmitter: RCTDeviceEventEmitter
) : DataCaptureContextListener {

    companion object {
        private const val ON_OBSERVATION_STARTED_EVENT_NAME =
            "dataCaptureContextListener-didStartObservingContext"
        private const val ON_STATUS_CHANGED_EVENT_NAME =
            "dataCaptureContextListener-didChangeStatus"

        private const val FIELD_STATUS = "status"
    }

    internal var hasNativeListeners: AtomicBoolean = AtomicBoolean(false)

    override fun onObservationStarted(dataCaptureContext: DataCaptureContext) {
        if (!hasNativeListeners.get()) return
        eventEmitter.emit(ON_OBSERVATION_STARTED_EVENT_NAME, null)
    }

    override fun onStatusChanged(
        dataCaptureContext: DataCaptureContext,
        contextStatus: ContextStatus
    ) {
        if (!hasNativeListeners.get()) return
        val params = writableMap {
            putString(FIELD_STATUS, contextStatus.toJson())
        }
        eventEmitter.emit(ON_STATUS_CHANGED_EVENT_NAME, params)
    }
}
