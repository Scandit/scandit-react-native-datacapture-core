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
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ViewGroupManager
import com.scandit.datacapture.core.capture.DataCaptureVersion
import com.scandit.datacapture.frameworks.core.CoreModule
import com.scandit.datacapture.frameworks.core.FrameworkModule
import com.scandit.datacapture.frameworks.core.errors.ModuleNotStartedError
import com.scandit.datacapture.frameworks.core.errors.ParameterNullError
import com.scandit.datacapture.frameworks.core.locator.ServiceLocator
import com.scandit.datacapture.reactnative.core.ui.DataCaptureViewManager
import com.scandit.datacapture.reactnative.core.utils.ReactNativeMethodCall
import com.scandit.datacapture.reactnative.core.utils.ReactNativeResult

@ReactModule(name = ScanditDataCaptureCoreModule.NAME)
open class ScanditDataCaptureCoreModule(
    reactContext: ReactApplicationContext,
    private val serviceLocator: ServiceLocator<FrameworkModule>,
    private val viewManagers: Map<String, ViewGroupManager<*>>,
) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "ScanditDataCaptureCore"
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

    override fun getName(): String = NAME

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            VERSION_KEY to DataCaptureVersion.VERSION_STRING,
            DEFAULTS_KEY to coreModule.getDefaults()
        )
    }

    @ReactMethod
    fun createDataCaptureView(readableMap: ReadableMap, promise: Promise) {
        val viewJson = readableMap.getString("viewJson") ?: return promise.reject(
            ParameterNullError("viewJson")
        )
        val viewManager = viewManagers[DataCaptureViewManager::class.java.simpleName] as?
            DataCaptureViewManager
        if (viewManager == null) {
            promise.reject(VIEW_MANAGER_NULL_ERROR)
            return
        }

        viewManager.createDataCaptureView(viewJson, promise)
    }

    @ReactMethod
    fun removeDataCaptureView(
        @Suppress("unused") readableMap: ReadableMap,
        promise: Promise
    ) {
        // Handled through the ViewManager
        promise.resolve(null)
    }

    @ReactMethod
    fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    /**
     * Single entry point for all Core operations.
     * Routes method calls to the appropriate command via the shared command factory.
     */
    @ReactMethod
    fun executeCore(data: ReadableMap, promise: Promise) {
        val handled = coreModule.execute(
            ReactNativeMethodCall(data),
            ReactNativeResult(promise),
            coreModule
        )
        if (!handled) {
            val methodName = data.getString("methodName") ?: "unknown"
            promise.reject(
                "METHOD_NOT_FOUND",
                "Unknown Core method: $methodName"
            )
        }
    }

    private val coreModule: CoreModule
        get() {
            return serviceLocator.resolve(CoreModule::class.java.simpleName) as? CoreModule?
                ?: throw ModuleNotStartedError(ScanditDataCaptureCoreModule::class.java.simpleName)
        }
}
