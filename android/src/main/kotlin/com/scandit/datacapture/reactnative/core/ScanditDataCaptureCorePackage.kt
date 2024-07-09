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
import com.scandit.datacapture.reactnative.core.ui.DataCaptureViewManager
import com.scandit.datacapture.reactnative.core.utils.ReactNativeEventEmitter

class ScanditDataCaptureCorePackage : ReactPackage {
    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): MutableList<NativeModule> =
        mutableListOf(ScanditDataCaptureCoreModule(reactContext, getCoreModule(reactContext)))

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): MutableList<ViewManager<*, *>> = mutableListOf(DataCaptureViewManager())

    private fun getCoreModule(reactContext: ReactApplicationContext): CoreModule {
        val eventEmitter: Emitter = ReactNativeEventEmitter(reactContext)
        return CoreModule(
            FrameworksFrameSourceListener(
                eventEmitter
            ),
            FrameworksDataCaptureContextListener(eventEmitter),
            FrameworksDataCaptureViewListener(eventEmitter)
        )
    }
}
