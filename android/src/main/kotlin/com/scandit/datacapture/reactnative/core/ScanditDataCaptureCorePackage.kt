/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */
package com.scandit.datacapture.reactnative.core

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManager
import com.scandit.datacapture.frameworks.core.CoreModule
import com.scandit.datacapture.frameworks.core.events.Emitter
import com.scandit.datacapture.frameworks.core.lifecycle.ActivityLifecycleDispatcher
import com.scandit.datacapture.frameworks.core.lifecycle.DefaultActivityLifecycle
import com.scandit.datacapture.frameworks.core.locator.DefaultServiceLocator
import com.scandit.datacapture.reactnative.core.ui.DataCaptureViewManager
import com.scandit.datacapture.reactnative.core.utils.ReactNativeEventEmitter
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.locks.ReentrantLock

class ScanditDataCaptureCorePackage : ReactPackage {
    private val serviceLocator = DefaultServiceLocator.getInstance()

    private val lifecycleDispatcher: ActivityLifecycleDispatcher =
        DefaultActivityLifecycle.getInstance()

    private val viewManagers: MutableMap<String, ViewGroupManager<*>> = ConcurrentHashMap()

    private val lifecycleListener = object : LifecycleEventListener {
        override fun onHostResume() {
            lifecycleDispatcher.dispatchOnResume()
        }

        override fun onHostPause() {
            lifecycleDispatcher.dispatchOnPause()
        }

        override fun onHostDestroy() {
            lifecycleDispatcher.dispatchOnDestroy()
        }
    }

    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): MutableList<NativeModule> {
        // Register to receive lifecycle events
        reactContext.addLifecycleEventListener(lifecycleListener)

        setupSharedModule(reactContext)
        return mutableListOf(
            ScanditDataCaptureCoreModule(
                reactContext,
                serviceLocator,
                viewManagers,
            )
        )
    }

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): MutableList<ViewManager<*, *>> {
        // Clear existing instances of previously cached viewMangers
        viewManagers.clear()

        val dcViewManager = DataCaptureViewManager(serviceLocator)
        // Here we register the ViewManagers and allow the different module to access them by
        // using the name.
        viewManagers[DataCaptureViewManager::class.java.name] = dcViewManager

        return mutableListOf(dcViewManager)
    }

    private fun setupSharedModule(reactContext: ReactApplicationContext) {
        lock.lock()
        try {
            val eventEmitter: Emitter = ReactNativeEventEmitter(reactContext)
            val coreModule = CoreModule.create(eventEmitter)
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
