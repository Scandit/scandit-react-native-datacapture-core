/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2025- Scandit AG. All rights reserved.
 */
package com.scandit.datacapture.reactnative.core.utils

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.scandit.datacapture.frameworks.core.errors.ParameterNullError
import com.scandit.datacapture.frameworks.core.method.FrameworksMethodCall

class ReactNativeMethodCall(
    private val readableMap: ReadableMap
) : FrameworksMethodCall {

    override val method: String
        get() = readableMap.getString("methodName") ?: "unknow"

    @Suppress("UNCHECKED_CAST")
    override fun <T> argument(key: String): T {
        if (!readableMap.hasKey(key)) {
            throw ParameterNullError(key)
        }

        return when (readableMap.getType(key)) {
            ReadableType.Null -> return null as T
            ReadableType.Boolean -> readableMap.getBoolean(key) as T
            ReadableType.Number -> {
                val doubleValue = readableMap.getDouble(key)
                try {
                    return when {
                        doubleValue % 1.0 == 0.0 &&
                            doubleValue >= Int.MIN_VALUE &&
                            doubleValue <= Int.MAX_VALUE ->
                            doubleValue.toInt() as? T ?: doubleValue as T

                        doubleValue % 1.0 == 0.0 ->
                            doubleValue.toLong() as? T ?: doubleValue as T

                        else -> doubleValue as T
                    }
                } catch (e: ClassCastException) {
                    doubleValue as T
                }
            }
            ReadableType.String -> readableMap.getString(key) as T
            ReadableType.Map -> readableMap.getMap(key) as T
            ReadableType.Array -> readableMap.getArray(key) as T
        }
    }

    override fun hasArgument(key: String): Boolean =
        readableMap.hasKey(key)

    override fun arguments(): Map<String, Any?> = readableMap.toHashMap()
}
