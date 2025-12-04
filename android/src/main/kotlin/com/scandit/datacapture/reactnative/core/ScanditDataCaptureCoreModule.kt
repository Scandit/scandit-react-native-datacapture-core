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
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ViewGroupManager
import com.scandit.datacapture.core.capture.DataCaptureVersion
import com.scandit.datacapture.frameworks.core.CoreModule
import com.scandit.datacapture.frameworks.core.FrameworkModule
import com.scandit.datacapture.frameworks.core.errors.ModuleNotStartedError
import com.scandit.datacapture.frameworks.core.errors.ParameterNullError
import com.scandit.datacapture.frameworks.core.locator.ServiceLocator
import com.scandit.datacapture.frameworks.core.utils.DefaultMainThread
import com.scandit.datacapture.frameworks.core.utils.MainThread
import com.scandit.datacapture.reactnative.core.ui.DataCaptureViewManager
import com.scandit.datacapture.reactnative.core.utils.ReactNativeResult

class ScanditDataCaptureCoreModule(
    reactContext: ReactApplicationContext,
    private val serviceLocator: ServiceLocator<FrameworkModule>,
    private val viewManagers: Map<String, ViewGroupManager<*>>,
    private val mainThread: MainThread = DefaultMainThread.getInstance(),
) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val VERSION_KEY = "Version"
        private const val DEFAULTS_KEY = "Defaults"

        private val VIEW_MANAGER_NULL_ERROR = Error(
            "Unable to add the DataCaptureView on Android. " +
                "The DataCaptureViewManager instance is null."
        )
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
    fun subscribeContextListener() {
        coreModule.registerDataCaptureContextListener()
    }

    @ReactMethod
    fun unsubscribeContextListener() {
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
    fun registerListenerForViewEvents(viewId: Int) {
        coreModule.registerDataCaptureViewListener(viewId)
    }

    @ReactMethod
    fun unregisterListenerForViewEvents(viewId: Int) {
        coreModule.unregisterDataCaptureViewListener(viewId)
    }

    @ReactMethod
    fun contextFromJSON(readableMap: ReadableMap, promise: Promise) {
        val contextJson = readableMap.getString("contextJson") ?: return promise.reject(
            ParameterNullError("contextJson")
        )
        coreModule.createContextFromJson(contextJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun updateContextFromJSON(readableMap: ReadableMap, promise: Promise) {
        val contextJson = readableMap.getString("contextJson") ?: return promise.reject(
            ParameterNullError("contextJson")
        )
        mainThread.runOnMainThread {
            coreModule.updateContextFromJson(contextJson, ReactNativeResult(promise))
        }
    }

    @ReactMethod
    fun getFrame(readableMap: ReadableMap, promise: Promise) {
        val frameId = readableMap.getString("frameId") ?: return promise.reject(
            ParameterNullError("frameId")
        )
        coreModule.getLastFrameAsJson(frameId, ReactNativeResult(promise))
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
    fun viewPointForFramePoint(readableMap: ReadableMap, promise: Promise) {
        val pointJson = readableMap.getString("point") ?: return promise.reject(
            ParameterNullError("point")
        )

        coreModule.viewPointForFramePoint(
            readableMap.getInt("viewId"),
            pointJson,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun viewQuadrilateralForFrameQuadrilateral(readableMap: ReadableMap, promise: Promise) {
        val quadrilateralJson = readableMap.getString("quadrilateral") ?: return promise.reject(
            ParameterNullError("quadrilateral")
        )

        coreModule.viewQuadrilateralForFrameQuadrilateral(
            readableMap.getInt("viewId"),
            quadrilateralJson,
            ReactNativeResult(promise)
        )
    }

    @ReactMethod
    fun getCurrentCameraState(readableMap: ReadableMap, promise: Promise) {
        val cameraPosition = readableMap.getString("position") ?: return promise.reject(
            ParameterNullError("position")
        )
        coreModule.getCameraState(cameraPosition, ReactNativeResult(promise))
    }

    @ReactMethod
    fun isTorchAvailable(readableMap: ReadableMap, promise: Promise) {
        val cameraPosition = readableMap.getString("cameraPosition") ?: return promise.reject(
            ParameterNullError("cameraPosition")
        )
        coreModule.isTorchAvailable(cameraPosition, ReactNativeResult(promise))
    }

    @ReactMethod
    fun switchCameraToDesiredState(readableMap: ReadableMap, promise: Promise) {
        val desiredStateJson = readableMap.getString("desiredStateJson") ?: return promise.reject(
            ParameterNullError("desiredStateJson")
        )
        coreModule.switchCameraToDesiredState(desiredStateJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun addModeToContext(readableMap: ReadableMap, promise: Promise) {
        val modeJson = readableMap.getString("modeJson") ?: return promise.reject(
            ParameterNullError("modeJson")
        )
        coreModule.addModeToContext(modeJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun removeModeFromContext(readableMap: ReadableMap, promise: Promise) {
        val modeJson = readableMap.getString("modeJson") ?: return promise.reject(
            ParameterNullError("modeJson")
        )
        coreModule.removeModeFromContext(modeJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun removeAllModes(promise: Promise) {
        coreModule.removeAllModes(ReactNativeResult(promise))
    }

    @ReactMethod
    fun createDataCaptureView(viewJson: String, promise: Promise) {
        val viewManager = viewManagers[DataCaptureViewManager::class.java.name] as?
            DataCaptureViewManager
        if (viewManager == null) {
            promise.reject(VIEW_MANAGER_NULL_ERROR)
            return
        }

        viewManager.createDataCaptureView(viewJson, promise)
    }

    @ReactMethod
    fun updateDataCaptureView(viewJson: String, promise: Promise) {
        coreModule.updateDataCaptureView(viewJson, ReactNativeResult(promise))
    }

    @ReactMethod
    fun getOpenSourceSoftwareLicenseInfo(promise: Promise) {
        coreModule.getOpenSourceSoftwareLicenseInfo(ReactNativeResult(promise))
    }

    @ReactMethod
    fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    private val coreModule: CoreModule
        get() {
            return serviceLocator.resolve(CoreModule::class.java.name) as? CoreModule?
                ?: throw ModuleNotStartedError(ScanditDataCaptureCoreModule::class.java.simpleName)
        }
}
