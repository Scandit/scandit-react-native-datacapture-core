/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2025- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule

abstract class ScanditReactPackageBase : ReactPackage {
    protected val isNewArchitectureEnabled: Boolean = false
    protected abstract fun getModuleClasses(): List<Class<out NativeModule>>

    @Suppress("EmptyFunctionBlock")
    fun clearCache() {
        // No-op: old architecture has no module cache.
    }
}
