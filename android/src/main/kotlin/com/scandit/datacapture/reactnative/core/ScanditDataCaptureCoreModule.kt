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
import com.scandit.datacapture.core.ui.DataCaptureView
import com.scandit.datacapture.frameworks.core.CoreModule
import com.scandit.datacapture.frameworks.core.deserialization.DefaultDeserializationLifecycleObserver
import com.scandit.datacapture.frameworks.core.deserialization.DeserializationLifecycleObserver
import com.scandit.datacapture.frameworks.core.utils.DefaultLastFrameData
import com.scandit.datacapture.frameworks.core.utils.DefaultMainThread
import com.scandit.datacapture.frameworks.core.utils.LastFrameData
import com.scandit.datacapture.frameworks.core.utils.MainThread
import com.scandit.datacapture.reactnative.core.ui.DataCaptureViewManager
import com.scandit.datacapture.reactnative.core.utils.Error
import com.scandit.datacapture.reactnative.core.utils.ReactNativeResult
import com.scandit.datacapture.reactnative.core.utils.reject

class ScanditDataCaptureCoreModule(
    reactContext: ReactApplicationContext,
    private val coreModule: CoreModule,
    private val dataCaptureViewManager: DataCaptureViewManager,
    private val mainThread: MainThread = DefaultMainThread.getInstance(),
    private val lastFrameData: LastFrameData = DefaultLastFrameData.getInstance()
) : ReactContextBaseJavaModule(reactContext), DeserializationLifecycleObserver.Observer {

    companion object {
        private const val VERSION_KEY = "Version"
        private const val DEFAULTS_KEY = "Defaults"

        private val ERROR_NULL_FRAME = Error(5, "Frame is null, it might've been reused already.")
    }

    private val deserializationLifecycleObserver: DeserializationLifecycleObserver =
        DefaultDeserializationLifecycleObserver.getInstance()

    init {
        coreModule.onCreate(reactContext)
        deserializationLifecycleObserver.attach(this)
    }

    override fun invalidate() {
        coreModule.onDestroy()
        deserializationLifecycleObserver.detach(this)
        super.invalidate()
    }

    override fun getName(): String = "ScanditDataCaptureCore"

    override fun getConstants(): MutableMap<String, Any> = mutableMapOf(
        VERSION_KEY to DataCaptureVersion.VERSION_STRING,
        DEFAULTS_KEY to coreModule.getDefaults()
    )

    override fun onDataCaptureViewDeserialized(dataCaptureView: DataCaptureView?) {
        dataCaptureViewManager.onDataCaptureViewDeserialized(dataCaptureView)
    }

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
        mainThread.runOnMainThread {
            coreModule.updateContextFromJson(json, ReactNativeResult(promise))
        }
    }

    @ReactMethod
    fun getLastFrame(promise: Promise) {
        lastFrameData.getLastFrameDataJson {
            if (it == null) {
                promise.reject(ERROR_NULL_FRAME)
                return@getLastFrameDataJson
            }

            promise.resolve(it)
        }
    }

    @ReactMethod
    fun getLastFrameOrNull(promise: Promise) {
        lastFrameData.getLastFrameDataJson {
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

    @ReactMethod
    fun switchCameraToDesiredState(desiredStateJson: String, promise: Promise) {
        coreModule.switchCameraToDesiredState(desiredStateJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun addModeToContext(modeJson: String, promise: Promise) {
        coreModule.addModeToContext(modeJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun removeModeFromContext(modeJson: String, promise: Promise) {
        coreModule.removeModeFromContext(modeJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun removeAllModesFromContext(promise: Promise) {
        coreModule.removeAllModes(ReactNativeResult(promise))
    }

    @ReactMethod
    fun createDataCaptureView(viewJson: String, promise: Promise) {
        coreModule.createDataCaptureView(viewJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun updateDataCaptureView(viewJson: String, promise: Promise) {
        coreModule.updateDataCaptureView(viewJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun addOverlay(overlayJson: String, promise: Promise) {
        coreModule.addOverlayToView(overlayJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun removeOverlay(overlayJson: String, promise: Promise) {
        coreModule.removeOverlayFromView(overlayJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun removeAllOverlays(promise: Promise) {
        coreModule.removeAllOverlays(ReactNativeResult(promise))
    }
}
