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
import com.scandit.datacapture.frameworks.core.CoreModule
import com.scandit.datacapture.frameworks.core.FrameworkModule
import com.scandit.datacapture.frameworks.core.locator.ServiceLocator
import com.scandit.datacapture.reactnative.core.utils.ReactNativeEventEmitter

@ReactModule(name = ScanditDataCaptureCoreModuleBase.NAME)
class ScanditDataCaptureCoreModule(
    reactContext: ReactApplicationContext,
    private val serviceLocator: ServiceLocator<FrameworkModule>,
    viewManagers: Map<String, ViewGroupManager<*>>,
) : ReactContextBaseJavaModule(reactContext) {

    private val moduleBase = ScanditDataCaptureCoreModuleBase(serviceLocator, viewManagers)

    init {
        // Set up the shared CoreModule with bridge-based event emitter
        setupSharedModule(reactContext)
    }

    companion object {
        const val NAME = ScanditDataCaptureCoreModuleBase.NAME
    }

    override fun getName(): String = NAME

    override fun getConstants(): MutableMap<String, Any> = moduleBase.getDefaults()

    override fun invalidate() {
        moduleBase.onInvalidate()
        super.invalidate()
    }

    private fun setupSharedModule(reactContext: ReactApplicationContext) {
        // Check if CoreModule is already registered to avoid duplicate initialization
        val existingModule = serviceLocator.resolve(CoreModule::class.java.simpleName)
        if (existingModule != null) {
            return
        }

        // Create emitter with bridge-based RCTDeviceEventEmitter
        val emitter = ReactNativeEventEmitter(reactContext)

        val coreModule = CoreModule.create(emitter)
        coreModule.onCreate(reactContext)
        serviceLocator.register(coreModule)
    }

    @ReactMethod
    fun createDataCaptureView(readableMap: ReadableMap, promise: Promise) =
        moduleBase.createDataCaptureView(readableMap, promise)

    @ReactMethod
    fun removeDataCaptureView(
        @Suppress("unused") readableMap: ReadableMap,
        promise: Promise
    ) = moduleBase.removeDataCaptureView(promise)

    @ReactMethod
    fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun executeCore(data: ReadableMap, promise: Promise) =
        moduleBase.executeCore(data, promise)
}
