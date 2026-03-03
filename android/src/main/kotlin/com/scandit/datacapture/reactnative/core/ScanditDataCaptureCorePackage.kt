/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */
package com.scandit.datacapture.reactnative.core

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.scandit.datacapture.frameworks.core.CoreModule
import com.scandit.datacapture.frameworks.core.events.Emitter
import com.scandit.datacapture.frameworks.core.listeners.FrameworksDataCaptureContextListener
import com.scandit.datacapture.frameworks.core.listeners.FrameworksDataCaptureViewListener
import com.scandit.datacapture.frameworks.core.listeners.FrameworksFrameSourceListener
import com.scandit.datacapture.frameworks.core.locator.DefaultServiceLocator
import com.scandit.datacapture.reactnative.core.ui.DataCaptureViewManager
import com.scandit.datacapture.reactnative.core.utils.ReactNativeEventEmitter
import java.util.concurrent.locks.ReentrantLock

class ScanditDataCaptureCorePackage : ReactPackage {
    private val serviceLocator = DefaultServiceLocator.getInstance()

    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): MutableList<NativeModule> {
        setupSharedModule(reactContext)
        return mutableListOf(
            ScanditDataCaptureCoreModule(
                reactContext,
                serviceLocator,
            )
        )
    }

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): MutableList<ViewManager<*, *>> = mutableListOf(DataCaptureViewManager(serviceLocator))

    private fun setupSharedModule(reactContext: ReactApplicationContext) {
        lock.lock()
        try {
            val eventEmitter: Emitter = ReactNativeEventEmitter(reactContext)
            val coreModule = CoreModule.create(
                FrameworksFrameSourceListener(eventEmitter),
                FrameworksDataCaptureContextListener(eventEmitter),
                FrameworksDataCaptureViewListener(eventEmitter)
            )
            coreModule.onCreate(reactContext)
            serviceLocator.register(coreModule)
        } finally {
            lock.unlock()
        }
    }

    companion object {
        private val lock: ReentrantLock = ReentrantLock()
    }
}
