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
import com.facebook.react.uimanager.ViewGroupManager
import com.scandit.datacapture.core.capture.DataCaptureVersion
import com.scandit.datacapture.frameworks.core.CoreModule
import com.scandit.datacapture.frameworks.core.FrameworkModule
import com.scandit.datacapture.frameworks.core.errors.ModuleNotStartedError
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
    fun getFrame(frameId: String, promise: Promise) {
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

    private val coreModule: CoreModule
        get() {
            return serviceLocator.resolve(CoreModule::class.java.name) as? CoreModule?
                ?: throw ModuleNotStartedError(ScanditDataCaptureCoreModule::class.java.simpleName)
        }
}
