/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data.defaults

import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.core.ui.style.Brush
import com.scandit.datacapture.reactnative.core.data.SerializableData
import com.scandit.datacapture.reactnative.core.utils.hexString
import com.scandit.datacapture.reactnative.core.utils.writableMap
import org.json.JSONObject

data class SerializableBrushDefaults(
    private val fillColor: String?,
    private val strokeColor: String?,
    private val strokeWidth: Float?
) : SerializableData {

    constructor(brush: Brush?) : this(
        fillColor = brush?.fillColor?.hexString,
        strokeColor = brush?.strokeColor?.hexString,
        strokeWidth = brush?.strokeWidth
    )

    override fun toWritableMap(): WritableMap = writableMap {
        putString(FIELD_FILL_COLOR, fillColor)
        putString(FIELD_STROKE_COLOR, strokeColor)
        putDouble(FIELD_STROKE_WIDTH, strokeWidth?.toDouble() ?: 0.0)
    }

    fun toJSONObject(): JSONObject {
        val data = JSONObject()

        data.put(FIELD_FILL_COLOR, fillColor)
        data.put(FIELD_STROKE_COLOR, strokeColor)
        data.put(FIELD_STROKE_WIDTH, strokeWidth?.toDouble() ?: 0.0)

        return data
    }

    companion object {
        private const val FIELD_FILL_COLOR = "fillColor"
        private const val FIELD_STROKE_COLOR = "strokeColor"
        private const val FIELD_STROKE_WIDTH = "strokeWidth"
    }
}
