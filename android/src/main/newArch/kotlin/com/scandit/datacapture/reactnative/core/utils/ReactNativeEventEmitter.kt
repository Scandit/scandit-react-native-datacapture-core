/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.scandit.datacapture.frameworks.core.events.Emitter
import org.json.JSONObject

/**
 * New architecture event emitter that uses CodegenTypes.EventEmitter via JSI.
 *
 * This emitter accepts a lambda that calls the module's emitOnScanditEvent() method.
 * The lambda is provided at construction time by the TurboModule.
 *
 * Example usage:
 * ```
 * val emitter = ReactNativeEventEmitter { payload -> emitOnScanditEvent(payload) }
 * ```
 */
class ReactNativeEventEmitter(
    private val emitHandler: (ReadableMap) -> Unit
) : Emitter {

    override fun emit(eventName: String, payload: MutableMap<String, Any?>) {
        val reactPayload = Arguments.createMap().apply {
            putString("name", eventName)
            putString("data", JSONObject(payload).toString())
            // Extract viewId/modeId to top level for pre-parse filtering on JS side
            payload["viewId"]?.let { putInt("viewId", it as Int) }
            payload["modeId"]?.let { putInt("modeId", it as Int) }
        }
        emitHandler(reactPayload)
    }
}
