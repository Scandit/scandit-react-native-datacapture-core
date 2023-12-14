/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.scandit.datacapture.core.capture.DataCaptureVersion
import com.scandit.datacapture.frameworks.core.CoreModule
import com.scandit.datacapture.frameworks.core.utils.LastFrameData
import com.scandit.datacapture.frameworks.core.utils.MainThread
import com.scandit.datacapture.reactnative.core.utils.Error
import com.scandit.datacapture.reactnative.core.utils.ReactNativeResult
import com.scandit.datacapture.reactnative.core.utils.reject

class ScanditDataCaptureCoreModule(
    reactContext: ReactApplicationContext,
    private val coreModule: CoreModule
) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val VERSION_KEY = "Version"
        private const val DEFAULTS_KEY = "Defaults"

        private val ERROR_NULL_FRAME = Error(5, "Frame is null, it might've been reused already.")
    }

    init {
        coreModule.onCreate(reactContext)
    }
    override fun invalidate() {
        coreModule.onDestroy()
        super.invalidate()
    }

    override fun getName(): String = "ScanditDataCaptureCore"

    override fun getConstants(): MutableMap<String, Any> = mutableMapOf(
        VERSION_KEY to DataCaptureVersion.VERSION_STRING,
        DEFAULTS_KEY to coreModule.getDefaults()
    )

    @ReactMethod
    fun registerListenerForEvents() {
        coreModule.registerDataCaptureContextListener()
    }

    @ReactMethod
    fun unregisterListenerForEvents() {
        coreModule.unregisterDataCaptureContextListener()
    }

    @ReactMethod
    fun registerListenerForCameraEvents() {
        coreModule.registerFrameSourceListener()
    }

    @ReactMethod
    fun unregisterListenerForCameraEvents() {
        coreModule.unregisterFrameSourceListener()
    }

    @ReactMethod
    fun registerListenerForViewEvents() {
        coreModule.registerDataCaptureViewListener()
    }

    @ReactMethod
    fun unregisterListenerForViewEvents() {
        coreModule.unregisterDataCaptureViewListener()
    }

    @ReactMethod
    fun contextFromJSON(json: String, promise: Promise) {
        coreModule.createContextFromJson(json, ReactNativeResult(promise))
    }

    @ReactMethod
    fun updateContextFromJSON(json: String, promise: Promise) {
        MainThread.runOnMainThread {
            coreModule.updateContextFromJson(json, ReactNativeResult(promise))
        }
    }

    @ReactMethod
    fun getLastFrame(promise: Promise) {
        LastFrameData.getLastFrameDataJson {
            if (it == null) {
                promise.reject(ERROR_NULL_FRAME)
                return@getLastFrameDataJson
            }

            promise.resolve(it)
        }
    }

    @ReactMethod
    fun getLastFrameOrNull(promise: Promise) {
        LastFrameData.getLastFrameDataJson {
            promise.resolve(it)
        }
    }

    @ReactMethod
    fun dispose() {
        coreModule.disposeContext()
    }

    @ReactMethod
    fun emitFeedback(json: String, promise: Promise) {
        coreModule.emitFeedback(json, ReactNativeResult(promise))
    }

    @ReactMethod
    fun viewPointForFramePoint(json: String, promise: Promise) {
        coreModule.viewPointForFramePoint(json, ReactNativeResult(promise))
    }

    @ReactMethod
    fun viewQuadrilateralForFrameQuadrilateral(json: String, promise: Promise) {
        coreModule.viewQuadrilateralForFrameQuadrilateral(json, ReactNativeResult(promise))
    }

    @ReactMethod
    fun getCurrentCameraState(cameraPosition: String, promise: Promise) {
        coreModule.getCameraState(cameraPosition, ReactNativeResult(promise))
    }

    @ReactMethod
    fun isTorchAvailable(cameraPosition: String, promise: Promise) {
        coreModule.isTorchAvailable(cameraPosition, ReactNativeResult(promise))
    }
}
