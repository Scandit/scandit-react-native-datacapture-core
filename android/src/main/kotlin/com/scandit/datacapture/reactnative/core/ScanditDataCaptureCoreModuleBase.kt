/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ViewGroupManager
import com.scandit.datacapture.frameworks.core.CoreModule
import com.scandit.datacapture.frameworks.core.FrameworkModule
import com.scandit.datacapture.frameworks.core.errors.ModuleNotStartedError
import com.scandit.datacapture.frameworks.core.errors.ParameterNullError
import com.scandit.datacapture.frameworks.core.locator.ServiceLocator
import com.scandit.datacapture.reactnative.core.ui.DataCaptureViewManager
import com.scandit.datacapture.reactnative.core.utils.ReactNativeMethodCall
import com.scandit.datacapture.reactnative.core.utils.ReactNativeResult

/**
 * Base implementation for the Scandit Data Capture Core module.
 * Contains all shared business logic used by both old and new architecture modules.
 */
class ScanditDataCaptureCoreModuleBase(
    private val serviceLocator: ServiceLocator<FrameworkModule>,
    private val viewManagers: Map<String, ViewGroupManager<*>>,
) {
    companion object {
        const val NAME = "ScanditDataCaptureCore"
        private const val DEFAULTS_KEY = "Defaults"

        private val VIEW_MANAGER_NULL_ERROR = Error(
            "Unable to add the DataCaptureView on Android. " +
                "The DataCaptureViewManager instance is null."
        )
    }

    fun getDefaults(): MutableMap<String, Any> {
        return mutableMapOf(
            DEFAULTS_KEY to coreModule.getDefaults()
        )
    }

    fun onInvalidate() {
        serviceLocator.remove(CoreModule::class.java.simpleName)?.onDestroy()
    }

    fun createDataCaptureView(data: ReadableMap, promise: Promise) {
        val viewJson = data.getString("viewJson") ?: return promise.reject(
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

    fun removeDataCaptureView(promise: Promise) {
        // Handled through the ViewManager
        promise.resolve(null)
    }

    /**
     * Single entry point for all Core operations.
     * Routes method calls to the appropriate command via the shared command factory.
     */
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
                ?: throw ModuleNotStartedError(NAME)
        }
}
