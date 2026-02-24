/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.utils

import com.facebook.react.bridge.*
import com.scandit.datacapture.core.common.geometry.MeasureUnit
import com.scandit.datacapture.core.common.geometry.PointWithUnit
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
