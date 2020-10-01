/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.reactnative.core.data.defaults

import com.facebook.react.bridge.WritableMap
import com.scandit.datacapture.reactnative.core.data.SerializableData
import com.scandit.datacapture.reactnative.core.utils.writableMap

data class SerializableRectangularViewfinderDefaults(
    private val size: String,
    private val color: String
) : SerializableData {

    override fun toWritableMap(): WritableMap = writableMap {
        putString(FIELD_SIZE, size)
        putString(FIELD_COLOR, color)
    }

    companion object {
        private const val FIELD_SIZE = "size"
        private const val FIELD_COLOR = "color"
    }
}
