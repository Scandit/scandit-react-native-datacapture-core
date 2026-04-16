/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.utils

import com.facebook.react.bridge.*
import com.scandit.datacapture.core.common.geometry.MeasureUnit
import com.scandit.datacapture.core.common.geometry.PointWithUnit
import com.scandit.datacapture.frameworks.core.utils.DefaultFrameworksLog
import com.scandit.datacapture.reactnative.core.data.SerializableData
import java.util.*

val POINT_WITH_UNIT_ZERO: PointWithUnit = PointWithUnit(0f, 0f, MeasureUnit.PIXEL)

inline fun writableMap(builder: WritableMap.() -> Unit): WritableMap =
    Arguments.createMap().apply(builder)

fun WritableMap.putData(key: String, data: SerializableData) {
    putMap(key, data.toWritableMap())
}

inline fun <reified T : JavaScriptModule> ReactApplicationContext.getJSModule(): T =
    getJSModule(T::class.java)

val ReadableMap.viewId: Int
    get() = this.getInt("viewId")

val ReadableMap.modeId: Int
    get() = this.getInt("modeId")

fun ReadableMap.getSafeLong(key: String): Long? {
    if (!hasKey(key) || isNull(key)) return null

    return try {
        when (getType(key)) {
            ReadableType.Number -> {
                val doubleValue = getDouble(key)
                val longValue = doubleValue.toLong()
                require(doubleValue == longValue.toDouble())
                longValue
            }

            ReadableType.String ->
                getString(key)?.toLongOrNull()
                    ?: throw IllegalArgumentException(
                        "Value for '$key' is not a valid long string."
                    )

            else -> throw IllegalArgumentException(
                "Unsupported type for '$key'. Expected number or string."
            )
        }
    } catch (e: Exception) {
        DefaultFrameworksLog.getInstance()
            .error("Failed to parse long for key '$key': ${e.message}", e)
        return null
    }
}
