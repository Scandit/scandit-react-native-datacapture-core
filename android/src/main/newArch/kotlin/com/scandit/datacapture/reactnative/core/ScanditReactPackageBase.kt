/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
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
 * Supports incremental TurboModule migration:
 * - Modules extending Codegen specs (*Spec) → isTurboModule = true (JSI)
 * - Legacy modules (ReactContextBaseJavaModule) → isTurboModule = false (Interop Layer)
 *
 * The isTurboModule flag is auto-detected by checking if the module's superclass
 * name contains "Spec" (the Codegen naming convention).
 *
 * To migrate a module to TurboModule:
 * 1. Create TypeScript spec: ts/NativeScanditDataCapture{Module}.ts
 * 2. Add codegenConfig to package.json
 * 3. Create newArch module extending the generated spec
 * 4. The base class will automatically detect and use JSI
 */
abstract class ScanditReactPackageBase : TurboReactPackage() {
    @Suppress("unused")
    protected val isNewArchitectureEnabled: Boolean = true

    // Cache modules per context to avoid recreating them
    private val moduleCache = ConcurrentHashMap<String, ConcurrentHashMap<String, NativeModule>>()

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        // Get or create context-specific cache
        val contextId = System.identityHashCode(reactContext).toString()

        // Only clear cache if context changed and we have stale entries
        synchronized(moduleCache) {
            if (!moduleCache.containsKey(contextId) && moduleCache.isNotEmpty()) {
                moduleCache.clear()
            }
        }

        val contextCache = moduleCache.getOrPut(contextId) {
            val preCreatedModules = createNativeModules(reactContext)
            val cache = ConcurrentHashMap<String, NativeModule>()
            preCreatedModules.forEach { module ->
                cache[module.name] = module
            }
            cache
        }

        // Return cached module if available
        val cachedModule = contextCache[name]
        if (cachedModule != null) {
            return cachedModule
        }

        // Fallback: recreate modules if not found (handles edge cases)
        val preCreatedModules = createNativeModules(reactContext)
        val module = preCreatedModules.find { it.name == name }
        if (module != null) {
            contextCache[name] = module
            return module
        }

        return null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleInfoMap = mutableMapOf<String, ReactModuleInfo>()
            // Extract module info from @ReactModule annotations
            getModuleClasses().forEach { moduleClass ->
                val annotation = moduleClass.getAnnotation(ReactModule::class.java)
                if (annotation != null) {
                    // Check if this is a TurboModule (extends generated spec base class)
                    val isTurboModule = try {
                        val superclass = moduleClass.superclass
                        superclass != null && superclass.name.contains("Spec")
                    } catch (e: Exception) {
                        false
                    }

                    moduleInfoMap[annotation.name] = ReactModuleInfo(
                        annotation.name,
                        className = moduleClass.name,
                        canOverrideExistingModule = true,
                        needsEagerInit = true,
                        hasConstants = true,
                        isCxxModule = false,
                        isTurboModule = isTurboModule // true for codegen TurboModules
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
