/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2025- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import java.util.concurrent.ConcurrentHashMap

/**
 * Base class for React Native packages in the new architecture.
 *
 * This uses the Interop Layer approach:
 * - Legacy modules (ReactContextBaseJavaModule) work in new architecture
 * - Modules are registered with @ReactModule annotation
 * - isTurboModule = false uses React Native's Interop bridge adapter
 * - No JSI/Codegen required
 * - Compatible with both architectures and bridgeless mode
 */
abstract class ScanditReactPackageBase : TurboReactPackage() {
    @Suppress("unused")
    protected val isNewArchitectureEnabled: Boolean = true

    // Cache modules per context to avoid recreating them
    private val moduleCache = ConcurrentHashMap<String, ConcurrentHashMap<String, NativeModule>>()

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        // Get or create context-specific cache
        val contextId = System.identityHashCode(reactContext).toString()

        val contextCache = moduleCache.getOrPut(contextId) {
            // Pre-populate cache with modules from createNativeModules()
            val preCreatedModules = createNativeModules(reactContext)
            val cache = ConcurrentHashMap<String, NativeModule>()
            preCreatedModules.forEach { module ->
                cache[module.name] = module
            }
            cache
        }

        return contextCache[name]
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleInfoMap = mutableMapOf<String, ReactModuleInfo>()

            // Extract module info from @ReactModule annotations
            getModuleClasses().forEach { moduleClass ->
                val annotation = moduleClass.getAnnotation(ReactModule::class.java)
                if (annotation != null) {
                    moduleInfoMap[annotation.name] = ReactModuleInfo(
                        annotation.name,
                        className = moduleClass.name,
                        canOverrideExistingModule = true,
                        needsEagerInit = true,
                        hasConstants = true,
                        isCxxModule = false,
                        isTurboModule = false // false for Interop layer
                    )
                }
            }

            moduleInfoMap
        }
    }

    /**
     * Subclasses must override this to provide the list of module classes
     * they want to register.
     */
    protected abstract fun getModuleClasses(): List<Class<out NativeModule>>

    fun clearCache() {
        moduleCache.clear()
    }
}
